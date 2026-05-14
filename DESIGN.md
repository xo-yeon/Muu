# DESIGN.md — Pixel Creature Mobile UI System

## Overview

이 프로젝트의 UI는 사용자가 입력한 감정/상태 데이터를 바탕으로 결과를 보여주는 **모바일 전용 도트 스타일 진단 서비스**를 기준으로 설계한다. 전체 인상은 귀엽고 가볍지만, 결과 문구는 돌려 말하지 않는 방향이다. 즉, 화면은 말랑하고 장난감 같지만 콘텐츠는 팩트로 조지는 톤을 가진다.

레퍼런스 이미지는 작은 도트 캐릭터들이 격자나 맵 위에 모여 있는 느낌이다. 핵심은 고해상도 일러스트가 아니라 **낮은 해상도의 픽셀 그래픽**, **파스텔 배경**, **진한 보라색 계열 아웃라인**, **작은 캐릭터/아이콘의 반복**, **2D 게임 결과창 같은 화면 구성**이다.

이 디자인은 데스크톱을 고려하지 않는다. 모든 화면은 **360px ~ 768px 이하의 모바일 폭**을 기준으로 구현한다. 768px을 초과하는 환경에서는 모바일 프레임을 중앙 정렬하고, 실제 UI 폭은 최대 430px로 제한한다.

**Key Characteristics:**

- 모바일 전용, 360px ~ 768px 이하 반응형 기준
- 파스텔 민트/라벤더/크림 배경 위에 보라색 픽셀 아웃라인 사용
- 픽셀 게임 UI처럼 버튼, 카드, 결과창에 계단식 테두리와 2~4px 그림자 적용
- 캐릭터는 귀엽고 이상한 생명체 느낌: 몬스터, 유령, 버섯, 젤리, 작은 동물, 감정 생물
- 결과 페이지는 2D RPG 상태창처럼 구성: 캐릭터, 타입명, 한 줄 팩폭, 스탯, 해석, 행동 가이드
- 텍스트는 너무 딱딱한 상담 앱보다 게임 NPC가 말해주는 듯한 톤
- 인터랙션은 짧고 통통 튀는 느낌. 과한 모션보다 도트 UI에 맞는 즉각적인 피드백 우선

---

## Design Direction

### Product Mood

서비스는 일반적인 심리 테스트 UI처럼 깨끗하고 미니멀하게만 가면 안 된다. 사용자는 질문에 답하면서 작은 게임을 플레이하는 느낌을 받아야 한다.

- 질문 화면: 모바일 RPG의 대화/선택지 화면
- 선택지: 게임 선택 버튼 또는 인벤토리 슬롯
- 진행 상태: 스테이지 진행 바 또는 작은 도트 아이콘 행
- 결과 화면: 캐릭터 도감 + 상태창 + 팩폭 리포트
- 추가 분석 입력: NPC에게 편지를 쓰는 듯한 메모 박스

### Visual Keywords

- Pixel art
- Pastel monster world
- Cute but blunt
- 2D RPG result screen
- Creature encyclopedia
- Tiny weird friends
- Soft background + sharp pixel border
- Mobile game UI

---

## Colors

### Core Palette

| Token | Hex | Use |
| --- | --- | --- |
| `{colors.bg-mint}` | `#DDF8E8` | 기본 페이지 배경. 레퍼런스의 맵/잔디 느낌 |
| `{colors.bg-cream}` | `#FFF6CF` | 카드 내부, 결과창 내부, 따뜻한 패널 배경 |
| `{colors.bg-lavender}` | `#EEE3FF` | 질문 화면 보조 배경, 섹션 구분 |
| `{colors.bg-pink}` | `#FFD9E8` | 감정 태그, 귀여운 강조 영역 |
| `{colors.bg-blue}` | `#CDEEFF` | 정보 카드, 차분한 보조 패널 |
| `{colors.primary-purple}` | `#5B3FD6` | 메인 아웃라인, 제목, 주요 버튼 테두리 |
| `{colors.deep-purple}` | `#2F1E8A` | 강한 텍스트, 픽셀 그림자, 눌림 상태 |
| `{colors.hot-pink}` | `#FF6FAE` | 강조 버튼, 경고성 귀여운 포인트 |
| `{colors.pixel-cyan}` | `#55DDE0` | 선택 상태, 진행 바, 보조 액센트 |
| `{colors.pixel-yellow}` | `#FFD95A` | 보상/결과 강조, 별/코인 아이콘 |
| `{colors.pixel-green}` | `#72D66B` | 긍정/회복/완료 상태 |
| `{colors.pixel-orange}` | `#FF9F45` | 주의, 에너지, 과부하 상태 |
| `{colors.ink}` | `#2B235A` | 기본 본문 텍스트 |
| `{colors.muted}` | `#7C72A8` | 보조 설명, 캡션 |
| `{colors.white}` | `#FFFFFF` | 버튼 내부, 말풍선 내부 |

