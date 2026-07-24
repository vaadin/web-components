<!-- Edit any field. This file is committed on the `repro/<issue>` branch and posted as the issue comment. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced (both reported issues)
- **Hypothesis tested:** The bug is that dialog drag-resize tracking stalls and then gets stuck, triggered by the pointer entering an `<iframe>` in the dialog content while resizing, observable as (1) the dialog freezing at the iframe edge while the mouse moves inside the iframe, and (2) resizing resuming after the mouse button was released over the iframe once the pointer leaves it.
- **Regression?:** not a regression (broken since introduction) — the reporter notes pre-Flow Vaadin 8 `Window` did not have this; the Lit/Polymer `vaadin-dialog` has behaved this way since it shipped.
- **Fixed by:** n/a (still present)
- **Duplicate of:** none found
- **Branch:** `repro/740` — pushed to `vaadin/web-components`
- **Reproduced on:** vaadin/web-components @ `chore/repro-skill-wc` (25.3.0-alpha7)
- **Present on main?:** yes (still broken)
- **Theme / Browser:** base / Chromium (playwright-cli)
- **Demo video** (motion bug): `repro-740.webm` (drag into the comment for inline playback)

## Observed behavior

Measured overlay size (width×height) through one SE-corner resize gesture, comparing the iframe dialog against a control dialog whose content is a plain `<div>`:

| Step | Control (`<div>`) | Iframe |
| --- | --- | --- |
| start | 296×196 | 296×199 |
| drag SE +60px (outside iframe) | 356×256 | 356×259 |
| drag onto content center | 153×103 | **274×196** |
| move again inside content | 183×133 | **274×196** (frozen) |
| release button + move away | 183×133 (unchanged ✓) | **446×349** (still resizing ✗) |

- **Issue 1 (freeze):** once the cursor crosses into the iframe, the control keeps tracking the mouse (shrinks to 153, then 183 as the mouse moves), but the iframe dialog stops at `274×196` and does not change no matter how the mouse moves inside the iframe.
- **Issue 2 (stuck resize):** after releasing the mouse button *over the iframe* and moving the pointer back out, the control stays fixed (`183×133`) while the iframe dialog resumes resizing and grows to `446×349` — resizing with no button held.

Console clean (only the dev-mode Lit warning and the favicon 404).

## Expected behavior

Resizing should track the pointer continuously even when it passes over iframe content, and must stop for good on `mouseup` regardless of what element the pointer is over.

## Steps to reproduce

1. Open a `modeless draggable resizable` `vaadin-dialog` whose renderer appends an `<iframe>`.
2. Grab the SE resize corner and drag so the cursor moves over the iframe area → resizing freezes.
3. Release the mouse button while the cursor is over the iframe.
4. Move the cursor back out of the iframe → the dialog keeps resizing though no button is pressed.

## Reproduction

How to run: start the dev server (`yarn start`) and open the page below.

- **Route / page:** `http://localhost:8000/dev/repro-740.html`
- **Scaffold:** `dev/repro-740.html` (committed on this branch)

```javascript
const dialog = document.querySelector('#dialog-iframe'); // modeless draggable resizable
dialog.renderer = (root) => {
  if (root.firstChild) return;
  const el = document.createElement('iframe');
  el.setAttribute('srcdoc', '<p>iframe content</p>');
  root.appendChild(el);
};
dialog.opened = true;
```

## Root cause (suspected)

Resize tracking is driven by `mousemove` / `mouseup` listeners attached to `window`. A cross-origin (or any) iframe consumes pointer events over its own area: while the cursor is inside the iframe the parent document receives no `mousemove` (→ freeze, Issue 1) and no `mouseup` (→ the stop listeners are never removed, so tracking silently continues once the pointer re-enters the parent, Issue 2). The classic fix is to overlay a transparent glass pane over the content during an active drag/resize so the parent keeps receiving pointer events (this is what Vaadin 8 `Window` did).

Listeners attached to `window` on resize start:

https://github.com/vaadin/web-components/blob/a3265b00f4cbdb79f902817788a5a05cedc9db7a/packages/dialog/src/vaadin-dialog-resizable-mixin.js#L67-L70

Removed only on a `mouseup` the parent never sees when release happens inside the iframe:

https://github.com/vaadin/web-components/blob/a3265b00f4cbdb79f902817788a5a05cedc9db7a/packages/dialog/src/vaadin-dialog-resizable-mixin.js#L133-L137

The same pattern affects dragging (`vaadin-dialog-draggable-mixin.js`), since it uses the identical window-listener approach.

## Notes

- Confirmed with a side-by-side control: a plain `<div>` content dialog tracks and stops correctly under the exact same gesture, isolating the iframe as the trigger.
- Severity is low (labelled Minor / Impact: Low) — needs an iframe inside a draggable+resizable dialog.
