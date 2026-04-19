# Breadcrumb Implementation Tasks

<!--
Ordered implementation tasks derived from web-component-spec.md. Each task is a self-contained unit of work following test-driven development: define tests first, then implement to make them pass. Each task results in a merge-ready branch.

Primary input: packages/breadcrumb/spec/web-component-spec.md
API context: packages/breadcrumb/spec/web-component-api.md
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

- [web-component-spec.md](web-component-spec.md)
- [requirements.md](requirements.md)
- [web-component-api.md](web-component-api.md)

---

## Task 1: Scaffold breadcrumb package

**Spec sections:** Implementation → Elements (both elements, mixin chains only)
**Requirements:** —
**Depends on:** —

Create the `packages/breadcrumb/` package with `package.json`, `LICENSE`, `README.md`, root export files, root `.d.ts` files, empty element classes with correct mixin chains (see spec), TypeScript definitions, base styles files (structural CSS only — `display: flex; flex-wrap: nowrap` on container, `:host([hidden]) { display: none !important }`), and the test directory structure. Set `static experimental = true` on both element classes. Include smoke tests.

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
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.js` (create)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.d.ts` (create)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.js` (create)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.d.ts` (create)
- `packages/breadcrumb/test/breadcrumb.test.ts` (create)
- `packages/breadcrumb/test/dom/breadcrumb.test.js` (create)
- `packages/breadcrumb/test/visual/lumo/breadcrumb.test.js` (create)
- `packages/breadcrumb/test/visual/aura/breadcrumb.test.js` (create)
- `packages/breadcrumb/test/visual/base/breadcrumb.test.js` (create)

**Tests:**
- [ ] `vaadin-breadcrumb` is defined in the custom element registry
- [ ] `vaadin-breadcrumb` has a valid static `is` getter returning `'vaadin-breadcrumb'`
- [ ] `vaadin-breadcrumb` renders a shadow root containing a `<div part="container">` with a `<slot>`
- [ ] `vaadin-breadcrumb-item` is defined in the custom element registry
- [ ] `vaadin-breadcrumb-item` has a valid static `is` getter returning `'vaadin-breadcrumb-item'`
- [ ] `vaadin-breadcrumb-item` renders a shadow root containing an `<a>` element and a `<span part="separator">`

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 2: Item path property and link rendering

**Spec sections:** `<vaadin-breadcrumb-item>` → Properties (`path`), Shadow DOM, Internal Behavior → Link behavior
**Requirements:** 1, 3, 5
**Depends on:** 1

Implement the `path` property on `<vaadin-breadcrumb-item>` and the `<a>` link rendering. When `path` is set, the `<a>` gets `href`; when null, no `href` is rendered and `tabindex="-1"`. Also implement the `prefix` slot. See the item's shadow DOM and properties table in the spec.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-item.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-item.d.ts` (modify)
- `packages/breadcrumb/test/breadcrumb-item.test.ts` (create)

**Tests:**
- [ ] Setting `path="/catalog"` renders `<a href="/catalog">` in shadow DOM
- [ ] Setting `path` to `null` renders `<a>` without `href` attribute
- [ ] An item without `path` has `tabindex="-1"` on its `<a>` element
- [ ] An item with `path` has `tabindex="0"` on its `<a>` element
- [ ] The `path` property is reflected to the `path` attribute
- [ ] Content slotted into `slot="prefix"` appears before the default slot content inside the `<a>`
- [ ] A `<vaadin-icon>` in `slot="prefix"` is visible inside the link

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 3: Item current attribute and separator

**Spec sections:** `<vaadin-breadcrumb-item>` → Properties (`current`), Parts (`separator`), Internal Behavior → Current item rendering, Separator rendering
**Requirements:** 2, 12
**Depends on:** 2

Implement the `current` boolean property (reflected) and the separator rendering. When `current` is true: `aria-current="page"` on the `<a>`, `tabindex="-1"`, `href` not rendered. The separator `<span part="separator">` renders via CSS `::before` with `content: var(--vaadin-breadcrumb-separator-content, '\\203A')` and is hidden when `current` is true. See spec Internal Behavior sections for Current item rendering and Separator rendering.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-item.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-item.d.ts` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.js` (modify)
- `packages/breadcrumb/test/breadcrumb-item.test.ts` (modify)

