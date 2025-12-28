# Badge React Component Integration Specification

## Overview

This document outlines the plan for integrating the `<vaadin-badge>` web component into Vaadin's React component library (`@vaadin/react-components`). The React wrapper will provide idiomatic React patterns while maintaining full compatibility with the underlying web component.

## Repository Context

**Target Repository**: `https://github.com/vaadin/react-components`

The React components repository provides React wrappers for all Vaadin web components, enabling seamless integration in React applications with proper TypeScript support, React event handling, and React-specific patterns.

## Goals

1. **React Idiomatic**: Provide a React-friendly API that feels natural to React developers
2. **Type Safety**: Full TypeScript support with proper type definitions
3. **Composition**: Support React composition patterns with children
4. **Developer Experience**: Excellent IntelliSense and documentation
5. **Performance**: Efficient rendering and updates

## Usage Examples

### Basic Usage

```tsx
import { Badge } from '@vaadin/react-components/Badge';

function App() {
  return (
    <>
      <Badge>New</Badge>
      <Badge theme="primary">Premium</Badge>
      <Badge theme="success">Active</Badge>
      <Badge theme="error">Error</Badge>
    </>
  );
}
```

### With Icon Components

```tsx
import { Badge } from '@vaadin/react-components/Badge';
import { Icon } from '@vaadin/react-components/Icon';

function StatusBadge() {
  return (
    <Badge theme="success">
      <Icon icon="vaadin:check" slot="prefix" />
      Verified
    </Badge>
  );
}
```

### Tags / Labels

```tsx
import { Badge } from '@vaadin/react-components/Badge';

function ProductTags({ tags }: { tags: string[] }) {
  return (
    <div className="tags">
      {tags.map((tag) => (
        <Badge key={tag} theme="neutral pill">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
```

### Removable Tags

```tsx
import { Badge } from '@vaadin/react-components/Badge';
import { Icon } from '@vaadin/react-components/Icon';
import { useState } from 'react';

function TagList() {
  const [tags, setTags] = useState(['JavaScript', 'TypeScript', 'React']);

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="tag-list">
      {tags.map((tag) => (
        <Badge key={tag} theme="primary pill">
          {tag}
          <Icon
            icon="vaadin:close-small"
            slot="suffix"
            onClick={() => removeTag(tag)}
            style={{ cursor: 'pointer' }}
          />
        </Badge>
      ))}
    </div>
  );
}
```

### Status Indicators

```tsx
import { Badge } from '@vaadin/react-components/Badge';

interface User {
  name: string;
  status: 'online' | 'away' | 'offline';
}

function UserStatus({ user }: { user: User }) {
  const statusThemes = {
    online: 'success',
    away: 'warning',
    offline: 'neutral',
  };

  return (
    <div className="user-status">
      <Badge variant="dot" theme={statusThemes[user.status]} />
      <span>{user.name}</span>
    </div>
  );
}
```

### Notification Badges (Phase 2)

```tsx
import { Badge } from '@vaadin/react-components/Badge';
import { Button } from '@vaadin/react-components/Button';

function NotificationButton({ count }: { count: number }) {
  return (
    <Button>
      Notifications
      {count > 0 && (
        <Badge slot="badge" theme="error" value={count} max={99} />
      )}
    </Button>
  );
}
```

### With Animation

```tsx
import { Badge } from '@vaadin/react-components/Badge';
import { useState, useEffect } from 'react';

function LiveBadge() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Badge theme="error" pulse={pulse}>
      Live
    </Badge>
  );
}
```

### Color Palette Usage

```tsx
import { Badge } from '@vaadin/react-components/Badge';

function UserBadges({ users }: { users: User[] }) {
  return (
    <div className="user-badges">
      {users.map((user, index) => (
        <Badge key={user.id} color={String((index % 7) + 1)}>
          {user.initials}
        </Badge>
      ))}
    </div>
  );
}
```

### Conditional Rendering

```tsx
import { Badge } from '@vaadin/react-components/Badge';

function ProductBadge({ product }: { product: Product }) {
  return (
    <div className="product">
      <h3>{product.name}</h3>
      {product.isNew && <Badge theme="primary">New</Badge>}
      {product.onSale && <Badge theme="error">Sale</Badge>}
      {product.stock === 0 && <Badge theme="neutral">Out of Stock</Badge>}
    </div>
  );
}
```

