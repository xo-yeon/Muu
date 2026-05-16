'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { questions } from '@/data/questions';
import { analyzeHumanState } from '@/lib/analysis';
import { selectRandomQuestions } from '@/lib/questionSelection';
import { buildResultComparison } from '@/lib/resultComparison';
import {
  buildNextResultHistory,
  lastResultStorageKey,
  parseResultHistory,
  parseStoredResult,
  resultHistoryStorageKey
} from '@/lib/resultHistory';
import type { HumanResult, MuuAnswer, MuuSubmission, StoredMuuResult } from '@/types/muu';
import { AppShell } from './AppShell';
import { EmotionScreen } from './EmotionScreen';
import { FreeTextScreen } from './FreeTextScreen';
import { HomeScreen } from './HomeScreen';
import { QuestionScreen } from './QuestionScreen';
import { ResultScreen } from './ResultScreen';
import { TopBar } from './TopBar';

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
  const counterLabel =
    step === 'questions' ? `${questionIndex + 1}/${selectedQuestions.length}` : step === 'result' ? '완료' : '마감';

  return (
    <AppShell isHome={step === 'home'}>
      {step !== 'home' && <TopBar counterLabel={counterLabel} progress={progress} onBack={goBack} />}

      {step === 'home' && (
        <HomeScreen historyCount={resultHistory.length} lastResult={lastResult} onStart={start} onRestore={restoreLast} />
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
    </AppShell>
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
