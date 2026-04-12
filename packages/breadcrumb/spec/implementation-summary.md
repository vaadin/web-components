# Breadcrumb Implementation Summary

**Branch:** `breadcrumb-with-yuriy-v1`
**Date:** 2026-04-12
**Commits:** 17 (local only, not pushed)

---

## Commit Log

| # | Commit | Title |
|---|--------|-------|
| 1 | `a936ba30bf` | feat(breadcrumb): task 1 — package scaffolding and element registration |
| 2 | `e81f48c7fc` | feat(breadcrumb): task 2 — BreadcrumbItem path property and link rendering |
| 3 | `a6a785612d` | feat(breadcrumb): task 3 — BreadcrumbItem separator rendering |
| 4 | `4d72fb15c2` | feat(breadcrumb): task 4 — BreadcrumbItem truncation and tooltip |
| 5 | `fb72fad116` | feat(breadcrumb): task 5 — child observation and current-item detection |
| 6 | `7d38e4e7e3` | feat(breadcrumb): task 6 — separator distribution |
| 7 | `0574abf3e1` | feat(breadcrumb): task 7 — items property |
| 8 | `5b6e99a8bb` | feat(breadcrumb): task 8 — overflow management and BreadcrumbOverlay |
| 9 | `b6a70806fd` | feat(breadcrumb): task 9 — mobile mode |
| 10 | `66aa9edfc4` | feat(breadcrumb): task 10 — onNavigate click handling |
| 11 | `42230f6531` | feat(breadcrumb): task 11 — accessibility ARIA roles and attributes |
| 12 | `4cccebf62f` | feat(breadcrumb): task 12 — keyboard navigation |
| 13 | `09902511c3` | feat(breadcrumb): task 13 — RTL support |
| 14 | `cd54fb5980` | feat(breadcrumb): task 14 — base styles completion |
| 15 | `4befaeca8a` | feat(breadcrumb): task 15 — Lumo theme |
| 16 | `ea0796441c` | feat(breadcrumb): task 16 — Aura theme |
| 17 | `409a344e17` | feat(breadcrumb): task 17 — dev page, snapshot tests, type tests, and final validation |

---

## Phases

### Phase 1 — Scaffolding

**Task 1: Package scaffolding and element registration**
- Created `@vaadin/breadcrumb` package with full directory structure
- Three elements registered: `<vaadin-breadcrumb>`, `<vaadin-breadcrumb-item>`, `<vaadin-breadcrumb-overlay>`
- Correct mixin chains from spec: `BreadcrumbMixin`, `SlotStylesMixin`, `ElementMixin`, `ThemableMixin`, `PolylitMixin`, `LumoInjectionMixin`, `DisabledMixin`, `OverlayMixin`, `PositionMixin`, `DirMixin`
- Experimental feature flag: `window.Vaadin.featureFlags.breadcrumbComponent`
- 22 files created (source, TypeScript definitions, styles, test)

### Phase 2 — Core Features

**Task 2: BreadcrumbItem — path property and link rendering**
- `path`, `disabled`, `current` properties with full state matrix
- `<a part="link">` with computed `href` and `tabindex`
- Read-only `current` property via `_setCurrent()` protected method
- `DisabledMixin` integration

**Task 3: BreadcrumbItem — separator rendering**
- `<span part="separator" aria-hidden="true">` with default chevron (`›`)
- `_customSeparator` protected property for container-distributed custom separators
- `first` attribute hides separator on first item via CSS

**Task 4: BreadcrumbItem — truncation and tooltip**
- CSS truncation: `text-overflow: ellipsis`, `max-width: var(--vaadin-breadcrumb-item-max-width, 12em)`
- `ResizeObserver` sets native `title` attribute when text is truncated
- `TooltipController` integration for `<vaadin-tooltip>` via `tooltip` slot