### Custom Styling

```tsx
import { Badge } from '@vaadin/react-components/Badge';

function CustomBadge() {
  return (
    <Badge
      style={{
        '--vaadin-badge-background': '#9C27B0',
        '--vaadin-badge-color': 'white',
        '--vaadin-badge-border-radius': '4px',
      } as React.CSSProperties}
    >
      Custom
    </Badge>
  );
}
```

### With React Context

```tsx
import { createContext, useContext } from 'react';
import { Badge } from '@vaadin/react-components/Badge';

const ThemeContext = createContext<'success' | 'error' | 'warning'>('success');

function ThemedBadge({ children }: { children: React.ReactNode }) {
  const theme = useContext(ThemeContext);

  return <Badge theme={theme}>{children}</Badge>;
}

function App() {
  return (
    <ThemeContext.Provider value="success">
      <ThemedBadge>Using Context</ThemedBadge>
    </ThemeContext.Provider>
  );
}
```

### Accessibility Example

```tsx
import { Badge } from '@vaadin/react-components/Badge';

function IconOnlyBadge() {
  return (
    <Badge
      variant="dot"
      theme="success"
      aria-label="Online status"
      role="status"
    />
  );
}

function NotificationBadge({ count }: { count: number }) {
  return (
    <Badge
      theme="error"
      value={count}
      aria-label={`${count} unread notifications`}
      role="status"
      aria-live="polite"
    />
  );
}
```

## Component API

### Phase 1: Core Features

#### Props Interface

```typescript
import type { BadgeElement } from '@vaadin/badge';
import type { ReactElement, CSSProperties } from 'react';

export interface BadgeProps {
  // Core properties
  theme?: string;
  ariaLabel?: string;

  // Standard HTML attributes
  id?: string;
  className?: string;
  style?: CSSProperties;
  tabIndex?: number;
  role?: string;

  // ARIA attributes
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-live'?: 'off' | 'polite' | 'assertive';

  // Event handlers (generic React events)
  onClick?: (event: MouseEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;

  // Children
  children?: React.ReactNode;

  // Ref
  ref?: React.Ref<BadgeElement>;
}
```

#### Component Implementation

```typescript
// src/Badge.tsx
import { createComponent } from '@lit/react';
import { Badge as BadgeWC } from '@vaadin/badge';

export const Badge = createComponent({
  tagName: 'vaadin-badge',
  elementClass: BadgeWC,
  react: React,
  events: {
    // Map any custom events here if needed
  },
});

export type { BadgeElement } from '@vaadin/badge';
```

### Phase 2: Enhanced Features

#### Extended Props

```typescript
export interface BadgeProps {
  // ... Phase 1 props

  // Phase 2 additions
  variant?: 'standard' | 'dot';
  color?: string;
  pulse?: boolean;
  max?: number;
  value?: number | string;
  hidden?: boolean;
}
```

### Phase 3: Advanced Features

#### Extended Props

```typescript
export interface BadgeProps {
  // ... Phase 1 & 2 props

  // Phase 3 additions
  overlap?: 'circular' | 'rectangular';
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  showZero?: boolean;
}
```

## Implementation Plan

### File Structure

```
packages/react-components/
├── src/
│   └── Badge.tsx                # Main React component wrapper
├── test/
│   └── Badge.test.tsx           # React component tests
└── package.json
```

### Core Implementation

#### React Wrapper Component

```typescript
// src/Badge.tsx
import React from 'react';
import { createComponent } from '@lit/react';
import { Badge as BadgeWC } from '@vaadin/badge';
import type { BadgeElement } from '@vaadin/badge';

// Create the React component using @lit/react
export const Badge = createComponent({
  tagName: 'vaadin-badge',
  elementClass: BadgeWC,
  react: React,
  events: {
    // Badge currently doesn't have custom events
    // Add here if custom events are added later
  },
});

// Export types for TypeScript users
export type { BadgeElement };
export type {
  BadgeProps,
  BadgeVariant,
  BadgeOverlap,
  BadgeAnchorOrigin,
} from './Badge.types';
```

#### TypeScript Type Definitions

