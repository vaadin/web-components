# BreadcrumbTrail Web Component Specification

> This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.breadcrumbTrailComponent = true`

## Key Design Decisions

1. **Two custom elements: `<vaadin-breadcrumb-trail>` and `<vaadin-breadcrumb-item>`** — Follows the same container-plus-items shape as `<vaadin-side-nav>` / `<vaadin-side-nav-item>`. Items are light DOM children of the container, observed via a `SlotController`. Enables the declarative HTML API required by DESIGN_GUIDELINES.md.

2. **`path` attribute on items renders an `<a>` element in shadow DOM** — Matches `<vaadin-side-nav-item>`'s pattern: `path` maps to the `href` attribute of an internal `<a>`. When `path` is absent, the item renders a `<span>` instead. The rendered `<a>` is a plain link — router-agnostic per DESIGN_GUIDELINES.md. (See web-component-api.md §1.)

3. **Current page is the last item without `path`** — No explicit `current` boolean property. The container detects that the last slotted item has no `path` and applies `aria-current="page"` and the `current` state attribute to it. This differs from `<vaadin-side-nav-item>`, which has a `current` property driven by URL matching — breadcrumbs don't do path matching. (See web-component-api.md §1, §8.)

4. **Declarative items only — no programmatic `items` property.** Items are always `<vaadin-breadcrumb-item>` light-DOM children of the container. Unlike `<vaadin-menu-bar>` (where nested sub-menus make a declarative API impractical, see [#925](https://github.com/vaadin/web-components/issues/925)) the breadcrumb trail's flat structure is straightforward to express declaratively, so a parallel `items` array would be redundant.

5. **Separator via `mask-image` CSS on an `::after` pseudo-element** — A separator pseudo-element is rendered on every element that sits in the list flow: on `<vaadin-breadcrumb-item>` via `:host::after` (in the item's base styles) and on `[part="overflow"]` via `::after` (in the container's base styles). Both use the same `mask-image` pattern from button-base-styles (background: currentColor, shaped by mask-image) and the same `--vaadin-breadcrumb-trail-separator` custom property, which defaults to `--_vaadin-icon-chevron-right`. In RTL, the icon is flipped via `transform: scaleX(-1)`. (See web-component-api.md §3.)

6. **Progressive overflow collapse using `ResizeMixin`** — The container uses `ResizeMixin` to detect when items don't fit. Items collapse from closest-to-root first, replacing collapsed items with an overflow button (`…`). The overflow button opens a dedicated `<vaadin-breadcrumb-trail-overlay>` element (extending `OverlayMixin`) that lists the hidden items. Using the shared overlay infrastructure — rather than a hand-rolled `position: fixed` panel in shadow DOM — brings focus trapping, stacking-context handling, top-layer rendering via the popover API, and outside-click/Escape handling for free. The `i18n` property (via `I18nMixin`) allows localizing the overflow button's `aria-label`. (See web-component-api.md §4.)

7. **Navigation landmark via `role="navigation"` on the host** — `<vaadin-breadcrumb-trail>` sets `role="navigation"` on itself rather than wrapping its shadow DOM around an inner `<nav>`. The application supplies the accessible name via `aria-label` directly on the host. No default label is provided. (See web-component-api.md §7.)

8. **List item semantics via `role="listitem"` on the host** — `<vaadin-breadcrumb-item>` sets `role="listitem"` on itself rather than wrapping its shadow DOM around an inner `<li>`. This keeps both components free of redundant semantic wrappers, consistent with the design rule in DESIGN_GUIDELINES.md.

9. **No `suffix` slot on items** — Only a `prefix` slot is provided, matching the known use case (icons). (See web-component-api.md Discussion.)

---

## Implementation

### Elements

**`<vaadin-breadcrumb-trail>`** — Container element

The host carries `role="navigation"`. Items are distributed across two slots so the overflow element can sit in the DOM between the root item and the rest — ensuring DOM order matches the visual order `[root] [overflow] [rest…]` per DESIGN_GUIDELINES.

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
<vaadin-breadcrumb-trail-overlay
  .owner="${this}"
  .opened="${this._overlayOpened}"
  .renderer="${this._overlayRenderer}"
  .positionTarget="${this._overflowButton}"
  exportparts="overlay, content: overlay-content"
>
  <slot name="overlay"></slot>
</vaadin-breadcrumb-trail-overlay>
```

