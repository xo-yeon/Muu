import { describe, expect, it } from 'vitest';
import { questions } from '@/data/questions';
import { questionSessionSize, selectRandomQuestions } from './questionSelection';

describe('selectRandomQuestions', () => {
  it('selects ten unique questions by default', () => {
    const selected = selectRandomQuestions(questions, questionSessionSize, () => 0.5);
    const ids = selected.map((question) => question.id);

    expect(selected).toHaveLength(questionSessionSize);
    expect(new Set(ids).size).toBe(questionSessionSize);
  });

  it('does not mutate the source question pool', () => {
    const originalIds = questions.map((question) => question.id);

    selectRandomQuestions(questions, questionSessionSize, () => 0);

    expect(questions.map((question) => question.id)).toEqual(originalIds);
  });

  it('returns all questions when the pool is smaller than the requested count', () => {
    expect(selectRandomQuestions(questions.slice(0, 3), 10, () => 0)).toHaveLength(3);
  });
});
