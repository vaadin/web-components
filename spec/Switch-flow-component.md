# Switch Flow Component Integration Specification

## Overview

This document outlines the plan for integrating the `<vaadin-switch>` web component into Vaadin Flow (`com.vaadin:vaadin-switch-flow`). The Flow component will provide a Java API that wraps the web component, offering type-safe access to all features while following Vaadin Flow conventions and patterns.

## Repository Context

**Target Repository**: `https://github.com/vaadin/flow-components`

The Flow Components repository contains Java integrations for all Vaadin web components, enabling server-side Java applications built with Vaadin Flow to use web components through a type-safe Java API.

## Goals

1. **Type Safety**: Provide a fully type-safe Java API for the Switch component
2. **Flow Patterns**: Follow established Vaadin Flow patterns and conventions
3. **Data Binding**: Support Vaadin Binder for two-way data binding
4. **Validation**: Integrate with Vaadin's validation framework
5. **Event Handling**: Provide Java event listeners for component events
6. **Documentation**: Comprehensive JavaDoc and usage examples
7. **Testing**: Full test coverage including unit, integration, and UI tests

## Usage Examples

### Basic Usage

```java
import com.vaadin.flow.component.switch_.Switch;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route("")
public class MainView extends VerticalLayout {

    public MainView() {
        Switch switchComponent = new Switch("Enable notifications");
        add(switchComponent);
    }
}
```

### With Value Change Listener

```java
public class SettingsView extends VerticalLayout {

    public SettingsView() {
        Switch darkModeSwitch = new Switch("Dark mode");
        darkModeSwitch.setValue(false);

        darkModeSwitch.addValueChangeListener(event -> {
            boolean isDarkMode = event.getValue();
            System.out.println("Dark mode is now: " + (isDarkMode ? "ON" : "OFF"));

            // Apply theme change
            if (isDarkMode) {
                UI.getCurrent().getElement().setAttribute("theme", "dark");
            } else {
                UI.getCurrent().getElement().removeAttribute("theme");
            }
        });

        add(darkModeSwitch);
    }
}
```

### Form Integration

```java
public class RegistrationForm extends FormLayout {

    private TextField email = new TextField("Email");
    private Switch termsSwitch = new Switch("I agree to the terms and conditions");
    private Button submitButton = new Button("Register");

    public RegistrationForm() {
        termsSwitch.setRequiredIndicatorVisible(true);

        submitButton.addClickListener(event -> {
            if (termsSwitch.getValue()) {
                register(email.getValue());
            } else {
                Notification.show("You must agree to the terms");
            }
        });

        add(email, termsSwitch, submitButton);
    }

    private void register(String email) {
        // Registration logic
    }
}
```

### Data Binding with Binder

```java
public class UserSettingsForm extends VerticalLayout {

    private Binder<UserSettings> binder = new Binder<>(UserSettings.class);

    private Switch notificationsSwitch = new Switch("Enable notifications");
    private Switch emailUpdatesSwitch = new Switch("Email updates");
    private Switch darkModeSwitch = new Switch("Dark mode");

    public UserSettingsForm() {
        // Bind switches to model
        binder.forField(notificationsSwitch)
            .bind(UserSettings::isNotificationsEnabled,
                  UserSettings::setNotificationsEnabled);

        binder.forField(emailUpdatesSwitch)
            .bind(UserSettings::isEmailUpdatesEnabled,
                  UserSettings::setEmailUpdatesEnabled);

        binder.forField(darkModeSwitch)
            .bind(UserSettings::isDarkModeEnabled,
                  UserSettings::setDarkModeEnabled);

        add(notificationsSwitch, emailUpdatesSwitch, darkModeSwitch);

        // Load user settings
        loadSettings();
    }

    private void loadSettings() {
        UserSettings settings = userService.getUserSettings();
        binder.setBean(settings);
    }

    public void save() {
        UserSettings settings = binder.getBean();
        userService.saveSettings(settings);
    }
}

public class UserSettings {
    private boolean notificationsEnabled;
    private boolean emailUpdatesEnabled;
    private boolean darkModeEnabled;

    // Getters and setters
    public boolean isNotificationsEnabled() {
        return notificationsEnabled;
    }

    public void setNotificationsEnabled(boolean enabled) {
        this.notificationsEnabled = enabled;
    }

    // ... other getters/setters
}
```

