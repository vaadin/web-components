# ToggleSwitch Flow Component Specification

> Wraps the experimental web component `<vaadin-toggle-switch>`. Flow users enable it via the same feature flag the web component surfaces (`window.Vaadin.featureFlags.toggleSwitchComponent = true`); see `web-component-spec.md`.

## Key Design Decisions

1. **Class hierarchy mirrors `Checkbox` line-for-line.** `ToggleSwitch` extends `AbstractSinglePropertyField<ToggleSwitch, Boolean>` with the synchronisable client property `"checked"` and empty value `false`. Same shape as `Checkbox(super("checked", false, false))`. `web-component-api.md` §1's "default-off, on/off boolean state" maps cleanly onto a `HasValue<Boolean>` field.

2. **Implemented mixin interfaces — exactly the Checkbox set, minus indeterminate-related concerns.** `ClickNotifier<ToggleSwitch>`, `Focusable<ToggleSwitch>`, `HasAriaLabel`, `HasValidationProperties`, `HasValidator<Boolean>`, `InputField<AbstractField.ComponentValueChangeEvent<ToggleSwitch, Boolean>, Boolean>`, `HasThemeVariant<ToggleSwitchVariant>`. `InputField` transitively pulls in `HasEnabled`, `HasHelper`, `HasLabel`, `HasSize`, `HasStyle`, `HasTooltip`, `HasValue`. No `setIndeterminate` / `bindIndeterminate` / `isIndeterminate` and no `indeterminate-changed` synchronisation.

3. **Package: `com.vaadin.flow.component.toggleswitch`.** No reserved-keyword collision — `toggleswitch` is a valid Java identifier. The kebab-name segment is concatenated without dashes, matching `radiobutton`, `combobox`, `multiselectcombobox`, `datepicker`, etc.

4. **Constructors mirror `Checkbox`.** Seven overloads: `()`, `(String label)`, `(boolean initialValue)`, `(String, boolean)`, `(String, ValueChangeListener)`, `(boolean, ValueChangeListener)`, `(String, boolean, ValueChangeListener)`. No Signal-based overloads — Checkbox does not provide any (its only Signal API is `bindIndeterminate(Signal, …)`, which has no toggle-switch analogue since indeterminate is out of scope).

5. **Validation: required ⇒ on.** Default validator returns `validateRequiredConstraint` against `Boolean.FALSE` as the empty value. `ValidationController<ToggleSwitch, Boolean>` is the same field reused by Checkbox. `validate()` is `protected`. `setManualValidation(boolean)` opts into application-driven invalid/error state. `addValueChangeListener(e -> validate())` is wired in the constructor so user toggles drive auto-validation. Identical to `Checkbox` (`flow-api.md` §6).

6. **The host element's `manualValidation` client property is pinned to `true` for the entire lifetime of the component.** This is set in the Flow constructor and is not influenced by the application-facing `setManualValidation(boolean)` API. The application setter only toggles whether the server-side `ValidationController` runs auto-validation; the web component itself is always in manual-validation mode so client and server cannot race over `invalid`. Direct copy of Checkbox's setup. Document this distinction on `setManualValidation`'s javadoc at implementation time so applications do not expect the host element to flip its own client property.

7. **i18n: nested `ToggleSwitchI18n` class with one field — `requiredErrorMessage`.** `Serializable`, fluent setter, no JSON annotations. Stored on the component via `setI18n` / `getI18n`. No client-side property push (the web component has no `i18n` property of its own); the server-side i18n message is read by the default validator. The instance returned by `getI18n()` is the live stored object, but mutations to it after `setI18n(...)` will not re-trigger any validation — applications must call `setI18n(...)` again to apply changes (matches `CheckboxI18n.getI18n` javadoc). Identical to `CheckboxI18n` (`flow-api.md` §6).

