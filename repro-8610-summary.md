<!-- Edit any field. This file is committed on the `repro/8610` branch and posted as the issue comment. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced (at the third level, which is the case the issue predicts: "probably with 3rd level overlapping the first")
- **Hypothesis tested:** The bug is that every sub-menu picks its horizontal side on its own, triggered by opening a nested sub-menu whose parent already flipped to the left near the right edge, observable as the deepest overlay opening to the right, on top of the menu two levels up.
- **Regression?:** not a regression — identical behavior on 24.7.0 (the reported version) and on current `main`
- **Fixed by:** n/a — still present
- **Duplicate of:** none found
- **Branch:** `repro/8610` — pushed to `vaadin/web-components`
- **Reproduced on:** vaadin/web-components @ `main` (25.3.0-alpha11, commit 1d2414c85e) and on published `@vaadin/menu-bar@24.7.0`
- **Present on main?:** yes (still broken)
- **Theme / Browser:** Lumo / Chromium via Playwright
- **Screenshot** (static bug): ![Third level sub-menu opening on top of the first level menu](https://raw.githubusercontent.com/vaadin/web-components/<commit-sha>/repro-8610.png)

## Observed behavior

Menu bar at the right edge of a 900px wide window, items `Share > On social media > Facebook > (Post, Story)`. Measured overlay boxes:

| Level | Content | `end-aligned` | left–right |
| --- | --- | --- | --- |
| 1 | On social media | yes | 709–898 |
| 2 | Facebook / Twitter / Instagram | yes | 564–709 (opens left, correct) |
| 3 | Post / Story | **no** | **709–805 (opens right, covers level 1)** |

The third level flips back to the right because its own parent menu ends at x=709, which leaves 191px of free space — enough for a 97px wide menu. It then covers the level 1 menu, which occupies exactly that area (see screenshot: only "media" of "On social media" stays visible).

A `vaadin-context-menu` with the same nested items at the right edge behaves identically: levels at 701–890 (end-aligned), 556–701 (end-aligned), 701–797 (start-aligned, covering level 1).

Control on the same page: the same menu bar at the left edge opens all three levels to the right (2–191, 191–336, 336–432), no overlap.

## Expected behavior

Sub-menus keep opening in the direction the chain started with, and only change direction again when the opposite edge is hit.

## Steps to reproduce

1. Open the page below in a window about 900px wide.
2. Click the "Share" button of the menu bar at the right edge.
3. Hover "On social media" — the sub-menu correctly opens to the left.
4. Hover "Facebook" — the third level opens to the right, on top of the first level menu.
5. The menu bar at the left edge is the control: every level opens to the right.

## Reproduction

How to run: start the dev server (`yarn start:lumo`) and open the page below.

- **Route / page:** `http://localhost:8000/dev/repro-8610.html`
- **Scaffold:** `dev/repro-8610.html` (committed on this branch)

```js
const items = [
  {
    text: 'Share',
    children: [
      {
        text: 'On social media',
        children: [
          { text: 'Facebook', children: [{ text: 'Post' }, { text: 'Story' }] },
          { text: 'Twitter' },
          { text: 'Instagram' },
        ],
      },
    ],
  },
];
```

## Root cause (suspected)

Each sub-menu overlay is positioned by `PositionMixin` against its own parent item, and `__shouldAlignStartHorizontally()` only compares the space on both sides of that item. It does not know which side the chain of parent overlays is already using, so as soon as one level leaves enough room on the other side, the next level flips back:

https://github.com/vaadin/web-components/blob/1d2414c85ec60fbf1a270c6236a43f2dde368d49/packages/overlay/src/vaadin-overlay-position-mixin.js#L327-L345

The menu overlay already does a comparable parent-aware adjustment for the vertical axis, where `getBoundaries()` shifts the limit when the parent overlay is `bottom-aligned`; there is no horizontal counterpart:

https://github.com/vaadin/web-components/blob/1d2414c85ec60fbf1a270c6236a43f2dde368d49/packages/context-menu/src/vaadin-menu-overlay-mixin.js#L116-L141

A fix would make a nested overlay keep the side its `parentOverlay` uses, and only flip when that side no longer has room.

## Notes

- The issue text describes the *second* level overlapping. With the widths in the issue's example the second level flips correctly on both 24.7.0 and `main` — the first configuration where the defect becomes visible is the third level, which is what the issue predicts as untested.
- Both `vaadin-menu-bar` and `vaadin-context-menu` are affected; they share the sub-menu positioning code.
- The dev page contains all three cases: menu bar at the right edge (failing), menu bar at the left edge (control), and a context menu at the right edge.
