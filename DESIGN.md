# DESIGN.md — Muu Cozy Pixel Tablet UI System

## Overview

Muu는 사용자의 감정과 행동 패턴을 바탕으로 오늘의 인간 유형과 상태 리포트를 생성하는 **태블릿 중심 감정 체크/리포트 서비스**다. UI는 레퍼런스 이미지처럼 **코지한 픽셀 게임 메뉴**, **분홍색 인벤토리/도감 패널**, **로드맵형 정보 카드**, **도트 드로잉 툴 패널**의 느낌을 섞어 설계한다.

전체 인상은 “귀여운 픽셀 게임 속 다이어리/인벤토리 화면”에 가깝다. 화면은 넓은 태블릿 캔버스 위에 큰 패널 1~2개가 열리고, 그 안에 질문, 선택지, 결과 리포트, 상태 레이어, 감정 캐릭터가 정리된다. 결과 문구는 여전히 현실적이고 약간 팩트폭력 톤을 유지하지만, UI는 따뜻하고 말랑한 픽셀 게임 메뉴처럼 보여야 한다.

이 디자인은 **태블릿 기준 768px ~ 1024px**을 기본으로 한다. 모바일도 대응하지만 모바일 전용이 아니다. 1024px 이상에서는 콘텐츠 최대 폭을 제한하고 중앙에 배치한다.

**Key Characteristics:**

- 태블릿 중심, 768px ~ 1024px 기본 설계
- 연핑크/크림/라벤더 패널 + 적갈색/딥브라운 픽셀 아웃라인
- 픽셀 게임 메뉴처럼 탭, 인벤토리 그리드, 정보 패널, 상태 목록, 작은 아이콘 버튼 활용
- 결과 화면은 “감정 도감 + 상태창 + 행동 가이드” 구조
- 질문 화면은 “감정 아이템을 고르는 인벤토리/퀘스트 선택지”처럼 구성
- 배경은 하늘/초원/핑크 도트/체크 패턴 중 하나를 사용하되, 메인 정보는 큰 패널에 담는다
- 모션은 부드러운 앱 애니메이션보다 버튼 눌림, 탭 전환, 스탬프 등장 같은 픽셀 UI 피드백 중심

---

## Design Direction

### Product Mood

Muu는 일반 심리 테스트처럼 카드 몇 개만 넘기는 서비스가 아니라, 사용자가 자신의 감정 상태를 게임 속 메뉴에서 확인하는 듯한 경험이어야 한다.

- 시작 화면: 픽셀 게임의 타이틀/로드맵 화면처럼 넓은 배경과 중앙 패널 구성
- 질문 화면: 인벤토리 또는 퀘스트 패널에서 선택지를 고르는 느낌
- 선택지: 아이템 슬롯, 스킬 버튼, 브러시 옵션, 레이어 행처럼 표현
- 진행 상태: 상단 탭/작은 아이콘 행/로드맵 화살표로 표시
- 결과 화면: 감정 캐릭터 도감 + 상태 레이어 + 스탯/행동 가이드
- 추가 분석 입력: 메모 레이어 또는 NPC에게 보내는 쪽지 패널처럼 구성

### Visual Keywords

- Cozy pixel game UI
- Pink inventory panel
- Cream parchment card
- Roadmap board
- Pixel diary editor
- Emotion creature encyclopedia
- Cute but blunt report
- Tablet game menu
- Soft farm-life pixel mood

---

## Colors

### Core Palette

레퍼런스의 핵심은 강한 네온이 아니라 **부드러운 핑크 패널, 크림색 내부, 라벤더 보조 패널, 적갈색 라인, 청록/민트 포인트**다.

