import { css, registerStyles } from '@vaadin/vaadin-themable-mixin';

registerStyles(
  'vaadin-notification-card',
  css`
    @keyframes test-animation {
    }

    :host([opening]),
    :host([closing]) {
      animation: test-animation 300ms;
    }
  `,
);
