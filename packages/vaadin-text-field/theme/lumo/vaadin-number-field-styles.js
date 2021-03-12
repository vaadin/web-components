import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/mixins/field-button.js';

registerStyles(
  'vaadin-number-field',
  css`
    :host {
      width: 8em;
    }

    :host([has-controls]:not([theme~='align-right'])) [part='value'] {
      text-align: center;
    }

    [part$='button'][disabled] {
      opacity: 0.2;
    }

    :host([has-controls]) [part='input-field'] {
      padding: 0;
    }

    [part\$='button'] {
      cursor: pointer;
      font-size: var(--lumo-icon-size-s);
      width: 1.6em;
      height: 1.6em;
    }

    [part\$='button']::before {
      margin-top: 0.2em;
    }

    /* RTL specific styles */
    :host([dir='rtl']) [part='value'],
    :host([dir='rtl']) [part='input-field'] ::slotted(input) {
      --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent, #000 1.25em);
    }
  `,
  { moduleId: 'lumo-number-field', include: ['lumo-field-button'] }
);
