# Breadcrumb Web Component Specification

> This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.breadcrumbComponent = true`

## Key Design Decisions

1. **Two custom elements: `<vaadin-breadcrumb>` and `<vaadin-breadcrumb-item>`** — Follows the same container-plus-items shape as `<vaadin-side-nav>` / `<vaadin-side-nav-item>`. Items are light DOM children of the container, observed via a `SlotController`. Enables the declarative HTML API required by DESIGN_GUIDELINES.md.

2. **`path` attribute on items renders an `<a>` element in shadow DOM** — Matches `<vaadin-side-nav-item>`'s pattern: `path` maps to the `href` attribute of an internal `<a>`. When `path` is absent, the item renders a `<span>` instead. The rendered `<a>` is a plain link — router-agnostic per DESIGN_GUIDELINES.md. (See web-component-api.md §1.)

3. **Current page is the last item without `path`** — No explicit `current` boolean property. The container detects that the last slotted item has no `path` and applies `aria-current="page"` and the `current` state attribute to it. This differs from `<vaadin-side-nav-item>`, which has a `current` property driven by URL matching — breadcrumbs don't do path matching. (See web-component-api.md §1, §8.)

4. **Programmatic `items` property on the container** — An array of `{ text, path }` objects. When set, the container creates `<vaadin-breadcrumb-item>` elements internally, replacing any slotted children. Follows the `<vaadin-menu-bar>` pattern of an `items` array driving rendered child elements. Icons are only supported via the declarative API (`slot="prefix"`), not via `items`. (See web-component-api.md §6.)

5. **Separator via `mask-image` CSS on `:host::after`** — Each item (except the last) renders a separator via a `:host::after` pseudo-element on `<vaadin-breadcrumb-item>`, using the `mask-image` pattern from button-base-styles (background: currentColor, shaped by mask-image). The base styles define `--vaadin-breadcrumb-separator` pointing to `--_vaadin-icon-chevron-right`. In RTL, the icon is flipped via `transform: scaleX(-1)`. (See web-component-api.md §3.)

6. **Progressive overflow collapse using `ResizeMixin`** — The container uses `ResizeMixin` to detect when items don't fit. Items collapse from closest-to-root first, replacing collapsed items with an overflow button (`…`). The overflow button opens an overlay listing the hidden items. The `i18n` property (via `I18nMixin`) allows localizing the overflow button's `aria-label`. (See web-component-api.md §4.)

7. **Navigation landmark via `role="navigation"` on the host** — `<vaadin-breadcrumb>` sets `role="navigation"` on itself rather than wrapping its shadow DOM around an inner `<nav>`. The application supplies the accessible name via `aria-label` directly on the host. No default label is provided. (See web-component-api.md §7.)

8. **List item semantics via `role="listitem"` on the host** — `<vaadin-breadcrumb-item>` sets `role="listitem"` on itself rather than wrapping its shadow DOM around an inner `<li>`. This keeps both components free of redundant semantic wrappers, consistent with the design rule in DESIGN_GUIDELINES.md.

9. **No `suffix` slot on items** — Only a `prefix` slot is provided, matching the known use case (icons). (See web-component-api.md Discussion.)

---

## Implementation

### Elements

**`<vaadin-breadcrumb>`** — Container element

Mixin chain:
```
BreadcrumbMixin(
  I18nMixin(DEFAULT_I18N,
    ResizeMixin(
      ElementMixin(
        ThemableMixin(
          PolylitMixin(
            LumoInjectionMixin(LitElement)
          )
        )
      )
    )
  )
)
```

The host carries `role="navigation"`.

Shadow DOM:
```html
<ol part="list">
  <slot></slot>
  <li part="overflow">
    <button part="overflow-button"
            aria-label="…"
            aria-haspopup="true"
            aria-expanded="false"
            hidden>
      <!-- ::before pseudo-element renders ellipsis icon via mask-image -->
    </button>
    <div part="overlay"
         role="list"
         hidden>
      <div part="content">
        <!-- Collapsed items rendered here as links -->
      </div>
    </div>
  </li>