8. **Theme variants: `ToggleSwitchVariant` enum with one constant — `HELPER_ABOVE` mapping to the CSS attribute string `"helper-above-field"`.** Implements `ThemeVariant`. The `LUMO_HELPER_ABOVE_FIELD` / `AURA_HELPER_ABOVE_FIELD` aliases that `CheckboxVariant` carries are backward-compatibility shims for code written before that constant was renamed; `ToggleSwitch` is a new component with no prior callers, so it ships with only the canonical name. (`flow-api.md` §11.)

9. **Label slot fallback: `setLabelComponent(Component)` for HTML-in-label.** Same `NativeLabel labelElement` field with `slot="label"` as Checkbox. `setLabel(String)` removes the slotted component and sets the host's `label` property (`null` is normalised to `""`, matching Checkbox); `setLabelComponent(Component)` clears the property and slots the component into the label. Passing a non-null component is required; passing `null` is undefined behavior (Checkbox NPEs on the underlying `add` call — toggle-switch inherits this and does not validate the argument explicitly). (`flow-api.md` §3.)

10. **`HasAriaLabel` is implemented by writing `accessibleName` and `accessibleNameRef` properties on the host element**, not by writing `aria-label` directly — same as Checkbox. The web component's `FieldMixin` is the side that translates these into the inner input's ARIA attributes.

11. **`autofocus` is exposed on the Flow class.** Checkbox has `setAutofocus` / `isAutofocus` — the web component supports `autofocus` natively because the inner input is a real `<input>`. Match Checkbox here even though the web-component API spec did not call it out as a separate section; this is a reachability mapping rather than a new feature.

12. **Connector needed: no.** The web component is a single element with all state expressible as Element attributes/properties (`checked`, `disabled`, `readonly`, `required`, `invalid`, `errorMessage`, `helperText`, `label`, `accessibleName`, `accessibleNameRef`, `name`, `value`, `manualValidation`, `i18n` is server-side only). No data-driven items array, no DOM mutations needing client-side recomputation, no drag-and-drop wiring. Pattern-matches Checkbox, which has no connector either.

13. **Serialisation.** Every field on the class (`i18n`, `defaultValidator`, `validationController`, `labelElement`) is a `Serializable`-friendly type: the `CheckboxI18n` precedent shows the same `ValidationController<C, V>` and lambda `Validator<Boolean>` setup is safe; `NativeLabel` is a Flow `Component`. No `transient` fields, no custom `readObject` / `writeObject`. A `ToggleSwitchSerializableTest` extends `ClassesSerializableTest` to enforce this — same one-liner pattern as `CheckboxSerializableTest`.

14. **Router-agnostic.** No path/URL setters; the component never calls `RouteConfiguration` or `UI.navigate`. Form integration goes through `Binder` — `flow-api.md` §9 — which is application-driven.

---

## Module / Package Layout

```
flow-components/
└── vaadin-toggle-switch-flow-parent/
    ├── pom.xml
    ├── vaadin-toggle-switch-flow/
    │   ├── pom.xml
    │   └── src/
    │       ├── main/java/com/vaadin/flow/component/toggleswitch/
    │       │   ├── ToggleSwitch.java
    │       │   └── ToggleSwitchVariant.java
    │       └── test/java/com/vaadin/flow/component/toggleswitch/tests/
    │           ├── ToggleSwitchUnitTest.java
    │           ├── ToggleSwitchSerializableTest.java
    │           └── validation/
    │               ├── ToggleSwitchBasicValidationTest.java
    │               └── ToggleSwitchBinderValidationTest.java
    ├── vaadin-toggle-switch-flow-integration-tests/
    │   ├── pom.xml
    │   └── src/
    │       ├── main/java/com/vaadin/flow/component/
    │       │   ├── app/
    │       │   │   └── TestAppShell.java
    │       │   └── toggleswitch/tests/
    │       │       └── ToggleSwitchPage.java            # @Route("vaadin-toggle-switch/toggle-switch-test")
    │       └── test/java/com/vaadin/flow/component/toggleswitch/tests/
    │           └── ToggleSwitchIT.java                  # extends AbstractComponentIT, @TestPath("vaadin-toggle-switch/toggle-switch-test")
    └── vaadin-toggle-switch-testbench/
        ├── pom.xml
        └── src/main/java/com/vaadin/flow/component/toggleswitch/testbench/
            └── ToggleSwitchElement.java                 # @Element("vaadin-toggle-switch")
```

