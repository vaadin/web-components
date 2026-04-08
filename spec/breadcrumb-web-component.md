# Vaadin Breadcrumb Web Component — Implementation Spec

## Usage Examples

### Basic Navigation

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/products/widgets">Widgets</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Sprocket</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

### With Items Property (Data-Driven)

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

### Responsive Overflow

The component automatically manages overflow based on available width. Items are shown in priority order: current page first, then parent, then root, then remaining ancestors. Hidden items are accessible via an overflow popover.

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/products/widgets">Widgets</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item href="/products/widgets/sprockets">Sprockets</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Turbo Sprocket</vaadin-breadcrumb-item>
</vaadin-breadcrumb>

<!-- Full width:    Home / Products / Widgets / Sprockets / Turbo Sprocket -->
<!-- Narrower:      Home / ... / Sprockets / Turbo Sprocket -->
<!-- Narrower:      ... / Sprockets / Turbo Sprocket -->
<!-- Narrowest:     ... / Turbo Sprocket -->
<!-- Clicking "..." opens a popover listing the hidden items -->
```

### With Icons (Prefix Slot)

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

## Research Summary

### Sources Analyzed

- **Vaadin Issues**: [web-components#7960](https://github.com/vaadin/web-components/issues/7960) — detailed breadcrumb proposal by Vaadin team
- **VCF Add-on**: `@vaadin-component-factory/vcf-breadcrumb` v3.0.1 — existing community implementation with collapse, mobile mode, popover overflow
- **xdev-software/vaadin-breadcrumbs** — Flow-only hierarchical navigation add-on
- **WAI-ARIA Authoring Practices**: Definitive breadcrumb pattern (`nav > ol > li > a`, `aria-current="page"`)
- **MUI**: Auto-collapse with `maxItems`/`itemsBeforeCollapse`/`itemsAfterCollapse`; expand-in-place
- **Ant Design**: Data-driven `items` array; per-item dropdown menus; `itemRender` for router integration
- **Chakra UI**: Explicit compound components; size variants; slot recipe theming
- **Shoelace**: Web component with `href`-absent → button; auto `aria-current` on last item; per-item separator slot
- **Carbon (IBM)**: `isCurrentPage` prop; `BreadcrumbSkeleton`; `noTrailingSlash`; `OverflowMenu` integration
- **Adobe Spectrum**: Multiline variant; overflow at 5+ items; drag-and-drop support; root-context preserved during overflow
- **SAP UI5**: Multiple separator styles; responsive popover overflow; comprehensive keyboard navigation (F4, arrows); position announcements ("2 of 5")
- **React Aria**: `onAction` callback; `isDisabled`; `isCurrent` render prop
- **shadcn/ui**: Composable primitives; `asChild` for router composition

### Key Design Decisions

1. **Slotted children as primary API** (like Shoelace) — web-component-native, composable, works with any framework. Also support `items` property for data-driven usage.
2. **Auto `aria-current="page"`** on the last item when it has no `href` (following Shoelace pattern).
3. **Priority-based responsive overflow** — always driven by available width via `ResizeMixin`. Items shown in priority order: current, parent, root, then remaining ancestors. No manual `maxItems` configuration needed.
4. **Popover for hidden overflow items** — not just expand-in-place, but a dropdown menu (following Spectrum/SAP/Carbon patterns).

---

## Implementation Plan

### Phase 1: Core Component (MVP)

#### Elements

**`<vaadin-breadcrumb>`** — Container element

- Tag: `vaadin-breadcrumb`
- Mixin chain: `ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))`
- Shadow DOM renders: `<nav aria-label="Breadcrumb"><ol part="list"><slot></slot></ol></nav>`

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `items` | `Array<{text: string, href?: string, disabled?: boolean}>` | `undefined` | No | Data-driven items (alternative to slotted children) |
| `label` | `string` | `'Breadcrumb'` | No | `aria-label` for the `<nav>` element |

| Slot | Description |
|---|---|
| (default) | `<vaadin-breadcrumb-item>` elements |

| Part | Description |
|---|---|
| `list` | The `<ol>` element |

| Event | Description |
|---|---|
| — | None in Phase 1 |

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-separator-symbol` | `/` (Lumo: `var(--lumo-icons-angle-right)`) | Separator character/icon |
| `--vaadin-breadcrumb-separator-color` | `var(--vaadin-text-color-secondary)` | Separator color |
| `--vaadin-breadcrumb-separator-size` | `var(--lumo-font-size-s)` | Separator font size |
| `--vaadin-breadcrumb-separator-gap` | `var(--lumo-space-xs)` | Space around separator |

