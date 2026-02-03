import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown, nextUpdate } from '@vaadin/testing-helpers';

window.Vaadin = window.Vaadin || {};
window.Vaadin.featureFlags = window.Vaadin.featureFlags || {};
window.Vaadin.featureFlags.aiComponents = true;

import '../../src/vaadin-upload-button.js';

describe('vaadin-upload-button', () => {
  let button;

  beforeEach(() => {
    button = fixtureSync('<vaadin-upload-button>Upload</vaadin-upload-button>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(button).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      button.disabled = true;
      await nextUpdate(button);
      await expect(button).dom.to.equalSnapshot();
    });

    it('max-files-reached', async () => {
      button.maxFilesReached = true;
      await nextUpdate(button);
      await expect(button).dom.to.equalSnapshot();
    });

    it('focused', async () => {
      button.focus({ focusVisible: false });
      await expect(button).dom.to.equalSnapshot();
    });

    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await expect(button).dom.to.equalSnapshot();
    });

    it('active', async () => {
      mousedown(button);
      await expect(button).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(button).shadowDom.to.equalSnapshot();
    });
  });
});
