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
- **Decisions:** `<slot name="prefix">` lives inside the `[part="link"]`/`[part="nolink"]` wrapper per spec, repeated in both render branches alongside the existing `[part="label"]` content (the inline ternary structure from Task 2 is preserved). `PrefixSlotController` subclasses `SlotController` (`multiple: true`, `observe: true`) and owns the `has-prefix` host attribute end-to-end: `initCustomNode`/`teardownNode` and `reobserve()` all call its private `__updateHasPrefix()`, which toggles the attribute based on `this.nodes.length`. The host's only responsibility is constructing the controller in `ready()` and calling `reobserve()` from `updated()` when `path` changes, since branch swaps recreate the slot element and the underlying `__slotObserver` needs to be re-bound.
- **Surprises:** Base `SlotController` does not dispatch `slot-content-changed` (only `SlotChildObserveController` does); subclassing with `initCustomNode`/`teardownNode` is the right primitive. The slot element is re-rendered on every `path` toggle because Lit's nested template branches don't reuse the underlying DOM across the link/nolink swap, hence the explicit `reobserve()` step.
- **Spec adjustments:** —

## Task 4 — BreadcrumbsItem — current state and aria-current="page"

- **Commit:** ca2187a163
- **Date:** 2026-05-07
- **Decisions:** `current` is declared with `readOnly: true` + `reflectToAttribute: true` (mirroring `vaadin-side-nav-item`), so the public surface signals that applications do not write it directly — the parent will drive it via the generated `_setCurrent()` accessor in a future task. `aria-current` is bound only inside the `[part="nolink"]` branch using `aria-current="${this.current ? 'page' : nothing}"`; `nothing` keeps the attribute absent rather than rendering `aria-current="false"`, and the link branch carries no binding at all so `current` cannot leak there even if the parent sets it incorrectly.
- **Surprises:** PolylitMixin's `readOnly: true` replaces the property setter with a no-op, which means `host.toggleAttribute('current', true)` does **not** update the property — Lit's reflected attribute change reaches the no-op setter. Tests therefore drive state via `_setCurrent(true|false)`, the canonical accessor PolylitMixin generates. The future Task 6 (parent-side `current` placement) must use the same accessor.
- **Spec adjustments:** —
