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
<!-- Default: theme provides a chevron separator that flips in RTL -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Shoes</vaadin-breadcrumb-item>
</vaadin-breadcrumb>

<!-- Custom separator via slot on the container -->
<vaadin-breadcrumb>
  <span slot="separator">/</span>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Shoes</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** A `separator` slot on the container sets the separator for all items at once — the slotted content is used as a template and replicated between each pair of items. This avoids the redundancy of setting a separator on every item. The default separator is a directional chevron provided by the theme, which flips automatically in RTL. A slotted icon also flips via the universal RTL rule; a text separator like "/" does not flip, which is correct because it is non-directional. This matches the Shoelace breadcrumb pattern.

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
<!-- When space is limited, renders as:
     Home > … > Q4 2025 Marketing Campa…
     The "…" opens a menu with collapsed items. -->
```

**Why this shape:** Overflow is automatic — no property to enable it. When items don't fit, the component collapses middle items into an ellipsis button that opens a menu. The first item and the current page (last item) always remain visible. If space is still insufficient after collapsing all middle items, the current page label truncates with a text ellipsis. This progressive degradation requires zero developer configuration, following the principle of making common cases easy.

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

---

## 6. Intercepting item activation

Covers requirement(s): 10

```html
<vaadin-breadcrumb id="crumbs">
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/editor">Editor</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Unsaved Document</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

```js
document.querySelector('#crumbs').addEventListener('item-activate', (e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    showConfirmDialog().then((confirmed) => {
      if (confirmed) {
        window.location.href = e.detail.item.path;
      }
    });
  }
});
```

**Why this shape:** A cancellable `item-activate` event fires before navigation occurs. Calling `preventDefault()` suppresses the default link behaviour so the application can run custom logic (e.g., unsaved-changes confirmation). The event detail includes the activated item so the application can read its `path` and navigate programmatically after its check completes. This is a router-neutral pattern — it works with any SPA router or with no router at all.
