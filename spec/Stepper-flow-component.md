# Vaadin Stepper Flow Component - Implementation Plan

## Executive Summary

This document outlines the implementation plan for integrating the `vaadin-stepper` web component into Vaadin Flow for Java developers. The Flow component will provide a type-safe, fluent Java API following Vaadin Flow best practices while maintaining compatibility with the underlying web component.

## Flow Component Architecture

### Module Structure

```
vaadin-stepper-flow-parent/
├── vaadin-stepper-flow/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/vaadin/flow/component/stepper/
│   │   │   │       ├── Stepper.java
│   │   │   │       ├── Step.java
│   │   │   │       ├── StepperVariant.java
│   │   │   │       └── HasStepNavigation.java
│   │   │   └── resources/
│   │   │       └── META-INF/
│   │   │           └── resources/
│   │   │               └── frontend/
│   │   └── test/
│   │       └── java/
│   │           └── com/vaadin/flow/component/stepper/
│   │               ├── StepperTest.java
│   │               ├── StepTest.java
│   │               └── it/
│   │                   └── StepperIT.java
│   └── pom.xml
├── vaadin-stepper-flow-demo/
│   └── src/main/java/com/vaadin/flow/component/stepper/demo/
└── pom.xml
```

## Java API Design

### Stepper Class

```java
package com.vaadin.flow.component.stepper;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.HasStyle;
import com.vaadin.flow.component.HasTheme;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;

/**
 * Stepper is a component for creating multi-step workflows and wizards.
 * <p>
 * It displays a series of steps with labels and optional descriptions,
 * allowing users to navigate through a sequential process.
 * </p>
 *
 * @author Vaadin Ltd
 */
@Tag("vaadin-stepper")
@NpmPackage(value = "@vaadin/stepper", version = "25.0.0")
@JsModule("@vaadin/stepper/vaadin-stepper.js")
public class Stepper extends Component
        implements HasSize, HasStyle, HasTheme, HasStepNavigation {

    /**
     * Creates an empty stepper.
     */
    public Stepper() {
        super();
    }

    /**
     * Creates a stepper with the given steps.
     *
     * @param steps the steps to add
     */
    public Stepper(Step... steps) {
        this();
        add(steps);
    }

    /**
     * Adds the given steps to this stepper.
     *
     * @param steps the steps to add
     */
    public void add(Step... steps) {
        for (Step step : steps) {
            getElement().appendChild(step.getElement());
        }
    }

    /**
     * Removes the given steps from this stepper.
     *
     * @param steps the steps to remove
     */
    public void remove(Step... steps) {
        for (Step step : steps) {
            getElement().removeChild(step.getElement());
        }
    }

    /**
     * Removes all steps from this stepper.
     */
    public void removeAll() {
        getElement().removeAllChildren();
    }

    /**
     * Gets the index of the currently selected step.
     *
     * @return the selected step index, or 0 if no step is selected
     */
    public int getSelected() {
        return getElement().getProperty("selected", 0);
    }

    /**
     * Sets the selected step by index.
     *
     * @param selected the index of the step to select
     */
    public void setSelected(int selected) {
        getElement().setProperty("selected", selected);
    }

    /**
     * Gets the orientation of the stepper.
     *
     * @return the orientation
     */
    public Orientation getOrientation() {
        String orientation = getElement().getProperty("orientation", "horizontal");
        return Orientation.valueOf(orientation.toUpperCase());
    }

    /**
     * Sets the orientation of the stepper.
     *
     * @param orientation the orientation
     */
    public void setOrientation(Orientation orientation) {
        getElement().setProperty("orientation", orientation.name().toLowerCase());
    }

    /**
     * Checks whether the stepper is in linear mode.
     *
     * @return true if linear mode is enabled
     */
    public boolean isLinear() {
        return getElement().getProperty("linear", false);
    }

    /**
     * Sets whether the stepper should be in linear mode.
     * <p>
     * In linear mode, steps must be completed sequentially.
     * </p>
     *
     * @param linear true to enable linear mode
     */
    public void setLinear(boolean linear) {
        getElement().setProperty("linear", linear);
    }

    /**
     * Navigates to the next step.
     */
    @Override
    public void next() {
        getElement().callJsFunction("next");
    }

    /**
     * Navigates to the previous step.
     */
    @Override
    public void previous() {
        getElement().callJsFunction("previous");
    }

    /**
     * Navigates to the step at the given index.
     *
     * @param index the step index
     */
    @Override
    public void goTo(int index) {
        getElement().callJsFunction("goTo", index);
    }

    /**
     * Adds a listener for step selection changes.
     *
     * @param listener the listener to add
     * @return a registration for removing the listener
     */
    public Registration addSelectedChangeListener(
            ComponentEventListener<SelectedChangeEvent> listener) {
        return addListener(SelectedChangeEvent.class, listener);
    }

    /**
     * Adds a listener for step validation requests.
     * <p>
     * This event is fired before navigating away from a step in linear mode,
     * allowing you to validate the current step.
     * </p>
     *
     * @param listener the listener to add
     * @return a registration for removing the listener
     */
    public Registration addStepValidationListener(
            ComponentEventListener<StepValidationEvent> listener) {
        return addListener(StepValidationEvent.class, listener);
    }

    /**
     * Orientation of the stepper.
     */
    public enum Orientation {
        /**
         * Horizontal orientation (default).
         */
        HORIZONTAL,

        /**
         * Vertical orientation.
         */
        VERTICAL
    }

    /**
     * Event fired when the selected step changes.
     */
    @DomEvent("selected-changed")
    public static class SelectedChangeEvent extends ComponentEvent<Stepper> {
        private final int selectedIndex;

        public SelectedChangeEvent(Stepper source, boolean fromClient,
                @EventData("event.detail.value") int selectedIndex) {
            super(source, fromClient);
            this.selectedIndex = selectedIndex;
        }

        /**
         * Gets the index of the newly selected step.
         *
         * @return the selected step index
         */
        public int getSelectedIndex() {
            return selectedIndex;
        }
    }

    /**
     * Event fired when step validation is requested.
     */
    @DomEvent("step-validation-requested")
    public static class StepValidationEvent extends ComponentEvent<Stepper> {
        private final int stepIndex;

        public StepValidationEvent(Stepper source, boolean fromClient,
                @EventData("event.detail.index") int stepIndex) {
            super(source, fromClient);
            this.stepIndex = stepIndex;
        }

        /**
         * Gets the index of the step to validate.
         *
         * @return the step index
         */
        public int getStepIndex() {
            return stepIndex;
        }
    }
}
```

