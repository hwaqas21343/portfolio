import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PROJECTS } from '../data/projects';
import BootLines, { type BootLine } from '../components/terminal/BootLines';
import { useClock } from '../hooks/useTelemetry';
import styles from './Home.module.css';

const BOOT: BootLine[] = [
  { label: 'discipline', value: 'Aerospace Eng / Final year' },
  { label: 'focus', value: 'Software · Spacecraft Technology · Systems' },
  { label: 'modules loaded', value: `${PROJECTS.length} / ${PROJECTS.length}` },
];

interface Entry {
  code: string;
  label: string;
  meta: string;
  to: string;
  kind: 'project' | 'page';
}

const ENTRIES: Entry[] = [
  { code: '01', label: 'About', meta: 'Background', to: '/about', kind: 'page' },
  { code: '02', label: 'Resume', meta: 'CV / PDF', to: '/resume', kind: 'page' },
  { code: '03', label: 'Contact', meta: 'Links', to: '/contact', kind: 'page' },
  ...PROJECTS.map((p, i) => ({
    code: `P/${String(i + 1).padStart(2, '0')}`,
    label: p.title,
    meta: p.domain,
    to: `/projects/${p.slug}`,
    kind: 'project' as const,
  })),
];

const DIRECT_KEYS = ENTRIES.length;

export default function Home() {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const { time } = useClock();
  const menuRef = useRef<HTMLElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [fits, setFits] = useState(true);

  useLayoutEffect(() => {
    const el = screenRef.current;
    if (!el) return;

    const check = () => setFits(el.scrollHeight <= el.clientHeight + 1);
    check();

    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const move = useCallback((delta: number) => {
    setSelected((s) => (s + delta + ENTRIES.length) % ENTRIES.length);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable) return;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === 'ArrowDown' || event.key === 'j') {
        event.preventDefault();
        move(1);
      } else if (event.key === 'ArrowUp' || event.key === 'k') {
        event.preventDefault();
        move(-1);
      } else if (event.key === 'Enter') {
        const entry = ENTRIES[selected];
        if (target?.tagName === 'A') return;
        event.preventDefault();
        navigate(entry.to);
      } else if (/^[1-9]$/.test(event.key)) {
        const index = Number(event.key) - 1;
        if (index < DIRECT_KEYS && ENTRIES[index]) {
          event.preventDefault();
          setSelected(index);
          navigate(ENTRIES[index].to);
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move, navigate, selected]);

  return (
    <div ref={screenRef} className={styles.screen} data-fits={fits ? '' : undefined}>
      <div className={`container ${styles.stage}`}>
        <section className={styles.console}>
          <header className={styles.consoleHead}>
            <span className={styles.pip} aria-hidden="true" />
            PORTFOLIO // STATUS
            <span className={styles.headRule} aria-hidden="true" />
            <span className={styles.headTime}>{time}</span>
          </header>

          <BootLines lines={BOOT} />

          <nav
            className={styles.menu}
            aria-label="Main"
            ref={menuRef}
            onMouseLeave={() => undefined}
          >
            {ENTRIES.map((entry, i) => (
              <Link
                key={entry.to}
                to={entry.to}
                className={`${styles.item} ${
                  entry.kind === 'project' ? styles.itemProject : ''
                }`}
                data-selected={i === selected ? '' : undefined}
                onMouseEnter={() => setSelected(i)}
                onFocus={() => setSelected(i)}
              >
                <span className={styles.itemBrackets} aria-hidden="true" />
                <span className={styles.itemCode}>[{entry.code}]</span>
                <span className={styles.itemLabel}>{entry.label}</span>
                <span className={styles.itemMeta}>{entry.meta}</span>
                <span className={styles.itemArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </nav>

          <p className={styles.hint}>
            <kbd>↑</kbd> <kbd>↓</kbd> select · <kbd>enter</kbd> open ·{' '}
            <kbd>1</kbd> to <kbd>{ENTRIES.length}</kbd> direct
          </p>
        </section>
      </div>

      <div className={`container ${styles.statusWrap}`}>
        <div className={styles.status}>
          <span className={styles.statusLead}>ONLINE</span>
          <span className={styles.statusRight}>
            OPEN TO 2026 GRADUATE ROLES / MSC
          </span>
          <Link to="/ai-transparency" className={styles.statusLink}>
            AI transparency →
          </Link>
        </div>
      </div>
    </div>
  );
}
