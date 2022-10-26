import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-multi-select-combo-box.js';

describe('vaadin-multi-select-combo-box', () => {
  let multiSelectComboBox;

  beforeEach(() => {
    multiSelectComboBox = fixtureSync('<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(multiSelectComboBox).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(multiSelectComboBox).shadowDom.to.equalSnapshot();
    });
  });
});
