# Breadcrumb Web Component Specification

<!--
Full implementation specification derived from developer-api.md, grounded in the actual source code of the vaadin/web-components monorepo.

Naming and structural conventions follow vaadin-side-nav (path attribute, current state, slot="prefix", onNavigate/location, i18n, role="navigation" landmark) and vaadin-menu-bar (overflow detection via ResizeMixin, ellipsis overflow button, reverseCollapse).
-->

> This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.breadcrumbComponent = true`

## Key Design Decisions

1. **Mixin chain follows SideNav pattern with ResizeMixin for overflow.** The breadcrumb is a navigational landmark like SideNav, so it shares `FocusMixin`, `ElementMixin`, `ThemableMixin`, `PolylitMixin`, `LumoInjectionMixin`. It also needs `ResizeMixin` (from `component-base`) for automatic overflow detection — the same mechanism `vaadin-menu-bar` uses (see developer-api.md §9). The I18nMixin (from `component-base`) provides the partial-update `i18n` property pattern established by menu-bar and side-nav.

2. **`current` is writable (not read-only) on `<vaadin-breadcrumb-item>`, diverging from SideNavItem.** SideNavItem's `current` is `readOnly: true` because SideNav auto-computes it from `location` + `path`. The breadcrumb `current` attribute is author-controlled: the application marks the last item explicitly (see developer-api.md §1) or lets the `location` property do it. When `location` is set, the component computes `current` automatically; when it is not, the attribute is the only mechanism. Making it writable avoids forcing every usage to supply a `location` value.

3. **`items` property creates/replaces light-DOM children (developer-api.md §4).** Setting `breadcrumb.items = [...]` creates `<vaadin-breadcrumb-item>` children in the light DOM, matching the pattern where declarative and programmatic forms produce the same DOM. This differs from menu-bar's pure data-driven model (menu-bar creates buttons in the shadow DOM from items data) but is consistent with the design guidelines' "always offer a declarative API" rule — the items array is a convenience for building the same element tree.

4. **Separator uses a `slot="separator"` on the breadcrumb (developer-api.md §8).** The component clones the slotted separator content between each pair of items during rendering. When no separator is slotted, the component renders a default directional chevron (Lumo's `angle-right` / Aura's equivalent). The separator element is generated inside the shadow DOM and is `aria-hidden="true"`. The default separator auto-mirrors in RTL (CSS `transform: scaleX(-1)` on `:host([dir="rtl"])` or a logical equivalent).

5. **Overflow uses the menu-bar collapse-from-start pattern (developer-api.md §9, requirements 11–14).** Items collapse one at a time starting from the item after the root, toward the current page. The component uses `ResizeMixin._onResize` to trigger overflow recalculation. Hidden items become entries in an overflow menu, rendered using a `<vaadin-popover>` attached to the ellipsis button. When the root must also collapse, the ellipsis stands alone at the start. The current item never collapses; if it does not fit, its label truncates with CSS `text-overflow: ellipsis`. Menu-bar's `reverseCollapse` flag already implements start-side collapsing; the breadcrumb's overflow logic follows the same algorithmic structure.

6. **`onNavigate` and `location` mirror SideNav exactly (developer-api.md §2).** `onNavigate` is a callback property (`attribute: false`); `location` is an opaque change-trigger. Both work identically to `vaadin-side-nav`, ensuring developers who already wire SideNav into a router can wire breadcrumb the same way.

7. **No dedicated mobile back-link mode.** Per the requirements Discussion, mobile and desktop share the same overflow mechanism. At the narrowest widths, only the current item (possibly truncated) and the overflow ellipsis remain — functionally equivalent to a back link but with access to all collapsed ancestors.

8. **Accessibility: `<nav>` with `aria-label`, items in `<ol>`, `aria-current="page"`.** The breadcrumb renders a `<nav>` element (the landmark) in its shadow DOM, containing an `<ol>` (ordered list) of `<li>` wrappers for each slotted item. This matches the WAI-ARIA breadcrumb pattern. The `<nav>` gets `aria-label` from `i18n.navigationLabel` (default: `"Breadcrumb"`). Separators are `aria-hidden="true"`. The item with `current` gets `aria-current="page"` on its anchor — identical to SideNavItem.

---

## Implementation

### Elements

**`<vaadin-breadcrumb>`** — Container element (navigation landmark)

Mixin chain:
```
BreadcrumbMixin(
  I18nMixin(defaultI18n,
    ResizeMixin(
      SlotStylesMixin(
        FocusMixin(
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
  )
)
```

Shadow DOM:
```html
<nav part="nav" aria-label="${this.__effectiveI18n.navigationLabel}">
  <ol part="list">
    <!-- For each visible item: -->
    <li part="item-wrapper">
      <slot name="item-${index}"></slot>
      <span part="separator" aria-hidden="true">
        <!-- Clone of slotted separator, or default chevron -->
      </span>
    </li>
    <!-- Overflow control (hidden when no items collapsed): -->
    <li part="overflow-wrapper" ?hidden="${!this._hasOverflow}">
      <button
        part="overflow-button"
        aria-label="${this.__effectiveI18n.overflow}"
        @click="${this.__onOverflowClick}"
      >…</button>
      <span part="separator" aria-hidden="true"><!-- separator clone --></span>
    </li>
    <!-- Remaining visible items after overflow -->
  </ol>
</nav>
<slot></slot>
<slot name="separator"></slot>
```

Note: The `<slot></slot>` (default slot) receives the light-DOM `<vaadin-breadcrumb-item>` children. The component observes slotchange on the default slot to detect item additions/removals, assigns each item to a named slot (`item-0`, `item-1`, ...) for positioning within the `<ol>`, and runs the overflow algorithm on each change.

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `items` | `Array<Object>` | `undefined` | No | Programmatic items array. When set, creates `<vaadin-breadcrumb-item>` children in the light DOM. Each object: `{ text, path, current, prefix }`. |
| `onNavigate` | `Function` | `undefined` | No | Router integration callback. Called when an item link is clicked; same signature as `vaadin-side-nav.onNavigate`. |
| `location` | `any` | `undefined` | No | Opaque change-trigger for current-item highlighting. When set, items re-evaluate their `current` state by matching `path` against the browser URL. Same semantics as `vaadin-side-nav.location`. |
| `i18n` | `Object` | `{ navigationLabel: 'Breadcrumb', overflow: 'Show hidden ancestors' }` | No | Localisable labels. Uses `I18nMixin` for partial-update support. |

| Slot | Description |
|---|---|
| (default) | `<vaadin-breadcrumb-item>` children forming the trail |
| `separator` | Custom separator content cloned between each pair of items. When empty, the default directional chevron is used. |

| Part | Description |
|---|---|
| `nav` | The `<nav>` landmark element |
| `list` | The `<ol>` element containing the trail |
| `separator` | Each separator element between items (repeated) |
| `overflow-button` | The ellipsis button that reveals collapsed items |

| Event | Detail | Description |
|---|---|---|
| `navigate` | `{ item, path, current, originalEvent }` | Fired when a breadcrumb item link is activated. Cancellable. When `onNavigate` is set, the event is not fired (the callback is used instead, matching the SideNav pattern). |

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-gap` | `var(--vaadin-gap-xs)` | Gap between items and separators |
| `--vaadin-breadcrumb-separator-color` | `var(--vaadin-text-color-secondary)` | Color of the separator |

#### Internal Behavior

**Overflow algorithm** (triggered by `_onResize` from `ResizeMixin` and on slotchange):

1. Make all items visible; measure the `<ol>` scrollWidth vs offsetWidth.
2. If no overflow, stop.
3. While the trail overflows:
   a. Collapse the first non-collapsed intermediate item (between root and current). "Collapse" means setting `style.display = 'none'` on its `<li>` wrapper and adding it to the overflow list.
   b. Show the overflow button if not already shown.
4. If still overflowing after all intermediates are collapsed, collapse the root item.
5. If still overflowing (only the current item + overflow button remain), apply `text-overflow: ellipsis` and `overflow: hidden` on the current item's label, and add `title` with the full text.
6. The overflow button's popover lists collapsed items in hierarchy order (root-first). Clicking an item in the popover navigates to it (same as clicking an inline item).

**Separator cloning:**
When the separator slot changes, the component stores a reference to the slotted content. During render, it clones this content into each separator position. When no content is slotted, a default `<span>` with the chevron character is used.

**`items` property behavior:**
When `items` is set, the component removes any existing light-DOM `<vaadin-breadcrumb-item>` children and creates new ones from the array. Each item object maps to element attributes: `text` → text content, `path` → `path` attribute, `current` → `current` attribute, `prefix` → creates a `<vaadin-icon>` in `slot="prefix"` if the value is a string (icon name), or accepts a DOM element. When `items` is set to `null` or `undefined`, programmatic items are cleared but manually-authored light-DOM children are not affected.

**`location` and `current` auto-matching:**
When `location` changes, the component dispatches a `breadcrumb-location-changed` window event (matching SideNav's `side-nav-location-changed` pattern). Each `<vaadin-breadcrumb-item>` listens for this event and for `popstate`, calling `__updateCurrent()` to compare its `path` against the browser URL using the same `matchPaths` utility from `@vaadin/component-base/src/url-utils.js` that SideNavItem uses. The last matching item gets `current = true`; all others get `current = false`.

**`onNavigate` callback:**
Click handling on the breadcrumb container mirrors SideNav's `__onClick`: intercepts clicks on `<a>` elements inside `<vaadin-breadcrumb-item>` shadow roots, skips modified clicks and external links, calls `onNavigate({ path, current, originalEvent })`, and prevents default unless the callback returns `false`.

---

**`<vaadin-breadcrumb-item>`** — Individual trail item

Mixin chain:
```
BreadcrumbItemMixin(
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
<a
  part="link"
  href="${ifDefined(this.path)}"
  aria-current="${this.current ? 'page' : 'false'}"
  tabindex="${this.path == null ? '-1' : '0'}"
>
  <slot name="prefix"></slot>
  <slot></slot>
</a>
```

When `path` is not set, the `<a>` has no `href` and `tabindex="-1"`, rendering it as non-clickable plain text (requirement 8). The anchor is always present for consistent structure; its visual style changes based on whether `href` is present.

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `path` | `String` | `undefined` | Yes | Navigation target URL. When set, the item renders as a link. When absent, the item is non-clickable text. |
| `current` | `Boolean` | `false` | Yes | Marks this item as the user's current location. The last item in the trail typically has this set. Adds `aria-current="page"` to the anchor. |

| Slot | Description |
|---|---|
| (default) | Text label of the breadcrumb item |
| `prefix` | Content before the label (typically an icon). Follows the same `slot="prefix"` convention as `vaadin-side-nav-item`. |

| Part | Description |
|---|---|
| `link` | The `<a>` element (present whether or not `path` is set) |

| Event | Detail | Description |
|---|---|---|
| (none) | — | Navigation events are handled at the `<vaadin-breadcrumb>` level |

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-breadcrumb-item-text-color` | `var(--vaadin-text-color)` | Text color of ancestor items |
| `--vaadin-breadcrumb-item-current-text-color` | `var(--vaadin-text-color)` | Text color of the current item |
| `--vaadin-breadcrumb-item-hover-text-color` | `var(--vaadin-text-color-accent)` | Text color on hover for linked items |

#### State Attributes

| Attribute | On Element | Description |
|---|---|---|
| `current` | `<vaadin-breadcrumb-item>` | Present when the item represents the current page |
| `has-path` | `<vaadin-breadcrumb-item>` | Present when the item has a `path` (is a link) — derived in `updated()` from `this.path != null` |
| `overflow` | `<vaadin-breadcrumb>` | Present when one or more items are collapsed |

---

## Reuse and Proposed Adjustments to Existing Modules

1. **`@vaadin/component-base/src/url-utils.js` — `matchPaths()`** — Used as-is. The same path-matching utility that `vaadin-side-nav-item` uses to compare item paths against the browser URL. No modification needed.

2. **`@vaadin/component-base/src/resize-mixin.js` — `ResizeMixin`** — Used as-is. Provides the `_onResize` callback that triggers overflow recalculation. Menu-bar already uses this for the same purpose. No modification needed.

3. **`@vaadin/component-base/src/i18n-mixin.js` — `I18nMixin`** — Used as-is. Provides the partial-update `i18n` property pattern with default merging. The breadcrumb passes its own defaults (`{ navigationLabel: 'Breadcrumb', overflow: 'Show hidden ancestors' }`). No modification needed.

4. **`@vaadin/component-base/src/slot-styles-mixin.js` — `SlotStylesMixin`** — Used as-is. Needed for injecting styles into the light DOM for slotted items, same as SideNav. No modification needed.

5. **`@vaadin/popover`** — Used as-is for the overflow menu. When the overflow button is clicked, a `<vaadin-popover>` opens listing the collapsed items. This reuses the existing overlay infrastructure rather than building a custom dropdown. The popover contains a list of links matching the collapsed items.
