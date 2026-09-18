import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import styles from './ChassisViewer.module.css';

const MODEL_URL = '/models/chassis.glb';
const IDLE_DELAY = 2500;

const HULL_MATERIAL = new THREE.MeshBasicMaterial({ color: '#020a05' });
const EDGE_MATERIAL = new THREE.LineBasicMaterial({ color: '#3ef07c' });

function Frame() {
  const { scene } = useGLTF(MODEL_URL);

  const model = useMemo(() => {
    const root = scene.clone(true);

    const meshes: THREE.Mesh[] = [];
    root.traverse((child) => {
      if (child instanceof THREE.Mesh) meshes.push(child);
    });

    meshes.forEach((mesh) => {
      mesh.material = HULL_MATERIAL;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const edges = new THREE.EdgesGeometry(mesh.geometry, 25);
      mesh.add(new THREE.LineSegments(edges, EDGE_MATERIAL));
    });

    return root;
  }, [scene]);

  return <primitive object={model} />;
}

useGLTF.preload(MODEL_URL);

function Lighting() {
  return (
    <>
      <hemisphereLight args={['#0f3a1e', '#010401', 1.2]} />
      <directionalLight position={[4, 6, 4]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
    </>
  );
}

export default function ChassisViewer() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [engaged, setEngaged] = useState(false);
  const idleTimer = useRef<number | undefined>(undefined);

  const hostRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden,
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const awake = onScreen && tabVisible;

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => () => window.clearTimeout(idleTimer.current), []);

  const handleStart = () => {
    window.clearTimeout(idleTimer.current);
    setAutoRotate(false);
  };

  const handleEnd = () => {
    window.clearTimeout(idleTimer.current);
    if (reducedMotion) return;
    idleTimer.current = window.setTimeout(() => setAutoRotate(true), IDLE_DELAY);
  };

  return (
    <div
      ref={hostRef}
      className={styles.viewer}
      onPointerDown={() => setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
    >
      <Canvas
        shadows="percentage"
        dpr={[1, 2]}
        camera={{ position: [2.6, 1.5, 2.8], fov: 40 }}
        gl={{ antialias: true }}
        frameloop={awake && (autoRotate || engaged) ? 'always' : 'demand'}
      >
        <color attach="background" args={['#04220f']} />
        <Lighting />

        <Suspense fallback={null}>
          <Center>
            <Frame />
          </Center>

          <ContactShadows
            position={[0, -0.62, 0]}
            opacity={0.6}
            scale={6}
            blur={2.4}
            far={2}
            resolution={512}
            color="#000000"
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={engaged}
          autoRotate={autoRotate && !reducedMotion}
          autoRotateSpeed={0.55}
          minDistance={1.6}
          maxDistance={7}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 2 + 0.25}
          onStart={handleStart}
          onEnd={handleEnd}
        />
      </Canvas>

      <p className={styles.hint} aria-hidden="true">
        {engaged ? 'Scroll to zoom' : 'Click and drag to orbit'}
      </p>
    </div>
  );
}
