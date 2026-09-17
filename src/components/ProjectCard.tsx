import { Link } from 'react-router-dom';
import type { Project } from '../data/projects';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const { slug, title, period, domain, mode } = project;

  return (
    <li>
      <Link to={`/projects/${slug}`} className={styles.card}>
        <span className={styles.brackets} aria-hidden="true" />
        <span className={styles.code}>
          P/{String(index + 1).padStart(2, '0')}
        </span>

        <span className={styles.main}>
          <span className={styles.title}>{title}</span>
        </span>

        <span className={styles.meta}>
          <span>{period}</span>
          <span>{domain}</span>
          {mode === 'interactive' ? (
            <span className={styles.badge}>Live demo</span>
          ) : null}
        </span>
      </Link>
    </li>
  );
}
