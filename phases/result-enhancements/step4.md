# Step 4: result-ui

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/AGENTS.md`
- `/docs/ARCHITECTURE.md`
- `/docs/ADR.md`
- `/src/types/muu.ts`
- `/src/components/MuuApp.tsx`
- `/src/components/MuuApp.module.css`
- `/public/assets/README.md`

이전 step에서 만들어진 결과 모델, 히스토리, 비교 연동을 꼼꼼히 읽고, 설계 의도를 이해한 뒤 작업하라.

## 작업

결과 화면에 세 가지 강화 섹션을 추가하라.

추가 섹션:

- `오늘의 금지 행동`
  - `result.forbiddenAction` 표시
- `획득 아이템`
  - `result.rewardItem.name`
  - `result.rewardItem.description`
  - `result.rewardItem.assetPath`가 있으면 도트 이미지/GIF 표시
  - asset이 없으면 픽셀 스타일 fallback 박스 표시
- `지난 결과와 비교`
  - `result.comparison`이 있을 때만 표시
  - `label`과 `summary` 표시

권장 결과 화면 순서:

1. 유형/캐릭터
2. 상태 요약
3. 팩트 한 줄
4. 오늘의 금지 행동
5. 감정 날씨/주요 신호
6. 획득 아이템
7. 지난 결과와 비교
8. AI 관찰
9. 오늘의 인간 유지 행동
10. 다시 분석하기

CSS:

- CSS Modules만 사용하라.
- 도트 이미지/GIF에는 `image-rendering: pixelated`를 적용하라.
- 모바일 360px 기준에서 텍스트가 버튼/카드 밖으로 넘치지 않게 하라.
- 기존 픽셀 border, hard shadow 스타일과 일관되게 만든다.

호환성:

- 오래된 저장 결과에 새 필드가 없을 수 있으므로 렌더링 fallback을 제공하라.
- fallback 값은 UI 컴포넌트 또는 정규화 함수에서 처리하라.

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
   - 성공: `"status": "completed"`, `"summary": "결과 화면에 금지 행동, 획득 아이템, 지난 결과 비교 섹션 추가"`
   - 수정 3회 시도 후에도 실패: `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요: `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- Tailwind, styled-components 같은 새 스타일링 도구를 추가하지 마라. 이유: 프로젝트는 CSS Modules를 사용한다.
- 결과 화면을 마케팅 랜딩 페이지처럼 바꾸지 마라. 이유: 앱의 핵심은 모바일 상태 리포트 화면이다.
- GIF 파일을 반드시 존재한다고 가정하지 마라. 이유: 리소스가 없어도 UI가 깨지면 안 된다.
- 기존 테스트를 깨뜨리지 마라.
