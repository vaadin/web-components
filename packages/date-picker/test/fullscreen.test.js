import { expect } from '@vaadin/chai-plugins';
import { sendKeys, setViewport } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextRender, outsideClick, tabKeyDown, tap } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { getFocusableCell, open, touchTap, untilOverlayRendered } from './helpers.js';

describe('fullscreen mode', () => {
  let datePicker, input, overlay, width, height;

  before(() => {
    width = window.innerWidth;
    height = window.innerHeight;
  });

  beforeEach(async () => {
    await setViewport({ width: 420, height });
    datePicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
    await nextRender();
    input = datePicker.inputElement;
    overlay = datePicker.$.overlay;
  });

  afterEach(async () => {
    await setViewport({ width, height });
  });

  describe('overlay attribute', () => {
    it('should set fullscreen attribute on the overlay when a viewport is small', async () => {
      await open(datePicker);
      expect(overlay.hasAttribute('fullscreen')).to.be.true;
    });

    it('should remove fullscreen mode from the the overlay after resizing viewport', async () => {
      await setViewport({ width: 500, height });
      await open(datePicker);
      expect(overlay.hasAttribute('fullscreen')).to.be.false;
    });
  });

  describe('focus', () => {
    describe('default', () => {
      it('should open overlay on input tap', async () => {
        tap(input);
        await untilOverlayRendered(datePicker);
        expect(datePicker.opened).to.be.true;
      });

      it('should not focus the input on touch tap', async () => {
        touchTap(input);
        await untilOverlayRendered(datePicker);
        expect(document.activeElement).to.not.equal(input);
      });

      it('should blur input element when focusing it', () => {
        const spy = sinon.spy(input, 'blur');
        input.focus();
        expect(spy.called).to.be.true;
        expect(document.activeElement).to.not.equal(input);
      });

      it('should not blur input element when focusing it with keyboard', () => {
        const spy = sinon.spy(input, 'blur');
        tabKeyDown(input);
        input.focus();
        expect(spy.called).to.be.false;
        expect(document.activeElement).to.equal(input);
      });

      it('should blur input element when opening overlay', async () => {
        const spy = sinon.spy(input, 'blur');
        await open(datePicker);
        expect(spy.called).to.be.true;
      });

      it('should focus date element when opening overlay', async () => {
        await open(datePicker);
        const cell = getFocusableCell(datePicker);
        expect(cell).to.be.instanceOf(HTMLTableCellElement);
        expect(cell.getAttribute('part')).to.include('today');
      });

      it('should blur input element when closing overlay on outside click', async () => {
        await open(datePicker);
        const spy = sinon.spy(input, 'blur');
        outsideClick();
        await aTimeout(0);
        expect(spy.called).to.be.true;
      });

      it('should not blur input element when closing overlay on Esc', async () => {
        await open(datePicker);
        const spy = sinon.spy(input, 'blur');
        await sendKeys({ press: 'Escape' });
        await aTimeout(0);
        expect(spy.called).to.be.false;
      });
    });

    describe('auto open disabled', () => {
      beforeEach(() => {
        datePicker.autoOpenDisabled = true;
      });

      it('should not open overlay on input tap', () => {
        tap(input);
        expect(datePicker.opened).not.to.be.true;
      });

      it('should focus the input on touch tap', () => {
        touchTap(input);
        expect(document.activeElement).to.equal(input);
      });

      it('should not blur input element when focusing it', () => {
        const spy = sinon.spy(input, 'blur');
        input.focus();
        expect(spy.called).to.be.false;
        expect(document.activeElement).to.equal(input);
      });

      it('should blur input element when opening overlay', async () => {
        const spy = sinon.spy(input, 'blur');
        await open(datePicker);
        expect(spy.called).to.be.true;
      });

      it('should not focus the input when opening overlay', async () => {
        touchTap(input);
        await open(datePicker);
        expect(document.activeElement).to.not.equal(input);
      });
    });
  });

  describe('buttons', () => {
    let overlayContent;

    beforeEach(async () => {
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
    });

    it('should close the dropdown on Today button Esc', async () => {
      overlayContent._todayButton.focus();
      await sendKeys({ press: 'Escape' });

      expect(datePicker.opened).to.be.false;
    });

    it('should close the dropdown on Cancel button Esc', async () => {
      overlayContent.focusCancel();
      await sendKeys({ press: 'Escape' });

      expect(datePicker.opened).to.be.false;
    });

    it('should move focus to Cancel button on date cell Shift Tab', async () => {
      const spy = sinon.spy(overlayContent._cancelButton, 'focus');

      await sendKeys({ press: 'Shift+Tab' });

      expect(spy.calledOnce).to.be.true;
    });

    it('should move focus to date cell button on Cancel button Tab', async () => {
      const cell = getFocusableCell(datePicker);
      const spy = sinon.spy(cell, 'focus');

      // Move focus to Cancel button
      await sendKeys({ press: 'Shift+Tab' });

      await sendKeys({ press: 'Tab' });

      expect(spy.calledOnce).to.be.true;
    });
  });
});
