import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, listenOnce, nextRender, nextUpdate, tap } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { DateMetadataController } from '../src/vaadin-date-metadata-controller.js';
import { formatISODate } from '../src/vaadin-date-picker-helper.js';
import { getCalendars, getDateCell, getDateCells, getMonthCalendar, open } from './helpers.js';

describe('dateMetadataProvider integration', () => {
  let datePicker, overlayContent, today, year, month;

  function getVisibleCell(day, y = year, m = month) {
    return getDateCell(getMonthCalendar(overlayContent, y, m), day);
  }

  function isDisabled(cell) {
    return cell.hasAttribute('disabled') && cell.part.contains('disabled');
  }

  function hasPart(cell, part) {
    return cell.part.contains(part);
  }

  // Bounded polling: an answer can take more than one render to reach the cells.
  async function untilRendered(predicate) {
    for (let i = 0; i < 50 && !predicate(); i++) {
      await nextRender();
    }
    // One more render, so assertions that follow the polled one see a settled DOM.
    await nextRender();
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
        disabled.push({ year: date.getFullYear(), month: date.getMonth(), day: date.getDate(), disabled: true });
      }
    }
    return disabled;
  }

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

  beforeEach(() => {
    datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
    today = new Date();
    year = today.getFullYear();
    month = today.getMonth();
  });

  describe('synchronous provider', () => {
    beforeEach(async () => {
      datePicker.dateMetadataProvider = disableFifteenth;
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
    });

    it('should mark only the provided dates as disabled', () => {
      expect(isDisabled(getVisibleCell(15))).to.be.true;
      expect(isDisabled(getVisibleCell(16))).to.be.false;
    });

    it('should set aria-disabled on a provider-disabled date', () => {
      expect(getVisibleCell(15).getAttribute('aria-disabled')).to.equal('true');
      expect(getVisibleCell(16).getAttribute('aria-disabled')).to.equal('false');
    });

    it('should not mark any date as loading', () => {
      expect(hasPart(getVisibleCell(15), 'loading')).to.be.false;
      expect(hasPart(getVisibleCell(16), 'loading')).to.be.false;
    });

    it('should not show the loading spinner for a synchronous result', () => {
      expect(overlayContent.hasAttribute('loading')).to.be.false;
      expect(overlayContent.hasAttribute('aria-busy')).to.be.false;
    });
  });

  describe('asynchronous provider', () => {
    let provider, resolveProvider;

    beforeEach(async () => {
      ({ provider, resolve: resolveProvider } = deferredProvider());
      datePicker.dateMetadataProvider = provider;
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
    });

    it('should consult the provider for a range wider than a single month', () => {
      const { start, end } = provider.firstCall.args[0];
      const months = (end.year - start.year) * 12 + (end.month - start.month);
      expect(months).to.be.greaterThan(1);
    });

    it('should show the loading spinner and mark the calendar busy while pending', () => {
      expect(overlayContent.hasAttribute('loading')).to.be.true;
      expect(overlayContent.getAttribute('aria-busy')).to.equal('true');
      const loader = overlayContent.shadowRoot.querySelector('[part="loader"]');
      expect(loader).to.exist;
      expect(getComputedStyle(loader).display).to.not.equal('none');
    });

    it('should mark the dates of a month being fetched with the loading part', () => {
      expect(hasPart(getVisibleCell(15), 'loading')).to.be.true;
      expect(hasPart(getVisibleCell(16), 'loading')).to.be.true;
    });

    it('should keep the dates of a pending month selectable', () => {
      expect(isDisabled(getVisibleCell(15))).to.be.false;
      expect(getVisibleCell(15).getAttribute('aria-disabled')).to.equal('false');
    });

    it('should commit a date picked from a month being fetched', async () => {
      // Nothing corrects the commit afterwards yet: a date the provider turns out to disable stays
      // committed and valid.
      const date = new Date(year, month, 15);
      expect(overlayContent._selectDate(date)).to.be.true;
      await nextRender();

      expect(datePicker.value).to.equal(formatISODate(date));
    });

    it('should hide the spinner and mark the provided dates disabled after resolving', async () => {
      resolveProvider(disableFifteenth(provider.firstCall.args[0]));
      await untilRendered(() => {
        const cell = getVisibleCell(15);
        return cell && isDisabled(cell);
      });

      expect(overlayContent.hasAttribute('loading')).to.be.false;
      expect(overlayContent.hasAttribute('aria-busy')).to.be.false;
      expect(isDisabled(getVisibleCell(15))).to.be.true;
      expect(isDisabled(getVisibleCell(16))).to.be.false;
    });

    it('should drop the loading part once the month resolves', async () => {
      resolveProvider([]);
      await untilRendered(() => !hasPart(getVisibleCell(16), 'loading'));

      expect(hasPart(getVisibleCell(15), 'loading')).to.be.false;
      expect(hasPart(getVisibleCell(16), 'loading')).to.be.false;
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
      const { start, end } = provider.lastCall.args[0];
      const targetIndex = target.getFullYear() * 12 + target.getMonth();
      expect(start.year * 12 + start.month).to.be.at.most(targetIndex);
      expect(end.year * 12 + end.month).to.be.at.least(targetIndex);

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

    it('should set aria-disabled once the provider reports the date as disabled', async () => {
      // The synchronous case is covered above; here the attribute has to follow a later answer.
      expect(getVisibleCell(15).getAttribute('aria-disabled')).to.equal('false');

      resolveProvider(disableFifteenth(provider.firstCall.args[0]));
      await untilRendered(() => getVisibleCell(15)?.getAttribute('aria-disabled') === 'true');

      expect(getVisibleCell(15).getAttribute('aria-disabled')).to.equal('true');
      expect(getVisibleCell(16).getAttribute('aria-disabled')).to.equal('false');
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

  describe('loading dates and the loading indicator', () => {
    // The dates and the indicator report the same thing, so they must never disagree.
    function calendarsWithLoadingDates() {
      return getCalendars(overlayContent)
        .filter((calendar) => calendar.month)
        .filter((calendar) => getDateCells(calendar).some((cell) => cell.part.contains('loading')));
    }

    beforeEach(async () => {
      // Synchronous, so a settled range leaves nothing in flight.
      datePicker.dateMetadataProvider = sinon.stub().returns([]);
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
    });

    it('should not mark any date loading while nothing is being fetched', async () => {
      // Navigating only schedules a load, so for a moment the months on screen are not being fetched.
      overlayContent.scrollToDate(new Date(year + 5, 0, 1), false);
      await nextRender();

      expect(overlayContent.hasAttribute('loading')).to.be.false;
      expect(calendarsWithLoadingDates()).to.be.empty;
    });

    it('should mark dates loading while a request is in flight', async () => {
      datePicker.dateMetadataProvider = () => new Promise(() => {});
      await nextRender();

      expect(overlayContent.hasAttribute('loading')).to.be.true;
      expect(calendarsWithLoadingDates()).to.not.be.empty;
    });
  });

  describe('months in different states at once', () => {
    it('should mark only the months actually being fetched as loading', async () => {
      // Requests cover whole calendar years, so a view spanning a year boundary can hold one answered
      // year and one still being fetched. Reporting the overlay-wide state per date would mark both.
      let requests = 0;
      const provider = sinon.stub().callsFake(() => {
        requests += 1;
        // Only the year in view when the overlay opened answers; the one reached by scrolling does not.
        return requests === 1 ? [] : new Promise(() => {});
      });
      datePicker.dateMetadataProvider = provider;
      datePicker.initialPosition = `${year}-06-01`;
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
      await nextRender();

      overlayContent.scrollToDate(new Date(year, 11, 1), false);
      overlayContent._loadDateMetadataDebouncer.flush();
      await nextRender();

      const december = getMonthCalendar(overlayContent, year, 11);
      const january = getMonthCalendar(overlayContent, year + 1, 0);
      expect(december, 'December should be rendered').to.exist;
      expect(january, 'January should be rendered').to.exist;
      expect(hasPart(getDateCell(december, 15), 'loading')).to.be.false;
      expect(hasPart(getDateCell(january, 15), 'loading')).to.be.true;
    });
  });

  describe('closing the overlay', () => {
    it('should not call the provider for a load scheduled before it closed', async () => {
      const provider = sinon.stub().returns([]);
      datePicker.dateMetadataProvider = provider;
      await open(datePicker);
      overlayContent = datePicker._overlayContent;

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
      const provider = sinon.stub().returns([]);
      datePicker.dateMetadataProvider = provider;
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
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

    it('should not call the provider for a load scheduled before the date-picker was removed', async () => {
      const provider = sinon.stub().returns([]);
      datePicker.dateMetadataProvider = provider;
      await open(datePicker);
      overlayContent = datePicker._overlayContent;

      // Closing can be deferred by the animation, so the load has to be dropped as soon as the
      // calendar leaves the DOM. Flushed without awaiting, to stay inside that window.
      overlayContent.scrollToDate(new Date(year + 5, 0, 1), false);
      provider.resetHistory();
      datePicker.remove();

      overlayContent._loadDateMetadataDebouncer.flush();

      expect(provider).to.not.be.called;
    });
  });

  describe('combined with the other constraints', () => {
    beforeEach(async () => {
      // The 15th is disabled by the provider, the 20th by `isDateDisabled`, and everything before
      // the 10th and after the 25th is out of the min/max range.
      datePicker.dateMetadataProvider = disableFifteenth;
      datePicker.isDateDisabled = ({ day }) => day === 20;
      datePicker.min = formatISODate(new Date(year, month, 10));
      datePicker.max = formatISODate(new Date(year, month, 25));
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
    });

    it('should disable dates rejected by any of the constraints', () => {
      expect(isDisabled(getVisibleCell(9))).to.be.true;
      expect(isDisabled(getVisibleCell(15))).to.be.true;
      expect(isDisabled(getVisibleCell(20))).to.be.true;
      expect(isDisabled(getVisibleCell(26))).to.be.true;
    });

    it('should keep a date allowed by all of the constraints enabled', () => {
      expect(isDisabled(getVisibleCell(16))).to.be.false;
    });
  });

  describe('selection', () => {
    beforeEach(async () => {
      datePicker.dateMetadataProvider = disableFifteenth;
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
    });

    it('should refuse to select a provider-disabled date', () => {
      expect(overlayContent._selectDate(new Date(year, month, 15))).to.be.false;
    });

    it('should not commit a provider-disabled date', async () => {
      overlayContent._selectDate(new Date(year, month, 15));
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
      return { year, month, day: today.getDate(), disabled: true };
    }

    it('should disable the today button once the provider reports today as disabled', async () => {
      const { provider, resolve } = deferredProvider();
      datePicker.dateMetadataProvider = provider;
      await open(datePicker);
      overlayContent = datePicker._overlayContent;

      // Applied imperatively to a slotted element, so it only refreshes via the host callback.
      resolve([todayMetadata()]);
      await nextRender();

      expect(overlayContent._todayButton.disabled).to.be.true;
    });

    it('should keep the today button enabled while today is not known to be disabled', async () => {
      // A never-resolving provider: today's month stays pending, and a pending date is selectable.
      datePicker.dateMetadataProvider = () => new Promise(() => {});
      await open(datePicker);
      overlayContent = datePicker._overlayContent;

      expect(overlayContent._todayButton.disabled).to.be.false;
    });

    it('should re-enable the today button when the provider stops disabling today', async () => {
      let disabled = [todayMetadata()];
      datePicker.dateMetadataProvider = () => disabled;
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
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
      datePicker.dateMetadataProvider = () => [todayMetadata()];
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
      expect(overlayContent._todayButton.disabled).to.be.true;

      datePicker._dateMetadataController.clearCache();
      overlayContent.loadVisibleDateMetadata();
      await nextRender();

      expect(overlayContent._todayButton.disabled).to.be.true;
    });
  });

  describe('notification', () => {
    beforeEach(async () => {
      datePicker.dateMetadataProvider = () => [];
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
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
      const provider = sinon.stub().returns([{ year, month, day: 15, disabled: true }]);
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
      datePicker.dateMetadataProvider = disableFifteenth;
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
      expect(isDisabled(getVisibleCell(15))).to.be.true;

      // Assigning a new function drops the cache, which has to be refilled for what is on screen.
      datePicker.dateMetadataProvider = ({ start, end }) =>
        disableFifteenth({ start, end }).map((entry) => ({ ...entry, day: 16 }));
      await untilRendered(() => {
        const cell = getVisibleCell(16);
        return cell && isDisabled(cell);
      });

      expect(isDisabled(getVisibleCell(16))).to.be.true;
      expect(isDisabled(getVisibleCell(15))).to.be.false;
    });

    it('should re-consult a newly assigned provider', async () => {
      datePicker.dateMetadataProvider = disableFifteenth;
      await open(datePicker);
      const provider = sinon.spy(disableFifteenth);

      datePicker.dateMetadataProvider = provider;
      await nextRender();

      expect(provider).to.be.called;
    });

    it('should disable nothing once the provider is removed', async () => {
      datePicker.dateMetadataProvider = disableFifteenth;
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
      expect(isDisabled(getVisibleCell(15))).to.be.true;

      datePicker.dateMetadataProvider = undefined;
      await untilRendered(() => !isDisabled(getVisibleCell(15)));

      expect(isDisabled(getVisibleCell(15))).to.be.false;
      expect(hasPart(getVisibleCell(15), 'loading')).to.be.false;
    });

    it('should stop loading when the provider is removed while a request is in flight', async () => {
      // Otherwise the spinner and `aria-busy` would be left on for a request whose answer can no
      // longer arrive.
      datePicker.dateMetadataProvider = () => new Promise(() => {});
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
      expect(overlayContent.hasAttribute('loading')).to.be.true;

      datePicker.dateMetadataProvider = null;
      await untilRendered(() => !overlayContent.hasAttribute('loading'));

      expect(overlayContent.hasAttribute('loading')).to.be.false;
      expect(overlayContent.hasAttribute('aria-busy')).to.be.false;
      expect(hasPart(getVisibleCell(15), 'loading')).to.be.false;
    });
  });

  describe('reopening the overlay', () => {
    it('should load the metadata again for a cache dropped while closed', async () => {
      const provider = sinon.stub().returns([]);
      datePicker.dateMetadataProvider = provider;
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
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
          datePicker.dateMetadataProvider = spy;
          await open(datePicker);
          overlayContent = datePicker._overlayContent;
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

        it('should stop loading', async () => {
          await nextRender();

          expect(overlayContent.hasAttribute('loading')).to.be.false;
          expect(overlayContent.hasAttribute('aria-busy')).to.be.false;
        });

        it('should disable nothing', async () => {
          await nextRender();

          expect(isDisabled(getVisibleCell(15))).to.be.false;
          expect(hasPart(getVisibleCell(15), 'loading')).to.be.false;
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

  describe('years below 100', () => {
    // `new Date(50, ...)` would move the range into the 1900s, so the provider would be asked about
    // the wrong century.
    it('should ask the provider for the visible range, not for the 20th century', async () => {
      const provider = sinon.stub().returns([]);
      datePicker.dateMetadataProvider = provider;
      datePicker.initialPosition = '0050-06-01';
      await open(datePicker);

      const { start, end } = provider.firstCall.args[0];
      expect(start.year).to.be.within(49, 50);
      expect(end.year).to.be.within(50, 51);
    });

    it('should disable a provided date in a year below 100', async () => {
      datePicker.dateMetadataProvider = () => [{ year: 50, month: 5, day: 15, disabled: true }];
      datePicker.initialPosition = '0050-06-01';
      await open(datePicker);
      overlayContent = datePicker._overlayContent;

      expect(isDisabled(getVisibleCell(15, 50, 5))).to.be.true;
      expect(isDisabled(getVisibleCell(16, 50, 5))).to.be.false;
    });
  });
});