</ol>
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `items` | `BreadcrumbItemData[] \| null \| undefined` | `undefined` | No | Programmatic items array. Each item: `{ text: string, path?: string }`. When set, replaces slotted children with generated `<vaadin-breadcrumb-item>` elements. |
| `i18n` | `{ moreItems?: string }` | `{ moreItems: '' }` | No | Internationalization object. `moreItems` sets the `aria-label` of the overflow button. |

| Slot | Description |
|---|---|
| (default) | `<vaadin-breadcrumb-item>` elements representing the trail. |

| Part | Description |
|---|---|
| `list` | The `<ol>` element wrapping all items. |
| `overflow` | The `<li>` element containing the overflow button and overlay. |
| `overflow-button` | The button that reveals collapsed items. |
| `overlay` | The overlay panel that appears when the overflow button is activated. |
| `content` | The wrapper inside the overlay that holds the collapsed items. |

| State attribute | Description |
|---|---|
| `has-overflow` | Set when one or more items are collapsed into the overflow overlay. |

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-separator` | `var(--_vaadin-icon-chevron-right)` | The mask-image icon used as the separator between items. Set on `<vaadin-breadcrumb>` to change the separator for all items. |

Internal behavior:

- **Slot observation.** The breadcrumb subclasses `SlotController` and overrides `initNode`/`initCustomNode` to re-evaluate overflow and `current` state when children are added or removed.
- **Overflow detection.** On resize (via `ResizeMixin`) and on slot changes, the component measures whether all items fit within the container width. If not, it progressively hides items starting from the one closest to the root (index 1, preserving the root at index 0), setting a `data-overflow-hidden` attribute on each hidden item. If further space is needed, the root collapses too. The last item (current page) never collapses. Hidden items are listed in the overflow overlay.
- **Overflow overlay positioning.** The overlay uses `position: fixed` with coordinates from `getBoundingClientRect()` on the overflow button, per WEB_COMPONENT_GUIDELINES. It closes on outside click, Escape key, and item activation.
- **Overflow DOM order.** The overflow `<li>` is placed in the shadow DOM immediately after the default slot, so when items render it appears right after the root item in light+shadow composition. This ensures focus order follows visual order per DESIGN_GUIDELINES.
- **`items` property.** When `items` is set, the component renders `<vaadin-breadcrumb-item>` elements into the light DOM using Lit's `render()`, following the `<vaadin-menu-bar>` pattern. Each generated item gets its `path` and text content from the corresponding items entry. When `items` is set to `null`/`undefined`, generated items are removed, and any slotted children take effect again.

---

**`<vaadin-breadcrumb-item>`** — Individual breadcrumb item

Mixin chain:
```
ElementMixin(
  ThemableMixin(
    PolylitMixin(
      LumoInjectionMixin(LitElement)
    )
  )
)
```

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
- **Separator rendering.** A `:host::after` pseudo-element renders the separator. It uses `background: currentColor` with `mask-image: var(--vaadin-breadcrumb-separator)`, following the button-base-styles pattern. The last item's separator is hidden via `:host(:last-of-type)::after { display: none }`. Items with the `current` attribute also hide the separator.
- **RTL separator flip.** In RTL contexts, `:host::after` gets `transform: scaleX(-1)`.
- **`aria-current="page"`.** When the parent sets the `current` attribute, the item's internal link/span element gets `aria-current="page"`.
- **Prefix slot.** A `SlotController` observes the `prefix` slot and toggles `has-prefix` on the host for styling.

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

No. Per the "Use `role` on the host instead of a semantic wrapper inside it" rule in DESIGN_GUIDELINES.md, `<vaadin-breadcrumb>` carries `role="navigation"` on the host and `<vaadin-breadcrumb-item>` carries `role="listitem"` on the host. The inner `<ol part="list">` in the container is retained as a genuine exception — a single element cannot carry both the `navigation` and `list` roles, so the list semantics live on an inner wrapper.
