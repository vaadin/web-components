# BreadcrumbTrail Implementation Tasks

<!--
Ordered implementation tasks derived from web-component-spec.md. Each task is a self-contained unit of work following test-driven development: define tests first, then implement to make them pass. Each task results in a merge-ready branch.

Primary input: packages/breadcrumb-trail/spec/web-component-spec.md
API context: packages/breadcrumb-trail/spec/web-component-api.md
Traceability: packages/breadcrumb-trail/spec/requirements.md

Tasks are pointers into the spec, not a second copy of it. The spec sections field tells the implementer where to find the full details. Do not restate shadow DOM structures, property tables, or behavioral logic here.
-->

## Spec References

- [web-component-spec.md](web-component-spec.md)
- [requirements.md](requirements.md)
- [web-component-api.md](web-component-api.md)

---

## Task 1: Package scaffolding

**Spec sections:** Elements (intro for all three elements)
**Requirements:** —
**Depends on:** —

Create the `@vaadin/breadcrumb-trail` package with empty shells of all three elements (`<vaadin-breadcrumb-trail>`, `<vaadin-breadcrumb-item>`, `<vaadin-breadcrumb-trail-overlay>`) using the standard mixin chains called out in `WEB_COMPONENT_GUIDELINES.md`. Each element registers, has a `static get is()`, an empty `render()`, an empty base styles file, and matching `.d.ts` files. The container is wired up with the experimental feature flag (`breadcrumbTrailComponent`) per `@vaadin/component-base/src/define.js` so it requires `window.Vaadin.featureFlags.breadcrumbTrailComponent = true`. A smoke test confirms the elements register and render without errors.

**Files:**
- `packages/breadcrumb-trail/package.json` (create)
- `packages/breadcrumb-trail/LICENSE` (create — Apache 2.0)
- `packages/breadcrumb-trail/README.md` (create)
- `packages/breadcrumb-trail/vaadin-breadcrumb-trail.js` (create — root export)
- `packages/breadcrumb-trail/vaadin-breadcrumb-trail.d.ts` (create — root types)
- `packages/breadcrumb-trail/vaadin-breadcrumb-item.js` (create — root export)
- `packages/breadcrumb-trail/vaadin-breadcrumb-item.d.ts` (create — root types)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail.js` (create)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail.d.ts` (create)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail-mixin.js` (create — empty mixin shell)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail-mixin.d.ts` (create)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-item.js` (create)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-item.d.ts` (create)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail-overlay.js` (create)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail-overlay.d.ts` (create)
- `packages/breadcrumb-trail/src/styles/vaadin-breadcrumb-trail-base-styles.js` (create — empty `css\`\``)
- `packages/breadcrumb-trail/src/styles/vaadin-breadcrumb-trail-base-styles.d.ts` (create)
- `packages/breadcrumb-trail/src/styles/vaadin-breadcrumb-item-base-styles.js` (create — empty)
- `packages/breadcrumb-trail/src/styles/vaadin-breadcrumb-item-base-styles.d.ts` (create)
- `packages/breadcrumb-trail/src/styles/vaadin-breadcrumb-trail-overlay-base-styles.js` (create — empty)
- `packages/breadcrumb-trail/src/styles/vaadin-breadcrumb-trail-overlay-base-styles.d.ts` (create)
- `packages/breadcrumb-trail/test/breadcrumb-trail.test.ts` (create — smoke test)
- `packages/breadcrumb-trail/test/typings/breadcrumb-trail.types.ts` (create — empty type test)
- `packages/breadcrumb-trail/test/dom/` (create directory)
- `packages/breadcrumb-trail/test/visual/base/` (create directory)
- `packages/breadcrumb-trail/test/visual/lumo/` (create directory)
- `packages/breadcrumb-trail/test/visual/aura/` (create directory)

**Tests:**
- [ ] Without setting the feature flag, importing the package does not register `vaadin-breadcrumb-trail` (the registry returns `undefined`)
- [ ] After setting `window.Vaadin.featureFlags.breadcrumbTrailComponent = true`, all three tag names (`vaadin-breadcrumb-trail`, `vaadin-breadcrumb-item`, `vaadin-breadcrumb-trail-overlay`) are present in `customElements`
- [ ] Each element's `is` static getter equals its tag name
- [ ] Creating an empty `<vaadin-breadcrumb-trail>` and inserting it into the DOM does not throw

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 2: Add `--_vaadin-icon-chevron-right` to shared style props

