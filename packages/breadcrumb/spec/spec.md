# Breadcrumb Web Component Specification

> This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.breadcrumbComponent = true`

## Key Design Decisions

1. **`onNavigate` callback instead of `navigate` event (deviation from developer-api.md §4).** Developer-api.md proposed a cancellable `navigate` custom event on the container. The spec uses an `onNavigate` callback property instead, matching Side Nav's established pattern (`packages/side-nav/src/vaadin-side-nav.js:134`). The callback receives an object with `path` and `originalEvent`, and prevents default navigation unless it returns `false`. This is consistent with how the only other Vaadin navigation component handles interception, and supports the same modifier-key/external-link/target-blank bypass logic.

2. **`label` property mapped to `aria-label`, not a label slot.** Side Nav uses a `label` slot because its label is visible and can be a collapsible toggle. Breadcrumb has no visible label — the `label` property exists only to set the `aria-label` on the navigation landmark. A simple string property with a default of `"Breadcrumb"` is sufficient. See developer-api.md §7.

3. **Host element gets `role="navigation"` following Side Nav.** Side Nav sets `role="navigation"` on the host element directly (`packages/side-nav/src/vaadin-side-nav.js`). Breadcrumb follows the same pattern. A `<div role="list">` inside shadow DOM provides list semantics for screen readers to announce item count.

4. **Overflow button inserted into light DOM at correct position.** Per WEB_COMPONENT_GUIDELINES: "an overflow button that appears visually after the first item must also be the second element in the DOM." The overflow button is a `<button>` element created by the component and dynamically inserted into light DOM between the last visible left-side item and the first visible right-side item. This keeps DOM order = visual order = focus order.

5. **Overflow detection via ResizeMixin (Menu Bar pattern).** Uses `ResizeMixin` from `packages/component-base/src/resize-mixin.js`, which wraps a global `ResizeObserver`. On resize, the component runs the collapse algorithm with `microTask` debouncing, matching Menu Bar's `__scheduleOverflow()` pattern (`packages/menu-bar/src/vaadin-menu-bar-mixin.js:471`).

6. **Collapse algorithm differs from Menu Bar's `reverseCollapse`.** Menu Bar collapses items from one end. Breadcrumb collapses intermediate items starting from the one closest to the root, preserving root and current page as long as possible. When all intermediates are collapsed, the root collapses next. The current page never collapses. This is a custom algorithm, not a toggle on Menu Bar's `reverseCollapse`. See requirements §7.

7. **Separator rendered in each item's shadow DOM.** `::slotted()` cannot chain with `::after`, so the separator cannot be applied from the breadcrumb's shadow CSS onto slotted items. Instead, each `<vaadin-breadcrumb-item>` renders a separator `<span part="separator">` in its own shadow DOM. The separator content and direction are controlled by CSS custom properties. The last item (marked with `current` attribute) hides its separator. This gives themes full control via `::part(separator)` while keeping the separator a CSS concern with no JS API. See developer-api.md §8.

8. **Programmatic `items` rendered into light DOM via Lit `render()`.** Follows Menu Bar's pattern (`packages/menu-bar/src/vaadin-menu-bar-mixin.js:595`). When the `items` property is set, the component renders `<vaadin-breadcrumb-item>` elements into its own light DOM. Both declarative (slotted) and programmatic (items property) forms produce the same rendering. See developer-api.md §2.

9. **Dropdown uses `position: fixed` with viewport coordinates.** Per WEB_COMPONENT_GUIDELINES styling rules: "Dropdown panels attached to an inline trigger must use `position: fixed` with `getBoundingClientRect()` viewport coordinates." This prevents clipping by ancestors with `overflow: hidden`.

10. **Current-page truncation via host attribute, not `::slotted()`.** Per WEB_COMPONENT_GUIDELINES: "`::slotted()` cannot reach into a child's shadow DOM." When truncation is needed, the parent breadcrumb sets a `truncate` attribute on the current item. The item's own shadow CSS handles `text-overflow: ellipsis` using `:host([truncate])`. See requirements §9.

---

## Implementation

### Elements

**`<vaadin-breadcrumb>`** — Container element

Class: `Breadcrumb`

Mixin chain:
```
Breadcrumb extends BreadcrumbMixin(
  I18nMixin({ moreItems: 'Show collapsed items' },
    ResizeMixin(
      ElementMixin(
        ThemableMixin(
          PolylitMixin(
            LumoInjectionMixin(LitElement)
          )
        )
      )
    )
  )
)
```

Shadow DOM:
```html
<div part="container" role="list">
  <slot></slot>
