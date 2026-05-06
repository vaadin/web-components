# ToggleSwitch Implementation Tasks

## Spec References

- [web-component-spec.md](web-component-spec.md)
- [requirements.md](requirements.md)
- [web-component-api.md](web-component-api.md)

Tasks are organised into five phases per the skill convention. Within a phase tasks may be parallelisable when their `Depends on:` lines do not chain.

---

## Phase 1 — Scaffolding

## Task 1: Package scaffolding and dev page

**Spec sections:** Key Design Decision 1 (tag and class), Reuse and Proposed Adjustments (full mixin / controller list)
**Requirements:** —
**Depends on:** —

Create the `packages/toggle-switch/` package with the file layout from `guidelines/03-component-structure.md`: `package.json` (Apache-2.0), `LICENSE`, `README.md` (shape from a sibling field component such as `packages/checkbox/README.md`), root `vaadin-toggle-switch.js` / `vaadin-toggle-switch.d.ts` re-exports, `src/vaadin-toggle-switch.js` declaring a `ToggleSwitch` class with the canonical mixin chain `ToggleSwitchMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))))`, `static get is() { return 'vaadin-toggle-switch'; }`, `static get styles() { return toggleSwitchStyles; }`, an instance `render()` returning a minimal `html\`\`` placeholder (the real shadow DOM template lands in Task 2), `static get experimental() { return true; }` (so the framework derives the flag name `toggleSwitchComponent` per `guidelines/02-design.md`), and `defineCustomElement(ToggleSwitch)`. Also create `src/vaadin-toggle-switch-mixin.js` exporting an empty mixin factory (`(superclass) => class extends superclass {}`, expanded by later tasks), `src/vaadin-toggle-switch-mixin.d.ts`, and `src/styles/vaadin-toggle-switch-base-styles.js` exporting an empty `toggleSwitchStyles` array. Add Apache 2.0 license headers to every `.js` and `.d.ts` source file. Set up `test/`, `test/dom/`, `test/typings/`, `test/visual/{base,lumo,aura}/` directories. Create `dev/toggle-switch.html` that imports `@vaadin/toggle-switch`, enables `window.Vaadin.featureFlags.toggleSwitchComponent`, and renders one default `<vaadin-toggle-switch label="Notifications">`. The package must pass `yarn lint` and `yarn lint:types`.

**Tests:**
- `customElements.get('vaadin-toggle-switch')` returns the `ToggleSwitch` class after the entry file loads with the feature flag enabled.
- `ToggleSwitch.is` equals `'vaadin-toggle-switch'`.
- A fresh `<vaadin-toggle-switch>` attaches without throwing and exposes a shadow root.
- The class's `experimental` getter returns `true` so the framework gates the component behind the `toggleSwitchComponent` feature flag.

---

## Phase 2 — Core features

## Task 2: Mixin chain, inner input, slot wiring

**Spec sections:** Key Design Decisions 2, 4, 11, 12; Implementation > Elements > shadow DOM; Internal Behavior > "ARIA switch role", "Initial value"; Reuse and Proposed Adjustments (InputController, LabelledInputController, FieldMixin, CheckedMixin, DelegateFocusMixin, ActiveMixin, SlotStylesMixin)
**Requirements:** 1, 4
**Depends on:** 1

Compose the mixin chain in `vaadin-toggle-switch-mixin.js` (`SlotStylesMixin(FieldMixin(CheckedMixin(DelegateFocusMixin(ActiveMixin(superclass)))))`); call `_setType('checkbox')` and set the field-initializer defaults `value = 'on'` and `tabindex = 0` (per `guidelines/12-checklist.md`, defaults go in field initializers, not the `value:` property option). In `ready()` add an `InputController` whose callback sets `inputElement`, `_focusElement`, `stateTarget`, `ariaTarget`, and writes `role="switch"` on the input, plus a `LabelledInputController` to bind the label slot to the input's `aria-labelledby`. Add the `slotStyles` getter that pins `vaadin-toggle-switch > input[slot='input']` to `opacity: 0` (Decision 12). Move the `render()` body from the Phase 1 placeholder to the full shadow DOM template from the Implementation section (container with `[part='switch']` wrapping `[part='thumb']`, `<slot name="input">`, `[part='label']` containing the label slot and `[part='required-indicator']` with `@click="${this._onRequiredIndicatorClick}"`, `[part='helper-text']` with helper slot, `[part='error-message']` with error slot, and `<slot name="tooltip">`). Stub `_onRequiredIndicatorClick` as a no-op on the mixin so the template binding resolves; Task 3 fills in the body.