**Spec sections:** Reuse and Proposed Adjustments → `style-props.js`
**Requirements:** 4
**Depends on:** —

Add the `--_vaadin-icon-chevron-right` CSS custom property to `packages/component-base/src/styles/style-props.js` next to the existing `--_vaadin-icon-chevron-down`. The breadcrumb's separator default reads this token; without it the chevron icon would not exist in the shared icon set.

**Files:**
- `packages/component-base/src/styles/style-props.js` (modify)
- `packages/component-base/test/style-props.test.js` (modify if it exists, otherwise add the assertion to an existing icon test there)

**Tests:**
- [ ] On any host that has the shared style-props applied, `getComputedStyle(host).getPropertyValue('--_vaadin-icon-chevron-right')` is a non-empty string starting with `url(`
- [ ] No existing icon tokens (e.g. `--_vaadin-icon-chevron-down`) are altered

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests in `packages/component-base` still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 3: Item link rendering and current state

**Spec sections:** `<vaadin-breadcrumb-item>` (Shadow DOM, Properties, Internal behavior — Link rendering, `aria-current="page"`)
**Requirements:** 1, 2, 11
**Depends on:** 1

Implement the item's render template: when `path` is set, render `<a href="${path}" part="link">` wrapping the label; when `path` is unset, render `<span part="current">` with the same inner structure. Apply `aria-current="page"` to the inner `<span part="current">` when the host carries the `current` state attribute (the parent sets/removes this attribute — see Task 7). Add `role="listitem"` on the host in `firstUpdated()`.

**Files:**
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-item.js` (modify)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-item.d.ts` (modify)
- `packages/breadcrumb-trail/test/breadcrumb-item.test.ts` (create)

**Tests:**
- [ ] With `path="/foo"`, the shadow DOM contains an `<a>` with `href="/foo"` and `part="link"`, and no element with `part="current"`
- [ ] With `path` unset, the shadow DOM contains a `<span part="current">` and no element with `part="link"`
- [ ] Setting `path` after the element is rendered switches the `<span part="current">` to an `<a part="link">` with the new href; clearing `path` switches it back
- [ ] The default slot's text content is wrapped in a `<span part="label">` in both cases
- [ ] Adding the `current` state attribute on the host adds `aria-current="page"` to the inner `<span part="current">`
- [ ] Removing the `current` state attribute removes `aria-current`
- [ ] The host has `role="listitem"`

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 4: Item prefix slot

**Spec sections:** `<vaadin-breadcrumb-item>` (Slots, Internal behavior — Prefix slot)
**Requirements:** 8
**Depends on:** 3

Add the `prefix` slot inside the item's link/span (before the label slot) and use a `SlotController` to toggle the `has-prefix` attribute on the host whenever the slot has assigned content.

**Files:**
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-item.js` (modify)
- `packages/breadcrumb-trail/test/breadcrumb-item.test.ts` (modify)

**Tests:**
- [ ] The shadow DOM contains a `<slot name="prefix">` placed before `[part="label"]` and inside `[part="link"]`
- [ ] An item with no prefix slot content does not have the `has-prefix` attribute
- [ ] Slotting a `<vaadin-icon slot="prefix">` (or any element with `slot="prefix"`) sets the `has-prefix` attribute on the host
- [ ] Removing the prefix-slotted child removes the `has-prefix` attribute

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 5: Item separator pseudo-element

**Spec sections:** `<vaadin-breadcrumb-item>` (Internal behavior — Separator rendering, RTL separator flip), CSS Custom Property table on `<vaadin-breadcrumb-trail>`
**Requirements:** 4, 5, 12
**Depends on:** 2, 3

Add a `:host::after` pseudo-element on `<vaadin-breadcrumb-item>` that renders the separator using the `mask-image` + `currentColor` pattern from button-base-styles. The mask-image reads `--vaadin-breadcrumb-trail-separator`, which defaults to `var(--_vaadin-icon-chevron-right)`. Hide the separator on the last item (`:host(:last-of-type)::after`) and on the current item (`:host([current])::after`). Flip the icon in RTL with `transform: scaleX(-1)`. The separator has no text content — it is decorative and not announced.

**Files:**
- `packages/breadcrumb-trail/src/styles/vaadin-breadcrumb-item-base-styles.js` (modify)
- `packages/breadcrumb-trail/test/breadcrumb-item.test.ts` (modify)

**Tests:**
- [ ] On a non-last item, `getComputedStyle(item, '::after')` reports a non-`none` `mask-image` and non-`none` `display`
- [ ] On a `:last-of-type` item, the `::after` has `display: none`
- [ ] On an item with the `current` attribute, the `::after` has `display: none`
- [ ] Setting `--vaadin-breadcrumb-trail-separator: url(...)` on the host changes the `mask-image` of `::after` to the new URL
- [ ] Inside a `dir="rtl"` ancestor, the `::after` has a transform that includes `scaleX(-1)` (or matrix equivalent with negative x scale)

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:css` passes
- [ ] `yarn lint:types` passes