### Background Usage

기본 배경은 `{colors.bg-mint}`를 사용한다. 단조로워 보이지 않도록 아주 작은 도트 패턴, 체크 패턴, 잔디 타일 느낌의 반복 배경을 사용할 수 있다.

```css
background-color: #DDF8E8;
background-image:
  linear-gradient(rgba(91, 63, 214, 0.06) 1px, transparent 1px),
  linear-gradient(90deg, rgba(91, 63, 214, 0.06) 1px, transparent 1px);
background-size: 16px 16px;
```

결과 페이지는 일반 질문 페이지보다 더 게임 화면처럼 보여야 한다. 배경에 작은 별, 잎사귀, 점, 픽셀 구름, 작은 생명체 실루엣을 낮은 투명도로 배치한다.

### Text Color Rules

- 본문은 `{colors.ink}`를 기본으로 사용한다.
- 제목과 강한 문구는 `{colors.deep-purple}` 또는 `{colors.primary-purple}`를 사용한다.
- 결과 페이지의 팩폭 한 줄은 `{colors.hot-pink}` 또는 `{colors.deep-purple}`로 강조한다.
- 경고처럼 보이는 빨간색은 최소화한다. 이 서비스는 무섭게 혼내는 앱이 아니라 귀엽게 찌르는 앱이다.

---

## Typography

### Font Family

도트 UI에는 픽셀 폰트를 우선한다. 단, 한글 가독성이 떨어지면 제목만 픽셀 폰트를 사용하고 본문은 둥근 고딕을 사용한다.

```css
--font-pixel: 'DungGeunMo', 'NeoDunggeunmo', 'Galmuri11', monospace;
--font-body: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
```

### Font Usage

| Token | Size | Weight | Line Height | Use |
| --- | ---: | ---: | ---: | --- |
| `{typography.hero}` | 28px | 700 | 1.2 | 시작 화면 타이틀 |
| `{typography.result-title}` | 26px | 700 | 1.2 | 결과 타입명 |
| `{typography.question}` | 22px | 700 | 1.35 | 질문 문장 |
| `{typography.section-title}` | 18px | 700 | 1.35 | 결과 섹션 제목 |
| `{typography.button}` | 16px | 700 | 1.2 | 선택지/CTA 버튼 |
| `{typography.body}` | 15px | 500 | 1.6 | 기본 설명 텍스트 |
| `{typography.body-strong}` | 15px | 700 | 1.55 | 강조 본문 |
| `{typography.caption}` | 12px | 500 | 1.45 | 보조 설명, 진행 상태 |
| `{typography.tiny}` | 10px | 500 | 1.4 | 도트 라벨, 칩 내부 |

### Typography Rules

- 제목/버튼/결과 타입명은 픽셀 폰트를 사용한다.
- 긴 설명문은 `{font-body}`를 사용해 가독성을 확보한다.
- 한 화면에 너무 많은 픽셀 폰트를 쓰면 눈이 피로해진다. 제목, 버튼, 라벨 위주로 제한한다.
- 결과 문구는 짧고 강하게 쓴다. 예: “너 지금 쉬는 게 아니라 방전된 거야.”

---

## Layout

### Mobile-First Container

모든 화면은 모바일 우선이다.

```css
.app-shell {
  width: 100%;
  min-width: 360px;
  max-width: 430px;
  min-height: 100dvh;
  margin: 0 auto;
  padding: 16px;
}

@media (min-width: 431px) and (max-width: 768px) {
  .app-shell {
    max-width: 430px;
    padding: 20px;
  }
}

@media (min-width: 769px) {
  body {
    display: flex;
    justify-content: center;
    background: #CDEEFF;
  }

  .app-shell {
    max-width: 430px;
    box-shadow: 0 0 0 4px #5B3FD6, 8px 8px 0 #2F1E8A;
  }
}
```

