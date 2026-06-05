<!-- Edit any field. This file is committed on the `repro/grid-badge-autowidth` branch and linked from the issue. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced
- **Hypothesis tested:** Grid auto-width mis-sizes a column whose cells render `<vaadin-badge>`, because the badge element upgrades and injects its styles *after* the grid's one-time width measurement, observable as the badge being clipped.
- **Branch:** `repro/grid-badge-autowidth` — pushed to `vaadin/web-components`
- **Reproduced on:** web-components @ `25.2.0-beta1` (main line)
- **Present on main?:** yes (still broken)
- **Theme / Browser:** Lumo / Chromium (playwright-cli)
- **Demo video:** `repro-grid-badge-autowidth.webm` (on the branch; drag into the issue for inline playback)

## Observed behavior

An `auto-width` column rendering `<vaadin-badge>` is sized too narrow and clips the badge. With the four sample rows the badge column measures **132px**, while a control column with the **same text rendered as plain text** measures **227px**. Badges overflow their cell — e.g. "Shipped to customer" (153px) and "Cancelled by administrator" (192px) inside a 132px cell — and render as "Shipped to custo…", "Cancelled by adr…".

Calling `grid.recalculateColumnWidths()` *after* the badges have upgraded grows the column from 132px to 225px and removes all clipping, confirming the column was measured before the badge had its real width.

## Expected behavior

The auto-width column accounts for the full rendered width of the `<vaadin-badge>`, exactly as it does for plain text — no clipping.

## Steps to reproduce

1. Add a `vaadin-grid` with an `auto-width` column whose renderer outputs a `<vaadin-badge>` (text long enough to exceed the badge's collapsed width).
2. Set the grid's items and load the page with the Lumo theme.
3. Observe the badge column on first render.

## Reproduction

How to run: `yarn start`, then open the route below.

- **Route / page:** `http://localhost:8000/dev/repro-grid-badge-autowidth.html?theme=lumo:light`
- **Scaffold:** `dev/repro-grid-badge-autowidth.html` (committed on this branch)

```js
grid.items = [
  { status: 'Confirmed', theme: 'success' },
  { status: 'Pending approval', theme: 'warning' },
  { status: 'Shipped to customer', theme: '' },
  { status: 'Cancelled by administrator', theme: 'error' },
];

// auto-width column
column.renderer = (root, _column, model) => {
  root.innerHTML = `<vaadin-badge theme="${model.item.theme}">${model.item.status}</vaadin-badge>`;
};
```

## Root cause (suspected)

`packages/grid/src/vaadin-grid-column-auto-width-mixin.js:298` — `__isReadyForColumnWidthCalculation()` waits only for the auto-width **column** elements to be defined (`customElements.get(col.localName)` → `customElements.whenDefined(...)`). It does not wait for custom elements rendered **inside the cells** (here `<vaadin-badge>`) to upgrade. The measurement (`__getAutoWidthCellsMaxWidth`, reads `cell.offsetWidth`, ~line 234) therefore runs while the badge is still pre-layout, and the recalculation triggers (`dataProvider` / `_columnTree` / `_flatSize` / visibility observers, ~lines 23-67) never fire when the badge later upgrades and grows — so the column stays too narrow.

## Notes

- The plain-text control column proves the auto-width algorithm itself is correct; the defect is purely the measurement timing for asynchronously-upgrading cell content.
- Likely affects any custom element used as auto-width cell content that gains size on upgrade/style injection, not just `<vaadin-badge>`.