| Token | Hex | Use |
| --- | --- | --- |
| `{colors.sky-blue}` | `#69B6DD` | 로드맵/타이틀 화면 배경, 시원한 외부 배경 |
| `{colors.grass-green}` | `#36A88F` | 하단 지형/완료/회복 포인트 |
| `{colors.bg-pixel-pink}` | `#F8DDD8` | 기본 핑크 도트 배경 |
| `{colors.bg-dot-pink}` | `#E8BDB6` | 배경 도트/체크 패턴 |
| `{colors.bg-cream}` | `#FFF7F0` | 카드, 인벤토리, 패널 내부 |
| `{colors.bg-rose}` | `#F6B8C9` | 메인 패널 헤더, 선택 탭 |
| `{colors.bg-rose-deep}` | `#D96F86` | 주요 CTA, 활성 탭, 강조 라벨 |
| `{colors.bg-lavender}` | `#E9C5F3` | 보조 결과 패널, 두 번째 컬럼 |
| `{colors.bg-soft-blue}` | `#C8DDF6` | 하단 안내 패널, 차분한 정보 영역 |
| `{colors.bg-peach}` | `#FFD2B8` | 따뜻한 보조 강조, 행동 가이드 |
| `{colors.outline-brown}` | `#8A3F35` | 메인 픽셀 테두리, 아이콘 라인 |
| `{colors.deep-brown}` | `#4A2522` | 본문/제목/그림자 |
| `{colors.muted-brown}` | `#9B6B61` | 보조 텍스트, 비활성 상태 |
| `{colors.teal}` | `#4FAE9A` | 회복/안정/선택 포인트 |
| `{colors.teal-dark}` | `#2F6F68` | 청록 그림자/강조 텍스트 |
| `{colors.pixel-yellow}` | `#F8D979` | 별, 보상, 완료, 긍정 피드백 |
| `{colors.white}` | `#FFFFFF` | 내부 하이라이트, 작은 슬롯 |
| `{colors.slot-bg}` | `#E9DDE7` | 인벤토리 슬롯 배경 |
| `{colors.slot-border}` | `#B99AAA` | 슬롯 구분선 |
| `{colors.ink}` | `#3E2525` | 기본 텍스트 |

### Background Usage

태블릿 기준에서는 배경을 단순한 단색으로만 두지 않는다. 화면 목적에 따라 두 가지 배경을 쓴다.

#### 1. Pixel Editor Background

도트 드로잉 툴 느낌이 필요한 질문/입력 화면에 사용한다.

```css
body {
  background-color: #F8DDD8;
  background-image: radial-gradient(#E8BDB6 1px, transparent 1px);
  background-size: 12px 12px;
  color: #3E2525;
}
```

#### 2. Cozy Game Background

결과/홈/로드맵 화면에 사용한다. 하늘색 배경 위에 큰 패널을 띄우고, 하단에는 픽셀 초원/구름/언덕 장식을 둘 수 있다.

```css
.cozy-bg {
  background: #69B6DD;
  position: relative;
  overflow: hidden;
}

.cozy-bg::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 18%;
  background: #36A88F;
  border-top: 3px solid #2F6F68;
}
```

### Text Color Rules

- 본문은 `{colors.ink}`를 기본으로 사용한다.
- 제목과 강한 문구는 `{colors.deep-brown}`을 사용한다.
- 패널 테두리와 아이콘 라인은 `{colors.outline-brown}`을 사용한다.
- 결과의 팩폭 문구는 `{colors.bg-rose-deep}` 또는 `{colors.deep-brown}`로 강조한다.
- 빨간 경고색은 쓰지 않는다. 경고도 “위험 신호”, “상태 파일 손상”, “에너지 부족”처럼 귀엽게 표현한다.

---

## Typography

### Font Family

픽셀 게임 UI 느낌을 위해 제목/버튼/라벨은 픽셀 폰트를 사용한다. 긴 본문은 가독성을 위해 둥근 고딕을 사용한다.

```css
:root {
  --font-pixel: 'DungGeunMo', 'NeoDunggeunmo', 'Galmuri11', monospace;
  --font-body: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
}
```

### Font Usage

| Token | Size | Weight | Line Height | Use |
| --- | ---: | ---: | ---: | --- |
| `{typography.hero}` | 40px | 700 | 1.1 | 태블릿 시작 화면 타이틀 |
| `{typography.page-title}` | 30px | 700 | 1.2 | 페이지/결과 제목 |
| `{typography.result-title}` | 26px | 700 | 1.2 | 결과 타입명 |
| `{typography.question}` | 24px | 700 | 1.35 | 질문 문장 |
| `{typography.panel-title}` | 18px | 700 | 1.3 | 패널/탭/섹션 제목 |
| `{typography.button}` | 16px | 700 | 1.25 | 선택지/CTA 버튼 |
| `{typography.body}` | 15px | 500 | 1.6 | 기본 설명 텍스트 |
| `{typography.body-strong}` | 15px | 700 | 1.55 | 강조 본문 |
| `{typography.caption}` | 12px | 500 | 1.45 | 보조 설명, 진행 상태 |
| `{typography.tiny}` | 10px | 500 | 1.4 | 도트 라벨, 슬롯, 칩 |

