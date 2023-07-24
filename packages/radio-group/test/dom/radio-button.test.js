import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../vaadin-radio-button.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-radio-button', () => {
  let radio;

  beforeEach(() => {
    resetUniqueId();
    radio = fixtureSync('<vaadin-radio-button label="Radio button"></vaadin-radio-button>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(radio).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      radio.disabled = true;
      await expect(radio).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(radio).shadowDom.to.equalSnapshot();
    });
  });
});
