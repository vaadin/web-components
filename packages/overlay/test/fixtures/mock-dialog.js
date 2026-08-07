import { MockOverlay } from './mock-overlay.js';

class MockDialogOverlay extends MockOverlay {
  static get is() {
    return 'mock-dialog-overlay';
  }

  get _contentRoot() {
    return this.owner;
  }

  get _rendererRoot() {
    return this.owner;
  }
}

customElements.define(MockDialogOverlay.is, MockDialogOverlay);

class MockDialog extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    const overlay = document.createElement('mock-dialog-overlay');

    const owner = document.createElement('div');
    overlay.owner = owner;

    // Forward the slotted content from wrapper to overlay
    const slot = document.createElement('slot');
    overlay.appendChild(slot);

    overlay.focusTrap = true;
    overlay.renderer = (root) => {
      if (!root.firstChild) {
        root.appendChild(document.createElement('input'));
      }
    };

    this.shadowRoot.append(overlay);
    this.append(owner);
  }
}

customElements.define('mock-dialog', MockDialog);
