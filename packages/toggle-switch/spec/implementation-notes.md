# ToggleSwitch Implementation Notes

## Task 1 — Package scaffolding and dev page

- **Commit:** (this commit)
- **Date:** 2026-05-07
- **Decisions:**
  - Class chain ships without `CheckboxMixin` for Task 1: `ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))`. This keeps the scaffolding pure — `render()` can be a literal `html\`\`` placeholder, no slot-controllers are wired, no shadow DOM template is forced. Task 2 swaps `CheckboxMixin` into the chain together with the shadow DOM template that supplies the slots its slot-controllers need.
  - `static get experimental() { return true; }` — verified that `defineCustomElement` derives the flag name from the camel-cased tag suffix (`toggle-switch` → `toggleSwitchComponent`); the recent `guidelines/02-design.md` direction prefers this over the older string-return form used by `breadcrumbs`.
  - `toggleSwitchStyles` exported as `[]` (empty array) — matches the `checkbox` / `radio-button` shape that Task 4 will populate as `[field, checkable('switch', 'toggle-switch'), toggleSwitch]`. Differs from the singular `CSSResult` used by `breadcrumbs`, but that's because `breadcrumbs` doesn't compose with the field/checkable styles.
  - `@vaadin/checkbox` is declared as a runtime dependency in `package.json` from Task 1 even though the import lands in Task 2 — the manifest is established once, here.
- **Surprises:** —
- **Spec adjustments:**
  - Task 1 in `web-component-tasks.md` rewritten to drop `CheckboxMixin` from the class chain (was adding it during scaffolding and forcing a non-empty `render()`); Task 2 now owns the mixin swap together with the full shadow DOM template.

## Task 2 — Element class wiring — shadow DOM, `role="switch"`, tooltip

- **Commit:** (this commit)
- **Date:** 2026-05-07
- **Decisions:**
  - `_inputElementChanged(input, oldInput)` is the canonical hook for setting `role="switch"` on the inner input — same pattern `vaadin-combo-box` and `vaadin-date-picker` use to set `role="combobox"`. Calls `super._inputElementChanged(input, oldInput)` first so `CheckboxMixin`'s inherited add/remove-listener wiring still runs, then guards on `if (input)` before calling `setAttribute`.
  - `ready()` wires `TooltipController` with `setAriaTarget(this.inputElement)`, identical to `Checkbox.ready()`. The tooltip's id is added to the inner input's `aria-describedby`, so screen-reader users hear the tooltip text when the input is focused.
  - Test surface uses snapshots + the shared tooltip integration test rather than per-feature unit tests:
    - Shadow DOM parts (`switch`, `thumb`, `label`, `helper-text`, `error-message`, `required-indicator`, `tooltip` slot) and the inner input's `role="switch"` / `type="checkbox"` / `slot="input"` are locked in by `test/dom/toggle-switch.test.js` via `host` and `shadow` snapshots. Asserting these as individual unit tests would duplicate what the snapshot already pins.
    - Tooltip behavior (`has-tooltip` attribute, tooltip target, `aria-describedby` composition on the inner input, hover/leave wiring) is exercised by `test/integration/component-tooltip.test.js` which already iterates over every Vaadin field and applies the same set of tooltip assertions to each. Adding `ToggleSwitch.is` with `ariaTargetSelector: 'input'` to that array is enough — no toggle-switch-local tooltip test needed.
    - Inner-input handling (`InputController` slotting the `<input>`, `LabelledInputController` wiring `aria-labelledby`, the slotted-input `opacity: 0` Tailwind workaround) is already tested in `field-base` / `checkbox` packages where the behavior originates. The toggle switch inherits it through `CheckboxMixin` and does not re-test it here.
- **Surprises:** —
- **Spec adjustments:** —

## Task 3 — Behavioral verification through CheckboxMixin

