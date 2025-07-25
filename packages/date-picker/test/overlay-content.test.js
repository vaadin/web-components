import { expect } from '@vaadin/chai-plugins';
import { click, fixtureSync, listenOnce, tap } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-picker-overlay-content.js';
import { getDefaultI18n, getFirstVisibleItem, monthsEqual, untilOverlayScrolled } from './helpers.js';

async function customizeFixture({ initialPosition, monthScrollerItems, monthScrollerOffset }) {
  const overlay = fixtureSync(`<vaadin-date-picker-overlay-content></vaadin-date-picker-overlay-content>`);
  await untilOverlayScrolled(overlay);
  const monthScroller = overlay._monthScroller;
  monthScroller.style.setProperty('--vaadin-infinite-scroller-buffer-offset', monthScrollerOffset);
  monthScroller.style.height = `${270 * monthScrollerItems}px`;
  overlay.i18n = getDefaultI18n();
  overlay.initialPosition = initialPosition || new Date();
  await untilOverlayScrolled(overlay);

  return overlay;
}

describe('overlay', () => {
  let overlay;

  describe('basic', () => {
    beforeEach(async () => {
      overlay = fixtureSync(`
        <vaadin-date-picker-overlay-content
          style="position: absolute; top: 0; min-width: 300px"
          scroll-duration="0"
        ></vaadin-date-picker-overlay-content>
      `);
      overlay.i18n = getDefaultI18n();
      overlay.initialPosition = new Date(2021, 1, 1);
      await untilOverlayScrolled(overlay);
    });

    it('should mark current year', () => {
      const yearScroller = overlay._yearScroller;

      yearScroller._buffers.forEach((buffer) => {
        [...buffer.children].forEach((slot) => {
          const yearElement = slot._itemWrapper.firstElementChild;
          const isCurrent = yearElement.year === new Date().getFullYear();
          expect(yearElement.hasAttribute('current')).to.equal(isCurrent);
        });
      });
    });

    it('should mark selected year', () => {
      const yearScroller = overlay._yearScroller;
      overlay.selectedDate = new Date();

      yearScroller._buffers.forEach((buffer) => {
        [...buffer.children].forEach((slot) => {
          const yearElement = slot._itemWrapper.firstElementChild;
          const isCurrent = yearElement.year === new Date().getFullYear();
          expect(yearElement.hasAttribute('selected')).to.equal(isCurrent);
        });
      });
    });

    describe('taps', () => {
      let monthScroller, clock;

      beforeEach((done) => {
        monthScroller = overlay._monthScroller;
        clock = sinon.useFakeTimers({
          shouldClearNativeTimers: true,
        });

        // Wait for ignoreTaps to settle after initial scroll event
        listenOnce(monthScroller.$.scroller, 'scroll', () => {
          clock.tick(350);
          done();
        });

        monthScroller.$.scroller.scrollTop += 1;
      });

      afterEach(() => {
        clock.restore();
      });

      it('should set ignoreTaps to calendar on scroll', (done) => {
        listenOnce(monthScroller.$.scroller, 'scroll', () => {
          expect(monthScroller.querySelector('vaadin-month-calendar').ignoreTaps).to.be.true;
          done();
        });

        monthScroller.$.scroller.scrollTop += 1;
      });

      it('should not react to year tap after scroll', (done) => {
        const spy = sinon.spy(overlay, '_scrollToPosition');

        listenOnce(monthScroller.$.scroller, 'scroll', () => {
          tap(overlay._yearScroller);
          expect(spy.called).to.be.false;
          done();
        });

        monthScroller.$.scroller.scrollTop += 1;
      });

      it('should react to year tap after 300ms elapsed after scroll', (done) => {
        const spy = sinon.spy(overlay, '_scrollToPosition');

        listenOnce(monthScroller.$.scroller, 'scroll', () => {
          clock.tick(350);
          tap(overlay._yearScroller);
          expect(spy.called).to.be.true;
          done();
        });

        monthScroller.$.scroller.scrollTop += 1;
      });

      it('should not react if the tap takes more than 300ms', () => {
        const spy = sinon.spy(overlay, '_scrollToPosition');
        overlay._onYearScrollTouchStart();

        clock.tick(350);
        tap(overlay._yearScroller);
        expect(spy.called).to.be.false;
      });
    });

    describe('footer', () => {
      it('should fire close on cancel click', () => {
        const spy = sinon.spy();
        overlay.addEventListener('close', spy);
        click(overlay._cancelButton);
        expect(spy.calledOnce).to.be.true;
      });

      describe('today button', () => {
        it('should scroll to current date', async () => {
          overlay.scrollToDate(new Date(2000, 1, 1));
          await untilOverlayScrolled(overlay);

          const today = new Date();
          const spy = sinon.spy(overlay, 'scrollToDate');
          click(overlay._todayButton);
          await untilOverlayScrolled(overlay);

          expect(spy.calledOnce).to.be.true;
          const date = spy.firstCall.args[0];
          expect(date.getFullYear()).to.equal(today.getFullYear());
          expect(date.getMonth()).to.equal(today.getMonth());
          expect(date.getDate()).to.equal(today.getDate());
        });

        it('should close the overlay and select today if on current month', async () => {
          const today = new Date();
          overlay.scrollToDate(today);
          await untilOverlayScrolled(overlay);

          const spy = sinon.spy();
          overlay.addEventListener('close', spy);
          click(overlay._todayButton);

          expect(overlay.selectedDate.getFullYear()).to.equal(today.getFullYear());
          expect(overlay.selectedDate.getMonth()).to.equal(today.getMonth());
          expect(overlay.selectedDate.getDate()).to.equal(today.getDate());
          expect(spy.calledOnce).to.be.true;
        });

        it('should not close the overlay and not select today if not on current month', async () => {
          const today = new Date();
          overlay.scrollToDate(today);
          await untilOverlayScrolled(overlay);

          const spy = sinon.spy();
          overlay.addEventListener('close', spy);

          overlay._monthScroller.$.scroller.scrollTop -= 1;
          click(overlay._todayButton);

          expect(overlay.selectedDate).to.be.not.ok;
          expect(spy.called).to.be.false;
        });

        it('should do nothing if disabled', async () => {
          const initialDate = new Date(2000, 1, 1);
          overlay.scrollToDate(initialDate);
          await untilOverlayScrolled(overlay);

          const closeSpy = sinon.spy();
          overlay.addEventListener('close', closeSpy);
          const lastScrollPos = overlay._monthScroller.position;

          overlay._todayButton.disabled = true;
          click(overlay._todayButton);

          expect(overlay._monthScroller.position).to.equal(lastScrollPos);
          expect(closeSpy.called).to.be.false;
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
            expect(overlay._todayButton.disabled).to.be.false;
          });

          it('should not be disabled if today is inside the limits', () => {
            overlay.minDate = yesterdayMidnight;
            overlay.maxDate = tomorrowMidnight;
            expect(overlay._todayButton.disabled).to.be.false;
          });

          it('should not be disabled if today is min', () => {
            overlay.minDate = todayMidnight;
            expect(overlay._todayButton.disabled).to.be.false;
          });

          it('should not be disabled if today is max', () => {
            overlay.maxDate = todayMidnight;
            expect(overlay._todayButton.disabled).to.be.false;
          });

          it('should be disabled if the limits are in past', () => {
            overlay.maxDate = yesterdayMidnight;
            expect(overlay._todayButton.disabled).to.be.true;
          });

          it('should be disabled if the limits are in future', () => {
            overlay.minDate = tomorrowMidnight;
            expect(overlay._todayButton.disabled).to.be.true;
          });

          it('should select today if today is max', async () => {
            overlay.maxDate = todayMidnight;
            overlay.scrollToDate(todayMidnight);
            await untilOverlayScrolled(overlay);

            click(overlay._todayButton);

            expect(overlay.selectedDate.getFullYear()).to.equal(todayMidnight.getFullYear());
            expect(overlay.selectedDate.getMonth()).to.equal(todayMidnight.getMonth());
            expect(overlay.selectedDate.getDate()).to.equal(todayMidnight.getDate());
          });
        });
      });
    });
  });

  describe('scrollToDate', () => {
    beforeEach(async () => {
      overlay = fixtureSync(`
        <vaadin-date-picker-overlay-content
          style="position: absolute; top: 0;"
        ></vaadin-date-picker-overlay-content>
      `);
      overlay.i18n = getDefaultI18n();
      overlay.initialPosition = new Date(2021, 1, 1);
      await untilOverlayScrolled(overlay);
    });

    it('should reflect the year of currently visible month on the toolbar', async () => {
      const date = new Date(2000, 1, 1);
      overlay.scrollToDate(date);
      await untilOverlayScrolled(overlay);
      expect(parseInt(overlay.shadowRoot.querySelector('[part="years-toggle-button"]').textContent)).to.equal(2000);
    });

    it('should scroll to the given date', async () => {
      const date = new Date(2000, 1, 1);
      overlay.scrollToDate(date);
      await untilOverlayScrolled(overlay);
      expect(monthsEqual(getFirstVisibleItem(overlay._monthScroller, 0).firstElementChild.month, date)).to.be.true;
    });

    it('should scroll to the given year', async () => {
      const date = new Date(2000, 1, 1);
      overlay.scrollToDate(date);
      await untilOverlayScrolled(overlay);
      const offset = overlay._yearScroller.clientHeight / 2;
      overlay._yearScroller._debouncerUpdateClones.flush();
      expect(getFirstVisibleItem(overlay._yearScroller, offset).firstElementChild.year).to.equal(2000);
    });

    describe('height(visible area) < height(item)', () => {
      let overlay, monthScroller;

      beforeEach(async () => {
        overlay = await customizeFixture({
          initialPosition: new Date(2021, 1, 1),
          monthScrollerItems: 0.5,
          monthScrollerOffset: 0,
        });
        monthScroller = overlay._monthScroller;
      });

      it('should scroll to a sub-month position that approximately shows the week the date is in', () => {
        const initialPosition = monthScroller.position;
        // Scroll to 15th
        overlay.scrollToDate(new Date(2021, 1, 15), false);
        const positionOf15th = monthScroller.position;
        expect(positionOf15th).to.be.greaterThan(initialPosition);
        expect(positionOf15th).to.be.lessThan(initialPosition + 1);
        // Scroll to 28th
        overlay.scrollToDate(new Date(2021, 1, 28), false);
        const positionOf28th = monthScroller.position;
        expect(positionOf28th).to.be.greaterThan(initialPosition);
        expect(positionOf28th).to.be.greaterThan(positionOf15th);
        expect(positionOf28th).to.be.lessThan(initialPosition + 1);
        // Scroll to first of previous month
        overlay.scrollToDate(new Date(2021, 0, 1), false);
        const firstOfPreviousMonthPosition = monthScroller.position;
        expect(firstOfPreviousMonthPosition).to.equal(initialPosition - 1);
        // Scroll to first of next month
        overlay.scrollToDate(new Date(2021, 2, 1), false);
        const firstOfNextMonthPosition = monthScroller.position;
        expect(firstOfNextMonthPosition).to.equal(initialPosition + 1);
      });
    });

    describe('height(visible area) > height(item)', () => {
      let overlay, monthScroller;

      beforeEach(async () => {
        overlay = await customizeFixture({
          initialPosition: new Date(2021, 1, 1),
          monthScrollerItems: 3,
          monthScrollerOffset: 0,
        });
        monthScroller = overlay._monthScroller;
      });

      it('should always scroll to the exact position of the month that the date is in', () => {
        const initialPosition = monthScroller.position;
        // Scroll to 15th
        overlay.scrollToDate(new Date(2021, 1, 15), false);
        const positionOf15th = monthScroller.position;
        expect(positionOf15th).to.equal(initialPosition);
        // Scroll to 28th
        overlay.scrollToDate(new Date(2021, 1, 28), false);
        const positionOf28th = monthScroller.position;
        expect(positionOf28th).to.equal(initialPosition);
        // Scroll to first of previous month
        overlay.scrollToDate(new Date(2021, 0, 1), false);
        const firstOfPreviousMonthPosition = monthScroller.position;
        expect(firstOfPreviousMonthPosition).to.equal(initialPosition - 1);
        // Scroll to first of next month
        overlay.scrollToDate(new Date(2021, 2, 1), false);
        const firstOfNextMonthPosition = monthScroller.position;
        expect(firstOfNextMonthPosition).to.equal(initialPosition + 1);
      });
    });
  });

  describe('revealDate', () => {
    let overlay, monthScroller;

    describe('height(visible area) < height(item)', () => {
      beforeEach(async () => {
        overlay = await customizeFixture({
          initialPosition: new Date(2021, 1, 1),
          monthScrollerItems: 0.5,
          monthScrollerOffset: 0,
        });
        monthScroller = overlay._monthScroller;
      });

      it('should scroll to a position that approximately shows the week the date is in', () => {
        // Starting on first of February
        const initialPosition = monthScroller.position;
        // Scroll to 15th
        overlay.revealDate(new Date(2021, 1, 15), false);
        const positionOf15th = monthScroller.position;
        expect(positionOf15th).to.be.greaterThan(initialPosition);
        expect(positionOf15th).to.be.lessThan(initialPosition + 1);
        // Scroll to 28th
        overlay.revealDate(new Date(2021, 1, 28), false);
        const positionOf28th = monthScroller.position;
        expect(positionOf28th).to.be.greaterThan(initialPosition);
        expect(positionOf28th).to.be.greaterThan(positionOf15th);
        expect(positionOf28th).to.be.lessThan(initialPosition + 1);
        // Scroll to first of previous month
        overlay.revealDate(new Date(2021, 0, 1), false);
        const firstOfPreviousMonthPosition = monthScroller.position;
        expect(firstOfPreviousMonthPosition).to.equal(initialPosition - 1);
        // Scroll to first of next month
        overlay.revealDate(new Date(2021, 2, 1), false);
        const firstOfNextMonthPosition = monthScroller.position;
        expect(firstOfNextMonthPosition).to.equal(initialPosition + 1);
      });
    });

    describe('height(visible area) > height(item)', () => {
      beforeEach(async () => {
        overlay = await customizeFixture({
          initialPosition: new Date(2021, 1, 1),
          monthScrollerItems: 2,
          monthScrollerOffset: 0,
        });
        monthScroller = overlay._monthScroller;
      });

      it('should scroll when the month is above the visible area', () => {
        const position = monthScroller.position;
        overlay.revealDate(new Date(2021, 0, 1), false);
        expect(monthScroller.position).to.equal(position - 1);
      });

      it('should not scroll when the month is within the visible area', () => {
        const position = monthScroller.position;
        overlay.revealDate(new Date(2021, 2, 1), false);
        expect(monthScroller.position).to.equal(position);
      });

      it('should scroll when the month is below the visible area', () => {
        const position = monthScroller.position;
        overlay.revealDate(new Date(2021, 3, 1), false);
        // FIXME: fails with base styles: "expected -51.04545454545455 to equal -51"
        expect(monthScroller.position).to.be.closeTo(position + 1, 0.1);
      });
    });

    describe('offset', () => {
      beforeEach(async () => {
        overlay = await customizeFixture({
          initialPosition: new Date(2021, 1, 1),
          monthScrollerItems: 3,
          monthScrollerOffset: '10%',
        });
        monthScroller = overlay._monthScroller;
      });

      it('should scroll when the month is above the visible area', () => {
        const position = monthScroller.position;
        overlay.revealDate(new Date(2021, 0, 1), false);
        expect(monthScroller.position).to.equal(position - 1 /* The top 10% offset is ensured by CSS */);
      });

      it('should not scroll when the month is within the visible area', () => {
        const position = monthScroller.position;
        overlay.revealDate(new Date(2021, 2, 1), false);
        expect(monthScroller.position).to.equal(position);
      });

      it('should scroll when the month is below the visible area', () => {
        const position = monthScroller.position;
        overlay.revealDate(new Date(2021, 3, 1), false);
        // FIXME: fails with base styles: "expected -51.45454545454545 to equal -51.4"
        expect(monthScroller.position).to.be.closeTo(position + 0.6, 0.1 /* The bottom 10% offset is ensured by JS */);
      });
    });
  });
});
