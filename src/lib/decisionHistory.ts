import type { DecisionContext, StoredDecisionLabResult } from '@/types/muu';

export const decisionContextStorageKey = 'muu:v1:decision-context';
export const lastDecisionSessionStorageKey = 'muu:v1:last-decision-session';

export function parseDecisionContext(value: string | null): DecisionContext | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    return isDecisionContext(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function parseStoredDecisionLabResult(value: string | null): StoredDecisionLabResult | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    return isStoredDecisionLabResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isDecisionContext(value: unknown): value is DecisionContext {
  return (
    isRecord(value) &&
    (value.result === null || isRecord(value.result)) &&
    Array.isArray(value.emotionTagIds) &&
    value.emotionTagIds.every((item) => typeof item === 'string') &&
    typeof value.freeText === 'string' &&
    typeof value.savedAt === 'string'
  );
}

function isStoredDecisionLabResult(value: unknown): value is StoredDecisionLabResult {
  return (
    isRecord(value) &&
    typeof value.savedAt === 'string' &&
    isRecord(value.session) &&
    isRecord(value.result) &&
    typeof value.session.topic === 'string' &&
    Array.isArray(value.session.options) &&
    typeof value.result.recommendedOptionId === 'string' &&
    Array.isArray(value.result.optionScores)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
