import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-email-field',
  css`
    :host([dir='rtl']) [part='value']:placeholder-shown,
    :host([dir='rtl']) [part='input-field'] ::slotted(input:placeholder-shown) {
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([dir='rtl']) [part='value'],
    :host([dir='rtl']) [part='input-field'] ::slotted(input) {
      --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent, #000 1.25em);
    }
  `,
  { moduleId: 'lumo-email-field' }
);