</div>
<div part="dropdown" role="list" hidden></div>
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `items` | `Array<{text: string, path?: string, prefix?: string}>` | `[]` | No | Programmatic item data. When set, renders `<vaadin-breadcrumb-item>` elements into light DOM. Each object has `text` (label), optional `path` (navigation target), and optional `prefix` (icon name string, e.g. `'vaadin:home'`). The last item without a `path` is automatically the current page. (Req 1, 2, 3, 10) |
| `label` | `String` | `'Breadcrumb'` | No | Accessible label for the navigation landmark. Mapped to `aria-label` on the host element. (Req 11) |
| `onNavigate` | `Function \| undefined` | `undefined` | No | Callback for navigation interception. When set, item link clicks are intercepted: the callback receives `{ path, originalEvent }` and default navigation is prevented unless the callback returns `false`. Clicks with modifier keys, on external links, or with `target="_blank"` bypass interception. `attribute: false`. (Req 4) |
| `i18n` | `{ moreItems: string }` | `{ moreItems: 'Show collapsed items' }` | No | Localization object. `moreItems` is the accessible label for the overflow button. (Req 8) |

| Slot | Description |
|---|---|
| (default) | Accepts `<vaadin-breadcrumb-item>` elements. The last item is treated as the current page. (Req 1, 2) |

| Part | Description |
|---|---|
| `container` | The flex container holding the item slot. Has `role="list"`. (Req 6) |
| `dropdown` | The fixed-position dropdown panel listing collapsed items. (Req 8) |

| Event | Description |
|---|---|
| (none) | Navigation interception uses the `onNavigate` callback property, not events. |

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-gap` | (theme) | Gap between items and separators. |

#### Internal Behavior

**Overflow algorithm (Req 6, 7):**

1. On resize (via `ResizeMixin._onResize()`), schedule overflow detection with `microTask` debouncing.
2. Compare `container.scrollWidth` against `container.offsetWidth`. If no overflow, restore all items and hide the overflow button.
3. If overflow detected, lock container width (`container.style.minWidth`) to prevent cascading collapse during measurement.
4. Build the item list from slotted children (or rendered items from the `items` property).
5. Collapse items one at a time, starting from the item at index 1 (closest to root after root itself), then index 2, and so on toward the current page. For each collapsed item, apply `visibility: hidden; position: absolute` to remove it from flow while keeping it measurable.
6. After each collapse, re-check fit. Stop when the remaining visible items plus the overflow button fit.
7. If all intermediates are collapsed and the trail still overflows, collapse the root item (index 0).
8. If only the current page remains and still overflows, set `truncate` attribute on the current item (Req 9).
9. Insert the overflow button into light DOM at the correct position: after the last visible item that precedes the collapsed range.
10. Unlock container width.

**Overflow button:**

A `<button>` element created by the component and dynamically managed in light DOM. Attributes:
- `data-overflow` — identifies it for `::slotted()` styling
- `role="button"`
- `aria-expanded="false"` / `"true"` — synced with dropdown open state
- `aria-haspopup="true"`
- `aria-label` — set from `i18n.moreItems`
- `tabindex="0"`
- Text content: `"…"` (horizontal ellipsis, U+2026)

Styled via `::slotted([data-overflow])` in shadow CSS. Must have zero vertical padding to avoid inflating the flex row height (per WEB_COMPONENT_GUIDELINES).

**Dropdown (Req 8):**

When the overflow button is activated (click or Enter/Space), the dropdown opens:
- Positioned using `position: fixed` with `getBoundingClientRect()` of the overflow button.
- Contains links for each collapsed item, rendered in hierarchy order (root-to-leaf).
- Each link has the same `href` and click behavior as the original item.
- Clicking a dropdown link triggers navigation (subject to `onNavigate` interception).
- Escape key or clicking outside closes the dropdown and returns focus to the overflow button.
- `aria-expanded` on the overflow button is synced.

**Navigation interception (Req 4):**

Click handler on the host element (`__onClick`), following Side Nav's pattern:
1. If `onNavigate` is not set, allow default action (no interception).
2. If click has modifier keys (`metaKey`, `shiftKey`), allow default (middle-click, new tab).
3. If link target is `_blank` or link is external, allow default.
4. Call `onNavigate({ path, originalEvent })`.
5. If callback returns `false`, allow default action (browser follows link).
6. Otherwise, prevent default (`e.preventDefault()`).

This applies to all item clicks — both visible items and dropdown items.

**Programmatic items rendering (Req 10):**

When `items` changes, use Lit's `render()` to render `<vaadin-breadcrumb-item>` elements into light DOM, following Menu Bar's pattern. The render call uses `renderBefore` to place items before the overflow button (if present). Each item:
```javascript
html`<vaadin-breadcrumb-item .path="${item.path}">
  ${item.prefix ? html`<vaadin-icon icon="${item.prefix}" slot="prefix"></vaadin-icon>` : ''}
  ${item.text}
</vaadin-breadcrumb-item>`
```

**Current item management (Req 2):**

After items are observed (slot change or `items` property update):
1. Remove `current` attribute from all items.
2. Set `current` attribute on the last item.
3. The item's internal rendering reacts to `current`: sets `aria-current="page"` on the link, makes it non-interactive.

---

**`<vaadin-breadcrumb-item>`** — Individual breadcrumb item

Class: `BreadcrumbItem`

Mixin chain:
```
BreadcrumbItem extends ElementMixin(
  ThemableMixin(
    PolylitMixin(
      LumoInjectionMixin(LitElement)
    )
  )
)
```

Shadow DOM:
```html
<a id="link" part="link"
   href="${ifDefined(this.path)}"
   tabindex="${this.path == null || this.current ? '-1' : '0'}"
   aria-current="${this.current ? 'page' : 'false'}">
  <slot name="prefix"></slot>
  <slot></slot>
