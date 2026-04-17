# Breadcrumb Implementation Tasks

<!--
Ordered implementation tasks derived from spec.md. Each task is a self-contained unit of work following test-driven development: define tests first, then implement to make them pass. Each task results in a merge-ready branch.

Primary input: packages/breadcrumb/spec/spec.md
API context: packages/breadcrumb/spec/developer-api.md
Traceability: packages/breadcrumb/spec/requirements.md

Tasks are pointers into the spec, not a second copy of it.
-->

## Spec References

- [spec.md](spec.md)
- [requirements.md](requirements.md)
- [developer-api.md](developer-api.md)

---

## Task 1: Package scaffolding

**Spec sections:** Key Design Decisions (mixin chains), Implementation → Elements (both elements)
**Requirements:** —
**Depends on:** —

Create the `packages/breadcrumb/` package with all required files: `package.json`, `LICENSE`, `README.md`, root export files, root `.d.ts` files, source element classes with correct mixin chains and empty `render()` methods, TypeScript definitions, base styles files (empty structural CSS), and the test directory structure. Register both elements with `defineCustomElement()` and set `static experimental = true`. Include a smoke test that both elements register and render without errors.

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
- `packages/breadcrumb/src/vaadin-breadcrumb-item-mixin.js` (create)
- `packages/breadcrumb/src/vaadin-breadcrumb-item-mixin.d.ts` (create)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.js` (create)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.d.ts` (create)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.js` (create)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.d.ts` (create)
- `packages/breadcrumb/test/breadcrumb.test.ts` (create)

**Tests:**
- [ ] `vaadin-breadcrumb` is defined in the custom element registry
- [ ] `vaadin-breadcrumb` has a valid static `is` getter returning `'vaadin-breadcrumb'`
- [ ] `vaadin-breadcrumb-item` is defined in the custom element registry
- [ ] `vaadin-breadcrumb-item` has a valid static `is` getter returning `'vaadin-breadcrumb-item'`
- [ ] Both elements render a shadow root without errors
- [ ] `yarn lint` passes for the new package
- [ ] `yarn lint:types` passes for the new package

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 2: Item path and link rendering

**Spec sections:** Implementation → `<vaadin-breadcrumb-item>` (shadow DOM, properties: `path`)
**Requirements:** 2, 8
**Depends on:** 1

Implement the `<vaadin-breadcrumb-item>` shadow DOM with the `<a>` element (part `link`), default slot for text, and `prefix` slot. Implement the `path` property: when set, the anchor gets `href` and `tabindex="0"`; when absent, the anchor has no `href` and `tabindex="-1"` (non-clickable). Add the `has-path` reflected state attribute.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-item.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-item.d.ts` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-item-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-item-mixin.d.ts` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.js` (modify)
- `packages/breadcrumb/test/breadcrumb-item.test.ts` (create)

**Tests:**
- [ ] Setting `path` renders an `<a>` with the matching `href`
- [ ] With `path` set, the anchor has `tabindex="0"`
- [ ] Without `path`, the anchor has no `href` attribute
- [ ] Without `path`, the anchor has `tabindex="-1"`
- [ ] The `has-path` attribute is reflected when `path` is set
- [ ] The `has-path` attribute is removed when `path` is cleared
- [ ] Slotted text content appears inside the anchor
- [ ] A component in `slot="prefix"` renders before the label

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 3: Current item state

**Spec sections:** Implementation → `<vaadin-breadcrumb-item>` (properties: `current`), Key Design Decisions §2
**Requirements:** 3, 16
**Depends on:** 2

Implement the `current` boolean property on `<vaadin-breadcrumb-item>`. When `current` is true, set `aria-current="page"` on the anchor and reflect the `current` attribute on the host. When false, set `aria-current="false"`.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-item-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-item-mixin.d.ts` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-item.d.ts` (modify)
- `packages/breadcrumb/test/breadcrumb-item.test.ts` (modify)

**Tests:**
- [ ] Setting `current` to true reflects the `current` attribute on the host
- [ ] Setting `current` to true sets `aria-current="page"` on the anchor
- [ ] Setting `current` to false removes the `current` attribute
- [ ] Setting `current` to false sets `aria-current="false"` on the anchor
- [ ] Default value of `current` is `false`

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 4: Breadcrumb container with slotted items and separators

**Spec sections:** Implementation → `<vaadin-breadcrumb>` (shadow DOM, slots: default and separator), Key Design Decisions §4, §8
**Requirements:** 1, 4, 5
**Depends on:** 3

Implement the `<vaadin-breadcrumb>` shadow DOM: `<nav>` element containing an `<ol>`, default slot for `<vaadin-breadcrumb-item>` children, and separator rendering between items. When items are slotted, the component observes slotchange and renders `<li>` wrappers with separator spans between each pair. Implement the `separator` slot: when content is slotted into `slot="separator"`, clone it between items; when empty, render the default directional chevron. Expose the `nav`, `list`, and `separator` shadow parts.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.d.ts` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.d.ts` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.js` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] Slotted `<vaadin-breadcrumb-item>` children appear inside the `<ol>` (via `<li>` wrappers)
- [ ] Separators appear between each pair of items but not after the last item
- [ ] Default separator is a directional chevron character
- [ ] Slotting content into `slot="separator"` replaces the default separator
- [ ] A custom separator icon renders correctly between items
- [ ] Adding/removing items dynamically updates the separators
- [ ] Shadow parts `nav`, `list`, and `separator` are queryable

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 5: Programmatic items property

