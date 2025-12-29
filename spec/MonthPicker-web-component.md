# MonthPicker Web Component Specification

## Executive Summary

The MonthPicker component allows users to select a month and year, without day-level granularity. This addresses a common use case in business applications where operations are month-based (financial reporting, billing cycles, subscription management, etc.). The component provides a streamlined interface for month selection with full internationalization, accessibility, and validation support.

## Research Summary

### User Requirements (from GitHub Issues)

1. **vaadin/web-components#1865** - "Give an option to select months and year only"
   - Use case: Business calculations run between ends of months
   - Current workaround: Hacking date-picker or using custom components

2. **vaadin/flow-components#6659** - Request for Month Picker and Year Picker modes
   - Reference to HTML5 `<input type="month">`
   - Proposed approaches: separate component vs. mode on DatePicker
   - Use cases: Financial reporting, subscription management

3. **i18n Requirements** - Multiple issues about month name localization
   - Need automatic month names via `Intl.DateTimeFormat`
   - Support for different calendar systems
   - First day of week configuration

### Industry Analysis

**Material UI (MUI)**
- Uses `views={['year', 'month']}` prop to configure view hierarchy
- `openTo="month"` controls initial view
- Separate `MonthCalendar` component available
- Full keyboard navigation and ARIA support

**Ant Design**
- Deprecated separate MonthPicker in favor of `<DatePicker picker="month" />`
- Supports multiple picker modes: date, week, month, quarter, year
- Uses Day.js for date handling
- Consistent API across all picker types

**Adobe Spectrum (React Aria)**
- Comprehensive ARIA grid pattern implementation
- Full keyboard navigation (arrow keys, enter, escape)
- Internationalization via `@internationalized/date`
- Min/max validation built-in
- Screen reader tested on desktop and mobile

**HTML5 Native**
- `<input type="month">` provides month picker
- Inconsistent browser support (Safari macOS lacks support)
- Graceful degradation to text input
- Accessibility concerns with cross-browser inconsistency

### Key Insights

1. **Separate component preferred** - Cleaner API than mode switching
2. **Follow HTML5 semantics** - Value format as "YYYY-MM", return first day of month
3. **Reuse date-picker patterns** - Overlay, i18n, validation, keyboard navigation
4. **Accessibility critical** - ARIA grid pattern, keyboard navigation, screen reader support
5. **Business use case dominant** - Month-end operations, financial periods, subscriptions

## Usage Examples

### Basic Usage

```html
<vaadin-month-picker label="Select Month"></vaadin-month-picker>
```

```javascript
const picker = document.querySelector('vaadin-month-picker');
picker.addEventListener('change', (e) => {
  console.log('Selected:', e.target.value); // "2025-03"
});
```

### With Initial Value

```html
<vaadin-month-picker
  label="Start Month"
  value="2025-01">
</vaadin-month-picker>
```

### Min/Max Validation

```html
<vaadin-month-picker
  label="Report Month"
  min="2024-01"
  max="2025-12"
  value="2025-03">
</vaadin-month-picker>
```

```javascript
picker.i18n = {
  monthNames: ['January', 'February', ...],
  cancel: 'Cancel',
  clear: 'Clear'
};
```

### Required Field

```html
<vaadin-month-picker
  label="Billing Month"
  required
  error-message="Month is required">
</vaadin-month-picker>
```

### Disabled State

```html
<vaadin-month-picker
  label="Archive Month"
  disabled>
</vaadin-month-picker>
```

### Custom Format Display

```javascript
picker.i18n = {
  ...picker.i18n,
  formatDisplay: (month, year) => `${month}/${year}`, // "03/2025"
  parseInput: (text) => {
    const [month, year] = text.split('/');
    return { month: parseInt(month), year: parseInt(year) };
  }
};
```

### With Helper Text

```html
<vaadin-month-picker
  label="Subscription Month"
  helper-text="Select the month your subscription starts">
</vaadin-month-picker>
```

## Component Architecture

### Technology Stack

- **Base Framework**: Lit 3 with TypeScript 5
- **Mixins**:
  - `LitElement` (base)
  - `LumoInjectionMixin` (theme injection)
  - `ThemableMixin` (theme switching)
  - `ElementMixin` (Vaadin behaviors)
  - `MonthPickerMixin` (component logic)
- **Date Handling**: Native JavaScript Date with Intl API for localization

### Component Structure

