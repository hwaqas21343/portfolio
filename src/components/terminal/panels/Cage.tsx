import RadarViewer from '../../demos/RadarViewer';
import LiveMount from '../LiveMount';
import { EntryHeader, Rule, TagList } from '../ui';
import panelStyles from './panels.module.css';

export function CageBrief() {
  return (
    <div className={panelStyles.stack14}>
      <EntryHeader
        rows={[
          ['DATE', '2026'],
          ['DOMAIN', 'Sensing & detection'],
          ['TYPE', 'Personal project, three-unit radar rig'],
          ['STATUS', 'Tested end to end on a standalone rig'],
        ]}
      />
      <Rule />
      <p className={panelStyles.p}>
        CAGE, Confined Aerial Geometry, is an airborne early-warning and control (AEW&amp;C)
        system for UAVs. Rather than one large radar, it&apos;s built from three radar units whose
        coverage overlaps, so a target picked up by one unit can be confirmed and tracked as it
        crosses into another&apos;s field.
      </p>
      <p className={panelStyles.p}>
        All three run off a single ESP32-S3 controller, with C++ firmware handling sensor
        acquisition and streaming live telemetry over UDP. A Python pipeline on the ground ingests
        the streams, merges the detections and renders them as a single 360° polar display, the
        whole pipeline tested end to end on a standalone rig rather than only in simulation.
      </p>
      <TagList items={['Radar', 'ESP32-S3', 'C++ firmware', 'UDP telemetry', 'Python fusion']} />
    </div>
  );
}

export function CageDemo() {
  return (
    <div className={panelStyles.stack12}>
      <EntryHeader rows={[['DATE', '2026'], ['SOURCE', 'Fused 360° polar display, three overlapping units']]} />
      <Rule />
      <p className={panelStyles.p}>
        Click anywhere in the field to drop a target then watch the three-unit array detect it and
        the fused 360° display report range and bearing.
      </p>
      <LiveMount>
        <RadarViewer />
      </LiveMount>
      <span className={panelStyles.caption}>
        Click inside the field to place a target · the sweep will acquire it
      </span>
    </div>
  );
}
