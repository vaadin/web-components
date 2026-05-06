# ToggleSwitch Web Component Specification

> This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.toggleSwitchComponent = true`

## Key Design Decisions

1. **Tag and class.** `<vaadin-toggle-switch>` / `class ToggleSwitch` / `ToggleSwitchMixin` per the standard Vaadin naming rule (kebab-case tag, PascalCase class, mixin file `vaadin-toggle-switch-mixin.js`). Matches `web-component-api.md` §intro.

2. **Reuse the `checkable` shared field layout** (`@vaadin/field-base/src/styles/checkable-base-styles.js`) the same way `vaadin-checkbox` and `vaadin-radio-button` do — `checkable('switch', 'toggle-switch')`. The first argument is the shadow part name; the second is the CSS-custom-property prefix. This buys the field's two-column grid (control + label/helper/error stack), the WCAG hit-target sizing for the slotted `<input>`, and the disabled-cursor wiring. No modification to `checkable()` is needed; the existing `(part, propName)` two-argument shape already separates "what the part is called" from "how the CSS variables are namespaced", which is precisely what this component requires.

3. **Suppress the `[part='switch']::after` checkmark pseudo-element added by `checkable()`.** The shared style draws a checkmark mask intended for a checkbox tick. The toggle switch shows its on-state via thumb position and track color, not a glyph, so the local stylesheet sets `content: none` on `[part='switch']::after` and adds a separate `[part='thumb']` element inside the track. No new variant is added to `checkable()` for this — the override is local.

4. **Internal control: `<input type="checkbox" role="switch">`** delivered via `InputController` (the same controller `vaadin-checkbox` uses), with `role="switch"` applied to the input element. This keeps the field-mixin / form-submission / focus-delegation machinery identical to Checkbox while making screen readers announce the control as a switch (Open UI explainer; MDN switch role; Adrian Roselli's "Switch role support"). See Discussion for the rationale on choosing `<input>` over a `<button role="switch">` foundation.

5. **No `indeterminate` property and no `indeterminate-changed` event.** Per `problem-statement.md` Differentiation, the toggle switch is strictly two-state. This is the only intentional removal from the Checkbox-style API surface; nothing else is dropped.

6. **`readonly` is a component-managed attribute, not a delegated input attribute.** Native `<input type="checkbox">` does not honor `readonly`, so the mixin observes `readonly` changes and writes `aria-readonly` on the input directly while preventing toggling via a click handler that calls `event.preventDefault()`. This is the same approach Checkbox uses. Read-only is reflected on the host so that the `:host([readonly])` styling in §Implementation works.

7. **Validation rule: required ⇒ on.** `checkValidity()` returns `!this.required || !!this.checked` — turning the switch on satisfies a required constraint, leaving it off fails. Validation is requested on blur (via `_setFocused(false)` when the document still has focus) and on `_checkedChanged` after the initial value, so a freshly-rendered required switch is not invalid until the user has interacted. Identical to Checkbox.

8. **Tooltip target.** `TooltipController` is wired in `ready()` with `setAriaTarget(this.inputElement)` so `aria-describedby` is set on the focusable input rather than the host — same as Checkbox. The tooltip element is slotted via `slot="tooltip"`.

9. **No `size` / `loading` / drag-gesture API; no in-track ON/OFF text or icon slot.** All four are out of scope per `requirements.md` Discussion. Sizing flows entirely through `--vaadin-toggle-switch-size` and `--vaadin-toggle-switch-track-width` / `--vaadin-toggle-switch-thumb-size` (themed via Lumo and Aura, overridable per-instance with `getStyle()`).

10. **CSS custom property prefix `--vaadin-toggle-switch-*`.** Follows the `--vaadin-{component}-{property}` convention from `guidelines/10-theming.md`. The prefix matches the kebab-name even though the shadow part is the shorter `switch` (decision 2), because applications style by component name. Property set: `size`, `background`, `border-color`, `border-width`, `gap`, `label-color`, `label-font-size`, `label-font-weight`, `label-line-height`, `track-width`, `thumb-size`, `thumb-color`, `thumb-checked-color`. The `track-width` and `thumb-size` derive from `size` by default so authors who only override `size` get a proportionally scaled switch.

11. **Initial `tabindex="0"` on the host.** Set in the mixin constructor so that pointer activation does not lose focus in Safari (matches Checkbox; see Discussion for the upstream Safari behavior). Focus is then delegated to the inner input by `DelegateFocusMixin` / `InputController`. When the host is disabled, `TabindexMixin` sets `tabindex="-1"` on the host and restores the prior value when re-enabled.

12. **Slotted-input opacity override via `SlotStylesMixin`.** The internal input is hidden visually but kept in the accessibility tree. The mixin injects an outer-scope rule that pins the slotted input to `opacity: 0` so global stylesheets (notably Tailwind preflight) cannot override it; matches Checkbox.

13. **Label-click rule covers interactive descendants generically, not only `<a>`.** Per requirement 3, clicks landing on interactive elements inside the label (links, buttons, anything with `pointer-events` enabled and an activation behavior) must not toggle the switch; clicks on non-interactive label content (`<strong>`, `<em>`, `<span>`, plain text) toggle as usual. This expands beyond Checkbox's `<a>`-only check; see Discussion.

14. **Guideline alignment.** Shadow DOM, parts, and slot conventions follow `guidelines/08-dom.md` (state attributes table; `has-*` family; named slots with property fallback). ARIA wiring and focus delegation follow `guidelines/11-a11y.md` (`role="switch"` on the focusable element; `accessibleName` / `accessibleNameRef` pair on field components; `FieldAriaController` for label/helper/error). Lifecycle and property declarations follow `guidelines/04-coding-conventions.md` (no class-field initializers; `value:` defaults; `reflectToAttribute:` for state).

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

The light-DOM `<input slot="input" type="checkbox" role="switch">` is created and inserted by `InputController` in `ready()`. It receives delegated focus and carries the form-relevant attributes (`name`, `value`, `required`, `invalid` → `aria-invalid`, `disabled`, `readonly` → `aria-readonly`).

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
| `label` | Optional label content. Falls back to the `label` property when empty. May contain interactive children (links, buttons) — clicks on those do not toggle the switch. |
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

- **Toggling.** A click on the inner input or on `[part='label']` (excluding any interactive descendant of the label — links, buttons, etc.; see Decision 13), or a Space-key press while the inner input is focused, flips `checked`. A click on `[part='required-indicator']` is delegated to the label and also flips `checked`. Each user-initiated flip emits `change`; programmatic assignment of `checked` emits only `checked-changed`. (Requirements 1, 2, 3.)

- **ARIA switch role.** `InputController` is configured to set `role="switch"` on the inner input immediately after creation. The native checkbox `checked` IDL property continues to drive `aria-checked` for AT, so user toggles, programmatic updates, and `<form>.reset()` all stay in sync without additional wiring. (Requirement 4.)

- **Disabled.** Inherited `DisabledMixin` reflects `disabled` on the host and adds `aria-disabled`. `TabindexMixin` sets `tabindex="-1"` on the host while disabled and restores the prior value when re-enabled, so the host (and via delegation the inner input) is removed from the Tab order. Programmatic `checked` writes still propagate; user activation does not. (Requirement 5.)

- **Read-only.** A `readonly` change writes `aria-readonly="true"` on the inner input (native `<input type="checkbox">` does not honor `readonly` itself, so the mapping is component-managed). User activation is suppressed: clicks on the input call `preventDefault()`, and the `active` attribute is not applied. The host stays focusable and Tab-reachable. (Requirement 6.)

- **Required validation.** `checkValidity()` returns `!this.required || !!this.checked`. `aria-required` is forwarded to the inner input via `delegateAttrs`, so screen readers announce the required state. Validation is requested:
  - On blur (when the document still has focus — tab-switching past the window does not trigger validation).
  - After every `checked` change once the initial value has been processed.
  - When `required` is removed (so a previously-invalid switch clears).

  When `manualValidation` is true, the component does not auto-validate; the application drives `invalid` and `errorMessage`. `validate()` re-runs validation on demand. (Requirements 7, 9.)

- **Form submission.** The inner input is a real `<input type="checkbox">` in light DOM, so it participates in `<form>` submission and `<form>.reset()` natively: on submit it contributes `name=value` when checked and nothing when unchecked or disabled; on reset it returns to its parsed-attribute `checked` state. The component listens for the input's reset propagation and synchronizes the host's `checked` property accordingly, firing `checked-changed` (so two-way bindings observe the rollback) but not `change`. (Requirements 2, 11.)

- **Field ARIA wiring.** `FieldMixin` (via `FieldAriaController`) sets `aria-labelledby` on the inner input pointing at the label slot, and `aria-describedby` pointing at the helper-text slot, the error-message slot, and the tooltip target — added and removed dynamically as those slots gain or lose content. `accessibleName` writes `aria-label` on the inner input; `accessibleNameRef` writes `aria-labelledby`. The two are mutually exclusive (the implementation picks one source at a time per Vaadin's `HasAriaLabel` convention). (Requirements 3, 8, 9, 10.)

- **Helper text and error message rendering.** When `errorMessage` is set or content is slotted into `slot="error-message"` AND the host is `invalid`, the error-message wrapper is shown and `has-error-message` is reflected on the host. When `invalid` clears, the wrapper is hidden again and `aria-describedby` is updated to drop the error-message ID. The helper text wrapper is shown whenever `helperText` is set or the slot has content (independent of validity), reflected as `has-helper`. (Requirements 8, 9.)

- **Tooltip target.** The slotted `<vaadin-tooltip>` is wired by `TooltipController` with the inner input as its ARIA target, so the tooltip ID is added to the input's `aria-describedby`. The tooltip opens on host hover and on inner-input focus. (Requirement 10.)

- **Initial value.** `value` defaults to `'on'` (HTML spec for `<input type="checkbox">`). `checked` defaults to `false`. `tabindex` is initialized to `0` (Decision 11).

---

## Reuse and Proposed Adjustments to Existing Modules

All shared modules are reused as-is — no adjustments are required.

- **`@vaadin/field-base/src/styles/checkable-base-styles.js`** — `checkable('switch', 'toggle-switch')` provides the field's two-column grid, label/helper/error layout, and accessible hit-target sizing. The two-argument form (introduced for radio-button: `checkable('radio', 'radio-button')`) already separates the part name from the CSS prefix, so toggle-switch's `switch` / `toggle-switch` mapping needs no API change. Other current consumers: `vaadin-checkbox` (`checkable('checkbox')`), `vaadin-radio-button` (`checkable('radio', 'radio-button')`).
- **`@vaadin/field-base/src/styles/field-base-styles.js`** — base `field` styles (label/helper/error wrappers and grid placement). Used by every field component.
- **`@vaadin/field-base/src/checked-mixin.js`** — `CheckedMixin` provides `checked` reactive property + `_toggleChecked` hook + `_addInputListeners` toggle wiring. Used by Checkbox.
- **`@vaadin/field-base/src/field-mixin.js`** — `FieldMixin` (label/helper/error/required-indicator slots, `errorMessage`, `helperText`, label slot controller, `accessibleName`, `accessibleNameRef`, `aria-labelledby` / `aria-describedby` wiring via `FieldAriaController`). Used by every field.
- **`@vaadin/field-base/src/input-controller.js`** — `InputController` creates the slotted hidden `<input>` and exposes `inputElement`. Toggle-switch's only customization is calling `input.setAttribute('role', 'switch')` in the callback. Used by Checkbox.
- **`@vaadin/field-base/src/labelled-input-controller.js`** — `LabelledInputController` wires the host label as a `<label for="…">` for the inner input. Used by Checkbox.
- **`@vaadin/a11y-base/src/active-mixin.js`** — `ActiveMixin` toggles the `active` attribute. Toggle-switch overrides `_shouldSetActive` to skip readonly, links, and helper/error nodes (same overrides as Checkbox).
- **`@vaadin/a11y-base/src/delegate-focus-mixin.js`** — `DelegateFocusMixin` forwards `focus()` / `blur()` from the host to the inner input.
- **`@vaadin/component-base/src/slot-styles-mixin.js`** — `SlotStylesMixin` injects the `opacity: 0` rule on the slotted input.
- **`@vaadin/component-base/src/tooltip-controller.js`** — `TooltipController` wires the slotted tooltip with `aria-describedby` on the input.
- **`@vaadin/component-base/src/element-mixin.js`** — `ElementMixin` (telemetry / public-component registration; required for public components).
- **`@vaadin/component-base/src/polylit-mixin.js`** — `PolylitMixin` (Lit + Polymer-compat layer; required by every component).
- **`@vaadin/vaadin-themable-mixin/{vaadin-themable-mixin,lumo-injection-mixin}.js`** — `ThemableMixin` and `LumoInjectionMixin` (theming; required by every component).

---

## Discussion

**Q: Why was the internal control implemented as `<input type="checkbox" role="switch">` instead of `<button role="switch">`?**

The input-based path reuses the form-association, `aria-required`, `aria-invalid`, `aria-describedby`, and reset wiring that `FieldMixin` + `InputController` already deliver — the same machinery Checkbox is built on. A `<button>` foundation would require re-implementing each of those concerns. The input approach is what the prototype validated; the button approach (advocated by Adrian Roselli's article) was considered but rejected on cost-of-divergence grounds. The visible affordance is identical because `role="switch"` is what AT keys off.

**Q: Why was the label-click suppression generalised beyond `<a>`?**

Checkbox checks only `event.target.localName === 'a'` to decide whether to suppress the active state. Requirement 3 explicitly demands that interactive elements within the label — links and buttons — both pass through to their own activation. Decision 13 widens the exclusion to all interactive descendants. Implementation can detect interactivity via tag name (`a`, `button`, `input`, `select`, `textarea`), `tabindex >= 0`, or a `role` of `button` / `link` — exact mechanism is implementation work.

**Q: Why was the initial host `tabindex` pinned to `0` in the constructor (Decision 11)?**

Pointer activation in Safari moves focus away from the host when the host is not focusable, breaking subsequent keyboard interaction with the switch. Setting `tabindex="0"` upfront keeps the host in the Tab order until `TabindexMixin` overrides it (e.g. on disable). The Checkbox component carries the same workaround (originally landed via vaadin/web-components#6780).

**Q: Why does `SlotStylesMixin` re-inject `opacity: 0` on the slotted input (Decision 12)?**

Tailwind's preflight applies `opacity: 1` to all `input` elements globally, which would un-hide the slotted input. The mixin injects an outer-scope rule pinned to the host's local name (`vaadin-toggle-switch > input[slot='input'] { opacity: 0 }`) so the slotted input stays visually hidden while remaining in the accessibility tree. Same workaround as Checkbox (vaadin/web-components#8881).

**Q: Why no `accessible-name` precedence rule when both `accessibleName` and `accessibleNameRef` are set?**

Vaadin's `HasAriaLabel` convention treats the two as mutually exclusive — the application is expected to set only one. The component does not log a warning when both are set; the implementation picks whichever its `aria-labelledby` / `aria-label` writer applied last. This matches every other field component in the repo.
