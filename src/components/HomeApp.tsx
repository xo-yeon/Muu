'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { parseResultHistory, parseStoredResult, lastResultStorageKey, resultHistoryStorageKey } from '@/lib/resultHistory';
import { AppShell } from './AppShell';
import { HomeScreen } from './HomeScreen';

type HomeAppProps = {
  navigate?: (href: string) => void;
};

export function HomeApp({ navigate }: HomeAppProps) {
  const router = useRouter();
  const persistedResultJson = useStoredValue(lastResultStorageKey);
  const persistedHistoryJson = useStoredValue(resultHistoryStorageKey);
  const lastResult = useMemo(() => parseStoredResult(persistedResultJson), [persistedResultJson]);
  const resultHistory = useMemo(() => parseResultHistory(persistedHistoryJson), [persistedHistoryJson]);
  const navigateTo = navigate ?? router.push;

  return (
    <AppShell isHome>
      <HomeScreen
        historyCount={resultHistory.length}
        lastResult={lastResult}
        onStart={() => navigateTo('/check-in')}
        onRestore={() => navigateTo('/check-in?restore=last')}
      />
    </AppShell>
  );
}

function useStoredValue(key: string) {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('storage', onStoreChange);

      return () => window.removeEventListener('storage', onStoreChange);
    },
    () => readStoredValue(key),
    () => null
  );
}

function readStoredValue(key: string): string | null {
  try {
    return window.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}
