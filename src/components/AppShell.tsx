import type { ReactNode } from 'react';
import styles from './AppShell.module.css';

type AppShellProps = {
  children: ReactNode;
  isHome: boolean;
};

export function AppShell({ children, isHome }: AppShellProps) {
  return (
    <main className={`${styles.shell} ${isHome ? styles.atTop : ''}`}>
      <div className={styles.backgroundSprites} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.contentContainer}>{children}</div>
    </main>
  );
}
