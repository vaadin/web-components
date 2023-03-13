import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../../src/vaadin-month-calendar.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { getDefaultI18n } from '../helpers.js';

describe('vaadin-month-calendar', () => {
  let monthCalendar;

  beforeEach(async () => {
    resetUniqueId();
    monthCalendar = fixtureSync('<vaadin-month-calendar></vaadin-month-calendar>');
    monthCalendar.i18n = getDefaultI18n();
    monthCalendar.month = new Date(2016, 1, 1);
    await nextFrame();
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
  });
});