### Spacing System

| Token | Value | Use |
| --- | ---: | --- |
| `{spacing.xxs}` | 4px | 픽셀 그림자, 작은 아이콘 간격 |
| `{spacing.xs}` | 8px | 칩 내부, 작은 요소 간격 |
| `{spacing.sm}` | 12px | 버튼 내부, 카드 내 작은 간격 |
| `{spacing.md}` | 16px | 기본 화면 패딩, 카드 내부 |
| `{spacing.lg}` | 20px | 주요 카드 패딩 |
| `{spacing.xl}` | 24px | 섹션 간격 |
| `{spacing.xxl}` | 32px | 히어로/결과 상단 간격 |

### Screen Structure

#### Start Screen

- 상단: 작은 로고 또는 픽셀 생명체 아이콘
- 중앙: 서비스명 + 한 줄 설명
- 하단: 시작 버튼 + 작은 안내 문구
- 배경: 도트 패턴 또는 작은 떠다니는 생명체

#### Question Screen

- 상단: 진행 상태 바
- 중앙: 질문 카드
- 하단: 선택지 버튼 2~5개
- 선택지는 한 줄 카드가 아니라 픽셀 게임 선택지처럼 보여야 한다.

#### Result Screen

- 상단: 결과 타입명
- 중앙: 대표 도트 캐릭터
- 그 아래: 한 줄 팩폭
- 섹션: 현재 상태 / 강점 / 위험 신호 / 지금 해야 할 행동
- 하단: 다시하기, 공유하기, 추가 분석 입력 버튼

---

## Pixel Style Rules

### Pixel Border

픽셀 UI의 핵심은 일반적인 둥근 카드가 아니라 **각진 테두리 + 단단한 그림자**다.

```css
.pixel-card {
  background: #FFF6CF;
  border: 3px solid #5B3FD6;
  border-radius: 0;
  box-shadow: 4px 4px 0 #2F1E8A;
}
```

### Stepped Corner Option

완전한 픽셀 감성을 더 주고 싶으면 `clip-path`로 모서리를 깎는다.

```css
.pixel-cut {
  clip-path: polygon(
    0 8px,
    8px 8px,
    8px 0,
    calc(100% - 8px) 0,
    calc(100% - 8px) 8px,
    100% 8px,
    100% calc(100% - 8px),
    calc(100% - 8px) calc(100% - 8px),
    calc(100% - 8px) 100%,
    8px 100%,
    8px calc(100% - 8px),
    0 calc(100% - 8px)
  );
}
```

### Pixel Shadow

그림자는 흐리게 처리하지 않는다. `blur` 없는 단단한 그림자를 사용한다.

```css
box-shadow: 4px 4px 0 #2F1E8A;
```

상태별로 그림자 위치를 조절한다.

```css
.button:active {
  transform: translate(3px, 3px);
  box-shadow: 1px 1px 0 #2F1E8A;
}
```

---

## Shapes

이 디자인 시스템은 둥근 모서리보다 각진 모서리를 기본으로 한다. 단, 캐릭터와 감정 칩은 부드러워도 된다.

| Token | Value | Use |
| --- | ---: | --- |
| `{rounded.none}` | 0px | 버튼, 카드, 결과창 기본 |
| `{rounded.pixel}` | stepped 8px | 픽셀 컷 카드, 주요 결과창 |
| `{rounded.sm}` | 6px | 작은 태그, 상태 칩 |
| `{rounded.md}` | 10px | 입력창, 말풍선 |
| `{rounded.full}` | 9999px | 캐릭터 배지, 감정 아이콘 |

### Rule

- 주요 UI는 각지게 만든다.
- 캐릭터, 감정 칩, 작은 장식은 둥글게 만들어도 된다.
- 일반적인 16~24px 둥근 SaaS 카드 느낌은 피한다.

---

## Components

### App Shell

**`app-shell`** — 모바일 화면 전체를 감싸는 컨테이너. `min-width: 360px`, `max-width: 430px`, `min-height: 100dvh`. 768px 이하에서는 화면 폭에 맞춰 자연스럽게 줄어들고, 769px 이상에서는 모바일 프레임처럼 중앙 정렬한다.

### Pixel Header

