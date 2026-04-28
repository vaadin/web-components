# BreadcrumbTrail Implementation Tasks

<!--
Ordered implementation tasks derived from web-component-spec.md. Each task is a self-contained unit of work following test-driven development: define tests first, then implement to make them pass. Each task results in a merge-ready branch.

Primary input: packages/breadcrumb-trail/spec/web-component-spec.md
API context: packages/breadcrumb-trail/spec/web-component-api.md
Traceability: packages/breadcrumb-trail/spec/requirements.md (web requirements 1-12; Flow requirements 13-16 are out of scope here)

Tasks are pointers into the spec, not a second copy of it. The spec sections field tells the implementer where to find the full details. Do not restate shadow DOM structures, property tables, or behavioral logic here.

The implementation skill always runs `yarn test`, `yarn lint`, and `yarn lint:types` after each task — do not add a per-task acceptance-criteria block for those.
-->

## Spec References

- [web-component-spec.md](web-component-spec.md)
- [requirements.md](requirements.md)
- [web-component-api.md](web-component-api.md)
- [figma-design.md](figma-design.md)

---

## Task 1: Package scaffolding and element shells

**Spec sections:** Top-of-file feature flag note. Implementation → Elements (all three element headers).
**Requirements:** —
**Depends on:** —

Create the `packages/breadcrumb-trail/` package with `package.json`, `LICENSE`, `README.md`, root export files (`vaadin-breadcrumb-trail.js`, `vaadin-breadcrumb-item.js`, `vaadin-breadcrumb-trail-overlay.js`) and matching root `.d.ts` files. Add `src/` element shells for each of the three elements with the correct mixin chains (per `WEB_COMPONENT_GUIDELINES.md` §5.4; `<vaadin-breadcrumb-trail-overlay>` extends `OverlayMixin(PositionMixin(...))` plus a placeholder `BreadcrumbTrailOverlayMixin` filled in by Task 10), empty `render()`, `static get is()`, `static get styles()`, and matching `.d.ts` files. Add empty `src/styles/vaadin-{name}-base-styles.js` modules. Set up the test directory layout (`test/`, `test/dom/`, `test/typings/`, `test/visual/{base,lumo,aura}`). Wire the experimental feature flag using the pattern from `@vaadin/component-base/src/define.js` so the elements only register when `window.Vaadin.featureFlags.breadcrumbTrailComponent === true`. Add `dev/breadcrumb-trail.html` with a minimal default trail wrapped in a horizontally resizable container per the Dev Pages guideline.

**Tests:**
- Each of the three element classes exposes the correct `static get is()` value (`vaadin-breadcrumb-trail`, `vaadin-breadcrumb-item`, `vaadin-breadcrumb-trail-overlay`).
- Importing the package with `window.Vaadin.featureFlags.breadcrumbTrailComponent = true` registers all three tag names in `customElements`.
- Importing the package without the feature flag enabled leaves all three tag names unregistered.
- Creating a `<vaadin-breadcrumb-trail>` containing one `<vaadin-breadcrumb-item>` attaches without throwing and exposes a non-null `shadowRoot` on each.
- The dev page at `dev/breadcrumb-trail.html` opens with the feature flag enabled and renders the default trail without console errors.

---

## Task 2: Breadcrumb item link / nolink rendering

**Spec sections:** Implementation → `<vaadin-breadcrumb-item>` (Shadow DOM, both variants). Property table → `path`. Parts table → `link`, `nolink`, `label`. Internal behavior → Link rendering. Discussion → "Why does the non-link rendering carry `part="nolink"`?".
**Requirements:** 1, 2, 3
**Depends on:** 1

Implement the `path` property and the conditional shadow render on `<vaadin-breadcrumb-item>`. When `path` is set, the host renders a single `<a part="link" href="${path}">` wrapper containing `<slot name="prefix"></slot>` and `<span part="label"><slot></slot></span>`. When `path` is unset, the host renders a single `<span part="nolink">` wrapper with the same inner structure. The `prefix` slot is present in both wrapper variants — its `has-prefix` tracking is added in Task 3. The render switches reactively when `path` changes.