**Task 5: Breadcrumb — child observation and current-item detection**
- `<div part="list" role="list">` wrapping `<slot>` for items
- `SlotController` with `{ observe: true, multiple: true }` for child tracking
- Three-step current-item algorithm: no-path item → `matchPaths()` URL match → no current
- `location` property as opaque change trigger
- `location.js` testability facade (following `vaadin-side-nav` pattern)
- `popstate` and `vaadin-navigated` window event listeners

**Task 6: Breadcrumb — separator distribution**
- `separator` named slot in hidden `aria-hidden="true"` container
- Clones custom separator for each item via `_customSeparator`
- `first` attribute management on first visible item

**Task 7: Breadcrumb — items property**
- `items` array property generates `<vaadin-breadcrumb-item>` in light DOM
- Generated items identified by `[data-breadcrumb-generated]` attribute
- Supports `{label, path?, disabled?}` entries
- Replaces previously generated items; coexists with declarative children

**Task 8: Breadcrumb — overflow management and BreadcrumbOverlay**
- `ResizeObserver` on list container for overflow detection
- Intermediate items collapsed with `overflow-hidden` attribute
- CSS `order` positioning: first item (0), overflow button (1), trailing items (2)
- `SlotStylesMixin` injects `::slotted([overflow-hidden]) { display: none !important }` styles
- `<vaadin-breadcrumb-overlay>` with `OverlayMixin` + `PositionMixin`
- Overflow dropdown with `role="menu"` and `role="menuitem"` links
- `i18n` property with default `{overflow: 'Show more'}`
- Keyboard navigation: ArrowUp/Down, Escape, Enter, Home/End

**Task 9: Breadcrumb — mobile mode**
- When container is too narrow for first + overflow + last items
- `[mobile]` attribute on host triggers mobile render path
- `<a part="back-link">` with `<span part="back-arrow">` + parent label
- Parent = last item with `path` that is not current
- Items remain in hidden slot for data access

**Task 10: Breadcrumb — onNavigate click handling**
- `onNavigate` callback property for SPA routing integration
- Click interception via `composedPath()` on item links, overflow menu links, and mobile back-link
- Pass-through for modifier keys (`metaKey`, `shiftKey`), external links, `[router-ignore]` items
- `onNavigate({ path, current, originalEvent })` — returns `false` to allow default navigation

### Phase 3 — Cross-Cutting Concerns

**Task 11: Accessibility — ARIA roles, attributes, and announcements**
- Container: `role="navigation"`, `aria-label="Breadcrumb"` (developer-overridable)
- List: `role="list"`
- Items: `role="listitem"`, `aria-current="page"` when current
- Overflow button: `aria-haspopup="true"`, `aria-expanded` reflecting overlay state
- Overflow menu: `role="menu"` with `role="menuitem"` entries
- Separators: `aria-hidden="true"`

**Task 12: Keyboard navigation**
- Tab order: interactive links (tabindex 0), overflow button (tabindex 0)
- Non-interactive items (current, disabled, no path) excluded from tab order
- Overflow menu: Enter/Space/ArrowDown opens, ArrowUp/Down navigates, Escape closes, Enter activates

**Task 13: RTL support**
- `DirMixin` propagates `dir` attribute
- All CSS uses direction-agnostic properties (flex, order)
- Chevron separator mirrored via `scale: -1` in `[dir="rtl"]`
- Back-arrow and overflow separator also mirrored in RTL

### Phase 4 — Styling

**Task 14: Base styles completion**
- CSS custom property hookups: `--vaadin-breadcrumb-gap`, `--vaadin-breadcrumb-font-size`, `--vaadin-breadcrumb-text-color`, `--vaadin-breadcrumb-current-text-color`, `--vaadin-breadcrumb-separator-color`
- Links distinguished from current page by underline (not color alone)
- `@media (forced-colors: active)` support
- State selectors: `:host([disabled])`, `:host([current])`, `:host([mobile])`, `:host([first])`
- 6 base visual tests