Package name: `com.vaadin.flow.component.toggleswitch`. The class lives at the top level — there are no item / sub-element classes (the toggle switch is a single element). `ToggleSwitchI18n` is a public **nested** class on `ToggleSwitch` (not a separate file), matching `CheckboxI18n`.

The IT module includes a minimal `TestAppShell.java` under `com.vaadin.flow.component.app`, matching `vaadin-checkbox-flow-integration-tests/.../app/TestAppShell.java`. The IT module starts with a single combined `ToggleSwitchPage` + `ToggleSwitchIT` pair (per-concern fan-out — `HelperPage`, `DetachReattachPage`, etc., as Checkbox accumulated over years — is added later only when a specific concern needs its own isolated route).

---

## Component Classes

### `ToggleSwitch` — main component

```java
@Tag("vaadin-toggle-switch")
@NpmPackage(value = "@vaadin/toggle-switch", version = "{WEB_COMPONENT_VERSION}")
@JsModule("@vaadin/toggle-switch/src/vaadin-toggle-switch.js")
public class ToggleSwitch extends AbstractSinglePropertyField<ToggleSwitch, Boolean>
        implements ClickNotifier<ToggleSwitch>, Focusable<ToggleSwitch>, HasAriaLabel,
                   HasValidationProperties, HasValidator<Boolean>,
                   InputField<AbstractField.ComponentValueChangeEvent<ToggleSwitch, Boolean>, Boolean>,
                   HasThemeVariant<ToggleSwitchVariant> {

    private final NativeLabel labelElement;
    private ToggleSwitchI18n i18n;
    private final Validator<Boolean> defaultValidator = (value, context) -> {
        boolean fromComponent = context == null;
        boolean isRequired = fromComponent && isRequiredIndicatorVisible();
        return ValidationUtil.validateRequiredConstraint(
                getI18nErrorMessage(ToggleSwitchI18n::getRequiredErrorMessage),
                isRequired, getValue(), getEmptyValue());
    };
    private final ValidationController<ToggleSwitch, Boolean> validationController =
            new ValidationController<>(this);

    // Constructors — see Decision 4
    public ToggleSwitch();
    public ToggleSwitch(String labelText);
    public ToggleSwitch(boolean initialValue);
    public ToggleSwitch(String labelText, boolean initialValue);
    public ToggleSwitch(String labelText, ValueChangeListener<ComponentValueChangeEvent<ToggleSwitch, Boolean>> listener);
    public ToggleSwitch(boolean initialValue, ValueChangeListener<ComponentValueChangeEvent<ToggleSwitch, Boolean>> listener);
    public ToggleSwitch(String labelText, boolean initialValue,
                        ValueChangeListener<ComponentValueChangeEvent<ToggleSwitch, Boolean>> listener);

    // Required (HasValueAndElement override for documentation)
    @Override
    public void setRequiredIndicatorVisible(boolean required);
    @Override
    public boolean isRequiredIndicatorVisible();

    // Label
    @Override
    public String getLabel();
    @Override
    public void setLabel(String label);
    public void setLabelComponent(Component component);

    // ARIA labelling — HasAriaLabel
    @Override
    public void setAriaLabel(String ariaLabel);
    @Override
    public Optional<String> getAriaLabel();
    @Override
    public void setAriaLabelledBy(String ariaLabelledBy);
    @Override
    public Optional<String> getAriaLabelledBy();

    // Autofocus
    public void setAutofocus(boolean autofocus);
    public boolean isAutofocus();

    // Validation
    @Override
    public void setManualValidation(boolean enabled);
    @Override
    public Validator<Boolean> getDefaultValidator();
    protected void validate();

    // i18n
    public ToggleSwitchI18n getI18n();
    public void setI18n(ToggleSwitchI18n i18n);

    // Internal: read-only switch toggling at the framework layer (matches Checkbox's package-private access)
    void setDisabled(boolean disabled);          // package-private
    boolean isDisabledBoolean();                 // package-private
}
```

