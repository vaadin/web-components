import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* Hide caret */
registerStyles(
  'vaadin-number-field',
  css`
    :host([focus-ring]) ::slotted(input) {
      caret-color: transparent;
    }
  `,
);
