# Vaadin Breadcrumb Web Component

> ⚠️ This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.breadcrumbComponent = true`

A breadcrumb shows a sequence of navigation items that lead to the current
page. The application decides what the sequence contains — the component
itself does not read the URL, walk the route tree, or remember navigation
history. This keeps the component router-agnostic and makes every use case
in `use-cases.md` a matter of feeding the component the right list of items.

## Usage Examples

### 1. Declarative (canonical form)

The baseline shape. Works with no JavaScript beyond the component import and
is what tests, docs, and SSR output look like.

Covers **UC1 (strict hierarchy)** when the trail is known at authoring time,
and is the HTML form produced by frameworks from any of UC2–UC8.

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/electronics">Electronics</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/electronics/laptops">Laptops</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>ThinkPad X1 Carbon</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

- Items with a `path` attribute render as `<a href="...">` links.
- The last item typically has no `path` — it represents the current page and
  is rendered as plain text with `aria-current="page"`.
- Separators between items are rendered by the component itself.

### 2. Programmatic (data-driven)

The same component, populated from an array. This is the form applications
use when the trail is computed at runtime — from a canonical lookup, from
navigation state, from a route table, etc.

Setting `items` replaces any slotted `<vaadin-breadcrumb-item>` children.
Setting `items` to `null` or an empty array and providing slotted children
again restores the declarative form. Both forms produce the same rendering,
the same DOM, the same events, and the same accessibility tree.

```html
<vaadin-breadcrumb></vaadin-breadcrumb>
<script>
  document.querySelector('vaadin-breadcrumb').items = [
    { text: 'Home', path: '/' },
    { text: 'Electronics', path: '/electronics' },
    { text: 'Laptops', path: '/electronics/laptops' },
    { text: 'ThinkPad X1 Carbon' }, // no path → current page
  ];
</script>
```

Covers every dynamic variant:

- **UC1 (strict hierarchy)** — items are derived from the URL structure.
- **UC2 (canonical path)** — the application always supplies the canonical
  trail regardless of the path the user took. The breadcrumb does not know
  and does not care how the page was reached.
- **UC3 (no canonical, only current on direct entry)** — the application
  supplies different arrays depending on whether it has navigation context;
  on direct URL entry it supplies a single-item array (`[{ text: 'Jane Doe' }]`).
- **UC4 (deep navigation with static prefix)** — the application assembles
  the fixed prefix together with the dynamic chain (or just the current
  page, on direct entry) and assigns the result to `items`.
- **UC5 (omit from trail start)** — the application simply does not include
  the parent views in the array it assigns.
- **UC6 (omit from trail end)** — same: the application omits the
  trailing item that belongs to a side-panel view.
- **UC7 (omit intermediate views)** — same: the application omits the
  layout-wrapper view from the array.
- **UC8 (programmatic customization per route)** — this is the direct,
  intended usage of `items`.

### 3. Item with prefix content

Items can carry slotted content (icons, badges) via a `prefix` slot on each
item. This is only available in the declarative form because the
programmatic item object cannot carry arbitrary DOM.

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">
    <vaadin-icon icon="vaadin:home" slot="prefix"></vaadin-icon>
    Home
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/electronics">Electronics</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>ThinkPad X1 Carbon</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

### 4. Custom separator

Applications can override the default separator with a single slotted
element. The component clones the slotted separator between each pair of
items.

```html
<vaadin-breadcrumb>
  <span slot="separator">/</span>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/electronics">Electronics</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>ThinkPad X1 Carbon</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

For purely visual separator customization (color, spacing, the default glyph),
use the CSS custom properties listed below instead of a slot.

---

### Key Design Decisions

1. **The component renders exactly what it is given; no automatic trail
   computation.** Every use case in `use-cases.md` is covered by the
   application feeding the component the right list of items. The
   component does not read `window.location`, does not walk a route tree,
   and does not remember navigation history. This is why UC1–UC8 all
   collapse into the same two usage shapes (declarative and programmatic).

