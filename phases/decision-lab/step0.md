# Step 0: decision-model-and-rules

## 작업

- `src/types/muu.ts`에 Decision Lab 도메인 타입을 추가한다.
- `src/lib/decisionLab.ts`에 deterministic 룰 기반 추천 엔진을 추가한다.
- `src/lib/decisionHistory.ts`에 localStorage 파서를 추가한다.
- 추천 결과는 AI 없이 동작해야 하며 같은 `DecisionSession`은 같은 `DecisionResult`를 반환해야 한다.

## Acceptance Criteria

```bash
npm run test
npm run build
```
