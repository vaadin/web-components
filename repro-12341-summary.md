> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced
- **Hypothesis tested:** The bug is an animated month-scroller scroll that starts while the overlay is still closed, triggered by tapping the input (which focuses and immediately blurs it, re-committing the selected date), observable as a `scroll-animation-finished` event with a large non-zero delta and a calendar that visibly slides into place while opening.
- **Regression?:** not a regression (broken since introduction) — both halves of the mechanism date back to `refactor!: move vaadin-date-picker to date-picker` (#2638) and `experiment: add Lit version of date-picker overlay content` (#6273)
- **Fixed by:** n/a
- **Duplicate of:** none found (#12116 "overlay scrolls just before closing" is a different bug, fixed by #12117 via `overflow-anchor`)
- **Branch:** `repro/12341` — pushed to `vaadin/web-components`
- **Reproduced on:** vaadin/web-components @ `main` (25.3.0-alpha9)
- **Present on main?:** yes (still broken)
- **Theme / Browser:** base / WebKit **and** Chromium, both with mobile emulation (402×681)
- **Screenshot** (mid-scroll, wrong month visible while opening): ![date-picker overlay showing May 2012 while opening, before scrolling to the selected February 2026](https://raw.githubusercontent.com/vaadin/web-components/<commit-sha>/repro-12341.png)
- **Demo video** (motion bug): `repro-12341-scroll-on-open.webm` (on the branch; drag into the comment for inline playback)

## Observed behavior

In fullscreen mode, opening the picker **by tapping the input** makes the calendar smooth-scroll into place instead of appearing already positioned at the selected month.

The reproduction page instruments the `scroll-animation-finished` event, which the overlay content only dispatches when `_scrollToPosition()` ran an *animated* scroll. Tapping the input logs:

```
with-value: opened (fullscreen=true)
with-value: scroll-animation-finished -1997.03 -> -6.84 (delta 1990.19 months)
```

Sampling `_monthScroller.position` every frame traces the easing curve, confirming visible motion rather than an instant jump:

```
-1998.03 → -1833.39 → -1462.63 → -665.44 → -236.23 → -28.26 → -6.84
```

The attached screenshot is a frame captured ~110 ms into the open: the calendar shows **May/June 2012** (year scroller at 1995–2000) on its way to the selected **February 2026**.

A four-way comparison isolates the trigger exactly — only the first case scrolls:

| Case | Animated scroll? |
| --- | --- |
| tap **input**, date selected, fullscreen | **yes — delta 1990 months** |
| tap **toggle button**, date selected, fullscreen | no |
| tap input, **no date selected**, fullscreen | no |
| tap input, date selected, **not fullscreen** (900×800) | no |

Console is clean apart from the usual Lit dev-mode warning.

**This is not iOS-specific.** It reproduces identically in Chromium and WebKit with a plain narrow viewport, with no `_ios` override — fullscreen mode alone is enough, because `_noInput` is already true there. iOS just always hits fullscreen mode on a phone.

## Expected behavior

The overlay is already scrolled to the correct position when it opens; no scrolling happens.

## Steps to reproduce

1. Open the page with the browser viewport narrower than 450px (fullscreen mode).
2. Tap the input of the picker that has a date selected, so the overlay opens (this first open creates the overlay content).
3. Close the overlay.
4. Tap the input again — the calendar scrolls into place while opening.
5. Repeat with the toggle button instead of the input: no scrolling.

Step 2 is only needed because the overlay content does not exist before the first open, so the early `revealDate()` call has nothing to act on. In a real application the content is already there, so every input tap shows the scroll.

## Reproduction

How to run: start the dev server (`yarn start`) and open the page below in a viewport narrower than 450px.

- **Route / page:** `http://localhost:8000/dev/repro-12341.html`
- **Scaffold:** `dev/repro-12341.html` (committed on this branch)

```html
<!-- A month far from today, so the unwanted scroll is easy to see. -->
<vaadin-date-picker id="with-value" label="With value" value="2026-02-11"></vaadin-date-picker>
<vaadin-date-picker id="no-value" label="No value"></vaadin-date-picker>

<script type="module">
  import '@vaadin/date-picker';

  // Only dispatched when _scrollToPosition() ran an animated scroll.
  // A non-zero delta here is the bug: the overlay scrolls while opening.
  for (const picker of document.querySelectorAll('vaadin-date-picker')) {
    picker.addEventListener('scroll-animation-finished', (e) => {
      const { position, oldPosition } = e.detail;
      console.log(`${picker.id}: ${oldPosition.toFixed(2)} -> ${position.toFixed(2)}`);
    });
  }
</script>
```

## Root cause (suspected)

The full chain, captured from a stack trace of the offending `revealDate()` call (`opened === false` at that point):

```
_onFocus → event.target.blur() → _onBlur → __commitParsedOrFocusedDate → __commitDate
  → _selectedDateChanged → _focusedDate = selectedDate
  → __updateOverlayContent → overlayContent.focusedDate = …
  → _focusedDateChanged → revealDate(date, animate = true)   ← overlay still closed
```

1. In fullscreen mode `_noInput` is true, so tapping the input focuses it and `_onFocus` immediately blurs it again:

https://github.com/vaadin/web-components/blob/8d54b43dd8214fcc17f0818d7d2cb31d26424e04/packages/date-picker/src/vaadin-date-picker-mixin.js#L456-L462

2. That blur re-commits the parsed date, which assigns a **new `Date` instance** to `_selectedDate`. It propagates to `overlayContent.focusedDate`, whose observer calls `revealDate()` with `animate = true` — with no check that the overlay is open. The month scroller is still detached from the last close, so its `position` reads garbage (≈ −1998 months, i.e. year 1860), and the animation starts from there:

https://github.com/vaadin/web-components/blob/8d54b43dd8214fcc17f0818d7d2cb31d26424e04/packages/date-picker/src/vaadin-date-picker-overlay-content-mixin.js#L491-L494

3. `_onOverlayOpened()` then does the right thing — two *non-animated* `scrollToDate()` calls that should snap the scroller to the selected month:

https://github.com/vaadin/web-components/blob/8d54b43dd8214fcc17f0818d7d2cb31d26424e04/packages/date-picker/src/vaadin-date-picker-mixin.js#L1018-L1033

4. …but they are swallowed. `_scrollToPosition()` returns early whenever an animation is in flight, only retargeting it, so the `animate = false` argument is ignored and the running animation keeps easing to the new target instead of jumping:

https://github.com/vaadin/web-components/blob/8d54b43dd8214fcc17f0818d7d2cb31d26424e04/packages/date-picker/src/vaadin-date-picker-overlay-content-mixin.js#L649-L653

Opening with the toggle button never focuses the input, so steps 1–2 do not happen, the scroll animation is never started, and the non-animated `scrollToDate()` calls take effect normally.

## Notes

- The trace above was produced by patching `revealDate` / `scrollToDate` / `_scrollToPosition` on the live overlay content in the browser; the component sources were not modified.
- Related but distinct: #12116 (*overlay scrolls just before closing*, Chrome-only), fixed by #12117 by disabling `overflow-anchor` on the scroller. Different mechanism — that one was browser scroll anchoring, this one is the component's own scroll animation.
- Two plausible fix directions, both untested: skip `revealDate()` while the overlay is closed, or honour `animate = false` in `_scrollToPosition()` by cancelling an in-flight animation instead of retargeting it.
- At very short viewports (≈350px tall) the same animation also runs when opening with the toggle button, because `__useSubMonthScrolling` makes `revealDate()` scroll unconditionally.
