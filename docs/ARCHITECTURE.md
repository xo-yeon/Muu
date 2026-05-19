# 아키텍처

## 기술 스택

- Next.js App Router
- TypeScript strict mode
- CSS Modules
- Vitest
- localStorage

## 디렉터리 구조

```txt
src/
  app/
    globals.css          # 전역 CSS 변수, 기본 body 스타일
    layout.tsx           # 루트 레이아웃, 메타데이터
    page.tsx             # MuuApp 진입점
    decision-lab/
      page.tsx           # 결정 실험실 페이지
  components/
    MuuApp.tsx           # MVP 플로우 상태/전환 컨테이너
    AppShell.tsx         # 앱 배경, 태블릿 프레임, 스크롤 컨테이너
    AppShell.module.css
    TopBar.tsx           # 이전 버튼, 진행률, 단계 카운터
    TopBar.module.css
    HomeScreen.tsx       # 홈/최근 결과 로드맵 화면
    HomeScreen.module.css
    QuestionScreen.tsx   # 질문 선택 인벤토리 화면
    QuestionScreen.module.css
    EmotionScreen.tsx    # 감정 태그 선택 인벤토리 화면
    EmotionScreen.module.css
    FreeTextScreen.tsx   # AI 보조 관찰용 선택 메모 화면
    FreeTextScreen.module.css
    ResultScreen.tsx     # 결과 도감/책 패널 화면
    ResultScreen.module.css
    DecisionLab.tsx      # 결정 실험실 입력/결과 화면
    DecisionLab.module.css
    PixelCharacter.tsx   # CSS 기반 픽셀 캐릭터
    PixelCharacter.module.css
    PixelAsset.tsx       # 픽셀 이미지 로딩/대체 표시
    PixelAsset.module.css
  data/
    questions.ts         # 12개 질문과 감정 태그 데이터
  lib/
    analysis.ts          # 룰 기반 분석
    decisionLab.ts       # 룰 기반 결정 추천
    decisionHistory.ts   # 결정 실험실 localStorage 파서
    decisionAiComment.ts # 결정 실험실 AI 보조 코멘트 mock adapter
    openaiObservation.ts # OpenAI 보조 관찰 요청 생성/응답 파싱
    analysis.test.ts     # 분석 로직 테스트
  app/api/
    ai-observation/
      route.ts           # OpenAI API 호출 route handler
  types/
    muu.ts               # 도메인 타입
  proxy.ts               # decision/lab 서브도메인 rewrite
```

## 주요 모듈

### `MuuApp`

클라이언트 컴포넌트이며 MVP 플로우의 상태와 전환만 관리한다. 화면별 UI는 `HomeScreen`, `QuestionScreen`, `EmotionScreen`, `FreeTextScreen`, `ResultScreen` 컴포넌트로 분리한다.

- `home`: 시작 화면, 최근 결과 카드
- `questions`: 12개 질문을 한 번에 하나씩 표시
- `emotions`: 감정 태그 다중 선택
- `freeText`: 선택형 자유 입력
- `result`: 결과 페이지

질문 진행률은 현재 단계와 질문 인덱스 기반으로 계산한다.

### UI 컴포넌트

UI는 기능 단위로 분리한다.

- `AppShell`: 전역 화면 프레임, 배경 장식, 중앙 콘텐츠 스크롤 영역
- `TopBar`: 뒤로가기, 진행률, 현재 단계 카운터
- `HomeScreen`: 시작 CTA와 최근 결과 복원
- `QuestionScreen`: 질문 카드, 선택지 목록, 진행 슬롯
- `EmotionScreen`: 감정 태그 선택과 다음 단계 CTA
- `FreeTextScreen`: 선택 메모 입력, AI 보조 관찰 안내
- `ResultScreen`: 결과 타입, 스탯, 상태 레이어, 반복 패턴, 유지/금지 행동, 캐릭터, 보상 아이템
- `DecisionLab`: 고민 주제와 선택지 2~4개를 입력받고 룰 기반 추천 결과를 표시
- `PixelCharacter`, `PixelAsset`: 여러 화면에서 쓰는 픽셀 UI 원자 컴포넌트

각 컴포넌트의 스타일은 같은 이름의 `*.module.css`에 둔다. 새 화면/기능 컴포넌트를 추가할 때도 전역 CSS나 다른 컴포넌트 CSS에 스타일을 섞지 않는다.

### `questions.ts`

질문, 선택지, 감정 태그의 원본 데이터다. 각 선택지와 태그는 분석 축별 점수 변화를 가진다.

분석 축:

```ts
type Axis =
  | 'overthinking'
  | 'avoidance'
  | 'burnout'
  | 'anxiety'
  | 'execution'
  | 'socialFatigue'
  | 'emotionalSensitivity'
  | 'stability'
  | 'dopamineSeeking';
```

### `analysis.ts`

분석 로직은 UI와 분리된 순수 함수로 유지한다.

- 선택지 점수 합산
- 감정 태그 점수 합산
- 자유 입력 키워드 신호 반영
- 고정 우선순위 기반 인간 유형 결정
- 주요 축 3개 계산
- 자유 입력이 있을 때만 `/api/ai-observation` route handler에서 OpenAI 보조 관찰 문구 생성

