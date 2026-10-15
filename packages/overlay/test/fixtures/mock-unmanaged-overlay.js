import { MockOverlay } from './mock-overlay.js';

class MockUnmanagedOverlay extends MockOverlay {
  static get is() {
    return 'mock-unmanaged-overlay';
  }

  static get manageFocus() {
    return false;
  }
}

customElements.define(MockUnmanagedOverlay.is, MockUnmanagedOverlay);
