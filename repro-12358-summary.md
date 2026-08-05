<!-- Edit any field. This file is committed on the `repro/12358` branch and posted as the issue comment. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced
- **Hypothesis tested:** The bug is `vaadin-virtual-list` computing a `flex-basis` of `0%`, triggered by placing it in a `vaadin-form-layout` that uses `responsiveSteps` (a flex row container that resets only `flex-grow` / `flex-shrink`), observable as the list rendering at width `0` while its item elements are present in the DOM.
- **Regression?:** worked in 24.8.8 / broke in 25.0.0
- **Fixed by:** n/a (still broken)
- **Duplicate of:** none found
- **Branch:** `repro/12358` — pushed to `vaadin/web-components`
- **Reproduced on:** vaadin/web-components @ `main` (25.3.0-alpha8)
- **Present on main?:** yes (still broken)
- **Theme / Browser:** Lumo / Chromium
- **Screenshot**: ![virtual-list is empty inside form-layout, but renders in the control cases](https://raw.githubusercontent.com/vaadin/web-components/<commit-sha>/repro-12358.png)

## Observed behavior

The `vaadin-virtual-list` inside `vaadin-form-layout` gets a computed width of `0` — nothing is visible, although the item elements exist in the DOM:

```
{ id: "list-in-form",            w: 0,    h: 80, flex: "0 0 0%",   inlineWidth: "calc(100% + 0rem)", childCount: 5 }
{ id: "list-in-vl",              w: 1216, h: 130, flex: "1 1 0%",  inlineWidth: "(none)",            childCount: 5 }
{ id: "list-in-form-flex-none",  w: 1216, h: 80, flex: "0 0 auto", inlineWidth: "calc(100% + 0rem)", childCount: 5 }
```

The computed value `0 0 0%` comes from two style sheets at once:

- `flex-grow: 0` / `flex-shrink: 0` from the form layout's `#layout ::slotted(*)` rule (an outer tree wins over the inner tree for normal declarations),
- `flex-basis: 0%` from the `flex: 1` shorthand in the virtual list's own `:host` rule, which nothing overrides.

`flex-basis` takes precedence over `width` for a flex item, so the inline `width: calc(100% + 0rem)` that `FormLayout` sets for the colspan is ignored and the list collapses to zero width.

Isolating the single declaration confirms it: setting only `flex-basis: auto` on the failing list (leaving `flex-grow`/`flex-shrink` at `0`) makes it 836px wide and the items appear; restoring `flex-basis: 0%` collapses it back to `0`.

Console: clean (only the Lit dev-mode warning and a favicon 404 from the dev server).

## Expected behavior

The virtual list should show its items, as it did in 24.8.

## Steps to reproduce

1. Put a `vaadin-virtual-list` with an explicit height inside a `vaadin-form-layout` that uses `responsiveSteps` (the default, i.e. no `autoResponsive`).
2. Assign items and a renderer to the list.
3. The list area stays empty; the item elements are in the DOM with `offsetWidth === 0`.

## Reproduction

How to run: start the dev server (`yarn start:lumo`) and open the page below.

- **Route / page:** `http://localhost:8000/dev/repro-12358.html`
- **Scaffold:** `dev/repro-12358.html` (committed on this branch)

```html
<vaadin-form-layout id="form">
  <label colspan="2">Elements</label>
  <vaadin-virtual-list id="list-in-form" colspan="2" style="height: 80px"></vaadin-virtual-list>
</vaadin-form-layout>

<script type="module">
  import '@vaadin/form-layout';
  import '@vaadin/virtual-list';

  const list = document.getElementById('list-in-form');
  list.items = ['hello', 'world', 'foo', 'bar', 'baz'];
  list.renderer = (root, _, { item }) => {
    root.textContent = item;
  };
</script>
```

## Root cause (suspected)

The `flex: 1` shorthand on the virtual list host, added in #10433. Its `flex-basis: 0%` part survives even when the parent resets `flex-grow` and `flex-shrink`:

https://github.com/vaadin/web-components/blob/7a25298c3f2c6d9891df7a6ed90201522d5a49d0/packages/virtual-list/src/styles/vaadin-virtual-list-base-styles.js#L16-L21

The form layout only resets growing and shrinking for its children, never `flex-basis`:

https://github.com/vaadin/web-components/blob/7a25298c3f2c6d9891df7a6ed90201522d5a49d0/packages/form-layout/src/styles/vaadin-form-layout-base-styles.js#L60-L68

`flex: 1` was likely meant to make the list fill a column flex container (`vaadin-vertical-layout`, `vaadin-tabsheet`). Using `flex: 1 1 auto` (or scoping the rule so the basis is not forced to `0%`) would keep that use case working without collapsing the list in a row flex container.

## Notes

- Both workarounds in the report are consistent with this cause: `flex: none` resets the basis to `auto`, and `vaadin-vertical-layout` is a *column* flex container, where `flex-basis: 0%` affects the height (the list has an explicit height) instead of the width.
- Version evidence: `flex: 1` is present in `v25.0.0` and every later tag (`git tag --contains 706beca539`), and absent in the 24.8 line — matching "worked in 24.8.8".
- Separate observation, likely **not** the same bug: a `vaadin-virtual-list` without an explicit width also renders at width `0` inside `vaadin-form-layout[auto-responsive]` (control 3 on the repro page). There `#layout` is a CSS grid, so the flex properties are ignored; the list collapses because a grid item that is not stretched shrinks to fit, and the virtual list has no intrinsic width (its children are absolutely positioned). Setting `width: 100%` fixes that case, `flex: none` does not. Worth filing separately if it is not intended.