### Step Class

```java
package com.vaadin.flow.component.stepper;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasComponents;
import com.vaadin.flow.component.HasStyle;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;

/**
 * Step is a component representing a single step in a {@link Stepper}.
 * <p>
 * Each step can have a label, description, custom icon, and content.
 * Steps can be marked as complete, in error, optional, or disabled.
 * </p>
 *
 * @author Vaadin Ltd
 */
@Tag("vaadin-step")
@NpmPackage(value = "@vaadin/stepper", version = "25.0.0")
@JsModule("@vaadin/stepper/vaadin-step.js")
public class Step extends Component implements HasComponents, HasStyle {

    /**
     * Creates an empty step.
     */
    public Step() {
        super();
    }

    /**
     * Creates a step with the given label.
     *
     * @param label the step label
     */
    public Step(String label) {
        this();
        setLabel(label);
    }

    /**
     * Creates a step with the given label and components.
     *
     * @param label      the step label
     * @param components the components to add to the step content
     */
    public Step(String label, Component... components) {
        this(label);
        add(components);
    }

    /**
     * Gets the label of the step.
     *
     * @return the label, or null if not set
     */
    public String getLabel() {
        return getElement().getProperty("label");
    }

    /**
     * Sets the label of the step.
     *
     * @param label the label to set
     */
    public void setLabel(String label) {
        getElement().setProperty("label", label);
    }

    /**
     * Gets the description of the step.
     *
     * @return the description, or null if not set
     */
    public String getDescription() {
        return getElement().getProperty("description");
    }

    /**
     * Sets the description of the step.
     *
     * @param description the description to set
     */
    public void setDescription(String description) {
        getElement().setProperty("description", description);
    }

    /**
     * Checks whether the step is disabled.
     *
     * @return true if the step is disabled
     */
    public boolean isDisabled() {
        return getElement().getProperty("disabled", false);
    }

    /**
     * Sets whether the step is disabled.
     *
     * @param disabled true to disable the step
     */
    public void setDisabled(boolean disabled) {
        getElement().setProperty("disabled", disabled);
    }

    /**
     * Checks whether the step is marked as complete.
     *
     * @return true if the step is complete
     */
    public boolean isComplete() {
        return getElement().getProperty("complete", false);
    }

    /**
     * Sets whether the step is marked as complete.
     *
     * @param complete true to mark the step as complete
     */
    public void setComplete(boolean complete) {
        getElement().setProperty("complete", complete);
    }

    /**
     * Checks whether the step has an error.
     *
     * @return true if the step has an error
     */
    public boolean isError() {
        return getElement().getProperty("error", false);
    }

    /**
     * Sets whether the step has an error.
     *
     * @param error true to mark the step with an error
     */
    public void setError(boolean error) {
        getElement().setProperty("error", error);
    }

    /**
     * Gets the error message.
     *
     * @return the error message, or null if not set
     */
    public String getErrorMessage() {
        return getElement().getProperty("errorMessage");
    }

    /**
     * Sets the error message.
     *
     * @param errorMessage the error message to set
     */
    public void setErrorMessage(String errorMessage) {
        getElement().setProperty("errorMessage", errorMessage);
    }

    /**
     * Checks whether the step is optional.
     *
     * @return true if the step is optional
     */
    public boolean isOptional() {
        return getElement().getProperty("optional", false);
    }

    /**
     * Sets whether the step is optional.
     *
     * @param optional true to mark the step as optional
     */
    public void setOptional(boolean optional) {
        getElement().setProperty("optional", optional);
    }

    /**
     * Checks whether the step can be edited after completion.
     *
     * @return true if the step is editable
     */
    public boolean isEditable() {
        return getElement().getProperty("editable", true);
    }

    /**
     * Sets whether the step can be edited after completion.
     *
     * @param editable true to allow editing completed steps
     */
    public void setEditable(boolean editable) {
        getElement().setProperty("editable", editable);
    }

    /**
     * Sets a custom icon for the step.
     *
     * @param icon the icon component
     */
    public void setIcon(Component icon) {
        icon.getElement().setAttribute("slot", "icon");
        getElement().appendChild(icon.getElement());
    }
}
```

