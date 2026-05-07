# Breadcrumbs Implementation Notes

## Task 1 — Package scaffolding and element shells

- **Commit:** 1b50b2efa8 (PR #11593)
- **Date:** pre-existing
- **Decisions:** Task 1 considered done via existing scaffolding from PR #11593 ("feat: set up initial package structure for breadcrumbs component"). Mixin chains will be completed in subsequent tasks as features are added.
- **Surprises:** —
- **Spec adjustments:** —

## Task 2 — BreadcrumbsItem — link vs non-link rendering with `path`

- **Date:** 2026-05-06
- **Decisions:** Single-template `render()` with an inner ternary on `this.path == null` chosen over a unified template because the spec mandates distinct outer parts (`link` vs `nolink`). Keeping one `html` template keeps future shared additions (e.g. a tooltip slot) in one place. `path == null` covers both `null` and `undefined`. Property uses default `attribute: 'path'` mapping (allows `<vaadin-breadcrumbs-item path="...">`), matching side-nav-item.
- **Surprises:** —
- **Spec adjustments:** Removed the standalone "Add chevron-right icon to shared style-props" task that previously preceded this one. The icon's only consumer is the separator pseudo-element, so it was folded into the first task that uses it (now Task 11 — overflow separator). Subsequent tasks renumbered down by one.

## Task 3 — BreadcrumbsItem — prefix slot and has-prefix reflection

- **Commit:** 5c5c37cb9b
- **Date:** 2026-05-07
- **Decisions:** `<slot name="prefix">` lives inside the `[part="link"]`/`[part="nolink"]` wrapper per spec, repeated in both render branches alongside the existing `[part="label"]` content (the inline ternary structure from Task 2 is preserved). `PrefixSlotController` subclasses `SlotController` (`multiple: true`, `observe: true`) and overrides `initCustomNode`/`teardownNode` to call back into the host's `_updateHasPrefix()`. The host reads `controller.nodes.length` rather than running its own DOM scan, so the attribute tracks the same filtered set the controller maintains (whitespace, `data-slot-ignore`, default-slot text excluded). Branch swaps recreate the slot element, so the controller exposes a `reobserve()` method called from `updated()` when `path` changes — keeps the `__slotObserver` re-binding inside the controller subclass instead of having the host poke private fields.
- **Surprises:** Base `SlotController` does not dispatch `slot-content-changed` (only `SlotChildObserveController` does); subclassing with `initCustomNode`/`teardownNode` is the right primitive. The slot element is re-rendered on every `path` toggle because Lit's nested template branches don't reuse the underlying DOM across the link/nolink swap, hence the explicit `reobserve()` step.
- **Spec adjustments:** —
