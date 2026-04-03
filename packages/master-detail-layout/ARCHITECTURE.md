# Master-Detail Layout — CSS Grid Architecture

## 4-Column Grid System

The grid uses **4 column tracks** with named lines. Each logical column (master, detail) has a **size track** + an **extra track**:

```
[master-start] <master-size> <master-extra> [detail-start] <detail-size> <detail-extra> [detail-end]
```

CSS custom properties:

- `--_master-size` — defaults to `30rem`; overridden from JS when `masterSize` is set
- `--_master-extra` — defaults to `0px`; set to `1fr` by expand modes
- `--_detail-size` — resolves to `var(--_detail-cached-size)`, which defaults to `min-content` (auto-sized) or is set from JS when `detailSize` is provided
- `--_detail-extra` — defaults to `0px`; set to `1fr` by expand modes
- `--_detail-cached-size` — the cached intrinsic size of the detail content (see Auto Detail Size)

Parts use **named grid lines** for placement:

- Master spans `master-start / detail-start` (size + extra)
- Detail spans `detail-start / detail-end` (size + extra)

### Expand modes

The `expand` attribute controls which extra track(s) become `1fr`:

| `expand` | `--_master-extra` | `--_detail-extra` |
| -------- | ----------------- | ----------------- |
| (none)   | `0px`             | `0px`             |
| `both`   | `1fr`             | `1fr`             |
| `master` | `1fr`             | `0px`             |
| `detail` | `0px`             | `1fr`             |

### Vertical orientation

In vertical mode, `grid-template-rows` replaces `grid-template-columns` using the same named lines and variables. Parts switch from `grid-column` to `grid-row` placement.

### Default sizes

`--_master-size` defaults to `30rem`. `--_detail-size` resolves to `var(--_detail-cached-size)`, which defaults to `min-content` for auto-sizing. When `masterSize`/`detailSize` properties are set, JS overrides these CSS custom properties. When cleared, JS removes the inline style and the defaults apply again.

## Overflow Detection

The `detectOverflow()` helper reads the first 3 of the 4 computed track sizes: `[masterSize, masterExtra, detailSize]`. The 4th (detail extra) is 0 in overflow scenarios.

**No overflow** when either:

- `Math.floor(masterSize + masterExtra + detailSize) <= Math.floor(hostSize)` (tracks fit; flooring prevents false overflow from sub-pixel track sizes)
- `masterExtra >= detailSize` (master's extra space can absorb the detail)

The `>=` (not `>`) is intentional: when `keep-detail-column-offscreen` or `:not([has-detail])` is active, CSS `calc(100% - masterSize)` inflates the master extra track. With this inflation, `masterExtra >= detailSize` is equivalent to `hostSize >= masterSize + detailSize` — the correct no-overflow check. Strict `>` would miss the boundary case where they're equal.

### Read/write separation

Layout detection is split into two methods to avoid forced reflows:

- **`__readLayoutState()`** — pure reads: `checkVisibility()`, `getComputedStyle()`, `getFocusableElements()`. Called in the ResizeObserver callback where layout is already computed — no forced reflow. Also returns `hostSize` and `trackSizes` for overflow detection and auto-size caching.
- **`__writeLayoutState(state)`** — pure writes: toggles `has-detail`, `overlay`, `keep-detail-column-offscreen`; caches intrinsic detail size; calls `requestUpdate()` for ARIA; focuses detail. No DOM/style reads.

### ResizeObserver

- **Observes**: host + shadow DOM parts (`master`, `detail`) + direct slotted children (`:scope >` prevents observing nested descendants)
- ResizeObserver callback: calls `__readLayoutState()` (read), cancels any pending rAF via `cancelAnimationFrame`, then defers `__writeLayoutState()` (write) via `requestAnimationFrame`. Cancelling ensures the write phase always uses the latest state when multiple callbacks fire per frame.
- **Property observers** (`masterSize`/`detailSize`) only update CSS custom properties — ResizeObserver picks up the resulting size changes automatically

### Stale rAF safety

The only code paths that modify layout attributes (`has-detail`, `overlay`, etc.) are `__writeLayoutState` (called by the rAF itself or by `recalculateLayout`) and `recalculateLayout` (which always starts with `cancelAnimationFrame`). A pending rAF that isn't cancelled simply re-applies the same state it read — an idempotent no-op. The `cancelAnimationFrame` in `recalculateLayout` prevents stale rAFs from overwriting freshly computed state after transitions or property changes.

## Auto Detail Size

When `detailSize` is not explicitly set, the detail column size is determined automatically from the detail content's intrinsic size using `min-content`.

### How it works

The detail column uses `--_detail-size: var(--_detail-cached-size)` with `--_detail-cached-size` defaulting to `min-content`. On first render the browser sizes the column to the content's intrinsic width. The write phase then caches that measurement as a fixed pixel value in `--_detail-cached-size`, keeping the column stable across overlay transitions and re-renders. The cache is cleared when the detail is removed so the next detail is measured fresh.

### `recalculateLayout()`

Re-measures the intrinsic size by clearing the cache and temporarily placing the detail back into a `min-content` grid column (via the `recalculating-detail-size` attribute, which also disables `1fr` expansion to avoid distorting the measurement). Propagates to ancestor auto-sized layouts so nested layouts re-measure correctly.

Called when `masterSize`/`detailSize` change after initial render and after detail transitions. The property observers skip the call on the initial set (`oldSize != null` guard) to avoid a redundant synchronous recalculation — the ResizeObserver handles the first measurement.

## Overlay Modes

When `overlay` AND `has-detail` are both set, the detail becomes an overlay:

- `position: absolute; grid-column: none` removes detail from grid flow
- Backdrop becomes visible (`opacity: 1`, `pointer-events: auto`)
- `overlaySize` (CSS custom property `--_overlay-size`) controls overlay dimensions; falls back to `--_detail-size`
- `overlayContainment` (`layout`/`viewport`) controls positioning: `absolute` vs `fixed`
- ARIA: `role="dialog"` on detail, `inert` on master (layout containment), `aria-modal` (viewport containment)

### Overlay positioning

| Orientation | Default                                              | `overlayContainment='viewport'` |
| ----------- | ---------------------------------------------------- | ------------------------------- |
| Horizontal  | `width: overlaySize/detailSize; inset-inline-end: 0` | `position: fixed`               |
| Vertical    | `height: overlaySize/detailSize; inset-block-end: 0` | `position: fixed`               |

Setting `overlaySize` to `100%` makes the detail cover the full layout (replaces old "full" mode).

## Detail Placeholder

The `detail-placeholder` slot shows content in the detail area when no detail is open (e.g. "Select an item"). It occupies the same grid tracks as the detail and receives the same border styling.

Visible only when a placeholder element is slotted, no detail is present, and there is no overlay. Uses `visibility: hidden/visible` (not `display: none/block`) so it always participates in grid sizing:

```css
#detail-placeholder {
  visibility: hidden;
}

:host([has-detail-placeholder]:not([has-detail], [overlay])) #detail-placeholder {
  visibility: visible;
}
```

The placeholder is included in overflow detection — without it, a layout with only a placeholder would never check for overflow and the offscreen trick below would not apply. When the placeholder is present with overlay, the master extra track is inflated to keep the master full-width (same rule as `keep-detail-column-offscreen`).

## keep-detail-column-offscreen

Prevents the master from jumping when the detail overlay first appears.

When neither detail nor placeholder is present, master's extra track is set to `calc(100% - masterSize)`, pushing the detail column offscreen. This ensures that when a detail element appears, it starts offscreen and is then either moved into an overlay (if `overlay` is set, so no blink occurs and master area size is preserved) or revealed by removing the `calc()` override (if no overlay). The `keep-detail-column-offscreen` attribute keeps the same override active when detail first appears with overlay, until the overlay takes effect.

```css
:host([keep-detail-column-offscreen]),
:host([has-detail-placeholder][overlay]),
:host(:not([has-detail-placeholder], [has-detail])) {
  --_master-extra: calc(100% - var(--_master-size));
}
```

Set when detail first appears with overlay, cleared when detail is removed or overlay resolves.

## Detail Animations

Detail panel transitions use the Web Animations API (`element.animate()`) on `translate` and `opacity`. This works inside shadow roots (unlike the View Transitions API). The host uses `overflow: clip` (not `overflow: hidden`) to clip offscreen content without creating a scroll container.

### CSS custom properties

Animation parameters are driven by CSS custom properties, read once per transition to avoid repeated layout reads:

- `--_transition-offset` — off-screen translate value. Defaults to `30px` (subtle slide in split mode), overridden to `calc((100% + 30px))` in overlay mode (full panel slide). Vertical orientation uses the Y axis.
- `--_transition-duration` — defaults to `0s`, enabled via `@media (prefers-reduced-motion: no-preference)`: 200ms for split mode, 300ms for overlay mode. Replace transitions in split mode use 0ms (no slide, just instant swap).
- `--_transition-easing` — cubic-bezier easing

CSS handles resting states via `translate` and `opacity` on `#detail`: offscreen and transparent by default, on-screen and opaque when `has-detail` is set. RTL is supported via `--_rtl-multiplier`.

### Transition types

- **Add**: DOM is updated first (new element inserted, `has-detail` set), then the detail slides in from off-screen. In split mode, also fades from opacity 0 → 1.
- **Remove**: the detail slides out to off-screen first (in split mode, also fades to opacity 0), then the DOM is updated (element removed, `has-detail` cleared) on `animation.finished`. The `fill: 'forwards'` on the animation keeps the detail offscreen between animation end and the deferred layout recalculation (see below).
- **Replace** (overlay): old content is reassigned to `slot="detail-outgoing"` (stays in light DOM so styles continue to apply), then old slides out while new slides in simultaneously
- **Replace** (split): 0ms duration (instant swap). Old content moves to outgoing slot, new content appears immediately.

The `noAnimation` property (reflected as `no-animation` attribute) skips all animations. Animations are also disabled when `--_transition-duration` resolves to `0s`.

### Backdrop fade

The backdrop uses `opacity: 0/1` + `pointer-events: none/auto` (not `display: none/block`) so it can be animated. A linear opacity fade runs in parallel with the detail slide for overlay add/remove transitions. During replace, the backdrop stays visible (no fade).

### Transition flow (`_startTransition`)

`_startTransition` is an async method. Each `await` is a yield point where interruption is possible — a version counter is checked after each `await` to bail if a newer transition has started.

**Add/Replace flow:**
1. Capture interrupted state, cancel previous, snapshot outgoing (replace only)
2. Run update callback — DOM changes + `_finishTransition()` (queues `recalculateLayout` microtask)
3. `await` microtask — Lit elements render, `recalculateLayout` sets `overlay`/`has-detail`
4. Read animation params from CSS, start animations with `fill: 'forwards'`
5. `await` animation completion
6. `__endTransition()` — cancel animations (removes fill), clean up

**Remove flow:**
1. Capture interrupted state, cancel previous
2. Read animation params, start slide-out animation with `fill: 'forwards'`
3. `await` animation completion
4. Run update callback — DOM changes + `_finishTransition()` (queues `recalculateLayout` microtask)
5. `await` microtask — `recalculateLayout` clears `has-detail`
6. `__endTransition()` — cancel animations (removes fill), clean up

### `fill: 'forwards'`

All animations use `fill: 'forwards'` to keep the final keyframe applied after the animation finishes. For remove, this bridges the gap between animation end (step 3) and layout recalculation (step 5) — without fill, the CSS resting state (`translate: none` from `has-detail`) would flash for one frame. The fill is cleaned up by `__endTransition()` in step 6, after `has-detail` is already cleared.

### `_finishTransition` and microtask deferral

`_finishTransition()` defers `recalculateLayout()` to a microtask so Lit elements can render before their intrinsic size is measured for auto-sizing. The `await Promise.resolve()` in `_startTransition` waits for this microtask to complete before reading animation params.

### Smooth interruption

`animation.cancel()` removes the animation effect and the element reverts to its CSS resting state — causing a visual jump. To avoid this, the current `translate` and `opacity` values are read via `getComputedStyle()` _before_ cancelling. These captured mid-flight values become the starting keyframe of the new animation, so the panel changes direction and opacity smoothly from where it actually is.

For `replace` interruptions, the captured state is applied to the outgoing element (since the interrupted content moves from the detail slot to the outgoing slot).

### Z-index layering

```
z-index: 1 — #detail-placeholder
z-index: 2 — #backdrop
z-index: 3 — #outgoing (always position: absolute)
z-index: 4 — #detail
```

`#detail` above `#outgoing` is correct: split-mode replace has 0ms duration (no frames painted, z-order irrelevant), and overlay-mode replace has the incoming sliding over the outgoing.

### Outgoing container

The `#outgoing` shadow DOM element with `<slot name="detail-outgoing">` enables replace animations. Old content is moved to this slot (light DOM reassignment preserves user styles), animated out, then removed on completion. During replace, the outgoing width is frozen to `__detailCachedSize` so it retains the previous detail's dimensions even when the new detail has a different intrinsic size.

## Test Patterns

- **`onceResized(layout)`** (`test/helpers.js`): `nextResize()` + `nextRender()` — waits for ResizeObserver + rAF write phase in `__onResize()`
- **Split mode sizing**: measure part elements directly (not `gridTemplateColumns` which has 4 columns)
- **Vertical tests**: integrated into each test file under `describe('vertical')` suites
- **Feature flag**: `window.Vaadin.featureFlags.masterDetailLayoutComponent = true` required before import
