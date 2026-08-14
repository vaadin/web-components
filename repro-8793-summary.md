> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced
- **Hypothesis tested:** The bug is that the overlay fit calculation decides a tooltip "fits" on its default side when it does not, triggered by a target whose free space on that side is between the tooltip content height and the content height plus the tooltip offset, observable as the tooltip staying on the cramped side with a vertical scrollbar and clipped text instead of flipping to the opposite side.
- **Regression?:** not a regression (broken since the fit logic was introduced — `__shouldAlignStart` predates the `vaadin-overlay` → `overlay` package move in #4750)
- **Fixed by:** n/a
- **Duplicate of:** none found
- **Branch:** `repro/8793` — pushed to `vaadin/web-components`
- **Reproduced on:** vaadin/web-components @ `main` (25.3.0-alpha11) **and** on the reporter's live app (StarPass, Vaadin 24.5.0-beta1)
- **Present on main?:** yes (still broken)
- **Theme / Browser:** Lumo / Chromium (Playwright)
- **Screenshot** (static bug): ![Tooltip below a bottom toolbar, clipped, with an internal scrollbar](https://raw.githubusercontent.com/vaadin/web-components/COMMIT_SHA/repro-8793.png)

## Observed behavior

A tooltip whose target sits close to the bottom viewport edge stays **below** the target (`top-aligned`) even though the gap there is too small. The overlay part is squeezed, `overflow: auto` kicks in, and the user sees a scrollbar and clipped text.

Measured on `dev/repro-8793.html` at a 900×500 viewport (Lumo):

| case | side | `clientHeight` | `scrollHeight` | scrollbar |
| --- | --- | --- | --- | --- |
| control button (middle of page) | below | 26 | 26 | no |
| button in bottom toolbar | below | **24** | **26** | **yes** |
| menu-bar in bottom toolbar | below | **24** | **26** | **yes** |

Measured on the reporter's live app (`https://starpass.demo.vaadin.com/admin/users`, 1280×500, select a row → hover the ★ button in the selection toolbar):

```
text: "Add to favorites"   position: bottom   top-aligned (below target)
target:  top 434  bottom 468
overlay: top 468  bottom 500 (= viewport bottom)
part:    clientHeight 28   scrollHeight 30   -> scrollbar
```

The failure only happens inside a narrow band of available space. Sweeping the toolbar's distance from the bottom edge in 1px steps on `main`:

```
spaceBelow=42  above  client=26 scroll=26  ok
spaceBelow=43  below  client=23 scroll=26  SCROLLBAR
spaceBelow=44  below  client=24 scroll=26  SCROLLBAR
spaceBelow=45  below  client=25 scroll=26  SCROLLBAR
spaceBelow=46  below  client=26 scroll=26  ok
```

Console is clean (only the Lit dev-mode warning from the dev server).

## Expected behavior

No scrollbar. When the tooltip does not fit on its default side, it should flip to the opposite side (as it does for every other amount of free space).

## Steps to reproduce

1. Put a target element close to the bottom viewport edge, so the free space below it is a few pixels larger than the tooltip's content height but smaller than content height + the tooltip offset (`--vaadin-tooltip-offset-top`, 4px by default).
2. Give it a `<vaadin-tooltip>` with the default `position="bottom"`.
3. Hover the target.
4. The tooltip opens below the target, clipped, with a vertical scrollbar, instead of flipping above it.

Live equivalent: open `https://starpass.demo.vaadin.com/admin/users` in a ~500px-tall window, select a user row, and hover the icons in the selection toolbar that appears near the bottom.

## Reproduction

How to run: `yarn start:lumo`, then open the page below and resize the window to about 500px tall.

- **Route / page:** `http://localhost:8000/dev/repro-8793.html`
- **Scaffold:** `dev/repro-8793.html` (committed on this branch)

```html
<!-- Floating toolbar near the bottom viewport edge, like the StarPass selection toolbar -->
<div id="bottom-toolbar" style="position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); padding: 8px 12px">
  <vaadin-button id="bottom-btn" theme="icon">
    ★
    <vaadin-tooltip slot="tooltip" hover-delay="0" hide-delay="0" text="Add to favorites"></vaadin-tooltip>
  </vaadin-button>
</div>
```

The page prints a live readout of `clientHeight` / `scrollHeight` of the tooltip's `[part="overlay"]`, so the scrollbar condition is visible without opening devtools.

## Root cause (suspected)

`PositionMixin.__shouldAlignStartVertically` measures the available space against `this.$.overlay.offsetHeight`, which has two problems:

1. **It ignores the offset margin.** The tooltip adds `margin-top: var(--vaadin-tooltip-offset-top, 4px)` to `[part="overlay"]` when top-aligned, so the part actually needs `contentHeight + 4px` on that side. The fit check only compares against `contentHeight`, so a gap of `contentHeight + 1..3px` passes the check but cannot hold the tooltip.
2. **The measurement is self-referential.** `offsetHeight` is read *after* the overlay has already been constrained by the host box, so once the tooltip is squeezed it reports the squeezed height and the check keeps confirming "it fits". In the failing case the mixin compared `spaceForStart = 28` against `contentSize = 24` (the squeezed height) rather than the natural 26.

https://github.com/vaadin/web-components/blob/1d2414c85ec60fbf1a270c6236a43f2dde368d49/packages/overlay/src/vaadin-overlay-position-mixin.js#L347-L381

The offset margins that are not accounted for:

https://github.com/vaadin/web-components/blob/1d2414c85ec60fbf1a270c6236a43f2dde368d49/packages/tooltip/src/styles/vaadin-tooltip-overlay-base-styles.js#L36-L45

The scrollbar itself comes from `overflow: auto` on the overlay part, which is correct for large overlays but makes this positioning miss look like a sizing bug:

https://github.com/vaadin/web-components/blob/1d2414c85ec60fbf1a270c6236a43f2dde368d49/packages/overlay/src/styles/vaadin-overlay-base-styles.js#L59-L69

## Notes

- The same band exists at the top edge and for `position="top"`; bottom is just where real layouts (fixed/floating toolbars) hit it.
- @rolfsmeds' question in the issue: this is **not** StarPass-specific. It reproduces with a plain `<vaadin-button>` and with `<vaadin-menu-bar>` on a bare dev page, with and without `position: fixed` on the container. The custom theme is not involved.
- @yuriy-fix's comment matches: adding indentation or a fixed position to the menu-bar dev page moves the menu bar into this band. It only reproduces for particular offsets, which is why it looks intermittent.
- Because the band is only ~3-4px wide (the size of the tooltip offset), it is easy to miss when testing by hand — the sweep above is the reliable way to hit it.
- The `overflow: hidden` idea from the issue would hide the scrollbar but still clip the text; fixing the fit calculation makes the tooltip flip and show in full.