The `<div role="list">` is used instead of `<ol>` because (a) `<ol>` accepts only `<li>` children per HTML spec, and the slotted elements are `<vaadin-breadcrumb-item>`, and (b) `<ol>`/`<ul>` with `list-style: none` has its list role stripped by Safari/VoiceOver, which would suppress "list with N items" announcements. An explicit `role="list"` is immune to both issues.

`<vaadin-breadcrumb-trail-overlay>` is rendered directly in the breadcrumb's shadow DOM, matching the convention of `<vaadin-combo-box>`, `<vaadin-avatar-group>`, `<vaadin-menu-bar-submenu>`, and other Vaadin overlay-hosting components. The breadcrumb's renderer writes hidden-item links into the **light DOM** projected through `<slot name="overlay">` (not into the overlay's `[part="content"]` shadow tree) so global CSS can style them. To make this work, the overlay sets `_rendererRoot` to the host of the slotted light-DOM container, mirroring the pattern in `SelectOverlayMixin`.

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `i18n` | `{ moreItems?: string }` | `{ moreItems: '' }` | No | Internationalization object. `moreItems` sets the `aria-label` of the overflow button. |

| Slot | Description |
|---|---|
| `root` | The first `<vaadin-breadcrumb-item>` in the trail. The container assigns `slot="root"` to the first item automatically — the application does not set it. |
| (default) | All remaining `<vaadin-breadcrumb-item>` elements in the trail. |

| Part | Description |
|---|---|
| `list` | The element with `role="list"` wrapping all items. |
| `overflow` | The listitem element containing the overflow button. |
| `overflow-button` | The button that reveals collapsed items. |

The overflow overlay's outer panel and its inner wrapper live on `<vaadin-breadcrumb-trail-overlay>` and are re-exported on the breadcrumb host through `exportparts="overlay, content: overlay-content"` — the overlay's `content` part is renamed to `overlay-content` on export so it does not collide with anything else themes might expect on the breadcrumb. Themes target them as `vaadin-breadcrumb-trail::part(overlay)` and `vaadin-breadcrumb-trail::part(overlay-content)`. The `<vaadin-breadcrumb-trail-overlay>` element itself is an internal implementation detail and is not part of the theming contract.

| State attribute | Description |
|---|---|
| `has-overflow` | Set when one or more items are collapsed into the overflow overlay. |

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-trail-separator` | `var(--_vaadin-icon-chevron-right)` | The mask-image icon used as the separator between items. Set on `<vaadin-breadcrumb-trail>` to change the separator for all items. |

Internal behavior:

- **Slot observation and root assignment.** The breadcrumb subclasses `SlotController` and overrides `initNode`/`initCustomNode` to watch the children. When children change, the controller sets `slot="root"` on the first `<vaadin-breadcrumb-item>` child and removes `slot` from any previous holder. This routes the first item into the named `root` slot in shadow DOM, so the overflow element sits in the DOM between the root and the rest — matching visual order. The same controller pass also re-evaluates overflow detection and `current` state on the last item.
- **Overflow detection.** On resize (via `ResizeMixin`) and on slot changes, the component measures whether all items fit within the container width. If not, it progressively hides items starting from the one closest to the root (the first default-slot item), setting a `data-overflow-hidden` attribute on each hidden item. If further space is needed, the root item collapses too. The last item (current page) never collapses. Hidden items are listed in the overflow overlay.
- **Overlay management.** The breadcrumb renders `<vaadin-breadcrumb-trail-overlay>` directly in its shadow DOM, with `.owner` bound to the host, `.opened` bound to an internal reactive state, `.positionTarget` bound to the overflow button, and `.renderer` bound to a callback that populates the overlay's content with links for the currently hidden items. Clicking the overflow button toggles `_overlayOpened`; `OverlayMixin` handles outside-click, Escape, focus handling, top-layer rendering via the popover API, and stacking. The breadcrumb does not touch positioning or event wiring beyond that.
- **Overflow separator.** The overflow element sits in the list flow between the root and the rest, so it needs a separator after it when visible. The container's base styles render a `[part="overflow"]::after` pseudo-element using the same `mask-image` + `currentColor` pattern as `<vaadin-breadcrumb-item>`, reading the same `--vaadin-breadcrumb-trail-separator` custom property, and applying the same RTL flip (`transform: scaleX(-1)`). When `has-overflow` is not set, the overflow element is hidden, so the separator is not visible either.

---

**`<vaadin-breadcrumb-item>`** — Individual breadcrumb item

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
<span part="current">
  <slot name="prefix"></slot>
  <span part="label">
    <slot></slot>
  </span>
</span>
```

The outer wrapper carries `part="link"` when the item is interactive and `part="current"` when it is the non-link current page. Distinct part names let themes target the two cases without `:not([path])` selectors and avoid implying that the current page is a link.

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `path` | `string \| null \| undefined` | `undefined` | No | The URL to navigate to. When set, the item renders as an `<a>` link. When absent, the item renders as a non-interactive `<span>`. |

| Slot | Description |
|---|---|
| (default) | Text label of the breadcrumb item. |
| `prefix` | Content before the label (typically a `<vaadin-icon>`). |

| Part | Description |
|---|---|
| `link` | The `<a>` element containing the label, when the item is interactive (`path` is set). |
| `current` | The `<span>` element containing the label, when the item is the current page (`path` is not set). Mutually exclusive with `link`. |
| `label` | The `<span>` wrapping the default slot text. Present in both cases. |

| State attribute | Description |
|---|---|
| `current` | Set by the parent `<vaadin-breadcrumb-trail>` on the last item when it has no `path`. |
| `has-prefix` | Set when the `prefix` slot has content. |

Internal behavior:

- **Link rendering.** When `path` is set, renders `<a href="${path}" part="link">`, matching the approach in `<vaadin-side-nav-item>`. When `path` is not set, renders `<span part="current">`. The `<a>` is a plain HTML link — no router integration, no click interception. SPA routers intercept link clicks at the document level.
- **Separator rendering.** A `:host::after` pseudo-element renders the separator. It uses `background: currentColor` with `mask-image: var(--vaadin-breadcrumb-trail-separator)`, following the button-base-styles pattern. The last item's separator is hidden via `:host(:last-of-type)::after { display: none }`. Items with the `current` attribute also hide the separator. The same separator styling is duplicated on the container's `[part="overflow"]::after` (see the container's Overflow separator behavior) so the overflow element visually matches peer items in the list flow.
- **RTL separator flip.** In RTL contexts, `:host::after` gets `transform: scaleX(-1)`.
- **`aria-current="page"`.** When the parent sets the `current` state attribute on the host, the inner `<span part="current">` element gets `aria-current="page"`.
- **Prefix slot.** A `SlotController` observes the `prefix` slot and toggles `has-prefix` on the host for styling.

---

**`<vaadin-breadcrumb-trail-overlay>`** — Overflow overlay

Internal element used only by `<vaadin-breadcrumb-trail>`. Not intended for application use. Built on `OverlayMixin` plus `PositionMixin` (both from `packages/overlay`) and a new `BreadcrumbTrailOverlayMixin`, matching the pattern used by other Vaadin overlays: `<vaadin-combo-box-overlay>` pairs these with `ComboBoxOverlayMixin`, `<vaadin-menu-bar-overlay>` with `MenuOverlayMixin`, and so on. The component-specific mixin carries any overlay behavior specific to the host component (theme-attribute propagation, position adjustments, close-behavior tweaks). `PositionMixin` is what provides the `positionTarget` property used by the breadcrumb to anchor the overlay to the overflow button.

Shadow DOM:
```html
<div part="overlay">
  <div part="content" role="list">
    <slot></slot>
  </div>
</div>
```

The element exposes no public properties or slots of its own — it inherits everything it needs from `OverlayMixin` and `PositionMixin`. The breadcrumb binds the inherited `opened`, `owner`, `renderer`, and `positionTarget` properties internally; applications do not set them.

| Part | Description |
|---|---|
| `overlay` | The outer panel. Inherited `OverlayMixin` part naming. Re-exported on the breadcrumb host as `overlay` via `exportparts`. |
| `content` | The inner wrapper holding the overlay content. Carries `role="list"` so the slotted `<vaadin-breadcrumb-item>` elements (each `role="listitem"`) form a valid ARIA list. Inherited `OverlayMixin` part naming. Re-exported on the breadcrumb host as **`overlay-content`** via `exportparts="content: overlay-content"`, so theme authors targeting the breadcrumb's host write `vaadin-breadcrumb-trail::part(overlay-content)` and there is no ambiguity with the breadcrumb's own parts. |

Internal behavior:

- **Light-DOM rendering via `_rendererRoot`.** The overlay sets `_rendererRoot` to a host that lives in the breadcrumb's light DOM (slotted through `<slot name="overlay">` from the breadcrumb host into the overlay's default slot). The breadcrumb's `renderer` writes the hidden-item `<vaadin-breadcrumb-item>` elements into that light-DOM root rather than into the overlay's shadow `[part="content"]`, so global page CSS reaches them. This mirrors the pattern in `SelectOverlayMixin`.
- **Top-layer rendering.** `OverlayMixin` sets `popover="manual"` on the host in `firstUpdated()`, promoting the overlay to the browser's top layer when opened. The overlay renders above sibling and ancestor content, immune to `overflow: hidden` clipping and z-index stacking issues, even though the element itself sits in the breadcrumb's shadow DOM.
- **Close on outside click and Escape.** Provided by `OverlayMixin`. The breadcrumb does not re-implement either.
- **Positioning relative to the overflow button.** Driven by the `positionTarget` property from `PositionMixin`, matching the convention used by `<vaadin-combo-box-overlay>` and `<vaadin-avatar-group-overlay>`.
- **Keyboard interaction within the open overlay.** Items are reachable via two parallel mechanisms:
  - **Tab order** — links are part of the document tab cycle, so users navigating the page with Tab traverse them in DOM order. This matches every other anchor on the page and is the path screen-reader users naturally take.
  - **Arrow keys** — Up/Down arrows move focus between adjacent links inside the open overlay (Home/End jump to first/last). The overlay reads as a menu visually, so menu-style keyboard navigation is supported alongside tabbing. Pressing `Tab` while an item is focused continues the document tab cycle (does not trap focus inside the overlay); `Escape` closes the overlay and returns focus to the overflow button.

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

### `packages/component-base/src/slot-controller.js` — Used as-is (extended)

The breadcrumb container subclasses `SlotController` and overrides `initNode`/`initCustomNode` to react when `<vaadin-breadcrumb-item>` children are added or removed.

### `packages/overlay/src/vaadin-overlay-mixin.js` — Used as-is

`<vaadin-breadcrumb-trail-overlay>` extends `OverlayMixin` for the overflow overlay. Provides `opened` / `owner` / `renderer`, top-layer rendering via the popover API, outside-click / Escape closing, focus trapping, and stacking via `OverlayStackMixin`. No modification needed — the overlay is structurally identical to `<vaadin-menu-bar-overlay>`.

### `packages/overlay/src/vaadin-overlay-position-mixin.js` (`PositionMixin`) — Used as-is

`<vaadin-breadcrumb-trail-overlay>` extends `PositionMixin` for the `positionTarget` property used to anchor the overlay to the overflow button. Same usage pattern as `<vaadin-combo-box-overlay>` and `<vaadin-avatar-group-overlay>`. No modification needed.

### `packages/select/src/vaadin-select-overlay-mixin.js` — Reference for `_rendererRoot`

`<vaadin-breadcrumb-trail-overlay>` follows the `_rendererRoot` pattern from `SelectOverlayMixin` so the renderer writes into a light-DOM root projected through `<slot name="overlay">` rather than into the overlay's shadow `[part="content"]`. This lets global page CSS style the rendered hidden-item links. No code is reused directly; `SelectOverlayMixin` is named here as the implementation reference.

---

## Discussion

Decisions made during specification review, with their reasoning.

**Q: Why is there no programmatic `items` property?**

An earlier revision exposed an `items` data array (`{ text, path }[]`) on `<vaadin-breadcrumb-trail>` mirroring the declarative API, on the principle that "both should coexist". In review, that principle was reconsidered — across the Vaadin component set only `<vaadin-select>` exposes both, and that was justified by overlay-teleportation limits, not by a general rule. Unlike `<vaadin-menu-bar>` (where nested sub-menus make a declarative API impractical, see [#925](https://github.com/vaadin/web-components/issues/925)), the breadcrumb trail's flat structure is straightforward to express declaratively. Dropping the parallel API removes a non-trivial chunk of implementation (an `items`-driven Lit `render()` pass plus the `BreadcrumbItemData` type) and still covers every documented use case via slotted `<vaadin-breadcrumb-item>` children. If a real need for the data-array form emerges later it can be added; until then it is intentionally absent.

**Q: Why does the overlay's renderer write into light DOM via a slot rather than directly into `[part="content"]`?**

So global page CSS can style the rendered hidden-item links. Anything written into the overlay's shadow `[part="content"]` is unreachable from page-level stylesheets, which would force users into `::part` workarounds and break the styling contract that other overlay-hosting components (notably `<vaadin-select>`) already establish. The overlay sets `_rendererRoot` to a light-DOM host slotted through `<slot name="overlay">` — the same mechanism `SelectOverlayMixin` uses — and the breadcrumb's renderer writes there.

**Q: Why expose the `overlay` and `content` parts on the breadcrumb host rather than on `<vaadin-breadcrumb-trail-overlay>`?**

`<vaadin-breadcrumb-trail-overlay>` is an internal element — applications and theme authors should not need to know it exists. Re-exporting its parts via `exportparts="overlay, content"` lets themes target `vaadin-breadcrumb-trail::part(overlay)` directly, which keeps the theming surface inside the public element name and avoids leaking the overlay's identity into stylesheet selectors.

**Q: Why is the overlay's `content` part re-exported as `overlay-content` on the breadcrumb host?**

`OverlayMixin` names the outer panel `overlay` and the inner wrapper `content`. Re-exporting both names verbatim onto `<vaadin-breadcrumb-trail>` would expose `vaadin-breadcrumb-trail::part(content)` to theme authors — and "content" reads as if it should refer to the visible trail of items, not to the inner wrapper of the overflow popup that only appears when items collapse. To avoid that misreading, the overlay element re-exports `content` as `overlay-content` on the breadcrumb host (`exportparts="overlay, content: overlay-content"`). The overlay's `overlay` part keeps its name on the host because there is no comparable ambiguity. Inside `<vaadin-breadcrumb-trail-overlay>` itself the part is still called `content`, matching every other Vaadin overlay; the rename is a host-side disambiguation only.

**Q: Why does the current item carry `part="current"` rather than reusing `part="link"`?**

Distinct part names match the two cases the item can be in (interactive anchor vs. non-interactive label). Reusing `part="link"` for both forces theme authors to write `vaadin-breadcrumb-item:not([path])::part(link)` to target the current page, and reads as if the current page were a link — which it explicitly is not. `part="current"` aligns with the `current` state attribute and lets themes style the two cases independently with simple selectors.

**Q: Why does the overflow overlay support both arrow keys and Tab?**

The overlay reads visually as a menu, so users coming from menu-bar / context-menu expect Up/Down arrow keys to move between entries. At the same time, it is a list of plain anchors, and screen-reader users (plus power users navigating the page entirely with Tab) expect to traverse those anchors via the standard tab cycle. Supporting both — Tab as the primary, document-level focus mechanism, arrow keys as a menu-style convenience — covers both audiences without forcing one to adopt the other's interaction model. Escape closes the overlay regardless of how focus arrived.

**Q: Should `<vaadin-breadcrumb-item>` expose a `target` property?**

No. An earlier revision included `target` mirroring `<vaadin-side-nav-item>`'s support for `_blank`-style anchor targets. It was removed because a breadcrumb trail represents the user's position within a single application hierarchy, and opening an ancestor in a new tab is not a supported interaction — it would produce two tabs of the same application, neither reflecting the other's state. The rendered `<a>` still honours standard HTML link behaviour (middle-click, Ctrl/Cmd-click for user-driven new-tab/new-window opens) because the browser handles those on its own; only the programmatic `target` attribute is dropped. Reintroducing `target` is strictly additive if a concrete use case emerges.

**Q: Should the overflow panel be called a "dropdown"?**

No. Vaadin components generally avoid the term "dropdown" — menu-bar, select, combo-box, and AvatarGroup all expose `overlay` and `content` parts. The breadcrumb follows the AvatarGroup pairing: an `overlay` part for the outer panel and a `content` part for the inner wrapper holding the collapsed items.

**Q: Should `SlotChildObserveController` be used to observe item children?**

No. `SlotChildObserveController` bundles two concerns the breadcrumb does not need: observing `id`-attribute mutations for ARIA references (useful to field components) and firing a generic "content changed" event. For breadcrumb's needs — reacting when items are added or removed — subclassing `SlotController` and overriding `initNode`/`initCustomNode` is sufficient and keeps the dependency surface minimal.

**Q: Should the shadow DOM wrap content in `<nav>` and each item in `<li>`?**

No. Per the "Use `role` on the host instead of a semantic wrapper inside it" rule in DESIGN_GUIDELINES.md, `<vaadin-breadcrumb-trail>` carries `role="navigation"` on the host and `<vaadin-breadcrumb-item>` carries `role="listitem"` on the host. The inner list wrapper in the container is retained as a genuine exception — a single element cannot carry both the `navigation` and `list` roles, so the list semantics live on an inner element.

**Q: Should the list wrapper be `<ol>` or a generic element with `role="list"`?**

A generic element with explicit `role="list"`. Two reasons: (a) HTML `<ol>` accepts only `<li>` children, and the slotted items are `<vaadin-breadcrumb-item>` custom elements, so `<ol>` would be non-conforming; (b) Safari + VoiceOver strips the list role from `<ol>`/`<ul>` when `list-style: none` is applied (which a themed breadcrumb always applies), suppressing "list with N items" announcements. Explicit `role="list"` is immune to both issues.

**Q: How is the overflow element positioned so it appears visually between the root and the rest of the items?**

Two shadow slots with the overflow in shadow DOM between them: `<slot name="root"></slot>`, then `<div part="overflow">`, then `<slot></slot>`. The component's `SlotController` assigns `slot="root"` to the first `<vaadin-breadcrumb-item>` child automatically — the application doesn't set it. This keeps DOM order aligned with visual order `[root] [overflow] [rest…]`, satisfying the "focus order matches visual order" rule. The alternative considered — inserting the overflow as a light-DOM sibling between items — was rejected because it would add a component-authored element to the user's light DOM, changing `breadcrumb.children.length` and conflicting with the "light DOM is the application's territory" principle.

**Q: Should the overflow panel use `OverlayMixin` or be a plain `<div>` positioned with `position: fixed`?**

`OverlayMixin`, via a dedicated `<vaadin-breadcrumb-trail-overlay>` element. A hand-rolled fixed-positioned `<div>` in shadow DOM was considered but rejected — it would miss focus trapping, stacking-context handling, top-layer rendering via the popover API, and outside-click/Escape handling, all of which `OverlayMixin` provides for free and which other Vaadin overlays (menu-bar, combo-box, dialog, context-menu) already rely on. `<vaadin-breadcrumb-trail-overlay>` is rendered directly in the breadcrumb's shadow DOM with its properties (`owner`, `opened`, `renderer`, `positionTarget`, `exportparts`) bound to the breadcrumb's state — matching the pattern in `<vaadin-combo-box>`, `<vaadin-avatar-group>`, `<vaadin-menu-bar-submenu>`, and other overlay hosts.
