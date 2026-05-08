# ToggleSwitch Web Component Specification

> This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.toggleSwitchComponent = true`

## Key Design Decisions

1. **Tag and class.** `<vaadin-toggle-switch>` / `class ToggleSwitch` per the standard Vaadin naming rule (kebab-case tag, PascalCase class). Matches `web-component-api.md` §intro.

2. **Reuse `CheckboxMixin` from `@vaadin/checkbox` directly on the element class.** A toggle switch is a binary input field with the same plumbing requirements as a checkbox: hidden slotted `<input type="checkbox">` managed by `InputController`, `name` and `readonly` properties, required-validation pipeline, helper / error / label / tooltip slots, `LabelledInputController` for the label-for-input wiring, `ActiveMixin` / `DelegateFocusMixin` / `SlotStylesMixin`, and the Safari-tabindex / Tailwind-opacity workarounds. All of that is delivered by `CheckboxMixin` as-is. The toggle switch ships without a dedicated mixin file; the only toggle-specific behavior — overriding `_inputElementChanged` to add `role="switch"` (Decision 4) — lives directly on the element class. `CheckboxMixin` does not declare `indeterminate`; that is checkbox-specific and lives on the `Checkbox` element class.

3. **Reuse the `checkable` shared field layout** (`@vaadin/field-base/src/styles/checkable-base-styles.js`) the same way `vaadin-checkbox` and `vaadin-radio-button` do — `checkable('switch', 'toggle-switch')`. The first argument is the shadow part name; the second is the CSS-custom-property prefix. This buys the field's two-column grid (control + label/helper/error stack), the WCAG hit-target sizing for the slotted `<input>`, and the disabled-cursor wiring.

4. **Override `_inputElementChanged` to set `role="switch"` on the inner input.** `InputMixin`'s `_inputElementChanged(input, oldInput)` observer fires whenever the inner input is created or replaced. The element overrides it, calls `super._inputElementChanged(input, oldInput)` to keep the inherited add/remove-listener wiring, then sets `input.setAttribute('role', 'switch')`. This is the established Vaadin convention for adding `role` on inner inputs — `vaadin-combo-box` and `vaadin-date-picker` do the same to set `role="combobox"`. AT then announces the control as a switch (Open UI explainer; MDN switch role). See Discussion for the rationale on choosing `<input>` over a `<button role="switch">` foundation.

5. **Suppress the `[part='switch']::after` checkmark pseudo-element added by `checkable()`.** The shared style draws a checkmark mask intended for a checkbox tick. The toggle switch shows its on-state via thumb position and track color, not a glyph, so the local stylesheet sets `content: none` on `[part='switch']::after` and adds a separate `[part='thumb']` element inside the track.

6. **No `indeterminate` property and no `indeterminate-changed` event.** Per `problem-statement.md` Differentiation, the toggle switch is strictly two-state. `Checkbox` declares `indeterminate` on its element class; `ToggleSwitch` does not, so the property is simply absent.

7. **No `size` / `loading` / drag-gesture API; no in-track ON/OFF text or icon slot.** All four are out of scope per `requirements.md` Discussion. Sizing flows entirely through `--vaadin-toggle-switch-size` and `--vaadin-toggle-switch-track-width` / `--vaadin-toggle-switch-thumb-size` (themed via Lumo and Aura, overridable per-instance with `getStyle()`).

8. **CSS custom property prefix `--vaadin-toggle-switch-*`.** Follows the `--vaadin-{component}-{property}` convention from `guidelines/10-theming.md`. The prefix matches the kebab-name even though the shadow part is the shorter `switch` (Decision 3), because applications style by component name. Property set: `size`, `background`, `border-color`, `border-width`, `gap`, `label-color`, `label-font-size`, `label-font-weight`, `label-line-height`, `track-width`, `thumb-size`, `thumb-color`, `thumb-checked-color`. The `track-width` and `thumb-size` derive from `size` by default so authors who only override `size` get a proportionally scaled switch.

9. **Guideline alignment.** Shadow DOM, parts, and slot conventions follow `guidelines/08-dom.md` (state attributes table; `has-*` family; named slots with property fallback). ARIA wiring and focus delegation follow `guidelines/11-a11y.md` (`role="switch"` on the focusable element; `accessibleName` / `accessibleNameRef` pair on field components; `FieldAriaController` for label/helper/error). Lifecycle and property declarations follow `guidelines/04-coding-conventions.md` (no class-field initializers; `value:` defaults; `reflectToAttribute:` for state).

---

## Implementation

### Elements

**`<vaadin-toggle-switch>`** — a binary on/off switch control.

Shadow DOM:
```html
<div class="vaadin-toggle-switch-container">
  <div part="switch" aria-hidden="true">
    <div part="thumb"></div>
  </div>
  <slot name="input"></slot>
  <div part="label">
    <slot name="label"></slot>
    <div part="required-indicator" @click="${this._onRequiredIndicatorClick}"></div>
  </div>
  <div part="helper-text">
    <slot name="helper"></slot>
  </div>
  <div part="error-message">
    <slot name="error-message"></slot>
  </div>
