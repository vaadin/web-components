# Switch Web Component Specification

## Overview

The `<vaadin-switch>` component is a binary toggle control that allows users to turn an option on or off. It provides a clear visual indication of state and is commonly used for settings, preferences, and feature toggles.

## Research Summary

### GitHub Issues Analysis

**Issue #893 - Toggle switch (aka toggle button)**
- Long-standing feature request (open since 2018)
- Users requesting toggle switch theme for vaadin-checkbox
- CSS-only theme examples provided by community
- High demand for this component

### Component Library Analysis

**Shoelace `<sl-switch>`:**
- Full form integration with validation
- Three size variants (small, medium, large)
- Help text support
- Required field validation
- Custom styling via CSS custom properties
- Focus management and keyboard navigation

**Radix UI Switch:**
- Controlled and uncontrolled modes
- Data attributes for state styling
- Keyboard interactions (Space, Enter)
- Hidden input for form submission
- Lightweight (4.31 kB gzip)

**React Aria Switch:**
- Read-only state support
- Rich data attributes for styling states
- Form integration with name/value
- Comprehensive accessibility
- Internationalization support

**Ant Design Switch:**
- Two sizes (default, small)
- Design token system for customization
- Inner content margin/padding support

### Key Findings

1. **Essential Features**: All libraries support basic on/off state, form integration, disabled state, and keyboard navigation
2. **Size Variants**: Most libraries offer at least 2 size options (small/default or small/medium/large)
3. **Accessibility**: ARIA switch role, keyboard support (Space/Enter), focus management are universal
4. **Customization**: CSS custom properties for styling, shadow parts for theming
5. **Form Integration**: Native form submission support with name/value attributes
6. **Validation**: Required field support and custom validation
7. **Labels**: Support for both inline labels and help text

## Usage Examples

### Basic Usage

```html
<!-- Simple on/off switch -->
<vaadin-switch>Enable notifications</vaadin-switch>

<!-- Pre-checked state -->
<vaadin-switch checked>Dark mode</vaadin-switch>

<!-- Disabled switch -->
<vaadin-switch disabled>Premium feature</vaadin-switch>
```

### Form Integration

```html
<form>
  <vaadin-switch
    name="newsletter"
    value="yes"
    required>
    Subscribe to newsletter
  </vaadin-switch>

  <vaadin-switch
    name="terms"
    required>
    I agree to the terms and conditions
  </vaadin-switch>

  <button type="submit">Submit</button>
</form>
```

### With Help Text

```html
<vaadin-switch helper-text="You can change this later in settings">
  Enable two-factor authentication
</vaadin-switch>
```

### Size Variants

```html
<vaadin-switch size="small">Small switch</vaadin-switch>
<vaadin-switch>Default switch</vaadin-switch>
<vaadin-switch size="large">Large switch</vaadin-switch>
```

### Read-Only State

```html
<vaadin-switch readonly checked>
  Feature enabled by administrator
</vaadin-switch>
```

### Programmatic Control

```html
<vaadin-switch id="wifi-switch">Wi-Fi</vaadin-switch>

<script>
  const wifiSwitch = document.querySelector('#wifi-switch');

  wifiSwitch.addEventListener('change', (e) => {
    console.log('Wi-Fi is now:', e.target.checked ? 'ON' : 'OFF');
  });

  // Programmatically toggle
  wifiSwitch.checked = true;
</script>
```

### Custom Validation

```html
<vaadin-switch id="terms-switch" required>
  I have read and agree to the terms
</vaadin-switch>

<script>
  const termsSwitch = document.querySelector('#terms-switch');

  termsSwitch.addEventListener('invalid', () => {
    termsSwitch.setCustomValidity('You must agree to the terms to continue');
  });

  termsSwitch.addEventListener('change', () => {
    if (termsSwitch.checked) {
      termsSwitch.setCustomValidity('');
    }
  });
</script>
```

## Component API

### Phase 1: Core Features (Initial Release)