---

## Task 6: Container shadow DOM and root-slot routing

**Spec sections:** `<vaadin-breadcrumb-trail>` (Shadow DOM, Slots, Parts, Internal behavior — Slot observation and root assignment)
**Requirements:** 1, 10
**Depends on:** 1, 3

Implement the container's shadow DOM (the `[role="list"]` wrapper, the `root` slot, the `[part="overflow"]` listitem with its hidden button, and the default slot — see the spec for the exact shape). Set `role="navigation"` on the host in `firstUpdated()`. Subclass `SlotController` (overriding `initNode`/`initCustomNode`) to assign `slot="root"` to the first `<vaadin-breadcrumb-item>` light-DOM child and remove `slot` from any prior holder when the children change. Do not yet wire overflow detection or current-item detection — those are Tasks 7 and 8.

**Files:**
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail.js` (modify)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail.d.ts` (modify)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail-mixin.js` (modify)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail-mixin.d.ts` (modify)
- `packages/breadcrumb-trail/test/breadcrumb-trail.test.ts` (modify)

**Tests:**
- [ ] The host has `role="navigation"` after `firstUpdated`
- [ ] The shadow DOM contains a `[part="list"][role="list"]` wrapper containing, in order: `<slot name="root">`, `[part="overflow"]` (hidden, with `<button part="overflow-button" aria-haspopup="true" aria-expanded="false">` inside), `<slot>` (default)
- [ ] Initially the first `<vaadin-breadcrumb-item>` child receives `slot="root"`; later items have no `slot` attribute
- [ ] Prepending a new item to the start moves `slot="root"` from the old first to the new first
- [ ] Removing the first item reassigns `slot="root"` to the new first
- [ ] Non-`<vaadin-breadcrumb-item>` light-DOM children (e.g. a `<span>`) do not receive `slot="root"`

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 7: Container current-item detection

**Spec sections:** Key Design Decisions §3, `<vaadin-breadcrumb-trail>` (Internal behavior — Slot observation and root assignment, last paragraph re: current state)
**Requirements:** 2, 3, 11
**Depends on:** 6

When the slotted children change, the container must add the `current` state attribute to the last `<vaadin-breadcrumb-item>` if and only if it has no `path` attribute. Items that previously held `current` lose it. When all items have a `path` (current page omitted, requirement 3), no item ends up with `current`. This drives the `aria-current="page"` behavior already implemented in Task 3.

**Files:**
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail-mixin.js` (modify)
- `packages/breadcrumb-trail/test/breadcrumb-trail.test.ts` (modify)

**Tests:**
- [ ] Given items where the last has no `path`, the last item has the `current` attribute and no other item does
- [ ] Given items where every item has a `path`, no item has the `current` attribute
- [ ] Removing `path` from the last item in a "current page omitted" trail adds `current` to it
- [ ] Adding `path` to the previously current last item removes `current` from it
- [ ] Appending a new last item (with no `path`) moves `current` from the previous last to the new last
- [ ] The current item's inner `<span part="current">` carries `aria-current="page"` (regression check for the integration with Task 3)

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 8: Container overflow detection via `ResizeMixin`

**Spec sections:** Key Design Decisions §6, `<vaadin-breadcrumb-trail>` (Properties / State attribute / Parts — `has-overflow`, `overflow`, `overflow-button`, Internal behavior — Overflow detection)
**Requirements:** 6
**Depends on:** 6, 7

Apply `ResizeMixin` to the container. On resize and on slot changes, measure whether the items fit. When they do not, progressively hide intermediate items by setting `data-overflow-hidden` on each, starting from the item closest to the root (first default-slot item). The root collapses last, and the current item never collapses. While any item is hidden, set the `has-overflow` attribute on the host and unhide the `[part="overflow"]` element. When everything fits again, clear `has-overflow`, hide the overflow element, and remove `data-overflow-hidden` from all items.

**Files:**
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail-mixin.js` (modify)
- `packages/breadcrumb-trail/src/styles/vaadin-breadcrumb-trail-base-styles.js` (modify — `:host(:not([has-overflow])) [part='overflow'] { display: none }`, `[data-overflow-hidden] { display: none }`)
- `packages/breadcrumb-trail/test/breadcrumb-trail.test.ts` (modify)

