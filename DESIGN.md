# DESIGN.md — Muu Pixel Diary UI System

## Overview

Muu는 사용자의 감정과 행동 패턴을 바탕으로 오늘의 인간 유형과 상태 리포트를 생성하는 **태블릿 중심 감정 체크 앱**이다. UI는 이미지 레퍼런스처럼 **픽셀 드로잉 툴 / 작은 게임 편집기 / 도트 다이어리**가 섞인 느낌으로 설계한다.

전체 인상은 기존의 RPG 상태창보다 더 부드럽고 감성적이다. 화면은 연한 핑크 도트 배경 위에 크림색 패널, 적갈색 픽셀 라인, 작은 툴바 아이콘, 미니 윈도우, 레이어 패널 같은 요소가 떠 있는 구조를 가진다. 결과 문구는 여전히 현실적이고 살짝 팩트폭력 톤을 유지하지만, UI 자체는 말랑하고 조용한 픽셀 문구점처럼 보여야 한다.

이 디자인은 **768px ~ 1024px 태블릿 환경**을 기준으로 하되, 그 이하 해상도(모바일 등)에서는 유연하게 반응형으로 작동하도록 설계한다. 1024px을 초과하는 환경에서는 태블릿 프레임을 중앙 정렬하며, 실제 UI 폭은 최대 960px로 제한한다.

**Key Characteristics:**

- 태블릿 중심(768px ~ 1024px), 모바일 보조 대응
- 연한 핑크 도트 배경 + 크림색 캔버스/패널 + 적갈색 픽셀 아웃라인
- 픽셀 드로잉 앱처럼 상단 툴바, 작은 아이콘 버튼, 설정 패널, 레이어 리스트 느낌 활용
- 캐릭터는 둥글고 단순한 감정 생명체. 눈코입을 과하게 넣지 않고 실루엣과 색감으로 표현
- 결과 페이지는 “오늘의 감정 작업 파일”처럼 구성: 캐릭터 캔버스, 타입명, 한 줄 팩폭, 상태 레이어, 행동 브러시
- 텍스트는 상담 앱보다 “귀여운 툴이 냉정하게 상태를 분석해주는” 톤
- 인터랙션은 버튼이 눌리는 픽셀 피드백, 작은 패널이 탁 열리는 느낌 위주

---

## Design Direction

### Product Mood

서비스는 일반 심리 테스트 UI처럼 깨끗하고 미니멀하게만 가면 안 된다. 사용자는 질문에 답하면서 자기 감정을 작은 도트 그림으로 편집하고 저장하는 느낌을 받아야 한다.

- 시작 화면: 작은 픽셀 작업실에 들어가는 느낌
- 질문 화면: 캔버스 위에 질문 카드가 뜨고, 아래에 도구 선택 버튼이 놓인 구조
- 선택지: 브러시/스탬프/레이어 슬롯 같은 픽셀 버튼
- 진행 상태: 상단 툴바 또는 작은 레이어 진행 표시
- 결과 화면: 감정 캐릭터 캔버스 + 분석 패널 + 상태 레이어 리스트
- 추가 분석 입력: 메모 패널 또는 툴 옵션 패널처럼 구성

### Visual Keywords

- Pixel drawing tool
- Pink dotted desktop
- Cream canvas panel
- Tiny toolbar icons
- Soft but blunt
- Cozy pixel editor
- Emotion creature file
- Aseprite-like UI mood, tablet-centric & responsive
- Cute UI, unsparing report

---

## Colors

### Core Palette

레퍼런스 이미지는 강한 보라색보다 **연한 핑크 배경, 크림 패널, 적갈색 라인, 채도 낮은 청록/민트 포인트**가 핵심이다. 기존 보라색 중심 팔레트는 유지하지 않고 아래 톤을 기본으로 한다.

