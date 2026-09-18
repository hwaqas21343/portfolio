import type { ReactNode } from 'react';
import styles from './LiveMount.module.css';

interface LiveMountProps {
  children?: ReactNode;
  label?: string;
  sub?: string;
}

export default function LiveMount({ children, label, sub }: LiveMountProps) {
  return (
    <div className={styles.mount}>
      {children ?? (
        <div className={styles.placeholder}>
          {label ? <span className={styles.placeholderLabel}>{label}</span> : null}
          {sub ? <span className={styles.placeholderSub}>{sub}</span> : null}
        </div>
      )}
    </div>
  );
}
