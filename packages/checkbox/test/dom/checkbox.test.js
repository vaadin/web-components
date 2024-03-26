import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
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
      await expect(checkbox).dom.to.equalSnapshot();
    });

    it('label', async () => {
      checkbox.label = 'Label';
      await expect(checkbox).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      checkbox.disabled = true;
      await expect(checkbox).dom.to.equalSnapshot();
    });

    it('readonly', async () => {
      checkbox.readonly = true;
      await expect(checkbox).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(checkbox).shadowDom.to.equalSnapshot();
    });
  });
});
