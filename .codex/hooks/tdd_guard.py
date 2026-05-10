#!/usr/bin/env python3
"""Codex hook: lightweight TDD guard inspired by nizos/tdd-guard."""

import hashlib
import json
import re
import sys
import tempfile
import time
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple


STATE_DIR = Path(__file__).resolve().parents[1] / "tdd-guard" / "data"
STATE_FILE = STATE_DIR / "state.json"
_REPO_KEY = hashlib.sha256(str(Path(__file__).resolve().parents[2]).encode("utf-8")).hexdigest()[:16]
FALLBACK_STATE_DIR = Path(tempfile.gettempdir()) / "codex-tdd-guard" / _REPO_KEY
FALLBACK_STATE_FILE = FALLBACK_STATE_DIR / "state.json"

TEST_PATH_PATTERNS = [
    re.compile(r"(^|/)(test|tests|spec|specs|__tests__)/", re.IGNORECASE),
    re.compile(r"(\.|_)(test|spec)\.[^/]+$", re.IGNORECASE),
    re.compile(r"(^|/)conftest\.py$", re.IGNORECASE),
]

NON_PRODUCTION_PATH_PATTERNS = [
    re.compile(r"\.(md|mdx|txt|json|ya?ml|toml|lock|svg|png|jpe?g|gif|webp)$", re.IGNORECASE),
    re.compile(r"(^|/)(docs|phases|\.codex|\.github|\.githooks)/", re.IGNORECASE),
    re.compile(r"(^|/)(AGENTS\.md|README\.md|LICENSE|\.gitignore)$", re.IGNORECASE),
]

TEST_COMMAND_PATTERNS = [
    re.compile(r"\bnpm\s+(run\s+)?test\b"),
    re.compile(r"\bpnpm\s+(run\s+)?test\b"),
    re.compile(r"\byarn\s+test\b"),
    re.compile(r"\bvitest\b"),
    re.compile(r"\bjest\b"),
    re.compile(r"\bpytest\b"),
    re.compile(r"\bpython(?:3)?\s+-m\s+pytest\b"),
    re.compile(r"\bgo\s+test\b"),
    re.compile(r"\bcargo\s+(nextest\s+run|test)\b"),
    re.compile(r"\bphpunit\b"),
    re.compile(r"\brspec\b"),
    re.compile(r"\bminitest\b"),
]

IMPLEMENTATION_PROMPT = re.compile(
    r"\b(implement|add|create|build|fix|change|modify|refactor|코드|구현|수정|추가|생성|고쳐)\b",
    re.IGNORECASE,
)


def _read_payload() -> Dict[str, Any]:
    try:
        raw = sys.stdin.read()
        return json.loads(raw) if raw.strip() else {}
    except json.JSONDecodeError:
        return {}


def _load_state() -> Dict[str, Any]:
    state = None
    for state_file in (STATE_FILE, FALLBACK_STATE_FILE):
        if not state_file.exists():
            continue
        try:
            state = json.loads(state_file.read_text(encoding="utf-8"))
            break
        except json.JSONDecodeError:
            state = None
    if state is None:
        state = {"enabled": True, "failing_test_seen": False}
    state.setdefault("enabled", True)
    state.setdefault("failing_test_seen", False)
    return state


def _save_state(state: Dict[str, Any]) -> None:
    state["updated_at"] = int(time.time())
    payload = json.dumps(state, indent=2, ensure_ascii=False)
    for state_dir, state_file in ((STATE_DIR, STATE_FILE), (FALLBACK_STATE_DIR, FALLBACK_STATE_FILE)):
        try:
            state_dir.mkdir(parents=True, exist_ok=True)
            state_file.write_text(payload, encoding="utf-8")
            return
        except OSError:
            continue


def _json_response(payload: Dict[str, Any]) -> None:
    print(json.dumps(payload, ensure_ascii=False))


def _additional_context(event_name: str, message: str) -> None:
    _json_response(
        {
            "hookSpecificOutput": {
                "hookEventName": event_name,
                "additionalContext": message,
            }
        }
    )


def _deny_pre_tool_use(reason: str) -> None:
    _json_response(
        {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": reason,
            }
        }
    )


def _tool_input(payload: Dict[str, Any]) -> Dict[str, Any]:
    value = payload.get("tool_input")
    return value if isinstance(value, dict) else {}


def _command(payload: Dict[str, Any]) -> str:
    tool_input = _tool_input(payload)
    return str(tool_input.get("command") or tool_input.get("cmd") or "")


def _is_test_command(command: str) -> bool:
    return any(pattern.search(command) for pattern in TEST_COMMAND_PATTERNS)


def _find_exit_code(value: Any) -> Optional[int]:
    if isinstance(value, dict):
        for key in ("exitCode", "exit_code", "returncode", "return_code", "status"):
            if key in value:
                try:
                    return int(value[key])
                except (TypeError, ValueError):
                    pass
        for nested in value.values():
            code = _find_exit_code(nested)
            if code is not None:
                return code
    if isinstance(value, list):
        for nested in value:
            code = _find_exit_code(nested)
            if code is not None:
                return code
    if isinstance(value, str):
        match = re.search(r"(?:exit code|exitCode|returncode)\D+(-?\d+)", value, re.IGNORECASE)
        if match:
            return int(match.group(1))
    return None


def _paths_from_patch(command: str) -> List[str]:
    paths = []
    for line in command.splitlines():
        match = re.match(r"\*\*\* (?:Add|Update|Delete) File: (.+)$", line)
        if match:
            paths.append(match.group(1).strip())
    return paths