**Spec sections:** Implementation → `<vaadin-breadcrumb>` (properties: `items`), Key Design Decisions §3
**Requirements:** 6
**Depends on:** 4

Implement the `items` array property on `<vaadin-breadcrumb>`. When set, the component creates `<vaadin-breadcrumb-item>` children in the light DOM from the array objects. Each object maps: `text` → text content, `path` → `path` attribute, `current` → `current` attribute. Setting `items` to `null`/`undefined` clears programmatic items.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.d.ts` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.d.ts` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] Setting `items` creates `<vaadin-breadcrumb-item>` children with correct text and `path`
- [ ] Setting `items` with a `current: true` entry marks that item as current
- [ ] Changing `items` replaces the previous children
- [ ] Setting `items` to `null` clears the programmatic items
- [ ] Separators render correctly for programmatically created items
- [ ] Items created programmatically function identically to declarative items

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 6: Navigation (onNavigate callback and navigate event)

**Spec sections:** Implementation → `<vaadin-breadcrumb>` (properties: `onNavigate`, events: `navigate`), Key Design Decisions §6
**Requirements:** 2
**Depends on:** 4

Implement click handling on the breadcrumb container: intercept clicks on `<a>` elements inside `<vaadin-breadcrumb-item>` shadow roots. When `onNavigate` is set, call it with `{ path, current, originalEvent }` and prevent default unless it returns `false`. When `onNavigate` is not set, fire a `navigate` CustomEvent with the same detail. Skip modified clicks (meta/shift/ctrl) and external links. Implement the `location` property as an opaque change-trigger that dispatches a `breadcrumb-location-changed` window event.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.d.ts` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.d.ts` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] Clicking an ancestor item with `path` fires the `navigate` event with the correct `path` in detail
- [ ] The `navigate` event does not fire for the `current` item (no path / not a link)
- [ ] When `onNavigate` is set, clicking calls the callback with `{ path, current, originalEvent }`
- [ ] When `onNavigate` is set, the default link action is prevented
- [ ] When `onNavigate` returns `false`, the default link action is not prevented
- [ ] Modified clicks (meta key held) do not trigger `onNavigate`
- [ ] Setting `location` dispatches a `breadcrumb-location-changed` window event

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 7: I18n (localizable labels)

**Spec sections:** Implementation → `<vaadin-breadcrumb>` (properties: `i18n`), Key Design Decisions §1
**Requirements:** 15
**Depends on:** 4

Implement the `i18n` property using `I18nMixin` from `@vaadin/component-base/src/i18n-mixin.js`. Default values: `{ navigationLabel: 'Breadcrumb', overflow: 'Show hidden ancestors' }`. The `navigationLabel` value is applied as `aria-label` on the `<nav>` element. The `overflow` value is applied as `aria-label` on the overflow button (used in the next task). Partial updates merge with defaults.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.d.ts` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.d.ts` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] Default `i18n.navigationLabel` is `'Breadcrumb'`
- [ ] The `<nav>` element has `aria-label="Breadcrumb"` by default
- [ ] Setting `i18n = { navigationLabel: 'Fil d\'Ariane' }` updates the `aria-label`
- [ ] Partial i18n updates merge with defaults (setting only `overflow` keeps `navigationLabel`)
- [ ] Default `i18n.overflow` is `'Show hidden ancestors'`

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 8: Overflow (collapse and overflow menu)

