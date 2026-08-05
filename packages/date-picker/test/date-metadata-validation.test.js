import { expect } from '@vaadin/chai-plugins';
import { aTimeout, enter, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { monthDate, monthIndexOf } from '../src/vaadin-date-picker-helper.js';
import { setInputValue } from './helpers.js';

describe('dateMetadataProvider validation', () => {
  let datePicker;

  // The 15th of every month is disabled, so a value can be checked without depending on which
  // months the request happens to cover.
  function disableFifteenth() {
    return ({ start, end }) => {
      const first = monthIndexOf(start.year, start.month);
      const last = monthIndexOf(end.year, end.month);
      const dates = [];
      for (let month = first; month <= last; month++) {
        const date = monthDate(month);
        dates.push({ year: date.getFullYear(), month: date.getMonth(), day: 15, disabled: true });
      }
      return dates;
    };
  }

  function spyProvider() {
    return sinon.stub().returns([]);
  }

  beforeEach(async () => {
    datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
    await nextRender();
  });

  it('should report value disabled by the provider as invalid', async () => {
    datePicker.dateMetadataProvider = disableFifteenth();
    datePicker.value = '2024-01-15';
    await aTimeout(0);

    expect(datePicker.checkValidity()).to.be.false;
    expect(datePicker.invalid).to.be.true;
  });

  it('should report value allowed by the provider as valid', async () => {
    datePicker.dateMetadataProvider = disableFifteenth();
    datePicker.value = '2024-01-16';
    await aTimeout(0);

    expect(datePicker.checkValidity()).to.be.true;
    expect(datePicker.invalid).to.be.false;
  });

  it('should report value as valid when the provider is not set', async () => {
    datePicker.value = '2024-01-15';
    await aTimeout(0);

    expect(datePicker.checkValidity()).to.be.true;
    expect(datePicker.invalid).to.be.false;
  });

  it('should validate user input value against the provider', async () => {
    datePicker.autoOpenDisabled = true;
    datePicker.dateMetadataProvider = disableFifteenth();
    await nextRender();

    setInputValue(datePicker, '1/15/2024');
    enter(datePicker.inputElement);
    await aTimeout(0);

    expect(datePicker.value).to.equal('2024-01-15');
    expect(datePicker.checkValidity()).to.be.false;
    expect(datePicker.invalid).to.be.true;
  });

  it('should request range including the value from the provider', async () => {
    datePicker.dateMetadataProvider = spyProvider();
    datePicker.value = '2024-01-15';
    await aTimeout(0);

    expect(datePicker.dateMetadataProvider).to.be.calledOnce;
    // Requests cover whole blocks, so the range is the calendar year holding the value.
    const range = datePicker.dateMetadataProvider.firstCall.args[0];
    expect(range.start).to.eql({ year: 2024, month: 0, day: 1 });
    expect(range.end).to.eql({ year: 2024, month: 11, day: 31 });
  });

  it('should request metadata again on value set after the provider settled', async () => {
    datePicker.dateMetadataProvider = spyProvider();
    datePicker.value = '2024-01-15';
    await aTimeout(0);
    datePicker.dateMetadataProvider.resetHistory();

    datePicker.value = '2030-06-10';
    await aTimeout(0);

    expect(datePicker.dateMetadataProvider).to.be.calledOnce;
  });

  it('should report value set after the provider settled as invalid', async () => {
    datePicker.dateMetadataProvider = disableFifteenth();
    datePicker.value = '2024-01-16';
    await aTimeout(0);
    expect(datePicker.invalid).to.be.false;

    datePicker.value = '2030-06-15';
    await aTimeout(0);

    expect(datePicker.invalid).to.be.true;
  });

  it('should not request again if a value changed is within loaded range', async () => {
    datePicker.dateMetadataProvider = spyProvider();
    datePicker.value = '2024-01-15';
    await aTimeout(0);
    datePicker.dateMetadataProvider.resetHistory();

    datePicker.value = '2024-01-20';
    await aTimeout(0);

    expect(datePicker.dateMetadataProvider).to.not.be.called;
  });

  it('should keep the invalid state when min or max is removed', async () => {
    datePicker.dateMetadataProvider = disableFifteenth();
    datePicker.value = '2024-01-15';
    await aTimeout(0);
    datePicker.min = '2020-01-01';
    await aTimeout(0);
    expect(datePicker.invalid).to.be.true;

    // The provider counts as a constraint, so this is not the last constraint removed
    // and the invalid state it still justifies is re-checked rather than dropped.
    datePicker.min = '';
    await aTimeout(0);

    expect(datePicker.invalid).to.be.true;
  });

  it('should not validate again when an unrelated month resolves', async () => {
    datePicker.dateMetadataProvider = disableFifteenth();
    datePicker.value = '2024-01-15';
    await aTimeout(0);

    const validated = sinon.spy();
    datePicker.addEventListener('validated', validated);

    // A month far from the value, so nothing about the value has changed.
    datePicker._dateMetadataController.ensureRangeLoaded(new Date(2030, 5, 1), new Date(2030, 5, 1));
    await aTimeout(0);

    expect(validated).to.not.be.called;
  });

  describe('provider changes', () => {
    it('should re-validate the value against a new provider', async () => {
      datePicker.dateMetadataProvider = spyProvider();
      datePicker.value = '2024-01-15';
      await aTimeout(0);
      expect(datePicker.invalid).to.be.false;

      datePicker.dateMetadataProvider = disableFifteenth();
      await aTimeout(0);

      expect(datePicker.invalid).to.be.true;
    });

    it('should clear the invalid state when a new provider allows the value', async () => {
      datePicker.dateMetadataProvider = disableFifteenth();
      datePicker.value = '2024-01-15';
      await aTimeout(0);
      expect(datePicker.invalid).to.be.true;

      datePicker.dateMetadataProvider = spyProvider();
      await aTimeout(0);

      expect(datePicker.invalid).to.be.false;
    });

    it('should clear the invalid state when the provider is removed', async () => {
      datePicker.dateMetadataProvider = disableFifteenth();
      datePicker.value = '2024-01-15';
      await aTimeout(0);
      expect(datePicker.invalid).to.be.true;

      // Removal resolves nothing, so the re-check cannot wait for an answer.
      datePicker.dateMetadataProvider = null;
      await aTimeout(0);

      expect(datePicker.invalid).to.be.false;
    });
  });

  describe('async provider', () => {
    let pending;

    // Resolves every request made so far, so a test controls when the answers arrive.
    function resolveProvider(dates) {
      pending.splice(0).forEach((resolve) => resolve(dates));
    }

    beforeEach(() => {
      pending = [];
      datePicker.dateMetadataProvider = () =>
        new Promise((resolve) => {
          pending.push(resolve);
        });
    });

    it('should report the value valid while its month is still being fetched', async () => {
      datePicker.value = '2024-01-15';
      await aTimeout(0);

      // Allowed until the provider says otherwise, so a slow provider does not flash an error.
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.invalid).to.be.false;
    });

    it('should validate the value once the field is attached again', async () => {
      datePicker.value = '2024-01-15';
      await aTimeout(0);

      const parent = datePicker.parentNode;
      parent.removeChild(datePicker);
      // Answered while detached, so the host was never told about it.
      resolveProvider([{ year: 2024, month: 0, day: 15, disabled: true }]);
      await aTimeout(0);
      expect(datePicker.invalid).to.be.false;

      parent.appendChild(datePicker);
      await aTimeout(0);

      expect(datePicker.invalid).to.be.true;
    });

    it('should not report a value cleared before the answer arrives invalid', async () => {
      datePicker.value = '2024-01-15';
      await aTimeout(0);

      datePicker.value = '';
      resolveProvider([{ year: 2024, month: 0, day: 15, disabled: true }]);
      await aTimeout(0);

      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.invalid).to.be.false;
    });

    it('should not re-validate when a later answer arrives for a value in a loaded month', async () => {
      datePicker.value = '2024-01-15';
      await aTimeout(0);

      // Cleared before the answer arrives, so nothing waits for it anymore.
      datePicker.value = '';
      resolveProvider([]);
      await aTimeout(0);

      // A value in the month that just loaded needs no request of its own.
      datePicker.value = '2024-01-20';
      await aTimeout(0);

      const validated = sinon.spy();
      datePicker.addEventListener('validated', validated);

      // An answer for months far from the value must not re-validate it.
      datePicker._dateMetadataController.ensureRangeLoaded(new Date(2030, 5, 1), new Date(2030, 5, 1));
      resolveProvider([]);
      await aTimeout(0);

      expect(validated).to.not.be.called;
    });
  });
});
