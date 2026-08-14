import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-date-picker.js';
import { getDateCell, getMonthCalendar, isoDate, open } from './helpers.js';

describe('dateMetadataProvider part names', () => {
  let datePicker, overlayContent, year, month;

  function getCell(day) {
    return getDateCell(getMonthCalendar(overlayContent, year, month), day);
  }

  // The providers below are synchronous, so the metadata is applied while the overlay renders.
  async function openWithProvider(provider) {
    datePicker.dateMetadataProvider = provider;
    await open(datePicker);
    overlayContent = datePicker._overlayContent;
    await nextRender();
  }

  beforeEach(async () => {
    const today = new Date();
    year = today.getFullYear();
    month = today.getMonth();
    datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
    await nextRender();
  });

  it('should add a single part name to the date', async () => {
    await openWithProvider(() => [{ date: isoDate(year, month, 10), part: 'busy' }]);

    expect(getCell(10).part.contains('busy')).to.be.true;
    expect(getCell(11).part.contains('busy')).to.be.false;
  });

  it('should add several space-separated part names', async () => {
    await openWithProvider(() => [{ date: isoDate(year, month, 10), part: 'busy almost-full' }]);

    expect(getCell(10).part.contains('busy')).to.be.true;
    expect(getCell(10).part.contains('almost-full')).to.be.true;
  });

  it('should keep the built-in parts alongside the custom ones', async () => {
    await openWithProvider(() => [{ date: isoDate(year, month, 10), part: 'busy', disabled: true }]);

    expect(getCell(10).part.contains('date')).to.be.true;
    expect(getCell(10).part.contains('disabled')).to.be.true;
    expect(getCell(10).part.contains('busy')).to.be.true;
  });
});
