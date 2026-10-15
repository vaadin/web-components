import { css } from 'lit';
import { PositionMixin } from '../../src/vaadin-overlay-position-mixin.js';
import { MockOverlay } from './mock-overlay.js';

class MockPositionedOverlay extends PositionMixin(MockOverlay) {
  static get is() {
    return 'mock-positioned-overlay';
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        @keyframes slidein {
          0% {
            transform: translateY(10px);
          }
        }

        :host(.animated) [part='overlay'] {
          animation: slidein 0.2s;
        }
      `,
    ];
  }
}

customElements.define(MockPositionedOverlay.is, MockPositionedOverlay);
