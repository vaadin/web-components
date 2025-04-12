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
      --_checkbox-size: var(--vaadin-checkbox-size, calc(var(--lumo-size-m) / 2));
      --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
      --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
      --_selection-color: var(--vaadin-selection-color, var(--lumo-primary-color));
      --_invalid-background: var(--vaadin-input-field-invalid-background, var(--lumo-error-color-10pct));
      --_disabled-checkmark-color: var(--vaadin-checkbox-disabled-checkmark-color, var(--lumo-contrast-30pct));
      color: var(--vaadin-checkbox-label-color, var(--lumo-body-text-color));
      cursor: default;
      font-family: var(--lumo-font-family);
      font-size: var(--vaadin-checkbox-label-font-size, var(--lumo-font-size-m));
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: var(--lumo-line-height-s);
      outline: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      user-select: none;
    }

    [part='label'] {
      display: flex;
      max-width: max-content;
      position: relative;
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
      /* Default field border color */
      --_input-border-color: var(--vaadin-input-field-border-color, var(--lumo-contrast-50pct));
      background: var(--vaadin-checkbox-background, var(--lumo-contrast-20pct));
      border-radius: var(--vaadin-checkbox-border-radius, var(--lumo-border-radius-s));
      cursor: var(--lumo-clickable-cursor);
      height: var(--_checkbox-size);
      margin: var(--lumo-space-xs);
      position: relative;
      transition:
        transform 0.2s cubic-bezier(0.12, 0.32, 0.54, 2),
        background-color 0.15s;
      width: var(--_checkbox-size);
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
      color: var(--vaadin-checkbox-checkmark-color, var(--lumo-primary-contrast-color));
      contain: content;
      content: var(--vaadin-checkbox-checkmark-char, var(--lumo-icons-checkmark));
      font-family: 'lumo-icons';
      font-size: var(--vaadin-checkbox-checkmark-size, calc(var(--_checkbox-size) + 2px));
      left: -1px;
      line-height: 1;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      top: -1px;
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
      border: var(--vaadin-input-field-readonly-border, 1px dashed var(--lumo-contrast-50pct));
      border-radius: inherit;
      box-sizing: border-box;
      content: '';
      height: 100%;
      left: 0;
      opacity: 1;
      top: 0;
      width: 100%;
    }

    /* Indeterminate checkmark */
    :host([indeterminate]) [part='checkbox']::after {
      background-color: var(--lumo-primary-contrast-color);
      border: 0;
      content: var(--vaadin-checkbox-checkmark-char-indeterminate, '');
      height: 10%;
      left: 22%;
      opacity: 1;
      right: 22%;
      top: 45%;
      width: auto;
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
      --vaadin-input-field-border-color: var(--lumo-contrast-20pct);
      pointer-events: none;
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
      background-color: inherit;
      border-radius: inherit;
      color: transparent;
      height: 100%;
      line-height: var(--_checkbox-size);
      opacity: 0;
      pointer-events: none;
      transform: scale(1.4);
      transition:
        transform 0.1s,
        opacity 0.8s;
      width: 100%;
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
      opacity: 0.4;
      transform: scale(0);
      transition-duration: 0.01s, 0.01s;
    }

    /* Required */
    :host([required]) [part='required-indicator'] {
      position: absolute;
      right: var(--lumo-space-xs);
      top: var(--lumo-space-xs);
    }

    :host([required][dir='rtl']) [part='required-indicator'] {
      left: var(--lumo-space-xs);
      right: auto;
    }

    :host([required]) [part='required-indicator']::after {
      color: var(--lumo-required-field-indicator-color, var(--lumo-primary-text-color));
      content: var(--lumo-required-field-indicator, '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\2022');
      text-align: center;
      transition: opacity 0.2s;
      width: 1em;
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
      color: var(--vaadin-input-field-error-color, var(--lumo-error-text-color));
      font-size: var(--vaadin-input-field-error-font-size, var(--lumo-font-size-xs));
      font-weight: var(--vaadin-input-field-error-font-weight, 400);
      line-height: var(--lumo-line-height-xs);
      max-height: 5em;
      padding-inline-start: var(--lumo-space-xs);
      transition: 0.4s max-height;
      will-change: max-height;
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
      color: var(--vaadin-input-field-helper-color, var(--lumo-secondary-text-color));
      display: block;
      font-size: var(--vaadin-input-field-helper-font-size, var(--lumo-font-size-xs));
      font-weight: var(--vaadin-input-field-helper-font-weight, 400);
      line-height: var(--lumo-line-height-xs);
      margin-left: calc(var(--lumo-border-radius-m) / 4);
      padding-inline-start: var(--lumo-space-xs);
      transition: color 0.2s;
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
