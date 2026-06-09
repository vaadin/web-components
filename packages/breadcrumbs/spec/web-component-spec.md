# Breadcrumbs Web Component Specification

> This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.breadcrumbsComponent = true`

## Key Design Decisions

1. **Two custom elements: `<vaadin-breadcrumbs>` and `<vaadin-breadcrumbs-item>`** — Follows the same container-plus-items shape as `<vaadin-side-nav>` / `<vaadin-side-nav-item>`. Items are light DOM children of the container, observed via a shadow-root-level `SlotObserver`. Enables the declarative HTML API required by guidelines/02-design.md.

2. **`path` attribute on items renders an `<a>` element in shadow DOM** — Matches `<vaadin-side-nav-item>`'s pattern: `path` maps to the `href` attribute of an internal `<a>`. When `path` is absent, the item renders a `<span>` instead. The rendered `<a>` is a plain link — router-agnostic. (See web-component-api.md §1.)

3. **Current page is the last item without `path`** — No explicit `current` boolean property. The container detects that the last slotted item has no `path` and applies `aria-current="page"` and the `current` state attribute to it. This differs from `<vaadin-side-nav-item>`, which has a `current` property driven by URL matching — breadcrumbs don't do path matching. (See web-component-api.md §1, §8.)

4. **Declarative items only — no programmatic `items` property.** Items are always `<vaadin-breadcrumbs-item>` light-DOM children of the container. Unlike `<vaadin-menu-bar>` (where nested sub-menus make a declarative API impractical, see [#925](https://github.com/vaadin/web-components/issues/925)) the breadcrumbs' flat structure is straightforward to express declaratively, so a parallel `items` array would be redundant.

5. **Separator via `mask-image` CSS on an `::after` pseudo-element** — Every element in the list flow renders a separator: `<vaadin-breadcrumbs-item>` via `:host::after` (item base styles) and `[part="overflow"]` via `::after` (container base styles). Both share one recipe — the `mask-image` pattern from button-base-styles, driven by the `--vaadin-breadcrumbs-separator` custom property, which defaults to `--_vaadin-icon-chevron-right`. See "Separator rendering" for the full recipe. (See web-component-api.md §3.)

6. **Progressive overflow collapse using `ResizeMixin`** — The container uses `ResizeMixin` to detect when items don't fit. Items collapse from closest-to-root first, replacing collapsed items with an overflow button (`…`). The overflow button opens a dedicated `<vaadin-breadcrumbs-overlay>` element (extending `OverlayMixin`) that lists the hidden items, reusing the shared overlay infrastructure rather than a hand-rolled panel (see Discussion). The `i18n` property (via `I18nMixin`) allows localizing the overflow button's `aria-label`. (See web-component-api.md §4.)

7. **Navigation landmark via `role="navigation"` on the host** — `<vaadin-breadcrumbs>` sets `role="navigation"` on itself rather than wrapping its shadow DOM around an inner `<nav>`. The application supplies the accessible name via `aria-label` directly on the host. No default label is provided. (See web-component-api.md §7.)

8. **List item semantics via `role="listitem"` on the host** — `<vaadin-breadcrumbs-item>` sets `role="listitem"` on itself rather than wrapping its shadow DOM around an inner `<li>`. This keeps both components free of redundant semantic wrappers, consistent with the design rule in guidelines/11-a11y.md.

9. **No `suffix` slot on items** — Only a `prefix` slot is provided, matching the known use case (icons). (See web-component-api.md Discussion.)

---

## Implementation

### Elements

**`<vaadin-breadcrumbs>`** — Container element

The host carries `role="navigation"`. Items are distributed across two slots so the overflow element can sit in the DOM between the root item and the rest — ensuring DOM order matches the visual order `[root] [overflow] [rest…]` per guidelines/11-a11y.md.

Shadow DOM:
```html
<div role="list" part="list">
  <slot name="root"></slot>
  <div role="listitem" part="overflow" hidden>
    <button part="overflow-button"
            aria-label="…"
            aria-haspopup="true"
            aria-expanded="false">
      <!-- ::before pseudo-element renders ellipsis icon via mask-image -->
    </button>
  </div>
  <slot></slot>
</div>
<vaadin-breadcrumbs-overlay
  .owner="${this}"
  .opened="${this.__overlayOpened}"
  no-vertical-overlap
  restore-focus-on-close
  exportparts="overlay, content: overlay-content"
