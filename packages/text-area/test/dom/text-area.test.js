import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-text-area.js';

describe('vaadin-text-area', () => {
  let textArea;

  // Ignore generated attributes to prevent failures
  // when running snapshot tests in a different order
  const SNAPSHOT_CONFIG = {
    ignoreAttributes: ['id', 'aria-describedby', 'aria-labelledby', 'for'],
  };

  beforeEach(() => {
    textArea = fixtureSync('<vaadin-text-area></vaadin-text-area>');
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(textArea).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      textArea.disabled = true;
      await expect(textArea).shadowDom.to.equalSnapshot();
    });

    it('readonly', async () => {
      textArea.readonly = true;
      await expect(textArea).shadowDom.to.equalSnapshot();
    });

    it('invalid', async () => {
      textArea.invalid = true;
      await expect(textArea).shadowDom.to.equalSnapshot();
    });

    it('theme', async () => {
      textArea.setAttribute('theme', 'align-right');
      await expect(textArea).shadowDom.to.equalSnapshot();
    });
  });

  describe('slots', () => {
    it('default', async () => {
      await expect(textArea).lightDom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('helper', async () => {
      textArea.helperText = 'Helper';
      await expect(textArea).lightDom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });
  });
});