### Typography Rules

- 타이틀, 버튼, 탭, 슬롯 라벨은 픽셀 폰트를 사용한다.
- 긴 결과 설명은 본문 폰트로 처리한다.
- 영어 라벨은 `INFO`, `STATUS`, `LAYER`, `BRUSH`, `Muu File`처럼 짧게 쓴다.
- 결과 문구는 짧고 직설적으로 쓴다. 예: “너 지금 쉬는 게 아니라 렉 걸린 거야.”

---

## Layout

### Tablet-First Container

기본 기준은 태블릿이다. 최대 콘텐츠 폭은 960px로 제한하고, 내부는 2컬럼 또는 큰 패널 중심으로 구성한다.

```css
:root {
  --screen-padding: 24px;
  --content-max: 960px;
  --panel-gap: 18px;
}

body {
  min-width: 360px;
  min-height: 100dvh;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #F8DDD8;
  background-image: radial-gradient(#E8BDB6 1px, transparent 1px);
  background-size: 12px 12px;
}

.app-shell {
  width: 100%;
  max-width: var(--content-max);
  min-height: 70vh;
  margin: 0 auto;
  padding: var(--screen-padding);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.app-shell.at-top {
  align-items: flex-start; /* 홈 화면 등 특정 화면을 상단에 배치할 때 사용 */
}

.app-shell.at-top .content-container {
  margin-top: 2rem;
}

.tablet-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: var(--panel-gap);
  align-items: start;
}

@media (max-width: 767px) {
  :root {
    --screen-padding: 14px;
    --content-max: 430px;
  }

  .tablet-workspace {
    display: flex;
    flex-direction: column;
  }
}

@media (min-width: 1025px) {
  body {
    display: flex;
    justify-content: center;
  }

  .app-shell {
    max-width: 1024px;
  }
}
```

### Layout Modes

#### 1. Roadmap Board Layout

홈/결과 요약에 적합한 넓은 보드형 레이아웃이다.

```css
.roadmap-board {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.roadmap-card.primary {
  background: #F6B8C9;
}

.roadmap-card.secondary {
  background: #E9C5F3;
}

@media (max-width: 767px) {
  .roadmap-board {
    grid-template-columns: 1fr;
  }
}
```

#### 2. Inventory Panel Layout

질문/선택지 화면에 적합하다. 좌측에는 질문/선택지, 우측에는 현재 선택 정보 또는 감정 캐릭터 미리보기를 둔다.

```css
.inventory-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 16px;
}

@media (max-width: 767px) {
  .inventory-layout {
    grid-template-columns: 1fr;
  }
}
```

#### 3. Book Panel Layout

결과 화면에 적합하다. 펼친 책처럼 좌우 패널을 나눠, 왼쪽은 상태 요약/스탯, 오른쪽은 캐릭터/행동 가이드로 구성한다.

```css
.book-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #FFF7F0;
  border: 3px solid #8A3F35;
  box-shadow: 4px 4px 0 #4A2522;
}

.book-page + .book-page {
  border-left: 3px solid #8A3F35;
}

@media (max-width: 767px) {
  .book-panel {
    grid-template-columns: 1fr;
  }

  .book-page + .book-page {
    border-left: 0;
    border-top: 3px solid #8A3F35;
  }
}
```

### Spacing System

| Token | Value | Use |
| --- | ---: | --- |
| `{spacing.xxs}` | 4px | 픽셀 그림자, 슬롯 내부 |
| `{spacing.xs}` | 8px | 아이콘/칩 간격 |
| `{spacing.sm}` | 12px | 버튼 내부, 작은 패널 |
| `{spacing.md}` | 16px | 기본 카드 패딩 |
| `{spacing.lg}` | 20px | 주요 패널 패딩 |
| `{spacing.xl}` | 24px | 태블릿 기본 화면 패딩 |
| `{spacing.xxl}` | 32px | 큰 섹션 간격 |

---

## Pixel Style Rules

### Pixel Border

