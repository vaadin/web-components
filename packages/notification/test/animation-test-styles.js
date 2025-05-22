import { css, registerStyles } from '@vaadin/vaadin-themable-mixin';

registerStyles(
  'vaadin-notification-card',
  css`
    @keyframes test-fade-in {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }

    @keyframes test-fade-out {
      0% {
        opacity: 1;
      }

      100% {
        opacity: 0;
      }
    }

    :host([opening]) {
      animation: test-fade-in 300ms;
    }

    :host([closing]) {
      animation: test-fade-out 300ms;
    }
  `,
);
