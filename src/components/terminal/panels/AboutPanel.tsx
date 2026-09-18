import { EntryHeader, Rule } from '../ui';
import styles from './panels.module.css';

export default function AboutPanel() {
  return (
    <div className={styles.stack14}>
      <EntryHeader
        rows={[
          ['DATE', 'September 2026'],
          ['STATUS', 'Final year, BEng Aerospace Engineering'],
          ['INSTITUTION', "City St George's, University of London"],
          ['SEEKING', '2026 graduate roles / MSc, spacecraft GNC'],
        ]}
      />
      <Rule />
      <p className={styles.p}>
        I&apos;m Hamza Waqas, an aerospace engineer based in London. I&apos;m in my final year of
        a BEng in Aerospace Engineering, predicted a First and applying for graduate roles and an
        MSc in spacecraft engineering.
      </p>
      <p className={styles.p}>
        Most of what&apos;s on this site started as side projects rather than coursework. The
        ADCS simulator and the CAGE radar rig were both things I built because I wanted to
        understand how they worked, not because a module asked for them.
      </p>
      <p className={styles.p}>
        I got a closer look at the industry side over summer 2025 at Panasonic Avionics, where I
        shadowed engineers working on in-flight entertainment integration on Airbus aircraft,
        tracing power-interrupt issues back through the switch between APU, GPU and engine power.
      </p>
      <p className={styles.pWhite}>
        Between that and Formula Student, where I went from aerodynamics in my first year to
        leading mechanical systems since 2025, most of my time outside lectures goes into one or
        the other.
      </p>
    </div>
  );
}
