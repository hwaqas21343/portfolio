// Projects

export type ProjectSlug =
  | 'adcs-simulator'
  | 'cage'
  | 'overseer'
  | 'formula-student'
  | 'gas-turbine-ml';

export type ProjectMode = 'interactive' | 'static';

export interface Project {
  slug: ProjectSlug;
  title: string;
  subtitle: string;
  period: string;
  domain: string;
  stack: string[];
  mode: ProjectMode;
  demoSummary?: string;
}

export const PROJECTS: Project[] = [
  {
    slug: 'adcs-simulator',
    title: 'ADCS Simulator',
    subtitle: 'A 6-DOF spacecraft attitude simulator, built from first principles',
    period: '2024–25',
    domain: 'Spacecraft GNC',
    stack: ['MATLAB', 'PID / LQR / LQI', 'Kalman filtering', 'Monte Carlo', '6-DOF dynamics'],
    mode: 'interactive',
    demoSummary:
      'Drag the satellite to knock it off attitude, then watch a PID controller, ported from the MATLAB source, bring it back to nominal in real time.',
  },
  {
    slug: 'cage',
    title: 'CAGE',
    subtitle: 'An AEW&C radar system for UAVs, three units on one controller',
    period: '2024–25',
    domain: 'Sensing & Detection',
    stack: ['Radar', 'ESP32-S3', 'C++ firmware', 'UDP telemetry', 'Python fusion'],
    mode: 'interactive',
    demoSummary:
      'Click anywhere in the field to drop a target, then watch the three-unit array detect it and the fused 360° display report range and bearing.',
  },
  {
    slug: 'overseer',
    title: 'Project Overseer',
    subtitle: 'A low-observable UAV for AEW&C and ISR, flown as a first prototype',
    period: '2022–26',
    domain: 'UAV Systems',
    stack: ['CFD analysis', 'Low-observable design', 'Flight testing', 'Sensor integration'],
    mode: 'static',
  },
  {
    slug: 'formula-student',
    title: 'Formula Student',
    subtitle: 'Head of Mechanical Systems, the team’s first EV in eight years',
    period: '2024–present',
    domain: 'Motorsport / Structures',
    stack: ['CAD', 'Suspension geometry', 'FEA', 'Tubular space frame', 'Design for manufacture'],
    mode: 'interactive',
    demoSummary:
      'The roll cage CAD model, live in the browser, drag to orbit around the frame, scroll to zoom.',
  },
  {
    slug: 'gas-turbine-ml',
    title: 'Gas Turbine Emissions Model',
    subtitle: 'Predicting CO and NOx emissions with gradient boosting',
    period: '2024–25',
    domain: 'Machine Learning',
    stack: ['Python', 'scikit-learn', 'Feature engineering', 'Gradient boosting', 'Matplotlib'],
    mode: 'static',
  },
];

export function getProject(slug: ProjectSlug): Project {
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) {
    throw new Error(`Unknown project slug: ${slug}`);
  }
  return project;
}
