# Architecture Decision Records

## 철학

Muu v1 MVP는 빠르게 동작하는 감정 상태 체크 경험을 우선한다. 서버 DB와 로그인은 제외하고, 사용자가 같은 답변을 제출하면 항상 같은 룰 기반 인간 유형을 받는 구조를 핵심으로 둔다. OpenAI API는 자유 입력에 대한 보조 관찰에만 사용한다.

---

## ADR-001: Next.js App Router 채택

**결정**: Next.js App Router를 사용한다.

**이유**:
- 단일 페이지 MVP라도 이후 결과 공유, API route, 서버 렌더링 확장 여지가 있다.
- `src/app` 기반 구조가 현재 Next.js 표준에 가깝다.
- Vercel 배포와 정적 최적화가 쉽다.

**트레이드오프**:
- 현재 MVP는 대부분 클라이언트 인터랙션이라 App Router의 서버 기능을 많이 쓰지는 않는다.
- Next 16 기준 `next lint`가 맞지 않아 `eslint .` 기반 lint 스크립트를 사용한다.

---

## ADR-002: TypeScript strict mode 사용

**결정**: TypeScript strict mode를 사용한다.

**이유**:
- 분석 축, 질문, 감정 태그, 결과 타입이 명확해야 룰 기반 결과가 흔들리지 않는다.
- `HumanResult`, `MuuSubmission`, `AxisScores` 같은 도메인 타입을 통해 UI와 분석 로직의 계약을 고정한다.

**트레이드오프**:
- 초기 타입 정의 비용이 있다.
- 질문 데이터 작성 시 타입 오류를 맞춰야 한다.

---

## ADR-003: CSS Modules 채택

**결정**: Tailwind CSS 대신 CSS Modules를 사용한다.

**이유**:
- 사용자 요청 스택이 Next.js, TypeScript, CSS Modules였다.
- 픽셀 UI는 border, shadow, grid background, character shape처럼 세부 CSS가 많아 모듈 CSS가 더 직접적이다.
- 컴포넌트 단위 스타일 충돌을 줄일 수 있다.

**트레이드오프**:
- 디자인 토큰과 반복 스타일을 수동으로 관리해야 한다.
- 유틸리티 클래스 기반의 빠른 조합성은 낮다.

---

## ADR-004: 룰 기반 분석을 순수 함수로 분리

**결정**: 인간 유형 분석은 `src/lib/analysis.ts`의 `analyzeHumanState` 순수 함수에서 처리한다.

**이유**:
- 같은 답변이면 항상 같은 결과가 나와야 한다.
- UI 상태와 분석 로직을 분리하면 테스트하기 쉽다.
- OpenAI 연결 여부와 무관하게 MVP 핵심 결과를 생성할 수 있다.

**트레이드오프**:
- 문장 다양성은 제한된다.
- 질문/태그 점수 튜닝은 코드 변경으로 관리한다.

---

## ADR-005: OpenAI API는 보조 관찰에만 사용

**결정**: 실제 OpenAI API는 `src/app/api/ai-observation/route.ts`에서만 호출한다.

**이유**:
- `OPENAI_API_KEY`를 클라이언트에 노출하지 않기 위해 서버 route handler를 사용한다.
- AI는 인간 유형을 바꾸지 않고 자유 입력에 대한 보조 관찰만 제공해야 한다.
- OpenAI 호출이 실패해도 룰 기반 결과는 표시되어야 한다.

**트레이드오프**:
- 자유 입력이 있는 결과 생성에는 네트워크 지연과 API 비용이 생긴다.
- AI 관찰 문구는 모델 응답이므로 룰 기반 유형처럼 완전히 결정적이라고 보장하지 않는다.

---

## ADR-006: localStorage 단일 저장소 사용

**결정**: 최근 결과는 `localStorage`의 `muu:v1:last-result` 키에 저장한다.

**이유**:
- 로그인과 서버 DB가 MVP 범위 밖이다.
- 홈 화면의 최근 결과 카드 요구사항을 가장 작게 충족한다.

**트레이드오프**:
- 기기와 브라우저별로만 유지된다.
- 여러 결과 히스토리, 동기화, 백업은 제공하지 않는다.

---

## ADR-007: Decision Lab은 별도 페이지와 서브도메인 rewrite로 제공

**결정**: 결정 실험실은 `/decision-lab` App Router 페이지로 구현하고, `decision.*`, `lab.*` 서브도메인은 `src/proxy.ts`에서 해당 페이지로 rewrite한다.

**이유**:
- 메인 Muu 상태 체크 플로우와 선택지 비교 경험을 분리한다.
- 로컬 개발과 preview 환경에서는 `/decision-lab` 경로로 검증할 수 있다.
- 실제 배포에서는 DNS/Vercel 서브도메인 연결만 추가하면 같은 컨텐츠를 서브도메인에서 보여줄 수 있다.

**트레이드오프**:
- 서브도메인 연결 자체는 앱 코드가 아니라 배포 환경 설정에 의존한다.
- proxy가 추가되어 정적 파일, API route, Next 내부 경로는 rewrite 대상에서 제외해야 한다.

---

## ADR-008: Decision Lab 추천은 룰 기반 순수 함수가 결정

**결정**: Decision Lab의 추천 선택지와 점수는 `src/lib/decisionLab.ts`의 순수 함수가 결정한다.

**이유**:
- 같은 선택지와 같은 상태 context는 항상 같은 추천 결과를 반환해야 한다.
- AI 호출 실패 여부와 무관하게 핵심 추천이 동작해야 한다.
- 현재 인간 유형 결정과 마찬가지로 핵심 판단은 테스트 가능한 룰 기반 로직에 있어야 한다.

**트레이드오프**:
- 선택지 텍스트 해석은 keyword signal 기반이라 자연어 이해에는 한계가 있다.
- 추천 문구 다양성은 제한되지만, 결과 안정성과 테스트 가능성이 높다.

---

## ADR-009: Decision Lab AI는 보조 코멘트 adapter로 제한

**결정**: Decision Lab v1에서는 네트워크 호출 없는 mock adapter만 두고, AI는 추천 선택지와 점수를 변경하지 않는다.

**이유**:
- OpenAI API는 핵심 판단을 바꾸면 안 된다는 제품 규칙을 유지한다.
- 실제 API route를 붙이기 전에도 UI와 데이터 흐름을 검증할 수 있다.
- 향후 실제 AI 코멘트를 추가하더라도 route handler에서만 서버 환경 변수를 사용하도록 확장할 수 있다.

**트레이드오프**:
- v1의 AI 코멘트는 실제 생성형 응답이 아니라 deterministic 보조 문구다.
- 실제 모델 연결 시 별도 비용, 지연, 실패 처리 정책을 추가해야 한다.
