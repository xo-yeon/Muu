import { describe, expect, it } from 'vitest';
import { questions } from '@/data/questions';
import type { StoredMuuResult } from '@/types/muu';
import { analyzeHumanState } from './analysis';
import {
  archiveStorageKey,
  buildNextArchive,
  getArchiveDays,
  getArchiveEntryByDate,
  getLatestArchiveEntry,
  parseArchive
} from './archiveHistory';

const makeStoredResult = (savedAt: string, emotionTagIds: string[] = ['anxious']): StoredMuuResult => {
  const submission = {
    answers: questions.slice(0, 3).map((question) => ({
      questionId: question.id,
      optionId: question.options[0].id
    })),
    emotionTagIds,
    freeText: `archive ${savedAt}`
  };

  return {
    savedAt,
    submission,
    result: analyzeHumanState(submission)
  };
};

describe('archiveHistory', () => {
  it('uses the expected archive storage key', () => {
    expect(archiveStorageKey).toBe('muu:v1:archive');
  });

  it('returns an empty archive for missing values', () => {
    expect(parseArchive(null)).toEqual({});
  });

  it('returns an empty archive for invalid JSON', () => {
    expect(parseArchive('{bad json')).toEqual({});
  });

  it('adds the current result to a date archive', () => {
    const current = makeStoredResult('2026-05-19T11:20:00.000Z');
    const archive = buildNextArchive(current, {});

    expect(archive['2026-05-19']).toEqual({
      dateKey: '2026-05-19',
      entries: [current],
      lastEntry: current
    });
  });

  it('does not duplicate results with the same savedAt', () => {
    const current = makeStoredResult('2026-05-19T11:20:00.000Z');
    const archive = buildNextArchive(current, buildNextArchive(current, {}));

    expect(archive['2026-05-19'].entries).toHaveLength(1);
  });

  it('sorts multiple entries on the same date from newest to oldest', () => {
    const first = makeStoredResult('2026-05-19T09:00:00.000Z');
    const second = makeStoredResult('2026-05-19T22:00:00.000Z');
    const archive = buildNextArchive(second, buildNextArchive(first, {}));

    expect(archive['2026-05-19'].entries.map((entry) => entry.savedAt)).toEqual([
      '2026-05-19T22:00:00.000Z',
      '2026-05-19T09:00:00.000Z'
    ]);
  });

  it('sets lastEntry to the newest entry for that date', () => {
    const older = makeStoredResult('2026-05-19T09:00:00.000Z');
    const newer = makeStoredResult('2026-05-19T22:00:00.000Z');
    const archive = buildNextArchive(older, buildNextArchive(newer, {}));

    expect(archive['2026-05-19'].lastEntry).toBe(newer);
    expect(getArchiveEntryByDate(archive, '2026-05-19')?.lastEntry).toBe(newer);
  });

  it('returns archive days from newest date to oldest date', () => {
    const oldest = makeStoredResult('2026-05-17T09:00:00.000Z');
    const newest = makeStoredResult('2026-05-20T09:00:00.000Z');
    const middle = makeStoredResult('2026-05-19T09:00:00.000Z');
    const archive = [oldest, newest, middle].reduce((previous, current) => buildNextArchive(current, previous), {});

    expect(getArchiveDays(archive).map((day) => day.dateKey)).toEqual(['2026-05-20', '2026-05-19', '2026-05-17']);
    expect(getLatestArchiveEntry(archive)).toBe(newest);
  });
});