**Spec sections:** Implementation → `<vaadin-breadcrumb>` (Internal Behavior: overflow algorithm, shadow DOM: overflow-button), Key Design Decisions §5
**Requirements:** 11, 12, 13, 14
**Depends on:** 7

Implement the overflow algorithm using `ResizeMixin` from `@vaadin/component-base/src/resize-mixin.js`. When the trail exceeds the container width: collapse intermediate items starting from the item closest to the root, show the overflow button (part `overflow-button`), and render collapsed items in a `<vaadin-popover>`. When all intermediates are collapsed, collapse the root. When only the current item remains, truncate its label with CSS `text-overflow: ellipsis`. The overflow button's `aria-label` comes from `i18n.overflow`. Clicking an item in the overflow popover navigates to it. Set the `overflow` attribute on the host when items are collapsed.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.d.ts` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.js` (modify)
- `packages/breadcrumb/src/vaadin-breadcrumb.d.ts` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.js` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] With enough width, all items are visible and the overflow button is hidden
- [ ] When width is reduced, intermediate items collapse starting from the one closest to the root
- [ ] The overflow button appears when at least one item is collapsed
- [ ] The overflow button has `aria-label` from `i18n.overflow`
- [ ] Clicking the overflow button opens a popover listing collapsed items in hierarchy order
- [ ] Clicking an item in the overflow popover fires navigation (same as clicking an inline item)
- [ ] The `overflow` attribute is set on the host when items are collapsed
- [ ] When all intermediates and root are collapsed, only the current item and overflow button remain
- [ ] When the current item alone exceeds the width, its label truncates with ellipsis
- [ ] The full label of a truncated current item is revealed on hover (title attribute)
- [ ] Resizing the container wider restores collapsed items

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 9: Accessibility

**Spec sections:** Key Design Decisions §8, Implementation → `<vaadin-breadcrumb>` (shadow DOM: `<nav>`, `<ol>`), Implementation → `<vaadin-breadcrumb-item>` (shadow DOM: `aria-current`)
**Requirements:** 15, 16, 17
**Depends on:** 8

Verify and complete the accessibility implementation across both elements. The `<vaadin-breadcrumb>` should set `role="navigation"` in `firstUpdated` (if no custom role). Separators must be `aria-hidden="true"`. The `<ol>` uses `role="list"` and each `<li>` wrapper uses `role="listitem"`. The item's `aria-current="page"` is already implemented (task 3) — verify it integrates correctly with the list structure. The overflow button must have `aria-label`. Verify screen reader reading order matches visual order.

**Files:**
- `packages/breadcrumb/src/vaadin-breadcrumb-mixin.js` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] The host element has `role="navigation"`
- [ ] The `<nav>` element has `aria-label` from i18n
- [ ] Separators have `aria-hidden="true"`
- [ ] The `<ol>` has `role="list"`
- [ ] Each `<li>` wrapper has `role="listitem"`
- [ ] The overflow button has an accessible `aria-label`
- [ ] `aria-current="page"` on the current item is correctly nested inside the list structure

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 10: RTL support

**Spec sections:** Key Design Decisions §4 (separator mirroring)
**Requirements:** 18
**Depends on:** 4

Verify and implement RTL support. The default directional chevron separator flips in RTL (CSS `transform: scaleX(-1)` or using a mirrored character). Verify the trail renders right-to-left, focus order mirrors, and the overflow algorithm collapses in the correct direction. Use logical CSS properties throughout.

**Files:**
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.js` (modify)
- `packages/breadcrumb/test/breadcrumb.test.ts` (modify)

**Tests:**
- [ ] In RTL mode, the default separator points leftward (toward child)
- [ ] In RTL mode, items render right-to-left
- [ ] Custom separators (non-directional) are not mirrored in RTL
- [ ] Overflow still functions correctly in RTL (collapse order stays root-first)

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes

---

## Task 11: Base styles completion

**Spec sections:** Implementation → `<vaadin-breadcrumb>` (CSS custom properties), Implementation → `<vaadin-breadcrumb-item>` (CSS custom properties, state attributes)
**Requirements:** —
**Depends on:** 8, 10

Complete the base styles for both elements: all CSS custom property hookups (`--vaadin-breadcrumb-gap`, `--vaadin-breadcrumb-separator-color`, `--vaadin-breadcrumb-item-text-color`, `--vaadin-breadcrumb-item-current-text-color`, `--vaadin-breadcrumb-item-hover-text-color`), state selectors (`:host([current])`, `:host([has-path])`, `:host([overflow])`), forced-colors mode support, `:host([hidden])` display none. Create base visual tests.

