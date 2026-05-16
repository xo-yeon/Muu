import type { CSSProperties } from 'react';
import type { HumanResult, HumanTypeId, RewardItem } from '@/types/muu';
import { PixelAsset } from './PixelAsset';
import pixelAssetStyles from './PixelAsset.module.css';
import styles from './ResultScreen.module.css';

const characterAssetPaths: Record<HumanTypeId, string> = {
  overheatedPlanner: '/assets/characters/overheatedPlanner.png',
  quietBurnout: '/assets/characters/quietBurnout.png',
  futureBuffering: '/assets/characters/futureBuffering.png',
  survivalMode: '/assets/characters/survivalMode.png',
  dopamineScroller: '/assets/characters/dopamineScroller.png',
  unexpectedlyOkay: '/assets/characters/unexpectedlyOkay.png',
  emotionalWave: '/assets/characters/emotionalWave.png',
  softSystemOverload: '/assets/characters/softSystemOverload.png',
  excuseBlacksmith: '/assets/characters/excuseBlacksmith.png',
  procrastinationSlime: '/assets/characters/procrastinationSlime.png',
  anxietyWizard: '/assets/characters/anxietyWizard.png',
  dopamineGoblin: '/assets/characters/dopamineGoblin.png',
  planningMaxNewbie: '/assets/characters/planningMaxNewbie.png',
  emotionTank: '/assets/characters/emotionTank.png',
  realityEscapeAssassin: '/assets/characters/realityEscapeAssassin.png',
  rationalizationAlchemist: '/assets/characters/rationalizationAlchemist.png',
  blameSummoner: '/assets/characters/blameSummoner.png',
  paperArmorMental: '/assets/characters/paperArmorMental.png'
};

type ResultScreenProps = {
  result: HumanResult;
  analysisError: string | null;
  onRestart: () => void;
};

export function ResultScreen({ result, analysisError, onRestart }: ResultScreenProps) {
  const rewardItem = getRewardItem(result);
  const characterAssetPath = characterAssetPaths[result.id];
  const resultHeroStyle = {
    '--character-image': `url(${characterAssetPath})`
  } as CSSProperties;
  const forbiddenAction = result.forbiddenAction ?? '오늘은 새 핑계 만들기 금지. 이미 재료가 충분합니다.';
  const pattern = result.comparison ?? {
    label: '반복 패턴',
    summary: '이전 결과가 아직 없어서 비교는 대기 중입니다. 오늘 로그부터 기준점으로 저장됩니다.'
  };
  const stats = getDisplayStats(result);

  return (
    <section className={styles.resultStack}>
      <article className={styles.bookPanel}>
        <div className={styles.bookPage}>
          <div className={styles.bookTitle}>TODAY FILE</div>
          <header className={styles.titleGroup}>
            <span className={styles.kicker}>RESULT</span>
            <h1>{result.typeName}</h1>
            <p className={styles.weather}>감정 날씨: {result.emotionWeather}</p>
          </header>
          <div className={styles.statBlock}>
            {stats.map((stat) => (
              <div className={styles.statRow} key={stat.label}>
                <span>{stat.label}</span>
                <div className={styles.statCells} aria-label={`${stat.label} ${stat.value}/10`}>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <span className={index < stat.value ? styles.statCellFilled : undefined} key={index} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <section className={styles.layerList}>
            {result.statusSummary.map((item, index) => (
              <div className={styles.layerRow} key={item}>
                <span aria-hidden="true" />
                <p>Layer {String(index + 1).padStart(2, '0')} {item}</p>
              </div>
            ))}
          </section>
          <section className={styles.patternPanel}>
            <span>{pattern.label}</span>
            <p>{pattern.summary}</p>
          </section>
          <section className={styles.actionPanel}>
            <span>오늘의 인간 유지 행동</span>
            <p>{result.action}</p>
          </section>
          <section className={styles.forbiddenPanel}>
            <span>오늘의 금지 행동</span>
            <p>{forbiddenAction}</p>
          </section>
        </div>

        <div className={styles.bookPage}>
          <div className={styles.bookTitle}>CREATURE LOG</div>
          <div className={styles.heroCard}>
            <div className={styles.resultHero} style={resultHeroStyle} />
            <div className={styles.heroLabel}>
              <strong>{result.character.name}</strong>
              <small>{result.character.mood}</small>
            </div>
          </div>
          <section className={styles.factBubble}>
            <span>팩트 한 줄</span>
            <p>{result.factLine}</p>
          </section>
          <section className={styles.itemPanel}>
            <PixelAsset
              alt={rewardItem.name}
              fallback={<span className={pixelAssetStyles.itemFallback} aria-hidden="true" />}
              src={rewardItem.assetPath}
              variant="item"
            />
            <div>
              <span>획득 아이템</span>
              <strong>{rewardItem.name}</strong>
              <p>{rewardItem.description}</p>
            </div>
          </section>
          {result.aiObservation && (
            <section className={styles.aiPanel}>
              <h2>AI 관찰</h2>
              <p>{result.aiObservation}</p>
            </section>
          )}
          {analysisError && <p className={styles.inlineError}>{analysisError}</p>}
          <button className={styles.primaryButton} type="button" onClick={onRestart}>
            다시 하기
          </button>
        </div>
      </article>
    </section>
  );
}

function getRewardItem(result: HumanResult): RewardItem {
  return (
    result.rewardItem ?? {
      name: '임시 인간 유지 키트',
      description: '오래된 결과에도 지급되는 기본 아이템입니다. 일단 물부터 마시면 됩니다.'
    }
  );
}

function getDisplayStats(result: HumanResult) {
  return [
    { label: '에너지', value: clampStat(10 - result.scores.burnout) },
    { label: '사회성 배터리', value: clampStat(10 - result.scores.socialFatigue) },
    { label: '회복력', value: clampStat(result.scores.stability) },
    { label: '현실 회피력', value: clampStat(result.scores.avoidance) },
    { label: '자기돌봄 필요도', value: clampStat(Math.max(result.scores.burnout, result.scores.anxiety)) }
  ];
}

function clampStat(value: number) {
  return Math.max(1, Math.min(10, Math.round(value)));
}