**`pixel-header`** — 상단 고정 또는 일반 배치 헤더. 좌측에는 작은 로고/캐릭터, 중앙에는 현재 단계, 우측에는 설정 또는 닫기 아이콘을 둔다. 높이는 48px 내외. 배경은 투명하거나 `{colors.bg-cream}`.

### Progress Bar

**`pixel-progress`** — 질문 진행 상태. 일반적인 얇은 선이 아니라 작은 블록이 채워지는 방식.

```css
.progress-track {
  height: 12px;
  border: 2px solid #5B3FD6;
  background: #EEE3FF;
}

.progress-fill {
  height: 100%;
  background: repeating-linear-gradient(
    90deg,
    #55DDE0 0 8px,
    #72D66B 8px 16px
  );
}
```

### Question Card

**`question-card`** — 질문을 보여주는 메인 카드. `{colors.bg-cream}` 배경, 3px 보라색 테두리, 4px 픽셀 그림자. 카드 상단에 작은 라벨 `QUESTION 03`처럼 넣으면 게임 UI 느낌이 강해진다.

구성:

- 작은 라벨: `Q.03`
- 질문 문장
- 보조 설명 또는 힌트
- 작은 캐릭터 아이콘 1개

### Option Button

**`option-button`** — 사용자가 선택하는 버튼. 전체 폭 100%, 최소 높이 52px. 텍스트가 길어질 수 있으므로 2줄까지 허용한다.

```css
.option-button {
  width: 100%;
  min-height: 52px;
  padding: 12px 14px;
  background: #FFFFFF;
  border: 3px solid #5B3FD6;
  box-shadow: 3px 3px 0 #2F1E8A;
  font-family: var(--font-pixel);
  color: #2B235A;
}

.option-button[aria-pressed='true'] {
  background: #FFD95A;
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #2F1E8A;
}
```

### Primary CTA

**`button-primary`** — 시작하기, 다음, 결과 보기 등 가장 중요한 액션에 사용한다. 배경은 `{colors.hot-pink}` 또는 `{colors.pixel-yellow}`를 사용하고, 반드시 보라색 테두리를 둔다.

- 높이: 56px
- 너비: 100%
- 테두리: 3px solid `{colors.deep-purple}`
- 그림자: 4px 4px 0 `{colors.deep-purple}`
- active: 3px 아래로 눌림

### Secondary Button

**`button-secondary`** — 다시하기, 이전, 나중에 하기 등에 사용한다. 배경은 `{colors.bg-cream}` 또는 `{colors.white}`, 테두리는 동일하게 보라색을 사용한다.

### Creature Avatar

**`creature-avatar`** — 결과 타입을 대표하는 도트 캐릭터 영역. 실제 이미지는 1x 픽셀아트 PNG/SVG를 사용하거나 CSS sprite를 사용할 수 있다.

권장 크기:

- 질문 화면 보조 캐릭터: 48px × 48px
- 결과 화면 대표 캐릭터: 128px × 128px
- 결과 공유 이미지용 캐릭터: 160px × 160px

렌더링 규칙:

```css
img.pixel-art {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

### Result Card

**`result-card`** — 최종 결과 화면의 핵심 카드. 2D RPG 캐릭터 상태창처럼 구성한다.

구성:

1. 결과 타입명
2. 대표 도트 캐릭터
3. 한 줄 팩폭
4. 상태 요약
5. 스탯 블록
6. 행동 가이드

예시 구조:

```md
[감정 과부하 젤리]
너 지금 괜찮은 척하는 데 에너지 다 쓰고 있어.

