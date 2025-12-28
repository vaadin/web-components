# ToggleButtonGroup Web Component Specification

## Overview

The `<vaadin-toggle-button-group>` component provides a group of toggle buttons for single or multiple selection. It offers a direct-action mechanism where selections take effect immediately, distinguishing it from radio buttons and checkboxes which typically require form submission.

### Motivation

Based on [GitHub issue #4206](https://github.com/vaadin/web-components/issues/4206), users need a toggle button group component that:
- Supports both mutually-exclusive selection (radio button behavior) and multi-select (checkbox behavior)
- Provides immediate visual feedback and action
- Offers better semantics for direct-action controls vs. form submission
- Works well for toolbar controls, view switchers, and filter selections

An existing community add-on by Soroosh Taefi demonstrates demand, but only supports single selection. This official implementation will support both modes with full accessibility and theming.

### Industry Patterns

Analysis of major component libraries shows:
- **Material UI**: `ToggleButtonGroup` with `exclusive` prop (boolean) for single/multiple selection
- **Ant Design**: `Segmented` component for single selection with visual emphasis
- **React Aria**: Individual `ToggleButton` with comprehensive accessibility
- **Chakra UI**: `SegmentedControl` for grouped options

## Usage Examples

### Single Selection (Exclusive Mode)

```html
<!-- Text alignment toolbar -->
<vaadin-toggle-button-group value="left">
  <vaadin-toggle-button value="left">
    <vaadin-icon icon="vaadin:align-left"></vaadin-icon>
  </vaadin-toggle-button>
  <vaadin-toggle-button value="center">
    <vaadin-icon icon="vaadin:align-center"></vaadin-icon>
  </vaadin-toggle-button>
  <vaadin-toggle-button value="right">
    <vaadin-icon icon="vaadin:align-right"></vaadin-icon>
  </vaadin-toggle-button>
  <vaadin-toggle-button value="justify" disabled>
    <vaadin-icon icon="vaadin:align-justify"></vaadin-icon>
  </vaadin-toggle-button>
</vaadin-toggle-button-group>

<script>
  const group = document.querySelector('vaadin-toggle-button-group');
  group.addEventListener('value-changed', (e) => {
    console.log('Selected:', e.detail.value); // 'left', 'center', 'right'
  });
</script>
```

### Multiple Selection (Non-Exclusive Mode)

```html
<!-- Text formatting toolbar -->
<vaadin-toggle-button-group multiple value='["bold","italic"]'>
  <vaadin-toggle-button value="bold">
    <vaadin-icon icon="vaadin:bold"></vaadin-icon>
  </vaadin-toggle-button>
  <vaadin-toggle-button value="italic">
    <vaadin-icon icon="vaadin:italic"></vaadin-icon>
  </vaadin-toggle-button>
  <vaadin-toggle-button value="underline">
    <vaadin-icon icon="vaadin:underline"></vaadin-icon>
  </vaadin-toggle-button>
</vaadin-toggle-button-group>

<script>
  const group = document.querySelector('vaadin-toggle-button-group');
  group.addEventListener('value-changed', (e) => {
    console.log('Selected:', e.detail.value); // ['bold', 'italic']
  });
</script>
```

### View Switcher

```html
<!-- Dashboard view switcher -->
<vaadin-toggle-button-group value="grid">
  <vaadin-toggle-button value="list">
    <vaadin-icon icon="vaadin:list"></vaadin-icon>
    List
  </vaadin-toggle-button>
  <vaadin-toggle-button value="grid">
    <vaadin-icon icon="vaadin:grid"></vaadin-icon>
    Grid
  </vaadin-toggle-button>
  <vaadin-toggle-button value="chart">
    <vaadin-icon icon="vaadin:chart"></vaadin-icon>
    Chart
  </vaadin-toggle-button>
</vaadin-toggle-button-group>
```

### Vertical Orientation

```html
<!-- Sidebar filter controls -->
<vaadin-toggle-button-group orientation="vertical" multiple>
  <vaadin-toggle-button value="new">New Items</vaadin-toggle-button>
  <vaadin-toggle-button value="featured">Featured</vaadin-toggle-button>
  <vaadin-toggle-button value="sale">On Sale</vaadin-toggle-button>
</vaadin-toggle-button-group>
```

### Read-Only and Disabled States

```html
<!-- Read-only display -->
<vaadin-toggle-button-group value="center" readonly>
  <vaadin-toggle-button value="left">Left</vaadin-toggle-button>
  <vaadin-toggle-button value="center">Center</vaadin-toggle-button>
  <vaadin-toggle-button value="right">Right</vaadin-toggle-button>
</vaadin-toggle-button-group>

<!-- Disabled group -->
<vaadin-toggle-button-group disabled>
  <vaadin-toggle-button value="option1">Option 1</vaadin-toggle-button>
  <vaadin-toggle-button value="option2">Option 2</vaadin-toggle-button>
</vaadin-toggle-button-group>
```

## Component API

### `<vaadin-toggle-button-group>`

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string \| string[]` | `''` or `[]` | Selected value(s). String for single selection, array for multiple. |
| `multiple` | `boolean` | `false` | When true, allows multiple buttons to be selected simultaneously. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of the button group. |
| `disabled` | `boolean` | `false` | Disables the entire group and all child buttons. |
| `readonly` | `boolean` | `false` | Makes the group read-only. Selection state visible but not changeable. |
| `required` | `boolean` | `false` | Indicates at least one option must be selected for form validation. |

#### Events

| Event | Type | Description |
|-------|------|-------------|
| `value-changed` | `CustomEvent<{ value: string \| string[] }>` | Fired when selection changes. Detail contains new value. |
| `validated` | `CustomEvent<{ valid: boolean }>` | Fired after validation state changes. |

#### Methods

| Method | Description |
|--------|-------------|
| `validate()` | Returns `true` if required constraint is satisfied. |
| `checkValidity()` | Returns `true` if the element meets all constraint validation. |

#### CSS Shadow Parts

| Part | Description |
|------|-------------|
| `group-container` | The container wrapping all toggle buttons |

#### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--vaadin-toggle-button-group-spacing` | `0` | Spacing between buttons |

### `<vaadin-toggle-button>`

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `''` | The value associated with this button. Required for selection tracking. |
| `selected` | `boolean` | `false` | Whether this button is currently selected. Managed by parent group. |
| `disabled` | `boolean` | `false` | Disables this specific button. |
| `ariaLabel` | `string` | `undefined` | Accessible label for the button (overrides text content). |

#### Slots

| Slot | Description |
|------|-------------|
| (default) | Button content (text, icons, or both) |
| `prefix` | Content before the main button content |
| `suffix` | Content after the main button content |

#### CSS Shadow Parts

| Part | Description |
|------|-------------|
| `button` | The native button element |
| `label` | The label wrapper containing default slot content |
| `prefix` | Container for prefix slot |
| `suffix` | Container for suffix slot |

#### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--vaadin-toggle-button-background` | Theme-dependent | Background color of button |
| `--vaadin-toggle-button-background-selected` | Theme-dependent | Background color when selected |
| `--vaadin-toggle-button-color` | Theme-dependent | Text color |
| `--vaadin-toggle-button-color-selected` | Theme-dependent | Text color when selected |
| `--vaadin-toggle-button-border-color` | Theme-dependent | Border color |
| `--vaadin-toggle-button-border-radius` | Theme-dependent | Border radius for first/last buttons |

## DOM Structure

### Light DOM

```html
<vaadin-toggle-button-group>
  <vaadin-toggle-button value="option1">Option 1</vaadin-toggle-button>
  <vaadin-toggle-button value="option2">Option 2</vaadin-toggle-button>
  <vaadin-toggle-button value="option3">Option 3</vaadin-toggle-button>
</vaadin-toggle-button-group>
```

### Shadow DOM Structure

#### `<vaadin-toggle-button-group>` Shadow DOM

```html
<div part="group-container" role="group" aria-labelledby="[label-id]">
  <slot></slot>
</div>
```

#### `<vaadin-toggle-button>` Shadow DOM

```html
<button
  part="button"
  type="button"
  role="button"
  aria-pressed="[true|false]"
  disabled="[if disabled]"
>
  <span part="prefix">
    <slot name="prefix"></slot>
  </span>
  <span part="label">
    <slot></slot>
  </span>
  <span part="suffix">
    <slot name="suffix"></slot>
  </span>
</button>
```

## State Attributes

### `<vaadin-toggle-button-group>`

- `disabled` - Applied when disabled=true
- `readonly` - Applied when readonly=true
- `orientation="horizontal|vertical"` - Reflects current orientation
- `invalid` - Applied when required validation fails

### `<vaadin-toggle-button>`

- `selected` - Applied when button is selected
- `disabled` - Applied when button is disabled
- `focus-ring` - Applied when focused via keyboard
- `focused` - Applied when button has focus

## Accessibility

### ARIA Roles and Attributes

#### Group Level
- Default role: `group` (or `toolbar` for icon-only buttons)
- `aria-labelledby` or `aria-label` for group description
- `aria-required="true"` when required=true
- `aria-orientation` matches orientation property

#### Button Level
- Role: `button`
- `aria-pressed` reflects selected state (true/false)
- `aria-disabled` when disabled=true
- Each button must have accessible text via content or aria-label

### Keyboard Navigation

**Within group (when focused):**
- `Tab` / `Shift+Tab` - Navigate to/from the group (roving tabindex pattern)
- `Arrow Right` / `Arrow Down` - Move focus to next button
- `Arrow Left` / `Arrow Up` - Move focus to previous button
- `Home` - Focus first button
- `End` - Focus last button

**On focused button:**
- `Space` / `Enter` - Toggle selection state
- In single-selection mode: selecting a button deselects others

### Focus Management

Implements roving tabindex pattern:
- Only one button in group is tabbable at a time (tabindex="0")
- Other buttons have tabindex="-1"
- Selected button is tabbable; if none selected, first enabled button is tabbable
- Focus follows keyboard arrow navigation

## Validation

### Required Validation

When `required=true`:
- Single selection mode: At least one button must be selected
- Multiple selection mode: At least one button must be selected
- Validation runs on value change
- Invalid state reflected via `invalid` attribute and `validated` event

## Selection Behavior

### Single Selection (multiple=false)

- Only one button can be selected at a time
- Clicking selected button can deselect it (making value empty)
- Setting value programmatically to `''` deselects all
- `value` property is a string

### Multiple Selection (multiple=true)

- Any number of buttons can be selected
- Clicking a selected button deselects it
- `value` property is an array of strings
- Setting value to `[]` deselects all

### Parent-Child Synchronization

- Parent group manages child button `selected` states
- Child buttons dispatch selection events to parent
- Parent updates `value` property and fires `value-changed`
- Changes to group `value` property update child `selected` attributes

## Theming

### Lumo Theme

**Default Appearance:**
- Buttons appear as connected segments with shared borders
- First button: rounded left corners (horizontal) or top corners (vertical)
- Last button: rounded right corners (horizontal) or bottom corners (vertical)
- Middle buttons: square corners
- Selected state: distinct background and text color (primary color)
- Hover state: subtle background change
- Focus ring: visible focus indicator

**Size Variants:**
```html
<vaadin-toggle-button-group theme="small">...</vaadin-toggle-button-group>
<vaadin-toggle-button-group>...</vaadin-toggle-button-group>
<vaadin-toggle-button-group theme="large">...</vaadin-toggle-button-group>
```

**Color Variants (selected state):**
```html
<vaadin-toggle-button-group theme="primary">...</vaadin-toggle-button-group>
<vaadin-toggle-button-group theme="success">...</vaadin-toggle-button-group>
<vaadin-toggle-button-group theme="error">...</vaadin-toggle-button-group>
<vaadin-toggle-button-group theme="contrast">...</vaadin-toggle-button-group>
```

### Aura Theme

Follows modern CSS patterns with:
- `:is()` and `:where()` selectors for efficient styling
- `light-dark()` for automatic dark mode support
- `oklch()` color space for perceptually uniform colors
- Smooth transitions for state changes

## Implementation Plan

### Phase 1: Core Functionality (MVP)

**Scope:**
- Basic `<vaadin-toggle-button-group>` and `<vaadin-toggle-button>` components
- Single selection mode (multiple=false)
- Horizontal orientation only
- Basic properties: value, disabled
- Value change events
- Shadow DOM structure with parts
- Basic Lumo theme styles
- Keyboard navigation (arrows, space/enter)
- Basic accessibility (ARIA roles, aria-pressed)

**Architecture:**
```
ToggleButtonGroupMixin → ElementMixin → ThemableMixin → LitElement
ToggleButtonMixin → ActiveMixin → FocusMixin → TabindexMixin → ElementMixin → ThemableMixin → LitElement
```

**Key Mixins:**
- `ToggleButtonGroupMixin`: Core group logic, value management, child button coordination
- `ToggleButtonMixin`: Individual button logic, selection state
- `ActiveMixin`: Handles active state on interaction
- `FocusMixin`: Focus management and focus-ring
- `TabindexMixin`: Roving tabindex implementation

**Files:**
```
packages/toggle-button-group/
├── vaadin-toggle-button-group.js
├── vaadin-toggle-button.js
├── src/
│   ├── vaadin-toggle-button-group.js
│   ├── vaadin-toggle-button-group-mixin.js
│   ├── vaadin-toggle-button.js
│   ├── vaadin-toggle-button-mixin.js
│   └── styles/
│       ├── vaadin-toggle-button-group-base-styles.js
│       └── vaadin-toggle-button-base-styles.js
├── theme/
│   └── lumo/
│       ├── vaadin-toggle-button-group-styles.js
│       └── vaadin-toggle-button-styles.js
└── test/
    ├── toggle-button-group.test.ts
    ├── toggle-button.test.ts
    ├── dom/
    │   └── toggle-button-group.test.js
    └── visual/
        └── lumo/
            └── toggle-button-group.test.js
```

**Success Criteria:**
- Single selection works correctly with keyboard and mouse
- Proper focus management with roving tabindex
- Value changes fire events with correct detail
- Disabled state prevents interaction
- Basic WCAG 2.1 AA compliance
- Visual regression tests pass for Lumo theme

### Phase 2: Multiple Selection & Validation

**Scope:**
- Multiple selection mode (multiple=true)
- Array-based value handling
- Required validation
- `readonly` property
- `validate()` and `checkValidity()` methods
- `validated` event
- Invalid state styling
- Enhanced accessibility for multi-select

**API Additions:**
- `multiple` property
- `required` property
- `readonly` property
- Validation methods
- `validated` event

**Success Criteria:**
- Multiple selection mode works correctly
- Value array updates properly
- Required validation enforces at least one selection
- Readonly state displays correctly without allowing changes
- Validation events fire appropriately

### Phase 3: Orientation & Advanced Features

**Scope:**
- Vertical orientation support
- Enhanced keyboard navigation for vertical mode
- Size variants (small, default, large)
- Color theme variants (primary, success, error, contrast)
- Complete Aura theme implementation
- Prefix/suffix slots for buttons
- Enhanced documentation and examples

**API Additions:**
- `orientation` property
- `theme` attribute variants
- `prefix` and `suffix` slots on buttons

**Success Criteria:**
- Vertical orientation renders and behaves correctly
- Keyboard navigation adapts to orientation (up/down arrows)
- Theme variants apply correctly in both Lumo and Aura
- All size variants work in both themes
- Visual regression tests cover all variants

### Phase 4: Polish & Edge Cases

**Scope:**
- Performance optimization for large button groups
- Enhanced error messages and warnings
- Edge case handling (dynamic button addition/removal)
- Complete TypeScript type coverage
- Comprehensive test coverage (>90%)
- Complete accessibility audit
- Documentation site integration

**Success Criteria:**
- Performance benchmarks meet standards
- All edge cases handled gracefully
- TypeScript types fully accurate
- Test coverage exceeds 90%
- WCAG 2.1 AA compliance verified
- Documentation complete with interactive examples

## Testing Strategy

### Unit Tests

**ToggleButtonGroup:**
- Value property synchronization with selected buttons
- Single vs multiple selection modes
- Value-changed event firing
- Disabled state propagation to children
- Required validation logic
- Keyboard navigation and focus management
- Dynamic button addition/removal

**ToggleButton:**
- Selected state management
- Click/keyboard interaction
- Disabled state
- Value property requirement
- Slot content rendering
- ARIA attribute correctness

### Integration Tests

- Parent-child communication
- Roving tabindex behavior
- Form integration and validation
- Theme variant application
- Orientation switching

### Visual Regression Tests

**Lumo Theme:**
- Default state
- Selected state (single and multiple)
- Hover state
- Focus state
- Disabled state
- Readonly state
- Invalid state
- All size variants
- All color variants
- Horizontal and vertical orientations

**Aura Theme:**
- Same coverage as Lumo
- Dark mode variants

### Accessibility Tests

- ARIA roles and attributes
- Keyboard navigation flow
- Focus management
- Screen reader announcements
- Color contrast ratios
- Focus indicator visibility

## Browser Support

Aligned with Vaadin web components standards:
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions

Aura theme requires modern CSS features (oklch, light-dark, :is/:where).

## Migration from Community Add-on

For users of the existing toggle-button-group add-on:

**API Compatibility:**
- Similar value property and change events
- Single selection behavior matches
- Orientation property compatible
- Disabled state compatible

**Breaking Changes:**
- Different package name: `@vaadin/toggle-button-group` instead of add-on
- Different element names: `<vaadin-toggle-button-group>` vs add-on names
- Multiple selection uses array value instead of add-on approach
- Theme integration uses Vaadin 24+ theming system

**Migration Path:**
1. Update imports to official package
2. Update element names in templates
3. Convert multi-select logic to use array values if needed
4. Update theme customizations to use new CSS parts/properties
5. Test keyboard navigation (may have enhanced behavior)

## Documentation Plan

### vaadin.com/docs Integration

#### Component Overview Page

**Sections:**
1. **Introduction**
   - What is a toggle button group
   - When to use vs radio buttons/checkboxes
   - Common use cases (toolbars, view switchers, filters)

2. **Basic Usage**
   - Single selection example with code
   - Multiple selection example with code
   - Handling value changes

3. **Selection Modes**
   - Exclusive mode (single selection)
   - Non-exclusive mode (multiple selection)
   - Allowing deselection vs requiring selection

4. **Layout**
   - Horizontal orientation (default)
   - Vertical orientation
   - Responsive considerations

5. **Content**
   - Text labels
   - Icon-only buttons
   - Icon + text combination
   - Using prefix/suffix slots

6. **States**
   - Disabled group
   - Disabled individual buttons
   - Readonly mode
   - Required validation

7. **Styling**
   - Theme variants (size, color)
   - CSS custom properties
   - Shadow parts
   - Custom styling examples

8. **Accessibility**
   - ARIA implementation
   - Keyboard navigation
   - Screen reader support
   - Best practices

9. **Best Practices**
   - When to use toggle buttons vs other controls
   - Accessibility guidelines
   - Performance considerations
   - Form integration

10. **API Reference**
    - Complete property/event/method documentation
    - TypeScript types
    - Code examples

#### Interactive Examples

Each example should be runnable in the docs:
- Text alignment toolbar (icon-only, single select)
- Text formatting (icon+text, multiple select)
- View switcher (text-only, single select)
- Filter controls (vertical, multiple select)
- Disabled states
- Validation example
- Theming example

## Related Components

- `<vaadin-button>` - Standard action buttons
- `<vaadin-radio-group>` - Form-based single selection
- `<vaadin-checkbox-group>` - Form-based multiple selection
- `<vaadin-tabs>` - Navigation tabs

## References

- [GitHub Issue #4206](https://github.com/vaadin/web-components/issues/4206) - Toggle Button Group component request
- [Material UI ToggleButtonGroup](https://mui.com/material-ui/react-toggle-button/) - Industry reference
- [React Aria ToggleButton](https://react-aria.adobe.com/ToggleButton) - Accessibility patterns
- [Community Add-on](https://vaadin.com/directory/component/toggle-button-group) - Existing implementation
- [Lea Verou: Button Groups](https://lea.verou.me/2022/07/button-group/) - Semantics and interaction model
