import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-date-picker.js';
import { getDateCell, getMonthCalendar, open } from './helpers.js';

describe('dateMetadataProvider part names', () => {
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

  describe('applying the parts', () => {
    it('should add a single part name to the date', async () => {
      datePicker.dateMetadataProvider = () => [{ year, month, day: 10, part: 'busy' }];
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
      await untilRendered(() => getCell(10)?.part.contains('busy'));

      expect(getCell(10).part.contains('busy')).to.be.true;
      expect(getCell(11).part.contains('busy')).to.be.false;
    });

    it('should add several space-separated part names', async () => {
      datePicker.dateMetadataProvider = () => [{ year, month, day: 10, part: 'busy almost-full' }];
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
      await untilRendered(() => getCell(10)?.part.contains('busy'));

      expect(getCell(10).part.contains('busy')).to.be.true;
      expect(getCell(10).part.contains('almost-full')).to.be.true;
    });

    it('should keep the built-in parts alongside the custom ones', async () => {
      datePicker.dateMetadataProvider = () => [{ year, month, day: 10, part: 'busy', disabled: true }];
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
      await untilRendered(() => getCell(10)?.part.contains('busy'));

      expect(getCell(10).part.contains('date')).to.be.true;
      expect(getCell(10).part.contains('disabled')).to.be.true;
      expect(getCell(10).part.contains('busy')).to.be.true;
    });

    it('should not add parts for a date without metadata', async () => {
      datePicker.dateMetadataProvider = () => [];
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
      await nextRender();

      expect(getCell(10).part.contains('busy')).to.be.false;
    });
  });

  describe('a part name that matches a built-in one', () => {
    it('should not disable a date whose part is named disabled', async () => {
      datePicker.dateMetadataProvider = () => [{ year, month, day: 10, part: 'disabled' }];
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
      await untilRendered(() => getCell(10)?.part.contains('disabled'));

      // The theme styles it as disabled, but nothing that decides the state consulted `part`.
      expect(getCell(10).hasAttribute('disabled')).to.be.false;
      expect(getCell(10).getAttribute('aria-disabled')).to.equal('false');
      expect(overlayContent._selectDate(getCell(10).date)).to.be.true;
    });
  });

  describe('a part that is not a string', () => {
    it('should ignore an array of part names', async () => {
      datePicker.dateMetadataProvider = () => [{ year, month, day: 10, part: ['busy', 'almost-full'] }];
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
      await nextRender();

      expect(getCell(10).part.contains('busy')).to.be.false;
      expect(getCell(10).part.contains('date')).to.be.true;
    });

    it('should keep the date selectable', async () => {
      datePicker.dateMetadataProvider = () => [{ year, month, day: 10, part: 1, disabled: true }];
      await open(datePicker);
      overlayContent = datePicker._overlayContent;
      await untilRendered(() => getCell(10)?.hasAttribute('disabled'));

      // An unusable `part` says nothing about the `disabled` flag beside it.
      expect(getCell(10).hasAttribute('disabled')).to.be.true;
    });
  });
});
