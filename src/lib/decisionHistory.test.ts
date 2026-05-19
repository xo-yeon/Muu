import { describe, expect, it } from 'vitest';
import { defaultDecisionCriteria } from './decisionLab';
import { parseDecisionContext, parseStoredDecisionLabResult } from './decisionHistory';
import type { StoredDecisionLabResult } from '@/types/muu';

describe('decisionHistory', () => {
  it('returns null for missing or invalid decision context', () => {
    expect(parseDecisionContext(null)).toBeNull();
    expect(parseDecisionContext('{bad json')).toBeNull();
    expect(parseDecisionContext(JSON.stringify({ freeText: 'nope' }))).toBeNull();
  });

  it('parses a valid decision context', () => {
    expect(
      parseDecisionContext(
        JSON.stringify({
          result: null,
          emotionTagIds: ['tired'],
          freeText: '피곤함',
          savedAt: '2026-05-19T00:00:00.000Z'
        })
      )
    ).toMatchObject({ emotionTagIds: ['tired'], freeText: '피곤함' });
  });

  it('parses a stored decision lab result', () => {
    const stored: StoredDecisionLabResult = {
      savedAt: '2026-05-19T00:00:00.000Z',
      session: {
        id: 'decision-1',
        topic: '오늘 뭐 할까?',
        options: [{ id: 'option-1', label: '문장 하나 수정하기' }],
        criteria: defaultDecisionCriteria,
        sourceResult: null,
        emotionTagIds: [],
        freeText: '',
        createdAt: '2026-05-19T00:00:00.000Z'
      },
      result: {
        recommendedOptionId: 'option-1',
        optionScores: [],
        reason: '작게 실행하세요.',
        factLine: '작은 실행이 이깁니다.',
        avoidReason: '큰 위험은 없습니다.'
      }
    };

    expect(parseStoredDecisionLabResult(JSON.stringify(stored))).toEqual(stored);
  });
});
