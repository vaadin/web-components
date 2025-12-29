# MonthPicker React Component Specification

## Executive Summary

The React MonthPicker component provides a React-friendly wrapper around the `vaadin-month-picker` web component, offering idiomatic React patterns including controlled/uncontrolled modes, React event handlers, TypeScript support, and integration with React's form libraries. The component maintains the core functionality of the web component while providing an enhanced developer experience for React applications.

## Component Overview

### Package Information

**Package**: `@vaadin/react-components`
**Component Name**: `MonthPicker`
**Import Path**: `import { MonthPicker } from '@vaadin/react-components/MonthPicker.js';`
**TypeScript Definitions**: Included in package
**Dependencies**:
- `react` ^18.0.0 || ^19.0.0
- `@vaadin/month-picker` (web component)
- `@vaadin/react-components-pro` (base React integration)

### Browser Support

Same as web component:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)

## Usage Examples

### Basic Usage

```tsx
import { MonthPicker } from '@vaadin/react-components/MonthPicker.js';

function App() {
  return (
    <MonthPicker label="Select Month" />
  );
}
```

### Controlled Component

```tsx
import { useState } from 'react';
import { MonthPicker } from '@vaadin/react-components/MonthPicker.js';

function MonthSelector() {
  const [selectedMonth, setSelectedMonth] = useState('2025-03');

  return (
    <MonthPicker
      label="Report Month"
      value={selectedMonth}
      onValueChanged={(e) => setSelectedMonth(e.detail.value)}
    />
  );
}
```

### Uncontrolled Component with Ref

```tsx
import { useRef } from 'react';
import { MonthPicker } from '@vaadin/react-components/MonthPicker.js';
import type { MonthPickerElement } from '@vaadin/month-picker';

function FormExample() {
  const monthRef = useRef<MonthPickerElement>(null);

  const handleSubmit = () => {
    const selectedMonth = monthRef.current?.value;
    console.log('Selected:', selectedMonth);
  };

  return (
    <>
      <MonthPicker
        ref={monthRef}
        label="Billing Month"
        defaultValue="2025-01"
      />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
```

### With Validation

```tsx
import { MonthPicker } from '@vaadin/react-components/MonthPicker.js';

function ValidatedMonth() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const month = e.detail.value;
    setValue(month);

    if (!month) {
      setError('Month is required');
    } else {
      setError('');
    }
  };

  return (
    <MonthPicker
      label="Start Month"
      value={value}
      onValueChanged={handleChange}
      required
      invalid={!!error}
      errorMessage={error}
      min="2025-01"
      max="2025-12"
    />
  );
}
```

### With Internationalization

```tsx
import { MonthPicker } from '@vaadin/react-components/MonthPicker.js';
import type { MonthPickerI18n } from '@vaadin/month-picker';

const germanI18n: MonthPickerI18n = {
  monthNames: [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ],
  clear: 'Löschen',
  cancel: 'Abbrechen',
  formatTitle: (month, year) => `${germanI18n.monthNames[month - 1]} ${year}`
};

function GermanMonthPicker() {
  return (
    <MonthPicker
      label="Monat auswählen"
      i18n={germanI18n}
    />
  );
}
```

### With React Hook Form

```tsx
import { useForm, Controller } from 'react-hook-form';
import { MonthPicker } from '@vaadin/react-components/MonthPicker.js';

interface FormData {
  reportMonth: string;
}

function FormWithHookForm() {
  const { control, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log('Submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="reportMonth"
        control={control}
        rules={{ required: 'Month is required' }}
        render={({ field, fieldState }) => (
          <MonthPicker
            label="Report Month"
            value={field.value}
            onValueChanged={(e) => field.onChange(e.detail.value)}
            onBlur={field.onBlur}
            invalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### With Custom Event Handlers

```tsx
import { MonthPicker } from '@vaadin/react-components/MonthPicker.js';
import type { MonthPickerChangeEvent, MonthPickerValueChangedEvent } from '@vaadin/month-picker';

function EventExample() {
  const handleChange = (e: MonthPickerChangeEvent) => {
    console.log('Change event (user interaction):', e.target.value);
  };

  const handleValueChanged = (e: MonthPickerValueChangedEvent) => {
    console.log('Value changed (any update):', e.detail.value);
  };

  const handleOpenedChanged = (e: CustomEvent<{ value: boolean }>) => {
    console.log('Overlay opened:', e.detail.value);
  };

  return (
    <MonthPicker
      label="Event Demo"
      onChange={handleChange}
      onValueChanged={handleValueChanged}
      onOpenedChanged={handleOpenedChanged}
    />
  );
}
```

### Programmatic Control

```tsx
import { useRef } from 'react';
import { MonthPicker } from '@vaadin/react-components/MonthPicker.js';
import type { MonthPickerElement } from '@vaadin/month-picker';

