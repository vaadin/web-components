# Switch Flow Developer API

Java wrapper for `<vaadin-switch>`. Class: `Switch` in package `com.vaadin.flow.component.switch_` (trailing underscore because `switch` is a reserved Java keyword for the package segment; application code still imports `Switch` directly).

The Flow class follows the `Checkbox` pattern from `vaadin-checkbox-flow` line-for-line: same base class, same shared mixins (`InputField`, `HasValidationProperties`, `HasAriaLabel`, `HasValidator<Boolean>`, `HasThemeVariant<SwitchVariant>`), same `ClickNotifier` / `Focusable`, same nested `SwitchI18n` for the required-error message. The only intentional difference is the absence of `indeterminate`-related API — switches do not have an indeterminate state per the problem statement.

---

## 1. Basic instantiation, default-off state, on/off value, ARIA switch role

Covers requirement(s): 1, 4

```java
// Default: starts off
Switch notifications = new Switch("Notifications");
add(notifications);

// Initial state: on
Switch darkMode = new Switch("Dark mode", true);
add(darkMode);

// Read / write the current state programmatically
boolean isOn = notifications.getValue();
notifications.setValue(true);

// No-arg constructor for late-set label
Switch s = new Switch();
s.setLabel("Auto-save");
add(s);
```

**Why this shape:** Mirrors `Checkbox` from `vaadin-checkbox-flow`. The component extends `AbstractSinglePropertyField<Switch, Boolean>` so the on/off state is the field's `Boolean` value — making it a drop-in `HasValue<Boolean>` for `Binder` and other data-binding code. The `(String label)`, `(boolean initialValue)`, and `(String, boolean)` convenience constructors match the Checkbox set; no separate constructor is needed for "switch role" because the role is exposed automatically by the underlying web component, with no Flow-level switch.

---

## 2. Value change listener

Covers requirement(s): 2

```java
Switch dailyDigest = new Switch("Daily digest");

dailyDigest.addValueChangeListener(event -> {
    // event.isFromClient() distinguishes user vs. programmatic updates
    if (event.isFromClient()) {
        userPreferences.setDailyDigest(event.getValue());
    }
});

// Convenience constructor: label + listener in one go
Switch compare = new Switch("Compare with previous period",
    event -> dashboard.toggleOverlay(event.getValue()));
add(compare);
```

**Why this shape:** The web component's `change` event (user-initiated) and `checked-changed` event (any change) collapse into a single Flow `ValueChangeListener` whose event carries `isFromClient()` for the user-vs-programmatic distinction — the standard Vaadin Flow way of handling this split. Matches `Checkbox.addValueChangeListener` exactly. The two-arg `(String, ValueChangeListener)` constructor mirrors the corresponding Checkbox constructor for the most common call site.

---

## 3. Label, label component, accessible name

Covers requirement(s): 3

```java
// Plain-text label (most common)
Switch s = new Switch("Email me when I'm @mentioned");

// Replace the label with a custom component when HTML / inline children are needed
Switch consent = new Switch();
HorizontalLayout label = new HorizontalLayout(
    new Span("Send anonymous usage data — "),
    new Anchor("/privacy", "read our privacy policy"));
label.setSpacing(false);
consent.setLabelComponent(label);
add(consent);

// Label-less switch (e.g. inside a Grid column where the column header is the name)
Switch active = new Switch();
active.setAriaLabel("Active");
// Or reference an external label by id
active.setAriaLabelledBy("row-3-active-label");
```

**Why this shape:** `setLabel(String)` comes from `HasLabel` (transitive via `InputField`), `setLabelComponent(Component)` matches the Checkbox additional method for HTML-in-label cases, and `setAriaLabel(String)` / `setAriaLabelledBy(String)` come from `HasAriaLabel` (Flow core). All three mirror the public surface of `Checkbox`. The component refuses to flip when the user clicks an interactive child of a label component; this is web-component behavior, no Flow API surface.

---

## 4. Disabled

Covers requirement(s): 5

