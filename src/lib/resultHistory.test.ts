import { describe, expect, it } from 'vitest';
import { analyzeHumanState } from './analysis';
import { buildNextResultHistory, maxResultHistoryItems, parseResultHistory } from './resultHistory';
import { questions } from '@/data/questions';
import type { StoredMuuResult } from '@/types/muu';

const makeStoredResult = (savedAt: string): StoredMuuResult => {
  const submission = {
    answers: questions.slice(0, 3).map((question) => ({
      questionId: question.id,
      optionId: question.options[0].id
    })),
    emotionTagIds: ['anxious'],
    freeText: `기록 ${savedAt}`
  };

  return {
    savedAt,
    submission,
    result: analyzeHumanState(submission)
  };
};

describe('resultHistory', () => {
  it('returns an empty array for missing or invalid history', () => {
    expect(parseResultHistory(null)).toEqual([]);
    expect(parseResultHistory('{bad json')).toEqual([]);
    expect(parseResultHistory(JSON.stringify({ savedAt: 'nope' }))).toEqual([]);
  });

  it('places the latest result first and keeps at most five items', () => {
    const previous = Array.from({ length: 6 }, (_, index) => makeStoredResult(`2026-05-14T00:0${index}:00.000Z`));
    const current = makeStoredResult('2026-05-14T01:00:00.000Z');
    const next = buildNextResultHistory(current, previous);

    expect(next[0]).toBe(current);
    expect(next).toHaveLength(maxResultHistoryItems);
  });
});
