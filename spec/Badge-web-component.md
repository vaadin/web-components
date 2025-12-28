# Badge Web Component Specification

## Overview

The `<vaadin-badge>` component is a small visual indicator used to draw attention, display statuses, counts, or labels. It provides a clean, accessible way to highlight information without cluttering the interface.

## Research Summary

### GitHub Issues Analysis

**Issue #5379 - Badge component (OPEN)**
- Primary feature request for a dedicated Badge component
- Key requirements:
  1. Set text content
  2. Apply predefined styles: `error`, `success`, `small`, `contrast`, `primary`, `pill`
  3. Add icons before or after text
  4. Tooltip support
- Currently using theme-based badge styles from Lumo which are "unintuitive to use"

**Issue #1596 - Enhanced color palette**
- Request to make Avatar's color palette available for badges
- Color coding is important for tag use cases
- Colors should be contrast-compliant

**Issue #8237 - Utility classes**
- Mentions badges could be refactored from theme-based styling to utility classes
- Current theme attribute approach should be moved away from

**Issue #4636 - flex-shrink:0 default (CLOSED)**
- Badges suffer from unintended shrinkage in flex containers
- Solution: Set `flex-shrink: 0` by default

**Issue #1655 - Add extra colors (CLOSED)**
- Request for Warning (orange) and Info/Yellow colors
- Currently only Success (green) and Error (red) available

### Current Lumo Badge Styles

Vaadin currently has badge styles in `@vaadin/vaadin-lumo-styles/badge.js` using theme attributes:
- Applied via `theme="badge"` attribute
- Variants: `primary`, `success`, `error`, `contrast`, `small`, `pill`
- Works on any element (span, icon, etc.)
- Not a dedicated component

### Component Library Analysis

**Shoelace `<sl-badge>`:**
- Variants: `primary`, `success`, `neutral`, `warning`, `danger`
- `pill` attribute for rounded edges
- `pulse` attribute for pulsating animation
- Simple slot-based content
- CSS parts for customization

**Chakra UI Badge:**
- Multiple color schemes (gray, red, orange, yellow, green, teal, blue, cyan, purple, pink)
- Variants: `subtle` (low contrast), `solid` (bold)
- Inline status indicators
- 20px default height
- Semantic color variables

**MUI Badge:**
- **Two modes**:
  1. **Standalone badge** - Text/status label
  2. **Notification badge** - Overlays on another element (top-right positioning)
- Anchor positioning system
- Invisible state with scale transform
- Supports badge content (text, numbers)

**Ant Design Badge:**
- Indicator height: 20px (standard), 14px (small)
- Dot variant: 6px
- Text font size: 12px
- Status badge variant (6px dot with text label)
- Z-index management for overlays

### Key Findings

