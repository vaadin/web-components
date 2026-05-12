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
