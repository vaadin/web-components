import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, listenOnce, nextRender, nextUpdate, tap } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { DateMetadataController } from '../src/vaadin-date-metadata-controller.js';
import { formatISODate, monthIndex, parseDate } from '../src/vaadin-date-picker-helper.js';
import {
  getCalendars,
  getDateButton,
  getDateCell,
  getDateCells,
  getMonthCalendar,
  isoDate,
  isoDateInMonth,
  open,
} from './helpers.js';

describe('dateMetadataProvider integration', () => {
  let datePicker, overlayContent, today, year, month;

  function getVisibleCell(day, y = year, m = month) {
    return getDateCell(getMonthCalendar(overlayContent, y, m), day);
  }

  function isDisabled(cell) {
    return cell.hasAttribute('disabled') && cell.part.contains('disabled');
  }

  function calendarsWithLoadingDates() {
    return getCalendars(overlayContent)
      .filter((calendar) => calendar.month)
      .filter((calendar) => getDateCells(calendar).some((cell) => cell.part.contains('loading')));
  }

  // Bounded polling: an answer can take more than one render to reach the cells.
  async function untilRendered(predicate) {
    for (let i = 0; i < 50 && !predicate(); i++) {
      await nextRender();
    }
    // One more render, so assertions that follow the polled one see a settled DOM.
    await nextRender();
  }

  // A provider that disables the given day of every month in the requested range.
  function disableDay(day) {
    return ({ start, end }) => {
      const disabled = [];
      for (let month = monthIndex(parseDate(start)); month <= monthIndex(parseDate(end)); month++) {
        disabled.push({ date: isoDateInMonth(month, day), disabled: true });
      }
      return disabled;
    };
  }

  const disableFifteenth = disableDay(15);

  function deferredProvider() {
    let resolveProvider;
    const provider = sinon.stub().callsFake(
      () =>
        new Promise((resolve) => {
          resolveProvider = resolve;
        }),
    );
    return { provider, resolve: (dates) => resolveProvider(dates) };
  }

  async function openWithProvider(provider) {
    datePicker.dateMetadataProvider = provider;
    await open(datePicker);
    overlayContent = datePicker._overlayContent;
  }

  beforeEach(() => {
    datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
    today = new Date();
    year = today.getFullYear();
    month = today.getMonth();
  });

  describe('synchronous provider', () => {
    let cell15, cell16;

    beforeEach(async () => {
      await openWithProvider(disableFifteenth);
      cell15 = getVisibleCell(15);
      cell16 = getVisibleCell(16);
    });

    it('should mark only the provided dates as disabled', () => {
      expect(isDisabled(cell15)).to.be.true;
      expect(isDisabled(cell16)).to.be.false;
    });

    it('should set aria-disabled on a provider-disabled date', () => {
      expect(getDateButton(cell15).getAttribute('aria-disabled')).to.equal('true');
      expect(getDateButton(cell16).getAttribute('aria-disabled')).to.equal('false');
    });

    it('should not report loading for an answer that needs no waiting', () => {
      expect(overlayContent.hasAttribute('loading')).to.be.false;
      expect(overlayContent.hasAttribute('aria-busy')).to.be.false;
      expect(cell15.part.contains('loading')).to.be.false;
      expect(cell16.part.contains('loading')).to.be.false;
    });
  });

  describe('asynchronous provider', () => {
    let provider, resolveProvider, cell15, cell16;

    beforeEach(async () => {
      ({ provider, resolve: resolveProvider } = deferredProvider());
      await openWithProvider(provider);
      cell15 = getVisibleCell(15);
      cell16 = getVisibleCell(16);
    });

    it('should show the loading spinner and mark the calendar busy while pending', () => {
      expect(overlayContent.hasAttribute('loading')).to.be.true;
      expect(overlayContent.getAttribute('aria-busy')).to.equal('true');
      const loader = overlayContent.shadowRoot.querySelector('[part="loader"]');
      expect(loader).to.exist;
      expect(getComputedStyle(loader).display).to.not.equal('none');
    });

    it('should mark the dates of a month being fetched with the loading part', () => {
      expect(cell15.part.contains('loading')).to.be.true;
      expect(cell16.part.contains('loading')).to.be.true;
    });

    it('should keep the dates of a pending month selectable', () => {
      expect(isDisabled(cell15)).to.be.false;
      expect(getDateButton(cell15).getAttribute('aria-disabled')).to.equal('false');
    });

    it('should commit a date picked from a month being fetched', async () => {
      // A pending date is selectable, and the value is re-validated once its month answers.
      const date = new Date(year, month, 15);
      expect(overlayContent._selectDate(date)).to.be.true;
      await nextRender();

      expect(datePicker.value).to.equal(formatISODate(date));
    });

    it('should update the dates and the spinner once the month resolves', async () => {
      resolveProvider(disableFifteenth(provider.firstCall.args[0]));
      await untilRendered(() => {
        const cell = getVisibleCell(15);
        return cell && isDisabled(cell);
      });

      expect(overlayContent.hasAttribute('loading')).to.be.false;
      expect(overlayContent.hasAttribute('aria-busy')).to.be.false;

      expect(isDisabled(cell15)).to.be.true;
      expect(getDateButton(cell15).getAttribute('aria-disabled')).to.equal('true');

      expect(isDisabled(cell16)).to.be.false;
      expect(getDateButton(cell16).getAttribute('aria-disabled')).to.equal('false');

      expect(cell15.part.contains('loading')).to.be.false;
      expect(cell16.part.contains('loading')).to.be.false;
    });

    it('should not re-consult the provider for already loaded months', async () => {
      resolveProvider([]);
      await nextRender();
      provider.resetHistory();

      const monthScroller = overlayContent._monthScroller;
      const scrolled = new Promise((resolve) => {
        listenOnce(monthScroller, 'custom-scroll', resolve);
      });
      monthScroller.$.scroller.scrollTop += 1;
      await scrolled;
      overlayContent._loadDateMetadataDebouncer.flush();
      await nextRender();

      expect(provider).to.not.be.called;
    });

    it('should load the metadata for a month navigated to', async () => {
      resolveProvider(disableFifteenth(provider.firstCall.args[0]));
      await nextRender();
      provider.resetHistory();

      // Navigate far ahead without scrolling — the same code path a year click uses.
      const target = new Date(year + 3, month, 1);
      overlayContent.scrollToDate(target, false);
      overlayContent._loadDateMetadataDebouncer?.flush();
      await nextRender();

      expect(provider).to.be.called;

      resolveProvider(disableFifteenth(provider.lastCall.args[0]));
      await untilRendered(() => {
        const calendar = getMonthCalendar(overlayContent, target.getFullYear(), target.getMonth());
        const cell = calendar && getDateCell(calendar, 15);
        return cell && isDisabled(cell);
      });

      expect(isDisabled(getVisibleCell(15, target.getFullYear(), target.getMonth()))).to.be.true;
    });

    it('should trigger a single load for a continuous scroll', async () => {
      resolveProvider([]);
      await nextRender();
      provider.resetHistory();

      // Several navigation steps in a row, as a drag-scroll produces.
      for (let i = 1; i <= 4; i++) {
        overlayContent.scrollToDate(new Date(year + i, month, 1), false);
      }
      overlayContent._loadDateMetadataDebouncer?.flush();
      await nextRender();

      expect(provider).to.be.calledOnce;
    });

    it('should load the metadata for months reached through the year scroller', async () => {
      // A third navigation path, separate from the month scroller and from `scrollToDate`.
      resolveProvider([]);
      await nextRender();
      provider.resetHistory();

      const yearScroller = overlayContent._yearScroller;
      const scrolled = new Promise((resolve) => {
        listenOnce(yearScroller, 'custom-scroll', resolve);
      });
      yearScroller.$.scroller.scrollTop += yearScroller.itemHeight * 3;
      await scrolled;
      overlayContent._loadDateMetadataDebouncer.flush();
      await nextRender();

      expect(provider).to.be.called;
    });
  });

  it('should not mark dates loading for a load that is only scheduled', async () => {
    await openWithProvider(sinon.stub().returns([]));

    // Navigating only schedules a load, so for a moment the months on screen are not being fetched.
    overlayContent.scrollToDate(new Date(year + 5, 0, 1), false);
    await nextRender();

    expect(overlayContent.hasAttribute('loading')).to.be.false;
    expect(calendarsWithLoadingDates()).to.be.empty;
  });

  it('should mark only the months actually being fetched as loading', async () => {
    // Requests cover whole calendar years, so a view spanning a year boundary can hold one answered
    // year and one still being fetched. Reporting the overlay-wide state per date would mark both.
    let requests = 0;
    datePicker.initialPosition = `${year}-06-01`;
    await openWithProvider(() => {
      requests += 1;
      // Only the year in view when the overlay opened answers; the one reached by scrolling does not.
      return requests === 1 ? [] : new Promise(() => {});
    });
    await nextRender();

    overlayContent.scrollToDate(new Date(year, 11, 1), false);
    overlayContent._loadDateMetadataDebouncer.flush();
    await nextRender();

    const december = getMonthCalendar(overlayContent, year, 11);
    const january = getMonthCalendar(overlayContent, year + 1, 0);
    expect(december, 'December should be rendered').to.exist;
    expect(january, 'January should be rendered').to.exist;
    expect(getDateCell(december, 15).part.contains('loading')).to.be.false;
    expect(getDateCell(january, 15).part.contains('loading')).to.be.true;
  });

  // `new Date(50, ...)` would move a two-digit year into the 1950s, which would break both the range
  // the provider is asked about and the dates the metadata is matched against.
  it('should request and disable the dates of a year below 100', async () => {
    const provider = sinon.stub().returns([{ date: '0050-06-15', disabled: true }]);
    datePicker.initialPosition = '0050-06-01';
    await openWithProvider(provider);

    const { start, end } = provider.firstCall.args[0];
    // Either block can be the one asked about; either way the year is padded, not read as 1950.
    expect(start).to.be.oneOf(['0049-01-01', '0050-01-01']);
    expect(end).to.be.oneOf(['0050-12-31', '0051-12-31']);
    expect(isDisabled(getVisibleCell(15, 50, 5))).to.be.true;
    expect(isDisabled(getVisibleCell(16, 50, 5))).to.be.false;
  });

  it('should disable the dates rejected by any constraint and keep the others enabled', async () => {
    // The 15th is disabled by the provider, the 20th by `isDateDisabled`, and everything before
    // the 10th and after the 25th is out of the min/max range.
    datePicker.isDateDisabled = ({ day }) => day === 20;
    datePicker.min = formatISODate(new Date(year, month, 10));
    datePicker.max = formatISODate(new Date(year, month, 25));
    await openWithProvider(disableFifteenth);

    expect(isDisabled(getVisibleCell(9))).to.be.true;
    expect(isDisabled(getVisibleCell(15))).to.be.true;
    expect(isDisabled(getVisibleCell(20))).to.be.true;
    expect(isDisabled(getVisibleCell(26))).to.be.true;
    expect(isDisabled(getVisibleCell(16))).to.be.false;
  });

  it('should load the metadata again for a cache dropped while closed', async () => {
    const provider = sinon.stub().returns([]);
    await openWithProvider(provider);
    await nextRender();

    datePicker.opened = false;
    await nextRender();
    // The cache survives close and reopen, so drop it to leave something to fetch.
    datePicker._dateMetadataController.clearCache();
    provider.resetHistory();

    await open(datePicker);
    overlayContent._loadDateMetadataDebouncer?.flush();
    await nextRender();

    expect(provider).to.be.called;
  });

  describe('closing the overlay', () => {
    let provider;

    beforeEach(async () => {
      provider = sinon.stub().returns([]);
      await openWithProvider(provider);
    });

    it('should not call the provider for a load scheduled before it closed', async () => {
      // Navigate to schedule a load, then dismiss the overlay before the debouncer fires.
      overlayContent.scrollToDate(new Date(year + 5, 0, 1), false);
      provider.resetHistory();
      datePicker.opened = false;
      await nextRender();

      overlayContent._loadDateMetadataDebouncer.flush();
      await nextRender();

      expect(provider).to.not.be.called;
    });

    it('should not call the provider when config changes while it is closed', async () => {
      // The overlay content outlives closing, so a config change still reaches it and reconfigures the
      // calendars. Loading from there would fetch for a hidden dialog and leave the spinner on it.
      await nextRender();
      datePicker.opened = false;
      await nextRender();
      // Drop the cache, so there would be something to fetch if a config change asked for it.
      datePicker._dateMetadataController.clearCache();
      provider.resetHistory();

      datePicker.min = formatISODate(new Date(year - 1, 0, 1));
      await nextRender();

      expect(provider).to.not.be.called;
      expect(overlayContent.hasAttribute('loading')).to.be.false;
      expect(overlayContent.hasAttribute('aria-busy')).to.be.false;
    });

    it('should not call the provider for a load scheduled before the date-picker was removed', () => {
      // Closing can be deferred by the animation, so the load has to be dropped as soon as the
      // calendar leaves the DOM. Flushed without awaiting, to stay inside that window.
      overlayContent.scrollToDate(new Date(year + 5, 0, 1), false);
      provider.resetHistory();
      datePicker.remove();

      overlayContent._loadDateMetadataDebouncer.flush();

      expect(provider).to.not.be.called;
    });
  });

  describe('selection', () => {
    beforeEach(async () => {
      await openWithProvider(disableFifteenth);
    });

    it('should not select a provider-disabled date', async () => {
      expect(overlayContent._selectDate(new Date(year, month, 15))).to.be.false;
      await nextRender();

      expect(datePicker.value).to.equal('');
    });

    it('should still select a date the provider allows', () => {
      expect(overlayContent._selectDate(new Date(year, month, 16))).to.be.true;
    });

    // Clicking does not go through `_selectDate`; only the rendered `disabled` attribute stops it, so
    // the mouse path needs covering on its own.
    it('should not commit a provider-disabled date on tap', async () => {
      tap(getVisibleCell(15));
      await nextRender();

      expect(datePicker.value).to.equal('');
      expect(datePicker.opened).to.be.true;
    });

    it('should commit an allowed date on tap', async () => {
      tap(getVisibleCell(16));
      await nextRender();

      expect(datePicker.value).to.equal(formatISODate(new Date(year, month, 16)));
    });
  });

  describe('today button', () => {
    function todayMetadata() {
      return { date: isoDate(year, month, today.getDate()), disabled: true };
    }

    it('should disable the today button once the provider reports today as disabled', async () => {
      const { provider, resolve } = deferredProvider();
      await openWithProvider(provider);

      // Applied imperatively to a slotted element, so it only refreshes via the host callback.
      resolve([todayMetadata()]);
      await nextRender();

      expect(overlayContent._todayButton.disabled).to.be.true;
    });

    it('should keep the today button enabled while today is not known to be disabled', async () => {
      // A never-resolving provider: today's month stays pending, and a pending date is selectable.
      await openWithProvider(() => new Promise(() => {}));

      expect(overlayContent._todayButton.disabled).to.be.false;
    });

    it('should re-enable the today button when the provider stops disabling today', async () => {
      let disabled = [todayMetadata()];
      await openWithProvider(() => disabled);
      expect(overlayContent._todayButton.disabled).to.be.true;

      disabled = [];
      datePicker._dateMetadataController.clearCache();
      // Refilled explicitly, so the button re-enables from a fresh answer and not an empty cache.
      overlayContent.loadVisibleDateMetadata();
      await nextRender();

      expect(overlayContent._todayButton.disabled).to.be.false;
    });

    it('should keep the today button disabled while the provider still disables today', async () => {
      // The counterpart of the test above: an unchanged answer must not re-enable the button.
      await openWithProvider(() => [todayMetadata()]);
      expect(overlayContent._todayButton.disabled).to.be.true;

      datePicker._dateMetadataController.clearCache();
      overlayContent.loadVisibleDateMetadata();
      await nextRender();

      expect(overlayContent._todayButton.disabled).to.be.true;
    });
  });

  describe('notification', () => {
    beforeEach(async () => {
      await openWithProvider(() => []);
    });

    it('should invalidate every rendered calendar', () => {
      const calendars = getCalendars(overlayContent);
      expect(calendars.length).to.be.above(0);
      const spies = calendars.map((calendar) => sinon.spy(calendar, 'requestUpdate'));

      datePicker._dateMetadataController.clearCache();

      spies.forEach((spy) => expect(spy).to.be.called);
    });

    it('should subscribe the calendars to a controller assigned after everything else', async () => {
      const replacement = new DateMetadataController(datePicker, () => {});
      replacement.setProvider(() => []);
      overlayContent._dateMetadataController = replacement;
      await nextUpdate(overlayContent);

      const calendar = getCalendars(overlayContent)[0];
      expect(calendar._dateMetadataController).to.equal(replacement);

      const spy = sinon.spy(calendar, 'requestUpdate');
      replacement.clearCache();
      expect(spy).to.be.called;
    });

    it('should not invalidate the overlay content', () => {
      // It triggers loads from inside its own update, so subscribing it would invalidate it mid-update.
      const spy = sinon.spy(overlayContent, 'requestUpdate');

      datePicker._dateMetadataController.clearCache();

      expect(spy).to.not.be.called;
    });

    it('should coalesce the notifications that land in one task into one host pass', async () => {
      // Let the load that opening started settle, so only what this test triggers is counted.
      await nextRender();
      // Observed through what the host callback does, rather than by spying on the callback itself.
      const spy = sinon.spy(overlayContent, 'updateTodayButton');
      const controller = datePicker._dateMetadataController;

      // The two starts coalesce into one callback and the two resolutions into another, so two is the
      // coalesced count here, not one: a start and its answer are always separate tasks.
      controller.ensureRangeLoaded(new Date(2030, 5, 1), new Date(2030, 5, 30));
      controller.ensureRangeLoaded(new Date(2035, 5, 1), new Date(2035, 5, 30));
      await nextRender();

      expect(spy).to.be.calledTwice;
    });
  });

  describe('provider set before the first render', () => {
    let element;

    afterEach(() => {
      element.remove();
    });

    it('should consult a provider set before connecting when the overlay opens', async () => {
      const provider = sinon.stub().returns([{ date: isoDate(year, month, 15), disabled: true }]);
      element = document.createElement('vaadin-date-picker');
      element.dateMetadataProvider = provider;
      document.body.appendChild(element);
      await open(element);
      overlayContent = element._overlayContent;

      expect(provider).to.be.called;
      expect(isDisabled(getVisibleCell(15))).to.be.true;
    });
  });

  describe('provider changes', () => {
    it('should reload the visible range for a new provider', async () => {
      await openWithProvider(disableFifteenth);
      const cell15 = getVisibleCell(15);
      const cell16 = getVisibleCell(16);
      expect(isDisabled(cell15)).to.be.true;

      // Assigning a new function drops the cache, which has to be refilled for what is on screen.
      datePicker.dateMetadataProvider = disableDay(16);
      await untilRendered(() => isDisabled(cell16));

      expect(isDisabled(cell16)).to.be.true;
      expect(isDisabled(cell15)).to.be.false;
    });

    it('should disable nothing once the provider is removed', async () => {
      await openWithProvider(disableFifteenth);
      const cell15 = getVisibleCell(15);
      expect(isDisabled(cell15)).to.be.true;

      datePicker.dateMetadataProvider = undefined;
      await untilRendered(() => !isDisabled(cell15));

      expect(isDisabled(cell15)).to.be.false;
      expect(cell15.part.contains('loading')).to.be.false;
    });

    it('should stop loading when the provider is removed while a request is in flight', async () => {
      // Otherwise the spinner and `aria-busy` would be left on for a request whose answer can no
      // longer arrive.
      await openWithProvider(() => new Promise(() => {}));
      expect(overlayContent.hasAttribute('loading')).to.be.true;

      datePicker.dateMetadataProvider = null;
      await untilRendered(() => !overlayContent.hasAttribute('loading'));

      expect(overlayContent.hasAttribute('loading')).to.be.false;
      expect(overlayContent.hasAttribute('aria-busy')).to.be.false;
      expect(getVisibleCell(15).part.contains('loading')).to.be.false;
    });
  });

  describe('failing provider', () => {
    // A failed month stays retryable, but nothing may retry it on its own: a retry triggered by the
    // failure would never yield.
    [
      {
        name: 'throwing',
        provider: () => {
          throw new Error('provider error');
        },
      },
      { name: 'rejecting', provider: () => Promise.reject(new Error('provider error')) },
    ].forEach(({ name, provider }) => {
      describe(name, () => {
        let spy;

        beforeEach(async () => {
          // The controller logs provider failures; keep them out of the test output.
          sinon.stub(console, 'error');
          spy = sinon.spy(provider);
          await openWithProvider(spy);
        });

        afterEach(() => {
          console.error.restore();
        });

        it('should not retry in reaction to the failure', async () => {
          const callsAfterOpen = spy.callCount;
          await nextRender();
          await nextRender();

          expect(spy).to.have.callCount(callsAfterOpen);
        });

        it('should stop loading and disable nothing', async () => {
          await nextRender();

          expect(overlayContent.hasAttribute('loading')).to.be.false;
          expect(overlayContent.hasAttribute('aria-busy')).to.be.false;

          const cell = getVisibleCell(15);
          expect(isDisabled(cell)).to.be.false;
          expect(cell.part.contains('loading')).to.be.false;
        });

        it('should retry when the user navigates', async () => {
          await nextRender();
          spy.resetHistory();

          overlayContent.scrollToDate(new Date(year + 3, month, 1), false);
          overlayContent._loadDateMetadataDebouncer?.flush();
          await nextRender();

          expect(spy).to.be.called;
        });
      });
    });
  });
});