### With Validation

```java
public class SecurityForm extends VerticalLayout {

    private Binder<SecuritySettings> binder = new Binder<>(SecuritySettings.class);
    private Switch twoFactorSwitch = new Switch("Enable two-factor authentication");

    public SecurityForm() {
        binder.forField(twoFactorSwitch)
            .withValidator(enabled -> {
                // Custom validation logic
                if (!enabled && isHighSecurityAccount()) {
                    return ValidationResult.error(
                        "Two-factor authentication is required for this account"
                    );
                }
                return ValidationResult.ok();
            })
            .bind(SecuritySettings::isTwoFactorEnabled,
                  SecuritySettings::setTwoFactorEnabled);

        twoFactorSwitch.addValueChangeListener(event -> {
            binder.validate();
        });

        add(twoFactorSwitch);
    }

    private boolean isHighSecurityAccount() {
        // Check if account requires 2FA
        return true;
    }
}
```

### Disabled and Read-Only States

```java
public class PermissionsView extends VerticalLayout {

    public PermissionsView() {
        // Disabled switch (no interaction)
        Switch premiumFeature = new Switch("Premium feature");
        premiumFeature.setEnabled(false);

        // Read-only switch (shows state but no modification)
        Switch adminEnabled = new Switch("Enabled by administrator");
        adminEnabled.setReadOnly(true);
        adminEnabled.setValue(true);

        add(premiumFeature, adminEnabled);
    }
}
```

### Size Variants (Phase 2)

```java
public class SizeExamples extends VerticalLayout {

    public SizeExamples() {
        Switch smallSwitch = new Switch("Small");
        smallSwitch.setSize(SwitchSize.SMALL);

        Switch mediumSwitch = new Switch("Medium");
        smallSwitch.setSize(SwitchSize.MEDIUM);

        Switch largeSwitch = new Switch("Large");
        largeSwitch.setSize(SwitchSize.LARGE);

        add(smallSwitch, mediumSwitch, largeSwitch);
    }
}
```

### With Helper Text (Phase 2)

```java
public class TwoFactorSettings extends VerticalLayout {

    public TwoFactorSettings() {
        Switch twoFactorSwitch = new Switch("Enable two-factor authentication");
        twoFactorSwitch.setHelperText("You can change this later in settings");

        add(twoFactorSwitch);
    }
}
```

### Integration with Grid

```java
public class FeatureManagementView extends VerticalLayout {

    private Grid<Feature> grid = new Grid<>(Feature.class, false);

    public FeatureManagementView() {
        grid.addColumn(Feature::getName).setHeader("Feature");

        grid.addComponentColumn(feature -> {
            Switch switchComponent = new Switch();
            switchComponent.setValue(feature.isEnabled());
            switchComponent.addValueChangeListener(event -> {
                feature.setEnabled(event.getValue());
                featureService.updateFeature(feature);
            });
            return switchComponent;
        }).setHeader("Enabled");

        add(grid);
        grid.setItems(featureService.getAllFeatures());
    }
}

public class Feature {
    private String name;
    private boolean enabled;

    // Getters and setters
}
```

### Custom Styling

```java
public class CustomStyledSwitch extends VerticalLayout {

    public CustomStyledSwitch() {
        Switch customSwitch = new Switch("Custom styled");

        // Apply custom CSS properties via style
        customSwitch.getStyle()
            .set("--vaadin-switch-track-color-checked", "#4CAF50")
            .set("--vaadin-switch-width", "60px")
            .set("--vaadin-switch-height", "30px");

        add(customSwitch);
    }
}
```

## Component API

### Phase 1: Core Features

#### Main Class Structure