Behavior:
- On `firstUpdated()`, set `role` on internal elements (not on host — the `<nav>` is in shadow DOM)
- When `items` property is set, generate `<vaadin-breadcrumb-item>` elements in the default slot
- Observe slotted children via `SlotChildObserveController` to detect the last item and mark it as current
- Auto-apply `aria-current="page"` to the last item when it has no `href`

**`<vaadin-breadcrumb-item>`** — Individual breadcrumb item

- Tag: `vaadin-breadcrumb-item`
- Mixin chain: `ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))`
- Shadow DOM renders:
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

| Part | Description |
|---|---|
| `item` | The `<li>` element |
| `link` | The `<a>` or `<span>` element |
| `separator` | The separator element |

Behavior:
- When `href` is set: render `<a>` with the href; set `aria-hidden="true"` on host to avoid double screen reader announcements
- When `href` is absent: render `<span>` with `aria-current="page"`
- When `disabled`: render `<a>` with `aria-disabled="true"`, prevent click navigation
- Separator hidden on the last item via CSS (`:host(:last-of-type) [part="separator"] { display: none }`)
- Focus ring support via `FocusMixin` on the link element

#### File Structure

```
packages/breadcrumb/
├── package.json
├── README.md
├── LICENSE
├── vaadin-breadcrumb.js
├── vaadin-breadcrumb.d.ts
├── vaadin-breadcrumb-item.js
├── vaadin-breadcrumb-item.d.ts
├── src/
│   ├── vaadin-breadcrumb.js
│   ├── vaadin-breadcrumb.d.ts
│   ├── vaadin-breadcrumb-item.js
│   ├── vaadin-breadcrumb-item.d.ts
│   ├── vaadin-breadcrumb-item-mixin.js
│   ├── vaadin-breadcrumb-item-mixin.d.ts
│   └── styles/
│       ├── vaadin-breadcrumb-base-styles.js
│       ├── vaadin-breadcrumb-base-styles.d.ts
│       ├── vaadin-breadcrumb-item-base-styles.js
│       └── vaadin-breadcrumb-item-base-styles.d.ts
└── test/
    ├── breadcrumb.test.ts
    ├── breadcrumb-item.test.ts
    ├── typings/breadcrumb.types.ts
    ├── dom/breadcrumb.test.js
    └── visual/
        ├── lumo/breadcrumb.test.js
        ├── aura/breadcrumb.test.js
        └── base/breadcrumb.test.js
```

#### Theme Files

**Lumo** (`packages/vaadin-lumo-styles/`):
- `components/breadcrumb.css` — with injection markers
- `src/components/breadcrumb.css` — Lumo styles: angle-right separator icon, Lumo spacing/colors/typography

**Aura** (`packages/aura/src/components/`):
- `breadcrumb.css` — Aura styles using `:is(vaadin-breadcrumb)`, `light-dark()`, `oklch()`

#### Dev Page

`dev/breadcrumb.html` — playground with examples for:
- Basic breadcrumb
- Long breadcrumb trail (responsive overflow)
- With icons
- Items property usage
- RTL support

#### Testing

Unit tests (`breadcrumb.test.ts`):
- Custom element registration
- Default property values
- Slotted children rendering
- `items` property rendering
- `href` → `<a>` vs no-href → `<span>` rendering
- `aria-current="page"` on last item without href
- `aria-label` on nav element
- Separator visibility (hidden on last item)
- Disabled item behavior
- Keyboard navigation (Tab through links)
- `label` property reflected to `aria-label`

DOM snapshot tests, visual tests for base/Lumo/Aura, TypeScript type tests per guidelines.

---

### Phase 2: Responsive Overflow

Add automatic overflow handling based on available width, with a priority-based item visibility algorithm.

#### New Parts

