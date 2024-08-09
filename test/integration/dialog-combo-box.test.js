import { expect } from '@vaadin/chai-plugins';
import {
  fixtureSync,
  mousedown,
  nextFrame,
  nextUpdate,
  oneEvent,
  outsideClick,
  touchstart,
} from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import './not-animated-styles.js';
import '@vaadin/combo-box';
import '@vaadin/dialog';

describe('combo-box in dialog', () => {
  let dialog, comboBox;

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    await nextUpdate(dialog);
    dialog.renderer = (root) => {
      root.innerHTML = '<vaadin-combo-box></vaadin-combo-box>';
    };
    dialog.opened = true;
    await oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
    comboBox = dialog.$.overlay.querySelector('vaadin-combo-box');
    comboBox.items = ['foo', 'bar'];
    comboBox.inputElement.focus();
  });

  describe('opened', () => {
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
      comboBox.open();
      await nextFrame();
    });

    it('should not end up behind the dialog overlay on mousedown', async () => {
      mousedown(comboBox);
      await nextFrame();
      expect(comboBox.$.overlay._last).to.be.true;
    });

    it('should not end up behind the dialog overlay on touchstart', async () => {
      const { left: x, top: y } = comboBox.getBoundingClientRect();
      touchstart(comboBox, { x, y });

      await nextFrame();
      expect(comboBox.$.overlay._last).to.be.true;
    });
  });
});
