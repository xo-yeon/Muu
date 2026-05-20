import type { StoredMuuResult } from '@/types/muu';

export const archiveStorageKey = 'muu:v1:archive';

export type ArchiveEntry = StoredMuuResult;

export type DailyArchive = {
  dateKey: string;
  entries: ArchiveEntry[];
  lastEntry: ArchiveEntry;
};

export type MuuArchive = Record<string, DailyArchive>;

function toDateKey(isoString: string): string {
  return isoString.slice(0, 10);
}

export function parseArchive(value: string | null): MuuArchive {
  if (!value) {
    return {};
  }

  try {
    return normalizeArchive(JSON.parse(value) as unknown);
  } catch {
    return {};
  }
}

export function buildNextArchive(current: StoredMuuResult, previous: MuuArchive): MuuArchive {
  const archive = normalizeArchive(previous);
  const dateKey = toDateKey(current.savedAt);
  const previousEntries = archive[dateKey]?.entries ?? [];
  const entries = sortEntriesBySavedAtDesc([current, ...previousEntries.filter((entry) => entry.savedAt !== current.savedAt)]);

  return {
    ...archive,
    [dateKey]: {
      dateKey,
      entries,
      lastEntry: entries[0]
    }
  };
}

export function getArchiveDays(archive: MuuArchive): DailyArchive[] {
  return Object.values(normalizeArchive(archive)).sort((left, right) => right.dateKey.localeCompare(left.dateKey));
}

export function getLatestArchiveEntry(archive: MuuArchive): StoredMuuResult | null {
  return getArchiveDays(archive)[0]?.lastEntry ?? null;
}

export function getArchiveEntryByDate(archive: MuuArchive, dateKey: string): DailyArchive | null {
  return normalizeArchive(archive)[dateKey] ?? null;
}

function normalizeArchive(value: unknown): MuuArchive {
  if (!isRecord(value)) {
    return {};
  }

  return Object.entries(value).reduce<MuuArchive>((archive, [key, rawDay]) => {
    if (!isRecord(rawDay)) {
      return archive;
    }

    const dateKey = typeof rawDay.dateKey === 'string' ? rawDay.dateKey : key;

    if (!isDateKey(dateKey)) {
      return archive;
    }

    const rawEntries = Array.isArray(rawDay.entries) ? rawDay.entries : [];
    const candidates = [...rawEntries, rawDay.lastEntry].filter(isStoredMuuResult);
    const entries = sortEntriesBySavedAtDesc(dedupeEntriesBySavedAt(candidates)).filter(
      (entry) => toDateKey(entry.savedAt) === dateKey
    );

    if (entries.length === 0) {
      return archive;
    }

    archive[dateKey] = {
      dateKey,
      entries,
      lastEntry: entries[0]
    };

    return archive;
  }, {});
}

function sortEntriesBySavedAtDesc(entries: StoredMuuResult[]): StoredMuuResult[] {
  return [...entries].sort((left, right) => right.savedAt.localeCompare(left.savedAt));
}

function dedupeEntriesBySavedAt(entries: StoredMuuResult[]): StoredMuuResult[] {
  const seen = new Set<string>();

  return entries.filter((entry) => {
    if (seen.has(entry.savedAt)) {
      return false;
    }

    seen.add(entry.savedAt);
    return true;
  });
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

function isDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
