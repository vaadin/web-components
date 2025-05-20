import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-integer-field.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-integer-field', () => {
  let field;

  beforeEach(async () => {
    resetUniqueId();
    field = fixtureSync('<vaadin-integer-field></vaadin-integer-field>');
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
