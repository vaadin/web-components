import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-date-time-picker.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

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
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(dateTimePicker).shadowDom.to.equalSnapshot();
    });
  });
});
