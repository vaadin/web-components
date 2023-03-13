import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-menu-bar-overlay',
  css`
    :host([opening]),
    :host([closing]),
    :host([opening]) [part='overlay'],
    :host([closing]) [part='overlay'] {
      animation: none !important;
    }
  `,
);

registerStyles(
  'vaadin-menu-bar-button',
  css`
    :host,
    :host::before,
    :host::after {
      transition: none !important;
    }
  `,
);
