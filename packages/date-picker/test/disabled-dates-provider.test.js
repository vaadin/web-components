import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { open } from './helpers.js';

describe('disabledDatesProvider integration', () => {
  let datePicker, today, year, month;

  function getMonthCalendar(y, m) {
    return [...datePicker._overlayContent.querySelectorAll('vaadin-month-calendar')].find(
      (calendar) => calendar.month && calendar.month.getFullYear() === y && calendar.month.getMonth() === m,
    );
  }

  function getCell(calendar, day) {
    return [...calendar.shadowRoot.querySelectorAll('[part~="date"]:not(:empty)')].find(
      (cell) => cell.date.getDate() === day,
    );
  }

  function isDisabled(cell) {
    return cell.hasAttribute('disabled') && cell.part.contains('disabled');
  }

  // Waits (bounded) until the predicate holds, to absorb the multi-step reactive chain that runs
  // after a provider resolves (resolve -> version bump -> calendars re-render), which can span
  // more than one render on slower browsers.
  async function untilRendered(predicate) {
    for (let i = 0; i < 50 && !predicate(); i++) {
      await nextRender();
    }
  }

  // A provider that disables the 15th of every month in the requested range.
  function disableFifteenth({ start, end }) {
    const disabled = [];
    const first = new Date(start.year, start.month, start.day);
    const last = new Date(end.year, end.month, end.day);
    const days = Math.round((last - first) / (24 * 60 * 60 * 1000));
    for (let i = 0; i <= days; i++) {
      const date = new Date(first.getFullYear(), first.getMonth(), first.getDate() + i);
      if (date.getDate() === 15) {
        disabled.push({ year: date.getFullYear(), month: date.getMonth(), day: date.getDate() });
      }
    }
    return disabled;
  }

  beforeEach(() => {
    datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
    today = new Date();
    year = today.getFullYear();
    month = today.getMonth();
  });

  describe('synchronous provider', () => {
    beforeEach(async () => {
      datePicker.disabledDatesProvider = disableFifteenth;
      await open(datePicker);
    });

    it('should mark only the provided dates as disabled', () => {
      const calendar = getMonthCalendar(year, month);
      expect(isDisabled(getCell(calendar, 15))).to.be.true;
      expect(isDisabled(getCell(calendar, 16))).to.be.false;
    });

    it('should not show the loading spinner for a synchronous result', () => {
      expect(datePicker._overlayContent.hasAttribute('loading')).to.be.false;
    });
  });

  describe('asynchronous provider', () => {
    let provider, resolveProvider;

    beforeEach(async () => {
      provider = sinon.stub().callsFake(
        () =>
          new Promise((resolve) => {
            resolveProvider = resolve;
          }),
      );
      datePicker.disabledDatesProvider = provider;
      await open(datePicker);
    });

    it('should consult the provider for a range wider than a single month', () => {
      const { start, end } = provider.firstCall.args[0];
      const months = (end.year - start.year) * 12 + (end.month - start.month);
      expect(months).to.be.greaterThan(1);
    });

    it('should show the loading spinner and mark the calendar busy while pending', () => {
      expect(datePicker._overlayContent.hasAttribute('loading')).to.be.true;
      expect(datePicker._overlayContent.getAttribute('aria-busy')).to.equal('true');
      const loader = datePicker._overlayContent.shadowRoot.querySelector('[part="loader"]');
      expect(loader).to.exist;
      expect(getComputedStyle(loader).display).to.not.equal('none');
    });

    it('should hide the spinner and mark the provided dates disabled after resolving', async () => {
      resolveProvider(disableFifteenth(provider.firstCall.args[0]));
      // The 16th is disabled (pending) while loading and becomes enabled once resolved.
      await untilRendered(() => {
        const calendar = getMonthCalendar(year, month);
        const cell = calendar && getCell(calendar, 16);
        return cell && !isDisabled(cell);
      });

      expect(datePicker._overlayContent.hasAttribute('loading')).to.be.false;
      expect(datePicker._overlayContent.hasAttribute('aria-busy')).to.be.false;
      const calendar = getMonthCalendar(year, month);
      expect(isDisabled(getCell(calendar, 15))).to.be.true;
      expect(isDisabled(getCell(calendar, 16))).to.be.false;
    });

    it('should not re-consult the provider for already loaded months', async () => {
      resolveProvider([]);
      await nextRender();
      provider.resetHistory();

      // Re-trigger a load for the same visible months (scroll loading is debounced).
      datePicker._overlayContent._onMonthScroll();
      datePicker._overlayContent._loadDisabledDatesDebouncer?.flush();
      await nextRender();

      expect(provider).to.not.be.called;
    });

    it('should load disabled dates when navigating to another month (e.g. via the year scroller)', async () => {
      resolveProvider(disableFifteenth(provider.firstCall.args[0]));
      await nextRender();
      provider.resetHistory();

      // Navigate far ahead without scrolling — the same code path a year click uses.
      const target = new Date(year + 3, month, 1);
      datePicker._overlayContent.scrollToDate(target, false);
      datePicker._overlayContent._loadDisabledDatesDebouncer?.flush();
      await nextRender();

      expect(provider).to.be.called;
      const { start, end } = provider.lastCall.args[0];
      const targetIndex = target.getFullYear() * 12 + target.getMonth();
      expect(start.year * 12 + start.month).to.be.at.most(targetIndex);
      expect(end.year * 12 + end.month).to.be.at.least(targetIndex);

      resolveProvider(disableFifteenth(provider.lastCall.args[0]));
      // Wait until the target month resolves (its 16th, disabled while pending, becomes enabled).
      await untilRendered(() => {
        const calendar = getMonthCalendar(target.getFullYear(), target.getMonth());
        const cell = calendar && getCell(calendar, 16);
        return cell && !isDisabled(cell);
      });

      const calendar = getMonthCalendar(target.getFullYear(), target.getMonth());
      expect(isDisabled(getCell(calendar, 15))).to.be.true;
    });
  });

  // The overlay is never opened here: validation must consult the provider on its own, otherwise a
  // value typed with auto-open disabled, or set programmatically, would be accepted even though the
  // provider disables it.
  describe('validation without opening the overlay', () => {
    it('should invalidate a disabled value with a synchronous provider', () => {
      datePicker.disabledDatesProvider = disableFifteenth;
      datePicker.value = '2020-01-15';
      expect(datePicker._overlayContent).to.be.not.ok;
      expect(datePicker.validate()).to.be.false;
      expect(datePicker.invalid).to.be.true;
    });

    it('should keep an enabled value valid with a synchronous provider', () => {
      datePicker.disabledDatesProvider = disableFifteenth;
      datePicker.value = '2020-01-16';
      expect(datePicker.validate()).to.be.true;
      expect(datePicker.invalid).to.be.false;
    });

    it('should invalidate a disabled value once an asynchronous provider resolves', async () => {
      let resolveProvider;
      const provider = sinon.stub().callsFake(
        () =>
          new Promise((resolve) => {
            resolveProvider = resolve;
          }),
      );
      datePicker.disabledDatesProvider = provider;
      datePicker.value = '2020-01-15';

      // The provider has not answered yet, so the value is treated as valid for now.
      expect(datePicker.validate()).to.be.true;
      expect(provider).to.be.called;

      resolveProvider(disableFifteenth(provider.firstCall.args[0]));
      await untilRendered(() => datePicker.invalid);

      expect(datePicker._overlayContent).to.be.not.ok;
      expect(datePicker.invalid).to.be.true;
      expect(datePicker.checkValidity()).to.be.false;
    });
  });

  describe('initial focus', () => {
    beforeEach(() => {
      datePicker.disabledDatesProvider = disableFifteenth;
    });

    it('should move initial focus off a provider-disabled date once the provider resolves', async () => {
      datePicker.initialPosition = '2020-01-15';
      await open(datePicker);
      const content = datePicker._overlayContent;

      await untilRendered(() => content.focusedDate && content.focusedDate.getDate() !== 15);

      // The 15th is disabled, so focus moves to the closest selectable date, the 16th.
      expect(content.focusedDate.getFullYear()).to.equal(2020);
      expect(content.focusedDate.getMonth()).to.equal(0);
      expect(content.focusedDate.getDate()).to.equal(16);
    });

    it('should keep initial focus on an enabled initial position', async () => {
      datePicker.initialPosition = '2020-01-10';
      await open(datePicker);
      const content = datePicker._overlayContent;

      await untilRendered(() => content._disabledDatesController.isMonthLoaded(new Date(2020, 0, 10)));

      expect(content.focusedDate.getDate()).to.equal(10);
    });

    it('should not move focus the user has navigated to a disabled date', async () => {
      let resolveProvider;
      const provider = sinon.stub().callsFake(
        () =>
          new Promise((resolve) => {
            resolveProvider = resolve;
          }),
      );
      datePicker.disabledDatesProvider = provider;
      datePicker.initialPosition = '2020-01-10';
      await open(datePicker);
      const content = datePicker._overlayContent;

      // User navigates to the 15th (disabled but focusable) before the provider resolves.
      content.focusedDate = new Date(2020, 0, 15);
      resolveProvider(disableFifteenth(provider.firstCall.args[0]));
      await untilRendered(() => content._disabledDatesController.isMonthLoaded(new Date(2020, 0, 15)));

      // Focus stays on the user's chosen date; disabled dates remain keyboard-focusable.
      expect(content.focusedDate.getDate()).to.equal(15);
    });
  });
});
