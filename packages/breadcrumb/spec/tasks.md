# Breadcrumb Implementation Tasks

<!--
Ordered implementation tasks derived from spec.md. Each task is a self-contained unit of work following test-driven development: define tests first, then implement to make them pass. Each task results in a merge-ready branch.

Primary input: packages/breadcrumb/spec/spec.md
API context: packages/breadcrumb/spec/developer-api.md
Traceability: packages/breadcrumb/spec/requirements.md

Tasks are pointers into the spec, not a second copy of it. The spec sections field tells the implementer where to find the full details. Do not restate shadow DOM structures, property tables, or behavioral logic here.

Each task:
- Has a short descriptive title
- References spec sections and requirements (the implementer reads the spec for details)
- Lists explicit dependencies on prior tasks (enables parallel work)
- Lists files to create or modify (full paths from repo root)
- Defines test assertions (observable behavior, not implementation details)
- Includes acceptance criteria (tests pass, lint clean, types compile)

Tasks are organized in phases:
1. Scaffolding — package setup, element shells, smoke tests
2. Core features — one per feature with unit tests
3. Cross-cutting — accessibility, keyboard, RTL with tests
4. Styling — base styles, Lumo, Aura with visual tests
5. Integration — dev page, snapshots, type tests, final validation

Do NOT reorder tasks without verifying the dependency graph.
Do NOT add tasks for features not in the spec.
-->

## Spec References

- [spec.md](spec.md)
- [requirements.md](requirements.md)
- [developer-api.md](developer-api.md)

---

## Phase 1 — Scaffolding

## Task 1: Package scaffolding and element registration

**Spec sections:** Elements (all three element definitions — mixin chains, `static get is()`, `static get styles()`)
**Requirements:** —
**Depends on:** —

Create the `@vaadin/breadcrumb` package with all directory structure, configuration files, root exports, source file shells, TypeScript definitions, and base style files. Each element class (`Breadcrumb`, `BreadcrumbItem`, `BreadcrumbOverlay`) should have the correct mixin chain from the spec, an empty `render()` returning a basic `<slot>`, `static get is()`, and `static get styles()`. Include the experimental feature flag (`window.Vaadin.featureFlags.breadcrumbComponent`) using the pattern from `@vaadin/component-base/src/define.js`. The goal is a clean package that registers all three custom elements and passes `yarn lint` and `yarn lint:types`.

