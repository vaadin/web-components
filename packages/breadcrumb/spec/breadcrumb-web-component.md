# Vaadin Breadcrumb Web Component

> ⚠️ This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.breadcrumbComponent = true`

## Usage Examples

### 1. Basic Navigation

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/products/widgets">Widgets</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Sprocket</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

### 2. With Items Property (Data-Driven)

```html
<vaadin-breadcrumb></vaadin-breadcrumb>
<script>
  document.querySelector('vaadin-breadcrumb').items = [
    { text: 'Home', path: '/' },
    { text: 'Products', path: '/products' },
    { text: 'Widgets', path: '/products/widgets' },
    { text: 'Sprocket' }  // current page — no path
  ];
</script>
```

### 3. Responsive Overflow

The component automatically manages overflow based on available width. Item visibility is based on priority order: current page highest priority, then parent, then root, then remaining ancestors. Hidden items are accessible via an overflow popover.

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/products/widgets">Widgets</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/products/widgets/sprockets">Sprockets</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Turbo Sprocket</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```
For example:

1. `Home / Products / Widgets / Sprockets / Turbo Sprocket`
2. `Home / ... / Sprockets / Turbo Sprocket`
3. `Home / ... / Turbo Sprocket`
4. `... / Turbo Sprocket`

If there is not enough space for `... / Turbo Sprocket`, it is truncated

There is never a case where an item (other than the root) before a hidden item would be shown, e.g. `Home / ... / Widgets / Turbo Sprocket` is not possible as `Sprockets` is hidden and thus `Widgets` is also hidden.

### 4. With Icons (Prefix Slot)

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">
    <vaadin-icon icon="vaadin:home" slot="prefix"></vaadin-icon>
    Home
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Widgets</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

---
### Key Design Decisions

1. **Slotted children as primary API** — web-component-native, composable, works with any framework. Also support `items` property for data-driven usage.
2. **Auto `aria-current="page"`** on the last item when it has no `path`.
3. **Priority-based responsive overflow** — always driven by available width via `ResizeMixin`. Items shown in priority order: current, parent, root, then remaining ancestors. No manual `maxItems` configuration needed.
4. **Popover for hidden overflow items** — not just expand-in-place, but a dropdown menu.
5. **`role="navigation"` on host** instead of `<nav>` in shadow DOM — follows the same pattern as `vaadin-side-nav` for cross-component consistency.
6. **`path` property** on items instead of `href` — consistent with `vaadin-side-nav-item`. The component renders an `<a href="...">` internally, mapping `path` to the anchor's `href`.
7. **No default `label` value** — left undefined by default to avoid baked-in English text and align with how other Vaadin components handle i18n.

---

## Implementation

### Elements

**`<vaadin-breadcrumb>`** — Container element

Has `role="navigation"` set on the host element (following the same pattern as `vaadin-side-nav`). The `aria-label` is set on the host element.

Shadow DOM renders: 
```html
<ol part="list"><slot></slot></ol>
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `items` | `Array<{text: string, path?: string, disabled?: boolean}>` | `undefined` | No | Data-driven items (alternative to slotted children) |
| `label` | `string` | `undefined` | No | `aria-label` for the navigation landmark |

| Slot | Description |
|---|---|
| (default) | `<vaadin-breadcrumb-item>` elements |

Parts in addition to the ones defined in the shadow DOM

| Part | Description |
|---|---|
| `overflow` | The ellipsis button element |
| `overflow-item` | Items inside the overflow popover |

| Event | Description |
|---|---|

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-separator-symbol` | `/` (Lumo: `var(--lumo-icons-angle-right)`) | Separator character/icon |
| `--vaadin-breadcrumb-separator-color` | `var(--vaadin-text-color-secondary)` | Separator color |
| `--vaadin-breadcrumb-separator-size` | `var(--lumo-font-size-s)` | Separator font size |
| `--vaadin-breadcrumb-separator-gap` | `var(--lumo-space-xs)` | Space around separator |

---

**`<vaadin-breadcrumb-item>`** — Individual breadcrumb item

Has `role="listitem"`

Shadow DOM renders
```html
    <slot name="prefix"></slot>
    <a part="link" href="..."><slot></slot></a><!-- or <span> if no path -->
```

The separator is added as a pseudo element

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `path` | `string` | `undefined` | Yes | Navigation target (consistent with `vaadin-side-nav-item`); if absent, item is current page |
| `disabled` | `boolean` | `false` | Yes | Disables navigation |

| Slot | Description |
|---|---|
| (default) | Item label text |
| `prefix` | Content before label (e.g., icon) |

Parts in addition to the ones defined in the shadow DOM

| Part | Description |
|---|---|

| Event | Description |
|---|---|

| CSS Custom Property | Default | Description |
|---|---|---|

