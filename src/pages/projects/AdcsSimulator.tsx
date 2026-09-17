import ProjectPage from '../../components/ProjectPage';
import DemoFrame from '../../components/DemoFrame';
import { getProject } from '../../data/projects';

export default function AdcsSimulator() {
  const project = getProject('adcs-simulator');

  return (
    <ProjectPage
      slug="adcs-simulator"
      summary={
        <div className="prose">
          <p>
            A satellite in orbit has nothing to push against, so keeping it
            pointed the right way (at the Earth, at the Sun, at a ground
            station) is a control problem rather than a steering one. The
            Attitude Determination and Control System is the part of the
            spacecraft that solves it. Work out which way you&apos;re currently
            facing, compare that to where you should be facing and fire the
            actuators that close the gap.
          </p>
          <p>
            This project is a full 6-DOF simulation of that loop, built in
            MATLAB from first principles rather than assembled from library
            blocks. Sensor, actuator and disturbance behaviour are each
            modelled as interchangeable modules, so swapping a controller or
            adding a new failure mode doesn&apos;t mean rewriting the simulator
            around it.
          </p>
        </div>
      }
      showcase={
        <>
          <div className="prose">
            <p>{project.demoSummary}</p>
          </div>
          <DemoFrame
            description="Being built now, the PID controller is ported from the MATLAB source so the on-screen response matches the simulator."
            caption="Drag the satellite to apply a torque impulse · release to watch the controller recover"
          />
        </>
      }
      deepDive={
        <div className="prose">
          <p>
            The simulator covers the full attitude loop, dynamics through to
            fault recovery and every stage was checked against an
            independent source rather than trusted on sight.
          </p>
          <ul>
            <li>
              <strong>Dynamics.</strong> A 6-DOF rigid-body simulation built
              from first principles, validated to approximately 10<sup>-13</sup>{' '}
              relative accuracy against closed-form solutions.
            </li>
            <li>
              <strong>Control.</strong> Three interchangeable attitude
              controllers, PID, LQR and LQI, with the LQR/LQI Riccati solver
              written from scratch and verified to 2×10<sup>-10</sup> agreement
              against both MATLAB&apos;s native solver and an independently
              derived solution.
            </li>
            <li>
              <strong>Estimation.</strong> A Kalman filter estimator, Monte
              Carlo validated across the sensor noise and disturbance envelope
              rather than checked on a single nominal case.
            </li>
            <li>
              <strong>Fault recovery.</strong> A supervisory state machine
              (SAFE, ACQUIRE, NOMINAL) for autonomous recovery. Under
              realistic uncertainty it showed a 4.2× increase in pointing
              error and recovered to nominal performance in roughly 260
              seconds without mode chattering between states.
            </li>
            <li>
              <strong>What&apos;s next.</strong> Currently porting the whole
              simulator to Python, open source, with an extended feature set
              aimed at making it more accessible for anyone learning
              spacecraft attitude control rather than just a personal tool.
            </li>
          </ul>
        </div>
      }
    />
  );
}
