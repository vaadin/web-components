import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../../src/vaadin-month-calendar.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { DateMetadataController } from '../../src/vaadin-date-metadata-controller.js';
import { getDefaultI18n } from '../helpers.js';

describe('vaadin-month-calendar', () => {
  let monthCalendar, clock;

  beforeEach(async () => {
    resetUniqueId();
    clock = sinon.useFakeTimers({
      now: new Date(2016, 1, 5),
      toFake: ['Date'],
    });

    monthCalendar = fixtureSync('<vaadin-month-calendar></vaadin-month-calendar>');
    monthCalendar.i18n = getDefaultI18n();
    monthCalendar.month = new Date(2016, 1, 1);
    await nextFrame();
  });

  afterEach(() => {
    clock.restore();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(monthCalendar).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(monthCalendar).shadowDom.to.equalSnapshot();
    });

    it('max date', async () => {
      monthCalendar.maxDate = new Date(2016, 1, 10);
      await expect(monthCalendar).shadowDom.to.equalSnapshot();
    });

    it('week numbers', async () => {
      monthCalendar.showWeekNumbers = true;
      monthCalendar.i18n = { ...monthCalendar.i18n, firstDayOfWeek: 1 };
      await nextFrame();
      await expect(monthCalendar).shadowDom.to.equalSnapshot();
    });

    it('disabled dates', async () => {
      monthCalendar.isDateDisabled = (date) => {
        if (!date) {
          return false;
        }
        return !!(date.day % 2);
      };
      await nextUpdate(monthCalendar);
      await expect(monthCalendar).shadowDom.to.equalSnapshot();
    });

    describe('date metadata', () => {
      let controller;

      beforeEach(() => {
        // The real controller, which works with a plain host, so the snapshots capture the state the
        // calendar actually reads rather than a stand-in.
        controller = new DateMetadataController(monthCalendar);
        monthCalendar._dateMetadataController = controller;
        // Subscribed as the overlay content does, so the calendar re-renders once an answer lands.
        controller.subscribe(monthCalendar);
      });

      it('loading month', async () => {
        // A provider that never resolves, so the request for the month stays in flight, which is the
        // state the dates are rendered in until it answers.
        controller.setProvider(() => new Promise(() => {}));
        controller.ensureRangeLoaded(monthCalendar.month, monthCalendar.month);
        await nextUpdate(monthCalendar);
        await expect(monthCalendar).shadowDom.to.equalSnapshot();
      });

      it('provider disabled dates', async () => {
        // Answer for the displayed month explicitly, rather than deriving it from the requested
        // range, which covers a whole block and so spans several months.
        const { month } = monthCalendar;
        controller.setProvider(() => {
          const dates = [];
          for (let day = 1; day <= 29; day++) {
            if (day % 2) {
              dates.push({ year: month.getFullYear(), month: month.getMonth(), day, disabled: true });
            }
          }
          return dates;
        });
        controller.ensureRangeLoaded(month, month);
        // The answer is awaited even for a synchronous provider, so let it land before capturing.
        await aTimeout(0);
        await nextUpdate(monthCalendar);
        await expect(monthCalendar).shadowDom.to.equalSnapshot();
      });
    });
  });
});
