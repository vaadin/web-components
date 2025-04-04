import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-upload.js';
import { createFile } from './helpers.js';

describe('upload i18n', () => {
  let upload, addButton, dropLabel, fileItems;

  const pendingFile = createFile(100, 'image/jpeg');
  pendingFile.held = true;
  pendingFile.status = 'Queued';

  const failedFile = createFile(100, 'image/jpeg');
  failedFile.error = 'Upload failed';

  const completedFile = createFile(100, 'image/jpeg');
  completedFile.complete = true;

  const files = [pendingFile, failedFile, completedFile];

  beforeEach(async () => {
    upload = fixtureSync('<vaadin-upload></vaadin-upload>');
    upload.files = files;
    await nextRender();
    addButton = upload.querySelector('[slot="add-button"]');
    dropLabel = upload.querySelector('[slot="drop-label"]');
    const fileList = upload._fileList;
    fileItems = fileList.querySelectorAll('vaadin-upload-file');
  });

  describe('default i18n', () => {
    it('should use messages from default i18n', () => {
      expect(addButton.textContent).to.equal('Upload Files...');
      expect(dropLabel.textContent).to.equal('Drop files here');

      const startButton = fileItems[0].shadowRoot.querySelector('[part="start-button"]');
      expect(startButton.getAttribute('aria-label')).to.equal('Start');

      const retryButton = fileItems[1].shadowRoot.querySelector('[part="retry-button"]');
      expect(retryButton.getAttribute('aria-label')).to.equal('Retry');

      fileItems.forEach((item) => {
        const removeButton = item.shadowRoot.querySelector('[part="remove-button"]');
        expect(removeButton.getAttribute('aria-label')).to.equal('Remove');
      });
    });
  });

  describe('custom i18n', () => {
    it('should use messages from custom i18n when provided', async () => {
      upload.i18n = {
        addFiles: {
          one: 'Datei hochladen',
          many: 'Dateien hochladen',
        },
        dropFiles: {
          one: 'Datei hier ablegen',
          many: 'Dateien hier ablegen',
        },
        file: {
          start: 'Hochladen',
          retry: 'Wiederholen',
          remove: 'Entfernen',
        },
      };
      await nextRender();

      expect(addButton.textContent).to.equal('Dateien hochladen');
      expect(dropLabel.textContent).to.equal('Dateien hier ablegen');

      const startButton = fileItems[0].shadowRoot.querySelector('[part="start-button"]');
      expect(startButton.getAttribute('aria-label')).to.equal('Hochladen');

      const retryButton = fileItems[1].shadowRoot.querySelector('[part="retry-button"]');
      expect(retryButton.getAttribute('aria-label')).to.equal('Wiederholen');

      fileItems.forEach((item) => {
        const removeButton = item.shadowRoot.querySelector('[part="remove-button"]');
        expect(removeButton.getAttribute('aria-label')).to.equal('Entfernen');
      });
    });

    it('should fall back to default i18n if custom i18n does not define messages', async () => {
      upload.i18n = {};
      await nextRender();

      expect(addButton.textContent).to.equal('Upload Files...');
      expect(dropLabel.textContent).to.equal('Drop files here');

      const startButton = fileItems[0].shadowRoot.querySelector('[part="start-button"]');
      expect(startButton.getAttribute('aria-label')).to.equal('Start');

      const retryButton = fileItems[1].shadowRoot.querySelector('[part="retry-button"]');
      expect(retryButton.getAttribute('aria-label')).to.equal('Retry');

      fileItems.forEach((item) => {
        const removeButton = item.shadowRoot.querySelector('[part="remove-button"]');
        expect(removeButton.getAttribute('aria-label')).to.equal('Remove');
      });
    });
  });
});
