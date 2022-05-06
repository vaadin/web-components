import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* Hide caret */
registerStyles(
  'vaadin-text-area',
  css`
    ::slotted(textarea) {
      caret-color: transparent;
    }
  `,
);
