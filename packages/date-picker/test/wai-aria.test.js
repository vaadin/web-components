import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-date-picker.js';
import { activateScroller, getDefaultI18n, open } from './helpers.js';

describe('WAI-ARIA', () => {
  describe('date picker', () => {
    let datePicker, input;

    beforeEach(async () => {
      datePicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
      await nextRender();
      input = datePicker.inputElement;
    });

    it('should toggle aria-expanded attribute on open', async () => {
      await open(datePicker);
      expect(input.getAttribute('aria-expanded')).to.equal('true');
      datePicker.close();
      expect(input.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should set aria-hidden on all calendars except focusable one', async () => {
      await open(datePicker);
      await nextRender();
      const calendars = datePicker._overlayContent.querySelectorAll('vaadin-month-calendar');
      calendars.forEach((calendar) => {
        const focusable = calendar.shadowRoot.querySelector('[tabindex="0"]');
        expect(calendar.getAttribute('aria-hidden')).to.equal(focusable ? null : 'true');
      });
    });

    it('should not set aria-modal attribute on the overlay content on open by default', async () => {
      await open(datePicker);
      const content = datePicker._overlayContent;

      expect(content.hasAttribute('aria-modal')).to.be.false;
    });

    it('should toggle aria-modal attribute on the overlay content on open if fullscreen', async () => {
      datePicker._fullscreen = true;

      await open(datePicker);
      const content = datePicker._overlayContent;
      expect(content.getAttribute('aria-modal')).to.equal('true');

      datePicker.close();
      expect(content.hasAttribute('aria-modal')).to.be.false;
    });
  });

  describe('overlay contents', () => {
    let overlay;

    beforeEach(async () => {
      overlay = fixtureSync(`<vaadin-date-picker-overlay-content></vaadin-date-picker-overlay-content>`);
      overlay.i18n = getDefaultI18n();
      await nextRender();
    });

    describe('year scroller contents', () => {
      let scroller, yearScrollerContents;

      beforeEach(async () => {
        scroller = overlay._yearScroller;
        await activateScroller(scroller);
        yearScrollerContents = scroller.querySelectorAll('vaadin-date-picker-year');
      });

      it('should set aria-hidden on the year scroller', () => {
        expect(scroller.getAttribute('aria-hidden')).to.equal('true');
      });

      it('should have hidden state for dots', () => {
        // Do not speak dots between years.
        const dots = Array.from(yearScrollerContents).map((el) =>
          el.shadowRoot.querySelector('[part="year-separator"]'),
        );

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
      await nextRender();
    });

    it('should indicate today on date cells', async () => {
      monthCalendar.month = new Date();
      await nextFrame();
      const todayElement = monthCalendar.shadowRoot.querySelector('[part~="today"]');
      expect(todayElement.getAttribute('aria-label')).to.match(/, Today$/u);
    });
  });
});
