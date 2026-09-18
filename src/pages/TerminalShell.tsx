import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PROJECTS, type ProjectSlug } from '../data/projects';
import { useAudio } from '../hooks/useAudio';
import AboutPanel from '../components/terminal/panels/AboutPanel';
import ResumePanel from '../components/terminal/panels/ResumePanel';
import ContactPanel from '../components/terminal/panels/ContactPanel';
import { AdcsBrief, AdcsDemo } from '../components/terminal/panels/Adcs';
import { CageBrief, CageDemo } from '../components/terminal/panels/Cage';
import { OverseerBrief, OverseerDemo } from '../components/terminal/panels/Overseer';
import { FormulaStudentBrief, FormulaStudentDemo } from '../components/terminal/panels/FormulaStudent';
import { GasTurbineBrief, GasTurbineDemo } from '../components/terminal/panels/GasTurbine';
import styles from './TerminalShell.module.css';

type Level = 'root' | 'projects';
type Tab = 'brief' | 'demo';
type Focus = 'menu' | 'pane';

const ROOT = [
  { label: 'ABOUT', meta: "FINAL-YEAR AEROSPACE ENGINEERING · CITY ST GEORGE'S, UNIVERSITY OF LONDON" },
  { label: 'RESUME', meta: 'MODULES, ROLES AND THE FULL BACKGROUND · PDF AVAILABLE' },
  { label: 'CONTACT', meta: 'EMAIL · LINKEDIN · GITHUB · LONDON, UK' },
  { label: 'PROJECTS', meta: '05 ASSETS · PRESS ENTER TO OPEN', group: true },
] as const;

const DEMO_LABEL: Record<ProjectSlug, string> = {
  'adcs-simulator': 'DEMO',
  cage: 'DEMO',
  overseer: 'IMAGES',
  'formula-student': 'CAD VIEWER',
  'gas-turbine-ml': 'RESULTS',
};

const ROOT_PATHS = ['/about', '/resume', '/contact'] as const;

function pathForProject(index: number, tab: Tab) {
  const slug = PROJECTS[index].slug;
  return tab === 'demo' ? `/projects/${slug}?tab=demo` : `/projects/${slug}`;
}

function deriveFromLocation(pathname: string, search: string) {
  const projectMatch = pathname.match(/^\/projects\/([^/]+)/);

  if (pathname === '/projects' || projectMatch) {
    const slug = projectMatch?.[1];
    const idx = slug ? PROJECTS.findIndex((p) => p.slug === slug) : 0;
    const params = new URLSearchParams(search);
    return {
      level: 'projects' as Level,
      rootSel: 3,
      projSel: idx >= 0 ? idx : 0,
      tab: (params.get('tab') === 'demo' ? 'demo' : 'brief') as Tab,
    };
  }

  const rootIndex = ROOT_PATHS.indexOf(pathname as (typeof ROOT_PATHS)[number]);
  return {
    level: 'root' as Level,
    rootSel: rootIndex >= 0 ? rootIndex : 0,
    projSel: 0,
    tab: 'brief' as Tab,
  };
}

