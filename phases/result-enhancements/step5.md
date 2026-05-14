# Step 5: home-history-ui

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/AGENTS.md`
- `/docs/ARCHITECTURE.md`
- `/docs/ADR.md`
- `/src/components/MuuApp.tsx`
- `/src/components/MuuApp.module.css`
- `/src/lib/resultHistory.ts`
- `/public/assets/README.md`

이전 step에서 만들어진 결과 UI와 히스토리 연동을 꼼꼼히 읽고, 설계 의도를 이해한 뒤 작업하라.

## 작업

메인 페이지에 최근 결과 히스토리 존재감과 홈 도트 GIF fallback을 추가하라.

필수 변경:

- `MuuApp`에서 `muu:v1:result-history` 스냅샷을 읽어 최근 결과 개수를 계산하라.
- `HomeScreen`에 최근 결과 개수를 전달하라.
- 최근 결과가 2개 이상이면 최근 결과 카드 또는 빈 카드 주변에 짧은 문구를 표시하라.
  - 권장 문구: `최근 인간 기록 {n}개 저장 중`
- 최신 결과 복원 동작은 기존과 동일하게 유지하라.
- 홈 대표 도트 GIF는 `/assets/characters/home.gif`를 우선 사용하라.
- GIF가 로드되지 않으면 기존 CSS `PixelCharacter` 홈 캐릭터를 표시하라.

구현 지침:

- 이미지 fallback은 React state로 `onError` 처리하거나, 별도 컴포넌트로 작게 분리해도 된다.
- 홈 화면은 여전히 모바일 첫 화면에서 시작 버튼이 명확히 보여야 한다.
- 최근 히스토리 전체 목록 UI는 만들지 않는다.

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
   - 성공: `"status": "completed"`, `"summary": "홈 화면에 히스토리 개수 표시와 홈 도트 GIF fallback 추가"`
   - 수정 3회 시도 후에도 실패: `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요: `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 히스토리 전체 목록 화면을 만들지 마라. 이유: 이번 scope는 결과 강화이지 기록 관리 화면 추가가 아니다.
- 홈 화면에서 시작 버튼 접근성을 떨어뜨리지 마라. 이유: MVP의 핵심 진입 CTA다.
- GIF 파일이 없을 때 깨진 이미지 아이콘을 노출하지 마라. 이유: 리소스는 선택 사항이며 fallback이 필요하다.
- 기존 테스트를 깨뜨리지 마라.
