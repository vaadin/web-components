import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* hide caret */
registerStyles(
  'vaadin-date-picker',
  css`
    :host([focused]) ::slotted(input) {
      caret-color: transparent;
    }
  `,
);
