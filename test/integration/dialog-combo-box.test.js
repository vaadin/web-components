import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown, nextRender, nextUpdate, oneEvent, outsideClick } from '@vaadin/testing-helpers';
import '@vaadin/combo-box';
import '@vaadin/dialog';

describe('combo-box in dialog', () => {
  let dialog, comboBox;

  beforeEach(async () => {
    dialog = fixtureSync(`
      <vaadin-dialog>
        <vaadin-combo-box></vaadin-combo-box>
      </vaadin-dialog>
    `);
    await nextUpdate(dialog);
    dialog.opened = true;
    await oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
    comboBox = dialog.querySelector('vaadin-combo-box');
    comboBox.items = ['foo', 'bar'];
    comboBox.inputElement.focus();
  });

  describe('default', () => {
    beforeEach(async () => {
      comboBox.open();
      await nextUpdate(comboBox);
    });

    it('should not close the dialog when closing combo-box on input element Escape', async () => {
      await sendKeys({ press: 'Escape' });

      expect(comboBox.opened).to.be.false;
      expect(dialog.opened).to.be.true;
    });

    it('should close the dialog on subsequent Escape after the combo-box is closed', async () => {
      await sendKeys({ press: 'Escape' });

      await sendKeys({ press: 'Escape' });

      expect(dialog.opened).to.be.false;
    });

    it('should not close the dialog when closing combo-box on outside click', () => {
      outsideClick();

      expect(comboBox.opened).to.be.false;
      expect(dialog.opened).to.be.true;
    });
  });

  describe('clear button visible', () => {
    beforeEach(() => {
      comboBox.clearButtonVisible = true;
      comboBox.value = 'foo';
    });

    it('should not close the dialog when clearing on Escape with clear button visible', async () => {
      await sendKeys({ press: 'Escape' });

      expect(dialog.opened).to.be.true;
    });

    it('should close the dialog on subsequent Escape after the value is cleared', async () => {
      await sendKeys({ press: 'Escape' });

      await sendKeys({ press: 'Escape' });

      expect(dialog.opened).to.be.false;
    });
  });

  describe('modeless', () => {
    beforeEach(async () => {
      dialog.modeless = true;
      await nextUpdate(dialog);

      comboBox.open();
      await nextRender();
    });

    it('should keep the combo-box overlay on top of dialog on input mousedown', () => {
      mousedown(comboBox.inputElement);

      expect(comboBox.$.overlay._last).to.be.true;
      expect(dialog.$.overlay._last).to.be.false;
    });

    it('should keep the combo-box overlay on top of dialog on label mousedown', () => {
      mousedown(comboBox._labelNode);

      expect(comboBox.$.overlay._last).to.be.true;
      expect(dialog.$.overlay._last).to.be.false;
    });
  });
});
