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

### CSS transitions

Detail panel slide animations use CSS transitions on `translate`. The `--_mdl-detail-offscreen` custom property holds the off-screen translate value (horizontal or vertical). CSS rules apply regardless of overflow mode:

- Default: `translate: var(--_mdl-detail-offscreen)` — off-screen
- `:host([has-detail])` overrides to `translate: none` — on-screen
- `:host([transition])` enables the CSS `transition` property (gated so initial render doesn't animate)
- `:host([transition='remove'])` forces translate back to off-screen while `has-detail` is still set

**Add**: `[transition='add']` set (enables transition) → `_finishTransition()` reflow captures off-screen state → `__applyLayoutState()` sets `has-detail` → translate changes → CSS transition plays.

**Remove**: uses a two-step approach because the CSS spec requires the transition property to be active BEFORE the translate change. `[transition='pending']` enables the transition → forced reflow captures `translate:none` → `[transition='remove']` changes translate to off-screen → CSS transition plays. After `transitionend`, the element is removed.

**Replace incoming**: CSS transitions cannot animate within a single frame (the "before" off-screen state was never rendered). The Web Animations branch handles this with `element.animate()`.

**Replace outgoing**: old content moved to `#detail-outgoing` slot, slides out via CSS transition on the outgoing container.

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

**Solution**: Replace `1fr` with `calc(100% - masterSize)` to keep the master at full host width. Same rule applies when `has-detail` is not set. For `expand='detail'`, the same compensation is applied when no detail is present to prevent the detail tracks from reserving space.

```css
:host([expand='both']:is(:not([has-detail]), [preserve-master-width])),
:host([expand='master']:is(:not([has-detail]), [preserve-master-width])),
:host([expand='detail']:not([has-detail])) {
  --_master-column: var(--_master-size) calc(100% - var(--_master-size));
}
```

Set when detail first appears with overflow, cleared when detail is removed or overflow resolves.

## Detail Transitions

Uses CSS transitions on `translate` for interruptible slide animations:

- `_setDetail(element, skipTransition)` — adds/replaces/removes detail with transition
- `_startTransition(transitionType, updateCallback)` — manages transition lifecycle, sets `[transition]` attribute (with `'pending'` → reflow → `'remove'` two-step for remove)
- `_finishTransition()` — forced reflow via `getComputedStyle()` + `__applyLayoutState()` to trigger CSS transition
- `noAnimation` property (reflected to attribute) disables transitions via CSS `:host([no-animation])`
- `#detail-outgoing` shadow DOM container for replace transitions (old content slides out)
- `--_mdl-detail-offscreen` CSS custom property centralizes the off-screen translate value
- Transitions defined in shadow DOM CSS (works inside shadow roots, unlike View Transitions)

## Test Patterns

- **`onceResized(layout)`** (`test/helpers.js`): `nextResize()` + `nextRender()` — waits for ResizeObserver + rAF write phase in `__onResize()`
- **Split mode sizing**: measure part elements directly (not `gridTemplateColumns` which has 4 columns)
- **Vertical tests**: integrated into each test file under `describe('vertical')` suites
- **Feature flag**: `window.Vaadin.featureFlags.masterDetailLayoutComponent = true` required before import
