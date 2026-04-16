# Breadcrumb Developer API

<!--
Developer-facing API derived from requirements.md. Shows the most convenient, minimal HTML/JS API for each requirement.

Naming and shape conventions follow existing Vaadin components — primarily `<vaadin-side-nav>` (path attribute, current state, slot="prefix", location + onNavigate, label) and `<vaadin-menu-bar>` (items array, i18n object for internal labels).
-->

## 1. Declarative trail

Covers requirement(s): 1, 3, 4

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/electronics">Electronics</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/electronics/laptops">Laptops</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item current>ThinkPad X1 Carbon</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** A `<vaadin-breadcrumb>` with `<vaadin-breadcrumb-item>` children is the HTML-first baseline required by the Vaadin design guidelines. The item's `path` attribute turns it into a link — the same convention already used by `<vaadin-side-nav-item>`. The `current` attribute marks the last item as the user's current page and carries the same semantic role as `side-nav-item[current]`. The separator between items is rendered by the component itself, so the author writes the trail exactly as it reads.

---

## 2. Navigating to an ancestor

Covers requirement(s): 2

```html
<!-- No router present: plain <a href> click triggers a full page load -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/docs">Docs</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs/getting-started">Getting Started</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item current>Installation</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

```jsx
// SPA router: onNavigate hands off to the router, location keeps "current" in sync
<Breadcrumb
  location={useLocation()}
  onNavigate={({ path }) => path && navigate(path)}
>
  <BreadcrumbItem path="/docs">Docs</BreadcrumbItem>
  <BreadcrumbItem path="/docs/getting-started">Getting Started</BreadcrumbItem>
  <BreadcrumbItem path="/docs/getting-started/install">Installation</BreadcrumbItem>
</Breadcrumb>
```

**Why this shape:** The router-neutral rule in the design guidelines dictates that items render as real `<a href>` elements and navigation is handled by whatever SPA router (if any) is active. Exposing `location` as an opaque change-trigger and `onNavigate` as a callback mirrors `<vaadin-side-nav>` exactly, so developers who already wire side-nav into their router can wire breadcrumb the same way. The `current` attribute may be omitted entirely when `location` is supplied — the component matches the location against each item's `path` and marks the matching item as current.

---

## 3. Reflecting the application's navigation path

Covers requirement(s): 5

```html
<!-- User arrived via the deals path -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/deals/this-week">This Week's Deals</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item current>ThinkPad X1 Carbon</vaadin-breadcrumb-item>
</vaadin-breadcrumb>

<!-- Same product, arrived via the category tree -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/electronics">Electronics</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/electronics/laptops">Laptops</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item current>ThinkPad X1 Carbon</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** The component does not own a hierarchy model. The trail is whatever sequence of items the application supplies, so polyhierarchy is handled simply by supplying a different sequence — no additional API surface is needed. This matches the "list of steps" mental model of every other breadcrumb library (MUI, Ant Design, Carbon, Shoelace) and avoids inventing a parent-child graph that would only get in the way.

---

## 4. Programmatic items for dynamic trails

Covers requirement(s): 6

```js
const breadcrumb = document.querySelector('vaadin-breadcrumb');

breadcrumb.items = folders.map((folder, index) => ({
  text: folder.name,
  path: folder.path,
  current: index === folders.length - 1,
}));
```

**Why this shape:** The design guidelines require a programmatic counterpart when the trail is typically data-driven. An `items` array of plain objects mirrors `<vaadin-menu-bar>.items` and `<vaadin-grid>`'s data conventions — developers already know the shape. Each object field maps one-to-one onto the declarative attribute: `text` → item text content, `path` → `path` attribute, `current` → `current` attribute. Setting `items` replaces any declarative children; the two forms are not meant to be mixed on the same element.

---

## 5. Items with icons

Covers requirement(s): 7

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">
    <vaadin-icon icon="vaadin:home" slot="prefix"></vaadin-icon>
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/projects">
    <vaadin-icon icon="vaadin:folder" slot="prefix"></vaadin-icon>
    Projects
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/projects/2026">
    <vaadin-icon icon="vaadin:folder" slot="prefix"></vaadin-icon>
    2026
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item current>Kickoff notes</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** A `slot="prefix"` for an icon before the label is the exact pattern `<vaadin-side-nav-item>` already uses, so reuse is effectively free. Icon-only items (like the root home) work by simply omitting text content — nothing special is needed. Keeping the slot name the same across components means icons from the Vaadin icon set drop into any navigational item without per-component knowledge.

---

## 6. Non-clickable items

