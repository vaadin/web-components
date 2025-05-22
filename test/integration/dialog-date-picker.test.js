import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, touchstart } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '@vaadin/date-picker/src/vaadin-date-picker.js';
import '@vaadin/dialog/src/vaadin-dialog.js';
import { open, untilOverlayScrolled } from '@vaadin/date-picker/test/helpers.js';

describe('date-picker in dialog', () => {
  let dialog, datePicker;

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    dialog.renderer = (root) => {
      root.innerHTML = '<vaadin-date-picker></vaadin-date-picker>';
    };
    dialog.opened = true;
    await nextFrame();
    datePicker = dialog.$.overlay.querySelector('vaadin-date-picker');
  });

  afterEach(async () => {
    datePicker.opened = false;
    dialog.opened = false;
    await nextFrame();
  });

  describe('modal', () => {
    let overlayContent;

    beforeEach(async () => {
      datePicker.inputElement.focus();
      await open(datePicker);
      await nextRender();
      overlayContent = datePicker._overlayContent;
    });

    it('should focus the Today button on second Tab when inside a dialog', async () => {
      // Focus the month calendar
      await sendKeys({ press: 'Tab' });

      await nextRender();
      await untilOverlayScrolled(datePicker);

      // Focus the Today button
      await sendKeys({ press: 'Tab' });

      expect(overlayContent._todayButton.hasAttribute('focused')).to.be.true;
    });

    it('should focus the Cancel button on Shift + Tab when inside a dialog', async () => {
      // Focus the Cancel button
      await sendKeys({ press: 'Shift+Tab' });

      expect(overlayContent._cancelButton.hasAttribute('focused')).to.be.true;
    });

    it('should focus the input on calendar date Shift Tab when inside a dialog', async () => {
      // Move focus to the calendar
      await sendKeys({ press: 'Tab' });

      await nextRender();
      await untilOverlayScrolled(datePicker);

      const spy = sinon.spy(datePicker.inputElement, 'focus');

      await sendKeys({ press: 'Shift+Tab' });

      expect(spy.calledOnce).to.be.true;
    });

    it('should not close the dialog when closing date-picker on input element Escape', async () => {
      await sendKeys({ press: 'Escape' });

      expect(datePicker.opened).to.be.false;
      expect(dialog.opened).to.be.true;
    });

    it('should close the dialog on subsequent Escape after the date-picker is closed', async () => {
      await sendKeys({ press: 'Escape' });

      await sendKeys({ press: 'Escape' });

      expect(dialog.opened).to.be.false;
    });

    it('should not close the dialog when closing date-picker on month calendar Escape', async () => {
      // Focus the month calendar
      await sendKeys({ press: 'Tab' });

      await sendKeys({ press: 'Escape' });

      expect(datePicker.opened).to.be.false;
      expect(dialog.opened).to.be.true;
    });

    it('should not close the dialog when closing date-picker on Today button Escape', async () => {
      // Focus the month calendar
      await sendKeys({ press: 'Tab' });

      // Focus the Today button
      await sendKeys({ press: 'Tab' });

      await sendKeys({ press: 'Escape' });

      expect(datePicker.opened).to.be.false;
      expect(dialog.opened).to.be.true;
    });

    it('should not close the dialog when closing date-picker on Cancel button Escape', async () => {
      // Focus the Cancel button
      await sendKeys({ press: 'Shift+Tab' });

      await sendKeys({ press: 'Escape' });

      expect(datePicker.opened).to.be.false;
      expect(dialog.opened).to.be.true;
    });
  });

  describe('modeless', () => {
    beforeEach(async () => {
      dialog.modeless = true;
      await open(datePicker);
    });

    it('should not end up behind the dialog overlay on mousedown', async () => {
      datePicker.dispatchEvent(new CustomEvent('mousedown', { bubbles: true, composed: true }));
      await nextFrame();
      expect(parseFloat(getComputedStyle(datePicker.$.overlay).zIndex)).to.equal(
        parseFloat(getComputedStyle(dialog.$.overlay).zIndex) + 1,
      );
    });

    it('should not end up behind the dialog overlay on touchstart', async () => {
      touchstart(datePicker);
      await nextFrame();
      expect(parseFloat(getComputedStyle(datePicker.$.overlay).zIndex)).to.equal(
        parseFloat(getComputedStyle(dialog.$.overlay).zIndex) + 1,
      );
    });
  });
});
