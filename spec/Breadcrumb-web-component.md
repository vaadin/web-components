# Vaadin Breadcrumb Web Component Specification

## Executive Summary

The Breadcrumb component provides hierarchical navigation that helps users understand their location within an application's structure and enables quick navigation to parent sections. This specification defines a phased implementation approach that prioritizes core functionality while maintaining API stability for future enhancements.

## Usage Examples

### Basic Usage

```html
<vaadin-breadcrumb></vaadin-breadcrumb>

<script>
  const breadcrumb = document.querySelector('vaadin-breadcrumb');
  breadcrumb.items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Laptops' }
  ];
</script>
```

### With Router Integration

```html
<vaadin-breadcrumb></vaadin-breadcrumb>

<script>
  const breadcrumb = document.querySelector('vaadin-breadcrumb');

  // Items with router paths - current route is auto-detected
  breadcrumb.items = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Settings', path: '/dashboard/settings' },
    { label: 'Profile', path: '/dashboard/settings/profile' }
  ];
</script>
```

### Custom Separator

```html
<vaadin-breadcrumb>
  <span slot="separator">›</span>
</vaadin-breadcrumb>
```

### With Icons

```html
<vaadin-breadcrumb></vaadin-breadcrumb>

<script>
  breadcrumb.items = [
    {
      label: 'Home',
      href: '/',
      icon: 'vaadin:home' // Using icon identifier for renderer
    },
    { label: 'Documents', href: '/documents' },
    { label: 'Reports' }
  ];

  // Custom renderer for icons
  breadcrumb.renderer = (item, itemElement) => {
    if (item.icon) {
      itemElement.innerHTML = `<vaadin-icon icon="${item.icon}"></vaadin-icon> ${item.label}`;
    } else {
      itemElement.textContent = item.label;
    }
  };
</script>
```

### Overflow with Scrolling

```html
<vaadin-breadcrumb overflow="scroll"></vaadin-breadcrumb>
```

### Excluding Current Page

```html
<vaadin-breadcrumb show-current-page="false"></vaadin-breadcrumb>
```

## Research Summary

### Vaadin Issue #7960 Analysis

