// Skills

export interface SkillGroup {
  group: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  {
    group: 'Languages',
    items: [
      'Python (scikit-learn, Pandas, NumPy, Matplotlib)',
      'C / C++ (embedded, Arduino / ESP32)',
      'MATLAB',
    ],
  },
  {
    group: 'Tools & simulation',
    items: [
      'SolidWorks / FEA',
      'ANSYS',
      'ABAQUS',
      'Siemens NX / FEA',
      'Fusion 360',
      'XFLR5',
      'Ardupilot / MAVLink',
      'Git',
      '3D printing',
    ],
  },
  {
    group: 'Domain',
    items: [
      'Attitude dynamics & control',
      'Kalman filtering',
      'Structural validation (FEA)',
      'Embedded systems & sensor fusion',
    ],
  },
];
