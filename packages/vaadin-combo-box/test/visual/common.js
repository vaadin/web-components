import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

/* hide caret */
registerStyles(
  'vaadin-combo-box',
  css`
    :host([focus-ring]) ::slotted(input) {
      font-size: 0 !important;
    }
  `
);
