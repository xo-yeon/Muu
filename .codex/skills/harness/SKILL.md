---
name: harness
description: Use when working in this repository with the Harness workflow: reading project docs, discussing implementation decisions, designing phase steps, creating phases/*.json and step files, or running scripts/execute.py.
---

# Harness Workflow

이 프로젝트는 Harness 프레임워크를 사용한다. 사용자가 Harness 작업, phase 설계, step 파일 생성, 또는 `scripts/execute.py` 실행을 요청하면 이 절차를 따른다.

## Workflow

1. 탐색: `/docs/` 하위 문서(PRD, ARCHITECTURE, ADR 등)를 읽고 기획, 아키텍처, 설계 의도를 파악한다.
2. 논의: 구현 전에 구체화하거나 결정해야 할 사항이 있으면 사용자에게 제시한다.
3. Step 설계: 사용자가 구현 계획 작성을 지시하면 여러 step으로 나눈 초안을 작성해 피드백을 요청한다.
4. 파일 생성: 사용자가 승인하면 `phases/index.json`, `phases/{task-name}/index.json`, `phases/{task-name}/step{N}.md`를 생성한다.
5. 실행: 요청이 있으면 `python3 scripts/execute.py {task-name}` 또는 `python3 scripts/execute.py {task-name} --push`를 사용한다.

## Step Design Rules

- Scope 최소화: 하나의 step에서 하나의 레이어 또는 모듈만 다룬다. 여러 모듈을 동시에 수정해야 하면 step을 쪼갠다.
- 자기완결성: 각 step 파일은 독립된 Codex 세션에서 실행된다. 외부 대화 참조를 금지하고 필요한 정보를 파일 안에 모두 적는다.
- 사전 준비 강제: 관련 문서 경로와 이전 step에서 생성 또는 수정된 파일 경로를 명시한다.
- 시그니처 수준 지시: 함수와 클래스 인터페이스만 제시하고 내부 구현은 에이전트 재량에 맡긴다. 단, 멱등성, 보안, 데이터 무결성 같은 핵심 규칙은 명시한다.
- Acceptance Criteria는 실행 가능한 커맨드로 작성한다.
- 주의사항은 "X를 하지 마라. 이유: Y" 형식으로 구체적으로 쓴다.
- Step name은 kebab-case slug로 작성한다. 예: `project-setup`, `api-layer`, `auth-flow`.

## File Templates

### `phases/index.json`

```json
{
  "phases": [
    {
      "dir": "0-mvp",
      "status": "pending"
    }
  ]
}
```

- `dir`: task 디렉토리명.
- `status`: `"pending"` | `"completed"` | `"error"` | `"blocked"`.
- 타임스탬프(`completed_at`, `failed_at`, `blocked_at`)는 `execute.py`가 상태 변경 시 기록한다. 생성 시 넣지 않는다.

### `phases/{task-name}/index.json`

```json
{
  "project": "<프로젝트명>",
  "phase": "<task-name>",
  "steps": [
    { "step": 0, "name": "project-setup", "status": "pending" },
    { "step": 1, "name": "core-types", "status": "pending" },
    { "step": 2, "name": "api-layer", "status": "pending" }
  ]
}
```

- `project`: 프로젝트명. `AGENTS.md`를 참조한다.
- `phase`: task 이름. 디렉토리명과 일치시킨다.
- `steps[].step`: 0부터 시작하는 순번.
- `steps[].name`: kebab-case slug.
- `steps[].status`: 초기값은 모두 `"pending"`.

상태 전이 기록:

| 전이 | 기록되는 필드 | 기록 주체 |
|------|-------------|----------|
| completed | `completed_at`, `summary` | Codex 세션(summary), execute.py(timestamp) |
| error | `failed_at`, `error_message` | Codex 세션(message), execute.py(timestamp) |
| blocked | `blocked_at`, `blocked_reason` | Codex 세션(reason), execute.py(timestamp) |

`summary`는 다음 step에 유용하도록 생성된 파일과 핵심 결정을 한 줄로 요약한다.

### `phases/{task-name}/step{N}.md`

````markdown
# Step {N}: {이름}

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md`
- `/docs/ADR.md`
- {이전 step에서 생성/수정된 파일 경로}

이전 step에서 만들어진 코드를 꼼꼼히 읽고, 설계 의도를 이해한 뒤 작업하라.

## 작업

{구체적인 구현 지시. 파일 경로, 클래스/함수 시그니처, 로직 설명을 포함한다.
코드 스니펫은 인터페이스/시그니처 수준만 제시하고, 구현체는 에이전트에게 맡긴다.
단, 설계 의도에서 벗어나면 안 되는 핵심 규칙은 명확히 적는다.}

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md 디렉토리 구조를 따르는가?
   - ADR 기술 스택을 벗어나지 않았는가?
   - AGENTS.md CRITICAL 규칙을 위반하지 않았는가?
3. 결과에 따라 `phases/{task-name}/index.json`의 해당 step을 업데이트한다:
   - 성공: `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패: `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요: `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- {이 step에서 하지 말아야 할 것. "X를 하지 마라. 이유: Y" 형식}
- 기존 테스트를 깨뜨리지 마라
````

## Execute

```bash
python3 scripts/execute.py {task-name}
python3 scripts/execute.py {task-name} --push
```

`execute.py`가 처리하는 것:

- `feat-{task-name}` 브랜치 생성과 checkout
- `AGENTS.md`와 `docs/*.md` 가드레일 주입
- 완료된 step의 `summary`를 다음 step 프롬프트에 전달
- 실패 시 최대 3회 재시도
- 코드 변경(`feat`)과 메타데이터(`chore`) 분리 커밋
- `started_at`, `completed_at`, `failed_at`, `blocked_at` 자동 기록

## Error Recovery

- error 발생 시: `phases/{task-name}/index.json`에서 해당 step의 `status`를 `"pending"`으로 바꾸고 `error_message`를 삭제한 뒤 재실행한다.
- blocked 발생 시: `blocked_reason`의 사유를 해결한 뒤 `status`를 `"pending"`으로 바꾸고 `blocked_reason`을 삭제한 뒤 재실행한다.