```java
package com.vaadin.flow.component.switch_;

import com.vaadin.flow.component.AbstractSinglePropertyField;
import com.vaadin.flow.component.Focusable;
import com.vaadin.flow.component.HasLabel;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.HasStyle;
import com.vaadin.flow.component.HasValidation;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;

/**
 * Server-side component for the {@code <vaadin-switch>} web component.
 * <p>
 * Switch is a binary toggle control that allows users to turn an option on or off.
 * It provides a clear visual indication of state and is commonly used for settings,
 * preferences, and feature toggles.
 * <p>
 * Example usage:
 * <pre>
 * Switch darkMode = new Switch("Dark mode");
 * darkMode.addValueChangeListener(event -&gt; {
 *     applyTheme(event.getValue() ? "dark" : "light");
 * });
 * </pre>
 *
 * @author Vaadin Ltd
 */
@Tag("vaadin-switch")
@NpmPackage(value = "@vaadin/switch", version = "25.0.0")
@JsModule("@vaadin/switch/src/vaadin-switch.js")
public class Switch extends AbstractSinglePropertyField<Switch, Boolean>
        implements Focusable<Switch>, HasLabel, HasSize, HasStyle, HasValidation {

    /**
     * Constructs a new switch with no label.
     */
    public Switch() {
        this(false);
    }

    /**
     * Constructs a new switch with the given initial value.
     *
     * @param initialValue the initial value
     */
    public Switch(boolean initialValue) {
        super("checked", false, false);
        setValue(initialValue);
    }

    /**
     * Constructs a new switch with the given label.
     *
     * @param labelText the label text
     */
    public Switch(String labelText) {
        this();
        setLabel(labelText);
    }

    /**
     * Constructs a new switch with the given label and value change listener.
     *
     * @param labelText the label text
     * @param listener the value change listener
     */
    public Switch(String labelText,
                  ValueChangeListener<ComponentValueChangeEvent<Switch, Boolean>> listener) {
        this(labelText);
        addValueChangeListener(listener);
    }

    /**
     * Sets the label for this switch.
     *
     * @param label the label text
     */
    @Override
    public void setLabel(String label) {
        getElement().setText(label);
    }

    /**
     * Gets the label of this switch.
     *
     * @return the label text
     */
    @Override
    public String getLabel() {
        return getElement().getText();
    }

    /**
     * Gets the current value of this switch.
     *
     * @return {@code true} if checked, {@code false} otherwise
     */
    public boolean getValue() {
        return super.getValue() != null && super.getValue();
    }

    /**
     * Sets the value of this switch.
     *
     * @param value {@code true} to check the switch, {@code false} to uncheck
     */
    @Override
    public void setValue(Boolean value) {
        super.setValue(value != null && value);
    }

    /**
     * Sets whether this switch is required in forms.
     * <p>
     * When required, the switch must be checked for form validation to pass.
     *
     * @param required {@code true} to make the switch required
     */
    public void setRequiredIndicatorVisible(boolean required) {
        getElement().setProperty("required", required);
    }

    /**
     * Gets whether this switch is required in forms.
     *
     * @return {@code true} if required
     */
    public boolean isRequiredIndicatorVisible() {
        return getElement().getProperty("required", false);
    }

    /**
     * Sets whether this switch is in an invalid state.
     *
     * @param invalid {@code true} to mark as invalid
     */
    @Override
    public void setInvalid(boolean invalid) {
        getElement().setProperty("invalid", invalid);
    }

    /**
     * Gets whether this switch is in an invalid state.
     *
     * @return {@code true} if invalid
     */
    @Override
    public boolean isInvalid() {
        return getElement().getProperty("invalid", false);
    }

    /**
     * Sets the error message to show when the switch is invalid.
     *
     * @param errorMessage the error message
     */
    @Override
    public void setErrorMessage(String errorMessage) {
        getElement().setProperty("errorMessage", errorMessage);
    }

    /**
     * Gets the error message shown when the switch is invalid.
     *
     * @return the error message
     */
    @Override
    public String getErrorMessage() {
        return getElement().getProperty("errorMessage", "");
    }

    /**
     * Sets the name of this switch for form submission.
     *
     * @param name the name
     */
    public void setName(String name) {
        getElement().setProperty("name", name);
    }

    /**
     * Gets the name of this switch for form submission.
     *
     * @return the name
     */
    public String getName() {
        return getElement().getProperty("name", "");
    }

    /**
     * Sets the value sent to the server when this switch is checked in a form.
     *
     * @param value the value
     */
    public void setFormValue(String value) {
        getElement().setProperty("value", value);
    }

    /**
     * Gets the value sent to the server when this switch is checked in a form.
     *
     * @return the form value
     */
    public String getFormValue() {
        return getElement().getProperty("value", "on");
    }

    /**
     * Sets whether the switch is read-only.
     * <p>
     * When read-only, the switch displays its current state but cannot be modified.
     *
     * @param readOnly {@code true} to make read-only
     */
    @Override
    public void setReadOnly(boolean readOnly) {
        getElement().setProperty("readonly", readOnly);
    }

    /**
     * Gets whether the switch is read-only.
     *
     * @return {@code true} if read-only
     */
    @Override
    public boolean isReadOnly() {
        return getElement().getProperty("readonly", false);
    }

    /**
     * Sets the accessible ARIA label for this switch.
     * <p>
     * Use this when the switch has no visible label.
     *
     * @param ariaLabel the ARIA label
     */
    public void setAriaLabel(String ariaLabel) {
        getElement().setAttribute("aria-label", ariaLabel);
    }

    /**
     * Gets the accessible ARIA label for this switch.
     *
     * @return the ARIA label
     */
    public String getAriaLabel() {
        return getElement().getAttribute("aria-label");
    }

    /**
     * Sets the ID of the element that labels this switch.
     *
     * @param labelledBy the ID
     */
    public void setAriaLabelledBy(String labelledBy) {
        getElement().setAttribute("aria-labelledby", labelledBy);
    }

    /**
     * Gets the ID of the element that labels this switch.
     *
     * @return the ID
     */
    public String getAriaLabelledBy() {
        return getElement().getAttribute("aria-labelledby");
    }
}
```

