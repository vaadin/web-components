# Switch React Component Integration Specification

## Overview

This document outlines the plan for integrating the `<vaadin-switch>` web component into Vaadin's React component library (`@vaadin/react-components`). The React wrapper will provide idiomatic React patterns while maintaining full compatibility with the underlying web component.

## Repository Context

**Target Repository**: `https://github.com/vaadin/react-components`

The React components repository provides React wrappers for all Vaadin web components, enabling seamless integration in React applications with proper TypeScript support, React event handling, and React-specific patterns.

## Goals

1. **React Idiomatic**: Provide a React-friendly API that feels natural to React developers
2. **Type Safety**: Full TypeScript support with proper type definitions
3. **Event Handling**: Convert web component events to React synthetic events
4. **Ref Support**: Support React refs for direct component access
5. **Controlled/Uncontrolled**: Support both controlled and uncontrolled patterns
6. **Developer Experience**: Excellent IntelliSense and documentation

## Usage Examples

### Basic Usage

```tsx
import { Switch } from '@vaadin/react-components/Switch';

function App() {
  return (
    <Switch>Enable notifications</Switch>
  );
}
```

### Controlled Component

```tsx
import { Switch } from '@vaadin/react-components/Switch';
import { useState } from 'react';

function SettingsPanel() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Switch
      checked={darkMode}
      onCheckedChanged={(e) => setDarkMode(e.detail.value)}
    >
      Dark mode
    </Switch>
  );
}
```

### Uncontrolled Component with Ref

```tsx
import { Switch } from '@vaadin/react-components/Switch';
import { useRef } from 'react';
import type { SwitchElement } from '@vaadin/switch';

function FormComponent() {
  const switchRef = useRef<SwitchElement>(null);

  const handleSubmit = () => {
    console.log('Switch value:', switchRef.current?.checked);
  };

  return (
    <>
      <Switch ref={switchRef} defaultChecked>
        Subscribe to newsletter
      </Switch>
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
```

### Form Integration

```tsx
import { Switch } from '@vaadin/react-components/Switch';

function RegistrationForm() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    console.log('Terms accepted:', formData.get('terms'));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Switch name="terms" value="accepted" required>
        I agree to the terms and conditions
      </Switch>
      <button type="submit">Register</button>
    </form>
  );
}
```

### With Helper Text and Validation

```tsx
import { Switch } from '@vaadin/react-components/Switch';
import { useState } from 'react';

function SecuritySettings() {
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: SwitchCheckedChangedEvent) => {
    const checked = e.detail.value;
    setEnabled(checked);

    if (!checked) {
      setError('Two-factor authentication is recommended for security');
    } else {
      setError('');
    }
  };

  return (
    <Switch
      checked={enabled}
      onCheckedChanged={handleChange}
      invalid={!!error}
      helperText={error || 'You can change this later in settings'}
    >
      Enable two-factor authentication
    </Switch>
  );
}
```

### Event Handling

```tsx
import { Switch } from '@vaadin/react-components/Switch';

function NotificationSettings() {
  const handleChange = (e: SwitchCheckedChangedEvent) => {
    console.log('New state:', e.detail.value);
    // Make API call to save preference
    savePreference('notifications', e.detail.value);
  };

  const handleInvalid = (e: Event) => {
    console.log('Validation failed');
  };

  return (
    <Switch
      required
      onCheckedChanged={handleChange}
      onInvalid={handleInvalid}
    >
      Enable push notifications
    </Switch>
  );
}
```

### Size Variants (Phase 2)

```tsx
import { Switch } from '@vaadin/react-components/Switch';

function SizeDemo() {
  return (
    <>
      <Switch size="small">Small switch</Switch>
      <Switch size="medium">Medium switch</Switch>
      <Switch size="large">Large switch</Switch>
    </>
  );
}
```

### Read-Only State (Phase 2)

```tsx
import { Switch } from '@vaadin/react-components/Switch';

function AdminSettings() {
  return (
    <Switch readonly checked>
      Premium features (enabled by administrator)
    </Switch>
  );
}
```

### Custom Styling