**Implemented mixin interfaces (with one-line justification):**

| Interface | Source | Justification |
|---|---|---|
| `ClickNotifier<ToggleSwitch>` | Flow core | Reachability for the web-component DOM `click` event (flow-api.md §10). Matches Checkbox. |
| `Focusable<ToggleSwitch>` | Flow core | Programmatic `focus()` / `blur()`. Matches Checkbox. |
| `HasAriaLabel` | Flow core | `setAriaLabel` / `setAriaLabelledBy` mapped to `accessibleName` / `accessibleNameRef` (flow-api.md §3). |
| `HasValidationProperties` | `vaadin-flow-components-base` | `setErrorMessage` / `setInvalid` (flow-api.md §6). |
| `HasValidator<Boolean>` | Flow core | `setManualValidation`, default-validator integration with `Binder` (flow-api.md §6). |
| `InputField<…, Boolean>` | `vaadin-flow-components-base` | Transitively brings `HasEnabled`, `HasHelper`, `HasLabel`, `HasSize`, `HasStyle`, `HasTooltip`, `HasValue` (flow-api.md §§3, 5, 7, 8, 9). |
| `HasThemeVariant<ToggleSwitchVariant>` | `vaadin-flow-components-base` | Typed `addThemeVariants` / `removeThemeVariants` (flow-api.md §11). |

