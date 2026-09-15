import type { ReactNode } from 'react';
import styles from './DemoFrame.module.css';

interface DemoFrameProps {
  description?: string;
  caption?: string;
  status?: string;
  aspectRatio?: string;
  children?: ReactNode;
}

export default function DemoFrame({
  description,
  caption,
  status = 'Demo in build',
  aspectRatio,
  children,
}: DemoFrameProps) {
  return (
    <figure className={styles.wrap}>
      <div
        className={styles.frame}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        {children ?? (
          <div className={styles.placeholder}>
            <p className={styles.status}>{status}</p>
            <p className={styles.placeholderText}>{description}</p>
          </div>
        )}
      </div>

      {caption ? (
        <figcaption className={styles.caption}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
