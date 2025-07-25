import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-date-time-picker.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { open } from '@vaadin/date-picker/test/helpers.js';

describe('vaadin-date-time-picker', () => {
  let dateTimePicker;

  beforeEach(async () => {
    resetUniqueId();
    dateTimePicker = fixtureSync('<vaadin-date-time-picker></vaadin-date-time-picker>');
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(dateTimePicker).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      dateTimePicker.disabled = true;
      await expect(dateTimePicker).dom.to.equalSnapshot();
    });

    it('readonly', async () => {
      dateTimePicker.readonly = true;
      await nextUpdate(dateTimePicker);
      await expect(dateTimePicker).dom.to.equalSnapshot();
    });

    it('required', async () => {
      dateTimePicker.required = true;
      await expect(dateTimePicker).dom.to.equalSnapshot();
    });

    it('label', async () => {
      dateTimePicker.label = 'Label';
      await nextUpdate(dateTimePicker);
      await expect(dateTimePicker).dom.to.equalSnapshot();
    });

    it('helper', async () => {
      dateTimePicker.helperText = 'Helper';
      await nextUpdate(dateTimePicker);
      await expect(dateTimePicker).dom.to.equalSnapshot();
    });

    it('error', async () => {
      dateTimePicker.errorMessage = 'Error';
      dateTimePicker.invalid = true;
      await aTimeout(0);
      await expect(dateTimePicker).dom.to.equalSnapshot();
    });

    describe('overlay class', () => {
      const SNAPSHOT_CONFIG = {
        // Some inline CSS styles related to the overlay's position
        // may slightly change depending on the environment, so ignore them.
        ignoreAttributes: ['style'],
      };

      beforeEach(() => {
        dateTimePicker.overlayClass = 'custom date-time-picker-overlay';
      });

      it('date-picker', async () => {
        const datePicker = dateTimePicker.querySelector('[slot="date-picker"]');
        await open(datePicker);
        await expect(datePicker.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });

      it('time-picker', async () => {
        const timePicker = dateTimePicker.querySelector('[slot="time-picker"]');
        timePicker.opened = true;
        await nextUpdate(timePicker);
        await expect(timePicker.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(dateTimePicker).shadowDom.to.equalSnapshot();
    });
  });
});