### Phase 2: Enhanced Features

#### Size Enum

```java
package com.vaadin.flow.component.switch_;

/**
 * Size variants for the Switch component.
 */
public enum SwitchSize {
    SMALL("small"),
    MEDIUM("medium"),
    LARGE("large");

    private final String value;

    SwitchSize(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
```

#### Extended Switch Class

```java
/**
 * Sets the size of this switch.
 *
 * @param size the size variant
 */
public void setSize(SwitchSize size) {
    if (size == null) {
        getElement().removeAttribute("size");
    } else {
        getElement().setAttribute("size", size.getValue());
    }
}

/**
 * Gets the size of this switch.
 *
 * @return the size variant, or null if not set
 */
public SwitchSize getSize() {
    String size = getElement().getAttribute("size");
    if (size == null) {
        return null;
    }
    for (SwitchSize s : SwitchSize.values()) {
        if (s.getValue().equals(size)) {
            return s;
        }
    }
    return null;
}

/**
 * Sets the helper text for this switch.
 * <p>
 * Helper text is displayed below the switch to provide additional guidance.
 *
 * @param helperText the helper text
 */
public void setHelperText(String helperText) {
    getElement().setProperty("helperText", helperText);
}

/**
 * Gets the helper text for this switch.
 *
 * @return the helper text
 */
public String getHelperText() {
    return getElement().getProperty("helperText", "");
}
```

### Phase 3: Advanced Features

```java
/**
 * Sets the label text displayed inside the track when the switch is checked.
 *
 * @param checkedLabel the checked label
 */
public void setCheckedLabel(String checkedLabel) {
    getElement().setProperty("checkedLabel", checkedLabel);
}

/**
 * Gets the label text displayed inside the track when the switch is checked.
 *
 * @return the checked label
 */
public String getCheckedLabel() {
    return getElement().getProperty("checkedLabel", "");
}

/**
 * Sets the label text displayed inside the track when the switch is unchecked.
 *
 * @param uncheckedLabel the unchecked label
 */
public void setUncheckedLabel(String uncheckedLabel) {
    getElement().setProperty("uncheckedLabel", uncheckedLabel);
}

/**
 * Gets the label text displayed inside the track when the switch is unchecked.
 *
 * @return the unchecked label
 */
public String getUncheckedLabel() {
    return getElement().getProperty("uncheckedLabel", "");
}
```

## Implementation Plan

### File Structure

```
vaadin-switch-flow-parent/
├── vaadin-switch-flow/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/vaadin/flow/component/switch_/
│   │   │   │       ├── Switch.java
│   │   │   │       └── SwitchSize.java (Phase 2)
│   │   │   └── resources/
│   │   │       └── META-INF/
│   │   │           └── resources/
│   │   │               └── frontend/
│   │   └── test/
│   │       └── java/
│   │           └── com/vaadin/flow/component/switch_/
│   │               ├── SwitchTest.java
│   │               └── SwitchIT.java
│   └── pom.xml
├── vaadin-switch-flow-demo/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/vaadin/flow/component/switch_/demo/
│   │               └── SwitchView.java
│   └── pom.xml
├── vaadin-switch-testbench/
│   ├── src/
│   │   ├── main/
│   │   │   └── java/
│   │   │       └── com/vaadin/flow/component/switch_/testbench/
│   │   │           └── SwitchElement.java
│   │   └── test/
│   │       └── java/
│   │           └── com/vaadin/flow/component/switch_/testbench/
│   │               └── SwitchElementIT.java
│   └── pom.xml
└── pom.xml
```

