# Vaadin Breadcrumb React Component Specification

## Executive Summary

This specification defines the React integration for the Vaadin Breadcrumb component, providing a type-safe, React-friendly API while maintaining full compatibility with the underlying web component. The implementation follows Vaadin's established patterns for React component wrappers in the `@vaadin/react-components` package.

## Overview

The React Breadcrumb component wraps the `<vaadin-breadcrumb>` web component, providing:
- TypeScript type definitions
- React-style prop handling
- Event callbacks with proper typing
- Ref forwarding for imperative access
- JSX-friendly API
- React Router integration hooks

## Usage Examples

### Basic Usage

```tsx
import { Breadcrumb } from '@vaadin/react-components/Breadcrumb.js';

function App() {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Laptops' }
  ];

  return <Breadcrumb items={items} />;
}
```

### With Event Handlers

```tsx
import { Breadcrumb } from '@vaadin/react-components/Breadcrumb.js';

function App() {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Laptops' }
  ];

  const handleItemClick = (event) => {
    console.log('Clicked:', event.detail.item);
    // Prevent default navigation for SPA routing
    event.preventDefault();
  };

  return (
    <Breadcrumb
      items={items}
      onBreadcrumbItemClick={handleItemClick}
    />
  );
}
```

### With Custom Separator

```tsx
import { Breadcrumb } from '@vaadin/react-components/Breadcrumb.js';

function App() {
  return (
    <Breadcrumb items={items}>
      <span slot="separator">›</span>
    </Breadcrumb>
  );
}
```

### With Ref (Imperative API)

```tsx
import { useRef } from 'react';
import { Breadcrumb } from '@vaadin/react-components/Breadcrumb.js';
import type { BreadcrumbElement } from '@vaadin/breadcrumb';

function App() {
  const breadcrumbRef = useRef<BreadcrumbElement>(null);

  const updateItems = () => {
    if (breadcrumbRef.current) {
      breadcrumbRef.current.items = [
        { label: 'New', href: '/new' },
        { label: 'Path' }
      ];
    }
  };

  return (
    <>
      <Breadcrumb ref={breadcrumbRef} items={items} />
      <button onClick={updateItems}>Update Breadcrumbs</button>
    </>
  );
}
```

### React Router Integration

```tsx
import { useLocation } from 'react-router-dom';
import { Breadcrumb } from '@vaadin/react-components/Breadcrumb.js';
import { useBreadcrumbs } from '@vaadin/react-components/hooks';

// Route configuration
const routeConfig = {
  '/': { label: 'Home' },
  '/products': { label: 'Products' },
  '/products/:category': { label: 'Category' },
  '/products/:category/:id': { label: 'Product Details' }
};

function App() {
  const location = useLocation();
  const breadcrumbs = useBreadcrumbs(location.pathname, routeConfig);

  return <Breadcrumb items={breadcrumbs} />;
}
```

### Advanced Router Integration with Dynamic Labels

```tsx
import { useBreadcrumbs } from '@vaadin/react-components/hooks';

function ProductPage() {
  const product = useProduct(); // Custom hook to get product data

  const breadcrumbs = useBreadcrumbs(location.pathname, {
    '/': { label: 'Home' },
    '/products': { label: 'Products' },
    '/products/:category': {
      label: (params) => params.category.toUpperCase()
    },
    '/products/:category/:id': {
      label: () => product?.name || 'Loading...'
    }
  });

  return <Breadcrumb items={breadcrumbs} />;
}
```

### TypeScript with Custom Item Type

```tsx
import { Breadcrumb, BreadcrumbItem } from '@vaadin/react-components/Breadcrumb.js';

interface CustomBreadcrumbItem extends BreadcrumbItem {
  icon?: string;
  badge?: number;
}

function App() {
  const items: CustomBreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: 'home' },
    { label: 'Products', href: '/products', badge: 42 },
    { label: 'Laptops' }
  ];

  const renderer = (item: CustomBreadcrumbItem, element: HTMLElement) => {
    if (item.icon) {
      element.innerHTML = `<vaadin-icon icon="${item.icon}"></vaadin-icon> ${item.label}`;
    }
    if (item.badge) {
      element.innerHTML += ` <span class="badge">${item.badge}</span>`;
    }
  };

  return <Breadcrumb items={items} renderer={renderer} />;
}
```

## Implementation Plan