The Vaadin web-components repository has an open issue (#7960) that outlines key requirements:

**Core Features Identified:**
- Items API for populating breadcrumbs
- Router integration with automatic current route detection (similar to SideNav)
- Optional inclusion of current view with `aria-current` and `tabindex="-1"`
- Overflow handling (wrapping, scrolling, or dropdown)
- Text clipping with ellipsis before overflow

**Semantic Structure:**
```html
<nav aria-label="breadcrumbs">
  <ol>
    <li><a href="...">Foo</a></li>
    <li><a href="...">Bar</a></li>
    <li><a href="..." aria-current="true" tabindex="-1">Baz</a></li>
  </ol>
</nav>
```

### Component Library Analysis

**Material UI (MUI):**
- Sequential navigation paths
- Theme-aware with light/dark mode
- Customizable separators
- Icon support within items
- Semantic HTML (`nav`, `ol`, `li`)
- Focus management for keyboard navigation

**Ant Design:**
- Hierarchical path visualization
- Item color: `rgba(0,0,0,0.45)`
- Last item color: `rgba(0,0,0,0.88)` for emphasis
- Link hover state with visual feedback
- Separator margin: 8px
- Icon font size: 14px

**Shoelace:**
- Buttons by default (SPA), links via `href`
- Dropdown menu support within items
- Custom separators via slot
- Prefix/suffix slots for icons
- Label property for screen readers

**Chakra UI:**
- Hierarchical navigation paths with separators
- Proper ARIA attributes
- Focus-visible states for keyboard users
- Color mode switching (light/dark)
- Responsive design
- Compact horizontal layout

### Common Patterns Identified

1. **Navigation Structure**: All libraries use semantic HTML (`<nav>`, `<ol>`, `<li>`)
2. **Current Page Indicator**: Visual distinction and `aria-current` attribute
3. **Customizable Separators**: Slot or property-based customization
4. **Icon Support**: Prefix icons for items
5. **Responsive Behavior**: Overflow handling via wrapping, scrolling, or ellipsis
6. **Accessibility**: ARIA landmarks, keyboard navigation, focus management
7. **Theming**: CSS custom properties for colors, spacing, typography

## Implementation Plan

### Phase 1: Core Functionality (MVP)

**Priority: MUST HAVE**

The initial version focuses on essential breadcrumb navigation with a stable API foundation.

#### Features

1. **Items API**
   - Array-based item definition
   - Support for label and href/path
   - Internal item model with standardized properties

2. **Semantic HTML Structure**
   - `<nav>` wrapper with aria-label
   - `<ol>` for ordered list
   - `<li>` for each item
   - `<a>` for links, `<span>` for current page

3. **Current Page Handling**
   - Optional display of current page (default: true)
   - `aria-current="page"` on current item
   - `tabindex="-1"` on current item
   - Visual distinction via state attribute

4. **Basic Overflow: Wrapping**
   - Items wrap to multiple lines naturally
   - Simple, accessible, works everywhere

5. **Customizable Separator**
   - Default separator: `/`
   - Slot-based customization: `<slot name="separator">`
   - CSS part for styling default separator

6. **Accessibility**
   - Semantic HTML structure
   - ARIA landmarks and attributes
   - Keyboard navigation (Tab)
   - Focus management

7. **Theming (Lumo & Aura)**
   - Base styles with CSS custom properties
   - Lumo theme implementation
   - Aura theme implementation
   - State attributes: `current`, `has-items`, `overflow`

#### API Surface (Phase 1)

**Properties:**
```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
  path?: string;
  disabled?: boolean;
}

class Breadcrumb extends HTMLElement {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];

  /** Whether to show the current page in the breadcrumb */
  showCurrentPage: boolean; // default: true

  /** Aria label for the navigation landmark */
  ariaLabel: string; // default: 'Breadcrumbs'
}
```

**Events:**
```typescript
// Fired when a breadcrumb item is clicked
interface BreadcrumbItemClickEvent extends CustomEvent {
  detail: {
    item: BreadcrumbItem;
    index: number;
  };
}
```

**Slots:**
- `separator` - Custom separator between items

**CSS Parts:**
- `base` - The nav wrapper element
- `list` - The ol element
- `item` - Each li element
- `link` - Each anchor element
- `current` - The current page span element
- `separator` - The separator element

**CSS Custom Properties:**
```css
--vaadin-breadcrumb-item-color
--vaadin-breadcrumb-item-font-size
--vaadin-breadcrumb-item-font-weight
--vaadin-breadcrumb-separator-color
--vaadin-breadcrumb-separator-margin
--vaadin-breadcrumb-current-color
--vaadin-breadcrumb-current-font-weight
--vaadin-breadcrumb-link-color
--vaadin-breadcrumb-link-hover-color
--vaadin-breadcrumb-gap
```

**State Attributes:**
- `current` - Applied to current page item
- `has-items` - Applied when items array is not empty

### Phase 2: Enhanced Navigation

**Priority: SHOULD HAVE**

Adds advanced navigation features while maintaining backward compatibility.

#### Features

1. **Router Integration**
   - Automatic current route detection
   - Integration with Vaadin Router (similar to SideNav)
   - Path matching configuration

2. **Item Renderer**
   - Custom rendering function for items
   - Support for complex item content (icons, badges, etc.)
   - Template-based rendering option

3. **Click Event Enhancement**
   - Cancellable navigation
   - Support for custom navigation logic

#### API Additions (Phase 2)

**Properties:**
```typescript
class Breadcrumb extends HTMLElement {
  /** Custom renderer function for items */
  renderer: (item: BreadcrumbItem, itemElement: HTMLElement) => void;

  /** Enable automatic router integration */
  routerIntegration: boolean; // default: false
}
```

**Extended Item Interface:**
```typescript
interface BreadcrumbItem {
  // ... existing properties

  /** Custom data for renderer */
  [key: string]: any;
}
```

### Phase 3: Advanced Overflow Handling

**Priority: COULD HAVE**

Adds sophisticated overflow management for complex navigation hierarchies.

#### Features

1. **Scrolling Overflow**
   - Horizontal scrolling container
   - Optional scroll buttons
   - Automatic scroll on focus
   - Accessible via keyboard

2. **Text Ellipsis**
   - Truncate long item labels
   - Tooltip on hover showing full text
   - Configurable max-width per item

3. **Overflow Dropdown** (Optional)
   - Collapse middle items into dropdown
   - Keep first and last items visible
   - Accessible menu implementation

#### API Additions (Phase 3)

**Properties:**
```typescript
class Breadcrumb extends HTMLElement {
  /** Overflow handling strategy */
  overflow: 'wrap' | 'scroll' | 'ellipsis' | 'dropdown'; // default: 'wrap'

  /** Show scroll buttons when overflow is 'scroll' */
  showScrollButtons: boolean; // default: true

  /** Maximum width for item labels when overflow is 'ellipsis' */
  itemMaxWidth: string; // CSS value, e.g., '200px'
}
```

**CSS Parts Additions:**
- `scroll-container` - Container for scrolling content
- `scroll-button` - Scroll navigation buttons
- `overflow-button` - Dropdown button for collapsed items
- `overflow-menu` - Dropdown menu for collapsed items

**State Attributes:**
- `overflow` - Applied when content overflows
- `overflow-start` - Applied when scrolled to start
- `overflow-end` - Applied when scrolled to end

## Component Architecture

### File Structure

```
packages/breadcrumb/
├── package.json
├── README.md
├── LICENSE
├── vaadin-breadcrumb.js (export)
├── vaadin-breadcrumb.d.ts (types)
├── src/
│   ├── vaadin-breadcrumb.js (main element)
│   ├── vaadin-breadcrumb-styles.js (base styles)
│   └── vaadin-breadcrumb-mixin.js (optional, if needed)
├── test/
│   ├── breadcrumb.test.js (unit tests)
│   ├── dom/__snapshots__/ (DOM snapshots)
│   ├── visual/lumo/ (Lumo visual tests)
│   └── visual/aura/ (Aura visual tests)
└── theme/
    ├── lumo/
    │   └── vaadin-breadcrumb-styles.js
    └── aura/
        └── vaadin-breadcrumb-styles.js
```

### Class Implementation

```typescript
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

class Breadcrumb extends ElementMixin(ThemableMixin(LitElement)) {
  static get is() {
    return 'vaadin-breadcrumb';
  }

  static get properties() {
    return {
      items: { type: Array },
      showCurrentPage: {
        type: Boolean,
        attribute: 'show-current-page',
        reflect: true
      },
      ariaLabel: {
        type: String,
        attribute: 'aria-label'
      },
      overflow: {
        type: String,
        reflect: true
      }
    };
  }

  constructor() {
    super();
    this.items = [];
    this.showCurrentPage = true;
    this.ariaLabel = 'Breadcrumbs';
    this.overflow = 'wrap';
  }

  render() {
    return html`
      <nav part="base" aria-label="${this.ariaLabel}">
        <ol part="list">
          ${this._renderItems()}
        </ol>
      </nav>
    `;
  }

  _renderItems() {
    // Implementation details
  }

  _handleItemClick(event, item, index) {
    // Dispatch custom event
  }
}

defineCustomElement(Breadcrumb);

export { Breadcrumb };
```

### Shadow DOM Structure

```html
<vaadin-breadcrumb>
  #shadow-root
    <nav part="base" aria-label="Breadcrumbs">
      <ol part="list">
        <li part="item">
          <a part="link" href="/">Home</a>
        </li>
        <li part="item">
          <span part="separator" aria-hidden="true">
            <slot name="separator">/</slot>
          </span>
        </li>
        <li part="item">
          <a part="link" href="/products">Products</a>
        </li>
        <li part="item">
          <span part="separator" aria-hidden="true">
            <slot name="separator">/</slot>
          </span>
        </li>
        <li part="item">
          <span part="current" aria-current="page" tabindex="-1">
            Laptops
          </span>
        </li>
      </ol>
    </nav>
</vaadin-breadcrumb>
```

## Accessibility Requirements

### WCAG 2.1 Compliance

**Level A:**
- ✅ Semantic HTML structure (`nav`, `ol`, `li`)
- ✅ Text alternatives for icons
- ✅ Keyboard accessible
- ✅ Focus visible

**Level AA:**
- ✅ Color contrast ratios (4.5:1 for normal text, 3:1 for large text)
- ✅ Focus indicators meet contrast requirements
- ✅ Consistent navigation

**Level AAA:**
- ✅ Enhanced focus indicators (2px minimum)

### ARIA Implementation

**Landmarks:**
```html
<nav aria-label="Breadcrumbs">
```

**Current Page:**
```html
<span aria-current="page" tabindex="-1">Current Page</span>
```

**Separator:**
```html
<span aria-hidden="true">/</span>
```

### Keyboard Navigation

- **Tab**: Move focus between breadcrumb links
- **Enter**: Activate focused link
- **Skip current page**: Current page has `tabindex="-1"`

### Screen Reader Support

**Announcements:**
- "Navigation, Breadcrumbs"
- "Link, Home, 1 of 4"
- "Link, Products, 2 of 4"
- "Current page, Laptops, 4 of 4"

## Theming

### Lumo Theme

**Color Scheme:**
```css
:host {
  --vaadin-breadcrumb-item-color: var(--lumo-secondary-text-color);
  --vaadin-breadcrumb-link-color: var(--lumo-primary-text-color);
  --vaadin-breadcrumb-link-hover-color: var(--lumo-primary-color);
  --vaadin-breadcrumb-current-color: var(--lumo-body-text-color);
  --vaadin-breadcrumb-separator-color: var(--lumo-tertiary-text-color);
}
```

**Typography:**
```css
:host {
  --vaadin-breadcrumb-item-font-size: var(--lumo-font-size-s);
  --vaadin-breadcrumb-item-font-weight: 400;
  --vaadin-breadcrumb-current-font-weight: 600;
}
```

**Spacing:**
```css
:host {
  --vaadin-breadcrumb-separator-margin: var(--lumo-space-xs);
  --vaadin-breadcrumb-gap: 0;
}
```

### Aura Theme

**Modern Color System (oklch):**
```css
:host {
  --vaadin-breadcrumb-item-color: light-dark(
    oklch(0.5 0.05 240),
    oklch(0.7 0.05 240)
  );
  --vaadin-breadcrumb-link-color: light-dark(
    var(--aura-primary-color),
    var(--aura-primary-color-light)
  );
  --vaadin-breadcrumb-current-color: light-dark(
    var(--aura-text-color),
    var(--aura-text-color-dark)
  );
}
```

**Enhanced Typography:**
```css
:host {
  --vaadin-breadcrumb-item-font-size: 0.875rem;
  --vaadin-breadcrumb-current-font-weight: 500;
}
```

**Modern Spacing:**
```css
:host {
  --vaadin-breadcrumb-separator-margin: 0.5rem;
  --vaadin-breadcrumb-gap: 0;
}
```

### Forced Colors Mode (Windows High Contrast)

```css
@media (forced-colors: active) {
  [part="link"] {
    color: LinkText;
  }

  [part="link"]:hover {
    color: LinkText;
    text-decoration: underline;
  }

  [part="current"] {
    color: CanvasText;
    font-weight: bold;
  }

  [part="separator"] {
    color: GrayText;
  }
}
```

## Testing Strategy

### Unit Tests

**Property Tests:**
- Setting and getting `items` array
- `showCurrentPage` toggling
- `ariaLabel` customization
- `overflow` mode changes

**Rendering Tests:**
- Items render correctly
- Custom separator renders
- Current page handling
- Empty state handling

**Event Tests:**
- `breadcrumb-item-click` fires with correct detail
- Click event propagation
- Cancellable navigation

**Accessibility Tests:**
- ARIA attributes are correct
- Keyboard navigation works
- Focus management
- Screen reader structure

### DOM Snapshot Tests

**Scenarios:**
- Default state with items
- Empty state
- Custom separator
- Without current page
- With disabled items
- Different overflow modes

### Visual Tests

**Lumo Theme:**
- Default appearance
- Hover states
- Focus states
- Long text handling
- Multiple lines
- Dark mode variant

**Aura Theme:**
- Default appearance
- Hover states
- Focus states
- Automatic light-dark switching
- Long text handling

**Responsive:**
- Mobile breakpoint
- Tablet breakpoint
- Desktop breakpoint

## Documentation Requirements

### README.md

```markdown
# @vaadin/breadcrumb

A web component for displaying hierarchical navigation breadcrumbs.

## Installation

```bash
npm install @vaadin/breadcrumb
```

## Usage

```html
<vaadin-breadcrumb></vaadin-breadcrumb>

<script type="module">
  import '@vaadin/breadcrumb';

  const breadcrumb = document.querySelector('vaadin-breadcrumb');
  breadcrumb.items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Laptops' }
  ];
