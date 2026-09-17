import ProjectPage from '../../components/ProjectPage';
import DemoFrame from '../../components/DemoFrame';
import RadarViewer from '../../components/demos/RadarViewer';
import { getProject } from '../../data/projects';
import styles from './Cage.module.css';

const LEGEND = [
  {
    label: 'Unit coverage sector',
    icon: (
      <path d="M2 14 L14 2" stroke="var(--teal)" strokeWidth={1.5} strokeDasharray="3 2" fill="none" />
    ),
  },
  {
    label: 'Range ring',
    icon: <circle cx={8} cy={8} r={6} fill="none" stroke="var(--rule)" strokeWidth={1.5} />,
  },
  {
    label: 'Active sweep',
    icon: <line x1={8} y1={14} x2={8} y2={2} stroke="var(--teal)" strokeWidth={2} strokeLinecap="round" />,
  },
  {
    label: 'Target acquiring',
    icon: (
      <circle
        cx={8}
        cy={8}
        r={4}
        fill="var(--panel)"
        stroke="var(--fg-faint)"
        strokeWidth={1.5}
        strokeDasharray="2 2"
      />
    ),
  },
  {
    label: 'Target tracked',
    icon: (
      <>
        <circle cx={8} cy={8} r={4} fill="var(--teal)" stroke="var(--fg)" strokeWidth={1.5} />
        <line x1={0.5} y1={8} x2={3} y2={8} stroke="var(--fg)" strokeWidth={1.5} />
        <line x1={13} y1={8} x2={15.5} y2={8} stroke="var(--fg)" strokeWidth={1.5} />
        <line x1={8} y1={0.5} x2={8} y2={3} stroke="var(--fg)" strokeWidth={1.5} />
        <line x1={8} y1={13} x2={8} y2={15.5} stroke="var(--fg)" strokeWidth={1.5} />
      </>
    ),
  },
];

export default function Cage() {
  const project = getProject('cage');

  return (
    <ProjectPage
      slug="cage"
      summary={
        <div className="prose">
          <p>
            CAGE, Confined Aerial Geometry, is an airborne early-warning and
            control (AEW&amp;C) system for UAVs. Rather than one large radar,
            it&apos;s built from three radar units whose coverage overlaps, so
            a target picked up by one unit can be confirmed and tracked as it
            crosses into another&apos;s field.
          </p>
          <p>
            All three run off a single ESP32-S3 controller, with C++
            firmware handling sensor acquisition and streaming live
            telemetry over UDP. A Python pipeline on the ground ingests the
            streams, merges the detections and renders them as a single
            360° polar display, the whole pipeline tested end to end on a
            standalone rig rather than only in simulation.
          </p>
        </div>
      }
      showcase={
        <>
          <div className="prose">
            <p>{project.demoSummary}</p>
          </div>
          <DemoFrame
            aspectRatio="1 / 1"
            caption="Click inside the field to place a target · the sweep will acquire it"
          >
            <RadarViewer />
          </DemoFrame>

          <ul className={styles.legend}>
            {LEGEND.map(({ label, icon }) => (
              <li key={label} className={styles.legendItem}>
                <svg className={styles.legendSwatch} width={16} height={16} viewBox="0 0 16 16" aria-hidden="true">
                  {icon}
                </svg>
                {label}
              </li>
            ))}
          </ul>
        </>
      }
      deepDive={
        <div className="prose">
          <p>
            The work split into three layers, firmware, fusion and the rig
            it all had to survive contact with.
          </p>
          <ul>
            <li>
              <strong>Architecture.</strong> Three radar units on a single
              ESP32-S3 controller, arranged so their coverage overlaps and a
              target can be confirmed by more than one unit rather than
              relying on a single return.
            </li>
            <li>
              <strong>Firmware.</strong> C++ handling sensor acquisition and
              live telemetry out over UDP on Wi-Fi, written for low,
              predictable latency rather than maximum throughput.
            </li>
            <li>
              <strong>Fusion and display.</strong> A Python pipeline that
              ingests the UDP streams, merges detections that correspond to
              the same target and renders the result as a single 360°
              polar display with overlapping coverage shown live.
            </li>
            <li>
              <strong>Validation.</strong> Implemented and tested on a
              standalone rig ahead of integration, checking telemetry
              reliability, detection coverage and tracking of multiple
              simultaneous targets rather than a single clean case.
            </li>
          </ul>
        </div>
      }
    />
  );
}