### Phase 1: Core React Wrapper

**Priority: MUST HAVE**

Matches the web component's Phase 1 functionality.

#### Package Structure

```
packages/react-components/
├── src/
│   ├── Breadcrumb.tsx (React wrapper)
│   └── hooks/
│       └── useBreadcrumbs.ts (Router integration hook)
└── test/
    └── Breadcrumb.test.tsx (React-specific tests)
```

#### Component Implementation

```tsx
// src/Breadcrumb.tsx
import { forwardRef } from 'react';
import { createComponent } from '@lit/react';
import { Breadcrumb as BreadcrumbElement } from '@vaadin/breadcrumb';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  path?: string;
  disabled?: boolean;
  [key: string]: any;
}

export interface BreadcrumbProps {
  /** Array of breadcrumb items */
  items?: BreadcrumbItem[];

  /** Whether to show the current page in the breadcrumb */
  showCurrentPage?: boolean;

  /** Aria label for the navigation landmark */
  ariaLabel?: string;

  /** Overflow handling strategy */
  overflow?: 'wrap' | 'scroll' | 'ellipsis' | 'dropdown';

  /** Custom renderer function for items */
  renderer?: (item: BreadcrumbItem, element: HTMLElement) => void;

  /** Fired when a breadcrumb item is clicked */
  onBreadcrumbItemClick?: (event: CustomEvent<{
    item: BreadcrumbItem;
    index: number;
  }>) => void;

  /** Children for slot content (e.g., custom separator) */
  children?: React.ReactNode;

  /** CSS class name */
  className?: string;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Theme variant */
  theme?: string;
}

export const Breadcrumb = createComponent({
  tagName: 'vaadin-breadcrumb',
  elementClass: BreadcrumbElement,
  react: React,
  events: {
    onBreadcrumbItemClick: 'breadcrumb-item-click'
  }
});

// Export the element type for ref typing
export type { BreadcrumbElement };
```

#### TypeScript Definitions

```tsx
// Breadcrumb.d.ts
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { BreadcrumbElement } from '@vaadin/breadcrumb';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  path?: string;
  disabled?: boolean;
  [key: string]: any;
}

export interface BreadcrumbProps extends RefAttributes<BreadcrumbElement> {
  items?: BreadcrumbItem[];
  showCurrentPage?: boolean;
  ariaLabel?: string;
  overflow?: 'wrap' | 'scroll' | 'ellipsis' | 'dropdown';
  renderer?: (item: BreadcrumbItem, element: HTMLElement) => void;
  onBreadcrumbItemClick?: (event: CustomEvent<{
    item: BreadcrumbItem;
    index: number;
  }>) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  theme?: string;
}

export const Breadcrumb: ForwardRefExoticComponent<BreadcrumbProps>;
export { BreadcrumbElement };
```

### Phase 2: React Router Integration

**Priority: SHOULD HAVE**

Provides seamless integration with React Router for automatic breadcrumb generation.

#### useBreadcrumbs Hook

