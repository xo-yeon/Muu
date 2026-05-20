'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { questions } from '@/data/questions';
import { analyzeHumanState } from '@/lib/analysis';
import { archiveStorageKey, buildNextArchive, parseArchive } from '@/lib/archiveHistory';
import { decisionContextStorageKey } from '@/lib/decisionHistory';
import { selectRandomQuestions } from '@/lib/questionSelection';
import { buildResultComparison } from '@/lib/resultComparison';
import {
  buildNextResultHistory,
  lastResultStorageKey,
  parseResultHistory,
  parseStoredResult,
  resultHistoryStorageKey
} from '@/lib/resultHistory';
import type { DecisionContext, HumanResult, MuuAnswer, MuuSubmission, StoredMuuResult } from '@/types/muu';
import { AppShell } from './AppShell';
import { EmotionScreen } from './EmotionScreen';
import { FreeTextScreen } from './FreeTextScreen';
import { QuestionScreen } from './QuestionScreen';
import { ResultScreen } from './ResultScreen';
import { TopBar } from './TopBar';

type Step = 'questions' | 'emotions' | 'freeText' | 'result';

type CheckInAppProps = {
  restoreLastOnMount?: boolean;
  onExit?: () => void;
};

export function CheckInApp({ restoreLastOnMount = false, onExit = navigateHome }: CheckInAppProps) {
  const [step, setStep] = useState<Step>('questions');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState(() => selectRandomQuestions(questions));
  const [answers, setAnswers] = useState<MuuAnswer[]>([]);
  const [emotionTagIds, setEmotionTagIds] = useState<string[]>([]);
  const [freeText, setFreeText] = useState('');
  const [result, setResult] = useState<HumanResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [hasDismissedInitialRestore, setHasDismissedInitialRestore] = useState(false);
  const persistedResultJson = useStoredValue(lastResultStorageKey);
  const persistedResult = useMemo(() => parseStoredResult(persistedResultJson), [persistedResultJson]);
  const [lastResultOverride, setLastResultOverride] = useState<StoredMuuResult | null>(null);
  const lastResult = lastResultOverride ?? persistedResult;
  const restoredResult = restoreLastOnMount && !hasDismissedInitialRestore ? lastResult : null;
  const displayStep: Step = restoredResult && !result && step === 'questions' ? 'result' : step;
  const displayResult = result ?? restoredResult?.result ?? null;

  const progress = useMemo(() => {
    if (displayStep === 'questions') {
      return ((questionIndex + 1) / selectedQuestions.length) * 100;
    }

    if (displayStep === 'emotions') {
      return 94;
    }

    if (displayStep === 'freeText') {
      return 98;
    }

    if (displayStep === 'result') {
      return 100;
    }

    return 0;
  }, [displayStep, questionIndex, selectedQuestions.length]);

  const start = () => {
    setHasDismissedInitialRestore(true);
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
    if (displayStep === 'questions' && questionIndex > 0) {
      setQuestionIndex((current) => current - 1);
      return;
    }

    if (displayStep === 'questions') {
      onExit();
      return;
    }

    if (displayStep === 'emotions') {
      setStep('questions');
      setQuestionIndex(selectedQuestions.length - 1);
      return;
    }

    if (displayStep === 'freeText') {
      setStep('emotions');
      return;
    }

    onExit();
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
    const previousArchive = parseArchive(window.localStorage.getItem(archiveStorageKey));
    const nextArchive = buildNextArchive(stored, previousArchive);

    window.localStorage.setItem(lastResultStorageKey, JSON.stringify(stored));
    window.localStorage.setItem(resultHistoryStorageKey, JSON.stringify(nextHistory));
    window.localStorage.setItem(archiveStorageKey, JSON.stringify(nextArchive));
    setResult(resultWithAi);
    setLastResultOverride(stored);
    setAnalysisError(aiResponse.error ?? null);
    setIsAnalyzing(false);
    setStep('result');
  };

  const openDecisionLab = () => {
    const restoredSubmission = restoredResult?.submission;
    const context: DecisionContext = {
      result: displayResult,
      emotionTagIds: restoredSubmission?.emotionTagIds ?? emotionTagIds,
      freeText: restoredSubmission?.freeText ?? freeText,
      savedAt: new Date().toISOString()
    };

    window.localStorage.setItem(decisionContextStorageKey, JSON.stringify(context));
    window.location.assign('/decision-lab');
  };

  const counterLabel =
    displayStep === 'questions' ? `${questionIndex + 1}/${selectedQuestions.length}` : displayStep === 'result' ? '완료' : '마감';

  return (
    <AppShell isHome={false}>
      <TopBar counterLabel={counterLabel} progress={progress} onBack={goBack} />

      {displayStep === 'questions' && (
        <QuestionScreen
          question={selectedQuestions[questionIndex]}
          questionIndex={questionIndex}
          totalQuestions={selectedQuestions.length}
          onSelect={selectOption}
        />
      )}
      {displayStep === 'emotions' && (
        <EmotionScreen selectedIds={emotionTagIds} onToggle={toggleEmotion} onNext={() => setStep('freeText')} />
      )}
      {displayStep === 'freeText' && (
        <FreeTextScreen
          value={freeText}
          onChange={setFreeText}
          onSubmit={buildResult}
          isAnalyzing={isAnalyzing}
          error={analysisError}
        />
      )}
      {displayStep === 'result' && displayResult && (
        <ResultScreen
          result={displayResult}
          analysisError={analysisError}
          onOpenDecisionLab={openDecisionLab}
          onRestart={start}
        />
      )}
    </AppShell>
  );
}

function navigateHome() {
  window.location.assign('/');
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

function useStoredValue(key: string) {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('storage', onStoreChange);

      return () => window.removeEventListener('storage', onStoreChange);
    },
    () => readStoredValue(key),
    () => null
  );
}

function readStoredValue(key: string): string | null {
  try {
    return window.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}
