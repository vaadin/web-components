import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/dialog/src/vaadin-dialog.js';
import '@vaadin/time-picker/src/vaadin-time-picker.js';

describe('time-picker in dialog', () => {
  let dialog, timePicker;

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    dialog.renderer = (root) => {
      root.innerHTML = '<vaadin-time-picker></vaadin-time-picker>';
    };
    dialog.opened = true;
    await nextFrame();
    timePicker = dialog.$.overlay.querySelector('vaadin-time-picker');
  });

  beforeEach(() => {
    timePicker.inputElement.focus();
  });

  describe('opened', () => {
    beforeEach(async () => {
      timePicker.$.comboBox.open();
      await nextRender();
    });

    it('should not close the dialog when closing time-picker on input element Escape', async () => {
      await sendKeys({ press: 'Escape' });

      expect(timePicker.$.comboBox.opened).to.be.false;
      expect(dialog.opened).to.be.true;
    });

    it('should close the dialog on subsequent Escape after the time-picker is closed', async () => {
      await sendKeys({ press: 'Escape' });

      await sendKeys({ press: 'Escape' });

      expect(dialog.opened).to.be.false;
    });
  });

  describe('clear button visible', () => {
    beforeEach(() => {
      timePicker.clearButtonVisible = true;
      timePicker.value = '12:00';
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