```
packages/month-picker/
├── vaadin-month-picker.js          # Root export
├── vaadin-month-picker.d.ts        # TypeScript definitions
├── src/
│   ├── vaadin-month-picker.js      # Main component
│   ├── vaadin-month-picker.d.ts
│   ├── vaadin-month-picker-mixin.js
│   ├── vaadin-month-picker-mixin.d.ts
│   ├── vaadin-month-calendar.js    # Internal: month grid
│   ├── vaadin-month-calendar.d.ts
│   ├── vaadin-month-scroller.js    # Internal: year/month scroller
│   ├── vaadin-month-scroller.d.ts
│   ├── vaadin-month-picker-overlay.js
│   ├── vaadin-month-picker-overlay.d.ts
│   └── styles/
│       ├── vaadin-month-picker-base-styles.js
│       ├── vaadin-month-calendar-base-styles.js
│       └── vaadin-month-scroller-base-styles.js
└── test/
    ├── month-picker.test.ts
    ├── month-calendar.test.ts
    ├── typings/month-picker.types.ts
    ├── dom/month-picker.test.js
    └── visual/
        ├── lumo/month-picker.test.js
        └── aura/month-picker.test.js
```

**Note on Theme Files**: Theme styles are **NOT** stored in the component package. They reside in separate theme packages:

- **Lumo theme styles**: `packages/vaadin-lumo-styles/components/month-picker.css`
- **Aura theme styles**: `packages/aura/src/components/month-picker.css`

The component package only contains base structural styles in `src/styles/`.

## API Design

### Properties

#### Value Management

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `""` | Selected month in ISO 8601 format ("YYYY-MM"). Updates on selection. |
| `initialPosition` | `string` | Current month | Month/year shown when overlay opens ("YYYY-MM") |
| `name` | `string` | `""` | Name attribute for form submission |

#### Validation

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `required` | `boolean` | `false` | Whether month selection is required |
| `invalid` | `boolean` | `false` | Validation state |
| `errorMessage` | `string` | `""` | Error message shown when invalid |
| `min` | `string` | `""` | Minimum selectable month ("YYYY-MM") |
| `max` | `string` | `""` | Maximum selectable month ("YYYY-MM") |

#### UI Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | `""` | Label text |
| `placeholder` | `string` | `""` | Placeholder text when no value |
| `helperText` | `string` | `""` | Helper text below input |
| `disabled` | `boolean` | `false` | Whether component is disabled |
| `readonly` | `boolean` | `false` | Whether component is read-only |
| `autoOpenDisabled` | `boolean` | `false` | Disable automatic overlay opening on focus |
| `clearButtonVisible` | `boolean` | `false` | Show clear button when value exists |
| `opened` | `boolean` | `false` | Whether overlay is open |

#### Internationalization

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `i18n` | `MonthPickerI18n` | See below | Localization strings and formatters |

**MonthPickerI18n Interface:**

```typescript
interface MonthPickerI18n {
  // Month names (full)
  monthNames: string[]; // ['January', 'February', ...]

  // Button labels
  clear: string;        // 'Clear'
  cancel: string;       // 'Cancel'

  // Display formatting
  formatTitle: (month: number, year: number) => string; // "March 2025"

  // Input parsing (optional)
  parseInput?: (text: string) => { month: number; year: number } | null;

  // Display formatting for input field
  formatDisplay?: (month: number, year: number) => string; // "03/2025"
}
```

### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `open()` | `() => void` | Opens the month picker overlay |
| `close()` | `() => void` | Closes the month picker overlay |
| `validate()` | `() => boolean` | Validates current value, returns true if valid |
| `checkValidity()` | `() => boolean` | Checks validity without side effects |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `change` | `Event` | Fired when value changes (user interaction only) |
| `value-changed` | `CustomEvent<{value: string}>` | Fired when value property changes |
| `opened-changed` | `CustomEvent<{value: boolean}>` | Fired when overlay opens/closes |
| `invalid-changed` | `CustomEvent<{value: boolean}>` | Fired when validation state changes |
| `validated` | `CustomEvent<{valid: boolean}>` | Fired after validation |

### CSS Custom Properties

#### Input Field

| Property | Default | Description |
|----------|---------|-------------|
| `--vaadin-month-picker-field-width` | `auto` | Width of input field |
| `--vaadin-month-picker-field-height` | `var(--lumo-size-m)` | Height of input field |
| `--vaadin-month-picker-background` | `var(--lumo-base-color)` | Background color |
| `--vaadin-month-picker-border-radius` | `var(--lumo-border-radius-m)` | Border radius |