**Files:**
- `packages/breadcrumb/package.json` (create)
- `packages/breadcrumb/LICENSE` (create)
- `packages/breadcrumb/README.md` (create)
- `packages/breadcrumb/vaadin-breadcrumb.js` (create)
- `packages/breadcrumb/vaadin-breadcrumb.d.ts` (create)
- `packages/breadcrumb/vaadin-breadcrumb-item.js` (create)
- `packages/breadcrumb/vaadin-breadcrumb-item.d.ts` (create)
- `packages/breadcrumb/src/vaadin-breadcrumb.js` (create)
- `packages/breadcrumb/src/vaadin-breadcrumb.d.ts` (create)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (create)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.d.ts` (create)
- `packages/breadcrumb/src/vaadin-breadcrumb-item.js` (create)
- `packages/breadcrumb/src/vaadin-breadcrumb-item.d.ts` (create)
- `packages/breadcrumb/src/vaadin-breadcrumb-overlay.js` (create)
- `packages/breadcrumb/src/vaadin-breadcrumb-overlay.d.ts` (create)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.js` (create)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.d.ts` (create)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.js` (create)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.d.ts` (create)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-overlay-base-styles.js` (create)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-overlay-base-styles.d.ts` (create)
- `packages/breadcrumb/test/breadcrumb.test.ts` (create)

**Tests:**
- [ ] `vaadin-breadcrumb` is defined in the custom element registry
- [ ] `vaadin-breadcrumb` has a valid `static get is()` returning `'vaadin-breadcrumb'`
- [ ] `vaadin-breadcrumb-item` is defined in the custom element registry
- [ ] `vaadin-breadcrumb-item` has a valid `static get is()` returning `'vaadin-breadcrumb-item'`
- [ ] `vaadin-breadcrumb-overlay` is defined in the custom element registry
- [ ] Each element renders a shadow root without errors

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Phase 2 — Core Features

## Task 2: BreadcrumbItem — path property and link rendering

**Spec sections:** `<vaadin-breadcrumb-item>` element definition (properties table, shadow DOM), Internal Behavior > Link rendering
**Requirements:** 1, 2, 8, 13
**Depends on:** 1

Implement the `path`, `disabled`, and `current` properties on `<vaadin-breadcrumb-item>` and the link rendering logic described in the spec's "Link rendering" section. The item's `render()` should produce the `<a part="link">` element with computed `href` and `tabindex` based on the `path`/`current`/`disabled` state matrix. Use `DisabledMixin` from `@vaadin/a11y-base/src/disabled-mixin.js` as specified in the Reuse section. The `current` property is read-only (set by the container via `_setCurrent()`); include the `_setCurrent()` protected method. Add structural CSS for the link element in the item base styles.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-item.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-item.d.ts` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.js` (modify)
- `packages/breadcrumb/test/breadcrumb-item.test.ts` (create)

**Tests:**
- [ ] When `path` is set and item is not current or disabled, the internal `<a>` has `href` equal to the `path` value
- [ ] When `path` is set and item is not current or disabled, the internal `<a>` has `tabindex="0"` (interactive link)
- [ ] When `current` is `true`, the internal `<a>` has no `href` attribute and no `tabindex` (non-interactive)
- [ ] When `disabled` is `true`, the internal `<a>` has no `href` and has `tabindex="-1"`
- [ ] When `path` is `undefined`, the internal `<a>` has no `href` and no `tabindex` (non-interactive text)
- [ ] The `disabled` attribute is reflected to the host element
- [ ] The `current` attribute is reflected to the host element and is read-only (cannot be set directly)
- [ ] Calling `_setCurrent(true)` sets `current` to `true` and `_setCurrent(false)` sets it to `false`
- [ ] The default slot projects content inside the `<a part="link">` element

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 3: BreadcrumbItem — separator rendering

**Spec sections:** `<vaadin-breadcrumb-item>` shadow DOM (separator region), Internal Behavior > Separator rendering
**Requirements:** 4, 5
**Depends on:** 1

Add the separator region to the item's shadow DOM as described in the spec: a `<span part="separator">` rendered before the link, containing the default chevron character (`›`). Implement the `_customSeparator` protected property that, when set, replaces the default chevron with a cloned DOM node. When the container sets the `first` attribute on the item, the separator is hidden via CSS. Add structural CSS for the separator in the item base styles.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-item.js` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.js` (modify)
- `packages/breadcrumb/test/breadcrumb-item.test.ts` (modify)

**Tests:**
- [ ] The item renders a `<span part="separator">` containing the default chevron character before the link
- [ ] When `_customSeparator` is set with a DOM node, that node replaces the default chevron in the separator region
- [ ] When the `first` attribute is set on the item, the separator is not visible (`display: none`)
- [ ] When the `first` attribute is removed, the separator becomes visible again
- [ ] The separator has `aria-hidden="true"`

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 4: BreadcrumbItem — truncation and tooltip

**Spec sections:** `<vaadin-breadcrumb-item>` properties table (`--vaadin-breadcrumb-item-max-width`), slots table (`tooltip`), Internal Behavior > Truncation and tooltip
**Requirements:** 7
**Depends on:** 2

Implement text truncation on the link element using CSS (`overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`, `max-width: var(--vaadin-breadcrumb-item-max-width, 12em)`) as described in the spec. Add a `ResizeObserver` on the link element that compares `scrollWidth` to `clientWidth`; when truncated, set the `title` attribute on the link to the item's full text content; when not truncated, remove `title`. Add the `tooltip` slot and integrate `TooltipController` from `@vaadin/component-base/src/tooltip-controller.js` as specified in the Reuse section.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-item.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-item.d.ts` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.js` (modify)
- `packages/breadcrumb/test/breadcrumb-item.test.ts` (modify)

**Tests:**
- [ ] The link element has CSS `text-overflow: ellipsis` and `overflow: hidden`
- [ ] When the item's text exceeds `--vaadin-breadcrumb-item-max-width`, the link element's `title` attribute is set to the full text
- [ ] When the item's text fits within the max width, the link element has no `title` attribute
- [ ] The item renders a `<slot name="tooltip">` for optional `<vaadin-tooltip>` integration
- [ ] `TooltipController` is initialized and manages the tooltip slot

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 5: Breadcrumb — child observation and current-item detection

**Spec sections:** `<vaadin-breadcrumb>` shadow DOM (normal mode — list container and default slot), properties table (`location`), Internal Behavior > Child observation, Internal Behavior > Current-item detection, Reuse item 1 (`matchPaths`), Reuse item 3 (`SlotController`), Reuse item 8 (location facade)
**Requirements:** 2, 3, 9, 15
**Depends on:** 2

Build the container's core shadow DOM structure: a `<div part="list" role="list">` wrapping a `<slot>` for items. Use `SlotController` with `{ observe: true, multiple: true }` on the default slot to track `<vaadin-breadcrumb-item>` children as described in the spec's "Child observation" section. Implement the current-item detection algorithm (the three-step priority: no-path item → `matchPaths()` match → no current) and the `location` property that triggers re-evaluation. Create `packages/breadcrumb/src/location.js` as a testability facade following the `vaadin-side-nav` pattern described in Reuse item 8. Listen to `popstate` and `vaadin-navigated` window events for automatic updates.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.d.ts` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.d.ts` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.js` (modify)
- `packages/breadcrumb/src/location.js` (create)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] The container renders a `<div part="list" role="list">` containing a `<slot>`
- [ ] When an item has no `path`, it is marked as current (`current === true`) and all other items are not current
- [ ] When all items have a `path`, the last item whose `path` matches the browser URL is marked as current
- [ ] When no item matches the browser URL and all items have a `path`, no item is marked as current
- [ ] Setting the `location` property triggers re-evaluation of the current item
- [ ] The container re-evaluates the current item on `popstate` window events
- [ ] The container re-evaluates the current item on `vaadin-navigated` window events
- [ ] When items are dynamically added or removed, the container updates current-item detection

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 6: Breadcrumb — separator distribution

