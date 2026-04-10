# Vaadin Breadcrumb Web Component

> ⚠️ This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.breadcrumbComponent = true`

## Overview

`<vaadin-breadcrumb>` renders a single-line trail of links that shows the
user where they are in an application and lets them jump back to any
ancestor location with one click. The trail content is supplied by the
application as an `items` array: the component is a pure renderer and
does not compute the trail from the URL or from a declared hierarchy.
All the hierarchy, canonical-path, omission, and history logic
described in `use-cases.md` is therefore expected to live in the
application (typically in its router integration) and the component
only has to render whatever list of items it is given.

This deliberately small API is what makes the use cases work:

- UC1 "Strict hierarchy" — app maps the route to a static items array.
- UC2 "Canonical path always shown" — app always emits the canonical
  trail, no matter which URL was entered.
- UC3 "No canonical, only current on direct entry" — app uses its
  session history to decide the parents; if there is no history, it
  emits only the current item.
- UC4 "Deep navigation with static prefix" — app concatenates a fixed
  prefix with the dynamically built chain; when opened directly it
  emits only the prefix + current.
- UC5/6/7 "Omit start / end / intermediate views" — app simply does
  not include those entries in the array it passes in.
- UC8 "Programmatic customization per route" — same API, no magic.

The component covers: rendering, separators, the current-page marker,
keyboard/focus, the navigation landmark and labels, and a
router-integration hook so that clicks do not cause a full page reload.

---

## Usage Examples

### 1. Basic usage — simple hierarchy (UC1)

```html
<vaadin-breadcrumb></vaadin-breadcrumb>
<script>
  document.querySelector('vaadin-breadcrumb').items = [
    { text: 'Home', path: '/' },
    { text: 'Electronics', path: '/electronics' },
    { text: 'Laptops', path: '/electronics/laptops' },
    { text: 'ThinkPad X1 Carbon' }, // no path = current page
  ];
</script>
```

The last item in the array is the current page. It is rendered as
non-interactive, carries `aria-current="page"`, and is skipped by the
tab order.

### 2. Canonical path regardless of entry (UC2)

The app computes the canonical trail from its route table and assigns
it to `items`. Whether the user arrived at
`/electronics/laptops/thinkpad-x1` or the promotional
`/deals/black-friday/thinkpad-x1`, the app emits the same trail:

```js
breadcrumb.items = [
  { text: 'Home', path: '/' },
  { text: 'Electronics', path: '/electronics' },
  { text: 'Laptops', path: '/electronics/laptops' },
  { text: 'ThinkPad X1 Carbon' },
];
```

### 3. No canonical path — direct entry collapses to current only (UC3)

```js
function onRouteChanged(route, { navigatedFrom }) {
  if (navigatedFrom?.startsWith('/departments/')) {
    breadcrumb.items = [
      { text: 'Engineering', path: '/departments/engineering' },
      { text: 'Jane Doe' },
    ];
  } else if (navigatedFrom?.startsWith('/projects/')) {
    breadcrumb.items = [
      { text: 'Project Alpha', path: '/projects/alpha' },
      { text: 'Jane Doe' },
    ];
  } else {
    breadcrumb.items = [{ text: 'Jane Doe' }];
  }
}
```

A single-item trail is a valid state and must render correctly: one
non-interactive current entry, no separators.

### 4. Static prefix + dynamic suffix (UC4)

```js
// Navigating through the chain
breadcrumb.items = [
  { text: 'Engineering', path: '/departments/engineering' },
  { text: 'Alice', path: '/departments/engineering/people/alice' },
  { text: 'Bob', path: '/departments/engineering/people/alice/bob' },
  { text: 'Carol' },
];

