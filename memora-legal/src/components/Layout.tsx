import type { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import styles from './Layout.module.css';

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.logo} aria-hidden="true">
              M
            </span>
            <div>
              <p className={styles.brandName}>Memora AI</p>
              <p className={styles.brandTagline}>Legal</p>
            </div>
          </div>
          <nav className={styles.nav} aria-label="Legal pages">
            <NavLink
              to="/privacy"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
            >
              Privacy Policy
            </NavLink>
            <NavLink
              to="/terms"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
            >
              Terms of Service
            </NavLink>
          </nav>
        </div>
      </header>

      <main className={styles.main}>{children ?? <Outlet />}</main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Memora AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
