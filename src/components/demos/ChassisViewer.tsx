import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../hooks/useTheme';
import styles from './ChassisViewer.module.css';

const MODEL_URL = '/models/chassis.glb';
const IDLE_DELAY = 2500;

function Frame() {
  const { scene } = useGLTF(MODEL_URL);

  const model = useMemo(() => {
    const root = scene.clone(true);

    const steel = new THREE.MeshStandardMaterial({
      color: '#2b2f35',
      metalness: 0.28,
      roughness: 0.46,
    });

    root.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = steel;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return root;
  }, [scene]);

  return <primitive object={model} />;
}

useGLTF.preload(MODEL_URL);

function Lighting({ dark }: { dark: boolean }) {
  return (
    <>
      <hemisphereLight
        args={dark ? ['#4a5258', '#0c0e10', 1.4] : ['#ffffff', '#b3d2e6', 1.7]}
      />

      <directionalLight
        position={[4, 6, 4]}
        intensity={dark ? 2.6 : 2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />

      <directionalLight position={[-5, 2, -2]} intensity={0.8} />

      <directionalLight position={[0, 3, -6]} intensity={1.1} color="#ff6a1a" />
    </>
  );
}

export default function ChassisViewer() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
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
        <color attach="background" args={[dark ? '#14171a' : '#e4e5de']} />
        <Lighting dark={dark} />

        <Suspense fallback={null}>
          <Center>
            <Frame />
          </Center>

          <ContactShadows
            position={[0, -0.62, 0]}
            opacity={dark ? 0.55 : 0.32}
            scale={6}
            blur={2.4}
            far={2}
            resolution={512}
            color={dark ? '#000000' : '#1b3242'}
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