| Token                     | Hex       | Use                                              |
| ------------------------- | --------- | ------------------------------------------------ |
| `{colors.bg-pixel-pink}`  | `#F8DDD8` | 기본 페이지 배경. 레퍼런스의 연한 핑크 작업 공간 |
| `{colors.bg-dot-pink}`    | `#E8BDB6` | 배경 도트/그리드 라인                            |
| `{colors.bg-cream}`       | `#FFF9EF` | 카드, 캔버스, 패널 내부                          |
| `{colors.bg-warm-cream}`  | `#F6EDE1` | 보조 패널, 툴 옵션 박스                          |
| `{colors.bg-soft-rose}`   | `#F2B8AF` | 선택 상태, 탭, 강조 패널                         |
| `{colors.bg-rose-strong}` | `#D96F66` | 주요 CTA, 활성 탭, 위험/팩폭 포인트              |
| `{colors.outline-brown}`  | `#8A3F35` | 메인 픽셀 아웃라인, 아이콘 라인                  |
| `{colors.deep-brown}`     | `#5A2A25` | 강한 텍스트, 그림자, 눌림 상태                   |
| `{colors.muted-brown}`    | `#9B6B61` | 보조 텍스트, 비활성 아이콘                       |
| `{colors.teal-block}`     | `#78A8A4` | 캔버스/맵/상태 블록 포인트                       |
| `{colors.teal-dark}`      | `#4F7778` | 청록 계열 그림자/라인                            |
| `{colors.sakura}`         | `#F5A3BA` | 감정 캐릭터, 귀여운 강조                         |
| `{colors.blush}`          | `#FFD2D8` | 말풍선, 부드러운 태그                            |
| `{colors.pixel-yellow}`   | `#F8D979` | 보상/완료/작은 별 아이콘                         |
| `{colors.white}`          | `#FFFFFF` | 버튼 내부, 캔버스 하이라이트                     |
| `{colors.ink}`            | `#4A2D2A` | 기본 본문 텍스트                                 |

### Background Usage

기본 배경은 `{colors.bg-pixel-pink}`를 사용한다. 레퍼런스처럼 바탕 전체에 작은 점이 반복되는 도트 그리드를 깐다. 격자선은 너무 강하지 않게 하고, 점은 12px ~ 16px 간격을 권장한다.

```css
body {
  background-color: #f8ddd8;
  background-image: radial-gradient(#e8bdb6 1px, transparent 1px);
  background-size: 12px 12px;
  color: #4a2d2a;
}
```

결과 페이지는 일반 질문 페이지보다 “픽셀 편집기 화면”처럼 보여야 한다. 상단에는 작은 툴바, 중앙에는 감정 캐릭터 캔버스, 하단에는 레이어/상태 패널을 배치한다. 배경 장식은 별, 잎사귀보다 **작은 사각 선택 박스, 브러시 아이콘, 레이어 점, 미니 창 핸들**을 낮은 투명도로 반복한다.

### Text Color Rules

- 본문은 `{colors.ink}`를 기본으로 사용한다.
- 제목과 강한 문구는 `{colors.deep-brown}`을 사용한다.
- 버튼/패널 테두리는 `{colors.outline-brown}`을 사용한다.
- 팩폭 한 줄은 `{colors.bg-rose-strong}` 또는 `{colors.deep-brown}`로 강조한다.
- 빨간 경고 느낌은 피한다. “위험”보다 “지금 상태가 좀 심각한 파일” 같은 귀여운 표현을 쓴다.

---

## Typography

### Font Family

도트 UI에는 픽셀 폰트를 우선한다. 단, 한글 가독성이 떨어지면 제목/버튼/라벨만 픽셀 폰트를 사용하고 본문은 둥근 고딕을 사용한다.

```css
--font-pixel: "DungGeunMo", "NeoDunggeunmo", "Galmuri11", monospace;
--font-body: "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
```

### Font Usage

| Token                       | Size | Weight | Line Height | Use                    |
| --------------------------- | ---: | -----: | ----------: | ---------------------- |
| `{typography.hero}`         | 26px |    700 |         1.2 | 시작 화면 타이틀       |
| `{typography.result-title}` | 24px |    700 |         1.2 | 결과 타입명            |
| `{typography.question}`     | 21px |    700 |        1.35 | 질문 문장              |
| `{typography.panel-title}`  | 16px |    700 |         1.3 | 툴 패널/결과 섹션 제목 |
| `{typography.button}`       | 15px |    700 |        1.25 | 선택지/CTA 버튼        |
| `{typography.body}`         | 15px |    500 |         1.6 | 기본 설명 텍스트       |
| `{typography.body-strong}`  | 15px |    700 |        1.55 | 강조 본문              |
| `{typography.caption}`      | 12px |    500 |        1.45 | 보조 설명, 진행 상태   |
| `{typography.tiny}`         | 10px |    500 |         1.4 | 도트 라벨, 칩, 툴팁    |

### Typography Rules

- 제목/버튼/패널 라벨/툴바 텍스트는 픽셀 폰트를 사용한다.
- 긴 설명문은 `{font-body}`를 사용해 가독성을 확보한다.
- 패널 타이틀은 `Brush`, `Layer`, `Status`, `Muu File`처럼 짧은 라벨을 쓸 수 있다.
- 결과 문구는 짧고 강하게 쓴다. 예: “너 지금 쉬는 게 아니라 렉 걸린 거야.”

