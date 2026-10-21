> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced
- **Hypothesis tested:** The bug is `_onDragStart` failing to resolve the `<tr>` from a cell content element, triggered by the `div[role=button]` wrapper that edit columns add on macOS (`_focusButtonMode`), observable as no `grid-dragstart` event when dragging a row by an edit-column cell.
- **Regression?:** not a regression (broken since focus button mode was enabled for edit columns on Mac in vaadin/web-components#4260, 2022)
- **Fixed by:** n/a
- **Duplicate of:** none found
- **Branch:** `repro/10483` — pushed to `vaadin/web-components`
- **Reproduced on:** vaadin/web-components @ `main` (25.4.0-alpha3, cb9b2fcdf8)
- **Present on main?:** yes (still broken)
- **Theme / Browser:** base / Chromium (Playwright) on macOS
- **Screenshot** (static bug): ![Drag via edit column: no grid-dragstart, drop has dragged=null](https://raw.githubusercontent.com/vaadin/web-components/ed69f148f0246fce4f67aa14aab1d337529306e9/repro-10483.png)

## Observed behavior

On macOS (`navigator.platform` = `MacIntel`, `_focusButtonMode: true`), dragging row "Alpha" onto "Charlie":

```
--- drag via plain column
grid-dragstart: Alpha
grid-drop: target=Charlie above, dragged=Alpha
grid-dragend
--- drag via edit column
grid-drop: target=Charlie above, dragged=null
grid-dragend
```

The edit-column drag fires no `grid-dragstart`, so the drop handler has no dragged items. The edit cell DOM is `td > div[role=button].editable-cell > slot`, and `slot.parentNode.parentNode` resolves to `td` instead of `tr`.

Control: spoofing `navigator.platform` to `Win32` disables focus button mode (`td > slot`), and both columns fire `grid-dragstart: Alpha`.

## Expected behavior

Dragging a row by an edit-column cell works the same as by a plain column, on all platforms.

## Steps to reproduce

1. On macOS, open `dev/repro-10483.html`.
2. Drag the "Alpha" row by its "Title (edit)" cell and drop it on "Charlie".
3. The log shows `grid-drop` with `dragged=null` and no `grid-dragstart`.
4. Repeat by the "Position (plain)" cell: `grid-dragstart` fires as expected.

## Reproduction

How to run: start the dev server (`yarn start`) and open the page below.

- **Route / page:** `http://localhost:8000/dev/repro-10483.html`
- **Scaffold:** `dev/repro-10483.html` (committed on this branch)

```html
<vaadin-grid-pro id="grid" rows-draggable drop-mode="between" all-rows-visible>
  <vaadin-grid-column header="Position (plain)" path="title"></vaadin-grid-column>
  <vaadin-grid-pro-edit-column header="Title (edit)" path="title"></vaadin-grid-pro-edit-column>
</vaadin-grid-pro>
<script type="module">
  grid.items = ['Alpha', 'Bravo', 'Charlie', 'Delta'].map((title) => ({ title }));
  grid.addEventListener('grid-dragstart', (e) => console.log('dragstart', e.detail.draggedItems));
  grid.addEventListener('grid-drop', (e) => console.log('drop', e.detail.dropTargetItem));
</script>
```

## Root cause (suspected)

`_onDragStart` resolves the row with a fixed two-level `parentNode` walk from the cell content's assigned slot. With the focus button wrapper it lands on the `<td>`, fails the `row.parentNode !== this.$.items` check, and returns silently:

https://github.com/vaadin/web-components/blob/cb9b2fcdf8fcc8ba4ce40dc1dadcb2aaafc72cd5/packages/grid/src/vaadin-grid-drag-and-drop-mixin.js#L148-L157

The wrapper is added when the column has `_focusButtonMode`:

https://github.com/vaadin/web-components/blob/cb9b2fcdf8fcc8ba4ce40dc1dadcb2aaafc72cd5/packages/grid/src/vaadin-grid-mixin.js#L401-L413

Grid Pro enables it on Mac only:

https://github.com/vaadin/web-components/blob/cb9b2fcdf8fcc8ba4ce40dc1dadcb2aaafc72cd5/packages/grid-pro/src/vaadin-grid-pro-edit-column-mixin.js#L115-L118

Likely fix: resolve the row with `closest('tr')` from the slot (or walk up until `parentNode === this.$.items`). This affects any column with `_focusButtonMode`, not only Grid Pro edit columns. Pure web component bug, no Flow involvement.

## Notes

- Matches the reporter's analysis in the issue exactly.
- Tested in Chromium only. Safari takes the same code path (`_safari` branch runs after the early return).
