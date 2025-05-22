import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

// TODO: subset of Lumo needed for unit tests to pass.
// These should be eventually covered by base styles.
registerStyles(
  'vaadin-text-field',
  css`
    /* For user-tags scrollable container tests */
    ::slotted([slot='input']) {
      min-height: 2.25rem;
    }
  `,
);

registerStyles(
  'vaadin-select-overlay',
  css`
    /* Dummy animation for outside click test that covers focusin logic
    in SelectObserver relying on "closing" attribute being present */
    :host([closing]) {
      animation: 0.1s dummy-overlay-animation;
    }

    @keyframes dummy-overlay-animation {
      0% {
        opacity: 1;
      }

      100% {
        opacity: 1;
      }
    }
  `,
);
