# ToggleButtonGroup React Component Specification

## Overview

The React integration for `<vaadin-toggle-button-group>` provides type-safe wrappers, React-specific hooks, and seamless integration with React state management and forms. This follows the established Vaadin React Components pattern.

## Package Structure

```
@vaadin/react-components/
├── src/
│   ├── ToggleButtonGroup.tsx
│   ├── ToggleButton.tsx
│   └── hooks/
│       └── useToggleButtonGroup.ts
└── index.ts
```

## React Component API

### `<ToggleButtonGroup>`

```typescript
import { ToggleButtonGroup, ToggleButton } from '@vaadin/react-components';

interface ToggleButtonGroupProps {
  /** Selected value (string for single, string[] for multiple) */
  value?: string | string[];

  /** Default value for uncontrolled component */
  defaultValue?: string | string[];

  /** Enable multiple selection mode */
  multiple?: boolean;

  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical';

  /** Disable entire group */
  disabled?: boolean;

  /** Make group read-only */
  readonly?: boolean;

  /** Require at least one selection */
  required?: boolean;

  /** Callback when value changes */
  onValueChanged?: (event: ToggleButtonGroupValueChangedEvent) => void;

  /** Callback when validation state changes */
  onValidated?: (event: ToggleButtonGroupValidatedEvent) => void;

  /** Theme variants */
  theme?: string;

  /** CSS class name */
  className?: string;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Child toggle buttons */
  children?: React.ReactNode;

  /** Ref to underlying element */
  ref?: React.Ref<ToggleButtonGroupElement>;
}

interface ToggleButtonGroupValueChangedEvent extends CustomEvent {
  detail: {
    value: string | string[];
  };
}

interface ToggleButtonGroupValidatedEvent extends CustomEvent {
  detail: {
    valid: boolean;
  };
}
```

### `<ToggleButton>`

```typescript
interface ToggleButtonProps {
  /** Value identifier for this button */
  value: string;

  /** Whether button is selected (managed by group) */
  selected?: boolean;

  /** Disable this button */
  disabled?: boolean;

  /** Accessible label (overrides content) */
  ariaLabel?: string;

  /** Theme variants */
  theme?: string;

  /** CSS class name */
  className?: string;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Button content */
  children?: React.ReactNode;

  /** Ref to underlying element */
  ref?: React.Ref<ToggleButtonElement>;
}
```

## Usage Examples

### Single Selection (Controlled)

```tsx
import { useState } from 'react';
import { ToggleButtonGroup, ToggleButton } from '@vaadin/react-components';
import { Icon } from '@vaadin/react-components';

function TextAlignmentToolbar() {
  const [alignment, setAlignment] = useState<string>('left');

  return (
    <ToggleButtonGroup
      value={alignment}
      onValueChanged={(e) => setAlignment(e.detail.value as string)}
    >
      <ToggleButton value="left">
        <Icon icon="vaadin:align-left" />
      </ToggleButton>
      <ToggleButton value="center">
        <Icon icon="vaadin:align-center" />
      </ToggleButton>
      <ToggleButton value="right">
        <Icon icon="vaadin:align-right" />
      </ToggleButton>
      <ToggleButton value="justify" disabled>
        <Icon icon="vaadin:align-justify" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
```

### Multiple Selection (Controlled)

```tsx
import { useState } from 'react';
import { ToggleButtonGroup, ToggleButton } from '@vaadin/react-components';
import { Icon } from '@vaadin/react-components';

function TextFormattingToolbar() {
  const [formats, setFormats] = useState<string[]>(['bold']);

  return (
    <ToggleButtonGroup
      multiple
      value={formats}
      onValueChanged={(e) => setFormats(e.detail.value as string[])}
    >
      <ToggleButton value="bold">
        <Icon icon="vaadin:bold" />
      </ToggleButton>
      <ToggleButton value="italic">
        <Icon icon="vaadin:italic" />
      </ToggleButton>
      <ToggleButton value="underline">
        <Icon icon="vaadin:underline" />
      </ToggleButton>
      <ToggleButton value="strikethrough">
        <Icon icon="vaadin:strikethrough" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
```

