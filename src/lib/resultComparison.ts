import type { Axis, HumanResult, ResultComparison } from '@/types/muu';

const axisLabels: Record<Axis, string> = {
  overthinking: '생각 과열',
  avoidance: '회피',
  burnout: '방전',
  anxiety: '불안',
  execution: '실행',
  socialFatigue: '사회 배터리',
  emotionalSensitivity: '감정 습도',
  stability: '안정',
  dopamineSeeking: '자극 찾기'
};

export function buildResultComparison(current: HumanResult, previous?: HumanResult): ResultComparison | undefined {
  if (!previous) {
    return undefined;
  }

  if (current.id === previous.id) {
    return {
      label: '반복 패턴 감지',
      summary: '같은 인간 유형이 또 출근했습니다. 오늘도 같은 버튼이 눌린 모양입니다.'
    };
  }

  const repeatedAxis = current.dominantAxes.find((axis) => previous.dominantAxes.includes(axis));

  if (repeatedAxis) {
    return {
      label: '반복 패턴',
      summary: `${axisLabels[repeatedAxis]} 신호가 다시 올라왔습니다. 패턴이 조용히 재방문했습니다.`
    };
  }

  const [axis, diff] = getLargestScoreDiff(current, previous);

  if (diff === 0) {
    return {
      label: '잔잔한 반복',
      summary: '큰 변화는 없습니다. 오늘도 비슷한 시스템 로그가 찍혔습니다.'
    };
  }

  return {
    label: '상태 변화 감지',
    summary: `${axisLabels[axis]} ${formatDiff(diff)}처럼 ${diff > 0 ? '올라왔습니다' : '내려갔습니다'}.`
  };
}

function getLargestScoreDiff(current: HumanResult, previous: HumanResult): [Axis, number] {
  const axes = Object.keys(current.scores) as Axis[];

  return axes.reduce<[Axis, number]>(
    (largest, axis) => {
      const diff = current.scores[axis] - previous.scores[axis];

      return Math.abs(diff) > Math.abs(largest[1]) ? [axis, diff] : largest;
    },
    [axes[0], 0]
  );
}

function formatDiff(value: number) {
  return value > 0 ? `+${value}` : `${value}`;
}