```java
Switch dailyDigest = new Switch("Daily digest");
dailyDigest.setEnabled(false); // not focusable, not Tab-reachable, no interaction

// Programmatic flips are still allowed and silent (no value-change event from user)
Switch child = new Switch("Daily digest");
parentSwitch.addValueChangeListener(e -> {
    child.setEnabled(e.getValue());
    if (!e.getValue()) {
        child.setValue(false); // programmatic update — listener will see isFromClient=false
    }
});
```

**Why this shape:** `setEnabled(boolean)` is the Vaadin Flow convention (`HasEnabled` via `InputField`); a separate `setDisabled` would be an idiosyncratic deviation. Matches Checkbox.

---

## 5. Read-only

Covers requirement(s): 6

```java
// Read-only switch reflecting a plan-locked setting
Switch retention = new Switch("Audit log retention (90 days)", true);
retention.setHelperText("Included on the Business plan.");
retention.setReadOnly(true);
add(retention);

// Read-only + required: validation rule "valid if on, invalid if off" still applies
Switch verified = new Switch("Account verified", true);
verified.setReadOnly(true);
verified.setRequiredIndicatorVisible(true);
```

**Why this shape:** `setReadOnly(boolean)` is part of `HasValue` (transitive via `InputField`), so applications already know it from every other Vaadin field. The web component's `aria-readonly` qualifier and the read-only-still-submits-with-form distinction are handled internally by the web component; no Flow-level API.

---

## 6. Required validation, error message, manual validation, i18n

Covers requirement(s): 7, 9

```java
// Built-in required validation: turning the switch on satisfies it; off is invalid
Switch terms = new Switch("I confirm the trip details are correct");
terms.setRequiredIndicatorVisible(true);
terms.setErrorMessage("You must accept the trip details to continue");

// i18n-supplied default required message (e.g. localized at app level)
Switch terms2 = new Switch("I accept the booking terms");
terms2.setRequiredIndicatorVisible(true);
terms2.setI18n(new Switch.SwitchI18n()
    .setRequiredErrorMessage(getTranslation("switch.required")));

// Manual validation: app drives `invalid` and `errorMessage` itself
// (e.g. for server-returned business-rule violations)
Switch twoFactor = new Switch("Two-factor authentication required");
twoFactor.setManualValidation(true);

binder.forField(twoFactor)
    .withValidator((value, context) -> {
        if (account.isCompliancePlan() && !value) {
            return ValidationResult.error(
                "Two-factor authentication can't be disabled on the Compliance plan");
        }
        return ValidationResult.ok();
    })
    .bind(User::isTwoFactorRequired, User::setTwoFactorRequired);

// Application-level revalidation runs through Binder; the protected
// validate() method on the component itself is invoked by the framework.
binder.validate();
```

**Why this shape:** Required-handling via `setRequiredIndicatorVisible` plus a default validator that fails on the empty value (`Boolean.FALSE`) is exactly how `Checkbox` does it — consistent across all binary Vaadin fields. `HasValidationProperties` provides `setErrorMessage` / `setInvalid`. `HasValidator<Boolean>` provides `setManualValidation`; `validate()` itself is `protected` (as on `Checkbox`) — applications that need to drive validation imperatively go through `Binder.validate()`. The nested `SwitchI18n` class mirrors `CheckboxI18n` exactly: one fluent setter for the default required-error message, `Serializable`, retrievable via `getI18n()`. Custom `setErrorMessage(String)` takes priority over the i18n message (matches Checkbox semantics). The empty value of the field is `Boolean.FALSE`, also matching Checkbox — so `Binder` `asRequired()` and Switch's own required validation agree on which state counts as "empty".

---

## 7. Helper text

Covers requirement(s): 8

```java
Switch autosave = new Switch("Auto-save");
autosave.setHelperText("Save changes automatically every 30 seconds");
add(autosave);

// HTML helper content (links, formatting)
Switch beta = new Switch("Beta features");
beta.setHelperComponent(new Anchor("/beta", "See what's enabled in the beta program"));

```

**Why this shape:** `setHelperText(String)` and `setHelperComponent(Component)` come from `HasHelper` (transitive via `InputField`) — same surface every Vaadin field already exposes.

---

## 8. Tooltip

Covers requirement(s): 10

