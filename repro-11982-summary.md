<!-- Edit any field. This file is committed on the `repro/<issue>` branch and posted as the issue comment. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced (the unwanted collapse described in the issue)
- **Hypothesis tested:** The bug is a single icon-only menu-bar item collapsing into the overflow menu, triggered by the item's rendered width fractionally exceeding the container (sub-pixel rounding at a non-default browser zoom), observable as the overflow ellipsis button becoming visible and holding the only item — a nested "ellipsis inside ellipsis".
- **Branch:** [`repro/11982`](https://github.com/vaadin/web-components/tree/repro/11982) — pushed to `vaadin/web-components`
- **Reproduced on:** web-components @ `repro/11982` (current `main` line, menu-bar `25.3.0-alpha0`)
- **Present on main?:** yes (still broken)
- **Theme / Browser:** Base / Chromium (Playwright)

![menu-bar collapses its only item into the overflow ellipsis; opening it reveals the original item nested one level deeper](https://raw.githubusercontent.com/vaadin/web-components/f92df47dd10e450e6e251931ac51605b35a11a61/repro-11982.png)

## Observed behavior

A menu-bar with a single icon-only top-level item is rendered in a container that the item visually fits. At a non-default browser zoom (1.1), the only item is collapsed into the overflow menu even though it fits:

- `container.offsetWidth = 61`, `container.scrollWidth = 62` → overflow check fires
- but the true (fractional) widths are `container = 67.48px`, `item = 67.97px` — the item overflows by only **0.49px**, which is invisible on screen
- result: the overflow ellipsis button is visible, the real item is hidden, and opening the overflow reveals the original item nested one level deeper (overflow ellipsis → original item → its children)

Console is clean (only dev-server noise: favicon 404 + Lit dev-mode warning).

This matches the reporter's screenshots: an overflow ellipsis button that contains the user's own ellipsis button, which then contains the actual options.

## Expected behavior

The single item should stay visible — it visually fits, overflowing by less than a pixel.

## Steps to reproduce

1. Create a `vaadin-menu-bar` with a single icon-only top-level item that has children.
2. Constrain its width to just around the item's natural width.
3. View the page at a non-default browser zoom (e.g. 110%).
4. Observe the only item collapse into the overflow ellipsis; open it to see the original item nested inside.

## Reproduction

How to run: start the server (`yarn start`) and open the route below.

- **Route / page:** `dev/repro-11982.html`
- **Scaffold:** `dev/repro-11982.html` (committed on this branch)

```html
<!-- zoom: 1.1 creates the fractional width; width is tuned to the item's natural size -->
<div style="zoom: 1.1; display: inline-block">
  <vaadin-menu-bar id="bar" style="width: 61.35px"></vaadin-menu-bar>
</div>
<script type="module">
  import '@vaadin/menu-bar';
  import '@vaadin/icon';
  import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';

  const item = document.createElement('vaadin-menu-bar-item');
  const icon = document.createElement('vaadin-icon');
  icon.setAttribute('icon', 'lumo:ellipsis-v');
  icon.style.width = icon.style.height = '16px';
  item.appendChild(icon);

  document.querySelector('#bar').items = [
    { component: item, children: [{ text: 'Download report' }, { text: 'Download error report' }] },
  ];
</script>
```

## Root cause (suspected)

The overflow check compares **integer-rounded** `offsetWidth` against `scrollWidth`. When the container's true width is fractionally just below the content's true width, `offsetWidth` rounds down and `scrollWidth` rounds up, so the check fires for a sub-pixel overflow that is not visible — collapsing the only item.

https://github.com/vaadin/web-components/blob/f92df47dd10e450e6e251931ac51605b35a11a61/packages/menu-bar/src/vaadin-menu-bar-mixin.js#L502-L504

## Notes

- `min-width: max-content` (the reporter's CSS workaround) avoids it at 100% zoom because the host then never reports a width below the content; the sub-pixel mismatch can still appear when a surrounding layout constrains the width at non-default zoom.
