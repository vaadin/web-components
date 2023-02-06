import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-tab',
  css`
    :host,
    :host::before,
    :host::after {
      transition: none !important;
    }
  `,
);