**Tests:**
- The internal `inputElement` exists in the light DOM with `slot="input"`, `type="checkbox"`, and `role="switch"`.
- The host has `tabindex="0"` after attach (so pointer activation does not lose focus on Safari).
- `value` defaults to `"on"` per the WHATWG checkbox convention.
- The shadow DOM exposes `[part='switch']`, `[part='thumb']`, `[part='label']`, `[part='helper-text']`, `[part='error-message']`, `[part='required-indicator']`, plus the named slots `input`, `label`, `helper`, `error-message`, `tooltip`.
- A global `input { opacity: 1 }` style (mimicking Tailwind preflight) does not make the slotted input visible — the slotted input still renders with `opacity: 0`.

---

## Task 3: Toggle behavior, change event, label-click suppression

**Spec sections:** Key Design Decision 13 (label-click rule); Internal Behavior > "Toggling"; Implementation > Events
**Requirements:** 1, 2, 3
**Depends on:** 2

Wire the toggle behavior on top of `CheckedMixin`: override `_shouldSetActive(event)` to return `false` when the click target is an interactive descendant of the label (an anchor, button, or any element with native activation behavior) or when `event.target` is `_helperNode` / `_errorNode`; the exact detection mechanism is implementation work guided by Decision 13 — at minimum suppress clicks landing on `<a>` and `<button>` and let non-interactive elements (`<span>`, `<strong>`, `<em>`) pass through. Replace the Task 2 `_onRequiredIndicatorClick` stub with a delegation to `_labelNode.click()`. Confirm that user click / Space-key activation flips `checked` and dispatches `change` (the bubbling, non-composed event from the native input) while programmatic property writes only emit `checked-changed` from `notify: true`.

**Tests:**
- Clicking the inner input toggles `checked` and dispatches a bubbling `change` event whose `event.target` is the host.
- The `change` event has `bubbles: true` and `composed: false` (matching native input semantics).
- Clicking the rendered label region toggles `checked`.
- Clicking an `<a>` placed inside the label slot opens the link without changing `checked` (the `change` event does not fire).
- Clicking a `<button>` placed inside the label slot does not toggle `checked` (parity with the link case).
- Clicking a `<strong>` inside the label slot does toggle `checked` (non-interactive descendants pass through).
- Pressing Space while the inner input has focus toggles `checked`.
- Setting `checked` programmatically updates the visual state and dispatches `checked-changed` (with `event.detail.value` carrying the new boolean) but does not dispatch `change`.
- Clicking `[part='required-indicator']` toggles `checked` (delegated to the label).

---

## Task 4: Disabled state

**Spec sections:** Internal Behavior > "Disabled"; Implementation > Properties (`disabled`); Reuse and Proposed Adjustments (`DisabledMixin`, `TabindexMixin`)
**Requirements:** 5
**Depends on:** 3

Verify `DisabledMixin`'s `disabled` property is reflected on the host and propagates `aria-disabled`; `TabindexMixin` sets `tabindex="-1"` on the host while disabled and restores the prior value when re-enabled. Add no new logic — this task is a coverage task exercising the inherited behavior plus the spec's explicit "programmatic flips on a disabled switch are allowed" rule.

**Tests:**
- Setting `disabled` reflects the attribute on the host and sets `aria-disabled="true"` on the inner input.
- Clicking the inner input or the label while `disabled` does not toggle `checked` and does not dispatch `change`.
- Pressing Space while the input has focus and the host is `disabled` does not toggle `checked`.
- The host's `tabindex` is `-1` while disabled and is restored to `0` when `disabled` is removed.
- Setting `checked = true` programmatically while `disabled` updates the visual state and dispatches `checked-changed` but does not dispatch `change`.

---

## Task 5: Read-only state

