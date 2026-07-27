import { expect } from '@vaadin/chai-plugins';
import { aTimeout } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { DateMetadataController } from '../src/vaadin-date-metadata-controller.js';

describe('DateMetadataController', () => {
  let controller, onChange;

  beforeEach(() => {
    onChange = sinon.spy();
    controller = new DateMetadataController({}, onChange);
  });

  it('should call the provider once for a range covering the prefetch window', () => {
    const provider = sinon.stub().returns([]);
    controller.setProvider(provider);

    controller.ensureRangeLoaded(new Date(2023, 2, 1), new Date(2023, 2, 1)); // March 2023

    expect(provider).to.be.calledOnce;
    // March 2023 ± 6 months = Sept 2022 (month 8) through Sept 2023.
    expect(provider.firstCall.args[0]).to.eql({
      start: { year: 2022, month: 8, day: 1 },
      end: { year: 2023, month: 8, day: 30 },
    });
  });

  it('should mark the requested months as loaded and expose disabled dates', () => {
    controller.setProvider(() => [{ year: 2023, month: 2, day: 15, disabled: true }]);
    controller.ensureRangeLoaded(new Date(2023, 2, 1), new Date(2023, 2, 1));

    expect(controller.isMonthLoaded(new Date(2023, 2, 1))).to.be.true;
    expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.true;
    expect(controller.isDateDisabled(new Date(2023, 2, 16))).to.be.false;
    expect(controller.loading).to.be.false;
  });

  it('should expose arbitrary metadata for a date', () => {
    controller.setProvider(() => [
      { year: 2023, month: 2, day: 10, part: 'busy' },
      { year: 2023, month: 2, day: 15, disabled: true },
    ]);
    controller.ensureRangeLoaded(new Date(2023, 2, 1), new Date(2023, 2, 1));

    expect(controller.getMetadata(new Date(2023, 2, 10))).to.include({ part: 'busy' });
    expect(controller.getMetadata(new Date(2023, 2, 15))).to.include({ disabled: true });
    // A date with metadata but no `disabled` flag is not disabled.
    expect(controller.isDateDisabled(new Date(2023, 2, 10))).to.be.false;
    // A date without any metadata returns undefined.
    expect(controller.getMetadata(new Date(2023, 2, 11))).to.be.undefined;
  });

  it('should not call the provider again for months within the loaded window (scrolling back and forth)', () => {
    const provider = sinon.stub().returns([]);
    controller.setProvider(provider);

    // Load a wide span first (Jan..Dec 2023 → window Jul 2022..Jun 2024).
    controller.ensureRangeLoaded(new Date(2023, 0, 1), new Date(2023, 11, 1));
    provider.resetHistory();

    // Re-request months whose full prefetch window is already covered.
    controller.ensureRangeLoaded(new Date(2023, 0, 1), new Date(2023, 11, 1));
    controller.ensureRangeLoaded(new Date(2023, 5, 1), new Date(2023, 5, 1)); // June, window Dec22..Dec23

    expect(provider).to.not.be.called;
  });

  it('should fetch only the new months when scrolling one month forward', () => {
    const provider = sinon.stub().returns([]);
    controller.setProvider(provider);

    controller.ensureRangeLoaded(new Date(2023, 2, 1), new Date(2023, 2, 1)); // window Sep22..Sep23
    provider.resetHistory();

    controller.ensureRangeLoaded(new Date(2023, 3, 1), new Date(2023, 3, 1)); // window Oct22..Oct23

    // Only the single new trailing month (Oct 2023) should be fetched.
    expect(provider).to.be.calledOnce;
    expect(provider.firstCall.args[0]).to.eql({
      start: { year: 2023, month: 9, day: 1 },
      end: { year: 2023, month: 9, day: 31 },
    });
  });

  it('should fetch again for a range far outside the loaded window', () => {
    const provider = sinon.stub().returns([]);
    controller.setProvider(provider);

    controller.ensureRangeLoaded(new Date(2023, 2, 1), new Date(2023, 2, 1));
    provider.resetHistory();

    controller.ensureRangeLoaded(new Date(2025, 2, 1), new Date(2025, 2, 1));
    expect(provider).to.be.calledOnce;
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
      controller.ensureRangeLoaded(new Date(2023, 2, 1), new Date(2023, 2, 1));
      expect(controller.loading).to.be.true;
      expect(controller.isMonthLoaded(new Date(2023, 2, 1))).to.be.false;

      resolveProvider([{ year: 2023, month: 2, day: 15, disabled: true }]);
      await aTimeout(0);

      expect(controller.loading).to.be.false;
      expect(controller.isMonthLoaded(new Date(2023, 2, 1))).to.be.true;
      expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.true;
    });

    it('should notify the host when loading starts and finishes', async () => {
      onChange.resetHistory();
      controller.ensureRangeLoaded(new Date(2023, 2, 1), new Date(2023, 2, 1));
      expect(onChange).to.be.called; // request started

      onChange.resetHistory();
      resolveProvider([]);
      await aTimeout(0);
      expect(onChange).to.be.called; // request finished
    });
  });

  it('should clear the cache when the provider changes', () => {
    controller.setProvider(() => [{ year: 2023, month: 2, day: 15, disabled: true }]);
    controller.ensureRangeLoaded(new Date(2023, 2, 1), new Date(2023, 2, 1));
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
    controller.ensureRangeLoaded(new Date(2023, 2, 1), new Date(2023, 2, 1));

    // Provider changes (reset) before the first request resolves.
    controller.setProvider(() => []);
    resolveStale([{ year: 2023, month: 2, day: 15, disabled: true }]);
    await aTimeout(0);

    expect(controller.isDateDisabled(new Date(2023, 2, 15))).to.be.false;
  });
});
