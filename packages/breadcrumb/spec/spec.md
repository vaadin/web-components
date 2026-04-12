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

1. **Use `path` instead of `href` on breadcrumb items** — developer-api.md §1 proposes `href` as the navigation attribute, citing standard HTML and external design systems (Shoelace, React Aria). However, the existing `vaadin-side-nav-item` component uses `path` for the same purpose (the value maps to the `href` on the internal `<a>` element). The `WEB_COMPONENT_GUIDELINES.md` API Design section also shows `path` in its own breadcrumb example. Using `path` maintains naming consistency within the Vaadin component library and aligns with the router-agnostic principle where `path` represents a location in the application hierarchy rather than a raw URL. The internal `<a>` element still receives the `path` value as its `href`.

2. **Container manages `current` state, not items individually** — In `vaadin-side-nav`, each item independently evaluates its `current` state via `matchPaths()`. For breadcrumb, the container manages `current` centrally because: (a) only one item can be current, (b) the "item without `path` is the current page" heuristic is container-level logic, and (c) the container already observes all items. The `current` property on the item is read-only, set by the container via `_setCurrent()`.

3. **Each item renders its own separator** — Rather than the container inserting separators between slotted items (which is not possible across slot boundaries), each `<vaadin-breadcrumb-item>` renders a separator region in its own shadow DOM. The container distributes custom separator content (from the `separator` slot, see developer-api.md §3) to each item via a protected property. The first item's separator is hidden by the container setting a `first` attribute.

4. **Overflow button positioned via CSS `order`** — The overflow button lives in the container's shadow DOM. Since slotted items and shadow DOM elements are all flex children of the list container, CSS `order` controls visual ordering: the first item gets `order: 0`, the overflow button gets `order: 1`, and visible trailing items get `order: 2`. Hidden items get `display: none` via `::slotted([overflow-hidden])`. This avoids modifying light DOM structure.

5. **Internal overlay element for overflow dropdown** — The overflow dropdown (developer-api.md §4) uses a `<vaadin-breadcrumb-overlay>` internal element, following the established Vaadin overlay pattern (`PositionMixin` + `OverlayMixin`). This is consistent with how `vaadin-menu-bar` and `vaadin-combo-box` handle dropdowns.

6. **Mobile back-link is a separate render path** — When the container is too narrow to show even the first item, overflow button, and last item, the component switches to mobile mode (developer-api.md §8). Instead of rearranging items, the container renders a shadow DOM `<a>` back-link pointing to the parent (second-to-last item with a `path`). A `[mobile]` attribute on the host enables theme-specific styling. Items remain in the hidden slot for data access.

7. **`onNavigate` callback follows `vaadin-side-nav` pattern** — developer-api.md §7 proposes `onNavigate({ href })`. The spec uses `onNavigate({ path, current, originalEvent })` to match the side-nav callback shape (adjusted for breadcrumb-relevant fields: no `expanded`, `target`, or `pathAliases`). The callback intercepts clicks on item links and the mobile back-link. Without `onNavigate`, links navigate natively (full page load or SPA router interception).

8. **`location` property triggers current-item re-evaluation** — Following `vaadin-side-nav`, the `location` property is an opaque change trigger. Setting it causes the container to re-evaluate which item is current. The container also listens to `popstate` and `vaadin-navigated` window events for automatic updates, matching the side-nav pattern.

9. **`items` property provides a programmatic API alongside declarative children** — Per `WEB_COMPONENT_GUIDELINES.md` API Design, components whose children are typically data-driven must also offer a programmatic API. When `items` is set, the component generates `<vaadin-breadcrumb-item>` elements in light DOM, replacing any existing generated items. Declarative children and `items` are alternatives — `items` takes precedence when set.

10. **Router-agnostic: plain `<a href>` elements, no router imports** — Per `WEB_COMPONENT_GUIDELINES.md`, the component renders standard `<a>` elements. SPA routers intercept link clicks automatically. The component does not import or call any router. The `onNavigate` callback and `location` property are router-neutral hooks.

