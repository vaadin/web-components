<!-- Edit any field. This file is committed on the `repro/<issue>` branch and posted as the issue comment. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced
- **Hypothesis tested:** The bug is that all-but-the-first checkbox ends up unchecked, triggered by programmatically appending several pre-checked `vaadin-checkbox` elements to a `vaadin-checkbox-group`, observable as a group `value` of only the first checkbox's value.
- **Branch:** `repro/770` — pushed to `vaadin/web-components`
- **Reproduced on:** web-components @ `25.2.0-beta1` (current `main`)
- **Present on main?:** yes (still broken) — the original report was Polymer-era; it persists in the current Lit-based implementation.
- **Theme / Browser:** base / Chromium (Playwright)

## Observed behavior

After appending four pre-checked checkboxes (`new`, `processing`, `shipped`, `delivered`), only the first stays checked. The live DOM state:

```json
{"groupValue":["new"],"checkboxes":[
  {"value":"new","checked":true},
  {"value":"processing","checked":false},
  {"value":"shipped","checked":false},
  {"value":"delivered","checked":false}]}
```

No relevant console errors (only a favicon 404 and the Lit dev-mode warning).

## Expected behavior

All four checkboxes remain checked and the group `value` is `["new","processing","shipped","delivered"]`.

## Steps to reproduce

1. Add an empty `<vaadin-checkbox-group>` to the page.
2. In a loop, create `vaadin-checkbox` elements, set `checkbox.checked = true` and a `value` on each, and append them to the group.
3. Read back the group: only the first checkbox is checked.

## Reproduction

How to run: `yarn start`, then open the route below.

- **Route / page:** `dev/repro-770.html`
- **Scaffold:** `dev/repro-770.html`

```html
<vaadin-checkbox-group id="group" label="Order status"></vaadin-checkbox-group>

<script type="module">
  import '@vaadin/checkbox';
  import '@vaadin/checkbox-group';

  const orderStatus = ['new', 'processing', 'shipped', 'delivered'];
  const group = document.getElementById('group');
  for (const stat of orderStatus) {
    const checkbox = document.createElement('vaadin-checkbox');
    checkbox.label = stat;
    checkbox.checked = true;
    checkbox.setAttribute('value', stat);
    group.append(checkbox);
  }
</script>
```

## Root cause (suspected)

`packages/checkbox-group/src/vaadin-checkbox-group-mixin.js:246` (`__valueChanged`) combined with `:147` (`__registerCheckbox`) and the `sync: true` flag on `value` (`:29`).

The `SlotObserver` registers the appended checkboxes one at a time. Registering the **first** checked checkbox calls `__addCheckboxToValue` (`:159`), which sets `this.value = ['new']`. Because `value` is declared `sync: true` with `observer: '__valueChanged'`, the observer runs **synchronously** and executes:

```js
this.__checkboxes.forEach((checkbox) => {
  checkbox.checked = value?.includes(checkbox.value); // :255
});
```

At that moment `value` is only `['new']`, so this **unchecks** `processing`, `shipped`, and `delivered` — which have not been registered yet. When the loop reaches them, they are already `checked === false`, so `__registerCheckbox` adds nothing to the value. Only the first checkbox survives.

The reporter's workaround (setting `group.value = orderStatus` after the loop) works because by then all checkboxes are registered, so the single `__valueChanged` pass re-checks them all.

## Notes

- The "set `.value` on the group instead" workaround from the comments still applies.
- The intermittency the original reporter saw ("works sometimes") is consistent with this: a group that is built with a single `value` assignment, or where checkboxes are added before being checked, dodges the synchronous mid-registration uncheck.
