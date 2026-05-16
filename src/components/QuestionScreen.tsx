import { questionSessionSize } from '@/lib/questionSelection';
import type { Question } from '@/types/muu';
import { PixelCharacter } from './PixelCharacter';
import styles from './QuestionScreen.module.css';

type QuestionScreenProps = {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onSelect: (optionId: string) => void;
};

export function QuestionScreen({ question, questionIndex, totalQuestions, onSelect }: QuestionScreenProps) {
  return (
    <section className={styles.inventoryLayout}>
      <article className={styles.inventoryPanel}>
        <div className={styles.panelHeader}>
          <span>Muu Check {String(questionIndex + 1).padStart(2, '0')} / {questionSessionSize}</span>
          <span>ITEM SELECT</span>
        </div>
        <div className={styles.inventoryBody}>
          <div className={styles.questionCard}>
            <span className={styles.kicker}>QUESTION</span>
            <h2>{question.text}</h2>
          </div>
          <div className={styles.optionList}>
            {question.options.map((option) => (
              <button className={styles.optionButton} type="button" key={option.id} onClick={() => onSelect(option.id)}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </article>
      <aside className={styles.sidePanel}>
        <span className={styles.kicker}>STATUS</span>
        <PixelCharacter body={questionIndex % 2 === 0 ? 'overload' : 'wave'} mood="질문 안내" size="tiny" />
        <p>랜덤 질문 {totalQuestions}개만 진행합니다. 지금은 감정 아이템을 하나씩 고르는 단계입니다.</p>
        <div className={styles.miniSlots} aria-hidden="true">
          {Array.from({ length: questionSessionSize }).map((_, index) => (
            <span key={index} className={index <= questionIndex ? styles.filledSlot : undefined} />
          ))}
        </div>
      </aside>
    </section>
  );
}
