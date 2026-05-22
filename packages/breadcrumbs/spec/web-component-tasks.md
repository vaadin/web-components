# Breadcrumbs Implementation Tasks

<!--
Ordered implementation tasks derived from web-component-spec.md. Each task is a
self-contained unit of work that follows test-driven development: define tests
first, then implement to make them pass. Each task results in a merge-ready
branch.

Primary input: packages/breadcrumbs/spec/web-component-spec.md
API context: packages/breadcrumbs/spec/web-component-api.md
Traceability: packages/breadcrumbs/spec/requirements.md
Visual reference: packages/breadcrumbs/spec/figma-design.md

Requirements 13–16 in requirements.md are Flow-track features and are covered
by flow-tasks.md; they intentionally do not appear in any task below.

Tasks are pointers into the spec, not a second copy of it. The spec sections
field tells the implementer where to find the full details.

Each task delivers user-visible value. There are no scaffolding-only tasks
("add this hook now, fill it in later"). When the work for a feature is small
and only useful as a unit, it lives in one task — even if that makes the task
larger — rather than splitting into landing-with-no-effect intermediate steps.
-->

## Spec References

- [web-component-spec.md](web-component-spec.md)
- [requirements.md](requirements.md)
- [web-component-api.md](web-component-api.md)
- [figma-design.md](figma-design.md)

---

## Task 1: Package scaffolding and element shells

**Spec sections:** Elements (all three)
**Requirements:** —
**Depends on:** —

Create the `packages/breadcrumbs/` package with `package.json`, `LICENSE`, `README.md`, and the public entry files `vaadin-breadcrumbs.js`/`.d.ts` and `vaadin-breadcrumbs-item.js`/`.d.ts`. Under `src/`, create the implementation files for the three elements `<vaadin-breadcrumbs>`, `<vaadin-breadcrumbs-item>`, and `<vaadin-breadcrumbs-overlay>` (each with the correct mixin chain per the spec — `ResizeMixin`+`I18nMixin`+`ElementMixin` for the container; `OverlayMixin`+`PositionMixin`+`DirMixin` over `PolylitMixin`+`LumoInjectionMixin` for the overlay, with `_shouldCloseOnOutsideClick` and `_contentRoot` inlined on the class; `ThemableMixin` is intentionally excluded — it is deprecated for new components per the in-repo guidelines), `static get is`, `static get experimental` returning `'breadcrumbsComponent'`, and an empty `render()`. Create `src/styles/` with base-styles files for the container and the item, and a minimal `dev/breadcrumbs.html` that imports the entry and renders one default trail. Include a basic smoke test asserting both elements register and produce a shadow root behind the experimental flag.

**Tests:**
- `customElements.get('vaadin-breadcrumbs')` returns a constructor after the entry is imported with the experimental flag enabled
- `customElements.get('vaadin-breadcrumbs-item')` returns a constructor after the entry is imported with the experimental flag enabled
- `customElements.get('vaadin-breadcrumbs-overlay')` returns a constructor after the entry is imported with the experimental flag enabled
- A `<vaadin-breadcrumbs>` instance attaches a shadow root without throwing when added to the DOM
- A `<vaadin-breadcrumbs-item>` instance attaches a shadow root without throwing when added to the DOM
- Importing the public entry without setting `window.Vaadin.featureFlags.breadcrumbsComponent` does not register the elements

---

## Task 2: BreadcrumbsItem — link vs non-link rendering with `path`

**Spec sections:** `<vaadin-breadcrumbs-item>` Shadow DOM, `path` property, parts (`link`, `nolink`, `label`), Internal behavior → Link rendering
**Requirements:** 1, 2
**Depends on:** 1

Implement the `path` property on `<vaadin-breadcrumbs-item>` and the conditional shadow DOM: when `path` is set, render `<a href="${path}" part="link">` containing the `prefix` slot and a `<span part="label">` wrapping the default slot; when `path` is unset, render `<span part="nolink">` with the same inner structure. The two cases share the inner `label` part but use distinct outer parts so themes can target them without `:not([path])` selectors. The rendered `<a>` is a plain link with no router or click interception (see web-component-api.md §1).