```typescript
// src/Badge.types.ts
import type { BadgeElement } from '@vaadin/badge';
import type { ReactNode, CSSProperties, HTMLAttributes } from 'react';

export type BadgeVariant = 'standard' | 'dot';
export type BadgeOverlap = 'circular' | 'rectangular';

export interface BadgeAnchorOrigin {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'right';
}

export interface BadgeProps extends Omit<HTMLAttributes<BadgeElement>, 'color'> {
  // Core properties
  theme?: string;
  ariaLabel?: string;

  // Phase 2 properties
  variant?: BadgeVariant;
  color?: string;
  pulse?: boolean;
  max?: number;
  value?: number | string;
  hidden?: boolean;

  // Phase 3 properties
  overlap?: BadgeOverlap;
  anchorOrigin?: BadgeAnchorOrigin;
  showZero?: boolean;

  // React-specific
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;

  // ARIA
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-live'?: 'off' | 'polite' | 'assertive';
}
```

#### Custom Hooks (Optional Utilities)

```typescript
// src/hooks/useBadge.ts
import { useState, useCallback, useMemo } from 'react';

export interface UseBadgeOptions {
  defaultVisible?: boolean;
  max?: number;
}

export function useBadge(options: UseBadgeOptions = {}) {
  const [value, setValue] = useState<number>(0);
  const [visible, setVisible] = useState(options.defaultVisible ?? true);

  const displayValue = useMemo(() => {
    if (options.max && value > options.max) {
      return `${options.max}+`;
    }
    return String(value);
  }, [value, options.max]);

  const increment = useCallback(() => {
    setValue(prev => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setValue(prev => Math.max(0, prev - 1));
  }, []);

  const reset = useCallback(() => {
    setValue(0);
  }, []);

  const toggle = useCallback(() => {
    setVisible(prev => !prev);
  }, []);

  return {
    value,
    setValue,
    displayValue,
    visible,
    setVisible,
    increment,
    decrement,
    reset,
    toggle,
    props: {
      value: displayValue,
      hidden: !visible,
      max: options.max,
    },
  };
}
```

Usage of the hook:

```tsx
function NotificationBell() {
  const badge = useBadge({ max: 99 });

  useEffect(() => {
    // Simulate notifications
    const interval = setInterval(() => {
      badge.increment();
    }, 3000);

    return () => clearInterval(interval);
  }, [badge]);

  return (
    <div>
      <Icon icon="vaadin:bell">
        <Badge {...badge.props} theme="error" />
      </Icon>
      <Button onClick={badge.reset}>Mark All Read</Button>
    </div>
  );
}
```

#### Tag Manager Hook

```typescript
// src/hooks/useTagList.ts
import { useState, useCallback } from 'react';

export interface UseTagListOptions {
  initialTags?: string[];
  maxTags?: number;
  onChange?: (tags: string[]) => void;
}

export function useTagList(options: UseTagListOptions = {}) {
  const [tags, setTags] = useState<string[]>(options.initialTags || []);

  const addTag = useCallback((tag: string) => {
    if (!tag.trim()) return;

    setTags(prev => {
      if (prev.includes(tag)) return prev;
      if (options.maxTags && prev.length >= options.maxTags) return prev;

      const newTags = [...prev, tag];
      options.onChange?.(newTags);
      return newTags;
    });
  }, [options]);

  const removeTag = useCallback((tagToRemove: string) => {
    setTags(prev => {
      const newTags = prev.filter(tag => tag !== tagToRemove);
      options.onChange?.(newTags);
      return newTags;
    });
  }, [options]);

  const clearAll = useCallback(() => {
    setTags([]);
    options.onChange?.([]);
  }, [options]);

  const hasTag = useCallback((tag: string) => {
    return tags.includes(tag);
  }, [tags]);

  return {
    tags,
    setTags,
    addTag,
    removeTag,
    clearAll,
    hasTag,
    canAddMore: !options.maxTags || tags.length < options.maxTags,
  };
}
```

Usage:

```tsx
function TagSelector() {
  const { tags, addTag, removeTag } = useTagList({
    maxTags: 5,
    onChange: (tags) => console.log('Tags updated:', tags),
  });

  const [input, setInput] = useState('');

  const handleAdd = () => {
    addTag(input);
    setInput('');
  };

  return (
    <div>
      <div className="tag-list">
        {tags.map((tag) => (
          <Badge key={tag} theme="primary pill">
            {tag}
            <Icon
              icon="vaadin:close-small"
              slot="suffix"
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button onClick={handleAdd}>Add Tag</Button>
      </div>
    </div>
  );
}
```

### Testing Strategy

#### Unit Tests