11. **Truncation uses CSS with automatic `title` fallback** — developer-api.md §5 proposes automatic truncation with tooltip. Items use CSS `text-overflow: ellipsis` and set the native `title` attribute on the link element when truncation is detected (via `ResizeObserver` comparing `scrollWidth` to `clientWidth`). Items also support a `tooltip` slot for `<vaadin-tooltip>` integration via `TooltipController`, following the `vaadin-side-nav-item` pattern.

12. **RTL handled via `DirMixin` and logical CSS properties** — `ElementMixin` extends `DirMixin`, which propagates the `dir` attribute. All layout uses logical CSS properties (`margin-inline`, `padding-inline`, `flex-direction`). The default chevron separator is mirrored via CSS `scale(-1, 1)` in RTL mode (developer-api.md §11).

---

## Implementation

### Elements

**`<vaadin-breadcrumb>`** — Container element

Mixin chain:
```
Breadcrumb extends
  BreadcrumbMixin(
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
```

Shadow DOM (normal mode):
```html
<div part="list" role="list" id="list">
  <slot id="items"></slot>
  <div id="overflow" role="listitem" hidden>
    <span class="separator" aria-hidden="true">
      <!-- chevron (or cloned custom separator) -->
    </span>
    <button part="overflow-button"
            aria-haspopup="true"
            aria-expanded="false"
            tabindex="0">
      …
    </button>
  </div>
</div>
<div hidden aria-hidden="true">
  <slot name="separator" id="separator-slot"></slot>
</div>
```

Shadow DOM (mobile mode — when `[mobile]` attribute is set):
```html
<a part="back-link" id="back-link" href="${parentPath}">
  <span part="back-arrow" aria-hidden="true"></span>
  ${parentLabel}
</a>
<div hidden>
  <slot id="items"></slot>
  <slot name="separator" id="separator-slot"></slot>
</div>
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `onNavigate` | `function(NavigateEvent): boolean \| undefined` | `undefined` | No | Callback for SPA routing integration. When set, intercepts link clicks, prevents default navigation, and passes `{ path, current, originalEvent }` to the callback. If the callback returns `false`, the default action is not prevented. Clicks with modifier keys (`metaKey`, `shiftKey`), clicks on external links, and clicks on `[router-ignore]` items pass through without calling the callback. (Req 8) |
| `location` | `any` | `undefined` | No | Opaque change trigger for current-item re-evaluation. Setting this property causes the component to re-match item paths against the browser URL. The value itself is not inspected. (Req 9) |
| `items` | `Array<{label: string, path?: string, disabled?: boolean}>` | `undefined` | No | Programmatic item definition. When set, generates `<vaadin-breadcrumb-item>` elements in light DOM, replacing any previously generated items. When set to `null` or `undefined`, generated items are removed. (Req 1, 15) |
| `i18n` | `{overflow?: string}` | `{overflow: 'Show more'}` | No | Internationalization object. `overflow` is the accessible label for the overflow button. |

| Slot | Description |
|---|---|
| (default) | `<vaadin-breadcrumb-item>` elements forming the breadcrumb trail. (Req 1) |
| `separator` | Custom separator element. The component clones this element and distributes clones to each item's internal separator region. Accepts any content: text, `<vaadin-icon>`, SVG, etc. When empty, items use the default chevron separator. (Req 5) |

| Part | Description |
|---|---|
| `list` | The flex container (`<div role="list">`) wrapping items and the overflow button. |
| `overflow-button` | The ellipsis button that opens the overflow dropdown menu. |
| `back-link` | The single parent link rendered in mobile mode. |
| `back-arrow` | The back-arrow icon inside the mobile back-link. |

| Event | Description |
|---|---|
| — | No custom events. Navigation is handled via `onNavigate` callback or native link activation. |

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-gap` | `var(--vaadin-gap-xs)` | Spacing between items (including their separators). (Req 4) |
| `--vaadin-breadcrumb-font-size` | `inherit` | Base font size for all items. |
| `--vaadin-breadcrumb-text-color` | `var(--vaadin-text-color)` | Text color for link items. (Req 16) |
| `--vaadin-breadcrumb-current-text-color` | `var(--vaadin-text-color)` | Text color for the current page item. (Req 16) |
| `--vaadin-breadcrumb-separator-color` | `var(--vaadin-text-color-secondary)` | Separator text/icon color. (Req 4) |