### Uncontrolled with Default Value

```tsx
import { useRef } from 'react';
import { ToggleButtonGroup, ToggleButton } from '@vaadin/react-components';

function ViewSwitcher() {
  const groupRef = useRef<ToggleButtonGroupElement>(null);

  const handleSubmit = () => {
    console.log('Selected view:', groupRef.current?.value);
  };

  return (
    <form>
      <ToggleButtonGroup ref={groupRef} defaultValue="grid">
        <ToggleButton value="list">List View</ToggleButton>
        <ToggleButton value="grid">Grid View</ToggleButton>
        <ToggleButton value="chart">Chart View</ToggleButton>
      </ToggleButtonGroup>
      <button type="button" onClick={handleSubmit}>Submit</button>
    </form>
  );
}
```

### With Validation

```tsx
import { useState } from 'react';
import { ToggleButtonGroup, ToggleButton } from '@vaadin/react-components';

function FilterSelector() {
  const [filters, setFilters] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  return (
    <div>
      <ToggleButtonGroup
        multiple
        required
        value={filters}
        onValueChanged={(e) => setFilters(e.detail.value as string[])}
        onValidated={(e) => setIsValid(e.detail.valid)}
      >
        <ToggleButton value="new">New Items</ToggleButton>
        <ToggleButton value="featured">Featured</ToggleButton>
        <ToggleButton value="sale">On Sale</ToggleButton>
        <ToggleButton value="clearance">Clearance</ToggleButton>
      </ToggleButtonGroup>
      {!isValid && (
        <div className="error-message">
          Please select at least one filter
        </div>
      )}
    </div>
  );
}
```

### Vertical Orientation

```tsx
import { useState } from 'react';
import { ToggleButtonGroup, ToggleButton } from '@vaadin/react-components';

function SidebarFilters() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  return (
    <aside>
      <h3>Filters</h3>
      <ToggleButtonGroup
        orientation="vertical"
        multiple
        value={selectedFilters}
        onValueChanged={(e) => setSelectedFilters(e.detail.value as string[])}
      >
        <ToggleButton value="inStock">In Stock</ToggleButton>
        <ToggleButton value="freeShipping">Free Shipping</ToggleButton>
        <ToggleButton value="sale">On Sale</ToggleButton>
        <ToggleButton value="new">New Arrivals</ToggleButton>
      </ToggleButtonGroup>
    </aside>
  );
}
```

### With Theme Variants

```tsx
import { ToggleButtonGroup, ToggleButton } from '@vaadin/react-components';

function PrioritySelector() {
  const [priority, setPriority] = useState('medium');

  return (
    <ToggleButtonGroup
      theme="small"
      value={priority}
      onValueChanged={(e) => setPriority(e.detail.value as string)}
    >
      <ToggleButton value="low" theme="success">Low</ToggleButton>
      <ToggleButton value="medium">Medium</ToggleButton>
      <ToggleButton value="high" theme="error">High</ToggleButton>
    </ToggleButtonGroup>
  );
}
```

### Dynamic Button Generation

```tsx
import { ToggleButtonGroup, ToggleButton } from '@vaadin/react-components';

interface Category {
  id: string;
  label: string;
  disabled?: boolean;
}

function CategorySelector({ categories }: { categories: Category[] }) {
  const [selected, setSelected] = useState<string>('');

  return (
    <ToggleButtonGroup
      value={selected}
      onValueChanged={(e) => setSelected(e.detail.value as string)}
    >
      {categories.map(category => (
        <ToggleButton
          key={category.id}
          value={category.id}
          disabled={category.disabled}
        >
          {category.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
```

## Custom Hook: `useToggleButtonGroup`

For advanced use cases, a custom hook provides additional functionality:

