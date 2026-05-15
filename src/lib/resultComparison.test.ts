import { describe, expect, it } from 'vitest';
import { buildResultComparison } from './resultComparison';
import type { AxisScores, HumanResult } from '@/types/muu';

const zeroScores = (): AxisScores => ({
  overthinking: 0,
  avoidance: 0,
  burnout: 0,
  anxiety: 0,
  execution: 0,
  socialFatigue: 0,
  emotionalSensitivity: 0,
  stability: 0,
  dopamineSeeking: 0
});

const makeResult = (overrides: Partial<HumanResult> = {}): HumanResult => ({
  id: 'overheatedPlanner',
  typeName: '과열된 계획 중독형',
  statusSummary: ['계획만 늘어남'],
  emotionWeather: '흐림',
  factLine: '하나만 끝내세요.',
  action: '5분만 시작하기',
  forbiddenAction: '할 일 추가 금지',
  rewardItem: {
    name: '구겨진 계획서',
    description: '오늘은 접어두세요.'
  },
  character: {
    name: '메모버섯',
    body: 'planner',
    mood: '떨고 있음'
  },
  scores: zeroScores(),
  dominantAxes: ['overthinking', 'anxiety', 'avoidance'],
  ...overrides
});

describe('buildResultComparison', () => {
  it('returns undefined without a previous result', () => {
    expect(buildResultComparison(makeResult())).toBeUndefined();
  });

  it('detects repeated result type first', () => {
    expect(buildResultComparison(makeResult(), makeResult())?.label).toBe('반복 패턴 감지');
  });

  it('detects repeated dominant axis', () => {
    const current = makeResult({ id: 'quietBurnout', dominantAxes: ['burnout', 'overthinking', 'execution'] });
    const previous = makeResult({ id: 'futureBuffering', dominantAxes: ['anxiety', 'burnout', 'avoidance'] });

    expect(buildResultComparison(current, previous)).toEqual({
      label: '반복 패턴',
      summary: '방전 신호가 다시 올라왔습니다. 패턴이 조용히 재방문했습니다.'
    });
  });

  it('summarizes the largest score change', () => {
    const currentScores = zeroScores();
    const previousScores = zeroScores();
    currentScores.anxiety = 5;
    previousScores.anxiety = 1;

    const current = makeResult({
      id: 'quietBurnout',
      dominantAxes: ['burnout', 'execution', 'stability'],
      scores: currentScores
    });
    const previous = makeResult({
      id: 'futureBuffering',
      dominantAxes: ['anxiety', 'avoidance', 'overthinking'],
      scores: previousScores
    });

    expect(buildResultComparison(current, previous)).toEqual({
      label: '상태 변화 감지',
      summary: '불안 +4처럼 올라왔습니다.'
    });
  });
});