#### Internal Behavior

**Child observation (Req 15):**
The container uses a `SlotController` (with `observe: true`, `multiple: true`) on the default slot to track `<vaadin-breadcrumb-item>` children. When items are added, removed, or reordered, the controller triggers a re-render that updates separator distribution, overflow state, and current-item detection.

**Current-item detection (Req 2, 3, 9):**
On item changes and on `popstate` / `vaadin-navigated` window events:
1. If any item has no `path`, that item is the current page. The container calls `item._setCurrent(true)` on it and `_setCurrent(false)` on all others.
2. If all items have a `path`, the container matches each item's `path` against the browser URL using `matchPaths()` from `@vaadin/component-base/src/url-utils.js`. The last matching item becomes current.
3. If no item matches, no item is current (the trail shows only ancestor links — Req 3).
4. Setting the `location` property also triggers re-evaluation.

**Separator distribution (Req 4, 5):**
The container observes the `separator` slot. When a custom separator is present, the container clones it for each item and sets each item's `_customSeparator` property. When the separator slot is empty, items use their default chevron. The container sets a `first` attribute on the first visible item so its separator is hidden (CSS: `:host([first]) [part="separator"] { display: none }`).

**Overflow management (Req 6):**
1. A `ResizeObserver` monitors the list container width and item widths.
2. When items overflow, the algorithm keeps the first item and as many trailing items as fit, collapsing intermediate items.
3. Collapsed items receive an `overflow-hidden` attribute (hidden via `::slotted([overflow-hidden]) { display: none !important }`).
4. The shadow DOM overflow button becomes visible, positioned via CSS `order: 1` between the first item (`order: 0`) and visible trailing items (`order: 2`).
5. Clicking the overflow button opens a `<vaadin-breadcrumb-overlay>` positioned below the button, listing collapsed items as links in hierarchical order.
6. The overlay uses `role="menu"` with `<a role="menuitem">` entries. Arrow keys navigate items, Escape closes the menu, Enter activates a link.
7. On close, focus returns to the overflow button.

**Mobile mode (Req 10):**
1. When the container is too narrow to display even the first item, overflow button, and last item, the component switches to mobile mode.
2. The host receives a `[mobile]` attribute.
3. The shadow DOM switches to the mobile render path: a single `<a part="back-link">` pointing to the parent item (the last item with a `path` that is not the current page).
4. The back-link displays a back-arrow icon followed by the parent item's label.
5. If `onNavigate` is set, clicks on the back-link are intercepted via the same callback mechanism.

**`onNavigate` click handling (Req 8):**
The container listens for `click` events. When `onNavigate` is set:
1. The handler finds the clicked `<vaadin-breadcrumb-item>` and its internal `<a>` via `composedPath()`.
2. Clicks with modifier keys (`metaKey`, `shiftKey`) pass through (allow "open in new tab").
3. Clicks on external links (different origin) pass through.
4. Clicks on items with `[router-ignore]` pass through.
5. Otherwise, `onNavigate({ path, current, originalEvent })` is called and `preventDefault()` is invoked unless the callback returns `false`.
6. The same logic applies to clicks on overflow menu links and the mobile back-link.

**`items` property (Req 1, 15):**
When `items` is set:
1. Previously generated items (identified by `[data-breadcrumb-generated]` attribute) are removed from light DOM.
2. For each entry in the array, a `<vaadin-breadcrumb-item>` is created with `path`, `disabled`, `textContent` set from the entry, and `data-breadcrumb-generated` attribute.
3. Generated items are appended to the host's light DOM.
4. When `items` is set to `null` or `undefined`, generated items are removed.

