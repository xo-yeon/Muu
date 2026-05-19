import type { CSSProperties } from 'react';
import type { HumanResult, HumanTypeId, RewardItem } from '@/types/muu';
import { PixelAsset } from './PixelAsset';
import pixelAssetStyles from './PixelAsset.module.css';
import styles from './ResultScreen.module.css';

const uiText = {
  weather: '\uac10\uc815 \ub0a0\uc528',
  factLine: '\ud329\ud2b8 \ud55c \uc904',
  action: '\uc624\ub298\uc758 \uc778\uac04 \uc720\uc9c0 \ud589\ub3d9',
  forbiddenAction: '\uc624\ub298\uc758 \uae08\uc9c0 \ud589\ub3d9',
  rewardItem: '\ud68d\ub4dd \uc544\uc774\ud15c',
  aiObservation: 'AI \uad00\ucc30',
  restart: '\ub2e4\uc2dc \ud558\uae30',
  decisionLab: '\uc774 \uc0c1\ud0dc\ub85c \uacb0\uc815 \uc2e4\ud5d8\uc2e4',
  patternLabel: '\ubc18\ubcf5 \ud328\ud134',
  patternSummary:
    '\uc774\uc804 \uacb0\uacfc\uac00 \uc544\uc9c1 \uc5c6\uc5b4\uc11c \ube44\uad50\ub294 \ub300\uae30 \uc911\uc785\ub2c8\ub2e4. \uc624\ub298 \ub85c\uadf8\ubd80\ud130 \uae30\uc900\uc810\uc73c\ub85c \uc800\uc7a5\ub429\ub2c8\ub2e4.',
  fallbackForbidden:
    '\uc624\ub298\uc740 \uc0c8 \ud551\uacc4 \ub9cc\ub4e4\uae30 \uae08\uc9c0. \uc774\ubbf8 \uc7ac\ub8cc\uac00 \ucda9\ubd84\ud569\ub2c8\ub2e4.',
  fallbackItemName: '\uc784\uc2dc \uc778\uac04 \uc720\uc9c0 \ud0a4\ud2b8',
  fallbackItemDescription:
    '\uc624\ub798\ub41c \uacb0\uacfc\uc5d0\ub3c4 \uc9c0\uae09\ub418\ub294 \uae30\ubcf8 \uc544\uc774\ud15c\uc785\ub2c8\ub2e4. \uc77c\ub2e8 \ubb3c\ubd80\ud130 \ub9c8\uc2dc\uba74 \ub429\ub2c8\ub2e4.'
};

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
  onOpenDecisionLab: () => void;
  onRestart: () => void;
};

export function ResultScreen({ result, analysisError, onOpenDecisionLab, onRestart }: ResultScreenProps) {
  const rewardItem = getRewardItem(result);
  const characterAssetPath = characterAssetPaths[result.id];
  const resultHeroStyle = {
    '--character-image': `url(${characterAssetPath})`
  } as CSSProperties;
  const forbiddenAction = result.forbiddenAction ?? uiText.fallbackForbidden;
  const pattern = result.comparison ?? {
    label: uiText.patternLabel,
    summary: uiText.patternSummary
  };
  const stats = getDisplayStats(result);

  return (
    <section className={styles.resultStack}>
      <article className={styles.bookPanel}>
        <div className={styles.bookPage}>
          <div className={styles.bookTitle}>CREATURE LOG</div>
          <div className={styles.heroCard}>
            <div className={styles.resultHero} style={resultHeroStyle} />
          </div>
          <header className={styles.titleGroup}>
            <h1>{result.typeName}</h1>
            <small>{result.character.mood}</small>
            <p className={styles.weather}>
              {uiText.weather}: {result.emotionWeather}
            </p>
          </header>
          <section className={styles.factBubble}>
            <span>{uiText.factLine}</span>
            <p>{result.factLine}</p>
          </section>
          <section className={styles.actionPanel}>
            <span>{uiText.action}</span>
            <p>{result.action}</p>
          </section>
          <section className={styles.forbiddenPanel}>
            <span>{uiText.forbiddenAction}</span>
            <p>{forbiddenAction}</p>
          </section>
        </div>

        <div className={styles.bookPage}>
          <div className={styles.bookTitle}>TODAY FILE</div>
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
          <section className={styles.itemPanel}>
            <PixelAsset
              alt={rewardItem.name}
              fallback={<span className={pixelAssetStyles.itemFallback} aria-hidden="true" />}
              src={rewardItem.assetPath}
              variant="item"
            />
            <div>
              <span>{uiText.rewardItem}</span>
              <strong>{rewardItem.name}</strong>
              <p>{rewardItem.description}</p>
            </div>
          </section>
          {result.aiObservation && (
            <section className={styles.aiPanel}>
              <h2>{uiText.aiObservation}</h2>
              <p>{result.aiObservation}</p>
            </section>
          )}
          {analysisError && <p className={styles.inlineError}>{analysisError}</p>}
          <button className={styles.primaryButton} type="button" onClick={onRestart}>
            {uiText.restart}
          </button>
          <button className={styles.secondaryButton} type="button" onClick={onOpenDecisionLab}>
            {uiText.decisionLab}
          </button>
        </div>
      </article>
    </section>
  );
}

function getRewardItem(result: HumanResult): RewardItem {
  return (
    result.rewardItem ?? {
      name: uiText.fallbackItemName,
      description: uiText.fallbackItemDescription
    }
  );
}

function getDisplayStats(result: HumanResult) {
  return [
    { label: '\uc5d0\ub108\uc9c0', value: clampStat(10 - result.scores.burnout) },
    { label: '\uc0ac\ud68c\uc131 \ubc30\ud130\ub9ac', value: clampStat(10 - result.scores.socialFatigue) },
    { label: '\ud68c\ubcf5\ub825', value: clampStat(result.scores.stability) },
    { label: '\ud604\uc2e4 \ud68c\ud53c\ub825', value: clampStat(result.scores.avoidance) },
    { label: '\uc790\uae30\ub3cc\ubd04 \ud544\uc694\ub3c4', value: clampStat(Math.max(result.scores.burnout, result.scores.anxiety)) }
  ];
}

function clampStat(value: number) {
  return Math.max(1, Math.min(10, Math.round(value)));
}
