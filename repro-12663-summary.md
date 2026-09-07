<!-- Edit any field. This file is committed on the `repro/12663` branch and posted as the issue comment. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced
- **Hypothesis tested:** The bug is `has-content` never being set on `<vaadin-badge>`, triggered by the badge's default slot being observed synchronously (`syncInitial`) while its text node is still empty, observable as `[part='content']` staying `display: none` so the badge renders with no text.
- **Regression?:** worked in 25.2.6 / broke in 25.2.7 — caused by #12399 (CP to 25.2: #12403), the fix for #11891
- **Fixed by:** n/a (still broken)
- **Duplicate of:** none found
- **Branch:** `repro/12663` — pushed to `vaadin/web-components`
- **Reproduced on:** vaadin/web-components @ `main` (69f23790b6, 25.4.0-alpha0)
- **Present on main?:** yes (still broken; the same code is on `25.2` via #12403)
- **Theme / Browser:** base / Chromium (the mechanism is not browser-specific — no browser-dependent API is involved)
- **Screenshot** (static bug): ![Badge with text in the light DOM renders empty](https://raw.githubusercontent.com/vaadin/web-components/421f836aaa3f72c195f8fc718ed63cacffc51ffa/repro-12663.png)

## Observed behavior

A badge whose text node is filled **after** the badge is connected — the text node itself already being a child, only its data written later — never gets the `has-content` attribute, so `[part='content']` stays `display: none` and the badge collapses to an empty pill.

The DOM of the failing badge matches the devtools screenshot in the issue exactly — text in the light DOM, no `has-content` on the host:

```
<vaadin-badge id="badge-fail">Aktiv</vaadin-badge>
shadow: <!----> <div part="icon" class=" "> <slot name="icon"></slot> </div>
        <div part="number" class=" "><!--?lit$395464069$--></div>
        <div part="content" class=" "> <slot></slot> </div>
```

Measured on the reproduction page (`has-content` + `offsetWidth` of `[part='content']`):

```
OK   badge-control-static       has-content=true  contentWidth=34 text="Aktiv"
FAIL badge-fail                 has-content=false contentWidth=0  text="Aktiv"
OK   badge-control-order        has-content=true  contentWidth=34 text="Aktiv"
OK   badge-control-textcontent  has-content=true  contentWidth=34 text="Aktiv"
FAIL badge-dialog-fail          has-content=false contentWidth=0  text="Aktiv"
OK   badge-dialog-control       has-content=true  contentWidth=34 text="Aktiv"
```

Console is clean (no errors beyond dev-server noise).

**The dialog is not the trigger.** The same pattern fails outside any overlay, and a dialog badge built with `textContent` works. What differs between the failing and working cases is only *when* the text lands in the text node.

**Causation check:** removing `{ syncInitial: true }` from the badge's two `SlotObserver` calls — i.e. restoring the 25.2.6 behaviour — makes every case pass, including `badge-fail`. Nothing else was changed.

## Expected behavior

The badge shows its text regardless of when the text is written into the slotted text node.

## Steps to reproduce

1. Create a `<vaadin-badge>` and append an **empty** text node to it.
2. Connect the badge to the document.
3. Write the text into that same text node (`node.data = 'Aktiv'`).
4. The badge renders empty; the host has no `has-content` attribute although `badge.textContent === 'Aktiv'`.

## Reproduction

How to run: start the dev server (`yarn start`) and open the page below. The result table is printed on the page; click **Open dialog** to also measure the two badges inside the dialog.

- **Route / page:** `http://localhost:8000/dev/repro-12663.html`
- **Scaffold:** `dev/repro-12663.html` (committed on this branch)

```js
// FAILS: the text node is filled in place after the badge is connected
const badge = document.createElement('vaadin-badge');
const text = document.createTextNode('');
badge.appendChild(text);
host.appendChild(badge); // -> connectedCallback -> sync first render -> sync slot observer pass
text.data = 'Aktiv'; // character data change: no `slotchange`, so `has-content` is never set

// WORKS: same text node, filled before the badge is connected
const badge2 = document.createElement('vaadin-badge');
const text2 = document.createTextNode('');
badge2.appendChild(text2);
text2.data = 'Aktiv';
host.appendChild(badge2);
```

## Root cause (suspected)

`PolylitMixin` performs the first update **synchronously** inside `connectedCallback`, so `Badge.firstUpdated()` — and with it the `syncInitial` initial pass of both `SlotObserver`s — runs during `appendChild`, before anything else in the caller's task can write the text:

https://github.com/vaadin/web-components/blob/69f23790b66695b15148af42613faf4283fe014e/packages/component-base/src/polylit-mixin.js#L218-L226

That initial pass sees the empty text node, records it in `_storedNodes`, and calls the callback, which filters it out via `isEmptyTextNode` and therefore does not set `has-content`:

https://github.com/vaadin/web-components/blob/69f23790b66695b15148af42613faf4283fe014e/packages/badge/src/vaadin-badge.js#L124-L148

Writing the text afterwards changes only the node's character data. That fires no `slotchange` and does not change the node set, so the observer never runs the callback again and `has-content` stays off for good. Before #12399 the initial pass ran in a microtask, which was late enough to see the final text:

https://github.com/vaadin/web-components/blob/69f23790b66695b15148af42613faf4283fe014e/packages/component-base/src/slot-observer.js#L53-L59

Note that flushing a second time asynchronously is not enough on its own: the second pass would find no node diff and skip the callback. The callback has to be re-invoked for the unchanged node set (as `forceInitial` does), or the badge has to observe character data of its slotted text nodes.

## Notes

- **Why Flow apps hit this.** Flow's client creates every text node empty and writes the text into it afterwards, which is exactly the failing pattern:
  `TextBindingStrategy.create()` returns `Browser.getDocument().createTextNode("")`, and `bind()` sets the value later through a `Computation`: `() -> htmlNode.setData((String) textProperty.getValue())`. Whether the write lands before or after the badge is connected depends on the order in which Flow applies the changes of a batch, which plausibly explains why the reporter sees it inside a dialog but not for badges inside a grid.
- A fix must keep the #11891 regression test green: `test/integration/grid-badge-auto-width.test.js`.
- `has-icon` is not affected: the icon slot holds elements, and an element's identity does not change when its content does.