**Spec sections:** `<vaadin-breadcrumb>` shadow DOM (separator slot), slots table (`separator`), Internal Behavior > Separator distribution
**Requirements:** 4, 5
**Depends on:** 3, 5

Add the `separator` named slot to the container's shadow DOM (wrapped in a hidden `aria-hidden="true"` container as shown in the spec). Observe the separator slot; when a custom separator element is present, clone it for each item and set each item's `_customSeparator` property. When the separator slot is empty, items use their default chevron. Set the `first` attribute on the first visible item so its separator is hidden. When items change, re-distribute separators.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.js` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] When no custom separator is provided, items use the default chevron
- [ ] When a custom separator element is slotted (e.g., `<span slot="separator">/</span>`), each item renders the custom separator instead of the default chevron
- [ ] The first item has the `first` attribute set and its separator is hidden
- [ ] When items are reordered, the `first` attribute moves to the new first item
- [ ] The separator slot container has `aria-hidden="true"`
- [ ] When the custom separator is removed from the slot, items revert to the default chevron

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 7: Breadcrumb — `items` property

**Spec sections:** `<vaadin-breadcrumb>` properties table (`items`), Internal Behavior > `items` property
**Requirements:** 1, 15
**Depends on:** 5

Implement the `items` property on the container as described in the spec. When set to an array of `{label, path?, disabled?}` objects, generate `<vaadin-breadcrumb-item>` elements in light DOM with `data-breadcrumb-generated` attribute, `path`, `disabled`, and `textContent` set from each entry. Previously generated items are removed before generating new ones. When set to `null` or `undefined`, all generated items are removed. Generated items should be observed by the existing child observation logic from Task 5.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.d.ts` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.d.ts` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] Setting `items` to an array generates `<vaadin-breadcrumb-item>` children in light DOM with correct `textContent` and `path`
- [ ] Generated items have the `data-breadcrumb-generated` attribute
- [ ] Items with `disabled: true` in the array produce items with the `disabled` attribute
- [ ] Items without a `path` in the array produce items without a `path` property (treated as current page)
- [ ] Setting `items` to a new array replaces previously generated items
- [ ] Setting `items` to `null` removes all generated items
- [ ] Declarative children and generated items coexist, but `items` replaces only previously generated items

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 8: Breadcrumb — overflow management and BreadcrumbOverlay

**Spec sections:** `<vaadin-breadcrumb>` shadow DOM (overflow button), parts table (`overflow-button`), properties table (`i18n`), Internal Behavior > Overflow management, `<vaadin-breadcrumb-overlay>` element definition, Reuse item 6 (`SlotStylesMixin`), Reuse item 7 (`OverlayMixin`, `PositionMixin`)
**Requirements:** 6
**Depends on:** 6

Implement overflow detection and collapse as described in the spec's "Overflow management" section. Use a `ResizeObserver` on the list container to detect when items exceed available width. When overflow occurs, collapse intermediate items by setting `overflow-hidden` attribute (hidden via `SlotStylesMixin`-injected styles), show the shadow DOM overflow button (positioned via CSS `order` between first and trailing items), and use CSS `order` values on items. Implement the `i18n` property with default `{overflow: 'Show more'}` for the overflow button's accessible label. Implement `<vaadin-breadcrumb-overlay>` using `OverlayMixin` and `PositionMixin` as described in the spec; clicking the overflow button opens the overlay listing collapsed items as links in hierarchical order. Disabled collapsed items render as non-link elements in the overlay.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.d.ts` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.d.ts` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-overlay.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-overlay.d.ts` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.js` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-overlay-base-styles.js` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] When items exceed the container width, intermediate items receive the `overflow-hidden` attribute and are visually hidden
- [ ] The first item remains visible when overflow occurs
- [ ] The last visible item(s) remain visible when overflow occurs
- [ ] The overflow button becomes visible and is positioned between the first item and trailing items
- [ ] Clicking the overflow button opens a dropdown overlay listing collapsed items in hierarchical order
- [ ] Collapsed items with `disabled` render as non-link elements in the dropdown
- [ ] Clicking a link in the dropdown closes the overlay
- [ ] Clicking outside the dropdown closes the overlay
- [ ] When the container is resized wider and items fit, overflow items are restored and the overflow button is hidden
- [ ] The overflow button's accessible label matches `i18n.overflow`

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 9: Breadcrumb — mobile mode

