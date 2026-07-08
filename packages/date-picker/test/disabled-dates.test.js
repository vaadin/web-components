import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate, tap } from '@vaadin/testing-helpers';
import '../src/vaadin-date-picker.js';
import { formatISODate } from '../src/vaadin-date-picker-helper.js';
import { getFocusedCell, open, untilOverlayScrolled } from './helpers.js';

describe('disabled dates', () => {
  let datePicker;

  function getMonthCalendars() {
    return [...datePicker._overlayContent.querySelectorAll('vaadin-month-calendar')];
  }

  function getDateCells() {
    return getMonthCalendars().flatMap((calendar) => [
      ...calendar.shadowRoot.querySelectorAll('[part~="date"]:not(:empty)'),
    ]);
  }

  function getDateCell(date) {
    return getDateCells().find((cell) => cell.date && formatISODate(cell.date) === formatISODate(date));
  }

  function isCellDisabled(cell) {
    return cell.hasAttribute('disabled') && cell.getAttribute('aria-disabled') === 'true';
  }

  describe('disabledDates', () => {
    beforeEach(async () => {
      datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
      datePicker.disabledDates = ['2026-07-15'];
      datePicker.initialPosition = '2026-07-01';
      await nextRender();
    });

    it('should default to an empty array', () => {
      const other = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
      expect(other.disabledDates).to.eql([]);
    });

    it('should render a listed date as disabled', async () => {
      await open(datePicker);
      const cell = getDateCell(new Date(2026, 6, 15));
      expect(isCellDisabled(cell)).to.be.true;
    });

    it('should render dates that are not listed as enabled', async () => {
      await open(datePicker);
      const cell = getDateCell(new Date(2026, 6, 16));
      expect(cell.hasAttribute('disabled')).to.be.false;
      expect(cell.getAttribute('aria-disabled')).to.equal('false');
    });

    it('should not select a listed date on tap', async () => {
      await open(datePicker);
      const cell = getDateCell(new Date(2026, 6, 15));
      tap(cell);
      expect(datePicker.value).to.equal('');
    });

    it('should update rendering when a new array is assigned', async () => {
      await open(datePicker);
      expect(isCellDisabled(getDateCell(new Date(2026, 6, 15)))).to.be.true;

      datePicker.disabledDates = ['2026-07-16'];
      await nextUpdate(datePicker._overlayContent);

      expect(getDateCell(new Date(2026, 6, 15)).hasAttribute('disabled')).to.be.false;
      expect(isCellDisabled(getDateCell(new Date(2026, 6, 16)))).to.be.true;
    });

    it('should ignore invalid entries without throwing', async () => {
      datePicker.disabledDates = ['not-a-date', '', '2026-07-15'];
      await open(datePicker);
      expect(isCellDisabled(getDateCell(new Date(2026, 6, 15)))).to.be.true;
    });

    it('should invalidate a selected listed date without opening the overlay', () => {
      datePicker.value = '2026-07-15';
      expect(datePicker.checkValidity()).to.be.false;
    });

    it('should keep a selected date that is not listed valid', () => {
      datePicker.value = '2026-07-16';
      expect(datePicker.checkValidity()).to.be.true;
    });
  });

  describe('disabledWeekdays', () => {
    beforeEach(async () => {
      datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
      datePicker.disabledWeekdays = [0, 6];
      datePicker.initialPosition = '2026-07-01';
      await nextRender();
    });

    it('should default to an empty array', () => {
      const other = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
      expect(other.disabledWeekdays).to.eql([]);
    });

    it('should disable all matching weekdays in the visible month', async () => {
      await open(datePicker);
      getDateCells()
        .filter((cell) => cell.date && cell.date.getMonth() === 6)
        .forEach((cell) => {
          const isWeekend = cell.date.getDay() === 0 || cell.date.getDay() === 6;
          expect(isCellDisabled(cell)).to.equal(isWeekend);
        });
    });

    it('should disable matching weekdays across scrolled months', async () => {
      await open(datePicker);
      datePicker._overlayContent.scrollToDate(new Date(2026, 8, 1));
      await untilOverlayScrolled(datePicker);

      const septemberCells = getDateCells().filter((cell) => cell.date && cell.date.getMonth() === 8);
      expect(septemberCells.length).to.be.above(0);
      septemberCells.forEach((cell) => {
        const isWeekend = cell.date.getDay() === 0 || cell.date.getDay() === 6;
        expect(isCellDisabled(cell)).to.equal(isWeekend);
      });
    });

    it('should render months with padding cells without throwing when set alone', async () => {
      // No min/max/isDateDisabled configured: exercises the null-cell and
      // aria-disabled guard paths in the calendar.
      await open(datePicker);
      expect(getDateCells().length).to.be.above(0);
    });

    it('should invalidate a selected matching weekday', () => {
      datePicker.value = '2026-07-04'; // Saturday
      expect(datePicker.checkValidity()).to.be.false;
    });
  });

  describe('combination', () => {
    beforeEach(async () => {
      datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
      datePicker.min = '2026-07-01';
      datePicker.max = '2026-07-31';
      datePicker.disabledDates = ['2026-07-15'];
      datePicker.disabledWeekdays = [0, 6];
      datePicker.isDateDisabled = (date) => date && date.day === 20;
      datePicker.initialPosition = '2026-07-01';
      await nextRender();
    });

    it('should disable a date matched by any single input', async () => {
      await open(datePicker);
      expect(isCellDisabled(getDateCell(new Date(2026, 6, 4)))).to.be.true; // weekday
      expect(isCellDisabled(getDateCell(new Date(2026, 6, 15)))).to.be.true; // listed date
      expect(isCellDisabled(getDateCell(new Date(2026, 6, 20)))).to.be.true; // isDateDisabled
    });

    it('should keep dates allowed by all inputs enabled', async () => {
      await open(datePicker);
      const cell = getDateCell(new Date(2026, 6, 16)); // Thursday, not listed, not disabled
      expect(cell.hasAttribute('disabled')).to.be.false;
    });

    it('should invalidate dates disabled by any input', () => {
      datePicker.value = '2026-07-04';
      expect(datePicker.checkValidity()).to.be.false;
      datePicker.value = '2026-07-15';
      expect(datePicker.checkValidity()).to.be.false;
      datePicker.value = '2026-07-20';
      expect(datePicker.checkValidity()).to.be.false;
    });
  });

  describe('keyboard', () => {
    let input;

    beforeEach(async () => {
      datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
      datePicker.disabledDates = ['2026-07-16'];
      await nextRender();
      input = datePicker.inputElement;
      input.focus();
      datePicker.value = '2026-07-15';
      await open(datePicker);
    });

    it('should allow focus to move onto an in-range disabled date', async () => {
      // Move focus into the calendar on the selected date.
      await sendKeys({ press: 'ArrowDown' });
      await untilOverlayScrolled(datePicker);

      // Move focus right to the disabled date.
      await sendKeys({ press: 'ArrowRight' });
      await untilOverlayScrolled(datePicker);

      const cell = getFocusedCell(datePicker);
      expect(cell.date).to.eql(new Date(2026, 6, 16));
    });

    it('should not commit a disabled date on Enter', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowRight' });
      await untilOverlayScrolled(datePicker);

      await sendKeys({ press: 'Enter' });

      expect(datePicker.opened).to.be.true;
      expect(datePicker.value).to.equal('2026-07-15');
    });

    it('should not commit a disabled date on Space', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowRight' });
      await untilOverlayScrolled(datePicker);

      await sendKeys({ press: 'Space' });

      expect(datePicker.value).to.equal('2026-07-15');
    });
  });

  describe('today button', () => {
    function buildTodayISO() {
      return formatISODate(new Date());
    }

    it('should disable the today button when today is listed', async () => {
      datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
      datePicker.disabledDates = [buildTodayISO()];
      await nextRender();
      await open(datePicker);
      expect(datePicker._overlayContent._todayButton.disabled).to.be.true;
    });

    it('should disable the today button when every weekday is disabled', async () => {
      datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
      datePicker.disabledWeekdays = [0, 1, 2, 3, 4, 5, 6];
      await nextRender();
      await open(datePicker);
      expect(datePicker._overlayContent._todayButton.disabled).to.be.true;
    });

    it('should keep the today button enabled when today is allowed', async () => {
      datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
      datePicker.disabledDates = ['2000-01-01'];
      await nextRender();
      await open(datePicker);
      expect(datePicker._overlayContent._todayButton.disabled).to.be.false;
    });
  });

  describe('initial position', () => {
    it('should scroll to an allowed date when the selected date is listed', async () => {
      datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
      datePicker.value = '2026-07-15';
      datePicker.disabledDates = ['2026-07-15'];
      await nextRender();
      await open(datePicker);
      // With the selected date disabled and no explicit initialPosition, the
      // overlay falls back to today (matching isDateDisabled behavior).
      expect(formatISODate(datePicker._overlayContent.initialPosition)).to.not.equal('2026-07-15');
    });

    it('should honor an explicit initialPosition even when it is disabled', async () => {
      datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
      datePicker.initialPosition = '2026-07-15';
      datePicker.disabledDates = ['2026-07-15'];
      await nextRender();
      await open(datePicker);
      expect(formatISODate(datePicker._overlayContent.initialPosition)).to.equal('2026-07-15');
    });
  });
});
