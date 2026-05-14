import { emotionTags, questions } from '@/data/questions';
import type { Axis, AxisScores, HumanResult, HumanTypeId, MuuSubmission } from '@/types/muu';

const axes: Axis[] = [
  'overthinking',
  'avoidance',
  'burnout',
  'anxiety',
  'execution',
  'socialFatigue',
  'emotionalSensitivity',
  'stability',
  'dopamineSeeking'
];

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

const resultPriority: HumanTypeId[] = [
  'quietBurnout',
  'paperArmorMental',
  'emotionTank',
  'anxietyWizard',
  'futureBuffering',
  'planningMaxNewbie',
  'overheatedPlanner',
  'dopamineGoblin',
  'dopamineScroller',
  'realityEscapeAssassin',
  'procrastinationSlime',
  'excuseBlacksmith',
  'rationalizationAlchemist',
  'blameSummoner',
  'emotionalWave',
  'survivalMode',
  'unexpectedlyOkay',
  'softSystemOverload'
];

type ResultTemplate = Omit<HumanResult, 'scores' | 'dominantAxes' | 'aiObservation'> & {
  when: (scores: AxisScores) => boolean;
};

const templates: Record<HumanTypeId, ResultTemplate> = {
  excuseBlacksmith: {
    id: 'excuseBlacksmith',
    typeName: '핑계 대장장이',
    when: (scores) => scores.avoidance >= 4 && scores.overthinking >= 2 && scores.execution <= 0,
    statusSummary: [
      '핑계 재료 수급은 빠른데 시작 버튼은 아직 제작 대기 중입니다.',
      '그럴듯한 이유가 많아질수록 실제 행동은 더 작아지고 있습니다.',
      '상황 설명은 충분합니다. 이제 망치질 한 번만 하면 됩니다.'
    ],
    emotionWeather: '철가루 섞인 흐림',
    factLine: '핑계가 정교해질수록 일은 더 오래 제자리에 있습니다.',
    action: '가장 작은 작업 하나를 3분만 두드리세요.',
    forbiddenAction: '재료 수급 핑계로 시작 미루기 금지. 대장간 문은 이미 열렸습니다.',
    rewardItem: {
      name: '반쯤 식은 핑계 망치',
      description: '이제 이유를 만들지 말고 일을 두드리라는 뜻의 장비입니다.',
      assetPath: '/assets/characters/item-hammer.gif'
    },
    character: { name: '핑계 대장장이', body: 'blacksmith', mood: '망치를 들고 눈치 보는 중' }
  },
  procrastinationSlime: {
    id: 'procrastinationSlime',
    typeName: '미루기 슬라임',
    when: (scores) => scores.avoidance >= 5 && scores.execution <= 2,
    statusSummary: [
      '할 일이 가까이 오면 몸이 말랑하게 퍼지는 중입니다.',
      '시작 전 준비운동만 오래 하다가 바닥에 붙었습니다.',
      '오늘의 적은 거대한 일이 아니라 첫 클릭입니다.'
    ],
    emotionWeather: '끈적한 안개',
    factLine: '내일의 당신도 오늘의 당신과 같은 사람입니다. 미루면 그대로 만납니다.',
    action: '타이머 5분을 켜고 결과물 말고 시작 흔적만 남기세요.',
    forbiddenAction: '내일의 나에게 전부 택배 보내기 금지.',
    rewardItem: {
      name: '끈적한 5분 타이머',
      description: '슬라임도 5분은 움직일 수 있다는 불편한 사실을 알려줍니다.',
      assetPath: '/assets/characters/item-timer.gif'
    },
    character: { name: '미루기 슬라임', body: 'slime', mood: '바닥에 붙어 꿈틀거림' }
  },
  anxietyWizard: {
    id: 'anxietyWizard',
    typeName: '불안 마법사',
    when: (scores) => scores.anxiety >= 4 && scores.overthinking >= 2,
    statusSummary: [
      '아직 오지 않은 일을 마법진에 올려놓고 계속 확대 중입니다.',
      '상상력은 강한데 현실 검증 주문은 쿨타임입니다.',
      '최악의 미래를 너무 선명하게 렌더링하고 있습니다.'
    ],
    emotionWeather: '번개 치는 수정구',
    factLine: '불안 주문을 많이 외운다고 미래가 순해지진 않습니다.',
    action: '걱정 하나를 적고 현실에서 확인 가능한 증거만 표시하세요.',
    forbiddenAction: '수정구로 최악 엔딩 12회 재생 금지.',
    rewardItem: {
      name: '금 간 수정구',
      description: '미래를 보여주는 척하지만 사실 대부분은 걱정 확대경입니다.',
      assetPath: '/assets/characters/item-orb.gif'
    },
    character: { name: '불안 마법사', body: 'wizard', mood: '수정구를 붙잡고 떨고 있음' }
  },
  dopamineGoblin: {
    id: 'dopamineGoblin',
    typeName: '도파민 고블린',
    when: (scores) => scores.dopamineSeeking >= 5 && scores.avoidance >= 2,
    statusSummary: [
      '짧은 자극을 주워 담느라 현실 퀘스트가 밀리고 있습니다.',
      '손가락은 바쁜데 삶의 본체는 대기실에 있습니다.',
      '재미는 있었지만 회복됐다고 보긴 어렵습니다.'
    ],
    emotionWeather: '반짝이 먼지 폭풍',
    factLine: '도파민은 간식이지 식사가 아닙니다. 지금은 끼니를 건너뛰는 중입니다.',
    action: '가장 자주 여는 앱 하나를 닫고 물리적인 물건 하나를 정리하세요.',
    forbiddenAction: '쇼츠 하나만 더 보기 금지. 그 문장은 대체로 거짓말입니다.',
    rewardItem: {
      name: '반짝이 압수 상자',
      description: '짧은 자극을 잠깐 보관하는 상자입니다. 잠금은 약하지만 의도는 좋습니다.',
      assetPath: '/assets/characters/item-box.gif'
    },
    character: { name: '도파민 고블린', body: 'goblin', mood: '반짝이를 주머니에 숨김' }
  },
  planningMaxNewbie: {
    id: 'planningMaxNewbie',
    typeName: '계획만렙 초보자',
    when: (scores) => scores.overthinking >= 5 && scores.execution <= 0,
    statusSummary: [
      '계획 스킬트리는 만렙인데 기본 공격을 아직 안 눌렀습니다.',
      '준비 화면에서 장비 설명만 읽다가 시간이 갔습니다.',
      '완벽한 루트보다 튜토리얼 한 번이 더 필요합니다.'
    ],
    emotionWeather: '공략집 많은 맑음',
    factLine: '공략을 더 읽어도 1스테이지는 대신 깨지지 않습니다.',
    action: '계획을 닫고 제일 쉬운 행동 하나를 튜토리얼처럼 하세요.',
    forbiddenAction: '새 계획표 스킨 고르기 금지. 지금 필요한 건 시작 버튼입니다.',
    rewardItem: {
      name: '튜토리얼 목검',
      description: '대단한 무기는 아니지만 첫 행동에는 이 정도면 충분합니다.',
      assetPath: '/assets/characters/item-sword.gif'
    },
    character: { name: '계획만렙 초보자', body: 'newbie', mood: '공략집 뒤에서 대기 중' }
  },
  emotionTank: {
    id: 'emotionTank',
    typeName: '감정 폭주 전차',
    when: (scores) => scores.emotionalSensitivity >= 5 && scores.anxiety >= 2,
    statusSummary: [
      '감정 엔진이 과열돼서 작은 턱에도 크게 흔들립니다.',
      '지나가도 될 생각까지 바퀴로 밀고 지나가는 중입니다.',
      '멈춤 장치가 약해진 날이라 속도 조절이 먼저입니다.'
    ],
    emotionWeather: '엔진 열기 낀 소나기',
    factLine: '감정이 큰 날에는 판단도 크게 튀기 쉽습니다.',
    action: '답장이나 결정은 10분만 늦추고 몸부터 진정시키세요.',
    forbiddenAction: '감정 속도 그대로 중요한 결정 밀어붙이기 금지.',
    rewardItem: {
      name: '삐걱이는 브레이크',
      description: '폭주를 멋지게 막진 못해도 속도를 조금 줄여주는 부품입니다.',
      assetPath: '/assets/characters/item-brake.gif'
    },
    character: { name: '감정 폭주 전차', body: 'tank', mood: '엔진이 뜨거워짐' }
  },
  realityEscapeAssassin: {
    id: 'realityEscapeAssassin',
    typeName: '현실도피 암살자',
    when: (scores) => scores.avoidance >= 5 && scores.socialFatigue >= 2,
    statusSummary: [
      '현실의 시야 밖으로 조용히 사라지는 기술이 발동됐습니다.',
      '할 일과 대화가 당신을 못 찾게 은신 중입니다.',
      '문제는 제거된 게 아니라 미니맵 밖에 잠깐 숨은 상태입니다.'
    ],
    emotionWeather: '그림자 낀 흐림',
    factLine: '은신은 생존 기술이지만 퀘스트 완료 판정은 아닙니다.',
    action: '숨은 자리에서 나와 가장 덜 무서운 연락이나 일 하나만 처리하세요.',
    forbiddenAction: '읽지 않은 척으로 세계관 삭제하기 금지.',
    rewardItem: {
      name: '현실 복귀 단검',
      description: '문제를 베는 무기가 아니라 회피를 살짝 끊는 도구입니다.',
      assetPath: '/assets/characters/item-dagger.gif'
    },
    character: { name: '현실도피 암살자', body: 'assassin', mood: '커튼 뒤에 숨어 있음' }
  },
  rationalizationAlchemist: {
    id: 'rationalizationAlchemist',
    typeName: '자기합리화 연금술사',
    when: (scores) => scores.overthinking >= 4 && scores.avoidance >= 2 && scores.stability >= 3,
    statusSummary: [
      '그럴듯한 설명을 섞어 행동하지 않은 이유를 제조 중입니다.',
      '말은 매끄러운데 결과물은 아직 실험대 위에 없습니다.',
      '합리화가 나쁜 건 아니지만 오늘은 생산량이 과합니다.'
    ],
    emotionWeather: '연기 나는 실험실',
    factLine: '이유가 맞아도 일이 끝난 건 아닙니다.',
    action: '설명은 한 줄로 줄이고 바로 할 수 있는 조작 하나만 하세요.',
    forbiddenAction: '논리로 회피를 금칠하기 금지.',
    rewardItem: {
      name: '덜 익은 변명 물약',
      description: '마시면 말은 술술 나오지만 할 일은 그대로 남습니다.',
      assetPath: '/assets/characters/item-potion.gif'
    },
    character: { name: '자기합리화 연금술사', body: 'alchemist', mood: '물약을 흔들며 끄덕임' }
  },
  blameSummoner: {
    id: 'blameSummoner',
    typeName: '남탓 소환사',
    when: (scores) => scores.socialFatigue >= 5 && scores.emotionalSensitivity >= 4 && scores.avoidance >= 2,
    statusSummary: [
      '외부 요인을 소환하는 주문이 평소보다 잘 먹히는 날입니다.',
      '억울한 지점은 있을 수 있지만 내 턴도 완전히 사라진 건 아닙니다.',
      '분노 소환수는 강하지만 정리 능력은 낮습니다.'
    ],
    emotionWeather: '소환진 위 먹구름',
    factLine: '남의 잘못이 있어도 내 오늘이 자동으로 정리되진 않습니다.',
    action: '상대 몫과 내 몫을 한 줄씩 나눠 적고 내 몫 하나만 처리하세요.',
    forbiddenAction: '소환수에게 오늘 전체 운전 맡기기 금지.',
    rewardItem: {
      name: '책임 반반 소환진',
      description: '모든 걸 떠안지도, 전부 넘기지도 않게 선을 그어주는 원입니다.',
      assetPath: '/assets/characters/item-circle.gif'
    },
    character: { name: '남탓 소환사', body: 'summoner', mood: '작은 소환진을 밟고 있음' }
  },
  paperArmorMental: {
    id: 'paperArmorMental',
    typeName: '멘탈 종이갑옷',
    when: (scores) => scores.burnout >= 4 && scores.emotionalSensitivity >= 4,
    statusSummary: [
      '방어력은 있는데 재질이 종이라 작은 말에도 구겨집니다.',
      '버티고는 있지만 충격 흡수 기능이 약해진 상태입니다.',
      '오늘은 강해지는 날보다 덜 맞는 동선을 고르는 날입니다.'
    ],
    emotionWeather: '구겨지는 종이비',
    factLine: '약한 날에 굳이 보스방 들어가는 건 용기가 아니라 손해입니다.',
    action: '마찰이 큰 대화나 결정을 미루고 안전한 루틴 하나만 하세요.',
    forbiddenAction: '종이갑옷 입고 정면돌파 선언하기 금지.',
    rewardItem: {
      name: '구겨진 방어력 +1 갑옷',
      description: '튼튼하진 않지만 오늘의 충격을 조금 덜 직접적으로 맞게 해줍니다.',
      assetPath: '/assets/characters/item-armor.gif'
    },
    character: { name: '멘탈 종이갑옷', body: 'armor', mood: '모서리가 살짝 구겨짐' }
  },
  overheatedPlanner: {
    id: 'overheatedPlanner',
    typeName: '과열된 계획 중독형',
    when: (scores) => scores.overthinking >= 9 && scores.execution <= 9,
    statusSummary: [
      '계획 추가 능력은 뛰어난데 실행 버튼은 자꾸 뒤로 밀립니다.',
      '문제를 해결한다기보다 머릿속에서 계속 렌더링 중입니다.',
      '생각을 더 한다고 갑자기 체력이 생기진 않습니다.'
    ],
    emotionWeather: '얇은 안개 낀 흐림',
    factLine: '계획표가 두꺼워질수록 오늘 할 일은 더 안 합니다.',
    action: '오늘은 계획을 줄이고 5분짜리 행동 하나만 끝내세요.',
    forbiddenAction: '할 일 앱 새로 만들기 금지. 지금 있는 것도 아직 안 끝났습니다.',
    rewardItem: {
      name: '구겨진 계획서',
      description: '펼치면 할 일이 늘어나는 것 같지만, 오늘은 접어두는 편이 이득입니다.',
      assetPath: '/assets/characters/item-plan.gif'
    },
    character: { name: '메모버섯', body: 'planner', mood: '종이를 들고 떨고 있음' }
  },
  quietBurnout: {
    id: 'quietBurnout',
    typeName: '조용한 번아웃 진행형',
    when: (scores) => scores.burnout >= 10,
    statusSummary: [
      '버티고는 있지만 회복은 거의 진행되지 않았습니다.',
      '괜찮은 척을 오래 해서 내부 배터리가 닳았습니다.',
      '지금 필요한 건 의지력 충전이 아니라 사용량 제한입니다.'
    ],
    emotionWeather: '습도 높은 흐림',
    factLine: '쉬는 척하면서 계속 버티면 그건 휴식이 아니라 대기근무입니다.',
    action: '오늘은 하나를 포기하고 20분을 실제로 비우세요.',
    forbiddenAction: '괜찮은 척으로 추가 업무 받기 금지. 배터리 잔량이 거짓말을 못 합니다.',
    rewardItem: {
      name: '미지근한 회복 물컵',
      description: '엄청난 해결책은 아니지만, 지금 몸은 이런 기본 패치부터 필요합니다.',
      assetPath: '/assets/characters/item-water.gif'
    },
    character: { name: '방전구름', body: 'burnout', mood: '작게 깜빡임' }
  },
  futureBuffering: {
    id: 'futureBuffering',
    typeName: '미래 걱정 시뮬레이션형',
    when: (scores) => scores.anxiety >= 9,
    statusSummary: [
      '아직 오지 않은 문제를 오늘 에너지로 선결제 중입니다.',
      '현실보다 예상 시나리오가 더 크게 떠 있습니다.',
      '걱정이 준비처럼 보이지만 대부분은 체력 누수입니다.'
    ],
    emotionWeather: '태풍 전야',
    factLine: '미래를 걱정한다고 미래가 고마워하지는 않습니다.',
    action: '걱정 하나를 종이에 쓰고, 지금 통제 가능한 행동만 표시하세요.',
    forbiddenAction: '아직 오지 않은 일의 장례식 미리 치르기 금지.',
    rewardItem: {
      name: '걱정 압수 주머니',
      description: '미래 시나리오를 잠깐 넣어두는 작은 주머니입니다. 잠금은 약하지만 없는 것보다 낫습니다.',
      assetPath: '/assets/characters/item-pouch.gif'
    },
    character: { name: '버퍼링 유령', body: 'anxiety', mood: '동그랗게 로딩 중' }
  },
  survivalMode: {
    id: 'survivalMode',
    typeName: '인간 기능 저전력형',
    when: (scores) => scores.execution >= 8 && scores.burnout >= 6,
    statusSummary: [
      '할 일은 처리했지만 사람 자체가 저전력 모드입니다.',
      '성과는 있는데 회복 계좌가 비었습니다.',
      '오늘의 생산성은 내일의 피곤함을 담보로 잡았습니다.'
    ],
    emotionWeather: '쨍쨍한데 몸은 피곤',
    factLine: '해냈다고 괜찮은 건 아닙니다. 그냥 해낸 겁니다.',
    action: '완료한 일을 하나 인정하고 더 얹지 마세요.',
    forbiddenAction: '완료하자마자 새 일 얹기 금지. 인간도 쿨타임이 있습니다.',
    rewardItem: {
      name: '저전력 배지',
      description: '오늘도 작동은 했지만 충전 요청이 떠 있는 사람에게 지급됩니다.',
      assetPath: '/assets/characters/item-badge.gif'
    },
    character: { name: '저전력 콩', body: 'survival', mood: '작게 승리 포즈' }
  },
  dopamineScroller: {
    id: 'dopamineScroller',
    typeName: 'SNS 회피 생존형',
    when: (scores) => scores.dopamineSeeking >= 5 || (scores.avoidance >= 9 && scores.execution <= 5),
    statusSummary: [
      '현실 피로를 짧은 자극으로 덮는 중입니다.',
      '쉬려고 본 화면이 오히려 집중력을 잘게 썰었습니다.',
      '회피는 달콤하지만 할 일은 아직 그 자리에 있습니다.'
    ],
    emotionWeather: '픽셀 노이즈 섞인 흐림',
    factLine: '스크롤은 휴식처럼 생겼지만 대체로 피로의 할부 결제입니다.',
    action: '앱 하나를 닫고 3분짜리 정리 행동부터 하세요.',
    forbiddenAction: '스크롤로 휴식 위장하기 금지. 손가락만 출근 중입니다.',
    rewardItem: {
      name: '현실 복귀 부적',
      description: '화면 밖에도 퀘스트가 있다는 불편한 사실을 알려주는 부적입니다.',
      assetPath: '/assets/characters/item-charm.gif'
    },
    character: { name: '스크롤 도깨비', body: 'scroll', mood: '눈이 네모남' }
  },
  unexpectedlyOkay: {
    id: 'unexpectedlyOkay',
    typeName: '생각보다 잘 살아있는 인간형',
    when: (scores) => scores.stability >= 10 && scores.burnout < 8 && scores.anxiety < 8,
    statusSummary: [
      '완벽하진 않지만 오늘의 균형은 꽤 괜찮습니다.',
      '무리해서 증명하지 않아도 이미 기본 기능은 돌아갑니다.',
      '지금은 큰 결심보다 페이스 유지가 더 이득입니다.'
    ],
    emotionWeather: '어리지만 버틸 만한 맑음',
    factLine: '괜찮은 날에도 굳이 일을 더 얹는 습관은 좀 고치세요.',
    action: '오늘 유지된 루틴 하나를 내일도 같은 크기로 반복하세요.',
    forbiddenAction: '괜찮다고 갑자기 인생 난이도 올리기 금지.',
    rewardItem: {
      name: '평온한 체크표',
      description: '대단하진 않아도 계속 굴러가는 사람에게 주는 조용한 아이템입니다.',
      assetPath: '/assets/characters/item-check.gif'
    },
    character: { name: '튼튼 젤리', body: 'stable', mood: '작게 반짝임' }
  },
  emotionalWave: {
    id: 'emotionalWave',
    typeName: '감정 습도 과다형',
    when: (scores) => scores.emotionalSensitivity >= 8,
    statusSummary: [
      '작은 일도 마음에 오래 남는 날입니다.',
      '감정이 과장된 게 아니라 처리 용량이 줄어든 상태입니다.',
      '지금은 해석보다 진정이 먼저입니다.'
    ],
    emotionWeather: '습도 높은 흐림',
    factLine: '다 느끼는 건 능력인데, 다 붙잡고 있으면 과로입니다.',
    action: '감정 이름을 하나만 붙이고 그 감정의 원인을 한 줄로 쓰세요.',
    forbiddenAction: '모든 감정에 즉시 의미 부여하기 금지. 오늘은 습도가 높을 뿐입니다.',
    rewardItem: {
      name: '방수 마음 스티커',
      description: '작은 일에 마음이 젖을 때 붙이는 임시 방수 패치입니다.',
      assetPath: '/assets/characters/item-sticker.gif'
    },
    character: { name: '물방울 요정', body: 'wave', mood: '촉촉하게 흔들림' }
  },
  softSystemOverload: {
    id: 'softSystemOverload',
    typeName: '생활 시스템 과부하형',
    when: () => true,
    statusSummary: [
      '큰 고장은 아니지만 여러 작은 창이 동시에 떠 있습니다.',
      '하나하나는 별일 아닌데 합치면 꽤 시끄럽습니다.',
      '지금은 인생 개편보다 화면 하나 닫기가 정확합니다.'
    ],
    emotionWeather: '구름 많고 알림 많음',
    factLine: '정신없는 날에 인생 전체를 평가하는 건 데이터가 너무 구립니다.',
    action: '오늘 남은 일 중 제일 작은 것 하나만 닫고 종료하세요.',
    forbiddenAction: '알림 하나 왔다고 인생 전체 점검 시작하기 금지.',
    rewardItem: {
      name: '작은 창 닫기 버튼',
      description: '거대한 해결보다 작은 종료가 필요한 날 지급되는 버튼입니다.',
      assetPath: '/assets/characters/item-close.gif'
    },
    character: { name: '알림 먼지', body: 'overload', mood: '작게 삐빅거림' }
  }
};

