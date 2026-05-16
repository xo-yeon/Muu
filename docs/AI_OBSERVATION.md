# AI Observation Runtime Policy

Muu generates observation text locally by default so the MVP remains usable without paid OpenAI API quota.

## Default mode

- `freeText` empty: no observation is generated and no API request is made.
- `freeText` present: a deterministic local observation is generated from the fixed rule-based result.
- OpenAI quota, billing, or rate-limit errors do not block the result page.

## OpenAI opt-in

Set both values to use the OpenAI API:

```txt
OPENAI_OBSERVATION_MODE=api
OPENAI_API_KEY=...
```

The OpenAI response is still only a supplemental observation. It must not change the rule-based human type.