- **Commit:** (this commit)
- **Date:** 2026-05-08
- **Decisions:**
  - **Rule: don't duplicate mixin / controller tests in components that consume them.** The mixin's own test suite already covers the behavior. Toggle-switch-specific surface (the `role="switch"` override, the shadow DOM template) is covered by the snapshot tests in `test/dom/`; everything else (toggle, change events, label clicks, disabled, readonly, validation, helper / error / label slots, native-form submission, focus delegation, active attribute) is delivered unchanged by `CheckboxMixin` and exercised by `packages/checkbox/test/checkbox.test.js` and `packages/checkbox/test/validation.test.js`.
  - As a result, Task 3 produces **no test additions and no source changes**. The unit-test file stays at the Task 1 smoke tests (custom-element registration + `is` getter). The validation.test.js file the test agent had drafted is dropped without committing.
  - The implementation agent's run surfaced seven concrete tests that proved the rule: five asserted behaviors that aren't actually provided by the inherited mixins (`aria-required` on the input — FieldAriaController omits it for native inputs; host `tabindex="-1"` on disabled — DelegateFocusMixin moves the tabindex to the inner input; `focus-ring` cleared on `focus({ focusVisible: false })` — leaks from earlier `sendKeys` keyboard state; `event.target === host` for `change` — native event bubbles without re-dispatch; error-slot population without `invalid: true` — ErrorController only writes when both are set), and two asserted `<form>.reset()` synchronisation that doesn't exist upstream.
- **Surprises:** —
- **Spec adjustments:**
  - `web-component-spec.md`: dropped "and `<form>.reset()` synchronisation" from the "Inherited from `CheckboxMixin`" bullet, and dropped the corresponding "and `<form>.reset()`" mention from the "ARIA switch role" bullet. Added a Discussion entry explaining the gap and pointing at `Binder` (Flow) / a manual `reset` listener as the workaround. `requirements.md` Req 11 still calls for the behavior; satisfying it would require listener wiring upstream in `CheckboxMixin` and is a candidate for a future task.

## Post-Task 3 — Pick up new testing guideline

- **Date:** 2026-05-08
- **Trigger:** rebased onto `origin/main` to pick up `guidelines/12-testing.md` (the previous `12-checklist.md` moved to `13-checklist.md`).
- **Decisions:**
  - The new "don't test mixin / controller internals in components that consume them" rule from `guidelines/12-testing.md` codifies what Task 3 already settled on. No additional spec changes needed for that rule.
  - Updated `web-component-spec.md` Decision 9 (Guideline alignment) to reference `guidelines/12-testing.md` and added a Discussion entry explaining why Task 3's coverage is intentionally minimal.
  - Updated `web-component-tasks.md` Task 7's "Spec sections" line to reference both `guidelines/12-testing.md` and the renamed `guidelines/13-checklist.md`.
- **Follow-up (not done in this session):**
  - `guidelines/12-testing.md` recommends new tests be written in `.ts`. The committed test files (`packages/toggle-switch/test/toggle-switch.test.js`, `packages/toggle-switch/test/dom/toggle-switch.test.js`) were authored in `.js` before the recommendation landed. Converting them to `.ts` is a small, pure-renaming change worth doing alongside Task 7 (which adds the `test/typings/toggle-switch.types.ts` already in `.ts`) for consistency.

## Task 4 — Base styles completion