### Helper Interfaces

```java
package com.vaadin.flow.component.stepper;

/**
 * Interface for components that support step navigation.
 */
public interface HasStepNavigation {

    /**
     * Navigates to the next step.
     */
    void next();

    /**
     * Navigates to the previous step.
     */
    void previous();

    /**
     * Navigates to the step at the given index.
     *
     * @param index the step index
     */
    void goTo(int index);
}
```

## Usage Examples

### Basic Stepper

```java
Stepper stepper = new Stepper();

Step step1 = new Step("Personal Info");
step1.add(new TextField("Name"), new TextField("Email"));

Step step2 = new Step("Address");
step2.add(new TextField("Street"), new TextField("City"));

Step step3 = new Step("Review");
step3.add(new Div(new Text("Review your information")));

stepper.add(step1, step2, step3);

add(stepper);
```

### Linear Stepper with Validation

```java
Stepper stepper = new Stepper();
stepper.setLinear(true);

// Step 1: Account Creation
Step accountStep = new Step("Create Account");
TextField usernameField = new TextField("Username");
usernameField.setRequired(true);
PasswordField passwordField = new PasswordField("Password");
passwordField.setRequired(true);
accountStep.add(usernameField, passwordField);

// Step 2: Profile
Step profileStep = new Step("Profile Information");
TextField nameField = new TextField("Full Name");
TextField companyField = new TextField("Company");
profileStep.add(nameField, companyField);

// Step 3: Confirmation
Step confirmStep = new Step("Confirm");
confirmStep.add(new Span("Account created successfully!"));

stepper.add(accountStep, profileStep, confirmStep);

// Validation
stepper.addStepValidationListener(event -> {
    int stepIndex = event.getStepIndex();
    if (stepIndex == 0) {
        if (usernameField.isEmpty() || passwordField.isEmpty()) {
            accountStep.setError(true);
            accountStep.setErrorMessage("Please fill all required fields");
            Notification.show("Please complete all fields");
        } else {
            accountStep.setComplete(true);
            accountStep.setError(false);
        }
    }
});

// Navigation buttons
Button backButton = new Button("Back", e -> stepper.previous());
Button nextButton = new Button("Next", e -> stepper.next());

HorizontalLayout navigation = new HorizontalLayout(backButton, nextButton);
add(stepper, navigation);
```

### Vertical Stepper

```java
Stepper stepper = new Stepper();
stepper.setOrientation(Stepper.Orientation.VERTICAL);

stepper.add(
    new Step("Upload File", new Upload()),
    new Step("Configure Settings", new FormLayout(/* fields */)),
    new Step("Process Data", new ProgressBar())
);

add(stepper);
```

