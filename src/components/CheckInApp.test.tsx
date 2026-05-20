// @vitest-environment jsdom

import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { lastResultStorageKey } from '@/lib/resultHistory';
import { installMemoryStorage, storedMuuResultFixture } from '@/test/muuFixtures';
import { CheckInApp } from './CheckInApp';

describe('CheckInApp', () => {
  beforeEach(() => {
    installMemoryStorage();
  });

  it('starts the check-in flow on the question screen', () => {
    render(<CheckInApp />);

    expect(screen.getByText('ITEM SELECT')).toBeTruthy();
    expect(screen.queryByRole('button', { name: '오늘의 Muu 시작하기' })).toBeNull();
  });

  it('restores the last result when the check-in route asks for it', async () => {
    window.localStorage.setItem(lastResultStorageKey, JSON.stringify(storedMuuResultFixture));

    render(<CheckInApp restoreLastOnMount />);

    await waitFor(() => {
      expect(screen.getByText('테스트 인간')).toBeTruthy();
    });
    expect(screen.getByText('CREATURE LOG')).toBeTruthy();
    expect(screen.queryByRole('button', { name: '오늘의 Muu 시작하기' })).toBeNull();
  });
});