**Tests:**
- [ ] Setting `current` to true adds `aria-current="page"` on the `<a>` element
- [ ] Setting `current` to true sets `tabindex="-1"` on the `<a>` even if `path` is set
- [ ] Setting `current` to true removes `href` from the `<a>` even if `path` is set
- [ ] The `current` property reflects to a `current` attribute on the host
- [ ] The separator `<span part="separator">` is visible when `current` is false
- [ ] The separator is hidden (`display: none`) when `current` is true
- [ ] The separator has `aria-hidden="true"`
- [ ] Overriding `--vaadin-breadcrumb-separator-content` changes the separator character

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 4: Container slot observation, current management, and landmark

**Spec sections:** `<vaadin-breadcrumb>` → Properties (`label`), Slots, Parts (`container`), Internal Behavior → Current item management; Key Design Decisions §2, §3
**Requirements:** 1, 2, 11
**Depends on:** 3

Implement slot observation on `<vaadin-breadcrumb>` using `SlotController` in multiple mode. When slotted items change, the component sets `current` on the last item and removes it from all others. Implement the `label` property (default `"Breadcrumb"`) mapped to `aria-label` on the host. Set `role="navigation"` on the host and `role="list"` on the container `<div>`. See spec for the mixin chain with `I18nMixin`.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.d.ts` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.d.ts` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] The last slotted `<vaadin-breadcrumb-item>` automatically receives the `current` attribute
- [ ] Previous items do not have the `current` attribute
- [ ] Adding a new item causes `current` to move to the new last item
- [ ] Removing the last item causes `current` to move to the new last item
- [ ] The `label` property defaults to `"Breadcrumb"`
- [ ] The host has `aria-label="Breadcrumb"` by default
- [ ] Setting `label="Product navigation"` updates `aria-label` on the host
- [ ] The host has `role="navigation"`
- [ ] The shadow container `<div>` has `role="list"`

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 5: Programmatic items property

**Spec sections:** `<vaadin-breadcrumb>` → Properties (`items`), Internal Behavior → Programmatic items rendering
**Requirements:** 1, 2, 3, 10
**Depends on:** 4

Implement the `items` array property. When set, use Lit's `render()` to render `<vaadin-breadcrumb-item>` elements into light DOM following Menu Bar's pattern. Each item object `{ text, path, prefix }` maps to an item element with the corresponding properties and optional `<vaadin-icon>` in the prefix slot. The last item without `path` becomes current automatically (via the slot observation from Task 4). See spec Internal Behavior → Programmatic items rendering.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.d.ts` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] Setting `items` to `[{text:'A', path:'/'}, {text:'B'}]` renders two `<vaadin-breadcrumb-item>` in light DOM
- [ ] The first item has `path="/"` and text content `"A"`
- [ ] The last item has no `path` and receives the `current` attribute
- [ ] Updating `items` to a different array re-renders the trail
- [ ] An item with `prefix: 'vaadin:home'` renders a `<vaadin-icon icon="vaadin:home" slot="prefix">` inside the item
- [ ] Setting `items` to `[]` clears all rendered items

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 6: Navigation interception

**Spec sections:** `<vaadin-breadcrumb>` → Properties (`onNavigate`), Internal Behavior → Navigation interception; Key Design Decisions §1
**Requirements:** 4
**Depends on:** 4

Implement the `onNavigate` callback property following Side Nav's `__onClick` pattern. When set, clicks on item links are intercepted. The callback receives `{ path, originalEvent }`. Navigation is prevented unless the callback returns `false`. Clicks with modifier keys, on external links, or with `target="_blank"` bypass interception. See spec Internal Behavior → Navigation interception.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.d.ts` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] Without `onNavigate` set, clicking an item link triggers default navigation (no `preventDefault`)
- [ ] With `onNavigate` set, clicking an item calls the callback with `{ path, originalEvent }`
- [ ] With `onNavigate` set, the default navigation is prevented (`event.defaultPrevented` is true)
- [ ] When the callback returns `false`, the default navigation is NOT prevented
- [ ] Clicks with `metaKey` set bypass the callback and allow default
- [ ] Clicks with `shiftKey` set bypass the callback and allow default

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 7: Overflow detection and item collapse