- **Commit:** (this commit)
- **Date:** 2026-05-12
- **Decisions:**
  - Styles composition stays at `[field, checkable('switch', 'toggle-switch'), toggleSwitch]` — every shared rule (track background / border / focus ring outline / disabled track / checked-state background swap / forced-colors checked border) comes from `checkable()` unmodified. The local `toggleSwitch` block only adds the toggle-specific deltas: track dimensions, the thumb element, the `[part='switch']::after` checkmark suppression (Decision 5), the read-only and disabled thumb visuals, the RTL mirror, and the forced-colors thumb/background rules.
  - Thumb positioning factored through a shared `--_thumb-offset` custom property on `[part='switch']` so the on-state and RTL-on-state `translate` rules each reduce to one line; only the off-state `inset-inline-start` keeps its own calc because it expresses a different quantity (centering offset minus border width).
  - **`--vaadin-toggle-switch-label-font-weight` is redeclared locally.** `checkable()` wires the label `font-weight` through `--vaadin-${propName}-font-weight` (no `-label-` segment) — a pre-existing naming inconsistency in the shared module. To honor the spec table's name without forking the shared file, the local block re-declares `font-weight` on `[part='label'], ::slotted(label)` using the spec-named property. All other label custom properties (`label-color`, `label-font-size`, `label-line-height`) already match the spec via `checkable()`'s template — no redeclaration needed.
  - Read-only on-state uses `--vaadin-background-container-strong` for the track background to stay visibly distinct from both the off-state readonly and the active checked state. Required because `checkable()`'s `:host(:is([checked], [indeterminate]))` rule overrides the track background unconditionally; the `:host([readonly][checked])` rule has to point the property somewhere visible and also undo `checkable()`'s checked-state `border-color: transparent` so the dashed border survives.
  - Visual coverage: `test/visual/base/toggle-switch.test.ts` mirrors the checkbox visual suite — `basic`, `checked`, `required`, `empty`, `disabled` × {basic, checked, required}, `readonly` × {basic, checked}, `focus` × {keyboard, checked, readonly}, plus `features` × {ltr, rtl} for `error-message` / `helper-text`, and a toggle-specific `rtl > checked` to lock in the thumb mirror. 17 baseline screenshots total.
- **Surprises:**
  - `yarn update:base --group toggle-switch` invokes `scripts/run-docker-visual-tests.sh`, which uses `docker run -it`. Outside a TTY the `-t` flag fails. The implementation agent worked around it by invoking the same docker command with `-i` only (no `-t`); the produced baselines are byte-identical to what an interactive run would have generated.
- **Spec adjustments:**
  - Initially the test agent authored `test/styles.test.ts` — a parameterised suite that overrode each `--vaadin-toggle-switch-*` custom property on the host and asserted the corresponding computed style on `host` / `[part='switch']` / `[part='thumb']` / `[part='label']`. Per user feedback after the commit, this kind of test was dropped: visual regression tests already cover the styling layer, and computed-style assertions for property pass-through test the CSS engine, not the component. The file was removed; `web-component-tasks.md` Task 4 dropped the "Computed style" test bullet; `web-component-spec.md` Discussion gained an entry explaining the rationale.

## Post-Task 4 — Label baseline alignment fix

- **Date:** 2026-05-12
- **Trigger:** the dev page rendered the label visibly higher than `dev/checkbox.html` does.
- **Cause:** the initial `[part='switch']::after { content: none; }` removed the pseudo-element entirely. `checkable()` carries `content: '\\2003' / ''` (em-space) on that `::after` so its first baseline (centred by the flex parent) anchors `:host { align-items: baseline }` to the centre of the track. With the element gone, the flex container's baseline collapsed to its margin-box bottom and the label drifted up.
- **Decisions:**
  - Replace `content: none` with `background: none; mask: none;` — keeps the inherited em-space content (and therefore the centred baseline), removes only the visible checkmark paint. The absolutely-positioned `[part='thumb']` already paints on top.
  - Decision 5 in `web-component-spec.md` rewritten to describe the new state. Added a Discussion entry explaining the baseline-anchor constraint.
  - 17 base visual baselines regenerated with the corrected alignment.

## Task 5 — Lumo theme

