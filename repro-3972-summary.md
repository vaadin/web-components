<!-- Edit any field. This file is committed on the `repro/3972` branch and posted as the issue comment. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced — but only in quirks mode (the example in the issue has no `<!doctype html>`)
- **Hypothesis tested:** The bug is the context menu placing its overlay with a wrong viewport height, triggered by opening the menu near the bottom edge of the window on a page without a doctype, observable as the menu collapsing into a 2px sliver at the pointer instead of opening upwards.
- **Regression?:** not a regression (broken since the alignment logic was introduced; reproduced on 23.0.11 and on current `main`)
- **Fixed by:** n/a — still present
- **Duplicate of:** none found (#8759 / PR #9329 look similar but are the flicker-before-render bug, a different cause)
- **Branch:** `repro/3972` — pushed to `vaadin/web-components`
- **Reproduced on:** vaadin/web-components @ `main` (25.3.0-alpha11, commit 1d2414c85e) and on published `@vaadin/context-menu@23.0.11`
- **Present on main?:** yes (still broken)
- **Theme / Browser:** Lumo and base (both) / Chromium via Playwright
- **Screenshot** (static bug): ![Context menu collapsed to a 2px sliver at the pointer](https://raw.githubusercontent.com/vaadin/web-components/cf7aa10dd7c5da95e080bcbadd4c755a3acb7a08/repro-3972.png)

## Observed behavior

Right clicking a target at the bottom edge of the window opens the overlay with `style.top = 682px` (the pointer position) and **no** `bottom-aligned` attribute, so the menu is squeezed into the 18px that are left below the pointer. Measured content box of the overlay:

| Case | overlay style | `bottom-aligned` | content height |
| --- | --- | --- | --- |
| control (space below) | `top: 12px` | no | 116px (correct) |
| target at bottom edge | `top: 682px` | no | **2px** (Lumo) / 10px (base) |

The same page **with** a doctype places the menu correctly in every position (`bottom: 16px`, `bottom-aligned`, full 116px height), including 72 automated combinations of window height, scroll method and distance to the bottom edge.

Page environment while failing: `document.compatMode: BackCompat`, `document.documentElement.clientHeight: 1948`, `window.innerHeight: 700`.

## Expected behavior

The context menu should be positioned relative to the target: when there is not enough space below the pointer, it should open upwards (`bottom-aligned`) at full height.

## Steps to reproduce

1. Open the page below (it has no doctype, exactly like the example in the issue) with a window height of about 700px.
2. Scroll so that the lower button sits at the bottom edge of the window.
3. Right click that button.
4. The menu is a thin sliver at the pointer. Right clicking the upper button, which has space below it, opens a normal menu.

## Reproduction

How to run: start the dev server (`yarn start`, or `yarn start:lumo`) and open the page below.

- **Route / page:** `http://localhost:8000/dev/repro-3972.html`
- **Scaffold:** `dev/repro-3972.html` (committed on this branch)

```html
<!-- no doctype on purpose -->
<html>
  <body style="margin: 0">
    <div style="padding: 900px 0 1000px">
      <vaadin-context-menu id="menu-bottom">
        <button id="target-bottom">Right click me (no space below)</button>
      </vaadin-context-menu>
    </div>
  </body>
</html>
```

## Root cause (suspected)

`__alignOverlayPosition()` reads the viewport size from `document.documentElement.clientWidth / clientHeight`. In quirks mode those return the size of the document (1948px here), not of the window (700px), so `y < hghtVport / 2` stays true even for a pointer at the bottom edge and the overlay is top-aligned at the pointer with almost no room left:

https://github.com/vaadin/web-components/blob/1d2414c85ec60fbf1a270c6236a43f2dde368d49/packages/context-menu/src/vaadin-context-menu-mixin.js#L546-L575

Every other positioned overlay already guards against this by taking the smaller of the two values, e.g. in `PositionMixin`:

https://github.com/vaadin/web-components/blob/1d2414c85ec60fbf1a270c6236a43f2dde368d49/packages/overlay/src/vaadin-overlay-position-mixin.js#L347-L355

Using the same `Math.min(window.innerHeight, document.documentElement.clientHeight)` in the context menu would make it behave the same in both modes.

## Notes

- Applications should use a doctype, so this may be considered an application-side problem. It is cheap to make the component robust here, and the fix is one line per axis using an idiom that already exists in the repo.
- With a doctype the menu was verified correct on `main` in both themes and on 23.0.11 across 72 combinations of window height (520/600/700/878), scroll method (programmatic, wheel, wheel with an immediate click) and gap to the bottom edge (2–130px), so the "lack of bottom space" alone does not break the positioning.
- The video in the issue matches this failure: the menu appears as a thin strip instead of a menu.
- #8759 ("flicker when the menu has to be rendered to the left"), fixed by #9329, is a different bug — there the final position is correct and only the frames before the content renders are wrong.
