# Breadcrumb Web Component Specification

> This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.breadcrumbComponent = true`

## Key Design Decisions

1. **Two custom elements: `<vaadin-breadcrumb>` and `<vaadin-breadcrumb-item>`** — Follows the same container-plus-items shape as `<vaadin-side-nav>` / `<vaadin-side-nav-item>`. Items are light DOM children of the container, observed via a `SlotController`. Enables the declarative HTML API required by DESIGN_GUIDELINES.md.

2. **`path` attribute on items renders an `<a>` element in shadow DOM** — Matches `<vaadin-side-nav-item>`'s pattern: `path` maps to the `href` attribute of an internal `<a>`. When `path` is absent, the item renders a `<span>` instead. The rendered `<a>` is a plain link — router-agnostic per DESIGN_GUIDELINES.md. (See web-component-api.md §1.)

3. **Current page is the last item without `path`** — No explicit `current` boolean property. The container detects that the last slotted item has no `path` and applies `aria-current="page"` and the `current` state attribute to it. This differs from `<vaadin-side-nav-item>`, which has a `current` property driven by URL matching — breadcrumbs don't do path matching. (See web-component-api.md §1, §8.)

4. **Programmatic `items` property on the container** — An array of `{ text, path }` objects. When set, the container creates `<vaadin-breadcrumb-item>` elements internally, replacing any slotted children. Follows the `<vaadin-menu-bar>` pattern of an `items` array driving rendered child elements. Icons are only supported via the declarative API (`slot="prefix"`), not via `items`. (See web-component-api.md §6.)

5. **Separator via `mask-image` CSS on an `::after` pseudo-element** — A separator pseudo-element is rendered on every element that sits in the list flow: on `<vaadin-breadcrumb-item>` via `:host::after` (in the item's base styles) and on `[part="overflow"]` via `::after` (in the container's base styles). Both use the same `mask-image` pattern from button-base-styles (background: currentColor, shaped by mask-image) and the same `--vaadin-breadcrumb-separator` custom property, which defaults to `--_vaadin-icon-chevron-right`. In RTL, the icon is flipped via `transform: scaleX(-1)`. (See web-component-api.md §3.)

6. **Progressive overflow collapse using `ResizeMixin`** — The container uses `ResizeMixin` to detect when items don't fit. Items collapse from closest-to-root first, replacing collapsed items with an overflow button (`…`). The overflow button opens a dedicated `<vaadin-breadcrumb-overlay>` element (extending `OverlayMixin`) that lists the hidden items. Using the shared overlay infrastructure — rather than a hand-rolled `position: fixed` panel in shadow DOM — brings focus trapping, stacking-context handling, top-layer rendering via the popover API, and outside-click/Escape handling for free. The `i18n` property (via `I18nMixin`) allows localizing the overflow button's `aria-label`. (See web-component-api.md §4.)

7. **Navigation landmark via `role="navigation"` on the host** — `<vaadin-breadcrumb>` sets `role="navigation"` on itself rather than wrapping its shadow DOM around an inner `<nav>`. The application supplies the accessible name via `aria-label` directly on the host. No default label is provided. (See web-component-api.md §7.)

8. **List item semantics via `role="listitem"` on the host** — `<vaadin-breadcrumb-item>` sets `role="listitem"` on itself rather than wrapping its shadow DOM around an inner `<li>`. This keeps both components free of redundant semantic wrappers, consistent with the design rule in DESIGN_GUIDELINES.md.

9. **No `suffix` slot on items** — Only a `prefix` slot is provided, matching the known use case (icons). (See web-component-api.md Discussion.)

---

## Implementation

### Elements

**`<vaadin-breadcrumb>`** — Container element

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
<vaadin-breadcrumb-overlay
  .owner="${this}"
  .opened="${this._overlayOpened}"
  .renderer="${this._overlayRenderer}"
  .positionTarget="${this._overflowButton}"
  exportparts="overlay, content"
>
  <slot name="overlay"></slot>
</vaadin-breadcrumb-overlay>
```

