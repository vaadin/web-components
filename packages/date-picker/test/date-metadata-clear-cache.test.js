import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { getDateCell, getMonthCalendar, open } from './helpers.js';

describe('dateMetadataProvider clearCache', () => {
  let datePicker, overlayContent, year, month;

  function getCell(day) {
    return getDateCell(getMonthCalendar(overlayContent, year, month), day);
  }

  // The reactive chain after a provider resolves can span more than one render.
  async function untilRendered(predicate) {
    for (let i = 0; i < 50 && !predicate(); i++) {
      await nextRender();
    }
    await nextRender();
  }

  beforeEach(async () => {
    const today = new Date();
    year = today.getFullYear();
    month = today.getMonth();
    datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
    await nextRender();
  });

  it('should ask the provider again for the months on screen', async () => {
    const provider = sinon.stub().returns([]);
    datePicker.dateMetadataProvider = provider;
    await open(datePicker);
    overlayContent = datePicker._overlayContent;
    await nextRender();
    provider.resetHistory();

    datePicker.clearCache();
    await nextRender();

    expect(provider).to.be.called;
  });

  it('should reflect metadata that changed behind the provider', async () => {
    let disabledDay = 10;
    datePicker.dateMetadataProvider = () => [{ year, month, day: disabledDay, disabled: true }];
    await open(datePicker);
    overlayContent = datePicker._overlayContent;
    await untilRendered(() => getCell(10)?.hasAttribute('disabled'));
    expect(getCell(10).hasAttribute('disabled')).to.be.true;

    disabledDay = 11;
    datePicker.clearCache();
    await untilRendered(() => getCell(11)?.hasAttribute('disabled'));

    expect(getCell(11).hasAttribute('disabled')).to.be.true;
    expect(getCell(10).hasAttribute('disabled')).to.be.false;
  });

  it('should keep the same provider function', async () => {
    const provider = sinon.stub().returns([]);
    datePicker.dateMetadataProvider = provider;
    await nextRender();

    datePicker.clearCache();
    await aTimeout(0);

    expect(datePicker.dateMetadataProvider).to.equal(provider);
  });

  it('should re-validate the value while the overlay is closed', async () => {
    let disabled = false;
    datePicker.dateMetadataProvider = () => (disabled ? [{ year: 2024, month: 0, day: 15, disabled: true }] : []);
    datePicker.value = '2024-01-15';
    await aTimeout(0);
    expect(datePicker.invalid).to.be.false;

    disabled = true;
    datePicker.clearCache();
    await aTimeout(0);

    expect(datePicker.invalid).to.be.true;
  });

  it('should not re-request in a loop when the provider keeps failing', async () => {
    const provider = sinon.stub().throws(new Error('provider failed'));
    const error = sinon.stub(console, 'error');
    datePicker.dateMetadataProvider = provider;
    await open(datePicker);
    overlayContent = datePicker._overlayContent;
    await nextRender();
    provider.resetHistory();

    datePicker.clearCache();
    await aTimeout(0);
    await aTimeout(0);

    // A failed month becomes missing again, so refilling from the notification would never stop.
    expect(provider.callCount).to.be.below(4);
    error.restore();
  });

  it('should not throw when no provider is set', async () => {
    await nextRender();
    expect(() => datePicker.clearCache()).to.not.throw();
  });
});
