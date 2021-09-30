import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

/* hide caret */
registerStyles(
  'vaadin-text-field',
  css`
    :host([focus-ring]) ::slotted(input) {
      caret-color: transparent;
    }
  `
);