- 현재 상태: 방전 직전
- 강점: 끝까지 버티는 힘
- 위험 신호: 쉬어도 쉬는 느낌이 없음
- 오늘 할 일: 계획 줄이고, 회복 행동 하나만 하기
```

### Stat Block

**`stat-block`** — 결과 페이지에서 RPG 능력치처럼 보여주는 영역.

예시 스탯:

- 에너지
- 사회성 배터리
- 회복력
- 현실 회피력
- 자기돌봄 필요도

UI 규칙:

- 5칸 또는 10칸 블록으로 표현
- 채워진 칸은 `{colors.pixel-cyan}`, `{colors.pixel-yellow}`, `{colors.hot-pink}` 사용
- 숫자보다 시각적인 블록을 우선

### Fact Punch Bubble

**`fact-punch-bubble`** — 결과의 핵심 문장. 귀엽지만 직설적인 문구를 넣는다.

- 배경: `{colors.bg-pink}`
- 테두리: 3px solid `{colors.deep-purple}`
- 텍스트: `{colors.deep-purple}`
- 말풍선 꼬리 또는 작은 느낌표 아이콘 추가 가능

### AI Extra Input

**`extra-analysis-input`** — 사용자가 직접 감정이나 상황을 추가 입력하는 영역. 기본 테스트 결과는 고정 룰 기반으로 나오고, 이 입력값이 있을 때만 AI 추가 분석을 붙인다.

UI 톤은 “NPC에게 상담 쪽지 보내기”처럼 만든다.

- placeholder: `지금 상황을 조금만 더 적어줘. 내가 더 세게 봐줄게.`
- 최소 높이: 120px
- 배경: `{colors.white}`
- 테두리: 3px solid `{colors.primary-purple}`
- 글자 수 제한 표시 권장

### Share Card

**`share-card`** — 결과 공유용 이미지 영역. 1:1 또는 4:5 비율을 권장한다. 배경은 체크 패턴 또는 작은 생명체 패턴을 사용한다.

구성:

- 서비스명
- 결과 캐릭터
- 타입명
- 한 줄 팩폭
- 작은 스탯 바

---

## Illustration & Character Direction

### Character Style

캐릭터는 완성도 높은 캐릭터 IP라기보다, 이상하고 귀여운 생명체 도감처럼 보여야 한다.

좋은 방향:

- 작은 유령
- 젤리 몬스터
- 버섯 인간
- 우산 해파리
- 지친 공룡
- 말랑한 고양이/강아지형 생명체
- 감정이 얼굴에 바로 드러나는 이상한 친구들

피해야 할 방향:

- 고해상도 3D 캐릭터
- 너무 정교한 애니메이션풍 일러스트
- 일반 이모지 느낌
- 기업용 플랫 일러스트
- 지나치게 귀엽기만 하고 결과 문구와 대비가 없는 캐릭터

### Pixel Art Asset Rules

- 모든 캐릭터 이미지는 `image-rendering: pixelated` 적용
- 외곽선은 보라색/남색 계열 사용
- 색상 수는 캐릭터당 4~7개 정도로 제한
- 그림자는 1~2색 단단한 도트 그림자 사용
- 캐릭터 크기는 실제 표시 크기보다 작은 원본을 확대해 도트감을 살린다.

---

## Motion

모션은 부드러운 앱 애니메이션보다 게임 UI 피드백에 가깝게 만든다.

### Recommended Motion

- 버튼 클릭 시 `translate(2px, 2px)` 눌림
- 선택지 선택 시 1~2프레임 튀는 느낌
- 결과 캐릭터 등장 시 위에서 통 떨어지는 모션
- 진행 바가 블록 단위로 채워지는 모션
- 결과 카드가 `pop` 하고 등장

### Timing

| Token | Value | Use |
| --- | ---: | --- |
| `{motion.fast}` | 100ms | 버튼 눌림 |
| `{motion.base}` | 180ms | 선택 상태 변경 |
| `{motion.pop}` | 240ms | 카드 등장 |
| `{motion.result}` | 360ms | 결과 캐릭터 등장 |

### Easing

```css
--ease-pixel: steps(2, end);
--ease-pop: cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## Responsive Behavior

이 프로젝트는 모바일 사이즈만 제공한다. 기준 범위는 **360px ~ 768px 이하**다.

### Breakpoints

| Name | Width | Behavior |
| --- | ---: | --- |
| Small Mobile | 360px ~ 374px | 최소 대응 폭. 패딩 12px, 질문/결과 텍스트 줄바꿈 적극 허용 |
| Mobile | 375px ~ 430px | 기본 디자인 기준. 최대 폭 430px |
| Large Mobile / Tablet Narrow | 431px ~ 768px | UI 자체는 430px로 제한하고 중앙 정렬. 배경 여백만 확장 |
| Desktop Guard | 769px 이상 | 데스크톱 레이아웃 제공하지 않음. 모바일 프레임 중앙 정렬 |

### CSS Breakpoint Guide

