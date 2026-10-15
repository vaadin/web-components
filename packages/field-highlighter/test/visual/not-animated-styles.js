import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-user-tags-overlay',
  css`
    :host([opening]),
    :host([closing]),
    :host([opening]) [part='overlay'],
    :host([closing]) [part='overlay'] {
      animation: none !important;
    }
  `,
);

/* Disable opacity transition */
registerStyles(
  'vaadin-user-tag',
  css`
    :host {
      transition: none !important;
    }
  `,
);
