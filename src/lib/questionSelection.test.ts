import { afterEach, describe, expect, it, vi } from 'vitest';
import { questions } from '@/data/questions';
import { questionSessionSize, selectRandomQuestions } from './questionSelection';

describe('selectRandomQuestions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not use Math.random for the default question order', () => {
    vi.spyOn(Math, 'random').mockImplementation(() => {
      throw new Error('Math.random should not be used by default');
    });

    expect(() => selectRandomQuestions(questions)).not.toThrow();
  });

  it('selects twelve unique questions by default', () => {
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
