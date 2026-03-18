# Master-Detail Layout — CSS Grid Architecture

## 4-Column Grid System

The grid uses **4 column tracks** with named lines. Each logical column (master, detail) has a **size track** + an **extra track**:

```
[master-start] <master-size> <master-extra> [detail-start] <detail-size> <detail-extra> [detail-end]
```

CSS custom properties:

- `--_master-column: var(--_master-size) 0` — default: fixed size + 0 extra
- `--_detail-column: var(--_detail-size) 0` — default: fixed size + 0 extra
- `--_master-size` / `--_detail-size` — default to `30em` / `15em` in `:host`; overridden from JS when `masterSize`/`detailSize` properties are set

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

### Default sizes

`--_master-size` and `--_detail-size` default to `30em` and `15em` respectively in `:host`. When `masterSize`/`detailSize` properties are set, JS overrides these CSS custom properties. When cleared, JS removes the inline style and the defaults apply again.

## Overflow Detection

`__checkOverflow()` reads the first 3 of the 4 computed track sizes: `[masterSize, masterExtra, detailSize]`. The 4th (detail extra) is 0 in overflow scenarios.

**No overflow** when either:

- `Math.floor(masterSize + masterExtra + detailSize) <= Math.floor(hostSize)` (tracks fit; flooring prevents false overflow from sub-pixel track sizes)
- `masterExtra >= detailSize` (master's extra space can absorb the detail)

The `>=` (not `>`) is intentional: when `preserve-master-width` or `:not([has-detail])` is active, CSS `calc(100% - masterSize)` inflates the master extra track. With this inflation, `masterExtra >= detailSize` is equivalent to `hostSize >= masterSize + detailSize` — the correct no-overflow check. Strict `>` would miss the boundary case where they're equal.

### Read/write separation

Layout detection is split into two methods to avoid forced reflows:

- **`__computeLayoutState()`** — pure reads: `checkVisibility()`, `getComputedStyle()`, `getFocusableElements()`. Called in the ResizeObserver callback where layout is already computed — no forced reflow.
- **`__applyLayoutState(state)`** — pure writes: toggles `has-detail`, `overflow`, `preserve-master-width`; calls `requestUpdate()` for ARIA; focuses detail. No DOM/style reads.

### ResizeObserver

- **Observes**: host + shadow DOM parts (`master`, `detail`) + direct slotted children (`:scope >` prevents observing nested descendants)
- ResizeObserver callback: calls `__computeLayoutState()` (read), cancels any pending rAF via `cancelAnimationFrame`, then defers `__applyLayoutState()` (write) via `requestAnimationFrame`. Cancelling ensures the write phase always uses the latest state when multiple callbacks fire per frame.
- **Property observers** (`masterSize`/`detailSize`) only update CSS custom properties — ResizeObserver picks up the resulting size changes automatically

### View transitions

`_finishTransition()` uses `queueMicrotask` to call both `__computeLayoutState()` + `__applyLayoutState()` synchronously. The microtask runs before the Promise resolution propagates to `startViewTransition`, ensuring the "new" snapshot captures the correct overlay state (backdrop, absolute positioning). The `getComputedStyle` read in the microtask does cause a forced reflow, but this is unavoidable for correct transition snapshots.

## Overlay Modes

When `overflow` AND `has-detail` are both set, the detail becomes an overlay:

- `position: absolute; grid-column: none` removes detail from grid flow
- Backdrop becomes visible
- `overlaySize` (CSS custom property `--_overlay-size`) controls overlay dimensions; falls back to `--_detail-size`
- `overlayContainment` (`layout`/`viewport`) controls positioning: `absolute` vs `fixed`
- ARIA: `role="dialog"` on detail, `inert` on master (layout containment), `aria-modal` (viewport containment)

### Overlay positioning

| Orientation | Default                                              | `overlayContainment='viewport'` |
| ----------- | ---------------------------------------------------- | ------------------------------- |
| Horizontal  | `width: overlaySize/detailSize; inset-inline-end: 0` | `position: fixed`               |
| Vertical    | `height: overlaySize/detailSize; inset-block-end: 0` | `position: fixed`               |

Setting `overlaySize` to `100%` makes the detail cover the full layout (replaces old "full" mode).

## preserve-master-width

Prevents the master from jumping when the detail overlay first appears.

**Problem**: When detail appears with overflow, the detail becomes absolute (out of grid flow). The master's `1fr` extra track expands since the detail's `1fr` is gone, causing a visual jump.

**Solution**: Replace `1fr` with `calc(100% - masterSize)` to keep the master at full host width. Same rule applies when `has-detail` is not set.

```css
:host([expand='both']:is(:not([has-detail]), [preserve-master-width])),
:host([expand='master']:is(:not([has-detail]), [preserve-master-width])) {
  --_master-column: var(--_master-size) calc(100% - var(--_master-size));
}
```

Set when detail first appears with overflow, cleared when detail is removed or overflow resolves.

## View Transitions

Uses the CSS View Transitions API (`document.startViewTransition`):

- `_setDetail(element, skipTransition)` — adds/replaces/removes detail with animation
- `_startTransition(transitionType, updateCallback)` — starts a named transition
- `_finishTransition()` — calls `__computeLayoutState()` + `__applyLayoutState()` via `queueMicrotask` (see read/write separation above)
- `noAnimation` property disables transitions
- Styles injected via `SlotStylesMixin`

## Test Patterns

- **`onceResized(layout)`** (`test/helpers.js`): `nextResize()` + `nextRender()` — waits for ResizeObserver + rAF write phase in `__onResize()`
- **Split mode sizing**: measure part elements directly (not `gridTemplateColumns` which has 4 columns)
- **Vertical tests**: integrated into each test file under `describe('vertical')` suites
- **Feature flag**: `window.Vaadin.featureFlags.masterDetailLayoutComponent = true` required before import