**Spec sections:** `<vaadin-breadcrumb>` → Internal Behavior → Overflow algorithm, Overflow button; Key Design Decisions §4, §5, §6; Reuse → ResizeMixin
**Requirements:** 6, 7
**Depends on:** 4

Implement overflow detection using `ResizeMixin` with `microTask` debouncing. When items don't fit, collapse intermediate items starting from the one closest to the root (index 1). Apply `visibility: hidden; position: absolute` to collapsed items. Create the overflow button (`<button>` with `data-overflow`, `aria-haspopup="true"`, text `"…"`) and insert it into light DOM at the correct position. Lock container width during measurement. See spec Internal Behavior → Overflow algorithm and Overflow button for the full algorithm.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.d.ts` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.js` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.js` (modify)
- `packages/breadcrumb/test/overflow.test.ts` (create)

**Tests:**
- [ ] When all items fit the container, no overflow button is rendered and all items are visible
- [ ] When items overflow, an ellipsis button (`"…"`) appears in the trail
- [ ] The first item to collapse is the one at index 1 (closest to root, not the root itself)
- [ ] The root item (index 0) remains visible while intermediate items are collapsed
- [ ] The last item (current page) is never collapsed
- [ ] When all intermediates are collapsed and the trail still overflows, the root item collapses
- [ ] The overflow button's DOM position is between the last visible left-side item and the first visible right-side item
- [ ] Expanding the container restores collapsed items and hides the overflow button
- [ ] The overflow button has `aria-haspopup="true"` and `aria-label` matching `i18n.moreItems`

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 8: Overflow dropdown

**Spec sections:** `<vaadin-breadcrumb>` → Parts (`dropdown`), Internal Behavior → Dropdown; Key Design Decisions §9
**Requirements:** 8
**Depends on:** 7

Implement the dropdown panel for collapsed items. When the overflow button is activated (click or Enter/Space), the dropdown opens with `position: fixed` using `getBoundingClientRect()`. The dropdown lists collapsed items as links in hierarchy order. Clicking a link navigates (subject to `onNavigate`). Escape or outside click closes the dropdown and returns focus to the overflow button. Sync `aria-expanded` on the overflow button. See spec Internal Behavior → Dropdown.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.js` (modify)
- `packages/breadcrumb/test/overflow.test.ts` (modify)

**Tests:**
- [ ] Clicking the overflow button opens the dropdown (`[part="dropdown"]` becomes visible)
- [ ] The dropdown contains links for each collapsed item in hierarchy order (root first, most nested last)
- [ ] Each dropdown link has the correct `href` matching the original item's `path`
- [ ] Clicking a dropdown link navigates (or calls `onNavigate` if set)
- [ ] Pressing Escape closes the dropdown and returns focus to the overflow button
- [ ] Clicking outside the dropdown closes it
- [ ] The overflow button's `aria-expanded` is `"true"` when open and `"false"` when closed

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 9: Current page label truncation

**Spec sections:** `<vaadin-breadcrumb-item>` → Internal Behavior → Truncation; `<vaadin-breadcrumb>` → Internal Behavior → Overflow algorithm (step 8); Key Design Decisions §10
**Requirements:** 9
**Depends on:** 7

When all items are collapsed and the current page label still overflows, the parent sets a `truncate` attribute on the current item and a `title` attribute with the full text. The item's shadow CSS applies `text-overflow: ellipsis` via `:host([truncate])`. See spec Internal Behavior → Truncation and the `::slotted()` limitation note in Key Design Decisions §10.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.js` (modify)
- `packages/breadcrumb/test/overflow.test.ts` (modify)

**Tests:**
- [ ] When all items are collapsed and the current page label overflows, the current item gets a `truncate` attribute
- [ ] The truncated item displays `text-overflow: ellipsis` (computed `overflow` is `hidden` on the link part)
- [ ] The truncated item has a `title` attribute containing the full label text
- [ ] When the container is expanded enough for the label to fit, the `truncate` and `title` attributes are removed

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 10: Accessibility and keyboard navigation