2. **Dual API — declarative and programmatic, per the guidelines.**
   `<vaadin-breadcrumb-item>` is the canonical declarative form; `items`
   is the programmatic form typical applications will use at runtime.
   Both produce the same rendering and the same events.
   - *Why both:* real applications compute the trail at runtime
     (UC2–UC4, UC8), but static markup, tests, SSR, and the simplest
     UC1 cases benefit from a parse-time DOM. The guidelines require
     both when per-item state is typically computed at runtime, which
     is the case here.

3. **Items with a `path` render as `<a href>`; items without `path`
   render as plain text.** This is how the component distinguishes
   "clickable ancestor" from "current page" without needing an extra
   `current` flag. It also means the component is fully router-agnostic
   — a plain `<a href>` is the primitive, and any SPA router (or no
   router at all) handles activation.
   - *Why:* the guidelines explicitly require router-agnostic
     navigation via plain anchors. It also gives middle-click,
     "open in new tab", "copy link address", keyboard focus, and
     screen-reader link semantics for free.

4. **The last item is always treated as the current page for
   accessibility.** Whether or not it has a `path`, the last item gets
   `aria-current="page"`. This is the only piece of "breadcrumb
   intelligence" the component has, and it matches every use case:
   UC3's direct-entry single-item trail, UC4's direct-entry short
   trail, and the canonical full trail all have the same
   last-item-is-current semantics.

5. **Separators are rendered by the component, not by the application.**
   Items are a logical list; separators are visual chrome. Applications
   can theme the default separator via CSS custom properties, or
   override it entirely by slotting a `separator` element. This keeps
   the `items` array clean (no separator entries) and makes the DOM
   semantically correct (an ordered list of items, not a flat run of
   text).

6. **No `onNavigate` callback, no `location` property.** The component
   has no notion of "current URL" to synchronize with (the last item
   is the current page by definition), and navigation is handled by
   plain anchors, so the hooks that `<vaadin-side-nav>` exposes for
   those concerns are not needed here. None of UC1–UC8 require them.
   If a future use case demands click interception, a cancellable
   `item-click` event can be added without breaking the current API.

7. **`<nav aria-label="Breadcrumb">` wrapper and `<ol>` inside.**
   Matches the WAI-ARIA Breadcrumb pattern. The component sets
   `role="navigation"` on itself (or uses a native `<nav>` in shadow
   DOM) and an ordered list for the items, which is the semantics
   screen readers expect for a breadcrumb trail.

---

## Implementation

### Mixin chain

```
BreadcrumbMixin(
  ElementMixin(
    ThemableMixin(
      PolylitMixin(
        LumoInjectionMixin(
          LitElement
        )
      )
    )
  )
)
```

Same chain for `<vaadin-breadcrumb-item>`, minus `BreadcrumbMixin`.

### Elements

**`<vaadin-breadcrumb>`** — Container element

Renders a `<nav>` landmark containing an ordered list. Each rendered list
entry is one item followed by a separator (except the last).

Shadow DOM renders:

```html
<nav part="nav" aria-label="Breadcrumb">
  <ol part="list" role="list">
    <!--
      When items is set, the component renders one <li><a/span part="link">…</a/span></li>
      per entry, interleaved with <li aria-hidden="true" part="separator">…</li>.
      When items is not set, a <slot></slot> projects the <vaadin-breadcrumb-item>
      children; separators are rendered by the items themselves (see below).
    -->
    <slot></slot>
  </ol>
  <slot name="separator" hidden></slot>
</nav>
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `items` | `Array<BreadcrumbItemData> \| null` | `null` | No | Programmatic list of items. Each entry is `{ text: string, path?: string, target?: string }`. When set (non-null), the component renders these instead of any slotted children and their order drives the trail. Setting to `null` restores the slotted-children rendering. |

`BreadcrumbItemData` (TypeScript):

```ts
interface BreadcrumbItemData {
  /** Visible label. Required. */
  text: string;
  /** URL to navigate to. When omitted, the item renders as plain text
   *  (used for the current page). */
  path?: string;
  /** Anchor target. Only meaningful when `path` is set. */
  target?: string;
}
```

| Slot | Description |
|---|---|
| (default) | One or more `<vaadin-breadcrumb-item>` children. Ignored when the `items` property is set. |
| `separator` | Optional single element used as the separator between items. When omitted, the component renders its own default separator (a chevron glyph). The slotted separator is cloned between each pair of items and marked `aria-hidden="true"`. |

Parts in addition to the ones defined in the shadow DOM:

| Part | Description |
|---|---|
| `nav` | The `<nav>` landmark wrapping the list. |
| `list` | The ordered list (`<ol>`) containing the items and separators. |

Events:

| Event | Description |
|---|---|
| `items-changed` | Fired when the `items` property changes (notify pattern, for two-way-binding frameworks). |

CSS custom properties:

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-gap` | `var(--vaadin-gap-s)` | Horizontal gap between items and separators. |
| `--vaadin-breadcrumb-padding` | `var(--vaadin-padding-s)` | Padding inside the breadcrumb container. |
| `--vaadin-breadcrumb-font-family` | `inherit` | Font family for all items and separators. |
| `--vaadin-breadcrumb-font-size` | `inherit` | Font size for all items and separators. |
| `--vaadin-breadcrumb-text-color` | `var(--vaadin-text-color-secondary)` | Color of non-current (ancestor) items. |
| `--vaadin-breadcrumb-current-text-color` | `var(--vaadin-text-color)` | Color of the current-page item (the last item). |
| `--vaadin-breadcrumb-separator-color` | `var(--vaadin-text-color-subtle)` | Color of the default separator. |
| `--vaadin-breadcrumb-separator-symbol` | `'\\203A'` (›) | The default separator glyph when no `separator` slot is used. |