| Part | Description |
|---|---|
| `overflow` | The ellipsis button element |
| `overflow-item` | Items inside the overflow popover |

#### Priority-Based Visibility Algorithm

When the component's available width cannot fit all items, items are hidden into an overflow popover. The visibility priority (highest to lowest) is:

1. **Current item** (last item) — always visible
2. **Parent** (second-to-last item) — shown if space allows
3. **Root** (first item) — shown if space allows
4. **Grandparent** (third-to-last) — shown if space allows
5. **Remaining ancestors** — filled in from closest-to-current outward, if space allows

Hidden items are replaced by a single ellipsis button (`...`) in their position within the trail. The ellipsis opens a `<vaadin-popover>` listing the hidden items in hierarchical order (root to current).

Example with 5 items as width decreases:
```
Full:      Home / Products / Widgets / Sprockets / Turbo Sprocket
Step 1:    Home / ... / Sprockets / Turbo Sprocket        (Products, Widgets hidden)
Step 2:    ... / Sprockets / Turbo Sprocket                (Home also hidden)
Step 3:    ... / Turbo Sprocket                            (only current visible)
```

#### Behavior

- Uses `ResizeMixin` to measure available width and recalculate visible items on resize
- On each resize, the algorithm measures items in priority order and shows as many as fit
- The ellipsis button appears whenever any items are hidden
- Ellipsis button: `aria-haspopup="true"`, `aria-expanded`, `aria-label="Show hidden items"`
- Popover items rendered as `<a role="menuitem">` in hierarchical order with proper focus management
- Keyboard: Enter/Space opens popover; Escape closes it; Up/Down arrows navigate popover items; focus returns to ellipsis on close
- As width increases, hidden items are restored according to the same priority order

#### Tests

- All items visible when enough space
- Items hidden in correct priority order as container shrinks
- Current item always remains visible even at minimum width
- Parent shown before root when space is limited
- Root shown before grandparent
- Ellipsis button renders when items are hidden
- Ellipsis button opens popover with hidden items in hierarchical order
- Popover keyboard navigation
- Focus management (return to ellipsis on close)
- ARIA attributes on ellipsis button
- Items restored in priority order as container grows
- Correct behavior when items are added/removed dynamically

---

### Phase 3: Router Integration & Advanced Features

#### Router Integration

| Event | Description |
|---|---|
| `item-click` | Fired when a breadcrumb item is clicked; `event.detail = { item, originalEvent }`; cancelable via `preventDefault()` to enable SPA navigation |

Behavior:
- `item-click` event fires before navigation
- If `event.preventDefault()` is called, the default `<a>` navigation is suppressed
- This enables SPA frameworks (Vaadin Router, React Router, etc.) to handle navigation without full page reloads

#### Per-Item Separator Override

| Slot on `<vaadin-breadcrumb-item>` | Description |
|---|---|
| `separator` | Custom separator for this item (overrides global separator) |

#### Disabled Items

Enhancement: disabled items without `href` that show text but don't navigate — for cases where a user has access to the current page but not a parent page.

---

## Documentation Plan (vaadin.com/docs)

### Component Page Structure

1. **Overview** — What breadcrumbs are, when to use them (hierarchical navigation, not lateral), screenshot
2. **Basic Usage** — Slotted children example, items property example
3. **Current Page** — How the last item without `href` is automatically marked as current
4. **Separators** — Default separator, customizing via CSS custom properties
5. **Icons** — Using prefix slot for icons (e.g., home icon on first item)
6. **Overflow** — Priority-based responsive overflow; visibility algorithm; overflow popover behavior
7. **Router Integration** — Using `item-click` event for SPA navigation; example with Vaadin Router
9. **Disabled Items** — When and how to disable items
10. **Accessibility** — ARIA roles, keyboard navigation, screen reader behavior
11. **Styling** — CSS custom properties reference, shadow parts reference, theme variants
12. **Best Practices** — Keep trails short (max 5-7 levels); don't use for filters; always include a root item; current page is optional but recommended

### Interactive Examples (Embedded)

- Basic breadcrumb
- Responsive overflow (resizable container demo showing priority-based collapse)
- With icons
- Data-driven (items property)
- Custom separators