```tsx
import { Switch } from '@vaadin/react-components/Switch';

function ThemedSwitch() {
  return (
    <Switch
      style={{
        '--vaadin-switch-track-color-checked': '#4CAF50',
        '--vaadin-switch-width': '60px',
        '--vaadin-switch-height': '30px',
      } as React.CSSProperties}
    >
      Custom styled switch
    </Switch>
  );
}
```

### Hooks Integration

```tsx
import { Switch } from '@vaadin/react-components/Switch';
import { useSwitch } from './hooks/useSwitch';

function FeatureToggle({ feature }: { feature: string }) {
  const { enabled, toggle, loading } = useSwitch(feature);

  return (
    <Switch
      checked={enabled}
      onCheckedChanged={toggle}
      disabled={loading}
    >
      {feature}
    </Switch>
  );
}
```

## Component API

### Phase 1: Core Features

#### Props Interface

```typescript
import type { SwitchElement } from '@vaadin/switch';
import type { ReactElement, Ref } from 'react';

export interface SwitchProps {
  // Properties
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  invalid?: boolean;
  label?: string;

  // Event handlers (React-ified)
  onChange?: (event: Event) => void;
  onCheckedChanged?: (event: SwitchCheckedChangedEvent) => void;
  onInvalid?: (event: Event) => void;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;

  // Standard HTML attributes
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  tabIndex?: number;

  // ARIA attributes
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;

  // Children
  children?: React.ReactNode;

  // Ref
  ref?: Ref<SwitchElement>;
}

export interface SwitchCheckedChangedEvent extends CustomEvent {
  detail: {
    value: boolean;
  };
}
```

#### Component Implementation

```typescript
import { forwardRef } from 'react';
import { createComponent } from '@lit/react';
import type { SwitchElement as SwitchElementType } from '@vaadin/switch';
import { Switch as SwitchWC } from '@vaadin/switch';

export const Switch = createComponent({
  tagName: 'vaadin-switch',
  elementClass: SwitchWC,
  react: React,
  events: {
    onCheckedChanged: 'checked-changed',
    onChange: 'change',
    onInvalid: 'invalid',
  },
});

export type SwitchElement = SwitchElementType;
```

### Phase 2: Enhanced Features

#### Extended Props

```typescript
export interface SwitchProps {
  // ... Phase 1 props

  // Phase 2 additions
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
  helperText?: string;

  // Slots (render props)
  helperTextSlot?: ReactElement;
}
```

### Phase 3: Advanced Features

#### Extended Props

```typescript
export interface SwitchProps {
  // ... Phase 1 & 2 props

  // Phase 3 additions
  checkedLabel?: string;
  uncheckedLabel?: string;

  // Slots (render props)
  checkedIconSlot?: ReactElement;
  uncheckedIconSlot?: ReactElement;
}
```

## Implementation Plan

### File Structure

```
packages/react-components/
├── src/
│   └── Switch.tsx                # Main React component wrapper
├── test/
│   └── Switch.test.tsx           # React component tests
├── generated/
│   └── Switch.ts                 # Auto-generated wrapper (if using generator)
└── package.json
```

### Core Implementation

#### 1. React Wrapper Component

The React wrapper is created using `@lit/react`'s `createComponent` utility:

```typescript
// src/Switch.tsx
import React, { forwardRef } from 'react';
import { createComponent } from '@lit/react';
import { Switch as SwitchWC } from '@vaadin/switch';
import type { SwitchElement } from '@vaadin/switch';

// Create the React component using @lit/react
export const Switch = createComponent({
  tagName: 'vaadin-switch',
  elementClass: SwitchWC,
  react: React,
  events: {
    // Map web component events to React props
    onCheckedChanged: 'checked-changed',
    onChange: 'change',
    onInvalid: 'invalid',
  },
});

// Export types for TypeScript users
export type { SwitchElement };
export type {
  SwitchCheckedChangedEvent,
  SwitchProps,
} from './Switch.types';
```

#### 2. TypeScript Type Definitions

