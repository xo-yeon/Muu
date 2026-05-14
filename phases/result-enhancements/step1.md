# Step 1: analysis-templates

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/AGENTS.md`
- `/docs/ARCHITECTURE.md`
- `/docs/ADR.md`
- `/src/types/muu.ts`
- `/src/lib/analysis.ts`
- `/src/lib/analysis.test.ts`

이전 step에서 만들어진 타입 변경을 꼼꼼히 읽고, 설계 의도를 이해한 뒤 작업하라.

## 작업

모든 룰 기반 결과 템플릿이 `forbiddenAction`과 `rewardItem`을 반환하도록 `/src/lib/analysis.ts`를 수정하라.

필수 변경:

- 기존 모든 `ResultTemplate` 항목에 `forbiddenAction`을 추가하라.
- 기존 모든 `ResultTemplate` 항목에 `rewardItem`을 추가하라.
- 문구 톤은 AGENTS.md 제품 방향을 따른다:
  - 귀여운 척하지만 내용은 얄짤없게
  - 비난 금지
  - 자책 유도 금지
  - 치료/진단 표현 금지
- 아이템은 기능성 데이터가 아니라 결과 화면 표시용 고정 보상이다.

권장 예시:

- 과열된 계획 중독형
  - `forbiddenAction`: `할 일 앱 새로 만들기 금지. 지금 있는 것도 아직 안 끝났습니다.`
  - `rewardItem.name`: `구겨진 계획서`
- 조용한 번아웃 진행형
  - `forbiddenAction`: `괜찮은 척으로 추가 업무 받기 금지. 배터리 잔량이 거짓말을 못 합니다.`
  - `rewardItem.name`: `미지근한 회복 물컵`
- SNS 회피 생존형
  - `forbiddenAction`: `스크롤로 휴식 위장하기 금지. 손가락만 출근 중입니다.`
  - `rewardItem.name`: `현실 복귀 부적`

결정성:

- 아이템이나 금지 행동을 랜덤으로 고르지 마라.
- `analyzeHumanState` 안에 `Math.random`, 날짜, 시간, 외부 API를 넣지 마라.

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
   - 성공: `"status": "completed"`, `"summary": "모든 분석 결과 템플릿에 금지 행동과 보상 아이템 추가"`
   - 수정 3회 시도 후에도 실패: `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요: `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 결과 유형 결정 조건을 바꾸지 마라. 이유: 이 step은 템플릿 데이터 보강만 담당한다.
- 새 localStorage 키를 추가하지 마라. 이유: 히스토리 저장은 다음 step에서 한다.
- 기존 테스트를 깨뜨리지 마라.
