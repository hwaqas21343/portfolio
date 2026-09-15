import { useEffect, useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import styles from './Nav.module.css';

const LINKS = [
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/resume', label: 'Resume' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      if (y < 80) {
        setHidden(false);
      } else if (y > lastY.current + 4) {
        setHidden(true);
      } else if (y < lastY.current - 4) {
        setHidden(false);
      }

      lastY.current = y;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={styles.header} data-hidden={hidden ? '' : undefined}>
      <nav className={`container ${styles.inner}`} aria-label="Primary">
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true" />
          Hamza Waqas
        </Link>

        <p className={styles.readout} aria-hidden="true">
          <span className={styles.pip} />
          Aero / GNC
        </p>

        <ul className={styles.links}>
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.linkActive}` : styles.link
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              className={styles.link}
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? 'Too dark?' : 'Too bright?'}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
