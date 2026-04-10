# Vaadin Breadcrumb Web Component

> ⚠️ This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.breadcrumbComponent = true`

## Overview

`<vaadin-breadcrumb>` renders a single-line trail of links that shows
the user where they are in an application and lets them jump back to
any ancestor location with one click. The trail is supplied by the
application — the component is a pure renderer and does not compute
the trail from the URL or from a declared hierarchy.

The component offers both a **declarative API** (child
`<vaadin-breadcrumb-item>` elements written directly in HTML) and an
equivalent **programmatic API** (an `items` array of plain objects).
Both forms produce the same rendering and the same behavior, and the
two are interchangeable: setting `items` rebuilds the light-DOM
children, and any `<vaadin-breadcrumb-item>` children present in the
markup are rendered the same way.

All the hierarchy, canonical-path, omission, and history logic
described in `use-cases.md` lives in the application (typically in its
router integration). The component only has to render whatever trail
it is given. This deliberately small surface is what makes the use
cases work:

- UC1 "Strict hierarchy" — app maps the route to a static trail.
- UC2 "Canonical path always shown" — app always emits the canonical
  trail, no matter which URL was entered.
- UC3 "No canonical, only current on direct entry" — app uses its
  session history to decide the parents; if there is no history, it
  emits only the current item.
- UC4 "Deep navigation with static prefix" — app concatenates a fixed
  prefix with the dynamically built chain; when opened directly it
  emits only the prefix + current.
- UC5/6/7 "Omit start / end / intermediate views" — app simply does
  not include those entries in the trail.
- UC8 "Programmatic customization per route" — same API, no magic.

The component covers: rendering, separators, the current-page marker,
keyboard/focus, the navigation landmark and labels, and a
router-integration hook so that clicks do not cause a full page
reload.

---

## Usage Examples

### 1. Declarative — simple hierarchy (UC1)

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/electronics">Electronics</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/electronics/laptops">Laptops</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>ThinkPad X1 Carbon</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

This is the canonical form. It renders correctly with no JavaScript
beyond the component import. The last child is the current page: it
is rendered non-interactive, carries `aria-current="page"`, and is
skipped by the tab order. The positional rule (last = current) means
the current item simply has no `path` attribute set.

### 2. Programmatic — equivalent of example 1

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

Setting `items` clears any existing `<vaadin-breadcrumb-item>`
children and replaces them with elements built from the array.
Reading `items` back returns an array reflecting the current
children. The two APIs are fully interchangeable.

### 3. Canonical path regardless of entry (UC2)

The app computes the canonical trail from its route table and assigns
it to `items` (or rebuilds the children). Whether the user arrived at
`/electronics/laptops/thinkpad-x1` or the promotional
`/deals/black-friday/thinkpad-x1`, the same trail is emitted:

```js
breadcrumb.items = [
  { text: 'Home', path: '/' },
  { text: 'Electronics', path: '/electronics' },
  { text: 'Laptops', path: '/electronics/laptops' },
  { text: 'ThinkPad X1 Carbon' },
];
```

### 4. No canonical path — direct entry collapses to current only (UC3)

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

A single-item trail is a valid state and renders correctly: one
non-interactive current entry, no separators.

### 5. Static prefix + dynamic suffix (UC4)

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

### 6. Mixed declarative + slotted content

Because `<vaadin-breadcrumb-item>` is a real element with a slotted
label, the label can be richer than plain text — for example with a
nested icon — without needing extra API:

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">
    <vaadin-icon icon="vaadin:home"></vaadin-icon>
    Home
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/electronics">Electronics</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>ThinkPad X1 Carbon</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

This is supported because nothing in the design assumes the label is
text-only — but `text` in the `items` array remains the only
programmatic-side field, so applications that need rich labels use
the declarative form for those entries.

### 7. Router integration

Applications using a client-side router supply an `onNavigate`
callback so clicks on breadcrumb links do not trigger a full page
reload. This matches the shape already used by `<vaadin-side-nav>` so
applications can share one handler.

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

### 8. Localizing the landmark label

```js
breadcrumb.i18n = { label: 'Brotkrümelnavigation' };
```

---

### Key design decisions

1. **Both a declarative and a programmatic API.** The declarative
   form (`<vaadin-breadcrumb-item>` children) is the canonical shape:
   it works with no JavaScript, is what appears in docs and tests by
   default, and matches the "HTML first" rule for Vaadin web
   components. The programmatic `items` array exists because
   real-world breadcrumb trails are almost always computed at
   runtime from the router state, and forcing every application to
   create and append child elements imperatively would be painful.
   Both forms produce the same DOM and the same behavior; setting
   `items` simply rewrites the light-DOM children to match.

2. **No declared hierarchy and no built-in URL matching.** Use case 3
   (no canonical path) depends on *navigation history*, not on the
   URL. Use case 4 mixes a static part with a dynamically grown part.
   Use case 8 is explicitly programmatic. None of these can be solved
   by URL→tree matching alone, so the component does not attempt it.
   Apps that want URL-driven trails build them in their router and
   feed the result to the component.

3. **Last item is always the current page (positional rule).** A
   simple positional rule instead of a per-item `current` flag: the
   trail ends at "where you are". The renderer marks the last item
   with the `current` state attribute, makes it non-interactive,
   tags it `aria-current="page"`, and skips it in the tab order. All
   eight use cases end on the current page, so this is sufficient
   and removes a footgun (two items both flagged "current"). In the
   declarative form, the current item is just the last child; in the
   programmatic form, it is the last entry of the array. Convention:
   the current item has no `path`.

4. **Real anchors + `onNavigate` callback.** Copied verbatim from
   `<vaadin-side-nav>` so that both components share a router hook
   and so browser affordances (ctrl/cmd-click, right-click "open in
   new tab", keyboard activation) work for free. Consistency with
   `side-nav` is the primary driver here.

5. **Separators rendered by the item, not as light-DOM siblings.**
   Each `<vaadin-breadcrumb-item>` carries its own separator inside
   its shadow DOM, marked `aria-hidden="true"`. The current item
   hides its separator. This keeps the parent's `<ol>` semantically
   clean (one `<li>`-equivalent per entry, no separator nodes
   confusing screen readers), allows CSS to control the separator
   character via a custom property, and avoids requiring the app to
   write separator markup in the declarative form.

6. **`<vaadin-breadcrumb-item>` is intentionally minimal.** It has
   only `path` (and is the same element class regardless of whether
   it represents a link or the current page). The current state is
   set by the parent based on position, not by the user. The use
   cases do not call for icons-as-API, disabled entries, dropdown
   menus attached to an item, overflow collapsing, or per-item
   truncation, so none of those are in this spec. If a later set of
   use cases requires them they can be added without breaking the
   existing API. Rich content (e.g. an icon next to the label) is
   supported via the default slot of `<vaadin-breadcrumb-item>`.

7. **No tree-style nested children.** Unlike `<vaadin-side-nav>`, a
   breadcrumb is always a flat list (a path, not a tree).
   `<vaadin-breadcrumb-item>` therefore does not accept child items.

---

## Implementation

### Package

- Package name: `@vaadin/breadcrumb`
- Elements: `<vaadin-breadcrumb>`, `<vaadin-breadcrumb-item>`
- Feature flag: `window.Vaadin.featureFlags.breadcrumbComponent`

### Mixins

**`<vaadin-breadcrumb>`:**

```
BreadcrumbMixin(
  I18nMixin(DEFAULT_I18N,
    FocusMixin(
      ElementMixin(
        ThemableMixin(
          PolylitMixin(
            LumoInjectionMixin(LitElement)))))))
