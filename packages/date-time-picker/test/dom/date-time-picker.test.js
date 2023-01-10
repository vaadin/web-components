import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-date-time-picker.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-date-time-picker', () => {
  let dateTimePicker;

  beforeEach(() => {
    resetUniqueId();
    dateTimePicker = fixtureSync('<vaadin-date-time-picker></vaadin-date-time-picker>');
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
      await expect(dateTimePicker).dom.to.equalSnapshot();
    });

    it('required', async () => {
      dateTimePicker.required = true;
      await expect(dateTimePicker).dom.to.equalSnapshot();
    });

    it('label', async () => {
      dateTimePicker.label = 'Label';
      await expect(dateTimePicker).dom.to.equalSnapshot();
    });

    it('helper', async () => {
      dateTimePicker.helperText = 'Helper';
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
