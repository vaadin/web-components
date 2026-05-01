# Master-Detail Layout — Architecture

A layout component that adapts between split and overlay modes based on available space. Built on CSS Grid for layout topology and the Web Animations API for transitions (both work inside shadow roots, unlike View Transitions).

## Grid topology

The grid uses **4 tracks** with named lines. Each logical column (master, detail) has a **size track** plus an **extra track** that can absorb remaining space:

```
[master-start] <master-size> <master-extra> [detail-start] <detail-size> <detail-extra> [detail-end]
```

Parts are placed via named grid lines using `--_master-area` and `--_detail-area` custom properties.

Custom properties drive the track sizes:

- `--_master-size` — defaults to `min(100%, 30rem)` so the master shrinks on narrow hosts
- `--_detail-size` — resolves to `var(--_detail-cached-size)`, defaulting to `min-content` (see _Auto detail sizing_)
- `--_master-extra` / `--_detail-extra` — default to `0px`; set to `1fr` by expand modes

### Expand modes

| Attributes                      | `--_master-extra` | `--_detail-extra` |
| ------------------------------- | ----------------- | ----------------- |
| (none)                          | `0px`             | `0px`             |
| `expand-master`                 | `1fr`             | `0px`             |
| `expand-detail`                 | `0px`             | `1fr`             |
| `expand-master` `expand-detail` | `1fr`             | `1fr`             |

### Vertical orientation

In vertical mode, `grid-template-rows` replaces `grid-template-columns` using the same named lines and variables. Parts switch from `grid-column` to `grid-row` placement.

### Auto detail sizing

When `detailSize` is not set, `--_detail-cached-size` defaults to `min-content` so the browser sizes the detail column to its content's intrinsic width. The write phase then caches that measurement as a fixed pixel value, keeping the column stable across overlay transitions and re-renders.

During recalculation the detail area narrows to `detail-start / detail-extra` (one track instead of two). This prevents `1fr` on the extra track from collapsing the `min-content` measurement to zero when both `expand-detail` and auto-sizing are active.

## Modes

### Split (default)

Master and detail sit side-by-side in the grid. Detail has a `translate: none` resting state when `has-detail` is set (and slides in from `--_transition-offset` off-screen when added).

### Overlay

The `overlay` attribute is set automatically by layout state computation when master + detail don't fit in the host. In overlay mode:

- Detail becomes `position: absolute`, removed from grid flow, pinned to the end-side of the host with the configured overlay/detail size
- Backdrop becomes visible (`opacity: 1`, `pointer-events: auto`)
- ARIA: `role="dialog"` on detail, `inert` on master (for layout containment)

Setting `overlaySize` to `100%` makes the detail cover the full layout.

With `overlayContainment='page'`, the overlay is fixed to the viewport and applies `env(safe-area-inset-*)` padding (top, bottom, and end-side) to respect device safe areas like notches and home indicators. RTL flips the horizontal padding. Nested safe-area custom properties are reset to 0 to prevent slotted content from adding them again. ARIA: `aria-modal="true"` on detail.

### Forced overlay

When `forceOverlay` is set, the detail is always shown as an overlay regardless of available space. The grid template collapses the detail tracks to `0px`, and overflow detection is bypassed so `overlay` is set whenever detail or placeholder is present.

## Layout state computation

Layout state (overflow, has-detail, has-master, etc.) is computed by measuring the host size and grid tracks, then writing attributes. Reads and writes are split to avoid forced reflows:

- **`__readLayoutState()`** — pure reads: slot queries, `checkVisibility()`, `getComputedStyle()`. Safe to call in a ResizeObserver callback where layout is already computed.
- **`__writeLayoutState(state)`** — pure writes: toggles attributes, caches intrinsic detail size, triggers re-render for ARIA, focuses detail. No DOM reads.

The ResizeObserver callback runs read synchronously, cancels any pending write rAF, and schedules a new one. Cancellation ensures multiple resize callbacks in the same frame coalesce to a single write using the latest state.

### Overflow detection

The `detectOverflow()` helper reads the first 3 of the 4 computed track sizes (`[masterSize, masterExtra, detailSize]`). Overflow is **false** when either:

- `Math.floor(masterSize + masterExtra + detailSize) <= Math.floor(hostSize)` (tracks fit; flooring avoids false positives from sub-pixel track sizes)
- `Math.floor(masterExtra) >= Math.floor(detailSize)` (master's extra space can absorb the detail)

The `>=` boundary in the second check is intentional: when `keep-detail-column-offscreen` or `:not([has-detail])` is active, `calc(100% - masterSize)` inflates the master's extra track; with this inflation, `masterExtra >= detailSize` is equivalent to `hostSize >= masterSize + detailSize`. Strict `>` would miss the boundary case.

### Stale rAF safety

Only `__writeLayoutState` and `recalculateLayout` modify layout attributes. `recalculateLayout` starts by cancelling any pending rAF, so its writes can't be overwritten by a stale observer callback. A rAF that fires without being cancelled simply re-applies the same state it read — an idempotent no-op.

### `recalculateLayout()` and nested propagation

Clears the cached detail size, temporarily sets `recalculating-detail-size` (which also disables `1fr` expansion to avoid distorting the measurement), then runs a fresh read/write cycle. Propagates to all ancestor master-detail-layouts so nested layouts re-measure correctly.

Called from `updated()` when `masterSize`, `detailSize`, `orientation`, or `forceOverlay` change to a non-initial value, and automatically when a nested layout connects (the inner layout schedules a rAF that calls `recalculateLayout()` — pending rAFs on ancestors are cancelled so only the deepest layout triggers).

### `keep-detail-column-offscreen`

Prevents the master from jumping when a detail first appears as an overlay. When neither detail nor placeholder is present, the master's extra track is inflated to `calc(100% - masterSize)`, pushing the detail column off-screen. This means a new detail element starts off-screen and can either slide in (split) or be absolutely positioned (overlay) without shifting the master's width.

The attribute keeps this inflation active when detail first appears with overlay, until the overlay takes effect. It's also kept active for the placeholder-with-overlay case (placeholder present, detail not yet added).

## Slots and visibility

| Slot                 | Attribute                | Notes                                                        |
| -------------------- | ------------------------ | ------------------------------------------------------------ |
| (default)            | `has-master`             | `#master` is `opacity: 0` + `pointer-events: none` until set |
| `detail`             | `has-detail`             | Animates in/out                                              |
| `detail-placeholder` | `has-detail-placeholder` | Shown when no detail and not in overlay                      |
| `detail-outgoing`    | (internal)               | Used during replace transitions, hosted on `#detailOutgoing` |

Detail placeholder uses `opacity` + `pointer-events` (not `display`) so it always participates in grid sizing but can't intercept clicks when hidden:

```css
#detailPlaceholder {
  opacity: 0;
  pointer-events: none;
}

:host([has-detail-placeholder]:not([has-detail], [overlay])) #detailPlaceholder {
  opacity: 1;
  pointer-events: auto;
}
```

The placeholder is included in overflow detection. Without it, a layout with only a placeholder would never check for overflow and `keep-detail-column-offscreen` wouldn't apply.

`#detailOutgoing` is a shadow DOM wrapper with `<slot name="detail-outgoing">`. During replace, the outgoing detail element's slot is reassigned from `detail` to `detail-outgoing` (light DOM reassignment preserves user styles). Its width is frozen to the cached detail size so it retains the previous dimensions even when the new detail has a different intrinsic size. It's removed on completion.

## Animations

Detail transitions use the Web Animations API on `translate` and `opacity`. The host uses `overflow: clip` (not `overflow: hidden`) to clip off-screen content without creating a scroll container.

Parameters come from CSS custom properties:

- `--_transition-offset` — off-screen translate (subtle `30px` in split, full panel slide in overlay)
- `--_transition-duration` — enabled via `prefers-reduced-motion: no-preference`
- `--_transition-easing` — cubic-bezier for detail, overridden to `linear` on `#backdrop`

CSS drives the resting states: `#detail` is translated off-screen and transparent by default, on-screen and opaque when `has-detail` is set. RTL is supported via `--_rtl-multiplier`.

### Transition types

- **Add**: update DOM first, then fade + slide detail in from off-screen
- **Remove**: fade + slide detail out first, then update DOM
- **Replace**: move old content to `slot="detail-outgoing"`, update DOM, then animate new in + old out simultaneously. Split-mode replace runs at 0ms (instant swap).

The `noAnimation` property (reflected as `no-animation` attribute) skips all animations.

### Transition flow

The orchestrator is an `async` method. Each transition type has a linear handler:

- **Add/Replace**: update DOM → `await` microtask (Lit renders, layout recalculates, `[overlay]` settles) → animate
- **Remove**: animate → update DOM → `await` microtask (layout clears `has-detail`)

The `transition` attribute is set at the start and cleared when the handler completes. Cancelled animations throw `AbortError`, which is caught and silently ignored.

The microtask before animation is essential: layout state (including overlay detection and offscreen CSS value) must settle before animation parameters are read.

### Smooth interruption

Each animation is tagged with a shared ID. When a new transition starts, the running animation is found via `getAnimations()` and its progress (0–1) is computed from `currentTime / duration`. The old animation is cancelled and the new one starts from the captured progress using `playbackRate: -1` for reverse. This provides smooth direction changes without reading `getComputedStyle` or managing explicit keyframe captures.

### Backdrop fade

The backdrop uses `opacity: 0/1` + `pointer-events: none/auto` so it can be animated. A linear opacity fade runs in parallel with the detail slide for overlay add/remove transitions. During replace, the backdrop stays visible.

### Z-index layering

```
z-index: 1 — #detailPlaceholder
z-index: 2 — #backdrop
z-index: 3 — #detailOutgoing (always position: absolute)
z-index: 4 — #detail
```

`#detail` above `#detailOutgoing` works correctly: split-mode replace is instant so z-order doesn't matter, and overlay-mode replace has the incoming sliding over the outgoing.

## Testing

- **`onceResized(layout)`** (`test/helpers.js`): `nextResize()` + `nextRender()` — waits for ResizeObserver + rAF write phase
- **`waitForAnimationProgress(element, offset)`**: waits until an animation is running on the element with translate strictly between 0 and offset (genuinely mid-flight, not at either endpoint's CSS resting state)
- **Split mode sizing**: measure part elements directly (not `gridTemplateColumns`, which has 4 columns)
- **Vertical tests**: integrated into each test file under `describe('vertical')` suites
- **Feature flag**: `window.Vaadin.featureFlags.masterDetailLayoutComponent = true` required before import