export function analyzeHumanState(submission: MuuSubmission): HumanResult {
  const scores = zeroScores();

  for (const answer of submission.answers) {
    const option = questions
      .find((question) => question.id === answer.questionId)
      ?.options.find((item) => item.id === answer.optionId);

    if (option) {
      addScores(scores, option.scores);
    }
  }

  for (const tagId of [...submission.emotionTagIds].sort()) {
    const tag = emotionTags.find((item) => item.id === tagId);

    if (tag) {
      addScores(scores, tag.scores);
    }
  }

  applyFreeTextSignals(scores, submission.freeText);

  const selectedId = resultPriority.find((id) => templates[id].when(scores)) ?? 'softSystemOverload';
  const template = templates[selectedId];
  const dominantAxes = [...axes].sort((a, b) => scores[b] - scores[a] || axes.indexOf(a) - axes.indexOf(b)).slice(0, 3);

  return {
    ...template,
    scores,
    dominantAxes
  };
}

function addScores(target: AxisScores, source: Partial<AxisScores>) {
  for (const axis of axes) {
    target[axis] += source[axis] ?? 0;
  }
}

function applyFreeTextSignals(scores: AxisScores, freeText: string) {
  const text = freeText.trim().toLowerCase();

  if (!text) {
    return;
  }

  const signals: Array<[RegExp, Partial<AxisScores>]> = [
    [/핑계|어쩔 수|나중에|상황 때문에/, { avoidance: 4, overthinking: 2, execution: -1 }],
    [/슬라임|미루|내일|귀찮|시작 못|시작하기 싫/, { avoidance: 5, execution: -2 }],
    [/마법|불안|걱정|망했|초조|최악|끝장/, { anxiety: 4, overthinking: 2 }],
    [/도파민|sns|쇼츠|릴스|유튜브|스크롤|자극/, { dopamineSeeking: 5, avoidance: 2 }],
    [/계획만렙|계획|공략|준비만|목록만/, { overthinking: 5, execution: -2 }],
    [/폭주|감정|예민|서운|눈물|터질/, { emotionalSensitivity: 5, anxiety: 2 }],
    [/현실도피|도피|회피|도망|숨고|잠수/, { avoidance: 5, socialFatigue: 2 }],
    [/합리화|정당화|이유는 있음|그럴만/, { overthinking: 4, avoidance: 2, stability: 3 }],
    [/남탓|쟤 때문에|환경 탓|사람 때문|억울/, { socialFatigue: 5, emotionalSensitivity: 4, avoidance: 2 }],
    [/종이갑옷|멘탈|쿠크|상처|방어력|유리멘탈/, { burnout: 4, emotionalSensitivity: 4 }],
    [/피곤|지침|번아웃|무기력|방전/, { burnout: 2 }],
    [/생각|정리|머리/, { overthinking: 1 }],
    [/사람|연락|대화|회의/, { socialFatigue: 1 }],
    [/괜찮|무난|안정|해냈/, { stability: 1 }],
    [/끝냈|처리|완료|시작/, { execution: 1 }]
  ];

  for (const [pattern, value] of signals) {
    if (pattern.test(text)) {
      addScores(scores, value);
    }
  }
}
