import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@open-wc/testing-helpers';
import '@vaadin/vaadin-dialog/src/vaadin-dialog.js';
import '../src/vaadin-combo-box.js';

describe('dialog', () => {
  let dialog, comboBox;

  beforeEach(async () => {
    dialog = fixtureSync(`
      <vaadin-dialog modeless>
        <template>
          <vaadin-combo-box items="[1,2,3]"></vaadin-combo-box>
        </template>
      </vaadin-dialog>
    `);
    dialog.opened = true;
    await nextFrame();
    comboBox = dialog.$.overlay.querySelector('vaadin-combo-box');
  });

  function touchstart(node) {
    const event = new CustomEvent('touchstart', { bubbles: true, cancelable: true });

    const nodeRect = node.getBoundingClientRect();
    const clientX = nodeRect.left;
    const clientY = nodeRect.top;

    event.touches = event.changedTouches = event.targetTouches = [{ clientX, clientY }];
    node.dispatchEvent(event);
  }

  it('should not end up behind the dialog overlay on mousedown', async () => {
    comboBox.open();
    comboBox.dispatchEvent(new CustomEvent('mousedown', { bubbles: true, composed: true }));
    await nextFrame();
    expect(comboBox.$.overlay.$.dropdown.$.overlay._last).to.be.true;
  });

  it('should not end up behind the dialog overlay on touchstart', async () => {
    comboBox.open();
    touchstart(comboBox);
    await nextFrame();
    expect(comboBox.$.overlay.$.dropdown.$.overlay._last).to.be.true;
  });
});