---

## Layout

### Tablet-Centric Container

모든 화면은 768px ~ 1024px 태블릿을 기준으로 한다. 데스크톱에서는 태블릿 픽셀 앱이 중앙에 떠 있는 형태로 보여주며, 모바일은 1컬럼으로 축약하여 대응한다.

```css
.app-shell {
  width: 100%;
  min-width: 360px;
  max-width: 960px;
  min-height: 100dvh;
  margin: 0 auto;
  padding: 24px;
  background-color: #f8ddd8;
  background-image: radial-gradient(#e8bdb6 1px, transparent 1px);
  background-size: 16px 16px;
}

/* Tablet Workspace - 2 Column Layout */
.tablet-workspace {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  align-items: start;
}

@media (max-width: 767px) {
  .app-shell {
    padding: 14px;
  }
  .tablet-workspace {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1025px) {
  body {
    display: flex;
    justify-content: center;
    background: #f6ede1;
  }

  .app-shell {
    max-width: 960px;
    box-shadow:
      0 0 0 4px #8a3f35,
      12px 12px 0 #5a2a25;
  }
}
```

### Spacing System

| Token           | Value | Use                           |
| --------------- | ----: | ----------------------------- |
| `{spacing.xxs}` |   4px | 픽셀 그림자, 작은 아이콘 간격 |
| `{spacing.xs}`  |   8px | 칩 내부, 툴바 아이콘 간격     |
| `{spacing.sm}`  |  12px | 버튼 내부, 카드 내 작은 간격  |
| `{spacing.md}`  |  16px | 기본 화면 패딩, 카드 내부     |
| `{spacing.lg}`  |  20px | 주요 패널 패딩                |
| `{spacing.xl}`  |  24px | 섹션 간격                     |
| `{spacing.xxl}` |  32px | 히어로/결과 상단 간격         |

### Screen Structure

#### Start Screen

- 상단: 작은 툴바 형태의 로고 영역
- 중앙: 서비스명 `Muu` + 한 줄 설명
- 중앙 하단: 감정 캐릭터가 놓인 크림색 캔버스 패널
- 하단: 시작 버튼 + 작은 안내 문구
- 배경: 연한 핑크 도트 그리드

#### Question Screen

- 상단: 픽셀 툴바 + `Q.03 / 15` 진행 표시
- 중앙: 질문 카드 또는 캔버스 패널
- 하단: 선택지 버튼 2~5개
- 선택지는 브러시 옵션 또는 레이어 슬롯처럼 보여야 한다.

#### Result Screen

- 상단: 결과 파일명 `muu-result.psd` 같은 픽셀 윈도우 헤더
- 중앙: 대표 감정 캐릭터가 들어간 캔버스 패널
- 그 아래: 한 줄 팩폭 말풍선
- 섹션: 현재 상태 / 강점 / 위험 신호 / 지금 해야 할 행동
- 하단: 다시하기, 공유하기, 추가 분석 입력 버튼
- 상태 섹션은 레이어 패널처럼 줄 단위로 정리한다.

---

## Pixel Style Rules

### Pixel Border

픽셀 UI의 핵심은 일반적인 둥근 카드가 아니라 **얇은 픽셀 라인 + 작은 단단한 그림자 + 크림색 내부**다. 기존의 강한 3px 보라색 테두리보다 레퍼런스처럼 2px 적갈색 라인을 기본으로 쓴다.

```css
.pixel-card {
  background: #fff9ef;
  border: 2px solid #8a3f35;
  border-radius: 2px;
  box-shadow: 3px 3px 0 #5a2a25;
}
```

### Window Panel

레퍼런스의 작은 프로그램 창 느낌을 위해 패널 상단에 헤더 바를 둘 수 있다.

```css
.pixel-window {
  background: #fff9ef;
  border: 2px solid #8a3f35;
  box-shadow: 3px 3px 0 #5a2a25;
}

.pixel-window__titlebar {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  background: #fff9ef;
  border-bottom: 2px solid #8a3f35;
  font-family: var(--font-pixel);
  font-size: 11px;
}
```

### Stepped Corner Option

완전한 픽셀 감성을 더 주고 싶으면 `clip-path`로 모서리를 살짝 깎는다. 단, 레퍼런스는 완전한 계단 모서리보다 작은 사각 창에 가까우므로 과하게 쓰지 않는다.