```tsx
// src/hooks/useBreadcrumbs.ts
import { useMemo } from 'react';
import type { BreadcrumbItem } from '../Breadcrumb';

export interface RouteConfig {
  [path: string]: {
    label: string | ((params: Record<string, string>) => string);
    href?: string;
  };
}

/**
 * Generate breadcrumb items from the current pathname and route configuration
 *
 * @param pathname - Current location pathname (from useLocation)
 * @param routeConfig - Route configuration mapping paths to labels
 * @returns Array of breadcrumb items
 *
 * @example
 * ```tsx
 * const routeConfig = {
 *   '/': { label: 'Home' },
 *   '/products': { label: 'Products' },
 *   '/products/:id': { label: 'Product Details' }
 * };
 *
 * const breadcrumbs = useBreadcrumbs(location.pathname, routeConfig);
 * ```
 */
export function useBreadcrumbs(
  pathname: string,
  routeConfig: RouteConfig
): BreadcrumbItem[] {
  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add home/root
    const rootConfig = routeConfig['/'];
    if (rootConfig) {
      breadcrumbs.push({
        label: typeof rootConfig.label === 'function'
          ? rootConfig.label({})
          : rootConfig.label,
        href: rootConfig.href || '/'
      });
    }

    // Build breadcrumbs for each segment
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const config = findMatchingRoute(currentPath, routeConfig);

      if (config) {
        const params = extractParams(currentPath, config.pattern);
        const label = typeof config.label === 'function'
          ? config.label(params)
          : config.label;

        breadcrumbs.push({
          label,
          href: index < segments.length - 1 ? currentPath : undefined
        });
      }
    });

    return breadcrumbs;
  }, [pathname, routeConfig]);
}

function findMatchingRoute(path: string, config: RouteConfig) {
  // Match exact routes first
  if (config[path]) {
    return { ...config[path], pattern: path };
  }

  // Match parameterized routes
  for (const [pattern, routeConfig] of Object.entries(config)) {
    if (matchRoute(path, pattern)) {
      return { ...routeConfig, pattern };
    }
  }

  return null;
}

function matchRoute(path: string, pattern: string): boolean {
  const pathSegments = path.split('/').filter(Boolean);
  const patternSegments = pattern.split('/').filter(Boolean);

  if (pathSegments.length !== patternSegments.length) {
    return false;
  }

  return patternSegments.every((segment, i) => {
    return segment.startsWith(':') || segment === pathSegments[i];
  });
}

function extractParams(
  path: string,
  pattern: string
): Record<string, string> {
  const pathSegments = path.split('/').filter(Boolean);
  const patternSegments = pattern.split('/').filter(Boolean);
  const params: Record<string, string> = {};

  patternSegments.forEach((segment, i) => {
    if (segment.startsWith(':')) {
      const paramName = segment.slice(1);
      params[paramName] = pathSegments[i];
    }
  });

  return params;
}
```

#### useNavigationBreadcrumbs Hook (Alternative)

```tsx
// src/hooks/useNavigationBreadcrumbs.ts
import { useEffect, useState } from 'react';
import { useLocation, useMatches } from 'react-router-dom';
import type { BreadcrumbItem } from '../Breadcrumb';

/**
 * Automatically generate breadcrumbs from React Router matches
 * Requires route handles with breadcrumb configuration
 *
 * @example
 * ```tsx
 * // In route configuration
 * {
 *   path: '/products/:id',
 *   element: <ProductPage />,
 *   handle: {
 *     breadcrumb: (params) => `Product ${params.id}`
 *   }
 * }
 *
 * // In component
 * const breadcrumbs = useNavigationBreadcrumbs();
 * ```
 */
export function useNavigationBreadcrumbs(): BreadcrumbItem[] {
  const location = useLocation();
  const matches = useMatches();

  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    const items: BreadcrumbItem[] = matches
      .filter((match) => match.handle?.breadcrumb)
      .map((match, index) => {
        const breadcrumb = match.handle.breadcrumb;
        const label = typeof breadcrumb === 'function'
          ? breadcrumb(match.params)
          : breadcrumb;

        return {
          label,
          href: index < matches.length - 1 ? match.pathname : undefined
        };
      });

    setBreadcrumbs(items);
  }, [location, matches]);

  return breadcrumbs;
}
```

### Phase 3: Enhanced React Features

**Priority: COULD HAVE**

Additional React-specific utilities and integrations.

#### Features

1. **useBreadcrumbState Hook**
   - Stateful breadcrumb management
   - Programmatic item manipulation
   - State persistence

2. **BreadcrumbContext**
   - Share breadcrumb state across components
   - Provider pattern for nested routes

3. **Accessibility Hooks**
   - useAnnounceNavigation for screen readers
   - Automatic focus management helpers

#### useBreadcrumbState Hook

```tsx
// src/hooks/useBreadcrumbState.ts
import { useState, useCallback } from 'react';
import type { BreadcrumbItem } from '../Breadcrumb';

export interface BreadcrumbState {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
  addItem: (item: BreadcrumbItem) => void;
  removeItem: (index: number) => void;
  clearItems: () => void;
}

/**
 * Stateful breadcrumb management hook
 *
 * @param initialItems - Initial breadcrumb items
 * @returns Breadcrumb state and manipulation functions
 */
export function useBreadcrumbState(
  initialItems: BreadcrumbItem[] = []
): BreadcrumbState {
  const [items, setItems] = useState<BreadcrumbItem[]>(initialItems);

  const addItem = useCallback((item: BreadcrumbItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    setItems,
    addItem,
    removeItem,
    clearItems
  };
}
```

#### BreadcrumbContext