**Spec sections:** `<vaadin-breadcrumb>` (all ARIA), `<vaadin-breadcrumb-item>` (all ARIA), Internal Behavior → Dropdown (keyboard), Overflow button (keyboard)
**Requirements:** 1, 2, 3, 8, 11
**Depends on:** 8

Verify and complete the accessibility implementation across both elements. Ensure `role="navigation"` + `aria-label` on the host, `role="list"` on the container, `aria-current="page"` on the current item, and proper tab order. Ensure the overflow button is keyboard-accessible (Enter/Space opens dropdown). Verify all interactive elements have accessible names.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/test/accessibility.test.ts` (create)

**Tests:**
- [ ] Tab key moves focus through visible item links in visual order, skipping the current item (which has `tabindex="-1"`)
- [ ] The overflow button is in the tab order at its visual position (between visible items)
- [ ] Enter on the overflow button opens the dropdown
- [ ] Space on the overflow button opens the dropdown
- [ ] When the dropdown is open, Tab moves focus through dropdown links
- [ ] Screen reader sees the breadcrumb as a navigation landmark labeled `"Breadcrumb"`

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 11: RTL support

**Spec sections:** `<vaadin-breadcrumb-item>` → Internal Behavior → Separator rendering (RTL); Reuse → DirMixin
**Requirements:** 12
**Depends on:** 7

Verify and implement RTL support. The separator flips direction via `transform: scaleX(-1)` on `:host([dir="rtl"]) [part="separator"]`. The overflow algorithm correctly measures in RTL using `DirMixin`'s `__isRTL`. Verify focus order mirrors with layout.

**Files:**
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/test/rtl.test.ts` (create)

**Tests:**
- [ ] In RTL, the separator `<span part="separator">` has `transform: scaleX(-1)` applied
- [ ] In LTR, the separator does not have `transform: scaleX(-1)`
- [ ] In RTL, the overflow algorithm still collapses items correctly (items collapse, ellipsis appears)
- [ ] In RTL, the overflow button is positioned correctly in the DOM between visible items

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 12: Base styles completion

**Spec sections:** `<vaadin-breadcrumb>` → CSS Custom Properties; `<vaadin-breadcrumb-item>` → CSS Custom Properties
**Requirements:** —
**Depends on:** 9

Complete all base styles for both elements. Hook up all CSS custom properties (`--vaadin-breadcrumb-gap`, `--vaadin-breadcrumb-item-text-color`, `--vaadin-breadcrumb-item-current-text-color`, `--vaadin-breadcrumb-separator-content`). Add state selectors (`:host([current])` styling on item). Add forced-colors mode support. Style the overflow button via `::slotted([data-overflow])` with zero vertical padding. Create base visual tests.

**Files:**
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.js` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.js` (modify)
- `packages/breadcrumb/test/visual/base/breadcrumb.test.js` (modify)

**Tests:**
- [ ] Visual: basic breadcrumb with 3 items
- [ ] Visual: breadcrumb with current item styled differently
- [ ] Visual: breadcrumb with overflow (collapsed items + ellipsis)
- [ ] Visual: breadcrumb with prefix icon on first item
- [ ] Visual: forced-colors mode renders distinct links

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn test:base --group breadcrumb` passes
- [ ] `yarn update:base --group breadcrumb` generates reference screenshots
- [ ] `yarn lint` passes

---

## Task 13: Lumo theme

**Spec sections:** (theming, per WEB_COMPONENT_GUIDELINES)
**Requirements:** —
**Depends on:** 12

Create Lumo theme CSS files for both `vaadin-breadcrumb` and `vaadin-breadcrumb-item`. Public CSS file with injection markers at `packages/vaadin-lumo-styles/components/breadcrumb.css` and `packages/vaadin-lumo-styles/components/breadcrumb-item.css`. Implementation CSS at `packages/vaadin-lumo-styles/src/components/breadcrumb.css` and `packages/vaadin-lumo-styles/src/components/breadcrumb-item.css`. Bind Lumo tokens for colors, spacing, and typography. Create Lumo visual tests.

**Files:**
- `packages/vaadin-lumo-styles/components/breadcrumb.css` (create)
- `packages/vaadin-lumo-styles/src/components/breadcrumb.css` (create)
- `packages/vaadin-lumo-styles/components/breadcrumb-item.css` (create)
- `packages/vaadin-lumo-styles/src/components/breadcrumb-item.css` (create)
- `packages/breadcrumb/test/visual/lumo/breadcrumb.test.js` (modify)

**Tests:**
- [ ] Visual: Lumo basic breadcrumb with 3 items
- [ ] Visual: Lumo breadcrumb with current item
- [ ] Visual: Lumo breadcrumb with overflow
- [ ] Visual: Lumo breadcrumb with prefix icon

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn test:lumo --group breadcrumb` passes
- [ ] `yarn update:lumo --group breadcrumb` generates reference screenshots
- [ ] `yarn lint:css` passes
- [ ] `yarn lint` passes