#### Properties/Attributes

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `checked` | `checked` | `boolean` | `false` | Whether the switch is in the on position |
| `disabled` | `disabled` | `boolean` | `false` | Prevents user interaction when true |
| `name` | `name` | `string` | `''` | Name of the switch for form submission |
| `value` | `value` | `string` | `'on'` | Value sent with form data when checked |
| `required` | `required` | `boolean` | `false` | Makes the switch required for form validation |
| `invalid` | `invalid` | `boolean` | `false` | Indicates validation failure |
| `label` | `label` | `string` | `''` | Accessible label for the switch |

#### Slots

| Slot | Description |
|------|-------------|
| (default) | The label text for the switch |

#### Events

| Event | Type | Description |
|-------|------|-------------|
| `change` | `Event` | Fired when the checked state changes (native event) |
| `checked-changed` | `CustomEvent<{ value: boolean }>` | Fired when the checked property changes |

#### CSS Shadow Parts

| Part | Description |
|------|-------------|
| `base` | The component's root container |
| `control` | The switch track/background |
| `thumb` | The movable toggle indicator |
| `label` | The label text container |

#### CSS Custom Properties

| Property | Description | Default |
|----------|-------------|---------|
| `--vaadin-switch-width` | Width of the switch control | `44px` |
| `--vaadin-switch-height` | Height of the switch control | `24px` |
| `--vaadin-switch-thumb-size` | Size of the thumb element | `20px` |

#### State Attributes

| Attribute | Description |
|-----------|-------------|
| `checked` | Present when the switch is checked |
| `disabled` | Present when the switch is disabled |
| `focused` | Present when the switch has focus |
| `focus-ring` | Present when focused via keyboard |
| `invalid` | Present when validation fails |

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `click()` | - | `void` | Simulates a click on the switch |
| `focus()` | `options?: FocusOptions` | `void` | Sets focus on the switch |
| `blur()` | - | `void` | Removes focus from the switch |
| `checkValidity()` | - | `boolean` | Checks validity without showing validation UI |
| `reportValidity()` | - | `boolean` | Checks validity and shows browser validation UI |
| `setCustomValidity(message: string)` | `message: string` | `void` | Sets a custom validation message |

### Phase 2: Enhanced Features (Future Release)

#### Additional Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `readonly` | `readonly` | `boolean` | `false` | Makes the switch read-only (shows state but prevents changes) |
| `size` | `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Controls the size of the switch |
| `helperText` | `helper-text` | `string` | `''` | Descriptive help text displayed below the switch |

#### Additional Slots

| Slot | Description |
|------|-------------|
| `helper-text` | Custom help text content (alternative to helperText property) |

#### Additional CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--vaadin-switch-track-color` | Color of the switch track when unchecked |
| `--vaadin-switch-track-color-checked` | Color of the switch track when checked |
| `--vaadin-switch-thumb-color` | Color of the thumb |
| `--vaadin-switch-focus-ring-color` | Color of the focus ring |

#### Additional State Attributes

| Attribute | Description |
|-----------|-------------|
| `readonly` | Present when the switch is read-only |
| `has-helper` | Present when helper text is provided |

### Phase 3: Advanced Features (Future Release)

#### Additional Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `checkedLabel` | `checked-label` | `string` | `''` | Label text shown when checked (inside track) |
| `uncheckedLabel` | `unchecked-label` | `string` | `''` | Label text shown when unchecked (inside track) |
| `ariaLabel` | `aria-label` | `string` | `''` | Accessible label when no visible label is used |
| `ariaLabelledBy` | `aria-labelledby` | `string` | `''` | ID of element that labels this switch |

#### Additional Slots

| Slot | Description |
|------|-------------|
| `checked-icon` | Icon displayed inside track when checked |
| `unchecked-icon` | Icon displayed inside track when unchecked |

## DOM Structure

The switch will have the following Shadow DOM structure (using `part` attributes for theming):

```html
<div part="base" class="vaadin-switch">
  <label part="label" class="label">
    <input type="checkbox" class="hidden-input" />
    <span part="control" class="control">
      <span part="thumb" class="thumb"></span>
    </span>
    <span part="label-text" class="label-text">
      <slot></slot>
    </span>
  </label>
  <div part="helper-text" class="helper-text">
    <slot name="helper-text"></slot>
  </div>
</div>
```

**Important**: This DOM structure with part names is part of the stable API and should not break between versions.

## Implementation Plan

### Technology Stack

