import type { EmotionTag, Question } from '@/types/muu';

export const questions: Question[] = [
  {
    id: 'q1',
    text: '오늘 머릿속은 어떤 상태에 가까워요?',
    options: [
      { id: 'q1-a', label: '너무 시끄러워서 회의실 대관 중', scores: { overthinking: 3, anxiety: 1 } },
      { id: 'q1-b', label: '생각은 많은데 정리가 안 됨', scores: { overthinking: 2, burnout: 1 } },
      { id: 'q1-c', label: '멍함. 뇌가 외근 나감', scores: { burnout: 3, avoidance: 1 } },
      { id: 'q1-d', label: '비교적 맑지만 방심 금지', scores: { stability: 3, execution: 1 } },
      { id: 'q1-e', label: '현실 회피 중입니다', scores: { avoidance: 3, dopamineSeeking: 1 } }
    ]
  },
  {
    id: 'q2',
    text: '오늘 몸 상태는 어떤 느낌인가요?',
    options: [
      { id: 'q2-a', label: '충전 3%인데 밝기 최대로 켬', scores: { burnout: 3 } },
      { id: 'q2-b', label: '버티기는 되는데 유지비가 비쌈', scores: { burnout: 2, execution: 1 } },
      { id: 'q2-c', label: '생각보다 괜찮음', scores: { stability: 3 } },
      { id: 'q2-d', label: '계속 뭔가에 쫓김', scores: { anxiety: 2, overthinking: 1 } },
      { id: 'q2-e', label: '쉬어야 회복할 듯', scores: { burnout: 2, avoidance: 1 } }
    ]
  },
  {
    id: 'q3',
    text: '오늘 가장 많이 반복한 행동은?',
    options: [
      { id: 'q3-a', label: '해야 할 일을 미룸', scores: { avoidance: 3, anxiety: 1 } },
      { id: 'q3-b', label: '계획만 세움', scores: { overthinking: 2, execution: -1 } },
      { id: 'q3-c', label: '작게라도 처리함', scores: { execution: 3, stability: 1 } },
      { id: 'q3-d', label: '무심코 SNS를 봄', scores: { dopamineSeeking: 3, avoidance: 1 } },
      { id: 'q3-e', label: '생각보다 잘 버팀', scores: { stability: 2, execution: 1 } }
    ]
  },
  {
    id: 'q4',
    text: '오늘 마음은 주로 어디에 있었나요?',
    options: [
      { id: 'q4-a', label: '미래 걱정 시뮬레이터', scores: { anxiety: 3, overthinking: 1 } },
      { id: 'q4-b', label: '과거 복기 재방송', scores: { overthinking: 2, emotionalSensitivity: 1 } },
      { id: 'q4-c', label: '해야 할 일 목록 앞', scores: { execution: 2, anxiety: 1 } },
      { id: 'q4-d', label: '현실 회피 휴게소', scores: { avoidance: 3 } },
      { id: 'q4-e', label: '별생각 없이 생존', scores: { stability: 2, burnout: 1 } }
    ]
  },
  {
    id: 'q5',
    text: '오늘 감정은 어떤 쪽에 가까웠나요?',
    options: [
      { id: 'q5-a', label: '이유 없이 예민함', scores: { emotionalSensitivity: 3 } },
      { id: 'q5-b', label: '불안함', scores: { anxiety: 3 } },
      { id: 'q5-c', label: '무기력함', scores: { burnout: 3 } },
      { id: 'q5-d', label: '그냥 지침', scores: { burnout: 2, socialFatigue: 1 } },
      { id: 'q5-e', label: '생각보다 안정적', scores: { stability: 3 } }
    ]
  },
  {
    id: 'q6',
    text: '오늘 사람들과의 관계는 어땠나요?',
    options: [
      { id: 'q6-a', label: '사람 때문에 기가 빨림', scores: { socialFatigue: 3 } },
      { id: 'q6-b', label: '혼자 있고 싶었음', scores: { socialFatigue: 2, avoidance: 1 } },
      { id: 'q6-c', label: '대답하는 것도 귀찮음', scores: { socialFatigue: 2, burnout: 1 } },
      { id: 'q6-d', label: '상당히 괜찮음', scores: { stability: 2 } },
      { id: 'q6-e', label: '연결감이 필요했음', scores: { emotionalSensitivity: 2, socialFatigue: -1 } }
    ]
  },
  {
    id: 'q7',
    text: '오늘 가장 가까웠던 상태는?',
    options: [
      { id: 'q7-a', label: '아무것도 하기 싫음', scores: { burnout: 2, avoidance: 2 } },
      { id: 'q7-b', label: '해야 하는 건 알겠음', scores: { execution: 1, anxiety: 1 } },
      { id: 'q7-c', label: '시작이 어려웠음', scores: { avoidance: 2, overthinking: 1 } },
      { id: 'q7-d', label: '생각보다 괜찮음', scores: { stability: 3 } },
      { id: 'q7-e', label: '그냥 애매함', scores: { burnout: 1, overthinking: 1 } }
    ]
  },
  {
    id: 'q8',
    text: '오늘 가장 지치게 만든 건?',
    options: [
      { id: 'q8-a', label: '미래 생각', scores: { anxiety: 3 } },
      { id: 'q8-b', label: '사람', scores: { socialFatigue: 3 } },
      { id: 'q8-c', label: '해야 할 일', scores: { execution: 1, burnout: 2 } },
      { id: 'q8-d', label: '자기 자신', scores: { emotionalSensitivity: 2, overthinking: 1 } },
      { id: 'q8-e', label: '이유를 모르겠음', scores: { burnout: 2, emotionalSensitivity: 1 } }
    ]
  },
  {
    id: 'q9',
    text: '오늘 회피하고 있었던 것은?',
    options: [
      { id: 'q9-a', label: '해야 할 일', scores: { avoidance: 3, execution: -1 } },
      { id: 'q9-b', label: '감정', scores: { avoidance: 2, emotionalSensitivity: 2 } },
      { id: 'q9-c', label: '사람', scores: { socialFatigue: 2, avoidance: 1 } },
      { id: 'q9-d', label: '현실', scores: { avoidance: 3 } },
      { id: 'q9-e', label: '아무것도 회피하지 않았음', scores: { execution: 2, stability: 2 } }
    ]
  },
  {
    id: 'q10',
    text: '오늘의 감정 날씨는?',
    options: [
      { id: 'q10-a', label: '얇은 안개 낀 흐림', scores: { overthinking: 2 } },
      { id: 'q10-b', label: '습도 높은 흐림', scores: { emotionalSensitivity: 3 } },
      { id: 'q10-c', label: '태풍 전야', scores: { anxiety: 2, emotionalSensitivity: 1 } },
      { id: 'q10-d', label: '쨍쨍한데 몸은 피곤', scores: { stability: 2, burnout: 1 } },
      { id: 'q10-e', label: '어리지만 버틸 만함', scores: { stability: 2, execution: 1 } }
    ]
  },
  {
    id: 'q11',
    text: '오늘 가장 많이 든 생각은?',
    options: [
      { id: 'q11-a', label: '나 왜 이러지?', scores: { overthinking: 2, emotionalSensitivity: 1 } },
      { id: 'q11-b', label: '조금만 쉬고 싶다', scores: { burnout: 3 } },
      { id: 'q11-c', label: '해내야 하는데', scores: { anxiety: 2, execution: 1 } },
      { id: 'q11-d', label: '그냥 귀찮다', scores: { avoidance: 2, burnout: 1 } },
      { id: 'q11-e', label: '생각보다 괜찮은데?', scores: { stability: 3 } }
    ]
  },
  {
    id: 'q12',
    text: '오늘 에너지는 어디에 가장 많이 쓰였나요?',
    options: [
      { id: 'q12-a', label: '걱정', scores: { anxiety: 3 } },
      { id: 'q12-b', label: '생각', scores: { overthinking: 3 } },
      { id: 'q12-c', label: '버티기', scores: { burnout: 2, stability: 1 } },
      { id: 'q12-d', label: '사람 상대', scores: { socialFatigue: 3 } },
      { id: 'q12-e', label: '현실 처리', scores: { execution: 3 } }
    ]
  },
  {
    id: 'q13',
    text: '지금 가장 필요한 것은?',
    options: [
      { id: 'q13-a', label: '쉬기', scores: { burnout: 2 } },
      { id: 'q13-b', label: '한 발짝 가기', scores: { execution: 2, avoidance: -1 } },
      { id: 'q13-c', label: '정리하기', scores: { overthinking: 2, execution: 1 } },
      { id: 'q13-d', label: '연결감과 위로', scores: { emotionalSensitivity: 2, socialFatigue: -1 } },
      { id: 'q13-e', label: '작은 성취감', scores: { execution: 2, stability: 1 } }
    ]
  },
  {
    id: 'q14',
    text: '오늘 당신은 어떤 인간에 가까웠나요?',
    options: [
      { id: 'q14-a', label: '계획만 세우는 인간', scores: { overthinking: 3, execution: -1 } },
      { id: 'q14-b', label: '조용히 무너지는 인간', scores: { burnout: 3 } },
      { id: 'q14-c', label: '현실과 협상하는 인간', scores: { execution: 2, stability: 1 } },
      { id: 'q14-d', label: '생각보다 잘 버틴 인간', scores: { stability: 3 } },
      { id: 'q14-e', label: '모든 걸 혼자 견디는 인간', scores: { socialFatigue: 1, burnout: 2 } }
    ]
  },
  {
    id: 'q15',
    text: '지금의 당신에게 가장 필요한 말은?',
    options: [
      { id: 'q15-a', label: '천천히 해도 된다', scores: { burnout: 1, stability: 2 } },
      { id: 'q15-b', label: '아직 망한 거 아니다', scores: { anxiety: -1, stability: 2 } },
      { id: 'q15-c', label: '오늘 살아있는 걸로 충분하다', scores: { burnout: 1, stability: 2 } },
      { id: 'q15-d', label: '완벽하지 않아도 해라', scores: { execution: 2, overthinking: -1 } },
      { id: 'q15-e', label: '일단 물 마셔라', scores: { stability: 1, execution: 1 } }
    ]
  }
];

