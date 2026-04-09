# Vaadin Stepper Web Component

> ⚠️ This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.stepperComponent = true`

## Usage Examples

### 1. Basic Horizontal Stepper

```html
<vaadin-stepper>
  <vaadin-stepper-step label="Contact Info"></vaadin-stepper-step>
  <vaadin-stepper-step label="Shipping Address"></vaadin-stepper-step>
  <vaadin-stepper-step label="Payment"></vaadin-stepper-step>
  <vaadin-stepper-step label="Review"></vaadin-stepper-step>
</vaadin-stepper>
<script>
  document.querySelector('vaadin-stepper').selected = 1;
</script>
```

### 2. Steps with Completed and Error States

```html
<vaadin-stepper>
  <vaadin-stepper-step label="Account" complete></vaadin-stepper-step>
  <vaadin-stepper-step label="Profile" complete></vaadin-stepper-step>
  <vaadin-stepper-step label="Billing" invalid></vaadin-stepper-step>
  <vaadin-stepper-step label="Summary"></vaadin-stepper-step>
</vaadin-stepper>
<script>
  document.querySelector('vaadin-stepper').selected = 2;
</script>
```

### 3. Non-Linear Navigation (Steps Are Clickable)

```html
<vaadin-stepper non-linear>
  <vaadin-stepper-step label="General"></vaadin-stepper-step>
  <vaadin-stepper-step label="Details"></vaadin-stepper-step>
  <vaadin-stepper-step label="Attachments"></vaadin-stepper-step>
  <vaadin-stepper-step label="Submit"></vaadin-stepper-step>
</vaadin-stepper>
<script>
  const stepper = document.querySelector('vaadin-stepper');
  stepper.addEventListener('selected-changed', (e) => {
    console.log('Navigated to step:', e.detail.value);
  });
</script>
```

### 4. Vertical Layout

```html
<vaadin-stepper orientation="vertical">
  <vaadin-stepper-step label="Select campaign type" complete></vaadin-stepper-step>
  <vaadin-stepper-step label="Configure audience" complete></vaadin-stepper-step>
  <vaadin-stepper-step label="Set budget"></vaadin-stepper-step>
  <vaadin-stepper-step label="Launch"></vaadin-stepper-step>
</vaadin-stepper>
<script>
  document.querySelector('vaadin-stepper').selected = 2;
</script>
```

### 5. Steps with Descriptions

```html
<vaadin-stepper>
  <vaadin-stepper-step label="Source" description="Choose data source"></vaadin-stepper-step>
  <vaadin-stepper-step label="Transform" description="Map fields"></vaadin-stepper-step>
  <vaadin-stepper-step label="Destination" description="Select target"></vaadin-stepper-step>
  <vaadin-stepper-step label="Schedule" description="Set frequency"></vaadin-stepper-step>
</vaadin-stepper>
<script>
  document.querySelector('vaadin-stepper').selected = 1;
</script>
```

### 6. Steps with Custom Icons

```html
<vaadin-stepper>
  <vaadin-stepper-step label="Upload">
    <vaadin-icon icon="vaadin:upload" slot="icon"></vaadin-icon>
  </vaadin-stepper-step>
  <vaadin-stepper-step label="Process">
    <vaadin-icon icon="vaadin:cog" slot="icon"></vaadin-icon>
  </vaadin-stepper-step>
  <vaadin-stepper-step label="Download">
    <vaadin-icon icon="vaadin:download" slot="icon"></vaadin-icon>
  </vaadin-stepper-step>
</vaadin-stepper>
```

### 7. Optional and Disabled Steps

```html
<vaadin-stepper non-linear>
  <vaadin-stepper-step label="Personal Info" complete></vaadin-stepper-step>
  <vaadin-stepper-step label="Address" complete></vaadin-stepper-step>
  <vaadin-stepper-step label="Preferences" optional></vaadin-stepper-step>
  <vaadin-stepper-step label="Confirmation" disabled></vaadin-stepper-step>
</vaadin-stepper>
<script>
  document.querySelector('vaadin-stepper').selected = 2;
</script>
```

### 8. Programmatic Navigation

```html
<vaadin-stepper id="wizard">
  <vaadin-stepper-step label="Step 1"></vaadin-stepper-step>
  <vaadin-stepper-step label="Step 2"></vaadin-stepper-step>
  <vaadin-stepper-step label="Step 3"></vaadin-stepper-step>