**Spec sections:** `<vaadin-breadcrumb>` shadow DOM (mobile mode), parts table (`back-link`, `back-arrow`), Internal Behavior > Mobile mode, Reuse item 5 (`MediaQueryController`)
**Requirements:** 10
**Depends on:** 8

Implement the mobile mode render path as described in the spec's "Mobile mode" section. When the container is too narrow to display even the first item, overflow button, and last item, switch to mobile mode: set the `[mobile]` attribute on the host and render a single `<a part="back-link">` pointing to the parent item (the last item with a `path` that is not the current page), with a `<span part="back-arrow">` icon followed by the parent item's label. Slotted items remain in a hidden slot for data access. Use `MediaQueryController` from `@vaadin/component-base/src/media-query-controller.js` as a supplementary hint as noted in the Reuse section.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.js` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.js` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] When the container is too narrow for the minimum layout (first + overflow + last), the host receives the `[mobile]` attribute
- [ ] In mobile mode, the shadow DOM renders a single `<a part="back-link">` with the parent item's path as `href`
- [ ] The back-link displays a back-arrow icon (`<span part="back-arrow">`) followed by the parent label text
- [ ] The parent is determined as the last item with a `path` that is not the current page
- [ ] When the container is resized wider, mobile mode is exited and the `[mobile]` attribute is removed
- [ ] Items remain accessible in the hidden slot during mobile mode

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 10: Breadcrumb — `onNavigate` click handling

**Spec sections:** `<vaadin-breadcrumb>` properties table (`onNavigate`), Internal Behavior > `onNavigate` click handling
**Requirements:** 8
**Depends on:** 9