- **Commit:** (this commit)
- **Date:** 2026-05-13
- **Decisions:**
  - The Lumo file is **self-contained** — it ships its own `[part='switch']` and `[part='thumb']` sizing, positioning, border, grid layout, thumb translate / RTL mirror, and forced-colors rules rather than relying on the base styles to provide the structural layer. This is required because `LumoInjectionMixin` (`packages/vaadin-themable-mixin/lumo-injection-mixin.js`) defaults to `includeBaseStyles: false`, and `getEffectiveStyles()` in `vaadin-themable-mixin/src/css-utils.js` then drops the static base styles for any component injected through the Lumo path. Checkbox / radio-button hide this dependency because their Lumo files already redeclare every visible primitive; toggle-switch follows the same pattern.
  - Token bindings per the task spec: `--vaadin-toggle-switch-background` → `--lumo-contrast-20pct` off / `--lumo-primary-color` on / `--lumo-contrast-10pct` disabled / `--lumo-contrast-60pct` readonly+checked / `--lumo-error-color-10pct` invalid; thumb color → `--lumo-body-text-color` off / `--lumo-primary-contrast-color` checked / `--lumo-contrast-30pct` disabled / `--lumo-contrast-50pct` readonly; size → `calc(var(--lumo-size-m) / 2)`; focus ring → `--lumo-primary-color-50pct`; font → `--lumo-font-family` / `--lumo-font-size-m` / `--lumo-line-height-s`; label color → `--lumo-body-text-color`; required indicator → `--lumo-primary-text-color`; error-message → `--lumo-error-text-color`.
  - Invalid + checked also tints the track via `--lumo-error-color-10pct` (the `:host([invalid])` rule sets the background unconditionally), matching the checkbox precedent.
  - `packages/vaadin-lumo-styles/components/index.css` updated to import `./toggle-switch.css` between `time-picker.css` and `tooltip.css` so the aggregator-level Lumo bundle picks it up alongside every other component.
  - Test surface: `test/visual/lumo/toggle-switch.test.ts` mirrors the base visual suite 1:1 (18 `it` blocks). Screenshot names follow the checkbox-lumo convention (no `state-` prefix). 18 baseline PNGs generated under `test/visual/lumo/screenshots/toggle-switch/baseline/`.
- **Surprises:**
  - The first round of baselines passed `yarn test:lumo --group toggle-switch` but the visual-verify agent caught that the rendered switch was invisible — only the "Toggle" label appeared. Root cause was the `includeBaseStyles: false` behaviour above: the Lumo file had only color overrides and no structural rules, so the track collapsed to zero height under the Lumo cascade. Baselines were regenerated after the Lumo file was made self-contained.
  - `yarn test:lumo --group toggle-switch` matching itself doesn't prove the component renders correctly; it only proves the rendering is stable. Visual sanity-check against the base baselines is the actual regression gate.
- **Spec adjustments:** —

## Post-Task 5 — Align Lumo styles with prototype