```css
:root {
  --screen-padding: 16px;
  --content-max: 430px;
}

@media (max-width: 374px) {
  :root {
    --screen-padding: 12px;
  }

  .question-card {
    padding: 14px;
  }

  .option-button {
    min-height: 50px;
    font-size: 14px;
  }

  .creature-avatar.result {
    width: 112px;
    height: 112px;
  }
}

@media (min-width: 375px) and (max-width: 430px) {
  :root {
    --screen-padding: 16px;
  }
}

@media (min-width: 431px) and (max-width: 768px) {
  .app-shell {
    max-width: 430px;
    margin: 0 auto;
  }
}
```

### Mobile UI Rules

- 가로 스크롤은 사용하지 않는다.
- 버튼 터치 영역은 최소 48px 이상으로 만든다.
- 결과 화면은 길어져도 괜찮다. 대신 섹션을 카드 단위로 쪼갠다.
- 하단 CTA는 중요한 단계에서 sticky로 고정해도 된다.
- 360px에서도 텍스트가 잘리지 않아야 한다.
- 캐릭터와 결과 타입명은 화면 상단에서 바로 보여야 한다.

---

## Accessibility

- 주요 버튼 터치 영역은 최소 48px 이상
- 텍스트와 배경 대비는 충분히 확보
- 픽셀 폰트가 읽기 어렵다면 본문은 반드시 일반 고딕 사용
- 선택지는 색상만으로 구분하지 않고 아이콘/테두리/텍스트도 함께 변경
- 진행 상태는 `3 / 15`처럼 숫자로도 제공
- 결과 공유 이미지만으로 정보를 전달하지 말고 텍스트 결과도 함께 제공

---

## Do's and Don'ts

### Do

- 도트 아트처럼 보이도록 `image-rendering: pixelated`를 사용한다.
- 카드와 버튼에 blur 없는 단단한 그림자를 사용한다.
- 파스텔 배경과 진한 보라색 아웃라인을 유지한다.
- 결과 페이지는 귀엽지만 직설적인 카피를 사용한다.
- 질문 흐름은 게임 선택지처럼 빠르고 가볍게 만든다.
- 360px 화면에서 먼저 확인한다.

### Don't

- 일반 SaaS 대시보드처럼 미니멀한 흰색 카드 UI로 만들지 않는다.
- 과한 그라디언트, 유리 효과, 블러 그림자를 쓰지 않는다.
- 데스크톱 레이아웃을 따로 만들려고 하지 않는다.
- 결과 문구를 너무 순하게만 쓰지 않는다. 이 서비스의 재미는 귀여운 UI와 직설적인 해석의 대비다.
- 한글 본문 전체를 가독성 낮은 픽셀 폰트로만 처리하지 않는다.
- 캐릭터를 너무 정교하게 만들지 않는다. 약간 이상하고 단순해야 한다.

---

## Implementation Checklist

- [ ] `app-shell`은 `min-width: 360px`, `max-width: 430px`로 제한한다.
- [ ] 768px 이하 반응형을 기준으로 구현한다.
- [ ] 769px 이상에서는 모바일 프레임을 중앙 정렬한다.
- [ ] 모든 이미지 캐릭터에 `image-rendering: pixelated` 적용한다.
- [ ] 주요 카드/버튼은 3px 보라색 테두리 + 4px 단단한 그림자를 사용한다.
- [ ] 질문은 15개 내외로 구성 가능한 UI를 전제로 한다.
- [ ] 같은 선택 조합은 항상 같은 결과가 나오도록 결과 타입 UI를 고정한다.
- [ ] 자유 입력은 기본 결과 이후 AI 추가 분석 영역으로 분리한다.
- [ ] 결과 화면은 캐릭터 도감 + RPG 상태창 구조로 만든다.
- [ ] 360px, 375px, 430px, 768px에서 레이아웃을 확인한다.

---

## Suggested File/Token Structure

```ts
export const colors = {
  bgMint: '#DDF8E8',
  bgCream: '#FFF6CF',
  bgLavender: '#EEE3FF',
  bgPink: '#FFD9E8',
  bgBlue: '#CDEEFF',
  primaryPurple: '#5B3FD6',
  deepPurple: '#2F1E8A',
  hotPink: '#FF6FAE',
  pixelCyan: '#55DDE0',
  pixelYellow: '#FFD95A',
  pixelGreen: '#72D66B',
  pixelOrange: '#FF9F45',
  ink: '#2B235A',
  muted: '#7C72A8',
  white: '#FFFFFF',
};

export const layout = {
  minWidth: 360,
  maxWidth: 430,
  mobileOnlyUntil: 768,
};
```

