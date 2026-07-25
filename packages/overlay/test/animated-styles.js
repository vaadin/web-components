import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-overlay',
  css`
    :host([zero-duration-animation]) {
      animation-name: overlay-dummy-animation;
      animation-duration: 0s;
    }

    :host([animate][opening]),
    :host([animate][closing]) {
      animation: 50ms overlay-dummy-animation;
    }

    @keyframes overlay-dummy-animation {
      to {
        opacity: 1 !important; /* stylelint-disable-line keyframe-declaration-no-important */
      }
    }
  `,
);
