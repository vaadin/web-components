# Breadcrumb Developer API

## 1. Displaying the ancestor trail as links

Covers requirement(s): 1, 2

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs">Developer Guide</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs/api">API Reference</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs/api/auth">Authentication</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>OAuth2</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** Items with a `path` attribute render as links; the last item without `path` is the current page — visually distinct and not interactive. This follows the Side Nav convention (`path` attribute, child elements as items) and needs no extra boolean to mark the current item. The convention is simple: if it has a `path`, it's a link; if it doesn't, it's the current location.

---

## 2. Optionally omitting the current page

Covers requirement(s): 3

```html
<!-- Current page omitted — all items have a path -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs">Developer Guide</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs/api">API Reference</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** No extra API needed. When every item has a `path`, every item is a link and no current-page indicator appears. The application simply decides what to include in the trail.

---

## 3. Customizable separator

Covers requirement(s): 4, 5, 12

```html
<!-- Default: theme renders a chevron separator between items -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Laptops</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

```css
/* Override the separator icon via the CSS custom property */
vaadin-breadcrumb {
  --vaadin-breadcrumb-separator: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="4" x2="17" y2="20"/></svg>');
}
```

**Why this shape:** The separator is rendered as a `::after` pseudo-element on each item using `mask-image`, matching the pattern used across Vaadin components (select's toggle button, combo-box's dropdown arrow, clear buttons). The pseudo-element has `background: currentColor` shaped by `mask-image: var(--vaadin-breadcrumb-separator)`. Applications override the separator by setting the CSS custom property on the item. The theme handles flipping the separator direction in RTL contexts. This keeps the HTML clean — separators are purely visual, styled through CSS, not DOM content.

---

## 4. Overflow collapse and expansion

Covers requirement(s): 6, 7

```html
<!-- Overflow is automatic — no developer action needed -->
<!-- The component progressively collapses items closest to the root first -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs">Documents</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs/projects">Projects</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs/projects/2026">2026</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs/projects/2026/q1">Q1</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs/projects/2026/q1/reports">Reports</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Summary</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

```js
// The overflow button's accessible label is customizable via i18n
const breadcrumb = document.querySelector('vaadin-breadcrumb');
breadcrumb.i18n = {
  moreItems: 'Show hidden items'
};
```

**Why this shape:** Overflow is an automatic responsive behavior — the component collapses items when they don't fit, starting from the item closest to the root. No developer configuration is needed for the collapse itself. The overflow indicator opens a menu showing the hidden items. The `i18n` pattern follows Menu Bar's convention for localizing internal button labels.

---

## 5. Icons alongside item text

Covers requirement(s): 8

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">
    <vaadin-icon icon="vaadin:home" slot="prefix"></vaadin-icon>
    Home
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs">
    <vaadin-icon icon="vaadin:folder" slot="prefix"></vaadin-icon>
    Documents
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Report.pdf</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** The `prefix` slot follows Side Nav's convention for placing icons before item text. Icons are optional — items without a prefix slot are plain text. This uses Vaadin's existing `<vaadin-icon>` component rather than introducing a new icon mechanism.

---

## 6. Dynamic trail updates via items property

Covers requirement(s): 9

```js
const breadcrumb = document.querySelector('vaadin-breadcrumb');

// Programmatic API — equivalent to the declarative form
breadcrumb.items = [
  { text: 'Home', path: '/' },
  { text: 'Electronics', path: '/electronics' },
  { text: 'Laptops', path: '/electronics/laptops' },
  { text: 'Gaming' }
];

// Update the trail when navigation changes
function onCategoryChange(category) {
  breadcrumb.items = [
    { text: 'Home', path: '/' },
    { text: category.name, path: category.path },
    { text: category.child.name }
  ];
}
```

**Why this shape:** Breadcrumb trails are almost always data-driven (built from the current route or navigation state), so a programmatic `items` property is essential. The shape mirrors the declarative API: `text` for the label, `path` for the link destination (omit for the current page). Icons are only supported via the declarative API (`slot="prefix"`), not via the `items` property. This follows the DESIGN_GUIDELINES requirement that both declarative and programmatic APIs coexist and produce the same rendering.

---

## 7. Navigation landmark

Covers requirement(s): 10

```html
<!-- The component renders a <nav> element automatically -->
<!-- The application provides an accessible label -->
<vaadin-breadcrumb aria-label="Product navigation">
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Laptops</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** The component renders as a `<nav>` landmark automatically. The application provides the `aria-label` when it wants to distinguish this breadcrumb from other landmarks on the page — following the universal rule that accessible names are customizable. No component-specific API is needed beyond standard ARIA attributes.

---

## 8. Current page announced as current

Covers requirement(s): 11

```html
<!-- No developer action needed -->
<!-- The component automatically adds aria-current="page" to the last item
     when it has no path (i.e., it represents the current page) -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs">Docs</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>OAuth2</vaadin-breadcrumb-item>  <!-- aria-current="page" applied automatically -->
</vaadin-breadcrumb>
```

**Why this shape:** The ARIA Authoring Practices Guide specifies `aria-current="page"` for the current breadcrumb item. Since the component already knows which item is current (the last item, if it has no `path`), it applies this automatically — no developer action required.

---

## Discussion

**Q: Should the breadcrumb item's link destination attribute be named `href` or `path`?**

`path` — consistent with Vaadin Side Nav and the DESIGN_GUIDELINES breadcrumb example. Although `href` is the standard HTML attribute, `path` keeps Vaadin navigation components consistent.

**Q: How should the separator be customizable?**

CSS `mask-image` pattern — matching how the select toggle button, combo-box dropdown arrow, and clear buttons render their icons. The separator is a `::after` pseudo-element on each item with `background: currentColor` shaped by `mask-image`. Applications override via the `--vaadin-breadcrumb-separator` CSS custom property on `vaadin-breadcrumb`, which cascades to all items. No slot needed; separators are a theme/visual concern, not structural content.

**Q: Should breadcrumb items support a `suffix` slot?**

No. We considered it but decided not to add it before we have a real use case for it. The `prefix` slot covers the known use case (icons). A `suffix` slot can be added later if a concrete need arises.

**Q: Where should the separator CSS custom property override be applied?**

On `vaadin-breadcrumb` (the parent), not on individual items. The property cascades down to all items, keeping the override in one place.

**Q: Should the separator `mask-image` reference the SVG directly or via a CSS custom property?**

Via a CSS custom property (`--vaadin-breadcrumb-separator`). The base styles set `mask-image: var(--vaadin-breadcrumb-separator)` on the `::after` pseudo-element, and applications override the custom property to change the icon. This matches how other Vaadin components handle icon customization.

**Q: Should the programmatic `items` API support icons (e.g., a `prefix` string property)?**

No. No existing Vaadin component uses a simple icon string in its `items` array — Menu Bar uses a `component` property (a DOM element), and Side Nav has no programmatic items API at all. Rather than inventing a new pattern, icons are supported only via the declarative API (`slot="prefix"`). A programmatic icon property can be added later if a real need and a consistent cross-component pattern emerge.
