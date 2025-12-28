# Vaadin Stepper React Component - Implementation Plan

## Executive Summary

This document outlines the implementation plan for integrating the `vaadin-stepper` web component into the Vaadin React components library (`@vaadin/react-components`). The React wrapper will provide TypeScript-first, idiomatic React APIs while maintaining full compatibility with the underlying web component.

## React Component Architecture

### Component Structure

Following the established Vaadin React components pattern:

```
packages/react-components/src/
├── Stepper.tsx              # Main Stepper wrapper
├── Step.tsx                 # Step wrapper
└── __tests__/
    ├── Stepper.test.tsx
    └── Step.test.tsx
```

## Usage Examples

### Basic Stepper

```tsx
import { Stepper, Step } from '@vaadin/react-components/Stepper';

function RegistrationWizard() {
  const [selected, setSelected] = useState(0);

  return (
    <Stepper selected={selected} onSelectedChanged={(e) => setSelected(e.detail.value)}>
      <Step label="Account">
        <TextField label="Email" />
        <PasswordField label="Password" />
      </Step>
      <Step label="Profile">
        <TextField label="Name" />
        <TextField label="Company" />
      </Step>
      <Step label="Confirm">
        <div>Review your information...</div>
      </Step>
    </Stepper>
  );
}
```

### Controlled Stepper with Validation

```tsx
import { Stepper, Step } from '@vaadin/react-components/Stepper';
import { Button } from '@vaadin/react-components/Button';

function CheckoutFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    shipping: {},
    payment: {},
    review: {}
  });

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const validateStep = (step: number): boolean => {
    // Validation logic
    return true;
  };

  return (
    <>
      <Stepper
        selected={activeStep}
        onSelectedChanged={(e) => setActiveStep(e.detail.value)}
        linear
      >
        <Step
          label="Shipping Address"
          complete={activeStep > 0}
        >
          <ShippingForm
            data={formData.shipping}
            onChange={(data) => setFormData({ ...formData, shipping: data })}
          />
        </Step>
        <Step
          label="Payment Method"
          complete={activeStep > 1}
        >
          <PaymentForm
            data={formData.payment}
            onChange={(data) => setFormData({ ...formData, payment: data })}
          />
        </Step>
        <Step label="Review Order">
          <ReviewScreen data={formData} />
        </Step>
      </Stepper>

      <div className="actions">
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          theme="primary"
          disabled={activeStep === 2}
        >
          {activeStep === 2 ? 'Place Order' : 'Next'}
        </Button>
      </div>
    </>
  );
}
```

### Vertical Stepper with Error Handling

```tsx
import { Stepper, Step } from '@vaadin/react-components/Stepper';

function DataImportWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<number, string>>({});

  return (
    <Stepper
      selected={currentStep}
      onSelectedChanged={(e) => setCurrentStep(e.detail.value)}
      orientation="vertical"
      linear
    >
      <Step
        label="Select File"
        error={!!errors[0]}
        errorMessage={errors[0]}
      >
        <FileUpload onUploadComplete={handleFileSelected} />
      </Step>
      <Step
        label="Map Fields"
        error={!!errors[1]}
        errorMessage={errors[1]}
      >
        <FieldMapper />
      </Step>
      <Step label="Import Data">
        <ImportProgress />
      </Step>
    </Stepper>
  );
}
```

### Using Render Props for Dynamic Content

```tsx
import { Stepper, Step } from '@vaadin/react-components/Stepper';

function DynamicStepper() {
  const steps = [
    { id: 'info', label: 'Information', optional: false },
    { id: 'details', label: 'Details', optional: true },
    { id: 'review', label: 'Review', optional: false }
  ];

  return (
    <Stepper>
      {steps.map((step, index) => (
        <Step
          key={step.id}
          label={step.label}
          optional={step.optional}
        >
          {renderStepContent(step.id)}
        </Step>
      ))}
    </Stepper>
  );
}
```

### Integration with React Hook Form