// Opened directly by URL
breadcrumb.items = [
  { text: 'Engineering', path: '/departments/engineering' },
  { text: 'Carol' },
];
```

### 5. Router integration

Applications using a client-side router supply an `onNavigate` callback
so clicks on breadcrumb links do not trigger a full page reload. This
matches the shape already used by `<vaadin-side-nav>` so applications
can share one handler.

```js
breadcrumb.onNavigate = ({ path, originalEvent }) => {
  router.navigate(path);
  // return nothing / undefined to let the component call preventDefault()
};
```

Clicks are not intercepted if:

- the click has a modifier key (`metaKey`, `ctrlKey`, `shiftKey`,
  `altKey`)
- there is no `onNavigate` handler at all
- the handler explicitly returns `false`

In all those cases the anchor's default navigation happens — which
gives "open in new tab" and similar browser affordances for free.

### 6. Localizing the landmark label

```js
breadcrumb.i18n = { label: 'Brotkrümelnavigation' };
```

---

### Key design decisions

1. **`items` array is the single source of truth.** Every use case in
   `use-cases.md` reduces to "the app knows what the trail should be
   and hands it over". Supporting both a declarative nested-tree API
   (like `<vaadin-side-nav>`) and an imperative array API would
   double the surface without unlocking any use case, so only the
   array form is provided.

2. **No declared hierarchy and no built-in URL matching.** Use case 3
   (no canonical path) depends on *navigation history*, not on the
   URL. Use case 4 mixes a static part with a dynamically grown part.
   Use case 8 is explicitly programmatic. None of these can be solved
   by URL→tree matching alone, so the component does not attempt it.
   Apps that want URL-driven trails build them in their router and
   assign the result to `items`.

3. **Last item is always the current page.** A simple positional rule
   instead of a per-item `current` flag: the array ends at "where you
   are". The renderer makes the last item non-interactive, marks it
   `aria-current="page"`, and skips it in the tab order. All use
   cases end on the current page, so this is sufficient.

4. **Real anchors + `onNavigate` callback.** Copied verbatim from
   `<vaadin-side-nav>` so that both components share a router hook
   and so browser affordances (ctrl/cmd-click, right-click "open in
   new tab", keyboard activation) work for free. Consistency with
   `side-nav` is the primary driver here.

5. **Separators rendered in shadow DOM, not between items in light
   DOM.** Allows the component to guarantee `aria-hidden="true"` on
   separators, to keep the semantic list clean (`<ol><li>…</li></ol>`),
   and to let CSS control the separator character via a custom
   property.

6. **No item-level features beyond `text` and `path`.** The use cases
   do not call for icons, disabled entries, dropdown menus attached
   to an item, overflow collapsing, or per-item truncation, so none
   of those are in this spec. If a later set of use cases requires
   them they can be added without breaking the existing API.

---

## Implementation

### Package

- Package name: `@vaadin/breadcrumb`
- Element: `<vaadin-breadcrumb>`
- Feature flag: `window.Vaadin.featureFlags.breadcrumbComponent`

### Mixins

```
PolylitMixin(LumoInjectionMixin(ThemableMixin(ElementMixin(
  I18nMixin(DEFAULT_I18N, FocusMixin(LitElement))))))
```

| Mixin | Why |
|---|---|
| `PolylitMixin` | Required by the Vaadin mixin stack |
| `LumoInjectionMixin` | Required for Lumo auto-injection |
| `ThemableMixin` | Theme attribute / style injection |
| `ElementMixin` | Standard Vaadin base |
| `I18nMixin` | The nav landmark label is localizable |
| `FocusMixin` | Focus-ring state on the focused link |

### Elements

**`<vaadin-breadcrumb>`** — the only public element.

Shadow DOM:

```html
<nav part="navigation" aria-label="${effectiveI18n.label}">
  <ol part="list" role="list">
    <!-- for each non-current item -->
    <li part="item">
      <a part="link" href="${item.path}">${item.text}</a>
      <span part="separator" aria-hidden="true"></span>
    </li>
    <!-- last item: current page -->
    <li part="item" current>
      <span part="link" aria-current="page">${item.text}</span>
    </li>
  </ol>
</nav>
```

If the current item has a `path`, the path is ignored for rendering —
the current page is never a link. A single-item `items` array renders
a single `<li>` with no separator.

An empty `items` array renders an empty `<nav>…<ol></ol></nav>` — no
error, nothing visible. This state exists briefly while a route is
loading.

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `items` | `BreadcrumbItem[]` | `[]` | No | The trail to render. The last entry is treated as the current page. |
| `onNavigate` | `(details) => boolean \| void` | `undefined` | No | Router-integration hook. Called when a non-current link is clicked. Receives `{ path, originalEvent }`. If the handler returns anything other than `false`, the component calls `preventDefault()` on the click. |
| `i18n` | `BreadcrumbI18n` | `{ label: 'Breadcrumb' }` | No | Localization object (via `I18nMixin`). |

`BreadcrumbItem` (TypeScript shape):

```ts
type BreadcrumbItem = {
  /** Visible label. Required. */
  text: string;
  /** Navigation target. Omitted/empty for the current page. */
  path?: string;
};
```

`BreadcrumbI18n`:

```ts
type BreadcrumbI18n = {
  /** aria-label for the <nav> landmark. */
  label: string;
};
```

| Slot | Description |
|---|---|
| (none) | The component has no public slots; content is data-driven via `items`. |

Parts:

| Part | Description |
|---|---|
| `navigation` | The outer `<nav>` landmark. |
| `list` | The `<ol>` list of entries. |
| `item` | Each `<li>`. Carries the `current` state attribute on the last item. |
| `link` | The clickable `<a>` (non-current items) or the non-interactive `<span>` (current item). |
| `separator` | The separator element between two non-current entries. `aria-hidden="true"`. |

State attributes (on item parts):

| Attribute | Description |
|---|---|
| `current` | Set on the last `<li>` (the current page). |
| `focus-ring` | Set on the host when a link is focused via keyboard. |

| Event | Description |
|---|---|
| (none) | No custom events. Consumers integrate via the `onNavigate` callback and the standard anchor `click` event. |

CSS custom properties:

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-separator-symbol` | `'\\203A'` (`›`) | The character (or string) shown in the `separator` part via CSS `content`. Applications can override to `'/'`, `'>'`, etc., or set to `none` to hide. |