- **Base Class**: Lit 3 (`LitElement`)
- **Mixin Chain**: `SwitchMixin(ElementMixin(ThemableMixin(LitElement)))`
- **Language**: TypeScript 5
- **Testing**: Vitest for unit tests, Playwright for visual tests

### File Structure

```
packages/switch/
├── src/
│   ├── vaadin-switch.ts              # Main element class
│   ├── vaadin-switch.d.ts            # TypeScript definitions
│   ├── vaadin-switch-mixin.ts        # Component logic mixin
│   ├── vaadin-switch-mixin.d.ts      # Mixin TypeScript definitions
│   └── styles/
│       └── vaadin-switch-base-styles.ts  # Base styles
├── theme/
│   ├── lumo/
│   │   ├── vaadin-switch-styles.ts   # Lumo theme
│   │   └── vaadin-switch.ts          # Lumo themed export
│   └── aura/
│       ├── vaadin-switch-styles.ts   # Aura theme
│       └── vaadin-switch.ts          # Aura themed export
├── test/
│   ├── vaadin-switch.test.ts         # Unit tests
│   ├── dom-snapshot.test.ts          # DOM snapshot tests
│   ├── visual/
│   │   └── switch.test.ts            # Visual regression tests
│   └── typings/
│       └── switch.types.ts           # TypeScript type tests
├── vaadin-switch.ts                  # Root export
├── vaadin-switch.d.ts                # Root TypeScript export
├── package.json
├── README.md
└── LICENSE
```

### Core Implementation Details

#### 1. Switch Mixin (`vaadin-switch-mixin.ts`)

The mixin encapsulates the switch logic:

```typescript
export declare function SwitchMixin<T extends Constructor<LitElement>>(
  base: T
): Constructor<SwitchMixinClass> & T;

export interface SwitchMixinClass {
  // Properties
  checked: boolean;
  disabled: boolean;
  name: string;
  value: string;
  required: boolean;
  invalid: boolean;
  label: string;

  // Methods
  click(): void;
  focus(options?: FocusOptions): void;
  blur(): void;
  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;
}
```

Key responsibilities:
- Manage `checked` state
- Handle form integration via hidden `<input type="checkbox">`
- Implement keyboard navigation (Space, Enter to toggle)
- Manage focus states and accessibility attributes
- Implement validation methods
- Fire `change` and `checked-changed` events

#### 2. Main Element (`vaadin-switch.ts`)

```typescript
@customElement('vaadin-switch')
export class Switch extends SwitchMixin(ElementMixin(ThemableMixin(LitElement))) {
  static override styles = unsafeCSS(baseStyles);

  protected override render() {
    return html`
      <div part="base">
        <label part="label">
          <input
            type="checkbox"
            .checked=${this.checked}
            .disabled=${this.disabled}
            ?required=${this.required}
            name=${ifDefined(this.name)}
            value=${this.value}
            @change=${this._onChange}
            @focus=${this._onFocus}
            @blur=${this._onBlur}
          />
          <span part="control">
            <span part="thumb"></span>
          </span>
          <span part="label-text">
            <slot></slot>
          </span>
        </label>
      </div>
    `;
  }
}
```

#### 3. Base Styles (`vaadin-switch-base-styles.ts`)

Provides the structural CSS and default appearance:

