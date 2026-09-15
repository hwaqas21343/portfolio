import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import SkillGroups from '../components/SkillGroups';
import styles from './About.module.css';

export default function About() {
  return (
    <div className="container">
      <div className="sheet">
        <PageHeader
          eyebrow="About"
          title="About me"
          lede="Final-year Aerospace Engineering student at City St George's, University of London, heading for an MSc and a career in spacecraft GNC."
        />

        <Section label="Background" title="Who I am">
          <div className="prose">
            <p>
              I&apos;m Hamza Waqas, an aerospace engineer based in London.
              I&apos;m in my final year of a BEng in Aerospace Engineering,
              predicted a First and applying for graduate roles and an MSc
              in spacecraft GNC.
            </p>
            <p>
              Most of what&apos;s on this site started as side projects
              rather than coursework: the ADCS simulator and the CAGE radar
              rig were both things I built because I wanted to understand
              how they worked, not because a module asked for them.
            </p>
            <p>
              I got a closer look at the industry side over summer 2025 at
              Panasonic Avionics, working on in-flight entertainment
              integration on Airbus aircraft, tracing power-interrupt issues
              back through the switch between APU, GPU and engine power and
              shadowing the engineers running the test plan. Between that and
              Formula Student, where I went from aerodynamics in my first
              year to leading mechanical systems since 2025, most of my time
              outside lectures goes into one or the other.
            </p>
          </div>
        </Section>

        <Section label="Focus" title="What I work on">
          <div className="prose">
            <p>
              My work splits across three things, two established and one
              newer. On the space side I&apos;m interested in guidance,
              navigation and control, how a spacecraft knows which way
              it&apos;s pointing and how it corrects itself. The ADCS
              simulator is the clearest evidence of that: a 6-DOF attitude
              simulation built from first principles, with three
              interchangeable controllers and a Kalman filter estimator I
              validated by hand rather than trusting a library.
            </p>
            <p>
              On the ground side, motorsport: as Head of Mechanical Systems
              for Formula Student, I&apos;ve led chassis and suspension design
              for the team&apos;s first EV in eight years, the trade-offs between
              structural performance, packaging and what can actually be
              built to a fixed facility and timeline.
            </p>
            <p>
              More recently that&apos;s grown a third thread: building out my
              Python and C/C++ further and looking closely at software
              engineering roles, what they actually expect beyond the
              embedded firmware and simulation code already running through
              the other two, CAGE&apos;s C++ telemetry stack, the ADCS and
              emissions models in Python, this site itself in TypeScript.
            </p>
          </div>
        </Section>

        <Section label="Skills" title="Tools and methods">
          <SkillGroups />
        </Section>

        <Section label="Beyond" title="Outside the coursework">
          <div className="prose">
            <p>
              Formula Student is the big one: I joined the team in 2024
              working on aerodynamics, then became Head of Mechanical
              Systems in 2025, running chassis design and structural
              validation for the team&apos;s first EV and car in eight
              years. The{' '}
              <Link to="/projects/formula-student" className={styles.inlineLink}>
                project page
              </Link>{' '}
              has the detail, suspension geometry, impact validation, the
              mass budget.
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}
