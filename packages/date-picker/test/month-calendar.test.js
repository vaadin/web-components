import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, makeSoloTouchEvent, nextFrame, nextRender, tap } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-month-calendar.js';
import { getDateCell, getDateCells, getDefaultI18n, getWeekDayCells } from './helpers.js';

describe('vaadin-month-calendar', () => {
  let monthCalendar, valueChangedSpy;

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

  it('should render at most 7 weekdays', async () => {
    monthCalendar.i18n = {
      ...monthCalendar.i18n,
      weekdays: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      weekdaysShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    };
    await nextRender();

    const weekdays = getWeekDayCells(monthCalendar);
    expect(weekdays.length).to.equal(7);
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
    const date10 = getDateCell(monthCalendar, 10);
    tap(date10);
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

  it('should not update value on disabled-by-max date tap', async () => {
    monthCalendar.maxDate = new Date('2016-02-09');
    await nextRender();
    const date10 = getDateCell(monthCalendar, 10);
    tap(date10);
    expect(monthCalendar.selectedDate).to.be.undefined;
  });

  it('should update value on disabled-by-function date tap', async () => {
    monthCalendar.isDateDisabled = (date) => {
      if (!date) {
        return false;
      }
      return date.year === 2016 && date.month === 1 && date.day === 9;
    };
    await nextFrame();
    const date9 = getDateCell(monthCalendar, 9);
    tap(date9);
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

    it('should toggle disabled attribute on month change with same-month limits', () => {
      monthCalendar.minDate = new Date(2016, 1, 15);
      monthCalendar.maxDate = new Date(2016, 1, 20);
      expect(monthCalendar.hasAttribute('disabled')).to.be.false;

      monthCalendar.month = new Date(2015, 1, 1);
      expect(monthCalendar.hasAttribute('disabled')).to.be.true;

      monthCalendar.month = new Date(2017, 1, 1);
      expect(monthCalendar.hasAttribute('disabled')).to.be.true;
    });

    it('should toggle disabled attribute on month change with limits in different years', () => {
      monthCalendar.minDate = new Date(2015, 1, 10);
      monthCalendar.maxDate = new Date(2017, 1, 15);
      expect(monthCalendar.hasAttribute('disabled')).to.be.false;

      monthCalendar.month = new Date(2018, 1, 1);
      expect(monthCalendar.hasAttribute('disabled')).to.be.true;
    });

    it('should be disabled when the limits are reversed', () => {
      monthCalendar.minDate = new Date(2016, 1, 20);
      monthCalendar.maxDate = new Date(2016, 1, 15);
      expect(monthCalendar.hasAttribute('disabled')).to.be.true;
    });

    it('should not be disabled if only one date is enabled', () => {
      monthCalendar.minDate = new Date(2016, 1, 15);
      monthCalendar.maxDate = new Date(2016, 1, 15);
      expect(monthCalendar.hasAttribute('disabled')).to.be.false;
    });

    it('should not be disabled when no dates are disabled', () => {
      expect(monthCalendar.hasAttribute('disabled')).to.be.false;
    });
  });

  describe('range', () => {
    const parts = (day) => getDateCell(monthCalendar, day).getAttribute('part').split(' ');
    const rangeParts = (day) => parts(day).filter((part) => ['range-start', 'range-end', 'in-range'].includes(part));

    beforeEach(async () => {
      monthCalendar.rangeStart = new Date(2016, 1, 10);
      monthCalendar.rangeEnd = new Date(2016, 1, 14);
      await nextRender();
    });

    it('should mark the start, the end and the dates between', () => {
      expect(rangeParts(9)).to.be.empty;
      expect(rangeParts(10)).to.have.members(['range-start', 'in-range']);
      expect(rangeParts(12)).to.have.members(['in-range']);
      expect(rangeParts(14)).to.have.members(['range-end', 'in-range']);
      expect(rangeParts(15)).to.be.empty;
    });

    it('should mark only the start and the end as selected', () => {
      [10, 14].forEach((day) => {
        expect(parts(day)).to.include('selected');
        expect(getDateCell(monthCalendar, day).getAttribute('aria-selected')).to.equal('true');
      });
      expect(parts(12)).to.not.include('selected');
      expect(getDateCell(monthCalendar, 12).getAttribute('aria-selected')).to.equal('false');
    });

    it('should include the range role in the accessible name of the dates', () => {
      const label = (day) => getDateCell(monthCalendar, day).getAttribute('aria-label');
      expect(label(10)).to.match(/, range start$/u);
      expect(label(12)).to.match(/, in range$/u);
      expect(label(14)).to.match(/, range end$/u);
      expect(label(15)).to.not.match(/range/u);
    });

    it('should use the range role labels from i18n', async () => {
      monthCalendar.i18n = { ...monthCalendar.i18n, rangeStart: 'Beginn', inRange: 'im Bereich', rangeEnd: 'Ende' };
      await nextRender();
      expect(getDateCell(monthCalendar, 10).getAttribute('aria-label')).to.match(/, Beginn$/u);
      expect(getDateCell(monthCalendar, 12).getAttribute('aria-label')).to.match(/, im Bereich$/u);
      expect(getDateCell(monthCalendar, 14).getAttribute('aria-label')).to.match(/, Ende$/u);
    });

    it('should mark a single-day range as both start and end without a band', async () => {
      monthCalendar.rangeEnd = new Date(2016, 1, 10);
      await nextRender();
      expect(rangeParts(10)).to.have.members(['range-start', 'range-end']);
    });

    it('should mark only the start when the range has no end', async () => {
      monthCalendar.rangeEnd = null;
      await nextRender();
      expect(rangeParts(10)).to.have.members(['range-start']);
      expect(rangeParts(12)).to.be.empty;
    });

    it('should not mark an end without a start', async () => {
      monthCalendar.rangeStart = null;
      await nextRender();
      expect(rangeParts(14)).to.be.empty;
      expect(parts(14)).to.not.include('selected');
    });

    it('should mark a range that continues past the displayed month', async () => {
      monthCalendar.rangeStart = new Date(2016, 0, 20);
      monthCalendar.rangeEnd = new Date(2016, 2, 5);
      await nextRender();
      expect(rangeParts(1)).to.have.members(['in-range']);
      expect(rangeParts(29)).to.have.members(['in-range']);
    });
  });
});
