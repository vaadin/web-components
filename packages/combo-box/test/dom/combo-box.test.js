import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-combo-box.js';

describe('vaadin-combo-box', () => {
  let comboBox;

  // Ignore generated attributes to prevent failures
  // when running snapshot tests in a different order
  const SNAPSHOT_CONFIG = {
    ignoreAttributes: ['id', 'aria-describedby', 'aria-labelledby', 'for']
  };

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(comboBox).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      comboBox.disabled = true;
      await expect(comboBox).shadowDom.to.equalSnapshot();
    });

    it('readonly', async () => {
      comboBox.readonly = true;
      await expect(comboBox).shadowDom.to.equalSnapshot();
    });

    it('invalid', async () => {
      comboBox.invalid = true;
      await expect(comboBox).shadowDom.to.equalSnapshot();
    });

    it('theme', async () => {
      comboBox.setAttribute('theme', 'align-right');
      await expect(comboBox).shadowDom.to.equalSnapshot();
    });
  });

  describe('slots', () => {
    it('default', async () => {
      await expect(comboBox).lightDom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('helper', async () => {
      comboBox.helperText = 'Helper';
      await expect(comboBox).lightDom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });
  });
});
