# Web Component Creation Guidelines

This document provides comprehensive, step-by-step guidelines for creating new web components in the Vaadin web-components monorepo. These guidelines are designed to be thorough enough for automatic component generation.

---

## Table of Contents

1. [Overview & Prerequisites](#overview--prerequisites)
2. [Naming Conventions](#naming-conventions)
3. [File Structure](#file-structure)
4. [Component Implementation](#component-implementation)
5. [Styling](#styling)
6. [Theming](#theming)
7. [TypeScript Definitions](#typescript-definitions)
8. [Testing](#testing)
9. [Documentation](#documentation)
10. [Accessibility](#accessibility)
11. [Package Configuration](#package-configuration)
12. [Common Patterns](#common-patterns)
13. [Checklist](#checklist)

---

## Overview & Prerequisites

### Technology Stack
- **Lit 3**: Base class and templating
- **TypeScript 5**: Type definitions
- **Lerna + Yarn Workspaces**: Monorepo management
- **Web Test Runner**: Testing infrastructure
- **Mocha, Chai, Sinon**: Test framework

### Required Knowledge
- Web Components fundamentals (Shadow DOM, Custom Elements)
- Lit basics (templates, properties, lifecycle)
- TypeScript basics (types, interfaces, generics)
- CSS custom properties
- Accessibility best practices

### Important: Pure Lit Pattern

**These guidelines use the pure Lit pattern for new components**, which means:

✅ **Use:**
- Lit's native `static properties` with `reflect`, `attribute` (use `attribute: false` for internal properties)
- Lit lifecycle methods: `firstUpdated()`, `updated()`, `connectedCallback()`
- Field initializers for default values
- `updated()` for reacting to property changes

❌ **Don't use (legacy Polymer patterns):**
- `PolylitMixin` - provides Polymer-style properties (deprecated for new components)
- `LumoInjectionMixin` - theme injection (not needed with modern theming)
- Polymer-style property options: `value`, `observer`, `sync`, `notify`, `computed`
- `ready()` lifecycle method

**Note:** Existing components in the repository still use `PolylitMixin` for backward compatibility. This is intentional. For new components, follow the pure Lit pattern shown in this guide.

---

## Naming Conventions

### Component Name
- **Pattern**: `vaadin-{component-name}`
- **Examples**: `vaadin-button`, `vaadin-text-field`, `vaadin-date-picker`
- Use kebab-case (lowercase with hyphens)
- Must start with `vaadin-` prefix

### Package Name
- **Pattern**: `@vaadin/{component-name}`
- **Example**: `@vaadin/button`
- No `vaadin-` prefix in package name

### File Naming
- **Main element**: `vaadin-{name}.js`
- **Mixin**: `vaadin-{name}-mixin.js`
- **Styles**: `vaadin-{name}-base-styles.js`
- **Tests**: `{name}.test.ts` or `{name}.test.js`

### Class Naming
- **Element class**: PascalCase of component name
  - `vaadin-button` → `Button`
  - `vaadin-date-picker` → `DatePicker`
- **Mixin**: `{ComponentName}Mixin`
  - Example: `ButtonMixin`, `DatePickerMixin`

---

## File Structure

Complete file structure for a new component:

```
packages/{component-name}/
├── package.json                              # Package configuration
├── README.md                                 # Component documentation
├── LICENSE                                   # Apache 2.0 or Commercial
├── screenshot.png                            # Optional: Component screenshot
├── vaadin-{name}.js                          # Root export (re-exports from src/)
├── vaadin-{name}.d.ts                        # Root TypeScript definition
├── src/
│   ├── vaadin-{name}.js                      # Main element class
│   ├── vaadin-{name}.d.ts                    # Element TypeScript definition
│   ├── vaadin-{name}-mixin.js                # Component logic mixin (if needed)
│   ├── vaadin-{name}-mixin.d.ts              # Mixin TypeScript definition
│   └── styles/
│       ├── vaadin-{name}-base-styles.js      # Base styles (CSS-in-JS)
│       └── vaadin-{name}-base-styles.d.ts    # Styles TypeScript definition
└── test/
    ├── {name}.test.ts                        # Unit tests
    ├── typings/
    │   └── {name}.types.ts                   # TypeScript type tests
    ├── dom/
    │   ├── {name}.test.js                    # DOM snapshot tests
    │   └── __snapshots__/
    │       └── {name}.test.snap.js           # Generated snapshots
    └── visual/
        ├── lumo/
        │   └── {name}.test.js                # Visual tests for Lumo theme
        ├── aura/
        │   └── {name}.test.js                # Visual tests for Aura theme
        └── base/
            └── {name}.test.js                # Visual tests without theme
```

---

## Component Implementation

### 1. Root Export File (`vaadin-{name}.js`)

This file re-exports everything from the main element file:

```javascript
import './src/vaadin-{name}.js';

export * from './src/vaadin-{name}.js';
```

**Example** (`vaadin-button.js`):
```javascript
import './src/vaadin-button.js';

export * from './src/vaadin-button.js';
```

### 2. Main Element Class (`src/vaadin-{name}.js`)

This is the core component file. Follow this exact structure:

```javascript
/**
 * @license
 * Copyright (c) {year} - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { {componentName}Styles } from './styles/vaadin-{name}-base-styles.js';
import { {ComponentName}Mixin } from './vaadin-{name}-mixin.js';

/**
 * `<vaadin-{name}>` is a [brief description of what the component does].
 *
 * ```html
 * <vaadin-{name}>Example</vaadin-{name}>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `label`   | The label element
 * `{part}`  | Description of part
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `disabled`   | Set when the element is disabled
 * `focused`    | Set when the element is focused
 * `focus-ring` | Set when the element is keyboard focused
 * `has-value`  | Set when the element has a value
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the value changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes {ComponentName}Mixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class {ComponentName} extends {ComponentName}Mixin(ElementMixin(ThemableMixin(LitElement))) {
  static get is() {
    return 'vaadin-{name}';
  }

  static get styles() {
    return {componentName}Styles;
  }

  static get properties() {
    return {
      /**
       * Property description.
       * Can span multiple lines.
       *
       * @attr {boolean} disabled
       */
      disabled: {
        type: Boolean,
        reflect: true,
      },

      /**
       * The value of the component.
       */
      value: {
        type: String,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-{name}-container">
        <span part="label">
          <slot></slot>
        </span>
      </div>
    `;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    // Set default role if not provided
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
  }

  /** @protected */
  updated(changedProperties) {
    super.updated(changedProperties);

    // React to property changes
    if (changedProperties.has('disabled')) {
      this._onDisabledChanged(this.disabled, changedProperties.get('disabled'));
    }
  }

  /** @private */
  _onDisabledChanged(disabled, oldDisabled) {
    // Handle disabled state change
    if (disabled) {
      this.setAttribute('tabindex', '-1');
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.setAttribute('tabindex', '0');
      this.removeAttribute('aria-disabled');
    }
  }
}

defineCustomElement({ComponentName});

export { {ComponentName} };
```

### 3. Component Mixin (`src/vaadin-{name}-mixin.js`)

Use mixins to encapsulate component logic, especially when:
- Logic is shared across multiple components
- Component needs complex functionality
- You want to separate concerns

```javascript
/**
 * @license
 * Copyright (c) {year} - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ActiveMixin } from '@vaadin/a11y-base/src/active-mixin.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { TabindexMixin } from '@vaadin/a11y-base/src/tabindex-mixin.js';

/**
 * A mixin providing common {component} functionality.
 *
 * @polymerMixin
 * @mixes ActiveMixin
 * @mixes FocusMixin
 * @mixes TabindexMixin
 */
export const {ComponentName}Mixin = (superClass) =>
  class {ComponentName}MixinClass extends ActiveMixin(TabindexMixin(FocusMixin(superClass))) {
    constructor() {
      super();

      // Bind event handlers
      this.__onSomeEvent = this.__onSomeEvent.bind(this);

      // Add event listeners
      this.addEventListener('click', this.__onSomeEvent);
    }

    /**
     * Override lifecycle methods as needed.
     *
     * @protected
     */
    firstUpdated() {
      super.firstUpdated();

      // Set default role if not provided
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', '{appropriate-role}');
      }
    }

    /**
     * React to property changes.
     *
     * @protected
     */
    updated(changedProperties) {
      super.updated(changedProperties);

      if (changedProperties.has('someProperty')) {
        this._onSomePropertyChanged(this.someProperty);
      }
    }

    /**
     * Private or protected methods.
     *
     * @private
     */
    __onSomeEvent(event) {
      // Implementation
    }
  };
```

### 4. Mixin Chain Order (CRITICAL)

**The order of mixins matters!** Use this exact chain for pure Lit components:

```javascript
class Component extends
  ComponentMixin(                        // Component-specific logic (outermost)
    ElementMixin(                        // Element base functionality
      ThemableMixin(                     // Theming support
        LitElement                       // Lit base class (innermost)
      )
    )
  )
```

**For field components**, add field-specific mixins:

```javascript
class DatePicker extends
  DatePickerMixin(                       // Component-specific logic
    InputControlMixin(                   // Input control functionality
      ElementMixin(
        ThemableMixin(
          LitElement
        )
      )
    )
  )
```

**Note:** Legacy components may use `PolylitMixin` and `LumoInjectionMixin` for Polymer-style property handling. For new components, use pure Lit patterns as shown above.

### 5. Property Definition

Properties follow the standard Lit pattern:

```javascript
static get properties() {
  return {
    /**
     * Property description goes here.
     * Can be multi-line.
     *
     * @attr {string} my-property
     */
    myProperty: {
      type: String,              // Type: String, Number, Boolean, Array, Object
      reflect: true,             // Sync property to attribute
      attribute: 'my-property',  // Custom attribute name (optional, defaults to kebab-case)
    },

    /**
     * Internal property (not reflected).
     */
    _internalProp: {
      type: Boolean,
      attribute: false,          // Disable attribute (not registered in observedAttributes)
    },
  };
}
```

**Property Configuration Options:**
- `type`: Constructor (String, Number, Boolean, Array, Object)
- `reflect`: Boolean - sync property value to attribute
- `attribute`: String | false - custom attribute name, or false to disable attribute (use false for internal properties)
- `converter`: Object | Function - custom converter for attribute/property conversion
- `hasChanged`: Function - custom comparison function

**Note:** While Lit supports `state: true` for internal reactive properties, the Vaadin codebase typically uses `attribute: false` instead to prevent properties from being registered in observedAttributes.

**Setting Default Values:**
```javascript
class MyComponent extends ... {
  // Use field initializers for defaults
  myProperty = '';
  count = 0;
  items = [];

  // For complex defaults that need to be unique per instance
  constructor() {
    super();
    this.complexObject = { key: 'value' };
  }
}
```

**Reacting to Property Changes:**
Use Lit's `updated()` lifecycle method instead of observers:

```javascript
/** @protected */
updated(changedProperties) {
  super.updated(changedProperties);

  if (changedProperties.has('myProperty')) {
    this._onMyPropertyChanged(this.myProperty, changedProperties.get('myProperty'));
  }

  if (changedProperties.has('value') || changedProperties.has('disabled')) {
    this._updateState();
  }
}

/** @private */
_onMyPropertyChanged(newValue, oldValue) {
  // React to property change
  console.log(`myProperty changed from ${oldValue} to ${newValue}`);
}
```

### 6. Event Firing

**Standard Events:**
```javascript
// Fire native event
this.dispatchEvent(new Event('change', { bubbles: true }));

// Fire custom event with detail
this.dispatchEvent(
  new CustomEvent('value-changed', {
    detail: { value: this.value },
    bubbles: true,
    composed: true,
  })
);
```

**Document events in JSDoc:**
```javascript
/**
 * @fires {Event} input - Fired when the value is changed by the user.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 */
```

### 7. Lifecycle Methods

Lit provides several lifecycle methods. Use these for initialization and updates:

**Key Lifecycle Methods:**

```javascript
class MyComponent extends ... {
  /**
   * Called once when the component is first connected to the DOM.
   * Use for setting up event listeners, etc.
   */
  connectedCallback() {
    super.connectedCallback();

    window.addEventListener('resize', this._onResize);
  }

  /**
   * Called when the component is disconnected from the DOM.
   * Use for cleanup (removing event listeners, etc.)
   */
  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('resize', this._onResize);
  }

  /**
   * Called after the first render.
   * Use for initialization that depends on the DOM being rendered.
   */
  firstUpdated() {
    super.firstUpdated();

    // Set ARIA role if not provided
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
  }

  /**
   * Called after every render when properties have changed.
   * Use for reacting to property changes.
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('disabled')) {
      this._updateDisabled();
    }
  }
}
```

**Lifecycle Order:**
1. `constructor()`
2. `connectedCallback()` - first time connected
3. `firstUpdated()` - after first render
4. `updated()` - after every render
5. `disconnectedCallback()` - when removed from DOM

### 8. Controllers

Use controllers for reusable behaviors:

```javascript
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

class MyComponent extends ... {
  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    // Tooltip support
    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);

    // Slot observation
    this._slotController = new SlotController(
      this,
      'prefix',
      'vaadin-icon',
      (node) => {
        // Factory function for creating default node
        const icon = document.createElement('vaadin-icon');
        icon.setAttribute('icon', 'lumo:dropdown');
        return icon;
      }
    );
    this.addController(this._slotController);
  }
}
```

**Available Controllers:**
- `TooltipController`: Manage slotted tooltips
- `SlotController`: Observe and manage slots
- `SlotChildObserveController`: Observe slot children
- `MediaQueryController`: React to media query changes
- `OverflowController`: Detect overflow
- `LabelController`: Manage label association
- `ErrorController`: Manage error messages
- `HelperController`: Manage helper text

---

## Styling

### 1. Base Styles File (`src/styles/vaadin-{name}-base-styles.js`)

Component base styles using Lit's `css` template:

```javascript
/**
 * @license
 * Copyright (c) {year} - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const {componentName}Styles = css`
  :host {
    /* Layout */
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;

    /* Sizing with CSS custom properties */
    width: var(--vaadin-{name}-width, auto);
    height: var(--vaadin-{name}-height, auto);
    padding: var(--vaadin-{name}-padding, var(--vaadin-padding-container));
    margin: var(--vaadin-{name}-margin, 0);

    /* Typography */
    font-family: var(--vaadin-{name}-font-family, inherit);
    font-size: var(--vaadin-{name}-font-size, inherit);
    font-weight: var(--vaadin-{name}-font-weight, 500);
    line-height: var(--vaadin-{name}-line-height, inherit);

    /* Colors */
    color: var(--vaadin-{name}-text-color, var(--vaadin-text-color));
    background: var(--vaadin-{name}-background, var(--vaadin-background-container));

    /* Border */
    border: var(--vaadin-{name}-border-width, 1px) solid
      var(--vaadin-{name}-border-color, var(--vaadin-border-color-secondary));
    border-radius: var(--vaadin-{name}-border-radius, var(--vaadin-radius-m));

    /* Interaction */
    cursor: var(--vaadin-clickable-cursor);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* State: focused */
  :host(:is([focus-ring], :focus-visible)) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
  }

  /* State: disabled */
  :host([disabled]) {
    pointer-events: none;
    cursor: var(--vaadin-disabled-cursor);
    opacity: 0.5;
  }

  /* Theme variants */
  :host([theme~='primary']) {
    --vaadin-{name}-background: var(--vaadin-text-color);
    --vaadin-{name}-text-color: var(--vaadin-background-color);
    --vaadin-{name}-border-color: transparent;
  }

  /* Parts */
  [part='label'] {
    display: inline-flex;
  }

  [part='prefix'],
  [part='suffix'] {
    flex: none;
  }

  /* Forced colors mode (Windows High Contrast) */
  @media (forced-colors: active) {
    :host {
      --vaadin-{name}-background: ButtonFace;
      --vaadin-{name}-text-color: ButtonText;
      --vaadin-{name}-border-color: ButtonText;
    }

    :host([disabled]) {
      opacity: 1;
      --vaadin-{name}-text-color: GrayText;
      --vaadin-{name}-border-color: GrayText;
    }
  }
`;
```

### 2. Styling Best Practices

**CSS Custom Properties Naming:**
- Use `--vaadin-{component}-{property}` pattern
- Provide fallbacks to shared design tokens: `var(--vaadin-{component}-color, var(--vaadin-text-color))`
- Common token categories:
  - Colors: `--vaadin-text-color`, `--vaadin-background-color`
  - Spacing: `--vaadin-padding-{size}`, `--vaadin-gap-{size}`
  - Borders: `--vaadin-border-color-{variant}`, `--vaadin-radius-{size}`
  - Typography: `--vaadin-font-size-{size}`, `--vaadin-font-weight-{level}`

**Shadow Parts:**
- Use descriptive part names: `label`, `input-field`, `prefix`, `suffix`
- Document all parts in JSDoc

**State Attributes:**
- Use attributes for state: `disabled`, `focused`, `focus-ring`, `has-value`, `invalid`
- Always document state attributes

---

## Theming

Components must support both **Lumo** and **Aura** themes. The Vaadin component library includes two official themes with different design philosophies:

- **Lumo**: The original Vaadin theme, optimized for business applications with a focus on clarity and efficiency
- **Aura**: A modern theme with contemporary aesthetics, using advanced CSS features and design patterns

### 1. Lumo Theme (`packages/vaadin-lumo-styles/`)

**File Structure:**
```
packages/vaadin-lumo-styles/
├── components/
│   └── {name}.css          # Public CSS (imports from src/)
└── src/
    └── components/
        └── {name}.css      # Actual theme styles
```

**Public CSS file** (`components/{name}.css`):
```css
/**
 * @license
 * Copyright (c) {year} - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
@import '../src/components/{name}.css';
```

**Theme styles** (`src/components/{name}.css`):
```css
/**
 * @license
 * Copyright (c) {year} - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
@media lumo_components_{name} {
  :host {
    /* Sizing */
    --lumo-{name}-size: var(--lumo-size-m);
    min-width: var(--vaadin-{name}-min-width, calc(var(--_size) * 2));
    height: var(--_size);
    padding: var(--vaadin-{name}-padding, 0 calc(var(--_size) / 3 + var(--lumo-border-radius-m) / 2));
    margin: var(--vaadin-{name}-margin, var(--lumo-space-xs) 0);

    /* Style */
    font-family: var(--lumo-font-family);
    font-size: var(--vaadin-{name}-font-size, var(--lumo-font-size-m));
    font-weight: var(--vaadin-{name}-font-weight, 500);
    color: var(--_lumo-{name}-text-color);
    background: var(--_lumo-{name}-background);
    border: var(--vaadin-{name}-border, none);
    border-radius: var(--vaadin-{name}-border-radius, var(--lumo-border-radius-m));

    --_size: var(--vaadin-{name}-height, var(--lumo-{name}-size));
    --_lumo-{name}-background: var(--vaadin-{name}-background, var(--lumo-contrast-5pct));
    --_lumo-{name}-text-color: var(--vaadin-{name}-text-color, var(--lumo-primary-text-color));
  }

  :host([theme~='small']) {
    font-size: var(--lumo-font-size-s);
    --lumo-{name}-size: var(--lumo-size-s);
  }

  :host([theme~='large']) {
    font-size: var(--lumo-font-size-l);
    --lumo-{name}-size: var(--lumo-size-l);
  }

  /* Hover */
  @media (any-hover: hover) {
    :host(:not([disabled]):hover)::before {
      opacity: 0.02;
    }
  }

  /* Active */
  :host([active])::before {
    opacity: 0.05;
  }

  /* Keyboard focus */
  :host([focus-ring]) {
    box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
  }

  /* Disabled */
  :host([disabled]) {
    color: var(--lumo-disabled-text-color);
    background: var(--lumo-contrast-5pct);
  }

  /* Theme variants */
  :host([theme~='primary']) {
    background: var(--lumo-primary-color);
    color: var(--lumo-primary-contrast-color);
    font-weight: 600;
  }

  :host([theme~='tertiary']) {
    background: transparent;
    box-shadow: none;
  }
}
```

### 2. Aura Theme (`packages/aura/`)

**File Structure:**
```
packages/aura/
├── aura.css                           # Main theme entry point
├── package.json                       # Package configuration
├── postcss.config.js                  # PostCSS configuration
└── src/
    ├── color.css                      # Color system
    ├── color-scheme.css               # Light/dark mode support
    ├── palette.css                    # Color palette
    ├── shadow.css                     # Shadow tokens
    ├── size.css                       # Size tokens
    ├── surface.css                    # Surface system
    ├── typography.css                 # Typography tokens
    └── components/
        └── {name}.css                 # Component-specific styles
```

**Important Notes about Aura:**
- Aura is a **modern theme** using cutting-edge CSS features
- Requires browser support for: `:where`, `:is`, `light-dark()`, `oklch()`, `color-mix()`, relative color syntax
- Uses PostCSS for build processing
- Component styles are imported in `aura.css` main file
- Uses element selectors (`:is(vaadin-{name})`) instead of `:host` for better cascade control

**Aura Theme CSS Example:**

```css
/* Aura uses modern CSS features and advanced color manipulation */
:where(:root),
:where(:host) {
  --vaadin-{name}-shadow: 0 1px 4px -1px hsla(0, 0%, 0%, 0.07);
}

/* Use :is() for better selector specificity control */
:is(vaadin-{name}) {
  transition: scale 180ms;
  position: relative;
  --aura-surface-level: 6;
  --aura-surface-opacity: 0.3;
  box-shadow: var(--vaadin-{name}-shadow);
}

/* Default variant styling */
:is(vaadin-{name}):not([theme~='primary']) {
  --vaadin-{name}-text-color: var(--aura-accent-text-color);
  --vaadin-{name}-border-color: var(--aura-accent-border-color);
}

/* Primary variant with :where() for lower specificity */
:is(vaadin-{name}):where([theme~='primary']) {
  outline-offset: 2px;
  --vaadin-{name}-font-weight: var(--aura-font-weight-semibold);
  --vaadin-{name}-text-color: var(--aura-accent-contrast-color);
  --vaadin-{name}-background: var(--aura-accent-color);
  --vaadin-{name}-shadow: 0 2px 3px -1px hsla(0, 0%, 0%, 0.24);
}

/* Interactive state overlay using ::before pseudo-element */
:is(vaadin-{name}):not([disabled])::before {
  content: '';
  position: absolute;
  inset: calc(var(--vaadin-{name}-border-width, 1px) * -1);
  pointer-events: none;
  border-radius: inherit;
  background-color: currentColor;
  opacity: 0;
  transition:
    opacity 100ms,
    background-color 100ms;
}

/* Advanced color manipulation using oklch and relative colors */
@supports (color: hsl(0 0 0)) {
  :is(vaadin-{name}):not([disabled])::before {
    background-color: oklch(from currentColor calc(l + 0.4 - c) c h / calc(1 - l / 2));
  }
}

/* Hover state */
@media (any-hover: hover) {
  :is(vaadin-{name}):hover:not([disabled], [active])::before {
    opacity: 0.03;
  }

  :is(vaadin-{name})[theme~='primary']:hover:not([disabled], [active])::before {
    opacity: 0.12;
  }
}

/* Active state with scale transform on high-DPI displays */
@media (min-resolution: 2x) {
  :is(vaadin-{name})[active]:not([disabled]) {
    scale: 0.98;
    transition-duration: 50ms;
  }
}

/* Active state overlay */
:is(vaadin-{name})[active]:not([disabled])::before {
  transition-duration: 0s;
  opacity: 0.08;
  background: oklch(from currentColor min(c, 1 - l + c) calc(c * 0.9) h);
}

:is(vaadin-{name})[theme~='primary'][active]:not([disabled])::before {
  opacity: 0.16;
}
```

**Aura Design System Tokens:**

Aura provides a comprehensive set of CSS custom properties:

**Colors:**
- `--aura-accent-color`: Primary accent color
- `--aura-accent-text-color`: Text color for accent elements
- `--aura-accent-contrast-color`: Contrast color for accent backgrounds
- `--aura-accent-border-color`: Border color for accent elements
- `--aura-accent-surface`: Surface color with accent tint
- `--aura-neutral-light` / `--aura-neutral-dark`: Neutral color palette
- `--aura-background-color`: Background color (light-dark aware)

**Typography:**
- `--aura-font-family`: Default font family
- `--aura-font-weight-normal`: 400
- `--aura-font-weight-medium`: 500
- `--aura-font-weight-semibold`: 600
- `--aura-font-weight-bold`: 700

**Surface System:**
- `--aura-surface-level`: Surface elevation level (0-10)
- `--aura-surface-opacity`: Surface opacity

**Sizing:**
- Uses the same `--vaadin-size-*` and `--vaadin-padding-*` tokens as Lumo

**Best Practices for Aura:**
1. Use `:is()` for component selectors to maintain consistent specificity
2. Use `:where()` for variants to allow easier overriding
3. Leverage `light-dark()` for automatic dark mode support
4. Use `oklch()` color space for better color manipulation
5. Use relative color syntax (`from currentColor`) for dynamic color adjustments
6. Always check browser support for modern CSS features
7. Use `@supports` queries for progressive enhancement

---

## TypeScript Definitions

### 1. Mixin TypeScript Definition (`src/vaadin-{name}-mixin.d.ts`)

```typescript
/**
 * @license
 * Copyright (c) {year} - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ActiveMixinClass } from '@vaadin/a11y-base/src/active-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { TabindexMixinClass } from '@vaadin/a11y-base/src/tabindex-mixin.js';

/**
 * A mixin providing common {component} functionality.
 */
export declare function {ComponentName}Mixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ActiveMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<TabindexMixinClass> &
  Constructor<{ComponentName}MixinClass> &
  T;

/**
 * Additional interface members for the mixin (if needed).
 */
export declare class {ComponentName}MixinClass {
  // Add any public methods/properties from the mixin
}
```

### 2. Element TypeScript Definition (`src/vaadin-{name}.d.ts`)

```typescript
/**
 * @license
 * Copyright (c) {year} - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { {ComponentName}Mixin } from './vaadin-{name}-mixin.js';

/**
 * Fired when the value changes.
 */
export type {ComponentName}ChangeEvent = Event & {
  target: {ComponentName};
};

/**
 * Fired when the `value` property changes.
 */
export type {ComponentName}ValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Interface for event map (for TypeScript users).
 */
export interface {ComponentName}EventMap {
  change: {ComponentName}ChangeEvent;
  'value-changed': {ComponentName}ValueChangedEvent;
}

/**
 * Interface for custom events (for TypeScript users).
 */
export interface {ComponentName}CustomEventMap {
  'value-changed': {ComponentName}ValueChangedEvent;
}

/**
 * `<vaadin-{name}>` is a [brief description].
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `label`   | The label element
 *
 * The following state attributes are available for styling:
 *
 * Attribute  | Description
 * -----------|-------------
 * `disabled` | Set when the element is disabled
 * `focused`  | Set when the element is focused
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class {ComponentName} extends {ComponentName}Mixin(ElementMixin(ThemableMixin(HTMLElement))) {
  /**
   * Property description.
   */
  someProperty: string;

  addEventListener<K extends keyof {ComponentName}EventMap>(
    type: K,
    listener: (this: {ComponentName}, ev: {ComponentName}EventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof {ComponentName}EventMap>(
    type: K,
    listener: (this: {ComponentName}, ev: {ComponentName}EventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-{name}': {ComponentName};
  }
}

export { {ComponentName} };
```

### 3. Root TypeScript Definition (`vaadin-{name}.d.ts`)

```typescript
export * from './src/vaadin-{name}.js';
```

### 4. Styles TypeScript Definition (`src/styles/vaadin-{name}-base-styles.d.ts`)

```typescript
/**
 * @license
 * Copyright (c) {year} - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { CSSResult } from 'lit';

export declare const {componentName}Styles: CSSResult;
```

---

## Testing

### 1. Unit Tests (`test/{name}.test.ts`)

```typescript
import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fire, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-{name}.js';
import type { {ComponentName} } from '../vaadin-{name}.js';

describe('vaadin-{name}', () => {
  let element: {ComponentName};

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      element = fixtureSync('<vaadin-{name}></vaadin-{name}>');
      tagName = element.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });

  describe('properties', () => {
    beforeEach(async () => {
      element = fixtureSync('<vaadin-{name}></vaadin-{name}>');
      await nextRender();
    });

    it('should have default value', () => {
      expect(element.someProperty).to.equal('');
    });

    it('should reflect property to attribute', async () => {
      element.someProperty = 'test';
      await nextUpdate(element);
      expect(element.getAttribute('some-property')).to.equal('test');
    });
  });

  describe('events', () => {
    beforeEach(async () => {
      element = fixtureSync('<vaadin-{name}></vaadin-{name}>');
      await nextRender();
    });

    it('should fire change event', async () => {
      const spy = sinon.spy();
      element.addEventListener('change', spy);

      // Trigger change
      element.someProperty = 'new-value';
      await nextUpdate(element);

      expect(spy.calledOnce).to.be.true;
    });

    it('should fire value-changed custom event with detail', async () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);

      element.someProperty = 'new-value';
      await nextUpdate(element);

      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.value).to.equal('new-value');
    });
  });

  describe('keyboard', () => {
    beforeEach(async () => {
      element = fixtureSync('<vaadin-{name}></vaadin-{name}>');
      await nextRender();
      element.focus();
    });

    it('should handle Enter key', async () => {
      const spy = sinon.spy();
      element.addEventListener('click', spy);

      await sendKeys({ down: 'Enter' });

      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      element = fixtureSync('<vaadin-{name}></vaadin-{name}>');
      await nextRender();
    });

    it('should set aria-disabled when disabled', async () => {
      element.disabled = true;
      await nextUpdate(element);

      expect(element.getAttribute('aria-disabled')).to.equal('true');
    });

    it('should not fire events when disabled', async () => {
      const spy = sinon.spy();
      element.addEventListener('click', spy);
      element.disabled = true;
      await nextUpdate(element);

      element.click();

      expect(spy.called).to.be.false;
    });
  });

  describe('accessibility', () => {
    beforeEach(async () => {
      element = fixtureSync('<vaadin-{name}></vaadin-{name}>');
      await nextRender();
    });

    it('should have default role', () => {
      expect(element.getAttribute('role')).to.equal('button');
    });

    it('should have tabindex', () => {
      expect(element.tabIndex).to.equal(0);
    });

    it('should be focusable', () => {
      element.focus();
      expect(document.activeElement).to.equal(element);
    });
  });
});
```

### 2. DOM Snapshot Tests (`test/dom/{name}.test.js`)

```javascript
import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import '../../src/vaadin-{name}.js';

describe('vaadin-{name}', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync('<vaadin-{name}>Label</vaadin-{name}>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(element).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      element.disabled = true;
      await expect(element).dom.to.equalSnapshot();
    });

    it('focused', async () => {
      element.focus({ focusVisible: false });
      await expect(element).dom.to.equalSnapshot();
    });

    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await expect(element).dom.to.equalSnapshot();
    });

    it('active', async () => {
      mousedown(element);
      await expect(element).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(element).shadowDom.to.equalSnapshot();
    });
  });
});
```

### 3. Visual Tests - Lumo (`test/visual/lumo/{name}.test.js`)

```javascript
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/{name}.css';
import '../../../vaadin-{name}.js';

describe('{name}', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-{name}>Label</vaadin-{name}>', div);
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('basic', () => {
    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'disabled');
    });

    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-ring');
    });

    it('active', async () => {
      mousedown(element);
      await visualDiff(div, 'active');
    });
  });

  describe('theme', () => {
    it('primary', async () => {
      element.setAttribute('theme', 'primary');
      await visualDiff(div, 'theme-primary');
    });

    it('primary hover', async () => {
      element.setAttribute('theme', 'primary');
      await sendMouseToElement({ type: 'move', element });
      await visualDiff(div, 'theme-primary-hover');
    });

    it('tertiary', async () => {
      element.setAttribute('theme', 'tertiary');
      await visualDiff(div, 'theme-tertiary');
    });
  });
});
```

### 4. Visual Tests - Aura (`test/visual/aura/{name}.test.js`)

```javascript
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-{name}.js';

describe('{name}', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-{name}>Label</vaadin-{name}>', div);
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('basic', () => {
    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'disabled');
    });

    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-ring');
    });

    it('active', async () => {
      mousedown(element);
      await visualDiff(div, 'active');
    });
  });

  describe('theme', () => {
    it('primary', async () => {
      element.setAttribute('theme', 'primary');
      await visualDiff(div, 'theme-primary');
    });

    it('primary hover', async () => {
      element.setAttribute('theme', 'primary');
      await sendMouseToElement({ type: 'move', element });
      await visualDiff(div, 'theme-primary-hover');
    });

    it('tertiary', async () => {
      element.setAttribute('theme', 'tertiary');
      await visualDiff(div, 'theme-tertiary');
    });
  });
});
```

### 5. TypeScript Type Tests (`test/typings/{name}.types.ts`)

```typescript
import '../../vaadin-{name}.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { {ComponentName}MixinClass } from '../../src/vaadin-{name}-mixin.js';

const assertType = <TExpected>(value: TExpected) => value;

const element = document.createElement('vaadin-{name}');

// Properties
assertType<string>(element.someProperty);

// Mixins
assertType<ElementMixinClass>(element);
assertType<ThemableMixinClass>(element);
assertType<{ComponentName}MixinClass>(element);

// Events
element.addEventListener('change', (event) => {
  assertType<Event>(event);
});

element.addEventListener('value-changed', (event) => {
  assertType<CustomEvent>(event);
  assertType<string>(event.detail.value);
});
```

### 6. Test Coverage Requirements

Ensure these aspects are tested:

**Functionality:**
- [ ] Custom element registration
- [ ] Default property values
- [ ] Property changes and observers
- [ ] Property reflection to attributes
- [ ] Event firing (native and custom)
- [ ] Method behaviors
- [ ] State management

**Accessibility:**
- [ ] Default ARIA role
- [ ] ARIA attributes (aria-disabled, aria-label, etc.)
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Screen reader announcements

**Interactions:**
- [ ] Mouse events (click, hover, mousedown)
- [ ] Keyboard events (Enter, Space, Arrow keys, Tab)
- [ ] Touch events
- [ ] Disabled state prevents interactions

**Visual:**
- [ ] Default appearance (Lumo)
- [ ] Default appearance (Aura)
- [ ] Theme variants (primary, tertiary, etc.) - both themes
- [ ] State variations (disabled, focused, active, hover) - both themes
- [ ] Size variants (small, large) - both themes
- [ ] With slotted content (icons, etc.) - both themes

**DOM Structure:**
- [ ] Light DOM snapshots
- [ ] Shadow DOM snapshots
- [ ] State attribute changes

---

## Documentation

### 1. README.md

```markdown
# @vaadin/{name}

[Brief one-line description of the component].

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/{name})

[![npm version](https://badgen.net/npm/v/@vaadin/{name})](https://www.npmjs.com/package/@vaadin/{name})

\`\`\`html
<vaadin-{name}>Example</vaadin-{name}>
\`\`\`

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/{name}/screenshot.png" width="296" alt="Screenshot of vaadin-{name}">](https://vaadin.com/docs/latest/components/{name})

## Installation

Install the component:

\`\`\`sh
npm i @vaadin/{name}
\`\`\`

Once installed, import the component in your application:

\`\`\`js
import '@vaadin/{name}';
\`\`\`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
```

### 2. JSDoc Comments

**Class-level documentation:**
```javascript
/**
 * `<vaadin-{name}>` is a [detailed description of what the component does].
 *
 * ```html
 * <vaadin-{name}>Example</vaadin-{name}>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `label`   | The label element
 * `prefix`  | A slot for content before the label
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `disabled`   | Set when the element is disabled
 * `focused`    | Set when the element is focused
 *
 * The following custom properties are available:
 *
 * Custom property              | Description                  | Default
 * -----------------------------|------------------------------|----------
 * `--vaadin-{name}-width`      | Width of the component       | `auto`
 * `--vaadin-{name}-font-size`  | Font size                    | `inherit`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the value changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes {ComponentName}Mixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
```

**Property documentation:**
```javascript
/**
 * The value of the component.
 * Can be any valid string.
 *
 * @attr {string} value
 */
```

**Method documentation:**
```javascript
/**
 * Validates the component value.
 * Returns true if valid, false otherwise.
 *
 * @return {boolean} True if valid
 * @protected
 */
```

---

## Accessibility

### 1. ARIA Requirements

**Role:**
- Set appropriate default role in `ready()`:
  ```javascript
  if (!this.hasAttribute('role')) {
    this.setAttribute('role', 'button'); // or appropriate role
  }
  ```

**Common ARIA attributes:**
- `aria-disabled`: Set when disabled
- `aria-label` / `aria-labelledby`: For accessible name
- `aria-describedby`: For additional descriptions
- `aria-expanded`: For expandable elements
- `aria-checked`: For checkable elements
- `aria-selected`: For selectable elements
- `aria-pressed`: For toggle buttons
- `aria-haspopup`: For elements that open popups

### 2. Keyboard Support

**Common patterns:**
- `Enter` / `Space`: Activate
- `Tab` / `Shift+Tab`: Navigate
- `Escape`: Close/Cancel
- Arrow keys: Navigate within component

**Implementation:**
```javascript
/**
 * @param {KeyboardEvent} event
 * @protected
 * @override
 */
_onKeyDown(event) {
  super._onKeyDown(event);

  if (event.altKey || event.shiftKey || event.ctrlKey || event.metaKey) {
    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    this.click();
  }
}
```

### 3. Focus Management

**Focusable:**
- Set `tabindex="0"` by default (use TabindexMixin)
- Make disabled elements non-focusable: `tabindex="-1"`

**Focus indication:**
- Support both `:focus` and `:focus-visible`
- Add `focus-ring` attribute for keyboard focus
- Use FocusMixin for consistent focus behavior

### 4. State Attributes

Always sync state to attributes for styling:
```javascript
static get properties() {
  return {
    disabled: {
      type: Boolean,
      reflectToAttribute: true,
    },
    focused: {
      type: Boolean,
      reflectToAttribute: true,
    },
  };
}
```

---

## Package Configuration

### 1. package.json

```json
{
  "name": "@vaadin/{name}",
  "version": "25.0.0-beta7",
  "publishConfig": {
    "access": "public"
  },
  "description": "vaadin-{name}",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/vaadin/web-components.git",
    "directory": "packages/{name}"
  },
  "author": "Vaadin Ltd",
  "homepage": "https://vaadin.com/components",
  "bugs": {
    "url": "https://github.com/vaadin/web-components/issues"
  },
  "main": "vaadin-{name}.js",
  "module": "vaadin-{name}.js",
  "type": "module",
  "files": [
    "src",
    "vaadin-*.d.ts",
    "vaadin-*.js",
    "web-types.json",
    "web-types.lit.json"
  ],
  "keywords": [
    "Vaadin",
    "{descriptive-keyword}",
    "web-components",
    "web-component"
  ],
  "dependencies": {
    "@open-wc/dedupe-mixin": "^1.3.0",
    "@vaadin/a11y-base": "25.0.0-beta7",
    "@vaadin/component-base": "25.0.0-beta7",
    "@vaadin/vaadin-themable-mixin": "25.0.0-beta7",
    "lit": "^3.0.0"
  },
  "devDependencies": {
    "@vaadin/aura": "25.0.0-beta7",
    "@vaadin/chai-plugins": "25.0.0-beta7",
    "@vaadin/test-runner-commands": "25.0.0-beta7",
    "@vaadin/testing-helpers": "^2.0.0",
    "@vaadin/vaadin-lumo-styles": "25.0.0-beta7",
    "sinon": "^21.0.0"
  },
  "web-types": [
    "web-types.json",
    "web-types.lit.json"
  ]
}
```

**For Pro components**, change license:
```json
{
  "license": "SEE LICENSE IN https://vaadin.com/commercial-license-and-service-terms"
}
```

### 2. LICENSE File

**Apache 2.0** (copy from existing component):
```
Apache License
Version 2.0, January 2004
...
```

**Commercial** (for Pro components):
```
Vaadin Commercial License and Service Terms

See https://vaadin.com/commercial-license-and-service-terms for the full license.
```

### 3. License Headers

**Apache 2.0:**
```javascript
/**
 * @license
 * Copyright (c) {year} - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
```

**Commercial:**
```javascript
/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
```

---

## Common Patterns

### Pattern 1: Simple Interactive Component (Button-like)

**Use when:**
- Component is primarily interactive (clickable)
- Has simple state (disabled, active, focused)
- No complex data management

**Mixins:**
- ButtonMixin or ActiveMixin
- FocusMixin
- TabindexMixin

**Example structure:** See `packages/button/`

### Pattern 2: Field Component (Input-like)

**Use when:**
- Component accepts user input
- Needs validation
- Part of a form

**Mixins:**
- InputControlMixin (used by combo-box, date-picker, time-picker, etc.)
- ValidateMixin
- InputConstraintsMixin
- ClearButtonMixin (if clearable)

**Additional requirements:**
- Use InputContainer component
- Implement label, helper text, error message slots
- Follow field styling conventions

**Example structure:** See `packages/date-picker/`, `packages/combo-box/`, or `packages/time-picker/`

### Pattern 3: Overlay Component (Popup/Dialog)

**Use when:**
- Component displays content in overlay
- Needs positioning logic
- Modal or non-modal behavior

**Base class:**
- Extend from `Overlay` component

**Additional requirements:**
- Use overlay positioning system
- Implement focus trap
- Handle Escape key
- Manage backdrop

**Example structure:** See `packages/dialog/` or `packages/popover/`

### Pattern 4: List/Data Component

**Use when:**
- Component displays list of items
- Supports data provider
- Virtual scrolling needed

**Controllers:**
- DataProviderController
- Virtualizer (for large lists)

**Example structure:** See `packages/combo-box/` or `packages/grid/`

---

## Checklist

Use this checklist when creating a new component:

### File Structure
- [ ] Created `packages/{name}/` directory
- [ ] Created root export file: `vaadin-{name}.js`
- [ ] Created root TypeScript definition: `vaadin-{name}.d.ts`
- [ ] Created src directory with main element
- [ ] Created mixin file (if needed)
- [ ] Created base styles file
- [ ] Created TypeScript definitions for all files
- [ ] Created test directory structure
- [ ] Created package.json
- [ ] Created README.md
- [ ] Copied LICENSE file

### Implementation
- [ ] Element class extends correct mixin chain
- [ ] `static get is()` returns correct tag name
- [ ] `static get styles()` returns styles
- [ ] `static get properties()` defines all properties
- [ ] `render()` method returns Lit template
- [ ] Shadow parts named and documented
- [ ] State attributes added and documented
- [ ] Events fired correctly
- [ ] Event types documented in JSDoc
- [ ] Controllers initialized in `ready()`
- [ ] `defineCustomElement()` called at end

### Styling
- [ ] Base styles use CSS custom properties
- [ ] All custom properties have fallbacks
- [ ] Forced colors mode styles added
- [ ] State selectors use attributes (`:host([disabled])`)
- [ ] Shadow parts styled
- [ ] Theme variants defined (primary, tertiary, etc.)

### Theming
- [ ] Lumo theme CSS created in `packages/vaadin-lumo-styles/`
- [ ] Lumo public CSS file created in `components/{name}.css`
- [ ] Lumo implementation file created in `src/components/{name}.css`
- [ ] Lumo styles use `@media lumo_components_{name}`
- [ ] Aura theme CSS created in `packages/aura/src/components/{name}.css`
- [ ] Aura styles use modern CSS syntax (`:is()`, `:where()`, `light-dark()`, `oklch()`)
- [ ] Aura component imported in `packages/aura/aura.css`
- [ ] Theme variants implemented in both Lumo and Aura
- [ ] Both themes tested for visual consistency

### TypeScript
- [ ] Mixin TypeScript definition created
- [ ] Element TypeScript definition created
- [ ] Event types defined
- [ ] EventMap interface defined
- [ ] Global interface augmentation added
- [ ] Styles TypeScript definition created
- [ ] All exports properly typed

### Testing
- [ ] Unit tests cover functionality
- [ ] Unit tests cover properties
- [ ] Unit tests cover events
- [ ] Unit tests cover keyboard interactions
- [ ] Unit tests cover accessibility
- [ ] DOM snapshot tests created
- [ ] Visual tests for Lumo created in `test/visual/lumo/`
- [ ] Visual tests for Aura created in `test/visual/aura/`
- [ ] Visual tests for base theme created in `test/visual/base/`
- [ ] TypeScript type tests created
- [ ] All tests pass
- [ ] Visual regression tests pass for both themes

### Documentation
- [ ] README.md completed
- [ ] Class JSDoc comment complete
- [ ] Shadow parts documented
- [ ] State attributes documented
- [ ] Custom properties documented
- [ ] Events documented with @fires
- [ ] Properties documented
- [ ] Methods documented

### Accessibility
- [ ] Default ARIA role set
- [ ] ARIA attributes added as needed
- [ ] Keyboard navigation implemented
- [ ] Focus management correct
- [ ] Disabled state handled correctly
- [ ] Screen reader tested (if possible)

### Package
- [ ] package.json has all required fields
- [ ] Dependencies correct (runtime vs dev)
- [ ] License correct (Apache vs Commercial)
- [ ] License headers on all files
- [ ] Version matches monorepo version

### Integration
- [ ] Added to Lumo theme package
- [ ] Added to Aura theme package
- [ ] ESLint passes
- [ ] TypeScript compilation passes
- [ ] All tests pass
- [ ] Visual regression tests pass

### Final Validation
- [ ] `yarn lint` passes
- [ ] `yarn lint:types` passes
- [ ] `yarn test --group {name}` passes
- [ ] `yarn test:lumo --group {name}` passes
- [ ] `yarn test:aura --group {name}` passes
- [ ] Component works in demo/dev environment with both themes
- [ ] Documentation reviewed
- [ ] Accessibility verified
- [ ] Both Lumo and Aura themes properly applied and tested

---

## Additional Resources

### Internal Dependencies

**Core:**
- `@vaadin/component-base`: Base mixins and utilities
- `@vaadin/a11y-base`: Accessibility mixins
- `@vaadin/vaadin-themable-mixin`: Theming system

**Field Components:**
- `@vaadin/field-base`: Field-specific mixins
- `@vaadin/input-container`: Input container component

**Other:**
- `@vaadin/overlay`: Overlay positioning
- `@vaadin/lit-renderer`: Renderer support

### External Dependencies

- `lit`: v3.0.0 or higher
- `@open-wc/dedupe-mixin`: Mixin deduplication

### Development Tools

- `@vaadin/chai-plugins`: Chai assertion plugins
- `@vaadin/test-runner-commands`: Test utilities
- `@vaadin/testing-helpers`: Test helpers
- `sinon`: Spy/stub/mock library

---

## Notes

### Pure Lit Pattern
- **Always** use pure Lit patterns (no PolylitMixin) for new components
- **Use** `firstUpdated()` and `updated()` instead of `ready()` and observers
- **Use** field initializers for default values instead of `value` property option
- **Use** `reflect: true` instead of `reflectToAttribute: true`

### General Best Practices
- **Always** follow existing patterns from similar components
- **Never** skip accessibility requirements
- **Always** test in both themes (Lumo and Aura)
- **Always** verify Aura-specific CSS features are supported by target browsers
- **Never** commit without running linters and tests
- **Always** document breaking changes
- **Never** use `any` in TypeScript definitions
- **Always** provide fallbacks for CSS custom properties
- **Never** hardcode colors or sizes (use design tokens)
- **Always** consider both light and dark modes (especially important for Aura)

### Migration from Legacy Patterns
If you need to understand or maintain existing components that use PolylitMixin:
- `value: defaultValue` → Use field initializer: `myProp = defaultValue;`
- `observer: '_onPropChanged'` → Use `updated()` with `changedProperties.has('myProp')`
- `reflectToAttribute: true` → Use `reflect: true`
- `sync: true` → Not needed in pure Lit
- `notify: true` → Manually fire events in setters or `updated()`
- `computed: '_compute(a, b)'` → Use `updated()` or getters
- `ready()` → Use `firstUpdated()` for one-time initialization

---

## Theme Comparison: Lumo vs Aura

| Aspect | Lumo | Aura |
|--------|------|------|
| **CSS Approach** | `@media` queries for encapsulation | Element selectors with `:is()` |
| **Browser Support** | Broad (legacy browsers) | Modern browsers only |
| **Color System** | HSL-based with custom properties | `oklch()` with relative colors |
| **Dark Mode** | Separate theme variant | Built-in with `light-dark()` |
| **Specificity** | Host-based (`:host`) | Element-based (`:is()`) |
| **File Structure** | Separate public/src files | Direct component files |
| **Build Process** | CSS import only | PostCSS processing |
| **Design Philosophy** | Business applications | Modern, consumer-facing |

---

*Last updated: 2025-12-08*

*Note: This guide uses pure Lit patterns. Existing components may use PolylitMixin for backward compatibility.*
