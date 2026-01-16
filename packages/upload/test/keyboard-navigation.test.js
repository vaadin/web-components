import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-upload.js';
import { createFile } from './helpers.js';

const FAKE_FILE = createFile(100000, 'application/uknown');

async function repeatTab(times) {
  for (let i = 0; i < times; i++) {
    await sendKeys({ press: 'Tab' });
  }
}

describe('keyboard navigation', () => {
  let uploadElement, fileElements, button, uploadButton;

  before(() => {
    // Firefox has an issue with focus stuck when an upload element
    // is removed from the DOM, so we use a button to prevent that.
    button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();
  });

  after(() => {
    document.body.removeChild(button);
  });

  beforeEach(async () => {
    uploadElement = fixtureSync(`<vaadin-upload></vaadin-upload>`);
    uploadElement.files = [FAKE_FILE];

    await nextRender();
    uploadButton = uploadElement.querySelector('vaadin-button[slot=add-button]');
    fileElements = uploadElement.querySelectorAll('vaadin-upload-file');
  });

  afterEach(() => {
    button.focus();
  });

  it('should focus on the upload button', async () => {
    await repeatTab(1);

    expect(document.activeElement).to.not.equal(null);
    expect(document.activeElement).to.equal(uploadButton);
  });

  it('should focus on the file', async () => {
    await repeatTab(2);

    expect(document.activeElement).to.equal(fileElements[0]);
    expect(document.activeElement).to.not.equal(null);
  });

  describe('file', () => {
    beforeEach(async () => {
      const fileList = [];
      for (let i = 0; i < 2; i++) {
        const file = createFile(1000, 'application/uknown');
        Object.assign(file, { name: `file-${i}`, held: true, error: 'Error' });
        fileList.push(file);
      }
      uploadElement.files = fileList;

      await nextRender();
      fileElements = uploadElement.querySelectorAll('vaadin-upload-file');
    });

    it('should focus on the start button', async () => {
      const startButton = fileElements[0].shadowRoot.querySelector('[part=start-button]');

      await repeatTab(3);

      expect(fileElements[0].shadowRoot.activeElement).to.not.equal(null);
      expect(fileElements[0].shadowRoot.activeElement).to.equal(startButton);
    });

    it('should focus on the retry button', async () => {
      const retryButton = fileElements[0].shadowRoot.querySelector('[part=retry-button]');

      await repeatTab(4);

      expect(fileElements[0].shadowRoot.activeElement).to.not.equal(null);
      expect(fileElements[0].shadowRoot.activeElement).to.equal(retryButton);
    });

    it('should focus on the clear button', async () => {
      const removeButton = fileElements[0].shadowRoot.querySelector('[part=remove-button]');

      await repeatTab(5);

      expect(fileElements[0].shadowRoot.activeElement).to.not.equal(null);
      expect(fileElements[0].shadowRoot.activeElement).to.equal(removeButton);
    });

    it('should focus on upload button when last remaining file is removed', async () => {
      const removeButton = fileElements[0].shadowRoot.querySelector('[part=remove-button]');

      removeButton.click();
      await nextFrame();
      removeButton.click();
      await nextFrame();

      expect(document.activeElement).to.not.equal(null);
      expect(document.activeElement).to.equal(uploadButton);
    });

    it('should focus the next file after removing a file', async () => {
      const removeButton = fileElements[0].shadowRoot.querySelector('[part=remove-button]');

      removeButton.click();
      await nextFrame();

      expect(document.activeElement.file.name).to.equal('file-1');
    });

    it('should focus on previous when last file in list is removed', async () => {
      const removeButton = fileElements[1].shadowRoot.querySelector('[part=remove-button]');

      removeButton.click();
      await nextFrame();

      expect(document.activeElement.file.name).to.equal('file-0');
    });

    it('should not change focus after upload', async () => {
      // Programmatic upload does not actually set focus, so we first navigate to the button.
      await repeatTab(1);

      uploadElement.uploadFiles(FAKE_FILE);

      expect(document.activeElement).to.equal(uploadButton);
    });
  });
});
