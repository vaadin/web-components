import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-overlay',
  css`
    [part='backdrop'] {
      animation: none !important;
    }
  `,
);