### Stepper with Custom Icons and States

```java
Stepper stepper = new Stepper();

// Complete step with custom icon
Step step1 = new Step("Completed");
step1.setComplete(true);
step1.setIcon(new Icon(VaadinIcon.CHECK_CIRCLE));
step1.add(new Span("This step is done"));

// Current step with error
Step step2 = new Step("Current (Error)");
step2.setError(true);
step2.setErrorMessage("Please fix the validation errors");
step2.setIcon(new Icon(VaadinIcon.WARNING));
step2.add(new TextField("Name"));

// Disabled step
Step step3 = new Step("Not Available");
step3.setDisabled(true);
step3.add(new Span("Complete previous steps first"));

stepper.add(step1, step2, step3);
stepper.setSelected(1);

add(stepper);
```

### Data Binding with Binder

```java
public class RegistrationView extends VerticalLayout {

    private Binder<Person> binder = new Binder<>(Person.class);
    private Stepper stepper = new Stepper();
    private Person person = new Person();

    public RegistrationView() {
        stepper.setLinear(true);

        // Step 1: Personal Information
        Step personalInfoStep = new Step("Personal Information");
        TextField firstNameField = new TextField("First Name");
        TextField lastNameField = new TextField("Last Name");
        DatePicker birthDateField = new DatePicker("Birth Date");

        binder.forField(firstNameField)
            .asRequired("First name is required")
            .bind(Person::getFirstName, Person::setFirstName);

        binder.forField(lastNameField)
            .asRequired("Last name is required")
            .bind(Person::getLastName, Person::setLastName);

        binder.forField(birthDateField)
            .bind(Person::getBirthDate, Person::setBirthDate);

        personalInfoStep.add(
            new FormLayout(firstNameField, lastNameField, birthDateField)
        );

        // Step 2: Contact Information
        Step contactStep = new Step("Contact Information");
        EmailField emailField = new EmailField("Email");
        TextField phoneField = new TextField("Phone");

        binder.forField(emailField)
            .asRequired("Email is required")
            .bind(Person::getEmail, Person::setEmail);

        binder.forField(phoneField)
            .bind(Person::getPhone, Person::setPhone);

        contactStep.add(new FormLayout(emailField, phoneField));

        // Step 3: Review
        Step reviewStep = new Step("Review");
        Div reviewContent = new Div();
        reviewContent.setText("Review your information and submit");

        reviewStep.add(reviewContent);

        stepper.add(personalInfoStep, contactStep, reviewStep);

        // Validation on step change
        stepper.addSelectedChangeListener(event -> {
            int fromIndex = event.getSelectedIndex() - 1;
            if (fromIndex >= 0 && fromIndex < 2) {
                BinderValidationStatus<Person> status = binder.validate();
                Step step = getStepAt(fromIndex);

                if (status.hasErrors()) {
                    step.setError(true);
                    step.setErrorMessage("Please fix validation errors");
                } else {
                    step.setComplete(true);
                    step.setError(false);
                }
            }
        });

        // Navigation
        Button backButton = new Button("Back", e -> stepper.previous());
        Button nextButton = new Button("Next", e -> {
            if (stepper.getSelected() == 2) {
                save();
            } else {
                stepper.next();
            }
        });

        nextButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);

        add(stepper, new HorizontalLayout(backButton, nextButton));
    }

    private Step getStepAt(int index) {
        return (Step) stepper.getElement().getChild(index).getComponent().orElse(null);
    }

    private void save() {
        if (binder.writeBeanIfValid(person)) {
            // Save person
            Notification.show("Registration complete!");
        } else {
            Notification.show("Please fix validation errors");
        }
    }
}
```

### Wizard with Backend Integration