**Spec sections:** Key Design Decision 6; Internal Behavior > "Read-only"; Implementation > Properties (`readonly`)
**Requirements:** 6
**Depends on:** 3

Declare the `readonly` boolean property (reflectToAttribute) in the mixin. React to changes in `readonly` and `inputElement` from Lit's `updated(changed)` hook — when either changes, call a private `__readonlyChanged(readonly, inputElement)` helper that adds or removes `aria-readonly` on the inner input. Use `updated(changed)` rather than `static get observers()`, per `guidelines/04-coding-conventions.md` which prefers Lit's reactive lifecycle for new components. Add `_onInputClick` that calls `event.preventDefault()` when `readonly`; register the listener via `_addInputListeners` / `_removeInputListeners`. Extend `_shouldSetActive` (from Task 3) to also return `false` when `readonly`. Read-only must keep the host focusable (`tabindex="0"`) and the inner input focusable.

**Tests:**
- Setting `readonly` reflects the attribute on the host and sets `aria-readonly="true"` on the inner input.
- Removing `readonly` removes `aria-readonly` from the inner input.
- Clicking the inner input or the label while `readonly` does not toggle `checked` and does not dispatch `change`.
- Pressing Space while the input has focus and the host is `readonly` does not toggle `checked`.
- The host remains focusable (`tabindex="0"`) and the inner input is reachable by Tab while `readonly`.
- The `active` attribute is not set on the host during pointer-down or Space-press while `readonly`.
- Setting `checked = true` programmatically while `readonly` updates the visual state and dispatches `checked-changed`.

---

## Task 6: Required validation, error message, manual validation

**Spec sections:** Key Design Decision 7; Internal Behavior > "Required validation", "Helper text and error message rendering"; Implementation > Properties (`required`, `invalid`, `manualValidation`, `errorMessage`); Implementation > Events (`validated`, `invalid-changed`)
**Requirements:** 7, 9
**Depends on:** 3

Wire validation on top of `FieldMixin` / `ValidateMixin`: implement `checkValidity()` returning `!this.required || !!this.checked`; override `_setFocused(focused)` so blur (when `document.hasFocus()`) requests validation; register `_createMethodObserver('_checkedChanged(checked)')` in `ready()` and add `_checkedChanged(checked)` requesting validation after the initial value is processed; override `_requiredChanged(required)` to re-validate when `required` is removed. Forward `name`, `invalid`, and `required` via `delegateAttrs` so the inner input carries `aria-required` / `aria-invalid`. The `validated` event and `manualValidation` flag come from the mixin chain — verify they behave as the spec describes.

**Tests:**
- A required toggle switch that has not yet been touched is not `invalid` (no validation runs before user interaction).
- The `[part='required-indicator']` element renders only when `required` is set; it disappears when `required` is removed.
- Calling `validate()` (or blurring) on a required, off switch sets `invalid` to `true`, dispatches `invalid-changed`, and dispatches `validated` with `event.detail.valid === false`.
- Toggling a required switch on clears `invalid`, dispatches `invalid-changed` with `value: false`, and dispatches `validated` with `event.detail.valid === true`.
- Removing `required` on a previously-invalid switch re-runs validation and clears `invalid`.
- With `manualValidation = true`, blurring or toggling does not change `invalid`; the application can set `invalid = true` and `errorMessage` directly and the `validated` event does not fire automatically.
- Setting `errorMessage` populates the error-message slot fallback; the host gains the `has-error-message` state attribute when the error slot has content and `invalid` is true.
- The inner input carries `aria-required="true"` when `required` is set and `aria-invalid="true"` when `invalid` is set.

---

## Task 7: Form participation, name/value submission, reset

**Spec sections:** Internal Behavior > "Form submission"; Implementation > Properties (`name`, `value`); Key Design Decision 5 (no indeterminate)
**Requirements:** 2, 11
**Depends on:** 4, 5