레퍼런스처럼 테두리는 얇고 선명해야 한다. 일반적인 둥근 SaaS 카드처럼 보이면 안 된다.

```css
.pixel-panel {
  background: #FFF7F0;
  border: 3px solid #8A3F35;
  border-radius: 3px;
  box-shadow: 4px 4px 0 #4A2522;
}
```

### Panel Header

게임 메뉴/인벤토리 느낌을 위해 패널 상단에 헤더 바를 둔다.

```css
.pixel-panel__header {
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: #F6B8C9;
  border-bottom: 3px solid #8A3F35;
  font-family: var(--font-pixel);
  font-size: 16px;
}
```

### Checker Side Rail

인벤토리/요리 메뉴 이미지처럼 좌우에 체크 패턴 레일을 둘 수 있다.

```css
.checker-rail {
  background-image:
    linear-gradient(45deg, #FFFFFF 25%, transparent 25%),
    linear-gradient(-45deg, #FFFFFF 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #FFFFFF 75%),
    linear-gradient(-45deg, transparent 75%, #FFFFFF 75%);
  background-size: 16px 16px;
  background-color: #F6B8C9;
}
```

### Pixel Shadow

그림자는 흐리게 처리하지 않는다. `blur` 없는 단단한 그림자만 사용한다.

```css
box-shadow: 4px 4px 0 #4A2522;
```

버튼 눌림 상태는 그림자를 줄이고 위치를 이동한다.

```css
.pixel-button:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #4A2522;
}
```

---

## Shapes

| Token | Value | Use |
| --- | ---: | --- |
| `{rounded.none}` | 0px | 슬롯, 그리드 셀 |
| `{rounded.pixel}` | 3px | 패널, 버튼, 탭 |
| `{rounded.sm}` | 5px | 작은 칩, 아이콘 버튼 |
| `{rounded.md}` | 8px | 말풍선, 입력창 |
| `{rounded.book}` | 12px | 큰 책/도감 패널 외곽 |
| `{rounded.full}` | 9999px | 캐릭터 배지, 토글 |

### Rule

- 주요 UI는 각진 사각형과 작은 radius를 사용한다.
- 캐릭터, 말풍선, 토글은 둥글게 만들어도 된다.
- 큰 20px 이상 둥근 카드 UI는 피한다. 이 서비스의 기본은 픽셀 게임 메뉴다.

---

## Components

### App Shell

**`app-shell`** — 전체 화면 컨테이너. 태블릿 기준 `max-width: 960px`, 데스크톱에서는 최대 `1024px`까지 허용한다. 모바일에서는 `max-width: 430px`로 자연스럽게 축소한다.

### Pixel Top Bar

**`pixel-top-bar`** — 화면 상단의 작은 아이콘 메뉴. 홈, 이전, 저장, 공유, 설정, 진행 상태를 표시한다.

```css
.pixel-top-bar {
  height: 48px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  margin-bottom: 14px;
  background: rgba(255, 247, 240, 0.82);
  border: 3px solid #8A3F35;
  box-shadow: 3px 3px 0 #4A2522;
}

.tool-icon {
  width: 34px;
  height: 34px;
  display: inline-grid;
  place-items: center;
  background: #FFF7F0;
  border: 2px solid #8A3F35;
  box-shadow: 2px 2px 0 #4A2522;
}
```

### Tab Rail

**`tab-rail`** — 우측 세로 탭 또는 상단 가로 탭. 결과, 상태, 기록, 설정 같은 화면 전환에 사용한다.

```css
.tab-rail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tab-button {
  width: 48px;
  height: 48px;
  background: #F6B8C9;
  border: 2px solid #8A3F35;
  font-family: var(--font-pixel);
}

.tab-button[aria-selected='true'] {
  background: #F8D979;
  transform: translateX(-4px);
}
```

모바일에서는 세로 탭을 하단/상단 가로 탭으로 바꾼다.

### Roadmap Card

**`roadmap-card`** — 질문 진행 흐름, 결과 요약, 업데이트/추천 행동을 보여주는 큰 카드. 레퍼런스의 로드맵 이미지처럼 섹션별 리스트를 구분한다.

구성:

- 상단 리본 라벨: `NEXT MUU`, `TODAY FILE`, `RESULT`
- 제목: 현재 상태/결과 타입
- 섹션 리스트: 감정, 에너지, 회복, 위험 신호, 행동 가이드
- 하단 장식: 픽셀 초원/작은 캐릭터/아이콘