**Tests:**
- An item with `path="/x"` has exactly one shadow descendant matching `[part="link"]`, it is an `<a>`, and its `href` resolves to `/x`.
- An item with `path="/x"` has no shadow descendant matching `[part="nolink"]`.
- An item without `path` has exactly one shadow descendant matching `[part="nolink"]`, it is a `<span>`, and no shadow descendant matches `[part="link"]`.
- Both wrapper variants contain a `<span part="label">` whose only child is a default `<slot>`.
- Both wrapper variants contain a `<slot name="prefix">` placed before the `<span part="label">`.
- Light-DOM text content of the item is projected into the `<span part="label">` via the default slot (verified by `slot.assignedNodes()`).
- Setting `path` from `'/x'` to `null` swaps the wrapper from `[part="link"]` to `[part="nolink"]` after one update cycle; setting it back to `'/y'` restores `[part="link"]` with `href` resolving to `/y`.

---

## Task 3: Breadcrumb item prefix slot tracking

**Spec sections:** Implementation → `<vaadin-breadcrumb-item>` → Slots table (`prefix`). State attribute table → `has-prefix`. Internal behavior → Prefix slot.
**Requirements:** 8
**Depends on:** 2

Add a `SlotController` (from `@vaadin/component-base`) on `<vaadin-breadcrumb-item>` that observes the `prefix` slot and toggles the boolean state attribute `has-prefix` on the host: present when the slot has at least one assigned node, absent otherwise.

**Tests:**
- An item with no `slot="prefix"` child has no `has-prefix` attribute on the host.
- An item with a single `slot="prefix"` child (e.g., `<vaadin-icon slot="prefix">`) has the `has-prefix` attribute on the host.
- Removing the only `slot="prefix"` child at runtime removes `has-prefix` from the host within one update cycle.
- Appending a `slot="prefix"` child to an item that previously had none sets `has-prefix` on the host within one update cycle.

---

## Task 4: Container scaffold and root-slot routing

**Spec sections:** Implementation → `<vaadin-breadcrumb-trail>` (Shadow DOM excerpt up to and including `<slot></slot>`, slots table, parts `list`/`overflow`/`overflow-button`). Internal behavior → Slot observation and root assignment (slot routing portion only). Discussion → "Why is the inner list wrapper retained", "How is the overflow element positioned visually between the root and the rest", "Should `SlotChildObserveController` be used to observe item children?".
**Requirements:** 9, 10
**Depends on:** 1

Build the container's shadow DOM up to and including the inner list — `<div role="list" part="list">` containing `<slot name="root"></slot>`, then `<div role="listitem" part="overflow" hidden><button part="overflow-button" aria-haspopup="true" aria-expanded="false"></button></div>`, then `<slot></slot>`. Set `role="navigation"` on the host in `firstUpdated()` if the host has none. Subclass `SlotController` and override `initNode`/`initCustomNode` so that when light-DOM children change, the controller assigns `slot="root"` to the first `<vaadin-breadcrumb-item>` child and removes `slot` from any item that previously held it. The overflow element stays hidden — its visibility is wired in Task 8. The overlay element rendering is added in Task 11.

**Tests:**
- The host of `<vaadin-breadcrumb-trail>` has `role="navigation"` after upgrade (and an explicit `role` set on the host before upgrade is preserved).
- The shadow root contains, in DOM order: `<slot name="root">`, then `<div part="overflow">` with the `hidden` attribute, then a default `<slot>`, all inside a `<div part="list">` with `role="list"`.
- The shadow `<div part="overflow">` contains a `<button part="overflow-button">` with `aria-haspopup="true"` and `aria-expanded="false"`.
- Given a trail with three `<vaadin-breadcrumb-item>` children, the first child has `slot="root"` and the other two have no `slot` attribute.
- Removing the first `<vaadin-breadcrumb-item>` re-routes `slot="root"` to the new first item and removes `slot` from any prior holder within one update cycle.
- Calling `prepend()` with a new `<vaadin-breadcrumb-item>` moves `slot="root"` to the new first item and clears `slot` on the previous holder.
- Calling `replaceChildren()` with three new `<vaadin-breadcrumb-item>` children leaves only the first new item with `slot="root"`.

---

## Task 5: Current page detection and aria-current

**Spec sections:** Implementation → `<vaadin-breadcrumb-trail>` → Internal behavior → Slot observation and root assignment (current re-evaluation portion). Implementation → `<vaadin-breadcrumb-item>` → state attribute table (`current`). Internal behavior → `aria-current="page"`.
**Requirements:** 2, 3, 11
**Depends on:** 2, 4