```typescript
interface UseToggleButtonGroupOptions {
  /** Initial value */
  initialValue?: string | string[];

  /** Enable multiple selection */
  multiple?: boolean;

  /** Callback when value changes */
  onChange?: (value: string | string[]) => void;

  /** Required validation */
  required?: boolean;
}

interface UseToggleButtonGroupReturn {
  /** Current value */
  value: string | string[];

  /** Update value */
  setValue: (value: string | string[]) => void;

  /** Check if button is selected */
  isSelected: (buttonValue: string) => boolean;

  /** Toggle a button's selection */
  toggle: (buttonValue: string) => void;

  /** Clear all selections */
  clear: () => void;

  /** Validate current selection */
  validate: () => boolean;

  /** Is current selection valid */
  isValid: boolean;
}

function useToggleButtonGroup(
  options: UseToggleButtonGroupOptions = {}
): UseToggleButtonGroupReturn;
```

### Hook Usage Example

```tsx
import { useToggleButtonGroup } from '@vaadin/react-components/hooks';
import { ToggleButtonGroup, ToggleButton } from '@vaadin/react-components';

function AdvancedFilters() {
  const {
    value,
    setValue,
    isSelected,
    toggle,
    clear,
    validate,
    isValid
  } = useToggleButtonGroup({
    multiple: true,
    required: true,
    onChange: (newValue) => console.log('Filters changed:', newValue)
  });

  return (
    <div>
      <ToggleButtonGroup
        multiple
        required
        value={value}
        onValueChanged={(e) => setValue(e.detail.value as string[])}
      >
        <ToggleButton value="active">Active</ToggleButton>
        <ToggleButton value="pending">Pending</ToggleButton>
        <ToggleButton value="completed">Completed</ToggleButton>
      </ToggleButtonGroup>

      <div>
        <button onClick={() => toggle('active')}>
          Toggle Active
        </button>
        <button onClick={clear}>Clear All</button>
        <button onClick={validate}>Validate</button>
      </div>

      <div>
        Active selected: {isSelected('active') ? 'Yes' : 'No'}
      </div>
      <div>
        Valid: {isValid ? 'Yes' : 'No'}
      </div>
    </div>
  );
}
```

## TypeScript Type Definitions

### Element Types

```typescript
// Generated from web component definitions
export interface ToggleButtonGroupElement extends HTMLElement {
  value: string | string[];
  multiple: boolean;
  orientation: 'horizontal' | 'vertical';
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  validate(): boolean;
  checkValidity(): boolean;
}

export interface ToggleButtonElement extends HTMLElement {
  value: string;
  selected: boolean;
  disabled: boolean;
  ariaLabel?: string;
}
```

### Event Types

```typescript
export interface ToggleButtonGroupValueChangedEvent extends CustomEvent {
  detail: {
    value: string | string[];
  };
}

export interface ToggleButtonGroupValidatedEvent extends CustomEvent {
  detail: {
    valid: boolean;
  };
}

export interface ToggleButtonGroupCustomEventMap {
  'value-changed': ToggleButtonGroupValueChangedEvent;
  'validated': ToggleButtonGroupValidatedEvent;
}
```

## Integration with React Ecosystem

### React Hook Form Integration

```tsx
import { Controller, useForm } from 'react-hook-form';
import { ToggleButtonGroup, ToggleButton } from '@vaadin/react-components';

interface FormData {
  textAlignment: string;
  textFormats: string[];
}

function EditorForm() {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      textAlignment: 'left',
      textFormats: []
    }
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="textAlignment"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <ToggleButtonGroup
            value={field.value}
            onValueChanged={(e) => field.onChange(e.detail.value)}
          >
            <ToggleButton value="left">Left</ToggleButton>
            <ToggleButton value="center">Center</ToggleButton>
            <ToggleButton value="right">Right</ToggleButton>
          </ToggleButtonGroup>
        )}
      />

      <Controller
        name="textFormats"
        control={control}
        render={({ field }) => (
          <ToggleButtonGroup
            multiple
            value={field.value}
            onValueChanged={(e) => field.onChange(e.detail.value)}
          >
            <ToggleButton value="bold">Bold</ToggleButton>
            <ToggleButton value="italic">Italic</ToggleButton>
            <ToggleButton value="underline">Underline</ToggleButton>
          </ToggleButtonGroup>
        )}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

### State Management (Redux/Zustand)

```tsx
import { useDispatch, useSelector } from 'react-redux';
import { ToggleButtonGroup, ToggleButton } from '@vaadin/react-components';
import { setViewMode } from './store/uiSlice';