### Core Implementation Details

#### 1. Value Handling

The Switch extends `AbstractSinglePropertyField` with Boolean type:

```java
public class Switch extends AbstractSinglePropertyField<Switch, Boolean> {

    public Switch() {
        super("checked", false, false);
    }

    @Override
    public void setValue(Boolean value) {
        // Ensure value is never null
        super.setValue(value != null && value);
    }

    public boolean getValue() {
        Boolean value = super.getValue();
        return value != null && value;
    }
}
```

#### 2. Label Handling

Labels are set as text content of the element:

```java
@Override
public void setLabel(String label) {
    getElement().setText(label);
}

@Override
public String getLabel() {
    return getElement().getText();
}
```

#### 3. Validation Integration

Implement `HasValidation` for integration with Binder:

```java
@Override
public void setInvalid(boolean invalid) {
    getElement().setProperty("invalid", invalid);
}

@Override
public boolean isInvalid() {
    return getElement().getProperty("invalid", false);
}

@Override
public void setErrorMessage(String errorMessage) {
    getElement().setProperty("errorMessage", errorMessage);
}

@Override
public String getErrorMessage() {
    return getElement().getProperty("errorMessage", "");
}
```

#### 4. Event Handling

Value change events are handled automatically by `AbstractSinglePropertyField`:

```java
Switch switchComponent = new Switch();
switchComponent.addValueChangeListener(event -> {
    boolean oldValue = event.getOldValue();
    boolean newValue = event.getValue();
    boolean isFromClient = event.isFromClient();

    System.out.println("Value changed from " + oldValue + " to " + newValue);
});
```

### TestBench Element

Create TestBench element for automated testing:

```java
package com.vaadin.flow.component.switch_.testbench;

import com.vaadin.testbench.TestBenchElement;
import com.vaadin.testbench.elementsbase.Element;

/**
 * TestBench element for the {@code <vaadin-switch>} component.
 */
@Element("vaadin-switch")
public class SwitchElement extends TestBenchElement {

    /**
     * Gets whether this switch is checked.
     *
     * @return {@code true} if checked
     */
    public boolean isChecked() {
        return getPropertyBoolean("checked");
    }

    /**
     * Sets the checked state of this switch.
     *
     * @param checked {@code true} to check
     */
    public void setChecked(boolean checked) {
        if (isChecked() != checked) {
            click();
        }
    }

    /**
     * Toggles the switch.
     */
    public void toggle() {
        click();
    }

    /**
     * Gets the label text of this switch.
     *
     * @return the label text
     */
    public String getLabel() {
        return getText();
    }

    /**
     * Gets whether this switch is enabled.
     *
     * @return {@code true} if enabled
     */
    public boolean isEnabled() {
        return !getPropertyBoolean("disabled");
    }

    /**
     * Gets whether this switch is in an invalid state.
     *
     * @return {@code true} if invalid
     */
    public boolean isInvalid() {
        return getPropertyBoolean("invalid");
    }

    /**
     * Gets whether this switch is read-only.
     *
     * @return {@code true} if read-only
     */
    public boolean isReadOnly() {
        return getPropertyBoolean("readonly");
    }
}
```

### Testing Strategy

#### Unit Tests