```tsx
// src/context/BreadcrumbContext.tsx
import { createContext, useContext, ReactNode } from 'react';
import { useBreadcrumbState, BreadcrumbState } from '../hooks/useBreadcrumbState';

const BreadcrumbContext = createContext<BreadcrumbState | null>(null);

export interface BreadcrumbProviderProps {
  children: ReactNode;
  initialItems?: BreadcrumbItem[];
}

/**
 * Provider for sharing breadcrumb state across components
 *
 * @example
 * ```tsx
 * <BreadcrumbProvider>
 *   <App />
 * </BreadcrumbProvider>
 * ```
 */
export function BreadcrumbProvider({
  children,
  initialItems = []
}: BreadcrumbProviderProps) {
  const state = useBreadcrumbState(initialItems);

  return (
    <BreadcrumbContext.Provider value={state}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

/**
 * Hook to access breadcrumb context
 *
 * @throws Error if used outside BreadcrumbProvider
 */
export function useBreadcrumbContext(): BreadcrumbState {
  const context = useContext(BreadcrumbContext);

  if (!context) {
    throw new Error(
      'useBreadcrumbContext must be used within BreadcrumbProvider'
    );
  }

  return context;
}
```

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

**Component Rendering:**
```tsx
import { render, screen } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';

test('renders breadcrumb items', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Current Page' }
  ];

  render(<Breadcrumb items={items} />);

  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Products')).toBeInTheDocument();
  expect(screen.getByText('Current Page')).toBeInTheDocument();
});
```

**Event Handling:**
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Breadcrumb } from './Breadcrumb';

test('handles item click', async () => {
  const handleClick = jest.fn();
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' }
  ];

  render(<Breadcrumb items={items} onBreadcrumbItemClick={handleClick} />);

  await userEvent.click(screen.getByText('Home'));

  expect(handleClick).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: expect.objectContaining({
        item: items[0],
        index: 0
      })
    })
  );
});
```

**Ref Forwarding:**
```tsx
import { render } from '@testing-library/react';
import { useRef } from 'react';
import { Breadcrumb } from './Breadcrumb';
import type { BreadcrumbElement } from '@vaadin/breadcrumb';

test('forwards ref to web component', () => {
  const TestComponent = () => {
    const ref = useRef<BreadcrumbElement>(null);
    return <Breadcrumb ref={ref} items={[]} />;
  };

  const { container } = render(<TestComponent />);
  const element = container.querySelector('vaadin-breadcrumb');

  expect(element).toBeInstanceOf(HTMLElement);
});
```

**Hook Tests:**
```tsx
import { renderHook } from '@testing-library/react';
import { useBreadcrumbs } from './hooks/useBreadcrumbs';

test('generates breadcrumbs from pathname', () => {
  const routeConfig = {
    '/': { label: 'Home' },
    '/products': { label: 'Products' },
    '/products/:id': { label: 'Product' }
  };

  const { result } = renderHook(() =>
    useBreadcrumbs('/products/123', routeConfig)
  );

  expect(result.current).toEqual([
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Product', href: undefined }
  ]);
});
```

### Integration Tests

**React Router Integration:**
```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Breadcrumb } from './Breadcrumb';
import { useBreadcrumbs } from './hooks/useBreadcrumbs';