```css
.pixel-cut {
  clip-path: polygon(
    0 6px,
    6px 6px,
    6px 0,
    calc(100% - 6px) 0,
    calc(100% - 6px) 6px,
    100% 6px,
    100% calc(100% - 6px),
    calc(100% - 6px) calc(100% - 6px),
    calc(100% - 6px) 100%,
    6px 100%,
    6px calc(100% - 6px),
    0 calc(100% - 6px)
  );
}
```

### Pixel Shadow

그림자는 흐리게 처리하지 않는다. `blur` 없는 단단한 그림자를 사용한다. 기본 그림자는 2~3px 정도로 작게 두고, CTA만 4px까지 허용한다.

```css
box-shadow: 3px 3px 0 #5a2a25;
```

상태별로 그림자 위치를 조절한다.

```css
.button:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #5a2a25;
}
```

---

## Shapes

이 디자인 시스템은 각진 사각형을 기본으로 한다. 단, 캐릭터와 감정 칩은 레퍼런스의 둥근 캐릭터처럼 부드러워도 된다.

| Token             |  Value | Use                      |
| ----------------- | -----: | ------------------------ |
| `{rounded.none}`  |    0px | 툴바 아이콘, 레이어 슬롯 |
| `{rounded.pixel}` |    2px | 버튼, 카드, 결과창 기본  |
| `{rounded.sm}`    |    4px | 작은 태그, 상태 칩       |
| `{rounded.md}`    |    8px | 입력창, 말풍선           |
| `{rounded.full}`  | 9999px | 캐릭터 배지, 감정 아이콘 |

### Rule

- 주요 UI는 거의 각진 사각형으로 만든다.
- 캐릭터, 감정 칩, 토글 스위치는 둥글게 만들어도 된다.
- 일반적인 16~24px 둥근 SaaS 카드 느낌은 피한다.
- 둥근 요소를 쓰더라도 반드시 픽셀 아웃라인을 붙인다.

---

## Components

### App Shell

**`app-shell`** — 전체 화면을 감싸는 컨테이너. `min-width: 360px`, `max-width: 960px`, `min-height: 100dvh`. 배경은 핑크 도트 그리드를 기본으로 한다. 태블릿 해상도 이상에서는 2컬럼 구조를 가진다.

### Pixel Toolbar

**`pixel-toolbar`** — 레퍼런스 상단의 작은 아이콘 줄을 모바일에 맞게 축약한 헤더. 좌측에는 뒤로가기/홈, 중앙에는 현재 단계 또는 파일명, 우측에는 설정/공유 아이콘을 둔다.

```css
.pixel-toolbar {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
  background: rgba(255, 249, 239, 0.72);
}

.tool-icon {
  width: 30px;
  height: 30px;
  display: inline-grid;
  place-items: center;
  background: #fff9ef;
  border: 2px solid #8a3f35;
  box-shadow: 2px 2px 0 #5a2a25;
}
```

### Pixel Window Header

**`pixel-window-header`** — 질문 카드, 결과 카드, 추가 분석 패널 위에 붙는 작은 창 헤더. `Muu File`, `Brush`, `Layer`, `Status` 같은 라벨을 사용한다.

구성:

- 좌측: 작은 아이콘 또는 점 2개
- 중앙/좌측: 패널 제목
- 우측: `–`, `□`, `x` 느낌의 미니 컨트롤

### Progress Bar

**`pixel-progress`** — 질문 진행 상태. 일반적인 얇은 선이 아니라 작은 브러시/레이어 블록이 채워지는 방식.

```css
.progress-track {
  height: 14px;
  border: 2px solid #8a3f35;
  background: #fff9ef;
  padding: 2px;
}

.progress-fill {
  height: 100%;
  background: repeating-linear-gradient(90deg, #d96f66 0 8px, #f2b8af 8px 16px);
}
```

### Question Card

**`question-card`** — 질문을 보여주는 메인 카드. `{colors.bg-cream}` 배경, 2px 적갈색 테두리, 3px 픽셀 그림자. 카드 상단에 작은 라벨 `QUESTION 03` 대신 `Layer 03` 또는 `Muu Check 03`처럼 넣으면 레퍼런스의 레이어 UI와 잘 맞는다.

구성:

- 작은 라벨: `Layer 03 / 15`
- 질문 문장
- 보조 설명 또는 힌트
- 작은 감정 생명체 아이콘 1개

### Option Button