**Tests:**
- [ ] In a wide container that fits all items, `has-overflow` is not set and `[part="overflow"]` has computed `display: none`
- [ ] Shrinking the container (`element.style.width = '...'` then awaiting `nextResize`) so two items overflow sets `has-overflow` and assigns `data-overflow-hidden` to exactly the two items closest to the root, identified by their declared `data-index` (or equivalent semantic marker — not by DOM position alone)
- [ ] The current item never receives `data-overflow-hidden` even at the smallest width
- [ ] At the smallest width that still fits "root + overflow + current", the root remains visible
- [ ] At a width too narrow even for that, the root also receives `data-overflow-hidden`
- [ ] Growing the container back removes `data-overflow-hidden` from items in reverse order until they all fit again, at which point `has-overflow` is removed
- [ ] When `has-overflow` is set, the `[part="overflow"]` element is visible (not `display: none`)

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 9: Container overflow separator pseudo-element

**Spec sections:** `<vaadin-breadcrumb-trail>` (Internal behavior — Overflow separator)
**Requirements:** 4, 12
**Depends on:** 2, 8

Render `[part="overflow"]::after` using the same `mask-image` + `currentColor` + `--vaadin-breadcrumb-trail-separator` pattern used on `<vaadin-breadcrumb-item>::after` (Task 5), with the same `transform: scaleX(-1)` flip in RTL. Because the overflow element is hidden when `has-overflow` is unset, the separator is implicitly hidden then too — no additional rule is needed.

**Files:**
- `packages/breadcrumb-trail/src/styles/vaadin-breadcrumb-trail-base-styles.js` (modify)
- `packages/breadcrumb-trail/test/breadcrumb-trail.test.ts` (modify)