```java
package com.vaadin.flow.component.switch_;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SwitchTest {

    @Test
    public void defaultConstructor_switchIsUnchecked() {
        Switch switchComponent = new Switch();
        assertFalse(switchComponent.getValue());
    }

    @Test
    public void constructorWithValue_switchHasValue() {
        Switch switchComponent = new Switch(true);
        assertTrue(switchComponent.getValue());
    }

    @Test
    public void constructorWithLabel_switchHasLabel() {
        Switch switchComponent = new Switch("Enable feature");
        assertEquals("Enable feature", switchComponent.getLabel());
    }

    @Test
    public void setValue_valueIsSet() {
        Switch switchComponent = new Switch();
        switchComponent.setValue(true);
        assertTrue(switchComponent.getValue());
    }

    @Test
    public void setValue_firesValueChangeEvent() {
        Switch switchComponent = new Switch();
        AtomicInteger eventCount = new AtomicInteger(0);

        switchComponent.addValueChangeListener(event -> {
            eventCount.incrementAndGet();
            assertFalse(event.getOldValue());
            assertTrue(event.getValue());
        });

        switchComponent.setValue(true);
        assertEquals(1, eventCount.get());
    }

    @Test
    public void setLabel_labelIsSet() {
        Switch switchComponent = new Switch();
        switchComponent.setLabel("Dark mode");
        assertEquals("Dark mode", switchComponent.getLabel());
    }

    @Test
    public void setRequired_requiredPropertyIsSet() {
        Switch switchComponent = new Switch();
        switchComponent.setRequiredIndicatorVisible(true);
        assertTrue(switchComponent.isRequiredIndicatorVisible());
    }

    @Test
    public void setInvalid_invalidPropertyIsSet() {
        Switch switchComponent = new Switch();
        switchComponent.setInvalid(true);
        assertTrue(switchComponent.isInvalid());
    }

    @Test
    public void setErrorMessage_errorMessageIsSet() {
        Switch switchComponent = new Switch();
        String errorMessage = "This field is required";
        switchComponent.setErrorMessage(errorMessage);
        assertEquals(errorMessage, switchComponent.getErrorMessage());
    }

    @Test
    public void setReadOnly_readOnlyPropertyIsSet() {
        Switch switchComponent = new Switch();
        switchComponent.setReadOnly(true);
        assertTrue(switchComponent.isReadOnly());
    }

    @Test
    public void setEnabled_enabledPropertyIsSet() {
        Switch switchComponent = new Switch();
        switchComponent.setEnabled(false);
        assertFalse(switchComponent.isEnabled());
    }

    @Test
    public void setName_namePropertyIsSet() {
        Switch switchComponent = new Switch();
        switchComponent.setName("terms");
        assertEquals("terms", switchComponent.getName());
    }

    @Test
    public void setFormValue_valuePropertyIsSet() {
        Switch switchComponent = new Switch();
        switchComponent.setFormValue("accepted");
        assertEquals("accepted", switchComponent.getFormValue());
    }
}
```

#### Integration Tests

```java
package com.vaadin.flow.component.switch_;

import com.vaadin.flow.component.switch_.testbench.SwitchElement;
import com.vaadin.testbench.parallel.BrowserTest;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SwitchIT extends AbstractParallelTest {

    @Test
    public void clickSwitch_switchIsToggled() {
        SwitchElement switchElement = $(SwitchElement.class).first();

        assertFalse(switchElement.isChecked());

        switchElement.click();
        assertTrue(switchElement.isChecked());

        switchElement.click();
        assertFalse(switchElement.isChecked());
    }

    @Test
    public void disabledSwitch_cannotBeClicked() {
        SwitchElement switchElement = $(SwitchElement.class).id("disabled-switch");

        assertFalse(switchElement.isEnabled());
        assertFalse(switchElement.isChecked());

        switchElement.click();
        assertFalse(switchElement.isChecked()); // Still unchecked
    }

    @Test
    public void readOnlySwitch_cannotBeClicked() {
        SwitchElement switchElement = $(SwitchElement.class).id("readonly-switch");

        assertTrue(switchElement.isReadOnly());
        assertTrue(switchElement.isChecked());

        switchElement.click();
        assertTrue(switchElement.isChecked()); // Still checked
    }

    @Test
    public void requiredSwitch_showsValidationError() {
        SwitchElement switchElement = $(SwitchElement.class).id("required-switch");

        // Submit form without checking required switch
        $("button").id("submit").click();

        assertTrue(switchElement.isInvalid());
    }
}
```

### Demo Application

Create comprehensive demo for testing and documentation:

