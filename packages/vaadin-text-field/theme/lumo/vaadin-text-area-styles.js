import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import './vaadin-text-field-styles.js';

registerStyles(
  'vaadin-text-area',
  css`
    [part='input-field'],
    [part='input-field'] ::slotted(textarea) {
      /* Equal to the implicit padding in vaadin-text-field */
      padding-top: calc((var(--lumo-text-field-size) - 1em * var(--lumo-line-height-s)) / 2);
      padding-bottom: calc((var(--lumo-text-field-size) - 1em * var(--lumo-line-height-s)) / 2);
      height: auto;
      box-sizing: border-box;
      transition: background-color 0.1s;
      line-height: var(--lumo-line-height-s);
    }

    :host(:not([readonly])) [part='input-field']::after {
      display: none;
    }

    :host([readonly]) [part='input-field'] {
      border: 1px dashed var(--lumo-contrast-30pct);
    }

    :host([readonly]) [part='input-field']::after {
      border: none;
    }

    :host(:hover:not([readonly]):not([focused]):not([invalid])) [part='input-field'] {
      background-color: var(--lumo-contrast-20pct);
    }

    @media (pointer: coarse) {
      :host(:hover:not([readonly]):not([focused]):not([invalid])) [part='input-field'] {
        background-color: var(--lumo-contrast-10pct);
      }

      :host(:active:not([readonly]):not([focused])) [part='input-field'] {
        background-color: var(--lumo-contrast-20pct);
      }
    }

    [part='value'],
    [part='input-field'] ::slotted(textarea) {
      line-height: inherit;
      --_lumo-text-field-overflow-mask-image: none;
    }

    /* Vertically align icon prefix/suffix with the first line of text */
    [part='input-field'] ::slotted(vaadin-icon),
    [part='input-field'] ::slotted(iron-icon) {
      margin-top: calc((var(--lumo-icon-size-m) - 1em * var(--lumo-line-height-s)) / -2);
    }

    [part='input-field'] [part='value'],
    [part='input-field'] ::slotted(textarea) {
      white-space: pre-wrap; /* override "nowrap" from <vaadin-text-field> */
      align-self: stretch; /* override "baseline" from <vaadin-text-field> */
    }
  `,
  { moduleId: 'lumo-text-area', include: ['lumo-text-field'] }
);
