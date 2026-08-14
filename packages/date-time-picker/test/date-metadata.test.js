import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender, tap } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-time-picker.js';

describe('dateMetadataProvider', () => {
  let dateTimePicker, datePicker, timePicker;

  // The 15th of January 2024 is disabled, whatever range the provider is asked about.
  function disableFifteenth() {
    return [{ date: '2024-01-15', disabled: true }];
  }

  function deferredProvider() {
    const pending = [];
    const provider = () =>
      new Promise((resolve) => {
        pending.push(() => resolve(disableFifteenth()));
      });
    provider.resolveAll = () => {
      pending.splice(0).forEach((resolve) => resolve());
    };
    return provider;
  }

  function getDateCell(day) {
    return [...datePicker._overlayContent.querySelectorAll('vaadin-month-calendar')]
      .filter((calendar) => calendar.month)
      .flatMap((calendar) => [...calendar.shadowRoot.querySelectorAll('[part~="date"]:not(:empty)')])
      .find((cell) => cell.date && cell.date.getMonth() === 0 && cell.date.getDate() === day);
  }

  // The reactive chain after a provider resolves can span more than one render. Throws rather than
  // giving up, so that a test whose predicate is a precondition fails instead of passing silently.
  async function untilRendered(predicate) {
    for (let i = 0; i < 50 && !predicate(); i++) {
      await nextRender();
    }
    if (!predicate()) {
      throw new Error('Timed out waiting for the expected state');
    }
    await nextRender();
  }

  beforeEach(async () => {
    dateTimePicker = fixtureSync('<vaadin-date-time-picker></vaadin-date-time-picker>');
    await nextRender();
    datePicker = dateTimePicker.querySelector('[slot=date-picker]');
    timePicker = dateTimePicker.querySelector('[slot=time-picker]');
  });

  describe('in the overlay', () => {
    beforeEach(async () => {
      dateTimePicker.dateMetadataProvider = disableFifteenth;
      dateTimePicker.initialPosition = '2024-01-15';
      // The time half is filled, so picking a date completes the value.
      timePicker.value = '10:00';
      datePicker.opened = true;
      await untilRendered(() => getDateCell(15)?.hasAttribute('disabled'));
    });

    it('should disable a provider-disabled date', () => {
      expect(getDateCell(15).hasAttribute('disabled')).to.be.true;
      expect(getDateCell(16).hasAttribute('disabled')).to.be.false;
    });

    it('should not commit a provider-disabled date on tap', async () => {
      tap(getDateCell(15));
      await nextRender();

      expect(dateTimePicker.value).to.equal('');
      expect(datePicker.opened).to.be.true;
    });

    it('should commit a date the provider allows on tap', async () => {
      tap(getDateCell(16));
      await nextRender();

      expect(dateTimePicker.value).to.equal('2024-01-16T10:00');
    });
  });

  describe('validation', () => {
    it('should report a provider-disabled value invalid', async () => {
      dateTimePicker.dateMetadataProvider = disableFifteenth;
      dateTimePicker.value = '2024-01-15T10:00';
      await aTimeout(0);

      expect(dateTimePicker.checkValidity()).to.be.false;
    });

    it('should not become invalid until validated when the provider disables the value', async () => {
      const provider = deferredProvider();
      dateTimePicker.dateMetadataProvider = provider;
      dateTimePicker.value = '2024-01-15T10:00';
      await aTimeout(0);
      // Nothing is known about the month yet, so the value is allowed.
      expect(dateTimePicker.checkValidity()).to.be.true;

      provider.resolveAll();
      await untilRendered(() => !dateTimePicker.checkValidity());

      // Validity computed from the answer is correct, but the `invalid` state does not follow on its
      // own: the pickers validate manually, so nothing reports the answer upwards.
      expect(dateTimePicker.checkValidity()).to.be.false;
      expect(dateTimePicker.invalid).to.be.false;

      dateTimePicker.validate();

      expect(dateTimePicker.invalid).to.be.true;
    });

    it('should stay valid for a value the provider allows', async () => {
      const provider = deferredProvider();
      dateTimePicker.dateMetadataProvider = provider;
      dateTimePicker.value = '2024-01-16T10:00';
      await aTimeout(0);

      provider.resolveAll();
      await untilRendered(() => datePicker._dateMetadataController.isMonthLoaded(new Date(2024, 0, 16)));

      expect(dateTimePicker.checkValidity()).to.be.true;
      dateTimePicker.validate();
      expect(dateTimePicker.invalid).to.be.false;
    });
  });

  describe('clearCache', () => {
    it('should delegate to the date picker', () => {
      const spy = sinon.spy(datePicker, 'clearCache');

      dateTimePicker.clearCache();

      expect(spy).to.be.calledOnce;
    });

    it('should ask the provider again', async () => {
      const provider = sinon.stub().returns([]);
      dateTimePicker.dateMetadataProvider = provider;
      datePicker.opened = true;
      await untilRendered(() => provider.called);
      provider.resetHistory();

      dateTimePicker.clearCache();
      await nextRender();

      expect(provider).to.be.called;
    });

    it('should not throw when no provider is set', () => {
      expect(() => dateTimePicker.clearCache()).to.not.throw();
    });

    it('should not throw before the pickers exist', () => {
      const detached = document.createElement('vaadin-date-time-picker');

      expect(() => detached.clearCache()).to.not.throw();
    });
  });
});
