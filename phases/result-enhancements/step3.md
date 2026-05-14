# Step 3: result-comparison

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/AGENTS.md`
- `/docs/ARCHITECTURE.md`
- `/docs/ADR.md`
- `/src/types/muu.ts`
- `/src/lib/analysis.ts`
- `/src/lib/resultHistory.ts`

이전 step에서 만들어진 히스토리 유틸을 꼼꼼히 읽고, 설계 의도를 이해한 뒤 작업하라.

## 작업

현재 결과와 직전 결과를 비교하는 순수 함수를 추가하고, 새 결과 생성 시 `HumanResult.comparison`에 반영하라.

권장 파일:

- `/src/lib/resultComparison.ts`
- `/src/lib/resultComparison.test.ts`

필수 함수:

- `buildResultComparison(current: HumanResult, previous?: HumanResult): ResultComparison | undefined`

비교 규칙:

- `previous`가 없으면 `undefined`를 반환한다.
- 같은 유형이면:
  - `label`: `반복 패턴 감지`
  - `summary`: `같은 인간 유형이 또 출근했습니다. 오늘도 같은 버튼이 눌린 모양입니다.`
- 같은 dominant axis가 1개 이상 겹치면:
  - `label`: `주요 신호 반복`
  - `summary`에 겹친 축의 한국어 라벨을 포함한다.
- 위 조건에 해당하지 않으면 축 점수 변화량이 가장 큰 축 1개를 골라:
  - 증가면 `불안 +2처럼 올라왔습니다.`
  - 감소면 `회피 -2처럼 내려갔습니다.`
- 점수 차이가 모두 0이면 안정적인 반복 문구를 반환한다.

연동:

- `MuuApp.tsx`에서 결과 생성 시 히스토리의 직전 결과를 찾아 비교 결과를 붙인다.
- 비교가 붙은 결과를 단일 최근 결과와 히스토리에 저장한다.

결정성:

- 비교 함수는 `current`와 `previous`만 사용한다.
- 랜덤, 날짜, AI, localStorage 직접 접근을 넣지 마라.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md 디렉터리 구조를 따르는가?
   - ADR 기술 스택을 벗어나지 않았는가?
   - AGENTS.md CRITICAL 규칙을 위반하지 않았는가?
3. 결과에 따라 `phases/result-enhancements/index.json`의 해당 step을 업데이트한다:
   - 성공: `"status": "completed"`, `"summary": "직전 결과와 현재 결과를 비교하는 순수 함수 및 저장 연동 추가"`
   - 수정 3회 시도 후에도 실패: `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요: `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- AI로 비교 문구를 생성하지 마라. 이유: 비교는 재현 가능한 룰 기반이어야 한다.
- 비교를 위해 현재 시간을 사용하지 마라. 이유: 같은 결과 쌍은 같은 비교 문구를 반환해야 한다.
- 기존 테스트를 깨뜨리지 마라.