function ProgrammaticControl() {
  const pickerRef = useRef<MonthPickerElement>(null);

  const openPicker = () => {
    pickerRef.current?.open();
  };

  const closePicker = () => {
    pickerRef.current?.close();
  };

  const validatePicker = () => {
    const isValid = pickerRef.current?.validate();
    console.log('Is valid:', isValid);
  };

  return (
    <>
      <MonthPicker ref={pickerRef} label="Controlled Picker" />
      <button onClick={openPicker}>Open</button>
      <button onClick={closePicker}>Close</button>
      <button onClick={validatePicker}>Validate</button>
    </>
  );
}
```

## Component API

### Props

All web component properties are available as React props with camelCase naming.

#### Value Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `undefined` | Controlled value in "YYYY-MM" format |
| `defaultValue` | `string` | `""` | Initial value for uncontrolled mode |
| `initialPosition` | `string` | Current month | Initial month/year shown in overlay |
| `name` | `string` | `undefined` | Form field name |

#### Validation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `required` | `boolean` | `false` | Whether value is required |
| `invalid` | `boolean` | `false` | Whether field is invalid |
| `errorMessage` | `string` | `""` | Error message to display |
| `min` | `string` | `undefined` | Minimum selectable month |
| `max` | `string` | `undefined` | Maximum selectable month |

#### UI Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Label text |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `helperText` | `string` | `undefined` | Helper text |
| `disabled` | `boolean` | `false` | Whether component is disabled |
| `readonly` | `boolean` | `false` | Whether component is readonly |
| `autoOpenDisabled` | `boolean` | `false` | Disable auto-open on focus |
| `clearButtonVisible` | `boolean` | `false` | Show clear button |
| `opened` | `boolean` | `undefined` | Control overlay open state |

#### i18n Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `i18n` | `MonthPickerI18n` | Default (English) | Localization object |

#### Style Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | CSS class name(s) |
| `style` | `CSSProperties` | `undefined` | Inline styles |
| `theme` | `string` | `undefined` | Theme variant(s) |

### Event Handlers

Event handlers follow React naming convention with `on` prefix.

| Prop | Event Type | Description |
|------|------------|-------------|
| `onChange` | `MonthPickerChangeEvent` | User interaction changes value |
| `onValueChanged` | `MonthPickerValueChangedEvent` | Value property changes |
| `onOpenedChanged` | `CustomEvent<{value: boolean}>` | Overlay opens/closes |
| `onInvalidChanged` | `CustomEvent<{value: boolean}>` | Validation state changes |
| `onValidated` | `CustomEvent<{valid: boolean}>` | After validation |
| `onFocus` | `FocusEvent` | Component gains focus |
| `onBlur` | `FocusEvent` | Component loses focus |

### Ref Methods

When using `ref`, these methods are available:

| Method | Signature | Description |
|--------|-----------|-------------|
| `open()` | `() => void` | Opens overlay |
| `close()` | `() => void` | Closes overlay |
| `validate()` | `() => boolean` | Validates and returns result |
| `checkValidity()` | `() => boolean` | Checks validity without side effects |
| `focus()` | `() => void` | Focuses the input |
| `blur()` | `() => void` | Removes focus |

### TypeScript Types

```typescript
// Main component props
export interface MonthPickerProps {
  // Value
  value?: string;
  defaultValue?: string;
  initialPosition?: string;
  name?: string;

  // Validation
  required?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  min?: string;
  max?: string;

  // UI
  label?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  readonly?: boolean;
  autoOpenDisabled?: boolean;
  clearButtonVisible?: boolean;
  opened?: boolean;

  // i18n
  i18n?: MonthPickerI18n;

  // Events
  onChange?: (event: MonthPickerChangeEvent) => void;
  onValueChanged?: (event: MonthPickerValueChangedEvent) => void;
  onOpenedChanged?: (event: CustomEvent<{ value: boolean }>) => void;
  onInvalidChanged?: (event: CustomEvent<{ value: boolean }>) => void;
  onValidated?: (event: CustomEvent<{ valid: boolean }>) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;

  // React
  className?: string;
  style?: React.CSSProperties;
  theme?: string;
  ref?: React.Ref<MonthPickerElement>;
}

