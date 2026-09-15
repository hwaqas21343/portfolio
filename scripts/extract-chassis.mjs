// Extract the Formula Student chassis frame into public/models/chassis.glb
// Usage: node scripts/extract-chassis.mjs "<path to Final_car_assembly.gltf>"

import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, flatten, join } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { dirname, resolve, join as joinPath } from 'node:path';

const FRAME_NODE = 'Chassis v9.6.7';
const OUT = resolve('public/models/chassis.glb');

const src = process.argv[2];
if (!src) {
  console.error('Usage: node scripts/extract-chassis.mjs <source.gltf>');
  process.exit(1);
}

const srcDir = dirname(resolve(src));
const json = JSON.parse(await readFile(src, 'utf8'));

// locate the frame

const frameIdx = json.nodes.findIndex((n) =>
  (n.name ?? '').includes(FRAME_NODE),
);
if (frameIdx < 0) {
  console.error(`No node matching "${FRAME_NODE}". Nodes containing "chassis":`);
  json.nodes.forEach((n, i) => {
    if (/chassis/i.test(n.name ?? '')) console.error(`  [${i}] ${n.name}`);
  });
  process.exit(1);
}
console.log(`Found [${frameIdx}] ${json.nodes[frameIdx].name}`);

// bake the world transform

