import { useCallback, useEffect, useId, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PROJECTS, getProject, type ProjectSlug } from '../data/projects';
import { useClock } from '../hooks/useTelemetry';
import styles from './ProjectPage.module.css';

interface ProjectPageProps {
  slug: ProjectSlug;
  summary: ReactNode;
  showcase: ReactNode;
  showcaseLabel?: string;
  deepDive: ReactNode;
}

export default function ProjectPage({
  slug,
  summary,
  showcase,
  showcaseLabel,
  deepDive,
}: ProjectPageProps) {
  const project = getProject(slug);
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const previous = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  const navigate = useNavigate();
  const { time } = useClock();
  const baseId = useId();

  const channels = [
    { code: '01', label: 'Brief', body: summary },
    {
      code: '02',
      label: showcaseLabel ?? (project.mode === 'interactive' ? 'Demo' : 'Media'),
      body: showcase,
    },
    { code: '03', label: 'Technical', body: deepDive },
  ];

  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState<number[]>([0]);

  const [renderedSlug, setRenderedSlug] = useState(slug);
  if (renderedSlug !== slug) {
    setRenderedSlug(slug);
    setActive(0);
    setMounted([0]);
  }

  const selectChannel = useCallback((index: number) => {
    setActive(index);
    setMounted((m) => (m.includes(index) ? m : [...m, index]));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable) return;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (/^[1-9]$/.test(event.key)) {
        const i = Number(event.key) - 1;
        if (i < channels.length) {
          event.preventDefault();
          selectChannel(i);
        }
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigate(`/projects/${previous.slug}`);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigate(`/projects/${next.slug}`);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [channels.length, navigate, next.slug, previous.slug, selectChannel]);

  return (
    <div className={`container ${styles.wrap}`}>
      <header className={styles.bar}>
        <Link to="/projects" className={styles.barBack}>
          ← Index
        </Link>

        <span className={styles.barCode}>
          P/{String(index + 1).padStart(2, '0')}
        </span>

        <span className={styles.barTitle}>{project.title}</span>

        <span className={styles.barRule} aria-hidden="true" />
        <span className={styles.barTime}>{time}</span>

        <nav className={styles.pager} aria-label="Adjacent projects">
          <Link
            to={`/projects/${previous.slug}`}
            className={styles.pagerBtn}
            title={previous.title}
          >
            ◀ Prev
          </Link>
          <Link
            to={`/projects/${next.slug}`}
            className={styles.pagerBtn}
            title={next.title}
          >
            Next ▶
          </Link>
        </nav>
      </header>

      <div className={styles.body}>
        <aside className={styles.rail}>
          <div className={styles.channels} role="tablist" aria-label="Sections">
            {channels.map((channel, i) => (
              <button
                key={channel.code}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`${baseId}-panel-${i}`}
                tabIndex={i === active ? 0 : -1}
                className={styles.channel}
                data-active={i === active ? '' : undefined}
                onClick={() => selectChannel(i)}
              >
                <span className={styles.channelBrackets} aria-hidden="true" />
                <span className={styles.channelCode}>[{channel.code}]</span>
                <span className={styles.channelLabel}>{channel.label}</span>
              </button>
            ))}
          </div>

          <dl className={styles.meta}>
            <div className={styles.metaRow}>
              <dt>Domain</dt>
              <dd>{project.domain}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt>Period</dt>
              <dd>{project.period}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt>Mode</dt>
              <dd className={project.mode === 'interactive' ? styles.live : ''}>
                {project.mode === 'interactive' ? 'Interactive' : 'Static'}
              </dd>
            </div>
          </dl>

          <ul className={styles.stack}>
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <p className={styles.railHint}>
            <kbd>1</kbd>–<kbd>3</kbd> channel · <kbd>←</kbd> <kbd>→</kbd> project
          </p>
        </aside>

        <div className={styles.panelStack}>
          {channels.map((channel, i) =>
            mounted.includes(i) ? (
              <section
                key={channel.code}
                className={styles.panel}
                role="tabpanel"
                id={`${baseId}-panel-${i}`}
                aria-labelledby={`${baseId}-tab-${i}`}
                tabIndex={-1}
                hidden={i !== active}
              >
                <header className={styles.panelHead}>
                  <h1 className={styles.panelTitle}>{channel.label}</h1>
                  <span className={styles.panelSub}>{project.subtitle}</span>
                </header>

                <div className={styles.panelBody}>{channel.body}</div>
              </section>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
