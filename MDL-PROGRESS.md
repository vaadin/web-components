# Master-Detail-Layout: CSS Grid Rewrite — Progress

## Step 1: Scaffold `packages/mdl/` + minimal component shell — DONE

- [x] `package.json` (private, same deps as existing MDL)
- [x] Entry point file (`vaadin-master-detail-layout.js`)
- [x] Minimal component: `masterSize`, `detailSize`, `expand` (default `'both'`) properties
- [x] Render template: backdrop + master slot + detail slot
- [x] Property observers setting CSS custom properties + `has-*-size` attributes
- [x] `has-detail` detection via `checkVisibility()` in ResizeObserver callback
- [x] Base styles: `display: grid; overflow: hidden; grid-template-columns`
- [x] `expand` attribute CSS rules (both/master/detail) using `minmax(var(--_*-size), 1fr)`
- [x] Unit tests: custom element definition, has-detail, expand
- [x] Snapshot tests: host (default, masterSize, detailSize, both) + shadow
- [x] Dev page: `dev/mdl.html` using `@vaadin/mdl` package

## Step 2: Split mode layout tests (horizontal only) — DONE

- [x] `split-mode.test.js` — expand both, expand master, expand detail (7 tests)

## Step 3: Overflow detection + drawer mode — DONE

- [x] ResizeObserver on host + slotted children via `__initResizeObserver()`
- [x] `overflow` attribute toggled when columns exceed host width
- [x] `__onResize()` computes `has-detail`, `overflow`, and `preserve-master-width`
- [x] `disconnectedCallback` to disconnect ResizeObserver
- [x] `position: absolute` for detail in all overlay modes, `grid-column: none` in overflow
- [x] 4-column grid with named lines: `[master-start] size extra [detail-start] size extra [detail-end]`
- [x] `preserve-master-width` attribute prevents master jump on detail open
- [x] `setTimeout` in ResizeObserver to avoid loop from attribute-driven CSS changes
- [x] Fix: `__onResize()` read-then-write pattern (no forced reflows); `hasOverflow` gated on `hasDetail`
- [x] Fix: `>=` instead of `>` in extra space check — handles `calc(100% - size)` inflation at boundary
- [x] `overflow.test.js` — layout resize, async property-driven overflow detection (9 tests)

## Step 4: Detail overlay mode API (#11346) — DONE

- [x] `detailOverlayMode` property: `drawer`, `drawer-viewport`, `full`, `full-viewport`
- [x] Drawer: `width: var(--_detail-size); inset-inline-end: 0`
- [x] Full: `inset-inline: 0` (detail covers entire layout)
- [x] Viewport: `position: fixed` via `$='viewport'` CSS selector
- [x] CSS uses `^='drawer'`/`^='full'`/`$='viewport'` prefix/suffix selectors
- [x] `detail-overlay-mode.test.js` — drawer (5) + full (9) + drawer-viewport (4) + full-viewport (5)

## Step 5: Vertical orientation

- [ ] Add `orientation` property
- [ ] `grid-template-rows` + `minmax()` for vertical
- [ ] Overflow detection using `gridTemplateRows`
- [ ] Vertical drawer/full/containment CSS
- [ ] Port and adapt: vertical tests

## Step 6: Accessibility + events

- [ ] Inert master in overlay modes, dialog role, aria-modal
- [ ] Escape key handling, backdrop click event
- [ ] Port: `aria.test.js`, `events.test.js`

## Step 7: View transitions

- [ ] Add `noAnimation` property
- [ ] Copy `_setDetail()`, `_startTransition()`, `_finishTransition()` from existing
- [ ] Copy transition base styles
- [ ] Port and adapt: `view-transitions.test.js`

## Step 8: Nested MDL scenario

- [ ] Verify nested layouts work without glitches (primary motivation for grid rewrite)
- [ ] Port nested test from existing `stack-mode.test.js`

## Step 9: TypeScript definitions + type tests

- [ ] Add `.d.ts` entry point (`vaadin-master-detail-layout.d.ts`)
- [ ] Write `.d.ts` files for component and styles
- [ ] Port and adapt: `typings/master-detail-layout.types.ts`

## Step 10: Merge back

- [ ] Replace `packages/master-detail-layout/src/` with `packages/mdl/src/`
- [ ] Replace tests
- [ ] Update snapshot/visual test references
- [ ] Remove `packages/mdl/`