**`option-button`** — 사용자가 선택하는 버튼. 전체 폭 100%, 최소 높이 52px. 브러시 옵션 또는 레이어 행처럼 보여야 한다.

```css
.option-button {
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: #fff9ef;
  border: 2px solid #8a3f35;
  box-shadow: 3px 3px 0 #5a2a25;
  font-family: var(--font-pixel);
  color: #4a2d2a;
}

.option-button::before {
  content: "";
  width: 14px;
  height: 14px;
  border: 2px solid #8a3f35;
  background: #ffffff;
  box-shadow: 1px 1px 0 #5a2a25;
}

.option-button[aria-pressed="true"] {
  background: #f2b8af;
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #5a2a25;
}

.option-button[aria-pressed="true"]::before {
  background: #d96f66;
}
```

### Primary CTA

**`button-primary`** — 시작하기, 다음, 결과 보기 등 가장 중요한 액션에 사용한다. 배경은 `{colors.bg-rose-strong}` 또는 `{colors.pixel-yellow}`를 사용하고, 반드시 적갈색 테두리를 둔다.

- 높이: 56px
- 너비: 100%
- 배경: `#D96F66` 또는 `#F8D979`
- 테두리: 2px solid `{colors.outline-brown}`
- 그림자: 4px 4px 0 `{colors.deep-brown}`
- active: 2px 아래로 눌림

### Secondary Button

**`button-secondary`** — 다시하기, 이전, 나중에 하기 등에 사용한다. 배경은 `{colors.bg-cream}` 또는 `{colors.white}`, 테두리는 동일하게 적갈색을 사용한다.

### Canvas Card

**`canvas-card`** — 레퍼런스 중앙 캔버스처럼 캐릭터/결과/질문을 담는 큰 패널. 배경은 크림색이고, 내부에는 연한 미니 그리드 또는 아주 낮은 투명도의 체크 패턴을 깔 수 있다.

```css
.canvas-card {
  background-color: #fff9ef;
  background-image:
    linear-gradient(rgba(138, 63, 53, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(138, 63, 53, 0.04) 1px, transparent 1px);
  background-size: 16px 16px;
  border: 2px solid #8a3f35;
  box-shadow: 3px 3px 0 #5a2a25;
}
```

### Creature Avatar

**`creature-avatar`** — 결과 타입을 대표하는 도트 캐릭터 영역. 캐릭터는 레퍼런스의 둥근 캐릭터처럼 심플하고 말랑한 실루엣을 가진다. 눈코입을 과하게 쓰지 않아도 되며, favicon/로고에서는 얼굴 요소를 제거하고 실루엣만 남긴다.

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

**`result-card`** — 최종 결과 화면의 핵심 카드. RPG 상태창보다 **픽셀 드로잉 앱의 작업 파일 화면**처럼 구성한다.

구성:

1. 결과 파일명 또는 타입명
2. 대표 도트 캐릭터 캔버스
3. 한 줄 팩폭
4. 상태 요약
5. 스탯/레이어 블록
6. 행동 가이드

예시 구조:

```md
[muu_감정과부하젤리.file]
너 지금 쉬는 게 아니라 시스템 렉 걸린 거야.

- Layer 01 현재 상태: 방전 직전
- Layer 02 강점: 끝까지 버티는 힘
- Layer 03 위험 신호: 쉬어도 쉬는 느낌이 없음
- Brush Tip: 계획 줄이고, 회복 행동 하나만 하기
```

### Layer Status List

**`layer-status-list`** — 결과 페이지의 상태 분석을 레퍼런스 하단 레이어 패널처럼 보여주는 영역.

UI 규칙:

- 각 행은 `Layer 01`, `Layer 02`처럼 표시
- 좌측에는 체크/눈/잠금 아이콘 느낌의 작은 사각 버튼 배치 가능
- 중앙에는 상태명과 한 줄 설명
- 우측에는 강도 퍼센트 또는 작은 색상칩 표시

```css
.layer-row {
  display: grid;
  grid-template-columns: 24px 1fr auto;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 6px 8px;
  background: #fff9ef;
  border-bottom: 2px solid #8a3f35;
}
```

### Stat Block

**`stat-block`** — 결과 페이지에서 RPG 능력치처럼 보여주는 영역. 레퍼런스의 툴 옵션 토글처럼 작은 블록/스위치 형태로 표현한다.

예시 스탯:

- 에너지
- 사회성 배터리
- 회복력
- 현실 회피력
- 자기돌봄 필요도

UI 규칙:

- 5칸 또는 10칸 블록으로 표현
- 채워진 칸은 `{colors.bg-rose-strong}`, `{colors.teal-block}`, `{colors.pixel-yellow}` 사용
- 숫자보다 시각적인 블록을 우선

### Fact Punch Bubble

**`fact-punch-bubble`** — 결과의 핵심 문장. 귀엽지만 직설적인 문구를 넣는다.

- 배경: `{colors.blush}`
- 테두리: 2px solid `{colors.outline-brown}`
- 텍스트: `{colors.deep-brown}`
- 말풍선 꼬리보다 작은 툴팁 박스처럼 표현해도 좋다.

### Tool Option Panel

**`tool-option-panel`** — 레퍼런스 오른쪽의 Brush 설정 패널을 모바일에 맞게 세로 카드로 변환한 컴포넌트. 질문 선택지, 추가 분석, 결과 상세 옵션을 담는 데 사용한다.

구성 예시:

- 패널 타이틀: `Brush`
- 옵션 행: `Pixel-perfect`, `Stabilizer`, `Water color`
- 토글/체크/칩 UI

Muu에서는 아래처럼 의미를 바꿔 사용한다.

- `Pixel-perfect` → 오늘의 상태 정확도
- `Stabilizer` → 감정 안정도
- `Water color` → 말랑함/회복력
- `Pressure sensitivity` → 외부 압박감

### AI Extra Input

**`extra-analysis-input`** — 사용자가 직접 감정이나 상황을 추가 입력하는 영역. 기본 테스트 결과는 고정 룰 기반으로 나오고, 이 입력값이 있을 때만 AI 추가 분석을 붙인다.

UI 톤은 “감정 파일에 메모 레이어 추가하기”처럼 만든다.

- placeholder: `지금 상황을 조금만 더 적어줘. 내가 더 세게 봐줄게.`
- 최소 높이: 120px
- 배경: `{colors.white}`
- 테두리: 2px solid `{colors.outline-brown}`
- 글자 수 제한 표시 권장
- 입력창 상단에 `Memo Layer` 라벨 권장

### Share Card

**`share-card`** — 결과 공유용 이미지 영역. 1:1 또는 4:5 비율을 권장한다. 배경은 핑크 도트 패턴 또는 크림색 캔버스 패턴을 사용한다.

구성:

- 서비스명 `Muu`
- 결과 캐릭터
- 타입명
- 한 줄 팩폭
- 작은 레이어/스탯 바
- 파일명 느낌의 하단 라벨: `today_muu_result.png`

---

## Illustration & Character Direction

### Character Style

캐릭터는 완성도 높은 캐릭터 IP라기보다, 이상하고 귀여운 감정 생명체 도감처럼 보여야 한다. 레퍼런스의 둥근 캐릭터처럼 **단순한 형태, 큰 실루엣, 파스텔 색감, 적갈색 외곽선**을 우선한다.

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
- 결과 문구와 대비 없이 지나치게 귀엽기만 한 캐릭터

### Pixel Art Asset Rules

- 모든 캐릭터 이미지는 `image-rendering: pixelated` 적용
- 외곽선은 적갈색/짙은 브라운 계열 사용
- 색상 수는 캐릭터당 4~7개 정도로 제한
- 그림자는 1~2색 단단한 도트 그림자 사용
- 캐릭터 크기는 실제 표시 크기보다 작은 원본을 확대해 도트감을 살린다.
- 16x16 favicon은 얼굴, 배경, 세부 장식을 제거하고 실루엣만 남긴다.

---

## Motion

모션은 부드러운 앱 애니메이션보다 픽셀 툴 UI 피드백에 가깝게 만든다.

### Recommended Motion

- 버튼 클릭 시 `translate(2px, 2px)` 눌림
- 선택지 선택 시 작은 체크 박스가 채워지는 느낌
- 결과 캐릭터 등장 시 캔버스에 스탬프 찍히듯 나타남
- 진행 바가 블록 단위로 채워지는 모션
- 패널이 `pop` 하고 열림
- 토글은 부드러운 슬라이드보다 2프레임 점프 느낌

### Timing

| Token             | Value | Use              |
| ----------------- | ----: | ---------------- |
| `{motion.fast}`   |  90ms | 버튼 눌림        |
| `{motion.base}`   | 160ms | 선택 상태 변경   |
| `{motion.pop}`    | 220ms | 패널 등장        |
| `{motion.result}` | 340ms | 결과 캐릭터 등장 |

### Easing