Native `<input type="checkbox">` plus `delegateAttrs` for `name` already deliver form submission for the checked / unchecked / disabled cases. For form reset, the host's `checked` property does not auto-sync from the inner input — wire a listener that observes the input's reset propagation and updates `this.checked` to the input's post-reset state without dispatching `change` (only `checked-changed` from the property notify). The simplest hook is `input.addEventListener('reset')` won't work — the platform fires the `reset` event on the form, not the input — so listen for the form's reset via `input.form?.addEventListener('reset', ...)` after attach, or observe the input's `checked` IDL after a microtask following the form's reset event. The implementation choice is open as long as the observable behavior matches the tests.

**Tests:**
- A checked toggle switch placed inside a `<form>` with `name="twoFactor" value="required"` submits the entry `twoFactor=required` (verified via `new FormData(form)`).
- An unchecked toggle switch in a form contributes nothing to `FormData`.
- A disabled, checked toggle switch in a form contributes nothing to `FormData`.
- A read-only, checked toggle switch in a form submits the entry the same as a regular checked switch.
- After `form.reset()`, a switch whose initial markup was `<vaadin-toggle-switch checked>` returns to `checked = true`; the host's `checked` property reflects the new value and `checked-changed` fires with `value: true`, but `change` does not fire.
- After `form.reset()`, a switch whose initial markup was unchecked returns to `checked = false` similarly.

---

## Task 8: Helper text, label, accessible name, tooltip

**Spec sections:** Internal Behavior > "Field ARIA wiring", "Helper text and error message rendering", "Tooltip target"; Implementation > Properties (`label`, `helperText`, `accessibleName`, `accessibleNameRef`); Implementation > Slots (`label`, `helper`, `error-message`, `tooltip`); Reuse and Proposed Adjustments (`FieldMixin`, `TooltipController`)
**Requirements:** 3, 8, 10
**Depends on:** 2

Verify the slotted `label`, `helper`, and `error-message` content and the corresponding `label`, `helperText`, `errorMessage` property fallbacks (delivered by `FieldMixin`); confirm `accessibleName` writes `aria-label` on the inner input and `accessibleNameRef` writes `aria-labelledby`. Wire the tooltip in `ready()` with `TooltipController` whose `setAriaTarget(this.inputElement)` makes the tooltip's `aria-describedby` land on the inner input. The `has-label`, `has-helper`, `has-error-message`, `has-tooltip` state attributes come from `FieldMixin` / `TooltipController` — verify they are reflected.

**Tests:**
- Setting `label="Notifications"` populates the label slot and reflects `has-label` on the host.
- Slotting custom HTML into `slot="label"` (e.g. a span with an inline anchor) takes precedence over the `label` property and reflects `has-label`.
- Setting `helperText="Save changes every 30 seconds"` populates the helper slot and reflects `has-helper`.
- Setting `errorMessage="Required"` populates the error-message slot; combined with `invalid = true`, the host reflects `has-error-message`.
- Setting `accessibleName="Active"` writes `aria-label="Active"` on the inner input and does not write `aria-labelledby`.
- Setting `accessibleNameRef="external-id"` writes `aria-labelledby="external-id"` on the inner input.
- Slotting `<vaadin-tooltip slot="tooltip" text="…">` reflects `has-tooltip` on the host and adds the tooltip element's id to the inner input's `aria-describedby`.
- The label slot's `for` association makes clicking the label flip the inner input (already covered by Task 3, but verified here as the label-pathway side of FieldMixin's contract).

---

## Phase 3 — Cross-cutting concerns

## Task 9: Accessibility & keyboard interaction

**Spec sections:** Key Design Decisions 4, 14; Internal Behavior > "ARIA switch role", "Field ARIA wiring"; Implementation > Methods (`focus`, `blur`, `click`)
**Requirements:** 1, 4, 8, 9, 10
**Depends on:** 6, 8

Verify the cross-element ARIA story documented by the spec: the inner input announces as a switch (`role="switch"`), `aria-checked` tracks `checked` for both user and programmatic updates, `aria-required` and `aria-invalid` are forwarded via `delegateAttrs` (Task 6), and `aria-describedby` is composed from the helper-text id, error-message id (when invalid), and tooltip id (Task 8) by `FieldAriaController`. Confirm focus delegation: `host.focus()` and `host.focus({ focusVisible: true })` move focus to the inner input, `host.blur()` clears it, and `host.click()` flips the switch (relayed to the inner input). Programmatic `focus({ focusVisible: false })` does not set the `focus-ring` attribute.

