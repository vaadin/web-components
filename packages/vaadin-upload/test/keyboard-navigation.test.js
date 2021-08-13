import { expect } from '@esm-bundle/chai';
import { sendKeys } from '@web/test-runner-commands';
import { fixtureSync, nextRender, isFirefox } from '@vaadin/testing-helpers';
import { createFile } from './common.js';
import '../vaadin-upload.js';

const FAKE_FILE = createFile(100000, 'application/uknown');

async function repeatTab(times) {
  for (let i = 0; i < times; i++) {
    await sendKeys({ press: 'Tab' });
  }
}

describe('keyboard navigation', () => {
  let uploadElement, fileElement;

  beforeEach(async () => {
    uploadElement = fixtureSync(`<vaadin-upload></vaadin-upload>`);
    uploadElement.files = [FAKE_FILE];

    await nextRender();

    fileElement = uploadElement.shadowRoot.querySelector('vaadin-upload-file');
  });

  it('should focus on the upload button', async () => {
    const uploadButton = uploadElement.shadowRoot.querySelector('[part=upload-button]');

    await repeatTab(1);

    expect(uploadElement.shadowRoot.activeElement).to.equal(uploadButton);
  });

  it('should focus on the file', async () => {
    await repeatTab(2);

    expect(uploadElement.shadowRoot.activeElement).to.equal(fileElement);
  });

  // Skips the following bunch of tests in Firefox as there is a bug
  // that causes the focus to stuck on the body element.
  // No possible workarounds were found at the time of writing this note.
  (isFirefox ? describe.skip : describe)('file', () => {
    beforeEach(() => {
      // To show the start button
      uploadElement.files[0].held = true;
      // To show the retry button
      uploadElement.files[0].error = 'Error';
      uploadElement._notifyFileChanges(uploadElement.files[0]);
    });

    it('should focus on the start button', async () => {
      const startButton = fileElement.shadowRoot.querySelector('[part=start-button]');

      await repeatTab(3);

      expect(fileElement.shadowRoot.activeElement).to.equal(startButton);
    });

    it('should focus on the retry button', async () => {
      const retryButton = fileElement.shadowRoot.querySelector('[part=retry-button]');

      await repeatTab(4);

      expect(fileElement.shadowRoot.activeElement).to.equal(retryButton);
    });

    it('should focus on the clear button', async () => {
      const removeButton = fileElement.shadowRoot.querySelector('[part=clear-button]');

      await repeatTab(5);

      expect(fileElement.shadowRoot.activeElement).to.equal(removeButton);
    });
  });
});
