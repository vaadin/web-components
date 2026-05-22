import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  '*',
  css`
    :host,
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
      caret-color: transparent !important;
    }
  `,
);
