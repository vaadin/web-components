import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, makeSoloTouchEvent, nextRender, tap } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-month-calendar.js';
import { getDefaultI18n } from './helpers.js';

describe('vaadin-month-calendar', () => {
  let monthCalendar, valueChangedSpy;

  function getDateCells(calendar) {
    return [...calendar.shadowRoot.querySelectorAll('[part~="date"]:not(:empty)')];
  }

  function getWeekDayCells(calendar) {
    return [...calendar.shadowRoot.querySelectorAll('[part="weekday"]:not(:empty)')];
  }

  beforeEach(async () => {
    monthCalendar = fixtureSync('<vaadin-month-calendar></vaadin-month-calendar>');
    monthCalendar.i18n = getDefaultI18n();
    monthCalendar.month = new Date(2016, 1, 1);
    valueChangedSpy = sinon.spy();
    monthCalendar.addEventListener('selected-date-changed', valueChangedSpy);
    await nextRender();
  });

  // A helper for async test functions for 2016 month rendering.
  function createMonthTest(monthNumber) {
    const expectedDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    return (done) => {
      monthCalendar.month = new Date(2016, monthNumber, 1);
      setTimeout(() => {
        const numberOfDays = getDateCells(monthCalendar).length;
        expect(numberOfDays).to.equal(expectedDays[monthNumber]);
        done();
      });
    };
  }

  // Create 12 tests for each month of 2016.
  for (let i = 0; i < 12; i++) {
    it(`should render correct number of days for 2016/${i + 1}`, createMonthTest(i));
  }

  it('should render days in correct order by default', () => {
    const weekdays = getWeekDayCells(monthCalendar);
    const weekdayTitles = weekdays.map((weekday) => weekday.textContent.trim());
    expect(weekdayTitles).to.eql(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  });

  it('should render days in correct order by first day of week', async () => {
    monthCalendar.i18n = { ...monthCalendar.i18n, firstDayOfWeek: 1 }; // Start from Monday.
    await nextRender();
    const weekdays = getWeekDayCells(monthCalendar);
    const weekdayTitles = weekdays.map((weekday) => weekday.textContent.trim());
    expect(weekdayTitles).to.eql(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });

  it('should re-render after changing the month', async () => {
    monthCalendar.month = new Date(2000, 0, 1); // Feb 2016 -> Jan 2000
    await nextRender();
    const days = getDateCells(monthCalendar).length;
    expect(days).to.equal(31);
    expect(monthCalendar.shadowRoot.querySelector('[part="month-header"]').textContent).to.equal('January 2000');
  });

  it('should fire value change on tap', () => {
    const dateElements = getDateCells(monthCalendar);
    tap(dateElements[10]);
    expect(valueChangedSpy.calledOnce).to.be.true;
  });

  it('should fire date-tap on tap', () => {
    const tapSpy = sinon.spy();
    monthCalendar.addEventListener('date-tap', tapSpy);
    const dateElements = getDateCells(monthCalendar);
    tap(dateElements[10]);
    expect(tapSpy.calledOnce).to.be.true;
    tap(dateElements[10]);
    expect(tapSpy.calledTwice).to.be.true;
  });

  it('should not fire value change on tapping an empty cell', () => {
    const emptyDateElement = monthCalendar.shadowRoot.querySelector('[part~="date"]:empty');
    tap(emptyDateElement);
    expect(valueChangedSpy.called).to.be.false;
  });

  it('should update value on tap', () => {
    const dateElements = getDateCells(monthCalendar);
    for (let i = 0; i < dateElements.length; i++) {
      if (dateElements[i].date.getDate() === 10) {
        // Tenth of February.
        tap(dateElements[i]);
      }
    }
    expect(monthCalendar.selectedDate.getFullYear()).to.equal(2016);
    expect(monthCalendar.selectedDate.getMonth()).to.equal(1);
    expect(monthCalendar.selectedDate.getDate()).to.equal(10);
  });

  it('should not react if the tap takes more than 300ms', async () => {
    const tapSpy = sinon.spy();
    monthCalendar.addEventListener('date-tap', tapSpy);
    const dateElement = getDateCells(monthCalendar)[10];
    monthCalendar._onMonthGridTouchStart();
    await aTimeout(350);
    tap(dateElement);
    expect(tapSpy.called).to.be.false;
  });

  it('should not react if ignoreTaps is on', () => {
    const tapSpy = sinon.spy();
    monthCalendar.addEventListener('date-tap', tapSpy);
    monthCalendar.ignoreTaps = true;
    const dateElement = getDateCells(monthCalendar)[10];
    tap(dateElement);
    expect(tapSpy.called).to.be.false;
  });

  it('should prevent default on touchend', () => {
    const dateElement = getDateCells(monthCalendar)[0];
    const event = makeSoloTouchEvent('touchend', null, dateElement);
    expect(event.defaultPrevented).to.be.true;
  });

  it('should work with sub 100 years', async () => {
    const month = new Date(0, 0);
    month.setFullYear(99);
    monthCalendar.month = month;
    await nextRender();
    const date = getDateCells(monthCalendar)[0].date;
    expect(date.getFullYear()).to.equal(month.getFullYear());
  });

  it('should not update value on disabled date tap', async () => {
    monthCalendar.maxDate = new Date('2016-02-09');
    await nextRender();
    const dateElements = getDateCells(monthCalendar);
    for (let i = 0; i < dateElements.length; i++) {
      if (dateElements[i].date.getDate() === 10) {
        // Tenth of February.
        tap(dateElements[i]);
      }
    }
    expect(monthCalendar.selectedDate).to.be.undefined;
  });

  describe('i18n', () => {
    beforeEach(async () => {
      monthCalendar.i18n = {
        monthNames:
          'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split(
            '_',
          ),
        weekdays: ['sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai'],
        weekdaysShort: ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'],
        firstDayOfWeek: 1,
        today: 'Tänään',
        formatTitle: (monthName, fullYear) => `${monthName}-${fullYear}`,
      };
      await nextRender();
    });

    it('should render weekdays in correct locale', () => {
      const weekdays = getWeekDayCells(monthCalendar);
      const weekdayTitles = weekdays.map((weekday) => weekday.textContent.trim());
      expect(weekdayTitles).to.eql(['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su']);
    });

    it('should label dates in correct locale', () => {
      const dates = getDateCells(monthCalendar);
      dates.slice(0, 7).forEach((date, index) => {
        const label = date.getAttribute('aria-label');
        const day = ['maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai', 'sunnuntai'][index];
        expect(label).to.equal(`${index + 1} helmikuu 2016, ${day}`);
      });
    });

    it('should label today in correct locale', async () => {
      monthCalendar.month = new Date();
      await nextRender();
      const today = getDateCells(monthCalendar).find((date) => date.getAttribute('part').includes('today'));
      expect(today.getAttribute('aria-label').split(', ').pop()).to.equal('Tänään');
    });

    it('should render month name in correct locale', () => {
      expect(monthCalendar.shadowRoot.querySelector('[part="month-header"]').textContent).to.equal('helmikuu-2016');
    });
  });

  describe('week numbers', () => {
    beforeEach(() => {
      monthCalendar.showWeekNumbers = true;
      monthCalendar.i18n = { ...monthCalendar.i18n, firstDayOfWeek: 1 };
    });

    function getWeekNumbers(cal) {
      return Array.from(cal.shadowRoot.querySelectorAll('[part="week-number"]')).map((elem) =>
        parseInt(elem.textContent, 10),
      );
    }

    it('should render correct week numbers for Jan 2016', async () => {
      const month = new Date(2016, 0, 1);
      monthCalendar.month = month;
      await nextRender();
      const weekNumbers = getWeekNumbers(monthCalendar);
      expect(weekNumbers).to.eql([53, 1, 2, 3, 4]);
    });

    it('should render correct week numbers for Dec 2015', async () => {
      const month = new Date(2015, 11, 1);
      monthCalendar.month = month;
      await nextRender();
      const weekNumbers = getWeekNumbers(monthCalendar);
      expect(weekNumbers).to.eql([49, 50, 51, 52, 53]);
    });

    it('should render correct week numbers for Feb 2016', async () => {
      const month = new Date(2016, 1, 1);
      monthCalendar.month = month;
      await nextRender();
      const weekNumbers = getWeekNumbers(monthCalendar);
      expect(weekNumbers).to.eql([5, 6, 7, 8, 9]);
    });

    it('should render correct week numbers for May 99', async () => {
      const month = new Date(0, 4, 1);
      month.setFullYear(99);
      monthCalendar.month = month;
      await nextRender();
      const weekNumbers = getWeekNumbers(monthCalendar);
      expect(weekNumbers).to.eql([18, 19, 20, 21, 22]);
    });
  });

  describe('date limits', () => {
    it('should be disabled when all dates are disabled', () => {
      monthCalendar.minDate = new Date(2016, 2, 1);
      expect(monthCalendar.hasAttribute('disabled')).to.be.true;
    });

    it('should not be disabled if the last day is enabled', () => {
      monthCalendar.minDate = new Date(2016, 1, 29);
      expect(monthCalendar.hasAttribute('disabled')).to.be.false;
    });

    it('should not be disabled when some dates are disabled', () => {
      monthCalendar.minDate = new Date(2016, 1, 15);
      monthCalendar.maxDate = new Date(2016, 1, 20);
      expect(monthCalendar.hasAttribute('disabled')).to.be.false;
    });

    it('should not be disabled when no dates are disabled', () => {
      expect(monthCalendar.hasAttribute('disabled')).to.be.false;
    });
  });
});
