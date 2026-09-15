import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useTelemetry';
import styles from './BootLines.module.css';

export interface BootLine {
  label: string;
  value?: string;
  key?: boolean;
}

interface BootLinesProps {
  lines: BootLine[];
  stagger?: number;
  onComplete?: () => void;
}

export default function BootLines({
  lines,
  stagger = 90,
  onComplete,
}: BootLinesProps) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced ? lines.length : 0);

  useEffect(() => {
    if (reduced) {
      onComplete?.();
      return;
    }

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= lines.length) {
        window.clearInterval(id);
        onComplete?.();
      }
    }, stagger);

    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, stagger]);

  return (
    <ul className={styles.lines}>
      {lines.map((line, i) => (
        <li
          key={line.label}
          className={styles.line}
          data-hidden={i >= shown ? '' : undefined}
        >
          <span className={styles.caret} aria-hidden="true">
            &gt;
          </span>
          <span className={styles.label}>{line.label}</span>
          {line.value ? (
            <>
              <span className={styles.dots} aria-hidden="true" />
              <span
                className={line.key ? styles.valueKey : styles.value}
              >
                {line.value}
              </span>
            </>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