```typescript
// test/Badge.test.tsx
import { render, screen } from '@testing-library/react';
import { Badge } from '../src/Badge';
import { expect, test, vi } from 'vitest';

test('renders with text content', () => {
  render(<Badge>Test Badge</Badge>);
  expect(screen.getByText('Test Badge')).toBeInTheDocument();
});

test('applies theme attribute', () => {
  const { container } = render(<Badge theme="primary">Badge</Badge>);
  const element = container.querySelector('vaadin-badge');

  expect(element?.getAttribute('theme')).toBe('primary');
});

test('supports multiple theme variants', () => {
  const { container } = render(<Badge theme="primary small pill">Badge</Badge>);
  const element = container.querySelector('vaadin-badge');

  expect(element?.getAttribute('theme')).toBe('primary small pill');
});

test('renders with icon prefix', () => {
  render(
    <Badge>
      <span slot="prefix">✓</span>
      Verified
    </Badge>
  );

  expect(screen.getByText('Verified')).toBeInTheDocument();
});

test('handles click events', () => {
  const handleClick = vi.fn();
  render(<Badge onClick={handleClick}>Click me</Badge>);

  const badge = screen.getByText('Click me');
  badge.click();

  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('applies custom styles', () => {
  const { container } = render(
    <Badge style={{ backgroundColor: 'red' }}>Styled</Badge>
  );
  const element = container.querySelector('vaadin-badge') as HTMLElement;

  expect(element.style.backgroundColor).toBe('red');
});

test('supports variant prop', () => {
  const { container } = render(<Badge variant="dot" />);
  const element = container.querySelector('vaadin-badge');

  expect(element?.getAttribute('variant')).toBe('dot');
});

test('supports value prop', () => {
  const { container } = render(<Badge value={5} />);
  const element = container.querySelector('vaadin-badge');

  expect(element?.getAttribute('value')).toBe('5');
});

test('supports max prop', () => {
  const { container } = render(<Badge value={150} max={99} />);
  const element = container.querySelector('vaadin-badge');

  expect(element?.getAttribute('max')).toBe('99');
});

test('supports pulse prop', () => {
  const { container } = render(<Badge pulse />);
  const element = container.querySelector('vaadin-badge');

  expect(element?.hasAttribute('pulse')).toBe(true);
});

test('forwards ref to element', () => {
  const ref = React.createRef<BadgeElement>();
  render(<Badge ref={ref}>Badge</Badge>);

  expect(ref.current).toBeInstanceOf(HTMLElement);
  expect(ref.current?.tagName.toLowerCase()).toBe('vaadin-badge');
});

test('supports aria-label', () => {
  const { container } = render(<Badge aria-label="Status indicator" variant="dot" />);
  const element = container.querySelector('vaadin-badge');

  expect(element?.getAttribute('aria-label')).toBe('Status indicator');
});
```

#### Integration Tests

```typescript
// test/Badge.integration.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from '../src/Badge';
import { useBadge } from '../src/hooks/useBadge';

test('useBadge hook increments value', () => {
  function TestComponent() {
    const badge = useBadge({ max: 99 });

    return (
      <div>
        <Badge {...badge.props} theme="error" />
        <button onClick={badge.increment}>Increment</button>
        <button onClick={badge.reset}>Reset</button>
      </div>
    );
  }

  render(<TestComponent />);

  const incrementBtn = screen.getByText('Increment');
  const resetBtn = screen.getByText('Reset');

  // Increment 5 times
  for (let i = 0; i < 5; i++) {
    fireEvent.click(incrementBtn);
  }

  const badge = document.querySelector('vaadin-badge');
  expect(badge?.getAttribute('value')).toBe('5');

  // Reset
  fireEvent.click(resetBtn);
  expect(badge?.getAttribute('value')).toBe('0');
});

test('useTagList hook manages tags', () => {
  function TestComponent() {
    const { tags, addTag, removeTag } = useTagList();
    const [input, setInput] = useState('');

    return (
      <div>
        <div data-testid="tag-list">
          {tags.map((tag) => (
            <Badge key={tag}>
              {tag}
              <span onClick={() => removeTag(tag)}>×</span>
            </Badge>
          ))}
        </div>
        <input
          data-testid="tag-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={() => { addTag(input); setInput(''); }}>
          Add
        </button>
      </div>
    );
  }

  render(<TestComponent />);

  const input = screen.getByTestId('tag-input');
  const addBtn = screen.getByText('Add');

  // Add a tag
  fireEvent.change(input, { target: { value: 'React' } });
  fireEvent.click(addBtn);

  expect(screen.getByText('React')).toBeInTheDocument();

  // Add another tag
  fireEvent.change(input, { target: { value: 'TypeScript' } });
  fireEvent.click(addBtn);

  expect(screen.getByText('TypeScript')).toBeInTheDocument();

  // Remove a tag
  const removeBtn = screen.getAllByText('×')[0];
  fireEvent.click(removeBtn);

  expect(screen.queryByText('React')).not.toBeInTheDocument();
  expect(screen.getByText('TypeScript')).toBeInTheDocument();
});
```

