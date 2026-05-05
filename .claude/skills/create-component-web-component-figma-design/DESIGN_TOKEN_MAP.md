# Design Token to Figma Variable Mapping

This document maps Vaadin CSS custom properties to Figma variable paths for both Lumo and Aura themes. Use it as a starting reference when creating Figma designs.

**Important:** Always verify against actual `get_variable_defs` output at runtime. Figma variable paths may differ from what is listed here if the connected design library uses a different naming convention.

---

## Shared Semantic Tokens (`--vaadin-*`)

Both Lumo and Aura define these tokens. They are the bridge between themes and the primary tokens used in component specs.

| CSS Custom Property | Lumo Resolves To | Aura Resolves To | Figma Variable Path |
|---|---|---|---|
| `--vaadin-text-color` | `--lumo-body-text-color` (contrast-90pct) | `--aura-neutral` (oklch-derived) | `colors/text-color` |
| `--vaadin-text-color-secondary` | `--lumo-secondary-text-color` (contrast-70pct) | `color-mix(oklch, text-color 60-95%)` | `colors/text-color-secondary` |
| `--vaadin-text-color-disabled` | `--lumo-disabled-text-color` (contrast-30pct) | `color-mix(oklch, text-color 30-33%)` | `colors/text-color-disabled` |
| `--vaadin-border-color` | `--lumo-contrast-30pct` | `color-mix(srgb, base 14-20%)` | `colors/border-color` |
| `--vaadin-border-color-secondary` | `--lumo-contrast-10pct` | `color-mix(srgb, base 6-10%)` | `colors/border-color-secondary` |
| `--vaadin-background-color` | `--lumo-base-color` (#fff / hsl(214,35%,21%)) | `--aura-surface-color-solid` | `colors/background-color` |
| `--vaadin-background-container` | `--lumo-contrast-5pct` | `color-mix(srgb, base 3-6%)` | `colors/background-container` |
| `--vaadin-background-container-strong` | `--lumo-contrast-10pct` | `color-mix(srgb, base 7-10%)` | `colors/background-container-strong` |
| `--vaadin-focus-ring-color` | (via --lumo-primary-color) | `oklch(from accent min/max(l,0.62) c h)` | `colors/focus-ring-color` |

---

## Lumo Tokens (`--lumo-*`)

### Colors

| CSS Custom Property | Light Value | Dark Value | Figma Variable Path |
|---|---|---|---|
| `--lumo-base-color` | `#fff` | `hsl(214, 35%, 21%)` | `lumo/base-color` |
| `--lumo-primary-color` | `hsl(214, 100%, 48%)` | `hsl(214, 90%, 48%)` | `lumo/primary-color` |
| `--lumo-primary-text-color` | `hsl(214, 100%, 43%)` | `hsl(214, 90%, 77%)` | `lumo/primary-text-color` |
| `--lumo-primary-contrast-color` | `#fff` | `#fff` | `lumo/primary-contrast-color` |
| `--lumo-primary-color-50pct` | `hsla(214, 100%, 49%, 0.76)` | `hsla(214, 90%, 70%, 0.69)` | `lumo/primary-color-50pct` |
| `--lumo-primary-color-10pct` | `hsla(214, 100%, 60%, 0.13)` | `hsla(214, 90%, 55%, 0.13)` | `lumo/primary-color-10pct` |
| `--lumo-error-color` | `hsl(3, 85%, 48%)` | `hsl(3, 79%, 49%)` | `lumo/error-color` |
| `--lumo-error-text-color` | `hsl(3, 89%, 42%)` | `hsl(3, 100%, 80%)` | `lumo/error-text-color` |
| `--lumo-error-contrast-color` | `#fff` | `#fff` | `lumo/error-contrast-color` |
| `--lumo-success-color` | `hsl(145, 72%, 30%)` | `hsl(145, 72%, 30%)` | `lumo/success-color` |
| `--lumo-success-text-color` | `hsl(145, 85%, 25%)` | `hsl(145, 85%, 46%)` | `lumo/success-text-color` |
| `--lumo-success-contrast-color` | `#fff` | `#fff` | `lumo/success-contrast-color` |
| `--lumo-warning-color` | `hsl(48, 100%, 50%)` | `hsl(43, 100%, 48%)` | `lumo/warning-color` |
| `--lumo-warning-text-color` | `hsl(32, 100%, 30%)` | `hsl(45, 100%, 60%)` | `lumo/warning-text-color` |

### Text Colors

| CSS Custom Property | Resolves To | Figma Variable Path |
|---|---|---|
| `--lumo-header-text-color` | `--lumo-contrast` (shade / tint) | `lumo/header-text-color` |
| `--lumo-body-text-color` | `--lumo-contrast-90pct` | `lumo/body-text-color` |
| `--lumo-secondary-text-color` | `--lumo-contrast-70pct` | `lumo/secondary-text-color` |
| `--lumo-tertiary-text-color` | `--lumo-contrast-50pct` | `lumo/tertiary-text-color` |
| `--lumo-disabled-text-color` | `--lumo-contrast-30pct` | `lumo/disabled-text-color` |

### Contrast Scale

| CSS Custom Property | Figma Variable Path |
|---|---|
| `--lumo-contrast-5pct` | `lumo/contrast-5pct` |
| `--lumo-contrast-10pct` | `lumo/contrast-10pct` |
| `--lumo-contrast-20pct` | `lumo/contrast-20pct` |
| `--lumo-contrast-30pct` | `lumo/contrast-30pct` |
| `--lumo-contrast-40pct` | `lumo/contrast-40pct` |
| `--lumo-contrast-50pct` | `lumo/contrast-50pct` |
| `--lumo-contrast-60pct` | `lumo/contrast-60pct` |
| `--lumo-contrast-70pct` | `lumo/contrast-70pct` |
| `--lumo-contrast-80pct` | `lumo/contrast-80pct` |
| `--lumo-contrast-90pct` | `lumo/contrast-90pct` |
| `--lumo-contrast` | `lumo/contrast` |

### Spacing

| CSS Custom Property | Value | Figma Variable Path |
|---|---|---|
| `--lumo-space-xs` | `0.25rem` (4px) | `lumo/space-xs` |
| `--lumo-space-s` | `0.5rem` (8px) | `lumo/space-s` |
| `--lumo-space-m` | `1rem` (16px) | `lumo/space-m` |
| `--lumo-space-l` | `1.5rem` (24px) | `lumo/space-l` |
| `--lumo-space-xl` | `2.5rem` (40px) | `lumo/space-xl` |

### Sizing

| CSS Custom Property | Value | Figma Variable Path |
|---|---|---|
| `--lumo-size-xs` | `1.625rem` (26px) | `lumo/size-xs` |
| `--lumo-size-s` | `1.875rem` (30px) | `lumo/size-s` |
| `--lumo-size-m` | `2.25rem` (36px) | `lumo/size-m` |
| `--lumo-size-l` | `2.75rem` (44px) | `lumo/size-l` |
| `--lumo-size-xl` | `3.5rem` (56px) | `lumo/size-xl` |
| `--lumo-icon-size-s` | `1.25em` | `lumo/icon-size-s` |
| `--lumo-icon-size-m` | `1.5em` | `lumo/icon-size-m` |
| `--lumo-icon-size-l` | `2.25em` | `lumo/icon-size-l` |

### Typography

| CSS Custom Property | Value | Figma Variable Path |
|---|---|---|
| `--lumo-font-family` | system-ui, -apple-system, ... | (text style) |
| `--lumo-font-size-xxs` | `0.75rem` (12px) | `lumo/font-size-xxs` |
| `--lumo-font-size-xs` | `0.8125rem` (13px) | `lumo/font-size-xs` |
| `--lumo-font-size-s` | `0.875rem` (14px) | `lumo/font-size-s` |
| `--lumo-font-size-m` | `1rem` (16px) | `lumo/font-size-m` |
| `--lumo-font-size-l` | `1.125rem` (18px) | `lumo/font-size-l` |
| `--lumo-font-size-xl` | `1.375rem` (22px) | `lumo/font-size-xl` |
| `--lumo-font-size-xxl` | `1.75rem` (28px) | `lumo/font-size-xxl` |
| `--lumo-font-size-xxxl` | `2.5rem` (40px) | `lumo/font-size-xxxl` |
| `--lumo-line-height-xs` | `1.25` | `lumo/line-height-xs` |
| `--lumo-line-height-s` | `1.375` | `lumo/line-height-s` |
| `--lumo-line-height-m` | `1.625` | `lumo/line-height-m` |

---

## Aura Tokens (`--aura-*`)

### Palette Colors

| CSS Custom Property | Value (oklch) | Figma Variable Path |
|---|---|---|
| `--aura-red` | `oklch(0.59 0.2 25)` | `aura/palette/red` |
| `--aura-orange` | `oklch(0.61 0.35 87)` | `aura/palette/orange` |
| `--aura-yellow` | `oklch(0.89 0.3 98)` | `aura/palette/yellow` |
| `--aura-green` | `oklch(0.6 0.2 155)` | `aura/palette/green` |
| `--aura-blue` | `oklch(0.55 0.2 264)` | `aura/palette/blue` |
| `--aura-purple` | `oklch(0.58 0.22 290)` | `aura/palette/purple` |

### Palette Text Colors

Each palette color has a `-text` variant with light/dark adaptations:

| CSS Custom Property | Figma Variable Path |
|---|---|
| `--aura-red-text` | `aura/palette/red-text` |
| `--aura-orange-text` | `aura/palette/orange-text` |
| `--aura-yellow-text` | `aura/palette/yellow-text` |
| `--aura-green-text` | `aura/palette/green-text` |
| `--aura-blue-text` | `aura/palette/blue-text` |
| `--aura-purple-text` | `aura/palette/purple-text` |

### Accent System

| CSS Custom Property | Description | Figma Variable Path |
|---|---|---|
| `--aura-accent-color` | Primary accent (defaults to --aura-blue) | `aura/accent/color` |
| `--aura-accent-contrast-color` | Text on accent backgrounds | `aura/accent/contrast-color` |
| `--aura-accent-text-color` | Accent-colored text | `aura/accent/text-color` |
| `--aura-accent-surface` | Subtle accent background | `aura/accent/surface` |
| `--aura-accent-border-color` | Accent-tinted border | `aura/accent/border-color` |

### Spacing (via `--aura-base-size: 16`)

| CSS Custom Property | Computed Value | Figma Variable Path |
|---|---|---|
| `--vaadin-gap-xs` | `round(16 * 0.25, 1)` = 4px | `aura/gap-xs` |
| `--vaadin-gap-s` | `round(16 * 0.5, 1)` = 8px | `aura/gap-s` |
| `--vaadin-gap-m` | `round(16 * 0.75, 1)` = 12px | `aura/gap-m` |
| `--vaadin-gap-l` | `round(16 * 1, 1)` = 16px | `aura/gap-l` |
| `--vaadin-gap-xl` | `round(16 * 1.5, 1)` = 24px | `aura/gap-xl` |
| `--vaadin-padding-xs` | `round(16 * 0.25, 1)` = 4px | `aura/padding-xs` |
| `--vaadin-padding-s` | `round(16 * 0.5, 1)` = 8px | `aura/padding-s` |
| `--vaadin-padding-m` | `round(16 * 0.75, 1)` = 12px | `aura/padding-m` |
| `--vaadin-padding-l` | `round(16 * 1, 1)` = 16px | `aura/padding-l` |
| `--vaadin-padding-xl` | `round(16 * 1.5, 1)` = 24px | `aura/padding-xl` |

### Border Radius (via `--aura-base-radius: 3`)

| CSS Custom Property | Computed Value | Figma Variable Path |
|---|---|---|
| `--vaadin-radius-s` | `min(0.25lh, round(3 + 2, 1))` ~ 5px | `aura/radius-s` |
| `--vaadin-radius-m` | `round(3*2 + 3, 1)` = 9px | `aura/radius-m` |
| `--vaadin-radius-l` | `round(3*1.5 + 10, 1)` = 15px | `aura/radius-l` |

### Typography (Instrument Sans)

| CSS Custom Property | Value | Figma Variable Path |
|---|---|---|
| `--aura-font-family` | Instrument Sans, system-ui, sans-serif | (text style) |
| `--aura-font-size-xs` | ~10.5px (clamped) | `aura/font-size-xs` |
| `--aura-font-size-s` | ~12.25px | `aura/font-size-s` |
| `--aura-font-size-m` | `14/16 * 1rem` = 14px | `aura/font-size-m` |
| `--aura-font-size-l` | `14px * 1.125` ~ 16px | `aura/font-size-l` |
| `--aura-font-size-xl` | `16px * 1.125` ~ 18px | `aura/font-size-xl` |
| `--aura-font-weight-regular` | `400` | — |
| `--aura-font-weight-medium` | `500` | — |
| `--aura-font-weight-semibold` | `600` | — |
| `--aura-line-height-xs` | `round(xs * 1.4, 2)` | `aura/line-height-xs` |
| `--aura-line-height-s` | `round(s * 1.4, 2)` | `aura/line-height-s` |
| `--aura-line-height-m` | `round(m * 1.4, 2)` ~ 20px | `aura/line-height-m` |
| `--aura-line-height-l` | `round(l * 1.4, 2)` | `aura/line-height-l` |
| `--aura-line-height-xl` | `round(xl * 1.4, 2)` | `aura/line-height-xl` |

### Shadows

| CSS Custom Property | Value | Figma Variable Path |
|---|---|---|
| `--aura-shadow-xs` | `0 1px 4px -2px shadow-color` | `aura/shadow-xs` |
| `--aura-shadow-s` | `0 2px 5px -1px shadow-color` | `aura/shadow-s` |
| `--aura-shadow-m` | `0 8px 16px -3px shadow-color` | `aura/shadow-m` |

### Surface System

| CSS Custom Property | Default | Description | Figma Variable Path |
|---|---|---|---|
| `--aura-surface-level` | `1` | Depth level (affects computed color) | `aura/surface-level` |
| `--aura-surface-opacity` | `0.5` | Surface translucency | `aura/surface-opacity` |
| `--aura-surface-color` | computed | Semi-transparent surface fill | `aura/surface-color` |
| `--aura-surface-color-solid` | computed | Opaque surface fill | `aura/surface-color-solid` |

---

## Size Variants

Both themes support size variants via `[theme~="xsmall|small|medium|large|xlarge"]`.

**Aura** adjusts `--aura-base-size` which cascades to all spacing and sizing tokens:
| Size | `--aura-base-size` |
|---|---|
| xsmall | `round(16 * 0.75)` = 12 |
| small | `round(16 * 0.875)` = 14 |
| medium | 16 (default) |
| large | `round(16 * 1.125)` = 18 |
| xlarge | `round(16 * 1.25)` = 20 |

**Lumo** uses fixed size tokens (`--lumo-size-xs` through `--lumo-size-xl`) and does not have a cascading base-size system.

---

## Notes on Color Resolution

**Lumo** uses HSL/HSLA colors which can be directly converted to hex for Figma.

**Aura** uses oklch() with relative color syntax (`oklch(from var(...) ...)`) and `color-mix()`. These are computed dynamically in CSS and cannot be statically resolved by reading CSS alone. When creating Figma designs:

1. Prefer binding to Figma variables from the connected design library (via `get_variable_defs`).
2. If a variable is not available in the library, compute an approximate value for the default theme settings (`--aura-contrast-level: 1`, `--aura-surface-level: 1`, light mode).
3. Document the approximation in the "Deviations from Spec" section of `figma-design.md`.
