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

The `>=` (not `>`) is intentional: when `keep-detail-column-offscreen` or `:not([has-detail])` is active, CSS `calc(100% - masterSize)` inflates the master extra track. With this inflation, `masterExtra >= detailSize` is equivalent to `hostSize >= masterSize + detailSize` — the correct no-overflow check. Strict `>` would miss the boundary case where they're equal.

### Read/write separation

Layout detection is split into two methods to avoid forced reflows:

- **`__computeLayoutState()`** — pure reads: `checkVisibility()`, `getComputedStyle()`, `getFocusableElements()`. Called in the ResizeObserver callback where layout is already computed — no forced reflow.
- **`__applyLayoutState(state)`** — pure writes: toggles `has-detail`, `overlay`, `keep-detail-column-offscreen`; calls `requestUpdate()` for ARIA; focuses detail. No DOM/style reads.

### ResizeObserver

- **Observes**: host + shadow DOM parts (`master`, `detail`) + direct slotted children (`:scope >` prevents observing nested descendants)
- ResizeObserver callback: calls `__computeLayoutState()` (read), cancels any pending rAF via `cancelAnimationFrame`, then defers `__applyLayoutState()` (write) via `requestAnimationFrame`. Cancelling ensures the write phase always uses the latest state when multiple callbacks fire per frame.
- **Property observers** (`masterSize`/`detailSize`) only update CSS custom properties — ResizeObserver picks up the resulting size changes automatically

## Overlay Modes

When `overlay` AND `has-detail` are both set, the detail becomes an overlay:

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

## Detail Placeholder

The `detail-placeholder` slot shows content in the detail area when no detail is open (e.g. "Select an item"). It occupies the same grid tracks as the detail and receives the same border styling.

Visible only when a placeholder element is slotted, no detail is present, and there is no overlay:

```css
:host([has-detail-placeholder]:not([has-detail], [overlay])) #detail-placeholder {
  display: block;
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
  --_master-column: var(--_master-size) calc(100% - var(--_master-size));
}
```

Set when detail first appears with overlay, cleared when detail is removed or overlay resolves.

## Detail Animations

Detail panel transitions use the Web Animations API (`element.animate()`) on `translate` and `opacity`. This works inside shadow roots (unlike the View Transitions API).

### CSS custom properties

Animation parameters are driven by CSS custom properties, read once per transition to avoid repeated layout reads:

- `--_detail-offscreen` — off-screen translate value. Defaults to `30px` (subtle slide in split mode), overridden to `calc((100% + 30px))` in overlay mode (full panel slide). Vertical orientation uses the Y axis.
- `--_transition-duration` — defaults to `0s`, enabled via `@media (prefers-reduced-motion: no-preference)`: 200ms for split mode, 300ms for overlay mode. Replace transitions in split mode use 0ms (no slide, just instant swap).
- `--_transition-easing` — cubic-bezier easing

CSS handles resting states: `translate: var(--_detail-offscreen)` on `#detail` by default, overridden to `translate: none` by `:host([has-detail])`. RTL is supported via `--_rtl-multiplier`.

### Transition types

- **Add**: DOM is updated first (new element inserted, `has-detail` set), then the detail slides in from off-screen. In split mode, also fades from opacity 0 → 1.
- **Remove**: the detail slides out to off-screen first (in split mode, also fades to opacity 0), then the DOM is updated (element removed, `has-detail` cleared) on `animation.finished`
- **Replace** (overlay): old content is reassigned to `slot="detail-outgoing"` (stays in light DOM so styles continue to apply), then old slides out while new slides in simultaneously
- **Replace** (split): old content moves to outgoing slot. The outgoing slides out with fade on top (`z-index: 1`), revealing the incoming at full opacity underneath.

The `noAnimation` property (reflected as `no-animation` attribute) skips all animations. Animations are also disabled when `--_transition-duration` resolves to `0s`.

### Transition flow

1. **Capture interrupted state** — read the detail panel's current `translate` and `opacity` via `getComputedStyle()` _before_ cancelling any in-progress animation (see "Smooth interruption" below)
2. **Cancel previous** — cancel in-progress animations, clean up state, resolve the pending promise
3. **Snapshot outgoing** — reassign old content to the outgoing slot (replace only)
4. **DOM update** — run the update callback, apply layout state (add/replace only; remove defers this to step 6)
5. **Animate** — create Web Animations on `translate` and `opacity`
6. **Finish** — on `animation.finished`, clean up the `transition` attribute and resolve the promise. For remove, the deferred DOM update runs here

A version counter guards step 6: if a newer transition has started since step 5, the stale finish callback is ignored.

### Smooth interruption

`animation.cancel()` removes the animation effect and the element reverts to its CSS resting state — causing a visual jump. To avoid this, the current `translate` and `opacity` values are read via `getComputedStyle()` _before_ cancelling. These captured mid-flight values become the starting keyframe of the new animation, so the panel changes direction and opacity smoothly from where it actually is.

For `replace` interruptions, the captured state is applied to the outgoing element (since the interrupted content moves from the detail slot to the outgoing slot).

### Outgoing container

The `#outgoing` shadow DOM element with `<slot name="detail-outgoing">` enables replace animations. Old content is moved to this slot (light DOM reassignment preserves user styles), animated out, then removed on completion. The outgoing has `z-index: 1` to paint on top of the incoming during the transition.

## Test Patterns

- **`onceResized(layout)`** (`test/helpers.js`): `nextResize()` + `nextRender()` — waits for ResizeObserver + rAF write phase in `__onResize()`
- **Split mode sizing**: measure part elements directly (not `gridTemplateColumns` which has 4 columns)
- **Vertical tests**: integrated into each test file under `describe('vertical')` suites
- **Feature flag**: `window.Vaadin.featureFlags.masterDetailLayoutComponent = true` required before import
