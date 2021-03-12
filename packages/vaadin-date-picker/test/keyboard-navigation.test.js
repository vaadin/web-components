import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { aTimeout, fixtureSync } from '@open-wc/testing-helpers';
import { keyDownOn, pressEnter, pressSpace } from '@polymer/iron-test-helpers/mock-interactions.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import './not-animated-styles.js';
import '../vaadin-date-picker.js';
import { getDefaultI18n, getOverlayContent, ios, listenForEvent, open } from './common.js';

(ios ? describe.skip : describe)('keyboard navigation', () => {
  let target;

  function arrowDown() {
    keyDownOn(target, 40);
  }

  function arrowRight() {
    keyDownOn(target, 39);
  }

  function arrowUp() {
    keyDownOn(target, 38);
  }

  function arrowLeft() {
    keyDownOn(target, 37);
  }

  function home() {
    keyDownOn(target, 36);
  }

  function end() {
    keyDownOn(target, 35);
  }

  function pageDown(modifiers) {
    keyDownOn(target, 34, modifiers);
  }

  function pageUp(modifiers) {
    keyDownOn(target, 33, modifiers);
  }

  function enter() {
    pressEnter(target);
  }

  function space() {
    pressSpace(target);
  }

  function esc() {
    keyDownOn(target, 27, null, 'Escape');
  }

  function focusedDate(datepicker) {
    return getOverlayContent(datepicker).focusedDate;
  }

  describe('date-picker', () => {
    let datepicker;

    beforeEach(() => {
      datepicker = fixtureSync(`
      <vaadin-date-picker
        value="2000-01-01"
        style="position: absolute; top: 0"
      ></vaadin-date-picker>`);
    });

    it('should open overlay on down', () => {
      target = datepicker.$.input;
      arrowDown();
      expect(datepicker.opened).to.be.true;
    });

    it('should open overlay on down if autoOpenDisabled is true', () => {
      datepicker.autoOpenDisabled = true;
      target = datepicker.$.input;
      arrowDown();
      expect(datepicker.opened).to.be.true;
    });

    it('should open overlay on up', () => {
      target = datepicker.$.input;
      arrowUp();
      expect(datepicker.opened).to.be.true;
    });

    it('should open overlay on up even if autoOpenDisabled is true', () => {
      datepicker.autoOpenDisabled = true;
      target = datepicker.$.input;
      arrowUp();
      expect(datepicker.opened).to.be.true;
    });

    it('should close overlay on esc', async () => {
      datepicker.open();
      target = datepicker.$.overlay;
      await aTimeout(1);
      esc();
      expect(datepicker.opened).to.be.false;
    });

    it('should be focused on selected value when overlay is opened', () => {
      datepicker.value = '2001-01-01';
      datepicker.open();
      target = getOverlayContent(datepicker);
      arrowRight();
      expect(focusedDate(datepicker)).to.eql(new Date(2001, 0, 2));
    });

    it('should be focused on initial position when no value is set', async () => {
      datepicker.value = null;
      datepicker.initialPosition = '2001-01-01';

      await open(datepicker);
      target = getOverlayContent(datepicker);
      arrowRight();
      expect(focusedDate(datepicker)).to.eql(new Date(2001, 0, 2));
    });

    it('should be focused on today if no initial position is set', () => {
      const today = new Date();
      datepicker.value = null;
      datepicker.initialPosition = null;
      datepicker.open();
      target = getOverlayContent(datepicker);
      arrowRight();
      expect(focusedDate(datepicker)).to.eql(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
    });

    it('should not lose focused date after deselecting', () => {
      const focused = focusedDate(datepicker);
      datepicker.open();
      target = getOverlayContent(datepicker);
      space();
      space();
      expect(focusedDate(datepicker).getTime()).to.equal(focused.getTime());
    });
  });

  describe('overlay', () => {
    let overlay;

    beforeEach((done) => {
      overlay = fixtureSync(`
      <vaadin-date-picker-overlay-content
        style="position: absolute; top: 0"
      ></vaadin-date-picker-overlay-content>`);
      overlay.i18n = getDefaultI18n();
      target = overlay;

      overlay.initialPosition = new Date();
      overlay.focusedDate = new Date(2000, 0, 1);

      overlay.scrollToDate(overlay.focusedDate);
      listenForEvent(overlay, 'scroll-animation-finished', () => afterNextRender(overlay, done));
    });

    it('should focus one week forward with arrow down', () => {
      arrowDown(overlay);
      expect(overlay.focusedDate).to.eql(new Date(2000, 0, 8));
    });

    it('should focus one week backward with arrow up', () => {
      arrowUp(overlay);
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 25));
    });

    ['ltr', 'rtl'].forEach((direction) => {
      describe(`dir="${direction}"`, () => {
        const isRTL = direction === 'rtl';

        before(() => {
          document.documentElement.setAttribute('dir', direction);
        });

        after(() => {
          if (isRTL) {
            document.documentElement.setAttribute('dir', 'ltr');
          }
        });

        it(`should focus one day ${isRTL ? 'backward' : 'forward'} with arrow 'right'`, () => {
          arrowRight();
          expect(overlay.focusedDate).to.eql(isRTL ? new Date(1999, 11, 31) : new Date(2000, 0, 2));
        });

        it(`should focus one day ${isRTL ? 'forward' : 'backward'} with arrow left`, () => {
          arrowLeft();
          expect(overlay.focusedDate).to.eql(isRTL ? new Date(2000, 0, 2) : new Date(1999, 11, 31));
        });
      });
    });

    it('should close overlay with enter', () => {
      const spy = sinon.spy(overlay, '_close');
      enter();
      expect(spy.calledOnce).to.be.true;
    });

    it('should scroll to focused month', (done) => {
      overlay.addEventListener('scroll-animation-finished', (e) => {
        expect(e.detail.position).to.be.closeTo(e.detail.oldPosition - 1, 1);
        done();
      });

      arrowUp();
    });

    it('should select a date with space', () => {
      arrowRight();
      space();
      expect(overlay.selectedDate).to.eql(new Date(2000, 0, 2));
    });

    it('should deselect selected date with space', () => {
      space();
      space();
      expect(overlay.selectedDate).to.be.empty;
    });

    it('should focus first day of the month with home', () => {
      arrowLeft();
      home();
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 1));
    });

    it('should focus last day of the month with end', () => {
      end();
      expect(overlay.focusedDate).to.eql(new Date(2000, 0, 31));
    });

    it('should focus next month with pagedown', () => {
      target = overlay;
      pageDown();
      expect(overlay.focusedDate).to.eql(new Date(2000, 1, 1));
    });

    it('should focus previous month with pageup', () => {
      pageUp();
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 1));
    });

    it('should not skip a month', () => {
      overlay.focusedDate = new Date(2000, 0, 31);
      pageDown();
      expect(overlay.focusedDate).to.eql(new Date(2000, 1, 29));
    });

    it('should focus the previously focused date number if available', () => {
      overlay.focusedDate = new Date(2000, 0, 31);
      pageDown();
      pageDown();
      expect(overlay.focusedDate).to.eql(new Date(2000, 2, 31));
    });

    it('should focus next year with shift and pagedown', () => {
      pageDown('shift');
      expect(overlay.focusedDate).to.eql(new Date(2001, 0, 1));
    });

    it('should focus previous year with shift and pageup', () => {
      pageUp('shift');
      expect(overlay.focusedDate).to.eql(new Date(1999, 0, 1));
    });

    it('should scroll up when focus goes invisible', (done) => {
      overlay.addEventListener('scroll-animation-finished', (e) => {
        expect(e.detail.position).to.be.closeTo(e.detail.oldPosition - 12, 1);
        done();
      });

      pageUp('shift');
    });

    it('should not scroll down when focus keeps visible', async () => {
      const initialPosition = overlay.$.monthScroller.position;
      pageDown();
      await aTimeout();
      // FF sometimes reports subpixel differences
      expect(overlay.$.monthScroller.position).to.be.closeTo(initialPosition, 1);
    });

    it('should scroll down when focus goes invisible', (done) => {
      overlay.addEventListener('scroll-animation-finished', (e) => {
        expect(e.detail.position).to.be.greaterThan(e.detail.oldPosition);
        done();
      });

      pageDown('shift');
    });

    it('should not focus on today click if no date focused', () => {
      overlay.focusedDate = null;
      overlay._scrollToCurrentMonth();
      expect(overlay.focusedDate).to.be.null;
    });

    it('should focus on today click if a date is focused', () => {
      arrowRight();
      overlay._scrollToCurrentMonth();
      expect(overlay.focusedDate.getFullYear()).to.eql(new Date().getFullYear());
      expect(overlay.focusedDate.getMonth()).to.eql(new Date().getMonth());
      expect(overlay.focusedDate.getDate()).to.eql(new Date().getDate());
    });

    it('should move to max date when targeted date is disabled', () => {
      overlay.maxDate = new Date(2000, 0, 7);
      arrowDown(overlay);
      expect(overlay.focusedDate).to.eql(new Date(2000, 0, 7));
    });

    it('should move to min date when targeted date is disabled', () => {
      overlay.minDate = new Date(1999, 11, 26);
      arrowUp(overlay);
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 26));
    });

    it('should focus min date with home', () => {
      overlay.minDate = new Date(1999, 11, 3);
      arrowLeft();
      home();
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 3));
    });

    it('should focus max date with end', () => {
      overlay.maxDate = new Date(2000, 0, 26);
      end();
      expect(overlay.focusedDate).to.eql(new Date(2000, 0, 26));
    });

    it('should focus max date with pagedown', () => {
      overlay.maxDate = new Date(2000, 0, 28);
      pageDown();
      expect(overlay.focusedDate).to.eql(new Date(2000, 0, 28));
    });

    it('should focus min date with pageup', () => {
      overlay.minDate = new Date(1999, 11, 3);
      pageUp();
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 3));
    });

    it('should focus max date with shift and pagedown', () => {
      overlay.maxDate = new Date(2000, 11, 28);
      pageDown('shift');
      expect(overlay.focusedDate).to.eql(new Date(2000, 11, 28));
    });

    it('should focus min date with shift and pageup', () => {
      overlay.minDate = new Date(1999, 5, 3);
      pageUp('shift');
      expect(overlay.focusedDate).to.eql(new Date(1999, 5, 3));
    });

    it('should focus the closest allowed date with pageup when selected date is disabled', () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      pageUp();
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with pagedown when selected date is disabled', () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      pageDown();
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with shift pageup when selected date is disabled', () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      pageUp('shift');
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with shift pagedown when selected date is disabled', () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      pageUp('shift');
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with home when selected date is disabled', () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      home();
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with end when selected date is disabled', () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      end();
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with arrow up when selected date is disabled', () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      arrowUp(overlay);
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with arrow down when selected date is disabled', () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      arrowDown(overlay);
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with arrow left when selected date is disabled', () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      arrowLeft(overlay);
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 25));
    });

    it('should focus the closest allowed date with arrow right when selected date is disabled', () => {
      overlay.focusedDate = new Date(1999, 5, 10);
      overlay.minDate = new Date(1999, 11, 25);
      arrowRight(overlay);
      expect(overlay.focusedDate).to.eql(new Date(1999, 11, 25));
    });

    it('should focus two-digit years while navigating days', () => {
      const date = new Date(99, 0, 1);
      date.setFullYear(99);
      overlay.focusedDate = date;
      arrowRight(overlay);
      date.setDate(2);
      expect(overlay.focusedDate).to.eql(date);
    });

    it('should focus two-digit years while navigating months', () => {
      const date = new Date(99, 0, 1);
      date.setFullYear(99);
      overlay.focusedDate = date;
      pageDown();
      date.setMonth(1);
      expect(overlay.focusedDate).to.eql(date);
    });

    it('should focus two-digit years while navigating in month', () => {
      const date = new Date(99, 0, 1);
      date.setFullYear(99);
      overlay.focusedDate = date;
      end();
      date.setDate(31);
      expect(overlay.focusedDate).to.eql(date);
    });
  });
});
