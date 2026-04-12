# Breadcrumb Web Component Specification

<!--
Full implementation specification derived from developer-api.md, grounded in the actual source code of this repository.

This IS a specification — it includes shadow DOM structure, mixin chains, properties, slots, parts, events, CSS custom properties, and accessibility behavior.

Usage examples and API rationale live in developer-api.md. This spec references them by section number/name where relevant (e.g., "see developer-api.md §3 Custom separator") rather than duplicating them.

Key design decisions document deviations from developer-api.md with rationale.

Do NOT include features that no requirement supports.
DO study existing source code for reusable patterns, naming conventions, and shared modules.
-->

> This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.breadcrumbComponent = true`

## Key Design Decisions

1. **`path` property instead of `href`** — developer-api.md §1 proposes `href` for the item navigation target. Changed to `path` for consistency with `vaadin-side-nav-item`, which uses `path` for the same purpose. The WEB_COMPONENT_GUIDELINES.md declarative API example also uses `path` for breadcrumb items. Both map to the `href` attribute on the rendered `<a>` element internally. Using `path` keeps the Vaadin navigation component vocabulary consistent: `path` means "the URL this navigational element points to."

2. **Programmatic `items` API added** — developer-api.md does not include a programmatic API. Added per WEB_COMPONENT_GUIDELINES.md §"Also offer a programmatic API when items are typically data-driven," which explicitly names breadcrumb trails as an example of data-driven content ("breadcrumb trails derived from navigation history"). The `items` property accepts an array of plain objects and produces the same rendering as declarative children.

3. **Router-agnostic link rendering** — Items render plain `<a href>` elements per WEB_COMPONENT_GUIDELINES.md §"Be router-agnostic." SPA routers intercept clicks at the document level — the component does not call into any router. `onNavigate` is retained from developer-api.md §7 as an optional callback hook for cases where the application needs to intercept navigation (e.g., unsaved-changes guards). This matches the existing `vaadin-side-nav` pattern, which the guidelines list as an acceptable router-neutral hook.

4. **Separator rendered per-item in shadow DOM** — developer-api.md §3 proposes a single `separator` slot on the container, cloned between items. The spec implements this by having each `<vaadin-breadcrumb-item>` render its own separator element in its shadow DOM. The container observes the `separator` slot content and distributes cloned copies to each item. The first visible item's separator is hidden via CSS. This approach keeps separators in the shadow DOM where they are naturally `aria-hidden` and independently styleable via the `separator` part.

5. **Overflow detection uses ResizeMixin** — Following the `vaadin-menu-bar` overflow detection pattern (`packages/menu-bar/src/vaadin-menu-bar-mixin.js`). `ResizeMixin` triggers overflow calculation on host resize. Non-fitting intermediate items are visually hidden; an ellipsis button appears between the first and last visible items. The overflow dropdown is rendered using an internal overlay positioned relative to the ellipsis button.

6. **Current page logic: declarative first, URL matching second** — Primary mechanism: an item without `path` is the current page (developer-api.md §1). Secondary mechanism: when all items have `path`, the component compares each against the browser URL using `matchPaths()` from `@vaadin/component-base/src/url-utils.js` (developer-api.md §6, requirement 9). The container's `location` property triggers re-evaluation for SPA integration, following the `vaadin-side-nav` pattern. This reconciles the developer-api.md automatic detection feature with the WEB_COMPONENT_GUIDELINES.md principle that "the component must not read `window.location` as its primary mechanism."

7. **No FocusMixin on either element** — The breadcrumb container is a `<nav>` landmark and is not itself focusable. Items contain native `<a>` elements whose focus behavior is handled by the browser. This differs from `vaadin-side-nav`, which uses `FocusMixin` on the container for its collapsible toggle button — breadcrumb has no such toggle.

8. **Mobile collapse via MediaQueryController** — On narrow viewports, the component collapses to a single back-navigation link pointing to the immediate parent (developer-api.md §8, requirement 10). Uses `MediaQueryController` from `@vaadin/component-base/src/media-query-controller.js` with a configurable breakpoint. The back link renders a back-arrow icon and the parent item's label.

9. **`onNavigate` callback shape simplified from side-nav** — developer-api.md §7 proposes `onNavigate({ href })`. Since the property is renamed to `path`, the callback receives `{ path, originalEvent }`. This is simpler than side-nav's callback shape (`{ path, target, current, expanded, pathAliases, originalEvent }`) because breadcrumb items have no expansion, aliases, or target attributes.

10. **Disabled items render as non-interactive text** — developer-api.md §10 specifies that a disabled item with a path renders as plain text, not a link. The spec uses `DisabledMixin` from `@vaadin/a11y-base` (matching `vaadin-side-nav-item`) and conditionally renders either an `<a>` or a `<span>` based on the disabled/current state. The `path` value is retained on the element so re-enabling restores navigability.

---

## Implementation

### Elements

**`<vaadin-breadcrumb>`** — Container element

Mixin chain:
```
BreadcrumbMixin(
  ResizeMixin(
    SlotStylesMixin(
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
  )
)
```

Shadow DOM:
```html
<div role="list" part="list" id="list">
  <slot></slot>
  <slot name="overflow"></slot>
</div>
<slot name="separator"></slot>
```

Notes on shadow DOM:
- The host element receives `role="navigation"` and `aria-label="Breadcrumb"` in `firstUpdated()` (if not already set by the developer), providing the navigation landmark. The developer can override `aria-label` directly on the host (e.g., `<vaadin-breadcrumb aria-label="Project navigation">`). This follows the `vaadin-side-nav` pattern, which sets `role="navigation"` on the host.
- The `<div role="list">` wraps all items. Items set `role="listitem"` on their host, forming a valid list structure. This matches the `vaadin-side-nav` pattern (`<ul role="list">` + items with `role="listitem"`).
- The `overflow` slot holds a dynamically created ellipsis button (created via `SlotController`) that is only visible when overflow occurs.
- The `separator` slot is visually hidden. It holds the developer-provided separator template. The container observes this slot and clones its content to each item's internal separator element.
- When in mobile mode (narrow viewport), the shadow DOM switches to a single back-link template:
  ```html
  <a part="back-link" id="back-link" href="...">
    <span part="back-icon" aria-hidden="true"></span>
    <span part="back-label"><!-- parent item label --></span>
  </a>
  ```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `onNavigate` | `function({path: string, originalEvent: Event}): boolean \| undefined` | `undefined` | No | Callback for router integration. When set, intercepts link clicks, prevents default navigation, and passes the target `path` to the callback. Default navigation is not cancelled when: the click has a modifier key, or the callback returns `false`. See developer-api.md §7. |
| `location` | `any` | `undefined` | No | Router-neutral trigger for re-evaluating which item is current. A change to this property causes all items to re-check their `path` against the browser URL. The value itself is opaque — only the change matters. Follows the `vaadin-side-nav` `location` property pattern. |
| `items` | `Array<{label: string, path?: string, disabled?: boolean}>` | `undefined` | No | Programmatic API for setting breadcrumb items. When set, the component generates `vaadin-breadcrumb-item` elements internally, replacing any declarative children. When `null` or `undefined`, declarative children are used. Both APIs produce the same rendering. See Key Design Decision 2. |

| Slot | Description |
|---|---|
| (default) | `<vaadin-breadcrumb-item>` elements forming the breadcrumb trail. |
| `separator` | Custom separator content. A single element (text, icon, or SVG) placed in this slot is cloned and rendered between each pair of items. When empty, a default chevron separator is used. See developer-api.md §3. |

| Part | Description |
|---|---|
| `list` | The container element wrapping all visible items and the overflow button. |
| `overflow` | The ellipsis button that appears when items overflow. Only present when overflow is active. |
| `back-link` | The single back-navigation link shown in mobile mode. Only present in mobile mode. |
| `back-icon` | The back-arrow icon inside the mobile back link. Only present in mobile mode. |
| `back-label` | The parent item label text inside the mobile back link. Only present in mobile mode. |

| Event | Description |
|---|---|

(No custom events. Navigation is handled via native `<a>` click events and the optional `onNavigate` callback.)

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-gap` | `--vaadin-gap-xs` | Gap between items (including separators). |

| State Attribute | Description |
|---|---|
| `overflow` | Set on the host when items overflow the available width. |
| `mobile` | Set on the host when the viewport is below the mobile threshold. |

#### Internal Behavior

**Item observation.** The container uses a `SlotController` with `{ multiple: true, observe: true }` on the default slot to track child `vaadin-breadcrumb-item` elements. When items are added, removed, or reordered, the container recalculates overflow state and updates separator distribution. This follows the `SideNavChildrenMixin` pattern from `packages/side-nav/src/vaadin-side-nav-children-mixin.js`.

**Separator distribution.** The container uses a `SlotController` on the `separator` slot to observe custom separator content. When custom content is present, it is cloned (via `cloneNode(true)`) and set on each item by calling a protected method on the item (`_setSeparatorNode(node)`). When the separator slot is empty, a default chevron icon is used. Separators are re-distributed whenever items change or the separator slot content changes.

**Overflow detection.** The container uses `ResizeMixin` to observe its own size. On resize, it schedules an overflow calculation (debounced via `microTask`, matching `vaadin-menu-bar`). The calculation compares the total width of all items against the available container width. When overflow is detected:
1. The `overflow` attribute is set on the host.
2. Intermediate items (all except the first and last visible items) are hidden by setting `style.display = 'none'` on the item hosts.
3. The ellipsis overflow button (in the `overflow` slot) becomes visible with the appropriate `order` CSS value to position it between the first and last visible items.
4. Items use CSS `order` property to maintain correct visual sequence within the flex container.

The algorithm keeps the first item and as many trailing items as fit visible, hiding items from the second position onward until the content fits. This matches the behavior described in developer-api.md §4.

**Overflow dropdown.** The ellipsis button has `aria-haspopup="true"` and `aria-expanded` reflecting the dropdown state. Clicking the button or pressing Enter/Space on it opens a dropdown list positioned below the button. The dropdown contains links to the hidden items in their original hierarchical order. Each link in the dropdown navigates using the same mechanism as visible items (plain `<a>` clicks, intercepted by `onNavigate` if set). The dropdown is dismissed by clicking outside, pressing Escape, or activating a link. The dropdown is implemented as an internal lightweight overlay element (not a full `vaadin-overlay`) with `role="list"` and items with `role="listitem"`.

Keyboard interaction for the overflow dropdown:
- **Enter / Space** on the ellipsis button: opens the dropdown and moves focus to the first item.
- **Arrow Down / Arrow Up**: moves focus between dropdown items.
- **Enter** on a dropdown item: activates the link (navigates).
- **Escape**: closes the dropdown and returns focus to the ellipsis button.
- **Tab**: closes the dropdown and moves focus to the next focusable element in the breadcrumb trail.

**Current page detection.** After item observation stabilizes, the container determines the current page:
1. If any item has no `path`, that item is marked as current. (Declarative mechanism — developer-api.md §1.)
2. If all items have `path`, each item compares its `path` against the browser URL using `matchPaths()` from `@vaadin/component-base/src/url-utils.js`. The matching item is marked as current. (URL matching — developer-api.md §6.)
3. Items listen for `popstate`, `vaadin-navigated`, and a `breadcrumb-location-changed` event (dispatched when the container's `location` property changes) to re-evaluate current state. This matches `vaadin-side-nav-item` event listeners.

**Mobile mode.** The container creates a `MediaQueryController` with a max-width media query (default: `(max-width: 640px)`). When the query matches, the `mobile` attribute is set on the host and the template switches to the back-link layout. The back link's `href` is set to the path of the immediate parent item (the last item with a `path` that precedes the current page item). If there is no parent item with a path, the back link is not rendered. Mobile mode takes precedence over overflow mode.

**`onNavigate` interception.** The container adds a click listener on itself. When a click event originates from an `<a>` inside a `vaadin-breadcrumb-item` (or the overflow dropdown) and `onNavigate` is set:
1. Clicks with modifier keys (meta, shift, ctrl) are allowed through (default browser behavior).
2. The `onNavigate` callback is called with `{ path, originalEvent }`.
3. If the callback does not return `false`, `event.preventDefault()` is called to suppress default navigation.
This matches the `vaadin-side-nav` `__onClick` handler pattern.

**`items` property.** When `items` is set to a non-null array:
1. Any previously generated items are removed.
2. For each object in the array, a `vaadin-breadcrumb-item` is created with `path` and `disabled` properties set, and `textContent` set to `label`.
3. Generated items are appended to the host's light DOM.
4. When `items` is set to `null` or `undefined`, generated items are removed and declarative children resume control.

---

**`<vaadin-breadcrumb-item>`** — Individual breadcrumb item

Mixin chain:
```
DisabledMixin(
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

Shadow DOM (when item is a navigable link — has `path`, not `current`, not `disabled`):
```html
<span part="separator" aria-hidden="true">
  <!-- default chevron or cloned custom separator -->
</span>
<a part="link" href="${this.path}">
  <slot></slot>
</a>
```

Shadow DOM (when item is the current page — `current` is true):
```html
<span part="separator" aria-hidden="true">
  <!-- default chevron or cloned custom separator -->
</span>
<span part="link" aria-current="page">
  <slot></slot>
</span>
```

Shadow DOM (when item is disabled — `disabled` is true, regardless of `path`):
```html
<span part="separator" aria-hidden="true">
  <!-- default chevron or cloned custom separator -->
</span>
<span part="link">
  <slot></slot>
</span>
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `path` | `string \| null` | `null` | No | The URL to navigate to when the item is activated. When set and the item is not current or disabled, the item renders as an `<a>` link. When `null`, the item is treated as the current page (non-navigable). Maps to the `href` attribute on the rendered `<a>` element. |
| `disabled` | `boolean` | `false` | Yes | When true, the item renders as plain text instead of a link, even if `path` is set. The `path` value is retained so the item can be re-enabled. Provided by `DisabledMixin`. See developer-api.md §10. |
| `current` | `boolean` | `false` | Yes (read-only) | Whether this item represents the current page. Set automatically by the container: either because the item has no `path` (declarative) or because the item's `path` matches the browser URL (URL matching). When `true`, the item renders as non-interactive text with `aria-current="page"`. Read-only — set internally via `_setCurrent()`. |

| Slot | Description |
|---|---|
| (default) | The text label of the breadcrumb item. |

| Part | Description |
|---|---|
| `separator` | The separator element preceding this item. Hidden on the first item via CSS (`:host(:first-of-type) [part="separator"]`). Styled by the theme to display a chevron or custom content. |
| `link` | The navigable link or current-page text element. Renders as `<a>` for active links, `<span>` for current page or disabled items. |

| Event | Description |
|---|---|

(No custom events. Navigation uses native `<a>` click behavior.)

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-item-text-color` | `--vaadin-text-color` | Text color for link items. |
| `--vaadin-breadcrumb-item-current-text-color` | `--vaadin-text-color` | Text color for the current page item. |
| `--vaadin-breadcrumb-item-disabled-text-color` | `--vaadin-disabled-text-color` | Text color for disabled items. |
| `--vaadin-breadcrumb-item-separator-color` | `--vaadin-text-color-secondary` | Color of the separator symbol. |

| State Attribute | Description |
|---|---|
| `disabled` | Set when the item is disabled. Provided by `DisabledMixin`. |
| `current` | Set when the item is the current page. |
| `has-tooltip` | Set when the item has a slotted tooltip (for truncated labels). |

#### Internal Behavior

**ARIA role.** Each item sets `role="listitem"` on its host in `firstUpdated()`, forming a valid list structure with the container's `role="list"` element. This follows the `vaadin-side-nav-item` pattern.

**Link vs text rendering.** The `render()` method conditionally renders the content element:
- `<a part="link" href="..." tabindex="0">` when `path` is set, `current` is false, and `disabled` is false.
- `<span part="link" aria-current="page">` when `current` is true.
- `<span part="link">` when `disabled` is true or `path` is null and not current.

The `<a>` element is a standard HTML link — keyboard activation (Enter), middle-click, right-click context menu, and screen reader link semantics all work natively.

**Separator element.** The separator `<span>` is always rendered in shadow DOM. Its content is either a default chevron icon or a cloned node provided by the container via `_setSeparatorNode(node)`. The first item's separator is hidden using the CSS rule `:host(:first-of-type) [part="separator"] { display: none; }`.

**Current page detection (item-level).** The item provides a `_setCurrent(value)` protected method (read-only property pattern matching `vaadin-side-nav-item`). The container calls this method during current-page evaluation. Additionally, the item performs its own URL matching in `connectedCallback` and in response to `popstate`, `vaadin-navigated`, and `breadcrumb-location-changed` events, using `matchPaths()` from `url-utils.js`.

**Label truncation and tooltip.** Items apply CSS `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` on the link/text element with a max-width derived from available space. When text is truncated, a tooltip showing the full label appears on hover or focus. The item uses `TooltipController` from `@vaadin/component-base/src/tooltip-controller.js` to support a slotted `<vaadin-tooltip>` element, following the same pattern as `vaadin-side-nav-item`. The tooltip target is set to the link element. Truncation is automatic via CSS; no property is needed (developer-api.md §5).

**RTL support.** The item's shadow DOM uses logical CSS properties (`inline-start`, `inline-end`) for layout. The separator content is mirrored in RTL mode using `transform: scaleX(-1)` on the default chevron icon (or inherited direction for text separators). This matches standard web platform RTL behavior (developer-api.md §11, requirement 14).

---

## Reuse and Proposed Adjustments to Existing Modules

1. **`matchPaths()` from `@vaadin/component-base/src/url-utils.js`** — Reused directly, no changes needed. The breadcrumb item uses the same URL matching logic as `vaadin-side-nav-item` to compare `path` against the browser URL. No `matchNested` option is needed for breadcrumb (default `false` is sufficient).

2. **`location` facade pattern from `packages/side-nav/src/location.js`** — The breadcrumb item needs the same `document.location` facade for testability. Rather than duplicating the file, the breadcrumb package should import and reuse it. **Proposed adjustment:** Move `location.js` from `packages/side-nav/src/` to `packages/component-base/src/` so both `vaadin-side-nav-item` and `vaadin-breadcrumb-item` (and future navigation components) can import it from the shared package. This is a file move with import path updates.
   - **Affected components:** `vaadin-side-nav-item` (import path change only, no behavioral change).

3. **`SlotController` from `@vaadin/component-base/src/slot-controller.js`** — Reused directly for observing the default slot (items) and the `separator` slot. No changes needed.

4. **`ResizeMixin` from `@vaadin/component-base/src/resize-mixin.js`** — Reused directly for overflow detection on the container. No changes needed.

5. **`MediaQueryController` from `@vaadin/component-base/src/media-query-controller.js`** — Reused directly for mobile viewport detection. No changes needed.

6. **`TooltipController` from `@vaadin/component-base/src/tooltip-controller.js`** — Reused directly for truncated label tooltips on items. No changes needed.

7. **`DisabledMixin` from `@vaadin/a11y-base/src/disabled-mixin.js`** — Reused directly on the item element. No changes needed.
