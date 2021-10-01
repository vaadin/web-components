import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

/* hide caret */
registerStyles(
  'vaadin-text-field',
  css`
    ::slotted(input) {
      font-size: 0 !important;
    }
  `
);