#### Overlay

| Property | Default | Description |
|----------|---------|-------------|
| `--vaadin-month-picker-overlay-width` | `300px` | Overlay width |
| `--vaadin-month-picker-overlay-height` | `auto` | Overlay height |

#### Calendar

| Property | Default | Description |
|----------|---------|-------------|
| `--vaadin-month-calendar-cell-size` | `60px` | Size of month cells |
| `--vaadin-month-calendar-gap` | `var(--lumo-space-xs)` | Gap between cells |

### Shadow Parts

#### Main Component

| Part | Description |
|------|-------------|
| `label` | Label element |
| `input-field` | Input field wrapper |
| `value` | Value display element |
| `clear-button` | Clear button |
| `toggle-button` | Button to open overlay |

#### Overlay

| Part | Description |
|------|-------------|
| `overlay` | Overlay container |
| `overlay-header` | Header with year selector |
| `year-scroller` | Year selection scroller |
| `month-calendar` | Month grid container |
| `toolbar` | Bottom toolbar with buttons |
| `clear-button` | Clear button in toolbar |
| `cancel-button` | Cancel button in toolbar |

#### Month Calendar

| Part | Description |
|------|-------------|
| `month` | Individual month cell |
| `month-selected` | Selected month cell |
| `month-focused` | Focused month cell |
| `month-disabled` | Disabled month cell |
| `month-current` | Current month indicator |

### State Attributes

| Attribute | Description |
|-----------|-------------|
| `disabled` | Component is disabled |
| `readonly` | Component is read-only |
| `invalid` | Validation failed |
| `required` | Value is required |
| `has-value` | Component has a value |
| `focused` | Component has focus |
| `focus-ring` | Keyboard focus indicator |
| `opened` | Overlay is open |

## DOM Structure

### Closed State

```html
<vaadin-month-picker
  has-value
  class="vaadin-month-picker">
  #shadow-root
    <div part="label">
      <slot name="label">Label</slot>
    </div>

    <div part="input-field">
      <div part="value">March 2025</div>
      <div part="clear-button" hidden></div>
      <div part="toggle-button">
        <!-- Calendar icon -->
      </div>
    </div>

    <div part="helper-text">
      <slot name="helper">Helper text</slot>
    </div>

    <div part="error-message" hidden>
      Error message
    </div>
</vaadin-month-picker>
```

### Opened State

```html
<vaadin-month-picker opened>
  <!-- Main component shadow DOM -->

  <vaadin-month-picker-overlay>
    #shadow-root
      <div part="overlay">
        <div part="overlay-header">
          <button part="prev-year">‹</button>
          <div part="year-display">2025</div>
          <button part="next-year">›</button>
        </div>

        <vaadin-month-calendar>
          #shadow-root
            <div part="months">
              <div part="month" tabindex="0">Jan</div>
              <div part="month" tabindex="-1">Feb</div>
              <div part="month month-selected" tabindex="-1" aria-selected="true">Mar</div>
              <div part="month" tabindex="-1">Apr</div>
              <!-- ... remaining months -->
            </div>
        </vaadin-month-calendar>

        <div part="toolbar">
          <button part="clear-button">Clear</button>
          <button part="cancel-button">Cancel</button>
        </div>
      </div>
  </vaadin-month-picker-overlay>
</vaadin-month-picker>
```

## Behavior Specification

### Value Handling

1. **Value Format**: ISO 8601 month format "YYYY-MM" (e.g., "2025-03")
2. **Internal Representation**: JavaScript Date object set to first day of month at 00:00:00
3. **Empty Value**: Empty string `""` indicates no selection
4. **Value Constraints**:
   - Must be valid month (01-12)
   - Must be within min/max range if specified
   - Year must be 1000-9999 (practical range)

### Month Selection Flow

1. User clicks input field → overlay opens
2. Overlay shows current month/year or `initialPosition`
3. User navigates with:
   - Arrow keys to move between months
   - Click to select month
   - Year arrows to change year
4. On selection:
   - Value updates to "YYYY-MM" of selected month
   - Overlay closes
   - `change` event fires
   - Focus returns to input field

### Keyboard Navigation

#### Input Field (Closed)

| Key | Action |
|-----|--------|
| `Space`, `Enter`, `ArrowDown` | Open overlay |
| `ArrowUp` | Open overlay, focus on current/previous month |
| `Escape` | Close overlay (if open) |

