import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-radio-button',
  css`
    :host {
      --_radio-button-size: var(--vaadin-radio-button-size, calc(var(--lumo-size-m) / 2));
      --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
      --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
      --_selection-color: var(--vaadin-selection-color, var(--lumo-primary-color));
      outline: none;
      color: var(--vaadin-radio-button-label-color, var(--lumo-body-text-color));
      font-family: var(--lumo-font-family);
      font-size: var(--vaadin-radio-button-label-font-size, var(--lumo-font-size-m));
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: var(--lumo-line-height-s);
      cursor: default;
      -webkit-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    :host([has-label]) ::slotted(label) {
      padding: var(
        --vaadin-radio-button-label-padding,
        var(--lumo-space-xs) var(--lumo-space-s) var(--lumo-space-xs) var(--lumo-space-xs)
      );
    }

    [part='radio'] {
      /* Default field border color */
      --_input-border-color: var(--vaadin-input-field-border-color, var(--lumo-contrast-50pct));
      position: relative;
      width: var(--_radio-button-size);
      height: var(--_radio-button-size);
      margin: var(--lumo-space-xs);
      transition:
        transform 0.2s cubic-bezier(0.12, 0.32, 0.54, 2),
        background-color 0.15s;
      border-radius: 50%;
      background: var(--vaadin-radio-button-background, var(--lumo-contrast-20pct));
      cursor: var(--lumo-clickable-cursor);
      will-change: transform;
    }

    /* Used for activation "halo" */
    [part='radio']::before {
      width: 100%;
      height: 100%;
      transform: scale(1.4);
      transition:
        transform 0.1s,
        opacity 0.8s;
      border-radius: inherit;
      opacity: 0;
      background-color: inherit;
      color: transparent;
      line-height: var(--_radio-button-size);
      pointer-events: none;
      will-change: transform, opacity;
    }

    /* Used for the dot */
    [part='radio']::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      transform: translate(-50%, -50%) scale(0);
      transition: 0.25s transform;
      border: var(--vaadin-radio-button-dot-size, 3px) solid
        var(--vaadin-radio-button-dot-color, var(--lumo-primary-contrast-color));
      border-radius: 50%;
      background-clip: content-box;
      pointer-events: none;
      will-change: transform;
    }

    :host([checked]) {
      --vaadin-input-field-border-color: transparent;
    }

    :host([checked]) [part='radio'] {
      background-color: var(--_selection-color);
    }

    :host([checked]) [part='radio']::after {
      transform: translate(-50%, -50%) scale(1);
    }

    :host(:not([checked]):not([disabled]):hover) [part='radio'] {
      background: var(--vaadin-radio-button-background-hover, var(--lumo-contrast-30pct));
    }

    :host([active]) [part='radio'] {
      transform: scale(0.9);
      transition-duration: 0.05s;
    }

    :host([active][checked]) [part='radio'] {
      transform: scale(1.1);
    }

    :host([active]:not([checked])) [part='radio']::before {
      transform: scale(0);
      transition-duration: 0.01s, 0.01s;
      opacity: 0.4;
    }

    :host([focus-ring]) [part='radio'] {
      box-shadow:
        0 0 0 1px var(--lumo-base-color),
        0 0 0 calc(var(--_focus-ring-width) + 1px) var(--_focus-ring-color),
        inset 0 0 0 var(--_input-border-width, 0) var(--_input-border-color);
    }

    :host([disabled]) {
      --vaadin-input-field-border-color: var(--lumo-contrast-20pct);
      color: var(--lumo-disabled-text-color);
      pointer-events: none;
    }

    :host([disabled]) ::slotted(label) {
      color: inherit;
    }

    :host([disabled]) [part='radio'] {
      background-color: var(--vaadin-radio-button-disabled-background, var(--lumo-contrast-10pct));
    }

    :host([disabled]) [part='radio']::after {
      border-color: var(--vaadin-radio-button-disabled-dot-color, var(--lumo-contrast-30pct));
    }

    /* RTL specific styles */
    :host([dir='rtl'][has-label]) ::slotted(label) {
      padding: var(--lumo-space-xs) var(--lumo-space-xs) var(--lumo-space-xs) var(--lumo-space-s);
    }
  `,
  { moduleId: 'lumo-radio-button' },
);
