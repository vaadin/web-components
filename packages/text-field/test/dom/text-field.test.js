import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-text-field.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-text-field', () => {
  let field;

  beforeEach(() => {
    resetUniqueId();
    field = fixtureSync('<vaadin-text-field></vaadin-text-field>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(field).dom.to.equalSnapshot();
    });

    it('label', async () => {
      field.label = 'Label';
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

    it('disabled', async () => {
      field.disabled = true;
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('readonly', async () => {
      field.readonly = true;
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('invalid', async () => {
      field.invalid = true;
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('theme', async () => {
      field.setAttribute('theme', 'align-right');
      await expect(field).shadowDom.to.equalSnapshot();
    });
  });
});