export const emotionTags: EmotionTag[] = [
  { id: 'anxious', label: '불안', scores: { anxiety: 2 } },
  { id: 'numb', label: '무기력', scores: { burnout: 2 } },
  { id: 'tired', label: '지침', scores: { burnout: 1, socialFatigue: 1 } },
  { id: 'lonely', label: '외로움', scores: { emotionalSensitivity: 2 } },
  { id: 'impatient', label: '초조함', scores: { anxiety: 1, overthinking: 1 } },
  { id: 'pressure', label: '압박감', scores: { anxiety: 1, overthinking: 2 } },
  { id: 'empty', label: '공허함', scores: { burnout: 1, emotionalSensitivity: 1 } },
  { id: 'avoid', label: '회피욕구', scores: { avoidance: 2, dopamineSeeking: 1 } },
  { id: 'stable', label: '안정감', scores: { stability: 2 } },
  { id: 'hope', label: '희망', scores: { stability: 2, execution: 1 } },
  { id: 'annoyed', label: '귀찮음', scores: { avoidance: 1, burnout: 1 } },
  { id: 'sensitive', label: '예민함', scores: { emotionalSensitivity: 2, socialFatigue: 1 } },
  { id: 'blank', label: '멍함', scores: { burnout: 1, overthinking: -1 } },
  { id: 'heavy', label: '답답함', scores: { anxiety: 1, emotionalSensitivity: 1 } },
  { id: 'okay', label: '괜찮음', scores: { stability: 2 } }
];
