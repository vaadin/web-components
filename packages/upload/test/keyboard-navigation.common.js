import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import { createFile } from './helpers.js';

const FAKE_FILE = createFile(100000, 'application/uknown');

async function repeatTab(times) {
  for (let i = 0; i < times; i++) {
    await sendKeys({ press: 'Tab' });
  }
}

describe('keyboard navigation', () => {
  let uploadElement, fileElements, button;

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

    fileElements = uploadElement.querySelector('vaadin-upload-file');
  });

  afterEach(() => {
    button.focus();
  });

  it('should focus on the upload button', async () => {
    const uploadButton = uploadElement.shadowRoot.querySelector('[part=upload-button]');

    await repeatTab(1);

    expect(uploadElement.shadowRoot.activeElement).to.equal(uploadButton);
  });

  it('should focus on the file', async () => {
    await repeatTab(2);

    expect(document.activeElement).to.equal(fileElements);
  });

  describe('file', () => {
    beforeEach(async () => {
      uploadElement.files = [
        {
          ...FAKE_FILE,
          held: true, // Show the start button
          error: 'Error', // Show the retry button
          name: 'file-0',
        },
        {
          ...FAKE_FILE,
          held: true,
          error: 'Error',
          name: 'file-1',
        },
      ];

      await nextRender();
      fileElements = document.querySelectorAll('vaadin-upload-file');
    });

    it('should focus on the start button', async () => {
      const startButton = fileElements[0].shadowRoot.querySelector('[part=start-button]');

      await repeatTab(3);

      expect(fileElements[0].shadowRoot.activeElement).to.equal(startButton);
    });

    it('should focus on the retry button', async () => {
      const retryButton = fileElements[0].shadowRoot.querySelector('[part=retry-button]');

      await repeatTab(4);

      expect(fileElements[0].shadowRoot.activeElement).to.equal(retryButton);
    });

    it('should focus on the clear button', async () => {
      const removeButton = fileElements[0].shadowRoot.querySelector('[part=remove-button]');

      await repeatTab(5);

      expect(fileElements[0].shadowRoot.activeElement).to.equal(removeButton);
    });

    it('should focus on upload button when last remaining file is removed', async () => {
      const removeButton = fileElements[0].shadowRoot.querySelector('[part=remove-button]');
      const uploadButton = uploadElement.shadowRoot.querySelector('[part=upload-button]');
      removeButton.click();
      await nextFrame();
      expect(fileElements[0].shadowRoot.activeElement).to.equal(uploadButton);
    });

    it('should focus the next file after removing a file', async () => {
      const removeButton = fileElements[0].shadowRoot.querySelector('[part=remove-button]');
      removeButton.click();
      await nextFrame();
      const activeElementFileName = document.activeElement.shadowRoot.querySelector('#name').innerText;
      expect(activeElementFileName).to.equal('file-1');
    });

    it('should focus on previous when last file in list is removed', async () => {
      const removeButton = fileElements[1].shadowRoot.querySelector('[part=remove-button]');
      removeButton.click();
      await nextFrame();
      const activeElementFileName = document.activeElement.shadowRoot.querySelector('#name').innerText;
      expect(activeElementFileName).to.equal('file-0');
    });
  });
});
