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
