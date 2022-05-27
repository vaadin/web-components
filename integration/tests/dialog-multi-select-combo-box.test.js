import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import './not-animated-styles.js';
import '@vaadin/dialog';
import '@vaadin/multi-select-combo-box';

describe('multi-select-combo-box in dialog', () => {
  let dialog, comboBox;

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    dialog.renderer = (root) => {
      root.innerHTML = '<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>';
    };
    dialog.opened = true;
    await nextFrame();
    comboBox = dialog.$.overlay.querySelector('vaadin-multi-select-combo-box');
    comboBox.items = ['foo', 'bar', 'baz'];
    comboBox.inputElement.focus();
  });

  describe('opened', () => {
    beforeEach(async () => {
      comboBox.opened = true;
      await nextRender();
    });

    it('should not close the dialog when closing multi-select-combo-box on input element Escape', async () => {
      await sendKeys({ press: 'Escape' });

      expect(comboBox.opened).to.be.false;
      expect(dialog.opened).to.be.true;
    });

    it('should close the dialog on subsequent Escape after the multi-select-combo-box is closed', async () => {
      await sendKeys({ press: 'Escape' });

      await sendKeys({ press: 'Escape' });

      expect(dialog.opened).to.be.false;
    });
  });

  describe('clear button visible', () => {
    beforeEach(() => {
      comboBox.clearButtonVisible = true;
      comboBox.selectedItems = ['foo'];
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
});