State attributes (on `<vaadin-breadcrumb>`):

| Attribute | Description |
|---|---|
| `has-custom-separator` | Set when a child is assigned to the `separator` slot. |

---

**`<vaadin-breadcrumb-item>`** — Child element

A single entry in the trail. Renders either a link (when `path` is set) or a
plain-text span (when `path` is not set). The component host is the `<li>`
logically; it uses `display: contents` so the shadow DOM `<li>` is the real
list item.

Shadow DOM renders:

```html
<!-- when path is set and this is NOT the last item -->
<a part="link" href="{path}" target="{target}">
  <slot name="prefix"></slot>
  <slot></slot>
</a>

<!-- when path is set and this IS the last item -->
<a part="link" href="{path}" target="{target}" aria-current="page">
  <slot name="prefix"></slot>
  <slot></slot>
</a>

<!-- when path is not set (always the current page in practice) -->
<span part="link" aria-current="page">
  <slot name="prefix"></slot>
  <slot></slot>
</span>
```

The host element is given `role="listitem"`. The breadcrumb parent inserts a
separator element between items (see Separators below).

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `path` | `string \| null` | `null` | Yes | URL this item navigates to. When omitted, the item renders as plain text. |
| `target` | `string \| null` | `null` | Yes | Anchor `target` attribute. Only applied when `path` is set. |

| Slot | Description |
|---|---|
| (default) | The visible label of the item. |
| `prefix` | Optional content before the label (e.g. an icon). |

Parts in addition to the ones defined in the shadow DOM:

| Part | Description |
|---|---|
| `link` | The inner element — `<a>` when `path` is set, `<span>` otherwise. |
| `prefix` | Wrapper around the prefix slot content. |

Events:

| Event | Description |
|---|---|
| *(none)* | The item has no events of its own. Clicks on the `<a>` follow normal anchor semantics and are handled by the browser (or by any SPA router present in the application). |

State attributes (on `<vaadin-breadcrumb-item>`):

| Attribute | Description |
|---|---|
| `current` | Set on the last item in the trail (reflects `aria-current="page"`). |
| `link` | Set when the item has a `path` (i.e. renders as an `<a>`). |
| `focus-ring` | Set when the inner link is keyboard-focused. |

