import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
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
});
