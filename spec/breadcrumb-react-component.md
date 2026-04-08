# Vaadin Breadcrumb React Component — Implementation Spec

## Overview

React wrapper for `<vaadin-breadcrumb>` and `<vaadin-breadcrumb-item>` web components, following the patterns established in the `@vaadin/react-components` package.

## Usage Examples

### Basic Usage

```tsx
import { Breadcrumb, BreadcrumbItem } from '@vaadin/react-components';

function App() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem href="/products/widgets">Widgets</BreadcrumbItem>
      <BreadcrumbItem>Sprocket</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

### With Items Property

```tsx
import { Breadcrumb } from '@vaadin/react-components';

function App() {
  const items = [
    { text: 'Home', href: '/' },
    { text: 'Products', href: '/products' },
    { text: 'Widgets', href: '/products/widgets' },
    { text: 'Sprocket' },
  ];

  return <Breadcrumb items={items} />;
}
```

### Responsive Overflow

Overflow is automatic — items are hidden based on available width in priority order (current, parent, root, then remaining ancestors). Hidden items are accessible via an overflow popover.

```tsx
<div style={{ width: '400px' }}>
  <Breadcrumb>
    <BreadcrumbItem href="/">Home</BreadcrumbItem>
    <BreadcrumbItem href="/products">Products</BreadcrumbItem>
    <BreadcrumbItem href="/products/widgets">Widgets</BreadcrumbItem>
    <BreadcrumbItem href="/products/widgets/sprockets">Sprockets</BreadcrumbItem>
    <BreadcrumbItem>Turbo Sprocket</BreadcrumbItem>
  </Breadcrumb>
</div>
{/* At 400px: Home / ... / Sprockets / Turbo Sprocket */}
```

### With Router Integration (React Router)

```tsx
import { Breadcrumb, BreadcrumbItem } from '@vaadin/react-components';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const handleItemClick = (e: BreadcrumbItemClickEvent) => {
    e.preventDefault();
    navigate(e.detail.item.href);
  };

  return (
    <Breadcrumb onItemClick={handleItemClick}>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem>Widgets</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

### With Icons

```tsx
import { Breadcrumb, BreadcrumbItem, Icon } from '@vaadin/react-components';

function App() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="/">
        <Icon icon="vaadin:home" slot="prefix" />
        Home
      </BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem>Widgets</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

---

## Implementation Plan

### Phase 1: Core React Wrappers (Aligned with Web Component Phase 1)

#### Components to Generate

The React wrappers are auto-generated from the web component's `web-types.json` using the existing `@vaadin/react-components` generation tooling.

**`Breadcrumb`** — wraps `<vaadin-breadcrumb>`

| React Prop | Type | Maps to |
|---|---|---|
| `items` | `BreadcrumbItemConfig[]` | `items` property |
| `label` | `string` | `label` property / `aria-label` |
| `children` | `ReactNode` | Default slot |
| `className` | `string` | `class` attribute |
| `style` | `CSSProperties` | `style` attribute |

**`BreadcrumbItem`** — wraps `<vaadin-breadcrumb-item>`

| React Prop | Type | Maps to |
|---|---|---|
| `href` | `string` | `href` property |
| `disabled` | `boolean` | `disabled` property |
| `children` | `ReactNode` | Default slot |
| `className` | `string` | `class` attribute |
| `style` | `CSSProperties` | `style` attribute |

#### TypeScript Types

```typescript
interface BreadcrumbItemConfig {
  text: string;
  href?: string;
  disabled?: boolean;
}

interface BreadcrumbElement extends HTMLElement {
  items: BreadcrumbItemConfig[] | undefined;
  label: string;
}

interface BreadcrumbItemElement extends HTMLElement {
  href: string | undefined;
  disabled: boolean;
}
```

#### Files

Following `@vaadin/react-components` patterns:
- `src/Breadcrumb.tsx` — generated wrapper
- `src/BreadcrumbItem.tsx` — generated wrapper
- Export from package index

### Phase 2: Events (Aligned with Web Component Phase 3)

| React Prop | Type | Maps to |
|---|---|---|
| `onItemClick` | `(e: BreadcrumbItemClickEvent) => void` | `item-click` event |

```typescript
interface BreadcrumbItemClickEvent extends CustomEvent {
  detail: {
    item: BreadcrumbItemConfig;
    originalEvent: MouseEvent;
  };
}
```

---

## Testing

React-specific tests following `@vaadin/react-components` test patterns:

- Component renders correctly
- Props map to web component properties/attributes
- Slotted children render in correct slots
- Event callbacks fire with correct detail
- TypeScript types compile correctly
- SSR compatibility (if applicable)

---

## Documentation Plan (vaadin.com/docs)

The React documentation should mirror the web component docs with React-specific examples:

1. All code examples use JSX/TSX syntax
2. Event handling examples use React patterns (`onItemClick` callback)
3. Router integration example uses React Router
4. State management examples show controlled component patterns with `useState`
5. Include a note about the underlying web component for advanced customization
