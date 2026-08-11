import { css } from 'lit';
import { MockOverlay } from './mock-overlay.js';

class MockAnimatedOverlay extends MockOverlay {
  static get is() {
    return 'mock-animated-overlay';
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host([zero-duration-animation]) {
          animation-name: overlay-dummy-animation;
          animation-duration: 0s;
        }

        :host([animate][opening]),
        :host([animate][closing]) {
          animation: 50ms overlay-dummy-animation;
        }

        /* Long enough for asynchronous interactions to happen while the animation runs */
        :host([long-animation][opening]),
        :host([long-animation][closing]) {
          animation: 5s overlay-dummy-animation;
        }

        /* Paint properties applied by a theme, which the base animation must not override */
        :host([themed-parts]) [part='overlay'],
        :host([themed-parts]) [part='backdrop'] {
          transform: rotate(45deg);
          translate: 11px 12px;
          scale: 0.75;
          opacity: 0.5;
        }

        /* Two animations of different lengths, the state ends with the longest */
        :host([multiple-animations][opening]),
        :host([multiple-animations][closing]) {
          animation:
            50ms overlay-dummy-animation,
            5s content-dummy-animation;
        }

        /* A transition applied by a theme, which does not report the state of the overlay */
        :host([theme-transition]) {
          transition: opacity 5s;
        }

        :host([theme-transition][opening]) {
          opacity: 0.9;
        }

        /* Content that keeps animating for longer than the overlay itself */
        ::slotted(.slow-content) {
          animation: 5s content-dummy-animation;
        }

        @keyframes overlay-dummy-animation {
          to {
            opacity: 1 !important; /* stylelint-disable-line keyframe-declaration-no-important */
          }
        }

        @keyframes content-dummy-animation {
          to {
            opacity: 0.5;
          }
        }
      `,
    ];
  }
}

customElements.define(MockAnimatedOverlay.is, MockAnimatedOverlay);
