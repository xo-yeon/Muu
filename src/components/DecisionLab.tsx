'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { generateDecisionAiMockComment } from '@/lib/decisionAiComment';
import { buildDecisionResult, defaultDecisionCriteria } from '@/lib/decisionLab';
import {
  decisionContextStorageKey,
  lastDecisionSessionStorageKey,
  parseDecisionContext
} from '@/lib/decisionHistory';
import { lastResultStorageKey, parseStoredResult } from '@/lib/resultHistory';
import type { DecisionContext, DecisionResult, DecisionSession, StoredDecisionLabResult } from '@/types/muu';
import { AppShell } from './AppShell';
import styles from './DecisionLab.module.css';

const maxTopicLength = 120;
const maxOptionLength = 60;

export function DecisionLab() {
  const [context] = useState<DecisionContext | null>(() => readInitialDecisionContext());
  const [topic, setTopic] = useState('');
  const [optionLabels, setOptionLabels] = useState(['', '']);
  const [session, setSession] = useState<DecisionSession | null>(null);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [completed, setCompleted] = useState(false);

  const validOptions = useMemo(
    () =>
      optionLabels
        .map((label) => label.trim())
        .filter(Boolean)
        .map((label, index) => ({
          id: `option-${index + 1}`,
          label
        })),
    [optionLabels]
  );
  const canCompare = topic.trim().length > 0 && validOptions.length >= 2;

  const compare = () => {
    if (!canCompare) {
      return;
    }

    const nextSession: DecisionSession = {
      id: `decision-${Date.now()}`,
      topic: topic.trim(),
      options: validOptions,
      criteria: defaultDecisionCriteria,
      sourceResult: context?.result ?? null,
      emotionTagIds: context?.emotionTagIds ?? [],
      freeText: context?.freeText ?? '',
      createdAt: new Date().toISOString()
    };
    const baseResult = buildDecisionResult(nextSession);
    const nextResult: DecisionResult = {
      ...baseResult,
      aiComment: generateDecisionAiMockComment(nextSession, baseResult)
    };
    const stored: StoredDecisionLabResult = {
      savedAt: new Date().toISOString(),
      session: nextSession,
      result: nextResult
    };

    window.localStorage.setItem(lastDecisionSessionStorageKey, JSON.stringify(stored));
    setSession(nextSession);
    setResult(nextResult);
    setCompleted(false);
  };

  return (
    <AppShell isHome={false}>
      <header className={styles.header}>
        <Link className={styles.backLink} href="/">
          ◀
        </Link>
        <div>
          <span className={styles.kicker}>DECISION LAB</span>
          <h1>결정 실험실</h1>
        </div>
        <span className={styles.statusChip}>{context?.result ? context.result.typeName : '중립 상태'}</span>
      </header>

      {!result || !session ? (
        <DecisionInput
          canCompare={canCompare}
          context={context}
          optionLabels={optionLabels}
          topic={topic}
          onAddOption={() => setOptionLabels((current) => (current.length < 4 ? [...current, ''] : current))}
          onCompare={compare}
          onOptionChange={(index, value) =>
            setOptionLabels((current) => current.map((label, currentIndex) => (currentIndex === index ? value : label)))
          }
          onRemoveOption={(index) =>
            setOptionLabels((current) => (current.length > 2 ? current.filter((_, currentIndex) => currentIndex !== index) : current))
          }
          onTopicChange={setTopic}
        />
      ) : (
        <DecisionResultView
          completed={completed}
          result={result}
          session={session}
          onComplete={() => setCompleted(true)}
          onReset={() => {
            setResult(null);
            setSession(null);
            setCompleted(false);
          }}
        />
      )}
    </AppShell>
  );
}

