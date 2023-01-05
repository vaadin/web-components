import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-date-picker.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { open } from '../common.js';

describe('vaadin-date-picker', () => {
  let datePicker;

  beforeEach(() => {
    resetUniqueId();
    datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(datePicker).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      datePicker.disabled = true;
      await expect(datePicker).dom.to.equalSnapshot();
    });

    it('placeholder', async () => {
      datePicker.placeholder = 'Placeholder';
      await expect(datePicker).dom.to.equalSnapshot();
    });

    it('readonly', async () => {
      datePicker.readonly = true;
      await expect(datePicker).dom.to.equalSnapshot();
    });

    it('required', async () => {
      datePicker.required = true;
      await expect(datePicker).dom.to.equalSnapshot();
    });

    it('label', async () => {
      datePicker.label = 'Label';
      await expect(datePicker).dom.to.equalSnapshot();
    });

    it('helper', async () => {
      datePicker.helperText = 'Helper';
      await expect(datePicker).dom.to.equalSnapshot();
    });

    it('error', async () => {
      datePicker.errorMessage = 'Error';
      datePicker.invalid = true;
      await aTimeout(0);
      await expect(datePicker).dom.to.equalSnapshot();
    });

    it('name', async () => {
      datePicker.name = 'Field Name';
      await expect(datePicker).dom.to.equalSnapshot();
    });

    it('value', async () => {
      datePicker.value = '2000-02-01';
      await expect(datePicker).dom.to.equalSnapshot();
    });

    describe('opened', () => {
      const SNAPSHOT_CONFIG = {
        // Some inline CSS styles related to the overlay's position
        // may slightly change depending on the environment, so ignore them.
        ignoreAttributes: ['style'],
      };

      beforeEach(async () => {
        await open(datePicker);
      });

      it('overlay', async () => {
        await expect(datePicker.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });

      it('overlay theme', async () => {
        datePicker.setAttribute('theme', 'custom');
        await expect(datePicker.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(datePicker).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      datePicker.disabled = true;
      await expect(datePicker).shadowDom.to.equalSnapshot();
    });

    it('readonly', async () => {
      datePicker.readonly = true;
      await expect(datePicker).shadowDom.to.equalSnapshot();
    });

    it('invalid', async () => {
      datePicker.invalid = true;
      await expect(datePicker).shadowDom.to.equalSnapshot();
    });

    it('theme', async () => {
      datePicker.setAttribute('theme', 'align-right');
      await expect(datePicker).shadowDom.to.equalSnapshot();
    });
  });
});