function ViewModeSelector() {
  const dispatch = useDispatch();
  const viewMode = useSelector((state: RootState) => state.ui.viewMode);

  return (
    <ToggleButtonGroup
      value={viewMode}
      onValueChanged={(e) => dispatch(setViewMode(e.detail.value))}
    >
      <ToggleButton value="list">List</ToggleButton>
      <ToggleButton value="grid">Grid</ToggleButton>
      <ToggleButton value="timeline">Timeline</ToggleButton>
    </ToggleButtonGroup>
  );
}
```

## Implementation Details

### Component Wrapper Implementation

```typescript
// ToggleButtonGroup.tsx
import {
  forwardRef,
  useEffect,
  useRef,
  type DetailedHTMLProps
} from 'react';
import { createComponent } from '@lit/react';
import { ToggleButtonGroup as ToggleButtonGroupWC } from '@vaadin/toggle-button-group';

// Create React wrapper using Lit's createComponent
export const ToggleButtonGroup = createComponent({
  tagName: 'vaadin-toggle-button-group',
  elementClass: ToggleButtonGroupWC,
  react: React,
  events: {
    onValueChanged: 'value-changed',
    onValidated: 'validated'
  }
});

// Add display name for debugging
ToggleButtonGroup.displayName = 'ToggleButtonGroup';
```

```typescript
// ToggleButton.tsx
import { createComponent } from '@lit/react';
import { ToggleButton as ToggleButtonWC } from '@vaadin/toggle-button';

export const ToggleButton = createComponent({
  tagName: 'vaadin-toggle-button',
  elementClass: ToggleButtonWC,
  react: React
});

ToggleButton.displayName = 'ToggleButton';
```

### Hook Implementation

```typescript
// hooks/useToggleButtonGroup.ts
import { useState, useCallback, useMemo } from 'react';