**Accessibility (Req 11, 12):**
- The host receives `role="navigation"` and `aria-label="Breadcrumb"` in `firstUpdated()` if not already set by the developer. The developer can override `aria-label` for disambiguation.
- The list container has `role="list"`.
- Separators and the separator slot are `aria-hidden="true"`.
- The overflow button has `aria-haspopup="true"` and `aria-expanded` reflecting the menu state.
- The overflow button's accessible label comes from `i18n.overflow`.

---

**`<vaadin-breadcrumb-item>`** — Individual breadcrumb item

Mixin chain:
```
BreadcrumbItem extends
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

Shadow DOM:
```html
<span part="separator" aria-hidden="true" id="separator">
  <!-- Default chevron character or custom separator node -->
</span>
<a part="link" id="link"
   href="${ifDefined(effectiveHref)}"
   tabindex="${effectiveTabindex}"
   aria-current="${current ? 'page' : nothing}">
  <slot></slot>
</a>
<slot name="tooltip"></slot>
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `path` | `String` | `undefined` | No | The navigation target path. Maps to `href` on the internal `<a>` element. When `undefined`, the item is treated as the current page (non-interactive). (Req 1, 2) |
| `disabled` | `Boolean` | `false` | Yes | When `true`, the item renders as plain text (no link), with `aria-disabled="true"`. The `path` is retained so the item can be re-enabled dynamically. Inherited from `DisabledMixin`. (Req 13) |
| `current` | `Boolean` | `false` | Yes (read-only) | Whether this item represents the current page. Set by the container via `_setCurrent()`. When `true`, the link is non-interactive and receives `aria-current="page"`. (Req 2, 9) |

| Slot | Description |
|---|---|
| (default) | The item's text label. (Req 1) |
| `tooltip` | Optional `<vaadin-tooltip>` for enhanced tooltip experience. Managed by `TooltipController`. (Req 7) |

| Part | Description |
|---|---|
| `separator` | The separator region rendered before the item's link. Hidden on the first item. |
| `link` | The `<a>` element. Non-interactive when `current`, `disabled`, or `path` is unset. |

