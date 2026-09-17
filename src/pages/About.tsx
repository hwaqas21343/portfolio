import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

export default function About() {
  return (
    <div className="container">
      <div className="sheet">
        <PageHeader
          eyebrow="About"
          title="About me"
          lede="Final-year Aerospace Engineering student at City St George's, University of London."
        />

        <Section label="Background" title="Who I am">
          <div className="prose">
            <p>
              I&apos;m Hamza Waqas, an aerospace engineer based in London.
              I&apos;m in my final year of a BEng in Aerospace Engineering,
              predicted a First and applying for graduate roles and an MSc
              in spacecraft engineering.
            </p>
            <p>
              Most of what&apos;s on this site started as side projects
              rather than coursework. The ADCS simulator and the CAGE radar
              rig were both things I built because I wanted to understand
              how they worked, not because a module asked for them.
            </p>
            <p>
              I got a closer look at the industry side over summer 2025 at
              Panasonic Avionics, where I shadowed engineers working on
              in-flight entertainment integration on Airbus aircraft,
              tracing power-interrupt issues back through the switch
              between APU, GPU and engine power. Between that and
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
              simulator is the clearest evidence of that, a 6-DOF attitude
              simulation built from first principles, with three
              interchangeable controllers and a Kalman filter estimator I
              validated by hand rather than trusting a library.
            </p>
            <p>
              On the ground side there is some motorsport experience. As Head of Mechanical Systems
              for Formula Student, I&apos;ve led chassis and suspension design
              for the team&apos;s first EV in eight years, the trade-offs between
              structural performance, packaging and what can actually be
              built to a fixed facility and timeline.
            </p>
            <p>
              More recently that&apos;s grown a third interest, building out my
              Python and C/C++ further and looking closely at software
              engineering roles, what they actually expect beyond the
              embedded firmware and simulation code already running through
              the other two, CAGE&apos;s C++ telemetry stack, the ADCS and
              emissions models in Python, this site itself in TypeScript.
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}