```css
--ease-pixel: steps(2, end);
--ease-pop: cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## Responsive Behavior

이 프로젝트는 태블릿 사이즈(768px ~ 1024px)를 기본으로 하며, 모바일 환경까지 끊김 없이 이어지는 **하향 반응형(Responsive Downwards)** 구조를 가진다.

### Breakpoints

| Name             |          Width | Behavior                                                                               |
| ---------------- | -------------: | -------------------------------------------------------------------------------------- |
| Mobile           |  360px ~ 767px | **Adaptive Stack.** 1컬럼 레이아웃으로 전환. 복잡한 툴바 아이콘 축약. 패딩 축소(14px). |
| Tablet (Primary) | 768px ~ 1024px | **Standard Workspace.** 2컬럼 레이아웃(메인+사이드바). 최대 UI 폭 960px 유지.          |
| Desktop          |    1025px 이상 | **Centered Viewport.** 태블릿 프레임을 중앙에 고정하고 배경에 여백 추가.               |

### Mobile Adaptation Strategy (Responsive Downwards)

태블릿 디자인이 모바일로 전환될 때 아래의 규칙을 엄격히 따른다.

1.  **Layout Stacking**: 2컬럼(`tablet-workspace`)은 모바일에서 무조건 상-하 스택 구조로 변한다. 보통 캔버스/질문 영역이 위로, 툴 옵션/레이어 패널이 아래로 간다.
2.  **Component Simplification**:
    - `pixel-toolbar`: 아이콘 사이의 간격을 좁히고, 비핵심 아이콘(예: 라벨 텍스트)은 숨기거나 햄버거 메뉴로 통합한다.
    - `result-card`: 태블릿에서는 가로로 넓게 펼쳐지던 레이어 리스트가 모바일에서는 꽉 찬 세로 리스트로 변한다.
3.  **Font & Spacing Scaling**:
    - 제목(`hero`, `result-title`)의 크기를 모바일에서는 2~4px 정도 축소하여 시각적 압박감을 줄인다.
    - 컨테이너 패딩을 `24px`에서 `14px`로 줄여 콘텐츠 영역을 최대한 확보한다.
4.  **Touch Target Priority**: 모든 버튼과 토글은 모바일에서도 최소 48px의 터치 영역을 유지해야 하므로, 크기를 줄이기보다 레이아웃을 세로로 배치하는 방식을 택한다.

### CSS Breakpoint Guide

```css
:root {
  --screen-padding: 24px;
  --content-max: 960px;
  --sidebar-width: 320px;
}