Implement the `onNavigate` callback property and click interception logic as described in the spec's "`onNavigate` click handling" section. The container listens for `click` events and, when `onNavigate` is set, uses `composedPath()` to find the clicked anchor and associated item. Clicks with modifier keys (`metaKey`, `shiftKey`), external links, and `[router-ignore]` items pass through. Otherwise, `preventDefault()` is called and `onNavigate({ path, current, originalEvent })` is invoked — unless the callback returns `false`. The same logic applies to overflow menu links (from Task 8) and the mobile back-link (from Task 9).

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.d.ts` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.d.ts` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] When `onNavigate` is set, clicking an item link calls the callback with `{ path, current, originalEvent }`
- [ ] When `onNavigate` is set, the default link navigation is prevented
- [ ] When the callback returns `false`, the default navigation is not prevented
- [ ] Clicks with `metaKey` or `shiftKey` pass through without calling the callback
- [ ] Clicks on items with `[router-ignore]` attribute pass through without calling the callback
- [ ] When `onNavigate` is set, clicking an overflow menu link calls the callback
- [ ] When `onNavigate` is set, clicking the mobile back-link calls the callback
- [ ] When `onNavigate` is not set, links navigate natively (no interception)

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Phase 3 — Cross-Cutting Concerns

## Task 11: Accessibility — ARIA roles, attributes, and announcements

**Spec sections:** `<vaadin-breadcrumb>` Internal Behavior > Accessibility, `<vaadin-breadcrumb-item>` Internal Behavior > Accessibility, `<vaadin-breadcrumb>` properties table (`i18n`)
**Requirements:** 11, 12, 16
**Depends on:** 9

Add all ARIA roles and attributes described in the spec's Accessibility sections for both elements. The container receives `role="navigation"` and `aria-label="Breadcrumb"` in `firstUpdated()` if not already set. The list container has `role="list"`. Each item receives `role="listitem"` in `firstUpdated()` if not already set. The item's `<a>` receives `aria-current="page"` when `current` is `true`. `aria-disabled="true"` is managed by `DisabledMixin`. Separators and the separator slot have `aria-hidden="true"`. The overflow button has `aria-haspopup="true"` and `aria-expanded` reflecting the overlay state. The overflow menu has `role="menu"` with `role="menuitem"` entries.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-item.js` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)
- `packages/breadcrumb/test/breadcrumb-item.test.ts` (modify)

**Tests:**
- [ ] The container host has `role="navigation"` and `aria-label="Breadcrumb"` by default
- [ ] A developer-provided `aria-label` on the container is not overwritten
- [ ] The list container has `role="list"`
- [ ] Each item host has `role="listitem"`
- [ ] When an item is current, its `<a>` has `aria-current="page"`; when not current, `aria-current` is absent
- [ ] When an item is disabled, the host has `aria-disabled="true"`
- [ ] The overflow button has `aria-haspopup="true"`
- [ ] The overflow button's `aria-expanded` is `"true"` when the overlay is open and `"false"` when closed
- [ ] The overflow menu has `role="menu"` and entries have `role="menuitem"`

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 12: Keyboard navigation

**Spec sections:** `<vaadin-breadcrumb>` Internal Behavior > Overflow management (keyboard behavior in overlay), `<vaadin-breadcrumb-item>` Internal Behavior > Link rendering (tabindex), Accessibility
**Requirements:** 11
**Depends on:** 11

Implement keyboard interaction for the breadcrumb component. Interactive item links (with `path`, not `current`, not `disabled`) are focusable via Tab. Non-interactive items are excluded from the Tab order (per the tabindex logic in Task 2). The overflow button is focusable via Tab. When the overflow menu is open: Arrow Up/Down navigate menu items, Escape closes the menu and returns focus to the overflow button, Enter activates the focused link. Focus trapping in the overlay is provided by `OverlayMixin`'s `focusTrap: true` from Task 8.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-item.js` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] Tab key moves focus through interactive item links in DOM order
- [ ] Non-interactive items (current, disabled, no path) are skipped in Tab order
- [ ] The overflow button is reachable via Tab when visible
- [ ] Pressing Enter on the overflow button opens the dropdown menu
- [ ] Arrow Down moves focus to the next menu item in the dropdown
- [ ] Arrow Up moves focus to the previous menu item in the dropdown
- [ ] Pressing Escape closes the dropdown and returns focus to the overflow button
- [ ] Pressing Enter on a focused menu item activates the link

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 13: RTL support

**Spec sections:** Key Design Decisions item 12 (RTL via `DirMixin` and logical CSS), `<vaadin-breadcrumb-item>` Internal Behavior > Separator rendering (RTL mirroring)
**Requirements:** 14
**Depends on:** 9

