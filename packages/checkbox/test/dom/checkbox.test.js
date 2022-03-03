import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../vaadin-checkbox.js';

describe('vaadin-checkbox', () => {
  let checkbox;

  beforeEach(() => {
    checkbox = fixtureSync('<vaadin-checkbox label="I accept terms and conditions"></vaadin-checkbox>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(checkbox).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      checkbox.disabled = true;
      await expect(checkbox).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(checkbox).shadowDom.to.equalSnapshot();
    });
  });
});
