import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-tooltip-overlay',
  css`
    [part='overlay'] {
      width: 50px;
      border: 1px solid blue;
    }
  `,
);