export function useToggleButtonGroup(
  options: UseToggleButtonGroupOptions = {}
): UseToggleButtonGroupReturn {
  const {
    initialValue = options.multiple ? [] : '',
    multiple = false,
    onChange,
    required = false
  } = options;

  const [value, setValueState] = useState<string | string[]>(initialValue);

  const setValue = useCallback((newValue: string | string[]) => {
    setValueState(newValue);
    onChange?.(newValue);
  }, [onChange]);

  const isSelected = useCallback((buttonValue: string): boolean => {
    if (multiple && Array.isArray(value)) {
      return value.includes(buttonValue);
    }
    return value === buttonValue;
  }, [value, multiple]);

  const toggle = useCallback((buttonValue: string) => {
    if (multiple && Array.isArray(value)) {
      const newValue = value.includes(buttonValue)
        ? value.filter(v => v !== buttonValue)
        : [...value, buttonValue];
      setValue(newValue);
    } else {
      setValue(value === buttonValue ? '' : buttonValue);
    }
  }, [value, multiple, setValue]);

  const clear = useCallback(() => {
    setValue(multiple ? [] : '');
  }, [multiple, setValue]);

  const validate = useCallback((): boolean => {
    if (!required) return true;

    if (multiple && Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== '';
  }, [required, multiple, value]);

  const isValid = useMemo(() => validate(), [validate]);

  return {
    value,
    setValue,
    isSelected,
    toggle,
    clear,
    validate,
    isValid
  };
}
```

## Testing Strategy

### Component Tests

```typescript
// ToggleButtonGroup.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleButtonGroup, ToggleButton } from '@vaadin/react-components';

describe('ToggleButtonGroup', () => {
  it('renders with children', () => {
    render(
      <ToggleButtonGroup>
        <ToggleButton value="opt1">Option 1</ToggleButton>
        <ToggleButton value="opt2">Option 2</ToggleButton>
      </ToggleButtonGroup>
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('handles single selection', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <ToggleButtonGroup onValueChanged={handleChange}>
        <ToggleButton value="opt1">Option 1</ToggleButton>
        <ToggleButton value="opt2">Option 2</ToggleButton>
      </ToggleButtonGroup>
    );

    await user.click(screen.getByText('Option 1'));

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { value: 'opt1' }
      })
    );
  });

  it('handles multiple selection', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <ToggleButtonGroup multiple onValueChanged={handleChange}>
        <ToggleButton value="opt1">Option 1</ToggleButton>
        <ToggleButton value="opt2">Option 2</ToggleButton>
      </ToggleButtonGroup>
    );

    await user.click(screen.getByText('Option 1'));
    await user.click(screen.getByText('Option 2'));

    expect(handleChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: { value: ['opt1', 'opt2'] }
      })
    );
  });

  it('supports controlled mode', () => {
    const { rerender } = render(
      <ToggleButtonGroup value="opt1">
        <ToggleButton value="opt1">Option 1</ToggleButton>
        <ToggleButton value="opt2">Option 2</ToggleButton>
      </ToggleButtonGroup>
    );

    // Check initial selection
    const button1 = screen.getByText('Option 1').closest('vaadin-toggle-button');
    expect(button1).toHaveAttribute('selected');

    // Update value
    rerender(
      <ToggleButtonGroup value="opt2">
        <ToggleButton value="opt1">Option 1</ToggleButton>
        <ToggleButton value="opt2">Option 2</ToggleButton>
      </ToggleButtonGroup>
    );

    const button2 = screen.getByText('Option 2').closest('vaadin-toggle-button');
    expect(button2).toHaveAttribute('selected');
  });

  it('handles disabled state', () => {
    render(
      <ToggleButtonGroup disabled>
        <ToggleButton value="opt1">Option 1</ToggleButton>
      </ToggleButtonGroup>
    );

    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('disabled');
  });

  it('validates required constraint', () => {
    const handleValidated = vi.fn();

    render(
      <ToggleButtonGroup required onValidated={handleValidated}>
        <ToggleButton value="opt1">Option 1</ToggleButton>
      </ToggleButtonGroup>
    );

    // Trigger validation by attempting selection and deselection
    // Validation logic should be tested
  });
});
```

### Hook Tests

```typescript
// useToggleButtonGroup.test.ts
import { renderHook, act } from '@testing-library/react';
import { useToggleButtonGroup } from '@vaadin/react-components/hooks';

