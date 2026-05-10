#!/usr/bin/env python3
"""Codex hook: run configured npm validation commands when available."""

import json
import subprocess
import sys
from pathlib import Path
from typing import Optional


COMMANDS = [
    ("lint", ["npm", "run", "lint"]),
    ("build", ["npm", "run", "build"]),
    ("test", ["npm", "run", "test"]),
]


def _read_payload() -> dict:
    try:
        raw = sys.stdin.read()
        return json.loads(raw) if raw.strip() else {}
    except json.JSONDecodeError:
        return {}


def _load_package_json(root: Path) -> Optional[dict]:
    package_json = root / "package.json"
    if not package_json.exists():
        return None
    try:
        return json.loads(package_json.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def main() -> int:
    payload = _read_payload()
    if payload.get("stop_hook_active"):
        print(json.dumps({"continue": True}))
        return 0

    repo_root = Path(__file__).resolve().parents[2]
    package = _load_package_json(repo_root)
    if not package:
        print(json.dumps({"continue": True}))
        return 0

    scripts = package.get("scripts") or {}
    failures = []

    for script_name, command in COMMANDS:
        if script_name not in scripts:
            continue
        result = subprocess.run(command, cwd=str(repo_root), capture_output=True, text=True, timeout=120)
        if result.returncode != 0:
            output = (result.stdout + "\n" + result.stderr).strip()
            failures.append(
                f"{' '.join(command)} failed with exit code {result.returncode}.\n"
                f"{output[-4000:]}"
            )

    if failures:
        print(
            json.dumps(
                {
                    "decision": "block",
                    "reason": "Project validation failed. Fix the failing checks before stopping.\n\n"
                    + "\n\n".join(failures),
                },
                ensure_ascii=False,
            )
        )
        return 0

    print(json.dumps({"continue": True}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