**Tests:**
- After attach, the inner input reports `role="switch"` and `aria-checked="false"`.
- Toggling `checked` (user click and programmatic write) updates `aria-checked` on the inner input synchronously.
- `host.focus()` results in `document.activeElement === inputElement` and the host carries the `focused` attribute and the `focus-ring` attribute.
- `host.focus({ focusVisible: false })` focuses the input but does not set `focus-ring`.
- `host.blur()` clears `focused` and `focus-ring` from the host.
- `host.click()` flips `checked` and dispatches `change`.
- Setting `helperText`, then `errorMessage` + `invalid`, then slotting a tooltip composes `aria-describedby` on the inner input to include each of those slot ids in turn; clearing them removes the corresponding ids.
- Pressing Space while the inner input has keyboard focus toggles `checked` and the host shows the `active` attribute while Space is held.

---

## Phase 4 — Styling

## Task 10: Base styles completion

**Spec sections:** Key Design Decisions 2, 3, 10, 14; Implementation > Elements > shadow DOM; Implementation > CSS Custom Properties; Implementation > Parts; `guidelines/10-theming.md`
**Requirements:** 1, 4, 5, 6, 7, 9
**Depends on:** 9

Flesh out `vaadin-toggle-switch-base-styles.js` per the spec: import `field` and `checkable('switch', 'toggle-switch')` from `@vaadin/field-base/src/styles/`, then add the toggle-specific block — track sizing, the thumb element (`[part='thumb']`) absolute-positioned with a `transform` translation in the on state, suppression of the `[part='switch']::after` checkmark (Decision 3), `:host([readonly])` (dashed border, transparent / muted-text background per state), `:host([disabled])` (muted thumb), the standard `:host([hidden]) { display: none !important }`, the standard `:host(:is([focus-ring], :focus-visible))` outline rule, the RTL-flipped thumb translation under `:host([dir='rtl'][checked]) [part='thumb']`, and a `@media (forced-colors: active)` block setting the on/off colors to system colors. Every CSS custom property listed in the Implementation > CSS Custom Properties table (size, track-width, thumb-size, background, border-color, border-width, gap, label-color, label-font-size, label-font-weight, label-line-height, thumb-color, thumb-checked-color) must be wired with fallbacks to design-token-level variables (`--vaadin-text-color`, `--vaadin-background-color`, etc.). The base visual tests cover the default off / on / disabled / disabled+checked / readonly / readonly+checked / focus-ring / invalid combinations.

**Tests:**
- Visual test: default off state renders with the thumb at the start of the track (LTR) and matches the baseline under `test/visual/base/toggle-switch/baseline/basic.png`.
- Visual test: checked state renders with the thumb translated to the end (LTR) and matches `checked.png`.
- Visual test: disabled and disabled+checked match their respective baselines (muted thumb).
- Visual test: read-only and read-only+checked match their respective baselines (dashed border, distinct background).
- Visual test: focus-ring state renders the outline ring.
- Visual test: invalid state matches its baseline.
- Visual test: under `dir="rtl"`, the checked-state thumb translates to the start of the track (mirrored).
- Computed style: each of `--vaadin-toggle-switch-track-width`, `--vaadin-toggle-switch-thumb-size`, `--vaadin-toggle-switch-thumb-color`, `--vaadin-toggle-switch-thumb-checked-color`, `--vaadin-toggle-switch-background`, `--vaadin-toggle-switch-border-color`, `--vaadin-toggle-switch-gap`, and the four `--vaadin-toggle-switch-label-*` properties produces the expected change when overridden inline on the host (covered by parameterised computed-style assertions, not one test per property).

---

## Task 11: Lumo theme

**Spec sections:** Key Design Decision 10; `guidelines/10-theming.md` ("Lumo")
**Requirements:** —
**Depends on:** 10