```java
@Route("wizard")
public class WizardView extends VerticalLayout {

    private final PersonService personService;
    private Stepper stepper;
    private Person currentPerson;

    public WizardView(PersonService personService) {
        this.personService = personService;
        createWizard();
    }

    private void createWizard() {
        stepper = new Stepper();
        stepper.setLinear(true);
        stepper.setSizeFull();

        // Steps
        stepper.add(
            createAccountStep(),
            createProfileStep(),
            createPreferencesStep(),
            createConfirmationStep()
        );

        // Track progress
        stepper.addSelectedChangeListener(event -> {
            updateNavigationButtons();
            saveProgress(event.getSelectedIndex());
        });

        Button backButton = new Button("Back", e -> stepper.previous());
        Button nextButton = new Button("Next", e -> handleNext());
        Button finishButton = new Button("Finish", e -> finishWizard());

        HorizontalLayout actions = new HorizontalLayout(
            backButton, nextButton, finishButton
        );

        add(stepper, actions);
        setSizeFull();
    }

    private void handleNext() {
        int current = stepper.getSelected();

        CompletableFuture<Boolean> validation = validateCurrentStep(current);
        validation.thenAccept(valid -> {
            getUI().ifPresent(ui -> ui.access(() -> {
                if (valid) {
                    markStepComplete(current);
                    stepper.next();
                } else {
                    markStepError(current);
                }
            }));
        });
    }

    private CompletableFuture<Boolean> validateCurrentStep(int stepIndex) {
        return CompletableFuture.supplyAsync(() -> {
            // Async validation with backend
            return personService.validateStep(currentPerson, stepIndex);
        });
    }

    private void saveProgress(int stepIndex) {
        personService.saveProgress(currentPerson, stepIndex);
    }

    private void finishWizard() {
        personService.save(currentPerson);
        Notification.show("Wizard completed!");
        getUI().ifPresent(ui -> ui.navigate("dashboard"));
    }

    // ... step creation methods
}
```

## Advanced Features

### StepperBuilder for Fluent API

```java
package com.vaadin.flow.component.stepper;

/**
 * Fluent builder for creating Stepper instances.
 */
public class StepperBuilder {
    private final Stepper stepper;

    private StepperBuilder() {
        this.stepper = new Stepper();
    }

    public static StepperBuilder create() {
        return new StepperBuilder();
    }

    public StepperBuilder vertical() {
        stepper.setOrientation(Stepper.Orientation.VERTICAL);
        return this;
    }

    public StepperBuilder linear() {
        stepper.setLinear(true);
        return this;
    }

    public StepperBuilder withStep(String label, Component... components) {
        stepper.add(new Step(label, components));
        return this;
    }

    public StepperBuilder withOptionalStep(String label, Component... components) {
        Step step = new Step(label, components);
        step.setOptional(true);
        stepper.add(step);
        return this;
    }

    public StepperBuilder onSelectedChange(ComponentEventListener<Stepper.SelectedChangeEvent> listener) {
        stepper.addSelectedChangeListener(listener);
        return this;
    }

    public Stepper build() {
        return stepper;
    }
}
```

Usage:
```java
Stepper stepper = StepperBuilder.create()
    .linear()
    .withStep("Account", accountFields)
    .withOptionalStep("Profile", profileFields)
    .withStep("Confirm", confirmationView)
    .onSelectedChange(e -> updateUI(e.getSelectedIndex()))
    .build();
```

## Testing Strategy

### Unit Tests

```java
public class StepperTest {

    private Stepper stepper;

    @Before
    public void setUp() {
        stepper = new Stepper();
    }

    @Test
    public void testDefaultOrientation() {
        assertEquals(Stepper.Orientation.HORIZONTAL, stepper.getOrientation());
    }

    @Test
    public void testSetOrientation() {
        stepper.setOrientation(Stepper.Orientation.VERTICAL);
        assertEquals(Stepper.Orientation.VERTICAL, stepper.getOrientation());
    }

    @Test
    public void testLinearMode() {
        assertFalse(stepper.isLinear());
        stepper.setLinear(true);
        assertTrue(stepper.isLinear());
    }

    @Test
    public void testAddSteps() {
        Step step1 = new Step("Step 1");
        Step step2 = new Step("Step 2");

        stepper.add(step1, step2);

        assertEquals(2, stepper.getElement().getChildCount());
    }

    @Test
    public void testNavigation() {
        stepper.add(new Step("1"), new Step("2"), new Step("3"));

        assertEquals(0, stepper.getSelected());

        stepper.next();
        assertEquals(1, stepper.getSelected());

        stepper.goTo(2);
        assertEquals(2, stepper.getSelected());

        stepper.previous();
        assertEquals(1, stepper.getSelected());
    }
}
```

### Integration Tests

