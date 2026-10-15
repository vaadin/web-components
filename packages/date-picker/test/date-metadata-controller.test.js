import { expect } from '@vaadin/chai-plugins';
import { aTimeout } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';
import { DateMetadataController } from '../src/vaadin-date-metadata-controller.js';
import { createDate } from '../src/vaadin-date-picker-helper.js';

describe('DateMetadataController', () => {
  let controller, host, onChange;

  // Most tests care about a single month, which the controller rounds out to a whole block.
  function loadMonth(year, month) {
    const date = createDate(year, month, 1);
    controller.ensureRangeLoaded(date, date);
  }

  function stubProvider(result = []) {
    const provider = sinon.stub().returns(result);
    controller.setProvider(provider);
    return provider;
  }

  beforeEach(() => {
    onChange = sinon.spy();
    host = { isConnected: true };
    controller = new DateMetadataController(host, onChange);
  });

  it('should call the provider once for the whole block the range falls in', () => {
    const provider = stubProvider();

    loadMonth(2023, 2); // March 2023

    expect(provider).to.be.calledOnce;
    // A block is one calendar year, so asking about March 2023 asks about all of 2023.
    expect(provider.firstCall.args[0]).to.eql({
      start: '2023-01-01',
      end: '2023-12-31',
    });
  });

  it('should round a block down for a year before 0', () => {
    const provider = stubProvider();

    controller.ensureRangeLoaded(createDate(-1, 5, 10), createDate(-1, 5, 10));

    // Rounding towards zero instead of down would land in the block after this one.
    expect(provider.firstCall.args[0]).to.eql({
      start: '-000001-01-01',
      end: '-000001-12-31',
    });
  });

  it('should mark the requested months as loaded and expose disabled dates', async () => {
    controller.setProvider(() => [{ date: '2023-03-15', disabled: true }]);
    loadMonth(2023, 2);
    await aTimeout(0);

    expect(controller.isMonthLoaded(new Date(2023, 2, 1))).to.be.true;
    expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.true;
    expect(controller.isDateDisabled(new Date(2023, 2, 16))).to.be.false;
    expect(controller.isLoading()).to.be.false;
  });

  it('should return the entry the provider supplied', async () => {
    controller.setProvider(() => [
      { date: '2023-03-10', occupancy: 'high' },
      { date: '2023-03-15', disabled: true },
    ]);
    loadMonth(2023, 2);
    await aTimeout(0);

    expect(controller.getMetadata(new Date(2023, 2, 10))).to.include({ occupancy: 'high' });
    expect(controller.getMetadata(new Date(2023, 2, 15))).to.include({ disabled: true });
    expect(controller.isDateDisabled(new Date(2023, 2, 10))).to.be.false;
    expect(controller.getMetadata(new Date(2023, 2, 11))).to.be.undefined;
  });

  it('should not call the provider again for months within the loaded window', async () => {
    const provider = stubProvider();

    // Load a whole year first.
    controller.ensureRangeLoaded(new Date(2023, 0, 1), new Date(2023, 11, 1));
    await aTimeout(0);
    provider.resetHistory();

    // Re-request months the loaded block already covers.
    controller.ensureRangeLoaded(new Date(2023, 0, 1), new Date(2023, 11, 1));
    loadMonth(2023, 5);

    expect(provider).to.not.be.called;
  });

  it('should not fetch again when moving within the loaded block', async () => {
    const provider = stubProvider();

    loadMonth(2023, 2);
    await aTimeout(0);
    provider.resetHistory();

    // Stepping through the rest of the year stays inside the block that is already loaded, which is
    // the point of aligning them: a buffer centred on the request would ask for a month per step.
    for (let month = 3; month <= 11; month++) {
      loadMonth(2023, month);
    }

    expect(provider).to.not.be.called;
  });

  it('should fetch the next block when the range reaches into it', async () => {
    const provider = stubProvider();

    loadMonth(2023, 2);
    await aTimeout(0);
    provider.resetHistory();

    controller.ensureRangeLoaded(createDate(2023, 11, 1), createDate(2024, 0, 1));

    // 2023 is already loaded, so only the block it reaches into is requested.
    expect(provider).to.be.calledOnce;
    expect(provider.firstCall.args[0]).to.eql({
      start: '2024-01-01',
      end: '2024-12-31',
    });
  });

  it('should fetch again for a range far outside the loaded window', async () => {
    const provider = stubProvider();

    loadMonth(2023, 2);
    await aTimeout(0);
    provider.resetHistory();

    loadMonth(2025, 2);

    expect(provider).to.be.calledOnce;
    expect(provider.firstCall.args[0]).to.eql({
      start: '2025-01-01',
      end: '2025-12-31',
    });
  });

  it('should clear the cache when the provider changes', async () => {
    controller.setProvider(() => [{ date: '2023-03-15', disabled: true }]);
    loadMonth(2023, 2);
    await aTimeout(0);
    expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.true;

    controller.setProvider(() => []);
    expect(controller.isMonthLoaded(new Date(2023, 2, 1))).to.be.false;
    expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.false;
  });

  it('should ignore an async result that resolves after a reset', async () => {
    let resolveStale;
    controller.setProvider(
      () =>
        new Promise((resolve) => {
          resolveStale = resolve;
        }),
    );
    loadMonth(2023, 2);

    // Provider changes (reset) before the first request resolves.
    controller.setProvider(() => []);
    resolveStale([{ date: '2023-03-15', disabled: true }]);
    await aTimeout(0);

    expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.false;
  });

  it('should narrow the range to the months that are missing', async () => {
    const provider = stubProvider();

    // Load two blocks with an unloaded one between them.
    loadMonth(2023, 0);
    loadMonth(2025, 0);
    await aTimeout(0);
    provider.resetHistory();

    // A range covering the first block and the gap. It is narrowed to the block still missing.
    controller.ensureRangeLoaded(new Date(2023, 6, 1), new Date(2024, 6, 1));

    expect(provider).to.be.calledOnce;
    expect(provider.firstCall.args[0]).to.eql({
      start: '2024-01-01',
      end: '2024-12-31',
    });
  });

  it('should request one range when the missing months are not consecutive', async () => {
    const provider = stubProvider();

    // Load a block in the middle, so a wider range leaves a missing one on either side.
    loadMonth(2024, 6);
    await aTimeout(0);
    provider.resetHistory();

    // The answered block in the middle is covered by the range rather than splitting it in two.
    controller.ensureRangeLoaded(new Date(2023, 0, 1), new Date(2025, 0, 1));

    expect(provider).to.be.calledOnce;
    expect(provider.firstCall.args[0]).to.eql({
      start: '2023-01-01',
      end: '2025-12-31',
    });
  });

  it('should keep the metadata of an answered month covered by a wider range', async () => {
    // The same provider throughout, so the cache is not dropped: it answers the first request and
    // leaves the second one in flight.
    let answered = false;
    controller.setProvider(() => {
      if (answered) {
        return new Promise(() => {});
      }
      answered = true;
      return [{ date: '2023-07-15', disabled: true }];
    });

    loadMonth(2023, 6); // Jan 2023 - Jan 2024
    await aTimeout(0);
    expect(controller.isDateDisabled(new Date(2023, 6, 15))).to.be.true;

    // Jul 2022 - Jul 2024, so months are missing on either side of the answered block. The range
    // covers the answered months, but only the missing ones are loaded, so what is already known
    // stays known instead of dropping back to pending until the reply arrives.
    controller.ensureRangeLoaded(new Date(2023, 0, 1), new Date(2024, 0, 1));

    expect(controller.isMonthLoaded(new Date(2023, 6, 15))).to.be.true;
    expect(controller.isDateDisabled(new Date(2023, 6, 15))).to.be.true;
  });

  describe('async provider', () => {
    let resolveProvider, provider;

    beforeEach(() => {
      provider = sinon.stub().returns(
        new Promise((resolve) => {
          resolveProvider = resolve;
        }),
      );
      controller.setProvider(provider);
    });

    it('should be loading until the promise resolves', async () => {
      loadMonth(2023, 2);
      expect(controller.isLoading()).to.be.true;
      expect(controller.isMonthLoaded(new Date(2023, 2, 1))).to.be.false;

      resolveProvider([{ date: '2023-03-15', disabled: true }]);
      await aTimeout(0);

      expect(controller.isLoading()).to.be.false;
      expect(controller.isMonthLoaded(new Date(2023, 2, 1))).to.be.true;
      expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.true;
    });

    it('should notify the host when loading starts and finishes', async () => {
      onChange.resetHistory();
      loadMonth(2023, 2);
      // The host callback is deferred to a microtask so it never runs during an update.
      await Promise.resolve();
      expect(onChange).to.be.called;

      onChange.resetHistory();
      resolveProvider([]);
      await aTimeout(0);
      expect(onChange).to.be.called;
    });
  });

  describe('nullish dates', () => {
    beforeEach(async () => {
      controller.setProvider(() => [{ date: '2023-03-15', disabled: true }]);
      loadMonth(2023, 2);
      await aTimeout(0);
    });

    [null, undefined].forEach((value) => {
      it(`should answer the lookups for ${value}`, () => {
        expect(controller.isMonthLoaded(value)).to.be.false;
        expect(controller.getMetadata(value)).to.be.undefined;
        expect(controller.isDateDisabled(value)).to.be.false;
      });

      it(`should not request a range bounded by ${value}`, () => {
        const provider = stubProvider();

        controller.ensureRangeLoaded(value, new Date(2030, 0, 1));
        controller.ensureRangeLoaded(new Date(2030, 0, 1), value);

        expect(provider).to.not.be.called;
      });
    });
  });

  describe('failing provider', () => {
    beforeEach(() => {
      sinon.stub(console, 'error');
      sinon.stub(console, 'warn');
    });

    afterEach(() => {
      console.error.restore();
      console.warn.restore();
      clearWarnings();
    });

    it('should treat a throwing provider as no metadata', () => {
      controller.setProvider(() => {
        throw new Error('provider failed');
      });

      expect(() => loadMonth(2023, 2)).to.not.throw();
      expect(controller.isLoading()).to.be.false;
      expect(controller.isMonthLoaded(new Date(2023, 2, 1))).to.be.false;
      // Failing open: a failure must not leave the dates disabled.
      expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.false;
      expect(console.error).to.be.called;
    });

    it('should treat a rejecting provider as no metadata', async () => {
      controller.setProvider(() => Promise.reject(new Error('provider failed')));

      loadMonth(2023, 2);
      await aTimeout(0);

      expect(controller.isLoading()).to.be.false;
      expect(controller.isMonthLoaded(new Date(2023, 2, 1))).to.be.false;
      expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.false;
      expect(console.error).to.be.called;
    });

    it('should treat a non-array result as no metadata and warn about it', async () => {
      controller.setProvider(() => ({ dates: [] }));

      loadMonth(2023, 2);
      await aTimeout(0);

      expect(controller.isMonthLoaded(new Date(2023, 2, 1))).to.be.true;
      expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.false;
      expect(console.warn).to.be.calledOnce;
      expect(console.warn.firstCall.args[0]).to.contain('array');
    });

    it('should accept an empty result without warning', async () => {
      controller.setProvider(() => undefined);

      loadMonth(2023, 2);
      await aTimeout(0);

      expect(controller.isMonthLoaded(new Date(2023, 2, 1))).to.be.true;
      expect(console.warn).to.not.be.called;
    });

    it('should request an update on subscribed elements when a request fails', async () => {
      const element = { requestUpdate: sinon.spy() };
      controller.subscribe(element);
      controller.setProvider(() => Promise.reject(new Error('provider failed')));
      loadMonth(2023, 2);
      element.requestUpdate.resetHistory();

      await aTimeout(0);

      expect(element.requestUpdate).to.be.called;
    });

    it('should report a month being retried as loading', () => {
      // A failed month is not loading, since nothing is in flight for it. Once the retry starts it
      // is genuinely being fetched again, so it must report as loading rather than as settled.
      let attempt = 0;
      controller.setProvider(() => {
        attempt += 1;
        if (attempt === 1) {
          throw new Error('provider failed');
        }
        return new Promise(() => {});
      });

      loadMonth(2023, 2);
      expect(controller.isMonthLoaded(new Date(2023, 2, 1))).to.be.false;
      expect(controller.isLoading()).to.be.false;

      loadMonth(2023, 2);

      expect(controller.isLoading()).to.be.true;
      expect(controller.isMonthLoaded(new Date(2023, 2, 1))).to.be.false;
    });

    it('should request a failed month again on the next range request', async () => {
      // A transient failure must not be cached as an authoritative "nothing is disabled".
      let fail = true;
      const provider = sinon.spy(() => {
        if (fail) {
          throw new Error('provider failed');
        }
        return [{ date: '2023-03-15', disabled: true }];
      });
      controller.setProvider(provider);
      loadMonth(2023, 2);
      provider.resetHistory();

      fail = false;
      loadMonth(2023, 2);
      await aTimeout(0);

      expect(provider).to.be.called;
      expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.true;
    });

    it('should stop re-requesting a month once it resolves', async () => {
      const provider = sinon.stub();
      provider.onFirstCall().throws(new Error('provider failed'));
      provider.returns([]);
      controller.setProvider(provider);
      loadMonth(2023, 2);
      loadMonth(2023, 2);
      await aTimeout(0);
      provider.resetHistory();

      loadMonth(2023, 2);

      expect(provider).to.not.be.called;
    });
  });

  describe('subscribers', () => {
    let element;

    beforeEach(() => {
      element = { requestUpdate: sinon.spy() };
      controller.subscribe(element);
    });

    it('should request an update when the cache is cleared', () => {
      controller.clearCache();

      expect(element.requestUpdate).to.be.called;
    });

    it('should request an update when a load starts', () => {
      controller.setProvider(() => new Promise(() => {}));
      element.requestUpdate.resetHistory();

      loadMonth(2023, 2);

      expect(element.requestUpdate).to.be.called;
    });

    it('should request an update when a month resolves', async () => {
      let resolveProvider;
      controller.setProvider(
        () =>
          new Promise((resolve) => {
            resolveProvider = resolve;
          }),
      );
      loadMonth(2023, 2);
      element.requestUpdate.resetHistory();

      resolveProvider([{ date: '2023-03-15', disabled: true }]);
      await aTimeout(0);

      expect(element.requestUpdate).to.be.called;
    });

    it('should only register an element once', () => {
      controller.subscribe(element);

      controller.clearCache();

      expect(element.requestUpdate).to.be.calledOnce;
    });

    it('should request an update synchronously, before the host callback', () => {
      onChange.resetHistory();

      controller.clearCache();

      // Subscribers are invalidated in the same task; the host callback is deferred.
      expect(element.requestUpdate).to.be.called;
      expect(onChange).to.not.be.called;
    });
  });

  describe('detached host', () => {
    it('should keep the resolved cache when the host reconnects', async () => {
      const provider = stubProvider([{ date: '2023-03-15', disabled: true }]);
      loadMonth(2023, 2);
      await aTimeout(0);
      provider.resetHistory();

      controller.hostConnected();

      loadMonth(2023, 2);

      expect(provider).to.not.be.called;
      expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.true;
    });

    it('should still apply a request that resolves while detached', async () => {
      let resolveProvider;
      controller.setProvider(
        () =>
          new Promise((resolve) => {
            resolveProvider = resolve;
          }),
      );
      loadMonth(2023, 2);

      // Detached while the request is on its way: discarding the answer would only re-fetch the
      // same range once the host came back.
      host.isConnected = false;
      resolveProvider([{ date: '2023-03-15', disabled: true }]);
      await aTimeout(0);

      expect(controller.isMonthLoaded(new Date(2023, 2, 1))).to.be.true;
      expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.true;
    });

    it('should not notify the host while it is disconnected', async () => {
      host.isConnected = false;
      controller.setProvider(() => []);
      onChange.resetHistory();

      loadMonth(2023, 2);
      await aTimeout(0);

      expect(onChange).to.not.be.called;
    });

    it('should report the current state again once the host is reconnected', async () => {
      host.isConnected = false;
      controller.setProvider(() => [{ date: '2023-03-15', disabled: true }]);
      // Resolves while detached, so the host is never told about it.
      loadMonth(2023, 2);
      await aTimeout(0);
      expect(onChange).to.not.be.called;

      host.isConnected = true;
      controller.hostConnected();
      await aTimeout(0);

      expect(onChange).to.be.called;
    });
  });

  describe('years below 100', () => {
    it('should resolve metadata for a year below 100', async () => {
      const provider = stubProvider([{ date: '0050-07-15', disabled: true }]);

      loadMonth(50, 6);
      await aTimeout(0);

      expect(provider.firstCall.args[0]).to.eql({
        start: '0050-01-01',
        end: '0050-12-31',
      });
      expect(controller.isMonthLoaded(createDate(50, 6, 1))).to.be.true;
      expect(controller.isDateDisabled(createDate(50, 6, 15))).to.be.true;
      expect(controller.isDateDisabled(createDate(50, 6, 16))).to.be.false;
    });
  });

  describe('entries outside the requested range', () => {
    // A month is only resolved by being requested, so metadata the provider volunteers for other
    // months must not be trusted before that month is loaded in its own right.
    beforeEach(async () => {
      controller.setProvider(() => [
        { date: '2023-03-15', disabled: true },
        { date: '2024-01-05', disabled: true },
      ]);
      loadMonth(2023, 2); // Sep 2022 - Sep 2023
      await aTimeout(0);
    });

    it('should not report a date in an unresolved month as disabled', () => {
      expect(controller.isMonthLoaded(new Date(2024, 0, 1))).to.be.false;
      expect(controller.isDateDisabled(new Date(2024, 0, 5))).to.be.false;
      expect(controller.getMetadata(new Date(2024, 0, 5))).to.be.undefined;
    });

    it('should report the date once its month is resolved', async () => {
      loadMonth(2024, 0);
      await aTimeout(0);

      expect(controller.isMonthLoaded(new Date(2024, 0, 1))).to.be.true;
      expect(controller.isDateDisabled(new Date(2024, 0, 5))).to.be.true;
    });
  });

  describe('a resolved month keeps its own answer', () => {
    it('should not let a later request override an already resolved month', async () => {
      // March 2026 is asked about and answered clean. A later request for an unrelated range
      // volunteers a March date as disabled. March already gave its own answer, so it wins.
      let call = 0;
      controller.setProvider(() => {
        call += 1;
        return call === 1 ? [] : [{ date: '2026-03-10', disabled: true }];
      });
      loadMonth(2026, 2);
      await aTimeout(0);
      expect(controller.isMonthLoaded(new Date(2026, 2, 1))).to.be.true;
      expect(controller.isDateDisabled(new Date(2026, 2, 10))).to.be.false;

      loadMonth(2030, 5);
      await aTimeout(0);

      expect(controller.isDateDisabled(new Date(2026, 2, 10))).to.be.false;
    });
  });

  describe('entry date validation', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');
    });

    afterEach(() => {
      console.warn.restore();
      clearWarnings();
    });

    [
      { name: 'a missing date', entry: { disabled: true } },
      { name: 'a date that is not a string', entry: { date: 20240115 } },
      // Coercing these to a string throws, which would discard the whole range rather than the entry.
      { name: 'a date that is a symbol', entry: { date: Symbol('2024-01-15') } },
      {
        name: 'a date that throws when coerced',
        entry: {
          date: {
            toString: () => {
              throw new Error('should not be coerced');
            },
          },
        },
      },
      { name: 'a date in another format', entry: { date: '15/01/2024' } },
      { name: 'a date with a time part', entry: { date: '2024-01-15T00:00:00' } },
      { name: 'a month above 12', entry: { date: '2024-13-15' } },
      { name: 'a zero month', entry: { date: '2024-00-15' } },
      { name: 'a day above the month length', entry: { date: '2024-01-32' } },
      { name: 'a zero day', entry: { date: '2024-01-00' } },
      { name: 'a day that does not exist in that month', entry: { date: '2023-02-29' } },
    ].forEach(({ name, entry }) => {
      it(`should warn about and ignore ${name}`, async () => {
        controller.setProvider(() => [entry, { date: '2024-01-20', disabled: true }]);
        loadMonth(2024, 0);
        await aTimeout(0);

        expect(console.warn).to.be.calledOnce;
        expect(controller.isDateDisabled(new Date(2024, 0, 20))).to.be.true;
      });
    });

    it('should accept the last day of a leap February', async () => {
      controller.setProvider(() => [{ date: '2024-02-29', disabled: true }]);
      loadMonth(2024, 1);
      await aTimeout(0);

      expect(console.warn).to.not.be.called;
      expect(controller.isDateDisabled(new Date(2024, 1, 29))).to.be.true;
    });

    it('should accept a month and day without a leading zero', async () => {
      controller.setProvider(() => [{ date: '2024-1-5', disabled: true }]);
      loadMonth(2024, 0);
      await aTimeout(0);

      expect(console.warn).to.not.be.called;
      expect(controller.isDateDisabled(new Date(2024, 0, 5))).to.be.true;
    });

    it('should accept a signed year', async () => {
      controller.setProvider(() => [{ date: '-0001-01-15', disabled: true }]);
      loadMonth(-1, 0);
      await aTimeout(0);

      expect(console.warn).to.not.be.called;
      expect(controller.isDateDisabled(createDate(-1, 0, 15))).to.be.true;
    });

    it('should warn only once however many requests return invalid entries', async () => {
      controller.setProvider(() => [{ disabled: true }]);
      loadMonth(2024, 0);
      loadMonth(2030, 0);
      await aTimeout(0);

      expect(console.warn).to.be.calledOnce;
    });

    it('should not warn for a well-formed result', async () => {
      controller.setProvider(() => [{ date: '2024-01-15', disabled: true }]);
      loadMonth(2024, 0);
      await aTimeout(0);

      expect(console.warn).to.not.be.called;
    });
  });

  describe('re-resolving a month', () => {
    it('should answer from the provider again after the cache is cleared', async () => {
      let disabledDay = 15;
      controller.setProvider(() => [{ date: `2023-03-${disabledDay}`, disabled: true }]);
      loadMonth(2023, 2);
      await aTimeout(0);
      expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.true;

      // The same month is asked about again and answers differently: the 15th is free, the 16th is
      // not. Nothing from the dropped answer may survive into the new one.
      disabledDay = 16;
      controller.clearCache();
      loadMonth(2023, 2);
      await aTimeout(0);

      expect(controller.isDateDisabled(new Date(2023, 2, 16))).to.be.true;
      expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.false;
    });
  });

  describe('provider identity', () => {
    it('should not reset the cache when the same provider is set again', async () => {
      const provider = stubProvider([{ date: '2023-03-15', disabled: true }]);
      loadMonth(2023, 2);
      await aTimeout(0);
      provider.resetHistory();
      onChange.resetHistory();

      controller.setProvider(provider);
      // The host callback is deferred, so a cache reset would only be reported a microtask later.
      await aTimeout(0);

      expect(controller.isMonthLoaded(new Date(2023, 2, 1))).to.be.true;
      expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.true;
      expect(provider).to.not.be.called;
      expect(onChange).to.not.be.called;
    });

    it('should not reset the cache when an unset provider is forwarded as undefined', async () => {
      // The initial value is `null`, so a host that forwards an unset property as `undefined` must
      // not be treated as a change.
      onChange.resetHistory();

      controller.setProvider(undefined);
      await aTimeout(0);

      expect(controller.provider).to.be.null;
      expect(onChange).to.not.be.called;
    });
  });

  describe('pending requests', () => {
    it('should not request the same months twice while a request is in flight', () => {
      const provider = stubProvider(new Promise(() => {}));

      loadMonth(2023, 2);
      loadMonth(2023, 2);
      loadMonth(2023, 8); // same block
      loadMonth(2024, 3); // the next one

      // Everything in the pending block is skipped; only the next block is a second call.
      expect(provider).to.be.calledTwice;
      expect(provider.secondCall.args[0]).to.eql({
        start: '2024-01-01',
        end: '2024-12-31',
      });
    });

    it('should notify the host once per batch of changes in the same task', async () => {
      controller.setProvider(() => []);
      loadMonth(2023, 6);
      await aTimeout(0);
      onChange.resetHistory();

      // Dropping the cache and starting two requests are three changes in one task, reported once.
      controller.clearCache();
      loadMonth(2020, 0);
      loadMonth(2030, 0);

      await aTimeout(0);

      // Once for the three changes above, and once for both requests resolving.
      expect(onChange).to.be.calledTwice;
    });
  });

  describe('block bounds', () => {
    [2022, 2023, 2024].forEach((year) => {
      it(`should cover ${year} whichever month of it is asked about`, () => {
        const provider = stubProvider();

        loadMonth(year, 7);

        // A block ends on 31 December, so a leap year does not change where the range ends.
        expect(provider.firstCall.args[0]).to.eql({
          start: `${year}-01-01`,
          end: `${year}-12-31`,
        });
      });
    });
  });
});