**Tests:**
- [ ] When `has-overflow` is set, `getComputedStyle(overflowEl, '::after')` reports a non-`none` `mask-image` matching the configured `--vaadin-breadcrumb-trail-separator`
- [ ] When `has-overflow` is not set, the overflow element itself is `display: none`, so the pseudo-separator is not laid out
- [ ] Inside a `dir="rtl"` ancestor, the overflow `::after` transform includes `scaleX(-1)`
- [ ] Overriding `--vaadin-breadcrumb-trail-separator` on the host updates the `mask-image` of the overflow `::after`

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:css` passes
- [ ] `yarn lint:types` passes

---

## Task 10: `<vaadin-breadcrumb-trail-overlay>` element and `BreadcrumbTrailOverlayMixin`

**Spec sections:** `<vaadin-breadcrumb-trail-overlay>` (full section, including Shadow DOM and Internal behavior)
**Requirements:** 7
**Depends on:** 1

Build the `<vaadin-breadcrumb-trail-overlay>` element on top of `OverlayMixin` (from `@vaadin/overlay/src/vaadin-overlay-mixin.js`) plus a new `BreadcrumbTrailOverlayMixin` that holds any breadcrumb-specific overlay tweaks (mirrors how `<vaadin-combo-box-overlay>` pairs `OverlayMixin` with `ComboBoxOverlayMixin`). Render the standard `[part="overlay"]` / `[part="content"]` shadow structure with a default slot inside content. The element exposes no public properties of its own — it inherits `opened`, `owner`, `renderer`, and `positionTarget` from `OverlayMixin`.

**Files:**
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail-overlay.js` (modify)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail-overlay.d.ts` (modify)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail-overlay-mixin.js` (create — `BreadcrumbTrailOverlayMixin`)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail-overlay-mixin.d.ts` (create)
- `packages/breadcrumb-trail/src/styles/vaadin-breadcrumb-trail-overlay-base-styles.js` (modify — minimal structural rules; theme polish later)
- `packages/breadcrumb-trail/test/breadcrumb-trail-overlay.test.ts` (create)

**Tests:**
- [ ] `customElements.get('vaadin-breadcrumb-trail-overlay')` returns a class
- [ ] Its shadow DOM contains a `[part="overlay"]` wrapping a `[part="content"]` wrapping a default `<slot>`
- [ ] After `firstUpdated`, the host has the `popover` attribute (provided by `OverlayMixin`)
- [ ] Setting `opened = true` on a connected overlay shows it (`opened` attribute reflects, the overlay is in the top layer / `:popover-open`)
- [ ] Setting `opened = false` again hides it
- [ ] `BreadcrumbTrailOverlayMixin` is in the element's class hierarchy (e.g. an `instanceof`-style check via a marker exposed by the mixin, or by reading the prototype chain)

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 11: Container overlay integration and `i18n.moreItems`

**Spec sections:** Key Design Decisions §6, `<vaadin-breadcrumb-trail>` (Shadow DOM — `<vaadin-breadcrumb-trail-overlay>` block, Properties — `i18n`, Internal behavior — Overlay management)
**Requirements:** 6, 7
**Depends on:** 8, 10

Render `<vaadin-breadcrumb-trail-overlay>` directly in the container's shadow DOM with `.owner`, `.opened`, `.renderer`, and `.positionTarget` bound to the host's state and the overflow button (also pass `exportparts="overlay, content"` so themes can target both via `vaadin-breadcrumb-trail-overlay::part(...)`; project a `<slot name="overlay">` inside it for consistency with other overlay hosts). Clicking the overflow button toggles `_overlayOpened`. The `renderer` writes one navigable link into `[part="content"]` per currently hidden item, in original DOM order, using each item's `path` as href and its text content as the link label. Apply `I18nMixin` with the `i18n` object containing `moreItems` (default `''`); bind it to the overflow button's `aria-label`. Keep `aria-haspopup="true"` and update `aria-expanded` on the overflow button to reflect open/closed.

**Files:**
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail.js` (modify)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail-mixin.js` (modify)
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail-mixin.d.ts` (modify)
- `packages/breadcrumb-trail/test/breadcrumb-trail.test.ts` (modify)

**Tests:**
- [ ] In the initial closed state, the overflow button has `aria-expanded="false"` and the overlay's `opened` is `false`
- [ ] Clicking the overflow button (when `has-overflow` is set) sets `aria-expanded="true"` and opens the overlay
- [ ] Clicking the overflow button again closes the overlay and restores `aria-expanded="false"`
- [ ] Once opened, the overlay's `[part="content"]` contains exactly one anchor per hidden item, with `href` matching the item's `path` and link text matching the item's text content
- [ ] Pressing Escape while the overlay is open closes it (delegated to `OverlayMixin`) and `aria-expanded` returns to `"false"`
- [ ] Outside-click while open closes the overlay (delegated to `OverlayMixin`)
- [ ] By default `i18n.moreItems` is `''` and the overflow button has `aria-label=""`; setting `breadcrumb.i18n = { moreItems: 'Show hidden' }` updates the overflow button's `aria-label` to `'Show hidden'`

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 12: Accessibility verification

**Spec sections:** Key Design Decisions §7, §8; `<vaadin-breadcrumb-trail>` (host role, `role="list"` wrapper, overflow button ARIA); `<vaadin-breadcrumb-item>` (host role, `aria-current`)
**Requirements:** 10, 11
**Depends on:** 7, 11

Add an end-to-end accessibility test suite that verifies all the ARIA pieces work together once the container is fully assembled. No new behavior to implement — this task locks down the expected screen-reader shape so future regressions are caught. Confirm the navigation landmark accepts an `aria-label` from the application without the component overwriting it.

**Files:**
- `packages/breadcrumb-trail/test/breadcrumb-trail-a11y.test.ts` (create)

**Tests:**
- [ ] `<vaadin-breadcrumb-trail>` host has `role="navigation"` and an application-supplied `aria-label` on the host is preserved (the component does not set or overwrite it)
- [ ] The shadow `[part="list"]` element has `role="list"`
- [ ] Each slotted `<vaadin-breadcrumb-item>` has `role="listitem"`
- [ ] In a trail whose last item has no `path`, the inner link/span of that item has `aria-current="page"` and no other item does
- [ ] The overflow button has `aria-haspopup="true"`, an `aria-label` driven by `i18n.moreItems`, and `aria-expanded` that toggles between `"false"` and `"true"` as the overlay opens and closes
- [ ] The separator pseudo-elements have no rendered text content (their `content` is empty / not announced)

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 13: Keyboard interaction verification

