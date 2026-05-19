import type {
  DecisionCriterion,
  DecisionCriterionId,
  DecisionOption,
  DecisionOptionScore,
  DecisionResult,
  DecisionSession,
  HumanResult,
  HumanTypeId
} from '@/types/muu';

type DecisionWeights = Record<DecisionCriterionId, number>;
type CriterionScores = Record<DecisionCriterionId, number>;

export const defaultDecisionCriteria: DecisionCriterion[] = [
  { id: 'executionEase', label: '실행 난이도', description: '지금 바로 움직이기 쉬운가', direction: 'higherIsBetter' },
  { id: 'regretSafety', label: '후회 가능성', description: '나중에 후회할 가능성이 낮은가', direction: 'higherIsBetter' },
  { id: 'stateFit', label: '상태 적합도', description: '현재 인간 유형과 감정 상태에 맞는가', direction: 'higherIsBetter' },
  { id: 'recoveryHelp', label: '회복 도움', description: '오늘의 체력과 감정 회복에 도움이 되는가', direction: 'higherIsBetter' },
  { id: 'longTermHelp', label: '장기적 도움', description: '내일 이후의 나에게도 남는 선택인가', direction: 'higherIsBetter' }
];

const neutralWeights: DecisionWeights = {
  executionEase: 1,
  regretSafety: 1,
  stateFit: 1.2,
  recoveryHelp: 1,
  longTermHelp: 1
};

const typeWeightOverrides: Partial<Record<HumanTypeId, Partial<DecisionWeights>>> = {
  quietBurnout: { executionEase: 1.5, stateFit: 1.3, recoveryHelp: 1.7, longTermHelp: 0.8 },
  survivalMode: { executionEase: 1.5, regretSafety: 1.2, stateFit: 1.3, recoveryHelp: 1.6, longTermHelp: 0.8 },
  overheatedPlanner: { executionEase: 1.8, regretSafety: 1.2, stateFit: 1.4, recoveryHelp: 1.1, longTermHelp: 0.9 },
  planningMaxNewbie: { executionEase: 1.8, regretSafety: 1.1, stateFit: 1.4, recoveryHelp: 1, longTermHelp: 0.9 },
  futureBuffering: { executionEase: 1.5, regretSafety: 1.4, stateFit: 1.5, recoveryHelp: 1.1, longTermHelp: 0.8 },
  anxietyWizard: { executionEase: 1.5, regretSafety: 1.5, stateFit: 1.4, recoveryHelp: 1.2, longTermHelp: 0.8 },
  dopamineScroller: { executionEase: 1.2, regretSafety: 1.2, stateFit: 1.5, recoveryHelp: 1.2, longTermHelp: 1.4 },
  dopamineGoblin: { executionEase: 1.2, regretSafety: 1.2, stateFit: 1.5, recoveryHelp: 1.2, longTermHelp: 1.4 },
  unexpectedlyOkay: { executionEase: 1, regretSafety: 1.1, stateFit: 1.2, recoveryHelp: 1, longTermHelp: 1.5 },
  emotionalWave: { executionEase: 1.3, regretSafety: 1.6, stateFit: 1.5, recoveryHelp: 1.4, longTermHelp: 0.8 },
  emotionTank: { executionEase: 1.3, regretSafety: 1.7, stateFit: 1.5, recoveryHelp: 1.4, longTermHelp: 0.8 },
  paperArmorMental: { executionEase: 1.4, regretSafety: 1.7, stateFit: 1.5, recoveryHelp: 1.5, longTermHelp: 0.8 }
};

const baseScores = (): CriterionScores => ({
  executionEase: 3,
  regretSafety: 3,
  stateFit: 3,
  recoveryHelp: 3,
  longTermHelp: 3
});

