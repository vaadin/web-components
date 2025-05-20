import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-number-field.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-number-field', () => {
  let field;

  beforeEach(async () => {
    resetUniqueId();
    field = fixtureSync('<vaadin-number-field></vaadin-number-field>');
    await nextUpdate(field);
  });

  describe('host', () => {
    it('default', async () => {
      await expect(field).dom.to.equalSnapshot();
    });

    it('helper', async () => {
      field.helperText = 'Helper';
      await nextUpdate(field);
      await expect(field).dom.to.equalSnapshot();
    });

    it('error', async () => {
      field.errorMessage = 'Error';
      field.invalid = true;
      await aTimeout(0);
      await expect(field).dom.to.equalSnapshot();
    });

    it('min', async () => {
      field.min = 2;
      await nextUpdate(field);
      await expect(field).dom.to.equalSnapshot();
    });

    it('max', async () => {
      field.max = 2;
      await nextUpdate(field);
      await expect(field).dom.to.equalSnapshot();
    });

    it('step', async () => {
      field.step = 2;
      await nextUpdate(field);
      await expect(field).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('step-buttons-visible', async () => {
      field.stepButtonsVisible = true;
      await nextUpdate(field);
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      field.disabled = true;
      await nextUpdate(field);
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('readonly', async () => {
      field.readonly = true;
      await nextUpdate(field);
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('invalid', async () => {
      field.invalid = true;
      await nextUpdate(field);
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('theme', async () => {
      field.setAttribute('theme', 'align-right');
      await nextUpdate(field);
      await expect(field).shadowDom.to.equalSnapshot();
    });
  });
});
