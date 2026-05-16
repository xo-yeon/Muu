import styles from './TopBar.module.css';

type TopBarProps = {
  counterLabel: string;
  progress: number;
  onBack: () => void;
};

export function TopBar({ counterLabel, progress, onBack }: TopBarProps) {
  return (
    <header className={styles.header}>
      <button className={styles.iconButton} type="button" onClick={onBack} aria-label="이전으로">
        ◀
      </button>
      <div className={styles.headerCenter}>
        <span className={styles.miniLabel}>Muu 상태 체크</span>
        <div className={styles.progressTrack} aria-label={`진행률 ${Math.round(progress)}%`}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <span className={styles.counter}>{counterLabel}</span>
    </header>
  );
}
