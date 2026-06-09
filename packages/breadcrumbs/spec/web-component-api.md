# Breadcrumbs Developer API

## 1. Displaying the ancestor trail as links

Covers requirement(s): 1, 2

```html
<vaadin-breadcrumbs>
  <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item path="/docs">Developer Guide</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item path="/docs/api">API Reference</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item path="/docs/api/auth">Authentication</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item>OAuth2</vaadin-breadcrumbs-item>
</vaadin-breadcrumbs>
```

**Why this shape:** Items with a `path` attribute render as links; the last item without `path` is the current page — visually distinct and not interactive. This follows the Side Nav convention (`path` attribute, child elements as items) and needs no extra boolean to mark the current item. The convention is simple: if it has a `path`, it's a link; if it doesn't, it's the current location.

---

## 2. Optionally omitting the current page

Covers requirement(s): 3

```html
<!-- Current page omitted — all items have a path -->
<vaadin-breadcrumbs>
  <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item path="/docs">Developer Guide</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item path="/docs/api">API Reference</vaadin-breadcrumbs-item>
</vaadin-breadcrumbs>
```

**Why this shape:** No extra API needed. When every item has a `path`, every item is a link and no current-page indicator appears. The application simply decides what to include in the trail.

---

## 3. Customizable separator

Covers requirement(s): 4, 5, 12

```html
<!-- Default: theme renders a chevron separator between items -->
<vaadin-breadcrumbs>
  <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item path="/products">Products</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item>Laptops</vaadin-breadcrumbs-item>
</vaadin-breadcrumbs>
```

```css
/* Override the separator icon via the CSS custom property */
vaadin-breadcrumbs {
  --vaadin-breadcrumbs-separator: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="4" x2="17" y2="20"/></svg>');
}
```

**Why this shape:** The separator is rendered as a `::after` pseudo-element on each item using `mask-image`, matching the pattern used across Vaadin components (select's toggle button, combo-box's dropdown arrow, clear buttons). The pseudo-element has `background: currentColor` shaped by `mask-image: var(--vaadin-breadcrumbs-separator)`. Applications override the separator by setting the CSS custom property on the item. The theme handles flipping the separator direction in RTL contexts. This keeps the HTML clean — separators are purely visual, styled through CSS, not DOM content.

---

## 4. Overflow collapse and expansion

Covers requirement(s): 6, 7

```html
<!-- Overflow is automatic — no developer action needed -->
<!-- The component progressively collapses items closest to the root first -->
<vaadin-breadcrumbs>
  <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item path="/docs">Documents</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item path="/docs/projects">Projects</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item path="/docs/projects/2026">2026</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item path="/docs/projects/2026/q1">Q1</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item path="/docs/projects/2026/q1/reports">Reports</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item>Summary</vaadin-breadcrumbs-item>
</vaadin-breadcrumbs>
```

```js
// The overflow button's accessible label is customizable via i18n
const breadcrumbs = document.querySelector('vaadin-breadcrumbs');
breadcrumbs.i18n = {
  moreItems: 'Show hidden items'
};
```

**Why this shape:** Overflow is an automatic responsive behavior — the component collapses items when they don't fit, starting from the item closest to the root. No developer configuration is needed for the collapse itself. The overflow indicator opens a menu showing the hidden items. The `i18n` pattern follows Menu Bar's convention for localizing internal button labels.

---

## 5. Icons alongside item text

Covers requirement(s): 8

```html
<vaadin-breadcrumbs>
  <vaadin-breadcrumbs-item path="/">
    <vaadin-icon icon="vaadin:home" slot="prefix"></vaadin-icon>
    Home
  </vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item path="/docs">
    <vaadin-icon icon="vaadin:folder" slot="prefix"></vaadin-icon>
    Documents
  </vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item>Report.pdf</vaadin-breadcrumbs-item>
</vaadin-breadcrumbs>
```

**Why this shape:** The `prefix` slot follows Side Nav's convention for placing icons before item text. Icons are optional — items without a prefix slot are plain text. This uses Vaadin's existing `<vaadin-icon>` component rather than introducing a new icon mechanism.

---

## 6. Dynamic trail updates

Covers requirement(s): 9

```js
const breadcrumbs = document.querySelector('vaadin-breadcrumbs');

// Replace the trail by mutating the light-DOM children directly
breadcrumbs.replaceChildren(
    Object.assign(document.createElement('vaadin-breadcrumbs-item'),
                  { textContent: 'Home', path: '/' }),
    Object.assign(document.createElement('vaadin-breadcrumbs-item'),
                  { textContent: 'Electronics', path: '/electronics' }),
    Object.assign(document.createElement('vaadin-breadcrumbs-item'),
                  { textContent: 'Laptops', path: '/electronics/laptops' }),
    Object.assign(document.createElement('vaadin-breadcrumbs-item'),
                  { textContent: 'Gaming' }));
```

**Why this shape:** The component reflects whatever `<vaadin-breadcrumbs-item>` children sit in its light DOM — applications drive dynamic updates with the standard DOM APIs (`appendChild`, `replaceChildren`, framework-level rendering, etc.). No parallel `items` data-array property is exposed: the declarative form already covers every dynamic case, and a second API would need its own parser, item-construction logic, and rules for how the two forms interact (see Discussion: "Why is there no programmatic `items` property?").

---

## 7. Navigation landmark

Covers requirement(s): 10

```html
<!-- The component renders a <nav> element automatically -->
<!-- The application provides an accessible label -->
<vaadin-breadcrumbs aria-label="Product navigation">
  <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item path="/products">Products</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item>Laptops</vaadin-breadcrumbs-item>
</vaadin-breadcrumbs>
```

