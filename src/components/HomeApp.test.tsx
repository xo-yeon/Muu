// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { lastResultStorageKey, resultHistoryStorageKey } from '@/lib/resultHistory';
import { installMemoryStorage, storedMuuResultFixture } from '@/test/muuFixtures';
import { HomeApp } from './HomeApp';

const { push } = vi.hoisted(() => ({
  push: vi.fn()
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push })
}));

describe('HomeApp', () => {
  beforeEach(() => {
    installMemoryStorage();
    push.mockClear();
  });

  it('uses the Next router for the primary start action by default', () => {
    render(<HomeApp />);

    fireEvent.click(screen.getByRole('button', { name: '오늘의 Muu 시작하기' }));

    expect(push).toHaveBeenCalledWith('/check-in');
  });

  it('sends the primary start action to the check-in route', () => {
    const navigations: string[] = [];

    render(<HomeApp navigate={(href) => navigations.push(href)} />);

    fireEvent.click(screen.getByRole('button', { name: '오늘의 Muu 시작하기' }));

    expect(navigations).toEqual(['/check-in']);
  });

  it('sends the recent result card to the check-in restore route', () => {
    const navigations: string[] = [];
    window.localStorage.setItem(lastResultStorageKey, JSON.stringify(storedMuuResultFixture));
    window.localStorage.setItem(resultHistoryStorageKey, JSON.stringify([storedMuuResultFixture]));

    render(<HomeApp navigate={(href) => navigations.push(href)} />);

    fireEvent.click(screen.getByRole('button', { name: /테스트 인간/ }));

    expect(navigations).toEqual(['/check-in?restore=last']);
  });
});
