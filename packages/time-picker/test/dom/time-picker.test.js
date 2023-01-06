import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import '../../src/vaadin-time-picker.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-time-picker', () => {
  let timePicker, comboBox;

  beforeEach(() => {
    resetUniqueId();
    timePicker = fixtureSync('<vaadin-time-picker></vaadin-time-picker>');
    comboBox = timePicker.$.comboBox;
  });

  describe('host', () => {
    it('default', async () => {
      await expect(timePicker).dom.to.equalSnapshot();
    });

    it('label', async () => {
      timePicker.label = 'Label';
      await expect(timePicker).dom.to.equalSnapshot();
    });

    it('helper', async () => {
      timePicker.helperText = 'Helper';
      await expect(timePicker).dom.to.equalSnapshot();
    });

    it('error', async () => {
      timePicker.errorMessage = 'Error';
      timePicker.invalid = true;
      await aTimeout(0);
      await expect(timePicker).dom.to.equalSnapshot();
    });

    it('required', async () => {
      timePicker.required = true;
      await expect(timePicker).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      timePicker.disabled = true;
      await expect(timePicker).dom.to.equalSnapshot();
    });

    it('readonly', async () => {
      timePicker.readonly = true;
      await expect(timePicker).dom.to.equalSnapshot();
    });

    it('placeholder', async () => {
      timePicker.placeholder = 'Placeholder';
      await expect(timePicker).dom.to.equalSnapshot();
    });

    it('pattern', async () => {
      timePicker.pattern = '[0-9]*';
      await expect(timePicker).dom.to.equalSnapshot();
    });

    it('name', async () => {
      timePicker.name = 'Field Name';
      await expect(timePicker).dom.to.equalSnapshot();
    });

    describe('opened', () => {
      const SNAPSHOT_CONFIG = {
        // Some inline CSS styles related to the overlay's position
        // may slightly change depending on the environment, so ignore them.
        ignoreAttributes: ['style'],
      };

      beforeEach(async () => {
        comboBox.opened = true;
        await oneEvent(comboBox.$.overlay, 'vaadin-overlay-open');
      });

      it('default', async () => {
        await expect(timePicker).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });

      it('overlay', async () => {
        await expect(comboBox.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });

      it('overlay class', async () => {
        timePicker.overlayClass = 'custom time-picker-overlay';
        await expect(comboBox.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(timePicker).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      timePicker.disabled = true;
      await expect(timePicker).shadowDom.to.equalSnapshot();
    });

    it('readonly', async () => {
      timePicker.readonly = true;
      await expect(timePicker).shadowDom.to.equalSnapshot();
    });

    it('invalid', async () => {
      timePicker.invalid = true;
      await expect(timePicker).shadowDom.to.equalSnapshot();
    });

    it('theme', async () => {
      timePicker.setAttribute('theme', 'align-right');
      await expect(timePicker).shadowDom.to.equalSnapshot();
    });
  });
});
