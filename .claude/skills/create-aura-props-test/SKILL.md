---
name: create-aura-props-test
description: Create a test file that verifies custom CSS properties for a Vaadin component in the Aura theme
argument-hint: <component-name> <styling-docs-url>
disable-model-invocation: true
---

# Create Aura CSS Props Test

Create a test file that verifies custom CSS properties exposed by a Vaadin web component can be customized by developers. The goal is to confirm that when a developer sets a documented CSS custom property on the component, the expected visual change occurs.

This tests the Aura theme specifically.

## Arguments

- `$0` - Component name (e.g., `avatar`, `text-field`, `button`)
- `$1` - URL to the component's styling documentation page (e.g., `https://vaadin.com/docs/latest/components/text-field/styling`)

## Process

### Step 1: Gather Information

1. **Fetch the documentation page** at `$1` to get the list of documented custom CSS properties for the component. If the document has multiple tables, gather properties from all tables.

2. **Identify which properties are supported by Aura theme.** The documentation tables have a column indicating which themes each property supports. Only test properties that are marked as supporting Aura. Skip properties marked as Lumo-only.

3. **Read an existing test file as reference** (e.g., `test/aura-props/text-field.test.js`) to understand the expected structure and patterns.

4. **Explore the component source code** to understand:
   - The component's shadow DOM structure (template)
   - Which elements have `part` attributes
   - Where each CSS custom property is applied

   Key files to examine:
   - `packages/$0/src/vaadin-$0.js` - Main component file with template
   - `packages/$0/src/styles/*.js` - Base styles
   - `packages/aura/src/components/$0.css` - Aura theme overrides (if exists)
   - Search for `--vaadin-$0` in the codebase to find where properties are defined/used

### Step 2: Map Properties to Elements

For each CSS custom property that is supported by Aura (identified in Step 1), determine:

1. **Which element** the property is applied to (find this in the component's styles):
   - Host element (`:host`) - use `getComputedStyle(element)`
   - A shadow DOM part (`[part="..."]`) - use `element.shadowRoot.querySelector('[part="..."]')`
   - A pseudo-element (`::before`, `::after`) - use `getComputedStyle(element, '::before')`
   - A nested component in shadow DOM - use `element.shadowRoot.querySelector('vaadin-...')`

2. **Which CSS property** to check in `getComputedStyle()`:
   - `--vaadin-*-background` → usually `background-color`
   - `--vaadin-*-color` → usually `color`
   - `--vaadin-*-font-size` → `font-size`
   - `--vaadin-*-font-weight` → `font-weight`
   - `--vaadin-*-border-color` → `border-color`
   - `--vaadin-*-border-width` → `border-width`
   - `--vaadin-*-border-radius` → `border-radius`
   - etc.

3. **What setup** is required (if any) - check what state/attribute triggers the property:
   - `element.disabled = true` for disabled state properties
   - `element.focus()` for focus state properties
   - Setting content/attributes to make parts visible (e.g., `element.label = 'Test'` to show label part)
   - Check the component's API documentation for available properties

### Step 3: Write the Test File

Create `test/aura-props/$0.test.js` with this structure:

```javascript
import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/$0/src/vaadin-$0.js';

// Consolidated TODOs go here at the top:
// TODO: <property-name> - <reason for failure or missing documentation>

export const props = [
  // === Category Name ===
  {
    name: '--vaadin-property-name',
    value: 'test-value',
    setup(element) {
      // Optional: setup code to enable the property's effect
    },
    compute(element) {
      // Return the computed style value to compare against
      const target = element.shadowRoot.querySelector('[part="..."]');
      return getComputedStyle(target).getPropertyValue('css-property').trim();
    },
  },
  // ... more properties
];

describe('$0', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-$0></vaadin-$0>');
    await nextUpdate(element);
  });

  props.forEach(({ name, value, setup, compute }) => {
    it(`should apply ${name} property`, async () => {
      element.style.setProperty(name, value);
      await nextUpdate(element);
      if (setup) {
        await setup(element);
        await nextUpdate(element);
      }
      const actual = await compute(element);
      expect(actual).to.equal(value);
    });
  });
});
```

### Step 4: Choose Test Values

Pick test values that:
- Are valid CSS values for the property type
- Noticeably differ from defaults
- Are easy to compare exactly

Examples:
- Colors: `rgb(255, 0, 0)`, `rgb(0, 255, 0)`, `rgb(0, 0, 255)`
- Sizes: `20px`, `30px`, `100px`
- Font weights: `700`, `800`
- Cursors: `pointer`, `crosshair`
- Content: `"!"`, `"*"`

### Step 5: Run Tests and Analyze Failures

Run the tests:
```bash
yarn test:aura-props --glob="$0*"
```

For each failing test:

1. **Verify the test setup is correct**:
   - Is the element selector correct?
   - Is the CSS property name correct?
   - Is the required setup in place?

2. **If the setup is correct**, the failure indicates a gap. Add a TODO at the top of the file explaining why:
   - Theme override with higher specificity
   - Property not actually used in Aura theme

**IMPORTANT: Keep both the failing test AND the TODO.** Do not remove or skip failing tests. Do not try to make them pass. The purpose of this test file is to document what works and what doesn't. Failing tests are valuable as they highlight gaps in the implementation.

### Step 6: Handle Undocumented Properties

If you discover properties that are used in the implementation but NOT in the documentation:
1. Add a test for them
2. Add a TODO at the top noting they are missing from docs

**Note:** Properties prefixed with an underscore (e.g., `--_internal-prop`) are internal implementation details and don't need to be covered.

Example:
```javascript
// TODO: --vaadin-component-undocumented-prop is not documented but is used
// in component-base-styles.js:42 to set the border color.
```

## Common Patterns

### Host Element Properties
```javascript
{
  name: '--vaadin-avatar-background',
  value: 'rgb(255, 0, 0)',
  compute(element) {
    return getComputedStyle(element).getPropertyValue('background-color').trim();
  },
}
```

### Shadow DOM Part Properties
```javascript
{
  name: '--vaadin-button-text-color',
  value: 'rgb(50, 100, 150)',
  compute(element) {
    const label = element.shadowRoot.querySelector('[part="label"]');
    return getComputedStyle(label).getPropertyValue('color').trim();
  },
}
```

### Pseudo-Element Properties
```javascript
{
  name: '--vaadin-avatar-border-color',
  value: 'rgb(0, 0, 255)',
  compute(element) {
    return getComputedStyle(element, '::before').getPropertyValue('outline-color').trim();
  },
}
```

### State-Dependent Properties
```javascript
{
  name: '--vaadin-button-disabled-background',
  value: 'rgb(200, 200, 200)',
  setup(element) {
    element.disabled = true;
  },
  compute(element) {
    return getComputedStyle(element).getPropertyValue('background-color').trim();
  },
}
```

### Properties Requiring Content Setup
```javascript
{
  name: '--vaadin-badge-text-color',
  value: 'rgb(100, 100, 100)',
  setup(element) {
    element.textContent = 'Badge'; // Make content visible
  },
  compute(element) {
    return getComputedStyle(element).getPropertyValue('color').trim();
  },
}
```

## Reference Files

- Example test (simple component): `test/aura-props/avatar.test.js`
- Example test (input field component): `test/aura-props/text-field.test.js`
- Test runner config: `web-test-runner-aura-props.config.js`
- Aura theme styles: `packages/aura/src/components/`

## Notes on Component Types

**Simple components** (avatar, button, badge, etc.):
- Properties typically apply to the host element or shadow DOM parts
- Look for styles in `packages/<component>/src/styles/`

**Input field components** (text-field, number-field, combo-box, etc.):
- Use shared styles from `packages/field-base/src/styles/`
- Have an `<vaadin-input-container part="input-field">` element
- Many `--vaadin-input-field-*` properties apply to this input-container
- Have common parts: `label`, `helper-text`, `error-message`, `required-indicator`
- Use `element.shadowRoot.querySelector('[part="input-field"]')` to access the input container

Identify the component type by checking if it imports from `field-base` or `input-container` packages.