Create `packages/vaadin-lumo-styles/components/toggle-switch.css` (the public entry with `--_lumo-vaadin-toggle-switch-inject` markers and the `lumo_components_toggle-switch` module name) and `packages/vaadin-lumo-styles/src/components/toggle-switch.css` (the actual styles wrapped in `@media lumo_components_toggle-switch`). Bind every `--vaadin-toggle-switch-*` custom property to a Lumo design token: backgrounds to `--lumo-contrast-*pct`, text color to `--lumo-primary-text-color` / `--lumo-disabled-text-color`, primary on-state background to `--lumo-primary-color`, focus ring to `--lumo-primary-color-50pct`, font tokens to the corresponding `--lumo-font-*`. Cover the same state matrix the base task did, plus any Lumo-specific accents.

**Tests:**
- Lumo visual test: default off state matches `test/visual/lumo/toggle-switch/baseline/basic.png`.
- Lumo visual test: checked, disabled, disabled+checked, readonly, readonly+checked, focus-ring, invalid — each matches its Lumo baseline.
- Toggling a Lumo-themed switch in the integration page exercises the focus-ring shadow color and primary-color background as expected.

---

## Task 12: Aura theme

**Spec sections:** Key Design Decision 10; `guidelines/10-theming.md` ("Aura")
**Requirements:** —
**Depends on:** 10

Create `packages/aura/src/components/toggle-switch.css` and import it in `packages/aura/aura.css`. Bind `--vaadin-toggle-switch-*` custom properties to Aura tokens: surfaces, accent system, contrast levels, gap and padding tokens, the Aura font family and font-size scale, focus ring via `--vaadin-focus-ring-*`. Cover the same state matrix as the base task (default, checked, disabled variants, readonly variants, focus-ring, invalid).

**Tests:**
- Aura visual test: default off state matches `test/visual/aura/toggle-switch/baseline/basic.png`.
- Aura visual test: checked, disabled, disabled+checked, readonly, readonly+checked, focus-ring, invalid — each matches its Aura baseline.
- Aura's accent system (e.g. `theme="accent-surface"` if applied at the parent) applies cleanly to the toggle switch when the parent overrides the relevant tokens.

---

## Phase 5 — Integration

## Task 13: Integration, snapshots, type tests, dev page

**Spec sections:** All; `guidelines/12-checklist.md`
**Requirements:** —
**Depends on:** 11, 12

Finalise the package: extend `dev/toggle-switch.html` to exercise every variant covered in tests (default, checked, disabled, disabled+checked, readonly, readonly+checked, required, invalid+errorMessage, with-helperText, with-tooltip, label-with-link, in-form, RTL block) so the dev page can be used for manual visual review in both themes. Author DOM snapshot tests at `test/dom/toggle-switch.test.js` covering the default attached state, the checked state, the disabled state, the readonly state, and the invalid state — locking in the host's reflected attributes plus the shadow DOM structure. Author `test/typings/toggle-switch.types.ts` asserting the public type surface: `ToggleSwitch` element, `ToggleSwitchChangeEvent`, `ToggleSwitchCheckedChangedEvent`, `ToggleSwitchInvalidChangedEvent`, `ToggleSwitchValidatedEvent`, the `ToggleSwitchEventMap`, and the `HTMLElementTagNameMap` augmentation. Verify the mixin `.d.ts` declares the `Constructor<X> & Constructor<Y> & T` intersection so the mixin chain types compile (per `guidelines/12-checklist.md`). Complete the class-level JSDoc in `vaadin-toggle-switch.js` with the styling tables (parts, state attributes, custom CSS properties) and `@fires` lines for `change`, `checked-changed`, `invalid-changed`, `validated`. Run the full validation suite.

**Tests:**
- DOM snapshot: default attached state matches the captured snapshot.
- DOM snapshot: each of (checked, disabled, readonly, invalid+errorMessage) matches its snapshot.
- TypeScript type test passes `yarn lint:types`: `ToggleSwitch` event-listener overloads accept the typed events, `HTMLElementTagNameMap['vaadin-toggle-switch']` resolves to `ToggleSwitch`, and assigning a non-event to a typed listener fails compilation.
- `yarn lint`, `yarn test --group toggle-switch`, `yarn test:snapshots --group toggle-switch`, `yarn test:base --group toggle-switch`, `yarn test:lumo --group toggle-switch`, `yarn test:aura --group toggle-switch` all pass.
- The dev page renders every variant in both Lumo and Aura themes when toggling the dev shell's theme switcher.