export function buildDecisionResult(session: DecisionSession): DecisionResult {
  const weights = getDecisionWeights(session.sourceResult, session.emotionTagIds, session.freeText);
  const optionScores = session.options.map((option) => scoreDecisionOption(option, session, weights));
  const ranked = [...optionScores].sort(
    (a, b) =>
      b.weightedTotal - a.weightedTotal ||
      tieBreakerScore(b) - tieBreakerScore(a) ||
      session.options.findIndex((option) => option.id === a.optionId) -
        session.options.findIndex((option) => option.id === b.optionId)
  );
  const recommended = ranked[0];
  const avoid = [...optionScores].sort(
    (a, b) =>
      a.weightedTotal - b.weightedTotal ||
      tieBreakerScore(a) - tieBreakerScore(b) ||
      session.options.findIndex((option) => option.id === a.optionId) -
        session.options.findIndex((option) => option.id === b.optionId)
  )[0];

  return {
    recommendedOptionId: recommended.optionId,
    avoidOptionId: avoid.optionId === recommended.optionId ? undefined : avoid.optionId,
    optionScores,
    reason: buildReason(session, recommended),
    factLine: buildFactLine(session.sourceResult, recommended),
    avoidReason: buildAvoidReason(session, avoid, recommended)
  };
}

export function getDecisionWeights(result: HumanResult | null, emotionTagIds: string[], freeText: string): DecisionWeights {
  const weights: DecisionWeights = { ...neutralWeights, ...(result ? typeWeightOverrides[result.id] : undefined) };
  const text = freeText.toLowerCase();

  if (emotionTagIds.some((id) => ['numb', 'tired', 'blank', 'empty'].includes(id))) {
    weights.executionEase += 0.2;
    weights.recoveryHelp += 0.3;
  }

  if (emotionTagIds.some((id) => ['anxious', 'impatient', 'pressure', 'heavy'].includes(id))) {
    weights.regretSafety += 0.3;
    weights.stateFit += 0.2;
  }

  if (emotionTagIds.some((id) => ['stable', 'hope', 'okay'].includes(id))) {
    weights.longTermHelp += 0.2;
  }

  if (/새벽|충동|울컥|과몰입|감정적/.test(text)) {
    weights.regretSafety += 0.5;
    weights.executionEase += 0.2;
    weights.longTermHelp -= 0.2;
  }

  return weights;
}

export function scoreDecisionOption(
  option: DecisionOption,
  session: Pick<DecisionSession, 'topic' | 'sourceResult' | 'freeText'>,
  weights = getDecisionWeights(session.sourceResult, [], session.freeText)
): DecisionOptionScore {
  const scores = baseScores();
  const flags: string[] = [];
  const text = `${session.topic} ${option.label}`.toLowerCase();

  applySignal(text, /하나|한 줄|조금|5분|오분|문장|파일 열|초안|정리|수정|보내기|예약|씻|물/, scores, {
    executionEase: 1,
    stateFit: 1,
    regretSafety: 0.5
  }, flags, '작게 실행 가능');
  applySignal(text, /쉬|휴식|잠|산책|물|씻|밥|정리|비우|종료/, scores, {
    executionEase: 0.5,
    recoveryHelp: 1.3,
    stateFit: 0.8
  }, flags, '회복 도움');
  applySignal(text, /제출|연락|지원|예약|마감|처리|완료|포폴|포트폴리오|공부|운동|정산/, scores, {
    longTermHelp: 1.2,
    stateFit: 0.5
  }, flags, '현실 복귀');
  applySignal(text, /전부|완벽|밤새|갈아엎|인생|퇴사|헤어지|질러|당장 결정|올인|무리/, scores, {
    executionEase: -1.4,
    regretSafety: -1.2,
    stateFit: -0.8,
    recoveryHelp: -0.7,
    longTermHelp: 0.3
  }, flags, '큰 결정 위험');
  applySignal(text, /sns|쇼츠|릴스|유튜브|스크롤|폰만|게임만|누워서 폰|도망|잠수/, scores, {
    regretSafety: -0.8,
    stateFit: -1,
    recoveryHelp: -1,
    longTermHelp: -1.2
  }, flags, '짧은 자극');

  applyStateSpecificSignals(text, scores, flags, session.sourceResult);
  clampScores(scores);

  return {
    optionId: option.id,
    criteriaScores: scores,
    weightedTotal: roundScore(
      scores.executionEase * weights.executionEase +
        scores.regretSafety * weights.regretSafety +
        scores.stateFit * weights.stateFit +
        scores.recoveryHelp * weights.recoveryHelp +
        scores.longTermHelp * weights.longTermHelp
    ),
    flags
  };
}

