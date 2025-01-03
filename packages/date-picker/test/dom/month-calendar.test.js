import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../../src/vaadin-month-calendar.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
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
      await expect(monthCalendar).shadowDom.to.equalSnapshot();
    });

    describe('fi-FI locale', () => {
      beforeEach(async () => {
        monthCalendar.i18n = {
          ...monthCalendar.i18n,
          locale: 'fi-FI',
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
        await nextFrame();
      });

      it('default', async () => {
        await expect(monthCalendar).shadowDom.to.equalSnapshot();
      });
    });
  });
});
