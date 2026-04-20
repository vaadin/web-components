# Breadcrumb Web Component Specification

> This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.breadcrumbComponent = true`

## Key Design Decisions

1. **Two custom elements: `<vaadin-breadcrumb>` and `<vaadin-breadcrumb-item>`** — Follows the side-nav pattern (`<vaadin-side-nav>` + `<vaadin-side-nav-item>`). Items are light DOM children of the container, observed via `SlotChildObserveController`. This enables the declarative HTML API required by DESIGN_GUIDELINES.md.

2. **`path` attribute on items renders an `<a>` element in shadow DOM** — Matches side-nav-item's pattern: `path` property maps to the `href` attribute of an internal `<a>` element. When `path` is absent, the item renders as a `<span>` instead. The rendered `<a>` is a plain link — router-agnostic per DESIGN_GUIDELINES.md. (See web-component-api.md §1.)

3. **Current page is the last item without `path`** — No explicit `current` boolean property. The container detects that the last slotted item has no `path` and applies `aria-current="page"` and the `current` state attribute to it. This differs from side-nav-item which has a `current` property driven by URL matching — breadcrumbs don't do path matching. (See web-component-api.md §1, §8.)

4. **Programmatic `items` property on the container** — An array of `{ text, path }` objects. When set, the container creates `<vaadin-breadcrumb-item>` elements internally, replacing any slotted children. This follows the menu-bar pattern (items array → rendered child elements). Icons are only supported via the declarative API (`slot="prefix"`), not via `items`. (See web-component-api.md §6.)

5. **Separator via `mask-image` CSS on `::after` pseudo-element** — Each item (except the last) renders a separator `::after` pseudo-element using the `mask-image` pattern from button-base-styles (background: currentColor, shaped by mask-image). The base styles define `--vaadin-breadcrumb-separator` pointing to a new `--_vaadin-icon-chevron-right` icon in `style-props.js`. Applications override `--vaadin-breadcrumb-separator` on the `<vaadin-breadcrumb>` element. In RTL, the icon is flipped via `transform: scaleX(-1)`. (See web-component-api.md §3.)

6. **Progressive overflow collapse using `ResizeMixin`** — The container uses `ResizeMixin` to detect when items don't fit. Items collapse from closest-to-root first, replacing collapsed items with an overflow button (`…`). The overflow button opens a dropdown (fixed-positioned per WEB_COMPONENT_GUIDELINES) listing the hidden items. The `i18n` property (via `I18nMixin`) allows localizing the overflow button's `aria-label`. (See web-component-api.md §4.)

7. **Navigation landmark via `<nav>` in shadow DOM** — The shadow root wraps all content in a `<nav>` element. The application provides the accessible name via `aria-label` on the host, which is forwarded to the `<nav>` element using `aria-labelledby` pointing to a visually-hidden label, or by directly forwarding the attribute. No default label is provided. (See web-component-api.md §7.)

8. **No `suffix` slot on items** — Deferred until a real use case emerges. Only a `prefix` slot is provided, matching the known use case (icons). (See web-component-api.md Discussion.)

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

Shadow DOM:
```html
<nav>
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
      <div part="dropdown"
           role="list"
           hidden>
        <!-- Collapsed items rendered here as links -->
      </div>
    </li>
  </ol>
</nav>
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `items` | `BreadcrumbItem[] \| null \| undefined` | `undefined` | No | Programmatic items array. Each item: `{ text: string, path?: string }`. When set, replaces slotted children with generated `<vaadin-breadcrumb-item>` elements. |
| `i18n` | `{ moreItems?: string }` | `{ moreItems: '' }` | No | Internationalization object. `moreItems` sets the `aria-label` of the overflow button. |

| Slot | Description |
|---|---|
| (default) | `<vaadin-breadcrumb-item>` elements representing the trail. |

| Part | Description |
|---|---|
| `list` | The `<ol>` element wrapping all items. |
| `overflow` | The `<li>` element containing the overflow button and dropdown. |
| `overflow-button` | The button that reveals collapsed items. |
| `dropdown` | The dropdown panel listing collapsed items. |