```css
.roadmap-card {
  position: relative;
  background: #F6B8C9;
  border: 3px solid #8A3F35;
  box-shadow: 4px 4px 0 #4A2522;
  overflow: hidden;
}

.roadmap-section {
  padding: 10px 14px;
  border-top: 2px solid rgba(138, 63, 53, 0.45);
  background: rgba(255, 247, 240, 0.58);
}
```

### Inventory Panel

**`inventory-panel`** — 질문 선택지를 인벤토리처럼 보여주는 핵심 컴포넌트다.

구성:

- 상단 탭 아이콘 행
- 좌측: 질문 카테고리/선택지 목록
- 중앙: 선택지 그리드 또는 리스트
- 우측: 선택한 답변 설명/캐릭터 반응

```css
.inventory-panel {
  background: #F6B8C9;
  border: 3px solid #8A3F35;
  box-shadow: 4px 4px 0 #4A2522;
  display: grid;
  grid-template-columns: 1fr 300px;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(48px, 1fr));
  gap: 4px;
}

.inventory-slot {
  aspect-ratio: 1;
  background: #E9DDE7;
  border: 2px solid #B99AAA;
  display: grid;
  place-items: center;
}

.inventory-slot[aria-selected='true'] {
  border-color: #8A3F35;
  background: #FFF7F0;
  box-shadow: inset 0 0 0 2px #F8D979;
}
```

### Question Card

**`question-card`** — 질문 문장을 보여주는 카드. 큰 패널 안의 상단 영역으로 사용한다.

구성:

- 라벨: `Muu Check 03 / 15`
- 질문 문장
- 보조 설명
- 작은 감정 캐릭터 또는 아이콘

```css
.question-card {
  background: #FFF7F0;
  border: 3px solid #8A3F35;
  padding: 20px;
  font-family: var(--font-body);
}

.question-card__label {
  font-family: var(--font-pixel);
  font-size: 12px;
  color: #9B6B61;
  margin-bottom: 8px;
}
```

### Option Button

**`option-button`** — 감정 선택지. 버튼이라기보다 아이템 행 또는 퀘스트 선택지처럼 보여야 한다.

```css
.option-button {
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #FFF7F0;
  border: 2px solid #8A3F35;
  box-shadow: 3px 3px 0 #4A2522;
  font-family: var(--font-pixel);
  color: #3E2525;
}

.option-button::before {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid #8A3F35;
  background: #FFFFFF;
}

.option-button[aria-pressed='true'] {
  background: #F8D979;
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #4A2522;
}

.option-button[aria-pressed='true']::before {
  background: #D96F86;
}
```

### Primary CTA

**`button-primary`** — 시작하기, 다음, 결과 보기 등 가장 중요한 액션.

- 높이: 56px 이상
- 배경: `#D96F86` 또는 `#F8D979`
- 테두리: `3px solid #8A3F35`
- 그림자: `4px 4px 0 #4A2522`
- 폰트: 픽셀 폰트 16px 이상

### Secondary Button

**`button-secondary`** — 이전, 다시하기, 나중에 하기 등에 사용한다. 배경은 크림색, 테두리와 그림자는 동일하게 적용한다.

### Book Result Panel

**`book-result-panel`** — 결과 화면의 핵심. 펼친 책/도감처럼 좌우로 나뉜 패널이다.

왼쪽 페이지:

- 오늘 날짜/상태 요약
- 타입명
- 주요 스탯
- 위험 신호

오른쪽 페이지:

- 대표 감정 캐릭터
- 한 줄 팩폭
- 행동 가이드
- 추가 분석 입력 CTA

```css
.book-result-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #FFF7F0;
  border: 3px solid #8A3F35;
  border-radius: 12px;
  box-shadow: 5px 5px 0 #4A2522;
  overflow: hidden;
}

.book-page {
  padding: 20px;
}

.book-page__title {
  padding: 10px 12px;
  margin: -20px -20px 16px;
  background: #F6B8C9;
  border-bottom: 3px solid #8A3F35;
  font-family: var(--font-pixel);
}
```

### Layer Status List

**`layer-status-list`** — 결과 페이지의 상태 분석을 레이어 패널처럼 보여준다.