**Tests:**
- Setting `path="/foo"` causes the host's shadow DOM to contain exactly one `[part="link"]` `<a>` element with `href="/foo"` and no `[part="nolink"]` element
- Removing `path` (setting to `null`/`undefined`) causes the host's shadow DOM to contain exactly one `[part="nolink"]` `<span>` element with no `href` attribute and no `[part="link"]` element
- Both renderings contain a `[part="label"]` element wrapping the default `<slot>`
- Updating `path` from one value to another updates the rendered `<a>`'s `href` to the new value
- Slotted text content shows up inside `[part="label"]` regardless of which outer part is rendered

---

## Task 3: BreadcrumbsItem — `prefix` slot and `has-prefix` reflection

**Spec sections:** `<vaadin-breadcrumbs-item>` Slot table (`prefix`), Internal behavior → Prefix slot, state attribute `has-prefix`
**Requirements:** 8
**Depends on:** 2

Add the `prefix` slot to both shadow-DOM branches of `<vaadin-breadcrumbs-item>` (link and nolink) and use a `SlotController` to observe its content, toggling the `has-prefix` host attribute when the slot has assigned nodes. The slot lets applications place an icon (typically `<vaadin-icon>`) before the label.

**Tests:**
- An item with no `slot="prefix"` child has no `has-prefix` attribute on the host
- Adding a child element with `slot="prefix"` to an item sets `has-prefix` on the host
- Removing the only `slot="prefix"` child clears `has-prefix` from the host
- The prefix slot is present in the shadow DOM both when `path` is set (link branch) and when it is not (nolink branch)

---

## Task 4: BreadcrumbsItem — `current` state and `aria-current="page"`

**Spec sections:** `<vaadin-breadcrumbs-item>` state attribute `current`, Internal behavior → `aria-current="page"`
**Requirements:** 11
**Depends on:** 2

When the host carries the `current` state attribute (set by the parent `<vaadin-breadcrumbs>`), apply `aria-current="page"` to the inner `[part="nolink"]` element. The `current` attribute itself is set by the parent — the item only reacts to it. The attribute must not appear in the link branch.

**Tests:**
- Setting `current` on an item without `path` adds `aria-current="page"` to its inner `[part="nolink"]` element
- Removing `current` from such an item removes `aria-current` from the inner element
- An item that has `path` set and is given `current` does not render any `aria-current` (the link branch never carries it because `current` is logically only set on the no-path last item — the test guards against the parent setting it incorrectly)

---

## Task 5: Render the trail

**Spec sections:** `<vaadin-breadcrumbs>` Shadow DOM (the `[part="list"]` block only), parts (`list`), Internal behavior → Slot observation (current marking only), `<vaadin-breadcrumbs-item>` Internal behavior → Separator rendering, CSS Custom Property `--vaadin-breadcrumbs-separator`, Reuse → `style-props.js`
**Requirements:** 1, 2, 3, 4, 5, 9, 10, 11
**Depends on:** 4

**User value:** Application authors can write `<vaadin-breadcrumbs aria-label="…">` with `<vaadin-breadcrumbs-item>` children and see a working horizontal trail with chevron separators between items, the last (current) item rendered as plain text with `aria-current="page"`, and proper `role="navigation"` / `role="list"` / `role="listitem"` semantics. Trail-only apps that fit in the available width can ship the component as-is. RTL, Lumo/Aura theming, and overflow ship in later tasks.