describe('useToggleButtonGroup', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() =>
      useToggleButtonGroup({ initialValue: 'opt1' })
    );

    expect(result.current.value).toBe('opt1');
    expect(result.current.isSelected('opt1')).toBe(true);
  });

  it('toggles selection in single mode', () => {
    const { result } = renderHook(() => useToggleButtonGroup());

    act(() => {
      result.current.toggle('opt1');
    });

    expect(result.current.value).toBe('opt1');

    act(() => {
      result.current.toggle('opt1');
    });

    expect(result.current.value).toBe('');
  });

  it('toggles selection in multiple mode', () => {
    const { result } = renderHook(() =>
      useToggleButtonGroup({ multiple: true })
    );

    act(() => {
      result.current.toggle('opt1');
    });

    expect(result.current.value).toEqual(['opt1']);

    act(() => {
      result.current.toggle('opt2');
    });

    expect(result.current.value).toEqual(['opt1', 'opt2']);

    act(() => {
      result.current.toggle('opt1');
    });

    expect(result.current.value).toEqual(['opt2']);
  });

  it('validates required constraint', () => {
    const { result } = renderHook(() =>
      useToggleButtonGroup({ required: true })
    );

    expect(result.current.isValid).toBe(false);

    act(() => {
      result.current.setValue('opt1');
    });

    expect(result.current.isValid).toBe(true);
  });

  it('clears all selections', () => {
    const { result } = renderHook(() =>
      useToggleButtonGroup({
        multiple: true,
        initialValue: ['opt1', 'opt2']
      })
    );

    expect(result.current.value).toEqual(['opt1', 'opt2']);

    act(() => {
      result.current.clear();
    });

    expect(result.current.value).toEqual([]);
  });

  it('calls onChange callback', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useToggleButtonGroup({ onChange })
    );

    act(() => {
      result.current.setValue('opt1');
    });

    expect(onChange).toHaveBeenCalledWith('opt1');
  });
});
```

## Documentation Plan

### Component Documentation

Each component should have comprehensive JSDoc comments:

```typescript
/**
 * A group of toggle buttons for single or multiple selection.
 *
 * @example
 * ```tsx
 * <ToggleButtonGroup
 *   value={alignment}
 *   onValueChanged={(e) => setAlignment(e.detail.value)}
 * >
 *   <ToggleButton value="left">Left</ToggleButton>
 *   <ToggleButton value="center">Center</ToggleButton>
 *   <ToggleButton value="right">Right</ToggleButton>
 * </ToggleButtonGroup>
 * ```
 *
 * @see https://vaadin.com/docs/latest/components/toggle-button-group
 */
export interface ToggleButtonGroupProps {
  // ... properties with JSDoc
}
```

### Storybook Stories

```typescript
// ToggleButtonGroup.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ToggleButtonGroup, ToggleButton } from '@vaadin/react-components';

const meta: Meta<typeof ToggleButtonGroup> = {
  title: 'Components/ToggleButtonGroup',
  component: ToggleButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    multiple: {
      control: 'boolean',
      description: 'Enable multiple selection mode'
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical']
    },
    disabled: {
      control: 'boolean'
    },
    readonly: {
      control: 'boolean'
    },
    required: {
      control: 'boolean'
    }
  }
};

export default meta;
type Story = StoryObj<typeof ToggleButtonGroup>;

export const Default: Story = {
  render: () => (
    <ToggleButtonGroup>
      <ToggleButton value="option1">Option 1</ToggleButton>
      <ToggleButton value="option2">Option 2</ToggleButton>
      <ToggleButton value="option3">Option 3</ToggleButton>
    </ToggleButtonGroup>
  )
};

export const TextAlignment: Story = {
  render: () => (
    <ToggleButtonGroup defaultValue="left">
      <ToggleButton value="left">
        <Icon icon="vaadin:align-left" />
      </ToggleButton>
      <ToggleButton value="center">
        <Icon icon="vaadin:align-center" />
      </ToggleButton>
      <ToggleButton value="right">
        <Icon icon="vaadin:align-right" />
      </ToggleButton>
    </ToggleButtonGroup>
  )
};

export const MultipleSelection: Story = {
  render: () => (
    <ToggleButtonGroup multiple defaultValue={['bold']}>
      <ToggleButton value="bold">Bold</ToggleButton>
      <ToggleButton value="italic">Italic</ToggleButton>
      <ToggleButton value="underline">Underline</ToggleButton>
    </ToggleButtonGroup>
  )
};

export const Vertical: Story = {
  render: () => (
    <ToggleButtonGroup orientation="vertical">
      <ToggleButton value="opt1">Option 1</ToggleButton>
      <ToggleButton value="opt2">Option 2</ToggleButton>
      <ToggleButton value="opt3">Option 3</ToggleButton>
    </ToggleButtonGroup>
  )
};

