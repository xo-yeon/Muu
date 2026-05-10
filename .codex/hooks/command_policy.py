#!/usr/bin/env python3
"""Codex hook: block obviously destructive Bash commands."""

import json
import re
import sys


BLOCKED_PATTERNS = [
    (r"\brm\s+-rf\b", "Refusing recursive force delete."),
    (r"\bgit\s+push\b[^\n;|&]*\s--force(?:-with-lease)?\b", "Refusing force push."),
    (r"\bgit\s+reset\s+--hard\b", "Refusing hard reset."),
    (r"\bDROP\s+TABLE\b", "Refusing destructive SQL command."),
]


def _read_payload() -> dict:
    try:
        raw = sys.stdin.read()
        return json.loads(raw) if raw.strip() else {}
    except json.JSONDecodeError:
        return {}


def _command_from(payload: dict) -> str:
    tool_input = payload.get("tool_input") or {}
    if isinstance(tool_input, dict):
        return str(tool_input.get("command") or tool_input.get("cmd") or "")
    return ""


def _deny(event_name: str, reason: str) -> None:
    if event_name == "PermissionRequest":
        response = {
            "hookSpecificOutput": {
                "hookEventName": "PermissionRequest",
                "decision": {
                    "behavior": "deny",
                    "message": reason,
                },
            }
        }
    else:
        response = {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": reason,
            }
        }
    print(json.dumps(response, ensure_ascii=False))


def main() -> int:
    payload = _read_payload()
    event_name = payload.get("hook_event_name") or "PreToolUse"
    command = _command_from(payload)

    for pattern, reason in BLOCKED_PATTERNS:
        if re.search(pattern, command, flags=re.IGNORECASE):
            _deny(event_name, reason)
            return 0

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
