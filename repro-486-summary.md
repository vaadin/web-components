<!-- Edit any field. This file is committed on the `repro/486` branch and posted as the issue comment. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced
- **Hypothesis tested:** The bug is that a modal overlay ignores an outside click while a modeless overlay is open on top of it, triggered by opening a modeless `vaadin-dialog` above a modal one and clicking the modal dialog's backdrop, observable as `vaadin-overlay-outside-click` never firing on the modal overlay and the modal dialog staying open.
- **Regression?:** not a regression (broken since introduction) — `_last` has always meant "topmost overlay"; no fixing PR found, and no version is reported as working
- **Flavor:** web
- **Branch:** `repro/486` — pushed to `vaadin/web-components`
- **Reproduced on:** web-components @ `main` (`1d2414c85e`, 25.3.0-alpha11)
- **Present on main?:** yes (still broken)
- **Theme / Browser:** base:light / Chromium (playwright-cli)
- **Screenshot** (static bug): after two backdrop clicks — the counter is still 0 and the modal dialog is still open:
  ![Modal dialog with a modeless dialog on top; outside-click count 0, modal still opened, modal overlay _last false](https://raw.githubusercontent.com/vaadin/web-components/COMMIT_SHA/repro-486.png)

## Observed behavior

With a modal `vaadin-dialog` open and a modeless `vaadin-dialog` opened on top of it, clicking the modal dialog's backdrop does nothing at all — repeatedly. Measured on the reproduction page:

| step | `outside-click` on modal | modal opened | modal overlay `_last` |
| --- | --- | --- | --- |
| control: modal alone | 0 | `true` | `true` |
| control: after backdrop click | **1** | **`false`** | n/a (closed) |
| modeless dialog opened on top | 0 | `true` | **`false`** |
| after backdrop click (1st) | **0** | `true` | `false` |
| after backdrop click (2nd) | **0** | `true` | `false` |

The modal dialog can only be dismissed through its own close control; outside click is dead for as long as the modeless overlay stays open.

Two more overlay types on top produce the same `_last === false`, and are easier to hit than a modeless dialog:

| overlay on top of the modal dialog | `outside-click` on modal | modal closes |
| --- | --- | --- |
| modeless `vaadin-dialog` (as reported) | 0 | no |
| `vaadin-tooltip` with `manual` | 0 | no |
| non-modal `vaadin-popover` (default `modal = false`) | 0 | no — but the popover consumes the click and closes itself, so a second click then closes the modal dialog |

**Escape is affected the same way, which the report does not mention.** `_keydownListener` also checks `!this._last`. A modeless overlay does register the keydown listener, but only acts when it contains focus, so with focus inside the modal dialog and a modeless dialog on top, Escape closes nothing: `vaadin-overlay-escape-press` does not fire on the modal overlay and both dialogs stay open.

Console is clean (only the dev-server favicon 404 and the Lit dev-mode warning).

## Expected behavior

An outside click should still be handled by the modal overlay as long as every overlay on top of it is modeless — the modal dialog should close. Quoting the report: "the click should not be ignored as long as all overlays on top have modeless state."

## Steps to reproduce

1. Start the dev server (`yarn start`) and open `http://localhost:8000/dev/repro-486.html`.
2. Click **Open modal dialog**.
3. Inside the dialog, click **Open modeless dialog on top**.
4. Click the dimmed backdrop, outside both dialogs.
5. Observe `outside-click on modal: 0` and `modal dialog opened: true` — nothing happens, however many times you click. Clicking the backdrop without step 3 is the control: the counter goes to 1 and the dialog closes.

## Reproduction

How to run: start the server (`yarn start`) and open the page below.

- **Route / page:** `http://localhost:8000/dev/repro-486.html`
- **Scaffold:** `dev/repro-486.html`

```js
const modal = document.createElement('vaadin-dialog');
document.body.appendChild(modal);

const modeless = document.createElement('vaadin-dialog');
modeless.modeless = true;
document.body.appendChild(modeless);

let outsideClicks = 0;
modal.$.overlay.addEventListener('vaadin-overlay-outside-click', () => {
  outsideClicks += 1; // stays 0 while the modeless dialog is on top
});

// The modal dialog renders a button that opens the modeless one on top,
// because a modal overlay makes the rest of the page unclickable.
```

The page also has buttons for the `manual` tooltip and the non-modal popover variants, and shows `modal overlay _last` live.

## Root cause (suspected)

`_last` means "this is the topmost attached overlay", with no regard for the modality of the overlays above:

https://github.com/vaadin/web-components/blob/1d2414c85ec60fbf1a270c6236a43f2dde368d49/packages/overlay/src/vaadin-overlay-stack-mixin.js#L45-L60

`_shouldCloseOnOutsideClick()` returns exactly that, so the modal overlay opts out of handling the click as soon as anything — including a modeless overlay — is attached above it:

https://github.com/vaadin/web-components/blob/1d2414c85ec60fbf1a270c6236a43f2dde368d49/packages/overlay/src/vaadin-overlay-mixin.js#L505-L512

Nothing else picks the click up, because a modeless overlay registers no global click listener:

https://github.com/vaadin/web-components/blob/1d2414c85ec60fbf1a270c6236a43f2dde368d49/packages/overlay/src/vaadin-overlay-mixin.js#L245-L252

The fix the reporter proposed still applies, and the building blocks now exist:

1. Make `_last` mean "no modal overlay is on top". `isLastOverlay(overlay, filter)` already takes a filter — it was added for exactly this class of problem in #9397. Open question: with a modality filter, two modeless overlays would both report `_last === true`.
2. Ignore a click that hit inside an overlay on top. `_outsideClickListener` only checks `event.composedPath().includes(this.$.overlay)`, i.e. its own overlay. Today a click inside the modeless overlay on top does not close the modal one only because `_last` is `false`; change step 1 without step 2 and it would. `getOverlaysOnTop()` and `isNestedOverlay()` are exported from the stack mixin and can express this.

## Notes

- **The same root cause has been worked around three times, per component pair, since this issue was filed.** A general fix would let those local filters go:
  - #8291 `fix: prevent notification from affecting overlay interactions`
  - #9397 `fix: allow popover to close while tooltip is open` — this is the commit that **added the `filter` parameter** to `isLastOverlay`, used in `vaadin-popover.js` as `(o) => o.localName !== 'vaadin-tooltip-overlay'` with the comment "Ignore tooltips, popovers should still close when a tooltip is present"
  - #10322 `fix: allow popovers to close when interacting with non-nested overlays`
- **Fixing PR: none found.** No regression test covers a modal overlay with a modeless overlay on top; `packages/overlay/test/multiple.test.js` only covers all-modal and all-modeless stacks.
- **Severity/Impact look understated** at `Severity: Minor` / `Impact: Low`. `vaadin-tooltip` and `vaadin-popover` did not exist in 2020, so the reachable combinations have grown, and in the dialog and tooltip cases the modal dialog stops responding to both outside click and Escape. It is not critical — the dialog still has its own close control.
- **Related, not a duplicate: #7778** `[dialog] Modeless dialog does not honor close on outside click` — that is the *modeless* dialog itself not closing, because modeless overlays register no global click listener (`_shouldAddGlobalListeners()` returns `!this.modeless`). Same area, and `_shouldAddGlobalListeners()` — added for `vaadin-popover`, which overrides it to `true` — is the hook that would address it. Both issues point at the same modernization.
- **Adjacent work:** #12366 (overlay calls `preventDefault()` on the click it closes on, so other components can check `defaultPrevented`) and #12367 (context menu reusing the overlay outside-click logic). All three concern who owns the outside-click decision in the overlay stack; a `_last` change would interact with both.
- No duplicate found in `vaadin/web-components` or `vaadin/flow-components`.