#### Overlay (Opened)

| Key | Action |
|-----|--------|
| `ArrowUp` | Move focus up (4 months back) |
| `ArrowDown` | Move focus down (4 months forward) |
| `ArrowLeft` | Move focus left (1 month back) |
| `ArrowRight` | Move focus right (1 month forward) |
| `Enter`, `Space` | Select focused month, close overlay |
| `Escape` | Close overlay without selection |
| `Tab` | Move to next focusable (year buttons, clear, cancel) |
| `Shift+Tab` | Move to previous focusable |
| `Home` | Focus first month (January) |
| `End` | Focus last month (December) |
| `PageUp` | Previous year |
| `PageDown` | Next year |

### Validation

#### Validation Triggers

1. On blur (when component loses focus)
2. On value change
3. On explicit `validate()` call
4. On form submission

#### Validation Rules

1. **Required**: Value must not be empty if `required=true`
2. **Min**: Value must be >= `min` if specified
3. **Max**: Value must be <= `max` if specified
4. **Format**: Value must be valid "YYYY-MM" format

#### Validation States

- **Valid**: `invalid=false`, no error message shown
- **Invalid**: `invalid=true`, error message shown, `aria-invalid="true"`
- **Pending**: During user interaction before blur

### Internationalization

#### Automatic Localization

When `i18n.monthNames` is not provided, automatically generate using `Intl.DateTimeFormat`:

```javascript
const locale = document.documentElement.lang || 'en-US';
const monthNames = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(2000, i, 1);
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
});
```

#### Default i18n Object

```javascript
{
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
               'July', 'August', 'September', 'October', 'November', 'December'],
  clear: 'Clear',
  cancel: 'Cancel',
  formatTitle: (month, year) => `${monthNames[month - 1]} ${year}`,
  formatDisplay: (month, year) => `${month}/${year}`
}
```

### Accessibility

#### ARIA Attributes

**Main Input:**
```html
<div
  role="combobox"
  aria-haspopup="dialog"
  aria-expanded="false"
  aria-label="Select month"
  aria-required="true"
  aria-invalid="false"
  aria-describedby="helper-text error-message">
```

**Month Calendar Grid:**
```html
<div
  role="grid"
  aria-label="Month selection">
  <div role="row">
    <div
      role="gridcell"
      aria-selected="false"
      aria-label="January 2025"
      aria-disabled="false"
      tabindex="-1">
```

#### Focus Management

1. Opening overlay: Focus moves to selected month or current month
2. Closing overlay: Focus returns to input field
3. Focus visible indicator on keyboard navigation only (`focus-ring` attribute)
4. Focus trap within overlay when modal mode

#### Screen Reader Support

- Month cells announced with full context: "January 2025"
- Selected state announced: "January 2025, selected"
- Disabled state announced: "February 2024, unavailable"
- Current month indicated: "March 2025, current month"
- Live region announces year changes: "Showing 2026"

### Overlay Behavior

#### Positioning

- Default: Below input field, left-aligned
- Fallback: Above input field if insufficient space below
- Responsive: Full-screen on mobile viewports
- Flip: Automatically adjusts position to stay in viewport

#### Opening Triggers

- Click on input field
- Focus + Space/Enter/ArrowDown
- Click on toggle button
- Programmatic: `open()` method

#### Closing Triggers

- Select month (with confirmation)
- Click Cancel button
- Press Escape key
- Click outside overlay (backdrop)
- Blur when `opened=false` set programmatically
- Programmatic: `close()` method

## Implementation Phases

### Phase 1: Core Functionality (MVP)

**Goal**: Basic month selection with essential features

**Features**:
- [x] Basic month grid (3x4 layout)
- [x] Value property (ISO 8601 "YYYY-MM" format)
- [x] Year navigation (prev/next buttons)
- [x] Month selection (click)
- [x] Overlay open/close
- [x] Basic keyboard navigation (arrows, enter, escape)
- [x] Label, placeholder, helper-text
- [x] Disabled state
- [x] Basic Lumo theme

**API Stability**:
- `value` property (stable)
- `label`, `placeholder`, `helperText` (stable)
- `disabled` (stable)
- `change` event (stable)
- `opened` property (stable)

**DOM Structure** (stable):
- Input field parts: `label`, `input-field`, `value`, `toggle-button`
- Overlay parts: `overlay`, `overlay-header`, `month-calendar`, `toolbar`
- Month cell parts: `month`, `month-selected`, `month-focused`