동점 또는 복합 상태에서도 `resultPriority` 순서로 결과가 결정되므로 같은 입력은 항상 같은 결과를 반환한다.

### `decisionLab.ts`

결정 실험실 추천 로직은 UI와 분리된 순수 함수로 유지한다.

- 기본 기준: 실행 난이도, 후회 가능성, 지금 상태 적합도, 회복 도움, 장기적 도움
- 선택지 텍스트의 deterministic keyword signal로 기준별 원점수를 계산한다.
- 현재 `HumanResult`, 감정 태그, 자유 입력 신호로 기준 가중치를 조정한다.
- AI는 점수와 추천 선택지를 바꾸지 않는다.
- 동점은 `stateFit + executionEase`, 입력 순서로 고정 처리한다.

## 데이터 흐름

```txt
Home
  -> 사용자가 시작
Questions
  -> 12개 선택 답변 저장
Emotion Tags
  -> 감정 태그 ID 배열 저장
Free Text
  -> 선택 입력 저장
analyzeHumanState(submission)
  -> 룰 기반 HumanResult 생성
OpenAI observation
  -> 자유 입력이 있으면 /api/ai-observation 호출
localStorage 저장
  -> 홈 최근 결과 / 결과 복원에 사용
Result
  -> 인간 유형, 유지 행동, 팩트 한 줄, 상태 요약, 픽셀 캐릭터, 획득 아이템 표시
  -> 결정 실험실 context 저장 후 /decision-lab 이동
Decision Lab
  -> 고민 주제와 선택지 2~4개 입력
  -> buildDecisionResult(session)
  -> localStorage 최근 결정 결과 저장
  -> 추천 선택지와 점수 비교 표시
```

## 상태 관리

현재 MVP는 별도 상태 관리 라이브러리를 쓰지 않는다.

- 화면 단계: `useState<Step>`
- 질문 인덱스: `useState<number>`
- 답변 배열: `useState<MuuAnswer[]>`
- 감정 태그: `useState<string[]>`
- 자유 입력: `useState<string>`
- 결과: `useState<HumanResult | null>`
- 저장된 최근 결과: `useSyncExternalStore`로 localStorage 스냅샷 구독

Decision Lab 페이지는 독립 클라이언트 컴포넌트에서 다음 상태만 관리한다.

- 고민 주제
- 선택지 입력 2~4개
- 결과 페이지에서 전달된 `DecisionContext`
- 현재 `DecisionSession`
- 현재 `DecisionResult`

Zustand/Jotai는 아직 필요하지 않다. 결과 히스토리, 계정, 서버 동기화가 들어가면 재검토한다.

## 저장 방식

최근 결과는 브라우저 localStorage에 저장한다.

```txt
key: muu:v1:last-result
value: StoredMuuResult JSON
```

저장 데이터:

- 저장 시각
- 제출 답변
- 감정 태그
- 자유 입력
- 분석 결과

Decision Lab 저장 키:

```txt
key: muu:v1:decision-context
value: DecisionContext JSON

key: muu:v1:last-decision-session
value: StoredDecisionLabResult JSON
```

## UI 구조

`DESIGN.md`의 Muu Cozy Pixel Tablet UI System을 기준으로 설계한다.

- 최소 너비: 360px
- 태블릿 기본 기준: 768px ~ 1024px
- 최대 콘텐츠 폭: 960px, 데스크톱 가드 최대 1024px
- 768px 이상에서는 질문/결과 화면을 태블릿형 2컬럼 작업창으로 표시
- 1025px 이상에서는 태블릿 프레임을 중앙 정렬하고 hard shadow를 적용
- 연한 핑크 도트 배경, 크림 패널, 적갈색 픽셀 라인 사용
- 결과 페이지는 책/도감 패널로 구성하고, 좌측에는 결과 제목/스탯/상태 레이어/반복 패턴/행동 가이드를 묶고 우측에는 캐릭터/팩트 한 줄/획득 아이템/AI 관찰을 묶는다.
- 결정 실험실은 별도 페이지에서 고민 파일, 선택지 레이어, 점수 레이어 느낌으로 구성한다.
- `decision.*`, `lab.*` 서브도메인은 proxy rewrite로 결정 실험실 페이지를 표시한다.
- 타이틀/라벨/버튼은 `DungGeunMo.woff` 기반 픽셀 폰트를 사용하고, 긴 본문은 일반 고딕 계열 본문 폰트를 사용한다.

## 테스트 전략

현재 테스트 범위는 분석 로직 중심이다.

- 같은 입력은 같은 결과를 반환한다.
- 번아웃 성향 답변은 `quietBurnout`으로 분류된다.
- 자유 입력이 없으면 AI 관찰이 표시되지 않는다.
- 같은 DecisionSession은 같은 DecisionResult를 반환한다.
- 인간 유형별 Decision Lab 가중치가 의도대로 추천에 반영된다.

UI 테스트는 아직 없다. 다음 단계에서 질문 플로우, localStorage 저장, 결과 표시를 React Testing Library로 추가할 수 있다.

## 배포 방향

권장 배포 대상은 Vercel이다.

현재 앱은 서버 DB 없이 동작한다. OpenAI API key 보호를 위해 API 호출은 `src/app/api/ai-observation/route.ts`에서만 수행한다.