```css
.layer-row {
  display: grid;
  grid-template-columns: 28px 1fr auto;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 7px 10px;
  background: #FFF7F0;
  border-bottom: 2px solid rgba(138, 63, 53, 0.45);
}

.layer-row__icon {
  width: 22px;
  height: 22px;
  border: 2px solid #8A3F35;
  background: #F8D979;
}
```

예시:

```md
Layer 01 현재 상태: 과열 직전
Layer 02 강점: 끝까지 버티는 힘
Layer 03 위험 신호: 쉬어도 충전이 안 됨
Brush Tip: 오늘은 계획을 줄이고 회복 행동 하나만 하기
```

### Stat Block

**`stat-block`** — 감정/에너지 상태를 게임 스탯처럼 보여준다.

예시 스탯:

- 에너지
- 사회성 배터리
- 회복력
- 현실 회피력
- 자기돌봄 필요도

```css
.stat-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 10px;
  align-items: center;
}

.stat-cells {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 3px;
}

.stat-cell {
  height: 14px;
  background: #E9DDE7;
  border: 1px solid #B99AAA;
}

.stat-cell.filled {
  background: #4FAE9A;
  border-color: #2F6F68;
}
```

### Creature Avatar

**`creature-avatar`** — 결과 타입을 대표하는 도트 캐릭터. 레퍼런스처럼 너무 정교한 얼굴보다 단순한 실루엣과 색감이 중요하다.

권장 크기:

- 작은 아이콘: 32px × 32px
- 질문 보조 캐릭터: 64px × 64px
- 결과 대표 캐릭터: 160px × 160px
- 공유 카드 캐릭터: 200px × 200px