</div>
<slot name="tooltip"></slot>
```

The light-DOM `<input slot="input" type="checkbox" role="switch">` is created and inserted by `InputController`. It receives delegated focus and carries the form-relevant attributes (`name`, `value`, `required`, `invalid` → `aria-invalid`, `disabled`, `readonly` → `aria-readonly`).

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `checked` | `boolean` | `false` | Yes | On/off state. Set programmatically without firing `change`; flipped by user input fires `change`. |
| `disabled` | `boolean` | `false` | Yes | Disabled state. Removes focusability and prevents activation. |
| `readonly` | `boolean` | `false` | Yes | Read-only state. Stays focusable; click and Space have no effect. Sets `aria-readonly="true"` on the inner input. |
| `required` | `boolean` | `false` | Yes | When true, the switch must be on to satisfy validation. |
| `invalid` | `boolean` | `false` | Yes | Set when validation fails. May be set by the application; the component sets it during validation. |
| `manualValidation` | `boolean` | `false` | No | When true, the component does not auto-validate — the application drives `invalid` and `errorMessage`. |
| `errorMessage` | `string` | `''` | No | Text shown when `invalid` is true. |
| `helperText` | `string` | `''` | No | Helper text shown beneath the label / switch. |
| `label` | `string` | `''` | No | Text label. Slotted content via `slot="label"` takes precedence when present. |
| `accessibleName` | `string` | — | No | Sets `aria-label` on the inner input. Used when no visible label is rendered. |
| `accessibleNameRef` | `string` | — | No | Sets `aria-labelledby` on the inner input. Mutually exclusive with `accessibleName`. |
| `name` | `string` | `''` | No (delegated as attribute on input) | Form-submission name. |
| `value` | `string` | `'on'` | No | Form-submission value (HTML default for `<input type="checkbox">`). |
| `tabindex` | `number` | `0` | Yes | Initial value `0` to preserve focus on click in Safari; delegation forwards focus to the inner input. |

Inherited reactive state attributes: `active`, `focused`, `focus-ring`, `has-label`, `has-helper`, `has-error-message`, `has-tooltip` (set by mixins).

| Slot | Description |
|---|---|
| `input` | Hidden internal `<input type="checkbox" role="switch">` created by `InputController`. Application code does not slot into this. |
| `label` | Optional label content. Falls back to the `label` property when empty. May contain an inline `<a>` — clicks on the anchor do not toggle the switch. |
| `helper` | Optional helper-text content. Falls back to the `helperText` property. |
| `error-message` | Optional error-message content. Falls back to the `errorMessage` property; only rendered/announced when `invalid`. |
| `tooltip` | Optional `<vaadin-tooltip>` whose `aria-describedby` target is the inner input. |

| Part | Description |
|---|---|
| `switch` | Stylable track that holds the thumb. Carries `aria-hidden="true"`. |
| `thumb` | Stylable circular thumb element. Translates horizontally between off and on positions. |
| `label` | Wrapper around the slotted label and the required indicator. |
| `helper-text` | Wrapper around the helper-text slot. |
| `error-message` | Wrapper around the error-message slot. |
| `required-indicator` | Visual asterisk-style required marker; clicking it toggles the switch (delegates to label click). |

| Event | Description |
|---|---|
| `change` | Fired when the user flips the switch (click, label click, Space). Not fired for programmatic value changes. |
| `checked-changed` | Fired whenever the `checked` property changes — both user-initiated and programmatic. Two-way-binding event from `notify: true`. |
| `invalid-changed` | Fired whenever the `invalid` property changes. |
| `validated` | Fired whenever the field is validated. `event.detail.valid` carries the result. |

| Method | Description |
|---|---|
| `validate()` | Re-runs validation. No-op when `manualValidation` is true. |
| `checkValidity()` | Returns `true` when not required, or when required and `checked`. |
| `focus(options)` | Inherited from `DelegateFocusMixin` / `FocusMixin`; forwards focus to the inner input. Accepts `{ focusVisible }` to control whether the focus ring is shown (see `guidelines/11-a11y.md`). |
| `blur()` | Inherited from `DelegateFocusMixin`; clears focus on the inner input. |
| `click()` | Inherited from `HTMLElement`; relayed to the inner input, so programmatic `click()` flips the switch and emits `change`. |

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-toggle-switch-size` | `1lh` | Track height. Drives the default for `track-width` and `thumb-size`. |
| `--vaadin-toggle-switch-track-width` | `calc(var(--vaadin-toggle-switch-size, 1lh) * 1.75)` | Track width. |
| `--vaadin-toggle-switch-thumb-size` | `calc(var(--vaadin-toggle-switch-size, 1lh) - 4px)` | Thumb diameter. |
| `--vaadin-toggle-switch-background` | `var(--vaadin-background-color)` | Track background (off state). |
| `--vaadin-toggle-switch-border-color` | `var(--vaadin-input-field-border-color, var(--vaadin-border-color))` | Track border color. |
| `--vaadin-toggle-switch-border-width` | `var(--vaadin-input-field-border-width, 1px)` | Track border width. |
| `--vaadin-toggle-switch-gap` | `var(--vaadin-gap-s)` | Gap between switch and label. |
| `--vaadin-toggle-switch-thumb-color` | `var(--vaadin-text-color)` | Thumb color in the off state. |
| `--vaadin-toggle-switch-thumb-checked-color` | `var(--vaadin-background-color)` | Thumb color in the on state. |
| `--vaadin-toggle-switch-label-color` | `var(--vaadin-input-field-label-color, var(--vaadin-text-color))` | Label color. |
| `--vaadin-toggle-switch-label-font-size` | `var(--vaadin-input-field-label-font-size, inherit)` | Label font size. |
| `--vaadin-toggle-switch-label-font-weight` | `var(--vaadin-input-field-label-font-weight, 500)` | Label font weight. |
| `--vaadin-toggle-switch-label-line-height` | `var(--vaadin-input-field-label-line-height, inherit)` | Label line height. |