</a>
<span part="separator" aria-hidden="true"></span>
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `path` | `String \| null` | `null` | Yes | Navigation target URL. Rendered as the `href` attribute on the internal `<a>` element. When `null` or absent, the link has no `href` and is non-interactive. (Req 1, 3) |
| `current` | `Boolean` | `false` | Yes | Set by the parent `<vaadin-breadcrumb>` on the last item. When true, the link gets `aria-current="page"`, `tabindex="-1"`, and the separator is hidden. Read-only from the developer's perspective. (Req 2) |

| Slot | Description |
|---|---|
| (default) | Text label of the breadcrumb item. (Req 1) |
| `prefix` | Optional content displayed before the text label, such as `<vaadin-icon>`. (Req 5) |

| Part | Description |
|---|---|
| `link` | The `<a>` element rendering the item as a link (or non-interactive text when current). |
| `separator` | The visual separator after the item. Hidden on the current (last) item. Content and direction controlled by CSS. `aria-hidden="true"`. (Req 12) |

| Event | Description |
|---|---|
| (none) | Navigation is handled by the parent `<vaadin-breadcrumb>` via `onNavigate`. |

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-item-text-color` | (theme) | Text color of ancestor links. |
| `--vaadin-breadcrumb-item-current-text-color` | (theme) | Text color of the current (last) item. |
| `--vaadin-breadcrumb-separator-content` | `'\\203A'` | Separator character. Default is `›` (single right-pointing angle quotation mark). (Req 12) |

#### Internal Behavior

**Separator rendering (Req 12):**

The `[part="separator"]` span renders the separator character via CSS `::before` pseudo-element using `content: var(--vaadin-breadcrumb-separator-content)`. In RTL layouts, the separator flips direction via `transform: scaleX(-1)` on `:host([dir="rtl"]) [part="separator"]`. DirMixin (inherited through ElementMixin) syncs the `dir` attribute.

**Current item rendering (Req 2):**

When `current` is true:
- `aria-current="page"` on the `<a>` element.
- `tabindex="-1"` — the item is not in the tab order.
- `href` is not rendered (even if `path` is set) — the item is non-interactive.
- Separator is hidden via `:host([current]) [part="separator"] { display: none }`.
- Visual distinction (e.g., bolder weight, different color) applied via theme CSS using `:host([current])`.

**Truncation (Req 9):**

When the parent sets a `truncate` attribute on the item:
```css
:host([truncate]) {
  min-width: 0;
}
:host([truncate]) [part='link'] {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
```
The full label is accessible via a native `title` attribute set by the parent, or through a `<vaadin-tooltip>` slotted by the parent. The parent sets `title` on the item host element when `truncate` is applied.

**Link behavior (Req 3):**

The `<a>` element provides standard browser link behavior (middle-click, right-click context menu, "open in new tab") without any special handling. This is the same pattern as `<vaadin-side-nav-item>`.

---

## Reuse and Proposed Adjustments to Existing Modules

### `ResizeMixin` — used as-is

**File:** `packages/component-base/src/resize-mixin.js`

Provides `_onResize()` callback via a shared global `ResizeObserver`. The breadcrumb overrides `_onResize()` to schedule overflow detection, identical to Menu Bar's usage.

**Other consumers:** Menu Bar, Tabs, and other components. No modification needed.

---

### `I18nMixin` — used as-is

**File:** `packages/component-base/src/i18n-mixin.js`

Provides the `i18n` property with partial-update support. The breadcrumb passes `{ moreItems: 'Show collapsed items' }` as the default i18n object.

**Other consumers:** Side Nav, Date Picker, and many others. No modification needed.

---

### `SlotController` — used as-is

**File:** `packages/component-base/src/slot-controller.js`

Used in `multiple` mode to observe slotted `<vaadin-breadcrumb-item>` children. On slot change, the component recalculates the item list, updates `current` attribute on the last item, and re-runs the overflow algorithm.

**Other consumers:** Many components. No modification needed.

---

### `DirMixin` (via `ElementMixin`) — used as-is

**File:** `packages/component-base/src/dir-mixin.js`

Inherited through `ElementMixin`. Syncs `dir` attribute on both `<vaadin-breadcrumb>` and `<vaadin-breadcrumb-item>`. The item's shadow CSS uses `:host([dir="rtl"])` to flip the separator direction.

**Other consumers:** All Vaadin components via `ElementMixin`. No modification needed.
