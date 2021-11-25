import { expect } from '@esm-bundle/chai';
import { fixtureSync, mousedown, touchstart, nextFrame } from '@vaadin/testing-helpers';
import '@vaadin/vaadin-template-renderer';
import '@vaadin/vaadin-dialog/src/vaadin-dialog.js';
import '../src/vaadin-combo-box.js';

describe('dialog', () => {
  let dialog, comboBox;

  describe('modeless', () => {
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
      expect(comboBox.$.overlay.$.dropdown.$.overlay._last).to.be.true;
    });

    it('should not end up behind the dialog overlay on touchstart', async () => {
      comboBox.open();

      const { left: x, top: y } = comboBox.getBoundingClientRect();
      touchstart(comboBox, { x, y });

      await nextFrame();
      expect(comboBox.$.overlay.$.dropdown.$.overlay._last).to.be.true;
    });
  });

  describe('modal', () => {
    let backdrop;

    beforeEach(async () => {
      dialog = fixtureSync(`
      <vaadin-dialog>
        <template>
          <vaadin-combo-box items="[1,2,3]"></vaadin-combo-box>
        </template>
      </vaadin-dialog>
    `);
      dialog.opened = true;
      await nextFrame();
      comboBox = dialog.$.overlay.querySelector('vaadin-combo-box');
      backdrop = dialog.$.overlay.$.backdrop;
    });

    it('should not close the dialog on outside click', async () => {
      comboBox.open();
      await nextFrame();

      // Clicking on backdrop should close the combo box overlay, but not the dialog overlay
      backdrop.click();
      expect(comboBox.opened).to.be.false;
      expect(dialog.opened).to.be.true;
    });
  });
});
