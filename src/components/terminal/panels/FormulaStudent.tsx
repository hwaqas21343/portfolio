import { lazy, Suspense } from 'react';
import LiveMount from '../LiveMount';
import { Cells, EntryHeader, Rule } from '../ui';
import styles from './panels.module.css';

const ChassisViewer = lazy(() => import('../../demos/ChassisViewer'));

export function FormulaStudentBrief() {
  return (
    <div className={styles.stack14}>
      <EntryHeader
        rows={[
          ['DATE', '2024 – present'],
          ['DOMAIN', 'Motorsport / structures'],
          ['ROLE', 'Head of Mechanical Systems (2025 – present)'],
          ['STATUS', 'Targeting the 2027 season'],
        ]}
      />
      <Rule />
      <p className={styles.p}>
        Formula Student is a competition where university teams design, build and race a small
        single-seater. The chassis is the part everything else bolts to. It has to be stiff enough
        that the suspension behaves predictably, light enough not to waste the engine&apos;s work
        and strong enough to protect the driver, all while satisfying a rulebook that dictates
        tube diameters, wall thicknesses and clearances around the driver&apos;s head.
      </p>
      <p className={styles.p}>
        I joined the team in 2024 working on aerodynamics then took over as Head of Mechanical
        Systems in 2025. Since then I&apos;ve led chassis design and structural validation for the
        team&apos;s first EV and car in eight years, targeting the 2027 season, alongside the full
        front and rear suspension geometry from a clean-sheet chassis.
      </p>
      <Cells
        minWidth={170}
        cells={[
          { label: 'CHASSIS MASS', value: '57.8 → 53.2 kg' },
          { label: 'SAFETY FACTOR', value: '> 1.6 at 40g' },
          { label: 'DESIGN TO BUILD', value: '10 months' },
        ]}
      />
    </div>
  );
}

export function FormulaStudentDemo() {
  return (
    <div className={styles.stack12}>
      <EntryHeader rows={[['DATE', '2024 – present'], ['SOURCE', 'chassis.glb · 43,816 triangles, one draw call']]} />
      <Rule />
      <p className={styles.p}>
        The roll cage CAD model, live in the browser, drag to orbit around the frame, scroll to
        zoom.
      </p>
      <Suspense fallback={<LiveMount label="LOADING VIEWER" />}>
        <LiveMount>
          <ChassisViewer />
        </LiveMount>
      </Suspense>
      <span className={styles.caption}>Drag to orbit · scroll to zoom · rotates on its own when idle</span>
    </div>
  );
}
