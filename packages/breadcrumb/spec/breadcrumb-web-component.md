# Vaadin Breadcrumb Web Component

## Usage Examples

### 1. Basic Navigation

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/products/widgets">Widgets</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Sprocket</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

### 2. With Items Property (Data-Driven)

```html
<vaadin-breadcrumb></vaadin-breadcrumb>
<script>
  document.querySelector('vaadin-breadcrumb').items = [
    { text: 'Home', href: '/' },
    { text: 'Products', href: '/products' },
    { text: 'Widgets', href: '/products/widgets' },
    { text: 'Sprocket' }  // current page — no href
  ];
</script>
```

### 3. Responsive Overflow

The component automatically manages overflow based on available width. Item visibility is based on priority order: current page highest priority, then parent, then root, then remaining ancestors. Hidden items are accessible via an overflow popover.

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/products/widgets">Widgets</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/products/widgets/sprockets">Sprockets</vaadin-breadcrumb-item>
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
  <vaadin-breadcrumb-item href="/">
    <vaadin-icon icon="vaadin:home" slot="prefix"></vaadin-icon>
    Home
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Widgets</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

---
### Key Design Decisions

1. **Slotted children as primary API** — web-component-native, composable, works with any framework. Also support `items` property for data-driven usage.
2. **Auto `aria-current="page"`** on the last item when it has no `href`.
3. **Priority-based responsive overflow** — always driven by available width via `ResizeMixin`. Items shown in priority order: current, parent, root, then remaining ancestors. No manual `maxItems` configuration needed.
4. **Popover for hidden overflow items** — not just expand-in-place, but a dropdown menu.

---

## Implementation

### Elements

**`<vaadin-breadcrumb>`** — Container element

Shadow DOM renders: 
```html
<nav aria-label="Breadcrumb"><ol part="list"><slot></slot></ol></nav>
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `items` | `Array<{text: string, href?: string, disabled?: boolean}>` | `undefined` | No | Data-driven items (alternative to slotted children) |
| `label` | `string` | `'Breadcrumb'` | No | `aria-label` for the `<nav>` element |

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

Shadow DOM renders
```html
  <li part="item">
    <slot name="prefix"></slot>
    <a part="link" href="..."><slot></slot></a>  <!-- or <span> if no href -->
    <span part="separator" aria-hidden="true"></span>
  </li>
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `href` | `string` | `undefined` | Yes | Navigation target; if absent, item is current page |
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

