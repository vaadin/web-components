import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* hide caret */
registerStyles(
  'vaadin-text-area',
  css`
    ::slotted(textarea) {
      caret-color: transparent;
    }
  `,
);
