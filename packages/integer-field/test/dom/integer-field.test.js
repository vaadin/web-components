import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-integer-field.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-integer-field', () => {
  let field;

  beforeEach(() => {
    resetUniqueId();
    field = fixtureSync('<vaadin-integer-field></vaadin-integer-field>');
  });

  describe('host', () => {
    it('default', async () => {
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

    it('controls', async () => {
      field.hasControls = true;
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
