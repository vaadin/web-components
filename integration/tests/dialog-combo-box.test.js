import { expect } from '@esm-bundle/chai';
import { fixtureSync, mousedown, nextFrame, touchstart } from '@vaadin/testing-helpers';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import './not-animated-styles.js';
import '@vaadin/combo-box';
import '@vaadin/dialog';

describe('combo-box in dialog', () => {
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

  it('should not end up behind the dialog overlay on mousedown', async () => {
    comboBox.open();
    mousedown(comboBox);
    await nextFrame();
    expect(comboBox.$.dropdown.$.overlay._last).to.be.true;
  });

  it('should not end up behind the dialog overlay on touchstart', async () => {
    comboBox.open();

    const { left: x, top: y } = comboBox.getBoundingClientRect();
    touchstart(comboBox, { x, y });

    await nextFrame();
    expect(comboBox.$.dropdown.$.overlay._last).to.be.true;
  });
});