export const WithValidation: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    const [valid, setValid] = useState(true);

    return (
      <div>
        <ToggleButtonGroup
          multiple
          required
          value={value}
          onValueChanged={(e) => setValue(e.detail.value as string[])}
          onValidated={(e) => setValid(e.detail.valid)}
        >
          <ToggleButton value="opt1">Option 1</ToggleButton>
          <ToggleButton value="opt2">Option 2</ToggleButton>
          <ToggleButton value="opt3">Option 3</ToggleButton>
        </ToggleButtonGroup>
        {!valid && <div style={{ color: 'red' }}>Please select at least one option</div>}
      </div>
    );
  }
};
```

## Migration Guide

### From MUI ToggleButtonGroup

```tsx
// Before (MUI)
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

<ToggleButtonGroup
  value={alignment}
  exclusive
  onChange={(e, newAlignment) => setAlignment(newAlignment)}
>
  <ToggleButton value="left">Left</ToggleButton>
  <ToggleButton value="center">Center</ToggleButton>
  <ToggleButton value="right">Right</ToggleButton>
</ToggleButtonGroup>

// After (Vaadin)
import { ToggleButtonGroup, ToggleButton } from '@vaadin/react-components';

<ToggleButtonGroup
  value={alignment}
  // Note: exclusive is default (multiple=false)
  onValueChanged={(e) => setAlignment(e.detail.value as string)}
>
  <ToggleButton value="left">Left</ToggleButton>
  <ToggleButton value="center">Center</ToggleButton>
  <ToggleButton value="right">Right</ToggleButton>
</ToggleButtonGroup>
```

### From Vaadin Community Add-on

```tsx
// Before (Community Add-on - Java/Flow API, not React)
// No direct React equivalent existed

// After (Official Vaadin React)
import { ToggleButtonGroup, ToggleButton } from '@vaadin/react-components';

<ToggleButtonGroup
  value={selected}
  onValueChanged={(e) => setSelected(e.detail.value)}
>
  <ToggleButton value="opt1">Option 1</ToggleButton>
  <ToggleButton value="opt2">Option 2</ToggleButton>
</ToggleButtonGroup>
```

## Accessibility Features

### Automatic ARIA Implementation

The React wrapper preserves all accessibility features from the web component:
- Proper ARIA roles (`group`, `button`)
- `aria-pressed` state on toggle buttons
- `aria-required` when required prop is true
- `aria-disabled` when disabled
- Keyboard navigation (arrows, space, enter)

### Best Practices for React

```tsx
// Always provide accessible labels for icon-only buttons
<ToggleButton value="bold" ariaLabel="Bold text">
  <Icon icon="vaadin:bold" />
</ToggleButton>

// Provide group label via aria-label or surrounding context
<div>
  <label id="alignment-label">Text Alignment</label>
  <ToggleButtonGroup aria-labelledby="alignment-label">
    {/* ... */}
  </ToggleButtonGroup>
</div>
```

## Performance Considerations

### Memoization

```tsx
import { memo } from 'react';

const ToolbarToggleGroup = memo(({ value, onChange, items }) => (
  <ToggleButtonGroup value={value} onValueChanged={onChange}>
    {items.map(item => (
      <ToggleButton key={item.value} value={item.value}>
        {item.label}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
));
```

### Callback Stability

```tsx
// Use useCallback for event handlers
const handleValueChange = useCallback((e: ToggleButtonGroupValueChangedEvent) => {
  setAlignment(e.detail.value as string);
}, []); // Empty deps if no external dependencies

<ToggleButtonGroup value={alignment} onValueChanged={handleValueChange}>
  {/* ... */}
</ToggleButtonGroup>
```

## Related Components

- `<Button>` - Standard action buttons
- `<RadioGroup>` - Form-based single selection
- `<CheckboxGroup>` - Form-based multiple selection
- `<Tabs>` - Navigation tabs

## References

- Web Component Specification: `ToggleButtonGroup-web-component.md`
- [React Components Documentation](https://vaadin.com/docs/latest/react/components)
- [Material UI ToggleButtonGroup](https://mui.com/material-ui/react-toggle-button/)