**Testing**:
- Unit tests for value handling
- Keyboard navigation tests
- Basic visual regression (Lumo)

### Phase 2: Validation & Forms

**Goal**: Form integration and validation

**Features**:
- [x] Required validation
- [x] Min/max constraints
- [x] Invalid state and error messages
- [x] Form association
- [x] `validate()` method
- [x] Validation events
- [x] Clear button

**New API**:
- `required`, `invalid`, `errorMessage` (stable)
- `min`, `max` (stable)
- `clearButtonVisible` (stable)
- `validate()`, `checkValidity()` methods (stable)
- `invalid-changed`, `validated` events (stable)

**Testing**:
- Validation logic tests
- Form submission tests
- Min/max constraint tests

### Phase 3: Internationalization

**Goal**: Full i18n support

**Features**:
- [x] i18n property
- [x] Custom month names
- [x] Automatic Intl.DateTimeFormat integration
- [x] Custom formatters (formatTitle, formatDisplay)
- [x] Input parsing (parseInput)
- [x] RTL support

**New API**:
- `i18n` property (stable)
- MonthPickerI18n interface (stable)

**Testing**:
- Multiple locale tests
- RTL layout tests
- Custom formatter tests

### Phase 4: Enhanced Accessibility

**Goal**: WCAG 2.1 AA compliance

**Features**:
- [x] Full ARIA grid pattern
- [x] Complete keyboard navigation (Home, End, PageUp, PageDown)
- [x] Focus trap in overlay
- [x] Live regions for announcements
- [x] High contrast mode support
- [x] Screen reader testing (NVDA, JAWS, VoiceOver)
- [x] Mobile accessibility (TalkBack, VoiceOver)

**Testing**:
- Automated accessibility tests (axe-core)
- Manual screen reader testing
- Keyboard-only navigation testing
- Mobile accessibility testing

### Phase 5: Advanced Features

**Goal**: Power user features and edge cases

**Features**:
- [x] Readonly state
- [x] AutoOpenDisabled flag
- [x] initialPosition property
- [x] Custom overlay positioning
- [x] Month disable function (advanced validation)
- [x] Aura theme support
- [x] Theme variants (filled, outlined)

**New API** (stable if added):
- `readonly` property
- `autoOpenDisabled` property
- `initialPosition` property
- `isMonthDisabled` function property

**Testing**:
- Edge case tests
- Theme variant tests (Aura)
- Complex validation scenarios

### Phase 6: Performance & Polish

**Goal**: Production-ready quality

**Features**:
- [x] Lazy loading optimization
- [x] Animation polish
- [x] Reduced bundle size
- [x] Documentation completeness
- [x] Code examples
- [x] API reference documentation
- [x] Migration guide (if breaking changes)

**Testing**:
- Performance benchmarks
- Bundle size tracking
- Cross-browser testing
- Documentation review

## vaadin.com/docs Documentation

### Overview Page

**Title**: MonthPicker

**Description**:
MonthPicker is a field component that allows users to select a specific month and year. It's ideal for business applications where operations are month-based, such as financial reporting, billing cycles, or subscription management.

**When to Use**:
- Monthly financial reports selection
- Subscription period selection
- Billing cycle configuration
- Any month-level data filtering

**When Not to Use**:
- When day-level precision is needed (use DatePicker instead)
- For date ranges (use DatePicker with range mode)
- For time selection (use TimePicker or DateTimePicker)

### Basic Usage

**Example**: Simple month selection
```html
<vaadin-month-picker
  label="Report Month"
  value="2025-03">
</vaadin-month-picker>
```

**Code Explanation**:
- `label`: Descriptive text for the field
- `value`: Selected month in "YYYY-MM" format

### Validation

**Example**: Required field with min/max
```html
<vaadin-month-picker
  label="Subscription Start"
  required
  min="2025-01"
  max="2025-12"
  error-message="Please select a month in 2025"
  helper-text="Choose when your subscription begins">
</vaadin-month-picker>
```

**Validation Types**:
1. **Required**: Ensures a month is selected
2. **Min**: Restricts selection to months >= min
3. **Max**: Restricts selection to months <= max

### Internationalization

**Example**: German localization
```javascript
const picker = document.querySelector('vaadin-month-picker');
picker.i18n = {
  monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
               'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  clear: 'Löschen',
  cancel: 'Abbrechen',
  formatTitle: (month, year) => `${picker.i18n.monthNames[month - 1]} ${year}`
};
```

