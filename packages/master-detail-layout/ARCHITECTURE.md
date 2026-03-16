# Master-Detail Layout — CSS Grid Architecture

## 4-Column Grid System

The grid uses **4 column tracks** with named lines. Each logical column (master, detail) has a **size track** + an **extra track**:

```
[master-start] <master-size> <master-extra> [detail-start] <detail-size> <detail-extra> [detail-end]
```

CSS custom properties:

- `--_master-column: var(--_master-size) 0` — default: fixed size + 0 extra
- `--_detail-column: var(--_detail-size) 0` — default: fixed size + 0 extra
- `--_master-size` / `--_detail-size` — set from JS when `masterSize`/`detailSize` properties change

Parts use **named grid lines** for placement:

- Master spans `master-start / detail-start` (size + extra)
- Detail spans `detail-start / detail-end` (size + extra)

### Expand modes

The `expand` attribute controls which extra track(s) become `1fr`:

| `expand` | `--_master-column` | `--_detail-column` |
| -------- | ------------------ | ------------------ |
| (none)   | `size 0`           | `size 0`           |
| `both`   | `size 1fr`         | `size 1fr`         |
| `master` | `size 1fr`         | `size 0`           |
| `detail` | `size 0`           | `size 1fr`         |

### Vertical orientation

In vertical mode, `grid-template-rows` replaces `grid-template-columns` using the same named lines and variables. Parts switch from `grid-column` to `grid-row` placement.

### No sizes set

When `masterSize`/`detailSize` are not set, the grid template becomes invalid and falls back to auto implicit columns. **Both sizes must be explicitly set for reliable layout.**

## Overflow Detection

`__checkOverflow()` reads the first 3 of the 4 computed track sizes: `[masterSize, masterExtra, detailSize]`. The 4th (detail extra) is 0 in overflow scenarios.

**No overflow** when either:

- `masterSize + masterExtra + detailSize <= hostSize` (tracks fit)
- `masterExtra >= detailSize` (master's extra space can absorb the detail)

The `>=` (not `>`) is intentional: when `preserve-master-width` or `:not([has-detail])` is active, CSS `calc(100% - masterSize)` inflates the master extra track. With this inflation, `masterExtra >= detailSize` is equivalent to `hostSize >= masterSize + detailSize` — the correct no-overflow check. Strict `>` would miss the boundary case where they're equal.

### `__onResize()` pattern

All DOM/style reads happen first, then all writes (no forced reflows):

1. **Read**: save previous `has-detail`, compute detail visibility, check overflow
2. **Write**: set/clear `preserve-master-width`, toggle `has-detail` and `overflow`, call `requestUpdate()` for ARIA, focus detail if it just appeared in overlay

### ResizeObserver + Debouncer

- **Observes**: host + slotted light DOM children (NOT shadow DOM parts — avoids ResizeObserver loop at same DOM depth)
- **`Debouncer(animationFrame)`** defers `__onResize()` to the next rAF. Both ResizeObserver and property observers use the same debouncer via `__scheduleResize()`
- **Property observers call `__scheduleResize()`** because size changes with `preserve-master-width` may not resize any observed element
- **Slotchange debouncing**: `queueMicrotask` batches multiple slot changes into one `__initResizeObserver()` call

## Overlay Modes

When `overflow` AND `has-detail` are both set, the detail becomes an overlay:

- `position: absolute; grid-column: none` removes detail from grid flow
- Backdrop becomes visible
- `detailOverlayMode` controls style via `^=`/`$=` CSS selectors (`drawer`/`full`/`*-viewport`)
- ARIA: `role="dialog"` on detail, `inert` on master (layout containment), `aria-modal` (viewport containment)

### Overlay positioning

| Orientation | Drawer                                   | Full       | \*-viewport       |
| ----------- | ---------------------------------------- | ---------- | ----------------- |
| Horizontal  | `width: detailSize; inset-inline-end: 0` | `inset: 0` | `position: fixed` |
| Vertical    | `height: detailSize; inset-block-end: 0` | `inset: 0` | `position: fixed` |

## preserve-master-width

Prevents the master from jumping when the detail overlay first appears.

**Problem**: When detail appears with overflow, the detail becomes absolute (out of grid flow). The master's `1fr` extra track expands since the detail's `1fr` is gone, causing a visual jump.

**Solution**: Replace `1fr` with `calc(100% - masterSize)` to keep the master at full host width. Same rule applies when `has-detail` is not set.

```css
:host([expand='both']:is(:not([has-detail]), [preserve-master-width])) {
  --_master-column: var(--_master-size) calc(100% - var(--_master-size));
}
```

Set when detail first appears with overflow, cleared when detail is removed or overflow resolves.

## View Transitions

Uses the CSS View Transitions API:

- `_setDetail(element, skipTransition)` — adds/replaces/removes detail with animation
- `_startTransition(transitionType, updateCallback)` — starts a named transition
- `_finishTransition()` — resolves the transition, calls `__scheduleResize()`
- `noAnimation` property disables transitions
- Styles injected via `SlotStylesMixin`

## Test Patterns

- **`onceResized(layout)`** (`test/helpers.js`): `nextResize()` + `nextRender()` — waits for ResizeObserver + rAF-debounced `__onResize()`
- **Split mode sizing**: measure part elements directly (not `gridTemplateColumns` which has 4 columns)
- **Vertical tests**: integrated into each test file under `describe('vertical')` suites
- **Feature flag**: `window.Vaadin.featureFlags.masterDetailLayoutComponent = true` required before import
