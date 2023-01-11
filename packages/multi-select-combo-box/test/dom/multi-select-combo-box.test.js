import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-multi-select-combo-box.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-multi-select-combo-box', () => {
  let multiSelectComboBox, comboBox;

  beforeEach(async () => {
    resetUniqueId();
    multiSelectComboBox = fixtureSync('<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>');
    await nextRender();
    comboBox = multiSelectComboBox.$.comboBox;
  });

  describe('host', () => {
    it('default', async () => {
      await expect(multiSelectComboBox).dom.to.equalSnapshot();
    });

    it('label', async () => {
      multiSelectComboBox.label = 'Label';
      await expect(multiSelectComboBox).dom.to.equalSnapshot();
    });

    it('helper', async () => {
      multiSelectComboBox.helperText = 'Helper';
      await expect(multiSelectComboBox).dom.to.equalSnapshot();
    });

    it('error', async () => {
      multiSelectComboBox.errorMessage = 'Error';
      multiSelectComboBox.invalid = true;
      await aTimeout(0);
      await expect(multiSelectComboBox).dom.to.equalSnapshot();
    });

    it('required', async () => {
      multiSelectComboBox.required = true;
      await expect(multiSelectComboBox).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      multiSelectComboBox.disabled = true;
      await expect(multiSelectComboBox).dom.to.equalSnapshot();
    });

    it('readonly', async () => {
      multiSelectComboBox.readonly = true;
      await expect(multiSelectComboBox).dom.to.equalSnapshot();
    });

    it('placeholder', async () => {
      multiSelectComboBox.placeholder = 'Placeholder';
      await expect(multiSelectComboBox).dom.to.equalSnapshot();
    });

    describe('opened', () => {
      const SNAPSHOT_CONFIG = {
        // Some inline CSS styles related to the overlay's position
        // may slightly change depending on the environment, so ignore them.
        ignoreAttributes: ['style'],
      };

      beforeEach(async () => {
        multiSelectComboBox.opened = true;
        await nextRender();
      });

      it('default', async () => {
        await expect(multiSelectComboBox).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });

      it('overlay', async () => {
        await expect(comboBox.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(multiSelectComboBox).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      multiSelectComboBox.disabled = true;
      await expect(multiSelectComboBox).shadowDom.to.equalSnapshot();
    });

    it('readonly', async () => {
      multiSelectComboBox.readonly = true;
      await expect(multiSelectComboBox).shadowDom.to.equalSnapshot();
    });

    it('invalid', async () => {
      multiSelectComboBox.invalid = true;
      await expect(multiSelectComboBox).shadowDom.to.equalSnapshot();
    });
  });
});
