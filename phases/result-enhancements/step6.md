# Step 6: tests-and-validation

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/AGENTS.md`
- `/docs/ARCHITECTURE.md`
- `/docs/ADR.md`
- `/src/types/muu.ts`
- `/src/lib/analysis.ts`
- `/src/lib/analysis.test.ts`
- `/src/lib/resultHistory.ts`
- `/src/lib/resultHistory.test.ts`
- `/src/lib/resultComparison.ts`
- `/src/lib/resultComparison.test.ts`
- `/src/components/MuuApp.tsx`

이전 step에서 만들어진 모든 코드를 꼼꼼히 읽고, 설계 의도를 이해한 뒤 작업하라.

## 작업

결과 강화 기능의 테스트와 최종 검증을 보강하라.

필수 테스트:

- `/src/lib/analysis.test.ts`
  - 분석 결과에 `forbiddenAction`이 존재한다.
  - 분석 결과에 `rewardItem.name`과 `rewardItem.description`이 존재한다.
  - 같은 입력은 같은 금지 행동/아이템을 반환한다.
- `/src/lib/resultHistory.test.ts`
  - `parseResultHistory(null)`은 빈 배열을 반환한다.
  - 잘못된 JSON은 빈 배열로 복구한다.
  - 히스토리는 최신 결과를 맨 앞에 둔다.
  - 히스토리는 최대 5개로 잘린다.
- `/src/lib/resultComparison.test.ts`
  - 이전 결과가 없으면 `undefined`를 반환한다.
  - 같은 유형 반복 문구를 반환한다.
  - dominant axis 반복 문구를 반환한다.
  - 점수 변화가 가장 큰 축을 요약한다.

최종 검증:

- `npm run test`
- `npm run lint`
- `npm run build`

필요하면 테스트 안정성을 위해 순수 함수만 테스트하라. UI 테스트는 이 step의 필수 범위가 아니다.

## Acceptance Criteria

```bash
npm run test
npm run lint
npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md 디렉터리 구조를 따르는가?
   - ADR 기술 스택을 벗어나지 않았는가?
   - AGENTS.md CRITICAL 규칙을 위반하지 않았는가?
3. 결과에 따라 `phases/result-enhancements/index.json`의 해당 step을 업데이트한다:
   - 성공: `"status": "completed"`, `"summary": "결과 강화 기능 테스트 보강 및 test/lint/build 검증 완료"`
   - 수정 3회 시도 후에도 실패: `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요: `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 테스트를 통과시키기 위해 결정성 규칙을 약화하지 마라. 이유: 같은 입력은 같은 결과를 반환해야 한다.
- 검증 커맨드를 생략하지 마라. 이유: Harness step 완료 조건이다.
- UI 테스트 프레임워크를 새로 추가하지 마라. 이유: 현재 의존성 범위에서 순수 함수 테스트로 충분하다.
- 기존 테스트를 깨뜨리지 마라.