Verify and complete RTL support. `ElementMixin` extends `DirMixin`, which propagates the `dir` attribute. Ensure all layout CSS uses logical properties (`margin-inline`, `padding-inline`, `flex-direction`). The default chevron separator is mirrored via CSS `scale(-1, 1)` when `[dir="rtl"]` is set. Verify the overflow button and mobile back-arrow render correctly in RTL. Add RTL-specific tests.

**Files:**
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.js` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.js` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] With `dir="rtl"`, the breadcrumb trail renders in reverse visual order (root on right, current on left)
- [ ] With `dir="rtl"`, the default chevron separator is mirrored (CSS `scale(-1, 1)`)
- [ ] With `dir="rtl"`, the mobile back-arrow points in the correct direction
- [ ] With `dir="rtl"`, all layout uses logical CSS properties (no `margin-left`/`margin-right`)
- [ ] With `dir="rtl"`, the overflow dropdown opens in the correct position

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Phase 4 — Styling

## Task 14: Base styles completion

**Spec sections:** `<vaadin-breadcrumb>` CSS custom properties table, `<vaadin-breadcrumb-item>` CSS custom properties table, all parts tables
**Requirements:** 16
**Depends on:** 4, 12, 13

Complete the base styles files with full state selectors (`:host([disabled])`, `:host([current])`, `:host([mobile])`, `:host([first])`, etc.), forced-colors mode (`@media (forced-colors: active)`), and all CSS custom property hookups listed in the spec's CSS custom properties tables (`--vaadin-breadcrumb-gap`, `--vaadin-breadcrumb-font-size`, `--vaadin-breadcrumb-text-color`, `--vaadin-breadcrumb-current-text-color`, `--vaadin-breadcrumb-separator-color`, `--vaadin-breadcrumb-item-max-width`). Ensure links are visually distinguished from the current page by more than color alone (underline or font weight) for low-vision accessibility. Add base visual tests.

**Files:**
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.js` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.js` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-overlay-base-styles.js` (modify)
- `packages/breadcrumb/test/visual/base/breadcrumb.test.js` (create)

**Tests:**
- [ ] Visual: default breadcrumb trail with multiple items
- [ ] Visual: breadcrumb with current page item (visually distinct from links)
- [ ] Visual: breadcrumb with disabled item
- [ ] Visual: breadcrumb with overflow (ellipsis button visible)
- [ ] Visual: breadcrumb in mobile mode (back-link)
- [ ] Visual: breadcrumb with long truncated labels

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes
- [ ] `yarn test:base --group breadcrumb` passes

---

## Task 15: Lumo theme

**Spec sections:** (theme styling — references spec CSS custom properties tables for token bindings)
**Requirements:** 16
**Depends on:** 14

Create Lumo theme CSS files for all three elements following the `WEB_COMPONENT_GUIDELINES.md` Theming section. The public CSS files (`packages/vaadin-lumo-styles/components/{name}.css`) include injection markers; the implementation CSS files (`packages/vaadin-lumo-styles/src/components/{name}.css`) contain the actual Lumo token bindings wrapped in `@media lumo_components_{name}` queries. Bind the spec's CSS custom properties to Lumo tokens (e.g., `--lumo-space-*`, `--lumo-font-size-*`, `--lumo-primary-text-color`). Add Lumo visual tests.

**Files:**
- `packages/vaadin-lumo-styles/components/breadcrumb.css` (create)
- `packages/vaadin-lumo-styles/src/components/breadcrumb.css` (create)
- `packages/vaadin-lumo-styles/components/breadcrumb-item.css` (create)
- `packages/vaadin-lumo-styles/src/components/breadcrumb-item.css` (create)
- `packages/vaadin-lumo-styles/components/breadcrumb-overlay.css` (create)
- `packages/vaadin-lumo-styles/src/components/breadcrumb-overlay.css` (create)
- `packages/breadcrumb/test/visual/lumo/breadcrumb.test.js` (create)

**Tests:**
- [ ] Visual: Lumo default breadcrumb trail
- [ ] Visual: Lumo breadcrumb with current page
- [ ] Visual: Lumo breadcrumb with disabled item
- [ ] Visual: Lumo breadcrumb with overflow and open dropdown
- [ ] Visual: Lumo breadcrumb in mobile mode
- [ ] Visual: Lumo breadcrumb with focus-ring on an item

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:css` passes
- [ ] `yarn lint:types` passes
- [ ] `yarn test:lumo --group breadcrumb` passes