### Accessibility

- Rendered as `<nav aria-label="${i18n.label}">` so screen readers list
  the trail as a navigation landmark. The default label is
  `"Breadcrumb"` (localizable via `i18n.label`).
- The list of entries is a semantic `<ol>` so assistive tech announces
  position ("1 of 4"). Separators are inside the `<li>` but carry
  `aria-hidden="true"` so they are not read.
- The current page:
  - is rendered as a non-interactive element, not an `<a>`;
  - carries `aria-current="page"`;
  - is not reachable via keyboard tab order.
- Non-current links are reachable in source order via normal `Tab`
  traversal. There is no arrow-key navigation (matches Carbon,
  Spectrum, Material, and React Aria).
- Focus ring is visible on the focused link (standard Vaadin
  `focus-ring` state attribute handling via `FocusMixin`).

### Click and router integration

Click handling lives on the host (one delegated listener) and mirrors
`<vaadin-side-nav>`'s `__onClick`:

1. If the click has a modifier (`metaKey`, `ctrlKey`, `shiftKey`,
   `altKey`), do nothing — let the browser handle it.
2. If the composed path does not contain an anchor inside a
   breadcrumb item, do nothing.
3. If `onNavigate` is not set, do nothing — the anchor navigates
   normally.
4. Otherwise, call `onNavigate({ path, originalEvent })`. If it
   returns anything other than `false`, call `preventDefault()` on the
   event.

This is the same contract already used by `side-nav`, so apps with
both components can reuse a single handler.

### Use-case traceability

| # | Use case | Covered by |
|---|---|---|
| 1 | Strict hierarchy | `items` array — app builds from its route table. |
| 2 | Canonical path always shown | `items` array — app emits canonical trail. |
| 3 | No canonical, only current on direct entry | `items` array — app emits single-item trail. Single-item rendering is explicitly supported. |
| 4 | Deep navigation with static prefix | `items` array — app concatenates prefix + dynamic part. |
| 5 | Omit views from trail start | `items` array — app omits the entries. |
| 6 | Omit views from trail end | `items` array — app omits the entries; last item is always treated as current. |
| 7 | Omit intermediate views | `items` array — app omits the entries. |
| 8 | Programmatic customization | `items` array is the primary API; no hidden magic. |

Cross-check: every property, part, event, and CSS custom property in
the spec is traceable to at least one use case.

- `items` → UC1–UC8 (all)
- `onNavigate` → UC1–UC8 (all; SPA apps without router integration
  would full-reload on every trail click)
- `i18n.label` → accessibility requirement implicit in UC1 (and
  standard in every referenced library)
- parts `navigation`/`list`/`item`/`link`/`separator` → needed to
  render and style a trail (UC1)
- `current` state attribute → distinguish current page, needed by
  every use case
- `--vaadin-breadcrumb-separator-symbol` → visual separator between
  entries, needed by every multi-item use case

### Open questions / notes

- **Long labels / overflow.** Not in the current use cases, so not
  specified. The current shadow DOM keeps the trail on a single line;
  if a future use case requires explicit truncation or collapsing,
  parts and custom properties can be added without breaking the
  existing API.
- **External links / `target="_blank"`.** Not in the current use
  cases. If needed later, add an optional `target` field on
  `BreadcrumbItem` (mirroring `side-nav-item`'s `target`).
- **Router-ignore per item.** Not in the current use cases. If needed,
  add `routerIgnore` on `BreadcrumbItem` mirroring `side-nav-item`.
