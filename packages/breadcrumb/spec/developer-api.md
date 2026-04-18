# Breadcrumb Developer API

## 1. Navigable trail with current page

Covers requirement(s): 1, 2

```html
<!-- Declarative: each item is a child element with a path -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/electronics">Electronics</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/electronics/laptops">Laptops</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>ThinkPad X1 Carbon</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

```js
// Programmatic: items array for data-driven trails
document.querySelector('vaadin-breadcrumb').items = [
  { text: 'Home', path: '/' },
  { text: 'Electronics', path: '/electronics' },
  { text: 'Laptops', path: '/electronics/laptops' },
  { text: 'ThinkPad X1 Carbon' },
];
```

**Why this shape:** The last item without a `path` is automatically treated as the current page — rendered as non-interactive text with `aria-current="page"`. This follows the Vaadin `side-nav-item` pattern where `path` drives navigation and its absence signals a non-navigable item. The declarative form works with no JavaScript; the programmatic form supports dynamic trails (e.g., derived from a route). Both produce identical rendering.

---

## 2. Visual separator

Covers requirement(s): 3, 4

```html
<!-- Default: theme provides a chevron separator that flips in RTL.
     No API surface needed — separators are rendered via CSS pseudo-elements. -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Shoes</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** Separators are purely decorative and do not require a slot or property. The theme renders them via CSS (e.g., a `::before` pseudo-element on each item after the first). Customizing the separator character or icon is done through CSS custom properties or theme overrides — no JavaScript API needed. The default chevron is directional and flips automatically in RTL via CSS. This keeps the component API minimal and avoids a slot that would add DOM complexity for a purely visual concern.

---

## 3. Optional icons on items

Covers requirement(s): 5

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">
    <vaadin-icon icon="vaadin:home" slot="prefix"></vaadin-icon>
    Home
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/documents">
    <vaadin-icon icon="vaadin:folder" slot="prefix"></vaadin-icon>
    Documents
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Annual Report</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** A `prefix` slot on each item follows the established Vaadin convention from `side-nav-item`. Icons are opt-in per item — most breadcrumbs use text only, so no icon-related configuration is needed for the common case. The slot accepts any content, including `<vaadin-icon>` or custom SVGs.

---

## 4. Overflow and truncation

Covers requirement(s): 6, 7, 8

```html
<!-- Overflow is automatic based on available width. No configuration needed. -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/projects">Projects</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/projects/alpha">Alpha</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/projects/alpha/docs">Documents</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/projects/alpha/docs/reports">Reports</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/projects/alpha/docs/reports/q4">Q4</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/projects/alpha/docs/reports/q4/finance">Finance</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Q4 2025 Marketing Campaign Assets</vaadin-breadcrumb-item>
</vaadin-breadcrumb>

<!-- Progressive collapse as space decreases:
     1. Full:     Home > Projects > Alpha > Documents > Reports > Q4 > Finance > Q4 2025 Marketing Campaign Assets
     2. Collapse: Home > … > Alpha > Documents > Reports > Q4 > Finance > Q4 2025 Marketing Campaign Assets
     3. More:     Home > … > Reports > Q4 > Finance > Q4 2025 Marketing Campaign Assets
     4. More:     Home > … > Q4 2025 Marketing Campaign Assets
     5. Root too: … > Q4 2025 Marketing Campaign Assets
     6. Truncate: … > Q4 2025 Marketing Campa…
     The "…" opens a menu with the collapsed items. -->
```

**Why this shape:** Overflow is automatic — no property to enable it. Items collapse one at a time starting from the item closest to the root, preserving the root and the current page's nearest ancestors as long as possible. The rationale: the root and the immediate ancestors of the current page are the ones the user most likely wants to see or jump to. If all intermediate items are collapsed and space is still insufficient, the root collapses too. Only when the current page label alone cannot fit does it truncate with a text ellipsis. This progressive degradation requires zero developer configuration.

---

## 5. Navigation landmark label

Covers requirement(s): 9

```html
<!-- Default landmark label is "Breadcrumb" -->
<vaadin-breadcrumb>
  ...
</vaadin-breadcrumb>

<!-- Customise for localisation -->
<vaadin-breadcrumb label="Brödsmulor">
  ...
</vaadin-breadcrumb>
```

**Why this shape:** A `label` attribute on the container sets the accessible name for the `<nav>` landmark, following the same pattern used by `vaadin-side-nav` which exposes a `label` attribute for its navigation landmark. The default is "Breadcrumb" — a sensible English fallback that works out of the box.

