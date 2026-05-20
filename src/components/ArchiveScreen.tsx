'use client';

import Link from 'next/link';
import { useMemo, useState, useSyncExternalStore } from 'react';
import { emotionTags } from '@/data/questions';
import {
  archiveStorageKey,
  getArchiveDays,
  getArchiveEntryByDate,
  parseArchive,
  type DailyArchive
} from '@/lib/archiveHistory';
import type { Axis } from '@/types/muu';
import { AppShell } from './AppShell';
import styles from './ArchiveScreen.module.css';

const axisLabels: Record<Axis, string> = {
  overthinking: '과열된 생각',
  avoidance: '회피',
  burnout: '방전',
  anxiety: '불안',
  execution: '실행력',
  socialFatigue: '사회성 배터리',
  emotionalSensitivity: '감정 민감도',
  stability: '안정감',
  dopamineSeeking: '자극 탐색'
};

export function ArchiveScreen() {
  const archiveJson = useArchiveStorageValue();
  const archive = useMemo(() => parseArchive(archiveJson), [archiveJson]);
  const days = useMemo(() => getArchiveDays(archive), [archive]);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const activeDateKey = selectedDateKey && archive[selectedDateKey] ? selectedDateKey : days[0]?.dateKey ?? null;
  const selectedDay = activeDateKey ? getArchiveEntryByDate(archive, activeDateKey) : null;
  const summary = useMemo(() => buildArchiveSummary(days), [days]);

  return (
    <AppShell isHome={false}>
      <section className={styles.archive}>
        <header className={styles.header}>
          <div>
            <span className={styles.kicker}>ARCHIVE LOG</span>
            <h1>Muu Archive</h1>
            <p>오늘의 감정 기록이 쌓이는 공간</p>
          </div>
          <nav className={styles.navActions} aria-label="Archive navigation">
            <Link className={styles.navButton} href="/">
              홈으로 이동
            </Link>
            <Link className={styles.navButton} href="/decision-lab">
              결정 실험실 이동
            </Link>
          </nav>
        </header>

        {days.length === 0 ? (
          <section className={styles.emptyPanel}>
            <span className={styles.kicker}>EMPTY FILE</span>
            <h2>아직 저장된 감정 기록이 없어요.</h2>
            <p>오늘의 Muu를 먼저 측정해보세요.</p>
            <Link className={styles.primaryButton} href="/">
              측정하러 가기
            </Link>
          </section>
        ) : (
          <div className={styles.workspace}>
            <aside className={styles.leftColumn}>
              <section className={styles.summaryCard}>
                <span className={styles.kicker}>SUMMARY</span>
                <dl>
                  <div>
                    <dt>총 기록 일수</dt>
                    <dd>{summary.totalDays}일</dd>
                  </div>
                  <div>
                    <dt>가장 최근 기록 날짜</dt>
                    <dd>{summary.latestDateKey}</dd>
                  </div>
                  <div>
                    <dt>가장 자주 나온 인간 유형</dt>
                    <dd>{summary.frequentTypeName}</dd>
                  </div>
                </dl>
              </section>

              <section className={styles.calendarPanel}>
                <div className={styles.panelHeader}>
                  <span className={styles.kicker}>DATE GRID</span>
                  <strong>{days.length} days</strong>
                </div>
                <div className={styles.dateGrid}>
                  {days.map((day) => (
                    <button
                      className={`${styles.dateCell} ${day.dateKey === activeDateKey ? styles.dateCellActive : ''}`}
                      key={day.dateKey}
                      type="button"
                      onClick={() => setSelectedDateKey(day.dateKey)}
                    >
                      <span>{formatDateKey(day.dateKey)}</span>
                      <strong>{day.lastEntry.result.typeName}</strong>
                      <small>{day.entries.length}회 기록</small>
                    </button>
                  ))}
                </div>
              </section>
            </aside>

            <section className={styles.detailColumn}>
              {selectedDay && <ArchiveDetail day={selectedDay} />}
            </section>
          </div>
        )}
      </section>
    </AppShell>
  );
}