1. **Two Distinct Patterns**:
   - **Standalone Badge**: Tag/label shown independently (Vaadin's current use)
   - **Notification Badge**: Overlays on another element (MUI pattern)

2. **Essential Features**:
   - Text content
   - Color variants (success, error, warning, neutral, primary)
   - Size variants (small, default)
   - Shape variants (default, pill)
   - Icon support
   - Pulse/attention animation

3. **Advanced Features**:
   - Tooltip integration
   - Avatar color palette (multiple custom colors)
   - Notification badge positioning
   - Dot variant (no text, just indicator)
   - Max count display (e.g., "99+")

4. **Accessibility**:
   - Must not rely solely on color
   - Proper ARIA labeling
   - Screen reader support for counts/status

## Usage Examples

### Basic Usage

```html
<!-- Simple text badge -->
<vaadin-badge>New</vaadin-badge>

<!-- With theme variant -->
<vaadin-badge theme="success">Active</vaadin-badge>
<vaadin-badge theme="error">Error</vaadin-badge>
<vaadin-badge theme="primary">Premium</vaadin-badge>
```

### Size and Shape Variants

```html
<!-- Small badge -->
<vaadin-badge theme="small">Tiny</vaadin-badge>

<!-- Pill shape (rounded ends) -->
<vaadin-badge theme="pill">Rounded</vaadin-badge>

<!-- Combined variants -->
<vaadin-badge theme="primary pill">VIP</vaadin-badge>
<vaadin-badge theme="success small">✓</vaadin-badge>
```

### With Icons

```html
<!-- Icon before text -->
<vaadin-badge>
  <vaadin-icon icon="vaadin:check" slot="prefix"></vaadin-icon>
  Verified
</vaadin-badge>

<!-- Icon after text -->
<vaadin-badge theme="error">
  Alert
  <vaadin-icon icon="vaadin:exclamation" slot="suffix"></vaadin-icon>
</vaadin-badge>

<!-- Icon only -->
<vaadin-badge theme="pill">
  <vaadin-icon icon="vaadin:star"></vaadin-icon>
</vaadin-badge>
```

### Status Indicators

```html
<!-- Status with text -->
<vaadin-badge theme="success">
  <span slot="prefix" class="status-dot"></span>
  Online
</vaadin-badge>

<!-- Dot only indicator -->
<vaadin-badge variant="dot" theme="success" aria-label="Online"></vaadin-badge>
```

### Notification Badge (Phase 2)

```html
<!-- Badge overlaying a button -->
<vaadin-button>
  Inbox
  <vaadin-badge slot="badge" theme="primary">3</vaadin-badge>
</vaadin-button>

<!-- Badge on icon -->
<vaadin-icon icon="vaadin:bell">
  <vaadin-badge slot="badge" theme="error" variant="dot"></vaadin-badge>
</vaadin-icon>

<!-- Max count -->
<vaadin-button>
  Messages
  <vaadin-badge slot="badge" max="99">150</vaadin-badge>
</vaadin-button>
```

### Custom Colors (Phase 2)

```html
<!-- Using color attribute -->
<vaadin-badge color="1">Color 1</vaadin-badge>
<vaadin-badge color="2">Color 2</vaadin-badge>

<!-- Using CSS custom properties -->
<vaadin-badge style="--vaadin-badge-background: #9C27B0; --vaadin-badge-color: white;">
  Custom
</vaadin-badge>
```

### With Pulse Animation

```html
<!-- Pulsing badge for attention -->
<vaadin-badge theme="error" pulse>Action Required</vaadin-badge>
```

### Interactive Badges

```html
<!-- Removable badge (tag) -->
<vaadin-badge>
  JavaScript
  <vaadin-icon
    icon="vaadin:close-small"
    slot="suffix"
    @click="${this._removeTag}">
  </vaadin-icon>
</vaadin-badge>

<!-- Clickable badge -->
<vaadin-badge @click="${this._handleClick}" role="button" tabindex="0">
  Click me
</vaadin-badge>
```

## Component API

### Phase 1: Core Features (Initial Release)

#### Properties/Attributes

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `theme` | `theme` | `string` | `''` | Theme variants: `primary`, `success`, `error`, `contrast`, `small`, `pill` (space-separated) |
| `ariaLabel` | `aria-label` | `string` | `''` | Accessible label when text content isn't sufficient |

#### Slots

| Slot | Description |
|------|-------------|
| (default) | The badge's main content (text, icons, etc.) |
| `prefix` | Content shown before the main content (icons, status dots) |
| `suffix` | Content shown after the main content (icons, close buttons) |

#### CSS Shadow Parts

| Part | Description |
|------|-------------|
| `base` | The component's root container |
| `prefix` | Container for prefix slot content |
| `content` | Container for default slot content |
| `suffix` | Container for suffix slot content |

#### CSS Custom Properties

| Property | Description | Default |
|----------|-------------|---------|
| `--vaadin-badge-background` | Background color | Theme-dependent |
| `--vaadin-badge-color` | Text/content color | Theme-dependent |
| `--vaadin-badge-font-size` | Font size | `var(--lumo-font-size-xs)` |
| `--vaadin-badge-font-weight` | Font weight | `500` |
| `--vaadin-badge-height` | Minimum height | `var(--lumo-size-s)` |
| `--vaadin-badge-padding` | Internal padding | `0 var(--lumo-space-xs)` |
| `--vaadin-badge-border-radius` | Corner radius | `var(--lumo-border-radius-s)` |

#### Theme Variants

| Variant | Description |
|---------|-------------|
| `primary` | Primary theme color background |
| `success` | Success/positive state (green) |
| `error` | Error/negative state (red) |
| `warning` | Warning state (orange) |
| `contrast` | High contrast (dark on light, light on dark) |
| `small` | Reduced size for compact layouts |
| `pill` | Fully rounded ends (border-radius: 999px) |

#### State Attributes

| Attribute | Description |
|-----------|-------------|
| `empty` | Present when badge has no text content |
| `has-prefix` | Present when prefix slot has content |
| `has-suffix` | Present when suffix slot has content |

### Phase 2: Enhanced Features

#### Additional Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `variant` | `variant` | `'standard' \| 'dot'` | `'standard'` | Badge display mode |
| `color` | `color` | `string` | `''` | Color palette index (1-10 for avatar-like colors) |
| `pulse` | `pulse` | `boolean` | `false` | Enables pulsing animation |
| `max` | `max` | `number` | `Infinity` | Maximum number to display (shows "99+" when exceeded) |
| `value` | `value` | `number \| string` | `''` | Numeric badge value (for notification badges) |
| `hidden` | `hidden` | `boolean` | `false` | Hides the badge with scale transform |

#### Additional Theme Variants

| Variant | Description |
|---------|-------------|
| `info` | Info state (blue) |
| `neutral` | Neutral/default state (gray) |

#### Additional CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--vaadin-badge-dot-size` | Size of dot variant | `8px` |
| `--vaadin-badge-animation-duration` | Pulse animation duration | `1.4s` |

### Phase 3: Advanced Features

#### Additional Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `overlap` | `overlap` | `'circular' \| 'rectangular'` | `'rectangular'` | How badge overlaps its anchor |
| `anchorOrigin` | — | `{vertical, horizontal}` | `{vertical: 'top', horizontal: 'right'}` | Position of badge relative to anchor |
| `showZero` | `show-zero` | `boolean` | `false` | Show badge when value is 0 |

#### Additional Slots

| Slot | Description |
|------|-------------|
| `badge` | When badge is used as overlay on parent element |

## DOM Structure

The badge will have the following Shadow DOM structure:

```html
<span part="base" class="vaadin-badge">
  <span part="prefix" class="prefix">
    <slot name="prefix"></slot>
  </span>
  <span part="content" class="content">
    <slot></slot>
  </span>
  <span part="suffix" class="suffix">
    <slot name="suffix"></slot>
  </span>
</span>
```

**Important**: This DOM structure with part names is part of the stable API and should not break between versions.

## Implementation Plan

### Technology Stack

- **Base Class**: Lit 3 (`LitElement`)
- **Mixin Chain**: `BadgeMixin(ThemableMixin(LitElement))`
- **Language**: TypeScript 5
- **Testing**: Web Test Runner with Mocha, Chai, Sinon

### File Structure

```
packages/badge/
├── src/
│   ├── vaadin-badge.ts              # Main element class
│   ├── vaadin-badge.d.ts            # TypeScript definitions
│   ├── vaadin-badge-mixin.ts        # Component logic mixin
│   ├── vaadin-badge-mixin.d.ts      # Mixin TypeScript definitions
│   └── styles/
│       └── vaadin-badge-base-styles.ts  # Base styles
├── theme/
│   ├── lumo/
│   │   ├── vaadin-badge-styles.ts   # Lumo theme
│   │   └── vaadin-badge.ts          # Lumo themed export
│   └── aura/
│       ├── vaadin-badge-styles.ts   # Aura theme
│       └── vaadin-badge.ts          # Aura themed export
├── test/
│   ├── vaadin-badge.test.ts         # Unit tests
│   ├── dom/
│   │   └── badge.test.js            # DOM snapshot tests
│   ├── visual/
│   │   ├── lumo/
│   │   │   └── badge.test.js        # Lumo visual tests
│   │   └── aura/
│   │       └── badge.test.js        # Aura visual tests
│   └── typings/
│       └── badge.types.ts           # TypeScript type tests
├── vaadin-badge.ts                  # Root export
├── vaadin-badge.d.ts                # Root TypeScript export
├── package.json
├── README.md
└── LICENSE
```

### Core Implementation Details

#### 1. Badge Mixin (`vaadin-badge-mixin.ts`)

```typescript
export declare function BadgeMixin<T extends Constructor<LitElement>>(
  base: T
): Constructor<BadgeMixinClass> & T;

export interface BadgeMixinClass {
  // Properties
  theme: string;
  ariaLabel: string;

  // Phase 2
  variant: 'standard' | 'dot';
  color: string;
  pulse: boolean;
  max: number;
  value: number | string;
  hidden: boolean;

  // Phase 3
  overlap: 'circular' | 'rectangular';
  anchorOrigin: { vertical: 'top' | 'bottom', horizontal: 'left' | 'right' };
  showZero: boolean;

  // Internal methods
  _updateSlotState(): void;
  _getDisplayValue(): string;
}
```

Key responsibilities:
- Manage theme variants
- Handle slot state tracking
- Process max value logic for counts
- Apply color palette
- Manage visibility state

#### 2. Main Element (`vaadin-badge.ts`)

```typescript
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BadgeMixin } from './vaadin-badge-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { baseStyles } from './styles/vaadin-badge-base-styles.js';

@customElement('vaadin-badge')
export class Badge extends BadgeMixin(ThemableMixin(LitElement)) {
  static override styles = baseStyles;

  @property({ type: String, reflect: true })
  theme = '';

  @property({ type: String, attribute: 'aria-label' })
  ariaLabel = '';

  protected override render() {
    return html`
      <span part="base">
        <span part="prefix" ?hidden="${!this._hasPrefix}">
          <slot name="prefix" @slotchange="${this._onPrefixSlotChange}"></slot>
        </span>
        <span part="content">
          <slot @slotchange="${this._onSlotChange}"></slot>
        </span>
        <span part="suffix" ?hidden="${!this._hasSuffix}">
          <slot name="suffix" @slotchange="${this._onSuffixSlotChange}"></slot>
        </span>
      </span>
    `;
  }

  private _hasPrefix = false;
  private _hasSuffix = false;

  private _onPrefixSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._hasPrefix = slot.assignedNodes().length > 0;
    this.toggleAttribute('has-prefix', this._hasPrefix);
  }

  private _onSuffixSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._hasSuffix = slot.assignedNodes().length > 0;
    this.toggleAttribute('has-suffix', this._hasSuffix);
  }

  private _onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const hasContent = slot.assignedNodes().some(
      node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() ||
              node.nodeType === Node.ELEMENT_NODE
    );
    this.toggleAttribute('empty', !hasContent);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-badge': Badge;
  }
}
```

#### 3. Base Styles (`vaadin-badge-base-styles.ts`)

```typescript
import { css } from 'lit';

export const baseStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-height: var(--vaadin-badge-height, var(--lumo-size-s));
    padding: var(--vaadin-badge-padding, 0 var(--lumo-space-xs));
    font-size: var(--vaadin-badge-font-size, var(--lumo-font-size-xs));
    font-weight: var(--vaadin-badge-font-weight, 500);
    line-height: 1;
    border-radius: var(--vaadin-badge-border-radius, var(--lumo-border-radius-s));
    background-color: var(--vaadin-badge-background, var(--lumo-contrast-10pct));
    color: var(--vaadin-badge-color, var(--lumo-body-text-color));
    white-space: nowrap;
    flex-shrink: 0; /* Prevent unwanted shrinking in flex containers */
    user-select: none;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='base'] {
    display: flex;
    align-items: center;
    gap: var(--lumo-space-xs);
  }

  [part='prefix'],
  [part='suffix'] {
    display: flex;
    align-items: center;
  }

  [part='prefix'][hidden],
  [part='suffix'][hidden] {
    display: none;
  }

  /* Pill variant */
  :host([theme~='pill']) {
    border-radius: 999px;
  }

  /* Small variant */
  :host([theme~='small']) {
    min-height: calc(var(--lumo-size-s) * 0.75);
    font-size: var(--lumo-font-size-xxs);
    padding: 0 calc(var(--lumo-space-xs) * 0.75);
  }

  /* Dot variant */
  :host([variant='dot']) {
    min-height: var(--vaadin-badge-dot-size, 8px);
    min-width: var(--vaadin-badge-dot-size, 8px);
    padding: 0;
    border-radius: 50%;
  }

  :host([variant='dot']) [part='content'],
  :host([variant='dot']) [part='prefix'],
  :host([variant='dot']) [part='suffix'] {
    display: none;
  }

  /* Pulse animation */
  @keyframes badge-pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }

  :host([pulse]) {
    animation: badge-pulse var(--vaadin-badge-animation-duration, 1.4s) ease-in-out infinite;
  }

  /* Empty state */
  :host([empty]) [part='content'] {
    display: none;
  }
`;
```

#### 4. Lumo Theme (`theme/lumo/vaadin-badge-styles.ts`)

```typescript
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-badge',
  css`
    :host {
      --vaadin-badge-height: var(--lumo-size-s);
      --vaadin-badge-font-size: var(--lumo-font-size-xs);
      --vaadin-badge-padding: 0 var(--lumo-space-xs);
      --vaadin-badge-border-radius: var(--lumo-border-radius-s);
      font-family: var(--lumo-font-family);
    }

    /* Primary */
    :host([theme~='primary']) {
      --vaadin-badge-background: var(--lumo-primary-color);
      --vaadin-badge-color: var(--lumo-primary-contrast-color);
    }

    /* Success */
    :host([theme~='success']) {
      --vaadin-badge-background: var(--lumo-success-color);
      --vaadin-badge-color: var(--lumo-success-contrast-color);
    }

    /* Error */
    :host([theme~='error']) {
      --vaadin-badge-background: var(--lumo-error-color);
      --vaadin-badge-color: var(--lumo-error-contrast-color);
    }

    /* Warning */
    :host([theme~='warning']) {
      --vaadin-badge-background: var(--lumo-warning-color);
      --vaadin-badge-color: var(--lumo-warning-contrast-color);
    }

    /* Contrast */
    :host([theme~='contrast']) {
      --vaadin-badge-background: var(--lumo-contrast);
      --vaadin-badge-color: var(--lumo-base-color);
    }

    /* Info */
    :host([theme~='info']) {
      --vaadin-badge-background: var(--lumo-primary-color-10pct);
      --vaadin-badge-color: var(--lumo-primary-text-color);
    }

    /* Neutral */
    :host([theme~='neutral']) {
      --vaadin-badge-background: var(--lumo-contrast-10pct);
      --vaadin-badge-color: var(--lumo-body-text-color);
    }

    /* Small */
    :host([theme~='small']) {
      --vaadin-badge-height: calc(var(--lumo-size-s) * 0.75);
      --vaadin-badge-font-size: var(--lumo-font-size-xxs);
      --vaadin-badge-padding: 0 calc(var(--lumo-space-xs) * 0.75);
    }

    /* Avatar color palette */
    :host([color='1']) {
      --vaadin-badge-background: var(--vaadin-user-color-1);
      --vaadin-badge-color: var(--lumo-base-color);
    }

    :host([color='2']) {
      --vaadin-badge-background: var(--vaadin-user-color-2);
      --vaadin-badge-color: var(--lumo-base-color);
    }

    :host([color='3']) {
      --vaadin-badge-background: var(--vaadin-user-color-3);
      --vaadin-badge-color: var(--lumo-base-color);
    }

    :host([color='4']) {
      --vaadin-badge-background: var(--vaadin-user-color-4);
      --vaadin-badge-color: var(--lumo-base-color);
    }

    :host([color='5']) {
      --vaadin-badge-background: var(--vaadin-user-color-5);
      --vaadin-badge-color: var(--lumo-base-color);
    }

    :host([color='6']) {
      --vaadin-badge-background: var(--vaadin-user-color-6);
      --vaadin-badge-color: var(--lumo-base-color);
    }

    :host([color='7']) {
      --vaadin-badge-background: var(--vaadin-user-color-7);
      --vaadin-badge-color: var(--lumo-base-color);
    }
  `,
  { moduleId: 'lumo-badge' }
);
```

#### 5. Max Value Logic (Phase 2)

```typescript
// In BadgeMixin
private _getDisplayValue(): string {
  if (this.variant === 'dot') {
    return '';
  }

  const numValue = typeof this.value === 'number' ? this.value : parseInt(this.value, 10);

  if (isNaN(numValue)) {
    return String(this.value);
  }

  if (numValue === 0 && !this.showZero) {
    return '';
  }

  if (this.max !== Infinity && numValue > this.max) {
    return `${this.max}+`;
  }

  return String(numValue);
}