// i18n interface
export interface MonthPickerI18n {
  monthNames: string[];
  clear: string;
  cancel: string;
  formatTitle: (month: number, year: number) => string;
  formatDisplay?: (month: number, year: number) => string;
  parseInput?: (text: string) => { month: number; year: number } | null;
}

// Event types
export interface MonthPickerChangeEvent extends Event {
  target: MonthPickerElement;
}

export interface MonthPickerValueChangedEvent extends CustomEvent {
  detail: { value: string };
  target: MonthPickerElement;
}

// Element type
export interface MonthPickerElement extends HTMLElement {
  value: string;
  opened: boolean;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  invalid: boolean;
  min: string;
  max: string;
  i18n: MonthPickerI18n;

  open(): void;
  close(): void;
  validate(): boolean;
  checkValidity(): boolean;
  focus(): void;
  blur(): void;
}
```

## React Integration Patterns

### Controlled vs Uncontrolled

#### Controlled (Recommended for Most Cases)

```tsx
const [value, setValue] = useState('2025-03');

<MonthPicker
  value={value}
  onValueChanged={(e) => setValue(e.detail.value)}
/>
```

**Advantages**:
- Full control over state
- Easy to implement validation
- Works well with form libraries
- Predictable behavior

**Disadvantages**:
- More boilerplate
- Must handle all state updates

#### Uncontrolled (Simpler for Basic Forms)

```tsx
const monthRef = useRef<MonthPickerElement>(null);

<MonthPicker
  ref={monthRef}
  defaultValue="2025-03"
/>
```

**Advantages**:
- Less code
- Closer to native form behavior
- Good for simple forms

**Disadvantages**:
- Less control
- Harder to implement complex validation
- Accessing value requires ref

### State Management

#### Local Component State

```tsx
function LocalStateExample() {
  const [month, setMonth] = useState('');

  return (
    <MonthPicker
      value={month}
      onValueChanged={(e) => setMonth(e.detail.value)}
    />
  );
}
```

#### React Context

```tsx
const MonthContext = createContext<{
  month: string;
  setMonth: (month: string) => void;
}>({ month: '', setMonth: () => {} });

function ContextProvider({ children }) {
  const [month, setMonth] = useState('');

  return (
    <MonthContext.Provider value={{ month, setMonth }}>
      {children}
    </MonthContext.Provider>
  );
}

function ContextConsumer() {
  const { month, setMonth } = useContext(MonthContext);

  return (
    <MonthPicker
      value={month}
      onValueChanged={(e) => setMonth(e.detail.value)}
    />
  );
}
```

#### Redux/Zustand

```tsx
// Redux
import { useDispatch, useSelector } from 'react-redux';

function ReduxExample() {
  const dispatch = useDispatch();
  const month = useSelector(state => state.filters.month);

  return (
    <MonthPicker
      value={month}
      onValueChanged={(e) => dispatch(setMonth(e.detail.value))}
    />
  );
}

// Zustand
import { create } from 'zustand';

const useStore = create((set) => ({
  month: '',
  setMonth: (month) => set({ month })
}));

