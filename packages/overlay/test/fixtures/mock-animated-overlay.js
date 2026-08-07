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

        @keyframes overlay-dummy-animation {
          to {
            opacity: 1 !important; /* stylelint-disable-line keyframe-declaration-no-important */
          }
        }
      `,
    ];
  }
}

customElements.define(MockAnimatedOverlay.is, MockAnimatedOverlay);