**Why this shape:** The component renders as a `<nav>` landmark automatically. The application provides the `aria-label` when it wants to distinguish these breadcrumbs from other landmarks on the page — following the universal rule that accessible names are customizable. No component-specific API is needed beyond standard ARIA attributes.

---

## 8. Current page announced as current

Covers requirement(s): 11

```html
<!-- No developer action needed -->
<!-- The component automatically adds aria-current="page" to the last item
     when it has no path (i.e., it represents the current page) -->
<vaadin-breadcrumbs>
  <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item path="/docs">Docs</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item>OAuth2</vaadin-breadcrumbs-item>  <!-- aria-current="page" applied automatically -->
</vaadin-breadcrumbs>
```

**Why this shape:** The ARIA Authoring Practices Guide specifies `aria-current="page"` for the current breadcrumb item. Since the component already knows which item is current (the last item, if it has no `path`), it applies this automatically — no developer action required.

---

## 9. Disabling an item

```html
<vaadin-breadcrumbs>
  <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item path="/private" disabled>Restricted area</vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item>Settings</vaadin-breadcrumbs-item>
</vaadin-breadcrumbs>
```

```js
breadcrumbs.querySelector('vaadin-breadcrumbs-item[path="/private"]').disabled = true;
```

**Why this shape:** Some ancestors are present in the hierarchy but not navigable for the current user (no permission, intentionally non-routed, etc.). `disabled` makes the item visually dim, removes the link's `href`, sets `aria-disabled="true"` on the host, takes the inner link out of the tab cycle (`tabindex="-1"`), and suppresses programmatic `click()` — exactly the contract every other interactive Vaadin component exposes through `DisabledMixin`. Themes can target the state with `vaadin-breadcrumbs-item[disabled]`.

---

## 10. Styling keyboard focus

```css
vaadin-breadcrumbs-item[focus-ring]::part(link) {
  outline: 2px solid var(--brand-focus-color);
  outline-offset: 2px;
}
```

**Why this shape:** Item links carry `focused` while focus is inside them and `focus-ring` only when focus arrived via the keyboard (provided by `FocusMixin`). Themes style the keyboard-focus indicator against `[focus-ring]` rather than `:focus` so that mouse-driven focus does not paint an outline, matching the behavior of every other focusable Vaadin component.

---

## Discussion

**Q: Should the breadcrumb item's link destination attribute be named `href` or `path`?**

`path` — consistent with Vaadin Side Nav. Although `href` is the standard HTML attribute, `path` keeps Vaadin navigation components consistent.

**Q: How should the separator be customizable?**

CSS `mask-image` pattern — matching how the select toggle button, combo-box dropdown arrow, and clear buttons render their icons. The separator is a `::after` pseudo-element on each item with `background: currentColor` shaped by `mask-image`. Applications override via the `--vaadin-breadcrumbs-separator` CSS custom property on `vaadin-breadcrumbs`, which cascades to all items. No slot needed; separators are a theme/visual concern, not structural content.

**Q: Should breadcrumb items support a `suffix` slot?**

No. We considered it but decided not to add it before we have a real use case for it. The `prefix` slot covers the known use case (icons). A `suffix` slot can be added later if a concrete need arises.

**Q: Why does `<vaadin-breadcrumbs-item>` need an explicit `disabled` API?**

A non-navigable ancestor (no permission, intentional dead-end, removed page) still belongs in the trail for context, but should not invite a click. Reusing the library-wide `DisabledMixin` contract gives the item every behavior developers already expect of a disabled control — dropped `href` on the inner link, `aria-disabled="true"` on the host, `tabindex="-1"` on the inner link, suppressed programmatic `click()` — and gives themes a single attribute (`[disabled]`) to style against. Omitting `path` instead would render plain text but couldn't express "this *would* be a link, except it's currently turned off"; `disabled` does.

**Q: Why expose `focused` / `focus-ring` rather than letting themes use `:focus` directly?**

`:focus` lights up for both mouse and keyboard interaction; the resulting outline on a mouse click reads as a visual bug to most users. `FocusMixin` separates the two — `focused` is on whenever any descendant has focus (useful for container-level styling) and `focus-ring` is on only when focus arrived via keyboard — so theme authors can paint a clear keyboard-focus indicator without leaking it into mouse interactions. The pattern is consistent across the rest of the library, so authors writing themes for multiple Vaadin components only learn it once.

**Q: Where should the separator CSS custom property override be applied?**

On `vaadin-breadcrumbs` (the parent), not on individual items. The property cascades down to all items, keeping the override in one place.

**Q: Should the separator `mask-image` reference the SVG directly or via a CSS custom property?**

Via a CSS custom property (`--vaadin-breadcrumbs-separator`). The base styles set `mask-image: var(--vaadin-breadcrumbs-separator)` on the `::after` pseudo-element, and applications override the custom property to change the icon. This matches how other Vaadin components handle icon customization.

**Q: Why is there no programmatic `items` property?**

An earlier revision exposed a parallel `items` array on `<vaadin-breadcrumbs>` — `{ text, path }[]` mirroring the declarative form — on the assumption that "both should coexist". That assumption was reconsidered: across the Vaadin component set only `<vaadin-select>` exposes both, and only because of overlay-teleportation limits, not as a general rule. Unlike `<vaadin-menu-bar>` (where nested sub-menus make a declarative API impractical, see [#925](https://github.com/vaadin/web-components/issues/925)), the flat structure of Breadcrumbs expresses cleanly through `<vaadin-breadcrumbs-item>` light-DOM children — and standard DOM APIs (`appendChild`, `replaceChildren`, framework rendering) already cover every dynamic case. A parallel `items` array would need its own parser, item construction, and merge rules with the declarative form for no concrete benefit; adding it later if a real need emerges is strictly additive.
