import type { StoredMuuResult } from '@/types/muu';

export const storedMuuResultFixture: StoredMuuResult = {
  savedAt: '2026-05-20T10:00:00.000Z',
  submission: {
    answers: [],
    emotionTagIds: [],
    freeText: ''
  },
  result: {
    id: 'unexpectedlyOkay',
    typeName: '테스트 인간',
    statusSummary: ['저장된 결과를 확인 중입니다.'],
    emotionWeather: '맑음',
    factLine: '저장된 결과가 루트 홈을 거치지 않고 복원됩니다.',
    action: '작은 할 일을 하나 처리하기',
    forbiddenAction: '기록을 미루기',
    rewardItem: {
      name: '테스트 배지',
      description: '복원 테스트용 보상'
    },
    character: {
      name: '테스트 캐릭터',
      body: 'stable',
      mood: '복원됨'
    },
    scores: {
      overthinking: 0,
      avoidance: 0,
      burnout: 0,
      anxiety: 0,
      execution: 0,
      socialFatigue: 0,
      emotionalSensitivity: 0,
      stability: 0,
      dopamineSeeking: 0
    },
    dominantAxes: ['stability']
  }
};

export function installMemoryStorage() {
  const store = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key) => store.get(key) ?? null,
    key: (index) => Array.from(store.keys())[index] ?? null,
    removeItem: (key) => store.delete(key),
    setItem: (key, value) => store.set(key, value)
  };

  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: storage
  });

  return storage;
}
