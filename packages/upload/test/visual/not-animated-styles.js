import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-upload-button',
  css`
    :host,
    :host::before,
    :host::after {
      transition: none !important;
    }
  `,
);
