// Projects

export type ProjectSlug =
  | 'adcs-simulator'
  | 'cage'
  | 'overseer'
  | 'formula-student'
  | 'gas-turbine-ml'
  | 'portfolio-site';

export type ProjectMode = 'interactive' | 'static';

export interface Project {
  slug: ProjectSlug;
  title: string;
  subtitle: string;
  blurb: string;
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
    blurb:
      'A full 6-DOF simulation of a spacecraft’s attitude dynamics and control system in MATLAB, with three interchangeable controllers (PID, LQR, LQI) and a Kalman filter estimator backing a supervisory state machine for autonomous fault recovery.',
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
    blurb:
      'CAGE (Confined Aerial Geometry) is an airborne early-warning radar system: three radar units on a single ESP32-S3 controller running C++ firmware for sensor acquisition and live UDP telemetry, feeding a Python pipeline that fuses the streams into one 360° polar detection picture.',
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
    blurb:
      'A personal fixed-wing UAV aimed at low-observable, low-cost airborne early warning and control (AEW&C) and ISR in a compact platform, the persistent distributed sensing role normally filled by far larger, far more expensive aircraft. The airframe was shaped and refined with CFD, a first prototype has already flown and the design is now being revised against real flight data rather than simulation alone.',
    period: '2022–26',
    domain: 'UAV Systems',
    stack: ['CFD analysis', 'Low-observable design', 'Flight testing', 'Sensor integration'],
    mode: 'static',
  },
  {
    slug: 'formula-student',
    title: 'Formula Student',
    subtitle: 'Head of Mechanical Systems, the team’s first EV in eight years',
    blurb:
      'On the team since 2024, on aerodynamics first and Head of Mechanical Systems since 2025, leading chassis and suspension design for Formula Student UK’s first EV and car in eight years: full front and rear suspension geometry from a clean-sheet chassis, validated to 40g impact loading while cutting mass from 57.8 kg to 53.2 kg.',
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
    blurb:
      'A machine learning pipeline predicting gas turbine CO and NOx emissions from a 35,499-row sensor dataset: four regression models compared under a fixed train/validation/test split, with a tuned gradient boosting regressor reaching a held-out test R² of 0.71 for CO and 0.65 for NOx.',
    period: '2024–25',
    domain: 'Machine Learning',
    stack: ['Python', 'scikit-learn', 'Feature engineering', 'Gradient boosting', 'Matplotlib'],
    mode: 'static',
  },
  {
    slug: 'portfolio-site',
    title: 'This Website',
    subtitle: 'A hand-built engineering console, not a template',
    blurb:
      'The site itself: a React and TypeScript interface built from a blank canvas rather than a template, with a custom design system, a keyboard-navigable boot terminal, tabbed project consoles and a live 3D chassis viewer, all hand-written in CSS Modules against one shared set of design tokens.',
    period: '2025–26',
    domain: 'Software / Frontend',
    stack: ['React', 'TypeScript', 'Vite', 'React Three Fiber', 'CSS Modules'],
    mode: 'interactive',
  },
];

export function getProject(slug: ProjectSlug): Project {
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) {
    throw new Error(`Unknown project slug: ${slug}`);
  }
  return project;
}