**Spec sections:** `<vaadin-breadcrumb-trail>` (Internal behavior — Overlay management); `<vaadin-breadcrumb-trail-overlay>` (Internal behavior — Keyboard interaction within the open overlay); `<vaadin-breadcrumb-item>` (Link rendering)
**Requirements:** 1, 7
**Depends on:** 11

Add a keyboard interaction test suite. The trail itself uses native focus order (the overflow button is a `<button>` so Enter/Space activate it natively, and Escape on the overlay is provided by `OverlayMixin`), but the open overlay needs explicit support for menu-style arrow-key navigation alongside the linear Tab cycle (requirement 7). This task implements the arrow-key handler and verifies the full keyboard contract end to end.

**Files:**
- `packages/breadcrumb-trail/src/vaadin-breadcrumb-trail-overlay-mixin.js` (modify — add arrow-key keyboard handler on the open overlay)
- `packages/breadcrumb-trail/test/breadcrumb-trail-keyboard.test.ts` (create)

**Tests:**

Trail-level Tab navigation:
- [ ] With `has-overflow` set and focus on the document body, pressing Tab moves focus to the root item's inner `<a>`, then to the overflow button, then to each subsequent visible item's inner `<a>` in DOM order
- [ ] Items hidden via `data-overflow-hidden` are skipped in the Tab cycle
- [ ] The current item's inner `<span part="current">` (no `path`) is not in the Tab cycle

Overflow button activation:
- [ ] Focusing the overflow button and pressing Enter opens the overlay; pressing Space also opens it
- [ ] Pressing Escape while the overlay is open closes it and returns focus to the overflow button

Open-overlay keyboard navigation (requirement 7):
- [ ] Tab cycles through the overlay's links in DOM order, like any anchor on the page; Tab from the last overlay link continues out into the rest of the page (no focus trap)
- [ ] Pressing Down arrow with focus on the overflow button (or anywhere inside the overlay) moves focus to the next link inside the overlay
- [ ] Pressing Up arrow moves focus to the previous link inside the overlay
- [ ] Home / End jump to the first / last link inside the overlay
- [ ] Arrow navigation does not wrap (Down on the last link is a no-op, Up on the first is a no-op)

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 14: RTL verification

**Spec sections:** `<vaadin-breadcrumb-item>` (Internal behavior — RTL separator flip); `<vaadin-breadcrumb-trail>` (Internal behavior — Overflow separator)
**Requirements:** 12
**Depends on:** 5, 9, 11

Add an RTL test suite verifying that the breadcrumb is usable in `dir="rtl"` contexts: separators flip via `transform: scaleX(-1)` (already implemented in Tasks 5 and 10 — re-verify in an integrated trail), the visual / DOM / focus order all match (root on the right, current on the left, overflow between them), and the base styles use logical CSS properties (no physical `margin-left` / `padding-right` etc. that would not flip).

**Files:**
- `packages/breadcrumb-trail/test/breadcrumb-trail-rtl.test.ts` (create)
- `packages/breadcrumb-trail/src/styles/vaadin-breadcrumb-trail-base-styles.js` (modify if needed to switch any physical properties to logical equivalents)
- `packages/breadcrumb-trail/src/styles/vaadin-breadcrumb-item-base-styles.js` (modify if needed)