```java
Switch active = new Switch("Active");
active.setTooltipText("Last delivery: 2 minutes ago");

// Markdown-formatted tooltip
active.setTooltipMarkdown("Last delivery: **2 minutes ago**");

// Direct access to the tooltip handle for advanced configuration (position, etc.)
active.getTooltip().setPosition(Tooltip.TooltipPosition.TOP);
```

**Why this shape:** `setTooltipText`, `setTooltipMarkdown`, and `getTooltip()` come from `HasTooltip` (transitive via `InputField`) — same surface every Vaadin field component already exposes. No component-specific tooltip method.

---

## 9. Form integration via Binder

Covers requirement(s): 11

```java
public class TwoFactorForm extends FormLayout {
    private final Switch twoFactor = new Switch("Two-factor authentication required");
    private final TextField name = new TextField("Name");
    private final Binder<User> binder = new Binder<>(User.class);

    public TwoFactorForm() {
        add(name, twoFactor);

        binder.forField(twoFactor)
            .bind(User::isTwoFactorRequired, User::setTwoFactorRequired);
        binder.forField(name)
            .bind(User::getName, User::setName);
    }

    public void edit(User user) {
        binder.readBean(user);   // hydrate the form — value-change events fire with isFromClient=false
    }

    public void save(User user) {
        if (binder.writeBeanIfValid(user)) {
            userService.save(user);
        }
    }

    public void cancel(User original) {
        binder.readBean(original); // revert: switch flips back, no isFromClient=true events
    }
}
```

**Why this shape:** Flow does not use native HTML form submission; the Vaadin equivalent of "name + value submitted on `<form>` submit" is `Binder.bind` for hydration and `writeBean` / `writeBeanIfValid` for save. The cancel/revert path described in Req 11 maps to `Binder.readBean(original)`, which restores values without the `isFromClient` flag set (so the application's user-change handlers don't ricochet, matching Req 2). The field's empty value of `Boolean.FALSE` (see §6) keeps the Switch's required-validation aligned with `asRequired()` if the application uses it.

---

## 10. Click notifier and focusable

Covers requirement(s): — (reachability mapping for click events and programmatic focus exposed by the web component)

```java
Switch s = new Switch("Notifications");

// ClickNotifier — for the rare case the app wants to react to a click regardless
// of whether the value actually flipped (e.g. analytics)
s.addClickListener(event -> analytics.event("switch.clicked"));

// Focusable — programmatic focus, e.g. when opening a settings dialog
s.focus();
```

**Why this shape:** `ClickNotifier<Switch>` and `Focusable<Switch>` are implemented for parity with Checkbox; experienced Flow developers expect both on every field. They are reachability mappings, not direct requirement coverage — DOM clicks and programmatic focus are real surface the developer might need.

---

## 11. Theme variants and styling

Covers requirement(s): — (reachability mapping for CSS custom properties / theme variants exposed by the web component)

```java
Switch s = new Switch("Compact");
s.addThemeVariants(SwitchVariant.HELPER_ABOVE);

// CSS custom properties go through the standard HasStyle surface (transitive via InputField)
s.getStyle().set("--vaadin-switch-track-width", "32px");
s.getStyle().set("--vaadin-switch-thumb-color", "var(--lumo-base-color)");
```

**Why this shape:** `HasThemeVariant<SwitchVariant>` provides the typed `addThemeVariants(SwitchVariant...)` and `removeThemeVariants(SwitchVariant...)` methods — same shape as `Button.addThemeVariants(ButtonVariant...)`. The `SwitchVariant` enum currently contains only `HELPER_ABOVE` (and the legacy `LUMO_HELPER_ABOVE_FIELD` / `AURA_HELPER_ABOVE_FIELD` deprecation aliases following the `CheckboxVariant` precedent). CSS custom properties are not surfaced as typed Java setters; `getStyle()` from `HasStyle` is the canonical Flow path.

---

## Web API coverage check

