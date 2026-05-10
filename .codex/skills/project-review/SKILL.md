---
name: project-review
description: Use when reviewing this repository's changes against AGENTS.md, docs/ARCHITECTURE.md, docs/ADR.md, required tests, critical rules, and validation commands.
---

# Project Review

이 프로젝트의 변경 사항을 리뷰할 때 이 절차를 따른다.

## Required Reading

먼저 다음 문서를 읽는다:

- `/AGENTS.md`
- `/docs/ARCHITECTURE.md`
- `/docs/ADR.md`

그런 다음 변경된 파일들을 확인한다.

## Review Checklist

검토할 항목:

1. 아키텍처 준수: `ARCHITECTURE.md`에 정의된 디렉토리 구조를 따르고 있는가?
2. 기술 스택 준수: `ADR.md`에 정의된 기술 선택을 벗어나지 않았는가?
3. 테스트 존재: 새로운 기능에 대한 테스트가 작성되어 있는가?
4. CRITICAL 규칙: `AGENTS.md`의 CRITICAL 규칙을 위반하지 않았는가?
5. 빌드 가능: 검증 명령어가 에러 없이 통과하는가?

## Validation Commands

가능하면 다음 명령을 실행한다:

```bash
npm run lint
npm run build
npm run test
```

실행하지 못한 명령이 있으면 결과에 명확히 적는다.

## Output Format

아래 표를 포함한다:

| 항목 | 결과 | 비고 |
|------|------|------|
| 아키텍처 준수 | ✅/❌ | {상세} |
| 기술 스택 준수 | ✅/❌ | {상세} |
| 테스트 존재 | ✅/❌ | {상세} |
| CRITICAL 규칙 | ✅/❌ | {상세} |
| 빌드 가능 | ✅/❌ | {상세} |

위반 사항이 있으면 수정 방안을 구체적으로 제시한다.
