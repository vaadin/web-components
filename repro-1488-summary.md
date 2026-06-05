<!-- Edit any field. This file is committed on the `repro/1488` branch and posted as the issue comment. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced
- **Hypothesis tested:** Scrolling a nested grid inside a row-details cell to its end chains the scroll to the outer grid, triggered by continued wheel input at the inner grid's boundary, observable as the outer grid's `scrollTop` increasing after the inner grid is at its end.
- **Branch:** `repro/1488` — pushed to `vaadin/web-components`
- **Reproduced on:** web-components @ `25.2.0-beta1` (main line)
- **Present on main?:** yes (still present)
- **Theme / Browser:** base / Chromium (playwright-cli)
- **Demo video:** `repro-1488-scroll-chaining.webm` (on the branch; drag into the comment for inline playback)

## Observed behavior

With the mouse over the inner detail grid, wheel input scrolls the inner grid to its end (measured `scrollTop` 0 → 1534 over 13 steps, outer stays at 0). Once the inner grid is at its end, continued wheel input **chains to the outer grid**, which then scrolls (outer `scrollTop` 0 → 720). So you cannot keep the scroll confined to the grid under the cursor.

## Expected behavior

(From the report.) Scrolling should stay on the grid the mouse is over — reaching the inner grid's end should not start scrolling the outer grid.

## Steps to reproduce

1. Create a `vaadin-grid` with a `rowDetailsRenderer`.
2. In the details renderer, add another scrollable `vaadin-grid` (more rows than fit).
3. Open a row's details, hover the inner grid, and wheel-scroll it to its end.
4. Keep scrolling — the outer grid starts scrolling (scroll chaining).

## Reproduction

How to run: `yarn start`, then open the route below.

- **Route / page:** `http://localhost:8000/dev/repro-1488.html`
- **Scaffold:** `dev/repro-1488.html` (committed on this branch)

```js
const outer = document.querySelector('#outer');
outer.items = Array.from({ length: 50 }, (_, i) => ({ name: 'Row ' + i }));
outer.rowDetailsRenderer = (root) => {
  if (root.firstChild) return;
  const inner = document.createElement('vaadin-grid');
  inner.style.height = '150px';
  inner.items = Array.from({ length: 50 }, (_, i) => ({ name: 'Detail ' + i }));
  const col = document.createElement('vaadin-grid-column');
  col.path = 'name';
  inner.appendChild(col);
  root.appendChild(inner);
};
outer.detailsOpenedItems = [outer.items[0]];
```

## Root cause (suspected)

The grid scroller (`#table`) uses `overflow: auto` but does not set `overscroll-behavior`, so it inherits the browser default (`auto`) and wheel scrolling chains to ancestor scrollers at the boundary. Adding `overscroll-behavior: contain` to the scroller would keep the scroll on the grid under the cursor. Permalink (renders the lines inline):

https://github.com/vaadin/web-components/blob/404578730020b762d0866464e707d9136f27401c/packages/grid/src/styles/vaadin-grid-base-styles.js#L79-L88

## Notes

- This is the browser-default scroll-chaining behavior, so the report is effectively a request to set `overscroll-behavior: contain` on the grid scroller; the symptom itself is real and reproducible.
- Confirmed by measuring both scrollers' `scrollTop` while dispatching native wheel events over the inner grid (inner saturates at its max, then the outer begins to move).