```typescript
// src/Switch.types.ts
import type { SwitchElement } from '@vaadin/switch';
import type { ReactNode, CSSProperties } from 'react';

export interface SwitchCheckedChangedEvent extends CustomEvent {
  detail: {
    value: boolean;
  };
}

export interface SwitchProps extends React.HTMLAttributes<SwitchElement> {
  // Core properties
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  invalid?: boolean;
  label?: string;

  // Phase 2 properties
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
  helperText?: string;

  // Phase 3 properties
  checkedLabel?: string;
  uncheckedLabel?: string;

  // Event handlers
  onCheckedChanged?: (event: SwitchCheckedChangedEvent) => void;
  onChange?: (event: Event) => void;
  onInvalid?: (event: Event) => void;

  // Standard React props
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;

  // ARIA
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}
```

#### 3. Custom Hooks (Optional Utilities)

```typescript
// src/hooks/useSwitch.ts
import { useState, useCallback } from 'react';
import type { SwitchCheckedChangedEvent } from '../Switch.types';

export interface UseSwitchOptions {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function useSwitch(options: UseSwitchOptions = {}) {
  const [checked, setChecked] = useState(options.defaultChecked ?? false);

  const handleChange = useCallback((e: SwitchCheckedChangedEvent) => {
    const newValue = e.detail.value;
    setChecked(newValue);
    options.onChange?.(newValue);
  }, [options.onChange]);

  const toggle = useCallback(() => {
    setChecked(prev => {
      const newValue = !prev;
      options.onChange?.(newValue);
      return newValue;
    });
  }, [options.onChange]);

  return {
    checked,
    setChecked,
    toggle,
    handleChange,
    props: {
      checked,
      onCheckedChanged: handleChange,
    },
  };
}
```

Usage of the hook:

```tsx
function MyComponent() {
  const switch1 = useSwitch({
    defaultChecked: true,
    onChange: (checked) => console.log('Switch:', checked),
  });

  return <Switch {...switch1.props}>Enable feature</Switch>;
}
```

#### 4. Form Integration Hook

```typescript
// src/hooks/useSwitchGroup.ts
import { useState, useCallback } from 'react';

export interface UseSwitchGroupOptions {
  defaultValues?: Record<string, boolean>;
  onChange?: (values: Record<string, boolean>) => void;
}

export function useSwitchGroup(options: UseSwitchGroupOptions = {}) {
  const [values, setValues] = useState(options.defaultValues ?? {});

  const createSwitchProps = useCallback((name: string) => ({
    checked: values[name] ?? false,
    onCheckedChanged: (e: SwitchCheckedChangedEvent) => {
      const newValues = {
        ...values,
        [name]: e.detail.value,
      };
      setValues(newValues);
      options.onChange?.(newValues);
    },
  }), [values, options.onChange]);

  return {
    values,
    setValues,
    createSwitchProps,
  };
}
```

Usage:

```tsx
function SettingsPanel() {
  const switches = useSwitchGroup({
    defaultValues: {
      notifications: true,
      darkMode: false,
      autoSave: true,
    },
    onChange: (values) => saveSettings(values),
  });

  return (
    <div>
      <Switch {...switches.createSwitchProps('notifications')}>
        Notifications
      </Switch>
      <Switch {...switches.createSwitchProps('darkMode')}>
        Dark Mode
      </Switch>
      <Switch {...switches.createSwitchProps('autoSave')}>
        Auto Save
      </Switch>
    </div>
  );
}
```

### Testing Strategy

#### Unit Tests

Test React-specific behavior:

```typescript
// test/Switch.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from '../src/Switch';
import { expect, test, vi } from 'vitest';

test('renders with label', () => {
  render(<Switch>Enable feature</Switch>);
  expect(screen.getByText('Enable feature')).toBeInTheDocument();
});

test('handles checked state', () => {
  const { rerender } = render(<Switch checked={false}>Toggle</Switch>);
  const element = screen.getByText('Toggle').closest('vaadin-switch');

  expect(element?.checked).toBe(false);

  rerender(<Switch checked={true}>Toggle</Switch>);
  expect(element?.checked).toBe(true);
});

test('calls onCheckedChanged handler', () => {
  const handleChange = vi.fn();
  render(
    <Switch onCheckedChanged={handleChange}>
      Toggle
    </Switch>
  );

  const element = screen.getByText('Toggle').closest('vaadin-switch');
  element?.click();

  expect(handleChange).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: { value: true },
    })
  );
});

test('supports uncontrolled mode with defaultChecked', () => {
  render(<Switch defaultChecked>Toggle</Switch>);
  const element = screen.getByText('Toggle').closest('vaadin-switch');

  expect(element?.checked).toBe(true);
});

test('supports disabled state', () => {
  render(<Switch disabled>Toggle</Switch>);
  const element = screen.getByText('Toggle').closest('vaadin-switch');

  expect(element?.disabled).toBe(true);
});

test('forwards ref to element', () => {
  const ref = React.createRef<SwitchElement>();
  render(<Switch ref={ref}>Toggle</Switch>);

  expect(ref.current).toBeInstanceOf(HTMLElement);
  expect(ref.current?.tagName.toLowerCase()).toBe('vaadin-switch');
});

test('handles form integration', () => {
  render(
    <form>
      <Switch name="feature" value="enabled">
        Enable feature
      </Switch>
    </form>
  );

  const element = screen.getByText('Enable feature').closest('vaadin-switch');
  expect(element?.getAttribute('name')).toBe('feature');
  expect(element?.getAttribute('value')).toBe('enabled');
});
```

