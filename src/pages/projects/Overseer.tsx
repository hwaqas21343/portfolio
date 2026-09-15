import { Link } from 'react-router-dom';
import ProjectPage from '../../components/ProjectPage';
import DemoFrame from '../../components/DemoFrame';
import styles from './Overseer.module.css';

export default function Overseer() {
  return (
    <ProjectPage
      slug="overseer"
      showcaseLabel="Media"
      summary={
        <div className="prose">
          <p>
            Overseer is a personal fixed-wing UAV project aimed at delivering
            low-observable, low-cost, autonomous airborne early warning and
            control (AEW&amp;C) and intelligence, surveillance and
            reconnaissance (ISR) capability in a compact platform. The idea
            is to target the kind of persistent, distributed sensing role
            traditionally filled by far larger and far more expensive
            crewed or uncrewed aircraft, at a fraction of the cost and
            radar cross-section, by combining a low-observable airframe
            with a layered onboard sensor suite and autonomous operation.
          </p>
          <p>
            The airframe has been shaped and refined using CFD analysis,
            and a first prototype has already flown, with the design now
            being updated based on the results of that flight.
          </p>
        </div>
      }
      showcase={
        <>
          <div className="prose">
            <p>
              CFD renders and a CAD geometry pass from the airframe&apos;s
              development.
            </p>
          </div>

          <div className={styles.grid}>
            <div className={styles.gridWide}>
              <DemoFrame
                caption="Velocity contour over the low-observable airframe"
                aspectRatio="4 / 3"
              >
                <img
                  src="/media/overseer/hero-cfd.png"
                  alt="CFD velocity contour over the blended low-observable airframe in side profile, showing flow separation around the nose and wing root"
                  className={styles.figureImg}
                />
              </DemoFrame>
            </div>
            <DemoFrame caption="CAD geometry pass" aspectRatio="4 / 3">
              <img
                src="/media/overseer/cad-mesh.png"
                alt="Wireframe CAD model of the Overseer airframe in side profile"
                className={styles.figureImg}
              />
            </DemoFrame>
            <DemoFrame caption="Nose and leading-edge detail, CFD" aspectRatio="4 / 3">
              <img
                src="/media/overseer/cfd-nose.png"
                alt="Close-up CFD contour of the nose and forward fuselage showing pressure buildup at the leading edge"
                className={styles.figureImg}
              />
            </DemoFrame>
          </div>
        </>
      }
      deepDive={
        <div className="prose">
          <p>
            Overseer&apos;s central difficulty is that low observability and
            capable ISR/AEW&amp;C sensing normally pull in opposite
            directions and the project has to be worked as one problem
            rather than two:
          </p>
          <ul>
            <li>
              <strong>The tension.</strong> A genuinely useful sensor suite
              tends to demand size, power and radiating emissions, all of
              which work against a low radar cross-section and a low-cost
              target. Every design decision, airframe shape, sensor
              selection, structural layout, has to be weighed against its
              effect on signature, weight and power budget at once.
            </li>
            <li>
              <strong>Beyond simulation.</strong> Getting a first prototype
              into the air was only part of the challenge. Flight testing
              surfaced real aerodynamic and handling characteristics that
              CFD alone could not fully predict, so the design now has to be
              revisited in light of actual flight data rather than
              simulation results alone.
            </li>
            <li>
              <strong>Progress.</strong> The airframe went from a
              CFD-informed design through to a flying first prototype, and
              flight data from that prototype is now feeding into an
              updated design iteration.
            </li>
            <li>
              <strong>Ground testbed.</strong> <Link to="/projects/cage">CAGE</Link>{' '}
              was developed alongside the airframe as a full-scale, 1:1
              ground-based testbed of the platform&apos;s sensing and
              low-observability approach, directly informing the sensor
              layout and shielding strategy carried into the
              airframe&apos;s ongoing development.
            </li>
          </ul>
        </div>
      }
    />
  );
}
