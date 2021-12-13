import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, isIOS, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { IronA11yAnnouncer } from '@polymer/iron-a11y-announcer/iron-a11y-announcer.js';
import { activateScroller, getDefaultI18n, open } from './common.js';

describe('WAI-ARIA', () => {
  describe('date picker', () => {
    let datepicker, toggleButton, input, label, helper, error;

    beforeEach(() => {
      datepicker = fixtureSync(`<vaadin-date-picker helper-text="Week day" label="Date"></vaadin-date-picker>`);
      toggleButton = datepicker.shadowRoot.querySelector('[part="toggle-button"]');
      input = datepicker.inputElement;
      label = datepicker.querySelector('[slot=label]');
      error = datepicker.querySelector('[slot=error-message]');
      helper = datepicker.querySelector('[slot=helper]');
    });

    it('should set aria-labelledby attribute on the native input', () => {
      expect(input.getAttribute('aria-labelledby')).to.equal(label.id);
    });

    it('should set aria-describedby with helper text ID when valid', () => {
      const aria = input.getAttribute('aria-describedby');
      expect(aria).to.include(helper.id);
      expect(aria).to.not.include(error.id);
    });

    it('should add error message ID to aria-describedby when invalid', async () => {
      datepicker.invalid = true;
      await aTimeout(0);
      const aria = input.getAttribute('aria-describedby');
      expect(aria).to.include(helper.id);
      expect(aria).to.include(error.id);
    });

    it('should have button roles on buttons', () => {
      // Indicate icon buttons as clickable. Especially helpful on touch devices.
      expect(toggleButton.getAttribute('role')).to.equal('button');
    });

    // TODO: clarify if this is still needed
    it.skip('should have label properties on buttons', () => {
      // Give spoken names for the icon buttons.
      expect(toggleButton.getAttribute('aria-label')).to.equal('Calendar');
    });

    // TODO: clarify if this is still needed
    it.skip('should have label properties on buttons in correct locale', () => {
      datepicker.set('i18n.calendar', 'kalenteri');
      expect(toggleButton.getAttribute('aria-label')).to.equal('kalenteri');
    });

    it('should have expanded state false on the input', () => {
      // Indicate that there is a collapsible calendar, closed by default.
      expect(input.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should have expanded state true on the input when opened', () => {
      datepicker.open();

      expect(input.getAttribute('aria-expanded')).to.equal('true');
    });
  });

  describe('overlay contents', () => {
    var overlay;

    beforeEach(async () => {
      overlay = fixtureSync(`<vaadin-date-picker-overlay-content></vaadin-date-picker-overlay-content>`);
      overlay.$.monthScroller.bufferSize = 0;
      overlay.$.yearScroller.bufferSize = 1;
      overlay.i18n = getDefaultI18n();
      await nextFrame();
    });

    describe('title announcer', () => {
      beforeEach(async () => {
        overlay.initialPosition = new Date();
        await nextFrame();
      });

      // Title announcer notifies the user when the overlay opens with
      // an explicit “<alert> Calender” announce.

      it('should be present in the overlay', () => {
        expect(overlay.$.announcer).to.be.ok;
      });

      it('should be the first child of the overlay', () => {
        // Always introduce calendar contents with “Calendar”.
        expect(overlay.shadowRoot.querySelector(':not(style):not(:empty)')).to.equal(overlay.$.announcer);
      });

      it('should not have hidden state', () => {
        // Otherwise is not spoken.
        expect(overlay.$.announcer.getAttribute('aria-hidden')).to.not.equal('true');
      });

      it('should be visible', () => {
        expect(overlay.$.announcer.offsetWidth).to.be.at.least(1);
        expect(overlay.$.announcer.offsetHeight).to.be.at.least(1);
      });

      it('should have role alert', () => {
        expect(overlay.$.announcer.getAttribute('role')).to.equal('alert');
      });

      it('should have live property polite', () => {
        // By default alerts are assertive and interrupt screen readers.
        // Polite mode makes the announce in normal order.
        expect(overlay.$.announcer.getAttribute('aria-live')).to.equal('polite');
      });

      it('should have text', () => {
        expect(overlay.$.announcer.textContent.trim()).to.equal('Calendar');
      });

      it('should have text in correct locale', () => {
        overlay.set('i18n.calendar', 'kalenteri');
        expect(overlay.$.announcer.textContent.trim()).to.equal('kalenteri');
      });
    });

    describe('year scroller contents', () => {
      let yearScrollerContents;

      beforeEach(async () => {
        const scroller = overlay.$.yearScroller;
        await activateScroller(scroller);
        yearScrollerContents = scroller.querySelectorAll('div > [part="year-number"]');
      });

      it('should contain button role for years', () => {
        // Indicate years as clickable.
        const years = Array.from(yearScrollerContents).filter((el) => /\d+/.test(el.textContent));

        expect(years).to.not.be.empty;
        years.forEach((year) => {
          expect(year.getAttribute('role')).to.equal('button');
        });
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

    it('should have heading role on the title', () => {
      // Consistency and convenience. Announces title as a header.
      expect(monthCalendar.shadowRoot.querySelector('[part="month-header"]').getAttribute('role')).to.equal('heading');
    });

    it('should have heading roles on the weekdays', () => {
      // iOS VoiceOver bug: visible text is spoken instead of aria-label otherwise.
      const weekdays = monthCalendar.shadowRoot.querySelectorAll('[part="weekday"]:not(:empty)');
      Array.from(weekdays).forEach((weekday) => {
        expect(weekday.getAttribute('role')).to.equal('heading');
      });
    });

    it('should have label properties on the weekdays', () => {
      // Speak week days with full words instead of acronyms.
      const weekdays = monthCalendar.shadowRoot.querySelectorAll('[part="weekday"]:not(:empty)');
      const weekdayLabels = Array.from(weekdays).map((weekday) => weekday.getAttribute('aria-label'));

      expect(weekdayLabels).to.eql(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
    });

    it('should have button roles and labels on date cells', () => {
      // The date cells should be spoken with a full date.
      const dateElements = monthCalendar.shadowRoot.querySelectorAll('[part="date"]:not(:empty)');
      expect(dateElements).to.not.be.empty;

      Array.from(dateElements).forEach((dateElement) => {
        expect(dateElement.getAttribute('role')).to.equal('button');
        expect(dateElement.getAttribute('aria-label')).to.be.ok;
      });
      expect(dateElements[0].getAttribute('aria-label')).to.equal('1 February 2016, Monday');
      expect(dateElements[1].getAttribute('aria-label')).to.equal('2 February 2016, Tuesday');
    });

    it('should indicate today on date cells', async () => {
      monthCalendar.month = new Date();
      await nextFrame();
      const todayElement = monthCalendar.shadowRoot.querySelector('[part="date"]:not(:empty)[today]');
      expect(todayElement.getAttribute('aria-label')).to.match(/, Today$/);
    });

    it('should have disabled state on disabled date cells', () => {
      // just [disabled] attribute is not enough for screen readers, should
      // also contain aria-disabled="true".
      monthCalendar.maxDate = new Date(2016, 1, 10); // 10 February 2016

      const dateElements = monthCalendar.shadowRoot.querySelectorAll('[part="date"]:not(:empty)');
      expect(dateElements[9].getAttribute('aria-disabled')).to.not.equal('true');
      expect(dateElements[10].getAttribute('aria-disabled')).to.equal('true');
    });

    it('should not have button roles and label properties on empty cells', () => {
      // The empty cells should not be spoken.
      var emptyDateElements = monthCalendar.shadowRoot.querySelectorAll('[part="date"]:empty');

      expect(emptyDateElements).to.not.be.empty;
      Array.from(emptyDateElements).forEach((emptyDateElement) => {
        expect(emptyDateElement.getAttribute('role')).to.not.equal('button');
        expect(emptyDateElement.getAttribute('aria-label')).to.not.be.ok;
      });
    });

    it('should have presentation roles on empty date cells', () => {
      const emptyDateElements = monthCalendar.shadowRoot.querySelectorAll('[part="date"]:empty');

      Array.from(emptyDateElements).forEach((emptyElement) => {
        expect(emptyElement.getAttribute('role')).to.equal('presentation');
        expect(emptyElement.getAttribute('aria-label')).to.be.empty;
      });
    });

    describe('week numbers', () => {
      beforeEach(async () => {
        monthCalendar.showWeekNumbers = true;
        monthCalendar.set('i18n.firstDayOfWeek', 1);
        await nextFrame();
      });

      it('should have heading roles on week numbers', () => {
        // iOS VoiceOver bug: visible text is spoken instead of aria-label otherwise.
        const weekNumberElements = monthCalendar.shadowRoot.querySelectorAll('[part="week-number"]');

        Array.from(weekNumberElements).forEach((weekNumberElement) => {
          expect(weekNumberElement.getAttribute('role')).to.equal('heading');
        });
      });

      it('should have label properties on week numbers', () => {
        const weekNumberElements = monthCalendar.shadowRoot.querySelectorAll('[part="week-number"]');

        expect(weekNumberElements[0].getAttribute('aria-label')).to.equal('Week 5');
        expect(weekNumberElements[1].getAttribute('aria-label')).to.equal('Week 6');
      });
    });
  });

  describe('announcements', () => {
    // NOTE: See <iron-a11y-announcer> API
    let datepicker;

    beforeEach(() => {
      datepicker = fixtureSync(`<vaadin-date-picker label="ariatest"></vaadin-date-picker>`);
    });

    function waitForAnnounce(callback) {
      const listener = (event) => {
        document.body.removeEventListener('iron-announce', listener);
        callback(event.detail.text);
      };
      document.body.addEventListener('iron-announce', listener);
    }

    it('should request availability from IronA11yAnnouncer', async () => {
      const spy = sinon.spy(IronA11yAnnouncer, 'requestAvailability');
      datepicker.open();
      await nextFrame();
      expect(spy.called).to.be.true;
    });

    it('should announce focused date on open', (done) => {
      waitForAnnounce((text) => {
        expect(text).to.equal('Monday 1 February 2016');
        done();
      });

      datepicker._focusedDate = new Date(2016, 1, 1);
      datepicker.open();
    });

    it('should announce focused date changes when opened', (done) => {
      datepicker.open();

      waitForAnnounce((text) => {
        expect(text).to.equal('Tuesday 2 February 2016');
        done();
      });

      datepicker._focusedDate = new Date(2016, 1, 2);
    });

    it('should not announce focused date changes when closed', () => {
      const announceSpy = sinon.spy();
      document.body.addEventListener('iron-announce', announceSpy);

      datepicker._focusedDate = new Date(2016, 1, 2);

      expect(announceSpy.called).to.be.false;
      document.body.removeEventListener('iron-announce', announceSpy);
    });

    it('should announce value on open', (done) => {
      waitForAnnounce((text) => {
        expect(text).to.equal('Monday 1 February 2016');
        done();
      });

      datepicker.value = '2016-02-01';
      datepicker.open();
    });

    it('should announce initial position on open', (done) => {
      waitForAnnounce((text) => {
        expect(text).to.equal('Monday 1 February 2016');
        done();
      });

      datepicker.initialPosition = '2016-02-01';
      datepicker.open();
    });

    it('should announce today', (done) => {
      waitForAnnounce((text) => {
        expect(text.indexOf('Today')).to.equal(0);
        done();
      });

      datepicker.open();
    });

    it('should announce week numbers if enabled', (done) => {
      datepicker._focusedDate = new Date(2016, 1, 1);
      datepicker.showWeekNumbers = true;
      datepicker.set('i18n.firstDayOfWeek', 1);

      waitForAnnounce((text) => {
        expect(text).to.match(/ Week 5$/);
        done();
      });

      datepicker.open();
    });

    if (!isIOS) {
      it('should announce once', async () => {
        datepicker._focusedDate = new Date(2016, 1, 1);
        await open(datepicker);
        const announceSpy = sinon.spy();
        document.body.addEventListener('iron-announce', announceSpy);
        datepicker._focusedDate = new Date(2016, 1, 2);
        await aTimeout(1);
        expect(announceSpy.callCount).to.be.equal(1);
        document.body.removeEventListener('iron-announce', announceSpy);
      });
    }

    describe('i18n', () => {
      beforeEach(() => {
        const monthNames =
          'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu';
        const weekdays = 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai';
        datepicker.set('i18n.monthNames', monthNames.split('_'));
        datepicker.set('i18n.weekdays', weekdays.split('_'));
        datepicker.set('i18n.week', 'viikko');
        datepicker.set('i18n.today', 'Tänään');
      });

      it('should announce dates in correct locale', (done) => {
        waitForAnnounce((text) => {
          expect(text).to.equal('maanantai 1 helmikuu 2016');
          done();
        });

        datepicker._focusedDate = new Date(2016, 1, 1);
        datepicker.open();
      });

      it('should announce today in correct locale', (done) => {
        waitForAnnounce((text) => {
          expect(text.indexOf('Tänään')).to.equal(0);
          done();
        });

        datepicker.open();
      });

      it('should announce week numbers in correct locale', (done) => {
        datepicker._focusedDate = new Date(2016, 1, 1);
        datepicker.showWeekNumbers = true;
        datepicker.set('i18n.firstDayOfWeek', 1);

        waitForAnnounce((text) => {
          expect(text).to.match(/ viikko 5$/);
          done();
        });

        datepicker.open();
      });
    });
  });
});