#### Integration Tests

Test with React forms and state management:

```typescript
// test/Switch.integration.test.tsx
test('works with React Hook Form', async () => {
  function TestForm() {
    const { register, handleSubmit } = useForm();

    const onSubmit = vi.fn();

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Switch {...register('terms')} required>
          I agree
        </Switch>
        <button type="submit">Submit</button>
      </form>
    );
  }

  render(<TestForm />);

  const submit = screen.getByText('Submit');
  fireEvent.click(submit);

  // Form should not submit when unchecked
  expect(onSubmit).not.toHaveBeenCalled();

  const switchElement = screen.getByText('I agree').closest('vaadin-switch');
  fireEvent.click(switchElement!);

  fireEvent.click(submit);

  // Now it should submit
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled();
  });
});
```

#### TypeScript Tests

Verify type safety:

```typescript
// test/Switch.types.test.tsx
import { Switch } from '../src/Switch';
import type { SwitchElement } from '@vaadin/switch';

// Should accept valid props
<Switch checked disabled name="test" />;

// Should accept children
<Switch>Label text</Switch>;

// Should accept event handlers
<Switch
  onCheckedChanged={(e) => {
    e.detail.value; // Should be boolean
  }}
/>;

// Should accept ref
const ref = React.useRef<SwitchElement>(null);
<Switch ref={ref} />;

// Should accept standard HTML attributes
<Switch id="switch1" className="custom" style={{ margin: 10 }} />;

// Should accept ARIA attributes
<Switch aria-label="Toggle feature" aria-describedby="help-text" />;

// @ts-expect-error - Should reject invalid props
<Switch invalidProp="value" />;

// @ts-expect-error - Should reject invalid event handler
<Switch onCheckedChanged={(e: string) => {}} />;
```

### Build Configuration

#### Package.json

```json
{
  "name": "@vaadin/react-components",
  "version": "25.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    "./Switch": {
      "types": "./dist/Switch.d.ts",
      "import": "./dist/Switch.js"
    }
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "dependencies": {
    "@lit/react": "^1.0.0",
    "@vaadin/switch": "^25.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^15.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "vitest": "^2.0.0"
  }
}
```

## Documentation Plan

### 1. Component Documentation

**Location**: `packages/react-components/docs/Switch.md`

**Content**:
- Overview of the React Switch component
- Installation instructions
- Basic usage examples
- API reference (props, events, methods)
- TypeScript usage
- Form integration examples
- Styling guide

### 2. Storybook Stories

Create comprehensive Storybook stories:

```typescript
// Switch.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '../src/Switch';
import { useState } from 'react';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    children: 'Enable notifications',
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    children: 'Dark mode',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled switch',
  },
};

export const Required: Story = {
  args: {
    required: true,
    children: 'I agree to terms',
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div>
        <Switch
          checked={checked}
          onCheckedChanged={(e) => setChecked(e.detail.value)}
        >
          Controlled switch
        </Switch>
        <p>State: {checked ? 'ON' : 'OFF'}</p>
        <button onClick={() => setChecked(!checked)}>
          Toggle from outside
        </button>
      </div>
    );
  },
};

export const FormIntegration: Story = {
  render: () => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      alert(`Notifications: ${formData.get('notifications')}`);
    };

    return (
      <form onSubmit={handleSubmit}>
        <Switch name="notifications" value="yes">
          Enable notifications
        </Switch>
        <button type="submit">Submit</button>
      </form>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Switch size="small">Small</Switch>
      <Switch size="medium">Medium</Switch>
      <Switch size="large">Large</Switch>
    </div>
  ),
};

export const WithHelperText: Story = {
  args: {
    helperText: 'You can change this later in settings',
    children: 'Enable two-factor authentication',
  },
};
```

