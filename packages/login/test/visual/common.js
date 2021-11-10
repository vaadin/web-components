import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* hide caret */
registerStyles(
  'vaadin-text-field',
  css`
    ::slotted(input) {
      font-size: 0 !important;
    }
  `
);
