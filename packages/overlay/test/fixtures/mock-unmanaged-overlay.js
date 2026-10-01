import { Overlay } from '../../src/vaadin-overlay.js';

class MockUnmanagedOverlay extends Overlay {
  static get is() {
    return 'mock-unmanaged-overlay';
  }

  static get manageFocus() {
    return false;
  }
}

customElements.define(MockUnmanagedOverlay.is, MockUnmanagedOverlay);