### 3. README Section

Add to main README:

```markdown
## Switch

A toggle control for binary on/off settings.

### Installation

```bash
npm install @vaadin/react-components
```

### Usage

```tsx
import { Switch } from '@vaadin/react-components/Switch';

function App() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      checked={enabled}
      onCheckedChanged={(e) => setEnabled(e.detail.value)}
    >
      Enable feature
    </Switch>
  );
}
```

### Documentation

- [Component API](./docs/Switch.md)
- [Storybook Examples](https://storybook.vaadin.com/?path=/docs/components-switch)
```

### 4. Migration Guide

For users migrating from custom implementations:

```markdown
# Migrating to React Switch Component

## From Custom Web Component Usage

**Before:**
```tsx
function App() {
  const ref = useRef<HTMLElement>();

  useEffect(() => {
    const element = ref.current;
    const handler = (e: any) => {
      console.log(e.detail.value);
    };
    element?.addEventListener('checked-changed', handler);
    return () => element?.removeEventListener('checked-changed', handler);
  }, []);

  return <vaadin-switch ref={ref}>Label</vaadin-switch>;
}
```

**After:**
```tsx
function App() {
  return (
    <Switch onCheckedChanged={(e) => console.log(e.detail.value)}>
      Label
    </Switch>
  );
}
```

## From Checkbox

**Before:**
```tsx
<input
  type="checkbox"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>
```

**After:**
```tsx
<Switch
  checked={enabled}
  onCheckedChanged={(e) => setEnabled(e.detail.value)}
>
  Enable feature
</Switch>
```
```

## React-Specific Features

### 1. Controlled vs Uncontrolled

Support both patterns:

**Controlled:**
```tsx
const [checked, setChecked] = useState(false);

<Switch
  checked={checked}
  onCheckedChanged={(e) => setChecked(e.detail.value)}
>
  Toggle
</Switch>
```

**Uncontrolled:**
```tsx
const ref = useRef<SwitchElement>(null);

<Switch ref={ref} defaultChecked>
  Toggle
</Switch>

// Access value via ref
console.log(ref.current?.checked);
```

### 2. Form Libraries Integration

#### React Hook Form

```tsx
import { useForm, Controller } from 'react-hook-form';

function MyForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <Controller
        name="terms"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Switch
            checked={field.value}
            onCheckedChanged={(e) => field.onChange(e.detail.value)}
          >
            I agree to terms
          </Switch>
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### Formik

```tsx
import { Formik, Field } from 'formik';

function MyForm() {
  return (
    <Formik
      initialValues={{ notifications: false }}
      onSubmit={values => console.log(values)}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <Switch
            checked={values.notifications}
            onCheckedChanged={(e) =>
              setFieldValue('notifications', e.detail.value)
            }
          >
            Enable notifications
          </Switch>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}
```

### 3. State Management Integration

#### Redux

```tsx
import { useDispatch, useSelector } from 'react-redux';
import { toggleFeature } from './features/settingsSlice';

function FeatureToggle() {
  const dispatch = useDispatch();
  const enabled = useSelector((state) => state.settings.featureEnabled);

  return (
    <Switch
      checked={enabled}
      onCheckedChanged={() => dispatch(toggleFeature())}
    >
      Enable feature
    </Switch>
  );
}
```

#### Zustand

```tsx
import { create } from 'zustand';

const useStore = create((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));

function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <Switch checked={darkMode} onCheckedChanged={toggleDarkMode}>
      Dark mode
    </Switch>
  );
}
```

## Performance Optimization

### Memoization

```tsx
import { memo, useCallback } from 'react';

const MemoizedSwitch = memo(Switch);

