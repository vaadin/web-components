# Theming

Each new component ships **three** sets of styles. They live in three
different packages and serve three different purposes.

## The three CSS layers

```
Component package (packages/{name}/)
└── src/styles/vaadin-{name}-base-styles.js   ← Functional base (CSS-in-JS)
        ↓ static get styles()

Lumo package (packages/vaadin-lumo-styles/)
├── components/{name}.css                     ← Public entry + injection markers
└── src/components/{name}.css                 ← Lumo theme styles
        ↓ Auto-injected via LumoInjectionMixin

Aura package (packages/aura/)
└── src/components/{name}.css                 ← Aura theme styles
        ↓ Imported in packages/aura/aura.css
```

- **Base** styles ship inside the component package; every component has
  them. They define structure (layout, sizing, state attributes) using CSS
  custom properties that Lumo and Aura override.
- **Lumo** styles live in `packages/vaadin-lumo-styles/`. Some legacy
  components do not yet build on top of base styles — new components must.
- **Aura** is built on top of base styles by overriding the same custom
  properties. `packages/aura/aura.css` imports each component's CSS file.

The `theme` attribute (e.g. `small`, `primary`, `tertiary`) is a concept
shared by both themes, but the set of supported variants differs — some
variants are Lumo-only, some are Aura-only.

## Base styles

Component base styles use Lit's `css` tagged template:

```js
import { css } from 'lit';

export const {name}Styles = css`
  :host {
    display: inline-flex;
    box-sizing: border-box;
    padding: var(--vaadin-{name}-padding, var(--vaadin-padding-m));
    color: var(--vaadin-{name}-text-color, var(--vaadin-text-color));
    background: var(--vaadin-{name}-background, var(--vaadin-background-container));
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:is([focus-ring], :focus-visible)) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.5;
  }
`;
```

Best practice for custom property names: `--vaadin-{component}-{property}`,
always with a fallback to a shared design token. Don't hardcode colors,
sizes, or fonts.

## Lumo

Two files per component:

```css
/* packages/vaadin-lumo-styles/components/{name}.css — public entry */
@import '../src/components/{name}.css';

:root,
:host {
  --_lumo-vaadin-{name}-inject: 1;
  --_lumo-vaadin-{name}-inject-modules: lumo_components_{name};
}
```

```css
/* packages/vaadin-lumo-styles/src/components/{name}.css — actual styles */
@media lumo_components_{name} {
  :host {
    padding: var(--vaadin-{name}-padding, var(--lumo-space-m));
    color: var(--vaadin-{name}-text-color, var(--lumo-primary-text-color));
    background: var(--vaadin-{name}-background, var(--lumo-contrast-5pct));
  }

  :host([focus-ring]) {
    box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
  }

  :host([theme~='primary']) {
    background: var(--lumo-primary-color);
    color: var(--lumo-primary-contrast-color);
  }
}
```

The injection markers in the public file must match the `@media` query name
in the source file (`lumo_components_{name}` in both).

## Aura

One CSS file per component, plus an import in `packages/aura/aura.css`:

```css
:where(:host) {
  --vaadin-{name}-shadow: var(--aura-shadow-xs);
}

:is(vaadin-{name}) {
  box-shadow: var(--vaadin-{name}-shadow);
}

:is(vaadin-{name}):where([theme~='primary']) {
  --vaadin-{name}-text-color: var(--aura-accent-contrast-color);
  --vaadin-{name}-background: var(--aura-accent-color);
}
```

Aura uses modern CSS features — `:is()`, `:where()`, `light-dark()`,
`oklch()`, relative color syntax, `color-mix()` — and is processed through
PostCSS (`packages/aura/postcss.config.js`).

## `:where()` for low specificity

Use `:where()` to give variant rules near-zero specificity so consumer CSS
can override custom property values without `!important`:

```css
:where(vaadin-button)[theme~='primary'] {
  --vaadin-button-background: var(--aura-accent-color);
}
```

## Themable mixins

| Mixin                 | Status                                  | Purpose                                                              |
| --------------------- | --------------------------------------- | -------------------------------------------------------------------- |
| `ThemableMixin`       | Deprecated (new components can skip it) | Legacy shadow DOM style injection mechanism .                        |
| `LumoInjectionMixin`  | Required, internal                      | Auto-injects Lumo styles via CSS custom properties; not for add-ons. |
| `ThemeDetectionMixin` | Public for add-ons                      | Sets `data-application-theme="lumo"` or `"aura"` on the host.        |

Components must declare base styles via `static get styles()` only. The
`registerStyles()` helper still exists, but in v25 it is **test-only** —
production component sources do not call it. (Pre-v25 Polymer code did.)

## Lumo vs Aura at a glance

| Aspect              | Lumo                               | Aura                           |
| ------------------- | ---------------------------------- | ------------------------------ |
| Encapsulation       | `@media lumo_components_*` queries | Element selectors with `:is()` |
| Browser baseline    | Broad, including older browsers    | Modern only                    |
| Color system        | HSL-based custom properties        | `oklch()` + relative colors    |
| Dark mode           | Separate variant                   | Built in via `light-dark()`    |
| Specificity surface | `:host` based                      | `:is()` / `:where()` based     |
| File layout         | Separate public and src files      | Single component file          |
