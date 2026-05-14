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

## Task 7 — Lumo theme

- **Commit:** 9f833b8a7b
- **Date:** 2026-05-12
- **Decisions:**
  - Both components opt into Lumo's base-style injection by overriding `static get lumoInjector()` with `{ ...super.lumoInjector, includeBaseStyles: true }`. This makes the LumoInjector place the component's base stylesheet before the Lumo stylesheet in `adoptedStyleSheets`, so the Lumo CSS layers cleanly over base. The override is required for any new Lumo-themed component per `guidelines/10-theming.md`. PR-review feedback flagged the original commit (which omitted the override and re-declared `:host([hidden]) { display: none !important; }` in Lumo) — duplicating base rules in Lumo CSS is the smell that indicates the injection isn't wired correctly.
  - `<vaadin-breadcrumbs-item>` adopts `DisabledMixin` from `@vaadin/a11y-base`. The mixin contributes a typed `disabled` boolean property that reflects to the host attribute, sets `aria-disabled`, and short-circuits `click()` when disabled. Task 7's Figma "Link Item States" row includes a Disabled variant, and PR review (web-padawan) called out that visual tests must not exercise unimplemented features — `DisabledMixin` is the correct foundation. A future iteration may override `click()` on the item to delegate to the inner `<a>` so that `item.click()` triggers navigation when not disabled (nice-to-have flagged in PR review thread, not in scope here).
  - Two Lumo files per element, matching the `side-nav.css` / `side-nav-item.css` convention prescribed by `guidelines/10-theming.md`: `src/components/breadcrumbs.css` carries only the `lumo_components_breadcrumbs` block, `src/components/breadcrumbs-item.css` carries only `lumo_components_breadcrumbs-item`. Each has its own public entry under `components/`, and the parent's public entry `@import`s the item's so applications get both styles from a single import.
  - Separator color is tinted via `:host::after { color: var(--lumo-contrast-50pct); }`. The base styles set `background: currentColor` on the `::after`, so overriding `color` on the pseudo-element changes the icon tint without altering the label's text color. `::part` cannot reach the `::after` (CSS Shadow Parts level 2 is not shipped), so this is the available route from inside the item's Lumo block.
  - Link interactive states bind to `--lumo-primary-text-color` (default), `--lumo-primary-color` (hover and active, both with underline), and `--lumo-disabled-text-color` (disabled). No `--lumo-primary-color-strong` token exists; `--lumo-primary-color` is the standard "stronger" accent used by other Lumo components for active states. Hover lives inside `@media (any-hover: hover)` to skip touch devices; active applies unconditionally.
  - Focus ring on `[part='link']:focus-visible` uses `box-shadow: 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color)` with `outline: none`, matching `side-nav-item`. `--_focus-ring-color` / `--_focus-ring-width` are declared only on the item's `:host` — custom properties don't cross into a sibling custom element's shadow tree, and the container itself has no focus ring.
  - `cursor: var(--lumo-clickable-cursor)` with no fallback, matching the project-wide convention (side-nav-item uses the same form).
  - Visual tests are split per element, mirroring the `radio-button` package layout: `test/visual/lumo/breadcrumbs.test.js` keeps a single `basic` trail snapshot; `test/visual/lumo/breadcrumbs-item.test.js` exercises the item in isolation with `basic`, `focus-ring`, `disabled`, `prefix`, `disabled-prefix`, and `current` (rendered inside a trail since `current` is set by the parent). Hover and active visual diffs were dropped — synthetic `mousedown` cannot trigger native `:active` in test browsers, so the snapshots were vacuous; radio-button doesn't snapshot those states either.
  - The Lumo visual file no longer carries the `expect(getComputedStyle(item).fontSize).to.equal('16px')` unit assertion — visual tests use only `visualDiff`. The font-size invariant is not separately tested at the Lumo layer; the Figma binding to `--lumo-font-size-m` plus the basic visual snapshot suffice.
  - Unit tests for `DisabledMixin` integration live in `test/breadcrumbs-item.test.js`: attribute reflection, `aria-disabled`, and `click()` no-op when disabled.