function DecisionInput({
  canCompare,
  context,
  optionLabels,
  topic,
  onAddOption,
  onCompare,
  onOptionChange,
  onRemoveOption,
  onTopicChange
}: {
  canCompare: boolean;
  context: DecisionContext | null;
  optionLabels: string[];
  topic: string;
  onAddOption: () => void;
  onCompare: () => void;
  onOptionChange: (index: number, value: string) => void;
  onRemoveOption: (index: number) => void;
  onTopicChange: (value: string) => void;
}) {
  return (
    <section className={styles.workspace}>
      <article className={styles.labPanel}>
        <div className={styles.labImage} aria-hidden="true" />
        <span className={styles.kicker}>CURRENT FILE</span>
        <h2>지금 상태로 선택지를 비교합니다</h2>
        <p>
          {context?.result
            ? `${context.result.typeName}, ${context.result.emotionWeather} 기준으로 계산합니다.`
            : '최근 결과가 없어서 중립 상태로 계산합니다.'}
        </p>
      </article>

      <section className={styles.formPanel}>
        <label className={styles.fieldLabel} htmlFor="decision-topic">
          고민 주제
        </label>
        <textarea
          id="decision-topic"
          className={styles.topicInput}
          maxLength={maxTopicLength}
          placeholder="예: 오늘 포폴 할까, 그냥 쉴까?"
          value={topic}
          onChange={(event) => onTopicChange(event.target.value)}
        />
        <span className={styles.count}>{topic.length}/{maxTopicLength}</span>

        <div className={styles.optionHeader}>
          <span className={styles.fieldLabel}>선택지</span>
          <button className={styles.smallButton} type="button" disabled={optionLabels.length >= 4} onClick={onAddOption}>
            + 추가
          </button>
        </div>

        <div className={styles.optionList}>
          {optionLabels.map((label, index) => (
            <div className={styles.optionRow} key={`decision-option-${index + 1}`}>
              <input
                aria-label={`선택지 ${index + 1}`}
                maxLength={maxOptionLength}
                placeholder={index === 0 ? '포폴 문장 하나 수정하기' : index === 1 ? '오늘은 쉬기' : '선택지 입력'}
                value={label}
                onChange={(event) => onOptionChange(index, event.target.value)}
              />
              <button
                aria-label={`선택지 ${index + 1} 삭제`}
                className={styles.iconButton}
                type="button"
                disabled={optionLabels.length <= 2}
                onClick={() => onRemoveOption(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button className={styles.primaryButton} type="button" disabled={!canCompare} onClick={onCompare}>
          비교하기
        </button>
      </section>
    </section>
  );
}

function DecisionResultView({
  completed,
  result,
  session,
  onComplete,
  onReset
}: {
  completed: boolean;
  result: DecisionResult;
  session: DecisionSession;
  onComplete: () => void;
  onReset: () => void;
}) {
  const recommended = session.options.find((option) => option.id === result.recommendedOptionId);
  const avoid = session.options.find((option) => option.id === result.avoidOptionId);
  const maxScore = Math.max(...result.optionScores.map((score) => score.weightedTotal));

  return (
    <section className={styles.resultGrid}>
      <article className={styles.recommendPanel}>
        <span className={styles.kicker}>RECOMMENDED</span>
        <h2>{recommended?.label ?? '추천 선택지'}</h2>
        <p>{result.reason}</p>
      </article>

      <section className={styles.factPanel}>
        <span>팩트 한 줄</span>
        <p>{result.factLine}</p>
      </section>

      <section className={styles.scorePanel}>
        <h2>선택지별 점수 비교</h2>
        {result.optionScores.map((score) => {
          const option = session.options.find((item) => item.id === score.optionId);
          const width = `${Math.max(8, (score.weightedTotal / maxScore) * 100)}%`;

          return (
            <article className={styles.scoreRow} key={score.optionId}>
              <div>
                <strong>{option?.label}</strong>
                <span>{score.weightedTotal.toFixed(1)}점</span>
              </div>
              <div className={styles.scoreTrack} aria-label={`${option?.label} ${score.weightedTotal.toFixed(1)}점`}>
                <span style={{ width }} />
              </div>
              <small>{score.flags.length > 0 ? score.flags.join(' · ') : '특이 신호 없음'}</small>
            </article>
          );
        })}
      </section>

      <section className={styles.avoidPanel}>
        <span>지금은 하지 않는 게 좋은 선택</span>
        <strong>{avoid?.label ?? '뚜렷한 위험 선택 없음'}</strong>
        <p>{result.avoidReason}</p>
      </section>

      {result.aiComment && (
        <section className={styles.memoPanel}>
          <h2>AI mock 코멘트</h2>
          <p>{result.aiComment}</p>
        </section>
      )}

      {completed && <p className={styles.doneMessage}>선택 완료. 이제 이 선택을 아주 작게 실행하면 됩니다.</p>}

      <div className={styles.actionRow}>
        <button className={styles.primaryButton} type="button" onClick={onComplete}>
          선택 완료
        </button>
        <button className={styles.secondaryButton} type="button" onClick={onReset}>
          다시 비교하기
        </button>
      </div>
    </section>
  );
}

function readInitialDecisionContext(): DecisionContext | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedContext = parseDecisionContext(window.localStorage.getItem(decisionContextStorageKey));

  if (storedContext) {
    return storedContext;
  }

  const lastResult = parseStoredResult(window.localStorage.getItem(lastResultStorageKey));

  if (!lastResult) {
    return null;
  }

  return {
    result: lastResult.result,
    emotionTagIds: lastResult.submission.emotionTagIds,
    freeText: lastResult.submission.freeText,
    savedAt: lastResult.savedAt
  };
}