**Tests:**
- [ ] Inside `dir="rtl"`, every item's `::after` and the overflow `::after` have a transform whose `a` (x-scale) component is `-1`
- [ ] Inside `dir="rtl"`, the visual rect of the root item is to the right of the visual rect of the current item (`getBoundingClientRect().left` of the root is greater than that of the current item)
- [ ] Inside `dir="rtl"` with overflow active, the overflow button sits visually between the root and the next visible item
- [ ] Tab order in RTL is unchanged (still root → overflow → rest, in DOM order — focus mirrors visual order automatically because DOM order does)
- [ ] No rule in the base-styles files uses `margin-left`, `margin-right`, `padding-left`, `padding-right`, `left`, or `right` (logical equivalents only)

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:css` passes
- [ ] `yarn lint:types` passes

---

## Task 15: Base styles completion and base visual tests

**Spec sections:** `<vaadin-breadcrumb-trail>` (Parts, State attributes, CSS Custom Property), `<vaadin-breadcrumb-item>` (Parts, State attributes), `<vaadin-breadcrumb-trail-overlay>` (Parts)
**Requirements:** 1, 2, 4, 6, 8
**Depends on:** 5, 8, 9, 10

Round out the structural base styles for all three elements: `:host` defaults (display, flex layout for the container, alignment for items), `:host([hidden])` rules, hookups for every shadow part, state-attribute selectors (`:host([disabled])` where applicable to the overflow button, `:host([has-overflow])`, `:host([current])`, `:host([has-prefix])`), forced-colors mode rules so separator/icons remain visible in high-contrast, and ensure every CSS custom property declared in the spec is wired up with a sensible fallback. Add a base-styles visual test suite that captures the unstyled baseline for the breadcrumb, item with/without prefix, and an overflow state.

**Files:**
- `packages/breadcrumb-trail/src/styles/vaadin-breadcrumb-trail-base-styles.js` (modify)
- `packages/breadcrumb-trail/src/styles/vaadin-breadcrumb-item-base-styles.js` (modify)
- `packages/breadcrumb-trail/src/styles/vaadin-breadcrumb-trail-overlay-base-styles.js` (modify)
- `packages/breadcrumb-trail/test/visual/base/breadcrumb-trail.test.js` (create)

**Tests:**
- [ ] Visual baseline: a basic three-item breadcrumb (`Home / Docs / OAuth2`) renders with separators and current-item styling
- [ ] Visual baseline: an item with a `<vaadin-icon slot="prefix">` renders the icon before the label
- [ ] Visual baseline: a long trail in a constrained-width container renders with the overflow button and only the surviving items (`has-overflow` set)
- [ ] Visual baseline: forced-colors mode renders the breadcrumb with separators and overflow button visible
- [ ] Visual baseline: applying a custom `--vaadin-breadcrumb-trail-separator` (e.g. a slash icon) changes the separator across all items and the overflow

**Acceptance criteria:**
- [ ] All new tests pass (visual snapshots produced/accepted)
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:css` passes
- [ ] `yarn lint:types` passes

---

## Task 16: Lumo theme

**Spec sections:** `<vaadin-breadcrumb-trail>` (Parts, CSS Custom Property), `<vaadin-breadcrumb-item>` (Parts, State attributes), `<vaadin-breadcrumb-trail-overlay>` (Parts)
**Requirements:** 1, 2, 4, 6
**Depends on:** 15

Author Lumo styles for all three elements: container layout/spacing, item link colors and hover/focus appearance, current-item style (de-emphasized, non-interactive feel), separator color via Lumo tokens, overflow button styling matching Lumo button conventions, and overlay styling matching the panels used by combo-box / menu-bar overlays. Wrap implementation styles in `@media lumo_components_breadcrumb` (and matching `lumo_components_breadcrumb_item`, `lumo_components_breadcrumb_overlay` if separated) and add the matching public CSS files with injection markers. Add a Lumo visual test suite.

**Files:**
- `packages/vaadin-lumo-styles/components/breadcrumb.css` (create)
- `packages/vaadin-lumo-styles/components/breadcrumb-item.css` (create)
- `packages/vaadin-lumo-styles/components/breadcrumb-overlay.css` (create)
- `packages/vaadin-lumo-styles/src/components/breadcrumb.css` (create)
- `packages/vaadin-lumo-styles/src/components/breadcrumb-item.css` (create)
- `packages/vaadin-lumo-styles/src/components/breadcrumb-overlay.css` (create)
- `packages/breadcrumb-trail/test/visual/lumo/breadcrumb-trail.test.js` (create)

**Tests:**
- [ ] Lumo visual baseline: basic three-item trail renders with Lumo typography, link color, and chevron separator
- [ ] Lumo visual baseline: current item is visually distinct from links (different color/weight, not underlined)
- [ ] Lumo visual baseline: item link hover state
- [ ] Lumo visual baseline: item link `focus-ring` state
- [ ] Lumo visual baseline: overflow state with the overflow button rendered between root and current
- [ ] Lumo visual baseline: overflow overlay opened, showing hidden items as links
- [ ] Lumo visual baseline: item with prefix icon

