import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { tap } from '@polymer/iron-test-helpers/mock-interactions.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import '../src/vaadin-date-picker-overlay-content.js';
import { click, getDefaultI18n, getFirstVisibleItem, listenForEvent, monthsEqual } from './common.js';

function waitUntilScrolledTo(overlay, date, callback) {
  if (overlay.$.monthScroller.position) {
    overlay._onMonthScroll();
  }
  var monthIndex = overlay._differenceInMonths(date, new Date());
  if (overlay.$.monthScroller.position === monthIndex) {
    afterNextRender(overlay, callback);
  } else {
    setTimeout(waitUntilScrolledTo, 10, overlay, date, callback);
  }
}

describe('vaadin-date-picker-overlay', () => {
  let overlay;

  beforeEach((done) => {
    overlay = fixtureSync(`
      <vaadin-date-picker-overlay-content
        style="position: absolute; top: 0"
      ></vaadin-date-picker-overlay-content>`);
    overlay.i18n = getDefaultI18n();
    overlay.$.monthScroller.bufferSize = 1;
    overlay.$.yearScroller.bufferSize = 1;
    overlay.initialPosition = new Date();
    afterNextRender(overlay.$.monthScroller, () => waitUntilScrolledTo(overlay, new Date(), done));
  });

  it('should stop tap events from bubbling outside the overlay', () => {
    const tapSpy = sinon.spy();
    document.addEventListener('tap', tapSpy);
    overlay.$.monthScroller.dispatchEvent(new CustomEvent('tap', { bubbles: true }));
    document.removeEventListener('tap', tapSpy);
    expect(tapSpy.called).to.be.false;
  });

  it('should return correct month', () => {
    overlay._originDate = new Date(2016, 2, 31);
    expect(overlay._dateAfterXMonths(11).getMonth()).to.equal(1);
  });

  it('should reflect the year of currently visible month on the toolbar', (done) => {
    const date = new Date(2000, 1, 1);
    overlay.scrollToDate(date);
    waitUntilScrolledTo(overlay, date, () => {
      expect(parseInt(overlay.root.querySelector('[part="years-toggle-button"]').textContent)).to.equal(2000);
      done();
    });
  });

  it('should scroll to the given date', (done) => {
    const date = new Date(2000, 1, 1);
    overlay.scrollToDate(date);
    waitUntilScrolledTo(overlay, date, () => {
      expect(monthsEqual(getFirstVisibleItem(overlay.$.monthScroller, 0).firstElementChild.month, date)).to.be.true;
      done();
    });
  });

  it('should scroll to the given year', (done) => {
    const date = new Date(2000, 1, 1);
    overlay.scrollToDate(date);
    waitUntilScrolledTo(overlay, date, () => {
      var offset = overlay.$.yearScroller.clientHeight / 2;
      overlay.$.yearScroller._debouncerUpdateClones.flush();
      expect(getFirstVisibleItem(overlay.$.yearScroller, offset).firstElementChild.textContent).to.contain('2000');
      done();
    });
  });

  it('should mark current year', () => {
    const yearScroller = overlay.$.yearScroller;

    yearScroller._buffers.forEach((buffer) => {
      Array.from(buffer.children).forEach((insertionPoint) => {
        const year = insertionPoint._itemWrapper.firstElementChild;
        const isCurrent = year.textContent.indexOf(new Date().getFullYear()) > -1;
        expect(year.hasAttribute('current')).to.equal(isCurrent);
      });
    });
  });

  it('should mark selected year', () => {
    const yearScroller = overlay.$.yearScroller;
    overlay.selectedDate = new Date();

    yearScroller._buffers.forEach((buffer) => {
      Array.from(buffer.children).forEach((insertionPoint) => {
        const year = insertionPoint._itemWrapper.firstElementChild;
        const isCurrent = year.textContent.indexOf(new Date().getFullYear()) > -1;
        expect(year.hasAttribute('selected')).to.equal(isCurrent);
      });
    });
  });

  describe('taps', () => {
    beforeEach((done) => {
      // Wait for ignoreTaps to settle after initial scroll event
      listenForEvent(overlay.$.monthScroller.$.scroller, 'scroll', () => setTimeout(done, 350));

      overlay.$.monthScroller.$.scroller.scrollTop += 1;
    });

    it('should set ignoreTaps to calendar on scroll', (done) => {
      listenForEvent(overlay.$.monthScroller.$.scroller, 'scroll', () => {
        expect(overlay.$.monthScroller.querySelector('vaadin-month-calendar').ignoreTaps).to.be.true;
        done();
      });

      overlay.$.monthScroller.$.scroller.scrollTop += 1;
    });

    it('should not react to year tap after scroll', (done) => {
      const spy = sinon.spy(overlay, '_scrollToPosition');

      listenForEvent(overlay.$.monthScroller.$.scroller, 'scroll', () => {
        tap(overlay.$.yearScroller);
        expect(spy.called).to.be.false;
        done();
      });

      overlay.$.monthScroller.$.scroller.scrollTop += 1;
    });

    it('should react to year tap after 300ms elapsed after scroll', (done) => {
      const spy = sinon.spy(overlay, '_scrollToPosition');

      listenForEvent(overlay.$.monthScroller.$.scroller, 'scroll', () => {
        setTimeout(() => {
          tap(overlay.$.yearScroller);
          expect(spy.called).to.be.true;
          done();
        }, 350);
      });

      overlay.$.monthScroller.$.scroller.scrollTop += 1;
    });

    it('should not react if the tap takes more than 300ms', (done) => {
      const spy = sinon.spy(overlay, '_scrollToPosition');
      overlay._onYearScrollTouchStart();

      setTimeout(() => {
        tap(overlay.$.yearScroller);
        expect(spy.called).to.be.false;
        done();
      }, 350);
    });
  });

  describe('header', () => {
    let header, clearButton;

    beforeEach(() => {
      header = overlay.shadowRoot.querySelector('[part="overlay-header"]');
      clearButton = overlay.shadowRoot.querySelector('[part="clear-button"]');
    });

    it('should be visible', () => {
      overlay.setAttribute('fullscreen', '');
      expect(window.getComputedStyle(header).display).to.equal('flex');
    });

    it('should be invisible', () => {
      expect(window.getComputedStyle(header).display).to.equal('none');
    });

    it('should reflect value in label', () => {
      overlay.i18n.formatDate = (date) => date.month + 1 + '/' + date.day + '/' + date.year;
      overlay.selectedDate = new Date(2000, 1, 1);
      expect(overlay.root.querySelector('[part="label"]').textContent.trim()).to.equal('2/1/2000');
    });

    it('should not show clear button if not value is set', () => {
      expect(window.getComputedStyle(clearButton).display).to.equal('none');
    });

    it('should show clear button if value is set', () => {
      overlay.selectedDate = new Date();
      expect(window.getComputedStyle(clearButton).display).to.not.equal('none');
    });

    it('should clear the value', () => {
      overlay.selectedDate = new Date();
      click(clearButton);
      expect(overlay.selectedDate).to.equal('');
    });
  });

  describe('footer', () => {
    it('should fire close on cancel click', () => {
      const spy = sinon.spy();
      overlay.addEventListener('close', spy);
      tap(overlay.$.cancelButton);
      expect(spy.calledOnce).to.be.true;
    });

    describe('today button', () => {
      it('should scroll to current date', (done) => {
        const date = new Date(2000, 1, 1);
        overlay.scrollToDate(date);
        waitUntilScrolledTo(overlay, date, () => {
          tap(overlay.$.todayButton);
          waitUntilScrolledTo(overlay, new Date(), () => {
            done();
          });
        });
      });

      it('should close the overlay and select today if on current month', (done) => {
        const today = new Date();
        overlay.scrollToDate(today);
        const spy = sinon.spy();
        overlay.addEventListener('close', spy);

        waitUntilScrolledTo(overlay, today, () => {
          tap(overlay.$.todayButton);

          expect(overlay.selectedDate.getFullYear()).to.equal(today.getFullYear());
          expect(overlay.selectedDate.getMonth()).to.equal(today.getMonth());
          expect(overlay.selectedDate.getDate()).to.equal(today.getDate());
          expect(spy.calledOnce).to.be.true;
          done();
        });
      });

      it('should not close the overlay and not select today if not on current month', (done) => {
        const today = new Date();
        overlay.scrollToDate(today);
        const spy = sinon.spy();
        overlay.addEventListener('close', spy);

        waitUntilScrolledTo(overlay, today, () => {
          overlay.$.monthScroller.$.scroller.scrollTop -= 1;
          tap(overlay.$.todayButton);

          expect(overlay.selectedDate).to.be.undefined;
          expect(spy.called).to.be.false;
          done();
        });
      });

      it('should do nothing if disabled', (done) => {
        var initialDate = new Date(2000, 1, 1);
        overlay.scrollToDate(initialDate);
        var closeSpy = sinon.spy();
        overlay.addEventListener('close', closeSpy);
        // const scrollSpy = sinon.spy(overlay, 'scrollToDate');

        overlay.$.todayButton.disabled = true;

        waitUntilScrolledTo(overlay, initialDate, () => {
          const lastScrollPos = overlay.$.monthScroller.position;
          tap(overlay.$.todayButton);

          expect(overlay.$.monthScroller.position).to.equal(lastScrollPos);
          // FIXME: fails in FF + Polymer 1.x
          // expect(scrollSpy.called).to.be.false;
          expect(closeSpy.called).to.be.false;
          done();
        });
      });

      describe('date limits', () => {
        let todayMidnight, yesterdayMidnight, tomorrowMidnight;

        beforeEach(() => {
          const today = new Date();
          todayMidnight = new Date(0, 0);
          todayMidnight.setFullYear(today.getFullYear());
          todayMidnight.setMonth(today.getMonth());
          todayMidnight.setDate(today.getDate());
          yesterdayMidnight = new Date(todayMidnight.getTime());
          yesterdayMidnight.setDate(todayMidnight.getDate() - 1);
          tomorrowMidnight = new Date(todayMidnight.getTime());
          tomorrowMidnight.setDate(todayMidnight.getDate() + 1);
          overlay.minDate = null;
          overlay.maxDate = null;
        });

        it('should not be disabled by default', () => {
          expect(overlay.$.todayButton.disabled).to.be.false;
        });

        it('should not be disabled if today is inside the limits', () => {
          overlay.minDate = yesterdayMidnight;
          overlay.maxDate = tomorrowMidnight;
          expect(overlay.$.todayButton.disabled).to.be.false;
        });

        it('should not be disabled if today is min', () => {
          overlay.minDate = todayMidnight;
          expect(overlay.$.todayButton.disabled).to.be.false;
        });

        it('should not be disabled if today is max', () => {
          overlay.maxDate = todayMidnight;
          expect(overlay.$.todayButton.disabled).to.be.false;
        });

        it('should be disabled if the limits are in past', () => {
          overlay.maxDate = yesterdayMidnight;
          expect(overlay.$.todayButton.disabled).to.be.true;
        });

        it('should be disabled if the limits are in future', () => {
          overlay.minDate = tomorrowMidnight;
          expect(overlay.$.todayButton.disabled).to.be.true;
        });
      });
    });
  });
});
