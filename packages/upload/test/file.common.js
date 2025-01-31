import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { createFile } from './helpers.js';

describe('<vaadin-upload-file> element', () => {
  let fileElement, fileObject;

  beforeEach(async () => {
    fileElement = fixtureSync(`<vaadin-upload-file></vaadin-upload-file>`);
    fileElement.i18n = {
      file: {
        start: 'Start',
        retry: 'Retry',
        remove: 'Remove',
      },
    };
    fileObject = createFile(100000, 'application/unknown');
    fileElement.file = fileObject;
    await nextRender();
  });

  describe('state attributes', () => {
    it('should not be uploading by default', () => {
      expect(fileElement.hasAttribute('uploading')).to.be.false;
    });

    it('should reflect uploading', async () => {
      fileElement.uploading = true;
      await nextUpdate(fileElement);
      expect(fileElement.hasAttribute('uploading')).to.be.true;
    });

    it('should not be indeterminate by default', () => {
      expect(fileElement.hasAttribute('indeterminate')).to.be.false;
    });

    it('should reflect indeterminate', async () => {
      fileElement.indeterminate = true;
      await nextUpdate(fileElement);
      expect(fileElement.hasAttribute('indeterminate')).to.be.true;
    });

    it('should not be complete by default', () => {
      expect(fileElement.hasAttribute('complete')).to.be.false;
    });

    it('should reflect complete', async () => {
      fileElement.complete = true;
      await nextUpdate(fileElement);
      expect(fileElement.hasAttribute('complete')).to.be.true;
    });

    it('should not be error by default', () => {
      expect(fileElement.hasAttribute('error')).to.be.false;
    });

    it('should reflect error', async () => {
      fileElement.errorMessage = 'Server error';
      await nextUpdate(fileElement);
      expect(fileElement.hasAttribute('error')).to.be.true;
    });
  });

  describe('focus', () => {
    beforeEach(async () => {
      // Show the "Start" button
      fileElement.held = true;
      await nextUpdate(fileElement);
    });

    it('should not add focus-ring to the host on programmatic focus', () => {
      fileElement.focus();
      expect(fileElement.hasAttribute('focus-ring')).to.be.false;
    });

    it('should add focus-ring to the host on keyboard focus', async () => {
      await sendKeys({ press: 'Tab' });
      expect(fileElement.hasAttribute('focus-ring')).to.be.true;
    });

    it('should remove focus-ring when a button is focused', async () => {
      await sendKeys({ press: 'Tab' });

      // Focus the button
      await sendKeys({ press: 'Tab' });

      expect(fileElement.hasAttribute('focus-ring')).to.be.false;
    });

    it('should restore focus-ring when focus moves back', async () => {
      const button = fileElement.shadowRoot.querySelector('button');
      button.focus();

      // Move focus back to the upload file.
      await sendKeys({ press: 'Shift+Tab' });

      expect(fileElement.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not set focus-ring on Shift Tab to button', async () => {
      const button = fileElement.shadowRoot.querySelector('[part="remove-button"]');
      button.focus();
      await sendKeys({ press: 'Tab' });

      // Move focus back to the button.
      await sendKeys({ press: 'Shift+Tab' });

      expect(fileElement.hasAttribute('focus-ring')).to.be.false;
    });
  });
});