def _paths_from_shell_command(command: str) -> List[str]:
    paths = []
    skip_tokens = {"-", "true", "false", "/dev/null"}

    for match in re.finditer(r"(?:^|[^0-9])>{1,2}\s*([^\s;&|]+)", command):
        path = match.group(1).strip("'\"")
        if path and path not in skip_tokens and not path.startswith("&"):
            paths.append(path)

    for match in re.finditer(r"\btee\s+(?:-[A-Za-z]+\s+)*([^\s;&|]+)", command):
        path = match.group(1).strip("'\"")
        if path and path not in skip_tokens:
            paths.append(path)

    for match in re.finditer(r"\b(?:cp|mv)\s+(?:-[A-Za-z]+\s+)*(?:[^\s;&|]+\s+)+([^\s;&|]+)", command):
        path = match.group(1).strip("'\"")
        if path and path not in skip_tokens:
            paths.append(path)

    for match in re.finditer(r"\bsed\s+-i(?:\s+['\"][^'\"]*['\"])?(?:\s+[^\s;&|]+)+\s+([^\s;&|]+)", command):
        path = match.group(1).strip("'\"")
        if path and path not in skip_tokens:
            paths.append(path)

    return paths


def _paths_from_tool_input(tool_input: Dict[str, Any]) -> List[str]:
    paths = []
    for key in ("path", "file_path", "filepath", "filename"):
        if tool_input.get(key):
            paths.append(str(tool_input[key]))
    if isinstance(tool_input.get("files"), list):
        paths.extend(str(path) for path in tool_input["files"])
    command = str(tool_input.get("command") or "")
    paths.extend(_paths_from_patch(command))
    paths.extend(_paths_from_shell_command(command))
    return sorted(set(paths))


def _matches_any(path: str, patterns: Iterable[re.Pattern]) -> bool:
    normalized = path.replace("\\", "/")
    return any(pattern.search(normalized) for pattern in patterns)


def _classify_paths(paths: List[str]) -> Tuple[List[str], List[str], List[str]]:
    tests = []
    non_production = []
    production = []
    for path in paths:
        if _matches_any(path, TEST_PATH_PATTERNS):
            tests.append(path)
        elif _matches_any(path, NON_PRODUCTION_PATH_PATTERNS):
            non_production.append(path)
        else:
            production.append(path)
    return tests, non_production, production


def _handle_session_start(payload: Dict[str, Any]) -> int:
    state = _load_state()
    _save_state(state)
    _additional_context(
        "SessionStart",
        "TDD Guard is active. Write or update a failing test before changing production code. "
        "Use 'tdd-guard off', 'tdd-guard on', or 'tdd-guard reset' in a prompt to manage this repo-local guard.",
    )
    return 0


def _handle_user_prompt_submit(payload: Dict[str, Any]) -> int:
    prompt = str(payload.get("prompt") or "")
    state = _load_state()
    lowered = prompt.lower()

    if "tdd-guard off" in lowered or "/tdd-guard off" in lowered:
        state["enabled"] = False
        _save_state(state)
        _additional_context("UserPromptSubmit", "TDD Guard disabled for this repository session.")
        return 0

    if "tdd-guard on" in lowered or "/tdd-guard on" in lowered:
        state["enabled"] = True
        _save_state(state)
        _additional_context("UserPromptSubmit", "TDD Guard enabled for this repository session.")
        return 0

    if "tdd-guard reset" in lowered or "/tdd-guard reset" in lowered:
        state = {"enabled": True, "failing_test_seen": False, "tdd_phase": "idle"}
        _save_state(state)
        _additional_context("UserPromptSubmit", "TDD Guard state reset for this repository session.")
        return 0

    if state.get("enabled", True) and IMPLEMENTATION_PROMPT.search(prompt):
        _additional_context(
            "UserPromptSubmit",
            "Before production edits, create or update a test and run it so it fails for the expected reason.",
        )
    return 0


def _handle_post_tool_use(payload: Dict[str, Any]) -> int:
    command = _command(payload)
    if not _is_test_command(command):
        return 0

    state = _load_state()
    exit_code = _find_exit_code(payload.get("tool_response"))
    state["last_test_command"] = command
    state["last_test_exit_code"] = exit_code
    state["last_test_status"] = "unknown" if exit_code is None else ("passing" if exit_code == 0 else "failing")
    if exit_code is not None:
        if exit_code != 0:
            state["failing_test_seen"] = True
            state["tdd_phase"] = "red"
        elif state.get("failing_test_seen"):
            state["tdd_phase"] = "green"
    _save_state(state)
    return 0


def _handle_pre_tool_use(payload: Dict[str, Any]) -> int:
    state = _load_state()
    if not state.get("enabled", True):
        return 0

    tool_input = _tool_input(payload)
    paths = _paths_from_tool_input(tool_input)
    if not paths:
        return 0

    tests, _non_production, production = _classify_paths(paths)
    if tests or not production:
        return 0

    if state.get("failing_test_seen"):
        return 0

    _deny_pre_tool_use(
        "TDD Guard blocked production code editing before a failing test was observed. "
        "Write or update a test first, run the relevant test command, confirm it fails, then retry. "
        f"Production paths: {', '.join(production[:5])}"
    )
    return 0


def main() -> int:
    payload = _read_payload()
    event_name = str(payload.get("hook_event_name") or "")

    if event_name == "SessionStart":
        return _handle_session_start(payload)
    if event_name == "UserPromptSubmit":
        return _handle_user_prompt_submit(payload)
    if event_name == "PostToolUse":
        return _handle_post_tool_use(payload)
    if event_name == "PreToolUse":
        return _handle_pre_tool_use(payload)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
