# Vaadin Stepper Web Component - Implementation Plan

## Executive Summary

This document outlines the implementation plan for a `vaadin-stepper` web component designed for building multi-step forms, wizards, and workflow UIs. The component addresses the need identified in [vaadin/web-components#5582](https://github.com/vaadin/web-components/issues/5582) for a dedicated stepper component to replace the misuse of `vaadin-accordion` for wizard UIs.

## Research Summary

### Community Requirements
From GitHub issue #5582:
- Need for building complex forms with multiple steps
- Support for "funnel" or "wizard" UI patterns
- Current workaround using accordion is not ideal
- Reference implementation exists in Vaadin 14 add-on (VStepper)

### Industry Analysis

**Material UI Stepper:**
- Horizontal and vertical orientations
- Linear and non-linear navigation
- Alternative label positioning
- Mobile stepper variant
- Customizable step icons and labels
- Error state handling

**Ant Design Steps:**
- Multiple display types: default, navigation, inline
- Dot style for compact layouts
- Progress tracking with states: wait, process, finish, error
- Responsive behavior for mobile
- Custom icon support
- Click navigation in navigation mode

**Carbon Design System:**
- Progress indicator with size variations
- Status indicators with color coding
- Skeleton loading states
- Dark mode support

**Key Findings:**
- No existing Shoelace implementation (community requested)
- Radix UI doesn't provide stepper primitives
- Mobile responsiveness is a major challenge for many steps
- Need for both linear (sequential) and non-linear (free navigation) modes

## Component Usage Examples

### Basic Horizontal Stepper

```html
<vaadin-stepper>
  <vaadin-step>
    <span slot="label">Personal Info</span>
    <div>Enter your personal information...</div>
  </vaadin-step>
  <vaadin-step>
    <span slot="label">Address</span>
    <div>Enter your address...</div>
  </vaadin-step>
  <vaadin-step>
    <span slot="label">Review</span>
    <div>Review your information...</div>
  </vaadin-step>
</vaadin-stepper>
```

### Linear Stepper with Validation

```html
<vaadin-stepper linear selected="0">
  <vaadin-step>
    <span slot="label">Account</span>
    <span slot="description">Create your account</span>
    <vaadin-vertical-layout>
      <vaadin-text-field label="Username" required></vaadin-text-field>
      <vaadin-password-field label="Password" required></vaadin-password-field>
    </vaadin-vertical-layout>
  </vaadin-step>
  <vaadin-step>
    <span slot="label">Profile</span>
    <span slot="description">Set up your profile</span>
    <div>Profile form...</div>
  </vaadin-step>
  <vaadin-step>
    <span slot="label">Complete</span>
    <div>All done!</div>
  </vaadin-step>
</vaadin-stepper>
```

### Vertical Stepper

```html
<vaadin-stepper orientation="vertical">
  <vaadin-step>
    <span slot="label">Step 1</span>
    <div>Content for step 1</div>
  </vaadin-step>
  <vaadin-step>
    <span slot="label">Step 2</span>
    <div>Content for step 2</div>
  </vaadin-step>
</vaadin-stepper>
```

### Stepper with Custom Icons and States

```html
<vaadin-stepper selected="1">
  <vaadin-step complete>
    <vaadin-icon slot="icon" icon="vaadin:check"></vaadin-icon>
    <span slot="label">Completed</span>
    <div>This step is done</div>
  </vaadin-step>
  <vaadin-step error>
    <vaadin-icon slot="icon" icon="vaadin:warning"></vaadin-icon>
    <span slot="label">Error</span>
    <span slot="error-message">Please fix the errors</span>
    <div>This step has errors</div>
  </vaadin-step>
  <vaadin-step disabled>
    <span slot="label">Disabled</span>
    <div>This step is not available yet</div>
  </vaadin-step>
</vaadin-stepper>
```

### Stepper with Navigation Controls

```html
<vaadin-stepper id="stepper">
  <vaadin-step>
    <span slot="label">Step 1</span>
    <div>Content...</div>
  </vaadin-step>
  <vaadin-step>
    <span slot="label">Step 2</span>
    <div>Content...</div>
  </vaadin-step>
</vaadin-stepper>

<vaadin-horizontal-layout slot="actions">
  <vaadin-button theme="tertiary" onclick="stepper.previous()">Back</vaadin-button>
  <vaadin-button theme="primary" onclick="stepper.next()">Next</vaadin-button>
</vaadin-horizontal-layout>
```

## Implementation Plan

### Phase 1: Core Functionality (MVP)

**Goal:** Get the basics right with a stable, accessible API

#### Components

##### `vaadin-stepper`
Main container component that manages step navigation and state.

**Properties:**
- `selected: number` (default: `0`) - Currently selected step index
- `orientation: 'horizontal' | 'vertical'` (default: `'horizontal'`) - Layout direction
- `linear: boolean` (default: `false`) - Whether steps must be completed sequentially
- `items: StepItem[]` - Alternative to slotted content for defining steps

**Methods:**
- `next(): void` - Navigate to next step (respects linear mode)
- `previous(): void` - Navigate to previous step
- `goTo(index: number): void` - Navigate to specific step (respects linear mode)

**Events:**
- `selected-changed: CustomEvent<{ value: number }>` - Fired when step selection changes
- `step-validation-requested: CustomEvent<{ index: number, step: Step }>` - Fired before navigating away from a step in linear mode

**DOM Structure:**
```html
<div part="container">
  <div part="steps">
    <!-- Step headers/indicators -->
  </div>
  <div part="content">
    <!-- Active step content -->
  </div>
</div>
```

**Parts:**
- `container` - Main container
- `steps` - Container for step headers/indicators
- `content` - Container for active step content

##### `vaadin-step`
Individual step element containing step content.

**Properties:**
- `label: string` - Step label (alternative to slot)
- `description: string` - Optional step description
- `disabled: boolean` (default: `false`) - Whether step is disabled
- `complete: boolean` (default: `false`) - Whether step is marked as complete
- `error: boolean` (default: `false`) - Whether step has an error
- `optional: boolean` (default: `false`) - Whether step is optional
- `editable: boolean` (default: `true`) - Whether completed step can be revisited

**Slots:**
- `label` - Step label text
- `description` - Optional description text
- `icon` - Custom icon for the step
- `error-message` - Error message when error state is true
- (default slot) - Step content

**DOM Structure:**
```html
<div part="step-header" role="tab">
  <div part="step-indicator">
    <div part="step-icon">
      <slot name="icon"></slot>
    </div>
    <div part="step-number">1</div>
  </div>
  <div part="step-label-container">
    <div part="step-label">
      <slot name="label"></slot>
    </div>
    <div part="step-description">
      <slot name="description"></slot>
    </div>
    <div part="step-error-message">
      <slot name="error-message"></slot>
    </div>
  </div>
  <div part="step-connector"></div>
</div>
<div part="step-content" role="tabpanel">
  <slot></slot>
</div>
```

**Parts:**
- `step-header` - Clickable step header
- `step-indicator` - Container for icon/number
- `step-icon` - Icon container
- `step-number` - Step number display
- `step-label-container` - Container for label and description
- `step-label` - Label text
- `step-description` - Description text
- `step-error-message` - Error message text
- `step-connector` - Line connecting steps
- `step-content` - Step content area

**State Attributes:**
- `active` - Applied when step is currently selected
- `disabled` - Applied when step is disabled
- `complete` - Applied when step is marked complete
- `error` - Applied when step has an error
- `optional` - Applied when step is optional
- `editable` - Applied when step can be revisited

#### Accessibility

Following WCAG 2.1 Level AA standards:

1. **Semantic Structure:**
   - Use `role="tablist"` on steps container
   - Use `role="tab"` on step headers
   - Use `role="tabpanel"` on step content areas
   - Proper `aria-labelledby` and `aria-controls` relationships

2. **Keyboard Navigation:**
   - Arrow keys to navigate between step headers (horizontal: Left/Right, vertical: Up/Down)
   - Home/End keys to jump to first/last step
   - Enter/Space to activate a step
   - Tab key to move through interactive content within active step

3. **Screen Reader Support:**
   - `aria-selected` on current step
   - `aria-disabled` on disabled steps
   - `aria-label` describing step position: "Step 1 of 3: Personal Info"
   - Live region announcements for step changes
   - `aria-current="step"` on active step

4. **Focus Management:**
   - Focus moves to activated step header on navigation
   - Focus is visible with `focus-ring` attribute
   - Focus trap not required (not a modal)

5. **Color Independence:**
   - Don't rely solely on color for states
   - Use icons for complete/error states
   - Use text labels for all states

#### Theme Integration

**Lumo Theme:**
```css
/* Base step indicator */
[part="step-indicator"] {
  border-radius: var(--lumo-border-radius-m);
  background: var(--lumo-contrast-10pct);
}

/* Active step */
:host([active]) [part="step-indicator"] {
  background: var(--lumo-primary-color);
  color: var(--lumo-primary-contrast-color);
}

/* Complete step */
:host([complete]) [part="step-indicator"] {
  background: var(--lumo-success-color);
  color: var(--lumo-success-contrast-color);
}

/* Error step */
:host([error]) [part="step-indicator"] {
  background: var(--lumo-error-color);
  color: var(--lumo-error-contrast-color);
}

/* Step connector */
[part="step-connector"] {
  background: var(--lumo-contrast-20pct);
}

:host([complete]) [part="step-connector"] {
  background: var(--lumo-success-color);
}
```

**Aura Theme:**
Similar structure with Aura design tokens.

**Custom Properties:**
```css
/* Spacing */
--vaadin-stepper-step-spacing: 1rem;
--vaadin-stepper-content-padding: 1.5rem;

/* Step indicator */
--vaadin-stepper-indicator-size: 2rem;
--vaadin-stepper-indicator-background: var(--lumo-contrast-10pct);
--vaadin-stepper-indicator-color: var(--lumo-body-text-color);

/* Connector */
--vaadin-stepper-connector-width: 2px;
--vaadin-stepper-connector-color: var(--lumo-contrast-20pct);

/* Labels */
--vaadin-stepper-label-font-size: var(--lumo-font-size-m);
--vaadin-stepper-label-font-weight: 500;
--vaadin-stepper-description-font-size: var(--lumo-font-size-s);
```

### Phase 2: Enhanced Features

**Goal:** Add advanced functionality without breaking Phase 1 API

#### New Features

1. **Alternative Label Position** (Horizontal only)
   - Property: `alternativeLabel: boolean`
   - Places labels below step indicators instead of beside

2. **Mobile Stepper Variant**
   - Property: `variant: 'default' | 'mobile' | 'dots'`
   - Mobile: Shows only active step with progress indicator
   - Dots: Compact dot indicators for many steps

3. **Step Validation**
   - Event: `before-step-change: CustomEvent<{ from: number, to: number, prevent: () => void }>`
   - Allows async validation before step transition

4. **Progress Indicator**
   - Property: `showProgress: boolean`
   - Displays overall progress (e.g., "2 of 5 steps complete")

5. **Dynamic Steps**
   - Support for adding/removing steps dynamically
   - Property: `items` array with renderer support

### Phase 3: Advanced Customization

**Goal:** Maximum flexibility for complex use cases

#### New Features

1. **Custom Step Renderers**
   - Slot: `step-{index}-renderer` for custom step content
   - Property: `stepRenderer: (step, index) => TemplateResult`

2. **Nested Steppers**
   - Support for sub-steps within a step
   - Property: `allowNested: boolean`

3. **Branching Logic**
   - Support for conditional step visibility
   - Method: `setStepVisibility(index: number, visible: boolean)`

4. **Persistence**
   - Save/restore stepper state
   - Methods: `getState()`, `setState(state)`

5. **Animations**
   - Property: `animated: boolean`
   - Smooth transitions between steps

## Technical Architecture

### File Structure

```
packages/stepper/
├── package.json
├── src/
│   ├── vaadin-stepper.js              # Main stepper element
│   ├── vaadin-stepper-mixin.js        # Stepper mixin with logic
│   ├── vaadin-step.js                 # Individual step element
│   ├── vaadin-step-mixin.js           # Step mixin
│   └── styles/
│       ├── vaadin-stepper-base-styles.js
│       └── vaadin-step-base-styles.js
├── theme/
│   ├── lumo/
│   │   ├── vaadin-stepper-styles.js
│   │   └── vaadin-step-styles.js
│   └── aura/
│       ├── vaadin-stepper-styles.js
│       └── vaadin-step-styles.js
├── test/
│   ├── stepper.test.js
│   ├── step.test.js
│   ├── accessibility.test.js
│   └── visual/
│       └── stepper.test.js
└── dev/
    └── stepper.html
```

### Implementation Details

#### Stepper Mixin

```javascript
export const StepperMixin = (superclass) =>
  class StepperMixinClass extends superclass {
    static get properties() {
      return {
        selected: {
          type: Number,
          reflect: true,
          value: 0
        },
        orientation: {
          type: String,
          reflect: true,
          value: 'horizontal'
        },
        linear: {
          type: Boolean,
          reflect: true,
          value: false
        }
      };
    }

    constructor() {
      super();
      this.__boundOnStepClick = this.__onStepClick.bind(this);
    }

    ready() {
      super.ready();
      this.addEventListener('step-click', this.__boundOnStepClick);
      this.__updateSteps();
    }

    __onStepClick(e) {
      const step = e.target;
      const index = this.__getStepIndex(step);

      if (this.linear && !this.__canNavigateToStep(index)) {
        return;
      }

      this.selected = index;
    }

    __canNavigateToStep(index) {
      // Check if all previous steps are complete
      const steps = this.__getSteps();
      for (let i = 0; i < index; i++) {
        if (!steps[i].complete && !steps[i].optional) {
          return false;
        }
      }
      return true;
    }

    next() {
      const steps = this.__getSteps();
      if (this.selected < steps.length - 1) {
        this.selected++;
      }
    }

    previous() {
      if (this.selected > 0) {
        this.selected--;
      }
    }

    goTo(index) {
      const steps = this.__getSteps();
      if (index >= 0 && index < steps.length) {
        if (!this.linear || this.__canNavigateToStep(index)) {
          this.selected = index;
        }
      }
    }
  };
```

## Documentation for vaadin.com/docs

### Overview Page

**Title:** Stepper

**Description:**
The Stepper component is used to guide users through multi-step processes such as forms, wizards, or workflows. It provides clear visual feedback about the current step, completed steps, and remaining steps.

**When to Use:**
- Multi-step forms (registration, checkout, etc.)
- Setup wizards and onboarding flows
- Complex data entry processes
- Workflow visualization

**When Not to Use:**
- Simple forms that fit on one screen
- Navigation menus (use Tabs instead)
- Progress tracking without user interaction (use Progress Bar instead)

### Usage Examples

1. **Basic Stepper**
   - Simple horizontal stepper with navigation
   - Show default styling and behavior

2. **Linear Stepper**
   - Enforce sequential step completion
   - Demonstrate validation

3. **Vertical Stepper**
   - Better for mobile or narrow layouts
   - Show orientation property

4. **Stepper with States**
   - Complete, error, and disabled states
   - Custom icons

5. **Optional Steps**
   - Mark steps as optional
   - Allow skipping

### Accessibility Section

- Keyboard navigation guide
- Screen reader considerations
- ARIA attributes explanation
- Color independence best practices

### Best Practices

**Do:**
- Keep step labels concise
- Provide clear descriptions for each step
- Show progress indication
- Allow users to go back and edit
- Validate before moving to next step in linear mode
- Use optional markers for non-required steps

**Don't:**
- Use too many steps (consider grouping)
- Hide step labels on mobile if possible
- Make completed steps non-editable by default
- Use only color to indicate state
- Force users through completed steps

### API Documentation

Complete API reference for:
- `<vaadin-stepper>` properties, methods, events, CSS parts
- `<vaadin-step>` properties, methods, events, CSS parts
- Custom CSS properties
- TypeScript interfaces

### Styling Guide

- Theme variants (Lumo/Aura)
- Custom CSS properties
- Part-based styling examples
- Responsive design patterns

## Testing Strategy

### Unit Tests
- Property changes and updates
- Method execution (next, previous, goTo)
- Event firing
- Linear mode logic
- Dynamic step addition/removal

### Integration Tests
- Keyboard navigation
- Mouse/touch interaction
- Step state management
- Form integration

### Accessibility Tests
- ARIA attribute validation
- Keyboard navigation coverage
- Screen reader announcement verification
- Focus management
- Color contrast validation

### Visual Regression Tests
- All orientations
- All states (active, complete, error, disabled)
- Theme variants (Lumo, Aura)
- Dark mode
- Responsive layouts

## Migration Path

For users currently using Accordion as a workaround:

```javascript
// Before (Accordion abuse)
<vaadin-accordion>
  <vaadin-accordion-panel>
    <div slot="summary">Step 1</div>
    <div>Content 1</div>
  </vaadin-accordion-panel>
</vaadin-accordion>

// After (Proper Stepper)
<vaadin-stepper>
  <vaadin-step>
    <span slot="label">Step 1</span>
    <div>Content 1</div>
  </vaadin-step>
</vaadin-stepper>
```

## Implementation Timeline

**Phase 1 (MVP):** 8-10 weeks
- Week 1-2: Component structure and basic rendering
- Week 3-4: Navigation logic and state management
- Week 5-6: Accessibility implementation
- Week 7-8: Theming (Lumo + Aura)
- Week 9-10: Testing and documentation

**Phase 2:** 4-6 weeks after Phase 1
**Phase 3:** 4-6 weeks after Phase 2

## Open Questions

1. Should we support a "condensed" mode for many steps?
2. Should step content be lazy-loaded or always rendered?
3. Do we need built-in navigation buttons or leave that to developers?
4. Should we support animations between step transitions?
5. How should we handle very long step labels on mobile?

## References

- [GitHub Issue #5582](https://github.com/vaadin/web-components/issues/5582)
- [Material UI Stepper](https://mui.com/material-ui/react-stepper/)
- [Ant Design Steps](https://ant.design/components/steps)
- [Vaadin 14 VStepper Add-on](https://github.com/mLottmann/VStepper)
- [Vaadin Web Component Guidelines](https://github.com/vaadin/web-components/blob/guidelines/WEB_COMPONENT_GUIDELINES.md)
- [Shoelace Stepper Discussion](https://github.com/shoelace-style/shoelace/discussions/1651)
