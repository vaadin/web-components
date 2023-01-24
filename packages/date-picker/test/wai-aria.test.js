import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../vaadin-date-picker.js';
import { activateScroller, getDefaultI18n, open } from './helpers.js';

describe('WAI-ARIA', () => {
  describe('date picker', () => {
    let datepicker, input;

    beforeEach(() => {
      datepicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
      input = datepicker.inputElement;
    });

    it('should toggle aria-expanded attribute on open', () => {
      datepicker.open();
      expect(input.getAttribute('aria-expanded')).to.equal('true');
      datepicker.close();
      expect(input.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should set aria-hidden on all calendars except focused one', async () => {
      await open(datepicker);
      await nextRender(datepicker);
      const calendars = datepicker._overlayContent.querySelectorAll('vaadin-month-calendar');
      calendars.forEach((calendar) => {
        const focused = calendar.shadowRoot.querySelector('[part="date"][focused]');
        expect(calendar.getAttribute('aria-hidden')).to.equal(focused ? null : 'true');
      });
    });
  });

  describe('overlay contents', () => {
    let overlay;

    beforeEach(async () => {
      overlay = fixtureSync(`<vaadin-date-picker-overlay-content></vaadin-date-picker-overlay-content>`);
      overlay.$.monthScroller.bufferSize = 0;
      overlay.$.yearScroller.bufferSize = 1;
      overlay.i18n = getDefaultI18n();
      await nextFrame();
    });

    describe('year scroller contents', () => {
      let scroller, yearScrollerContents;

      beforeEach(async () => {
        scroller = overlay.$.yearScroller;
        await activateScroller(scroller);
        yearScrollerContents = scroller.querySelectorAll('div > [part="year-number"]');
      });

      it('should set aria-hidden on the year scroller', () => {
        expect(scroller.getAttribute('aria-hidden')).to.equal('true');
      });

      it('should have hidden state for dots', () => {
        // Do not speak dots between years.
        const dots = Array.from(yearScrollerContents).map((el) => el.nextElementSibling);

        expect(dots).to.not.be.empty;
        dots.forEach((dot) => {
          expect(dot.getAttribute('aria-hidden')).to.equal('true');
        });
      });
    });
  });

  describe('month calendar contents', () => {
    let monthCalendar;

    beforeEach(async () => {
      monthCalendar = fixtureSync(`<vaadin-month-calendar></vaadin-month-calendar>`);
      monthCalendar.i18n = getDefaultI18n();
      monthCalendar.month = new Date(2016, 1, 1);
      await nextFrame();
      await aTimeout(1);
    });

    it('should indicate today on date cells', async () => {
      monthCalendar.month = new Date();
      await nextFrame();
      const todayElement = monthCalendar.shadowRoot.querySelector('[part="date"]:not(:empty)[today]');
      expect(todayElement.getAttribute('aria-label')).to.match(/, Today$/);
    });
  });
});
