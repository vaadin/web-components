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