**Files:**
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-base-styles.js` (modify)
- `packages/breadcrumb/src/styles/vaadin-breadcrumb-item-base-styles.js` (modify)
- `packages/breadcrumb/test/visual/base/breadcrumb.test.js` (create)

**Tests:**
- [ ] Visual: basic breadcrumb trail renders correctly
- [ ] Visual: breadcrumb with current item shows distinct styling
- [ ] Visual: breadcrumb with overflow shows ellipsis button
- [ ] Visual: breadcrumb with custom separator renders correctly
- [ ] CSS custom properties accept overrides (e.g. setting `--vaadin-breadcrumb-gap` changes spacing)

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `yarn test:base --group breadcrumb` passes
- [ ] `yarn lint` passes

---

## Task 12: Lumo theme

**Spec sections:** (theming, per WEB_COMPONENT_GUIDELINES.md Theming section)
**Requirements:** —
**Depends on:** 11

Create the Lumo theme CSS files. Public CSS file at `packages/vaadin-lumo-styles/components/breadcrumb.css` with injection markers. Implementation CSS file at `packages/vaadin-lumo-styles/src/components/breadcrumb.css` wrapped in `@media lumo_components_breadcrumb`. Apply Lumo design tokens for spacing, typography, and colors. Add Lumo visual tests.

**Files:**
- `packages/vaadin-lumo-styles/components/breadcrumb.css` (create)
- `packages/vaadin-lumo-styles/src/components/breadcrumb.css` (create)
- `packages/breadcrumb/test/visual/lumo/breadcrumb.test.js` (create)

**Tests:**
- [ ] Visual: Lumo breadcrumb renders with Lumo design tokens
- [ ] Visual: Lumo breadcrumb with current item
- [ ] Visual: Lumo breadcrumb with overflow
- [ ] Visual: Lumo breadcrumb with icons

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] `yarn test:lumo --group breadcrumb` passes
- [ ] `yarn lint:css` passes

---

## Task 13: Aura theme

**Spec sections:** (theming, per WEB_COMPONENT_GUIDELINES.md Theming section)
**Requirements:** —
**Depends on:** 11

Create the Aura theme CSS file at `packages/aura/src/components/breadcrumb.css`. Import it in `packages/aura/aura.css`. Use modern CSS features (`:is()`, `:where()`, `light-dark()`). Apply Aura design tokens. Add Aura visual tests.

**Files:**
- `packages/aura/src/components/breadcrumb.css` (create)
- `packages/aura/aura.css` (modify)
- `packages/breadcrumb/test/visual/aura/breadcrumb.test.js` (create)

**Tests:**
- [ ] Visual: Aura breadcrumb renders with Aura design tokens
- [ ] Visual: Aura breadcrumb with current item
- [ ] Visual: Aura breadcrumb with overflow
- [ ] Visual: Aura breadcrumb with icons

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] `yarn test:aura --group breadcrumb` passes
- [ ] `yarn lint:css` passes

---

## Task 14: Integration (dev page, snapshots, type tests, final validation)

**Spec sections:** (all — final verification)
**Requirements:** 1–18 (all universal/web)
**Depends on:** 12, 13

Create the dev page, DOM snapshot tests, and TypeScript type tests. Run final validation across all test suites.

**Files:**
- `dev/breadcrumb.html` (create)
- `packages/breadcrumb/test/dom/breadcrumb.test.js` (create)
- `packages/breadcrumb/test/dom/__snapshots__/breadcrumb.test.snap.js` (create — generated)
- `packages/breadcrumb/test/typings/breadcrumb.types.ts` (create)

**Tests:**
- [ ] DOM snapshot: default breadcrumb with items
- [ ] DOM snapshot: breadcrumb with current item
- [ ] DOM snapshot: breadcrumb item shadow DOM
- [ ] TypeScript: `path` property accepts `string`
- [ ] TypeScript: `current` property accepts `boolean`
- [ ] TypeScript: `items` property accepts correct array type
- [ ] TypeScript: `onNavigate` property accepts correct function type
- [ ] TypeScript: event map includes `navigate` event
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes
- [ ] `yarn test --group breadcrumb` passes
- [ ] `yarn test:snapshots --group breadcrumb` passes
- [ ] `yarn test:base --group breadcrumb` passes
- [ ] `yarn test:lumo --group breadcrumb` passes
- [ ] `yarn test:aura --group breadcrumb` passes

**Acceptance criteria:**
- [ ] All tests pass across all suites
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes
- [ ] Dev page renders correctly with both themes