```tsx
import { Stepper, Step } from '@vaadin/react-components/Stepper';
import { useForm, FormProvider } from 'react-hook-form';

function FormWizard() {
  const [step, setStep] = useState(0);
  const methods = useForm({
    mode: 'onChange'
  });

  const onSubmit = async (data: any) => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      await submitForm(data);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stepper selected={step} onSelectedChanged={(e) => setStep(e.detail.value)}>
          <Step
            label="Personal Info"
            complete={methods.formState.dirtyFields.name && methods.formState.dirtyFields.email}
          >
            <TextField
              label="Name"
              {...methods.register('name', { required: true })}
            />
            <TextField
              label="Email"
              {...methods.register('email', { required: true })}
            />
          </Step>
          <Step label="Address">
            <TextField
              label="Street"
              {...methods.register('street')}
            />
          </Step>
          <Step label="Summary">
            <FormSummary data={methods.watch()} />
          </Step>
        </Stepper>
        <Button type="submit">
          {step === 2 ? 'Submit' : 'Next'}
        </Button>
      </form>
    </FormProvider>
  );
}
```

## TypeScript API

### Stepper Component

```typescript
import { ReactElement } from 'react';

export interface StepperProps {
  /**
   * The index of the currently selected step.
   * @default 0
   */
  selected?: number;

  /**
   * Callback fired when the selected step changes.
   */
  onSelectedChanged?: (event: StepperSelectedChangedEvent) => void;

  /**
   * The orientation of the stepper.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Whether steps must be completed in order.
   * @default false
   */
  linear?: boolean;

  /**
   * Step elements.
   */
  children?: ReactElement<StepProps> | ReactElement<StepProps>[];

  /**
   * CSS class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;

  /**
   * Reference to the underlying web component.
   */
  ref?: React.Ref<HTMLElement>;
}

export interface StepperSelectedChangedEvent extends CustomEvent {
  detail: {
    value: number;
  };
}

export interface StepperElement extends HTMLElement {
  selected: number;
  orientation: 'horizontal' | 'vertical';
  linear: boolean;
  next(): void;
  previous(): void;
  goTo(index: number): void;
}

/**
 * Stepper component for multi-step workflows and wizards.
 */
export const Stepper: React.FC<StepperProps>;
```

### Step Component

```typescript
import { ReactNode } from 'react';

export interface StepProps {
  /**
   * The label for the step.
   */
  label?: string;

  /**
   * Optional description text for the step.
   */
  description?: string;

  /**
   * Whether the step is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the step is marked as complete.
   * @default false
   */
  complete?: boolean;

  /**
   * Whether the step has an error.
   * @default false
   */
  error?: boolean;

  /**
   * Error message to display when error is true.
   */
  errorMessage?: string;

  /**
   * Whether the step is optional.
   * @default false
   */
  optional?: boolean;

  /**
   * Whether a completed step can be revisited.
   * @default true
   */
  editable?: boolean;

  /**
   * Custom icon element.
   */
  icon?: ReactNode;

  /**
   * Step content.
   */
  children?: ReactNode;

  /**
   * CSS class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;

  /**
   * Reference to the underlying web component.
   */
  ref?: React.Ref<HTMLElement>;
}

export interface StepElement extends HTMLElement {
  label: string;
  description: string;
  disabled: boolean;
  complete: boolean;
  error: boolean;
  optional: boolean;
  editable: boolean;
}

/**
 * Individual step element for use within a Stepper.
 */
export const Step: React.FC<StepProps>;
```

## Implementation Details

### Stepper Component Implementation

```typescript
import { useEffect, useRef, forwardRef } from 'react';
import { createComponent } from '@lit/react';
import { Stepper as StepperWC } from '@vaadin/stepper';

export const Stepper = createComponent({
  tagName: 'vaadin-stepper',
  elementClass: StepperWC,
  react: React,
  events: {
    onSelectedChanged: 'selected-changed',
    onStepValidationRequested: 'step-validation-requested'
  }
});

// Add convenience methods via hook
export function useStepper(stepperRef: React.RefObject<StepperElement>) {
  const next = () => stepperRef.current?.next();
  const previous = () => stepperRef.current?.previous();
  const goTo = (index: number) => stepperRef.current?.goTo(index);

  return { next, previous, goTo };
}
```

### Step Component Implementation

```typescript
import { createComponent } from '@lit/react';
import { Step as StepWC } from '@vaadin/step';

export const Step = createComponent({
  tagName: 'vaadin-step',
  elementClass: StepWC,
  react: React,
  events: {}
});
```

## React-Specific Features

### Custom Hooks

#### useStepper Hook

