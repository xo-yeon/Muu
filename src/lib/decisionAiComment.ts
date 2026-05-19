import type { DecisionResult, DecisionSession } from '@/types/muu';

export function generateDecisionAiMockComment(session: DecisionSession, result: DecisionResult): string | undefined {
  const recommended = session.options.find((option) => option.id === result.recommendedOptionId);

  if (!recommended) {
    return undefined;
  }

  const typeName = session.sourceResult?.typeName ?? '현재 상태 기록이 없는 사람';

  return `${typeName} 기준으로는 "${recommended.label}"이 덜 요란하고 더 실행 가능합니다. 오늘은 큰 결론보다 작게 끝나는 쪽이 더 정확합니다.`;
}
