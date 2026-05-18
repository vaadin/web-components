# ToggleSwitch Implementation Tasks

## Spec References

- [web-component-spec.md](web-component-spec.md)
- [requirements.md](requirements.md)
- [web-component-api.md](web-component-api.md)

Tasks are organised into five phases per the skill convention. Within a phase, tasks may be parallelisable when their `Depends on:` lines do not chain.

---

## Phase 1 — Scaffolding

## Task 1: Package scaffolding and dev page

**Spec sections:** Key Design Decisions 1, 2; Reuse and Proposed Adjustments
**Requirements:** —
**Depends on:** —

Create the `packages/toggle-switch/` package with the file layout from `guidelines/03-component-structure.md`: `package.json` (Apache-2.0; declare `@vaadin/checkbox` as a runtime dependency, plus `@vaadin/component-base`, `@vaadin/field-base`, `@vaadin/vaadin-themable-mixin`), `LICENSE`, `README.md` (shape from `packages/checkbox/README.md`), root `vaadin-toggle-switch.js` / `vaadin-toggle-switch.d.ts` re-exports, `src/vaadin-toggle-switch.js` declaring a `ToggleSwitch` class with the bare-bones chain `ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement)))` — **no `CheckboxMixin` yet** — `static get is() { return 'vaadin-toggle-switch'; }`, `static get styles() { return toggleSwitchStyles; }`, an instance `render()` returning a literal `html\`\`` placeholder, `static get experimental() { return true; }` (so the framework derives the flag name `toggleSwitchComponent`), and `defineCustomElement(ToggleSwitch)`. Task 2 swaps `CheckboxMixin` into the chain together with the shadow DOM template that supplies the slots its slot-controllers require. Also create `src/styles/vaadin-toggle-switch-base-styles.js` exporting an empty `toggleSwitchStyles` array. There is no toggle-specific mixin file. Add Apache 2.0 license headers to every `.js` and `.d.ts` source file. Set up `test/`, `test/dom/`, `test/typings/`, `test/visual/{base,lumo,aura}/` directories. Create `dev/toggle-switch.html` that imports `@vaadin/toggle-switch`, enables `window.Vaadin.featureFlags.toggleSwitchComponent`, and renders one default `<vaadin-toggle-switch>` (no label yet — Task 2's mixin/template wires the label slot). The package must pass `yarn lint` and `yarn lint:types`.

**Tests:**
- `customElements.get('vaadin-toggle-switch')` returns the `ToggleSwitch` class after the entry file loads with the feature flag enabled.
- `ToggleSwitch.is` equals `'vaadin-toggle-switch'`.

---

## Phase 2 — Core features

## Task 2: Element class wiring — shadow DOM, `role="switch"`, tooltip

**Spec sections:** Key Design Decisions 2, 4; Implementation > Elements > shadow DOM; Internal Behavior > "ARIA switch role", "Tooltip target"
**Requirements:** 1, 4, 10
**Depends on:** 1

Swap `CheckboxMixin` from `@vaadin/checkbox/src/vaadin-checkbox-mixin.js` into the class chain (the chain becomes `CheckboxMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))))`) and replace the Phase 1 placeholder `render()` body with the full shadow DOM template from the Implementation section (container with `[part='switch']` wrapping `[part='thumb']`, `<slot name="input">`, `[part='label']` containing the label slot and `[part='required-indicator']` with `@click="${this._onRequiredIndicatorClick}"`, `[part='helper-text']` with helper slot, `[part='error-message']` with error slot, and `<slot name="tooltip">`). Override `_inputElementChanged(input, oldInput)` on the element class to call `super._inputElementChanged(input, oldInput)` and then, when `input` is defined, set `input.setAttribute('role', 'switch')` (Decision 4 — same convention `vaadin-combo-box` and `vaadin-date-picker` use). Override `ready()` to call `super.ready()` and then create a `TooltipController` with `setAriaTarget(this.inputElement)` so the slotted `<vaadin-tooltip>` writes its id to the inner input's `aria-describedby`. Update the dev page's `<vaadin-toggle-switch>` to include `label="Notifications"` now that the label slot is wired. No additional properties or observers — everything else comes from `CheckboxMixin`.

**Tests:**
- The internal `inputElement` exists in the light DOM with `slot="input"`, `type="checkbox"`, and `role="switch"`.
- `aria-checked` on the inner input tracks the host's `checked` property for both user toggles and programmatic writes.
- The shadow DOM exposes `[part='switch']`, `[part='thumb']`, `[part='label']`, `[part='helper-text']`, `[part='error-message']`, `[part='required-indicator']`, plus the named slots `input`, `label`, `helper`, `error-message`, `tooltip`.
- Slotting `<vaadin-tooltip slot="tooltip" text="…">` reflects `has-tooltip` on the host and adds the tooltip element's id to the inner input's `aria-describedby`.
- A global `input { opacity: 1 }` style (mimicking Tailwind preflight) does not make the slotted input visible — `CheckboxMixin`'s `slotStyles` keeps the slotted input at `opacity: 0`.

---

## Task 3: Behavioral verification through CheckboxMixin

**Spec sections:** Internal Behavior > "Inherited from `CheckboxMixin`"; Implementation > Properties / Slots / Events / Methods
**Requirements:** 1, 2, 3, 5, 6, 7, 8, 9, 11
**Depends on:** 2

The toggle switch's behavior in scope of this task is delivered by `CheckboxMixin` without modification. This task's purpose is to add the toggle-switch-side test coverage for those inherited behaviors so that a regression in `CheckboxMixin` (or in the toggle switch's composition with it) is caught here as well. Add unit tests at `test/toggle-switch.test.js` (mirroring the structure of `packages/checkbox/test/checkbox.test.js`) and `test/validation.test.js`. No new implementation is added — every behavior listed below already comes from the inherited mixin chain.

**Tests:**
- Clicking the inner input toggles `checked` and dispatches a bubbling, non-composed `change` event whose `event.target` is the host. Setting `checked` programmatically dispatches `checked-changed` (with `event.detail.value`) but not `change`. (Reqs 1, 2.)
- Clicking the rendered label region toggles `checked`. Clicking an `<a>` placed inside the label slot opens the link without changing `checked` and without dispatching `change`. Clicking a `<strong>` or `<span>` inside the label slot does toggle `checked`. Clicking `[part='required-indicator']` toggles `checked` (delegated to the label). Pressing Space while the inner input has focus toggles `checked`. (Reqs 1, 3.)
- Setting `disabled` reflects on the host, sets `aria-disabled` on the inner input, sets `tabindex="-1"` on the host, and prevents click / Space toggling; programmatic `setValue` while disabled dispatches `checked-changed` but not `change`. (Req 5.)
- Setting `readonly` reflects on the host, sets `aria-readonly="true"` on the inner input, and prevents click / Space toggling while keeping the host focusable. The `active` attribute is not set during pointer-down or Space-press while `readonly`. (Req 6.)
- A required toggle switch that has not yet been touched is not `invalid`. After blur (or `validate()`), `invalid` becomes `true`, `invalid-changed` fires, and `validated` fires with `event.detail.valid === false`. Toggling on clears `invalid` and fires `validated` with `valid === true`. Removing `required` clears `invalid`. With `manualValidation = true`, the application drives `invalid` and `errorMessage` directly and the framework does not auto-validate. The `[part='required-indicator']` element renders only when `required` is set. The inner input carries `aria-required="true"` when `required` is set and `aria-invalid="true"` when `invalid` is set. (Reqs 7, 9.)
- Setting `helperText` populates the helper slot and reflects `has-helper`. Setting `errorMessage` populates the error-message slot; combined with `invalid = true`, the host reflects `has-error-message`. (Reqs 8, 9.)
- Setting `accessibleName="Active"` writes `aria-label="Active"` on the inner input. Setting `accessibleNameRef="external-id"` writes `aria-labelledby="external-id"` on the inner input. (Reqs 3, 4.)
- A checked toggle switch in a `<form>` with `name="t" value="required"` submits the entry `t=required` (verified via `new FormData(form)`). An unchecked switch contributes nothing. A disabled, checked switch contributes nothing. A read-only, checked switch submits normally. After `form.reset()`, a switch whose initial markup was `<vaadin-toggle-switch checked>` returns to `checked = true`, fires `checked-changed`, but does not fire `change`. (Reqs 2, 11.)
- `host.focus()` results in `document.activeElement === inputElement` and the host carries `focused` and `focus-ring`. `host.focus({ focusVisible: false })` focuses without setting `focus-ring`. `host.click()` flips `checked` and dispatches `change`. (Reqs 1, 4.)

---

## Phase 4 — Styling

## Task 4: Base styles completion

**Spec sections:** Key Design Decisions 3, 5, 8, 9; Implementation > CSS Custom Properties; Implementation > Parts; `guidelines/10-theming.md`
**Requirements:** 1, 4, 5, 6, 7, 9
**Depends on:** 2

Flesh out `vaadin-toggle-switch-base-styles.js` per the spec: import `field` and `checkable('switch', 'toggle-switch')` from `@vaadin/field-base/src/styles/`, then add the toggle-specific block — track sizing, the thumb element (`[part='thumb']`) absolute-positioned with a `transform` translation in the on state, suppression of the `[part='switch']::after` checkmark (Decision 5), `:host([readonly])` (dashed border, transparent / muted-text background per state), `:host([disabled])` (muted thumb), the standard `:host([hidden]) { display: none !important }`, the standard `:host(:is([focus-ring], :focus-visible))` outline rule, the RTL-flipped thumb translation under `:host([dir='rtl'][checked]) [part='thumb']`, and a `@media (forced-colors: active)` block setting the on/off colors to system colors. Every CSS custom property listed in the Implementation > CSS Custom Properties table must be wired with fallbacks to design-token-level variables (`--vaadin-text-color`, `--vaadin-background-color`, etc.). The base visual tests cover the default off / on / disabled / disabled+checked / readonly / readonly+checked / focus-ring / invalid combinations.

**Tests:**
- Visual test: default off state renders with the thumb at the start of the track (LTR) and matches the baseline under `test/visual/base/toggle-switch/baseline/basic.png`.
- Visual test: checked state renders with the thumb translated to the end (LTR) and matches `checked.png`.
- Visual test: disabled and disabled+checked match their respective baselines (muted thumb).
- Visual test: read-only and read-only+checked match their respective baselines (dashed border, distinct background).
- Visual test: focus-ring state renders the outline ring.
- Visual test: invalid state matches its baseline.
- Visual test: under `dir="rtl"`, the checked-state thumb translates to the start of the track (mirrored).

---

## Task 5: Lumo theme

**Spec sections:** Key Design Decision 8; `guidelines/10-theming.md` ("Lumo")
**Requirements:** —
**Depends on:** 4

Create `packages/vaadin-lumo-styles/components/toggle-switch.css` (the public entry with `--_lumo-vaadin-toggle-switch-inject` markers and the `lumo_components_toggle-switch` module name) and `packages/vaadin-lumo-styles/src/components/toggle-switch.css` (the actual styles wrapped in `@media lumo_components_toggle-switch`). Bind every `--vaadin-toggle-switch-*` custom property to a Lumo design token: backgrounds to `--lumo-contrast-*pct`, text color to `--lumo-primary-text-color` / `--lumo-disabled-text-color`, primary on-state background to `--lumo-primary-color`, focus ring to `--lumo-primary-color-50pct`, font tokens to the corresponding `--lumo-font-*`. Cover the same state matrix the base task did, plus any Lumo-specific accents.

**Tests:**
- Lumo visual test: default off state matches `test/visual/lumo/toggle-switch/baseline/basic.png`.
- Lumo visual test: checked, disabled, disabled+checked, readonly, readonly+checked, focus-ring, invalid — each matches its Lumo baseline.

---

## Task 6: Aura theme

**Spec sections:** Key Design Decision 8; `guidelines/10-theming.md` ("Aura")
**Requirements:** —
**Depends on:** 4

Create `packages/aura/src/components/toggle-switch.css` and import it in `packages/aura/aura.css`. Bind `--vaadin-toggle-switch-*` custom properties to Aura tokens: surfaces, accent system, contrast levels, gap and padding tokens, the Aura font family and font-size scale, focus ring via `--vaadin-focus-ring-*`. Cover the same state matrix as the base task (default, checked, disabled variants, readonly variants, focus-ring, invalid).

**Tests:**
- Aura visual test: default off state matches `test/visual/aura/toggle-switch/baseline/basic.png`.
- Aura visual test: checked, disabled, disabled+checked, readonly, readonly+checked, focus-ring, invalid — each matches its Aura baseline.
- Aura's accent system applies cleanly when the parent overrides the relevant tokens.

---

## Phase 5 — Integration

## Task 7: Integration, snapshots, type tests, dev page

**Spec sections:** All; `guidelines/12-testing.md`; `guidelines/13-checklist.md`
**Requirements:** —
**Depends on:** 3, 5, 6

Finalise the package: keep `dev/toggle-switch.html` as the minimal single-example dev page used for spec authoring and smoke-checks, and create `dev/playground/toggle-switch.html` covering every variant exercised in tests (default, checked, disabled, disabled+checked, readonly, readonly+checked, required, invalid+errorMessage, with-helperText, with-tooltip, label-with-link) — the playground page is the manual visual review surface in both themes. Author DOM snapshot tests at `test/dom/toggle-switch.test.js` covering the default attached state, the checked state, the disabled state, the readonly state, and the invalid state — locking in the host's reflected attributes plus the shadow DOM structure. Author `test/typings/toggle-switch.types.ts` asserting the public type surface: `ToggleSwitch` element, `ToggleSwitchChangeEvent`, `ToggleSwitchCheckedChangedEvent`, `ToggleSwitchInvalidChangedEvent`, `ToggleSwitchValidatedEvent`, the `ToggleSwitchEventMap`, the `HTMLElementTagNameMap` augmentation, and `CheckboxMixinClass` inheritance (the class is assignable to `CheckboxMixinClass`). Complete the class-level JSDoc in `vaadin-toggle-switch.js` with the styling tables (parts, state attributes, custom CSS properties) and `@fires` lines for `change`, `checked-changed`, `invalid-changed`, `validated`. Run the full validation suite.

**Tests:**
- DOM snapshot: default attached state matches the captured snapshot.
- DOM snapshot: each of (checked, disabled, readonly, invalid+errorMessage) matches its snapshot.
- TypeScript type test passes `yarn lint:types`: `ToggleSwitch` event-listener overloads accept the typed events, `HTMLElementTagNameMap['vaadin-toggle-switch']` resolves to `ToggleSwitch`, the element is assignable to `CheckboxMixinClass`, and assigning a non-event to a typed listener fails compilation.
- `yarn lint`, `yarn test --group toggle-switch`, `yarn test:snapshots --group toggle-switch`, `yarn test:base --group toggle-switch`, `yarn test:lumo --group toggle-switch`, `yarn test:aura --group toggle-switch` all pass.
- The playground page renders every variant in both Lumo and Aura themes when toggling the dev shell's theme switcher.

---

## Discussion

**Q: Why is the dev-page coverage split between `dev/toggle-switch.html` and `dev/playground/toggle-switch.html`?**

The repo convention is to keep `dev/{component}.html` as a minimal single-example page used for spec authoring, smoke-checks, and quick local repro, while `dev/playground/{component}.html` carries the multi-section variant grid used for manual visual review across themes. Existing components (e.g. `dev/checkbox.html` vs. `dev/playground/checkbox.html`) follow this split. The toggle-switch follows the same convention rather than overloading the minimal page with every state.

**Q: Why was `ThemableMixin` removed from the Task 1 and Task 2 class chains?**

The toggle switch does not expose a `theme` attribute and does not register theme-scoped CSS via `registerStyles()`. Lumo styles arrive through `LumoInjectionMixin`; Aura styles are applied document-side via `::part()`. Keeping `ThemableMixin` in the chain added no behavior the component uses. The runtime dependency on `@vaadin/vaadin-themable-mixin` stays because `LumoInjectionMixin` is exported from that same package.