export default function TerminalShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { click, setHum } = useAudio();

  const initial = deriveFromLocation(location.pathname, location.search);
  const [level, setLevel] = useState<Level>(initial.level);
  const [rootSel, setRootSel] = useState(initial.rootSel);
  const [projSel, setProjSel] = useState(initial.projSel);
  const [tab, setTab] = useState<Tab>(initial.tab);
  const [focus, setFocus] = useState<Focus>('menu');
  const [ov, setOv] = useState(0);
  const [gt, setGt] = useState(0);
  const [hum, setHumOn] = useState(true);
  const [connTop, setConnTop] = useState(0);
  const [titleBottom, setTitleBottom] = useState(0);

  const folderColRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);

  // Sync local state from the URL (direct load, back/forward, or our own
  // replace navigations). Idempotent against navigate() calls below.
  useEffect(() => {
    const next = deriveFromLocation(location.pathname, location.search);
    setLevel(next.level);
    setRootSel(next.rootSel);
    setProjSel(next.projSel);
    setTab(next.tab);
  }, [location.pathname, location.search]);

  const project = PROJECTS[projSel];

  const gallery = useCallback((): 'ov' | 'gt' | null => {
    if (level !== 'projects' || tab !== 'demo') return null;
    if (project.slug === 'overseer') return 'ov';
    if (project.slug === 'gas-turbine-ml') return 'gt';
    return null;
  }, [level, tab, project.slug]);

  const highlightRoot = useCallback(
    (i: number) => {
      setRootSel(i);
      setFocus('menu');
      const path = ROOT_PATHS[i];
      if (path) navigate(path, { replace: true });
    },
    [navigate],
  );

  const highlightProject = useCallback(
    (i: number) => {
      setProjSel(i);
      setTab('brief');
      setFocus('menu');
      navigate(pathForProject(i, 'brief'), { replace: true });
    },
    [navigate],
  );

  const enterProjects = useCallback(() => {
    setLevel('projects');
    setProjSel(0);
    setTab('brief');
    setFocus('menu');
    navigate(pathForProject(0, 'brief'));
  }, [navigate]);

  const leaveProjects = useCallback(() => {
    setLevel('root');
    setRootSel(3);
    setFocus('menu');
  }, []);

  const move = useCallback(
    (d: number) => {
      if (level === 'root') {
        const n = ROOT.length;
        const next = (rootSel + d + n) % n;
        if (next === 3) {
          setRootSel(3);
          setFocus('menu');
        } else {
          highlightRoot(next);
        }
      } else {
        const n = PROJECTS.length;
        highlightProject((projSel + d + n) % n);
      }
    },
    [level, rootSel, projSel, highlightRoot, highlightProject],
  );

  const enter = useCallback(() => {
    if (level === 'root' && rootSel === 3) {
      enterProjects();
    } else if (focus === 'menu') {
      setFocus('pane');
    }
  }, [level, rootSel, focus, enterProjects]);

  const back = useCallback(() => {
    if (focus === 'pane') {
      setFocus('menu');
    } else if (level === 'projects') {
      leaveProjects();
    }
  }, [focus, level, leaveProjects]);

  const cycleGallery = useCallback(
    (d: number) => {
      const key = gallery();
      if (!key) return;
      click();
      if (key === 'ov') setOv((v) => (v + d + 3) % 3);
      else setGt((v) => (v + d + 3) % 3);
    },
    [gallery, click],
  );

  const scrollPane = useCallback((dir: number) => {
    const pane = paneRef.current;
    if (!pane) return;
    pane.scrollTop += dir * Math.max(90, pane.clientHeight * 0.4);
  }, []);

  const setTabAndNavigate = useCallback(
    (next: Tab) => {
      click();
      setTab(next);
      if (level === 'projects') navigate(pathForProject(projSel, next), { replace: true });
    },
    [click, level, projSel, navigate],
  );

  // ---- keyboard ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const inPane = focus === 'pane';

      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'j') {
        e.preventDefault();
        if (inPane && gallery()) cycleGallery(1);
        else if (inPane) scrollPane(1);
        else {
          click();
          move(1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'k') {
        e.preventDefault();
        if (inPane && gallery()) cycleGallery(-1);
        else if (inPane) scrollPane(-1);
        else {
          click();
          move(-1);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        click(true);
        enter();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        click(true);
        back();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (level === 'projects') {
          e.preventDefault();
          setTabAndNavigate(e.key === 'ArrowRight' ? 'demo' : 'brief');
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focus, level, gallery, cycleGallery, scrollPane, move, enter, back, click, setTabAndNavigate]);

  // ---- connector measurement ----
  const measureTitle = useCallback(() => {
    const el = titleRef.current;
    const parent = rightRef.current;
    if (!el || !parent) return;
    const pr = parent.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const bottom = r.bottom - pr.top;
    if (bottom > 0) setTitleBottom((prev) => (Math.abs(prev - bottom) > 1 ? bottom : prev));
  }, []);

  useLayoutEffect(() => {
    measureTitle();
    const raf = requestAnimationFrame(measureTitle);
    window.addEventListener('resize', measureTitle);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measureTitle);
    };
  }, [measureTitle, level, rootSel, projSel, tab]);

  const measureSelected = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const col = folderColRef.current;
    if (!col) return;
    const cr = col.getBoundingClientRect();
    let r = el.getBoundingClientRect();
    const itemTop = r.top - cr.top + col.scrollTop;
    if (itemTop < col.scrollTop) col.scrollTop = Math.max(0, itemTop - 10);
    else if (itemTop + r.height > col.scrollTop + col.clientHeight) {
      col.scrollTop = itemTop + r.height - col.clientHeight + 10;
    }
    r = el.getBoundingClientRect();
    const raw = r.top - cr.top + r.height / 2;
    const top = Math.min(Math.max(raw, 52), col.clientHeight - 6);
    setConnTop((prev) => (Math.abs(prev - top) > 1 ? top : prev));
  }, []);

  const toggleHum = useCallback(() => {
    const next = !hum;
    setHumOn(next);
    setHum(next);
  }, [hum, setHum]);

  // Hum defaults on. The AudioContext still won't actually produce sound
  // until the browser sees a user gesture, so this arms it immediately and
  // it becomes audible on the visitor's first click or keypress.
  useEffect(() => {
    setHum(true);
  }, [setHum]);

  // ---- render helpers ----
  const list = level === 'root' ? ROOT : PROJECTS;
  const dim = focus === 'pane';
  const line = dim ? 'var(--phosphor-pale)' : 'var(--white)';
  const anchor = (titleBottom > 0 ? titleBottom : 96) - 16;
  const down = connTop >= anchor;
  const legTop = down ? anchor : connTop;
  const legHeight = Math.max(2, Math.abs(connTop - anchor));

  const title = level === 'root' ? ROOT[rootSel].label : project.title.toUpperCase();
  const showTabs = level === 'projects';
  const demoLabel = level === 'projects' ? DEMO_LABEL[project.slug] : '';

  const galleryKind = gallery();
  const tabHint =
    focus === 'pane'
      ? galleryKind
        ? '↑ ↓ CHANGE IMAGE · BACKSPACE EXIT'
        : level === 'root'
          ? '↑ ↓ SCROLL · BACKSPACE EXIT'
          : '← → BRIEF / DEMO · BACKSPACE EXIT'
      : 'ENTER OPENS PANEL';

  const renderPane = () => {
    if (level === 'root') {
      if (rootSel === 0) return <AboutPanel />;
      if (rootSel === 1) return <ResumePanel />;
      if (rootSel === 2) return <ContactPanel />;
      return null;
    }

    if (tab === 'brief') {
      switch (project.slug) {
        case 'adcs-simulator':
          return <AdcsBrief />;
        case 'cage':
          return <CageBrief />;
        case 'overseer':
          return <OverseerBrief />;
        case 'formula-student':
          return <FormulaStudentBrief />;
        case 'gas-turbine-ml':
          return <GasTurbineBrief />;
        default:
          return null;
      }
    }

    switch (project.slug) {
      case 'adcs-simulator':
        return <AdcsDemo />;
      case 'cage':
        return <CageDemo />;
      case 'overseer':
        return <OverseerDemo index={ov} onPick={setOv} />;
      case 'formula-student':
        return <FormulaStudentDemo />;
      case 'gas-turbine-ml':
        return <GasTurbineDemo index={gt} onPick={setGt} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.desk}>
      <div className={styles.bezel}>
        <div className={styles.screen} onKeyDown={(e: ReactKeyboardEvent) => e.stopPropagation()}>
          <div className={styles.content}>
            <div className={styles.titleBar}>
              <span className={styles.titleBarName}>HAMZA WAQAS &nbsp;//&nbsp; AEROSPACE ENGINEERING</span>
              <span className={styles.spacer} />
              <span className={styles.humToggle} onClick={toggleHum}>
                {hum ? '◧ HUM ON' : '◧ HUM OFF'}
              </span>
              <span className={styles.titleBarDot} />
            </div>

            <div className={styles.grid}>
              <div className={styles.folderCol} ref={folderColRef}>
                <div className={styles.folderLabel}>{level === 'root' ? 'FOLDERS' : 'PROJECTS'}</div>

                {level === 'projects' ? (
                  <div className={styles.backRow} onClick={() => { click(true); leaveProjects(); }}>
                    ↰ BACK
                  </div>
                ) : null}

                {list.map((item, i) => {
                  const selected = level === 'root' ? i === rootSel : i === projSel;
                  const group = level === 'root' ? 'group' in item && item.group : false;
                  return (
                    <div
                      key={level === 'root' ? (item as (typeof ROOT)[number]).label : (item as (typeof PROJECTS)[number]).slug}
                      className={styles.folderItem}
                      data-selected={selected}
                      data-dimmed={dim}
                      data-group={group ? 'true' : undefined}
                      ref={selected ? measureSelected : undefined}
                      onClick={() => {
                        click(true);
                        if (level === 'root') {
                          if (i === 3) enterProjects();
                          else highlightRoot(i);
                        } else {
                          highlightProject(i);
                        }
                      }}
                      onMouseEnter={() => {
                        if (level === 'root') {
                          setRootSel(i);
                          setFocus('menu');
                          const path = ROOT_PATHS[i];
                          if (path) navigate(path, { replace: true });
                        } else {
                          highlightProject(i);
                        }
                      }}
                    >
                      {level === 'root' ? (item as (typeof ROOT)[number]).label : (item as (typeof PROJECTS)[number]).title.toUpperCase()}
                    </div>
                  );
                })}

                <div className={styles.folderFooter}>
                  REF 001794-26B
                  <br />
                  LONDON, UK
                </div>
              </div>

              <div className={styles.right} ref={rightRef}>
                <div
                  className={styles.connLeg}
                  style={{
                    top: legTop,
                    height: legHeight,
                    borderRight: `2px solid ${line}`,
                    borderBottom: down ? `2px solid ${line}` : undefined,
                    borderTop: down ? undefined : `2px solid ${line}`,
                  }}
                />
                <div className={styles.connStub} style={{ top: anchor, borderTop: `2px solid ${line}` }} />

                <div className={styles.titleBox} id="term-title" ref={titleRef}>
                  <span className={styles.titleBoxText}>{title}</span>
                </div>

                {showTabs ? (
                  <div className={styles.tabRow}>
                    <div className={styles.tab} data-active={tab === 'brief'} onClick={() => setTabAndNavigate('brief')}>
                      BRIEF
                    </div>
                    <div className={styles.tab} data-active={tab === 'demo'} onClick={() => setTabAndNavigate('demo')}>
                      {demoLabel}
                    </div>
                  </div>
                ) : null}

                <div className={styles.pane}>
                  <div className={styles.paneScroll} ref={paneRef}>
                    {renderPane()}
                  </div>
                  <div className={styles.paneRing} data-active={focus === 'pane'} />
                </div>
              </div>
            </div>

            <div className={styles.keybinds}>
              <span>↑ ↓ HIGHLIGHT</span>
              <span>ENTER SELECT</span>
              <span>{tabHint}</span>
              <span>ESC BACK</span>
              <span className={styles.easterEgg}>WY-2137</span>
            </div>

            <div className={styles.crt}>
              <div className={styles.crtScan} />
              <div className={styles.crtBloom} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
