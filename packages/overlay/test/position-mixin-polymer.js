import { Overlay } from '../src/vaadin-overlay.js';
import { PositionMixin } from '../src/vaadin-overlay-position-mixin.js';

class PositionedOverlay extends PositionMixin(Overlay) {
  static get is() {
    return 'vaadin-positioned-overlay';
  }
}

customElements.define(PositionedOverlay.is, PositionedOverlay);
