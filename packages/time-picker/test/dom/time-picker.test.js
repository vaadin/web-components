import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-time-picker.js';

describe('vaadin-time-picker', () => {
  let timePicker;

  // Ignore generated attributes to prevent failures
  // when running snapshot tests in a different order
  const SNAPSHOT_CONFIG = {
    ignoreAttributes: ['id', 'aria-describedby', 'aria-labelledby', 'for'],
  };

  beforeEach(() => {
    timePicker = fixtureSync('<vaadin-time-picker></vaadin-time-picker>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(timePicker).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('label', async () => {
      timePicker.label = 'Label';
      await expect(timePicker).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('helper', async () => {
      timePicker.helperText = 'Helper';
      await expect(timePicker).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('error', async () => {
      timePicker.errorMessage = 'Error';
      timePicker.invalid = true;
      await expect(timePicker).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('disabled', async () => {
      timePicker.disabled = true;
      await expect(timePicker).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('readonly', async () => {
      timePicker.readonly = true;
      await expect(timePicker).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('placeholder', async () => {
      timePicker.placeholder = 'Placeholder';
      await expect(timePicker).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('pattern', async () => {
      timePicker.pattern = '[0-9]*';
      await expect(timePicker).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
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