/* Mobile Rules (Under 768px) */
@media (max-width: 767px) {
  :root {
    --screen-padding: 14px;
  }

  .tablet-workspace {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .pixel-toolbar__title {
    display: none; /* 모바일에서는 텍스트 라벨 생략 가능 */
  }

  .creature-avatar.result {
    width: 120px; /* 결과 캐릭터 크기 소폭 조정 */
    height: 120px;
  }

  h1 {
    font-size: 22px;
  } /* 타이틀 크기 조정 */
}

/* Tablet & Desktop Common (768px and Up) */
@media (min-width: 768px) {
  .app-shell {
    max-width: 960px;
  }

  .tablet-workspace {
    display: grid;
    grid-template-columns: 1fr var(--sidebar-width);
    gap: 20px;
  }
}
```

### Tablet & Mobile UI Rules

- **유연한 레이아웃**: 태블릿(768px 이상)의 2컬럼 구조는 767px 이하에서 자연스럽게 1컬럼으로 스택(Stack)되어야 한다.
- **Fluid Sizing**: 카드나 버튼의 너비는 고정 픽셀보다 `width: 100%`를 사용하여 화면 폭에 맞춰 유연하게 변하도록 한다.
- **가독성 유지**: 360px 최소 폭에서도 텍스트가 겹치거나 패널이 깨지지 않도록 적절한 `min-height`와 `padding`을 유지한다.
- 가로 스크롤은 절대 사용하지 않는다.
- 버튼 터치 영역은 모든 해상도에서 최소 48px 이상으로 유지한다.
- 결과 화면은 길어져도 괜찮다. 대신 섹션을 패널/레이어 단위로 명확히 분리한다.

---

## Accessibility

- 주요 버튼 터치 영역은 최소 48px 이상
- 텍스트와 배경 대비는 충분히 확보
- 픽셀 폰트가 읽기 어렵다면 본문은 반드시 일반 고딕 사용
- 선택지는 색상만으로 구분하지 않고 체크 박스/아이콘/테두리/텍스트도 함께 변경
- 진행 상태는 `3 / 15`처럼 숫자로도 제공
- 결과 공유 이미지만으로 정보를 전달하지 말고 텍스트 결과도 함께 제공
- 작은 툴바 아이콘은 `aria-label`을 반드시 제공한다.

---

## Do's and Don'ts

### Do

- 도트 아트처럼 보이도록 `image-rendering: pixelated`를 사용한다.
- 연한 핑크 도트 배경과 크림색 패널을 유지한다.
- 카드와 버튼에 blur 없는 단단한 그림자를 사용한다.
- 테두리는 적갈색/브라운 계열로 통일한다.
- 상단 툴바, 창 헤더, 레이어 행, 브러시 옵션 패널 같은 픽셀 편집기 요소를 활용한다.
- 결과 페이지는 귀엽지만 직설적인 카피를 사용한다.
- 질문 흐름은 게임 선택지처럼 빠르고 가볍게 만든다.
- 360px 화면에서 먼저 확인한다.

### Don't

- 일반 SaaS 대시보드처럼 미니멀한 흰색 카드 UI로 만들지 않는다.
- 강한 보라색/민트 위주의 기존 RPG 팔레트로 돌아가지 않는다.
- 과한 그라디언트, 유리 효과, 블러 그림자를 쓰지 않는다.
- 모바일 환경에만 가두어 생각하지 않고 태블릿의 넓은 화면을 활용한다.
- 결과 문구를 너무 순하게만 쓰지 않는다. 이 서비스의 재미는 귀여운 UI와 직설적인 해석의 대비다.
- 한글 본문 전체를 가독성 낮은 픽셀 폰트로만 처리하지 않는다.
- 캐릭터를 너무 정교하게 만들지 않는다. 약간 이상하고 단순해야 한다.
- 툴바/아이콘을 너무 많이 넣어 모바일에서 복잡하게 만들지 않는다.

---

## Implementation Checklist

- [ ] `app-shell`은 `min-width: 360px`, `max-width: 960px`로 제한한다.
- [ ] 기본 배경은 연한 핑크 도트 그리드로 적용한다.
- [ ] 768px ~ 1024px 태블릿을 기준으로 구현하며, 2컬럼 구조를 적용한다.
- [ ] 1025px 이상에서는 태블릿 프레임을 중앙 정렬한다.
- [ ] 모든 이미지 캐릭터에 `image-rendering: pixelated` 적용한다.
- [ ] 주요 카드/버튼은 2px 적갈색 테두리 + 3~4px 단단한 그림자를 사용한다.
- [ ] 상단 `pixel-toolbar`와 패널 `pixel-window-header`를 공통 컴포넌트로 만든다.
- [ ] 질문은 15개 내외로 구성 가능한 UI를 전제로 한다.
- [ ] 같은 선택 조합은 항상 같은 결과가 나오도록 결과 타입 UI를 고정한다.
- [ ] 자유 입력은 기본 결과 이후 AI 추가 분석 영역으로 분리한다.
- [ ] 결과 화면은 감정 캐릭터 캔버스 + 레이어 상태 패널 구조로 만든다.
- [ ] 16x16 favicon은 얼굴/배경 없는 단순 실루엣으로 관리한다.
- [ ] 360px(모바일), 768px(태블릿), 1024px(태블릿/데스크톱)에서 레이아웃을 확인한다.

---

## Suggested File/Token Structure

```ts
export const colors = {
  bgPixelPink: "#F8DDD8",
  bgDotPink: "#E8BDB6",
  bgCream: "#FFF9EF",
  bgWarmCream: "#F6EDE1",
  bgSoftRose: "#F2B8AF",
  bgRoseStrong: "#D96F66",
  outlineBrown: "#8A3F35",
  deepBrown: "#5A2A25",
  mutedBrown: "#9B6B61",
  tealBlock: "#78A8A4",
  tealDark: "#4F7778",
  sakura: "#F5A3BA",
  blush: "#FFD2D8",
  pixelYellow: "#F8D979",
  white: "#FFFFFF",
  ink: "#4A2D2A",
};

export const layout = {
  minWidth: 360,
  maxWidth: 960,
  tabletWidth: 768,
  desktopBreak: 1025,
};

export const radii = {
  none: 0,
  pixel: 2,
  sm: 4,
  md: 8,
  full: 9999,
};

export const shadows = {
  pixelSm: "2px 2px 0 #5A2A25",
  pixelMd: "3px 3px 0 #5A2A25",
  pixelLg: "4px 4px 0 #5A2A25",
};
```
