import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@open-wc/testing-helpers';
import '@vaadin/vaadin-dialog/vaadin-dialog.js';
import './not-animated-styles.js';
import '../vaadin-date-picker.js';

describe('modeless dialog', () => {
  let dialog, datepicker;

  beforeEach(async () => {
    dialog = fixtureSync(`
    <vaadin-dialog modeless>
      <template>
        <vaadin-date-picker></vaadin-date-picker>
      </template>
    </vaadin-dialog>
    `);
    dialog.opened = true;
    await nextFrame();
    datepicker = dialog.$.overlay.content.querySelector('vaadin-date-picker');
  });

  afterEach(async () => {
    datepicker.opened = false;
    dialog.opened = false;
    await nextFrame();
  });

  function touchstart(node) {
    const event = new CustomEvent('touchstart', { bubbles: true, composed: true });
    const nodeRect = node.getBoundingClientRect();
    const clientX = nodeRect.left;
    const clientY = nodeRect.top;
    event.touches = event.changedTouches = event.targetTouches = [{ clientX, clientY }];
    node.dispatchEvent(event);
  }

  it('should not end up behind the dialog overlay on mousedown', async () => {
    datepicker.opened = true;
    datepicker.dispatchEvent(new CustomEvent('mousedown', { bubbles: true, composed: true }));
    await nextFrame();
    expect(parseFloat(getComputedStyle(datepicker.$.overlay).zIndex)).to.equal(
      parseFloat(getComputedStyle(dialog.$.overlay).zIndex) + 1
    );
  });

  it('should not end up behind the dialog overlay on touchstart', async () => {
    datepicker.opened = true;
    touchstart(datepicker);
    await nextFrame();
    expect(parseFloat(getComputedStyle(datepicker.$.overlay).zIndex)).to.equal(
      parseFloat(getComputedStyle(dialog.$.overlay).zIndex) + 1
    );
  });
});
