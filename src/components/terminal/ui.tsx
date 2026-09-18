import type { CSSProperties, ReactNode } from 'react';
import styles from './ui.module.css';

export function EntryHeader({ rows }: { rows: [string, string][] }) {
  return (
    <div className={styles.entryHeader}>
      {rows.map(([label, value]) => (
        <div key={label} style={{ display: 'contents' }}>
          <span className={styles.entryLabel}>{label}</span>
          <span className={styles.entryValue}>{value}</span>
        </div>
      ))}
    </div>
  );
}

export function Rule() {
  return <div className={styles.rule} />;
}

export function TagList({ items }: { items: string[] }) {
  return (
    <div className={styles.tagList}>
      {items.map((item) => (
        <span key={item} className={styles.tag}>
          {item}
        </span>
      ))}
    </div>
  );
}

export function Cells({
  cells,
  minWidth = 220,
}: {
  cells: { label: string; value: ReactNode }[];
  minWidth?: number;
}) {
  return (
    <div className={styles.cells} style={{ '--cell-min': `${minWidth}px` } as CSSProperties}>
      {cells.map((c) => (
        <div key={c.label} className={styles.cell}>
          <span className={styles.cellLabel}>{c.label}</span>
          <br />
          <span className={styles.cellValue}>{c.value}</span>
        </div>
      ))}
    </div>
  );
}

export function DownloadButton({ href, download, children }: { href: string; download: string; children: ReactNode }) {
  return (
    <a className={styles.downloadBtn} href={href} download={download}>
      {children}
    </a>
  );
}

export function LinkBox({
  title,
  copy,
  href,
  action,
}: {
  title: string;
  copy: string;
  href: string;
  action: string;
}) {
  return (
    <div className={styles.linkBox}>
      <div className={styles.linkTitle}>{title}</div>
      <p className={styles.linkCopy}>{copy}</p>
      <a className={styles.linkOut} href={href} target="_blank" rel="noreferrer">
        {action}
      </a>
    </div>
  );
}

interface ExperienceRow {
  role: string;
  org: string;
  when: string;
  where: string;
  body: string;
}

export function ExperienceList({ items }: { items: ExperienceRow[] }) {
  return (
    <div className={styles.expList}>
      <div className={styles.expLabel}>EXPERIENCE</div>
      {items.map((item) => (
        <div key={`${item.org}-${item.role}`} className={styles.expItem}>
          <div className={styles.expRole}>
            {item.role} · {item.org}
          </div>
          <div className={styles.expMeta}>
            {item.when} · {item.where}
          </div>
          <p className={styles.expBody}>{item.body}</p>
        </div>
      ))}
    </div>
  );
}