---

## Task 14: Aura theme

**Spec sections:** (theming, per WEB_COMPONENT_GUIDELINES)
**Requirements:** —
**Depends on:** 12

Create Aura theme CSS files at `packages/aura/src/components/breadcrumb.css` and `packages/aura/src/components/breadcrumb-item.css`. Import both in `packages/aura/aura.css`. Use modern CSS features (`:is()`, `:where()`, `light-dark()`) for element selectors and variant styling. Create Aura visual tests.

**Files:**
- `packages/aura/src/components/breadcrumb.css` (create)
- `packages/aura/src/components/breadcrumb-item.css` (create)
- `packages/aura/aura.css` (modify)
- `packages/breadcrumb/test/visual/aura/breadcrumb.test.js` (modify)

**Tests:**
- [ ] Visual: Aura basic breadcrumb with 3 items
- [ ] Visual: Aura breadcrumb with current item
- [ ] Visual: Aura breadcrumb with overflow
- [ ] Visual: Aura breadcrumb with prefix icon

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn test:aura --group breadcrumb` passes
- [ ] `yarn update:aura --group breadcrumb` generates reference screenshots
- [ ] `yarn lint:css` passes
- [ ] `yarn lint` passes

---

## Task 15: Dev page, snapshots, type tests, and final validation

**Spec sections:** (all — integration)
**Requirements:** 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
**Depends on:** 13, 14

Create the dev page at `dev/breadcrumb.html` with examples covering all requirements: basic trail, prefix icons, overflow in a resizable container (`resize: horizontal; overflow: hidden`), programmatic items, and RTL. Create DOM snapshot tests for both elements in default and key states. Create TypeScript type tests. Run final validation suite.

**Files:**
- `dev/breadcrumb.html` (create)
- `packages/breadcrumb/test/dom/breadcrumb.test.js` (modify)
- `packages/breadcrumb/test/dom/__snapshots__/breadcrumb.test.snap.js` (create — generated)
- `packages/breadcrumb/test/typings/breadcrumb.types.ts` (create)

**Tests:**
- [ ] DOM snapshot: `vaadin-breadcrumb` default state
- [ ] DOM snapshot: `vaadin-breadcrumb` with items
- [ ] DOM snapshot: `vaadin-breadcrumb-item` default state
- [ ] DOM snapshot: `vaadin-breadcrumb-item` with `path` set
- [ ] DOM snapshot: `vaadin-breadcrumb-item` with `current` set
- [ ] TypeScript: `Breadcrumb` type has `items`, `label`, `onNavigate`, `i18n` properties
- [ ] TypeScript: `BreadcrumbItem` type has `path` and `current` properties
- [ ] TypeScript: `BreadcrumbItem` type has prefix slot

**Acceptance criteria:**
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes
- [ ] `yarn test --group breadcrumb` passes
- [ ] `yarn test:snapshots --group breadcrumb` passes
- [ ] `yarn test:base --group breadcrumb` passes
- [ ] `yarn test:lumo --group breadcrumb` passes
- [ ] `yarn test:aura --group breadcrumb` passes
- [ ] Dev page loads without errors and shows all examples
