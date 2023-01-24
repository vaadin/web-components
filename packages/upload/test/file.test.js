import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '../vaadin-upload.js';
import { createFile } from './helpers.js';

describe('<vaadin-upload-file> element', () => {
  let fileElement, fileObject;

  beforeEach(() => {
    fileElement = fixtureSync(`<vaadin-upload-file></vaadin-upload-file>`);
    fileObject = createFile(100000, 'application/unknown');
    fileElement.file = fileObject;
  });

  describe('state attributes', () => {
    it('should not be uploading by default', () => {
      expect(fileElement.hasAttribute('uploading')).to.be.false;
    });

    it('should reflect uploading', () => {
      fileElement.uploading = true;
      expect(fileElement.hasAttribute('uploading')).to.be.true;
    });

    it('should not be indeterminate by default', () => {
      expect(fileElement.hasAttribute('indeterminate')).to.be.false;
    });

    it('should reflect indeterminate', () => {
      fileElement.indeterminate = true;
      expect(fileElement.hasAttribute('indeterminate')).to.be.true;
    });

    it('should not be complete by default', () => {
      expect(fileElement.hasAttribute('complete')).to.be.false;
    });

    it('should reflect complete', () => {
      fileElement.complete = true;
      expect(fileElement.hasAttribute('complete')).to.be.true;
    });

    it('should not be error by default', () => {
      expect(fileElement.hasAttribute('error')).to.be.false;
    });

    it('should reflect error', () => {
      fileElement.errorMessage = 'Server error';
      expect(fileElement.hasAttribute('error')).to.be.true;
    });
  });

  describe('focus', () => {
    beforeEach(() => {
      // Show the "Start" button
      fileElement.held = true;
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
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

      expect(fileElement.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not set focus-ring on Shift Tab to button', async () => {
      const button = fileElement.shadowRoot.querySelector('[part="remove-button"]');
      button.focus();
      await sendKeys({ press: 'Tab' });

      // Move focus back to the button.
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

      expect(fileElement.hasAttribute('focus-ring')).to.be.false;
    });
  });
});