function ZustandExample() {
  const { month, setMonth } = useStore();

  return (
    <MonthPicker
      value={month}
      onValueChanged={(e) => setMonth(e.detail.value)}
    />
  );
}
```

### Form Integration

#### Native Form

```tsx
function NativeFormExample() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const month = formData.get('reportMonth');
    console.log('Selected month:', month);
  };

  return (
    <form onSubmit={handleSubmit}>
      <MonthPicker
        name="reportMonth"
        label="Report Month"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### React Hook Form

```tsx
import { useForm, Controller } from 'react-hook-form';

function HookFormExample() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      startMonth: '2025-01'
    }
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="startMonth"
        control={control}
        rules={{
          required: 'Start month is required',
          validate: (value) => {
            const month = parseInt(value.split('-')[1]);
            return month >= 1 || 'Must be in 2025';
          }
        }}
        render={({ field, fieldState }) => (
          <MonthPicker
            label="Start Month"
            value={field.value}
            onValueChanged={(e) => field.onChange(e.detail.value)}
            onBlur={field.onBlur}
            invalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
    </form>
  );
}
```

#### Formik

```tsx
import { Formik, Form, Field } from 'formik';

function FormikExample() {
  return (
    <Formik
      initialValues={{ month: '' }}
      onSubmit={(values) => console.log(values)}
      validate={(values) => {
        const errors: any = {};
        if (!values.month) {
          errors.month = 'Required';
        }
        return errors;
      }}
    >
      {({ values, errors, touched, setFieldValue, setFieldTouched }) => (
        <Form>
          <MonthPicker
            label="Month"
            value={values.month}
            onValueChanged={(e) => setFieldValue('month', e.detail.value)}
            onBlur={() => setFieldTouched('month')}
            invalid={touched.month && !!errors.month}
            errorMessage={errors.month}
          />
        </Form>
      )}
    </Formik>
  );
}
```

### Custom Hooks

#### useMonthPicker Hook

```tsx
import { useState, useCallback } from 'react';

interface UseMonthPickerOptions {
  initialValue?: string;
  min?: string;
  max?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

function useMonthPicker(options: UseMonthPickerOptions = {}) {
  const [value, setValue] = useState(options.initialValue || '');
  const [error, setError] = useState('');

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);

    // Validation
    if (options.required && !newValue) {
      setError('Month is required');
    } else if (options.min && newValue < options.min) {
      setError(`Month must be after ${options.min}`);
    } else if (options.max && newValue > options.max) {
      setError(`Month must be before ${options.max}`);
    } else {
      setError('');
    }

    options.onChange?.(newValue);
  }, [options]);

  const reset = useCallback(() => {
    setValue(options.initialValue || '');
    setError('');
  }, [options.initialValue]);

  return {
    value,
    setValue: handleChange,
    error,
    isValid: !error && (!options.required || !!value),
    reset,
    pickerProps: {
      value,
      onValueChanged: (e: MonthPickerValueChangedEvent) => handleChange(e.detail.value),
      invalid: !!error,
      errorMessage: error,
      required: options.required,
      min: options.min,
      max: options.max
    }
  };
}

// Usage
function Example() {
  const monthPicker = useMonthPicker({
    initialValue: '2025-01',
    min: '2025-01',
    max: '2025-12',
    required: true
  });

  return (
    <>
      <MonthPicker
        label="Report Month"
        {...monthPicker.pickerProps}
      />
      <button onClick={monthPicker.reset}>Reset</button>
      <div>Valid: {monthPicker.isValid ? 'Yes' : 'No'}</div>
    </>
  );
}
```

## Implementation Plan

### Phase 1: Core React Wrapper

**Goal**: Basic React component with TypeScript support

**Tasks**:
1. Create React wrapper using `@vaadin/react-components-pro` patterns
2. Set up TypeScript definitions
3. Implement prop forwarding
4. Implement event handler conversion (web component → React)
5. Support className and style props
6. Add ref forwarding
7. Create basic unit tests

**Deliverables**:
- `MonthPicker.tsx` - Main component
- `MonthPicker.d.ts` - TypeScript definitions
- `MonthPicker.test.tsx` - Unit tests
- Basic documentation

### Phase 2: Controlled/Uncontrolled Modes

**Goal**: Support both React patterns

**Tasks**:
1. Implement controlled mode (value + onValueChanged)
2. Implement uncontrolled mode (defaultValue + ref)
3. Add value synchronization logic
4. Handle edge cases (switching modes)
5. Add tests for both modes

**Deliverables**:
- Enhanced component with mode support
- Tests for controlled/uncontrolled behavior
- Documentation examples

### Phase 3: Form Integration

**Goal**: Work seamlessly with React form libraries

**Tasks**:
1. Ensure compatibility with React Hook Form
2. Ensure compatibility with Formik
3. Support native form submission
4. Add form validation examples
5. Create integration tests

**Deliverables**:
- Form integration documentation
- Example code for popular form libraries
- Integration tests

### Phase 4: Custom Hooks & Utilities

**Goal**: Provide React-friendly abstractions

**Tasks**:
1. Create `useMonthPicker` hook
2. Create validation helpers
3. Create i18n helpers for common locales
4. Add convenience utilities
5. Document best practices

**Deliverables**:
- `useMonthPicker.ts` hook
- Utility functions
- Hook documentation
- Usage examples

### Phase 5: Testing & Documentation

**Goal**: Production-ready quality

**Tasks**:
1. Complete unit test coverage
2. Add integration tests
3. Test with React 18 and 19
4. Write comprehensive documentation
5. Create Storybook stories
6. Add code examples

**Deliverables**:
- >90% test coverage
- Full API documentation
- Storybook integration
- Migration guide (from web component)

## Documentation (vaadin.com/docs)

### React-Specific Page

**Title**: MonthPicker - React

**Sections**:

1. **Installation**
   ```bash
   npm install @vaadin/react-components
   ```

2. **Quick Start**
   - Basic usage example
   - Import statement
   - Simple form example

3. **Controlled Component**
   - State management with useState
   - Value synchronization
   - Change handler

4. **Uncontrolled Component**
   - Using refs
   - Default values
   - Accessing value

5. **Form Integration**
   - React Hook Form example
   - Formik example
   - Native form example

6. **Validation**
   - Built-in validation props
   - Custom validation
   - Async validation

7. **TypeScript**
   - Type definitions
   - Event types
   - Custom types

8. **Custom Hooks**
   - useMonthPicker hook
   - Custom validation hooks
   - State management hooks

9. **Best Practices**
   - When to use controlled vs uncontrolled
   - Performance optimization
   - Accessibility in React

10. **API Reference**
    - All props
    - All event handlers
    - TypeScript interfaces

## Breaking Changes Policy

### Stable API (v1.0+)

1. **Component Props**: All documented props
2. **Event Handlers**: Handler names and signatures
3. **TypeScript Types**: Public type definitions
4. **Ref Methods**: Methods exposed via ref

### Internal Implementation (Can Change)

1. Internal hooks
2. Private utilities
3. Implementation details of prop forwarding

### Deprecation Process

Same as web component:
1. Mark as deprecated in TypeScript definitions
2. Console warning for usage
3. Document migration path
4. Minimum 1 major version before removal

## Testing Strategy

### Unit Tests

```tsx
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MonthPicker } from '@vaadin/react-components/MonthPicker.js';

describe('MonthPicker', () => {
  it('renders with label', () => {
    const { getByText } = render(<MonthPicker label="Test Label" />);
    expect(getByText('Test Label')).toBeInTheDocument();
  });

  it('handles value changes', async () => {
    const handleChange = jest.fn();
    const { container } = render(
      <MonthPicker onValueChanged={handleChange} />
    );

    const input = container.querySelector('vaadin-month-picker');
    fireEvent(input, new CustomEvent('value-changed', {
      detail: { value: '2025-03' }
    }));

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { value: '2025-03' }
        })
      );
    });
  });

  it('supports controlled mode', () => {
    const { container, rerender } = render(
      <MonthPicker value="2025-01" />
    );

    let input = container.querySelector('vaadin-month-picker');
    expect(input?.value).toBe('2025-01');

    rerender(<MonthPicker value="2025-02" />);
    input = container.querySelector('vaadin-month-picker');
    expect(input?.value).toBe('2025-02');
  });
});
```

### Integration Tests

```tsx
import { render, screen, userEvent } from '@testing-library/react';
import { useForm, Controller } from 'react-hook-form';

it('works with React Hook Form', async () => {
  function TestForm() {
    const { control, handleSubmit } = useForm();
    const [result, setResult] = useState(null);

    return (
      <>
        <form onSubmit={handleSubmit(setResult)}>
          <Controller
            name="month"
            control={control}
            render={({ field }) => (
              <MonthPicker {...field} label="Month" />
            )}
          />
          <button type="submit">Submit</button>
        </form>
        {result && <div data-testid="result">{JSON.stringify(result)}</div>}
      </>
    );
  }

  const user = userEvent.setup();
  render(<TestForm />);

  // Interact with picker
  const picker = screen.getByRole('combobox');
  await user.click(picker);
  // ... select month ...
  await user.click(screen.getByText('Submit'));

  expect(screen.getByTestId('result')).toHaveTextContent('2025-03');
});
```

## Migration from Web Component

### Before (Web Component)

```tsx
import '@vaadin/month-picker';

function App() {
  const handleChange = (e) => {
    console.log(e.detail.value);
  };

  return (
    <vaadin-month-picker
      label="Month"
      onValueChanged={handleChange}
    />
  );
}
```

### After (React Component)

```tsx
import { MonthPicker } from '@vaadin/react-components/MonthPicker.js';

function App() {
  const handleChange = (e) => {
    console.log(e.detail.value);
  };

  return (
    <MonthPicker
      label="Month"
      onValueChanged={handleChange}
    />
  );
}
```

**Key Differences**:
1. Import from `@vaadin/react-components`
2. PascalCase component name
3. Better TypeScript support
4. Controlled/uncontrolled modes available
5. Better integration with React DevTools

## References

1. [Vaadin React Components Repository](https://github.com/vaadin/react-components)
2. [React Custom Elements Documentation](https://react.dev/reference/react-dom/components#custom-html-elements)
3. [React Hook Form](https://react-hook-form.com/)
4. [Formik](https://formik.org/)
5. [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)
6. MonthPicker Web Component Specification (companion document)
