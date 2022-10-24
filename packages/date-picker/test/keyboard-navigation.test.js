import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-date-picker.js';
import {
  getDefaultI18n,
  getFocusedCell,
  idleCallback,
  open,
  waitForOverlayRender,
  waitForScrollToFinish,
} from './common.js';

describe('keyboard navigation', () => {
  describe('date-picker', () => {
    let datepicker;
    let input;

    describe('default', () => {
      beforeEach(() => {
        datepicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
        input = datepicker.inputElement;
        input.focus();
      });

      it('should be focused on today if no value / initial position is set', async () => {
        const today = new Date();
        await open(datepicker);

        // Move focus to the calendar
        await sendKeys({ press: 'Tab' });

        const cell = getFocusedCell(datepicker._overlayContent);
        expect(cell.date).to.eql(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
      });

      it('should be focused on today when focused date is empty', async () => {
        const today = new Date();

        input.click();
        await waitForOverlayRender();

        // Reset overlay focused date
        input.click();

        // Move focus to the calendar
        await sendKeys({ press: 'Tab' });

        const cell = getFocusedCell(datepicker._overlayContent);
        expect(cell.date).to.eql(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
      });
    });

    describe('value', () => {
      beforeEach(() => {
        datepicker = fixtureSync('<vaadin-date-picker value="2001-01-01"></vaadin-date-picker>');
        input = datepicker.inputElement;
        input.focus();
      });

      it('should be focused on selected value when overlay is opened', async () => {
        await open(datepicker);

        // Move focus to the calendar
        await sendKeys({ press: 'Tab' });

        const cell = getFocusedCell(datepicker._overlayContent);
        expect(cell.date).to.eql(new Date(2001, 0, 1));
      });

      it('should not lose focused date after deselecting', async () => {
        await open(datepicker);

        const content = datepicker._overlayContent;
        const focused = content.focusedDate;

        // Move focus to the calendar
        await sendKeys({ press: 'Tab' });

        // De-select the selected date
        await sendKeys({ press: 'Space' });
        await sendKeys({ press: 'Space' });

        expect(content.focusedDate.getTime()).to.equal(focused.getTime());
      });
    });

    describe('initial position', () => {
      beforeEach(() => {
        datepicker = fixtureSync('<vaadin-date-picker initial-position="2001-01-01"></vaadin-date-picker>');
        input = datepicker.inputElement;
        input.focus();
      });

      it('should be focused on initial position when opened', async () => {
        await open(datepicker);

        // Move focus to the calendar
        await sendKeys({ press: 'Tab' });

        const cell = getFocusedCell(datepicker._overlayContent);
        expect(cell.date).to.eql(new Date(2001, 0, 1));
      });

      it('should be focused on initial position when focused date is empty', async () => {
        input.click();
        await waitForOverlayRender();

        // Reset overlay focused date
        input.click();

        // Move focus to the calendar
        await sendKeys({ press: 'Tab' });

        const cell = getFocusedCell(datepicker._overlayContent);
        expect(cell.date).to.eql(new Date(2001, 0, 1));
      });
    });
  });

  describe('overlay', () => {
    let overlay;

    beforeEach(async () => {
      overlay = fixtureSync(`
        <vaadin-date-picker-overlay-content
          style="position: absolute; top: 0; width: 400px"
          scroll-duration="0"
        ></vaadin-date-picker-overlay-content>
      `);
      overlay.i18n = getDefaultI18n();

      // Set initialPosition to activate scrollers
      const initialDate = new Date(2000, 0, 1);
      overlay.initialPosition = initialDate;

      await waitForOverlayRender();
      await overlay.focusDate(initialDate);
      await idleCallback();
    });

    it('should focus one week forward with arrow down', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(2000, 0, 8));
    });

    it('should focus one week backward with arrow up', async () => {
      await sendKeys({ press: 'ArrowUp' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 11, 25));
    });

    ['ltr', 'rtl'].forEach((direction) => {
      describe(`dir="${direction}"`, () => {
        const isRTL = direction === 'rtl';

        before(() => {
          document.documentElement.setAttribute('dir', direction);
        });

        after(() => {
          if (isRTL) {
            document.documentElement.setAttribute('dir', 'ltr');
          }
        });

        it(`should focus one day ${isRTL ? 'backward' : 'forward'} with arrow 'right'`, async () => {
          await sendKeys({ press: 'ArrowRight' });
          await waitForScrollToFinish(overlay);
          const cell = getFocusedCell(overlay);
          expect(cell.date).to.eql(isRTL ? new Date(1999, 11, 31) : new Date(2000, 0, 2));
        });

        it(`should focus one day ${isRTL ? 'forward' : 'backward'} with arrow left`, async () => {
          await sendKeys({ press: 'ArrowLeft' });
          await waitForScrollToFinish(overlay);
          const cell = getFocusedCell(overlay);
          expect(cell.date).to.eql(isRTL ? new Date(2000, 0, 2) : new Date(1999, 11, 31));
        });
      });
    });

    it('should close overlay with enter', async () => {
      const spy = sinon.spy(overlay, '_close');
      await sendKeys({ press: 'Enter' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should scroll to focused month', async () => {
      const spy = sinon.spy();
      overlay.addEventListener('scroll-animation-finished', spy);

      await sendKeys({ press: 'ArrowUp' });

      await waitForScrollToFinish(overlay);
      const e = spy.firstCall.args[0];
      expect(e.detail.position).to.be.closeTo(e.detail.oldPosition - 1, 1);
    });

    it('should select a date with space', async () => {
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'Space' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(2000, 0, 2));
    });

    it('should deselect selected date with space', async () => {
      await sendKeys({ press: 'Space' });
      expect(overlay.selectedDate).to.be.empty;
    });

    it('should focus first day of the month with home', async () => {
      await sendKeys({ press: 'ArrowLeft' });
      await sendKeys({ press: 'Home' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 11, 1));
    });

    it('should focus last day of the month with end', async () => {
      await sendKeys({ press: 'End' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(2000, 0, 31));
    });

    it('should focus next month with pagedown', async () => {
      await sendKeys({ press: 'PageDown' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(2000, 1, 1));
    });

    it('should focus previous month with pageup', async () => {
      await sendKeys({ press: 'PageUp' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 11, 1));
    });

    it('should not skip a month', async () => {
      await overlay.focusDate(new Date(2000, 0, 31));
      await waitForScrollToFinish(overlay);
      await sendKeys({ press: 'PageDown' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(2000, 1, 29));
    });

    it('should focus the previously focused date number if available', async () => {
      await overlay.focusDate(new Date(2000, 0, 31));
      await waitForScrollToFinish(overlay);
      await sendKeys({ press: 'PageDown' });
      await sendKeys({ press: 'PageDown' });
      await waitForScrollToFinish(overlay);
      expect(overlay.focusedDate).to.eql(new Date(2000, 2, 31));
    });

    it('should focus next year with shift and pagedown', async () => {
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'PageDown' });
      await sendKeys({ up: 'Shift' });
      await waitForScrollToFinish(overlay);
      expect(overlay.focusedDate).to.eql(new Date(2001, 0, 1));
    });

    it('should focus previous year with shift and pageup', async () => {
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'PageUp' });
      await sendKeys({ up: 'Shift' });
      await waitForScrollToFinish(overlay);
      expect(overlay.focusedDate).to.eql(new Date(1999, 0, 1));
    });

    it('should scroll up when focus goes invisible', async () => {
      const spy = sinon.spy();
      overlay.addEventListener('scroll-animation-finished', spy);

      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'PageUp' });
      await sendKeys({ up: 'Shift' });

      await waitForScrollToFinish(overlay);
      const e = spy.firstCall.args[0];
      expect(e.detail.position).to.be.closeTo(e.detail.oldPosition - 12, 1);
    });

    it('should not scroll down when focus keeps visible', async () => {
      const initialPosition = overlay._monthScroller.position;
      await sendKeys({ press: 'PageDown' });
      await aTimeout();
      // FF sometimes reports subpixel differences
      expect(overlay._monthScroller.position).to.be.closeTo(initialPosition, 1);
    });

    it('should scroll down when focus goes invisible', async () => {
      const spy = sinon.spy();
      overlay.addEventListener('scroll-animation-finished', spy);

      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'PageDown' });
      await sendKeys({ up: 'Shift' });

      await waitForScrollToFinish(overlay);
      const e = spy.firstCall.args[0];
      expect(e.detail.position).to.be.greaterThan(e.detail.oldPosition);
    });

    it('should not focus on today click if no date focused', () => {
      overlay.focusedDate = null;
      overlay._scrollToCurrentMonth();
      expect(overlay.focusedDate).to.be.null;
    });

    it('should focus on today click if a date is focused', async () => {
      await sendKeys({ down: 'ArrowRight' });
      overlay._scrollToCurrentMonth();
      expect(overlay.focusedDate.getFullYear()).to.eql(new Date().getFullYear());
      expect(overlay.focusedDate.getMonth()).to.eql(new Date().getMonth());
      expect(overlay.focusedDate.getDate()).to.eql(new Date().getDate());
    });

    it('should move to max date when targeted date is disabled', async () => {
      overlay.maxDate = new Date(2000, 0, 7);
      await sendKeys({ down: 'ArrowDown' });
      await waitForScrollToFinish(overlay);
      expect(overlay.focusedDate).to.eql(new Date(2000, 0, 7));
    });

    it('should move to min date when targeted date is disabled', async () => {
      overlay.minDate = new Date(1999, 11, 26);
      await sendKeys({ down: 'ArrowUp' });
      await waitForScrollToFinish(overlay);
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 26));
    });

    it('should focus min date with home', async () => {
      overlay.minDate = new Date(1999, 11, 3);
      await sendKeys({ down: 'ArrowLeft' });
      await sendKeys({ down: 'Home' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 11, 3));
    });

    it('should focus max date with end', async () => {
      overlay.maxDate = new Date(2000, 0, 26);
      await sendKeys({ down: 'End' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(2000, 0, 26));
    });

    it('should focus max date with pagedown', async () => {
      overlay.maxDate = new Date(2000, 0, 28);
      await sendKeys({ press: 'PageDown' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(2000, 0, 28));
    });

    it('should focus min date with pageup', async () => {
      overlay.minDate = new Date(1999, 11, 3);
      await sendKeys({ press: 'PageUp' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 11, 3));
    });

    it('should focus max date with shift and pagedown', async () => {
      overlay.maxDate = new Date(2000, 11, 28);

      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'PageDown' });
      await sendKeys({ up: 'Shift' });

      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(2000, 11, 28));
    });

    it('should focus min date with shift and pageup', async () => {
      overlay.minDate = new Date(1999, 5, 3);

      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'PageUp' });
      await sendKeys({ up: 'Shift' });

      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 5, 3));
    });

    it('should focus the closest allowed date with pageup when selected date is disabled', async () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      await nextRender(overlay);
      await sendKeys({ press: 'PageUp' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with pagedown when selected date is disabled', async () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      await nextRender(overlay);
      await sendKeys({ press: 'PageDown' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with shift pageup when selected date is disabled', async () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      await nextRender(overlay);

      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'PageUp' });
      await sendKeys({ up: 'Shift' });

      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with shift pagedown when selected date is disabled', async () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.maxDate = new Date(1999, 11, 25);
      await nextRender(overlay);

      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'PageDown' });
      await sendKeys({ up: 'Shift' });

      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with home when selected date is disabled', async () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      await sendKeys({ press: 'Home' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with end when selected date is disabled', async () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      await sendKeys({ press: 'End' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with arrow up when selected date is disabled', async () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      await nextRender(overlay);
      await sendKeys({ press: 'ArrowUp' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with arrow down when selected date is disabled', async () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      await nextRender(overlay);
      await sendKeys({ press: 'ArrowDown' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with arrow left when selected date is disabled', async () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      await nextRender(overlay);
      await sendKeys({ press: 'ArrowLeft' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with arrow right when selected date is disabled', async () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      await nextRender(overlay);
      await sendKeys({ press: 'ArrowRight' });
      await waitForScrollToFinish(overlay);
      const cell = getFocusedCell(overlay);
      expect(cell.date).to.eql(new Date(1999, 11, 25));
    });

    it('should focus two-digit years while navigating days', async () => {
      const date = new Date(99, 0, 1);
      date.setFullYear(99);
      overlay.focusedDate = date;
      await waitForScrollToFinish(overlay);
      await sendKeys({ press: 'ArrowRight' });
      date.setDate(2);
      expect(overlay.focusedDate).to.eql(date);
    });

    it('should focus two-digit years while navigating months', async () => {
      const date = new Date(99, 0, 1);
      date.setFullYear(99);
      overlay.focusedDate = date;
      await waitForScrollToFinish(overlay);
      await sendKeys({ press: 'PageDown' });
      date.setMonth(1);
      expect(overlay.focusedDate).to.eql(date);
    });

    it('should focus two-digit years while navigating in month', async () => {
      const date = new Date(99, 0, 1);
      date.setFullYear(99);
      overlay.focusedDate = date;
      await waitForScrollToFinish(overlay);
      await sendKeys({ press: 'End' });
      date.setDate(31);
      expect(overlay.focusedDate).to.eql(date);
    });

    it('should only reveal date once when navigating days', async () => {
      const spy = sinon.spy(overlay, 'revealDate');
      await sendKeys({ press: 'ArrowDown' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should reveal date when focusing date element', async () => {
      const spy = sinon.spy(overlay, 'revealDate');
      await overlay.focusDateElement();
      expect(spy.calledOnce).to.be.true;
    });
  });
});
