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

## Pipeline reorganization after Task 4

After Task 4, the remaining tasks (5–18) were re-evaluated against the principle that each task should deliver user-visible value on its own — no scaffolding-only steps. The 14 remaining tasks were collapsed into 7 (now Tasks 5–11):

- Old 5 (shadow DOM scaffold), old 6 (slot/root/current), old 11 (overflow separator), old 12 (a11y verification), and the trail-relevant parts of old 15 (base styles) → fold into new **Task 5: Render the trail**.
- Old 14 (RTL) → new **Task 6: RTL flip**.
- Old 16 (Lumo) → new **Task 7: Lumo theme**.
- Old 17 (Aura) → new **Task 8: Aura theme**.
- Old 7 (`i18n`), old 8 (overlay class), old 9 (overlay integration), old 10 (overflow detection), and the overflow-relevant parts of old 11 + old 15 → fold into new **Task 9: Overflow behavior end-to-end**.
- Old 13 (keyboard nav) → new **Task 10: Keyboard navigation in overlay**.
- Old 18 (integration) → new **Task 11: Integration & validation**.

Two commits landed under the old Task 5 numbering before the reorganization:

- `c7b8eba824` (PR #11700) — initial old Task 5: shadow DOM with `list`, `overflow`, and the placeholder `<vaadin-breadcrumbs-overlay>` tag with a dummy `.renderer="${() => {}}"`.
- `c4102f0515` — Task 5 amendment in response to PR review (web-padawan): dropped the overlay tag and the renderer placeholder, deferring overlay rendering to (then) Task 9 via a `<vaadin-login-form>` `__renderSlottedForm` pattern in `update()`. The spec change in this commit (rendering via `lit.render()` instead of `OverlayMixin`'s `.renderer`) is preserved in `web-component-spec.md` under the new task structure.

Code state at this point matches the c4102f0515 amendment: `<vaadin-breadcrumbs>` renders `<div role="list" part="list">` containing `<slot name="root">`, `[part="overflow"]` (hidden), and the default `<slot>`. The new Task 5 will further simplify this to `<div role="list" part="list"><slot></slot></div>` (no root slot, no overflow placeholder) and add the separator pseudo-element, current marking, and base styles. `<slot name="root">` and `[part="overflow"]` come back when Task 9 implements overflow.

## Task 5 — Render the trail

- **Commit:** 1d3144c9c5
- **Date:** 2026-05-11
- **Decisions:**
  - Container shadow DOM is `<div role="list" part="list"><slot></slot></div>` — single default slot, no `slot="root"` or overflow placeholder yet (those land in Task 9). `role="navigation"` is set in `firstUpdated()` only if absent (mirrors `<vaadin-side-nav>`); this keeps a custom role on the host as an escape hatch and the test asserts the preservation.
  - `role="listitem"` added to `<vaadin-breadcrumbs-item>` host in `firstUpdated()` (only if absent) — Spec Decision 8 and Task 5's user-value statement mandate it. Surfaced by review; the previous tasks (1–4) hadn't added it.
  - Current marking is driven by `ItemsSlotController` (subclasses `SlotController` with `{ multiple: true, observe: true }` on the default slot). `initAddedNode` and `teardownNode` each call a shared `__observeItem` helper to (re-)observe `path` mutations on slotted `<vaadin-breadcrumbs-item>` children through a single per-controller `MutationObserver({ attributeFilter: ['path'] })`. The MutationObserver covers `path` attribute changes only; SlotController owns child-list changes via its built-in `SlotObserver`, so we never need `childList`/`subtree` on the MutationObserver.
  - `__updateCurrent()` is a private method on the controller. It iterates `this.nodes` (the SlotController's tracked children) and calls `item._setCurrent?.(isCurrent)` on each — `true` on the last child iff its `path` is `null`/`undefined`, `false` everywhere else to clear stale state. Initial state is established as `initMultiple()` walks the existing children during `hostConnected()`; the host no longer triggers the method manually.
  - MutationObserver re-observation on teardown: since `MutationObserver` has no per-target disconnect, `teardownNode` calls `disconnect()` once and re-`observe`s the remaining `this.nodes` via `__observeItem` so the removed node falls out of the observation set.
  - `--_vaadin-icon-chevron-right` added to `style-props.js` alongside `--_vaadin-icon-chevron-down`. Both base-styles modules import `style-props.js` directly to ensure the icon variable is registered when the package is consumed in isolation.
  - Item base styles use `display: inline-flex` on the host (clearer than `display: inline` since the host is a flex item of `[part="list"]` and the inner display communicates intent for label + separator layout). The `:host::after` separator uses the `mask:` shorthand `mask: var(--vaadin-breadcrumbs-separator, var(--_vaadin-icon-chevron-right)) center / contain no-repeat;` with `background: currentColor`. Hidden via `:host(:last-of-type)::after, :host([current])::after { display: none; }`.
  - Only `--vaadin-breadcrumbs-separator` is exposed as a public CSS variable — matching the spec's CSS Custom Property table exactly. The implementation-agent's first pass added `--vaadin-breadcrumbs-separator-color`, `--vaadin-breadcrumbs-separator-size`, and `--vaadin-breadcrumbs-gap`; review caught this as undocumented surface expansion. All three were dropped in favor of literals (`currentColor`, `1em`, `0.25em`) so themes can override via `:host` selectors in Tasks 7/8.
  - `forced-colors: active` block on the item's `:host::after` sets `background: CanvasText` to keep the separator visible. The container-level forced-colors block from the first pass was dropped — the item rule already covers the requirement and the container's variable cascade was dead code.
  - Logical CSS only on the `[part="list"]` flex container (`gap: 0.25em`); RTL flips for free in Task 6 without overrides.
  - Visual test for the default trail in `test/visual/{base,lumo,aura}/`. Forced-colors visual test deliberately omitted: the runner has no `emulateMedia` infrastructure, and a stub passing-test would be misleading. The decision is documented in the visual test file's header comment.
- **Surprises:**
  - First implementation pass added `--vaadin-breadcrumbs-separator-color`, `--vaadin-breadcrumbs-separator-size`, and `--vaadin-breadcrumbs-gap` defensively. The spec's CSS Custom Property table is the contract — any variable read via `var(--vaadin-...)` becomes de-facto public, so we treat the table as exhaustive.
  - `display: inline-flex` on the host blockifies `::after`'s computed display to `block` (was `inline-block` under `display: inline`). The separator-visibility test loosened from `display === 'inline-block'` to `display !== 'none'` to match the new layout choice; the companion "should hide" tests still strictly assert `'none'`.
  - Initial implementation used a host-side `MutationObserver({ childList: true, subtree: true, attributeFilter: ['path'] })` covering everything. Review feedback (web-padawan) split this into a `SlotController` for slot membership and a per-controller `MutationObserver` with `attributeFilter: ['path']` only — `subtree` and `childList` are no longer needed because `SlotController` handles add/remove via its `SlotObserver`.
- **Spec adjustments:** —

## Task 6 — RTL directional flip

- **Commit:** c852ec6aaa (PR #11736)
- **Date:** 2026-05-11
- **Decisions:**
  - One CSS rule on `<vaadin-breadcrumbs-item>`: `:host([dir='rtl'])::after { transform: scaleX(-1); }`. `ElementMixin` chains `DirMixin`, which mirrors `<html dir="rtl">` onto the host without component-side code.
  - Followed spec wording (`scaleX(-1)`) over the codebase idiom (`scale: -1` used by `<vaadin-details-summary>` / `<vaadin-side-nav>`). Both compute to the same matrix; keeping the spec's explicit form because the spec is the contract under review.
  - Verification lives in the visual layer only: `rtl-basic` snapshot under `test/visual/base/`, reference captured via `yarn update:base --group breadcrumbs`. An earlier draft added unit tests (computed-`transform` assertion, cssText regex scan for physical margins/paddings) — dropped after PR review (web-padawan) flagged them as the wrong way to test CSS and unnecessary on top of the visual snapshot. Playwright sanity-check at 1280×720 and 480×720 (RTL + forced-colors) confirmed chevrons mirrored without baseline misalignment or clipping.
- **Surprises:** —
- **Spec adjustments:** —
