import { PROJECTS } from '../data/projects';
import PageHeader from '../components/PageHeader';
import ProjectCard from '../components/ProjectCard';
import styles from './Projects.module.css';

export default function Projects() {
  return (
    <div className="container">
      <div className="sheet">
        <PageHeader
          eyebrow="Work"
          title="Projects"
          lede="Six pieces of work spanning spacecraft control, sensing, a low-observable UAV, motorsport structures, machine learning and this site itself. Four of them you can drive yourself."
        />

        <ul className={styles.list}>
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </ul>
      </div>
    </div>
  );
}