| Web API surface (from `web-component-api.md`) | Flow API | Notes |
|---|---|---|
| `<vaadin-switch>` element | `new Switch()` (+ convenience overloads) | constructor |
| `checked` boolean attr/prop | `setValue(Boolean)` / `getValue()` via `HasValue<Boolean>` | maps to the field's value, like `Checkbox` |
| `change` event | `addValueChangeListener` with `event.isFromClient() == true` | standard Flow mapping; matches Checkbox |
| `checked-changed` event | covered transparently by Flow's two-way value binding | no public Flow API; framework wiring |
| `label` attribute | `setLabel(String)` via `HasLabel` (transitive via `InputField`) | — |
| `slot="label"` | `setLabelComponent(Component)` | matches Checkbox |
| `accessible-name` | `setAriaLabel(String)` via `HasAriaLabel` | — |
| `accessible-name-ref` | `setAriaLabelledBy(String)` via `HasAriaLabel` | — |
| `disabled` boolean | `setEnabled(boolean)` (inverted) via `HasEnabled` | standard Flow inversion |
| `readonly` boolean | `setReadOnly(boolean)` via `HasValue` | — |
| `required` boolean | `setRequiredIndicatorVisible(boolean)` via `HasValueAndElement` | matches Checkbox |
| `error-message` attr | `setErrorMessage(String)` via `HasValidationProperties` | — |
| `invalid` boolean | `setInvalid(boolean)` / `isInvalid()` via `HasValidationProperties` | — |
| `manualValidation` flag | `setManualValidation(boolean)` via `HasValidator` | — |
| `validate()` method | `validate()` (protected) | matches Checkbox |
| `validated` event | not directly exposed | applications use `addValueChangeListener` + the `invalid` property; matches Checkbox |
| `helper-text` attr | `setHelperText(String)` via `HasHelper` (transitive via `InputField`) | — |
| `slot="helper"` | `setHelperComponent(Component)` via `HasHelper` | — |
| `slot="tooltip"` | `setTooltipText` / `setTooltipMarkdown` / `getTooltip` via `HasTooltip` | transitive via `InputField` |
| `name` attribute | superseded by `Binder.forField(switch).bind(...)` (§9) | Flow uses `Binder` + `HasValue`, not native HTML form submission; matches Checkbox (no `setName`) |
| `value` attribute (form-submission default `"on"`) | superseded by the Boolean field value (§1) and Binder (§9) | the field's typed value is the `Boolean` value, not a string submission token |
| `<form>.reset()` interaction | superseded by `Binder.readBean(original)` (§9) | native-form lifecycle is irrelevant to Flow; Binder handles cancel/revert via its own pristine state |
| Theme variant `helper-above-field` | `SwitchVariant.HELPER_ABOVE` (+ legacy aliases) via `HasThemeVariant<SwitchVariant>` | matches `CheckboxVariant` |
| CSS custom properties (`--vaadin-switch-*`) | `getStyle().set(...)` via `HasStyle` | no typed setters; standard Vaadin convention |

Every web-component API surface is reachable from Flow except the four marked "not exposed in Flow", each of which is intentionally elided and rationale-tagged: native HTML form attributes (`name`, `value`, `<form>.reset()`) are superseded by Vaadin's `Binder` data-binding model, and the `validated` event has no widely used Flow analog (Checkbox has no `addValidatedListener` either).

## Discussion

No questions were posed to the user during the production of this document. Every API choice tracks the existing `Checkbox` Flow class:

- **Class hierarchy** — `extends AbstractSinglePropertyField<Switch, Boolean>` plus the same `implements` list as `Checkbox` (minus indeterminate-related concerns).
- **Constructors** — same set as `Checkbox`: no-arg, `(String label)`, `(boolean initialValue)`, `(String, boolean)`, `(String, ValueChangeListener)`, `(boolean, ValueChangeListener)`, `(String, boolean, ValueChangeListener)`.
- **Validation** — same `HasValidationProperties` / `HasValidator<Boolean>` / `setManualValidation` / `validate()` / `SwitchI18n.setRequiredErrorMessage` machinery.
- **Theming** — `SwitchVariant` enum modeled on `CheckboxVariant`; only `HELPER_ABOVE` for now.
- **Package name** — `com.vaadin.flow.component.switch_` (trailing underscore) because `switch` is a reserved Java keyword; the class itself is `Switch`. This is the minimum-pain way to keep the externally-typed name "Switch" while staying compilable.
