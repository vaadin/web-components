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
- [x] `drawer-mode.test.js` — sticky positioning, detail width, backdrop, adding/removing detail (5 tests)

## Step 4: Stack mode

- [ ] Stack CSS: absolute positioning, inset: 0, full-size override on all parts
- [ ] Port and adapt: `stack-mode.test.js` — horizontal tests

## Step 5: Overlay API (`forceOverlay`, `stackOverlay`, `containment`)

- [ ] Decide on API: `forceOverlay`/`stackOverlay` vs `masterSize: 100%` approach
- [ ] Add `containment` property (`layout` vs `viewport`)
- [ ] CSS: `position: fixed` for viewport containment, safe-area-inset padding
- [ ] Port and adapt: overlay/containment tests

## Step 6: Vertical orientation

- [ ] Add `orientation` property
- [ ] `grid-template-rows` + `minmax()` for vertical
- [ ] Overflow detection using `gridTemplateRows`
- [ ] Vertical drawer/stack/containment CSS
- [ ] Port and adapt: vertical tests from `drawer-mode.test.js` and `stack-mode.test.js`

## Step 7: Accessibility + events

- [ ] Inert master in overlay modes, dialog role, aria-modal
- [ ] Escape key handling, backdrop click event
- [ ] Port: `aria.test.js`, `events.test.js`

## Step 8: View transitions

- [ ] Add `noAnimation` property
- [ ] Copy `_setDetail()`, `_startTransition()`, `_finishTransition()` from existing
- [ ] Copy transition base styles
- [ ] Port and adapt: `view-transitions.test.js`

## Step 9: Nested MDL scenario

- [ ] Verify nested layouts work without glitches (primary motivation for grid rewrite)
- [ ] Port nested test from `stack-mode.test.js`

## Step 10: TypeScript definitions + type tests

- [ ] Add `.d.ts` entry point (`vaadin-master-detail-layout.d.ts`)
- [ ] Write `.d.ts` files for component and styles
- [ ] Port and adapt: `typings/master-detail-layout.types.ts`

## Step 11: Merge back

- [ ] Replace `packages/master-detail-layout/src/` with `packages/mdl/src/`
- [ ] Replace tests
- [ ] Update snapshot/visual test references
- [ ] Remove `packages/mdl/`
