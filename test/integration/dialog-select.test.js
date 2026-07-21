import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '@vaadin/dialog/src/vaadin-dialog.js';
import '@vaadin/select/src/vaadin-select.js';

function dispatchMouseEvent(target, type) {
  target.dispatchEvent(new MouseEvent(type, { view: window, bubbles: true, cancelable: true, composed: true }));
}

describe('select in dialog', () => {
  let dialog, select;

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog modeless></vaadin-dialog>');
    dialog.headerTitle = 'Title';
    dialog.renderer = (root) => {
      if (!root.firstChild) {
        root.innerHTML = '<vaadin-select></vaadin-select>';
      }
    };
    dialog.opened = true;
    await oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
    select = dialog.querySelector('vaadin-select');
    select.items = [
      { label: 'Option 1', value: 'value-1' },
      { label: 'Option 2', value: 'value-2' },
    ];
  });

  afterEach(async () => {
    await resetMouse();
  });

  it('should close the select on dialog header title click', async () => {
    select.opened = true;
    await nextRender();

    // Use title slot part instead of the actual slotted title HTML element,
    // since `getBoundingClientRect()` for the latter returns 0 coordinates.
    const title = dialog.$.overlay.shadowRoot.querySelector('[part="title"]');

    await sendMouseToElement({ type: 'click', element: title });

    expect(select.opened).to.be.false;
  });

  it('should keep the select overlay on top when interacting with it', async () => {
    select.opened = true;
    await nextRender();

    // The open select overlay is the front-most overlay in the stack.
    expect(select._overlayElement._last).to.be.true;

    // A mousedown inside the select overlay bubbles up to the modeless dialog
    // overlay, but must not bring the dialog in front of its own open overlay.
    dispatchMouseEvent(select._overlayElement, 'mousedown');

    expect(select._overlayElement._last).to.be.true;
    expect(dialog.$.overlay._last).to.be.false;
  });
});
