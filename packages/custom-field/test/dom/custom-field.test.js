import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-custom-field.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-custom-field', () => {
  let field;

  beforeEach(() => {
    resetUniqueId();
    field = fixtureSync('<vaadin-custom-field></vaadin-custom-field>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(field).dom.to.equalSnapshot();
    });

    it('label', async () => {
      field.label = 'Label';
      await expect(field).dom.to.equalSnapshot();
    });

    it('required', async () => {
      field.required = true;
      await expect(field).dom.to.equalSnapshot();
    });

    it('helper', async () => {
      field.helperText = 'Helper';
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
  });
});