```java
package com.vaadin.flow.component.switch_.demo;

import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.switch_.Switch;
import com.vaadin.flow.component.switch_.SwitchSize;
import com.vaadin.flow.router.Route;

@Route("switch")
public class SwitchView extends VerticalLayout {

    public SwitchView() {
        add(createBasicExample());
        add(createValueChangeExample());
        add(createStatesExample());
        add(createSizeExample());
        add(createValidationExample());
    }

    private Div createBasicExample() {
        Div container = new Div();
        container.add(new H3("Basic Switch"));

        Switch basicSwitch = new Switch("Enable notifications");
        container.add(basicSwitch);

        return container;
    }

    private Div createValueChangeExample() {
        Div container = new Div();
        container.add(new H3("Value Change Listener"));

        Switch darkModeSwitch = new Switch("Dark mode");
        darkModeSwitch.addValueChangeListener(event -> {
            Notification.show(
                "Dark mode is now " + (event.getValue() ? "ON" : "OFF")
            );
        });

        container.add(darkModeSwitch);
        return container;
    }

    private Div createStatesExample() {
        Div container = new Div();
        container.add(new H3("States"));

        Switch enabledSwitch = new Switch("Enabled switch");

        Switch disabledSwitch = new Switch("Disabled switch");
        disabledSwitch.setEnabled(false);

        Switch readOnlySwitch = new Switch("Read-only switch");
        readOnlySwitch.setReadOnly(true);
        readOnlySwitch.setValue(true);

        container.add(enabledSwitch, disabledSwitch, readOnlySwitch);
        return container;
    }

    private Div createSizeExample() {
        Div container = new Div();
        container.add(new H3("Sizes"));

        Switch smallSwitch = new Switch("Small");
        smallSwitch.setSize(SwitchSize.SMALL);

        Switch mediumSwitch = new Switch("Medium");
        mediumSwitch.setSize(SwitchSize.MEDIUM);

        Switch largeSwitch = new Switch("Large");
        largeSwitch.setSize(SwitchSize.LARGE);

        container.add(smallSwitch, mediumSwitch, largeSwitch);
        return container;
    }

    private Div createValidationExample() {
        Div container = new Div();
        container.add(new H3("Validation"));

        Switch requiredSwitch = new Switch("I agree to the terms");
        requiredSwitch.setRequiredIndicatorVisible(true);

        Button submitButton = new Button("Submit", event -> {
            if (requiredSwitch.getValue()) {
                Notification.show("Form submitted!");
            } else {
                requiredSwitch.setInvalid(true);
                requiredSwitch.setErrorMessage("You must agree to the terms");
            }
        });

        requiredSwitch.addValueChangeListener(event -> {
            if (event.getValue()) {
                requiredSwitch.setInvalid(false);
            }
        });

        container.add(requiredSwitch, submitButton);
        return container;
    }
}
```

## Documentation Plan

### JavaDoc Documentation

Comprehensive JavaDoc for all public APIs:

```java
/**
 * Server-side component for the {@code <vaadin-switch>} web component.
 * <p>
 * Switch is a binary toggle control that allows users to turn an option on or off.
 * It provides a clear visual indication of state and is commonly used for settings,
 * preferences, and feature toggles.
 * <p>
 * <strong>When to use Switch vs Checkbox:</strong>
 * <ul>
 *   <li>Use Switch for settings that take immediate effect (e.g., "Enable Dark Mode")</li>
 *   <li>Use Checkbox for options that require form submission (e.g., newsletter signup)</li>
 * </ul>
 *
 * <h3>Basic Usage</h3>
 * <pre>
 * Switch darkMode = new Switch("Dark mode");
 * darkMode.addValueChangeListener(event -&gt; {
 *     applyTheme(event.getValue() ? "dark" : "light");
 * });
 * </pre>
 *
 * <h3>Form Integration</h3>
 * <pre>
 * Switch termsSwitch = new Switch("I agree to the terms");
 * termsSwitch.setRequiredIndicatorVisible(true);
 * termsSwitch.setName("terms");
 * </pre>
 *
 * <h3>Data Binding</h3>
 * <pre>
 * Binder&lt;UserSettings&gt; binder = new Binder&lt;&gt;(UserSettings.class);
 * Switch notifications = new Switch("Notifications");
 *
 * binder.forField(notifications)
 *     .bind(UserSettings::isNotificationsEnabled,
 *           UserSettings::setNotificationsEnabled);
 * </pre>
 *
 * @see HasLabel
 * @see HasValidation
 * @see Focusable
 * @author Vaadin Ltd
 * @since 25.0
 */
```

### User Documentation

**Location**: `vaadin.com/docs/latest/components/switch`

#### Overview Page

