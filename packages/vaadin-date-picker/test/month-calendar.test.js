import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { aTimeout, fixtureSync } from '@open-wc/testing-helpers';
import '../src/vaadin-month-calendar.js';
import { getDefaultI18n, tap } from './common.js';

describe('vaadin-month-calendar', () => {
  let monthCalendar, valueChangedSpy;

  beforeEach(async () => {
    monthCalendar = fixtureSync(`
    <vaadin-month-calendar
      style="position: absolute; top: 0"
    ></vaadin-month-calendar>`);
    monthCalendar.i18n = getDefaultI18n();
    monthCalendar.month = new Date(2016, 1, 1);
    valueChangedSpy = sinon.spy();
    monthCalendar.addEventListener('selected-date-changed', valueChangedSpy);
    await aTimeout();
  });

  // A helper for async test functions for 2016 month rendering.
  function createMonthTest(monthNumber) {
    const expectedDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    return (done) => {
      monthCalendar.month = new Date(2016, monthNumber, 1);
      setTimeout(() => {
        const numberOfDays = monthCalendar.$.days.querySelectorAll('[part="date"]:not(:empty)').length;
        expect(numberOfDays).to.equal(expectedDays[monthNumber]);
        done();
      });
    };
  }

  // Create 12 tests for each month of 2016.
  for (let i = 0; i < 12; i++) {
    it('should render correct number of days for 2016/' + (i + 1), createMonthTest(i));
  }

  it('should render days in correct order by default', () => {
    const weekdays = monthCalendar.shadowRoot.querySelectorAll('[part="weekday"]:not(:empty)');
    const weekdayTitles = Array.from(weekdays).map((weekday) => weekday.textContent);
    expect(weekdayTitles).to.eql(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  });

  it('should render days in correct order by first day of week', async () => {
    monthCalendar.set('i18n.firstDayOfWeek', 1); // Start from Monday.
    await aTimeout();
    const weekdays = monthCalendar.shadowRoot.querySelectorAll('[part="weekday"]:not(:empty)');
    const weekdayTitles = Array.from(weekdays).map((weekday) => weekday.textContent);
    expect(weekdayTitles).to.eql(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });

  it('should re-render after changing the month', async () => {
    monthCalendar.month = new Date(2000, 0, 1); // Feb 2016 -> Jan 2000
    await aTimeout();
    const days = monthCalendar.$.days.querySelectorAll('[part="date"]:not(:empty)').length;
    expect(days).to.equal(31);
    expect(monthCalendar.shadowRoot.querySelector('[part="month-header"]').textContent).to.equal('January 2000');
  });

  it('should fire value change on tap', () => {
    const dateElements = monthCalendar.$.days.querySelectorAll('[part="date"]:not(:empty)');
    tap(dateElements[10]);
    expect(valueChangedSpy.calledOnce).to.be.true;
  });

  it('should fire date-tap on tap', () => {
    const tapSpy = sinon.spy();
    monthCalendar.addEventListener('date-tap', tapSpy);
    const dateElements = monthCalendar.$.days.querySelectorAll('[part="date"]:not(:empty)');
    tap(dateElements[10]);
    expect(tapSpy.calledOnce).to.be.true;
    tap(dateElements[10]);
    expect(tapSpy.calledTwice).to.be.true;
  });

  it('should not fire value change on tapping an empty cell', () => {
    const emptyDateElement = monthCalendar.$.days.querySelector('[part="date"]:empty');
    tap(emptyDateElement);
    expect(valueChangedSpy.called).to.be.false;
  });

  it('should update value on tap', () => {
    const dateElements = monthCalendar.$.days.querySelectorAll('[part="date"]:not(:empty)');
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
    const dateElement = monthCalendar.$.days.querySelectorAll('[part="date"]:not(:empty)')[10];
    monthCalendar._onMonthGridTouchStart();
    await aTimeout(350);
    tap(dateElement);
    expect(tapSpy.called).to.be.false;
  });

  it('should not react if ignoreTaps is on', () => {
    const tapSpy = sinon.spy();
    monthCalendar.addEventListener('date-tap', tapSpy);
    monthCalendar.ignoreTaps = true;
    const dateElement = monthCalendar.$.days.querySelectorAll('[part="date"]:not(:empty)')[10];
    tap(dateElement);
    expect(tapSpy.called).to.be.false;
  });

  it('should prevent default on touchend', () => {
    const preventDefaultSpy = sinon.spy();
    const touchendEvent = new CustomEvent('touchend', {
      bubbles: true,
      cancelable: true
    });
    touchendEvent.changedTouches = [{}];
    touchendEvent.preventDefault = preventDefaultSpy;

    // Dispatch a fake touchend event from a date element.
    const dateElement = monthCalendar.$.days.querySelector('[part="date"]:not(:empty)');
    dateElement.dispatchEvent(touchendEvent);
    expect(preventDefaultSpy.called).to.be.true;
  });

  it('should work with sub 100 years', async () => {
    const month = new Date(0, 0);
    month.setFullYear(99);
    monthCalendar.month = month;
    await aTimeout();
    const date = monthCalendar.$.days.querySelector('[part="date"]:not(:empty)').date;
    expect(date.getFullYear()).to.equal(month.getFullYear());
  });

  it('should not update value on disabled date tap', async () => {
    monthCalendar.maxDate = new Date('2016-02-09');
    await aTimeout();
    const dateElements = monthCalendar.$.days.querySelectorAll('[part="date"]:not(:empty)');
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
        monthNames: 'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split(
          '_'
        ),
        weekdays: 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'),
        weekdaysShort: 'su_ma_ti_ke_to_pe_la'.split('_'),
        firstDayOfWeek: 1,
        week: 'viikko',
        today: 'Tänään',
        formatTitle: (monthName, fullYear) => monthName + '-' + fullYear
      };
      await aTimeout();
    });

    it('should render weekdays in correct locale', () => {
      const weekdays = monthCalendar.shadowRoot.querySelectorAll('[part="weekday"]:not(:empty)');
      const weekdayTitles = Array.from(weekdays).map((weekday) => weekday.textContent);
      const weekdayLabels = Array.from(weekdays).map((weekday) => weekday.getAttribute('aria-label'));
      expect(weekdayLabels).to.eql([
        'maanantai',
        'tiistai',
        'keskiviikko',
        'torstai',
        'perjantai',
        'lauantai',
        'sunnuntai'
      ]);
      expect(weekdayTitles).to.eql(['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su']);
    });

    it('should label dates in correct locale', () => {
      const dates = monthCalendar.$.days.querySelectorAll('[part="date"]:not(:empty)');
      Array.from(dates)
        .slice(0, 7)
        .forEach((date, index) => {
          const label = date.getAttribute('aria-label');
          const day = ['maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai', 'sunnuntai'][index];
          expect(label).to.equal(`${index + 1} helmikuu 2016, ${day}`);
        });
    });

    it('should label today in correct locale', async () => {
      monthCalendar.month = new Date();
      await aTimeout();
      const today = monthCalendar.$.monthGrid.querySelector('[part="date"]:not(:empty)[today]');
      expect(today.getAttribute('aria-label').split(', ').pop()).to.equal('Tänään');
    });

    it('should render month name in correct locale', () => {
      expect(monthCalendar.shadowRoot.querySelector('[part="month-header"]').textContent).to.equal('helmikuu-2016');
    });

    it('should label week numbers in correct locale', async () => {
      monthCalendar.showWeekNumbers = 1;
      monthCalendar.month = new Date(2016, 1, 1);
      await aTimeout();
      const weekNumberElements = monthCalendar.shadowRoot.querySelectorAll('[part="week-number"]');
      expect(weekNumberElements[0].getAttribute('aria-label')).to.equal('viikko 5');
      expect(weekNumberElements[1].getAttribute('aria-label')).to.equal('viikko 6');
    });
  });

  describe('week numbers', () => {
    beforeEach(() => {
      monthCalendar.showWeekNumbers = true;
      monthCalendar.set('i18n.firstDayOfWeek', 1);
    });

    function getWeekNumbers(cal) {
      return Array.from(cal.shadowRoot.querySelectorAll('[part="week-number"]')).map((elem) =>
        parseInt(elem.textContent, 10)
      );
    }

    it('should render correct week numbers for Jan 2016', async () => {
      const month = new Date(2016, 0, 1);
      monthCalendar.month = month;
      await aTimeout();
      const weekNumbers = getWeekNumbers(monthCalendar);
      expect(weekNumbers).to.eql([53, 1, 2, 3, 4]);
    });

    it('should render correct week numbers for Dec 2015', async () => {
      const month = new Date(2015, 11, 1);
      monthCalendar.month = month;
      await aTimeout();
      const weekNumbers = getWeekNumbers(monthCalendar);
      expect(weekNumbers).to.eql([49, 50, 51, 52, 53]);
    });

    it('should render correct week numbers for Feb 2016', async () => {
      const month = new Date(2016, 1, 1);
      monthCalendar.month = month;
      await aTimeout();
      const weekNumbers = getWeekNumbers(monthCalendar);
      expect(weekNumbers).to.eql([5, 6, 7, 8, 9]);
    });

    it('should render correct week numbers for May 99', async () => {
      const month = new Date(0, 4, 1);
      month.setFullYear(99);
      monthCalendar.month = month;
      await aTimeout();
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
