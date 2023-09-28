import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-grid',
  css`
    [part~='cell'] {
      height: 20px;
    }
  `,
);
