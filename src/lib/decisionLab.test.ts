import { describe, expect, it } from 'vitest';
import { questions } from '@/data/questions';
import { analyzeHumanState } from './analysis';
import { buildDecisionResult, defaultDecisionCriteria } from './decisionLab';
import type { DecisionSession, HumanResult, MuuSubmission } from '@/types/muu';

const answerWith = (optionIndex: number) =>
  questions.map((question) => ({
    questionId: question.id,
    optionId: question.options[optionIndex].id
  }));

const makeResult = (freeText: string, emotionTagIds: string[] = []): HumanResult => {
  const submission: MuuSubmission = {
    answers: [],
    emotionTagIds,
    freeText
  };

  return analyzeHumanState(submission);
};

const makeSession = (result: HumanResult | null, labels: string[], extra?: Partial<DecisionSession>): DecisionSession => ({
  id: 'test-session',
  topic: '오늘 뭐 할까?',
  options: labels.map((label, index) => ({
    id: `option-${index + 1}`,
    label
  })),
  criteria: defaultDecisionCriteria,
  sourceResult: result,
  emotionTagIds: [],
  freeText: '',
  createdAt: '2026-05-19T00:00:00.000Z',
  ...extra
});

describe('decisionLab', () => {
  it('returns the same result for the same decision session', () => {
    const session = makeSession(makeResult('계획만렙 공략 준비만 목록만'), ['새 계획표 만들기', '파일 열고 한 줄 수정하기']);

    expect(buildDecisionResult(session)).toEqual(buildDecisionResult(session));
  });

  it('recommends low-effort recovery for quiet burnout', () => {
    const result = analyzeHumanState({
      answers: answerWith(1).map((answer, index) => {
        const burnoutOption = questions[index].options.find((option) => option.scores.burnout && option.scores.burnout > 0);
        return {
          questionId: answer.questionId,
          optionId: burnoutOption?.id ?? answer.optionId
        };
      }),
      emotionTagIds: ['numb', 'tired'],
      freeText: '너무 피곤하고 방전된 느낌'
    });
    const session = makeSession(result, ['밤새 포폴 전체 갈아엎기', '포폴 문장 하나만 수정하고 쉬기'], {
      emotionTagIds: ['numb', 'tired']
    });

    expect(buildDecisionResult(session).recommendedOptionId).toBe('option-2');
  });

  it('pushes overheated planning toward small execution', () => {
    const session = makeSession(makeResult('계획만렙 공략 준비만 목록만'), ['새 계획표 만들기', '파일 열고 한 줄 수정하기']);

    expect(buildDecisionResult(session).recommendedOptionId).toBe('option-2');
  });

  it('marks short stimulation as the weaker option for avoidance state', () => {
    const session = makeSession(makeResult('도파민 쇼츠 릴스 스크롤 자극'), ['쇼츠 보면서 쉬기', '책상 위 물건 하나 정리하기']);
    const result = buildDecisionResult(session);

    expect(result.recommendedOptionId).toBe('option-2');
    expect(result.avoidOptionId).toBe('option-1');
  });

  it('uses stable tie-breaking by input order', () => {
    const session = makeSession(null, ['작게 정리하기', '조금 정리하기']);

    expect(buildDecisionResult(session).recommendedOptionId).toBe('option-1');
  });
});