</script>
```

## API

See [API documentation](https://vaadin.com/docs/latest/components/breadcrumb).

## License

Apache License 2.0
```

### JSDoc Comments

**Component:**
```typescript
/**
 * `<vaadin-breadcrumb>` is a web component for displaying hierarchical
 * navigation breadcrumbs.
 *
 * ```html
 * <vaadin-breadcrumb></vaadin-breadcrumb>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ------------|-------------
 * `base`      | The nav wrapper element
 * `list`      | The ol element
 * `item`      | Each li element
 * `link`      | Each anchor element
 * `current`   | The current page span element
 * `separator` | The separator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute     | Description
 * --------------|-------------
 * `current`     | Applied to current page item
 * `has-items`   | Applied when items array is not empty
 * `overflow`    | Applied when content overflows
 *
 * ### Custom Properties
 *
 * The following custom CSS properties are available:
 *
 * Property                                    | Description
 * --------------------------------------------|-------------
 * `--vaadin-breadcrumb-item-color`           | Item text color
 * `--vaadin-breadcrumb-link-color`           | Link color
 * `--vaadin-breadcrumb-link-hover-color`     | Link hover color
 * `--vaadin-breadcrumb-current-color`        | Current page color
 * `--vaadin-breadcrumb-separator-color`      | Separator color
 * `--vaadin-breadcrumb-separator-margin`     | Separator margin
 *
 * @fires {BreadcrumbItemClickEvent} breadcrumb-item-click - Fired when item is clicked
 *
 * @customElement
 * @extends HTMLElement
 */
