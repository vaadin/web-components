import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../vaadin-radio-button.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-radio-button', () => {
  let checkbox;

  beforeEach(() => {
    resetUniqueId();
    checkbox = fixtureSync('<vaadin-radio-button label="Radio button"></vaadin-radio-button>');
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
