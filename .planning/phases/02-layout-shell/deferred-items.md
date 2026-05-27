# Phase 02 — Deferred Items

Out-of-scope discoveries logged during plan execution. Not blockers for Phase 02.

## 1. Next.js workspace-root inference warning

**Discovered:** Plan 02-01 Task 3 (npm run build)

**Symptom:**
```
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
We detected multiple lockfiles and selected the directory of /Users/congphan/pnpm-lock.yaml as the root directory.
```

**Cause:** A parent-directory `/Users/congphan/pnpm-lock.yaml` lives above the project root, so Next.js's lockfile-based workspace root inference picks the wrong directory.

**Impact:** Cosmetic warning only — build exits 0, all 5 static pages generate, `out/index.html` is correct.

**Fix (deferred):** Add to `next.config.ts`:
```ts
const nextConfig = {
  outputFileTracingRoot: __dirname,
  // ...
}
```
or delete the orphan parent `pnpm-lock.yaml` if it is not needed.

**Owner:** Suggest addressing during Phase 5 (SEO + deploy prep) or as a quick separate `/gsd:quick` task.