- **Date:** 2026-05-13
- **Trigger:** review against `proto/toggle-switch` flagged divergences in unchecked thumb appearance, missing active-press affordance, and a visible track border the prototype does not have.
- **Decisions:**
  - **Thumb colour unified to `--lumo-primary-contrast-color` in both states** with an elevation `box-shadow: 0 1px 2px 0 rgba(0,0,0,0.1), 0 1px 1px 0 rgba(0,0,0,0.06)`. `:host([checked]) [part='thumb']` now only carries the translate override; `:host([disabled]) [part='thumb']` strips the shadow.
  - **Active press affordance added.** `:host([active]) [part='switch'] { transform: scale(0.95); transition-duration: 0.05s; }` plus an activation halo via `[part='switch']::before` (transparent scale-1.4 → opacity-flash on off-state press). The track transition gains `transform 0.2s cubic-bezier(0.12, 0.32, 0.54, 2)` so the scale animates.
  - **Track border removed for active states.** Dropped the explicit `border: var(--_input-border-width) solid var(--_input-border-color)` and the `--_input-border-width` / `--_input-border-color` locals from `[part='switch']`. Proto carries no border on the track — the contrast between the contrast-20pct track and the contrast-50pct page is the only edge cue. The focus-ring's inset shadow (which referenced the dropped `--_input-border-width`) is removed; the outer halo alone communicates focus.
  - **Readonly affordance.** Proto's "transparent track + floating thumb" rendered as white-on-white on a light page, hiding the readonly state entirely. Readonly now inherits the off-state's `--lumo-contrast-20pct` fill (darker than the disabled state's `--lumo-contrast-10pct`) and is overlaid with `outline: var(--vaadin-input-field-readonly-border, 1px dashed var(--lumo-contrast-50pct)); outline-offset: -1px;`, matching the dashed-border cue the readonly checkbox uses. `outline` is used instead of `border` so the track's box-model dimensions don't shift between active and readonly states.
  - **Hover hook**: `:host(:not([checked])…:hover) [part='switch']` reads `var(--vaadin-toggle-switch-background-hover, var(--lumo-contrast-30pct))` so consumers can override hover without re-declaring the off-state token.
  - **Readonly + checked**: track background bumped to `--lumo-contrast-70pct` to match prototype.
  - **Thumb inset-inline-start** simplified to `calc((var(--vaadin-toggle-switch-size) - var(--_thumb-size)) / 2)` — equivalent to proto's hardcoded `2px` for the default sizes — now that the border-width subtraction is no longer needed.
  - **Label alignment via shared checkable-field mixin.** The grid container layout, the grid placement of `[part='switch']` / label / helper / error, and the `[part='switch']::before` em-space baseline anchor are delivered by `packages/vaadin-lumo-styles/src/mixins/checkable-field.css` — the shared mixin's selector lists were extended to include the toggle switch's part name and container class so the toggle switch reuses the same machinery checkbox and radio-button do. The toggle-switch-local `[part='switch']::before` rule layers a transparent `transform: scale(1.4)` halo on top of that inherited em-space content (the em-space stays invisible because the local rule sets `color: transparent`), serving both the baseline anchor and the activation-flash without an extra DOM node. `[part='label']` adopts proto's `display: flex; position: relative; max-width: max-content;` so the slotted label sits on the track's vertical centre and the absolutely-positioned required indicator anchors to the label box (not the host). Horizontal spacing between the switch and the label is provided by `margin: var(--lumo-space-xs)` on `[part='switch']`; the public `--vaadin-toggle-switch-gap` is left unset by Lumo so the design-system default applies elsewhere if the grid is reactivated.
  - **Private `--_switch-size` indirection on `:host`.** `--_switch-size: var(--vaadin-toggle-switch-size, calc(var(--lumo-size-m) / 2))` resolves once: consumer override → Lumo default. The Lumo-internal calcs for `--_thumb-size`, `--_track-width`, `--_thumb-offset`, `[part='switch']` `height` / `border-radius`, and `[part='thumb']` `inset-inline-start` all read `var(--_switch-size)` directly, avoiding the per-call `var(--vaadin-toggle-switch-size, …)` fallback dance while keeping the public token override-able from outside.
  - 18 Lumo baselines regenerated.
- **Surprises:** `yarn update:lumo` is gated by `TEST_ENV=update`, not a CLI flag (`--update-visual-baseline` is silently ignored and the suite runs in diff-mode, surfacing as "11 failed tests"). The orchestrator now wraps the docker invocation with `-e TEST_ENV=update` when regenerating.
- **Spec adjustments:** —

## Post-Task 5 — Pick up shared Lumo field mixins

- **Date:** 2026-05-14
- **Trigger:** rebased onto `main` to pick up the Lumo CSS cleanup. `checkable-field.css` absorbed the per-component font / line-height / smoothing / focus-ring locals, the `[part='switch'] / [part='checkbox'] / [part='radio']` sizing / margin / cursor / transition primitives, the `::before` halo (with the em-space baseline anchor), and the `::slotted(input)` visually-hidden rule. Two new mixins were extracted from checkbox: `lumo_mixins_field-helper` (helper-text styling, hover lightening, disabled colour) and `lumo_mixins_field-error-message` (error-text styling, slide-down transition, RTL margin flip).
- **Decisions:**
  - Public entry `packages/vaadin-lumo-styles/components/toggle-switch.css` imports the two new mixins (`field-helper.css`, `field-error-message.css`) and lists `lumo_mixins_field-helper` and `lumo_mixins_field-error-message` in the inject-modules order checkbox uses (checkable-field → field-helper → field-required → field-error-message → components).
  - Source styles `packages/vaadin-lumo-styles/src/components/toggle-switch.css` trimmed to the toggle-switch-specific surface: the `:host` block now declares only `color`, `font-size`, `--_switch-size`, and `--_invalid-background` (the shared font / smoothing / focus-ring locals are inherited from `checkable-field`); `[part='switch']` keeps only the thumb-offset locals, sizing, border-radius, and background (mixin owns position / cursor / margin / transition); the local `[part='switch']::before` halo is dropped (mixin provides it with identical declarations); the local `[part='helper-text']` and `[part='error-message']` blocks are replaced by minimal overrides matching checkbox's `padding-inline-start: var(--lumo-space-xs)` + `margin: 0` on error-message + `display: none` on the mixin's leading spacers; the `:host(:hover:not([readonly])) [part='helper-text']` hover-colour rule and the disabled `[part='helper-text']` override are dropped (covered by `field-helper`).
  - 4 Lumo baselines regenerated (`ltr-error-message`, `ltr-helper-text`, `rtl-error-message`, `rtl-helper-text`) — small spacing shifts from the mixin's `::before` / `::after` helper-text spacer; all other baselines stayed byte-identical.
- **Spec adjustments:** —

## Task 6 — Aura theme

- **Commit:** (this commit)
- **Date:** 2026-05-15
- **Decisions:**
  - **Standalone Aura stylesheet** at `packages/aura/src/components/toggle-switch.css` (rather than extending the shared `checkbox-radio.css`) — the toggle switch's pill-track + circular-thumb pattern is structurally different enough from checkbox/radio that a shared file would only carry the size-token line in common. Registered from `packages/aura/aura.css` via `@import './src/components/toggle-switch.css';` placed alphabetically between `tabs.css` and `tooltip.css`.
  - **Layered, not injected**: Aura targets parts via `vaadin-toggle-switch::part(switch)` / `::part(thumb)` against the global selector — no Lumo-style `@media lumo_components_…` wrapping. The base styles (which Aura does NOT drop) remain in effect; Aura only overrides specific decoration via `--vaadin-toggle-switch-*` tokens.
  - **Token bindings**: `--vaadin-toggle-switch-size: round(1lh - 2px, 2px)` (matches `--vaadin-checkbox-size`); `--vaadin-toggle-switch-background` → `--aura-surface-color` off-state, `--aura-accent-color` checked, `color-mix(--aura-red 10%, transparent)` invalid off, `--aura-red` invalid checked; `--vaadin-toggle-switch-border-color` → `--vaadin-border-color-secondary` on accent / `--aura-red-text` on invalid; `--vaadin-toggle-switch-thumb-checked-color` → `--aura-accent-contrast-color`. Off-state thumb color is left to the base default (`--vaadin-text-color`) and renders with adequate contrast against the pale surface in both light and dark mode.
  - **Surface decoration** uses the same idioms as `checkbox-radio.css`: `--aura-surface-level: 4`, `box-shadow: var(--aura-shadow-xs)` off / `var(--aura-shadow-s)` checked, plus the `light-dark()` `--_shade` linear-gradient overlay for off-state depth. Checked / invalid rules set `background-image: none` to suppress the gradient cleanly.
  - **Hover / active overlay** via `::part(switch)::before` with `opacity: 0` baseline → `0.04` under `@media (any-hover: hover)` → `0.1` on `[active]`. `:not([disabled], [readonly])` guards keep the decoration off inert states.
  - **Readonly + focus-ring**: no Aura-specific rules. The base styles' dashed-border readonly affordance and `--vaadin-focus-ring-*` ring carry through unmodified — verified across the Aura baselines.
  - **Tests**: `test/visual/aura/toggle-switch.test.ts` covers 13 `it` blocks across `states` (basic / checked / required / empty / invalid), `disabled` (basic / checked / required), `readonly` (basic / checked), and `focus` (keyboard / checked / readonly). RTL direction and helper-text / error-message rendering are deliberately not re-asserted in Aura — the layout for those states comes almost entirely from the base styles, which the base visual suite already pins; an Aura-specific baseline would re-test the base behaviour with only the font family swapped in. Baselines live under `screenshots/dark/toggle-switch/baseline/` (13 PNGs).
- **Surprises:** —
- **Spec adjustments:** —

## Task 7 — Integration, snapshots, type tests, dev page

- **Commit:** (this commit)
- **Date:** 2026-05-15
- **Decisions:**
  - **Dev pages split** into the minimal `dev/toggle-switch.html` (single default switch + feature-flag boilerplate, used for spec authoring / smoke checks) and the multi-variant `dev/playground/toggle-switch.html` (8 named sections: label & state, disabled, readonly, required, invalid+errorMessage, helper text, tooltip, label-with-link). Mirrors the project convention established by `dev/checkbox.html` vs. `dev/playground/checkbox.html`. The playground page imports `@vaadin/tooltip` alongside the experimental feature-flag boilerplate; it uses the shared `.section` / `.heading` classes from `dev/common.js`.
  - **JSDoc completion** on both `vaadin-toggle-switch.js` and `vaadin-toggle-switch.d.ts`: a usage block, a `### Styling` section with three tables (parts: 6 entries; state attributes: 12 entries; CSS custom properties: 13 entries), four `@fires` lines (`change`, `checked-changed`, `invalid-changed`, `validated`), and the `@customElement` / `@extends` markers.
  - **Type surface in `vaadin-toggle-switch.d.ts`** mirrors checkbox exactly (minus indeterminate): event-detail interfaces and named `*Event` classes for the four events, `ToggleSwitchCustomEventMap`, `ToggleSwitchEventMap extends HTMLElementEventMap, ToggleSwitchCustomEventMap`, and the matching `addEventListener` / `removeEventListener` overloads on the class. No property-type narrowings — `errorMessage` / `helperText` / `accessibleName` / `accessibleNameRef` inherit the `string | null | undefined` typing from `FieldMixinClass` (matches checkbox; type test asserts the mixin type, not a tighter one).
  - **DOM snapshot suite** at `test/dom/toggle-switch.test.js` covers 5 host states (default / checked / disabled / readonly / invalid+errorMessage) plus a single `shadow > default` snapshot. The 4 redundant per-state shadow snapshots that an earlier draft included were dropped — the shadow template doesn't depend on host state, so re-asserting `shadow > checked` etc. just duplicates the default block. Matches checkbox's pattern.
  - **TypeScript type test** at `test/typings/toggle-switch.types.ts`: 11 property assertions (`autofocus`, `checked`, `disabled`, `readonly`, `required`, `invalid`, `manualValidation`, `label`, `name`, `value`), 12 mixin assertions (one per class in the mixin chain plus `CheckboxMixinClass`), and 4 event-listener overload assertions. The `document.createElement('vaadin-toggle-switch')` call exercises the `HTMLElementTagNameMap` augmentation by typing the local as `ToggleSwitch`.
- **Surprises:**
  - `yarn update:snapshots` (the in-place flag) does not prune orphan snapshot blocks when `it` blocks are deleted — the snapshot file kept the old 4 `shadow > {state}` blocks after the test bodies were removed. `rm test/dom/__snapshots__/toggle-switch.test.snap.js` followed by `yarn test:snapshots --update --group toggle-switch` produces a clean file.
  - The implementation agent generated `packages/toggle-switch/test/visual/aura/screenshots/default/` Aura baselines while running the validation suite. Per Task 6's dark-only decision, those are not committed; they stay untracked.
- **Spec adjustments:** —

## Post-Task 7 — Drop `ThemableMixin` from class chain

- **Commit:** (this commit)
- **Date:** 2026-05-18
- **Decisions:**
  - `ThemableMixin` removed from the class chain in both `src/vaadin-toggle-switch.js` and `src/vaadin-toggle-switch.d.ts`. The final chain is `CheckboxMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))))`. The component does not expose a `theme` attribute and does not register theme-scoped CSS via `registerStyles()`; Lumo styles ship through `LumoInjectionMixin`, Aura styles ship document-side via `::part()`. Neither path reads `ThemableMixin`'s style registry.
  - `assertType<ThemableMixinClass>(toggleSwitch)` and the matching import dropped from `test/typings/toggle-switch.types.ts`. The mixin assertion count goes from 12 to 11.
  - `@vaadin/vaadin-themable-mixin` stays in `package.json` runtime dependencies — `LumoInjectionMixin` is exported from the same package.
- **Surprises:** —
- **Spec adjustments:**
  - `web-component-spec.md`: import bullet for `@vaadin/vaadin-themable-mixin` rewritten to list `LumoInjectionMixin` only; Discussion entry added.
  - `web-component-tasks.md`: Task 1 and Task 2 chain references updated to drop `ThemableMixin`; Discussion entry added.