```typescript
import { useRef, useCallback } from 'react';

/**
 * Hook for accessing Stepper methods imperatively.
 */
export function useStepper() {
  const stepperRef = useRef<StepperElement>(null);

  const next = useCallback(() => {
    stepperRef.current?.next();
  }, []);

  const previous = useCallback(() => {
    stepperRef.current?.previous();
  }, []);

  const goTo = useCallback((index: number) => {
    stepperRef.current?.goTo(index);
  }, []);

  return {
    stepperRef,
    next,
    previous,
    goTo
  };
}
```

Usage:
```tsx
function MyWizard() {
  const { stepperRef, next, previous } = useStepper();

  return (
    <>
      <Stepper ref={stepperRef}>
        {/* steps */}
      </Stepper>
      <Button onClick={previous}>Back</Button>
      <Button onClick={next}>Next</Button>
    </>
  );
}
```

#### useStepperState Hook

```typescript
/**
 * Hook for managing stepper state in a controlled manner.
 */
export function useStepperState(initialStep = 0) {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [stepStates, setStepStates] = useState<StepState[]>([]);

  const completeStep = useCallback((index: number) => {
    setStepStates(prev => {
      const next = [...prev];
      next[index] = { ...next[index], complete: true };
      return next;
    });
  }, []);

  const setStepError = useCallback((index: number, error: string | null) => {
    setStepStates(prev => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        error: !!error,
        errorMessage: error || undefined
      };
      return next;
    });
  }, []);

  return {
    activeStep,
    setActiveStep,
    stepStates,
    completeStep,
    setStepError
  };
}
```

Usage:
```tsx
function MyWizard() {
  const { activeStep, setActiveStep, stepStates, completeStep, setStepError } = useStepperState();

  const handleSubmitStep = async (stepIndex: number) => {
    try {
      await validateStep(stepIndex);
      completeStep(stepIndex);
      setActiveStep(stepIndex + 1);
    } catch (error) {
      setStepError(stepIndex, error.message);
    }
  };

  return (
    <Stepper selected={activeStep} onSelectedChanged={(e) => setActiveStep(e.detail.value)}>
      {stepStates.map((state, index) => (
        <Step
          key={index}
          complete={state.complete}
          error={state.error}
          errorMessage={state.errorMessage}
        >
          {/* content */}
        </Step>
      ))}
    </Stepper>
  );
}
```

### Higher-Order Components

#### withStepperNavigation HOC

```typescript
/**
 * HOC that wraps a stepper with navigation buttons.
 */
export function withStepperNavigation<P extends StepperProps>(
  Component: React.ComponentType<P>
) {
  return function StepperWithNavigation(props: P & StepperNavigationProps) {
    const { backButtonText = 'Back', nextButtonText = 'Next', ...stepperProps } = props;
    const stepperRef = useRef<StepperElement>(null);
    const [selected, setSelected] = useState(props.selected || 0);

    return (
      <div className="stepper-with-navigation">
        <Component
          {...(stepperProps as P)}
          ref={stepperRef}
          selected={selected}
          onSelectedChanged={(e) => setSelected(e.detail.value)}
        />
        <div className="stepper-actions">
          <Button
            onClick={() => stepperRef.current?.previous()}
            disabled={selected === 0}
          >
            {backButtonText}
          </Button>
          <Button
            onClick={() => stepperRef.current?.next()}
            theme="primary"
          >
            {nextButtonText}
          </Button>
        </div>
      </div>
    );
  };
}
```

## Testing Strategy

### Unit Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Stepper, Step } from '@vaadin/react-components/Stepper';

describe('Stepper', () => {
  it('renders with children', () => {
    render(
      <Stepper>
        <Step label="Step 1">Content 1</Step>
        <Step label="Step 2">Content 2</Step>
      </Stepper>
    );

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
  });

  it('handles selection changes', () => {
    const handleChange = jest.fn();
    render(
      <Stepper selected={0} onSelectedChanged={handleChange}>
        <Step label="Step 1">Content 1</Step>
        <Step label="Step 2">Content 2</Step>
      </Stepper>
    );

    fireEvent.click(screen.getByText('Step 2'));
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { value: 1 }
      })
    );
  });

  it('respects linear mode', () => {
    render(
      <Stepper selected={0} linear>
        <Step label="Step 1">Content 1</Step>
        <Step label="Step 2">Content 2</Step>
        <Step label="Step 3">Content 3</Step>
      </Stepper>
    );

    // Step 2 should be disabled if step 1 is not complete
    const step2 = screen.getByText('Step 2');
    expect(step2).toHaveAttribute('disabled');
  });
});

