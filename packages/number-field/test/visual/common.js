import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

/* hide caret */
registerStyles(
  'vaadin-number-field',
  css`
    :host([focus-ring]) ::slotted(input) {
      font-size: 0 !important;
    }
  `
);
