import type { ReactNode } from 'react';
import styles from './Section.module.css';

interface SectionProps {
  label?: string;
  title?: string;
  id?: string;
  children: ReactNode;
}

export default function Section({ label, title, id, children }: SectionProps) {
  return (
    <section id={id} className={styles.section}>
      {label ? (
        <div className={styles.rail}>
          <p className="eyebrow">{label}</p>
        </div>
      ) : null}

      <div className={styles.body}>
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        {children}
      </div>
    </section>
  );
}
