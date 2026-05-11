import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-breadcrumbs',
  css`
    :host,
    :host::before,
    :host::after {
      transition: none !important;
    }
  `,
);

registerStyles(
  'vaadin-breadcrumbs-item',
  css`
    :host,
    :host::before,
    :host::after {
      transition: none !important;
    }
  `,
);