>
  <slot name="overlay"></slot>
</vaadin-breadcrumbs-overlay>
```

The `<div role="list">` is used instead of `<ol>` because `<ol>` only accepts `<li>` children and Safari/VoiceOver strips the list role under `list-style: none` (see Discussion).

`<vaadin-breadcrumbs-overlay>` is rendered statically in the breadcrumbs' shadow DOM, matching the convention of `<vaadin-combo-box>`, `<vaadin-avatar-group>`, `<vaadin-menu-bar-submenu>`, and other Vaadin overlay-hosting components. See "Overlay management" below for its lifecycle and how collapsed items reach it.

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `i18n` | `{ moreItems?: string }` | `{ moreItems: 'More items' }` | No | Internationalization object. `moreItems` sets the `aria-label` of the overflow button. |

| Slot | Description |
|---|---|
| `root` | The first `<vaadin-breadcrumbs-item>` in the trail. The container assigns `slot="root"` to the first item automatically — the application does not set it. |
| (default) | All remaining `<vaadin-breadcrumbs-item>` elements in the trail. |

| Part | Description |
|---|---|
| `list` | The element with `role="list"` wrapping all items. |
| `overflow` | The element wrapping the overflow button. |
| `overflow-button` | The button that reveals collapsed items. |

The overflow overlay's outer panel and inner wrapper are re-exported on the breadcrumbs host via `exportparts="overlay, content: overlay-content"`, so themes target them as `vaadin-breadcrumbs::part(overlay)` and `vaadin-breadcrumbs::part(overlay-content)` (the `content` part is renamed to avoid ambiguity — see Discussion). The `<vaadin-breadcrumbs-overlay>` element itself is internal and not part of the theming contract.

| State attribute | Description |
|---|---|
| `has-overflow` | Set when one or more items are collapsed into the overflow overlay. |

| Theme | Description |
|---|---|
| `slash` | Renders a slash (`/`) instead of the default chevron between items. Set via `theme="slash"` on `<vaadin-breadcrumbs>`. |

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumbs-overflow-icon` | `var(--_vaadin-icon-ellipsis)` | The mask-image icon used inside the overflow button. |
| `--vaadin-breadcrumbs-separator` | `var(--_vaadin-icon-chevron-right)` | The mask-image icon used as the separator between items. Set on `<vaadin-breadcrumbs>` to change the separator for all items. |

Internal behavior:

- **Slot observation and root assignment.** A single `SlotObserver` targets the shadow root and diffs the union of all descendant `<slot>` assignments. When children change, the callback sets `slot="root"` on the first `<vaadin-breadcrumbs-item>` child and removes `slot` from any previous holder. This routes the first item into the named `root` slot in shadow DOM, so the overflow element sits in the DOM between the root and the rest — matching visual order. The same callback re-evaluates overflow detection and `current` state on the last item. The observer's union diff naturally ignores cross-slot reassignment (e.g. moving an item to `slot="overlay"`), so internal slot mutations don't loop back into the handler.
- **Overflow detection.** On resize (via `ResizeMixin`) and on slot changes, the component measures whether all items fit within the container width. If not, it progressively collapses items starting from the one closest to the root (the first default-slot item) by reassigning `slot="overlay"` on each. If further space is needed, the root item collapses too. The last item (current page) never collapses.
- **Overlay management.** The breadcrumbs' `render()` always emits `<vaadin-breadcrumbs-overlay .opened .owner no-vertical-overlap restore-focus-on-close exportparts="overlay, content: overlay-content">` as a sibling of `[part="list"]`, with `.opened` bound to `__overlayOpened` and `.owner` bound to the host. `positionTarget` and `restoreFocusNode` are set imperatively from `firstUpdated()` to the `[part="overflow-button"]` element. `no-vertical-overlap` keeps the overlay strictly above or below the overflow button (never overlapping it) so the trail stays visible while the overlay is open. Collapsed items carry `slot="overlay"` (assigned by `__updateOverflow()`) and remain in the breadcrumbs' light DOM; the overlay's default slot projects them in, so the same physical element renders in either the trail or the overlay, never both. Clicking the overflow button toggles `__overlayOpened`. Everything else — keeping the overlay hidden while closed, outside-click and Escape closing, focus restoration to the overflow button (via `restore-focus-on-close`), top-layer rendering, and stacking — comes from `OverlayMixin`; the breadcrumb does not touch positioning or event wiring beyond the bindings above.
- **Overflow separator.** The overflow element sits in the list flow between the root and the rest, so it needs a separator after it when visible. Its `[part="overflow"]::after` pseudo-element reuses the same separator recipe as `<vaadin-breadcrumbs-item>` (see "Separator rendering"), so the overflow element visually matches peer items. When `has-overflow` is not set, the overflow element is hidden, so its separator is not visible either.
- **Width-constrained list flow.** The host carries `width: 100%; min-width: 0`, and `[part="list"]` is a `display: flex; flex-wrap: nowrap` container with `min-width: 0; max-width: 100%`. The list stretches to its parent's width and shrinks below its natural content width, which is how overflow detection knows when items no longer fit. It does not clip with `overflow: hidden` (see Discussion).
- **Overflow-button click target.** `[part="overflow-button"]` uses a `padding: max(var(--vaadin-padding-block-container), (24px - 1lh) / 2)` formula paired with the matching negative `margin`, so the click target is at least 24×24 px (WCAG 2.5.8) without changing the button's visual size.
- **Baseline alignment.** The host and `[part="list"]` use `align-items: baseline`; `[part="overflow"]` inherits it, so when an item's text wraps onto multiple lines, prefix icons and adjacent items stay aligned to the first line's baseline rather than the box center (see Discussion). Icon pseudo-elements (the separator on each item and on `[part="overflow"]`, plus the overflow button's `::before`) are sized to `1lh` so they fill the line height; separators mask their icon at `90%` of the box and carry `opacity: 0.75` to keep the chevron visually subordinate to text, and the overflow-button icon uses `opacity: 0.8` for the same reason.

---

**`<vaadin-breadcrumbs-item>`** — Individual breadcrumb item

The host carries `role="listitem"`. A separator pseudo-element is attached directly to the host via `:host::after`.

Shadow DOM:
```html
<a href="..." part="link">
  <slot name="prefix"></slot>
  <span part="label">
    <slot></slot>
  </span>
</a>
<!-- :host::after renders the separator via mask-image -->
```

When `path` is not set (current page):
```html
<span part="nolink">
  <slot name="prefix"></slot>
  <span part="label">
    <slot></slot>
  </span>
</span>
```

The outer wrapper carries `part="link"` when the item is interactive and `part="nolink"` whenever it is rendered as plain text instead of a link — most commonly the current page, but also any item the application chooses to display non-interactively (for example an ancestor the user has no permission to navigate to). Distinct part names let themes target the two cases without `:not([path])` selectors and without overloading any single state attribute.

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `path` | `string \| null \| undefined` | `undefined` | No | The URL to navigate to. When set, the item renders as an `<a>` link. When absent, the item renders as a non-interactive `<span>`. |
| `disabled` | `boolean` | `false` | Yes (`disabled`) | Provided by `DisabledMixin`. When `true`, the item renders without an `href`, carries `tabindex="-1"`, sets `aria-disabled="true"` on the host, and suppresses programmatic `click()`. |

| Slot | Description |
|---|---|
| (default) | Text label of the breadcrumb item. |
| `prefix` | Content before the label (typically a `<vaadin-icon>`). |

| Part | Description |
|---|---|
| `link` | The `<a>` element containing the label, when the item is interactive (`path` is set). |
| `nolink` | The `<span>` element containing the label, when the item is rendered as plain text rather than as a link (the current page, or any item where `path` is not set). Mutually exclusive with `link`. |
| `label` | The `<span>` wrapping the default slot text. Present in both cases. |

| State attribute | Description |
|---|---|
| `current` | Set by the parent `<vaadin-breadcrumbs>` on the last item when it has no `path`. |
| `has-prefix` | Set when the `prefix` slot has content. |
| `disabled` | Reflected from the `disabled` property by `DisabledMixin`. Themes target it as `vaadin-breadcrumbs-item[disabled]`. |
| `focused` | Set by `FocusMixin` while the item (or any element inside it) has focus. |
| `focus-ring` | Set by `FocusMixin` when the item received focus from the keyboard. Use this — not `:focus` — to style the focus indicator so it does not appear on mouse-driven focus. |

Internal behavior:

- **Link rendering.** When `path` is set, renders `<a href="${path}" part="link">`, matching the approach in `<vaadin-side-nav-item>`. When `path` is not set, renders `<span part="nolink">`. The `<a>` is a plain HTML link — no router integration, no click interception. SPA routers intercept link clicks at the document level.
- **Separator rendering.** A `:host::after` pseudo-element renders the separator, following the button-base-styles pattern: `background: currentColor` masked by `mask-image: var(--vaadin-breadcrumbs-separator)`, flipped with `transform: scaleX(-1)` in RTL. The separator is hidden on the last item (`:host(:last-of-type)::after { display: none }`) and on any item with the `current` attribute. The container reuses this same recipe for the overflow element's separator (see "Overflow separator").
- **`aria-current="page"`.** When the parent sets the `current` state attribute on the host, the inner `<span part="nolink">` element gets `aria-current="page"`.
- **Prefix slot.** A `SlotController` observes the `prefix` slot and toggles `has-prefix` on the host for styling.
- **Padding-based click target.** Each item's `[part="link"]` / `[part="nolink"]` carries `padding: var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container)`. Trail items get a negative `margin-inline` (applied via `:host(:not([slot='overlay']))`) that cancels the inline padding for layout; overlay items skip the compensator (see Discussion).

---

**`<vaadin-breadcrumbs-overlay>`** — Overflow overlay

Internal element used only by `<vaadin-breadcrumbs>`. Not intended for application use. Built on `OverlayMixin` plus `PositionMixin` (both from `packages/overlay`) over `DirMixin`, `PolylitMixin`, and `LumoInjectionMixin`. `PositionMixin` provides the `positionTarget` property used by the breadcrumbs to anchor the overlay to the overflow button. Two overlay-specific behaviors live directly on the class: `_shouldCloseOnOutsideClick` keeps the overlay open when the overflow button is clicked (the breadcrumbs container handles toggling), and `_contentRoot` returns `this.owner` so `OverlayFocusMixin` can recognize focus inside the owner-slotted items.

Shadow DOM:
```html
<div part="overlay">
  <div part="content" role="list">
    <slot></slot>
  </div>
</div>
```

The element exposes no public properties or slots of its own — it inherits everything it needs from `OverlayMixin` and `PositionMixin`. The breadcrumb binds the inherited `opened`, `owner`, and `positionTarget` properties internally; applications do not set them. The `renderer` property is intentionally left unset (see "Overlay management" above and the Discussion).

| Part | Description |
|---|---|
| `overlay` | The outer panel. Inherited `OverlayMixin` part naming. Re-exported on the breadcrumbs host as `overlay` via `exportparts`. |
| `content` | The inner wrapper holding the overlay content. Carries `role="list"` so the slotted `<vaadin-breadcrumbs-item>` elements (each `role="listitem"`) form a valid ARIA list. Inherited `OverlayMixin` part naming. Re-exported on the breadcrumbs host as **`overlay-content`** via `exportparts="content: overlay-content"` (see Discussion for the rename). |

Internal behavior:

- **Light-DOM projection via `slot="overlay"`.** Rather than an `OverlayMixin` `.renderer` callback or a `_rendererRoot` override, collapsed items are projected through the overlay's default slot while staying in the breadcrumbs' light DOM (see "Overlay management" above). This keeps `<vaadin-breadcrumbs-overlay>` free of rendering plumbing and lets global page CSS reach the links.
- **Inherited overlay behavior.** Top-layer rendering, outside-click and Escape closing, focus restoration, and stacking all come from `OverlayMixin`; positioning relative to the overflow button is driven by the `positionTarget` property from `PositionMixin`, matching `<vaadin-combo-box-overlay>` and `<vaadin-avatar-group-overlay>`. None of these are re-implemented here.
- **Keyboard interaction within the open overlay.**
  - **Focus on open** — focus stays on the overflow button when the overlay opens (via overflow-button click, Enter, or Space). The first ArrowDown / ArrowUp keypress while the overlay is open moves focus into the overlay: ArrowDown lands on the first non-disabled overlay item, ArrowUp lands on the last non-disabled overlay item.
  - **Arrow keys** — once focus is inside the overlay, Up/Down arrows move focus between adjacent links (Home/End jump to first/last). Disabled items are skipped — arrow keys, Home, and End land on the nearest non-disabled item in the requested direction. The overlay reads as a menu visually, so menu-style keyboard navigation is the primary way to traverse its items.
  - **Tab / Shift+Tab** — closes the overlay. `restore-focus-on-close` returns focus to the overflow button, from which the native Tab / Shift+Tab traversal then moves focus to the next / previous focusable trail item in document order.
  - **Escape** — closes the overlay and returns focus to the overflow button.

---

## Reuse and Proposed Adjustments to Existing Modules

### `packages/component-base/src/styles/style-props.js` — Modification needed

Add a `--_vaadin-icon-chevron-right` icon definition alongside the existing `--_vaadin-icon-chevron-down`:

```css
--_vaadin-icon-chevron-right: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>');
```

The breadcrumb separator defaults to a right-pointing chevron. This icon does not exist in the shared icon set.

### `packages/component-base/src/i18n-mixin.js` — Used as-is

Provides the `i18n` property with a `moreItems` key for localizing the overflow button's `aria-label`.

### `packages/component-base/src/resize-mixin.js` — Used as-is

Provides `_onResize()` callbacks when the host element's size changes. The breadcrumb container overrides this to trigger overflow detection.

### `packages/component-base/src/slot-observer.js` — Used as-is

The breadcrumb container instantiates a `SlotObserver` targeting its shadow root to react when `<vaadin-breadcrumbs-item>` children are added or removed across any of its slots.

### `packages/overlay/src/vaadin-overlay-mixin.js` — Used as-is

`<vaadin-breadcrumbs-overlay>` extends `OverlayMixin` for the overflow overlay, which provides `opened` / `owner`, top-layer rendering, outside-click / Escape closing, focus restoration to `restoreFocusNode`, and stacking. The `renderer` property is intentionally left unbound — see "Overlay management" above. No modification needed.

### `packages/overlay/src/vaadin-overlay-position-mixin.js` (`PositionMixin`) — Used as-is

`<vaadin-breadcrumbs-overlay>` extends `PositionMixin` for the `positionTarget` property used to anchor the overlay to the overflow button. Same usage pattern as `<vaadin-combo-box-overlay>` and `<vaadin-avatar-group-overlay>`. No modification needed.

---

## Discussion

Decisions made during specification review, with their reasoning.

**Q: Why does `<vaadin-breadcrumbs-item>` expose `disabled` plus `focused` / `focus-ring` state attributes?**

Items are interactive links, so they participate in the same disability + focus contract as every other interactive Vaadin component. `DisabledMixin` and `FocusMixin` are the project's standard primitives for that contract — pulling them in keeps the item's behavior (no `href`, `tabindex="-1"` on the inner link, `aria-disabled="true"` on the host, suppressed programmatic clicks; `focused` while focus is inside; `focus-ring` only when focus arrived via keyboard) identical to the rest of the library and avoids re-implementing the same state machine. Themes get to style disabled and keyboard-focus states without re-asserting browser focus semantics; applications get a property and an attribute that already work the way Vaadin developers expect.

**Q: Why is there no programmatic `items` property?**

An earlier revision exposed an `items` data array (`{ text, path }[]`) on `<vaadin-breadcrumbs>` mirroring the declarative API, on the principle that "both should coexist". In review, that principle was reconsidered — across the Vaadin component set only `<vaadin-select>` exposes both, and that was justified by overlay-teleportation limits, not by a general rule. Unlike `<vaadin-menu-bar>` (where nested sub-menus make a declarative API impractical, see [#925](https://github.com/vaadin/web-components/issues/925)), the breadcrumbs' flat structure is straightforward to express declaratively. Dropping the parallel API removes a non-trivial chunk of implementation (an `items`-driven Lit `render()` pass plus the `BreadcrumbsItemData` type) and still covers every documented use case via slotted `<vaadin-breadcrumbs-item>` children. If a real need for the data-array form emerges later it can be added; until then it is intentionally absent.

**Q: Why are the overflow items projected via `slot="overlay"` rather than rendered through an `OverlayMixin` `.renderer`?**

So global page CSS can style the links *and* `<vaadin-breadcrumbs-overlay>` stays free of rendering plumbing. Anything written into the overlay's shadow `[part="content"]` is unreachable from page-level stylesheets, which would force users into `::part` workarounds. Driving the content through `OverlayMixin`'s callback-style `.renderer` adds an indirection — the breadcrumb would have to construct elements imperatively against an external root, the overlay would have to override `_rendererRoot`, and a no-op `.renderer` placeholder leaks into early commits. Reassigning `slot="overlay"` on the existing item element instead keeps each item as a single physical DOM node — it renders in the trail or in the overlay depending on its slot — and the overlay element never needs to know about the rendering shape at all.

**Q: Why are the overlay parts re-exported on the breadcrumbs host, with `content` renamed to `overlay-content`?**

`<vaadin-breadcrumbs-overlay>` is an internal element — applications and theme authors should not need to know it exists. Re-exporting its parts via `exportparts` lets themes target `vaadin-breadcrumbs::part(overlay)` directly, which keeps the theming surface inside the public element name and avoids leaking the overlay's identity into stylesheet selectors. The `overlay` part keeps its name, but `content` is renamed to `overlay-content`: `OverlayMixin` names the inner wrapper `content`, and `vaadin-breadcrumbs::part(content)` would read as if it referred to the visible trail of items rather than to the inner wrapper of the overflow popup that only appears when items collapse. Inside `<vaadin-breadcrumbs-overlay>` itself the part is still called `content`, matching every other Vaadin overlay; the rename is a host-side disambiguation only.

**Q: Why does the non-link rendering carry `part="nolink"` rather than reusing `part="link"`?**

Distinct part names match the two cases the item can be in (interactive anchor vs. non-interactive plain text). Reusing `part="link"` for both forces theme authors to write `vaadin-breadcrumbs-item:not([path])::part(link)` to target non-link items and reads as if a non-link item were a link — which it explicitly is not. An earlier revision used `part="current"`, but that name described only one *reason* for the non-link rendering — the last item with no path. Items can also be rendered as plain text for other reasons (e.g. an ancestor the user has no permission to navigate to), and `[part="current"]` on a non-current item would be misleading. The neutral name `nolink` covers every reason an item might render without an anchor, without favouring one cause over another. The `current` state attribute on the host stays as a separate concept; themes that want to single out the current-page case combine the two: `vaadin-breadcrumbs-item[current]::part(nolink)`.

**Q: Why does the overflow overlay use arrow keys for navigation and Tab to dismiss?**

The overlay reads visually as a menu, so users coming from menu-bar / context-menu expect Up/Down arrow keys to move between entries — that pattern is the primary in-overlay navigation. Tab/Shift+Tab carry their document-level meaning (leave this widget, go to the next/previous focusable in the page); inside a transient popup anchored to a trigger button, "leave" means close. Treating the overflow overlay as a list-style picker rather than a tab-traversable region keeps the trail's own tab cycle short and predictable while still giving keyboard users a way out at any moment.

**Q: Why does Tab close the overflow overlay?**

For consistency with the other Vaadin overlay-with-overflow component, `<vaadin-avatar-group>`, whose overflow menu also closes on Tab and Shift+Tab. The overflow overlay is a transient popup anchored to a trigger button; keeping it open while focus has already moved past the trigger creates an orphaned popup whose contents no longer match where the user is in the document. Closing on Tab matches the dismiss-on-blur behavior users expect from any popover, and `restore-focus-on-close` returns focus to the overflow button when needed so the trail's tab order remains predictable.

**Q: Why does arrow-key navigation skip disabled overlay items?**

Arrow / Home / End navigation in the overflow overlay is implemented via `KeyboardDirectionMixin` from `@vaadin/a11y-base`, the same primitive that powers `<vaadin-context-menu-list-box>`, `<vaadin-menu-bar>`, and `<vaadin-accordion>`. The mixin's `_isItemFocusable(item)` defaults to `!item.hasAttribute('disabled')` and is honored by every focus-moving keystroke, so disabled items are skipped uniformly. The alternative — letting focus land on a disabled item — would conflict with the inner link's `tabindex="-1"`, the host's `aria-disabled="true"`, and the suppressed click contract, and would diverge from the menu-style navigation users encounter everywhere else in the library.

**Q: Why does the overflow overlay not move focus to the first item when it opens?**

To keep pointer-driven opens from showing a focus outline on an overlay item the user did not request. Auto-focusing the first item on open meant a click on the overflow button immediately drew a focus ring around the first overlay link, then forced ArrowDown to land on the *second* item rather than the first — both surprising. The chosen behavior matches `<vaadin-menu-bar>`: clicking the trigger opens the overlay with focus still on the trigger button, and the first ArrowDown / ArrowUp keystroke is what hands focus to an item (ArrowDown to the first focusable, ArrowUp to the last). Keyboard users press Enter/Space to open and then their first arrow key reaches the expected item; pointer users see no premature focus ring; assistive tech still associates the open overlay with the trigger via `aria-expanded` and `aria-haspopup`.

**Q: Why does `breadcrumbs.focus()` target the root item, with the overflow button as a fallback?**

The root is the trail's natural entry point — applications that programmatically focus the component expect focus to land at the start of the trail. When the root is unavailable (its `disabled` attribute is set, or overflow has collapsed it into the overlay so it is no longer rendered in the trail), the next visible focusable element belonging to the breadcrumbs is the overflow button — focusing that gives keyboard users an unambiguous handle on the navigation without quietly no-op'ing or jumping into the collapsed overlay. The mixin's default `focus()` would walk into the first slotted overlay item, which is not the right entry surface for a navigation landmark.

**Q: Should `<vaadin-breadcrumbs-item>` expose a `target` property?**

No. An earlier revision included `target` mirroring `<vaadin-side-nav-item>`'s support for `_blank`-style anchor targets. It was removed because Breadcrumbs represent the user's position within a single application hierarchy, and opening an ancestor in a new tab is not a supported interaction — it would produce two tabs of the same application, neither reflecting the other's state. The rendered `<a>` still honours standard HTML link behaviour (middle-click, Ctrl/Cmd-click for user-driven new-tab/new-window opens) because the browser handles those on its own; only the programmatic `target` attribute is dropped. Reintroducing `target` is strictly additive if a concrete use case emerges.

**Q: Should the overflow panel be called a "dropdown"?**

No. Vaadin components generally avoid the term "dropdown" — menu-bar, select, combo-box, and AvatarGroup all expose `overlay` and `content` parts. The breadcrumb follows the AvatarGroup pairing: an `overlay` part for the outer panel and a `content` part for the inner wrapper holding the collapsed items.

**Q: Should `SlotChildObserveController` be used to observe item children?**

No. `SlotChildObserveController` bundles two concerns the breadcrumbs does not need: observing `id`-attribute mutations for ARIA references (useful to field components) and firing a generic "content changed" event. For breadcrumbs' needs — reacting when items are added or removed across multiple shadow-root slots, without looping on the component's own cross-slot reassignment — a single `SlotObserver` targeting the shadow root is sufficient and keeps the dependency surface minimal.

**Q: Why a `SlotObserver` targeting the shadow root rather than a `SlotController`?**

Two reasons. (1) Multiple slots: the container fans items across `slot="root"`, the default slot, and (via the overlay slotting trick) `slot="overlay"`. A shadow-root-level observer covers all three with one listener instead of one per slot. (2) Cross-slot loop suppression: overflow management itself sets `slot="root"` and `slot="overlay"` on items, which a per-slot listener would see as add+remove events and re-enter the handler. `SlotObserver`'s union diff sees those reassignments as no-ops and stays silent. `SlotController` solves slot membership and per-node init/teardown, but it doesn't help with either of those.

**Q: Should the shadow DOM wrap content in `<nav>` and each item in `<li>`?**

No. Per the "Use `role` on the host instead of a semantic wrapper inside it" rule in guidelines/11-a11y.md, `<vaadin-breadcrumbs>` carries `role="navigation"` on the host and `<vaadin-breadcrumbs-item>` carries `role="listitem"` on the host. The inner list wrapper in the container is retained as a genuine exception — a single element cannot carry both the `navigation` and `list` roles, so the list semantics live on an inner element.

**Q: Should the list wrapper be `<ol>` or a generic element with `role="list"`?**

A generic element with explicit `role="list"`. Two reasons: (a) HTML `<ol>` accepts only `<li>` children, and the slotted items are `<vaadin-breadcrumbs-item>` custom elements, so `<ol>` would be non-conforming; (b) Safari + VoiceOver strips the list role from `<ol>`/`<ul>` when `list-style: none` is applied (which a themed breadcrumb always applies), suppressing "list with N items" announcements. Explicit `role="list"` is immune to both issues.

**Q: How is the overflow element positioned so it appears visually between the root and the rest of the items?**

Two shadow slots with the overflow in shadow DOM between them: `<slot name="root"></slot>`, then `<div part="overflow">`, then `<slot></slot>`. The component's `SlotObserver` callback assigns `slot="root"` to the first `<vaadin-breadcrumbs-item>` child automatically — the application doesn't set it. This keeps DOM order aligned with visual order `[root] [overflow] [rest…]`, satisfying the "DOM order matches visual order" rule from guidelines/11-a11y.md. The alternative considered — inserting the overflow as a light-DOM sibling between items — was rejected because it would add a component-authored element to the user's light DOM, changing `breadcrumb.children.length` and conflicting with the "light DOM is the application's territory" principle.

**Q: Should the overflow panel use `OverlayMixin` or be a plain `<div>` positioned with `position: fixed`?**

`OverlayMixin`, via a dedicated `<vaadin-breadcrumbs-overlay>` element. A hand-rolled fixed-positioned `<div>` in shadow DOM was considered but rejected — it would miss stacking-context handling, top-layer rendering via the popover API, focus restoration, and outside-click/Escape handling, all of which `OverlayMixin` provides for free and which other Vaadin overlays (menu-bar, combo-box, dialog, context-menu) already rely on. `<vaadin-breadcrumbs-overlay>` is rendered directly in the breadcrumbs' shadow DOM with its properties (`owner`, `opened`, `positionTarget`, `exportparts`) bound to the breadcrumbs' state — matching the pattern in `<vaadin-combo-box>`, `<vaadin-avatar-group>`, `<vaadin-menu-bar-submenu>`, and other overlay hosts. The `renderer` property is intentionally omitted; collapsed items carry `slot="overlay"` in the breadcrumbs' light DOM and the overlay's default slot projects them in (see "Overlay management" above).

**Q: Why does `i18n.moreItems` default to `'More items'` rather than an empty string?**

The `aria-label` on the overflow button must always be present — screen readers announce the button as just "button" otherwise. Defaulting to an empty string leaves the application responsible for setting a meaningful label before the component is reachable to assistive tech, which is a setup step that's easy to miss. Providing `'More items'` as the default matches the convention for other Vaadin components with auto-generated control labels (Menu Bar, Combo Box clear button) and keeps the unlabeled state out of reach. Applications still localize via `i18n = { moreItems: '…' }` exactly as before.

**Q: Why does the overflow button render its ellipsis icon via `mask-image` instead of the `…` character?**

The `…` glyph depends on the rendered font and locale — some fonts render it as three full-width dots, others as a compact ellipsis, none of which line up visually with the chevron separator. The mask-image route uses the same SVG icon system as the separator, so both icons share size, color, and alignment rules. It also gives theme authors a single override hook (`--vaadin-breadcrumbs-overflow-icon`) parallel to the separator's, so swapping the ellipsis for a different pictogram is a one-line theme rule.

**Q: Why doesn't `[part="list"]` use `overflow: hidden` to clip overflowing items?**

Clipping items with `overflow: hidden` cropped their focus outlines too, so the list needed a `padding: var(--vaadin-focus-ring-width)` workaround that shifted the trail visually and made flex-item width math harder to reason about. The current setup constrains the list with `min-width: 0; max-width: 100%` and lets overflow detection trigger before items would visually escape the parent's width. Focus outlines render without being cropped because the list no longer clips its descendants.

**Q: Why are breadcrumbs items aligned by baseline rather than centered?**

When an item's text wraps onto multiple lines (very narrow viewport, long current-page title), aligning by box center pushes single-line siblings down to match the wrapped item's center and breaks the visual baseline of the trail. Baseline alignment keeps the first line of every item aligned, so prefix icons and adjacent text always sit on the same horizontal line. The icon pseudo-elements are sized to fill the line height without dominating the text visually (see "Baseline alignment" for the exact sizing).

**Q: Why does each item carry a padding-based click target paired with a negative `margin-inline`?**

The inline padding gives the link a hit area noticeably larger than the visible text, matching the WCAG 2.5.8 minimum target size and aligning with how trail items render an offset focus outline. The negative `margin-inline` exactly cancels the inline padding for layout, so the visual width and the trail's gaps look the same as a no-padding rendering — the trail still reads as text first, while clicks within the larger hit area still register. Overlay items skip the negative-margin compensator because they need the visual padding (their hover/focus background fills the row).

**Q: Why does base styles ship a `theme="slash"` separator variant rather than leaving it to each theme?**

The slash is the second common breadcrumb separator convention after the chevron, and the mask-image recipe makes the variant trivial — `theme="slash"` rebinds `--vaadin-breadcrumbs-separator` to the bundled `--_vaadin-icon-slash` token. Shipping it in base means applications written without a Vaadin theme still get the variant for free, and Lumo / Aura themes do not have to re-implement the same selector.