**Acceptance criteria:**
- [ ] All new visual tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:css` passes
- [ ] `yarn lint:types` passes

---

## Task 17: Aura theme

**Spec sections:** `<vaadin-breadcrumb-trail>` (Parts, CSS Custom Property), `<vaadin-breadcrumb-item>` (Parts, State attributes), `<vaadin-breadcrumb-trail-overlay>` (Parts)
**Requirements:** 1, 2, 4, 6
**Depends on:** 15

Author Aura styles for all three elements using Aura's modern CSS conventions (`:is()`, `:where()`, `light-dark()`, `oklch()` where appropriate). Cover the same surface as the Lumo task: container, items (link / current / hover / focus), prefix icon spacing, overflow button, overlay panel. Import each new file in `packages/aura/aura.css`. Add an Aura visual test suite.

**Files:**
- `packages/aura/src/components/breadcrumb.css` (create)
- `packages/aura/src/components/breadcrumb-item.css` (create)
- `packages/aura/src/components/breadcrumb-overlay.css` (create)
- `packages/aura/aura.css` (modify — `@import` the three new files)
- `packages/breadcrumb-trail/test/visual/aura/breadcrumb-trail.test.js` (create)

**Tests:**
- [ ] Aura visual baseline: basic three-item trail with Aura typography and chevron separator
- [ ] Aura visual baseline: current item visually distinct from links
- [ ] Aura visual baseline: item link hover state
- [ ] Aura visual baseline: item link `focus-ring` state
- [ ] Aura visual baseline: overflow state with overflow button visible
- [ ] Aura visual baseline: overflow overlay opened
- [ ] Aura visual baseline: item with prefix icon
- [ ] Aura visual baseline: dark mode (via `light-dark()`)

**Acceptance criteria:**
- [ ] All new visual tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:css` passes
- [ ] `yarn lint:types` passes

---

## Task 18: Dev page, snapshots, type tests, final validation

**Spec sections:** All
**Requirements:** All
**Depends on:** 11, 16, 17

Add the dev page in `dev/breadcrumb.html` with all major variants (declarative, with icons, in a resizable container so the overflow can be exercised manually, current-page omitted, custom separator, RTL). Add DOM snapshot tests for the host shadow DOM in default and key states (basic, with overflow, with current item). Flesh out the TypeScript type tests so every public property is exercised. Run the full validation suite for the package.

**Files:**
- `dev/breadcrumb.html` (create — wrap overflow examples in `resize: horizontal; overflow: hidden` per `WEB_COMPONENT_GUIDELINES.md`)
- `packages/breadcrumb-trail/test/dom/breadcrumb-trail.test.js` (create)
- `packages/breadcrumb-trail/test/dom/breadcrumb-item.test.js` (create)
- `packages/breadcrumb-trail/test/dom/breadcrumb-trail-overlay.test.js` (create)
- `packages/breadcrumb-trail/test/typings/breadcrumb-trail.types.ts` (modify — assert `i18n.moreItems`, `path` on item, event types)

**Tests:**
- [ ] DOM snapshot: `<vaadin-breadcrumb-trail>` shadow DOM in the default state
- [ ] DOM snapshot: `<vaadin-breadcrumb-trail>` shadow DOM with `has-overflow` set
- [ ] DOM snapshot: `<vaadin-breadcrumb-item>` shadow DOM with `path` set (`part="link"` element present)
- [ ] DOM snapshot: `<vaadin-breadcrumb-item>` shadow DOM without `path` and with `current` set (`part="current"` element present, `aria-current="page"`)
- [ ] DOM snapshot: `<vaadin-breadcrumb-item>` shadow DOM with prefix slot content
- [ ] DOM snapshot: `<vaadin-breadcrumb-trail-overlay>` shadow DOM
- [ ] Type test: `<vaadin-breadcrumb-trail>` exposes `i18n` typed as `{ moreItems?: string }` (and no `items` property)
- [ ] Type test: `<vaadin-breadcrumb-item>` exposes `path` typed as `string | null | undefined`
- [ ] Dev page loads in both Lumo and Aura without console errors and exposes the overflow / RTL variants

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes
- [ ] `yarn test --group breadcrumb` passes
- [ ] `yarn test:snapshots --group breadcrumb` passes
- [ ] `yarn test:base --group breadcrumb` passes
- [ ] `yarn test:lumo --group breadcrumb` passes
- [ ] `yarn test:aura --group breadcrumb` passes