Extend the container's slot-observation pass (Task 4) so that whenever children change it sets the `current` state attribute on the last `<vaadin-breadcrumb-item>` child if and only if that last child has no `path`, and clears `current` from any item that previously had it. On `<vaadin-breadcrumb-item>`, when the host gains the `current` attribute, set `aria-current="page"` on the inner `<span part="nolink">`; clear it when `current` is removed or when the rendered wrapper is `<a part="link">`.

**Tests:**
- A trail whose last item has no `path` has the `current` attribute set on that last item only; no other item has it.
- A trail where every item has a `path` (current page omitted) has no item with the `current` attribute.
- The current item's shadow `<span part="nolink">` has `aria-current="page"`.
- A non-current item with a `path` (rendered as `<a part="link">`) has no element in its shadow DOM carrying `aria-current`.
- Setting `path` on the previously-current last item clears `current` from it (and clears `aria-current` from its shadow); leaves the trail with no current item.
- Removing the trailing item without `path` moves `current` to the new last item only when that new last item also has no `path`.
- Appending a new `<vaadin-breadcrumb-item>` (without `path`) after the previous current item moves `current` to the new last item and clears it from the previous one.

---

## Task 6: Add chevron-right icon to style-props.js

**Spec sections:** Reuse and Proposed Adjustments → `packages/component-base/src/styles/style-props.js`.
**Requirements:** 4
**Depends on:** 1

Add a `--_vaadin-icon-chevron-right` CSS custom property to `packages/component-base/src/styles/style-props.js` alongside the existing chevron-down icon, using the SVG data URL specified in the spec (right-pointing chevron, viewBox `0 0 24 24`, path `m9 18 6-6-6-6`).

**Tests:**
- After importing `style-props.js`, the computed value of `--_vaadin-icon-chevron-right` on a host element resolves to a value starting with `url(` and containing `data:image/svg+xml`.
- The computed value of `--_vaadin-icon-chevron-right` contains the path data string `m9 18 6-6-6-6`.

---

## Task 7: Item separator rendering

**Spec sections:** Implementation → `<vaadin-breadcrumb-item>` → Internal behavior → Separator rendering (default + last + current rules; RTL flip is deferred to Task 13). Container CSS custom property table → `--vaadin-breadcrumb-trail-separator`. Key Design Decisions → 5 (separator pattern).
**Requirements:** 4, 5
**Depends on:** 2, 6

Add the item's `:host::after` separator pseudo-element to its base styles. Use `background: currentColor` shaped by `mask-image: var(--vaadin-breadcrumb-trail-separator)` with appropriate `mask-size`, `mask-repeat`, and `mask-position` so the separator reads as a glyph next to the label, following the button-base-styles pattern used elsewhere in the repo. Default `--vaadin-breadcrumb-trail-separator` to `var(--_vaadin-icon-chevron-right)`. Hide the separator on `:host(:last-of-type)` and on `:host([current])`. RTL flip is added in Task 13.

**Tests:**
- The computed `mask-image` of the `:host::after` pseudo-element on a default `<vaadin-breadcrumb-item>` resolves to a non-`none` `url(...)` value containing `data:image/svg+xml` and the path data `m9 18 6-6-6-6`.
- Setting `--vaadin-breadcrumb-trail-separator: url('data:image/svg+xml;utf8,<svg/>')` on the parent `<vaadin-breadcrumb-trail>` changes the computed `mask-image` of every item's `:host::after` to that overridden value.
- The last item in a trail has `display: none` (or zero rendered size) on its `:host::after` pseudo-element.
- An item carrying the `current` attribute has `display: none` on its `:host::after` pseudo-element regardless of its position.
- The first non-last item without `current` has a rendered `:host::after` with non-zero box width.

---

## Task 8: Overflow detection and overflow element

**Spec sections:** Implementation → `<vaadin-breadcrumb-trail>` → Internal behavior → Overflow detection, Overflow separator. State attribute table → `has-overflow`. Reuse → `ResizeMixin`. Discussion → "Why is the overflow element positioned visually between the root and the rest" (rationale only).
**Requirements:** 6
**Depends on:** 4, 6

