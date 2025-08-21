import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-upload-file.js';
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

    it('should not be disabled by default', () => {
      expect(fileElement.hasAttribute('disabled')).to.be.false;
    });

    it('should reflect disabled', async () => {
      fileElement.disabled = true;
      await nextUpdate(fileElement);
      expect(fileElement.hasAttribute('disabled')).to.be.true;
    });
  });

  describe('focus', () => {
    beforeEach(async () => {
      // Show the "Start" button
      fileElement.held = true;
      await nextUpdate(fileElement);
    });

    it('should be focusable by default', () => {
      fileElement.focus();
      expect(fileElement.hasAttribute('focused')).to.be.true;
      expect(document.activeElement).to.equal(fileElement);
    });

    it('should not be focusable when disabled', async () => {
      fileElement.disabled = true;
      await nextUpdate(fileElement);
      fileElement.focus();
      expect(fileElement.hasAttribute('focused')).to.be.false;
      expect(document.activeElement).to.not.equal(fileElement);
    });

    it('should reflect tabindex to attribute', async () => {
      expect(fileElement.getAttribute('tabindex')).to.equal('0');

      fileElement.tabIndex = 1;
      await nextUpdate(fileElement);
      expect(fileElement.getAttribute('tabindex')).to.equal('1');
    });

    it('should remove tabindex attribute when disabled', async () => {
      expect(fileElement.getAttribute('tabindex')).to.equal('0');

      fileElement.disabled = true;
      await nextUpdate(fileElement);
      expect(fileElement.hasAttribute('tabindex')).to.be.false;
    });

    it('should add focus-ring to the host on programmatic focus', () => {
      fileElement.focus();
      expect(fileElement.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not add focus-ring to the host on focus() with focusVisible: false', () => {
      fileElement.focus({ focusVisible: false });
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

  describe('disabled', () => {
    it('should not disable buttons by default', () => {
      const buttons = fileElement.shadowRoot.querySelectorAll('[part$="-button"]');
      buttons.forEach((button) => {
        expect(button.disabled).to.be.false;
      });
    });

    it('should disable all buttons when disabled', async () => {
      fileElement.disabled = true;
      await nextUpdate(fileElement);

      const buttons = fileElement.shadowRoot.querySelectorAll('[part$="-button"]');
      buttons.forEach((button) => {
        expect(button.disabled).to.be.true;
      });
    });

    it('should be focusable by default', () => {
      expect(fileElement.tabIndex).to.equal(0);
    });

    it('should not be focusable when disabled', async () => {
      fileElement.disabled = true;
      await nextUpdate(fileElement);
      expect(fileElement.tabIndex).to.equal(-1);
    });
  });
});
