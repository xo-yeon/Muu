import Link from 'next/link';
import type { StoredMuuResult } from '@/types/muu';
import { PixelAsset } from './PixelAsset';
import { PixelCharacter } from './PixelCharacter';
import styles from './HomeScreen.module.css';

type HomeScreenProps = {
  historyCount: number;
  lastResult: StoredMuuResult | null;
  onStart: () => void;
  onRestore: () => void;
};

export function HomeScreen({ historyCount, lastResult, onStart, onRestore }: HomeScreenProps) {
  return (
    <section className={styles.home}>
      <div className={styles.logoRow}>
        <PixelAsset
          alt="홈 도트 캐릭터"
          fallback={<PixelCharacter body="stable" mood="홈 캐릭터" size="small" />}
          src="/assets/characters/main.png"
          variant="home"
        />
        <span className={styles.logoText}>Muu</span>
        <span className={styles.logoBadge}>COZY PIXEL REPORT</span>
      </div>
      <div className={styles.roadmapBoard}>
        <article className={`${styles.roadmapCard} ${styles.primaryRoadmap}`}>
          <span className={styles.kicker}>NEXT MUU</span>
          <h1>오늘의 인간 상태를 분석합니다</h1>
          <p>귀여운 도트 너머, 현실적인 오늘의 기록을 담습니다.</p>
          <div className={styles.roadmapSection}>
            <span>Quest 01</span>
            <strong>12개 질문으로 상태 파일 만들기</strong>
          </div>
          <div className={styles.roadmapSection}>
            <span>Quest 02</span>
            <strong>감정 태그와 한 줄 메모 붙이기</strong>
          </div>
          <button className={styles.primaryButton} type="button" onClick={onStart}>
            시작하기
          </button>
          <Link className={styles.secondaryLink} href="/decision-lab">
            결정 실험실
          </Link>
        </article>

        {lastResult ? (
          <button className={`${styles.roadmapCard} ${styles.secondaryRoadmap}`} type="button" onClick={onRestore}>
            <span className={styles.kicker}>TODAY FILE</span>
            <strong>{lastResult.result.typeName}</strong>
            <p>{lastResult.result.factLine}</p>
            {historyCount >= 2 && <em>최근 인간 기록 {historyCount}개 저장 중</em>}
            <small>{formatSavedDate(lastResult.savedAt)} 저장됨</small>
          </button>
        ) : (
          <div className={`${styles.roadmapCard} ${styles.secondaryRoadmap}`}>
            <span className={styles.kicker}>TODAY FILE</span>
            <strong>최근 결과 없음</strong>
            <p>아직 저장된 인간 표본이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function formatSavedDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}
