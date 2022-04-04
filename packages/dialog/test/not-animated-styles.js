import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-dialog-overlay',
  css`
    :host([opening]),
    :host([closing]),
    :host([opening]) [part='overlay'],
    :host([closing]) [part='overlay'] {
      animation: none !important;
    }
  `,
  { moduleId: 'not-animated-dialog-overlay' }
);
