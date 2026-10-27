import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-date-picker.js';
import { activateScroller, getCalendars, getDateButton, getDefaultI18n, open } from './helpers.js';

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

    describe('dialog accessible name', () => {
      it('should set role and aria-label on the overlay content', async () => {
        await open(datePicker);
        const content = datePicker._overlayContent;
        expect(content.getAttribute('role')).to.equal('dialog');
        expect(content.getAttribute('aria-label')).to.equal('Calendar');
      });

      it('should use dialogAccessibleName set before opening', async () => {
        datePicker.i18n = { dialogAccessibleName: 'Kalenteri' };
        await open(datePicker);
        expect(datePicker._overlayContent.getAttribute('aria-label')).to.equal('Kalenteri');
      });

      it('should update aria-label when dialogAccessibleName changes while opened', async () => {
        await open(datePicker);
        datePicker.i18n = { dialogAccessibleName: 'Kalenteri' };
        await nextRender();
        expect(datePicker._overlayContent.getAttribute('aria-label')).to.equal('Kalenteri');
      });

      it('should keep the default aria-label when i18n is set partially', async () => {
        datePicker.i18n = { today: 'Tänään' };
        await open(datePicker);
        expect(datePicker._overlayContent.getAttribute('aria-label')).to.equal('Calendar');
      });

      it('should not use accessibleName as the overlay content aria-label', async () => {
        datePicker.accessibleName = 'Delivery date';
        await open(datePicker);
        expect(datePicker._overlayContent.getAttribute('aria-label')).to.equal('Calendar');
      });

      it('should remove aria-label when dialogAccessibleName is an empty string', async () => {
        datePicker.i18n = { dialogAccessibleName: '' };
        await open(datePicker);
        expect(datePicker._overlayContent.hasAttribute('aria-label')).to.be.false;
      });

      it('should keep the default aria-label when dialogAccessibleName is null', async () => {
        // `null` and `undefined` are ignored when merging with the defaults,
        // so they keep the default name rather than removing it.
        datePicker.i18n = { dialogAccessibleName: null };
        await open(datePicker);
        expect(datePicker._overlayContent.getAttribute('aria-label')).to.equal('Calendar');
      });
    });

    it('should set aria-hidden on all calendars except focusable one', async () => {
      await open(datePicker);
      await nextRender();
      const calendars = getCalendars(datePicker);
      expect(calendars).to.not.be.empty;
      calendars.forEach((calendar) => {
        const focusable = calendar.shadowRoot.querySelector('[tabindex="0"]');
        expect(calendar.getAttribute('aria-hidden')).to.equal(focusable ? null : 'true');
      });
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

    it('should indicate today on date buttons', async () => {
      monthCalendar.month = new Date();
      await nextFrame();
      const todayElement = monthCalendar.shadowRoot.querySelector('[part~="today"]');
      expect(getDateButton(todayElement).getAttribute('aria-label')).to.match(/, Today$/u);
    });
  });

  describe('aria-hidden', () => {
    let wrapper, datePicker, input, button;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div>
          <button>Button</button>
          <vaadin-date-picker></vaadin-date-picker>
          <input placeholder="input" />
        </div>
      `);
      await nextRender();
      [button, datePicker, input] = wrapper.children;
    });

    it('should set aria-hidden on other elements when overlay is opened', async () => {
      await open(datePicker);
      expect(button.getAttribute('aria-hidden')).to.equal('true');
      expect(input.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should not set aria-hidden on slotted input and overlay element', async () => {
      await open(datePicker);
      expect(datePicker.inputElement.hasAttribute('aria-hidden')).to.be.false;
      expect(datePicker.$.overlay.hasAttribute('aria-hidden')).to.be.false;
    });

    it('should remove aria-hidden from other elements when overlay is closed', async () => {
      await open(datePicker);
      datePicker.close();
      expect(button.hasAttribute('aria-hidden')).to.be.false;
      expect(input.hasAttribute('aria-hidden')).to.be.false;
    });
  });
});