### Internal Behavior

- **Inherited from `CheckboxMixin`.** Every behavior in `requirements.md` that the toggle switch shares with a checkbox — toggle on click / Space / label click, `change` event on user interaction (not programmatic), `checked-changed` notify event, `<a>`-in-label suppression of the `active` attribute, disabled refusal of interaction, read-only semantics with `aria-readonly` on the inner input, required validation (`checkValidity()` returns `!required || !!checked`), validation on blur, validation re-trigger on `required` removal, error-message and helper-text slot rendering, `FieldAriaController`-driven `aria-describedby` composition, native-form submission, Safari-tabindex initialisation, Tailwind-opacity override on the slotted input, `_onRequiredIndicatorClick` delegating to the label — comes from `CheckboxMixin` without modification. (Requirements 1, 2, 3, 5, 6, 7, 8, 9, 11.)

- **ARIA switch role.** The element overrides `_inputElementChanged(input, oldInput)` to set `role="switch"` on the inner input after the inherited setup runs. The native checkbox `checked` IDL property continues to drive `aria-checked` for AT, so user toggles and programmatic updates stay in sync without additional wiring. (Requirement 4.)

- **Tooltip target.** `TooltipController` is created in the element's `ready()` (after `super.ready()`) with `setAriaTarget(this.inputElement)`, so the tooltip's `aria-describedby` lands on the focusable input. The element overrides `ready()` purely for this controller; everything else stays in `CheckboxMixin`. (Requirement 10.)

---

## Reuse and Proposed Adjustments to Existing Modules

All shared modules are reused as-is — no adjustments are required.

