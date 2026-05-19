# Step 1: route-and-subdomain

## 작업

- `src/app/decision-lab/page.tsx`를 추가한다.
- `src/proxy.ts`에서 `decision.*`, `lab.*` 호스트를 `/decision-lab`로 rewrite한다.
- API, Next 내부 경로, 정적 파일은 rewrite에서 제외한다.

## Acceptance Criteria

```bash
npm run lint
npm run build
```