CSS custom properties:

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-item-padding` | `0` | Inner padding around the label. |
| `--vaadin-breadcrumb-item-text-decoration` | `none` | Text decoration for the link in the resting state. |
| `--vaadin-breadcrumb-item-hover-text-decoration` | `underline` | Text decoration on hover. |

---

### Separators

The breadcrumb parent is responsible for placing a separator element between
each pair of items. The separator is marked `aria-hidden="true"` and is not
focusable.

- **Default separator:** a chevron glyph rendered via a shadow DOM `::before`
  pseudo-element on each non-first item, driven by
  `--vaadin-breadcrumb-separator-symbol`. No extra DOM is created for the
  default case.
- **Custom separator (`separator` slot):** when a single element is slotted
  into the `separator` slot, the breadcrumb clones that element between each
  pair of items. The slotted original is hidden. Cloned copies are marked
  `aria-hidden="true"` and `part="separator"`.

The `separator` part is available for styling both the default and the
custom separator.

---

### Accessibility

- The host renders (or sets) `<nav role="navigation" aria-label="Breadcrumb">`
  so assistive technology identifies the region as a breadcrumb landmark.
- The list of items is an `<ol>` with explicit `role="list"` (defensive,
  against user-agent stylesheets that strip list semantics) so screen
  readers announce the item count.
- Each item is a `listitem`. The inner link or text carries
  `aria-current="page"` on the last item only.
- Separators are decorative and always `aria-hidden="true"`.
- Keyboard navigation: there is no custom keyboard model. Tab moves through
  the anchor elements in DOM order (ancestors only — the current-page text
  span is not focusable). `Enter` activates a focused anchor. `Shift+Tab`
  reverses. No arrow-key handling: a breadcrumb is a short linear sequence
  of links and the browser's native link behavior is the expected model.
- Focus ring: handled by the `focus-ring` state attribute set via
  `FocusMixin` on `<vaadin-breadcrumb-item>`.

---

### Router-agnosticism

- The component never imports a router package.
- Navigation happens exclusively through plain `<a href="...">` elements.
  The browser handles activation by default; any SPA router present in the
  application intercepts the click at the document level (as every major
  router does) and converts it to a client-side navigation. The breadcrumb
  does not need to know a router exists.
- There is no `location` property, no `onNavigate` callback, and no
  `window.location` / `popstate` listeners. The "current page" is simply
  the last item in whatever list the application provides. Applications
  rebuild or reassign `items` when they change route.

---

### Coverage check: use cases → API

| Use case | How the API covers it |
|---|---|
| UC1 Strict hierarchy | Declarative markup or `items = [...]` with each ancestor plus a path-less last item. |
| UC2 Canonical path | Application sets `items` to the canonical trail regardless of how the page was entered. |
| UC3 No canonical, current-only on direct entry | Application sets `items` to a navigation-derived trail when it has context, or a single-entry array `[{ text: 'Jane Doe' }]` on direct entry. |
| UC4 Deep navigation with static prefix | Application concatenates the fixed prefix with the dynamic chain (or just the current page on direct entry) and assigns to `items`. |
| UC5 Omit from trail start | Application omits the parent entries from the array. |
| UC6 Omit from trail end | Application omits the trailing entry from the array. |
| UC7 Omit intermediate views | Application omits the wrapper entry from the array. |
| UC8 Programmatic customization per route | Direct usage of the `items` property; no constraints on content. |

Every item of API above is justified by at least one use case:

- `<vaadin-breadcrumb>` host — all UCs
- `items` property — UC2, UC3, UC4, UC5, UC6, UC7, UC8 (runtime-computed trails)
- `<vaadin-breadcrumb-item>` declarative element — UC1 and the declarative-first rule
- `path` attribute — UC1, UC2, UC4 (ancestors must be clickable)
- `target` attribute — general requirement for link targets (kept minimal; not
  required by a specific UC, but is the standard anchor attribute and is
  carried over from `<vaadin-side-nav-item>` for consistency; if not needed,
  it can be removed without affecting any UC)
- `prefix` slot — not strictly required by any UC, but listed because the
  declarative markup examples in other Vaadin components (`side-nav-item`,
  `menu-bar-item`) all offer a prefix slot; it is a zero-cost consistency
  win and should be kept unless an actual use case argues against it. *Note:
  flag for review — no UC explicitly requires it.*
- `separator` slot and separator CSS custom properties — purely styling;
  not tied to a specific UC, kept for consistency with typical breadcrumb
  implementations. *Note: flag for review — no UC explicitly requires
  custom separators; may be dropped if deemed bloat.*
- Last-item `aria-current="page"` handling — required by accessibility for
  all UCs.
- `items-changed` event — standard notify pattern, required by frameworks
  that two-way-bind `items`; implied by UC2–UC8 which all drive the list
  from runtime state.
