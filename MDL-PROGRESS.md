# Master-Detail-Layout: CSS Grid Rewrite — Progress

## Step 1: Scaffold `packages/mdl/` + minimal component shell — DONE

- [x] `package.json` (private, same deps as existing MDL)
- [x] Entry point file (`vaadin-master-detail-layout.js`)
- [x] Minimal component: `masterSize`, `detailSize`, `expand` (default `'both'`) properties
- [x] Render template: backdrop + master slot + detail slot
- [x] Property observers setting CSS custom properties + `has-*-size` attributes
- [x] `has-detail` detection via slotchange
- [x] Base styles: `display: grid; overflow: hidden; grid-template-columns: minmax()`
- [x] CSS defaults: `--_master-size: 400px`, `--_detail-size: min-content`
- [x] `expand` attribute CSS rules (both/master/detail)
- [x] Unit tests: custom element definition, has-detail, expand (`yarn test --group mdl` — 7 tests)
- [x] Snapshot tests: host (default, masterSize, detailSize, both) + shadow (`yarn test:snapshots --group mdl` — 5 tests)
- [x] Dev page: `dev/mdl.html` using `@vaadin/mdl` package
- [x] Restored `dev/master-detail-layout.html` to main branch state

## Step 2: Split mode layout tests (horizontal only) — DONE

- [x] `split-mode.test.js` — expand both, expand master, expand detail (7 tests)

## Step 3: Overflow detection + drawer mode — DONE

- [x] ResizeObserver reading computed `gridTemplateColumns`
- [x] `overflow` attribute toggled when columns exceed host width
- [x] `__detectOverflow()` extracted, called from ResizeObserver + property observers + slotchange
- [x] `disconnectedCallback` to disconnect ResizeObserver
- [x] Drawer CSS: sticky detail, backdrop display, detail background/shadow
- [x] No-detail handling: `--_detail-col: ''` collapses the column
- [x] `__detectLayoutMode()` not needed — CSS grid + `__detectOverflow()` replaces it
- [x] `overflow.test.js` — layout resize, property-driven overflow detection, masterSize: 100% (9 tests)

## Step 4: Detail overlay mode API (#11346) — DONE (drawer + full)

- [x] Add `detailOverlayMode` property (`drawer` default, `full`)
- [x] Shared overlay styles (z-index, background, shadow, backdrop) via `:host([overflow])`
- [x] `drawer`: sticky side-panel (existing behavior, keyed off `[detail-overlay-mode='drawer']`)
- [x] `full`: negative margin + explicit width to cover layout, `height: 100%`
- [x] `--_master-col-width` / `--_host-width` CSS custom properties set from `__detectOverflow()`
- [x] Temporary overflow attribute removal in full mode for accurate grid measurement (prevents oscillation)
- [x] `setTimeout` in ResizeObserver callback (matches `form-layout` pattern)
- [x] `detail-overlay-mode.test.js` — drawer (4 tests) + full (11 tests)
- [x] Updated DOM snapshots for new `detail-overlay-mode` attribute
- [ ] `drawer-viewport` / `full-viewport`: `position: fixed`, safe-area-inset padding (deferred)

## Step 5: Vertical orientation

- [ ] Add `orientation` property
- [ ] `grid-template-rows` + `minmax()` for vertical
- [ ] Overflow detection using `gridTemplateRows`
- [ ] Vertical drawer/full/containment CSS
- [ ] Port and adapt: vertical tests from `drawer-mode.test.js` and `full-mode.test.js`

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
- [ ] Port nested test from `full-mode.test.js`

## Step 9: TypeScript definitions + type tests

- [ ] Add `.d.ts` entry point (`vaadin-master-detail-layout.d.ts`)
- [ ] Write `.d.ts` files for component and styles
- [ ] Port and adapt: `typings/master-detail-layout.types.ts`

## Step 10: Merge back

- [ ] Replace `packages/master-detail-layout/src/` with `packages/mdl/src/`
- [ ] Replace tests
- [ ] Update snapshot/visual test references
- [ ] Remove `packages/mdl/`
