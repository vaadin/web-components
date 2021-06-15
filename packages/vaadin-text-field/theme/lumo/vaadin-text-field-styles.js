import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/mixins/required-field.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/mixins/field-button.js';

registerStyles(
  'vaadin-text-field',
  css`
    :host {
      --lumo-text-field-size: var(--lumo-size-m);
      color: var(--lumo-body-text-color);
      font-size: var(--lumo-font-size-m);
      font-family: var(--lumo-font-family);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-tap-highlight-color: transparent;
      padding: var(--lumo-space-xs) 0;
    }

    :host::before {
      height: var(--lumo-text-field-size);
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
    }

    :host([focused]:not([readonly])) [part='label'] {
      color: var(--lumo-primary-text-color);
    }

    :host([has-helper]) [part='helper-text']::before {
      content: '';
      display: block;
      height: 0.4em;
    }

    [part='helper-text'],
    [part='helper-text'] ::slotted(*) {
      display: block;
      color: var(--lumo-secondary-text-color);
      font-size: var(--lumo-font-size-xs);
      line-height: var(--lumo-line-height-xs);
      margin-left: calc(var(--lumo-border-radius-m) / 4);
      transition: color 0.2s;
    }

    [part='value'],
    [part='input-field'] ::slotted(input),
    [part='input-field'] ::slotted(textarea),
    [part='input-field'] ::slotted([part='value']) {
      cursor: inherit;
      min-height: var(--lumo-text-field-size);
      padding: 0 0.25em;
      --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent, #000 1.25em);
      -webkit-mask-image: var(--_lumo-text-field-overflow-mask-image);
      mask-image: var(--_lumo-text-field-overflow-mask-image);
    }

    [part='value']:focus,
    :host([focused]) [part='input-field'] ::slotted(input),
    :host([focused]) [part='input-field'] ::slotted(textarea) {
      -webkit-mask-image: none;
      mask-image: none;
    }

    [part='value']::placeholder {
      color: inherit;
      transition: opacity 0.175s 0.1s;
      opacity: 0.5;
    }

    [part='input-field'] {
      border-radius: var(--lumo-border-radius-m);
      background-color: var(--lumo-contrast-10pct);
      padding: 0 calc(0.375em + var(--lumo-border-radius-m) / 4 - 1px);
      font-weight: 500;
      line-height: 1;
      position: relative;
      cursor: text;
      box-sizing: border-box;
    }

    /* Used for hover and activation effects */
    [part='input-field']::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: inherit;
      pointer-events: none;
      background-color: var(--lumo-contrast-50pct);
      opacity: 0;
      transition: transform 0.15s, opacity 0.2s;
      transform-origin: 100% 0;
    }

    /* Hover */

    :host(:hover:not([readonly]):not([focused])) [part='label'],
    :host(:hover:not([readonly])) [part='helper-text'],
    :host(:hover:not([readonly])) [part='helper-text'] ::slotted(*) {
      color: var(--lumo-body-text-color);
    }

    :host(:hover:not([readonly]):not([focused])) [part='input-field']::after {
      opacity: 0.1;
    }

    /* Touch device adjustment */
    @media (pointer: coarse) {
      :host(:hover:not([readonly]):not([focused])) [part='label'] {
        color: var(--lumo-secondary-text-color);
      }

      :host(:hover:not([readonly]):not([focused])) [part='input-field']::after {
        opacity: 0;
      }

      :host(:active:not([readonly]):not([focused])) [part='input-field']::after {
        opacity: 0.2;
      }
    }

    /* Trigger when not focusing using the keyboard */
    :host([focused]:not([focus-ring]):not([readonly])) [part='input-field']::after {
      transform: scaleX(0);
      transition-duration: 0.15s, 1s;
    }

    /* Focus-ring */

    :host([focus-ring]) [part='input-field'] {
      box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
    }

    /* Read-only and disabled */
    :host([readonly]) [part='value']::placeholder,
    :host([disabled]) [part='value']::placeholder {
      opacity: 0;
    }

    /* Read-only */

    :host([readonly]) [part='input-field'] {
      color: var(--lumo-secondary-text-color);
      background-color: transparent;
      cursor: default;
    }

    :host([readonly]) [part='input-field']::after {
      background-color: transparent;
      opacity: 1;
      border: 1px dashed var(--lumo-contrast-30pct);
    }

    /* Disabled style */

    :host([disabled]) {
      pointer-events: none;
    }

    :host([disabled]) [part='input-field'] {
      background-color: var(--lumo-contrast-5pct);
    }

    :host([disabled]) [part='label'],
    :host([disabled]) [part='helper-text'],
    :host([disabled]) [part='value'],
    :host([disabled]) [part='input-field'] ::slotted(*) {
      color: var(--lumo-disabled-text-color);
      -webkit-text-fill-color: var(--lumo-disabled-text-color);
    }

    /* Invalid style */

    :host([invalid]) [part='input-field'] {
      background-color: var(--lumo-error-color-10pct);
    }

    :host([invalid]) [part='input-field']::after {
      background-color: var(--lumo-error-color-50pct);
    }

    :host([invalid][focus-ring]) [part='input-field'] {
      box-shadow: 0 0 0 2px var(--lumo-error-color-50pct);
    }

    :host([input-prevented]) [part='input-field'] {
      color: var(--lumo-error-text-color);
    }

    /* Small theme */

    :host([theme~='small']) {
      font-size: var(--lumo-font-size-s);
      --lumo-text-field-size: var(--lumo-size-s);
    }

    :host([theme~='small'][has-label]) [part='label'] {
      font-size: var(--lumo-font-size-xs);
    }

    :host([theme~='small'][has-label]) [part='error-message'] {
      font-size: var(--lumo-font-size-xxs);
    }

    /* Text align */

    :host([theme~='align-left']) [part='value'] {
      text-align: left;
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-center']) [part='value'] {
      text-align: center;
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-right']) [part='value'] {
      text-align: right;
      --_lumo-text-field-overflow-mask-image: none;
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-right']) [part='value'] {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to right, transparent 0.25em, #000 1.5em);
      }
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-left']) [part='value'] {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent 0.25em, #000 1.5em);
      }
    }
    /* helper-text position */

    :host([has-helper][theme~='helper-above-field']) [part='helper-text']::before {
      display: none;
    }

    :host([has-helper][theme~='helper-above-field']) [part='helper-text']::after {
      content: '';
      display: block;
      height: 0.4em;
    }

    :host([has-helper][theme~='helper-above-field']) [part='label'] {
      order: 0;
      padding-bottom: 0.4em;
    }

    :host([has-helper][theme~='helper-above-field']) [part='helper-text'] {
      order: 1;
    }

    :host([has-helper][theme~='helper-above-field']) [part='input-field'] {
      order: 2;
    }

    :host([has-helper][theme~='helper-above-field']) [part='error-message'] {
      order: 3;
    }

    /* Slotted content */

    [part='input-field'] ::slotted(:not([part]):not(iron-icon):not(vaadin-icon):not(input):not(textarea)) {
      color: var(--lumo-secondary-text-color);
      font-weight: 400;
    }

    /* Slotted icons */
    [part='input-field'] ::slotted(vaadin-icon),
    [part='input-field'] ::slotted(iron-icon) {
      color: var(--lumo-contrast-60pct);
      width: var(--lumo-icon-size-m);
      height: var(--lumo-icon-size-m);
    }

    /* Vaadin icons are based on a 16x16 grid (unlike Lumo and Material icons with 24x24), so they look too big by default */
    [part='input-field'] ::slotted(vaadin-icon[icon^='vaadin:']),
    [part='input-field'] ::slotted(iron-icon[icon^='vaadin:']) {
      padding: 0.25em;
      box-sizing: border-box !important;
    }

    [part='clear-button']::before {
      content: var(--lumo-icons-cross);
    }

    /* RTL specific styles */

    :host([dir='rtl']) [part='input-field']::after {
      transform-origin: 0% 0;
    }

    :host([dir='rtl']) [part='value'],
    :host([dir='rtl']) [part='input-field'] ::slotted(input),
    :host([dir='rtl']) [part='input-field'] ::slotted(textarea) {
      --_lumo-text-field-overflow-mask-image: linear-gradient(to right, transparent, #000 1.25em);
    }

    :host([dir='rtl']) [part='value']:focus,
    :host([focused][dir='rtl']) [part='input-field'] ::slotted(input),
    :host([focused][dir='rtl']) [part='input-field'] ::slotted(textarea) {
      -webkit-mask-image: none;
      mask-image: none;
    }

    @-moz-document url-prefix() {
      :host([dir='rtl']) [part='value'],
      :host([dir='rtl']) [part='input-field'] ::slotted(input),
      :host([dir='rtl']) [part='input-field'] ::slotted(textarea),
      :host([dir='rtl']) [part='input-field'] ::slotted([part='value']) {
        mask-image: var(--_lumo-text-field-overflow-mask-image);
      }
    }

    :host([theme~='align-left'][dir='rtl']) [part='value'] {
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-center'][dir='rtl']) [part='value'] {
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-right'][dir='rtl']) [part='value'] {
      --_lumo-text-field-overflow-mask-image: none;
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-right'][dir='rtl']) [part='value'] {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to right, transparent 0.25em, #000 1.5em);
      }
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-left'][dir='rtl']) [part='value'] {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent 0.25em, #000 1.5em);
      }
    }
  `,
  { moduleId: 'lumo-text-field', include: ['lumo-required-field', 'lumo-field-button'] }
);
