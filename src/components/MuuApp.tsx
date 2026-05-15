'use client';

import Image from 'next/image';
import { useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { emotionTags, questions } from '@/data/questions';
import { analyzeHumanState } from '@/lib/analysis';
import { questionSessionSize, selectRandomQuestions } from '@/lib/questionSelection';
import { buildResultComparison } from '@/lib/resultComparison';
import {
  buildNextResultHistory,
  lastResultStorageKey,
  parseResultHistory,
  parseStoredResult,
  resultHistoryStorageKey
} from '@/lib/resultHistory';
import type { HumanResult, MuuAnswer, MuuSubmission, RewardItem, StoredMuuResult } from '@/types/muu';
import styles from './MuuApp.module.css';

type Step = 'home' | 'questions' | 'emotions' | 'freeText' | 'result';

export function MuuApp() {
  const [step, setStep] = useState<Step>('home');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState(() => selectRandomQuestions(questions));
  const [answers, setAnswers] = useState<MuuAnswer[]>([]);
  const [emotionTagIds, setEmotionTagIds] = useState<string[]>([]);
  const [freeText, setFreeText] = useState('');
  const [result, setResult] = useState<HumanResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const persistedResultJson = useStoredValue(lastResultStorageKey);
  const persistedHistoryJson = useStoredValue(resultHistoryStorageKey);
  const persistedResult = useMemo(() => parseStoredResult(persistedResultJson), [persistedResultJson]);
  const persistedHistory = useMemo(() => parseResultHistory(persistedHistoryJson), [persistedHistoryJson]);
  const [lastResultOverride, setLastResultOverride] = useState<StoredMuuResult | null>(null);
  const [historyOverride, setHistoryOverride] = useState<StoredMuuResult[] | null>(null);
  const lastResult = lastResultOverride ?? persistedResult;
  const resultHistory = historyOverride ?? persistedHistory;

  const progress = useMemo(() => {
    if (step === 'questions') {
      return ((questionIndex + 1) / selectedQuestions.length) * 100;
    }

    if (step === 'emotions') {
      return 94;
    }

    if (step === 'freeText') {
      return 98;
    }

    if (step === 'result') {
      return 100;
    }

    return 0;
  }, [questionIndex, selectedQuestions.length, step]);

  const start = () => {
    setSelectedQuestions(selectRandomQuestions(questions));
    setStep('questions');
    setQuestionIndex(0);
    setAnswers([]);
    setEmotionTagIds([]);
    setFreeText('');
    setResult(null);
    setAnalysisError(null);
  };

  const selectOption = (optionId: string) => {
    const question = selectedQuestions[questionIndex];
    const nextAnswers = [...answers.filter((answer) => answer.questionId !== question.id), { questionId: question.id, optionId }];
    setAnswers(nextAnswers);

    if (questionIndex < selectedQuestions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    setStep('emotions');
  };

  const goBack = () => {
    if (step === 'questions' && questionIndex > 0) {
      setQuestionIndex((current) => current - 1);
      return;
    }

    if (step === 'emotions') {
      setStep('questions');
      setQuestionIndex(selectedQuestions.length - 1);
      return;
    }

    if (step === 'freeText') {
      setStep('emotions');
      return;
    }

    setStep('home');
  };

  const toggleEmotion = (tagId: string) => {
    setEmotionTagIds((current) =>
      current.includes(tagId) ? current.filter((item) => item !== tagId) : [...current, tagId]
    );
  };

  const buildResult = async () => {
    const submission: MuuSubmission = {
      answers,
      emotionTagIds,
      freeText
    };
    const previousHistory = parseResultHistory(window.localStorage.getItem(resultHistoryStorageKey));
    const previousResult = previousHistory[0]?.result ?? lastResult?.result;
    const nextResult = analyzeHumanState(submission);
    const comparison = buildResultComparison(nextResult, previousResult);
    setIsAnalyzing(true);
    setAnalysisError(null);

    const aiResponse = await fetchAiObservation(submission);
    const resultWithAi: HumanResult = {
      ...nextResult,
      comparison,
      aiObservation: aiResponse.aiObservation ?? undefined
    };
    const stored: StoredMuuResult = {
      savedAt: new Date().toISOString(),
      submission,
      result: resultWithAi
    };
    const nextHistory = buildNextResultHistory(stored, previousHistory);

    window.localStorage.setItem(lastResultStorageKey, JSON.stringify(stored));
    window.localStorage.setItem(resultHistoryStorageKey, JSON.stringify(nextHistory));
    setResult(resultWithAi);
    setLastResultOverride(stored);
    setHistoryOverride(nextHistory);
    setAnalysisError(aiResponse.error ?? null);
    setIsAnalyzing(false);
    setStep('result');
  };

  const restoreLast = () => {
    if (!lastResult) {
      return;
    }

    setAnswers(lastResult.submission.answers);
    setEmotionTagIds(lastResult.submission.emotionTagIds);
    setFreeText(lastResult.submission.freeText);
    setResult(lastResult.result);
    setStep('result');
  };

  return (
    <main className={styles.shell}>
      <div className={styles.backgroundSprites} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      {step !== 'home' && (
        <header className={styles.header}>
          <button className={styles.iconButton} type="button" onClick={goBack} aria-label="이전으로">
            ◀
          </button>
          <div className={styles.headerCenter}>
            <span className={styles.miniLabel}>Muu 상태 체크</span>
            <div className={styles.progressTrack} aria-label={`진행률 ${Math.round(progress)}%`}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>
          <span className={styles.counter}>
            {step === 'questions' ? `${questionIndex + 1}/${selectedQuestions.length}` : step === 'result' ? '완료' : '마감'}
          </span>
        </header>
      )}

      {step === 'home' && (
        <HomeScreen
          historyCount={resultHistory.length}
          lastResult={lastResult}
          onStart={start}
          onRestore={restoreLast}
        />
      )}
      {step === 'questions' && (
        <QuestionScreen
          question={selectedQuestions[questionIndex]}
          questionIndex={questionIndex}
          totalQuestions={selectedQuestions.length}
          onSelect={selectOption}
        />
      )}
      {step === 'emotions' && (
        <EmotionScreen selectedIds={emotionTagIds} onToggle={toggleEmotion} onNext={() => setStep('freeText')} />
      )}
      {step === 'freeText' && (
        <FreeTextScreen
          value={freeText}
          onChange={setFreeText}
          onSubmit={buildResult}
          isAnalyzing={isAnalyzing}
          error={analysisError}
        />
      )}
      {step === 'result' && result && <ResultScreen result={result} analysisError={analysisError} onRestart={start} />}
    </main>
  );
}

function HomeScreen({
  historyCount,
  lastResult,
  onStart,
  onRestore
}: {
  historyCount: number;
  lastResult: StoredMuuResult | null;
  onStart: () => void;
  onRestore: () => void;
}) {
  return (
    <section className={styles.home}>
      <div className={styles.logoRow}>
        <PixelAsset
          alt="홈 도트 캐릭터"
          className={styles.homeGif}
          fallback={<PixelCharacter body="stable" mood="홈 캐릭터" size="small" />}
          src="/assets/characters/home.gif"
        />
        <span className={styles.logoText}>Muu</span>
      </div>
      <div className={styles.heroCard}>
        <span className={styles.kicker}>TODAY HUMAN STATUS</span>
        <h1>오늘의 인간 상태를 분석합니다</h1>
        <p>귀여운 화면에 속지 마세요. 결과는 꽤 현실적으로 말합니다.</p>
        <button className={styles.primaryButton} type="button" onClick={onStart}>
          시작하기
        </button>
      </div>

      {lastResult ? (
        <button className={styles.recentCard} type="button" onClick={onRestore}>
          <span>최근 결과</span>
          <strong>{lastResult.result.typeName}</strong>
          {historyCount >= 2 && <em>최근 인간 기록 {historyCount}개 저장 중</em>}
          <small>{formatSavedDate(lastResult.savedAt)} 저장됨</small>
        </button>
      ) : (
        <div className={styles.emptyRecent}>
          <span>최근 결과 없음</span>
          <p>아직 저장된 인간 표본이 없습니다.</p>
        </div>
      )}
    </section>
  );
}

function QuestionScreen({
  question,
  questionIndex,
  totalQuestions,
  onSelect
}: {
  question: (typeof questions)[number];
  questionIndex: number;
  totalQuestions: number;
  onSelect: (optionId: string) => void;
}) {
  return (
    <section className={styles.stack}>
      <article className={styles.questionCard}>
        <span className={styles.kicker}>
          QUESTION {String(questionIndex + 1).padStart(2, '0')} / {questionSessionSize}
        </span>
        <h2>{question.text}</h2>
        <PixelCharacter body={questionIndex % 2 === 0 ? 'overload' : 'wave'} mood="질문 안내" size="tiny" />
      </article>
      <div className={styles.optionList}>
        {question.options.map((option) => (
          <button className={styles.optionButton} type="button" key={option.id} onClick={() => onSelect(option.id)}>
            {option.label}
          </button>
        ))}
      </div>
      <span className={styles.memoCount}>랜덤 질문 {totalQuestions}개만 진행합니다</span>
    </section>
  );
}

function EmotionScreen({
  selectedIds,
  onToggle,
  onNext
}: {
  selectedIds: string[];
  onToggle: (tagId: string) => void;
  onNext: () => void;
}) {
  return (
    <section className={styles.stack}>
      <article className={styles.questionCard}>
        <span className={styles.kicker}>EMOTION TAGS</span>
        <h2>지금 감정 태그를 골라주세요</h2>
        <p>최소 1개는 골라야 합니다. 여러 개 골라도 됩니다.</p>
      </article>
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
      <button className={styles.primaryButton} type="button" disabled={selectedIds.length === 0} onClick={onNext}>
        다음
      </button>
    </section>
  );
}

function FreeTextScreen({
  value,
  onChange,
  onSubmit,
  isAnalyzing,
  error
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isAnalyzing: boolean;
  error: string | null;
}) {
  return (
    <section className={styles.stack}>
      <article className={styles.questionCard}>
        <span className={styles.kicker}>OPTIONAL MEMO</span>
        <h2>오늘 상태를 한 줄로 남길까요?</h2>
        <p>비워도 결과는 나옵니다. 쓰면 OpenAI가 보조 관찰 문구를 추가합니다.</p>
      </article>
      <textarea
        className={styles.memo}
        value={value}
        maxLength={300}
        onChange={(event) => onChange(event.target.value)}
        placeholder="예: 할 일은 많은데 계속 미루고 있고, 머리는 시끄러움"
      />
      <span className={styles.memoCount}>{value.length}/300</span>
      {error && <p className={styles.inlineError}>{error}</p>}
      <button className={styles.primaryButton} type="button" disabled={isAnalyzing} onClick={onSubmit}>
        {isAnalyzing ? '분석 중...' : '결과 보기'}
      </button>
    </section>
  );
}

function ResultScreen({
  result,
  analysisError,
  onRestart
}: {
  result: HumanResult;
  analysisError: string | null;
  onRestart: () => void;
}) {
  const rewardItem = getRewardItem(result);
  const forbiddenAction = result.forbiddenAction ?? '오늘은 새 핑계 만들기 금지. 이미 재료가 충분합니다.';

  return (
    <section className={styles.resultStack}>
      <article className={styles.resultHero}>
        <span className={styles.kicker}>RESULT</span>
        <h1>{result.typeName}</h1>
        <PixelCharacter body={result.character.body} mood={result.character.mood} size="large" />
        <strong>{result.character.name}</strong>
        <small>{result.character.mood}</small>
      </article>

      <section className={styles.panel}>
        <h2>오늘의 인간 유지 행동</h2>
        <p>{result.action}</p>
      </section>

      <section className={styles.factBubble}>
        <span>팩트 한 줄</span>
        <p>{result.factLine}</p>
      </section>

      <section className={styles.forbiddenPanel}>
        <span>오늘의 금지 행동</span>
        <p>{forbiddenAction}</p>
      </section>

      {result.comparison && (
        <section className={styles.comparePanel}>
          <span>{result.comparison.label}</span>
          <p>{result.comparison.summary}</p>
        </section>
      )}

      <section className={styles.panel}>
        <h2>상태 요약</h2>
        <ul>
          {result.statusSummary.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {result.aiObservation && (
        <section className={styles.aiPanel}>
          <h2>AI 관찰</h2>
          <p>{result.aiObservation}</p>
        </section>
      )}
      {analysisError && <p className={styles.inlineError}>{analysisError}</p>}

      <section className={styles.itemPanel}>
        <PixelAsset
          alt={rewardItem.name}
          className={styles.itemImage}
          fallback={<span className={styles.itemFallback} aria-hidden="true" />}
          src={rewardItem.assetPath}
        />
        <div>
          <span>획득 아이템</span>
          <strong>{rewardItem.name}</strong>
          <p>{rewardItem.description}</p>
        </div>
      </section>

      <button className={styles.primaryButton} type="button" onClick={onRestart}>
        다시 하기
      </button>
    </section>
  );
}

function PixelAsset({
  alt,
  className,
  fallback,
  src
}: {
  alt: string;
  className: string;
  fallback: ReactNode;
  src?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <>{fallback}</>;
  }

  return (
    <Image
      unoptimized
      alt={alt}
      className={className}
      height={96}
      src={src}
      width={96}
      onError={() => setFailed(true)}
    />
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

async function fetchAiObservation(submission: MuuSubmission): Promise<{ aiObservation?: string; error?: string }> {
  if (!submission.freeText.trim()) {
    return {};
  }

  try {
    const response = await fetch('/api/ai-observation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submission)
    });
    const data = (await response.json()) as { aiObservation?: string | null; error?: string };

    return {
      aiObservation: data.aiObservation ?? undefined,
      error: data.error
    };
  } catch {
    return {
      error: 'AI 관찰 생성에 실패했습니다. 룰 기반 결과만 표시합니다.'
    };
  }
}

function PixelCharacter({ body, mood, size }: { body: string; mood: string; size: 'tiny' | 'small' | 'large' }) {
  return (
    <div className={`${styles.pixelCharacter} ${styles[size]} ${styles[body]}`} role="img" aria-label={mood}>
      <span className={styles.eyeLeft} />
      <span className={styles.eyeRight} />
      <span className={styles.mouth} />
    </div>
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

function useStoredValue(key: string) {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('storage', onStoreChange);

      return () => window.removeEventListener('storage', onStoreChange);
    },
    () => window.localStorage.getItem(key),
    () => null
  );
}
