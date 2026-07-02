<!-- Edit any field. This file is committed on the `repro/<issue>` branch and posted as the issue comment. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced
- **Hypothesis tested:** The bug is that the resize handles overlap the content's scrollbar, triggered by high browser zoom, observable as the resize handle fully covering the scrollbar so clicks/drags on it start a resize instead of scrolling.
- **Branch:** `repro/8584` — pushed to `vaadin/web-components`
- **Reproduced on:** web-components @ `main` (25.3.0-alpha1)
- **Present on main?:** yes (still broken)
- **Theme / Browser:** Lumo / Chromium (Playwright)
- **Screenshot** (static bug): the red strip is the `e` edge resize handle; at 400% zoom it fully covers the right-edge scrollbar.

![Resize handle covering the scrollbar at 400% zoom](https://raw.githubusercontent.com/vaadin/web-components/4b32a3b1e5/repro-8584.png)

## Observed behavior

Opening a resizable dialog and zooming the browser to 400% puts the east (`e`) edge resize handle directly on top of the content's vertical scrollbar. A hit-test at the center of the scrollbar returns the resize handle, and its cursor is `ew-resize`:

```
elementUnderScrollbar: "edge resizer e", cursor: "ew-resize"
```

Because the resize handle sits on top, mouse clicks and drags over the scrollbar start a dialog resize instead of scrolling — matching the report.

The cause is a fixed-vs-scaled size mismatch. The scrollbar stays a constant ~15px at every zoom level, but the edge resize handle scales with zoom, so it reaches ever deeper inside the dialog border:

| Zoom | Scrollbar width | `e` resizer width | Reach inside border | Scrollbar covered |
| ---- | --------------- | ----------------- | ------------------- | ----------------- |
| 100% | 15px            | 8px               | 4px                 | 27% (grabbable)   |
| 200% | 15px            | 16px              | 8px                 | 53%               |
| 400% | 15px            | 32px              | 16px                | **100% (blocked)** |

At 400% the handle reaches 16px inside the border, which is wider than the 15px scrollbar, so the handle covers the scrollbar completely.

> Note: on macOS the default scrollbar is an overlay one that takes no layout space, so `scrollbar-gutter: stable` was set on the content while measuring to reveal the scrollbar the reporter sees on Windows. The handle-over-scrollbar overlap is inherent to the layout and does not depend on that.

## Expected behavior

The scrollbar should stay clickable and draggable at any zoom level in all browsers.

## Steps to reproduce

1. Open a resizable dialog whose content is tall enough to scroll.
2. Set browser zoom to 400% (Ctrl and +).
3. Move the mouse over the vertical scrollbar at the dialog's right edge — the cursor turns into the resize cursor.
4. Try to scroll by clicking/dragging the scrollbar — a resize starts instead (Chrome/Edge), or resize and scroll happen together (Firefox).

## Reproduction

How to run: `yarn start`, open the route below, then zoom the browser to 400% (or run `document.documentElement.style.zoom = '4'`).

- **Route / page:** `dev/repro-8584.html`
- **Scaffold:** `dev/repro-8584.html`

```html
<vaadin-button>Open dialog</vaadin-button>
<script type="module">
  import '@vaadin/dialog';
  import '@vaadin/button';

  const dialog = document.createElement('vaadin-dialog');
  dialog.headerTitle = 'Resizable dialog';
  dialog.resizable = true;
  dialog.draggable = true;
  document.body.appendChild(dialog);

  dialog.renderer = (root) => {
    if (root.firstChild) return;
    const container = document.createElement('div');
    container.style.width = '20em';
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('p');
      p.textContent = i + ': Lorem ipsum dolor sit amet, consectetur adipisicing elit.';
      container.appendChild(p);
    }
    root.appendChild(container);
  };

  document.querySelector('vaadin-button').addEventListener('click', () => {
    dialog.opened = true;
  });
</script>
```

## Root cause (suspected)

The edge resize handles are absolutely positioned with a fixed `inset: -4px` and a fixed `width`/`height`, so they sit partly on top of the scrollable content. These lengths are in CSS pixels that scale with browser zoom, while the scrollbar width does not — so at high zoom the `e`/`w` handles reach far enough inside the border to cover the scrollbar entirely and steal its pointer events:

https://github.com/vaadin/web-components/blob/2ce57738e7d11eb4ec801f774533f4032c6c5f7d/packages/dialog/src/styles/vaadin-dialog-overlay-base-styles.js#L207-L259

## Notes

- Measured with `document.documentElement.style.zoom` to emulate browser zoom; the same overlap is visible with real Ctrl+ zoom.
- No matching open/closed issue found (`gh search issues "dialog resizable scrollbar" / "dialog zoom resize"`), so this is not a duplicate.
