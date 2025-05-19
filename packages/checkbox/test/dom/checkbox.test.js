import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../vaadin-checkbox.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-checkbox', () => {
  let checkbox;

  beforeEach(() => {
    resetUniqueId();
    checkbox = fixtureSync('<vaadin-checkbox></vaadin-checkbox>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(checkbox).dom.to.equalSnapshot();
    });

    it('name', async () => {
      checkbox.name = 'Name';
      await nextUpdate(checkbox);
      await expect(checkbox).dom.to.equalSnapshot();
    });

    it('label', async () => {
      checkbox.label = 'Label';
      await nextUpdate(checkbox);
      await expect(checkbox).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      checkbox.disabled = true;
      await expect(checkbox).dom.to.equalSnapshot();
    });

    it('readonly', async () => {
      checkbox.readonly = true;
      await nextUpdate(checkbox);
      await expect(checkbox).dom.to.equalSnapshot();
    });

    it('helper', async () => {
      checkbox.helperText = 'Helper';
      await nextUpdate(checkbox);
      await expect(checkbox).dom.to.equalSnapshot();
    });

    it('required', async () => {
      checkbox.required = true;
      await expect(checkbox).dom.to.equalSnapshot();
    });

    it('error', async () => {
      checkbox.errorMessage = 'Error';
      checkbox.invalid = true;
      await aTimeout(0);
      await expect(checkbox).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(checkbox).shadowDom.to.equalSnapshot();
    });
  });
});