</vaadin-stepper>
<button onclick="document.getElementById('wizard').selected--">Back</button>
<button onclick="document.getElementById('wizard').selected++">Next</button>
```

### 9. Stepper Inside a Dialog

```html
<vaadin-dialog opened>
  <template>
    <vaadin-stepper>
      <vaadin-stepper-step label="Import Settings" complete></vaadin-stepper-step>
      <vaadin-stepper-step label="Field Mapping"></vaadin-stepper-step>
      <vaadin-stepper-step label="Preview"></vaadin-stepper-step>
    </vaadin-stepper>
    <div><!-- Step content rendered here by application --></div>
  </template>
</vaadin-dialog>
```

### 10. Stepper with Label Position Below (Alternative Label)

```html
<vaadin-stepper label-position="bottom">
  <vaadin-stepper-step label="Cart" complete></vaadin-stepper-step>
  <vaadin-stepper-step label="Shipping" complete></vaadin-stepper-step>
  <vaadin-stepper-step label="Payment"></vaadin-stepper-step>
  <vaadin-stepper-step label="Confirm"></vaadin-stepper-step>
</vaadin-stepper>
<script>
  document.querySelector('vaadin-stepper').selected = 2;
</script>
```

---

### Key Design Decisions

1. **Step indicator only, not a wizard** — The stepper is a visual progress indicator showing which step the user is on. It does NOT manage step content panels. Content rendering is the application's responsibility. This follows the Carbon and Atlassian pattern and keeps the component focused. A full wizard (like SAP UI5) couples navigation to content, which conflicts with Vaadin's server-driven model where content is managed by the framework.

2. **Slotted steps, not data-driven** — Steps are defined as `<vaadin-stepper-step>` child elements rather than a JS `items` array. This is consistent with Vaadin's existing patterns (tabs, accordion, side-nav) and works naturally with server-side rendering. It also enables the `icon` slot for custom icons per step.

3. **Linear by default, opt-in non-linear** — By default, only completed steps and the current step are interactive (linear mode). Setting `non-linear` makes all non-disabled steps clickable. This matches MUI's approach and is the safer default for form workflows where skipping ahead could cause validation issues.

4. **Explicit step states** — Each step has explicit `complete`, `invalid`, `disabled`, and `optional` attributes rather than deriving state purely from position. This gives applications full control for async validation scenarios where a previously completed step may become invalid.

5. **`selected` property for current step** — Uses a zero-based index (`selected`) consistent with Vaadin's `vaadin-tabs` component. The stepper fires `selected-changed` when the user clicks a step (in non-linear mode).

6. **Label position variants** — Horizontal steppers support labels beside the indicator (default, `label-position="beside"`) or below it (`label-position="bottom"`). The bottom position (MUI's "alternative label") creates a centered layout better suited for wide containers with short labels.

7. **Separator as a CSS concern, not a sub-component** — The connector line between steps is rendered via CSS pseudo-elements within the step's shadow DOM, not as a separate element. This simplifies the DOM and is sufficient for the standard line/dot patterns. Themes can style the separator via CSS custom properties.

8. **Horizontal and vertical orientations** — Supports both layouts via the `orientation` attribute, matching the common pattern across all surveyed libraries (MUI, Ant Design, Carbon).

---

## Implementation

### Elements

**`<vaadin-stepper>`** — Container element that manages step state and navigation

Shadow DOM renders:
```html
<div part="step-list" role="list">
  <slot></slot>
</div>
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `selected` | `number` | `0` | No | Zero-based index of the currently selected step |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Yes | Layout direction of the stepper |
| `nonLinear` | `boolean` | `false` | Yes | When true, all non-disabled steps are clickable regardless of completion state |
| `labelPosition` | `'beside' \| 'bottom'` | `'beside'` | Yes | Position of step labels relative to the indicator. Only applies when `orientation` is `'horizontal'` |

| Slot | Description |
|---|---|
| (default) | `<vaadin-stepper-step>` elements |

| Part | Description |
|---|---|
| `step-list` | The container wrapping the step items |