const ident = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const mul = (a, b) => {
  const o = new Array(16).fill(0);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
  return o;
};
const localMatrix = (nd) => {
  if (nd.matrix) return nd.matrix.slice();
  const [x, y, z, w] = nd.rotation ?? [0, 0, 0, 1];
  const [sx, sy, sz] = nd.scale ?? [1, 1, 1];
  const [tx, ty, tz] = nd.translation ?? [0, 0, 0];
  const x2 = x + x, y2 = y + y, z2 = z + z;
  const xx = x * x2, xy = x * y2, xz = x * z2;
  const yy = y * y2, yz = y * z2, zz = z * z2;
  const wx = w * x2, wy = w * y2, wz = w * z2;
  return [
    (1 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0,
    (xy - wz) * sy, (1 - (xx + zz)) * sy, (yz + wx) * sy, 0,
    (xz + wy) * sz, (yz - wx) * sz, (1 - (xx + yy)) * sz, 0,
    tx, ty, tz, 1,
  ];
};

const parentOf = new Map();
json.nodes.forEach((nd, i) =>
  (nd.children ?? []).forEach((c) => parentOf.set(c, i)),
);

let worldMatrix = ident();
for (let cur = frameIdx; cur !== undefined; cur = parentOf.get(cur)) {
  worldMatrix = mul(localMatrix(json.nodes[cur]), worldMatrix);
}

// slice the JSON down to the frame's subtree

const keepNodes = [];
(function collect(i) {
  keepNodes.push(i);
  for (const c of json.nodes[i].children ?? []) collect(c);
})(frameIdx);

const remap = (list) => {
  const map = new Map();
  list.forEach((old, i) => map.set(old, i));
  return map;
};

const meshIds = [...new Set(keepNodes.map((i) => json.nodes[i].mesh).filter((m) => m != null))];
const accessorIds = new Set();
const materialIds = new Set();
for (const m of meshIds) {
  for (const p of json.meshes[m].primitives ?? []) {
    if (p.indices != null) accessorIds.add(p.indices);
    for (const a of Object.values(p.attributes ?? {})) accessorIds.add(a);
    if (p.material != null) materialIds.add(p.material);
  }
}
const accessorList = [...accessorIds].sort((a, b) => a - b);
const viewIds = [...new Set(accessorList.map((a) => json.accessors[a].bufferView).filter((v) => v != null))].sort((a, b) => a - b);
const bufferIds = [...new Set(viewIds.map((v) => json.bufferViews[v].buffer))].sort((a, b) => a - b);

const nodeMap = remap(keepNodes);
const meshMap = remap(meshIds);
const accMap = remap(accessorList);
const viewMap = remap(viewIds);
const bufMap = remap(bufferIds);
const matList = [...materialIds].sort((a, b) => a - b);
const matMap = remap(matList);

const sliced = {
  asset: json.asset,
  scene: 0,
  scenes: [{ nodes: [nodeMap.get(frameIdx)] }],
  nodes: keepNodes.map((i) => {
    const nd = { ...json.nodes[i] };
    delete nd.translation;
    delete nd.rotation;
    delete nd.scale;
    delete nd.matrix;
    delete nd.camera;
    if (i === frameIdx) nd.matrix = worldMatrix;
    else if (json.nodes[i].matrix) nd.matrix = json.nodes[i].matrix;
    else {
      if (json.nodes[i].translation) nd.translation = json.nodes[i].translation;
      if (json.nodes[i].rotation) nd.rotation = json.nodes[i].rotation;
      if (json.nodes[i].scale) nd.scale = json.nodes[i].scale;
    }
    if (nd.children) nd.children = nd.children.map((c) => nodeMap.get(c));
    if (nd.mesh != null) nd.mesh = meshMap.get(nd.mesh);
    return nd;
  }),
  meshes: meshIds.map((m) => ({
    ...json.meshes[m],
    primitives: json.meshes[m].primitives.map((p) => {
      const out = { ...p };
      if (p.indices != null) out.indices = accMap.get(p.indices);
      out.attributes = Object.fromEntries(
        Object.entries(p.attributes ?? {}).map(([k, v]) => [k, accMap.get(v)]),
      );
      if (p.material != null) out.material = matMap.get(p.material);
      return out;
    }),
  })),
  accessors: accessorList.map((a) => {
    const out = { ...json.accessors[a] };
    if (out.bufferView != null) out.bufferView = viewMap.get(out.bufferView);
    return out;
  }),
  bufferViews: viewIds.map((v) => ({
    ...json.bufferViews[v],
    buffer: bufMap.get(json.bufferViews[v].buffer),
  })),
  buffers: bufferIds.map((b) => json.buffers[b]),
  materials: matList.map((m) => json.materials[m]),
};
if (json.extensionsUsed) sliced.extensionsUsed = json.extensionsUsed;
if (json.extensionsRequired) sliced.extensionsRequired = json.extensionsRequired;

console.log(
  `Sliced: ${sliced.nodes.length} node(s), ${sliced.meshes.length} mesh(es), ` +
    `${sliced.buffers.length} buffer(s), ${sliced.materials.length} material(s)`,
);

// load only the buffers that survived

const resources = {};
for (const buf of sliced.buffers) {
  if (!buf.uri || buf.uri.startsWith('data:')) continue;
  const file = joinPath(srcDir, decodeURIComponent(buf.uri));
  resources[buf.uri] = new Uint8Array(await readFile(file));
}
console.log(`Loaded ${Object.keys(resources).length} buffer file(s)`);

// process and write

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.encoder': await draco3d.createEncoderModule(),
    'draco3d.decoder': await draco3d.createDecoderModule(),
  });

const doc = await io.readJSON({ json: sliced, resources });

await doc.transform(
  flatten(),
  dedup(),
  join(),
  weld(),
  prune(),
);

const root = doc.getRoot();
const meshes = root.listMeshes();
let tris = 0;
let prims = 0;
for (const mesh of meshes) {
  for (const prim of mesh.listPrimitives()) {
    prims++;
    const idx = prim.getIndices();
    const pos = prim.getAttribute('POSITION');
    tris += (idx ? idx.getCount() : (pos?.getCount() ?? 0)) / 3;
  }
}

console.log(
  `Processed: ${meshes.length} mesh(es), ${prims} primitive(s), ` +
    `${Math.round(tris).toLocaleString()} triangles, ` +
    `${root.listMaterials().length} material(s)`,
);

await mkdir(dirname(OUT), { recursive: true });
await io.write(OUT, doc);

const { size } = await stat(OUT);
console.log(`Wrote ${OUT}, ${(size / 1024 / 1024).toFixed(2)} MB`);
