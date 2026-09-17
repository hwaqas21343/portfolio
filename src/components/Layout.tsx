import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from './Nav';
import { PROJECTS } from '../data/projects';
import { CONTACT } from '../data/contact';
import styles from './Layout.module.css';

const TITLES: Record<string, string> = {
  '/': 'Aerospace Engineering portfolio',
  '/projects': 'Projects',
  '/about': 'About',
  '/resume': 'Resume',
  '/contact': 'Contact',
  '/ai-transparency': 'AI transparency',
  ...Object.fromEntries(
    PROJECTS.map((p) => [`/projects/${p.slug}`, p.title] as const),
  ),
};

function RouteEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    const key = pathname.replace(/\/+$/, '') || '/';
    const page = TITLES[key];
    document.title = page
      ? `${page} · ${CONTACT.name}`
      : `Page not found · ${CONTACT.name}`;
  }, [pathname]);

  return null;
}

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className={styles.shell}>
      <a href="#main" className={`visually-hidden ${styles.skip}`}>
        Skip to content
      </a>

      <RouteEffects />
      <Nav />

      <main id="main" className={styles.main}>
        <div key={pathname} className={styles.page}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