---

## Task 16: Aura theme

**Spec sections:** (theme styling — references spec CSS custom properties tables for token bindings)
**Requirements:** 16
**Depends on:** 14

Create Aura theme CSS files for all three elements following the `WEB_COMPONENT_GUIDELINES.md` Theming section. Use modern CSS syntax (`:is()`, `:where()`, `light-dark()`, `oklch()`) and Aura design tokens (`--aura-*`). Create component CSS files at `packages/aura/src/components/` and import them in `packages/aura/aura.css`. Add Aura visual tests.

**Files:**
- `packages/aura/src/components/breadcrumb.css` (create)
- `packages/aura/src/components/breadcrumb-item.css` (create)
- `packages/aura/src/components/breadcrumb-overlay.css` (create)
- `packages/aura/aura.css` (modify)
- `packages/breadcrumb/test/visual/aura/breadcrumb.test.js` (create)

**Tests:**
- [ ] Visual: Aura default breadcrumb trail
- [ ] Visual: Aura breadcrumb with current page
- [ ] Visual: Aura breadcrumb with disabled item
- [ ] Visual: Aura breadcrumb with overflow and open dropdown
- [ ] Visual: Aura breadcrumb in mobile mode
- [ ] Visual: Aura breadcrumb with focus-ring on an item

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:css` passes
- [ ] `yarn lint:types` passes
- [ ] `yarn test:aura --group breadcrumb` passes

---

## Phase 5 — Integration

## Task 17: Dev page, snapshot tests, type tests, and final validation

**Spec sections:** (all — integration coverage)
**Requirements:** 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
**Depends on:** 7, 10, 15, 16

Create the dev page at `dev/breadcrumb.html` with examples of all major variants: basic trail, current page, no current page, custom separator, disabled items, overflow, mobile mode, `items` property, and `onNavigate`. Create DOM snapshot tests for both elements covering default state, disabled, current, and shadow DOM structure. Create TypeScript type tests verifying property types, mixin interfaces, and `HTMLElementTagNameMap` augmentation. Run final validation: `yarn lint`, `yarn lint:types`, `yarn test --group breadcrumb`, `yarn test:snapshots --group breadcrumb`, `yarn test:base --group breadcrumb`, `yarn test:lumo --group breadcrumb`, `yarn test:aura --group breadcrumb`.

**Files:**
- `dev/breadcrumb.html` (create)
- `packages/breadcrumb/test/dom/breadcrumb.test.js` (create)
- `packages/breadcrumb/test/dom/__snapshots__/breadcrumb.test.snap.js` (create — generated)
- `packages/breadcrumb/test/typings/breadcrumb.types.ts` (create)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] DOM snapshot: `vaadin-breadcrumb` default host
- [ ] DOM snapshot: `vaadin-breadcrumb` shadow DOM (normal mode)
- [ ] DOM snapshot: `vaadin-breadcrumb-item` default host
- [ ] DOM snapshot: `vaadin-breadcrumb-item` with `path` set
- [ ] DOM snapshot: `vaadin-breadcrumb-item` with `current` set
- [ ] DOM snapshot: `vaadin-breadcrumb-item` with `disabled` set
- [ ] DOM snapshot: `vaadin-breadcrumb-item` shadow DOM
- [ ] TypeScript: `document.createElement('vaadin-breadcrumb')` returns `Breadcrumb` type
- [ ] TypeScript: `document.createElement('vaadin-breadcrumb-item')` returns `BreadcrumbItem` type
- [ ] TypeScript: property types are correct (`path: string`, `current: boolean`, `items: Array`, `onNavigate: function`, `location: any`, `i18n: object`)

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes
- [ ] `yarn test --group breadcrumb` passes
- [ ] `yarn test:snapshots --group breadcrumb` passes
- [ ] `yarn test:base --group breadcrumb` passes
- [ ] `yarn test:lumo --group breadcrumb` passes
- [ ] `yarn test:aura --group breadcrumb` passes
- [ ] Dev page renders correctly with both Lumo and Aura themes
