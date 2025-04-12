import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const button = css`
  :host {
    /* Sizing */
    --lumo-button-size: var(--lumo-size-m);
    --_button-size: var(--vaadin-button-height, var(--lumo-button-size));
    --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
    --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
    /* Used by notification */
    --_lumo-button-background: var(--vaadin-button-background, var(--lumo-contrast-5pct));
    --_lumo-button-text-color: var(--vaadin-button-text-color, var(--lumo-primary-text-color));
    --_lumo-button-primary-background: var(--vaadin-button-primary-background, var(--lumo-primary-color));
    --_lumo-button-primary-text-color: var(--vaadin-button-primary-text-color, var(--lumo-primary-contrast-color));
    box-sizing: border-box;
    flex-shrink: 0;
    min-width: var(--vaadin-button-min-width, calc(var(--_button-size) * 2));
    height: var(--_button-size);
    margin: var(--vaadin-button-margin, var(--lumo-space-xs) 0);
    padding: var(--vaadin-button-padding, 0 calc(var(--_button-size) / 3 + var(--lumo-border-radius-m) / 2));
    border: var(--vaadin-button-border, none);
    border-radius: var(--vaadin-button-border-radius, var(--lumo-border-radius-m));
    background: var(--_lumo-button-background);
    color: var(--_lumo-button-text-color);
    /* Style */
    font-family: var(--lumo-font-family);
    font-size: var(--vaadin-button-font-size, var(--lumo-font-size-m));
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: var(--vaadin-button-font-weight, 500);
    cursor: var(--lumo-clickable-cursor);
    -webkit-tap-highlight-color: transparent;
  }

  /* Set only for the internal parts so we don't affect the host vertical alignment */
  [part='label'],
  [part='prefix'],
  [part='suffix'] {
    line-height: var(--lumo-line-height-xs);
  }

  [part='label'] {
    padding: calc(var(--lumo-button-size) / 6) 0;
  }

  :host([theme~='small']) {
    --lumo-button-size: var(--lumo-size-s);
    font-size: var(--lumo-font-size-s);
  }

  :host([theme~='large']) {
    --lumo-button-size: var(--lumo-size-l);
    font-size: var(--lumo-font-size-l);
  }

  /* For interaction states */
  :host::before,
  :host::after {
    content: '';
    /* We rely on the host always being relative */
    position: absolute;
    z-index: 1;
    border-radius: inherit;
    opacity: 0;
    background-color: currentColor;
    pointer-events: none;
    inset: 0;
  }

  /* Hover */

  @media (any-hover: hover) {
    :host(:not([disabled]):hover)::before {
      opacity: 0.02;
    }
  }

  /* Active */

  :host::after {
    filter: blur(8px);
    transition:
      opacity 1.4s,
      transform 0.1s;
  }

  :host([active])::before {
    transition-duration: 0s;
    opacity: 0.05;
  }

  :host([active])::after {
    transform: scale(0);
    transition-duration: 0s, 0s;
    opacity: 0.1;
  }

  /* Keyboard focus */

  :host([focus-ring]) {
    box-shadow:
      0 0 0 calc(1px * var(--_focus-ring-gap-on, 0)) var(--_focus-ring-gap-color, var(--lumo-base-color)),
      0 0 0 calc(var(--_focus-ring-width) + 1px * var(--_focus-ring-gap-on, 0)) var(--_focus-ring-color);
  }

  :host([theme~='primary'][focus-ring]) {
    --_focus-ring-gap-on: 1;
  }

  /* Types (primary, tertiary, tertiary-inline */

  :host([theme~='tertiary']),
  :host([theme~='tertiary-inline']) {
    --_background: transparent !important;
    min-width: 0;
    background: var(--vaadin-button-tertiary-background, var(--_background));
  }

  :host([theme~='tertiary']) {
    padding: var(--vaadin-button-tertiary-padding, 0 calc(var(--_button-size) / 6));
    border: var(--vaadin-button-tertiary-border, none);
    color: var(--vaadin-button-tertiary-text-color, var(--lumo-primary-text-color));
    font-weight: var(--vaadin-button-tertiary-font-weight, 500);
  }

  :host([theme~='tertiary-inline'])::before {
    display: none;
  }

  :host([theme~='tertiary-inline']) {
    height: auto;
    margin: 0;
    padding: 0;
    font-size: inherit;
    line-height: inherit;
  }

  :host([theme~='tertiary-inline']) [part='label'] {
    padding: 0;
    overflow: visible;
    line-height: inherit;
  }

  :host([theme~='primary']) {
    min-width: calc(var(--lumo-button-size) * 2.5);
    border: var(--vaadin-button-primary-border, none);
    background: var(--_lumo-button-primary-background);
    color: var(--_lumo-button-primary-text-color);
    font-weight: var(--vaadin-button-primary-font-weight, 600);
  }

  :host([theme~='primary'])::before {
    background-color: black;
  }

  @media (any-hover: hover) {
    :host([theme~='primary']:not([disabled]):hover)::before {
      opacity: 0.05;
    }
  }

  :host([theme~='primary'][active])::before {
    opacity: 0.1;
  }

  :host([theme~='primary'][active])::after {
    opacity: 0.2;
  }

  /* Colors (success, warning, error, contrast) */

  :host([theme~='success']) {
    color: var(--lumo-success-text-color);
  }

  :host([theme~='success'][theme~='primary']) {
    background-color: var(--lumo-success-color);
    color: var(--lumo-success-contrast-color);
  }

  :host([theme~='warning']) {
    color: var(--lumo-warning-text-color);
  }

  :host([theme~='warning'][theme~='primary']) {
    background-color: var(--lumo-warning-color);
    color: var(--lumo-warning-contrast-color);
  }

  :host([theme~='error']) {
    color: var(--lumo-error-text-color);
  }

  :host([theme~='error'][theme~='primary']) {
    background-color: var(--lumo-error-color);
    color: var(--lumo-error-contrast-color);
  }

  :host([theme~='contrast']) {
    color: var(--lumo-contrast);
  }

  :host([theme~='contrast'][theme~='primary']) {
    background-color: var(--lumo-contrast);
    color: var(--lumo-base-color);
  }

  /* Disabled state. Keep selectors after other color variants. */

  :host([disabled]) {
    color: var(--lumo-disabled-text-color);
  }

  :host([theme~='primary'][disabled]) {
    background-color: var(--lumo-contrast-30pct);
    color: var(--lumo-base-color);
  }

  :host([theme~='primary'][disabled]) [part] {
    opacity: 0.7;
  }

  /* Icons */

  [part] ::slotted(vaadin-icon) {
    display: inline-block;
    width: var(--lumo-icon-size-m);
    height: var(--lumo-icon-size-m);
  }

  /* Vaadin icons are based on a 16x16 grid (unlike Lumo and Material icons with 24x24), so they look too big by default */
  [part] ::slotted(vaadin-icon[icon^='vaadin:']) {
    box-sizing: border-box !important;
    padding: 0.25em;
  }

  [part='prefix'] {
    margin-right: 0.25em;
    margin-left: -0.25em;
  }

  [part='suffix'] {
    margin-right: -0.25em;
    margin-left: 0.25em;
  }

  /* Icon-only */

  :host([theme~='icon']:not([theme~='tertiary-inline'])) {
    min-width: var(--lumo-button-size);
    padding-right: calc(var(--lumo-button-size) / 4);
    padding-left: calc(var(--lumo-button-size) / 4);
  }

  :host([theme~='icon']) [part='prefix'],
  :host([theme~='icon']) [part='suffix'] {
    margin-right: 0;
    margin-left: 0;
  }

  /* RTL specific styles */

  :host([dir='rtl']) [part='prefix'] {
    margin-right: -0.25em;
    margin-left: 0.25em;
  }

  :host([dir='rtl']) [part='suffix'] {
    margin-right: 0.25em;
    margin-left: -0.25em;
  }

  :host([dir='rtl'][theme~='icon']) [part='prefix'],
  :host([dir='rtl'][theme~='icon']) [part='suffix'] {
    margin-right: 0;
    margin-left: 0;
  }
`;

registerStyles('vaadin-button', button, { moduleId: 'lumo-button' });

export { button };