Covers requirement(s): 8

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Organization</vaadin-breadcrumb-item>
  <!-- No path: rendered as plain text, not a link -->
  <vaadin-breadcrumb-item>Billing</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item current>Invoice #4521</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

```js
breadcrumb.items = [
  { text: 'Organization', path: '/' },
  { text: 'Billing' },                     // no path → non-clickable
  { text: 'Invoice #4521', current: true },
];
```

**Why this shape:** Absence of `path` is already the signal for "not a link" in `<vaadin-side-nav-item>` — the same CSS selector `:not([path])` styles it. Reusing that convention means developers don't need to learn a second "disable this item" mechanism. A dedicated `disabled` attribute is not needed: an ancestor with no landing page is not disabled, it simply has nothing to point to.

---

## 7. Omitting the current page

Covers requirement(s): 9

```html
<!-- Current page included (default) -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/docs">Docs</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs/getting-started">Getting Started</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item current>Installation Guide</vaadin-breadcrumb-item>
</vaadin-breadcrumb>

<!-- Pure upward navigation: no trailing item at all -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/docs">Docs</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs/getting-started">Getting Started</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** The application already controls the sequence of items; omitting the last one is just "don't add it." No extra `includeCurrent` property or mode switch is required, and the rendering rule is trivial: the last item is drawn with `current` styling if (and only if) it carries the `current` attribute.

---

## 8. Customizing the separator

Covers requirement(s): 10

```html
<!-- Default: directional chevron rendered by the component -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item current>Shoes</vaadin-breadcrumb-item>
</vaadin-breadcrumb>

<!-- Custom separator: supplied via a dedicated slot -->
<vaadin-breadcrumb>
  <span slot="separator">/</span>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item current>Shoes</vaadin-breadcrumb-item>
</vaadin-breadcrumb>

<!-- Custom separator as an icon -->
<vaadin-breadcrumb>
  <vaadin-icon slot="separator" icon="vaadin:arrow-right"></vaadin-icon>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** A single `slot="separator"` handles both characters and icons with one mechanism — simpler than a CSS custom property that only accepts a string plus a second mechanism for icons. The component clones the slotted content between each pair of items. Leaving the slot empty produces the default directional chevron, which also handles the RTL flip automatically (so applications that use the default do not have to think about mirroring).

---

## 9. Automatic width adaptation

Covers requirement(s): 11, 12, 13, 14

```html
<!-- Author writes the full trail; the component decides what to show -->
<vaadin-breadcrumb style="max-width: 300px">
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/region">Region</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/region/country">Country</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/region/country/state">State</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/region/country/state/city">City</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item current>Venue</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** Requirements 11–14 describe behaviors the component decides for itself (stay on one line, collapse intermediates, expose the hidden ancestors behind an overflow control, and — only as a last resort — truncate the current item's label). The developer writes the full trail once — no manual breakpoints, no per-item "can collapse" flags, no alternative mobile markup. This mirrors how `<vaadin-menu-bar>` handles overflow: the author supplies every item and the component picks what fits. Exposing these thresholds as API would force every application to tune them and would drift from the visual language of the theme.

---

## 10. Localizable labels

Covers requirement(s): 15

```js
breadcrumb.i18n = {
  navigationLabel: 'Breadcrumb',               // landmark label for assistive technology
  overflow: 'Show hidden ancestors',           // accessible name for the overflow control
};
```

```html
<!-- Sensible English defaults — no configuration needed for English apps -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item current>Profile</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** An `i18n` object with string slots matches `<vaadin-menu-bar>.i18n` (`moreOptions`), which is the established Vaadin pattern for locale-overridable internal labels. All strings are optional: sensible English defaults are provided so the component is usable without any configuration, and applications override only the strings they actually localize. The `navigationLabel` slot is the component-specific default called out by the design guidelines ("Breadcrumb" as the landmark's name). Because `aria-label` on the element is always available as an HTML-level override, there is no need for a second mechanism.

---

## 11. Automatic assistive-technology semantics

Covers requirement(s): 16, 17, 18

```html
<!-- No special API — the component exposes correct semantics internally -->
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/settings">Settings</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item current>Notifications</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

**Why this shape:** The "you are here" announcement (requirement 16), the separator suppression from the accessibility tree (requirement 17), and the RTL mirroring of the default directional separator (requirement 18) are all automatic — they are artifacts of how the component renders its internal DOM and therefore need no developer-facing API. Forcing applications to opt in to correct accessibility would defeat the purpose of shipping a component. The only knobs the application needs are the customizable strings shown in section 10.
