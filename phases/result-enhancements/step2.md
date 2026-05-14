# Step 2: result-history

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/AGENTS.md`
- `/docs/ARCHITECTURE.md`
- `/docs/ADR.md`
- `/src/types/muu.ts`
- `/src/components/MuuApp.tsx`

이전 step에서 만들어진 타입과 분석 템플릿을 꼼꼼히 읽고, 설계 의도를 이해한 뒤 작업하라.

## 작업

localStorage에 최근 결과 히스토리를 최대 5개 저장할 수 있는 순수 유틸을 추가하고, 결과 생성 시 사용하라.

권장 파일:

- `/src/lib/resultHistory.ts`
- `/src/lib/resultHistory.test.ts`

필수 상수:

- `lastResultStorageKey = 'muu:v1:last-result'`
- `resultHistoryStorageKey = 'muu:v1:result-history'`
- `maxResultHistoryItems = 5`

필수 함수:

- `parseStoredResult(value: string | null): StoredMuuResult | null`
- `parseResultHistory(value: string | null): StoredMuuResult[]`
- `buildNextResultHistory(current: StoredMuuResult, previous: StoredMuuResult[]): StoredMuuResult[]`

동작:

- `buildNextResultHistory`는 `current`를 맨 앞에 넣고 최대 5개만 반환한다.
- 파싱 실패 시 히스토리는 빈 배열로 복구한다.
- 기존 `MuuApp.tsx` 내부의 `storageKey`와 `parseStoredResult`는 새 유틸을 사용하도록 정리한다.
- 결과 생성 시 기존 단일 최근 결과 키도 유지하고, 히스토리 키도 함께 저장한다.

주의:

- `resultHistory.ts`는 브라우저 API에 직접 의존하지 않는 순수 함수 중심으로 작성하라.
- localStorage read/write는 `MuuApp.tsx`에서 수행하라.

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
   - 성공: `"status": "completed"`, `"summary": "최근 결과 히스토리 저장 유틸과 localStorage 연동 추가"`
   - 수정 3회 시도 후에도 실패: `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요: `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 서버 DB나 로그인 전제를 추가하지 마라. 이유: MVP 저장소는 localStorage다.
- 히스토리 전체 목록 화면을 만들지 마라. 이유: 이 step은 저장 레이어만 담당한다.
- 기존 단일 최근 결과 복원을 제거하지 마라. 이유: 기존 UX와 저장 호환성을 유지해야 한다.
- 기존 테스트를 깨뜨리지 마라.