#### TypeScript Tests

```typescript
// test/Badge.types.test.tsx
import { Badge } from '../src/Badge';
import type { BadgeElement } from '@vaadin/badge';

// Should accept valid props
<Badge theme="primary" />;
<Badge theme="success small pill" />;
<Badge variant="dot" />;
<Badge variant="standard" value={5} max={99} />;

// Should accept children
<Badge>Text content</Badge>;

// Should accept ARIA attributes
<Badge aria-label="Status" aria-live="polite" />;

// Should accept event handlers
<Badge onClick={(e) => console.log(e)} />;

// Should accept ref
const ref = React.useRef<BadgeElement>(null);
<Badge ref={ref} />;

// Should accept style
<Badge style={{ backgroundColor: 'red' }} />;

// @ts-expect-error - Should reject invalid variant
<Badge variant="invalid" />;

// @ts-expect-error - Should reject invalid overlap
<Badge overlap="invalid" />;
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
    "./Badge": {
      "types": "./dist/Badge.d.ts",
      "import": "./dist/Badge.js"
    }
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "dependencies": {
    "@lit/react": "^1.0.0",
    "@vaadin/badge": "^25.0.0"
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

**Location**: `packages/react-components/docs/Badge.md`

**Content**:
- Overview of the React Badge component
- Installation instructions
- Basic usage examples
- API reference (props, events)
- TypeScript usage
- Custom hooks documentation
- Styling guide

### 2. Storybook Stories

```typescript
// Badge.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../src/Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['', 'primary', 'success', 'error', 'warning', 'contrast', 'small', 'pill'],
    },
    variant: {
      control: 'select',
      options: ['standard', 'dot'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Primary: Story = {
  args: {
    theme: 'primary',
    children: 'Primary',
  },
};

export const Success: Story = {
  args: {
    theme: 'success',
    children: 'Success',
  },
};

export const Error: Story = {
  args: {
    theme: 'error',
    children: 'Error',
  },
};

export const Small: Story = {
  args: {
    theme: 'small',
    children: 'Small',
  },
};

export const Pill: Story = {
  args: {
    theme: 'pill',
    children: 'Pill',
  },
};

export const DotVariant: Story = {
  args: {
    variant: 'dot',
    theme: 'success',
  },
};

export const WithIcon: Story = {
  render: () => (
    <Badge theme="success">
      <Icon icon="vaadin:check" slot="prefix" />
      Verified
    </Badge>
  ),
};

export const RemovableTags: Story = {
  render: () => {
    const [tags, setTags] = React.useState(['React', 'TypeScript', 'Vaadin']);

    const removeTag = (tagToRemove: string) => {
      setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {tags.map((tag) => (
          <Badge key={tag} theme="primary pill">
            {tag}
            <Icon
              icon="vaadin:close-small"
              slot="suffix"
              onClick={() => removeTag(tag)}
              style={{ cursor: 'pointer' }}
            />
          </Badge>
        ))}
      </div>
    );
  },
};

export const NotificationBadge: Story = {
  render: () => {
    const [count, setCount] = React.useState(5);

    return (
      <Button>
        Inbox
        <Badge slot="badge" theme="error" value={count} max={99} />
      </Button>
    );
  },
};

export const WithPulse: Story = {
  args: {
    theme: 'error',
    pulse: true,
    children: 'Live',
  },
};

export const ColorPalette: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      {[1, 2, 3, 4, 5, 6, 7].map((color) => (
        <Badge key={color} color={String(color)}>
          Color {color}
        </Badge>
      ))}
    </div>
  ),
};
```

### 3. README Section

```markdown
## Badge

