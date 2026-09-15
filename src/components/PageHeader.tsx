import type { ReactNode } from 'react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: PageHeaderProps) {
  return (
    <header className={styles.header}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className={styles.title}>{title}</h1>
      {lede ? <div className={styles.lede}>{lede}</div> : null}
      {children}
    </header>
  );
}
