import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

export default function AiTransparency() {
  return (
    <div className="container">
      <div className="sheet">
        <PageHeader
          eyebrow="Transparency"
          title="AI transparency"
          lede="An honest account of where Claude Code was used in building this site and where it wasn't."
        />

        <Section label="Build" title="What Claude Code helped with">
          <div className="prose">
            <p>
              Claude Code helped with implementation. That means writing
              component code, wiring up new content and pages as projects
              were added and building out interactive pieces like the
              CAGE radar sweep and the 3D chassis viewer, all from
              direction I gave it at every step.
            </p>
            <p>
              The content, the art direction and the UI weren&apos;t AI.
              Every word on this site was written by me. The palette,
              typography and visual language came from references and
              decisions I made. The interface itself, the boot terminal,
              the sweep-fill selection, the corner brackets, was designed
              by me and built to that direction. Styling and
              debugging worked the same way. I reviewed every pass myself,
              caught what didn&apos;t look or work right and directed the
              fix rather than accepting whatever came back first.
            </p>
          </div>
        </Section>

        <Section label="Engineering" title="What isn't">
          <div className="prose">
            <p>
              None of the actual engineering behind the projects on this
              site used AI assistance. The ADCS simulator, CAGE, Project
              Overseer, the Formula Student chassis and the gas turbine
              emissions model are my own work, built and validated by
              hand. This website is the interface presenting that work,
              not the work itself.
            </p>
          </div>
        </Section>

        <Section label="Why" title="Why this page exists">
          <div className="prose">
            <p>
              AI assistance in a website build is common and often goes
              unmentioned. The point of everything documented on this
              site, the simulators, the radar rig, the chassis work, was
              to learn by doing it myself. That doesn&apos;t change
              because a coding assistant helped the frontend come together
              faster. Being upfront about where it was and wasn&apos;t
              used matters more than pretending otherwise.
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}