test('integrates with React Router', () => {
  const BreadcrumbNav = () => {
    const location = useLocation();
    const breadcrumbs = useBreadcrumbs(location.pathname, {
      '/': { label: 'Home' },
      '/products': { label: 'Products' }
    });

    return <Breadcrumb items={breadcrumbs} />;
  };

  render(
    <MemoryRouter initialEntries={['/products']}>
      <Routes>
        <Route path="/products" element={<BreadcrumbNav />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Products')).toBeInTheDocument();
});
```

### TypeScript Type Tests

```tsx
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';
import type { BreadcrumbElement } from '@vaadin/breadcrumb';

// Valid usage
const items: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products' }
];

<Breadcrumb items={items} />;
<Breadcrumb items={items} showCurrentPage={false} />;
<Breadcrumb items={items} onBreadcrumbItemClick={(e) => console.log(e.detail)} />;

// Ref typing
const ref = useRef<BreadcrumbElement>(null);
<Breadcrumb ref={ref} items={items} />;

// Should error: invalid prop
// @ts-expect-error
<Breadcrumb items={items} invalidProp="test" />;

// Should error: invalid item
// @ts-expect-error
const badItems: BreadcrumbItem[] = [{ href: '/' }]; // missing label
```

## Documentation Requirements

### README.md

```markdown
# @vaadin/react-components - Breadcrumb

React wrapper for `@vaadin/breadcrumb` web component.

## Installation

```bash
npm install @vaadin/react-components
```

## Basic Usage

```tsx
import { Breadcrumb } from '@vaadin/react-components/Breadcrumb.js';

function App() {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Current Page' }
  ];

  return <Breadcrumb items={items} />;
}
```

## React Router Integration

```tsx
import { useBreadcrumbs } from '@vaadin/react-components/hooks';

const breadcrumbs = useBreadcrumbs(location.pathname, routeConfig);
return <Breadcrumb items={breadcrumbs} />;
```

## Documentation

See [Vaadin Breadcrumb documentation](https://vaadin.com/docs/latest/components/breadcrumb).
```

### JSDoc Comments

```tsx
/**
 * Breadcrumb component for displaying hierarchical navigation.
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Current' }
 *   ]}
 * />
 * ```
 */
export const Breadcrumb: ForwardRefExoticComponent<BreadcrumbProps>;
```

## API Reference

### Breadcrumb Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | `[]` | Array of breadcrumb items |
| `showCurrentPage` | `boolean` | `true` | Show current page in breadcrumb |
| `ariaLabel` | `string` | `'Breadcrumbs'` | Aria label for navigation |
| `overflow` | `'wrap' \| 'scroll' \| 'ellipsis' \| 'dropdown'` | `'wrap'` | Overflow strategy |
| `renderer` | `(item, element) => void` | `undefined` | Custom item renderer |
| `onBreadcrumbItemClick` | `(event) => void` | `undefined` | Item click handler |
| `children` | `ReactNode` | `undefined` | Slot content |
| `className` | `string` | `undefined` | CSS class name |
| `style` | `CSSProperties` | `undefined` | Inline styles |
| `theme` | `string` | `undefined` | Theme variant |

### BreadcrumbItem Interface

```tsx
interface BreadcrumbItem {
  label: string;
  href?: string;
  path?: string;
  disabled?: boolean;
  [key: string]: any; // Custom properties
}
```

### Hooks

#### useBreadcrumbs

```tsx
function useBreadcrumbs(
  pathname: string,
  routeConfig: RouteConfig
): BreadcrumbItem[]
```

Generate breadcrumbs from pathname and route configuration.

#### useNavigationBreadcrumbs

```tsx
function useNavigationBreadcrumbs(): BreadcrumbItem[]
```

Generate breadcrumbs from React Router matches (requires route handles).

#### useBreadcrumbState

```tsx
function useBreadcrumbState(
  initialItems?: BreadcrumbItem[]
): BreadcrumbState
```

Stateful breadcrumb management.

## Best Practices

### 1. Use TypeScript

```tsx
import { Breadcrumb, BreadcrumbItem } from '@vaadin/react-components/Breadcrumb.js';

const items: BreadcrumbItem[] = [
  { label: 'Home', href: '/' }
];
```

### 2. Memoize Items

```tsx
const items = useMemo(() => [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' }
], []);
```

### 3. Handle Navigation Events

```tsx
const handleClick = useCallback((event) => {
  event.preventDefault();
  navigate(event.detail.item.href);
}, [navigate]);
```

### 4. Integrate with Router

```tsx
const breadcrumbs = useBreadcrumbs(location.pathname, routeConfig);
```

### 5. Provide Accessible Labels

```tsx
<Breadcrumb
  items={items}
  ariaLabel="Page navigation"
/>
```

## Migration from Web Component

```tsx
// Before (vanilla JS)
const breadcrumb = document.createElement('vaadin-breadcrumb');
breadcrumb.items = items;
breadcrumb.addEventListener('breadcrumb-item-click', handler);

// After (React)
<Breadcrumb
  items={items}
  onBreadcrumbItemClick={handler}
/>
```

## Performance Considerations

1. **Memoize Items**: Prevent unnecessary re-renders
2. **Use Callbacks**: Wrap event handlers in `useCallback`
3. **Ref Access**: Use refs for imperative operations instead of state
4. **Router Integration**: Use hooks to automatically derive breadcrumbs

## Browser Support

Same as the underlying web component:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Apache License 2.0