```css
.pixel-art {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

### Fact Punch Bubble

**`fact-punch-bubble`** — 결과의 핵심 문장. 귀엽지만 직설적인 문구를 넣는다.

```css
.fact-punch-bubble {
  background: #FFD2B8;
  border: 3px solid #8A3F35;
  border-radius: 8px;
  padding: 14px 16px;
  font-family: var(--font-pixel);
  color: #4A2522;
}
```

예시 문구:

- “너 지금 쉬는 게 아니라 렉 걸린 거야.”
- “괜찮은 척하느라 에너지 다 썼어.”
- “계획이 문제가 아니라 체력이 먼저 꺼졌어.”

### Tool Option Panel

**`tool-option-panel`** — 브러시 설정 패널처럼 상태 옵션을 보여준다.

Muu에서는 아래처럼 의미를 바꿔 사용한다.

- `Pixel-perfect` → 상태 정확도
- `Stabilizer` → 감정 안정도
- `Water color` → 회복 말랑함
- `Pressure sensitivity` → 외부 압박감
- `No dithering` → 오늘은 복잡하게 생각하지 않기

### AI Extra Input

**`extra-analysis-input`** — 사용자가 상황을 직접 입력하는 영역. 기본 결과는 고정 룰 기반으로 나오고, 이 입력값이 있을 때 AI 추가 분석을 붙인다.

```css
.extra-analysis-input {
  min-height: 140px;
  width: 100%;
  padding: 14px;
  background: #FFF7F0;
  border: 3px solid #8A3F35;
  font-family: var(--font-body);
  color: #3E2525;
  resize: vertical;
}
```

Placeholder:

```txt
지금 상황을 조금만 더 적어줘. 내가 더 세게 봐줄게.
```

### Share Card

**`share-card`** — 결과 공유용 이미지. 1:1 또는 4:5 비율을 권장한다.

구성:

- 서비스명 `Muu`
- 대표 감정 캐릭터
- 결과 타입명
- 한 줄 팩폭
- 작은 스탯 바
- 하단 파일명: `today_muu_result.png`

---

## Illustration & Character Direction

### Character Style

캐릭터는 완성도 높은 캐릭터 IP보다, 감정 상태를 단순하고 귀엽게 보여주는 도트 생명체에 가깝다.

좋은 방향:

- 말랑한 젤리 덩어리
- 작은 유령
- 핑크 먼지 생명체
- 둥근 버섯/꽃봉오리
- 지친 공룡
- 조용한 조약돌 몬스터
- 감정이 색과 자세로 드러나는 생명체

피해야 할 방향:

- 고해상도 3D 캐릭터
- 너무 정교한 애니메이션풍 일러스트
- 일반 이모지 느낌
- 기업용 플랫 일러스트
- 표정이 너무 복잡한 캐릭터
- 지나치게 귀엽기만 하고 결과 문구와 대비가 없는 캐릭터

### Pixel Art Asset Rules

- 모든 캐릭터 이미지는 `image-rendering: pixelated` 적용
- 외곽선은 적갈색/딥브라운 계열 사용
- 색상 수는 캐릭터당 4~7개 정도로 제한
- 그림자는 1~2색 단단한 도트 그림자 사용
- 캐릭터 원본은 작게 만들고 확대해 도트감을 살린다.
- 16x16 favicon은 얼굴, 배경, 세부 장식을 제거하고 실루엣만 남긴다.

---

## Motion

모션은 픽셀 게임 메뉴의 즉각적인 피드백처럼 만든다.

### Recommended Motion

- 버튼 클릭 시 `translate(2px, 2px)` 눌림
- 선택지 선택 시 슬롯 테두리가 반짝이거나 체크 표시 등장
- 결과 캐릭터는 캔버스에 스탬프 찍히듯 등장
- 진행 상태는 블록 단위로 채워짐
- 탭 전환은 부드러운 슬라이드보다 짧은 점프 느낌
- 패널은 `pop` 하고 열림

### Timing

| Token | Value | Use |
| --- | ---: | --- |
| `{motion.fast}` | 90ms | 버튼 눌림 |
| `{motion.base}` | 160ms | 선택 상태 변경 |
| `{motion.pop}` | 220ms | 패널 등장 |
| `{motion.result}` | 340ms | 결과 캐릭터 등장 |

```css
:root {
  --ease-pixel: steps(2, end);
  --ease-pop: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## Responsive Behavior

### Breakpoints

| Name | Width | Behavior |
| --- | ---: | --- |
| Small Mobile | 360px ~ 430px | 단일 컬럼, 패널 세로 스택, 탭은 상단/하단으로 이동 |
| Large Mobile | 431px ~ 767px | 단일 컬럼 유지, 패널 최대 430~560px 중앙 정렬 |
| Tablet | 768px ~ 1024px | 기본 기준. 2컬럼, 인벤토리/도감 패널 중심 |
| Desktop Guard | 1025px 이상 | 콘텐츠 최대 1024px 중앙 정렬, 추가 데스크톱 확장 없음 |

### CSS Breakpoint Guide

```css
@media (max-width: 430px) {
  .app-shell {
    padding: 14px;
  }

  .pixel-top-bar {
    height: 44px;
    overflow-x: auto;
  }

  .tool-icon {
    width: 30px;
    height: 30px;
    flex: 0 0 auto;
  }

  .inventory-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .creature-avatar.result {
    width: 128px;
    height: 128px;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .app-shell {
    max-width: 960px;
    padding: 24px;
  }

  .tablet-workspace,
  .inventory-layout,
  .book-result-panel {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1025px) {
  .app-shell {
    max-width: 1024px;
  }
}
```

### Tablet UI Rules

- 태블릿에서는 2컬럼을 적극 사용한다.
- 좌측은 메인 질문/결과, 우측은 상태/캐릭터/옵션 패널로 구성한다.
- 패널 안쪽은 촘촘해도 되지만, 터치 영역은 최소 44px 이상 확보한다.
- 인벤토리 슬롯은 48px 이상을 권장한다.
- 모바일에서는 같은 정보를 줄이지 말고 세로로 쌓는다.
- 가로 스크롤은 툴바 아이콘 행처럼 제한된 영역에서만 허용한다.

---

## Accessibility

- 주요 버튼 터치 영역은 최소 44px 이상
- 모바일 CTA는 48px 이상 권장
- 픽셀 폰트가 읽기 어렵다면 본문은 반드시 일반 고딕 사용
- 선택지는 색상만으로 구분하지 않고 체크/테두리/텍스트도 함께 변경
- 진행 상태는 `3 / 15`처럼 숫자로도 제공
- 작은 툴바 아이콘은 `aria-label`을 반드시 제공
- 결과 공유 이미지만으로 정보를 전달하지 말고 텍스트 결과도 함께 제공

---

## Do's and Don'ts

### Do

- 연핑크/크림/라벤더/하늘색을 중심으로 코지한 픽셀 게임 톤을 유지한다.
- 큰 태블릿 패널, 인벤토리 그리드, 책/도감 레이아웃을 활용한다.
- 카드와 버튼에 blur 없는 단단한 픽셀 그림자를 사용한다.
- 테두리는 적갈색/딥브라운 계열로 통일한다.
- 상단 툴바, 탭 레일, 슬롯, 레이어 행 같은 게임 UI 요소를 사용한다.
- 결과 문구는 귀엽지만 직설적으로 쓴다.
- 768px 태블릿 화면에서 먼저 확인한다.

### Don't

- 모바일 430px 고정 UI로 만들지 않는다.
- 일반 SaaS 대시보드처럼 미니멀한 흰색 카드 UI로 만들지 않는다.
- 강한 보라색/민트 네온 팔레트로 돌아가지 않는다.
- 과한 그라디언트, 유리 효과, 블러 그림자를 쓰지 않는다.
- 패널을 너무 둥글게 만들어 현대적인 앱 카드처럼 보이게 하지 않는다.
- 결과 문구를 너무 순하게만 쓰지 않는다.
- 한글 본문 전체를 가독성 낮은 픽셀 폰트로만 처리하지 않는다.
- 툴바/아이콘을 과하게 넣어 정보보다 장식이 많아지게 하지 않는다.

---

## Implementation Checklist

- [ ] `app-shell`은 태블릿 기준 `max-width: 960px` 이상으로 구성한다.
- [ ] 기본 기준 화면은 768px ~ 1024px이다.
- [ ] 768px 이상에서는 2컬럼 레이아웃을 사용한다.
- [ ] 모바일에서는 1컬럼으로 자연스럽게 스택한다.
- [ ] 기본 배경은 핑크 도트 또는 코지 게임 배경 중 화면 목적에 맞게 적용한다.
- [ ] 주요 패널은 3px 브라운 테두리 + 4px 단단한 그림자를 사용한다.
- [ ] 질문 선택지는 인벤토리 슬롯/아이템 행처럼 보이게 만든다.
- [ ] 결과 화면은 책/도감 패널 + 감정 캐릭터 + 레이어 상태 목록으로 구성한다.
- [ ] 모든 캐릭터 이미지에 `image-rendering: pixelated`를 적용한다.
- [ ] 자유 입력은 기본 결과 이후 AI 추가 분석 영역으로 분리한다.
- [ ] 같은 선택 조합은 항상 같은 결과가 나오도록 결과 타입 UI를 고정한다.
- [ ] 16x16 favicon은 얼굴/배경 없는 단순 실루엣으로 관리한다.
- [ ] 430px, 768px, 1024px에서 레이아웃을 확인한다.

---

## Suggested File/Token Structure

```ts
export const colors = {
  skyBlue: '#69B6DD',
  grassGreen: '#36A88F',
  bgPixelPink: '#F8DDD8',
  bgDotPink: '#E8BDB6',
  bgCream: '#FFF7F0',
  bgRose: '#F6B8C9',
  bgRoseDeep: '#D96F86',
  bgLavender: '#E9C5F3',
  bgSoftBlue: '#C8DDF6',
  bgPeach: '#FFD2B8',
  outlineBrown: '#8A3F35',
  deepBrown: '#4A2522',
  mutedBrown: '#9B6B61',
  teal: '#4FAE9A',
  tealDark: '#2F6F68',
  pixelYellow: '#F8D979',
  white: '#FFFFFF',
  slotBg: '#E9DDE7',
  slotBorder: '#B99AAA',
  ink: '#3E2525',
};

export const layout = {
  minWidth: 360,
  mobileMax: 767,
  tabletMin: 768,
  tabletMax: 1024,
  contentMax: 960,
  desktopGuardMax: 1024,
};

export const radii = {
  none: 0,
  pixel: 3,
  sm: 5,
  md: 8,
  book: 12,
  full: 9999,
};

export const shadows = {
  pixelSm: '2px 2px 0 #4A2522',
  pixelMd: '3px 3px 0 #4A2522',
  pixelLg: '4px 4px 0 #4A2522',
  pixelBook: '5px 5px 0 #4A2522',
};

export const typography = {
  fontPixel: "'DungGeunMo', 'NeoDunggeunmo', 'Galmuri11', monospace",
  fontBody: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
};
```