**Automatic Localization**:
The component automatically uses `Intl.DateTimeFormat` based on `<html lang="...">` attribute if month names are not explicitly provided.

### Keyboard Navigation

**Input Field**:
- `Space`, `Enter`, `↓`: Open month picker
- `↑`: Open and focus previous month
- `Escape`: Close picker

**Month Selection**:
- `Arrow Keys`: Navigate between months
- `Home`: Jump to January
- `End`: Jump to December
- `PageUp`: Previous year
- `PageDown`: Next year
- `Enter`/`Space`: Select month
- `Escape`: Cancel selection

### Accessibility

**Screen Reader Support**:
- Full ARIA grid pattern implementation
- Month cells announced with context
- Selected state clearly indicated
- Keyboard navigation fully supported

**Focus Management**:
- Focus trap within overlay
- Focus returns to input after selection
- Visual focus indicators for keyboard users

### Styling

**Example**: Custom styling
```css
vaadin-month-picker {
  --vaadin-month-picker-field-width: 200px;
  --vaadin-month-calendar-cell-size: 70px;
}

vaadin-month-picker::part(input-field) {
  background: var(--lumo-contrast-5pct);
}

vaadin-month-picker::part(month-selected) {
  background: var(--lumo-primary-color);
  color: var(--lumo-primary-contrast-color);
}
```

**Available Parts**:
- `label`, `input-field`, `value`, `toggle-button`, `clear-button`
- `overlay`, `overlay-header`, `month-calendar`, `toolbar`
- `month`, `month-selected`, `month-focused`, `month-disabled`

**Custom Properties**:
- `--vaadin-month-picker-field-width`
- `--vaadin-month-picker-field-height`
- `--vaadin-month-calendar-cell-size`
- `--vaadin-month-calendar-gap`

### Best Practices

**Do**:
- ✓ Use for month-level data filtering
- ✓ Provide clear labels and helper text
- ✓ Set appropriate min/max ranges
- ✓ Use required validation when applicable
- ✓ Localize for international users

**Don't**:
- ✗ Use for day-specific dates (use DatePicker)
- ✗ Omit labels for accessibility
- ✗ Set unrealistic min/max ranges
- ✗ Forget to handle validation errors

### API Reference

Link to full API documentation with:
- All properties with types and defaults
- All methods with signatures
- All events with payload types
- All CSS custom properties
- All shadow parts
- TypeScript interfaces

## Breaking Changes Policy

### Stable API (v1.0+)

Once released as v1.0, the following are considered stable and will not change without major version bump:

1. **Public Properties**: All documented properties
2. **Events**: Event names and payload structures
3. **Methods**: Public method signatures
4. **DOM Structure**: All `part` attributes
5. **Value Format**: ISO 8601 "YYYY-MM" format
6. **CSS Custom Properties**: Documented theme properties

### Internal API (Can Change in Minor Versions)

1. Internal component implementations (vaadin-month-calendar, vaadin-month-scroller)
2. Private methods and properties
3. Internal CSS classes (not exposed as parts)
4. Implementation details of mixins

### Deprecation Process

1. Feature marked as deprecated in documentation
2. Console warning added for usage
3. Alternative solution documented
4. Minimum 1 major version before removal

## References

### Research Sources

1. [vaadin/web-components#1865](https://github.com/vaadin/web-components/issues/1865) - Month/Year only selection request
2. [vaadin/flow-components#6659](https://github.com/vaadin/flow-components/issues/6659) - MonthPicker/YearPicker modes
3. [MUI DatePicker](https://mui.com/x/react-date-pickers/date-picker/) - Views configuration pattern
4. [Ant Design DatePicker](https://ant.design/components/date-picker/) - Picker modes approach
5. [Adobe Spectrum DatePicker](https://react-spectrum.adobe.com/react-aria/DatePicker.html) - Accessibility implementation
6. [MDN input type=month](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/month) - HTML5 semantics
7. [W3C Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/) - ARIA patterns
8. [DigitalA11Y Date Picker Accessibility](https://www.digitala11y.com/input-type-date-the-accessibility-of-html-date-picker/) - Accessibility best practices

### Internal References

- Vaadin Web Components Guidelines
- Vaadin DatePicker component (code reuse patterns)
- Vaadin Overlay component (positioning patterns)
- Vaadin Field component (form integration patterns)
