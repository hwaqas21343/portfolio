import LiveMount from '../LiveMount';
import { EntryHeader, Rule, TagList } from '../ui';
import styles from './panels.module.css';

export function AdcsBrief() {
  return (
    <div className={styles.stack14}>
      <EntryHeader
        rows={[
          ['DATE', '2026'],
          ['DOMAIN', 'Spacecraft GNC'],
          ['TYPE', 'Personal project, MATLAB'],
          ['STATUS', 'Active · porting to open-source Python'],
        ]}
      />
      <Rule />
      <p className={styles.p}>
        A satellite in orbit has nothing to push against, so keeping it pointed the right way (at
        the Earth, at the Sun, at a ground station) is a control problem rather than a steering
        one. The Attitude Determination and Control System is the part of the spacecraft that
        solves it. Work out which way you&apos;re currently facing, compare that to where you
        should be facing and fire the actuators that close the gap.
      </p>
      <p className={styles.p}>
        This project is a full 6-DOF simulation of that loop, built in MATLAB from first
        principles rather than assembled from library blocks. Sensor, actuator and disturbance
        behaviour are each modelled as interchangeable modules, so swapping a controller or adding
        a new failure mode doesn&apos;t mean rewriting the simulator around it.
      </p>
      <TagList items={['MATLAB', 'PID / LQR / LQI', 'Kalman filtering', 'Monte Carlo', '6-DOF dynamics']} />
    </div>
  );
}

export function AdcsDemo() {
  return (
    <div className={styles.stack12}>
      <EntryHeader rows={[['DATE', '2026'], ['SOURCE', 'PID controller ported from the MATLAB simulator']]} />
      <Rule />
      <p className={styles.p}>
        Drag the satellite to knock it off attitude then watch a PID controller, ported from the
        MATLAB source, bring it back to nominal in real time.
      </p>
      <LiveMount
        label="ATTITUDE SIMULATOR"
        sub="In development. The controller is being ported from the MATLAB source to run live in the browser."
      />
      <span className={styles.caption}>
        Drag the satellite to apply a torque impulse · release to watch the controller recover
      </span>
    </div>
  );
}
