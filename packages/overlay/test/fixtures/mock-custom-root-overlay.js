import { MockOverlay } from './mock-overlay.js';

class MockCustomRootOverlay extends MockOverlay {
  static get is() {
    return 'mock-custom-root-overlay';
  }

  get _rendererRoot() {
    return this.__customRoot;
  }

  firstUpdated() {
    super.firstUpdated();

    this.__customRoot = document.createElement('div');
    this.appendChild(this.__customRoot);
  }
}

customElements.define(MockCustomRootOverlay.is, MockCustomRootOverlay);