function ArchiveDetail({ day }: { day: DailyArchive }) {
  const latest = day.lastEntry;
  const emotionLabels = latest.submission.emotionTagIds.map(getEmotionLabel);
  const topAxes = latest.result.dominantAxes.slice(0, 3);

  return (
    <article className={styles.detailPanel}>
      <div className={styles.panelHeader}>
        <span className={styles.kicker}>SELECTED FILE</span>
        <strong>{formatDateKey(day.dateKey)}</strong>
      </div>

      <section className={styles.typePanel}>
        <span>마지막 측정 인간 유형</span>
        <h2>{latest.result.typeName}</h2>
        <p>{latest.result.emotionWeather}</p>
      </section>

      <section className={styles.factPanel}>
        <span>팩트 한 줄</span>
        <p>{latest.result.factLine}</p>
      </section>

      <section className={styles.infoGrid}>
        <div>
          <span>감정 태그</span>
          <div className={styles.tagList}>
            {emotionLabels.length > 0 ? emotionLabels.map((label) => <em key={label}>{label}</em>) : <em>태그 없음</em>}
          </div>
        </div>
        <div>
          <span>주요 축 top3</span>
          <ol className={styles.axisList}>
            {topAxes.map((axis) => (
              <li key={axis}>{axisLabels[axis]}</li>
            ))}
          </ol>
        </div>
      </section>

      {latest.result.aiObservation && (
        <section className={styles.aiPanel}>
          <span>AI 관찰</span>
          <p>{latest.result.aiObservation}</p>
        </section>
      )}

      {day.entries.length > 1 && (
        <section className={styles.entryListPanel}>
          <span>이 날짜의 기록</span>
          <div className={styles.entryList}>
            {day.entries.map((entry) => (
              <article className={styles.entryRow} key={entry.savedAt}>
                <time>{formatSavedTime(entry.savedAt)}</time>
                <strong>{entry.result.typeName}</strong>
                <p>{entry.result.factLine}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className={styles.placeholderPanel}>
        <span>DECISION LAB</span>
        <p>결정 실험실 기록은 다음 업데이트에서 연결될 예정입니다.</p>
      </section>
    </article>
  );
}

function buildArchiveSummary(days: DailyArchive[]) {
  return {
    totalDays: days.length,
    latestDateKey: days[0]?.dateKey ?? '-',
    frequentTypeName: getMostFrequentTypeName(days)
  };
}

function getMostFrequentTypeName(days: DailyArchive[]): string {
  const counts = new Map<string, { count: number; latestSavedAt: string; typeName: string }>();

  for (const entry of days.flatMap((day) => day.entries)) {
    const current = counts.get(entry.result.id);

    if (!current) {
      counts.set(entry.result.id, {
        count: 1,
        latestSavedAt: entry.savedAt,
        typeName: entry.result.typeName
      });
      continue;
    }

    counts.set(entry.result.id, {
      count: current.count + 1,
      latestSavedAt: entry.savedAt > current.latestSavedAt ? entry.savedAt : current.latestSavedAt,
      typeName: current.typeName
    });
  }

  return (
    [...counts.values()].sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return right.latestSavedAt.localeCompare(left.latestSavedAt);
    })[0]?.typeName ?? '-'
  );
}

function getEmotionLabel(tagId: string): string {
  return emotionTags.find((tag) => tag.id === tagId)?.label ?? tagId;
}

function formatDateKey(dateKey: string): string {
  return dateKey.replaceAll('-', '.');
}

function formatSavedTime(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function useArchiveStorageValue() {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('storage', onStoreChange);

      return () => window.removeEventListener('storage', onStoreChange);
    },
    () => window.localStorage.getItem(archiveStorageKey),
    () => null
  );
}
