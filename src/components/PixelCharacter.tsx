import styles from './PixelCharacter.module.css';

type PixelCharacterProps = {
  body: string;
  mood: string;
  size: 'tiny' | 'small' | 'large';
};

export function PixelCharacter({ body, mood, size }: PixelCharacterProps) {
  return (
    <div className={`${styles.pixelCharacter} ${styles[size]} ${styles[body]}`} role="img" aria-label={mood}>
      <span className={styles.eyeLeft} />
      <span className={styles.eyeRight} />
      <span className={styles.mouth} />
    </div>
  );
}
