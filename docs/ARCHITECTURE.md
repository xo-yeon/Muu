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
  components/
    MuuApp.tsx           # 전체 MVP 플로우 UI
    MuuApp.module.css    # 모바일 픽셀 UI 스타일
  data/
    questions.ts         # 15개 질문과 감정 태그 데이터
  lib/
    analysis.ts          # 룰 기반 분석
    openaiObservation.ts # OpenAI 보조 관찰 요청 생성/응답 파싱
    analysis.test.ts     # 분석 로직 테스트
  app/api/
    ai-observation/
      route.ts           # OpenAI API 호출 route handler
  types/
    muu.ts               # 도메인 타입
```

## 주요 모듈

### `MuuApp`

클라이언트 컴포넌트이며 MVP 플로우 전체를 관리한다.

- `home`: 시작 화면, 최근 결과 카드
- `questions`: 15개 질문을 한 번에 하나씩 표시
- `emotions`: 감정 태그 다중 선택
- `freeText`: 선택형 자유 입력
- `result`: 결과 페이지

질문 진행률은 현재 단계와 질문 인덱스 기반으로 계산한다.

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

## 데이터 흐름

```txt
Home
  -> 사용자가 시작
Questions
  -> 15개 선택 답변 저장
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

## UI 구조

`DESIGN.md`의 Pixel Diary UI System을 기준으로 설계한다.

- 최소 너비: 360px
- 최대 앱 프레임: 960px
- 768px 이상에서는 질문/결과 화면을 태블릿형 2컬럼 작업창으로 표시
- 1025px 이상에서는 태블릿 프레임을 중앙 정렬하고 hard shadow를 적용
- 연한 핑크 도트 배경, 크림 패널, 적갈색 픽셀 라인 사용
- 결과 페이지는 감정 캐릭터 캔버스와 레이어 상태 패널 느낌으로 구성

## 테스트 전략

현재 테스트 범위는 분석 로직 중심이다.

- 같은 입력은 같은 결과를 반환한다.
- 번아웃 성향 답변은 `quietBurnout`으로 분류된다.
- 자유 입력이 없으면 AI 관찰이 표시되지 않는다.

UI 테스트는 아직 없다. 다음 단계에서 질문 플로우, localStorage 저장, 결과 표시를 React Testing Library로 추가할 수 있다.

## 배포 방향

권장 배포 대상은 Vercel이다.

현재 앱은 서버 DB 없이 동작한다. OpenAI API key 보호를 위해 API 호출은 `src/app/api/ai-observation/route.ts`에서만 수행한다.
