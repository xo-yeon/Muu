# 프로젝트: Muu

## 기술 스택

- Next.js App Router
- TypeScript strict mode
- CSS Modules
- Vitest
- localStorage

## 제품 방향

- Muu는 오늘의 감정과 행동 패턴을 바탕으로 인간 유형과 상태 리포트를 보여주는 모바일 퍼스트 앱이다.
- UI는 귀여운 도트/픽셀 감성의 2D 게임 UI를 유지한다.
- 결과 문구는 현실적이고 약간 직설적인 톤을 유지한다.
- 과한 위로, 치료/진단 표현, 사용자를 비난하는 문구는 사용하지 않는다.

## 아키텍처 규칙

- CRITICAL: 같은 입력은 항상 같은 결과를 반환해야 한다. 분석 로직에 랜덤값, 시간값, 비결정적 API 응답을 섞지 않는다.
- CRITICAL: 인간 유형 결정은 룰 기반 분석이 담당한다. AI는 유형 자체를 변경하면 안 된다.
- CRITICAL: OpenAI API 호출은 클라이언트 컴포넌트에서 직접 하지 않는다. `src/app/api/` route handler에서만 `OPENAI_API_KEY`를 사용한다.
- CRITICAL: 분석 로직은 UI 컴포넌트에 직접 섞지 말고 `src/lib/analysis.ts`처럼 테스트 가능한 순수 함수로 유지한다.
- 질문, 선택지, 감정 태그 데이터는 `src/data/`에서 관리한다.
- 도메인 타입은 `src/types/`에서 관리한다.
- UI 컴포넌트는 `src/components/`에 둔다.
- UI는 기능 단위 컴포넌트로 나눈다. `MuuApp.tsx`는 플로우 상태와 분석/저장 처리만 담당하고, 화면 UI는 `HomeScreen`, `QuestionScreen`, `EmotionScreen`, `FreeTextScreen`, `ResultScreen`처럼 분리한다.
- 공용 UI는 `AppShell`, `TopBar`, `PixelCharacter`, `PixelAsset`처럼 역할이 명확한 컴포넌트로 분리한다.
- 컴포넌트 스타일은 같은 이름의 `*.module.css`에 둔다. 다른 컴포넌트의 CSS Module이나 거대한 공용 CSS 파일에 화면별 스타일을 섞지 않는다.
- 페이지 진입점과 라우트는 `src/app/`에 둔다.
- 현재 MVP 저장소는 localStorage이며, 서버 DB나 로그인 전제를 코드에 넣지 않는다.

## UI 규칙

- 태블릿 중심으로 구현하되 모바일도 자연스럽게 대응한다.
- 앱 화면은 최소 360px을 보장하고, 기본 설계 기준은 768px ~ 1024px 태블릿 화면이다.
- 콘텐츠 최대 폭은 960px을 기본으로 하고, 1025px 이상에서는 최대 1024px 태블릿 프레임을 중앙 배치한다.
- 768px 이상에서는 질문/결과 화면에 2컬럼 레이아웃을 사용하고, 모바일에서는 같은 정보를 세로로 쌓는다.
- 주요 카드와 버튼은 픽셀 스타일의 각진 border, hard shadow를 사용한다.
- CSS는 CSS Modules를 우선 사용한다.
- 타이틀, 라벨, 본문 등 모든 텍스트는 `DungGeunMo.woff` 기반 픽셀 폰트를 사용한다. 가독성이 필요한 긴 본문도 픽셀 감성을 유지하기 위해 동일한 폰트를 사용하되, 자간과 행간을 조정하여 대응한다.
- Tailwind CSS, styled-components 등 새 스타일링 도구는 필요가 생기기 전까지 추가하지 않는다.
- 결과 페이지에는 인간 유형, 상태 요약, 감정 날씨, 팩트 한 줄, 오늘의 인간 유지 행동, 픽셀 캐릭터를 유지한다.
- 결과 페이지에서 반복 패턴/상태 비교 아래에 오늘의 인간 유지 행동과 오늘의 금지 행동을 배치한다.

## 개발 프로세스

- CRITICAL: 새 기능이나 분석 규칙 변경 시 먼저 테스트 가능 지점을 확인하고, 위험도가 있는 로직은 Vitest 테스트를 추가한다.
- 변경 범위는 요청된 작업에 필요한 만큼만 제한한다.
- 기존 문서인 `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`와 충돌하는 구현을 하지 않는다. 필요하면 문서를 함께 업데이트한다.
- 커밋 메시지는 conventional commits 형식을 따른다. 예: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`.
- 사용자 변경사항을 임의로 되돌리지 않는다.

## 검증 명령어

```txt
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
npm run test     # Vitest
```

## 현재 MVP 범위

- Home 화면
- 12개 질문 플로우
- 감정 태그 선택
- 자유 입력
- 룰 기반 인간 유형 분석
- OpenAI API 기반 보조 관찰
- 결과 페이지
- localStorage 최근 결과 저장/복원
