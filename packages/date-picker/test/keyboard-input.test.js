import { expect } from '@esm-bundle/chai';
import { aTimeout, enter, fixtureSync, listenOnce, nextRender, tap } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-date-picker.js';
import { close, getFocusedCell, getOverlayContent, open, waitForScrollToFinish } from './common.js';

describe('keyboard', () => {
  let datepicker;
  let input;

  function focusedDate() {
    return getOverlayContent(datepicker).focusedDate;
  }

  beforeEach(() => {
    datepicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
    input = datepicker.inputElement;
    input.focus();
  });

  describe('focused date', () => {
    it('should focus parsed date', async () => {
      await sendKeys({ type: '1/20/2000' });

      expect(focusedDate().getMonth()).to.equal(0);
      expect(focusedDate().getDate()).to.equal(20);
    });

    it('should change focused date on user input', async () => {
      datepicker.value = '2000-01-01';

      input.select();
      await sendKeys({ type: '1/30/2000' });
      expect(focusedDate().getDate()).to.equal(30);
    });

    it('should update focus on input value change', async () => {
      await sendKeys({ type: '1/20/20' });
      await sendKeys({ type: '17' });

      expect(focusedDate().getMonth()).to.equal(0);
      expect(focusedDate().getFullYear()).to.equal(2017);
    });

    it('should select focused date on Enter', async () => {
      await sendKeys({ type: '1/1/2001' });
      await sendKeys({ press: 'Enter' });
      expect(datepicker.value).to.equal('2001-01-01');
    });

    it('should update focused date on value change', () => {
      datepicker.value = '2000-01-01';
      expect(focusedDate().getMonth()).to.equal(0);
      expect(focusedDate().getDate()).to.equal(1);
      expect(focusedDate().getFullYear()).to.equal(2000);
    });

    // FIXME: flaky test often failing locally due to scroll animation
    it.skip('should display focused date while overlay focused', async () => {
      await sendKeys({ type: '1/2/2000' });
      const content = getOverlayContent(datepicker);
      await waitForScrollToFinish(content);

      // Move focus to the calendar
      await sendKeys({ press: 'Tab' });

      await nextRender(datepicker);

      await sendKeys({ press: 'ArrowDown' });
      expect(input.value).not.to.equal('1/2/2000');
    });

    it('should reflect focused date to input', async () => {
      datepicker.value = '2000-01-01';
      await open(datepicker);
      await nextRender(datepicker);

      // Move focus to the calendar
      await sendKeys({ press: 'Tab' });

      await nextRender(datepicker);

      await sendKeys({ press: 'ArrowDown' });
      expect(input.value).to.equal('1/8/2000');
    });
  });

  describe('no parseDate', () => {
    beforeEach(() => {
      datepicker.i18n = {
        ...datepicker.i18n,
        parseDate: null,
      };
    });

    it('should prevent key input', () => {
      const e = new CustomEvent('keydown', {
        bubbles: true,
        composed: true,
      });

      const spy = sinon.spy(e, 'preventDefault');
      input.dispatchEvent(e);
      expect(spy.called).to.be.true;
    });

    it('should select focused date on close', async () => {
      await open(datepicker);
      await close(datepicker);
      expect(datepicker._selectedDate).to.equal(datepicker._focusedDate);
    });
  });

  describe('open overlay', () => {
    it('should open the overlay on input', async () => {
      await sendKeys({ type: 'j' });
      expect(datepicker.opened).to.be.true;
    });

    it('should open the overlay on Arrow Down', async () => {
      await sendKeys({ press: 'ArrowDown' });
      expect(datepicker.opened).to.be.true;
    });

    it('should open the overlay on Arrow Up', async () => {
      await sendKeys({ press: 'ArrowUp' });
      expect(datepicker.opened).to.be.true;
    });

    it('should open on Arrow Down if autoOpenDisabled is true', async () => {
      datepicker.autoOpenDisabled = true;
      await sendKeys({ press: 'ArrowDown' });
      expect(datepicker.opened).to.be.true;
    });

    it('should open on Arrow Up if autoOpenDisabled is true', async () => {
      datepicker.autoOpenDisabled = true;
      await sendKeys({ press: 'ArrowUp' });
      expect(datepicker.opened).to.be.true;
    });

    it('should not open the overlay on Arrow Right', async () => {
      await sendKeys({ press: 'ArrowRight' });
      expect(datepicker.opened).to.be.not.ok;
    });

    it('should not open the overlay on Arrow Left', async () => {
      await sendKeys({ press: 'ArrowLeft' });
      expect(datepicker.opened).to.be.not.ok;
    });

    it('should not open the overlay on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expect(datepicker.opened).to.be.not.ok;
    });

    it('should not throw on Enter before opening overlay', () => {
      expect(() => {
        datepicker.focus();
        enter(input);
      }).not.to.throw(Error);
    });
  });

  describe('overlay opened', () => {
    let overlayContent;

    beforeEach(async () => {
      // Open the overlay
      await open(datepicker);
      await nextRender(datepicker);
      overlayContent = getOverlayContent(datepicker);
    });

    it('should keep focused attribute when the focus moves to the overlay', async () => {
      // Move focus to the calendar
      await sendKeys({ press: 'Tab' });
      await nextRender(datepicker);
      expect(datepicker.hasAttribute('focused')).to.be.true;
    });

    it('should move focus back to the input on Cancel button tap', async () => {
      // Move focus to the calendar
      await sendKeys({ press: 'ArrowDown' });
      await nextRender(datepicker);
      const spy = sinon.spy(input, 'focus');
      tap(overlayContent.$.cancelButton);
      expect(spy.calledOnce).to.be.true;
    });

    it('should move focus back to the input on Today button tap', async () => {
      // Move focus to the calendar
      await sendKeys({ press: 'ArrowDown' });
      await nextRender(datepicker);
      const spy = sinon.spy(input, 'focus');
      tap(overlayContent.$.todayButton);
      expect(spy.calledOnce).to.be.true;
    });

    it('should move focus back to the input on calendar date tap', async () => {
      // Move focus to the calendar
      await sendKeys({ press: 'Tab' });
      const cell = getFocusedCell(overlayContent);
      const spy = sinon.spy(input, 'focus');
      tap(cell);
      expect(spy.calledOnce).to.be.true;
    });

    it('should move focus back to the input on calendar date Shift Tab', async () => {
      // Move focus to the calendar
      await sendKeys({ press: 'Tab' });

      await nextRender();

      const spy = sinon.spy(input, 'focus');

      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

      expect(spy.calledOnce).to.be.true;
    });

    it('should move focus to the input on Cancel button Tab', async () => {
      overlayContent.$.cancelButton.focus();
      const spy = sinon.spy(input, 'focus');
      await sendKeys({ press: 'Tab' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should move focus to Cancel button on input Shift Tab', async () => {
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      expect(overlayContent.$.cancelButton.hasAttribute('focused')).to.be.true;
    });

    it('should reveal the focused date on Today button Shift Tab', async () => {
      const spy = sinon.spy(overlayContent, 'revealDate');
      overlayContent.$.todayButton.focus();

      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

      await aTimeout(1);
      expect(spy.called).to.be.true;
    });

    it('should clear selection on close', async () => {
      input.select();

      await close(datepicker);
      expect(input.selectionStart).to.equal(input.selectionEnd);
    });

    describe('focus date not in the viewport', () => {
      function onceFocused(callback) {
        return new Promise((resolve) => {
          // Do not spy on the DOM element because it can be reused
          // by infinite scroller. Instead, spy on the native focus.
          const stub = sinon.stub(HTMLTableCellElement.prototype, 'focus').callsFake(() => {
            stub.restore();
            resolve(stub.firstCall.thisValue);
          });

          callback();
        });
      }

      it('should focus date scrolled out of the view on input Tab', async () => {
        // Move focus to the calendar
        await sendKeys({ press: 'Tab' });
        await nextRender(datepicker);

        // Scroll to date outside viewport
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        overlayContent.revealDate(date, false);
        await nextRender();

        // Move focus to the input
        await sendKeys({ down: 'Shift' });
        await sendKeys({ press: 'Tab' });
        await sendKeys({ up: 'Shift' });

        // Move focus back to the date
        const cell = await onceFocused(() => {
          sendKeys({ press: 'Tab' });
        });

        expect(cell).to.be.instanceOf(HTMLTableCellElement);
        expect(cell.hasAttribute('today')).to.be.true;
      });

      it('should focus date scrolled out of the view on Today button Shift Tab', async () => {
        // Move focus to the calendar
        await sendKeys({ press: 'Tab' });
        await nextRender(datepicker);

        // Scroll to date outside viewport
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        overlayContent.revealDate(date, false);
        await nextRender();

        // Move focus to the Today button
        await sendKeys({ press: 'Tab' });

        // Move focus back to the date
        const cell = await onceFocused(async () => {
          await sendKeys({ down: 'Shift' });
          await sendKeys({ press: 'Tab' });
          await sendKeys({ up: 'Shift' });
        });

        expect(cell).to.be.instanceOf(HTMLTableCellElement);
        expect(cell.hasAttribute('today')).to.be.true;
      });
    });

    describe('fullscreen', () => {
      beforeEach(async () => {
        // Move focus to the calendar
        await sendKeys({ press: 'Tab' });
        await nextRender(datepicker);

        datepicker._fullscreen = true;
      });

      it('should move focus to Cancel button on date cell Shift Tab', async () => {
        const spy = sinon.spy(overlayContent.$.cancelButton, 'focus');

        await sendKeys({ down: 'Shift' });
        await sendKeys({ press: 'Tab' });
        await sendKeys({ up: 'Shift' });

        expect(spy.calledOnce).to.be.true;
      });

      it('should move focus to date cell button on Cancel button Tab', async () => {
        const cell = getFocusedCell(overlayContent);
        const spy = sinon.spy(cell, 'focus');

        await sendKeys({ down: 'Shift' });
        await sendKeys({ press: 'Tab' });
        await sendKeys({ up: 'Shift' });

        await sendKeys({ press: 'Tab' });

        expect(spy.calledOnce).to.be.true;
      });
    });
  });

  describe('Escape key', () => {
    describe('empty', () => {
      beforeEach(async () => {
        // Open the overlay
        await open(datepicker);
        await nextRender(datepicker);
      });

      it('should close the overlay when input is focused', async () => {
        await sendKeys({ press: 'Escape' });
        expect(datepicker.opened).to.be.false;
      });

      it('should close the overlay when calendar has focus', async () => {
        // Move focus to the calendar
        await sendKeys({ press: 'ArrowDown' });
        await nextRender(datepicker);

        await sendKeys({ press: 'Escape' });
        expect(datepicker.opened).to.be.false;
      });

      it('should move focus from the calendar back to input', async () => {
        // Move focus to the calendar
        await sendKeys({ press: 'ArrowDown' });
        await nextRender(datepicker);
        expect(document.activeElement).to.not.equal(input);

        await sendKeys({ press: 'Escape' });
        expect(document.activeElement).to.equal(input);
      });

      it('should revert input value on input Esc when empty', async () => {
        await sendKeys({ type: '1/2/2000' });
        await nextRender(datepicker);

        await sendKeys({ press: 'Escape' });
        expect(input.value).to.equal('');
      });

      it('should not change value on input Esc when empty', async () => {
        await sendKeys({ type: '1/2/2000' });
        await nextRender(datepicker);

        await sendKeys({ press: 'Escape' });
        expect(datepicker.value).to.equal('');
      });

      it('should revert input value on calendar Esc when empty', async () => {
        await sendKeys({ type: '1/2/2000' });

        // Move focus to the calendar
        await sendKeys({ press: 'ArrowDown' });
        await nextRender(datepicker);

        await sendKeys({ press: 'Escape' });

        expect(input.value).to.equal('');
      });

      it('should not change value on calendar Esc when empty', async () => {
        await sendKeys({ type: '1/2/2000' });

        // Move focus to the calendar
        await sendKeys({ press: 'ArrowDown' });
        await nextRender(datepicker);

        await sendKeys({ press: 'Escape' });

        expect(datepicker.value).to.equal('');
      });
    });

    describe('with value', () => {
      beforeEach(async () => {
        datepicker.value = '2000-01-01';
        await open(datepicker);
        await nextRender(datepicker);
        input.select();
      });

      it('should revert input value on input Esc when value is set', async () => {
        // Replace input with a new one
        await sendKeys({ type: '1/2/2000' });
        await sendKeys({ press: 'Escape' });
        expect(input.value).to.equal('1/1/2000');
      });

      it('should not change value on input Esc when value is set', async () => {
        // Replace input with a new one
        await sendKeys({ type: '1/2/2000' });

        await sendKeys({ press: 'Escape' });
        expect(datepicker.value).to.equal('2000-01-01');
      });

      it('should revert input value on calendar Esc when value is set', async () => {
        // Replace input with a new one
        await sendKeys({ type: '1/2/2000' });

        // Move focus to the calendar
        await sendKeys({ press: 'ArrowDown' });
        await nextRender(datepicker);

        await sendKeys({ press: 'Escape' });
        expect(input.value).to.equal('1/1/2000');
      });

      it('should not change value on calendar Esc when value is set', async () => {
        // Replace input with a new one
        await sendKeys({ type: '1/2/2000' });

        // Move focus to the calendar
        await sendKeys({ press: 'ArrowDown' });
        await nextRender(datepicker);

        await sendKeys({ press: 'Escape' });
        expect(datepicker.value).to.equal('2000-01-01');
      });
    });
  });

  describe('default parser', () => {
    const today = new Date();

    it('should parse a single digit', async () => {
      await sendKeys({ type: '20' });
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(today.getFullYear());
      expect(result.getMonth()).to.equal(today.getMonth());
      expect(result.getDate()).to.equal(20);
    });

    it('should parse two digits', async () => {
      await sendKeys({ type: '6/20' });
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(today.getFullYear());
      expect(result.getMonth()).to.equal(5);
      expect(result.getDate()).to.equal(20);
    });

    it('should parse three digits', async () => {
      await sendKeys({ type: '6/20/1999' });
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(1999);
      expect(result.getMonth()).to.equal(5);
      expect(result.getDate()).to.equal(20);
    });

    it('should parse three digits with small year', async () => {
      await sendKeys({ type: '6/20/0099' });
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(99);
    });

    it('should parse three digits with short year', async () => {
      await sendKeys({ type: '6/20/99' });
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(1999);
    });

    it('should parse three digits with short year 2', async () => {
      await sendKeys({ type: '6/20/20' });
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(2020);
    });

    it('should parse three digits with short year 3', async () => {
      await sendKeys({ type: '6/20/1' });
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(2001);
    });

    it('should parse three digits with negative year', async () => {
      await sendKeys({ type: '6/20/-1' });
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(-1);
    });

    it('should parse in base 10', async () => {
      await sendKeys({ type: '09/09/09' });
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(2009);
      expect(result.getMonth()).to.equal(8);
      expect(result.getDate()).to.equal(9);
    });
  });

  describe('change event', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy();
      datepicker.addEventListener('change', spy);
    });

    it('should not fire change on focused date change', async () => {
      await sendKeys({ type: '1/2/2000' });
      expect(spy.called).to.be.false;
    });

    it('should fire change on user text input commit', async () => {
      await sendKeys({ type: '1/2/2000' });
      await sendKeys({ press: 'Enter' });
      expect(spy.called).to.be.true;
    });

    it('should fire change after value-changed event', async () => {
      const valueChangedSpy = sinon.spy();
      datepicker.addEventListener('value-changed', valueChangedSpy);

      await sendKeys({ type: '1/2/2000' });
      await sendKeys({ press: 'Enter' });

      expect(valueChangedSpy.calledOnce).to.be.true;
      expect(spy.calledAfter(valueChangedSpy)).to.be.true;
    });

    it('should fire change on selecting date with Enter', async () => {
      // Open the overlay
      await open(datepicker);
      await nextRender(datepicker);

      // Move focus to the calendar
      await sendKeys({ press: 'ArrowDown' });
      await nextRender(datepicker);

      await sendKeys({ press: 'Enter' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change on selecting date with Space', async () => {
      // Open the overlay
      await open(datepicker);
      await nextRender(datepicker);

      // Move focus to the calendar
      await sendKeys({ press: 'ArrowDown' });
      await nextRender(datepicker);

      await sendKeys({ press: 'Space' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change clear button click', () => {
      datepicker.clearButtonVisible = true;
      datepicker.value = '2000-01-01';
      datepicker.$.clearButton.click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should not fire change on programmatic value change', () => {
      datepicker.value = '2000-01-01';
      expect(spy.called).to.be.false;
    });

    it('should not fire change on programmatic value change when opened', async () => {
      await open(datepicker);
      datepicker.value = '2000-01-01';
      await close(datepicker);
      expect(spy.called).to.be.false;
    });

    it('should not fire change on programmatic value change when text input changed', async () => {
      await sendKeys({ type: '1/2/2000' });
      datepicker.value = '2000-01-01';
      await close(datepicker);
      expect(spy.called).to.be.false;
    });

    it('should not fire change if the value was not changed', async () => {
      datepicker.value = '2000-01-01';
      await open(datepicker);
      await sendKeys({ press: 'Enter' });
      expect(spy.called).to.be.false;
    });

    it('should not fire change when reverting input with Escape', async () => {
      await sendKeys({ type: '1/2/2000' });
      await sendKeys({ press: 'Escape' });
      expect(spy.called).to.be.false;
    });
  });

  describe('auto open disabled', () => {
    beforeEach(() => {
      datepicker.autoOpenDisabled = true;
    });

    it('should not open overlay on input', async () => {
      await sendKeys({ type: 'j' });
      expect(datepicker.opened).not.to.be.true;
    });

    it('should set datepicker value on blur', async () => {
      await sendKeys({ type: '1/1/2000' });
      await sendKeys({ press: 'Tab' });
      expect(datepicker.value).to.equal('2000-01-01');
    });

    it('should not be invalid on blur if valid date is entered', async () => {
      await sendKeys({ type: '1/1/2000' });
      await sendKeys({ press: 'Tab' });
      expect(datepicker.invalid).not.to.be.true;
    });

    it('should validate on blur only once', async () => {
      await sendKeys({ type: 'foo' });
      const spy = sinon.spy(datepicker, 'validate');
      await sendKeys({ press: 'Tab' });
      expect(spy.callCount).to.equal(1);
      expect(datepicker.invalid).to.be.true;
    });

    it('should revert input value on Esc when overlay not initialized', async () => {
      await sendKeys({ type: '1/1/2000' });
      await sendKeys({ press: 'Escape' });
      expect(input.value).to.equal('');
      expect(datepicker.value).to.equal('');
    });

    it('should revert input value on Esc when overlay has been initialized', async () => {
      await open(datepicker);
      await close(datepicker);
      await sendKeys({ type: '1/1/2000' });
      await sendKeys({ press: 'Escape' });
      expect(datepicker.value).to.equal('');
    });

    it('should not revert input value on esc after selected value is removed', async () => {
      await open(datepicker);
      await sendKeys({ type: '1/1/2000' });
      await close(datepicker);
      input.value = '';
      await sendKeys({ press: 'Escape' });
      expect(datepicker.value).to.equal('');
    });

    it('should apply the input value on enter when overlay not initialized', async () => {
      await sendKeys({ type: '1/1/2000' });
      await sendKeys({ press: 'Enter' });
      expect(datepicker.value).to.equal('2000-01-01');
    });

    it('should apply input value on enter when overlay has been initialized', async () => {
      await open(datepicker);
      await close(datepicker);
      await sendKeys({ type: '1/1/2000' });
      await sendKeys({ press: 'Enter' });
      expect(datepicker.value).to.equal('2000-01-01');
    });

    it('should be invalid on enter with false input', async () => {
      await sendKeys({ type: 'foo' });
      await sendKeys({ press: 'Enter' });
      expect(datepicker.value).to.equal('');
      expect(datepicker.invalid).to.be.true;
    });
  });

  describe('change and validate sequence', () => {
    let validateSpy;
    let changeSpy;

    beforeEach(() => {
      validateSpy = sinon.spy(datepicker, 'validate');
      changeSpy = sinon.spy();
      datepicker.addEventListener('change', changeSpy);
    });

    describe('overlay is open and value selected', () => {
      beforeEach(async () => {
        await open(datepicker);
        await sendKeys({ type: '01/02/20' });
        await nextRender(datepicker);
      });

      it('should validate without change on Esc', async () => {
        await sendKeys({ press: 'Escape' });

        // Wait for overlay to finish closing
        await nextRender(datepicker);

        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.called).to.be.false;
      });

      it('should change after validate on overlay close', (done) => {
        listenOnce(datepicker.$.overlay, 'vaadin-overlay-close', () => {
          // Wait for overlay to finish closing
          nextRender(datepicker).then(() => {
            expect(validateSpy.calledOnce).to.be.true;
            expect(changeSpy.calledOnce).to.be.true;
            expect(changeSpy.calledAfter(validateSpy)).to.be.true;
            done();
          });
        });

        datepicker.close();
      });

      it('should change after validate on Enter', async () => {
        await sendKeys({ press: 'Enter' });

        // Wait for overlay to finish closing
        await nextRender(datepicker);

        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });
    });

    describe('overlay is closed, value is set', () => {
      beforeEach(async () => {
        await open(datepicker);
        await sendKeys({ type: '01/02/20' });
        await close(datepicker);
        validateSpy.resetHistory();
        changeSpy.resetHistory();
        // Wait for overlay to finish closing
        await nextRender(datepicker);
        datepicker._focus();
      });

      it('should change after validate on clear button click', () => {
        datepicker.clearButtonVisible = true;
        datepicker.$.clearButton.click();
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });

      it('should change after validate on Esc with clear button', async () => {
        datepicker.clearButtonVisible = true;
        await sendKeys({ press: 'Escape' });
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });

      it('should neither change nor validate on Esc without clear button', async () => {
        await sendKeys({ press: 'Escape' });
        expect(validateSpy.called).to.be.false;
        expect(changeSpy.called).to.be.false;
      });

      it('should change after validate on Backspace & Enter', async () => {
        input.select();
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Enter' });
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });

      it('should change after validate on Backspace & Esc', async () => {
        input.select();
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Escape' });
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });
    });

    describe('autoOpenDisabled true', () => {
      beforeEach(() => {
        datepicker.autoOpenDisabled = true;
      });

      it('should change after validate on Enter', async () => {
        await sendKeys({ type: '01/02/20' });
        await sendKeys({ press: 'Enter' });
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });

      it('should validate on Enter when value is the same', async () => {
        await sendKeys({ press: 'Enter' });
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.called).to.be.false;
      });

      it('should validate on Enter when invalid', async () => {
        await sendKeys({ type: 'foo' });
        await sendKeys({ press: 'Enter' });
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.called).to.be.false;
      });

      it('should validate on blur', async () => {
        await sendKeys({ press: 'Tab' });
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.called).to.be.false;
      });

      it('should neither change nor validate on Esc', async () => {
        await sendKeys({ type: '01/02/20' });
        await sendKeys({ press: 'Escape' });
        expect(validateSpy.called).to.be.false;
        expect(changeSpy.called).to.be.false;
      });

      describe('value is set', () => {
        beforeEach(async () => {
          await sendKeys({ type: '01/02/20' });
          await sendKeys({ press: 'Enter' });
          validateSpy.resetHistory();
          changeSpy.resetHistory();
          datepicker._focusAndSelect();
        });

        it('should change after validate on Esc with clear button', async () => {
          datepicker.clearButtonVisible = true;
          await sendKeys({ press: 'Escape' });
          expect(validateSpy.calledOnce).to.be.true;
          expect(changeSpy.calledOnce).to.be.true;
          expect(changeSpy.calledAfter(validateSpy)).to.be.true;
        });

        it('should neither change nor validate on Esc without clear button', async () => {
          await sendKeys({ press: 'Escape' });
          expect(validateSpy.called).to.be.false;
          expect(changeSpy.called).to.be.false;
        });

        it('should change after validate on Backspace & Enter', async () => {
          input.select();
          await sendKeys({ press: 'Backspace' });
          await sendKeys({ press: 'Enter' });
          expect(validateSpy.calledOnce).to.be.true;
          expect(changeSpy.calledOnce).to.be.true;
          expect(changeSpy.calledAfter(validateSpy)).to.be.true;
        });

        it('should change after validate on Backspace & Esc', async () => {
          input.select();
          await sendKeys({ press: 'Backspace' });
          await sendKeys({ press: 'Escape' });
          expect(validateSpy.calledOnce).to.be.true;
          expect(changeSpy.calledOnce).to.be.true;
          expect(changeSpy.calledAfter(validateSpy)).to.be.true;
        });

        it('should change after validate on Backspace & blur', async () => {
          input.select();
          await sendKeys({ press: 'Backspace' });
          await sendKeys({ press: 'Tab' });
          expect(validateSpy.calledOnce).to.be.true;
          expect(changeSpy.calledOnce).to.be.true;
          expect(changeSpy.calledAfter(validateSpy)).to.be.true;
        });
      });
    });
  });
});