```typescript
export const baseStyles = css`
  :host {
    display: inline-block;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='base'] {
    display: inline-flex;
    align-items: center;
  }

  [part='label'] {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }

  :host([disabled]) [part='label'] {
    cursor: default;
    opacity: 0.5;
  }

  /* Hidden input for form submission */
  input[type='checkbox'] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    margin: 0;
  }

  [part='control'] {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: var(--vaadin-switch-width, 44px);
    height: var(--vaadin-switch-height, 24px);
    border-radius: calc(var(--vaadin-switch-height, 24px) / 2);
    background: var(--vaadin-switch-track-color, #ccc);
    transition: background 0.2s ease;
  }

  :host([checked]) [part='control'] {
    background: var(--vaadin-switch-track-color-checked, #0066ff);
  }

  [part='thumb'] {
    position: absolute;
    width: var(--vaadin-switch-thumb-size, 20px);
    height: var(--vaadin-switch-thumb-size, 20px);
    border-radius: 50%;
    background: var(--vaadin-switch-thumb-color, white);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
    transform: translateX(2px);
  }

  :host([checked]) [part='thumb'] {
    transform: translateX(calc(var(--vaadin-switch-width, 44px) - var(--vaadin-switch-thumb-size, 20px) - 2px));
  }

  [part='label-text'] {
    margin-left: 8px;
  }

  /* Focus styles */
  :host([focus-ring]) [part='control'] {
    outline: 2px solid var(--vaadin-switch-focus-ring-color, #0066ff);
    outline-offset: 2px;
  }

  /* Invalid state */
  :host([invalid]) [part='control'] {
    border: 2px solid var(--vaadin-error-color, #ff0000);
  }
`;
```

#### 4. Accessibility Implementation

The switch must implement proper accessibility:

1. **ARIA Role**: Use `role="switch"` on the component or rely on native checkbox semantics
2. **Keyboard Navigation**:
   - Space: Toggle the switch
   - Enter: Toggle the switch (when focused)
   - Tab: Move focus to/from the switch
3. **Screen Reader Support**:
   - Associate label with control
   - Announce checked/unchecked state
   - Announce disabled state
   - Announce invalid state with error message
4. **Focus Management**:
   - Clear focus ring indicator
   - Support `:focus-visible` pattern
   - Maintain focus on toggle

#### 5. Form Integration

Implement proper form integration:

1. **Hidden Input**: Include a hidden `<input type="checkbox">` that participates in form submission
2. **Form Association**: Support `name` and `value` attributes
3. **Validation**: Implement `required` validation
4. **Form Reset**: Reset to default state when form is reset
5. **Form Methods**: Implement `checkValidity()`, `reportValidity()`, `setCustomValidity()`

#### 6. Event Handling

Fire appropriate events:

1. **`change` Event**: Native change event when state changes via user interaction
2. **`checked-changed` Event**: Custom event fired whenever checked property changes (programmatic or user)
   ```typescript
   this.dispatchEvent(
     new CustomEvent('checked-changed', {
       detail: { value: this.checked },
       bubbles: true,
       composed: true
     })
   );
   ```

#### 7. State Management

Properly manage component state:

1. **Checked State**: Track via `checked` boolean property
2. **Disabled State**: Prevent all interactions when `disabled` is true
3. **Invalid State**: Apply when validation fails
4. **Focus State**: Track focus and focus-ring states separately
5. **Read-Only State** (Phase 2): Show state but prevent changes

### Testing Strategy

#### Unit Tests

Test all functionality:
- Property changes and attribute reflection
- Event firing (change, checked-changed)
- Keyboard interactions
- Form integration
- Validation methods
- Focus management
- Disabled state behavior

#### DOM Snapshot Tests

Verify Shadow DOM structure remains consistent:
- Default state
- Checked state
- Disabled state
- Invalid state
- With label text
- With helper text (Phase 2)

#### Visual Regression Tests

Test appearance across themes:
- Lumo theme (light and dark modes)
- Aura theme (light and dark modes)
- All size variants (Phase 2)
- All states (default, checked, disabled, focused, invalid)
- RTL support

#### TypeScript Type Tests

Verify type definitions:
- Property types
- Event types
- Method signatures
- Mixin types

### Browser Support

Support modern browsers:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)

### Performance Considerations

1. **Lightweight**: Keep component size minimal (target < 5 KB gzip)
2. **Animation Performance**: Use CSS transforms for smooth animations
3. **Event Throttling**: Not needed for toggle actions
4. **Lazy Loading**: Support lazy registration of theme modules

## Documentation Plan (vaadin.com/docs)

### 1. Overview Page

**URL**: `/components/switch`

**Content**:
- Brief description of what a switch is and when to use it
- Live interactive example showing basic switch
- Comparison with checkbox: When to use switch vs checkbox
  - **Use Switch for**: Settings that take immediate effect (e.g., "Enable Dark Mode")
  - **Use Checkbox for**: Options that require submission (e.g., form selections)
- Accessibility statement
- Browser support information

### 2. Usage Examples

**URL**: `/components/switch/usage`

**Content**:

#### Basic Usage
- Simple on/off switch
- Pre-checked state
- Disabled switch

#### Labels
- Using default slot for labels
- Programmatic label via `label` property
- ARIA labels for switches without visible labels

#### Form Integration
- Using in forms with name/value
- Required validation
- Custom validation
- Form reset behavior

#### State Management
- Controlled (programmatic) usage
- Event handling
- Read-only state (Phase 2)

#### Sizing (Phase 2)
- Small, medium, large variants
- When to use each size

#### Help Text (Phase 2)
- Adding helper text
- Using helper text slot

### 3. Styling Guide

**URL**: `/components/switch/styling`

**Content**:

#### CSS Custom Properties
- Complete list of custom properties with defaults
- Examples of customization

#### Shadow Parts
- List of all parts
- Styling examples for each part

#### State Attributes
- Styling based on state attributes
- Examples for each state

#### Theme Variants
- Lumo theme customization
- Aura theme customization

#### Responsive Design
- Mobile vs desktop considerations
- Touch target sizing

### 4. API Reference

**URL**: `/components/switch/api`

**Content**:
- Complete API documentation
- Properties table
- Attributes table
- Events table
- Methods table
- Slots table
- CSS Parts table
- CSS Custom Properties table
- State Attributes table

### 5. Accessibility Guide

**URL**: `/components/switch/accessibility`

**Content**:

#### Keyboard Navigation
- Complete list of keyboard shortcuts
- Focus management

#### Screen Reader Support
- ARIA attributes used
- Screen reader announcement examples

#### Best Practices
- When to provide visible labels
- Using aria-label vs aria-labelledby
- Grouping related switches
- Error message association

#### WCAG Compliance
- Meeting WCAG 2.1 AA standards
- Color contrast requirements
- Touch target sizing

### 6. Examples Gallery

**URL**: `/components/switch/examples`

**Content**:
- Settings panel with multiple switches
- Form with switches and validation
- Toggle theme switcher
- Feature flags dashboard
- Responsive switch layout
- Grouped switches with fieldset

### 7. Migration Guide

**URL**: `/components/switch/migration`

**Content** (when transitioning from checkbox themes):
- Migrating from checkbox toggle themes
- API differences
- Styling changes
- Breaking changes between versions

### 8. Best Practices

**URL**: `/components/switch/best-practices`

**Content**:

#### When to Use
- Immediate effect settings
- Binary on/off states
- Real-time toggles

#### When NOT to Use
- Multi-step forms requiring submission
- Non-boolean choices
- Destructive actions without confirmation

#### UX Guidelines
- Label clarity (use active voice: "Enable notifications" not "Notifications")
- Immediate feedback
- Default states
- Grouping related switches

#### Performance
- Using many switches in a list
- Debouncing rapid changes if needed

## Accessibility Compliance

The switch component will meet WCAG 2.1 Level AA standards:

1. **Perceivable**:
   - Color contrast ratio of at least 4.5:1 for text
   - Non-color indicators for state (position of thumb)
   - Support for high contrast mode

2. **Operable**:
   - Fully keyboard accessible
   - Touch targets at least 44×44 CSS pixels
   - No time limits for interaction
   - Focus indicator clearly visible

3. **Understandable**:
   - Clear labeling
   - Predictable behavior
   - Error messages associated with control

4. **Robust**:
   - Valid HTML
   - Proper ARIA attributes
   - Works with assistive technologies

## Internationalization

Support for international users:

1. **RTL Support**: Switch thumb moves from right to left in RTL languages
2. **Text Direction**: Label text flows correctly in RTL
3. **No Hard-coded Text**: All text comes from slots/properties
4. **Locale-aware Validation**: Error messages can be localized

## Security Considerations

1. **XSS Prevention**: All content is safely rendered through Lit's html template
2. **Form Security**: Proper form integration without vulnerabilities
3. **No Inline Scripts**: All JavaScript is in the component module

## Performance Benchmarks

Target performance metrics:

1. **Bundle Size**: < 5 KB (gzip) for base component
2. **First Paint**: < 16ms for initial render
3. **Animation**: 60 FPS for state transitions
4. **Memory**: < 1 KB per instance

## Browser Testing Matrix

Test in all combinations of:

**Desktop Browsers**:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Mobile Browsers**:
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)

**Assistive Technologies**:
- NVDA with Firefox (Windows)
- JAWS with Chrome (Windows)
- VoiceOver with Safari (macOS)
- VoiceOver with Safari (iOS)
- TalkBack with Chrome (Android)

## Release Strategy

### Version 1.0.0 (Phase 1 - Core Features)

**Target**: Initial stable release

**Features**:
- Basic on/off toggle
- Form integration (name, value, required)
- Validation support
- Disabled state
- Keyboard navigation
- Accessibility (ARIA, focus management)
- Lumo and Aura themes
- Events (change, checked-changed)
- CSS Shadow Parts
- Basic CSS Custom Properties

**Timeline**: Initial implementation → Testing → Documentation → Release

### Version 1.1.0 (Phase 2 - Enhanced Features)

**Target**: 2-3 months after v1.0.0

**Features**:
- Read-only state
- Size variants (small, medium, large)
- Helper text support
- Additional CSS custom properties
- Enhanced theming options

**API Stability**: No breaking changes to Phase 1 API

### Version 1.2.0 (Phase 3 - Advanced Features)

**Target**: 4-6 months after v1.1.0

**Features**:
- Checked/unchecked labels (inside track)
- Icon slots for checked/unchecked states
- Additional ARIA attributes
- Advanced customization options

**API Stability**: No breaking changes to Phase 1 & 2 APIs

## Breaking Change Policy

To maintain API stability:

1. **Shadow Parts**: Part names will not change or be removed
2. **Properties**: Public properties will not be removed
3. **Events**: Event names and signatures will not change
4. **Methods**: Public method signatures will not change
5. **DOM Structure**: The overall structure will remain compatible

New features will be additive only. Deprecation warnings will be provided for at least one major version before any breaking changes.

## Dependencies

### Runtime Dependencies
- `lit` ^3.0.0
- `@vaadin/component-base` (for mixins)
- `@vaadin/vaadin-themable-mixin`
- `@vaadin/vaadin-lumo-styles` (theme package)

### Development Dependencies
- TypeScript 5
- Vitest (testing)
- Playwright (visual tests)
- ESLint (linting)
- Prettier (formatting)

## Comparison with Checkbox

Document the differences to help users choose:

| Feature | Switch | Checkbox |
|---------|--------|----------|
| **Use Case** | Settings with immediate effect | Form options requiring submission |
| **State Change** | Immediate | On form submission |
| **Visual** | Toggle slider | Checkmark box |
| **Semantics** | `role="switch"` | Native checkbox |
| **Multiple Selection** | Not applicable (single binary) | Checkbox groups |

## Future Enhancements (Beyond Phase 3)

Ideas for potential future releases (no commitment):

1. **Loading State**: Show loading indicator during async operations
2. **Confirmation Dialog**: Optional confirmation before toggle for critical actions
3. **Animation Customization**: More control over transition timing/easing
4. **Group Component**: `<vaadin-switch-group>` for managing related switches
5. **Tooltip Integration**: Built-in tooltip support
6. **Async Validation**: Support for asynchronous validation
7. **Value Mapping**: Map checked/unchecked to custom values beyond boolean

## Success Criteria

The component will be considered successful when:

1. ✅ GitHub issue #893 can be closed
2. ✅ Component passes all accessibility audits
3. ✅ Component achieves target performance benchmarks
4. ✅ Documentation receives positive feedback
5. ✅ Adoption rate shows steady growth
6. ✅ Bug reports are minimal
7. ✅ API remains stable across releases

## Open Questions for Review

1. **Default Size**: Should the default size be 'medium' or match the checkbox size?
2. **Theme Alignment**: Should the switch colors align with checkbox or have its own design language?
3. **Label Position**: Should we support label position (left/right/top/bottom) in Phase 2 or Phase 3?
4. **Inner Labels**: Should checked/unchecked labels be in Phase 2 or Phase 3?
5. **Loading State**: Is loading state needed for v1.0 or can it wait?

## Conclusion

This specification provides a comprehensive plan for building a production-ready Switch component for Vaadin. The phased approach ensures a solid foundation in Phase 1, with room for enhancement in later phases without breaking the API. The component will integrate seamlessly with Vaadin's existing ecosystem while following web component best practices.