// Update render to use display value
protected override render() {
  const displayValue = this._getDisplayValue();

  return html`
    <span part="base">
      <span part="prefix" ?hidden="${!this._hasPrefix}">
        <slot name="prefix" @slotchange="${this._onPrefixSlotChange}"></slot>
      </span>
      <span part="content">
        ${displayValue || html`<slot @slotchange="${this._onSlotChange}"></slot>`}
      </span>
      <span part="suffix" ?hidden="${!this._hasSuffix}">
        <slot name="suffix" @slotchange="${this._onSuffixSlotChange}"></slot>
      </span>
    </span>
  `;
}
```

### Accessibility Implementation

1. **Semantic HTML**: Use `<span>` with appropriate ARIA attributes
2. **Screen Reader Support**:
   - Provide `aria-label` for badges without text (icons, dots)
   - Use `aria-live="polite"` for dynamic badge values
   - Include hidden text for screen readers when needed
3. **Color Independence**: Don't rely solely on color
   - Include icons or text labels
   - Ensure sufficient color contrast (WCAG AA: 4.5:1 for text, 3:1 for UI components)
4. **Interactive Badges**:
   - Add `role="button"` or `role="link"` for clickable badges
   - Ensure keyboard accessibility (`tabindex="0"`)
   - Support Enter and Space key activation

Example with accessibility:

```typescript
// For notification badge with count
protected override render() {
  const count = this._getDisplayValue();
  const hasCount = count && parseInt(count) > 0;

  return html`
    <span
      part="base"
      role="status"
      aria-label="${hasCount ? `${count} unread notifications` : ''}"
      aria-live="polite"
    >
      ${/* render content */}
    </span>
  `;
}
```

### Testing Strategy

#### Unit Tests

```typescript
// test/vaadin-badge.test.ts
import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-badge.js';

