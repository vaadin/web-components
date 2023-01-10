import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-notification-card',
  css`
    :host([opening]),
    :host([closing]) {
      animation: none !important;
    }
  `,
);