Mix `ResizeMixin` (`@vaadin/component-base/src/resize-mixin.js`) into the container and override `_onResize()`. On resize and on the slot-observation pass from Tasks 4 and 5, measure available width vs. the items' total width and progressively hide items by setting the `data-overflow-hidden` attribute on each one — starting from the first default-slot item closest to the root and moving forward. If still not enough space, also hide the root item. The last item (the one with the `current` attribute, or otherwise the last child if no current) never receives `data-overflow-hidden`. When at least one item is hidden, set the `has-overflow` state attribute on the host and clear the `hidden` attribute on `<div part="overflow">`; otherwise clear both. Add the container's `[part="overflow"]::after` separator using the same `mask-image` + `currentColor` pattern as Task 7 and reading the same `--vaadin-breadcrumb-trail-separator` custom property. RTL flip on the overflow separator is added in Task 13.

**Tests:**
- A trail rendered at a width that fits all items has no item with `data-overflow-hidden`, no `has-overflow` on the host, and `<div part="overflow">` retains the `hidden` attribute.
- Constraining the trail's width so the first two default-slot items no longer fit sets `data-overflow-hidden` on those exact two items (verified by `data-index` markers or DOM-position-after-marker queries) and on no other item, and leaves the root and last item unaffected.
- When any item is hidden, the host gains `has-overflow` and `<div part="overflow">` loses `hidden`.
- Reducing the width further until even the root item must collapse sets `data-overflow-hidden` on the root item; the last item still does not have it.
- Restoring the trail's width to fit everything clears `data-overflow-hidden` from every item and removes `has-overflow` from the host.
- Replacing the trail's children via `replaceChildren()` with a shorter trail that fits clears all `data-overflow-hidden` markers and removes `has-overflow`.
- The container's `[part="overflow"]::after` pseudo-element resolves to a non-zero rendered size when `has-overflow` is set, and its computed `mask-image` matches the value of `--vaadin-breadcrumb-trail-separator` (verified by overriding the custom property and re-reading `mask-image`).

---

## Task 9: i18n.moreItems for the overflow button

**Spec sections:** Implementation → `<vaadin-breadcrumb-trail>` → Property table (`i18n`). Reuse → `I18nMixin`. Key Design Decisions → 6 (final paragraph on `I18nMixin`).
**Requirements:** 7, 10
**Depends on:** 8

Apply `I18nMixin` to `<vaadin-breadcrumb-trail>` with the default `i18n = { moreItems: '' }`. Bind the overflow button's `aria-label` to `i18n.moreItems`. The default empty string is intentional — applications must supply the label to localize it.

**Tests:**
- The overflow button (`button[part="overflow-button"]`) has `aria-label=""` by default.
- Setting `breadcrumb.i18n = { moreItems: 'Show hidden items' }` updates the overflow button's `aria-label` to `'Show hidden items'` after one update cycle.
- Updating only the `moreItems` key by spreading the existing `i18n` object updates the button's `aria-label` to the new string.

---

## Task 10: BreadcrumbTrailOverlay element and BreadcrumbTrailOverlayMixin

**Spec sections:** Implementation → `<vaadin-breadcrumb-trail-overlay>` (entire section). Reuse → `OverlayMixin`, `PositionMixin`, reference to `SelectOverlayMixin` for `_rendererRoot`.
**Requirements:** 7
**Depends on:** 1

Replace the placeholder mixin from Task 1 with a real `BreadcrumbTrailOverlayMixin` (mirroring the pattern of `<vaadin-combo-box-overlay>`'s `ComboBoxOverlayMixin` and `<vaadin-menu-bar-overlay>`'s `MenuOverlayMixin`). The mixin carries any breadcrumb-specific overlay behavior — most notably overriding `_rendererRoot` to resolve to the host of the light-DOM container projected through the overlay's default slot, mirroring `SelectOverlayMixin`. Implement the overlay's shadow DOM as `<div part="overlay"><div part="content" role="list"><slot></slot></div></div>`. The element exposes no public properties of its own — `opened`, `owner`, `renderer`, `positionTarget`, top-layer rendering via the popover API, outside-click closing, Escape closing, focus trapping, and stacking are inherited from `OverlayMixin` + `PositionMixin` and not re-implemented.

