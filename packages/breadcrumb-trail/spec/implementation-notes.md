# BreadcrumbTrail Implementation Notes

## Task 1 — Package scaffolding and element shells

- **Commit:** see `git log --grep "feat(breadcrumb-trail): task 1"` (HEAD when this entry was written)
- **Date:** 2026-04-28
- **Decisions:** Used a single shared experimental flag string (`breadcrumbTrailComponent`) on all three elements via `static get experimental()`, rather than letting `defineCustomElement` derive a distinct flag per tag. Followed the simpler scaffolding shape (master-detail-layout style) without separate `*-mixin.js` files for `BreadcrumbTrail` / `BreadcrumbItem`; `BreadcrumbTrailOverlay` does ship with a placeholder `vaadin-breadcrumb-trail-overlay-mixin.js` so Task 10 has a hook. Added `LumoInjectionMixin` to the overlay's mixin chain to match the convention of every other overlay element in the repo.
- **Surprises:** `yarn lint` cannot run in this sandbox — `.claude-contained/` (untracked, pre-existing) trips eslint-plugin-prettier on a missing `@github/prettier-config`. Validated via scoped `npx eslint packages/breadcrumb-trail/` (clean), `yarn lint:types` (clean), and `yarn test --group breadcrumb-trail` (15 tests, all passing). The implementation agent removed two blank lines in `test/feature-flag.test.js` to satisfy `simple-import-sort/imports`; no test assertions were modified.
- **Spec adjustments:** —
