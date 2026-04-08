# Vaadin {ComponentName} Web Component

> ⚠️ This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.{camelName}Component = true`

## Usage Examples

### 1. Basic Usage

```html
<vaadin-{name}>
  <!-- Basic example showing the simplest usage -->
</vaadin-{name}>
```

### 2. With Properties

```html
<vaadin-{name}></vaadin-{name}>
<script>
  document.querySelector('vaadin-{name}').someProperty = 'value';
</script>
```

### 3. Data-Driven (if applicable)

```html
<vaadin-{name}></vaadin-{name}>
<script>
  document.querySelector('vaadin-{name}').items = [
    { text: 'Item 1' },
    { text: 'Item 2' }
  ];
</script>
```

### 4. With Slots (if applicable)

```html
<vaadin-{name}>
  <vaadin-icon icon="vaadin:icon-name" slot="prefix"></vaadin-icon>
  Label
</vaadin-{name}>
```

---
### Key Design Decisions

1. **Decision 1** — rationale.
2. **Decision 2** — rationale.

---

## Implementation

### Elements

**`<vaadin-{name}>`** — Container element

Shadow DOM renders: 
```html
<!-- Shadow DOM structure -->
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `propertyName` | `type` | `default` | Yes/No | Description |

| Slot | Description |
|---|---|
| (default) | Default slot content description |

Parts in addition to the ones defined in the shadow DOM

| Part | Description |
|---|---|

| Event | Description |
|---|---|

| CSS Custom Property | Default | Description |
|---|---|---|

---

**`<vaadin-{name}-item>`** — Child element (if applicable)

Shadow DOM renders
```html
<!-- Shadow DOM structure -->
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `propertyName` | `type` | `default` | Yes/No | Description |

| Slot | Description |
|---|---|
| (default) | Default slot content description |

Parts in addition to the ones defined in the shadow DOM

| Part | Description |
|---|---|

| Event | Description |
|---|---|

| CSS Custom Property | Default | Description |
|---|---|---|