| Event | Description |
|---|---|
| `selected-changed` | Fired when the `selected` property changes due to user interaction (clicking a step in non-linear mode) |

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-stepper-gap` | — | Gap between steps |
| `--vaadin-stepper-connector-color` | — | Color of the connector line between steps |
| `--vaadin-stepper-connector-color-complete` | — | Color of the connector line between completed steps |
| `--vaadin-stepper-connector-width` | — | Thickness of the connector line |

---

**`<vaadin-stepper-step>`** — Individual step indicator within the stepper

Shadow DOM renders:
```html
<div part="indicator">
  <span part="index"><!-- step number --></span>
  <slot name="icon"></slot>
</div>
<div part="separator"></div>
<div part="label-group">
  <span part="label"><slot></slot></span>
  <span part="description"><slot name="description"></slot></span>
</div>
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `label` | `string` | `''` | Yes | The text label for the step |
| `description` | `string` | `''` | Yes | Secondary description text below the label |
| `complete` | `boolean` | `false` | Yes | Whether the step has been completed. Shows a checkmark icon. |
| `invalid` | `boolean` | `false` | Yes | Whether the step is in an error/invalid state. Shows a warning icon. |
| `disabled` | `boolean` | `false` | Yes | Whether the step is disabled. Prevents interaction and dims appearance. |
| `optional` | `boolean` | `false` | Yes | Whether the step is optional. Displays an "Optional" label. |

| Slot | Description |
|---|---|
| (default) | Step label text content (alternative to `label` attribute) |
| `icon` | Custom icon element to replace the default step number indicator |
| `description` | Custom description content (alternative to `description` attribute) |

| Part | Description |
|---|---|
| `indicator` | The circular step number/icon container |
| `index` | The step number text inside the indicator |
| `separator` | The connector line after this step |
| `label-group` | Container for label and description |
| `label` | The primary label text |
| `description` | The secondary description text |

| Event | Description |
|---|---|
| `click` | Standard click event; the parent stepper listens to this for navigation |

| CSS Custom Property | Default | Description |
|---|---|---|
| `--vaadin-stepper-step-indicator-size` | — | Width and height of the step indicator circle |
| `--vaadin-stepper-step-indicator-background` | — | Background color of the indicator |
| `--vaadin-stepper-step-indicator-color` | — | Text/icon color inside the indicator |
| `--vaadin-stepper-step-indicator-border-color` | — | Border color of the indicator |
| `--vaadin-stepper-step-indicator-border-width` | — | Border width of the indicator |
| `--vaadin-stepper-step-indicator-border-radius` | — | Border radius of the indicator (default: 50%) |
| `--vaadin-stepper-step-label-color` | — | Color of the label text |
| `--vaadin-stepper-step-description-color` | — | Color of the description text |
| `--vaadin-stepper-step-font-size` | — | Font size of the label |

### Accessibility

The stepper follows the WAI multi-page forms pattern and uses list semantics:

- `<vaadin-stepper>` renders with `role="list"` on the step-list part
- `<vaadin-stepper-step>` renders with `role="listitem"`
- The current step has `aria-current="step"`
- Disabled steps have `aria-disabled="true"`
- Each step has visually hidden status text for screen readers: "Completed: ", "Current: ", "Not completed: ", "Error: " prefixed to the label
- In non-linear mode, clickable steps are rendered as interactive elements (buttons)
- Keyboard navigation: Tab moves focus between interactive steps; Enter/Space activates a focused step

### Step State Logic

Steps have the following visual states, determined by their attributes and position:

| State | Condition | Visual |
|---|---|---|
| **Incomplete** | Default state for steps after `selected` | Outlined indicator with step number |
| **Current** | Step index equals `selected` | Filled/highlighted indicator |
| **Complete** | `complete` attribute is set | Checkmark icon in indicator, completed connector color |
| **Invalid** | `invalid` attribute is set | Warning/error icon, error color scheme |
| **Disabled** | `disabled` attribute is set | Dimmed appearance, not interactive |
| **Optional** | `optional` attribute is set | "Optional" text shown below label |

In **linear mode** (default):
- Steps before `selected` that are `complete` are clickable (navigate back)
- The current step is visually highlighted but not clickable
- Steps after `selected` are not clickable (even if not disabled)

In **non-linear mode**:
- All steps except `disabled` steps are clickable
- Clicking a step fires `selected-changed` with the new index
