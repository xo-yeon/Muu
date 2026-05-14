import type { StoredMuuResult } from '@/types/muu';

export const lastResultStorageKey = 'muu:v1:last-result';
export const resultHistoryStorageKey = 'muu:v1:result-history';
export const maxResultHistoryItems = 5;

export function parseStoredResult(value: string | null): StoredMuuResult | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    return isStoredMuuResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function parseResultHistory(value: string | null): StoredMuuResult[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isStoredMuuResult).slice(0, maxResultHistoryItems);
  } catch {
    return [];
  }
}

export function buildNextResultHistory(current: StoredMuuResult, previous: StoredMuuResult[]): StoredMuuResult[] {
  return [current, ...previous.filter((item) => item.savedAt !== current.savedAt)].slice(0, maxResultHistoryItems);
}

function isStoredMuuResult(value: unknown): value is StoredMuuResult {
  if (!isRecord(value) || !isRecord(value.submission) || !isRecord(value.result)) {
    return false;
  }

  return (
    typeof value.savedAt === 'string' &&
    Array.isArray(value.submission.answers) &&
    Array.isArray(value.submission.emotionTagIds) &&
    typeof value.submission.freeText === 'string' &&
    typeof value.result.id === 'string' &&
    typeof value.result.typeName === 'string'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