| Event | Description |
|---|---|
| — | No custom events. Navigation is delegated to the native `<a>` element or intercepted by the container's `onNavigate`. |

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-item-max-width` | `12em` | Maximum width before text truncation with ellipsis. (Req 7) |

#### Internal Behavior

**Link rendering (Req 1, 2, 8, 13):**
The item computes an effective `href` and `tabindex`:
- When `path` is set, `disabled` is `false`, and `current` is `false`: `href` = `path`, `tabindex` = `"0"` → interactive link.
- When `current` is `true` (regardless of `path`): no `href`, no `tabindex` → non-interactive text with `aria-current="page"`.
- When `disabled` is `true`: no `href`, `tabindex` = `"-1"`, `aria-disabled="true"` → non-interactive, not focusable.
- When `path` is `undefined`: no `href`, no `tabindex` → non-interactive text.

**Separator rendering (Req 4, 5):**
- The separator region renders a default chevron character (`›`).
- The container may set the protected `_customSeparator` property with a cloned DOM node, which replaces the default chevron.
- When the container sets the `first` attribute on this item, the separator is hidden via CSS.
- In RTL mode (`[dir="rtl"]`), the default chevron is mirrored via `scale(-1, 1)`.

**Truncation and tooltip (Req 7):**
- The link element has `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`, and `max-width: var(--vaadin-breadcrumb-item-max-width, 12em)`.
- A `ResizeObserver` on the link element detects truncation by comparing `scrollWidth` to `clientWidth`. When truncated, the `title` attribute is set to the item's full text content. When not truncated, `title` is removed.
- A `TooltipController` manages an optional `<vaadin-tooltip>` via the `tooltip` slot for an enhanced experience.

**Accessibility (Req 11, 12):**
- `role="listitem"` is set on the host in `firstUpdated()` if not already present.
- `aria-current="page"` is set on the `<a>` element when `current` is `true`.
- `aria-disabled="true"` is set on the host by `DisabledMixin` when `disabled` is `true`.
- The separator has `aria-hidden="true"` to prevent screen readers from announcing it.
- Focusable items (interactive links) participate in the Tab order. Non-interactive items (current, disabled, no path) are removed from the Tab order.

---

**`<vaadin-breadcrumb-overlay>`** — Internal overlay element (not exported)

Used for the overflow dropdown menu. Follows the established Vaadin overlay pattern.

Mixin chain:
```
BreadcrumbOverlay extends
  OverlayMixin(
    PositionMixin(
      DirMixin(
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
```

Shadow DOM:
```html
<div part="overlay" id="overlay">
  <div part="content" id="content" role="menu">
    <slot></slot>
  </div>
</div>
```

Behavior:
- Positioned below the overflow button via `PositionMixin` with `noVerticalOverlap: true`.
- `focusTrap: true` — focus is trapped within the menu while open.
- `restoreFocusOnClose: true` — focus returns to the overflow button on close.
- The container renders `<a role="menuitem">` entries inside the overlay for each collapsed item.
- Disabled collapsed items render as `<span role="menuitem" aria-disabled="true">` (no link).
- Keyboard: Arrow Up/Down navigate items, Escape closes, Enter activates.
- Click outside closes the overlay.

---

## Reuse and Proposed Adjustments to Existing Modules

1. **`matchPaths()` from `@vaadin/component-base/src/url-utils.js`** — Used as-is. The container calls `matchPaths(browserPath, item.path)` to determine which item matches the current URL. No modification needed. Also used by: `vaadin-side-nav-item`.

2. **`DisabledMixin` from `@vaadin/a11y-base/src/disabled-mixin.js`** — Used as-is on `<vaadin-breadcrumb-item>`. Provides `disabled` property, `aria-disabled` management, and click prevention. No modification needed. Also used by: `vaadin-side-nav-item`, field components.

3. **`SlotController` from `@vaadin/component-base/src/slot-controller.js`** — Used as-is. The container creates a `SlotController` with `{ observe: true, multiple: true }` on the default slot to track item additions and removals. No modification needed. Also used by: `vaadin-side-nav`, field-base components.

4. **`TooltipController` from `@vaadin/component-base/src/tooltip-controller.js`** — Used as-is on `<vaadin-breadcrumb-item>` for the optional `tooltip` slot. The controller's target is the item's link element. No modification needed. Also used by: `vaadin-side-nav-item`, `vaadin-tab`.

5. **`MediaQueryController` from `@vaadin/component-base/src/media-query-controller.js`** — Used as-is in the container as a supplementary mechanism for mobile mode detection. The primary mechanism is `ResizeObserver`-based (container width), but `MediaQueryController` can provide an initial hint before layout completes. No modification needed. Also used by: none currently (available for general use).

6. **`SlotStylesMixin` from `@vaadin/component-base/src/slot-styles-mixin.js`** — Used as-is. The container injects styles into the parent scope for: (a) hiding overflow items via `vaadin-breadcrumb-item[overflow-hidden]`, (b) applying CSS `order` values via `vaadin-breadcrumb-item` attribute selectors. No modification needed. Also used by: `vaadin-side-nav`.

7. **`OverlayMixin` and `PositionMixin` from `@vaadin/overlay/src/`** — Used as-is by the internal `<vaadin-breadcrumb-overlay>` element. `PositionMixin` handles dropdown positioning; `OverlayMixin` handles open/close lifecycle, backdrop, and event management. No modification needed. Also used by: `vaadin-combo-box`, `vaadin-menu-bar`, `vaadin-select`, `vaadin-popover`.

8. **`location` facade pattern from `vaadin-side-nav`** — The breadcrumb component creates its own `location.js` facade (identical structure to `packages/side-nav/src/location.js`) for testability. This is a new file in the breadcrumb package, not a modification of side-nav's file. If a shared utility is preferred, the facade could be moved to `@vaadin/component-base`, but this is optional and does not affect side-nav.