The `<div role="list">` is used instead of `<ol>` because (a) `<ol>` accepts only `<li>` children per HTML spec, and the slotted elements are `<vaadin-breadcrumb-item>`, and (b) `<ol>`/`<ul>` with `list-style: none` has its list role stripped by Safari/VoiceOver, which would suppress "list with N items" announcements. An explicit `role="list"` is immune to both issues.

`<vaadin-breadcrumb-overlay>` is rendered directly in the breadcrumb's shadow DOM, matching the convention of `<vaadin-combo-box>`, `<vaadin-avatar-group>`, `<vaadin-menu-bar-submenu>`, and other Vaadin overlay-hosting components. The `<slot name="overlay">` inside it is part of that convention — it projects any light-DOM children of the breadcrumb with `slot="overlay"` into the overlay. Breadcrumb does not use this slot itself (the renderer writes directly into the overlay's `[part="content"]`), but it is retained for consistency with other overlay hosts.

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `items` | `BreadcrumbItemData[] \| null \| undefined` | `undefined` | No | Programmatic items array. Each item: `{ text: string, path?: string }`. When set, replaces slotted children with generated `<vaadin-breadcrumb-item>` elements. |
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

The `overlay` and `content` parts (the panel that appears when the overflow button is activated, and its inner wrapper) live on `<vaadin-breadcrumb-overlay>` — see the element definition below. Themes target them as `vaadin-breadcrumb-overlay::part(overlay)` and `vaadin-breadcrumb-overlay::part(content)`.

| State attribute | Description |
|---|---|
| `has-overflow` | Set when one or more items are collapsed into the overflow overlay. |

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-separator` | `var(--_vaadin-icon-chevron-right)` | The mask-image icon used as the separator between items. Set on `<vaadin-breadcrumb>` to change the separator for all items. |

Internal behavior:

- **Slot observation and root assignment.** The breadcrumb subclasses `SlotController` and overrides `initNode`/`initCustomNode` to watch the children. When children change, the controller sets `slot="root"` on the first `<vaadin-breadcrumb-item>` child and removes `slot` from any previous holder. This routes the first item into the named `root` slot in shadow DOM, so the overflow element sits in the DOM between the root and the rest — matching visual order. The same controller pass also re-evaluates overflow detection and `current` state on the last item.
- **Overflow detection.** On resize (via `ResizeMixin`) and on slot changes, the component measures whether all items fit within the container width. If not, it progressively hides items starting from the one closest to the root (the first default-slot item), setting a `data-overflow-hidden` attribute on each hidden item. If further space is needed, the root item collapses too. The last item (current page) never collapses. Hidden items are listed in the overflow overlay.
- **Overlay management.** The breadcrumb renders `<vaadin-breadcrumb-overlay>` directly in its shadow DOM, with `.owner` bound to the host, `.opened` bound to an internal reactive state, `.positionTarget` bound to the overflow button, and `.renderer` bound to a callback that populates the overlay's content with links for the currently hidden items. Clicking the overflow button toggles `_overlayOpened`; `OverlayMixin` handles outside-click, Escape, focus handling, top-layer rendering via the popover API, and stacking. The breadcrumb does not touch positioning or event wiring beyond that.
- **Overflow separator.** The overflow element sits in the list flow between the root and the rest, so it needs a separator after it when visible. The container's base styles render a `[part="overflow"]::after` pseudo-element using the same `mask-image` + `currentColor` pattern as `<vaadin-breadcrumb-item>`, reading the same `--vaadin-breadcrumb-separator` custom property, and applying the same RTL flip (`transform: scaleX(-1)`). When `has-overflow` is not set, the overflow element is hidden, so the separator is not visible either.
- **`items` property.** When `items` is set, the component renders `<vaadin-breadcrumb-item>` elements into the light DOM using Lit's `render()`, following the `<vaadin-menu-bar>` pattern. The controller assigns `slot="root"` to the first generated item just like it does for user-provided items. Each generated item gets its `path` and text content from the corresponding items entry. When `items` is set to `null`/`undefined`, generated items are removed, and any slotted children take effect again.

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
<span part="link">
  <slot name="prefix"></slot>
  <span part="label">
    <slot></slot>
  </span>
</span>
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `path` | `string \| null \| undefined` | `undefined` | No | The URL to navigate to. When set, the item renders as an `<a>` link. When absent, the item renders as a non-interactive `<span>`. |
| `target` | `string \| null \| undefined` | `undefined` | No | The link target (e.g. `_blank`). Only applies when `path` is set. |

| Slot | Description |
|---|---|
| (default) | Text label of the breadcrumb item. |
| `prefix` | Content before the label (typically a `<vaadin-icon>`). |

| Part | Description |
|---|---|
| `link` | The `<a>` or `<span>` element containing the label. |
| `label` | The `<span>` wrapping the default slot text. |

| State attribute | Description |
|---|---|
| `current` | Set by the parent `<vaadin-breadcrumb>` on the last item when it has no `path`. |
| `has-prefix` | Set when the `prefix` slot has content. |

Internal behavior:

- **Link rendering.** When `path` is set, renders `<a href="${path}" target="${target}">`, matching the approach in `<vaadin-side-nav-item>`. When `path` is not set, renders `<span>`. The `<a>` is a plain HTML link — no router integration, no click interception. SPA routers intercept link clicks at the document level.
- **Separator rendering.** A `:host::after` pseudo-element renders the separator. It uses `background: currentColor` with `mask-image: var(--vaadin-breadcrumb-separator)`, following the button-base-styles pattern. The last item's separator is hidden via `:host(:last-of-type)::after { display: none }`. Items with the `current` attribute also hide the separator. The same separator styling is duplicated on the container's `[part="overflow"]::after` (see the container's Overflow separator behavior) so the overflow element visually matches peer items in the list flow.
- **RTL separator flip.** In RTL contexts, `:host::after` gets `transform: scaleX(-1)`.
- **`aria-current="page"`.** When the parent sets the `current` attribute, the item's internal link/span element gets `aria-current="page"`.
- **Prefix slot.** A `SlotController` observes the `prefix` slot and toggles `has-prefix` on the host for styling.

---

**`<vaadin-breadcrumb-overlay>`** — Overflow overlay

Internal element used only by `<vaadin-breadcrumb>`. Not intended for application use. Extends `OverlayMixin`, matching the pattern of `<vaadin-menu-bar-overlay>`, `<vaadin-combo-box-overlay>`, and other Vaadin overlays.

Shadow DOM:
```html
<div part="overlay">
  <div part="content">
    <slot></slot>
  </div>
