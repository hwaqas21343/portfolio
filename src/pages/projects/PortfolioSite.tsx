import ProjectPage from '../../components/ProjectPage';

export default function PortfolioSite() {
  return (
    <ProjectPage
      slug="portfolio-site"
      showcaseLabel="Walkthrough"
      summary={
        <div className="prose">
          <p>
            Every other project on this site is a write-up of something built
            somewhere else. This one is different: it&apos;s the interface
            itself, the thing you&apos;re using right now to read about the
            other five.
          </p>
          <p>
            Built in React and TypeScript on Vite, it runs on no UI library
            and no component kit. Every panel, sweep-fill highlight and
            corner bracket is hand-written in CSS Modules against one shared
            set of design tokens, the visual language pulled from
            mission-control HUDs and Bungie&apos;s Marathon rather than a
            portfolio template. Claude Code sat alongside as a coding aid
            throughout the build, useful for iteration once a direction was
            set.
          </p>
          <p>
            Every route change runs a short boot sequence and every list,
            tab and card shares the same selection language: a sweep of
            colour clipped in from the left, then a set of corner brackets
            locking onto whatever&apos;s selected. None of it is a UI kit
            default, it&apos;s one interaction pattern applied consistently
            across the whole site.
          </p>
        </div>
      }
      showcase={
        <div className="prose">
          <p>You&apos;re already inside the demo. A few things worth trying:</p>
          <ul>
            <li>
              <strong>Boot terminal home page.</strong> A keyboard-navigable
              menu styled as a system boot log, with a live clock and arrow
              key, direct number key and enter navigation.
            </li>
            <li>
              <strong>Tabbed project consoles.</strong> Each project page
              splits into Brief, Demo and Technical channels, with left and
              right arrow keys paging between projects.
            </li>
            <li>
              <strong>Live 3D chassis viewer.</strong> The Formula Student
              roll cage, rendered directly in the browser with React Three
              Fiber, sliced out of a full car-assembly glTF export by a
              custom extraction script.
            </li>
            <li>
              <strong>Live radar sweep.</strong> The CAGE project page runs a
              real polar radar built in SVG, click inside it to drop a
              target and watch the rotating sweep acquire and track it
              against the three overlapping unit sectors.
            </li>
            <li>
              <strong>Route-change boot flash.</strong> The short loading
              sequence you saw arriving on this page and the sweep-fill
              selection state used everywhere else.
            </li>
            <li>
              <strong>Fully responsive.</strong> Audited and fixed across
              everything from a 320px phone to a 1440px desktop.
            </li>
          </ul>
        </div>
      }
      deepDive={
        <div className="prose">
          <p>Built in stages: routing and layout first, then content, then the interactive pieces, with a full responsive pass at the end.</p>
          <ul>
            <li>
              <strong>Stack.</strong> React, TypeScript, Vite and React
              Router, with CSS Modules and no UI library. A single design
              token file drives colour, spacing, radius and shadow across
              every component.
            </li>
            <li>
              <strong>3D.</strong> React Three Fiber and drei for the
              chassis viewer. The source model was a full car-assembly glTF
              export, so a Node.js script built on gltf-transform walks the
              node tree and slices out just the frame before it ships to the
              browser.
            </li>
            <li>
              <strong>Motion.</strong> A route-keyed remount forces the
              page-load animation to restart on every navigation and every
              animated component checks prefers-reduced-motion directly
              rather than relying on a global override alone.
            </li>
            <li>
              <strong>Responsiveness.</strong> A dedicated audit across every
              page and project channel at phone, tablet and desktop widths,
              tracking down layout overflow caused by default grid track
              sizing rather than anything content-specific.
            </li>
            <li>
              <strong>Workflow.</strong> Claude Code sat in the build as a
              coding aid: useful for fast iteration on styling passes, the
              responsive audit and wiring up new content once a direction
              was set. The engineering behind the other five projects is
              unassisted and every design decision and line of write-up on
              this site was mine.
            </li>
          </ul>
        </div>
      }
    />
  );
}
