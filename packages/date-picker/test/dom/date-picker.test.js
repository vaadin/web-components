import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-date-picker.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

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

    it('placeholder', async () => {
      datePicker.placeholder = 'Placeholder';
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