A small visual indicator for displaying status, counts, or labels.

### Installation

```bash
npm install @vaadin/react-components
```

### Usage

```tsx
import { Badge } from '@vaadin/react-components/Badge';

function App() {
  return (
    <>
      <Badge>New</Badge>
      <Badge theme="primary">Premium</Badge>
      <Badge theme="success">Active</Badge>
    </>
  );
}
```

### Documentation

- [Component API](./docs/Badge.md)
- [Storybook Examples](https://storybook.vaadin.com/?path=/docs/components-badge)
```

## React-Specific Features

### 1. Children Pattern

React's children pattern works seamlessly with Badge:

```tsx
// Simple text
<Badge>Text</Badge>

// With components
<Badge>
  <Icon icon="vaadin:check" slot="prefix" />
  Verified
</Badge>

// With conditional content
<Badge>
  {isNew && '🆕'} {label}
</Badge>
```

### 2. State Management

```tsx
// Local state
const [count, setCount] = useState(0);
<Badge value={count} max={99} />;

// Context
const theme = useContext(ThemeContext);
<Badge theme={theme}>Themed</Badge>;

// External state (Redux, Zustand, etc.)
const notifications = useSelector(state => state.notifications.count);
<Badge value={notifications} theme="error" />;
```

### 3. Memoization

```tsx
import { memo } from 'react';

const MemoizedBadge = memo(Badge);

function TagList({ tags }) {
  return tags.map((tag) => (
    <MemoizedBadge key={tag} theme="primary pill">
      {tag}
    </MemoizedBadge>
  ));
}
```

### 4. Conditional Rendering

```tsx
function ConditionalBadges({ product }) {
  return (
    <>
      {product.isNew && <Badge theme="primary">New</Badge>}
      {product.onSale && <Badge theme="error">Sale</Badge>}
      {!product.inStock && <Badge theme="neutral">Out of Stock</Badge>}
    </>
  );
}
```

## Best Practices

### 1. Use Semantic Themes

```tsx
// ✅ Good - Semantic meaning
<Badge theme="success">Approved</Badge>
<Badge theme="error">Failed</Badge>
<Badge theme="warning">Pending</Badge>

// ❌ Bad - Color without context
<Badge theme="primary">Status</Badge>
```

### 2. Provide ARIA Labels for Icons

```tsx
// ✅ Good - Accessible
<Badge variant="dot" theme="success" aria-label="Online" />

// ❌ Bad - No label
<Badge variant="dot" theme="success" />
```

### 3. Keep Text Concise

```tsx
// ✅ Good - Short and clear
<Badge>New</Badge>
<Badge theme="error">3</Badge>

// ❌ Bad - Too verbose
<Badge>This is a very long badge text that will wrap</Badge>
```

### 4. Use Appropriate Variants

```tsx
// ✅ Good - Dot for simple indicator
<Badge variant="dot" theme="success" aria-label="Online" />

// ✅ Good - Standard for counts
<Badge theme="error" value={5} />

// ❌ Bad - Standard variant with no content
<Badge theme="success"></Badge>
```

## Release Strategy

### Phase 1: Core Integration

**Timeline**: Aligned with web component v1.0.0

**Deliverables**:
- React wrapper component
- TypeScript definitions
- Basic hooks (useBadge, useTagList)
- Unit tests
- Storybook stories
- Documentation

### Phase 2: Enhanced Features

**Timeline**: Aligned with web component v1.1.0

**Deliverables**:
- Variant prop support
- Value and max props
- Color palette support
- Pulse animation
- Enhanced hooks
- Additional Storybook stories

### Phase 3: Advanced Features

**Timeline**: Aligned with web component v1.2.0

**Deliverables**:
- Advanced positioning props
- ShowZero support
- Notification badge patterns
- Performance optimization guides

## Dependencies

### Runtime
- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0
- `@lit/react` ^1.0.0
- `@vaadin/badge` ^25.0.0

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
3. ✅ Component works with React hooks and state management
4. ✅ Documentation is comprehensive with examples
5. ✅ Test coverage is > 90%
6. ✅ Performance is comparable to native React components
7. ✅ Developer feedback is positive

## Conclusion

This specification provides a comprehensive plan for integrating the Badge web component into the React ecosystem. The integration will provide a React-idiomatic API while maintaining full compatibility with the underlying web component, ensuring an excellent developer experience for React users.