```

| Mixin | Why |
|---|---|
| `BreadcrumbMixin` | Component-specific logic: items↔children sync, current-flag positioning, click delegation. |
| `I18nMixin` | The nav landmark label is localizable. |
| `FocusMixin` | `focus-ring` state on the focused link. |
| `ElementMixin` | Standard Vaadin base. |
| `ThemableMixin` | Theme attribute / style injection. |
| `PolylitMixin` | Required by the Vaadin mixin stack. |
| `LumoInjectionMixin` | Required for Lumo auto-injection. |

**`<vaadin-breadcrumb-item>`:**

```
ElementMixin(
  ThemableMixin(
    PolylitMixin(
      LumoInjectionMixin(LitElement))))
```

The item does not need `FocusMixin` itself — the focusable element is
the inner `<a>`, and the parent's `FocusMixin` handles `focus-ring`
state on the host. It does not need `DisabledMixin` — the use cases
have no concept of disabled entries.

### Elements

**`<vaadin-breadcrumb>`** — the container element.

Shadow DOM:

```html
<nav part="navigation" aria-label="${effectiveI18n.label}">
  <ol part="list" role="list">
    <slot></slot>
  </ol>
</nav>
```

The default slot accepts `<vaadin-breadcrumb-item>` children.
Children that are not `<vaadin-breadcrumb-item>` are ignored
visually (they remain in the light DOM but are not styled as part
of the trail).

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `items` | `BreadcrumbItem[]` | `[]` | No | The trail to render, as a programmatic equivalent of the slotted children. Setting this property removes any existing `<vaadin-breadcrumb-item>` children and replaces them with new ones built from the array. Reading this property returns an array of `{ text, path }` objects reflecting the current children, in order. |
| `onNavigate` | `(details) => boolean \| void` | `undefined` | No | Router-integration hook. Called when a non-current breadcrumb link is clicked. Receives `{ path, originalEvent }`. If the handler returns anything other than `false`, the component calls `preventDefault()` on the click. |
| `i18n` | `BreadcrumbI18n` | `{ label: 'Breadcrumb' }` | No | Localization object (via `I18nMixin`). Partial updates are merged with the defaults. |

`BreadcrumbItem` (TypeScript shape):

```ts
type BreadcrumbItem = {
  /** Visible label. Required. */
  text: string;
  /** Navigation target. Omitted/empty for the current page (which must be the last item). */
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
| (default) | Slot for `<vaadin-breadcrumb-item>` children. Items appear in source order; the last one is treated as the current page. |

Parts:

| Part | Description |
|---|---|
| `navigation` | The outer `<nav>` landmark. |
| `list` | The `<ol>` list of entries. |

State attributes (host):

| Attribute | Description |
|---|---|
| `focus-ring` | Set when one of the breadcrumb links is focused via the keyboard (standard `FocusMixin` behavior). |

| Event | Description |
|---|---|
| (none) | No custom events. Consumers integrate via the `onNavigate` callback and the standard anchor `click` event. |

CSS custom properties:

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-separator-symbol` | `'\\203A'` (`›`) | The character (or string) shown in each item's `separator` part via CSS `content`. Applications can override to `'/'`, `'>'`, etc. |

---

**`<vaadin-breadcrumb-item>`** — child element representing a single
trail entry. Not intended to be used outside `<vaadin-breadcrumb>`.

Shadow DOM:

```html
<!-- non-current item -->
<a part="link" href="${path}">
  <slot></slot>
</a>
<span part="separator" aria-hidden="true"></span>

<!-- current item (last child; parent sets the [current] attribute) -->
<span part="link" aria-current="page">
  <slot></slot>
</span>
```

The element renders a host with `role="listitem"` so it participates
in the parent's `<ol role="list">` semantics. Whether the link
template or the current template is used is driven by the `current`
state attribute, which is set by the parent on its last child only.

The default slot is the visible label of the entry. Plain text is
the common case; nested elements (e.g. an icon) are also accepted.

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `path` | `string` | `''` | Yes | The href of the entry. When the entry is the current page (last child), this is ignored — the entry is rendered non-interactive regardless. Convention: omit `path` on the current entry. |

| Slot | Description |
|---|---|
| (default) | The visible label of the entry. |

Parts:

| Part | Description |
|---|---|
| `link` | The clickable `<a>` (non-current items) or the non-interactive `<span>` (current item). |
| `separator` | The separator element after the link. `aria-hidden="true"`. Hidden via CSS when `[current]` is set. |

State attributes (on the item host):

| Attribute | Description |
|---|---|
| `current` | Set by the parent `<vaadin-breadcrumb>` on the last child. Causes the item to render non-interactive, carry `aria-current="page"`, and hide its separator. |

| Event | Description |
|---|---|
| (none) | Items do not fire custom events; clicks bubble through the parent for `onNavigate` handling. |

| CSS Custom Property | Default | Description |
|---|---|---|
| (none directly on the item) | — | Items consume `--vaadin-breadcrumb-separator-symbol` from the parent. |

### Items ↔ children synchronization

`<vaadin-breadcrumb>` keeps the slotted children and the `items`
property in sync via a `SlotController`-based observer:

- **Slotted children change** (declarative form, or programmatic
  `appendChild`): the parent walks its `<vaadin-breadcrumb-item>`
  children, sets the `current` attribute on the last one, removes it
  from any others, and updates an internal cache of items.
- **`items` is set** (programmatic form): the parent removes its
  existing `<vaadin-breadcrumb-item>` children and creates new ones
  from the array (`<vaadin-breadcrumb-item path="...">text</...>`).
  The same child-update path then runs and assigns `[current]` to
  the last child.
- **Reading `items`**: returns a fresh array built from the current
  children (`{ text: child.textContent.trim(), path: child.path }`).
  This means a developer reading back after declaring children in
  HTML gets a sensible array.

A single-child trail renders correctly: one item with `[current]`
and no separator. An empty trail renders an empty `<nav><ol></ol></nav>`
— no error, nothing visible. This state exists briefly while a
route is loading.

### Accessibility

- The host renders as `<nav aria-label="${i18n.label}">` so screen
  readers list the trail as a navigation landmark. Default label is
  `"Breadcrumb"` (localizable via `i18n.label`).
- The list of entries is a semantic `<ol role="list">` so assistive
  tech announces position ("1 of 4"). The breadcrumb-item host
  carries `role="listitem"`. Separators are inside the item shadow
  DOM and carry `aria-hidden="true"` so they are not read.
- The current page:
  - is rendered as a non-interactive element, not an `<a>`;
  - carries `aria-current="page"`;
  - is not reachable via keyboard tab order.
- Non-current links are reachable in source order via normal `Tab`
  traversal. There is no arrow-key navigation (matches Carbon,
  Spectrum, Material, and React Aria).
- Focus ring is visible on the focused link (standard Vaadin
  `focus-ring` state attribute via `FocusMixin` on the parent).
- Activating a focused link with `Enter` follows the anchor —
  handled natively by the browser, no custom keyboard logic needed.

### Click and router integration

Click handling lives on the host (one delegated listener) and
mirrors `<vaadin-side-nav>`'s `__onClick`:

1. If `onNavigate` is not set, do nothing — the anchor navigates
   normally.
2. If the click has a modifier (`metaKey`, `ctrlKey`, `shiftKey`,
   `altKey`), do nothing — let the browser handle it.
3. If the composed path does not contain an `<a>` inside a
   `<vaadin-breadcrumb-item>`, do nothing.
4. If the item is the current item, do nothing (the current item
   has no `<a>` so this is normally a no-op).
5. Otherwise, call `onNavigate({ path, originalEvent })`. If it
   returns anything other than `false`, call `preventDefault()` on
   the event.

This is the same contract already used by `side-nav`, so apps with
both components can reuse a single handler.

### Use-case traceability

| # | Use case | Covered by |
|---|---|---|
| 1 | Strict hierarchy | Declarative children or `items` array — app builds the trail from its route table. |
| 2 | Canonical path always shown | Declarative children or `items` array — app emits the canonical trail. |
| 3 | No canonical, only current on direct entry | Single-child trail. Single-item rendering is explicitly supported. |
| 4 | Deep navigation with static prefix | Declarative children or `items` array — app concatenates prefix + dynamic part. |
| 5 | Omit views from trail start | App omits the entries; the component renders whatever trail it is given. |
| 6 | Omit views from trail end | App omits the entries; last entry is always treated as current. |
| 7 | Omit intermediate views | App omits the entries. |
| 8 | Programmatic customization | `items` array is the primary programmatic API; no hidden magic. |

Cross-check: every property, part, and CSS custom property in the
spec is traceable to at least one use case.

- Declarative children + `items` → UC1–UC8 (all)
- `path` on `<vaadin-breadcrumb-item>` → UC1–UC8 (every link in
  every example)
- `onNavigate` → UC1–UC8 (every SPA app needs router integration to
  avoid full reloads on trail clicks)
- `i18n.label` → accessibility requirement implicit in UC1 (and
  standard in every referenced library)
- parts `navigation`/`list` (parent) and `link`/`separator`
  (item) → needed to render and style a trail (UC1)
- `current` state attribute on item → distinguish current page,
  needed by every use case
- `--vaadin-breadcrumb-separator-symbol` → visual separator between
  entries, needed by every multi-item use case

### Open questions / notes

- **Long labels / overflow.** Not in the current use cases, so not
  specified. The trail is intended to be a single line; if a future
  use case requires explicit truncation or "…/middle/…" collapsing,
  parts and custom properties can be added to
  `<vaadin-breadcrumb-item>` without breaking the existing API.
- **External links / `target="_blank"`.** Not in the current use
  cases. If needed later, add an optional `target` attribute to
  `<vaadin-breadcrumb-item>` (mirroring `vaadin-side-nav-item`'s
  `target`).
- **Router-ignore per item.** Not in the current use cases. If
  needed, add `routerIgnore` on `<vaadin-breadcrumb-item>` mirroring
  `vaadin-side-nav-item`.
- **Disabled entries.** Not in the current use cases — a breadcrumb
  trail represents reachable ancestors, so a disabled link is a
  contradiction. Not in this spec.
