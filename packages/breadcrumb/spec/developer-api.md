# Breadcrumb Developer API

## 1. Basic trail with navigation

Covers requirement(s): 1, 2, 3

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/catalog">Catalog</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/catalog/electronics">Electronics</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/catalog/electronics/laptops">Laptops</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>ThinkPad X1 Carbon</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

Each `<vaadin-breadcrumb-item>` with a `path` renders as a standard `<a href>` link. The last item has no `path` and is automatically treated as the current page — rendered as non-interactive text with `aria-current="page"`. Browser features like middle-click, right-click context menu, and "open in new tab" work on ancestor links without any special handling.

**Why this shape:** Follows the `<vaadin-side-nav>` / `<vaadin-side-nav-item>` pattern — parent container with slotted child elements, `path` attribute for navigation targets. The `path` attribute (rather than `href`) is consistent with Side Nav and is router-neutral per the design guidelines. The last item is implicitly current by omitting `path`, requiring zero configuration for the most common pattern.

---

## 2. Programmatic items

Covers requirement(s): 1, 2, 3, 10

```js
const breadcrumb = document.querySelector('vaadin-breadcrumb');
breadcrumb.items = [
  { text: 'Catalog', path: '/catalog' },
  { text: 'Electronics', path: '/catalog/electronics' },
  { text: 'Laptops', path: '/catalog/electronics/laptops' },
  { text: 'ThinkPad X1 Carbon' }
];
```

The `items` property accepts an array of plain objects. Each object has `text` (the label) and an optional `path` (the navigation target). The last item without a `path` becomes the current page, identical to the declarative form.

Updating `items` re-renders the trail immediately:

```js
// User navigated to a category page — update the trail
breadcrumb.items = [
  { text: 'Catalog', path: '/catalog' },
  { text: 'Electronics' }
];
```

**Why this shape:** The design guidelines require both a declarative and a programmatic API when items are typically data-driven. Breadcrumb trails change with every navigation, making the `items` property the primary API in real applications. The object shape (`{ text, path }`) mirrors the attributes on `<vaadin-breadcrumb-item>`, keeping the two forms consistent.

---

## 3. Prefix content

Covers requirement(s): 5

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">
    <vaadin-icon icon="vaadin:home" slot="prefix"></vaadin-icon>
    Home
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/catalog">Catalog</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Electronics</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

Each item has an optional `prefix` slot for content displayed before the text label. The programmatic equivalent uses a `prefix` property with an icon name string:

```js
breadcrumb.items = [
  { text: 'Home', path: '/', prefix: 'vaadin:home' },
  { text: 'Catalog', path: '/catalog' },
  { text: 'Electronics' }
];
```

**Why this shape:** The `prefix` slot follows the `<vaadin-side-nav-item>` convention for prefix/suffix content. The programmatic `prefix` string covers the most common case (an icon on the root item) without requiring developers to construct DOM elements. Arbitrary slotted content is available via the declarative form for advanced cases.

---

## 4. Navigation interception

Covers requirement(s): 4

```js
const breadcrumb = document.querySelector('vaadin-breadcrumb');
breadcrumb.addEventListener('navigate', (event) => {
  // event.detail.item — the activated breadcrumb item element or item object
  // event.detail.path — the target path
  if (hasUnsavedChanges()) {
    event.preventDefault(); // suppress navigation
    showConfirmDialog();
  }
});
```

The `navigate` event fires on the `<vaadin-breadcrumb>` container when the user activates any ancestor item — whether it is a visible link or an item in the overflow dropdown. The event is cancellable: calling `preventDefault()` prevents the browser from following the link. If the event is not prevented, the link navigates normally.

**Why this shape:** A cancellable custom event on the container is more ergonomic than listening for `click` on individual `<a>` elements spread across the trail and the overflow dropdown. The event name `navigate` describes the user's intent. The `detail` includes `path` so the handler doesn't need to query the DOM. This aligns with the design guidelines' recommendation to "fire a cancellable event" for navigation interception.

---

## 5. Automatic overflow and collapse

Covers requirement(s): 6, 7, 8

```html
<!-- No special configuration needed — overflow is automatic -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/catalog">Catalog</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/catalog/electronics">Electronics</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/catalog/electronics/computers">Computers</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/catalog/electronics/computers/laptops">Laptops</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>ThinkPad X1 Carbon</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

The breadcrumb always renders on a single line. When items don't fit, intermediate items collapse behind an ellipsis button, starting from the item closest to the root. The root and current page remain visible as long as possible; if space is still insufficient, the root collapses too. The current page never collapses.

Clicking the ellipsis opens a dropdown listing the collapsed items in hierarchy order. The user can click any item in the dropdown to navigate.

No developer configuration is needed. The component measures available space and collapses automatically.

**Why this shape:** Overflow is a layout concern, not a developer decision. The component handles it automatically so the developer doesn't need to set a `maxItems` count or guess how many items fit. This is simpler than MUI's `maxItems` / `itemsBeforeCollapse` / `itemsAfterCollapse` approach and works correctly at any container width.

---

## 6. Current page label truncation

Covers requirement(s): 9

No developer configuration. When all other items have been collapsed and the current page label still exceeds available space, the label is truncated with a CSS text ellipsis. A tooltip shows the full text on hover.

**Why this shape:** Truncation is a last-resort behavior that the component applies automatically after all items have been collapsed. There is nothing for the developer to configure — the component manages the cascade from collapsing items to truncating the final label.

---

## 7. Landmark label

Covers requirement(s): 11

```html
<!-- Default label is "Breadcrumb" — no configuration needed -->
<vaadin-breadcrumb></vaadin-breadcrumb>

<!-- Custom label for localization or disambiguation -->
<vaadin-breadcrumb label="Product navigation">
  <vaadin-breadcrumb-item path="/catalog">Catalog</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Electronics</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

The `label` property sets the accessible label for the navigation landmark. The default is `"Breadcrumb"`.

**Why this shape:** Follows the `<vaadin-side-nav>` convention where `label` sets the accessible name of the `<nav>` landmark. The default `"Breadcrumb"` makes the component accessible out of the box; developers override it only for localization or when multiple breadcrumbs appear on the same page.

---

## 8. Separator direction in RTL

Covers requirement(s): 12

```html
<!-- No developer configuration — separators flip automatically in RTL -->
<div dir="rtl">
  <vaadin-breadcrumb>
    <vaadin-breadcrumb-item path="/catalog">كتالوج</vaadin-breadcrumb-item>
    <vaadin-breadcrumb-item path="/catalog/electronics">إلكترونيات</vaadin-breadcrumb-item>
    <vaadin-breadcrumb-item>أجهزة كمبيوتر محمولة</vaadin-breadcrumb-item>
  </vaadin-breadcrumb>
</div>
```

The visual separator between items reverses direction automatically in RTL contexts. In LTR it points right; in RTL it points left. The separator is a CSS concern — there is no slot or property to configure it.

**Why this shape:** Making the separator purely CSS-driven means there is no API surface for it. The component owns the separator rendering and handles directional flipping internally. This avoids the complexity of Shoelace's separator slot and keeps the API surface minimal.
