<!-- Edit any field. This file is committed on the `repro/<issue>` branch and posted as the issue comment. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced (real, observable behavior; effectively a design limitation — the issue asks to expand these zones)
- **Hypothesis tested:** The bug is that the "between-rows" drop zone touching a drop-disabled row shrinks to half height, triggered by `dropMode="between"` plus a `dropFilter` that disallows a row, observable as no drop being possible over the disabled row's bordering half so the adjacent gap's active area is halved.
- **Branch:** [`repro/1524`](https://github.com/vaadin/web-components/tree/repro/1524) — pushed to `vaadin/web-components`
- **Reproduced on:** web-components @ `25.2.0-beta1` (current `main`)
- **Present on main?:** yes (still present)
- **Theme / Browser:** base / Chromium (Playwright)

## Observed behavior

Grid rows (each 33px tall): Alpha `107–140`, **Main `140–173` (drop-disabled)**, Beta `173–206`, Gamma `206–240`.

Dispatching `dragover` across the Y range and reading the resulting drop location:

| Cursor Y band | Active drop zone | Height |
| --- | --- | --- |
| Alpha bottom half (124–139) | drop **below** Alpha | ~16px |
| **Main (140–172), entire row** | **none — no drop possible** | 33px |
| Beta top half (176–188) | drop **above** Beta | ~16px |
| Beta bottom half (192–205) + Gamma top half (208–220) | drop **below** Beta / **above** Gamma | ~26px |

The gap between Beta and Gamma collects drop area from *both* adjacent half-rows (~full row height). The gaps touching "Main" (Alpha↔Main and Main↔Beta) lose the half contributed by the disabled row, so each shrinks to ~half. The disabled row's whole height is dead.

## Expected behavior

The drop zone for the first allowed row after a disabled row should expand to also cover "below" the disabled row (and the last allowed row before a disabled row should expand to cover "above" it), so the user-facing drop area stays the same size as a normal between-rows gap. The reported drop information should not change.

## Steps to reproduce

1. Create a grid with `rowsDraggable`, `dropMode = 'between'`.
2. Set a `dropFilter` that returns `false` for one row in the middle (here, `"Main"`).
3. Drag a row and move the cursor through the gap just above/below the disabled row: a drop indicator only appears over the allowed row's half, not over the disabled row's bordering half — the reachable drop area is half that of a normal gap.

## Reproduction

How to run: `yarn start`, then open the route below.

- **Route / page:** `dev/repro-1524.html`
- **Scaffold:** `dev/repro-1524.html`

```html
<vaadin-grid id="grid" style="height: 240px">
  <vaadin-grid-column path="name" header="Name"></vaadin-grid-column>
</vaadin-grid>

<script type="module">
  import '@vaadin/grid';
  import '@vaadin/grid/vaadin-grid-column.js';

  const grid = document.getElementById('grid');
  grid.items = [{ name: 'Alpha' }, { name: 'Main' }, { name: 'Beta' }, { name: 'Gamma' }];
  grid.rowsDraggable = true;
  grid.dropMode = 'between';
  grid.dropFilter = (model) => model.item.name !== 'Main';
</script>
```

## Screenshot

The strip overlaid on the grid colors each cursor-Y pixel by its active drop zone (green = drop above, blue = drop below, red = no drop). "Main" is fully red, and the green zone above "Beta" is half-height compared with the full Beta↔Gamma gap below it.

![Drop-zone bands: disabled "Main" row is fully dead and adjacent zones are halved](https://raw.githubusercontent.com/vaadin/web-components/COMMIT_SHA/repro-1524.png)

## Root cause (suspected)

`packages/grid/src/vaadin-grid-drag-and-drop-mixin.js:274-276` and `:286-288` (`_onDragOver`).

In `between` mode the drop location is derived **only** from the cursor's position within the hovered row:

```js
const dropAbove = e.clientY - rowRect.top < rowRect.bottom - e.clientY;
this._dropLocation = dropAbove ? DropLocation.ABOVE : DropLocation.BELOW; // :275-276
```

and when the hovered row is drop-disabled the handler bails out completely:

```js
if (row?.hasAttribute('drop-disabled')) {
  this._dropLocation = undefined; // :287
  return;
}
```

There is no logic to redirect the disabled row's bordering half to the adjacent allowed row's gap (e.g. the bottom half of a disabled row → "above the next allowed row"). So every gap that touches a disabled row loses one half-row of drop area.

## Notes

- This matches the issue's own screenshot: drop areas next to a disallowed row are smaller.
- It is real, current behavior, but strictly speaking the component does what the code specifies — the fix is the enhancement requested in the issue (expand the bordering zones). Flagged as "reproduced" because the described symptom is fully observable.
