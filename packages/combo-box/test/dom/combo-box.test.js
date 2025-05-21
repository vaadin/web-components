import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '../../src/vaadin-combo-box.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-combo-box', () => {
  let comboBox;

  beforeEach(() => {
    resetUniqueId();
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(comboBox).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      comboBox.disabled = true;
      await expect(comboBox).dom.to.equalSnapshot();
    });

    it('placeholder', async () => {
      comboBox.placeholder = 'Placeholder';
      await nextUpdate(comboBox);
      await expect(comboBox).dom.to.equalSnapshot();
    });

    it('readonly', async () => {
      comboBox.readonly = true;
      await nextUpdate(comboBox);
      await expect(comboBox).dom.to.equalSnapshot();
    });

    it('required', async () => {
      comboBox.required = true;
      await expect(comboBox).dom.to.equalSnapshot();
    });

    it('pattern', async () => {
      comboBox.pattern = '[0-9]*';
      await nextUpdate(comboBox);
      await expect(comboBox).dom.to.equalSnapshot();
    });

    it('label', async () => {
      comboBox.label = 'Label';
      await nextUpdate(comboBox);
      await expect(comboBox).dom.to.equalSnapshot();
    });

    it('helper', async () => {
      comboBox.helperText = 'Helper';
      await nextUpdate(comboBox);
      await expect(comboBox).dom.to.equalSnapshot();
    });

    it('error', async () => {
      comboBox.errorMessage = 'Error';
      comboBox.invalid = true;
      await aTimeout(0);
      await expect(comboBox).dom.to.equalSnapshot();
    });

    it('value', async () => {
      comboBox.allowCustomValue = true;
      comboBox.value = 'value';
      await expect(comboBox).dom.to.equalSnapshot();
    });

    describe('opened', () => {
      const SNAPSHOT_CONFIG = {
        // Some inline CSS styles related to the overlay's position
        // may slightly change depending on the environment, so ignore them.
        ignoreAttributes: ['style'],
      };

      beforeEach(async () => {
        comboBox.items = ['Item 1', 'Item 2'];
        comboBox.open();
        await oneEvent(comboBox.$.overlay, 'vaadin-overlay-open');
      });

      it('default', async () => {
        await expect(comboBox).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });

      it('overlay', async () => {
        await expect(comboBox.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });

      it('overlay shadow', async () => {
        await expect(comboBox.$.overlay).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });

      it('overlay class', async () => {
        comboBox.overlayClass = 'combo-box-overlay custom';
        await nextUpdate(comboBox);
        await expect(comboBox.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });

      it('theme overlay', async () => {
        comboBox.setAttribute('theme', 'align-right');
        await nextUpdate(comboBox);
        await expect(comboBox.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(comboBox).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      comboBox.disabled = true;
      await nextUpdate(comboBox);
      await expect(comboBox).shadowDom.to.equalSnapshot();
    });

    it('readonly', async () => {
      comboBox.readonly = true;
      await nextUpdate(comboBox);
      await expect(comboBox).shadowDom.to.equalSnapshot();
    });

    it('invalid', async () => {
      comboBox.invalid = true;
      await nextUpdate(comboBox);
      await expect(comboBox).shadowDom.to.equalSnapshot();
    });

    it('theme', async () => {
      comboBox.setAttribute('theme', 'align-right');
      await nextUpdate(comboBox);
      await expect(comboBox).shadowDom.to.equalSnapshot();
    });
  });
});