function OptimizedList({ items }) {
  const handleChange = useCallback((id: string) => (e: SwitchCheckedChangedEvent) => {
    updateItem(id, e.detail.value);
  }, []);

  return items.map((item) => (
    <MemoizedSwitch
      key={item.id}
      checked={item.enabled}
      onCheckedChanged={handleChange(item.id)}
    >
      {item.label}
    </MemoizedSwitch>
  ));
}
```

## Accessibility in React

### ARIA Labels

```tsx
// With visible label
<Switch aria-label="Enable notifications">
  Enable notifications
</Switch>

// Without visible label (icon button scenario)
<Switch aria-label="Toggle dark mode" />

// With description
<>
  <Switch aria-describedby="help-text">
    Enable 2FA
  </Switch>
  <span id="help-text">
    Two-factor authentication adds an extra layer of security
  </span>
</>
```

### Focus Management

```tsx
import { useRef, useEffect } from 'react';

function AutoFocusSwitch() {
  const ref = useRef<SwitchElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return <Switch ref={ref}>Auto-focused switch</Switch>;
}
```

## Best Practices

### 1. Use Controlled Components for Complex State

```tsx
// ✅ Good - State can be synchronized with other logic
function SettingsPanel() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Apply theme when state changes
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <Switch
      checked={darkMode}
      onCheckedChanged={(e) => setDarkMode(e.detail.value)}
    >
      Dark mode
    </Switch>
  );
}
```

### 2. Use Uncontrolled Components for Simple Forms

```tsx
// ✅ Good - Simple form with minimal state management
function NewsletterForm() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    subscribe(formData.get('newsletter') === 'yes');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Switch name="newsletter" value="yes">
        Subscribe to newsletter
      </Switch>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### 3. Provide Meaningful Labels

```tsx
// ✅ Good - Clear action-oriented label
<Switch>Enable dark mode</Switch>

// ❌ Bad - Ambiguous label
<Switch>Dark mode</Switch>
```

### 4. Handle Async Operations

```tsx
function ApiToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: SwitchCheckedChangedEvent) => {
    const newValue = e.detail.value;
    setLoading(true);

    try {
      await updateSetting(newValue);
      setEnabled(newValue);
    } catch (error) {
      // Revert on error
      console.error('Failed to update setting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={enabled}
      disabled={loading}
      onCheckedChanged={handleChange}
    >
      Enable feature
    </Switch>
  );
}
```

## Release Strategy

### Phase 1: Core Integration

**Timeline**: Aligned with web component v1.0.0

**Deliverables**:
- React wrapper component
- TypeScript definitions
- Basic hooks (useSwitch)
- Unit tests
- Storybook stories
- Documentation

### Phase 2: Enhanced Features

**Timeline**: Aligned with web component v1.1.0

**Deliverables**:
- Size prop support
- Helper text support
- Read-only state
- Enhanced hooks (useSwitchGroup)
- Form library integration examples
- Additional Storybook stories

### Phase 3: Advanced Features

**Timeline**: Aligned with web component v1.2.0

**Deliverables**:
- Inner label support
- Icon slot support
- Advanced styling examples
- Performance optimization guides

## Dependencies

### Runtime
- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0
- `@lit/react` ^1.0.0
- `@vaadin/switch` ^25.0.0

### Development
- `@testing-library/react` ^15.0.0
- `@testing-library/user-event` ^14.0.0
- `@types/react` ^18.0.0
- `@storybook/react` ^8.0.0
- `vitest` ^2.0.0
- `typescript` ^5.0.0

## Success Criteria

The React integration will be considered successful when:

1. ✅ All web component features are accessible from React
2. ✅ TypeScript provides full type safety and IntelliSense
3. ✅ Component works with popular form libraries (React Hook Form, Formik)
4. ✅ Component integrates with state management (Redux, Zustand, Context)
5. ✅ Documentation is comprehensive and includes examples
6. ✅ Test coverage is > 90%
7. ✅ Performance is comparable to native React components
8. ✅ Developer feedback is positive

## Conclusion

This specification provides a comprehensive plan for integrating the Switch web component into the React ecosystem. The integration will provide a React-idiomatic API while maintaining full compatibility with the underlying web component, ensuring an excellent developer experience for React users.