| State attribute | Description |
|---|---|
| `has-overflow` | Set when one or more items are collapsed into the overflow menu. |

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-separator` | `var(--_vaadin-icon-chevron-right)` | The mask-image icon used as the separator between items. Set on `<vaadin-breadcrumb>` to change the separator for all items. |

Internal behavior:

- **Slot observation.** A `SlotChildObserveController` observes the default slot. When slotted children change, the component re-evaluates overflow and updates the `current` state on the last item.
- **Overflow detection.** On resize (via `ResizeMixin`) and on slot changes, the component measures whether all items fit within the container width. If not, it progressively hides items starting from the one closest to the root (index 1, preserving the root at index 0), setting a `data-overflow-hidden` attribute on each hidden item. If further space is needed, the root collapses too. The last item (current page) never collapses. Hidden items are listed in the overflow dropdown.
- **Overflow dropdown positioning.** The dropdown uses `position: fixed` with coordinates from `getBoundingClientRect()` on the overflow button, per WEB_COMPONENT_GUIDELINES. It closes on outside click, Escape key, and item activation.
- **Overflow DOM order.** The overflow `<li>` is placed in the DOM immediately after the root item's `<li>` wrapper, matching its visual position. This ensures focus order follows visual order per DESIGN_GUIDELINES.
- **`items` property.** When `items` is set, the component renders `<vaadin-breadcrumb-item>` elements into the light DOM using Lit's `render()` (following menu-bar's pattern). Each generated item gets its `path` and text content from the corresponding items entry. When `items` is set to `null`/`undefined`, generated items are removed, and any slotted children take effect again.

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

Shadow DOM:
```html
<li part="item">
  <a href="..." part="link">
    <slot name="prefix"></slot>
    <span part="label">
      <slot></slot>
    </span>
  </a>
  <!-- ::after pseudo-element renders separator via mask-image -->
</li>
```

When `path` is not set (current page):
```html
<li part="item">
  <span part="link">
    <slot name="prefix"></slot>
    <span part="label">
      <slot></slot>
    </span>
  </span>
</li>
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
| `item` | The `<li>` wrapper element. |
| `link` | The `<a>` or `<span>` element containing the label. |
| `label` | The `<span>` wrapping the default slot text. |

| State attribute | Description |
|---|---|
| `current` | Set by the parent `<vaadin-breadcrumb>` on the last item when it has no `path`. |
| `has-prefix` | Set when the `prefix` slot has content. |

Internal behavior:

- **Link rendering.** When `path` is set, renders `<a href="${path}" target="${target}">`. When `path` is not set, renders `<span>`. The `<a>` is a plain HTML link — no router integration, no click interception. SPA routers intercept link clicks at the document level.
- **Separator rendering.** The `::after` pseudo-element on `[part="item"]` renders the separator. It uses `background: currentColor` with `mask-image: var(--vaadin-breadcrumb-separator)`, following the button-base-styles pattern. The last item's separator is hidden via `:host(:last-of-type) [part="item"]::after { display: none }`. Items with the `current` attribute also hide the separator.
- **RTL separator flip.** In RTL contexts, the separator `::after` gets `transform: scaleX(-1)` to flip directional icons. This uses logical CSS — the base direction is detected via `:host([dir="rtl"])` or inherited direction.
- **`aria-current="page"`.** When the parent sets the `current` attribute, the item's internal link/span element gets `aria-current="page"`. The item itself does not determine whether it is current — the parent controls this.
- **Prefix slot.** A `SlotController` observes the `prefix` slot and toggles `has-prefix` on the host for styling.

---

## Reuse and Proposed Adjustments to Existing Modules

### `packages/component-base/src/styles/style-props.js` — Modification needed

**Change:** Add a `--_vaadin-icon-chevron-right` icon definition alongside the existing `--_vaadin-icon-chevron-down`.

```css
--_vaadin-icon-chevron-right: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>');
```

**Why:** The breadcrumb separator defaults to a right-pointing chevron. This icon does not exist in the shared icon set. Adding it to `style-props.js` makes it available to any component via the established `--_vaadin-icon-*` convention.

**Affected components:** None — this is a new icon definition. Existing components are unaffected.

---

### `packages/component-base/src/i18n-mixin.js` — Used as-is

The `I18nMixin` is used to provide the `i18n` property with a `moreItems` key for localizing the overflow button's `aria-label`. No modification needed.

---

### `packages/component-base/src/resize-mixin.js` — Used as-is

The `ResizeMixin` provides `_onResize()` callbacks when the host element's size changes. The breadcrumb container overrides this to trigger overflow detection. No modification needed.

---

### `packages/component-base/src/slot-child-observe-controller.js` — Used as-is

Used by the container to observe slotted `<vaadin-breadcrumb-item>` children. Triggers re-evaluation of overflow and current-item state when children are added, removed, or reordered. No modification needed.
