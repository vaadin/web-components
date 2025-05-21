import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-text-area.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-text-area', () => {
  let textArea;

  beforeEach(() => {
    resetUniqueId();
    textArea = fixtureSync('<vaadin-text-area></vaadin-text-area>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(textArea).dom.to.equalSnapshot();
    });

    it('helper', async () => {
      textArea.helperText = 'Helper';
      await nextUpdate(textArea);
      await expect(textArea).dom.to.equalSnapshot();
    });

    it('error', async () => {
      textArea.errorMessage = 'Error';
      textArea.invalid = true;
      await aTimeout(0);
      await expect(textArea).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    const SNAPSHOT_CONFIG = {
      // Exclude custom CSS property set as inline style,
      // as corresponding logic is covered by unit tests.
      ignoreAttributes: ['style'],
    };

    it('default', async () => {
      await expect(textArea).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('disabled', async () => {
      textArea.disabled = true;
      await nextUpdate(textArea);
      await expect(textArea).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('readonly', async () => {
      textArea.readonly = true;
      await nextUpdate(textArea);
      await expect(textArea).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('invalid', async () => {
      textArea.invalid = true;
      await nextUpdate(textArea);
      await expect(textArea).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('theme', async () => {
      textArea.setAttribute('theme', 'align-right');
      await nextUpdate(textArea);
      await expect(textArea).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });
  });
});
