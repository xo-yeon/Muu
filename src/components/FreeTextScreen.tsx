import styles from './FreeTextScreen.module.css';

type FreeTextScreenProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isAnalyzing: boolean;
  error: string | null;
};

export function FreeTextScreen({ value, onChange, onSubmit, isAnalyzing, error }: FreeTextScreenProps) {
  return (
    <section className={styles.inventoryLayout}>
      <article className={styles.inventoryPanel}>
        <div className={styles.panelHeader}>
          <span>Memo Layer</span>
          <span>AI EXTRA</span>
        </div>
        <div className={styles.inventoryBody}>
          <div className={styles.questionCard}>
            <span className={styles.kicker}>OPTIONAL MEMO</span>
            <h2>오늘 상태를 한 줄로 남길까요?</h2>
            <p>비워도 결과는 나옵니다. 쓰면 OpenAI가 보조 관찰 문구를 추가합니다.</p>
          </div>
          <textarea
            className={styles.memo}
            value={value}
            maxLength={300}
            onChange={(event) => onChange(event.target.value)}
            placeholder="지금 상황을 조금만 더 적어줘. 내가 더 세게 봐줄게."
          />
          <span className={styles.memoCount}>{value.length}/300</span>
        </div>
      </article>
      <aside className={styles.sidePanel}>
        <span className={styles.kicker}>RESULT READY</span>
        <p>기본 결과는 룰 기반으로 고정됩니다. 메모는 타입을 바꾸지 않고 추가 관찰에만 붙습니다.</p>
        {error && <p className={styles.inlineError}>{error}</p>}
        <button className={styles.primaryButton} type="button" disabled={isAnalyzing} onClick={onSubmit}>
          {isAnalyzing ? '분석 중...' : '결과 보기'}
        </button>
      </aside>
    </section>
  );
}
