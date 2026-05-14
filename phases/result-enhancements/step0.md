# Step 0: result-model

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/AGENTS.md`
- `/docs/ARCHITECTURE.md`
- `/docs/ADR.md`
- `/src/types/muu.ts`
- `/src/lib/analysis.ts`
- `/src/components/MuuApp.tsx`

## 작업

`HumanResult`가 결과 강화 UI에 필요한 데이터를 담을 수 있도록 도메인 타입을 확장하라.

필수 변경:

- `/src/types/muu.ts`에 보상 아이템 타입을 추가하라.
  - 권장 이름: `RewardItem`
  - 필드: `name: string`, `description: string`, `assetPath?: string`
- `/src/types/muu.ts`에 결과 비교 타입을 추가하라.
  - 권장 이름: `ResultComparison`
  - 필드: `label: string`, `summary: string`
- `HumanResult`에 아래 필드를 추가하라.
  - `forbiddenAction: string`
  - `rewardItem: RewardItem`
  - `comparison?: ResultComparison`

호환성:

- 기존 localStorage에 저장된 `HumanResult`에는 새 필드가 없을 수 있다.
- 이 step에서는 타입만 확장하고, 저장 데이터 정규화 구현은 이후 UI/history step에서 처리한다.
- TypeScript strict mode에서 기존 코드가 컴파일 가능하도록 필요한 최소 fallback 또는 타입 조정을 하라.

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
   - 성공: `"status": "completed"`, `"summary": "HumanResult에 forbiddenAction, rewardItem, comparison 타입 계약 추가"`
   - 수정 3회 시도 후에도 실패: `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요: `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- UI를 변경하지 마라. 이유: 이 step은 도메인 타입 계약만 안정화하는 단계다.
- 분석 템플릿 문구를 대량 수정하지 마라. 이유: 결과 데이터 채우기는 다음 step에서 한다.
- 기존 테스트를 깨뜨리지 마라.