**Task 15: Lumo theme**
- 6 CSS files: public entry points + implementation files with Lumo token bindings
- Tokens: `--lumo-font-size-s`, `--lumo-primary-text-color`, `--lumo-body-text-color`, `--lumo-secondary-text-color`, `--lumo-space-xs`
- Focus ring via Lumo focus ring variables
- 7 Lumo visual tests

**Task 16: Aura theme**
- 3 CSS files using modern syntax (`:is()`, `:where()`, `light-dark()`, `oklch()`)
- Aura typography tokens, accent color hover states, transitions
- Imports added to `packages/aura/aura.css`
- 7 Aura visual tests

### Phase 5 — Integration

**Task 17: Dev page, snapshot tests, type tests, and final validation**
- `dev/breadcrumb.html` with all variants (basic, custom separator, disabled, overflow, mobile, items, onNavigate, RTL)
- 10 DOM snapshot tests covering both elements in all states
- TypeScript type tests verifying property types, mixin interfaces, `HTMLElementTagNameMap`
- Final validation: all unit tests, snapshot tests, lint, and type checks passing

---

## Test Coverage

| Suite | Count |
|-------|-------|
| Unit tests (`breadcrumb.test.ts` + `breadcrumb-item.test.ts`) | 146+ |
| DOM snapshot tests | 10 |
| Base visual tests | 6 |
| Lumo visual tests | 7 |
| Aura visual tests | 7 |
| TypeScript type tests | 1 file |

---

## Files Created/Modified

### New package: `packages/breadcrumb/`
- `package.json`, `LICENSE`, `README.md`
- `vaadin-breadcrumb.js`, `vaadin-breadcrumb.d.ts`
- `vaadin-breadcrumb-item.js`, `vaadin-breadcrumb-item.d.ts`
- `src/vaadin-breadcrumb.js`, `src/vaadin-breadcrumb.d.ts`
- `src/vaadin-breadcrumb-mixin.js`, `src/vaadin-breadcrumb-mixin.d.ts`
- `src/vaadin-breadcrumb-item.js`, `src/vaadin-breadcrumb-item.d.ts`
- `src/vaadin-breadcrumb-overlay.js`, `src/vaadin-breadcrumb-overlay.d.ts`
- `src/location.js`, `src/location.d.ts`
- `src/styles/vaadin-breadcrumb-base-styles.js`, `.d.ts`
- `src/styles/vaadin-breadcrumb-item-base-styles.js`, `.d.ts`
- `src/styles/vaadin-breadcrumb-overlay-base-styles.js`, `.d.ts`
- `test/breadcrumb.test.ts`, `test/breadcrumb-item.test.ts`
- `test/dom/breadcrumb.test.js`, `test/dom/__snapshots__/breadcrumb.test.snap.js`
- `test/typings/breadcrumb.types.ts`
- `test/visual/base/breadcrumb.test.js`
- `test/visual/lumo/breadcrumb.test.js`
- `test/visual/aura/breadcrumb.test.js`

### Lumo theme: `packages/vaadin-lumo-styles/`
- `components/breadcrumb.css`, `components/breadcrumb-item.css`, `components/breadcrumb-overlay.css`
- `src/components/breadcrumb.css`, `src/components/breadcrumb-item.css`, `src/components/breadcrumb-overlay.css`

### Aura theme: `packages/aura/`
- `src/components/breadcrumb.css`, `src/components/breadcrumb-item.css`, `src/components/breadcrumb-overlay.css`
- `aura.css` (modified — added imports)

### Dev page
- `dev/breadcrumb.html`

---

## Remaining Work

- **Visual test baselines**: Run `yarn update:base --group breadcrumb`, `yarn update:lumo --group breadcrumb`, `yarn update:aura --group breadcrumb` in a Docker environment to generate reference screenshots
- **Not pushed**: All commits are local on `breadcrumb-with-yuriy-v1`
