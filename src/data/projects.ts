// Projects

export type ProjectSlug =
  | 'adcs-simulator'
  | 'cage'
  | 'overseer'
  | 'formula-student'
  | 'gas-turbine-ml';

export interface Project {
  slug: ProjectSlug;
  title: string;
}

export const PROJECTS: Project[] = [
  { slug: 'adcs-simulator', title: 'ADCS Simulator' },
  { slug: 'cage', title: 'CAGE' },
  { slug: 'overseer', title: 'Project Overseer' },
  { slug: 'formula-student', title: 'Formula Student' },
  { slug: 'gas-turbine-ml', title: 'Gas Turbine Emissions Model' },
];