describe('vaadin-badge', () => {
  let badge;

  beforeEach(() => {
    badge = fixtureSync('<vaadin-badge>Test</vaadin-badge>');
  });

  describe('properties', () => {
    it('should have default theme empty', () => {
      expect(badge.theme).to.equal('');
    });

    it('should reflect theme attribute', () => {
      badge.theme = 'primary';
      expect(badge.getAttribute('theme')).to.equal('primary');
    });

    it('should support multiple theme variants', () => {
      badge.theme = 'primary small';
      expect(badge.hasAttribute('theme')).to.be.true;
    });
  });

  describe('slots', () => {
    it('should have default slot for content', () => {
      const slot = badge.shadowRoot.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('should have prefix slot', () => {
      const slot = badge.shadowRoot.querySelector('slot[name="prefix"]');
      expect(slot).to.exist;
    });

    it('should have suffix slot', () => {
      const slot = badge.shadowRoot.querySelector('slot[name="suffix"]');
      expect(slot).to.exist;
    });

    it('should add has-prefix attribute when prefix slot has content', async () => {
      badge = fixtureSync(`
        <vaadin-badge>
          <span slot="prefix">!</span>
          Test
        </vaadin-badge>
      `);
      await badge.updateComplete;
      expect(badge.hasAttribute('has-prefix')).to.be.true;
    });
  });

  describe('max value', () => {
    it('should display value when below max', () => {
      badge.value = 50;
      badge.max = 99;
      expect(badge._getDisplayValue()).to.equal('50');
    });

    it('should display max+ when value exceeds max', () => {
      badge.value = 150;
      badge.max = 99;
      expect(badge._getDisplayValue()).to.equal('99+');
    });

    it('should hide zero value by default', () => {
      badge.value = 0;
      badge.showZero = false;
      expect(badge._getDisplayValue()).to.equal('');
    });

    it('should show zero when showZero is true', () => {
      badge.value = 0;
      badge.showZero = true;
      expect(badge._getDisplayValue()).to.equal('0');
    });
  });

  describe('variant', () => {
    it('should have standard variant by default', () => {
      expect(badge.variant).to.equal('standard');
    });

    it('should support dot variant', () => {
      badge.variant = 'dot';
      expect(badge.getAttribute('variant')).to.equal('dot');
    });
  });

  describe('accessibility', () => {
    it('should set aria-label', () => {
      badge.ariaLabel = 'New notification';
      expect(badge.getAttribute('aria-label')).to.equal('New notification');
    });
  });
});
```

#### Visual Regression Tests

```javascript
// test/visual/lumo/badge.test.js
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-badge.js';

describe('badge', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-badge>Badge</vaadin-badge>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('primary', async () => {
    element.theme = 'primary';
    await visualDiff(div, 'primary');
  });

  it('success', async () => {
    element.theme = 'success';
    await visualDiff(div, 'success');
  });

  it('error', async () => {
    element.theme = 'error';
    await visualDiff(div, 'error');
  });

  it('warning', async () => {
    element.theme = 'warning';
    await visualDiff(div, 'warning');
  });

  it('small', async () => {
    element.theme = 'small';
    await visualDiff(div, 'small');
  });

  it('pill', async () => {
    element.theme = 'pill';
    await visualDiff(div, 'pill');
  });

  it('with icon prefix', async () => {
    element.innerHTML = `
      <vaadin-icon icon="vaadin:check" slot="prefix"></vaadin-icon>
      Verified
    `;
    await element.updateComplete;
    await visualDiff(div, 'icon-prefix');
  });

  it('dot variant', async () => {
    element.variant = 'dot';
    element.theme = 'success';
    await visualDiff(div, 'dot');
  });

  it('pulsing', async () => {
    element.pulse = true;
    element.theme = 'error';
    await visualDiff(div, 'pulse');
  });
});
```

## Documentation Plan (vaadin.com/docs)

### 1. Overview Page

**URL**: `/components/badge`

**Content**:
- Brief description of Badge component and its purposes
- Live interactive examples
- Comparison with existing badge theme styles
- When to use Badge vs other components (Tag, Chip, Label)
- Accessibility statement
- Browser support

### 2. Usage Guide

**URL**: `/components/badge/usage`

**Content sections**:

#### Basic Usage
- Simple text badge
- Theme variants (primary, success, error, warning, contrast)
- Size variants (small, default)
- Shape variants (default, pill)

#### With Icons
- Icon prefix
- Icon suffix
- Icon-only badges

#### Status Indicators
- Online/offline status
- Dot indicators
- Status with text

#### Tags and Labels
- Category tags
- Removable tags
- Color-coded tags
- Clickable badges

#### Notification Badges (Phase 2)
- Badge overlay on buttons
- Badge overlay on icons
- Count badges
- Max count display
- Dot notification badge

#### Animation
- Pulse effect for attention
- When to use animation

### 3. Styling Guide

**URL**: `/components/badge/styling`

**Content**:

#### CSS Custom Properties
- Complete list with defaults
- Examples of customization

#### Shadow Parts
- Styling individual parts
- Examples for each part

#### Theme Variants
- Lumo theme variants
- Aura theme variants
- Creating custom themes

#### Color Palette
- Avatar color palette usage
- Custom colors
- Ensuring contrast compliance

#### Responsive Design
- Badge sizing for different viewports
- Mobile considerations

### 4. API Reference

**URL**: `/components/badge/api`

**Content**:
- Complete API documentation
- Properties table
- Attributes table
- Slots table
- CSS Parts table
- CSS Custom Properties table
- State Attributes table
- Theme Variants table

### 5. Accessibility Guide

**URL**: `/components/badge/accessibility`

**Content**:

#### Screen Reader Support
- Using aria-label
- Dynamic content announcements
- Icon-only badges

#### Color Considerations
- Not relying solely on color
- Sufficient contrast ratios
- Supporting high contrast mode

#### Interactive Badges
- Keyboard support
- Focus management
- ARIA roles for clickable badges

#### Best Practices
- When to use badges
- Appropriate labeling
- Status communication

### 6. Examples Gallery

**URL**: `/components/badge/examples`

**Content**:
- E-commerce product labels (New, Sale, Out of Stock)
- User status indicators (Online, Away, Offline)
- Notification counts on navigation
- Tag selection interface
- Category filters
- Task status badges

### 7. Migration Guide

**URL**: `/components/badge/migration`

**Content**:
- Migrating from theme-based badge styles
- Converting `theme="badge"` to `<vaadin-badge>`
- API differences
- Breaking changes between phases

### 8. Best Practices

**URL**: `/components/badge/best-practices`

**Content**:

#### When to Use
- Status indicators
- Labels and tags
- Notification counts
- Category markers

#### When NOT to Use
- Long text content (use Chip or Tag instead)
- Primary call-to-action (use Button)
- Form validation (use field error messages)

#### UX Guidelines
- Keep text concise (1-3 words)
- Use appropriate colors for context
- Don't overuse badges
- Ensure readability

#### Performance
- Limit animated badges
- Optimize for many badges in lists

## Accessibility Compliance

The Badge component will meet WCAG 2.1 Level AA standards:

1. **Perceivable**:
   - Color contrast ratio of at least 4.5:1 for text on background
   - UI component contrast of at least 3:1 against adjacent colors
   - Don't rely solely on color to convey information
   - Support for high contrast modes

2. **Operable**:
   - Keyboard accessible for interactive badges
   - Clickable badges have visible focus indicators
   - Touch targets of at least 44×44 CSS pixels for interactive badges

3. **Understandable**:
   - Clear visual indication of purpose
   - Consistent behavior across similar badges
   - Proper labeling with ARIA attributes

4. **Robust**:
   - Valid HTML structure
   - Proper ARIA attributes
   - Works with assistive technologies

## Internationalization

1. **Text Direction**: Support RTL languages
2. **Number Formatting**: Locale-aware number display for counts
3. **No Hard-coded Text**: All text from slots/properties
4. **Icon Direction**: Consider icon orientation in RTL

## Performance Considerations

1. **Bundle Size**: Target < 3 KB (gzip) for base component
2. **Rendering**: Lightweight DOM structure
3. **Animation**: CSS-based, 60 FPS
4. **Memory**: Minimal overhead per instance

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)

## Release Strategy

### Version 1.0.0 (Phase 1 - Core Features)

**Target**: Initial stable release

**Features**:
- Basic text badge
- Theme variants (primary, success, error, warning, contrast)
- Size variants (small, default)
- Shape variants (default, pill)
- Icon slots (prefix, suffix)
- Lumo and Aura themes
- CSS Shadow Parts
- CSS Custom Properties
- Accessibility features

### Version 1.1.0 (Phase 2 - Enhanced Features)

**Target**: 2-3 months after v1.0.0

**Features**:
- Dot variant
- Color palette (avatar colors)
- Pulse animation
- Max count logic
- Value property for numeric badges
- Hidden state
- Notification badge positioning
- Info and neutral theme variants

**API Stability**: No breaking changes to Phase 1 API

### Version 1.2.0 (Phase 3 - Advanced Features)

**Target**: 4-6 months after v1.1.0

**Features**:
- Advanced positioning (overlap, anchorOrigin)
- Show zero option
- Enhanced notification badge features

**API Stability**: No breaking changes to Phase 1 & 2 APIs

## Breaking Change Policy

To maintain API stability:

1. **Shadow Parts**: Part names will not change or be removed
2. **Properties**: Public properties will not be removed
3. **Slots**: Slot names will not change
4. **Theme Variants**: Existing variants will remain compatible
5. **DOM Structure**: Overall structure will remain compatible

New features will be additive only. Deprecation warnings will be provided for at least one major version before any breaking changes.

## Dependencies

### Runtime Dependencies
- `lit` ^3.0.0
- `@vaadin/component-base` (for mixins)
- `@vaadin/vaadin-themable-mixin`
- `@vaadin/vaadin-lumo-styles` (theme package)

### Development Dependencies
- TypeScript 5
- Web Test Runner (testing)
- Mocha, Chai, Sinon (test assertions)
- Visual Regression Plugin
- ESLint (linting)
- Prettier (formatting)

## Comparison with Existing Lumo Badge Styles

| Aspect | Current (theme-based) | New Component |
|--------|----------------------|---------------|
| **Usage** | `<span theme="badge">Text</span>` | `<vaadin-badge>Text</vaadin-badge>` |
| **Flexibility** | Works on any element | Dedicated component |
| **Type Safety** | No TypeScript support | Full TypeScript definitions |
| **Slot Support** | No | Prefix, suffix, default slots |
| **Icon Integration** | Manual | Built-in slot support |
| **Accessibility** | Manual ARIA | Built-in ARIA support |
| **Notification Badge** | Not supported | Supported (Phase 2) |
| **API** | Theme attributes only | Rich property API |

## Migration from Lumo Badge Styles

Users currently using theme-based badges:

**Before**:
```html
<span theme="badge primary">New</span>
<span theme="badge success small">Active</span>
```

**After**:
```html
<vaadin-badge theme="primary">New</vaadin-badge>
<vaadin-badge theme="success small">Active</vaadin-badge>
```

The transition is straightforward - replace the element with `<vaadin-badge>` and keep the same theme attributes.

## Success Criteria

The component will be considered successful when:

1. ✅ GitHub issue #5379 can be closed
2. ✅ Component passes all accessibility audits
3. ✅ Component achieves target performance benchmarks
4. ✅ Documentation receives positive feedback
5. ✅ Adoption rate shows migration from theme-based badges
6. ✅ Bug reports are minimal
7. ✅ API remains stable across releases
8. ✅ Community provides positive feedback

## Open Questions for Review

1. **Should dot variant support text content for screen readers?**
2. **Should we support badge groups/badge list component?**
3. **Should removable badges fire a remove event or expect manual handling?**
4. **Should we support badge animations beyond pulse (e.g., bounce, shake)?**
5. **Should the notification badge be a separate component or mode of main badge?**

## Future Enhancements (Beyond Phase 3)

Ideas for potential future releases (no commitment):

1. **Badge Group Component**: Manage multiple badges with overflow
2. **Interactive States**: Hover, active, focus styles for clickable badges
3. **Loading State**: Show loading indicator in badge
4. **Custom Shapes**: Beyond pill and default (hexagon, octagon)
5. **Gradient Backgrounds**: Support for gradient colors
6. **Shadow/Elevation**: Material Design-style elevation
7. **Tooltip Integration**: Built-in tooltip on hover
8. **Badge List**: Component for managing tag lists with add/remove

## Conclusion

This specification provides a comprehensive plan for building a production-ready Badge component for Vaadin. The phased approach ensures a solid foundation in Phase 1, with room for enhancement in later phases without breaking the API. The component will be a significant improvement over the current theme-based badge styles, providing better developer experience, accessibility, and flexibility.