describe('useStepper hook', () => {
  it('provides navigation methods', () => {
    const TestComponent = () => {
      const { stepperRef, next, previous } = useStepper();
      return (
        <>
          <Stepper ref={stepperRef}>
            <Step label="Step 1">Content 1</Step>
            <Step label="Step 2">Content 2</Step>
          </Stepper>
          <button onClick={next}>Next</button>
          <button onClick={previous}>Previous</button>
        </>
      );
    };

    render(<TestComponent />);

    fireEvent.click(screen.getByText('Next'));
    // Assert step changed
  });
});
```

### Integration Tests

```typescript
describe('Stepper Integration', () => {
  it('works with form validation', async () => {
    const TestForm = () => {
      const methods = useForm();
      const [step, setStep] = useState(0);

      return (
        <FormProvider {...methods}>
          <Stepper selected={step} onSelectedChanged={(e) => setStep(e.detail.value)}>
            <Step label="Step 1">
              <TextField {...methods.register('name', { required: true })} />
            </Step>
            <Step label="Step 2">
              <TextField {...methods.register('email')} />
            </Step>
          </Stepper>
        </FormProvider>
      );
    };

    render(<TestForm />);
    // Test form validation integration
  });
});
```

## Documentation for Vaadin React Docs

### Installation

```bash
npm install @vaadin/react-components
```

### Basic Usage

```tsx
import { Stepper, Step } from '@vaadin/react-components/Stepper';
```

### API Reference

Complete TypeScript API documentation:
- Component props
- Event handlers
- Ref types
- Custom hooks

### Examples

1. **Controlled Stepper** - Managing state with useState
2. **Form Wizard** - Integration with React Hook Form
3. **Validation** - Client-side validation between steps
4. **Custom Navigation** - Building custom navigation controls
5. **Dynamic Steps** - Adding/removing steps dynamically
6. **Accessibility** - Keyboard navigation and screen reader support

### Migration Guide

For developers migrating from other libraries:

#### From Material-UI

```tsx
// Material-UI
<Stepper activeStep={activeStep}>
  <Step>
    <StepLabel>Step 1</StepLabel>
    <StepContent>Content</StepContent>
  </Step>
</Stepper>

// Vaadin React
<Stepper selected={activeStep}>
  <Step label="Step 1">
    Content
  </Step>
</Stepper>
```

### Best Practices

1. **State Management**
   - Use controlled components for complex wizards
   - Leverage custom hooks for common patterns

2. **Performance**
   - Lazy load step content when possible
   - Memoize expensive computations

3. **TypeScript**
   - Use provided types for type safety
   - Create custom interfaces for step data

4. **Accessibility**
   - Always provide meaningful labels
   - Test with keyboard navigation
   - Verify screen reader announcements

## Build Configuration

### Package.json Updates

```json
{
  "name": "@vaadin/react-components",
  "exports": {
    "./Stepper": {
      "types": "./Stepper.d.ts",
      "default": "./Stepper.js"
    }
  }
}
```

### TypeScript Configuration

Ensure proper type generation for:
- Component props
- Event types
- Element interfaces
- Custom hooks

## Release Strategy

### Phase 1: Beta Release
- Core Stepper and Step components
- Basic TypeScript types
- Essential documentation

### Phase 2: Stable Release
- Complete API coverage
- Custom hooks (useStepper, useStepperState)
- Comprehensive examples
- Full test coverage

### Phase 3: Enhanced Features
- HOCs for common patterns
- Additional utility hooks
- Advanced examples (form integration, etc.)

## Dependencies

- `@lit/react` - For web component wrapping
- `react` (peer dependency) - ^18.0.0
- `react-dom` (peer dependency) - ^18.0.0
- `@vaadin/stepper` (peer dependency) - Version matching web component

## Browser Support

Same as web component:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

1. **Server-Side Rendering**
   - Web components don't support SSR
   - Require client-side hydration

2. **React 19 Compatibility**
   - Test and ensure compatibility with React 19
   - Update if needed

## References

- [Lit React Integration](https://lit.dev/docs/frameworks/react/)
- [Vaadin React Components Repository](https://github.com/vaadin/react-components)
- [Web Component Specification](./Stepper-web-component.md)
