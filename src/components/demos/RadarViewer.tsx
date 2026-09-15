import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import styles from './RadarViewer.module.css';

const SIZE = 400;
const CENTER = SIZE / 2;
const FIELD_R = 172;
const HUB_R = 16;
const FIELD_METRES = 350;
const SWEEP_SPEED = 55;
const TRAIL_SPAN = 46;
const TRAIL_STEPS = 28;
const UNIT_COUNT = 3;
const SECTOR_WIDTH = 150;
const HOLD_MS = 1100;
const FADE_MS = 500;

interface Target {
  id: number;
  label: number;
  x: number;
  y: number;
  bearing: number;
  rangeMetres: number;
  status: 'pending' | 'tracking' | 'fading';
}

function polar(angleDeg: number, radius: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [CENTER + radius * Math.sin(rad), CENTER - radius * Math.cos(rad)];
}

function sectorPath(centerAngle: number, width: number, radius: number) {
  const [sx, sy] = polar(centerAngle - width / 2, radius);
  const [ex, ey] = polar(centerAngle + width / 2, radius);
  const large = width > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${sx.toFixed(2)} ${sy.toFixed(2)} A ${radius} ${radius} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)} Z`;
}

function hasCrossed(prev: number, curr: number, target: number) {
  if (curr >= prev) return target >= prev && target <= curr;
  return target >= prev || target <= curr;
}

export default function RadarViewer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const sweepRef = useRef<SVGGElement>(null);
  const angleRef = useRef(0);
  const lastRef = useRef<number | null>(null);
  const rafRef = useRef(0);
  const targetsRef = useRef<Target[]>([]);
  const counterRef = useRef(0);
  const fadeTimers = useRef<Map<number, number>>(new Map());

  const [targets, setTargets] = useState<Target[]>([]);

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    targetsRef.current = targets;
  }, [targets]);

  const clearFadeTimer = (id: number) => {
    const timer = fadeTimers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      fadeTimers.current.delete(id);
    }
  };

  const scheduleFade = (id: number) => {
    clearFadeTimer(id);
    const holdTimer = window.setTimeout(() => {
      targetsRef.current = targetsRef.current.map((t) =>
        t.id === id ? { ...t, status: 'fading' as const } : t,
      );
      setTargets(targetsRef.current);

      const fadeTimer = window.setTimeout(() => {
        targetsRef.current = targetsRef.current.filter((t) => t.id !== id);
        setTargets(targetsRef.current);
        fadeTimers.current.delete(id);
      }, FADE_MS);
      fadeTimers.current.set(id, fadeTimer);
    }, HOLD_MS);
    fadeTimers.current.set(id, holdTimer);
  };

  useEffect(() => {
    const timers = fadeTimers.current;
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const tick = (now: number) => {
      if (lastRef.current === null) lastRef.current = now;
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;

      const prevAngle = angleRef.current;
      const angle = (prevAngle + SWEEP_SPEED * dt) % 360;
      angleRef.current = angle;

      sweepRef.current?.setAttribute('transform', `rotate(${angle} ${CENTER} ${CENTER})`);

      let changed = false;
      const newlyTracked: number[] = [];
      const updated = targetsRef.current.map((t) => {
        if (t.status !== 'pending') return t;
        if (hasCrossed(prevAngle, angle, t.bearing)) {
          changed = true;
          newlyTracked.push(t.id);
          return { ...t, status: 'tracking' as const };
        }
        return t;
      });

      if (changed) {
        targetsRef.current = updated;
        setTargets(updated);
        newlyTracked.forEach(scheduleFade);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reducedMotion]);

  const handlePlace = (event: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * SIZE;
    const y = ((event.clientY - rect.top) / rect.height) * SIZE;
    const dx = x - CENTER;
    const dy = y - CENTER;
    const dist = Math.hypot(dx, dy);

    const hit = targetsRef.current.find((t) => Math.hypot(t.x - x, t.y - y) < 14);
    if (hit) {
      clearFadeTimer(hit.id);
      const next = targetsRef.current.filter((t) => t.id !== hit.id);
      targetsRef.current = next;
      setTargets(next);
      return;
    }

    if (dist > FIELD_R || dist < HUB_R) return;

    const bearing = ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;
    const rangeMetres = Math.round((dist / FIELD_R) * FIELD_METRES);
    counterRef.current += 1;
    const id = Date.now() + Math.random();
    const status: Target['status'] = reducedMotion ? 'tracking' : 'pending';

    const next = [
      ...targetsRef.current,
      { id, label: counterRef.current, x, y, bearing, rangeMetres, status },
    ].slice(-5);

    targetsRef.current = next;
    setTargets(next);

    if (reducedMotion) scheduleFade(id);
  };

  const rings = [0.25, 0.5, 0.75, 1].map((f) => f * FIELD_R);
  const spokes = Array.from({ length: 12 }, (_, i) => i * 30);
  const units = Array.from({ length: UNIT_COUNT }, (_, i) => i * (360 / UNIT_COUNT));

  const trail = Array.from({ length: TRAIL_STEPS }, (_, i) => {
    const a = -((i + 1) / TRAIL_STEPS) * TRAIL_SPAN;
    const [x, y] = polar(a, FIELD_R);
    return { x, y, opacity: 0.3 * (1 - i / TRAIL_STEPS) };
  });

  const [tipX, tipY] = polar(0, FIELD_R);

  return (
    <div className={styles.wrap}>
      <div className={styles.statusBar} aria-hidden="true">
        {targets.length === 0 ? (
          <span className={styles.empty}>No targets placed</span>
        ) : (
          targets
            .slice()
            .reverse()
            .map((t) => (
              <span key={t.id} className={styles.chip} data-status={t.status}>
                T{String(t.label).padStart(2, '0')} · {t.rangeMetres}M ·{' '}
                {String(Math.round(t.bearing)).padStart(3, '0')}° ·{' '}
                {t.status === 'pending' ? 'ACQ' : 'TRACK'}
              </span>
            ))
        )}
      </div>

      <div className={styles.stage}>
        <svg
          ref={svgRef}
          className={styles.field}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          onPointerDown={handlePlace}
        >
          {units.map((angle) => (
            <path key={angle} d={sectorPath(angle, SECTOR_WIDTH, FIELD_R)} className={styles.sector} />
          ))}

          {rings.map((r) => (
            <circle key={r} cx={CENTER} cy={CENTER} r={r} className={styles.ring} />
          ))}

          {spokes.map((angle) => {
            const [x, y] = polar(angle, FIELD_R);
            return <line key={angle} x1={CENTER} y1={CENTER} x2={x} y2={y} className={styles.spoke} />;
          })}

          <circle cx={CENTER} cy={CENTER} r={HUB_R} className={styles.hub} />

          <g ref={sweepRef} className={styles.sweepGroup}>
            {trail.map((p, i) => (
              <line
                key={i}
                x1={CENTER}
                y1={CENTER}
                x2={p.x}
                y2={p.y}
                style={{ opacity: p.opacity }}
                className={styles.trailLine}
              />
            ))}
            <line x1={CENTER} y1={CENTER} x2={tipX} y2={tipY} className={styles.sweepLine} />
          </g>

          {targets.map((t) => (
            <g key={t.id} className={styles.targetGroup} data-status={t.status}>
              <circle
                cx={t.x}
                cy={t.y}
                r={5}
                className={t.status === 'pending' ? styles.targetPending : styles.targetLocked}
              />
              {t.status !== 'pending' ? (
                <g className={styles.reticle}>
                  <line x1={t.x - 10} y1={t.y} x2={t.x - 5} y2={t.y} />
                  <line x1={t.x + 5} y1={t.y} x2={t.x + 10} y2={t.y} />
                  <line x1={t.x} y1={t.y - 10} x2={t.x} y2={t.y - 5} />
                  <line x1={t.x} y1={t.y + 5} x2={t.x} y2={t.y + 10} />
                </g>
              ) : null}
            </g>
          ))}
        </svg>

        <p className={styles.hint} aria-hidden="true">
          Click to place a target · click again to clear
        </p>
      </div>
    </div>
  );
}