```

## Documentation Site Content (vaadin.com/docs)

### Overview Page

**Title:** Breadcrumb

**Summary:** "Breadcrumb is a navigation component that shows the user's location in an application's hierarchical structure and enables navigation to parent sections."

**When to Use:**
- Multi-level navigation hierarchies
- E-commerce category navigation
- Documentation sites
- Application settings and admin panels
- File system navigation

**When Not to Use:**
- Single-level navigation (use Tabs or Menu instead)
- Primary navigation (use App Layout with Menu/SideNav)
- When there are more than 7 levels (consider alternative navigation)

### Features Page

**Sections:**

1. **Items API**
   - How to populate breadcrumbs
   - Item properties (label, href, path)
   - Programmatic item management

2. **Current Page**
   - Automatic current page detection
   - Optional inclusion/exclusion
   - Accessibility considerations

3. **Custom Separators**
   - Using the separator slot
   - Icon separators
   - Custom characters

4. **Router Integration**
   - Automatic route detection
   - Path matching
   - SPA navigation

5. **Overflow Handling**
   - Wrapping (default)
   - Scrolling with buttons
   - Text ellipsis
   - Dropdown menu (future)

### Styling Page

**Sections:**

1. **CSS Custom Properties**
   - Complete list with examples
   - Lumo theme defaults
   - Aura theme defaults

2. **Shadow Parts**
   - Available parts
   - Styling examples
   - Common use cases

3. **State Attributes**
   - When they're applied
   - Styling examples

4. **Examples**
   - Custom colors
   - Custom spacing
   - Custom typography
   - Dark mode

### Accessibility Page

**Sections:**

1. **Semantic Structure**
   - HTML structure explanation
   - ARIA implementation

2. **Keyboard Navigation**
   - Supported keys
   - Focus management

3. **Screen Reader Support**
   - Announcements
   - Landmarks

4. **Best Practices**
   - Descriptive labels
   - Meaningful hierarchy
   - Avoiding deep nesting

### API Reference

Auto-generated from JSDoc comments with:
- Properties table
- Events table
- Slots table
- CSS Parts table
- CSS Custom Properties table
- TypeScript definitions

## Migration Considerations

### From Other Solutions

**For users migrating from custom implementations:**
- Provide conversion guide for common patterns
- Highlight automatic accessibility features
- Document theming advantages

**For users of third-party add-ons:**
- API comparison table
- Feature parity checklist
- Migration examples

## Performance Considerations

1. **Rendering Optimization**
   - Efficient item rendering using Lit's repeat directive
   - Avoid unnecessary re-renders

2. **Large Item Lists**
   - Virtual scrolling not needed (breadcrumbs typically < 10 items)
   - Warn about usability if > 7 levels

3. **Memory Management**
   - Clean up event listeners
   - Proper controller lifecycle

## Future Enhancements (Beyond Phase 3)

**Potential Features:**
- Breadcrumb templates for common patterns
- Integration with other Vaadin components (App Layout)
- Animation transitions between breadcrumb states
- Mobile-optimized dropdown variant
- RTL (Right-to-Left) language support
- Breadcrumb presets for common hierarchies

**API Stability:**
All future enhancements must maintain backward compatibility with Phase 1 API.

## Open Questions

1. **Disabled Items**: What's the use case? Should we support it?
   - **Recommendation**: Skip for Phase 1, add if users request it

2. **Max Depth**: Should we enforce a maximum breadcrumb depth?
   - **Recommendation**: Document best practices (max 7 levels) but don't enforce

3. **Dropdown Overflow**: Is this worth the complexity?
   - **Recommendation**: Defer to Phase 3 or later, gather user feedback first

4. **Animation**: Should breadcrumb changes be animated?
   - **Recommendation**: Skip for MVP, consider for Phase 3

## Success Metrics

**Adoption:**
- Usage in Vaadin apps
- Community feedback and issues
- Third-party integration examples

**Quality:**
- Test coverage > 90%
- Zero accessibility violations
- Theme consistency with other components

**Performance:**
- Render time < 16ms for 10 items
- Memory footprint < 100KB

## References

- [Vaadin Issue #7960](https://github.com/vaadin/web-components/issues/7960)
- [WCAG 2.1 Breadcrumb Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)
- [Material UI Breadcrumbs](https://mui.com/material-ui/react-breadcrumbs/)
- [Ant Design Breadcrumb](https://ant.design/components/breadcrumb)
- [Shoelace Breadcrumb](https://shoelace.style/components/breadcrumb)
- [Vaadin Web Components Guidelines](https://github.com/vaadin/web-components/blob/guidelines/WEB_COMPONENT_GUIDELINES.md)
