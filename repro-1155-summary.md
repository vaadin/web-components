<!-- Edit any field. This file is committed on the `repro/<issue>` branch and posted as the issue comment. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced
- **Hypothesis tested:** The bug is CRUD modifying a **nested** property of the original item on save, triggered by editing a deep field (`stuff.first`) and clicking Save while a `save` listener calls `preventDefault()`, observable as `crud.items[0].stuff.first` changing to the edited value even though the save was prevented.
- **Regression?:** not a regression (broken since introduction — a follow-up to vaadin/vaadin-crud#157, which only fixed top-level properties; nested properties were never deep-copied)
- **Flavor:** web
- **Branch:** `repro/1155` — pushed to `vaadin/web-components`
- **Reproduced on:** vaadin/web-components @ main (`@vaadin/crud` 25.3.0-alpha4)
- **Present on main?:** yes (still broken)
- **Theme / Browser:** base styles / Chromium (Playwright)
- **Screenshot** (static bug): `![editor still open after prevented save, yet items[0].stuff.first is already Modified](https://raw.githubusercontent.com/vaadin/web-components/47b9cb3b0e8f7c73e0607910c5ef46fee3865226/repro-1155.png)`

## Observed behavior

Scaffold sets `crud.items = [{ foo: 'bar', stuff: { first: 'first', second: 'second' } }]` and a `save` listener that calls `preventDefault()`. The CRUD auto-generates fields with paths `foo`, `stuff.first`, `stuff.second`, and `crud.editedItem === crud.items[0]` (same reference). Editing the nested field and clicking Save:

- **Nested field `stuff.first` + `preventDefault()`:** `items[0].stuff.first` changes `first → Modified`. The editor stays open and the grid row still shows `first` (the save was prevented), but the original item's nested object is already mutated. **Bug.**
- **Control — top-level field `foo` + `preventDefault()`:** `foo` stays `bar` (unchanged). The shallow-copy fix from #157 protects top-level properties.
- **Control — nested field `stuff.first` without `preventDefault()`:** `stuff.first` becomes the edited value (expected).

So only nested properties leak past `preventDefault()`; top-level properties are correctly protected. Console clean apart from the Lit dev-mode warning.

## Expected behavior

When a `save` listener calls `preventDefault()`, the CRUD must not modify the original item at all — including nested properties. `crud.items[0].stuff.first` should remain `first`.

## Steps to reproduce

1. `yarn start`, open `http://localhost:8000/dev/repro-1155.html`.
2. Click the edit (pencil) button on the only row.
3. Change the **Stuff first** field to `Modified`, click **Save**.
4. Observe the bottom-left readout: `items[0].stuff.first = Modified`, even though the `save` handler called `preventDefault()` and the editor stayed open.

## Reproduction

- **Route / page:** `http://localhost:8000/dev/repro-1155.html`
- **Scaffold:** `dev/repro-1155.html`

```js
crud.items = [{ foo: 'bar', stuff: { first: 'first', second: 'second' } }];
crud.addEventListener('save', (e) => e.preventDefault());
// edit item -> set field stuff.first = "Modified" -> change -> Save
// crud.items[0].stuff.first is now "Modified" (bug); should stay "first"
```

## Root cause (suspected)

`__save()` shallow-copies the edited item, so nested objects stay shared by reference; the field loop then writes into those shared objects with `setProperty` **before** the `save` event fires, so `preventDefault()` cannot undo the nested mutation:

https://github.com/vaadin/web-components/blob/5b7cdf3b81c6d12bdb2f3cb9a91ad5c10c7821af/packages/crud/src/vaadin-crud-mixin.js#L926-L938

`{ ...this.editedItem }` copies only the top level; `setProperty('stuff.first', value, item)` walks into `item.stuff`, which is the same object as `editedItem.stuff` / `items[0].stuff`, and mutates it in place. A deep copy of the edited item before applying field values would fix it.

## Notes

- Follow-up to vaadin/vaadin-crud#157 ("Don't modify original item if default is prevented on save"), which fixed top-level properties only. The reporter's original test case is the `no-eager-deep-modify` branch.
- No open or closed duplicate found; #1155 is the only match.