- **Surprises:** —
- **Spec adjustments:** —

## Task 8 — Aura theme

- **Commit:** 48728bafb6
- **Date:** 2026-05-14
- **Decisions:**
  - Single CSS file at `packages/aura/src/components/breadcrumbs.css` covering both `<vaadin-breadcrumbs>` and `<vaadin-breadcrumbs-item>`, per the Aura "one file per component" convention in `guidelines/10-theming.md`. Imported from `packages/aura/aura.css` in alphabetical order between `badge.css` and `button.css`. No Lumo-style `lumoInjector` opt-in is needed — Aura is plain CSS imported globally.
  - Selectors target the elements from outside the shadow DOM via element selectors plus `::part(...)`: `vaadin-breadcrumbs::part(list)`, `vaadin-breadcrumbs-item::part(link)`, `vaadin-breadcrumbs-item::part(nolink)`. The separator is styled via `vaadin-breadcrumbs-item::after { color: var(--vaadin-text-color-secondary); }` — the host's `::after` pseudo-element is the same element targeted by the shadow's `:host::after`, so the outer `color` rule cascades into the shadow's `background: currentColor` correctly. Verified visually.
  - Token mapping per `figma-design.md` § Aura: font family/size/line-height from `--aura-font-*`; body color from `--vaadin-text-color`; link color from `--aura-accent-text-color`; separator color from `--vaadin-text-color-secondary`; gap from `--vaadin-gap-s`; focus-ring radius from `--vaadin-radius-s`; disabled text from `--vaadin-text-color-disabled`. Hover/active darken the link to `--vaadin-text-color` with underline (matching the side-nav pattern of sliding link color toward the neutral text color on hover).
  - Focus ring uses base styles' `outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color)`; the Aura layer only adds `border-radius: var(--vaadin-radius-s)` for rounded corners. No `outline: none` + `box-shadow` workaround like Lumo — the outline-based approach matches `upload.css` and other Aura components.
  - Prefix icon uses logical units (`width: 0.875lh; height: 0.875lh`) instead of a fixed pixel size token, matching Aura idiom and the Figma "14×14 in Aura" binding. Selector is a light-DOM child selector `vaadin-breadcrumbs-item > :is(vaadin-icon, [class*='icon'])[slot='prefix']` since `::slotted(...)` doesn't apply from outside the shadow DOM.
  - Visual tests split per element, mirroring Lumo (Task 7 precedent): `test/visual/aura/breadcrumbs.test.js` keeps a single `basic` trail snapshot; `test/visual/aura/breadcrumbs-item.test.js` exercises the item with `basic`, `focus-ring`, `disabled`, `current`, `prefix`, and `disabled-prefix`. Hover and active visual diffs deliberately omitted (synthetic `mousedown` cannot trigger native `:active`); font-size unit assertion deliberately omitted (Figma binding + visual snapshot suffice).
  - The Aura visual config produces both `default/` and `dark/` baselines (driven by the `--dark` flag in `web-test-runner-aura.config.js`); both are committed.
- **Surprises:**
  - The hover/active link color is not named in the Figma "Aura" token table — chose `--vaadin-text-color` (the neutral body text color) following the `side-nav.css` pattern of sliding the link color toward neutral on hover. If a dedicated `--aura-accent-text-color-hover` token emerges later, swap to it.
  - Visual baselines were generated via local Playwright Chromium because Docker is not available in this environment (the `yarn update:aura` / `yarn test:aura` scripts normally route through `scripts/run-docker-visual-tests.sh`). The committed PNGs may not pixel-match what CI's Docker image produces. Re-run `yarn update:aura --group breadcrumbs` and `yarn update:aura:dark --group breadcrumbs` in Docker before opening the PR to refresh baselines if CI flags differences.
- **Spec adjustments:** —
