import { emotionTags } from '@/data/questions';
import styles from './EmotionScreen.module.css';

type EmotionScreenProps = {
  selectedIds: string[];
  onToggle: (tagId: string) => void;
  onNext: () => void;
};

export function EmotionScreen({ selectedIds, onToggle, onNext }: EmotionScreenProps) {
  return (
    <section className={styles.inventoryLayout}>
      <article className={styles.inventoryPanel}>
        <div className={styles.panelHeader}>
          <span>Emotion Inventory</span>
          <span>{selectedIds.length} SELECTED</span>
        </div>
        <div className={styles.inventoryBody}>
          <div className={styles.questionCard}>
            <span className={styles.kicker}>EMOTION TAGS</span>
            <h2>지금 감정 태그를 골라주세요</h2>
            <p>최소 1개는 골라야 합니다. 여러 개 골라도 됩니다.</p>
          </div>
          <div className={styles.tagGrid}>
            {emotionTags.map((tag) => {
              const selected = selectedIds.includes(tag.id);

              return (
                <button
                  aria-pressed={selected}
                  className={styles.tagButton}
                  type="button"
                  key={tag.id}
                  onClick={() => onToggle(tag.id)}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>
      </article>
      <aside className={styles.sidePanel}>
        <span className={styles.kicker}>BRUSH TIP</span>
        <p>색이 많을수록 결과가 부드러워지는 건 아닙니다. 지금 제일 거슬리는 감정부터 고르세요.</p>
        <button className={styles.primaryButton} type="button" disabled={selectedIds.length === 0} onClick={onNext}>
          다음
        </button>
      </aside>
    </section>
  );
}