</div>
```

The element exposes no public properties or slots of its own — it inherits everything it needs from `OverlayMixin`. The breadcrumb binds the inherited `opened`, `owner`, `renderer`, and position-target properties internally; applications do not set them.

| Part | Description |
|---|---|
| `overlay` | The outer panel. Inherited `OverlayMixin` part naming. |
| `content` | The inner wrapper holding the overlay content. Inherited `OverlayMixin` part naming. |

Internal behavior:

- **Top-layer rendering.** `OverlayMixin` sets `popover="manual"` on the host in `firstUpdated()`, promoting the overlay to the browser's top layer when opened. The overlay renders above sibling and ancestor content, immune to `overflow: hidden` clipping and z-index stacking issues, even though the element itself sits in the breadcrumb's shadow DOM.
- **Close on outside click and Escape.** Provided by `OverlayMixin`. The breadcrumb does not re-implement either.
- **Positioning relative to the overflow button.** Driven by the `positionTarget` property, matching the convention used by `<vaadin-combo-box-overlay>` and `<vaadin-avatar-group-overlay>`.

---

## Types

```ts
/**
 * Data shape for an entry in the breadcrumb `items` array.
 */
export interface BreadcrumbItemData {
  text: string;
  path?: string;
}
```

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

`<vaadin-breadcrumb-overlay>` extends `OverlayMixin` for the overflow overlay. Provides `opened` / `owner` / `renderer`, top-layer rendering via the popover API, outside-click / Escape closing, focus trapping, and stacking via `OverlayStackMixin`. No modification needed — the overlay is structurally identical to `<vaadin-menu-bar-overlay>`.

---

## Discussion

Decisions made during specification review, with their reasoning.

**Q: Should the `items` property entry type be called `BreadcrumbItem`?**

No — `BreadcrumbItem` is the element class name for `<vaadin-breadcrumb-item>`. Reusing the same identifier for the data-entry type produces import collisions in application code (see [vaadin/web-components#6470](https://github.com/vaadin/web-components/issues/6470) for a prior incident). The element keeps the natural name; the data-entry type is `BreadcrumbItemData`.

**Q: Should the overflow panel be called a "dropdown"?**

No. Vaadin components generally avoid the term "dropdown" — menu-bar, select, combo-box, and AvatarGroup all expose `overlay` and `content` parts. The breadcrumb follows the AvatarGroup pairing: an `overlay` part for the outer panel and a `content` part for the inner wrapper holding the collapsed items.

**Q: What should the item's wrapper part be named?**

`content`. A part named `item` on an element that is itself called `vaadin-breadcrumb-item` is confusing, and "content" is the established name for the wrapper inside an item element in `<vaadin-side-nav-item>` and `<vaadin-item>`.

**Q: Should `SlotChildObserveController` be used to observe item children?**

No. `SlotChildObserveController` bundles two concerns the breadcrumb does not need: observing `id`-attribute mutations for ARIA references (useful to field components) and firing a generic "content changed" event. For breadcrumb's needs — reacting when items are added or removed — subclassing `SlotController` and overriding `initNode`/`initCustomNode` is sufficient and keeps the dependency surface minimal.

**Q: Should the shadow DOM wrap content in `<nav>` and each item in `<li>`?**

No. Per the "Use `role` on the host instead of a semantic wrapper inside it" rule in DESIGN_GUIDELINES.md, `<vaadin-breadcrumb>` carries `role="navigation"` on the host and `<vaadin-breadcrumb-item>` carries `role="listitem"` on the host. The inner list wrapper in the container is retained as a genuine exception — a single element cannot carry both the `navigation` and `list` roles, so the list semantics live on an inner element.

**Q: Should the list wrapper be `<ol>` or a generic element with `role="list"`?**

A generic element with explicit `role="list"`. Two reasons: (a) HTML `<ol>` accepts only `<li>` children, and the slotted items are `<vaadin-breadcrumb-item>` custom elements, so `<ol>` would be non-conforming; (b) Safari + VoiceOver strips the list role from `<ol>`/`<ul>` when `list-style: none` is applied (which a themed breadcrumb always applies), suppressing "list with N items" announcements. Explicit `role="list"` is immune to both issues.

**Q: How is the overflow element positioned so it appears visually between the root and the rest of the items?**

Two shadow slots with the overflow in shadow DOM between them: `<slot name="root"></slot>`, then `<div part="overflow">`, then `<slot></slot>`. The component's `SlotController` assigns `slot="root"` to the first `<vaadin-breadcrumb-item>` child automatically — the application doesn't set it. This keeps DOM order aligned with visual order `[root] [overflow] [rest…]`, satisfying the "focus order matches visual order" rule. The alternative considered — inserting the overflow as a light-DOM sibling between items — was rejected because it would add a component-authored element to the user's light DOM, changing `breadcrumb.children.length` and conflicting with the "light DOM is the application's territory" principle.

**Q: Should the overflow panel use `OverlayMixin` or be a plain `<div>` positioned with `position: fixed`?**

`OverlayMixin`, via a dedicated `<vaadin-breadcrumb-overlay>` element. A hand-rolled fixed-positioned `<div>` in shadow DOM was considered but rejected — it would miss focus trapping, stacking-context handling, top-layer rendering via the popover API, and outside-click/Escape handling, all of which `OverlayMixin` provides for free and which other Vaadin overlays (menu-bar, combo-box, dialog, context-menu) already rely on. `<vaadin-breadcrumb-overlay>` is rendered directly in the breadcrumb's shadow DOM with its properties (`owner`, `opened`, `renderer`, `positionTarget`, `exportparts`) bound to the breadcrumb's state — matching the pattern in `<vaadin-combo-box>`, `<vaadin-avatar-group>`, `<vaadin-menu-bar-submenu>`, and other overlay hosts.
