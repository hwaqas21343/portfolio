# Portfolio

Personal portfolio site, Vite + React 19 + TypeScript, replacing the previous
Framer site.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build to dist/
npm run preview  # serve the production build locally
npm run lint     # oxlint
```

## Layout

```
public/
  models/          .glb models for the 3D viewers
  media/uav/       renders, contour plots and charts for the UAV page
src/
  data/
    projects.ts    the four projects, titles, blurbs, stack, demo mode
    contact.ts     email, links, CV path
  components/      Layout, Nav, Footer + the shared page primitives
  pages/
    projects/      one file per project detail page
  styles/
    global.css     design tokens, reset, shared primitives
```

Styling is plain CSS Modules over a small set of custom properties in
`global.css`, no UI framework, deliberately. One accent colour
(`--accent`), a neutral ramp, and a spacing scale; everything composes from
those.

## Adding to a project page

Each detail page uses the shared `ProjectPage` shell, which fixes the reading
order: plain-language summary → demo or media → technical deep dive. Interactive
demos drop into `DemoFrame` as children; while a demo is absent the frame shows
a placeholder at the right size, so the layout doesn't shift when it arrives.

## Build stages

1. ✅ Scaffold, routing, layout, placeholder pages
2. ✅ Formula Student chassis viewer (`useGLTF` + OrbitControls, idle
   auto-rotate, `public/models/chassis.glb`)
3. ⬜ ADCS interactive demo (React Three Fiber, PID ported from MATLAB)
4. ⬜ CAGE radar sweep demo (2D canvas)
5. ⬜ UAV page, static renders, plots and write-up

## Regenerating the chassis model

`public/models/chassis.glb` is derived from the team's full car assembly in
OneDrive, a raw SOLIDWORKS glTF export of the entire car (~7.9M triangles, 681
meshes, ~250 loose `.bin` files, 91.8 MB). The frame is one node inside it:

```bash
npm run model:chassis -- "<path to Final_car_assembly.gltf>"
```

The script slices the glTF JSON down to the frame's subtree *before* loading any
buffers, so it reads 1.8 MB instead of 91.8 MB, and tolerates the fact that the
source export is incomplete (it references `.bin` files that aren't on disk).
Output: 43,816 triangles, one mesh, one draw call, 1.07 MB (552 KB gzipped).

If the frame is ever re-exported under a different name, update `FRAME_NODE` in
[`scripts/extract-chassis.mjs`](scripts/extract-chassis.mjs), it currently
matches on `Chassis v9.6.7`. Note the node is named `...firewall_part...` in the
source; that's misleading, it is the full space frame with the firewall attached.

## Before deploying

- Drop the CV in as `public/cv.pdf` and set `cvAvailable: true` in
  `src/data/contact.ts`.
- Fill in the `[Placeholder]` copy on About and in each project's deep-dive.
- **SPA routing:** the app uses client-side routes, so the host must rewrite
  unknown paths to `index.html` or a refresh on `/projects/cage` will 404.
  Netlify: add `public/_redirects` containing `/*  /index.html  200`.
  Vercel: add `vercel.json` with a catch-all rewrite. GitHub Pages needs a
  `404.html` copy of `index.html`.
