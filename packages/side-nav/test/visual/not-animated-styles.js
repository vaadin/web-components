import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-side-nav',
  css`
    :host,
    :host::before,
    :host::after,
    summary,
    summary::before,
    summary::after {
      transition: none !important;
    }
  `,
);

registerStyles(
  'vaadin-side-nav-item',
  css`
    :host,
    :host::before,
    :host::after,
    button,
    button::before,
    button::after {
      transition: none !important;
    }
  `,
);
