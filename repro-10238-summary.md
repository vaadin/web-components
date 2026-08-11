<!-- Edit any field. This file is committed on the `repro/10238` branch and posted as the issue comment. -->

> [!WARNING]
> **Automated reproduction — produced by the Claude Code `repro` skill. Needs human verification.**
> The steps, verdict, and root-cause pointer below were generated automatically and must be confirmed by a human before being treated as authoritative.

- **Verdict:** reproduced
- **Hypothesis tested:** The bug is the overlay being opened and immediately closed again within a single update cycle, triggered by typing a filter that matches no items while the overlay is closed, observable as the overlay getting `opened` and then `closing` a few milliseconds later and staying visible for the whole theme exit animation.
- **Regression?:** not a regression — reproduces identically in 24.4.13 (Polymer-based), 24.5.0, 24.7.0 and current `main` (25.3.0-alpha9)
- **Fixed by:** n/a
- **Duplicate of:** none found
- **Branch:** `repro/10238` — pushed to `vaadin/web-components`
- **Reproduced on:** vaadin/web-components @ `main` (25.3.0-alpha9, commit b8810b2a3814843de85a592520e48d4bc4bf868f)
- **Present on main?:** yes (still broken)
- **Theme / Browser:** Lumo and Aura (not visible in base) / Chromium 141 (Playwright)
- **Screenshot** (still frame of the flash, exit animation paused): ![Empty combo-box overlay flashing below the field](https://raw.githubusercontent.com/vaadin/web-components/PLACEHOLDER/repro-10238.png)
- **Demo video** (motion bug): `repro-10238-flicker.webm` (on the branch; drag into the comment for inline playback)

## Observed behavior

Typing a single character that matches no item into a closed combo-box opens the overlay and then closes it again in the same interaction. Instrumenting the overlay element with a `MutationObserver` on the repro page (Lumo, light):

```
t=21254  overlay attrs: opened,opening      overlayOpened=true   visible=true
t=21257  (repositioning)
t=21273  overlay attrs: closing             overlayOpened=false  visible=true
t=21274  animationstart  lumo-overlay-dummy-animation
t=21406  animationend    lumo-overlay-dummy-animation
t=21407  overlay attrs: (none)              overlayOpened=false  visible=false
```

So the overlay is attached and painted for ~150 ms: ~19 ms in the opened state plus the full Lumo exit animation (`lumo-menu-overlay-exit` / `lumo-overlay-dummy-animation`). During that window the overlay box is an empty 192×8 px panel, which is what flashes below the field.

Per-theme results for the same keystroke:

| Theme | Overlay visible | Exit animation |
| --- | --- | --- |
| Lumo | ~150 ms | `lumo-overlay-dummy-animation` (~130 ms) |
| Aura | ~255 ms | `--no-op` (~185 ms) |
| Base | not painted (opened → closed in 5 ms, no `closing` state) | none |

The control field on the repro page (plain combo-box, no `allow-custom-value`) behaves identically, so `allowCustomValue` is not part of the trigger — the trigger is only "overlay closed + input that filters down to zero items".

Console is clean (only the Lit dev-mode warning from the dev server).

## Expected behavior

The overlay should not open at all when the filter produces no items — no open/close animation should be seen.

## Steps to reproduce

1. Open a `vaadin-combo-box` with a set of items, using the Lumo or Aura theme.
2. Focus the input while the overlay is closed.
3. Type a single character that matches none of the items (e.g. `z`).
4. An empty overlay box appears below the field and fades out again.

## Reproduction

How to run: start the dev server with `yarn start:lumo` (or `yarn start:aura`) and open the page below.

- **Route / page:** `http://localhost:8000/dev/repro-10238.html`
- **Scaffold:** `dev/repro-10238.html` (committed on this branch)

```html
<vaadin-combo-box id="custom" label="Country" allow-custom-value></vaadin-combo-box>
<vaadin-combo-box id="plain" label="Country"></vaadin-combo-box>

<script type="module">
  import '@vaadin/combo-box';
  const items = ['Austria', 'Belgium', 'Croatia', 'Denmark', 'Estonia', 'Finland'];
  document.querySelector('#custom').items = items;
  document.querySelector('#plain').items = items;
</script>
```

The page also has a `MutationObserver` that records the overlay state changes into `window.__log`, and a contrasting page background so the flashing (white, empty) overlay is visible in a still frame.

## Root cause (suspected)

`_onInput()` sets `filter` and `opened` in one batched update. Within that update cycle the complex observer `_openedOrItemsChanged` runs **before** the new filter has been applied, so it still sees the previous, non-empty `_dropdownItems` and sets `_overlayOpened = true`:

https://github.com/vaadin/web-components/blob/b8810b2a3814843de85a592520e48d4bc4bf868f/packages/combo-box/src/vaadin-combo-box-mixin.js#L173-L178

The filter is only applied afterwards, in `ComboBoxItemsMixin.updated()`, which calls `super.updated(props)` first — and `super.updated()` is where PolyLit runs the complex observers:

https://github.com/vaadin/web-components/blob/b8810b2a3814843de85a592520e48d4bc4bf868f/packages/combo-box/src/vaadin-combo-box-items-mixin.js#L121-L131

Instrumented call order for one keystroke (`filter` is already `'z'` in all three calls):

```
_openedOrItemsChanged  opened=true  itemsLen=6   <- runs from PolylitMixin __runComplexObservers
_openedOrItemsChanged  opened=true  itemsLen=6
_setDropdownItems      len=0                     <- filter finally applied
_openedOrItemsChanged  opened=true  itemsLen=0   <- _overlayOpened flips back to false
```

Because `_overlayOpened` is a `sync` property, the intermediate `true` reaches the overlay element immediately, which opens it and then has to run its exit animation on the way back out. Applying the filter before the overlay-opening observer runs (e.g. handling `filter` in `willUpdate()` instead of `updated()`) would keep `_overlayOpened` from ever becoming `true`.

## Notes

- The same ordering exists in the Polymer-based 24.4 line, so this is not a Lit-migration regression. Older lines were checked by loading `@vaadin/combo-box@24.4.13`, `@24.5.0` and `@24.7.0` from a CDN on `dev/repro-10238-old.html` (also on this branch).
- The base theme does not paint the overlay because it has no exit animation; the visible symptom is entirely down to the theme keeping the closing overlay alive for one animation.
- The screenshot is a still frame with the overlay exit animation paused via `Animation.pause()`; without pausing, the flash is too short to capture reliably in a screenshot. The video shows it at normal speed.
