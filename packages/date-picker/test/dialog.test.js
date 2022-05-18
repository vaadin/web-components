import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender, touchstart } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '@vaadin/dialog/vaadin-dialog.js';
import './not-animated-styles.js';
import '../vaadin-date-picker.js';
import { getOverlayContent, open } from './common.js';

describe('dialog', () => {
  let dialog, datepicker;

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    dialog.renderer = (root) => {
      root.innerHTML = '<vaadin-date-picker></vaadin-date-picker>';
    };
    dialog.opened = true;
    await nextFrame();
    datepicker = dialog.$.overlay.querySelector('vaadin-date-picker');
  });

  afterEach(async () => {
    datepicker.opened = false;
    dialog.opened = false;
    await nextFrame();
  });

  describe('modal', () => {
    beforeEach(async () => {
      datepicker.inputElement.focus();
      await open(datepicker);
      await nextRender();
    });

    it('should not close the dialog when closing date-picker on input element Escape', async () => {
      await sendKeys({ press: 'Escape' });

      expect(datepicker.opened).to.be.false;
      expect(dialog.opened).to.be.true;
    });

    it('should not close the dialog when closing date-picker on month calendar Escape', async () => {
      // Focus the month calendar
      await sendKeys({ press: 'Tab' });

      await sendKeys({ press: 'Escape' });

      expect(datepicker.opened).to.be.false;
      expect(dialog.opened).to.be.true;
    });

    it('should not close the dialog when closing date-picker on Today button Escape', async () => {
      // Focus the Today button
      getOverlayContent(datepicker).$.todayButton.focus();

      await sendKeys({ press: 'Escape' });

      expect(datepicker.opened).to.be.false;
      expect(dialog.opened).to.be.true;
    });

    it('should not close the dialog when closing date-picker on Today button Escape', async () => {
      // Focus the Cancel button
      getOverlayContent(datepicker).$.cancelButton.focus();

      await sendKeys({ press: 'Escape' });

      expect(datepicker.opened).to.be.false;
      expect(dialog.opened).to.be.true;
    });
  });

  describe('modeless', () => {
    beforeEach(async () => {
      dialog.modeless = true;
      await open(datepicker);
    });

    it('should not end up behind the dialog overlay on mousedown', async () => {
      datepicker.dispatchEvent(new CustomEvent('mousedown', { bubbles: true, composed: true }));
      await nextFrame();
      expect(parseFloat(getComputedStyle(datepicker.$.overlay).zIndex)).to.equal(
        parseFloat(getComputedStyle(dialog.$.overlay).zIndex) + 1,
      );
    });

    it('should not end up behind the dialog overlay on touchstart', async () => {
      touchstart(datepicker);
      await nextFrame();
      expect(parseFloat(getComputedStyle(datepicker.$.overlay).zIndex)).to.equal(
        parseFloat(getComputedStyle(dialog.$.overlay).zIndex) + 1,
      );
    });
  });
});
