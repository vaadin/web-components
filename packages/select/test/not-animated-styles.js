import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-select-overlay',
  css`
    :host([opening]),
    :host([closing]),
    :host([opening]) [part='overlay'],
    :host([closing]) [part='overlay'] {
      animation: none !important;
    }
  `
);
