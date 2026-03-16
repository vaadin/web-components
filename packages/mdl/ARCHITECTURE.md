# Master-Detail Layout — CSS Grid Architecture

Temporary package `packages/mdl/` (`@vaadin/mdl`) on branch `mdl-2.0`. Replaces the old flexbox-based `packages/master-detail-layout/` with CSS grid.

## 4-Column Grid System

The grid uses **4 column tracks** with named lines, not 2. Each logical column (master, detail) has a **size track** + an **extra track**:

```
[master-start] <master-size> <master-extra> [detail-start] <detail-size> <detail-extra> [detail-end]
```

CSS custom properties:
- `--_master-column: var(--_master-size) 0` — default: fixed size + 0 extra
- `--_detail-column: var(--_detail-size) 0` — default: fixed size + 0 extra
- `--_master-size` / `--_detail-size` — set from JS via `style.setProperty()` when `masterSize`/`detailSize` properties change

Parts use **named grid lines** for placement:
- `[part~='master'] { grid-column: master-start / detail-start }` — spans size + extra
- `[part~='detail'] { grid-column: detail-start / detail-end }` — spans size + extra

### Expand modes

The `expand` attribute controls which extra track(s) become `1fr`:

| `expand` | `--_master-column` | `--_detail-column` |
|----------|--------------------|--------------------|
| (none) | `size 0` | `size 0` |
| `both` | `size 1fr` | `size 1fr` |
| `master` | `size 1fr` | `size 0` |
| `detail` | `size 0` | `size 1fr` |

### No sizes set

When `masterSize`/`detailSize` are not set, `var(--_master-size)` is undefined → the entire `grid-template-columns` becomes invalid → falls back to `none` (auto implicit columns). **Both sizes must be explicitly set for reliable layout.**

## Overflow Detection

`__checkOverflow()` reads the **first 3** of the 4 computed column widths: `[masterWidth, masterExtraSpace, detailWidth]`.

Overflow = true when:
1. `masterWidth + masterExtraSpace + detailWidth > offsetWidth` (columns don't fit)
2. AND `masterExtraSpace < detailWidth` (master can't absorb the detail by shrinking)

The 4th column (detail extra) is ignored — it's 0 in overflow scenarios.

### Why `>=` (not `>`) in the extra space check

When `preserve-master-width` or `:not([has-detail])` is active, CSS `calc(100% - masterSize)` inflates the master extra track. With this inflation, `masterExtraSpace = hostWidth - masterSize`. The condition `masterExtraSpace >= detailWidth` becomes `hostWidth >= masterSize + detailSize`, which is the correct no-overflow check regardless of CSS state.

Using strict `>` would miss the boundary case where `masterExtraSpace == detailWidth` (i.e., `hostWidth == masterSize + detailSize`), incorrectly reporting overflow when columns fit exactly.

### `__onResize()` read-then-write pattern

All DOM/style reads happen first, then all writes. No forced reflows from write-then-read:

1. **Read**: save previous `has-detail` state, compute detail visibility, check overflow
2. **Write**: set/clear `preserve-master-width`, toggle `has-detail`, toggle `overflow`

The `>=` check in `__checkOverflow()` ensures correct results even when column widths are read with stale CSS state (before attributes are updated).

### ResizeObserver + Debouncer pattern

- **Observes**: host element + slotted light DOM children (NOT shadow DOM parts)
- **NOT observing shadow DOM parts** avoids the ResizeObserver loop depth issue (parts are at the same DOM depth as the host; slotted children are deeper)
- **`Debouncer` with `timeOut`** (`@vaadin/component-base`) defers `__onResize()` to a new macrotask, preventing the loop error. Both ResizeObserver and property observers call `__scheduleResize()` which uses the same debouncer — ensures single execution per cycle
- **Property observers call `__scheduleResize()`** because size changes with `preserve-master-width` active may not resize any observed element (master stays at full host width)
- **Slotchange debouncing**: `queueMicrotask` batches multiple slot changes into a single `__initResizeObserver()` call

## Overlay Modes

When `overflow` is true AND `has-detail` is true, the detail becomes an overlay:

- `position: absolute; grid-column: none` — removes detail from grid flow
- Backdrop becomes visible (`display: block`)
- `detailOverlayMode` controls visual style via CSS attribute selectors

### CSS selector pattern

Uses `^=` (starts-with) and `$=` (ends-with) for elegant mode matching:

| Selector | Matches |
|----------|---------|
| `[detail-overlay-mode^='drawer']` | `drawer`, `drawer-viewport` |
| `[detail-overlay-mode^='full']` | `full`, `full-viewport` |
| `[detail-overlay-mode$='viewport']` | `drawer-viewport`, `full-viewport` |

### Overlay positioning

| Mode | CSS |
|------|-----|
| Drawer | `width: var(--_detail-size); inset-inline-end: 0; inset-block: 0` |
| Full | `inset-inline: 0; inset-block: 0` |
| *-viewport | `position: fixed` (overrides `absolute`) |

## preserve-master-width

Prevents the master from jumping when the detail overlay first appears.

**Problem**: When detail appears and columns don't fit, overflow is set. The detail becomes `position: absolute` (out of grid flow). But the master's `1fr` extra track now has no competition from the detail's `1fr`, so the master would expand. This causes a visual jump.

**Solution**: When `preserve-master-width` is set, the master's extra column uses `calc(100% - var(--_master-size))` instead of `1fr`. This makes the master fill exactly `100%` of the host, regardless of other columns. Same CSS rule applies when `has-detail` is not set (no detail → master fills host).

```css
:host([expand='both']:is(:not([has-detail]), [preserve-master-width])) {
  --_master-column: var(--_master-size) calc(100% - var(--_master-size));
}
```

**Lifecycle**:
- Set when: detail first appears (`!hadDetail && hasDetail`) with overflow
- Cleared when: detail removed OR overflow resolved
- The `>=` check in `__checkOverflow()` ensures correct overflow detection even when this attribute inflates the master extra track (see "Why `>=`" above)

## Test Patterns

- **Async overflow detection**: All overflow assertions after property/DOM changes need `await nextResize(layout)` because detection is async (ResizeObserver + setTimeout)
- **Split mode sizing**: Use `getPartWidths()` (measuring part elements) instead of parsing `gridTemplateColumns` (which now has 4 columns with named lines)
- **`nextResize(layout)`** works even when the host doesn't resize — creates a new observer whose initial observation always fires, with setTimeout aligning after the component's setTimeout
- **Feature flag**: All test files must set `window.Vaadin.featureFlags.masterDetailLayoutComponent = true` before importing the component

## Files

- `packages/mdl/src/vaadin-master-detail-layout.js` — component class
- `packages/mdl/src/styles/vaadin-master-detail-layout-base-styles.js` — CSS
- `packages/mdl/test/split-mode.test.js` — column sizing (7 tests)
- `packages/mdl/test/overflow.test.js` — overflow detection (9 tests)
- `packages/mdl/test/detail-overlay-mode.test.js` — drawer/full/viewport (23 tests)
- `packages/mdl/test/master-detail-layout.test.js` — basics (8 tests)
- `packages/mdl/test/dom/master-detail-layout.test.js` — snapshots (5 tests)
- `MDL-PROGRESS.md` — step-by-step implementation tracker