**Tests:**
- `<vaadin-breadcrumb-trail-overlay>` is registered and its prototype chain exposes the inherited `opened`, `owner`, `renderer`, and `positionTarget` accessors from `OverlayMixin` + `PositionMixin`.
- The overlay's shadow root contains `<div part="overlay">` whose only child is `<div part="content" role="list">` whose only child is a default `<slot>`.
- Setting `opened = true` on the overlay sets `popover="manual"` on the host and the host matches `:popover-open` once attached to the document.
- With a light-DOM `<div>` slotted through the overlay's default slot, `_rendererRoot` returns that slotted host (not the overlay's shadow `[part="content"]`).
- A `renderer` callback assigned to the overlay writes its appended children into the slotted light-DOM host (queryable via the slotted element's own descendants), and the overlay's shadow `[part="content"]` contains only the default `<slot>` element.

---

## Task 11: Overflow overlay activation

**Spec sections:** Implementation → `<vaadin-breadcrumb-trail>` (Shadow DOM excerpt covering `<vaadin-breadcrumb-trail-overlay>` and `<slot name="overlay">`). Internal behavior → Overlay management. Parts table re-export note (`exportparts="overlay, content: overlay-content"`). Discussion → "Why expose the `overlay` and `content` parts on the breadcrumb host", "Why is the overlay's `content` part re-exported as `overlay-content`".
**Requirements:** 7
**Depends on:** 8, 10

Render `<vaadin-breadcrumb-trail-overlay>` directly in the container's shadow DOM, alongside the inner list. Bind `.owner` to the host, `.opened` to an internal reactive `_overlayOpened`, `.positionTarget` to the overflow button, and `.renderer` to a callback that writes one `<vaadin-breadcrumb-item>` per item currently carrying `data-overflow-hidden` into the overlay's light-DOM root via `<slot name="overlay">`. Each rendered overlay item carries the same `path` and label text as the corresponding hidden item (preserving original DOM order). Apply `exportparts="overlay, content: overlay-content"` on the overlay element. Clicking the overflow button toggles `_overlayOpened` and updates the button's `aria-expanded` (`true`/`false`). Outside-click and Escape closing are inherited from `OverlayMixin`.

**Tests:**
- Clicking the overflow button while at least one item is hidden sets `_overlayOpened` to `true` and the button's `aria-expanded` to `"true"`.
- The opened overlay's slotted light-DOM container contains exactly one `<vaadin-breadcrumb-item>` for each light-DOM item carrying `data-overflow-hidden`, in the original DOM order, each with the matching `path` attribute and matching default-slot text.
- The rendered overlay items appear inside the slotted light-DOM host (queryable via `.querySelectorAll('vaadin-breadcrumb-item')` on that host) and not inside the overlay's shadow `[part="content"]`.
- Clicking outside the overlay sets `_overlayOpened` to `false` and the overflow button's `aria-expanded` to `"false"`.
- Clicking the overflow button while the overlay is open closes it (`_overlayOpened` becomes `false`).
- The breadcrumb's `vaadin-breadcrumb-trail::part(overlay)` selector reaches the overlay's `<div part="overlay">` and `vaadin-breadcrumb-trail::part(overlay-content)` reaches the overlay's `<div part="content">` (verified by setting a marker style via those selectors and reading the matched elements' computed styles).
- The overlay element's `positionTarget` property equals the overflow button reference once the trail has rendered.

---

## Task 12: Overlay keyboard navigation

**Spec sections:** Implementation → `<vaadin-breadcrumb-trail-overlay>` → Internal behavior → Keyboard interaction within the open overlay. Discussion → "Why does the overflow overlay support both arrow keys and Tab?". Implementation → `<vaadin-breadcrumb-trail>` → Shadow DOM excerpt (overflow element placed in DOM between root and rest, supporting tab order claim).
**Requirements:** 7, 10
**Depends on:** 11

Inside the open overlay, support menu-style keyboard navigation alongside Tab: ArrowDown/ArrowUp move focus between adjacent links inside the overlay; Home/End move focus to the first/last link; Tab continues the document tab cycle without trapping focus inside the overlay; Escape closes the overlay (sets `_overlayOpened = false`) and restores focus to the overflow button. The overflow button itself remains in the document tab cycle between the root item and the first remaining default-slot item, because shadow DOM order places it there (Task 4).

**Tests:**
- With the overlay open and focus on the first overlay link, ArrowDown moves focus to the second overlay link.
- With the overlay open and focus on the second overlay link, ArrowUp moves focus to the first overlay link.
- With the overlay open and focus on a middle overlay link, Home moves focus to the first overlay link and End moves focus to the last overlay link.
- With the overlay open and focus on an overlay link, pressing Tab moves focus to the next focusable element after the overlay's links in document order — focus is not trapped inside the overlay.
- Pressing Escape with the overlay open closes the overlay (`_overlayOpened` becomes `false`) and restores focus to the overflow button (`document.activeElement` equals the overflow button).
- Starting from the root item link in a trail with overflow active and pressing Tab, focus reaches the overflow button before reaching the next visible item link.

