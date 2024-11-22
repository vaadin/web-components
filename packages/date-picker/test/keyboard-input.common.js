import { expect } from '@vaadin/chai-plugins';
import { aTimeout, enter, fixtureSync, nextRender, tap } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { getAdjustedYear, parseDate } from '../src/vaadin-date-picker-helper.js';
import { close, getFocusedCell, idleCallback, open, waitForOverlayRender, waitForScrollToFinish } from './helpers.js';

describe('keyboard', () => {
  let datePicker;
  let input;

  function focusedDate() {
    return datePicker._overlayContent.focusedDate;
  }

  beforeEach(async () => {
    datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
    await nextRender();
    input = datePicker.inputElement;
    input.focus();
  });

  describe('focused date', () => {
    it('should focus parsed date', async () => {
      await sendKeys({ type: '1/20/2000' });
      await waitForOverlayRender();

      expect(focusedDate().getMonth()).to.equal(0);
      expect(focusedDate().getDate()).to.equal(20);
    });

    it('should change focused date on user input', async () => {
      datePicker.value = '2000-01-01';

      input.select();
      await sendKeys({ type: '1/30/2000' });
      await waitForOverlayRender();
      expect(focusedDate().getDate()).to.equal(30);
    });

    it('should update focus on input value change', async () => {
      await sendKeys({ type: '1/20/20' });
      await sendKeys({ type: '17' });
      await waitForOverlayRender();

      expect(focusedDate().getMonth()).to.equal(0);
      expect(focusedDate().getFullYear()).to.equal(2017);
    });

    it('should select focused date on Enter', async () => {
      await sendKeys({ type: '1/1/2001' });
      await waitForOverlayRender();
      await sendKeys({ press: 'Enter' });
      expect(datePicker.value).to.equal('2001-01-01');
    });

    it('should update focused date on value change', async () => {
      datePicker.value = '2000-01-01';
      await open(datePicker);
      expect(focusedDate().getMonth()).to.equal(0);
      expect(focusedDate().getDate()).to.equal(1);
      expect(focusedDate().getFullYear()).to.equal(2000);
    });

    // FIXME: flaky test often failing locally due to scroll animation
    it.skip('should display focused date while overlay focused', async () => {
      await sendKeys({ type: '1/2/2000' });
      await waitForScrollToFinish(datePicker);

      // Move focus to the calendar
      await sendKeys({ press: 'Tab' });

      await nextRender(datePicker);

      await sendKeys({ press: 'ArrowDown' });
      expect(input.value).not.to.equal('1/2/2000');
    });

    it('should reflect focused date to input', async () => {
      datePicker.value = '2000-01-01';
      await open(datePicker);

      // Move focus to the calendar
      await sendKeys({ press: 'Tab' });

      await nextRender(datePicker);

      await sendKeys({ press: 'ArrowDown' });
      expect(input.value).to.equal('1/8/2000');
    });
  });

  describe('no parseDate', () => {
    beforeEach(() => {
      datePicker.i18n = {
        ...datePicker.i18n,
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
      await open(datePicker);
      await close(datePicker);
      expect(datePicker._selectedDate).to.equal(datePicker._focusedDate);
    });
  });

  describe('open overlay', () => {
    it('should open the overlay on input', async () => {
      await sendKeys({ type: 'j' });
      await waitForOverlayRender();
      expect(datePicker.opened).to.be.true;
    });

    it('should open the overlay on Arrow Down', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await waitForOverlayRender();
      expect(datePicker.opened).to.be.true;
    });

    it('should open the overlay on Arrow Up', async () => {
      await sendKeys({ press: 'ArrowUp' });
      await waitForOverlayRender();
      expect(datePicker.opened).to.be.true;
    });

    it('should open on Arrow Down if autoOpenDisabled is true', async () => {
      datePicker.autoOpenDisabled = true;
      await sendKeys({ press: 'ArrowDown' });
      await waitForOverlayRender();
      expect(datePicker.opened).to.be.true;
    });

    it('should open on Arrow Up if autoOpenDisabled is true', async () => {
      datePicker.autoOpenDisabled = true;
      await sendKeys({ press: 'ArrowUp' });
      await waitForOverlayRender();
      expect(datePicker.opened).to.be.true;
    });

    it('should not open the overlay on Arrow Right', async () => {
      await sendKeys({ press: 'ArrowRight' });
      expect(datePicker.opened).to.be.not.ok;
    });

    it('should not open the overlay on Arrow Left', async () => {
      await sendKeys({ press: 'ArrowLeft' });
      expect(datePicker.opened).to.be.not.ok;
    });

    it('should not open the overlay on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expect(datePicker.opened).to.be.not.ok;
    });

    it('should not throw on Enter before opening overlay', () => {
      expect(() => {
        datePicker.focus();
        enter(input);
      }).not.to.throw(Error);
    });
  });

  describe('overlay opened', () => {
    let overlayContent;

    beforeEach(async () => {
      // Open the overlay
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
      await idleCallback();
    });

    it('should keep focused attribute when the focus moves to the overlay', async () => {
      // Move focus to the calendar
      await sendKeys({ press: 'Tab' });
      await waitForOverlayRender();
      expect(datePicker.hasAttribute('focused')).to.be.true;
    });

    it('should move focus back to the input on Cancel button tap', async () => {
      // Move focus to the calendar
      await sendKeys({ press: 'ArrowDown' });
      await waitForOverlayRender();
      const spy = sinon.spy(input, 'focus');
      tap(overlayContent._cancelButton);
      expect(spy.calledOnce).to.be.true;
    });

    it('should move focus back to the input on Today button tap', async () => {
      // Move focus to the calendar
      await sendKeys({ press: 'ArrowDown' });
      await waitForOverlayRender();
      const spy = sinon.spy(input, 'focus');
      tap(overlayContent._todayButton);
      expect(spy.calledOnce).to.be.true;
    });

    it('should move focus back to the input on calendar date tap', async () => {
      // Move focus to the calendar
      await sendKeys({ press: 'Tab' });
      await waitForOverlayRender();
      const cell = getFocusedCell(datePicker);
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
      overlayContent.focusCancel();
      const spy = sinon.spy(input, 'focus');
      await sendKeys({ press: 'Tab' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should move focus to Cancel button on input Shift Tab', async () => {
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      expect(overlayContent._cancelButton.hasAttribute('focused')).to.be.true;
    });

    it('should reveal the focused date on Today button Shift Tab', async () => {
      const spy = sinon.spy(overlayContent, 'revealDate');
      overlayContent._todayButton.focus();

      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

      await aTimeout(1);
      expect(spy.called).to.be.true;
    });

    it('should clear selection on close', async () => {
      input.select();

      await close(datePicker);
      expect(input.selectionStart).to.equal(input.selectionEnd);
    });

    describe('focus date not in the viewport', () => {
      beforeEach(async () => {
        // Disable scrolling animation
        const stub = sinon.stub(overlayContent, 'revealDate').callsFake((date) => {
          stub.wrappedMethod.call(overlayContent, date, false);
        });

        // Scroll to date outside viewport
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        overlayContent.revealDate(date);
        await idleCallback();
      });

      it('should focus date scrolled out of the view on input Tab', async () => {
        // Move focus to the calendar
        await sendKeys({ press: 'Tab' });

        await waitForScrollToFinish(datePicker);

        const cell = getFocusedCell(datePicker);
        expect(cell).to.be.instanceOf(HTMLTableCellElement);
        expect(cell.getAttribute('part')).to.contain('today');
      });

      it('should focus date scrolled out of the view on Today button Shift Tab', async () => {
        // Move focus to the Today button
        overlayContent._todayButton.focus();

        // Move focus to the calendar
        await sendKeys({ down: 'Shift' });
        await sendKeys({ press: 'Tab' });
        await sendKeys({ up: 'Shift' });

        await waitForScrollToFinish(datePicker);

        const cell = getFocusedCell(datePicker);
        expect(cell).to.be.instanceOf(HTMLTableCellElement);
        expect(cell.getAttribute('part')).to.contain('today');
      });
    });
  });

  describe('Escape key', () => {
    describe('empty', () => {
      beforeEach(async () => {
        // Open the overlay
        await open(datePicker);
      });

      it('should close the overlay when input is focused', async () => {
        await sendKeys({ press: 'Escape' });
        expect(datePicker.opened).to.be.false;
      });

      it('should close the overlay when calendar has focus', async () => {
        // Move focus to the calendar
        await sendKeys({ press: 'ArrowDown' });
        await nextRender(datePicker);

        await sendKeys({ press: 'Escape' });
        expect(datePicker.opened).to.be.false;
      });

      it('should move focus from the calendar back to input', async () => {
        // Move focus to the calendar
        await sendKeys({ press: 'ArrowDown' });
        await nextRender(datePicker);
        expect(document.activeElement).to.not.equal(input);

        await sendKeys({ press: 'Escape' });
        expect(document.activeElement).to.equal(input);
      });
    });
  });

  describe('default parser', () => {
    const today = new Date();

    async function checkMonthAndDayOffset(monthOffsetToAdd, dayOffsetToAdd, expectedYearOffset) {
      input.value = '';
      const referenceDate = parseDate(datePicker.i18n.referenceDate);
      const yearToTest = referenceDate.getFullYear() + 50;
      await sendKeys({
        type: `${referenceDate.getMonth() + 1 + monthOffsetToAdd}/${referenceDate.getDate() + dayOffsetToAdd}/${
          yearToTest % 100
        }`,
      });
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(yearToTest + expectedYearOffset);
    }

    async function checkYearOffset(offsetToAdd, expectedOffset) {
      input.value = '';
      const referenceDateYear = datePicker.i18n.referenceDate
        ? new Date(datePicker.i18n.referenceDate).getFullYear()
        : today.getFullYear();
      const yearToTest = referenceDateYear + offsetToAdd;
      await sendKeys({ type: `6/20/${String(yearToTest).slice(2, 4)}` });
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(yearToTest + expectedOffset);
    }

    async function checkYearOffsets() {
      await checkYearOffset(0, 0);
      await checkYearOffset(-49, 0);
      await checkYearOffset(49, 0);
      await checkYearOffset(-51, 100);
      await checkYearOffset(51, -100);
    }

    it('should parse a single digit', async () => {
      await sendKeys({ type: '20' });
      await waitForOverlayRender();
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(today.getFullYear());
      expect(result.getMonth()).to.equal(today.getMonth());
      expect(result.getDate()).to.equal(20);
    });

    it('should parse two digits', async () => {
      await sendKeys({ type: '6/20' });
      await waitForOverlayRender();
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(today.getFullYear());
      expect(result.getMonth()).to.equal(5);
      expect(result.getDate()).to.equal(20);
    });

    it('should parse three digits', async () => {
      await sendKeys({ type: '6/20/1999' });
      await waitForOverlayRender();
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(1999);
      expect(result.getMonth()).to.equal(5);
      expect(result.getDate()).to.equal(20);
    });

    it('should parse three digits with small year', async () => {
      await sendKeys({ type: '6/20/0099' });
      await waitForOverlayRender();
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(99);
    });

    it('should parse three digits with negative year', async () => {
      await sendKeys({ type: '6/20/-1' });
      await waitForOverlayRender();
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(-1);
    });

    it('should parse in base 10', async () => {
      datePicker.i18n = {
        ...datePicker.i18n,
        referenceDate: '2022-01-01',
      };
      await sendKeys({ type: '09/09/09' });
      await waitForOverlayRender();
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(2009);
      expect(result.getMonth()).to.equal(8);
      expect(result.getDate()).to.equal(9);
    });

    it('should throw when passing a year < 0', () => {
      expect(() => getAdjustedYear(today, -1, 1, 1)).to.throw(Error);
    });

    it('should throw when passing a year >= 100', () => {
      expect(() => getAdjustedYear(today, 100, 1, 1)).to.throw(Error);
    });

    it('should parse with default day value when day is not provided', () => {
      expect(getAdjustedYear(new Date(1919, 11, 31), 70, 0)).to.equal(1870);
      expect(getAdjustedYear(new Date(1920, 0, 1), 70, 0)).to.equal(1970);
      expect(getAdjustedYear(new Date(1920, 0, 2), 70, 0)).to.equal(1970);
    });

    it('should parse with default month and day values when only year is provided', () => {
      expect(getAdjustedYear(new Date(1919, 11, 31), 70)).to.equal(1870);
      expect(getAdjustedYear(new Date(1920, 0, 1), 70)).to.equal(1970);
      expect(getAdjustedYear(new Date(1920, 0, 2), 70)).to.equal(1970);
    });

    it('should parse short year with current date as reference date', async () => {
      await checkYearOffsets();
    });

    it('should parse short year with a custom reference date later in century', async () => {
      datePicker.i18n = {
        ...datePicker.i18n,
        referenceDate: '1999-01-01',
      };
      await checkYearOffsets();
    });

    it('should parse short year with a custom reference date earlier in century', async () => {
      datePicker.i18n = {
        ...datePicker.i18n,
        referenceDate: '2001-01-01',
      };
      await checkYearOffsets();
    });

    it('should parse short year with a custom reference date and ambiguous year difference', async () => {
      datePicker.i18n = {
        ...datePicker.i18n,
        referenceDate: '2001-03-15',
      };
      await checkMonthAndDayOffset(0, 0, 0);
      await checkMonthAndDayOffset(0, -1, 0);
      await checkMonthAndDayOffset(0, 1, -100);
      await checkMonthAndDayOffset(-1, 0, 0);
      await checkMonthAndDayOffset(1, 0, -100);
    });
  });

  describe('auto open disabled', () => {
    beforeEach(() => {
      datePicker.autoOpenDisabled = true;
    });

    it('should not open overlay on input', async () => {
      await sendKeys({ type: 'j' });
      expect(datePicker.opened).not.to.be.true;
    });

    it('should focus parsed date when opening overlay', async () => {
      await sendKeys({ type: '1/20/2000' });
      await open(datePicker);
      await waitForOverlayRender();

      expect(focusedDate().getMonth()).to.equal(0);
      expect(focusedDate().getDate()).to.equal(20);
    });
  });
});
