import { describe, expect, it } from 'vitest';
import { questions } from '@/data/questions';
import { analyzeHumanState } from './analysis';
import type { MuuSubmission } from '@/types/muu';

const answerWith = (optionIndex: number) =>
  questions.map((question) => ({
    questionId: question.id,
    optionId: question.options[optionIndex].id
  }));

describe('analyzeHumanState', () => {
  it('returns the same result for the same submission', () => {
    const submission: MuuSubmission = {
      answers: answerWith(0),
      emotionTagIds: ['anxious', 'impatient'],
      freeText: '미래 걱정이 많고 계획만 계속 세우는 중'
    };

    expect(analyzeHumanState(submission)).toEqual(analyzeHumanState(submission));
  });

  it('includes deterministic result enhancement fields', () => {
    const submission: MuuSubmission = {
      answers: answerWith(0),
      emotionTagIds: ['anxious', 'impatient'],
      freeText: '미래 걱정이 많고 계획만 계속 세우는 중'
    };
    const result = analyzeHumanState(submission);
    const repeated = analyzeHumanState(submission);

    expect(result.forbiddenAction).toBeTruthy();
    expect(result.rewardItem.name).toBeTruthy();
    expect(result.rewardItem.description).toBeTruthy();
    expect(result.forbiddenAction).toBe(repeated.forbiddenAction);
    expect(result.rewardItem).toEqual(repeated.rewardItem);
  });

  it('detects quiet burnout from repeated burnout answers', () => {
    const submission: MuuSubmission = {
      answers: answerWith(1).map((answer, index) => {
        const burnoutOption = questions[index].options.find((option) => option.scores.burnout && option.scores.burnout > 0);
        return {
          questionId: answer.questionId,
          optionId: burnoutOption?.id ?? answer.optionId
        };
      }),
      emotionTagIds: ['numb', 'tired'],
      freeText: '너무 피곤하고 방전된 느낌'
    };

    expect(analyzeHumanState(submission).id).toBe('quietBurnout');
  });

  it('keeps AI observation outside the deterministic rule-based result', () => {
    const withText = analyzeHumanState({
      answers: answerWith(4),
      emotionTagIds: ['stable'],
      freeText: '생각보다 괜찮지만 조금 피곤함'
    });

    expect(withText.aiObservation).toBeUndefined();
  });

  it.each([
    ['핑계 어쩔 수 나중에 상황 때문에', 'excuseBlacksmith', '핑계 대장장이'],
    ['슬라임 미루 내일 귀찮 시작 못', 'procrastinationSlime', '미루기 슬라임'],
    ['불안 마법 최악 걱정 끝장', 'anxietyWizard', '불안 마법사'],
    ['도파민 쇼츠 릴스 스크롤 자극', 'dopamineGoblin', '도파민 고블린'],
    ['계획만렙 공략 준비만 목록만', 'planningMaxNewbie', '계획만렙 초보자'],
    ['감정 폭주 예민 터질 것 같음', 'emotionTank', '감정 폭주 전차'],
    ['현실도피 도피 도망 숨고 잠수', 'realityEscapeAssassin', '현실도피 암살자'],
    ['합리화 정당화 이유는 있음 그럴만', 'rationalizationAlchemist', '자기합리화 연금술사'],
    ['남탓 쟤 때문에 환경 탓 억울', 'blameSummoner', '남탓 소환사'],
    ['종이갑옷 멘탈 쿠크 상처 유리멘탈', 'paperArmorMental', '멘탈 종이갑옷']
  ])('detects the added human type from free text: %s', (freeText, expectedId, expectedTypeName) => {
    const result = analyzeHumanState({
      answers: [],
      emotionTagIds: [],
      freeText
    });

    expect(result.id).toBe(expectedId);
    expect(result.typeName).toBe(expectedTypeName);
  });
});
