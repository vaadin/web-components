import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-checkbox',
  css`
    :host {
      color: var(--vaadin-checkbox-label-color, var(--lumo-body-text-color));
      font-size: var(--vaadin-checkbox-label-font-size, var(--lumo-font-size-m));
      font-family: var(--lumo-font-family);
      line-height: var(--lumo-line-height-s);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      user-select: none;
      cursor: default;
      outline: none;
      --_checkbox-size: var(--vaadin-checkbox-size, calc(var(--lumo-size-m) / 2));
      --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
      --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
      --_selection-color: var(--vaadin-selection-color, var(--lumo-primary-color));
      --_invalid-background: var(--vaadin-input-field-invalid-background, var(--lumo-error-color-10pct));
      --_disabled-checkmark-color: var(--vaadin-checkbox-disabled-checkmark-color, var(--lumo-contrast-30pct));
    }

    [part='label'] {
      display: flex;
      position: relative;
      max-width: max-content;
    }

    :host([has-label]) ::slotted(label) {
      padding: var(
        --vaadin-checkbox-label-padding,
        var(--lumo-space-xs) var(--lumo-space-s) var(--lumo-space-xs) var(--lumo-space-xs)
      );
    }

    :host([dir='rtl'][has-label]) ::slotted(label) {
      padding: var(--lumo-space-xs) var(--lumo-space-xs) var(--lumo-space-xs) var(--lumo-space-s);
    }

    :host([has-label][required]) ::slotted(label) {
      padding-inline-end: var(--lumo-space-m);
    }

    [part='checkbox'] {
      width: var(--_checkbox-size);
      height: var(--_checkbox-size);
      margin: var(--lumo-space-xs);
      position: relative;
      border-radius: var(--vaadin-checkbox-border-radius, var(--lumo-border-radius-s));
      background: var(--vaadin-checkbox-background, var(--lumo-contrast-20pct));
      transition:
        transform 0.2s cubic-bezier(0.12, 0.32, 0.54, 2),
        background-color 0.15s;
      cursor: var(--lumo-clickable-cursor);
      /* Default field border color */
      --_input-border-color: var(--vaadin-input-field-border-color, var(--lumo-contrast-50pct));
    }

    :host([indeterminate]),
    :host([checked]) {
      --vaadin-input-field-border-color: transparent;
    }

    :host([indeterminate]) [part='checkbox'],
    :host([checked]) [part='checkbox'] {
      background-color: var(--_selection-color);
    }

    /* Checkmark */
    [part='checkbox']::after {
      pointer-events: none;
      font-family: 'lumo-icons';
      content: var(--vaadin-checkbox-checkmark-char, var(--lumo-icons-checkmark));
      color: var(--vaadin-checkbox-checkmark-color, var(--lumo-primary-contrast-color));
      font-size: var(--vaadin-checkbox-checkmark-size, calc(var(--_checkbox-size) + 2px));
      line-height: 1;
      position: absolute;
      top: -1px;
      left: -1px;
      contain: content;
      opacity: 0;
    }

    :host([checked]) [part='checkbox']::after {
      opacity: 1;
    }

    :host([readonly]:not([checked]):not([indeterminate])) {
      color: var(--lumo-secondary-text-color);
    }

    :host([readonly]:not([checked]):not([indeterminate])) [part='checkbox'] {
      background: transparent;
      box-shadow: none;
    }

    :host([readonly]:not([checked]):not([indeterminate])) [part='checkbox']::after {
      content: '';
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      top: 0;
      left: 0;
      opacity: 1;
      border: var(--vaadin-input-field-readonly-border, 1px dashed var(--lumo-contrast-50pct));
    }

    /* Indeterminate checkmark */
    :host([indeterminate]) [part='checkbox']::after {
      content: var(--vaadin-checkbox-checkmark-char-indeterminate, '');
      opacity: 1;
      top: 45%;
      height: 10%;
      left: 22%;
      right: 22%;
      width: auto;
      border: 0;
      background-color: var(--lumo-primary-contrast-color);
    }

    /* Focus ring */
    :host([focus-ring]) [part='checkbox'] {
      box-shadow:
        0 0 0 1px var(--lumo-base-color),
        0 0 0 calc(var(--_focus-ring-width) + 1px) var(--_focus-ring-color),
        inset 0 0 0 var(--_input-border-width, 0) var(--_input-border-color);
    }

    :host([focus-ring][readonly]:not([checked]):not([indeterminate])) [part='checkbox'] {
      box-shadow:
        0 0 0 1px var(--lumo-base-color),
        0 0 0 calc(var(--_focus-ring-width) + 1px) var(--_focus-ring-color);
    }

    /* Disabled */
    :host([disabled]) {
      pointer-events: none;
      --vaadin-input-field-border-color: var(--lumo-contrast-20pct);
    }

    :host([disabled]) ::slotted(label) {
      color: inherit;
    }

    :host([disabled]) [part='checkbox'] {
      background-color: var(--vaadin-checkbox-disabled-background, var(--lumo-contrast-10pct));
    }

    :host([disabled]) [part='checkbox']::after {
      color: var(--_disabled-checkmark-color);
    }

    :host([disabled]) [part='label'],
    :host([disabled]) [part='helper-text'] {
      color: var(--lumo-disabled-text-color);
      -webkit-text-fill-color: var(--lumo-disabled-text-color);
    }

    :host([indeterminate][disabled]) [part='checkbox']::after {
      background-color: var(--_disabled-checkmark-color);
    }

    :host([readonly][checked]:not([disabled])) [part='checkbox'],
    :host([readonly][indeterminate]:not([disabled])) [part='checkbox'] {
      background-color: var(--vaadin-checkbox-readonly-checked-background, var(--lumo-contrast-70pct));
    }

    /* Used for activation "halo" */
    [part='checkbox']::before {
      pointer-events: none;
      color: transparent;
      width: 100%;
      height: 100%;
      line-height: var(--_checkbox-size);
      border-radius: inherit;
      background-color: inherit;
      transform: scale(1.4);
      opacity: 0;
      transition:
        transform 0.1s,
        opacity 0.8s;
    }

    /* Hover */
    :host(:not([checked]):not([indeterminate]):not([disabled]):not([readonly]):not([invalid]):hover) [part='checkbox'] {
      background: var(--vaadin-checkbox-background-hover, var(--lumo-contrast-30pct));
    }

    /* Disable hover for touch devices */
    @media (pointer: coarse) {
      /* prettier-ignore */
      :host(:not([checked]):not([indeterminate]):not([disabled]):not([readonly]):not([invalid]):hover) [part='checkbox'] {
        background: var(--vaadin-checkbox-background, var(--lumo-contrast-20pct));
      }
    }

    /* Active */
    :host([active]) [part='checkbox'] {
      transform: scale(0.9);
      transition-duration: 0.05s;
    }

    :host([active][checked]) [part='checkbox'] {
      transform: scale(1.1);
    }

    :host([active]:not([checked])) [part='checkbox']::before {
      transition-duration: 0.01s, 0.01s;
      transform: scale(0);
      opacity: 0.4;
    }

    /* Required */
    :host([required]) [part='required-indicator'] {
      position: absolute;
      top: var(--lumo-space-xs);
      right: var(--lumo-space-xs);
    }

    :host([required][dir='rtl']) [part='required-indicator'] {
      right: auto;
      left: var(--lumo-space-xs);
    }

    :host([required]) [part='required-indicator']::after {
      content: var(--lumo-required-field-indicator, '\\2022');
      transition: opacity 0.2s;
      color: var(--lumo-required-field-indicator-color, var(--lumo-primary-text-color));
      width: 1em;
      text-align: center;
    }

    :host(:not([has-label])) [part='required-indicator'] {
      display: none;
    }

    /* Invalid */
    :host([invalid]) {
      --vaadin-input-field-border-color: var(--lumo-error-color);
    }

    :host([invalid]) [part='checkbox'] {
      background: var(--_invalid-background);
      background-image: linear-gradient(var(--_invalid-background) 0%, var(--_invalid-background) 100%);
    }

    :host([invalid]:hover) [part='checkbox'] {
      background-image: linear-gradient(var(--_invalid-background) 0%, var(--_invalid-background) 100%),
        linear-gradient(var(--_invalid-background) 0%, var(--_invalid-background) 100%);
    }

    :host([invalid][focus-ring]) {
      --_focus-ring-color: var(--lumo-error-color-50pct);
    }

    :host([invalid]) [part='required-indicator']::after {
      color: var(--lumo-required-field-indicator-color, var(--lumo-error-text-color));
    }

    /* Error message */
    [part='error-message'] {
      font-size: var(--vaadin-input-field-error-font-size, var(--lumo-font-size-xs));
      line-height: var(--lumo-line-height-xs);
      font-weight: var(--vaadin-input-field-error-font-weight, 400);
      color: var(--vaadin-input-field-error-color, var(--lumo-error-text-color));
      will-change: max-height;
      transition: 0.4s max-height;
      max-height: 5em;
      padding-inline-start: var(--lumo-space-xs);
    }

    :host([has-error-message]) [part='error-message']::after,
    :host([has-helper]) [part='helper-text']::after {
      content: '';
      display: block;
      height: 0.4em;
    }

    :host(:not([invalid])) [part='error-message'] {
      max-height: 0;
      overflow: hidden;
    }

    /* Helper */
    [part='helper-text'] {
      display: block;
      color: var(--vaadin-input-field-helper-color, var(--lumo-secondary-text-color));
      font-size: var(--vaadin-input-field-helper-font-size, var(--lumo-font-size-xs));
      line-height: var(--lumo-line-height-xs);
      font-weight: var(--vaadin-input-field-helper-font-weight, 400);
      margin-left: calc(var(--lumo-border-radius-m) / 4);
      transition: color 0.2s;
      padding-inline-start: var(--lumo-space-xs);
    }

    :host(:hover:not([readonly])) [part='helper-text'] {
      color: var(--lumo-body-text-color);
    }

    :host([has-error-message]) ::slotted(label),
    :host([has-helper]) ::slotted(label) {
      padding-bottom: 0;
    }
  `,
  { moduleId: 'lumo-checkbox' },
);