Content:
- What is a Switch component
- When to use Switch vs Checkbox
- Basic usage examples
- Live demo
- Accessibility considerations
- Browser support

#### Usage Guide

Content sections:
1. **Basic Usage** - Simple on/off toggle
2. **Labels** - Setting and customizing labels
3. **Value Change Handling** - Responding to state changes
4. **States** - Disabled and read-only
5. **Form Integration** - Using in forms
6. **Data Binding** - Integration with Binder
7. **Validation** - Required fields and custom validation
8. **Sizing** (Phase 2) - Size variants
9. **Helper Text** (Phase 2) - Adding guidance text

#### Styling Guide

Content:
- Theme variants
- Custom CSS properties
- Styling examples
- Responsive design considerations

#### API Reference

Generated from JavaDoc with additional examples.

#### Best Practices

Content:
- When to use Switch
- Label guidelines
- Accessibility tips
- Performance considerations

## Comparison with Checkbox

Document the differences to help users choose:

| Aspect | Switch | Checkbox |
|--------|--------|----------|
| **Use Case** | Immediate effect settings | Form submission options |
| **Visual** | Toggle slider | Checkmark box |
| **State Change** | Immediate | On submit |
| **Multiple Selection** | Single binary choice | Checkbox groups supported |
| **Flow Class** | `com.vaadin.flow.component.switch_.Switch` | `com.vaadin.flow.component.checkbox.Checkbox` |

## Migration Guide

### From Checkbox Toggle Themes

For users currently using checkbox with toggle themes:

**Before:**
```java
Checkbox toggle = new Checkbox("Enable feature");
toggle.addThemeVariants(CheckboxVariant.TOGGLE);
```

**After:**
```java
Switch toggle = new Switch("Enable feature");
```

### API Differences

| Checkbox | Switch |
|----------|--------|
| `setValue(Boolean)` | `setValue(Boolean)` |
| `getValue()` returns `Boolean` | `getValue()` returns `boolean` |
| `setLabel(String)` | `setLabel(String)` |
| `addValueChangeListener()` | `addValueChangeListener()` |

## Release Strategy

### Phase 1: Core Features (v1.0.0)

**Target**: Initial stable release aligned with web component v1.0.0

**Features**:
- Basic Switch component
- Value property and events
- Label support
- Disabled state
- Read-only state
- Form integration (name, value)
- Validation support (required, invalid, error message)
- Focus management
- ARIA attributes
- Binder integration
- TestBench element
- JavaDoc documentation
- Demo application

### Phase 2: Enhanced Features (v1.1.0)

**Target**: 2-3 months after v1.0.0

**Features**:
- Size variants (SwitchSize enum)
- Helper text support
- Additional styling options

### Phase 3: Advanced Features (v1.2.0)

**Target**: 4-6 months after v1.1.0

**Features**:
- Checked/unchecked labels
- Advanced customization

## Dependencies

### Maven Dependencies

```xml
<dependency>
    <groupId>com.vaadin</groupId>
    <artifactId>vaadin-switch-flow</artifactId>
    <version>25.0.0</version>
</dependency>
```

### Build Configuration

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>com.vaadin</groupId>
        <artifactId>flow-server</artifactId>
        <version>${flow.version}</version>
    </dependency>
    <dependency>
        <groupId>com.vaadin</groupId>
        <artifactId>flow-data</artifactId>
        <version>${flow.version}</version>
    </dependency>

    <!-- Test dependencies -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>com.vaadin</groupId>
        <artifactId>vaadin-testbench</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Success Criteria

The Flow integration will be considered successful when:

1. ✅ Full feature parity with web component
2. ✅ Type-safe Java API
3. ✅ Seamless Binder integration
4. ✅ Comprehensive JavaDoc coverage
5. ✅ Unit test coverage > 90%
6. ✅ Integration tests covering all features
7. ✅ Demo application showcasing all features
8. ✅ Documentation published on vaadin.com
9. ✅ Positive developer feedback
10. ✅ No critical bugs in first 3 months

## Conclusion

This specification provides a comprehensive plan for integrating the Switch web component into Vaadin Flow. The Java API will provide a type-safe, idiomatic way to use the Switch component in server-side Vaadin applications, with full support for data binding, validation, and all Flow patterns. The phased approach ensures a solid foundation while allowing for future enhancements.