function applyStateSpecificSignals(text: string, scores: CriterionScores, flags: string[], result: HumanResult | null) {
  if (!result) {
    return;
  }

  if (['quietBurnout', 'survivalMode'].includes(result.id) && /밤새|전부|무리|추가|하드/.test(text)) {
    add(scores, { executionEase: -0.8, recoveryHelp: -0.8, stateFit: -0.5 });
    flags.push('체력 소모 큼');
  }

  if (['overheatedPlanner', 'planningMaxNewbie'].includes(result.id) && /계획|목록|설계|정리만/.test(text)) {
    add(scores, { executionEase: -0.6, stateFit: -0.8, longTermHelp: -0.4 });
    flags.push('계획 과열');
  }

  if (['futureBuffering', 'anxietyWizard'].includes(result.id) && /언젠가|미래|장기|나중|걱정/.test(text)) {
    add(scores, { stateFit: -0.8, regretSafety: -0.4, executionEase: -0.4 });
    flags.push('걱정 확대');
  }

  if (['emotionalWave', 'emotionTank', 'paperArmorMental'].includes(result.id) && /답장|대화|따지|결정|고백|연락/.test(text)) {
    add(scores, { regretSafety: -0.8, stateFit: -0.5, recoveryHelp: -0.5 });
    flags.push('감정 소모');
  }
}

function applySignal(
  text: string,
  pattern: RegExp,
  scores: CriterionScores,
  delta: Partial<CriterionScores>,
  flags: string[],
  flag: string
) {
  if (pattern.test(text)) {
    add(scores, delta);
    flags.push(flag);
  }
}

function add(scores: CriterionScores, delta: Partial<CriterionScores>) {
  for (const key of Object.keys(delta) as DecisionCriterionId[]) {
    scores[key] += delta[key] ?? 0;
  }
}

function clampScores(scores: CriterionScores) {
  for (const key of Object.keys(scores) as DecisionCriterionId[]) {
    scores[key] = Math.max(1, Math.min(5, roundScore(scores[key])));
  }
}

function roundScore(value: number) {
  return Math.round(value * 10) / 10;
}

function tieBreakerScore(score: DecisionOptionScore) {
  return score.criteriaScores.stateFit + score.criteriaScores.executionEase;
}

function buildReason(session: DecisionSession, recommended: DecisionOptionScore) {
  const option = session.options.find((item) => item.id === recommended.optionId);
  const typeName = session.sourceResult?.typeName ?? '최근 상태 기록이 없는 상태';
  const strongest = [...session.criteria].sort(
    (a, b) => recommended.criteriaScores[b.id] - recommended.criteriaScores[a.id]
  )[0];

  return `현재 기준으로는 "${option?.label ?? '이 선택'}" 쪽이 더 현실적입니다. ${typeName}에게는 ${strongest.label} 점수가 높은 선택이 오늘의 손실을 덜 키웁니다.`;
}

function buildFactLine(result: HumanResult | null, recommended: DecisionOptionScore) {
  if (recommended.flags.includes('작게 실행 가능')) {
    return '지금은 인생 전체보다 작은 실행 버튼 하나가 더 정확합니다.';
  }

  if (result?.id === 'quietBurnout' || result?.id === 'survivalMode') {
    return '몸이 먼저 지친 날에는 멋진 선택보다 덜 망가지는 선택이 이깁니다.';
  }

  if (result?.id === 'futureBuffering' || result?.id === 'anxietyWizard') {
    return '미래 전체를 해결하려고 하면 오늘의 행동이 사라집니다.';
  }

  return '좋은 선택은 대단해 보이는 쪽보다 오늘 실제로 끝낼 수 있는 쪽에 가깝습니다.';
}

function buildAvoidReason(session: DecisionSession, avoid: DecisionOptionScore, recommended: DecisionOptionScore) {
  if (avoid.optionId === recommended.optionId) {
    return '이번 선택지들은 큰 위험 차이가 없습니다. 그래도 추천 선택지를 가장 작게 실행하세요.';
  }

  const option = session.options.find((item) => item.id === avoid.optionId);
  const flags = avoid.flags.length > 0 ? ` (${avoid.flags.join(', ')})` : '';

  return `"${option?.label ?? '이 선택'}"은 지금 상태에서는 비용이 더 큽니다${flags}. 오늘은 굳이 그쪽으로 난이도를 올릴 필요가 없습니다.`;
}