```java
@Route("it/stepper")
public class StepperIT extends AbstractViewTest {

    @Test
    public void stepperRendersCorrectly() {
        open();

        StepperElement stepper = $(StepperElement.class).first();
        assertNotNull(stepper);

        List<StepElement> steps = stepper.$(StepElement.class).all();
        assertEquals(3, steps.size());
    }

    @Test
    public void canNavigateSteps() {
        open();

        StepperElement stepper = $(StepperElement.class).first();

        // Click second step
        stepper.$(StepElement.class).get(1).click();

        assertEquals(1, stepper.getSelected());
    }

    @Test
    public void linearModeEnforcesSequence() {
        open();

        StepperElement stepper = $(StepperElement.class).first();

        // Try to click third step when first is not complete
        stepper.$(StepElement.class).get(2).click();

        // Should still be on first step
        assertEquals(0, stepper.getSelected());
    }
}
```

## Documentation for vaadin.com/docs

### Component Overview

**Title:** Stepper

**Package:** `com.vaadin.flow.component.stepper`

**Description:**
Stepper is a component for creating multi-step workflows, wizards, and forms. It provides a clear visual indication of progress through a sequence of steps.

### Basic Usage

```java
Stepper stepper = new Stepper();
stepper.add(
    new Step("Step 1", new TextField()),
    new Step("Step 2", new TextField()),
    new Step("Step 3", new Span("Done!"))
);
```

### API Documentation

Complete JavaDoc for:
- `Stepper` - Main component class
- `Step` - Individual step class
- Events: `SelectedChangeEvent`, `StepValidationEvent`
- Enums: `Orientation`
- Interfaces: `HasStepNavigation`

### Examples

1. **Basic Stepper** - Simple multi-step form
2. **Linear Stepper** - Sequential validation
3. **Vertical Layout** - Better for narrow screens
4. **Form Binding** - Integration with Binder
5. **Async Validation** - Backend validation between steps
6. **Custom Icons** - Using Icon component
7. **Wizard Pattern** - Complete registration wizard

### Best Practices

**Do:**
- Use linear mode for forms requiring validation
- Provide clear, concise step labels
- Mark optional steps appropriately
- Allow users to edit previous steps
- Show validation feedback immediately

**Don't:**
- Create too many steps (6+ is usually too many)
- Use for simple forms that fit on one page
- Disable back navigation without good reason
- Hide step content unnecessarily

## Build Configuration

### Maven Dependencies

```xml
<dependency>
    <groupId>com.vaadin</groupId>
    <artifactId>vaadin-stepper-flow</artifactId>
    <version>${vaadin.version}</version>
</dependency>
```

### NPM Package

```json
{
  "dependencies": {
    "@vaadin/stepper": "25.0.0"
  }
}
```

## Migration Guide

### From Accordion Workaround

```java
// Before (using Accordion)
Accordion accordion = new Accordion();
accordion.add("Step 1", new TextField());
accordion.add("Step 2", new TextField());

// After (using Stepper)
Stepper stepper = new Stepper();
stepper.add(
    new Step("Step 1", new TextField()),
    new Step("Step 2", new TextField())
);
```

### From Vaadin 14 VStepper Add-on

```java
// Vaadin 14 VStepper
VStepper stepper = new VStepper();
stepper.addStep("Step 1", content1);
stepper.addStep("Step 2", content2);
stepper.setLinear(true);

// Vaadin 25 Stepper
Stepper stepper = new Stepper();
stepper.add(new Step("Step 1", content1));
stepper.add(new Step("Step 2", content2));
stepper.setLinear(true);
```

## Release Strategy

### Phase 1: Core Component
- Basic Stepper and Step classes
- Horizontal and vertical orientations
- Linear mode support
- Event support
- Complete JavaDoc

### Phase 2: Enhanced Features
- Builder API
- Additional helper methods
- Integration examples
- Performance optimizations

### Phase 3: Advanced Features
- Custom renderers
- Template support
- Additional validation hooks

## Browser Compatibility

Same as web component:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Dependencies

- `vaadin-flow-components-base` - Base Flow component support
- `@vaadin/stepper` - Web component implementation
- Vaadin Flow (25.0.0+)
- Spring Boot (compatible version)

## Known Issues and Limitations

1. **Server-Side Rendering**
   - Component relies on client-side web component
   - Ensure proper loading of JavaScript resources

2. **State Synchronization**
   - Large numbers of steps may impact performance
   - Consider lazy loading step content

3. **Browser Support**
   - Requires modern browsers with web component support
   - Polyfills not included by default

## References

- [Web Component Specification](./Stepper-web-component.md)
- [React Component Specification](./Stepper-react-component.md)
- [Vaadin Flow Documentation](https://vaadin.com/docs/latest/flow)
- [GitHub Issue #5582](https://github.com/vaadin/web-components/issues/5582)