Inherited from `AbstractSinglePropertyField`: `getValue` / `setValue` / `addValueChangeListener` / `setReadOnly` / `getEmptyValue` (returns `Boolean.FALSE`). Inherited from `Component`: tag identity, lifecycle, `getElement()`. The `enabled` / `disabled` distinction follows `HasEnabled` (Flow's standard inverted accessor); the package-private `setDisabled(boolean)` mirrors Checkbox's internal helper for tests.

**`@Synchronize`'d properties:** None on the main class. `AbstractSinglePropertyField("checked", false, false)` already wires the `checked-changed` event subscription that synchronises the Boolean value. `manualValidation = true` is set in the constructor so the web component's own validation does not compete with the server-side controller.

**Events:** No custom `@DomEvent` classes — same as Checkbox. Value changes are delivered via the standard `addValueChangeListener` returning `ComponentValueChangeEvent<ToggleSwitch, Boolean>`. `event.isFromClient()` distinguishes user toggles from programmatic updates (flow-api.md §2). Programmatic `setValue(...)` on a disabled or read-only switch fires a value-change event with `isFromClient=false`, satisfying requirement 5's "programmatic flips are silent" clause without dedicated API. The web component's `validated` event is not surfaced as a Flow listener — Checkbox set the precedent of leaving it unmapped (flow-api.md Web API coverage check). `HasValidator<Boolean>` provides `addValidationStatusChangeListener(...)` for applications that want to observe Binder-level validation outcomes.

---

## i18n

```java
public static class ToggleSwitchI18n implements Serializable {
    private String requiredErrorMessage;

    public String getRequiredErrorMessage();
    public ToggleSwitchI18n setRequiredErrorMessage(String errorMessage);
}
```

| Field | Type | Default | Notes |
|---|---|---|---|
| `requiredErrorMessage` | `String` | `null` (when null, `getI18nErrorMessage` returns `""`) | Used by the default required-validator. Custom error set via `setErrorMessage(String)` takes priority. |

The class is server-side only — there is no client-side `i18n` property to push. `setI18n` stores the instance; the default validator reads `requiredErrorMessage` from it during validation. `setI18n(null)` is rejected with `NullPointerException` (matches `Checkbox.setI18n`).

---

## Theme Variants

```java
public enum ToggleSwitchVariant implements ThemeVariant {
    HELPER_ABOVE("helper-above-field");

    private final String variant;
    ToggleSwitchVariant(String variant) { this.variant = variant; }
    @Override public String getVariantName() { return variant; }
}
```

The enum maps the single canonical `HELPER_ABOVE` constant to the CSS attribute value `"helper-above-field"`. The deprecated `LUMO_HELPER_ABOVE_FIELD` / `AURA_HELPER_ABOVE_FIELD` aliases on `CheckboxVariant` exist to preserve compatibility with code written against earlier Checkbox releases — `ToggleSwitch` has no prior public release, so those legacy names are not introduced. Future deprecation policy: if the web component eventually renames or drops the `helper-above-field` attribute, the old constant is kept `@Deprecated` mapped to the same string for one major release, then removed (same pattern `ButtonVariant` follows when *its* attributes change).

---

## Connector

**No connector needed.** All state is set via Element properties / attributes:
- `checked`, `disabled`, `readonly`, `required`, `invalid`, `errorMessage`, `helperText`, `label`, `name`, `value`, `manualValidation`, `accessibleName`, `accessibleNameRef`, `autofocus` — direct property writes through Flow's Element API.
- Tooltip text — handled by `HasTooltip` (uses Vaadin's existing tooltip plumbing).
- Theme variants — handled by `HasThemeVariant` (toggles `theme` attribute values).
- i18n's only field (`requiredErrorMessage`) is consumed server-side by the default validator and never pushed to the client.

The component matches Checkbox's connector-less profile because both are single-element fields without per-item client state, drag-and-drop, or DOM mutations requiring client-side recomputation.

---

## Server/Client Sync Concerns

- **Serialisation.** Every field on `ToggleSwitch` and `ToggleSwitchI18n` is `Serializable`. `ValidationController<ToggleSwitch, Boolean>` and `Validator<Boolean>` (the lambda) are `Serializable` — confirmed by Checkbox's identical setup, which has been the subject of `CheckboxSerializableTest extends ClassesSerializableTest` for years. `NativeLabel labelElement` is a Flow component and inherits `Serializable`. No `transient` fields, no custom `readObject`/`writeObject`.
- **Signal support.** Checkbox provides `bindIndeterminate(Signal<Boolean>, SerializableConsumer<Boolean>)` for its indeterminate property. The toggle switch has no indeterminate state, so no `bind*(Signal, ...)` helper is added. Signal-based binding for the value is inherited from `AbstractSinglePropertyField` (whatever shared support that base class offers — typically applications wire signals through `Binder` or via the inherited `getElement().bindProperty(...)` pattern). No Signal-based constructor overloads are added — Checkbox does not provide them either.
- **Routing.** N/A — the component does not expose URL/path setters and never calls `RouteConfiguration`. Form-submission integration is via `Binder` (flow-api.md §9), which is application-driven.
- **DisabledUpdateMode.** Default — no override. The toggle switch should not accept user input while disabled (`HasEnabled`'s default). Programmatic state changes still propagate.
- **Disable-on-click.** Not applicable. Toggling a switch is its primary interaction; there is no "submit-style" action that would warrant `DisableOnClickController`.

---

## TestBench Elements

### `ToggleSwitchElement`

```java
@Element("vaadin-toggle-switch")
public class ToggleSwitchElement extends TestBenchElement
        implements HasLabel, HasHelper, HasValidation {

    /**
     * Returns whether the toggle switch is checked.
     */
    public boolean isChecked();

    /**
     * Sets the checked state and dispatches a bubbling `change` event so
     * Flow's value-change listeners see the user-initiated update.
     */
    public void setChecked(boolean checked);

    @Override
    public String getLabel();
}
```

Mirrors `CheckboxElement` (which also implements `HasLabel`, `HasHelper`, `HasValidation` and dispatches `change` after writing `checked`). No item-level testbench element — the toggle switch is a single element. The implementation of `setChecked` follows Checkbox's pattern: write the `checked` property and dispatch a bubbling `change` event so server-side `ValueChangeListener`s with `isFromClient=true` are reached.

---

## Reuse and Proposed Adjustments to Existing Modules

All shared modules are reused as-is — no adjustments are required.

- **`com.vaadin.flow.component.shared.HasValidationProperties`** — provides `setErrorMessage` / `setInvalid`. Used by every field. As-is.
- **`com.vaadin.flow.component.shared.HasThemeVariant`** + `ThemeVariant` — typed `addThemeVariants` / `removeThemeVariants`. As-is.
- **`com.vaadin.flow.component.shared.HasTooltip`** (transitive via `InputField`) — the `setTooltipText` / `setTooltipMarkdown` / `getTooltip()` trio. As-is.
- **`com.vaadin.flow.component.shared.InputField<E, V>`** — transitive bundle of field-mixin interfaces. As-is.
- **`com.vaadin.flow.component.shared.ValidationUtil#validateRequiredConstraint`** — validation helper for the `required ⇒ on` rule. As-is.
- **`com.vaadin.flow.component.shared.internal.ValidationController<C, V>`** — orchestrates auto vs. manual validation. As-is.
- **`com.vaadin.flow.component.HasAriaLabel`** (Flow core) — `setAriaLabel` / `setAriaLabelledBy`. As-is.
- **`com.vaadin.flow.testutil.ClassesSerializableTest`** (test-util) — base class for `ToggleSwitchSerializableTest`. As-is.
- **`com.vaadin.tests.AbstractComponentIT`** (test-util) — base class for `ToggleSwitchIT`. As-is.

The `HasValueAndElement.setRequiredIndicatorVisible(boolean)` semantics (a required indicator that does NOT validate the input until the user has interacted) is the established Flow contract — Checkbox already documents this contract on `setRequiredIndicatorVisible` and the toggle switch inherits it verbatim.

---

## Coverage

| Requirement | Addressed in spec section(s) |
|---|---|
| 1. Flip via pointer or keyboard, default off, ARIA switch role | Component Classes → `ToggleSwitch` (constructors, `AbstractSinglePropertyField` defaulting to `false`); web component handles activation and role |
| 2. Notify only on user-initiated changes | Component Classes → `ToggleSwitch` (inherited `addValueChangeListener` + `event.isFromClient()`); Decision 5 |
| 3. Clickable label / label component / accessible name | Component Classes → `ToggleSwitch` (`setLabel`, `setLabelComponent`, `setAriaLabel`, `setAriaLabelledBy`); Decisions 9–10 |
| 4. Announce as a switch with on/off state | Web component handles ARIA; Flow has no surface needed (`flow-api.md` Web API coverage: "covered transparently") |
| 5. Disabled refuses interaction | Component Classes → `ToggleSwitch` (`HasEnabled.setEnabled` via `InputField`); Decision 2 |
| 6. Read-only stays focusable and announced | Component Classes → `ToggleSwitch` (`HasValue.setReadOnly` inherited via `AbstractSinglePropertyField`); web component manages the ARIA / form-submission split |
| 7. Required validation | Component Classes → `ToggleSwitch` (`setRequiredIndicatorVisible`, `validate`, `defaultValidator`, `ValidationController`); i18n → `requiredErrorMessage`; Decisions 5–7 |
| 8. Helper text | Component Classes → `ToggleSwitch` (`HasHelper` via `InputField`) |
| 9. Error message when invalid (custom messages allowed) | Component Classes → `ToggleSwitch` (`HasValidationProperties.setErrorMessage`, `setInvalid`, `setManualValidation`); Decisions 5–7 |
| 10. Optional tooltip | Component Classes → `ToggleSwitch` (`HasTooltip` via `InputField`) |
| 11. Native form submission | Decision 12 (no connector); web component participates in `<form>` natively. Flow form integration via `Binder` (`flow-api.md` §9) |

All eleven requirements are addressed. `flow-api.md`'s 11 sections + Web API coverage check map onto the Component Classes / i18n / Theme Variants / TestBench sections above; no API features are dropped.