---

## Task 13: RTL support

**Spec sections:** Key Design Decisions → 5 (RTL flip clause). Implementation → `<vaadin-breadcrumb-item>` → Internal behavior → RTL separator flip. Implementation → `<vaadin-breadcrumb-trail>` → Internal behavior → Overflow separator (RTL flip clause).
**Requirements:** 12
**Depends on:** 7, 8

Add `transform: scaleX(-1)` to the item's `:host::after` separator and to the container's `[part="overflow"]::after` separator when the host is in an RTL context (using `:host(:dir(rtl))::after` or the `[dir="rtl"]` ancestor selector consistent with this repo's convention). Verify the rest of the component CSS uses logical properties (`margin-inline-*`, `padding-inline-*`, `inset-inline-*`) for any directional spacing on the inner list, item structure, and separator pseudo-elements — no physical `margin-left/right`, `padding-left/right`, or `left/right` for these selectors.

**Tests:**
- An item inside `<html dir="rtl">` (or wrapped in `[dir="rtl"]`) has a computed `transform` on `:host::after` that maps to a horizontal mirror (matrix with `scaleX(-1)` or equivalent `-1 0 0 1` x-component).
- The same item in LTR has computed `transform: none` on `:host::after`.
- The container's `[part="overflow"]::after` computed `transform` is mirrored in RTL and `none` in LTR.
- The base CSS source for `[part="list"]`, `[part="overflow"]`, `:host::after`, and `[part="overflow"]::after` contains no occurrences of `margin-left`, `margin-right`, `padding-left`, `padding-right`, `left:`, or `right:` (verified by parsing the styles modules).
- Tab order through a trail in RTL traverses visible items in DOM order — which matches right-to-left visual order automatically because DOM order is preserved.

---

## Task 14: Base styles completion and base visual tests

**Spec sections:** Implementation → `<vaadin-breadcrumb-trail>` (parts, state attributes). Implementation → `<vaadin-breadcrumb-item>` (parts, state attributes). figma-design.md → Variant Mapping (state visuals).
**Requirements:** 1, 2, 4, 6, 7, 8, 11
**Depends on:** 7, 8, 11

Complete both elements' base styles (`src/styles/vaadin-breadcrumb-trail-base-styles.js`, `src/styles/vaadin-breadcrumb-item-base-styles.js`). Add full state styling: hover/focus/focus-ring/active rules for `[part="link"]` and `[part="overflow-button"]` using design tokens (`--vaadin-focus-ring-color`, `--vaadin-focus-ring-width`); `[part="nolink"]` carries the visual hook for the current-page distinction; layout rules for the inner `[part="list"]` (logical-property gap and alignment); `[part="overflow-button"]` zero vertical padding per the "Inline buttons in a flex row" rule; forced-colors-mode (`@media (forced-colors: active)`) rules so links, the focus ring, and the overflow button remain perceivable without color reliance. Reference figma-design.md for the visual targets of link hover/focus/active states and the overflow button hover background. Add base visual tests at `test/visual/base/breadcrumb-trail.test.js`.

**Tests:**
- Visual snapshot: default trail with four items, last item without `path`.
- Visual snapshot: trail with overflow active (constrained-width container with seven items).
- Visual snapshot: trail where each item has a prefix icon.
- Visual snapshot: trail with the first link focused via keyboard (focus-ring visible).
- Visual snapshot: trail with overflow active and the overflow button focused via keyboard.
- Visual snapshot: trail with overflow active and the overlay opened, showing collapsed item links.
- Visual snapshot: default trail rendered with `dir="rtl"`.

---

## Task 15: Lumo theme

**Spec sections:** Reference only — Implementation parts/state attributes (theming targets). figma-design.md → Design Token Bindings → Lumo.
**Requirements:** 1, 2, 4, 6, 7, 8, 11
**Depends on:** 14

Create `packages/vaadin-lumo-styles/components/breadcrumb-trail.css` (public file with `@media lumo_components_breadcrumb_trail` injection markers) and `packages/vaadin-lumo-styles/src/components/breadcrumb-trail.css` (implementation file wrapped in the same `@media` query). Bind to Lumo tokens per figma-design.md → Lumo bindings — `--lumo-body-text-color` for current/label text, `--lumo-primary-text-color` for link text and focus-ring color, `--lumo-contrast-50pct` for separator color, `--lumo-space-s` for item gap, `--lumo-font-size-m` and `--lumo-line-height-m` for typography, `--lumo-font-family`. Wire link hover/focus/active visuals (underline, darker text colors) per figma-design.md states. Register the import in the Lumo theme entry. Add Lumo visual tests at `packages/breadcrumb-trail/test/visual/lumo/breadcrumb-trail.test.js`.

**Tests:**
- Lumo visual snapshot: default trail.
- Lumo visual snapshot: trail with overflow active.
- Lumo visual snapshot: trail with prefix icons.
- Lumo visual snapshot: link hover state (mouse over the first link).
- Lumo visual snapshot: link keyboard-focus state (Tab to the first link).
- Lumo visual snapshot: trail with overflow active and the overlay opened.

---

## Task 16: Aura theme

**Spec sections:** Reference only — Implementation parts/state attributes (theming targets). figma-design.md → Design Token Bindings → Aura.
**Requirements:** 1, 2, 4, 6, 7, 8, 11
**Depends on:** 14

Create `packages/aura/src/components/breadcrumb-trail.css` per Aura conventions (`:is()`, `:where()`, `light-dark()`, `oklch()` where appropriate). Bind to Aura tokens per figma-design.md → Aura bindings — `--aura-neutral` for current/label text, `--aura-accent-text-color` for link text, secondary-text color for separators, accent-derived focus-ring color, `--aura-font-size-m` (14px) and `--aura-line-height-m` for typography, `--aura-font-family`, `--vaadin-radius-s` for the focus-ring/hover-background corner radius. Import the new CSS in `packages/aura/aura.css`. Add Aura visual tests at `packages/breadcrumb-trail/test/visual/aura/breadcrumb-trail.test.js`.

**Tests:**
- Aura visual snapshot: default trail.
- Aura visual snapshot: trail with overflow active.
- Aura visual snapshot: trail with prefix icons.
- Aura visual snapshot: link hover state.
- Aura visual snapshot: link keyboard-focus state.
- Aura visual snapshot: trail with overflow active and the overlay opened.

---

## Task 17: Integration, snapshots, type tests, and final validation

**Spec sections:** All — final review pass.
**Requirements:** 1–12
**Depends on:** 15, 16

Final review of `dev/breadcrumb-trail.html`: ensure every major variant exercised by the feature tasks is present — default trail, trail with current omitted, overflow-active trail in a horizontally resizable container, prefix-icons trail, custom-separator trail, and a trail with `aria-label` on the host. Add DOM snapshot tests at `test/dom/breadcrumb-trail.test.js` (host + shadow snapshots for default, has-overflow, current-omitted) and `test/dom/breadcrumb-item.test.js` (host + shadow snapshots for link, nolink, has-prefix, current). Add TypeScript type tests at `test/typings/breadcrumb-trail.types.ts` covering `path`, `i18n`, and the global `HTMLElementTagNameMap` augmentation. Run `yarn lint`, `yarn lint:types`, `yarn test --group breadcrumb-trail`, `yarn test:snapshots --group breadcrumb-trail`, `yarn test:base --group breadcrumb-trail`, `yarn test:lumo --group breadcrumb-trail`, `yarn test:aura --group breadcrumb-trail`.

**Tests:**
- DOM snapshot: default trail (three items, last without `path`) — host and shadow.
- DOM snapshot: trail with overflow active — host and shadow.
- DOM snapshot: trail with current omitted (every item has a `path`) — host and shadow.
- DOM snapshot: item with `path` set — host and shadow.
- DOM snapshot: item without `path` — host and shadow.
- DOM snapshot: item with prefix-slot content — host and shadow.
- DOM snapshot: item with the `current` attribute set — host and shadow.
- Type test: `BreadcrumbItem['path']` is assignable from `string | null | undefined` and not from `number`.
- Type test: `BreadcrumbTrail['i18n']` accepts `{ moreItems: string }` and not `{ moreItems: number }`.
- Type test: `customElements.get('vaadin-breadcrumb-trail')` resolves to a constructor whose prototype is `BreadcrumbTrail`, and the same for `vaadin-breadcrumb-item` and `vaadin-breadcrumb-trail-overlay`.
- Dev page renders the default, current-omitted, overflow, prefix-icons, custom-separator, and labelled-landmark variants without console errors.