Implement `<vaadin-breadcrumbs>` with the minimal shadow DOM `<div role="list" part="list"><slot></slot></div>` and `role="navigation"` on the host (set in `firstUpdated()` only if absent, matching `<vaadin-side-nav>`). Add a host-side observer that maintains the `current` state attribute on the last `<vaadin-breadcrumbs-item>` child iff its `path == null` — call `_setCurrent(true|false)` (PolylitMixin's `readOnly` setter is a no-op for direct attribute toggling). Use a `MutationObserver({ childList: true, subtree: true, attributeFilter: ['path'] })` on the host so adding, removing, and `path`-mutating items all trigger re-evaluation. No `slot="root"`, no overflow placeholder, no overlay tag, no `i18n` plumbing — those are added by Task 9 when overflow lands.

Add the item separator: `:host::after` on `<vaadin-breadcrumbs-item>` using `mask-image: var(--vaadin-breadcrumbs-separator)` with default `var(--_vaadin-icon-chevron-right)`, `background: currentColor`, `display: inline-block`. Hide it on `:host(:last-of-type)` and `:host([current])`. Add `--_vaadin-icon-chevron-right` to `packages/component-base/src/styles/style-props.js` alongside `--_vaadin-icon-chevron-down`, using the inline SVG given in the spec — the breadcrumb separator is its first consumer. Set up the breadcrumbs flex layout using logical CSS properties (`gap`, `padding-inline`, `margin-inline`) so RTL flips for free in Task 6. Include a `forced-colors: active` block ensuring the separator and any focus indicators remain visible.

Add base visual tests for the default trail (three items, last without `path`).

**Tests:**
- The host has `role="navigation"` after upgrade
- Items render in document order, distributed through the default slot
- The last item without `path` carries `current` and its inner `[part="nolink"]` carries `aria-current="page"`; no other item does
- The last item with `path` carries no `current` (req 3 — current page omitted from trail)
- Setting `path` on the last item clears `current`; clearing `path` sets it (req 9 — dynamic updates)
- Replacing children via `replaceChildren()` reassigns `current` to the new last item correctly
- Each item except the last has a visible `::after` separator (computed `display: inline-block`, non-empty `mask-image`)
- The last item's `::after` is `display: none`
- An item with `current` has `::after` `display: none`
- The default `mask-image` resolves to the chevron-right SVG (token `m9 18 6-6-6-6`)
- Setting `--vaadin-breadcrumbs-separator` on the breadcrumbs host changes the computed `mask-image` on every item
- The pseudo-element's `background` resolves to `currentColor`
- Visual: a default trail with three items renders with separators between consecutive items and no separator after the last item
- Visual: `forced-colors: active` shows the separator with system colors

---

## Task 6: RTL — directional flip

**Spec sections:** `<vaadin-breadcrumbs-item>` Internal behavior → RTL separator flip, Key Design Decision 5
**Requirements:** 12
**Depends on:** 5

**User value:** Applications running in RTL documents see the trail flow right-to-left with chevrons pointing in the reading direction. RTL apps can ship the component.

Add `:host([dir="rtl"])::after { transform: scaleX(-1); }` to the item base styles. Confirm the breadcrumbs and item layouts use only logical CSS properties (`margin-inline`, `padding-inline`, `gap`) so the trail flows R→L without any explicit `margin-left`/`margin-right` overrides. Add a base visual test for an RTL trail.

**Tests:**
- In an RTL document, the computed `transform` on `<vaadin-breadcrumbs-item>::after` is a horizontal mirror (`matrix(-1, 0, 0, 1, 0, 0)` or equivalent)
- In an LTR document, the pseudo-element has no horizontal-mirror transform
- An RTL trail visually flows right-to-left without any `margin-left`/`margin-right` overrides (verifies logical-property usage; assertable by checking that switching `dir` swaps left/right paddings without explicit RTL rules)
- Visual: RTL trail snapshot

---

## Task 7: Lumo theme

**Spec sections:** `<vaadin-breadcrumbs>` and `<vaadin-breadcrumbs-item>` (Lumo theme tokens for typography, color, spacing, focus ring, separator color, item gap)
**Requirements:** 4, 5
**Depends on:** 5

**User value:** Applications using the Lumo theme see the trail rendered with Lumo tokens (font, colors, spacing, focus ring) — visually consistent with the rest of a Lumo app.

Create `packages/vaadin-lumo-styles/components/breadcrumbs.css` (public) and `packages/vaadin-lumo-styles/src/components/breadcrumbs.css` (implementation) with the Lumo token bindings called out in `figma-design.md` (font size 16px / `--lumo-font-size-m`, line height `--lumo-line-height-m`, link color `--lumo-primary-text-color`, body text color `--lumo-body-text-color`, separator color `--lumo-contrast-50pct`, focus ring `--lumo-primary-color`, item gap `--lumo-space-s`). Register the import. Add Lumo visual tests for the default trail, the icon trail, and the four interactive states (Default, Hover, Focus, Active, Disabled). Overflow-related Lumo styles are added by Task 9 when the overflow elements exist.

**Tests:**
- Visual: default trail in Lumo matches the "Default Trail (Lumo)" frame
- Visual: icon trail in Lumo matches the "Icon Trail (Lumo)" frame (16x16 icon)
- Visual: link item states match the "Link Item States (Lumo)" row
- Visual: current page in Lumo matches the "Current Page States" row (medium font weight, body text color, no separator)
- The computed font size on a breadcrumbs item under Lumo equals `1rem`

---

## Task 8: Aura theme

**Spec sections:** `<vaadin-breadcrumbs>` and `<vaadin-breadcrumbs-item>` (Aura theme tokens for typography, color, spacing, focus ring, separator color, item gap)
**Requirements:** 4, 5
**Depends on:** 5

**User value:** Applications using the Aura theme see the trail rendered with Aura tokens — visually consistent with the rest of an Aura app.

Create `packages/aura/src/components/breadcrumbs.css` with the Aura token bindings called out in `figma-design.md` (font size 14px / `--aura-font-size-m`, line height `--aura-line-height-m`, link color `--aura-accent-text-color`, neutral text color `--aura-neutral`, separator color via secondary text color, item gap `--vaadin-gap-s`, border radius `--vaadin-radius-s`). Add the `@import` to `packages/aura/aura.css`. Add Aura visual tests for the default trail, the icon trail, and the four interactive states. Overflow-related Aura styles are added by Task 9 when the overflow elements exist.

**Tests:**
- Visual: default trail in Aura matches the "Default Trail (Aura)" frame
- Visual: icon trail in Aura matches the "Icon Trail (Aura)" frame (14x14 icon)
- Visual: link item states match the "Link Item States (Aura)" row
- Visual: current page matches the "Current Page States" row in Aura
- The computed font size on a breadcrumbs item under Aura equals `round(14/16 * 1rem)`

---

## Task 9: Overflow behavior end-to-end

**Spec sections:** `<vaadin-breadcrumbs>` Shadow DOM (overflow placeholder + `slot="root"` / default slot split), parts (`overflow`, `overflow-button`), `i18n` property, state attribute `has-overflow`, Internal behavior → Slot observation and root assignment / Overflow detection / Overlay management / Overflow separator, all of `<vaadin-breadcrumbs-overlay>`, Key Design Decisions 3 and 6, Reuse → `ResizeMixin`, `SlotObserver`, `OverlayMixin`, `PositionMixin`
**Requirements:** 6, 7
**Depends on:** 5, 7, 8

**User value:** When the trail no longer fits the available width, items collapse closest-to-root first into an overflow button (`…`). Clicking the button opens an overlay that lists the hidden items as plain links; outside-click, Escape, and Tab close it. Fully styled in base, Lumo, and Aura. Pressing Enter/Space on the overflow button opens the overlay. Keyboard arrow-key navigation inside the open overlay is left to Task 10.

This task is large because none of its components — overflow detection, overflow button, the overlay element, light-DOM rendering, `i18n`, the overflow separator, base + Lumo + Aura styling — is independently useful. Implement them together in a single PR.

**Container shadow DOM (rebuilt):**
```html
<div role="list" part="list">
  <slot name="root"></slot>
  <div role="listitem" part="overflow" hidden>
    <button part="overflow-button" aria-haspopup="true" aria-expanded="false">…</button>
  </div>
  <slot></slot>
</div>
<vaadin-breadcrumbs-overlay
  .opened="${this.__overlayOpened}"
  .owner="${this}"
  .positionTarget="${this._overflowButton}"
  exportparts="overlay, content: overlay-content"
></vaadin-breadcrumbs-overlay>
```

Extend the host-side observer from Task 5 to also assign `slot="root"` to the first `<vaadin-breadcrumbs-item>` child and clear `slot` from any previous holder. Resolve `_overflowButton` once in `firstUpdated()` (not as a lazy getter that returns `null` on first read).

**`<vaadin-breadcrumbs-overlay>` element:** Create `packages/breadcrumbs/src/vaadin-breadcrumbs-overlay.js`/`.d.ts`. Mixin chain: `OverlayMixin` + `PositionMixin` + `DirMixin` over `PolylitMixin` + `LumoInjectionMixin`. Inline two overlay-specific members on the class: `_shouldCloseOnOutsideClick` (keeps the overlay open when the position target is clicked — the breadcrumbs container handles toggling) and a `_contentRoot` getter that returns `this.owner` (so `OverlayFocusMixin` recognizes focus inside the owner-slotted items). Overlay-only CSS — `[part='content']` padding and the `:host([top-aligned])` / `:host([bottom-aligned])` margin offsets — lives in a small `css` block on the class itself, alongside the imported `overlayStyles`. Shadow DOM: `<div part="overlay"><div part="content" role="list"><slot></slot></div></div>`. The overlay does NOT implement `_rendererRoot` or any `.renderer` plumbing — items live in the breadcrumbs' light DOM (see below) and project through the overlay's default slot.

**Container behavior:**
- Add `ResizeMixin` and `I18nMixin` to the breadcrumbs mixin chain. Default `i18n` is `{ moreItems: 'More items' }`. Bind `i18n.moreItems` to the overflow button's `aria-label`.
- Override `_onResize()` and re-run on the host-side observer's pass: measure whether all items fit. If not, reassign `slot="overlay"` on items closest-to-root first (the first default-slot item, then the next, then eventually the root item). Never collapse the last item. Reflect `has-overflow` on the host. Toggle `[part="overflow"]`'s `hidden` attribute accordingly. Collapsed items disappear from the trail automatically because they are projected through the overlay's named slot instead.
- Toggle `__overlayOpened` on overflow-button click; reflect to the button's `aria-expanded`. Pressing Enter or Space on the focused overflow button opens the overlay and moves focus to the first link.
- The same physical `<vaadin-breadcrumbs-item>` element renders in either the trail or the overlay depending on its `slot` attribute. Items collapsed by the overflow algorithm stay in the breadcrumbs' light DOM with `slot="overlay"`; the overlay's default slot projects them in.
- Add `[part="overflow"]::after` to the breadcrumbs base styles using the same `mask-image` + `currentColor` pattern as the item separator, with the same `--vaadin-breadcrumbs-separator` custom property and the same RTL flip from Task 6. Visible whenever `[part="overflow"]` is visible.
- Extend Task 7's Lumo CSS and Task 8's Aura CSS with overflow-button and overlay styling per `figma-design.md`.

**ARIA:** `[part="overflow"]` carries `role="listitem"`; the overlay's `[part="content"]` carries `role="list"`; overflow button carries `aria-haspopup="true"` and `aria-expanded` reflecting state; rendered overlay items keep their item-level `role="listitem"`.

**Tests:**
- A trail that fits has no `has-overflow` attribute, no item carries `slot="overlay"`, and `[part="overflow"]` remains `hidden`
- Shrinking the container so one item no longer fits sets `has-overflow`, reassigns `slot="overlay"` on the first default-slot item (closest to root, not the root itself), and unsets `hidden` on `[part="overflow"]`
- Continuing to shrink moves additional default-slot items into `slot="overlay"` in order, always closest-to-root first
- Shrinking past the point where only the root and current item fit also moves the root to `slot="overlay"`
- The last item never carries `slot="overlay"` regardless of width
- Widening reverses: items become visible again in reverse order until `has-overflow` is removed
- Adding an item to a fitting trail re-runs detection
- The first `<vaadin-breadcrumbs-item>` carries `slot="root"`; prepending or removing the first item moves it correctly
- Default `i18n` has `moreItems` equal to `'More items'`; setting `breadcrumbs.i18n = { moreItems: 'Show hidden items' }` updates the overflow button's `aria-label`
- Clicking the overflow button while `__overlayOpened` is `false` opens the overlay (sets `aria-expanded="true"`); clicking again closes it
- Pressing `Escape` while the overlay is open closes it (delegated to `OverlayMixin`) and returns focus to the overflow button
- Pressing `Tab` or `Shift+Tab` while an overlay item is focused closes the overlay
- Clicking outside the overlay closes it
- Pressing Enter or Space on the focused overflow button opens the overlay and moves focus to the first link
- When the overlay opens with two items hidden, the breadcrumbs' light DOM contains exactly two `<vaadin-breadcrumbs-item>` elements with `slot="overlay"`, projected into the overlay's default slot
- Resizing the container so a different set of items overflows reassigns `slot="overlay"` on the matching elements and restores the original slot on items that no longer need to collapse
- `[part="overflow"]::after` is visible when `has-overflow` is set, with chevron-right `mask-image` and `transform: scaleX(-1)` in RTL
- The overflow button and overlay carry `role="listitem"` and `role="list"` respectively
- Visual: overflow trail in base styles renders the overflow button between root and rest with separators on both sides
- Visual: Lumo overflow trail matches the "Overflow Trail (Lumo)" frame; Aura overflow trail matches the "Overflow Trail (Aura)" frame
- Visual: Lumo and Aura overflow button states match their respective "Overflow Button States" rows

---

## Task 10: Keyboard navigation in the overflow overlay

**Spec sections:** `<vaadin-breadcrumbs-overlay>` Internal behavior → Keyboard interaction within the open overlay (arrow keys / Home / End)
**Requirements:** 7
**Depends on:** 9

**User value:** Keyboard users can traverse the open overlay with arrow keys (and Home/End) for menu-style navigation.

Implement `ArrowDown`/`ArrowUp` to move focus between adjacent links in the open overlay, `Home`/`End` to jump to first/last. `Tab`/`Shift+Tab` closing the overlay, `Escape` closing, and Enter/Space-on-button opening all land in Task 9.

**Tests:**
- Focusing the first link inside the open overlay and pressing `ArrowDown` moves focus to the next link
- Pressing `ArrowUp` from the second link moves focus to the first
- `ArrowDown` from the last link wraps to the first (or stays — pick the convention used in `<vaadin-context-menu>` / `<vaadin-menu-bar>` and assert it)
- `Home` from any item focuses the first link; `End` focuses the last

---

## Task 11: Integration & validation

**Spec sections:** All
**Requirements:** —
**Depends on:** 6, 8, 9, 10

**User value:** The component is ready to ship. Every documented variant works end-to-end, types are validated, visual and DOM regressions are caught by CI, and the dev page is the developer's living example.

Extend `dev/breadcrumbs.html` so every variant in `figma-design.md` is exercised: default trail, short trail, overflow trail, icon trail, long-labels trail, in both LTR and RTL. Add DOM snapshot tests under `test/dom/` for every distinct rendered state: the default trail, an item with `path`, an item without `path` (`current` branch), the overflow-active trail with the overlay open, and an item with `has-prefix`. Add TypeScript type tests under `test/typings/` exercising the `path` property type (`string | null | undefined`), the `i18n` shape (`{ moreItems?: string }`), and that the public exports re-export the element classes. Add a dedicated accessibility test file mirroring side-nav's pattern. Run a final pass and ensure `yarn test`, `yarn test:snapshots`, `yarn test:base`, `yarn test:lumo`, `yarn test:aura`, `yarn lint`, and `yarn lint:types` all pass.

**Tests:**
- DOM snapshot of `<vaadin-breadcrumbs>` with three items (last has no `path`) matches a stored snapshot
- DOM snapshot of an item with `path` set matches a stored snapshot
- DOM snapshot of an item without `path` (rendered as `[part="nolink"]`) matches a stored snapshot
- DOM snapshot of `<vaadin-breadcrumbs>` with `has-overflow` set, two items hidden, and the overlay open matches a stored snapshot
- DOM snapshot of an item with a prefix icon matches a stored snapshot
- Type test: `breadcrumbsItem.path = '/foo'` typechecks; `= null` typechecks; `= 42` is a type error
- Type test: `breadcrumbs.i18n = { moreItems: 'x' }` typechecks; `{ unknown: 'x' }` is a type error
- Type test: `import { Breadcrumbs, BreadcrumbsItem } from '@vaadin/breadcrumbs';` resolves to the element classes
- A11y: a trail with three items announces as a list with three list items
- A11y: separator pseudo-elements have no `content` and are not announced
- A11y: overlay's `[part="content"]` carries `role="list"`; slotted items carry `role="listitem"`
- The dev page renders one of every variant from `figma-design.md` without console errors