- **`@vaadin/checkbox/src/vaadin-checkbox-mixin.js`** — `CheckboxMixin` delivers the entire binary-input field plumbing (see Decision 2). It transitively pulls in `ActiveMixin`, `CheckedMixin`, `DelegateFocusMixin`, `FieldMixin`, `SlotStylesMixin`, `InputController`, and `LabelledInputController`. The only customization is the `_inputElementChanged` override on the element class. Other current consumer: `vaadin-checkbox` itself.
- **`@vaadin/field-base/src/styles/checkable-base-styles.js`** — `checkable('switch', 'toggle-switch')` provides the field's two-column grid, label/helper/error layout, and accessible hit-target sizing. The two-argument form (introduced for radio-button: `checkable('radio', 'radio-button')`) already separates the part name from the CSS prefix. Other consumers: `vaadin-checkbox`, `vaadin-radio-button`.
- **`@vaadin/field-base/src/styles/field-base-styles.js`** — base `field` styles (label/helper/error wrappers and grid placement). Imported directly by the styles file alongside `checkable`.
- **`@vaadin/component-base/src/tooltip-controller.js`** — `TooltipController` wires the slotted tooltip with `aria-describedby` on the input. Wired directly in the element's `ready()` (not by `CheckboxMixin`), matching Checkbox's pattern.
- **`@vaadin/component-base/src/element-mixin.js`** — `ElementMixin` (telemetry / public-component registration; required for public components).
- **`@vaadin/component-base/src/polylit-mixin.js`** — `PolylitMixin` (Lit + Polymer-compat layer; required by every component).
- **`@vaadin/vaadin-themable-mixin/{vaadin-themable-mixin,lumo-injection-mixin}.js`** — `ThemableMixin` and `LumoInjectionMixin` (theming; required by every component).

---

## Discussion

**Q: Why does this spec defer most behavioral detail to `CheckboxMixin` instead of restating it?**

`CheckboxMixin` was refactored (in `refactor/checkbox-mixin`) to extract `indeterminate`-related concerns onto the `Checkbox` element class, leaving the mixin as a generic binary-input field plumbing layer. That layer is exactly what the toggle switch needs; restating its behavior here would duplicate a public, tested API. The spec's job becomes naming the toggle-specific deviations (the `role="switch"` override, the `[part='switch']::after` checkmark suppression, the CSS prefix, the absence of `indeterminate`) and pointing readers at `CheckboxMixin` for everything else. Decision 2 makes this explicit; the Internal Behavior section's "Inherited from `CheckboxMixin`" bullet collects the requirements the mixin covers.

**Q: Why was the internal control implemented as `<input type="checkbox" role="switch">` instead of `<button role="switch">`?**

The input-based path reuses the form-association, `aria-required`, `aria-invalid`, `aria-describedby`, and reset wiring that `FieldMixin` + `InputController` already deliver — the same machinery Checkbox is built on. A `<button>` foundation would require re-implementing each of those concerns. The visible affordance is identical because `role="switch"` is what AT keys off.

**Q: Why does `_inputElementChanged` rather than the `InputController` callback set `role="switch"`?**

`_inputElementChanged(input, oldInput)` is the established Vaadin pattern for setting input-level attributes from a consumer of the field-base mixins. `vaadin-combo-box` uses it to set `role="combobox"` and `aria-haspopup="dialog"`; `vaadin-date-picker` does the same. Reusing `CheckboxMixin` as-is without exposing a separate "init the input" hook keeps the mixin's surface tight; the override sits on the toggle-switch element class where it composes cleanly with the inherited behavior.

**Q: Why no `accessible-name` precedence rule when both `accessibleName` and `accessibleNameRef` are set?**

Vaadin's `HasAriaLabel` convention treats the two as mutually exclusive — the application is expected to set only one. The component does not log a warning when both are set; the implementation picks whichever its `aria-labelledby` / `aria-label` writer applied last. This matches every other field component in the repo.

**Q: Why was `<form>.reset()` synchronisation dropped from the "Inherited from `CheckboxMixin`" bullet?**

`CheckboxMixin` (and the field-base mixin chain it composes) does not currently listen for `<form>` reset events; native `<input type="checkbox">` does reset to its parsed-attribute `checked` state, but no `change` event fires, so the host's `checked` property is not auto-synced. The toggle switch inherits this gap. The behavior described in `requirements.md` Req 11 ("after `<form>.reset()`, restore initial value without emitting `change`") is therefore not provided by the current implementation; applications that need it can listen for the form's `reset` event and reset `checked` themselves, or use Vaadin's `Binder` (Flow side) which provides its own pristine/revert flow. Implementing the synchronisation upstream in `CheckboxMixin` would benefit both Checkbox and ToggleSwitch and is a candidate for a future task.
