import { lazy, Suspense } from 'react';
import ProjectPage from '../../components/ProjectPage';
import DemoFrame from '../../components/DemoFrame';
import { getProject } from '../../data/projects';
import styles from './FormulaStudent.module.css';

const ChassisViewer = lazy(() => import('../../components/demos/ChassisViewer'));

export default function FormulaStudent() {
  const project = getProject('formula-student');

  return (
    <ProjectPage
      slug="formula-student"
      summary={
        <div className="prose">
          <p>
            Formula Student is a competition where university teams design,
            build and race a small single-seater. The chassis is the part
            everything else bolts to. It has to be stiff enough that the
            suspension behaves predictably, light enough not to waste the
            engine&apos;s work and strong enough to protect the driver, all
            while satisfying a rulebook that dictates tube diameters, wall
            thicknesses and clearances around the driver&apos;s head.
          </p>
          <p>
            I joined the team in 2024 working on aerodynamics, then took
            over as Head of Mechanical Systems in 2025. Since then
            I&apos;ve led chassis design and structural validation for the
            team&apos;s first EV and car in eight years, targeting the 2027
            season, alongside the full front and rear suspension geometry
            from a clean-sheet chassis. Beyond the roll cage itself that
            meant defining roll centre height, camber, anti-dive and the
            pushrod/bellcrank motion ratio targets that make the suspension
            actually behave the way it&apos;s meant to.
          </p>
        </div>
      }
      showcase={
        <>
          <div className="prose">
            <p>{project.demoSummary}</p>
          </div>
          <DemoFrame caption="Drag to orbit · scroll to zoom · rotates on its own when idle">
            <Suspense
              fallback={
                <div className={styles.loading}>
                  <span className={styles.loadingLabel}>Loading frame…</span>
                </div>
              }
            >
              <ChassisViewer />
            </Suspense>
          </DemoFrame>
        </>
      }
      deepDive={
        <div className="prose">
          <p>
            The scope ran wider than the roll cage alone, chassis, suspension
            and structural validation, all against a fixed facility and a
            10-month design-to-build window.
          </p>
          <ul>
            <li>
              <strong>Suspension geometry.</strong> Full front and rear
              geometry designed from a clean-sheet chassis, defining roll
              centre height, camber and anti-dive, plus the pushrod/bellcrank
              motion ratio targets that set how the damper responds through
              the travel.
            </li>
            <li>
              <strong>Structural validation.</strong> Validated to 40g
              frontal and side impact loading with a safety factor above 1.6,
              while cutting chassis mass from 57.8 kg to 53.2 kg, stiffness
              and crashworthiness weren&apos;t traded away to hit the mass
              target.
            </li>
            <li>
              <strong>Delivery.</strong> Full vehicle design-to-build in 10
              months against fixed facility constraints, the team&apos;s first
              EV and car in eight years.
            </li>
            <li>
              <strong>Regulations.</strong> The rules driving the geometry,
              main and front hoop placement, bracing requirements and the
              driver templates the frame has to clear.
            </li>
            <li>
              <strong>Manufacture.</strong> Jigging, tube notching, weld
              sequence and the changes made purely to make the frame
              buildable by the team.
            </li>
          </ul>
        </div>
      }
    />
  );
}
