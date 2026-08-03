import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload.js';
import { DEFAULT_I18N } from '../src/vaadin-upload-mixin.js';
import { addFilesViaInput, createFile, xhrCreator } from './helpers.js';

const CUSTOM_I18N = {
  dropFiles: {
    one: 'Dateien hier ablegen',
    many: 'Dateien hier ablegen',
  },
  addFiles: {
    one: 'Datei hochladen...',
    many: 'Dateien hochladen...',
  },
  error: {
    tooManyFiles: 'Zu viele Dateien.',
    fileIsTooBig: 'Datei ist zu groß.',
    incorrectFileType: 'Falscher Dateityp.',
  },
  uploading: {
    status: {
      connecting: 'Verbinden...',
      stalled: 'Blockiert',
      processing: 'Datei wird verarbeitet...',
      held: 'In Warteschlange',
    },
    remainingTime: {
      prefix: 'Verbleibende Zeit: ',
      unknown: 'Unbekannte verbleibende Zeit',
    },
    error: {
      serverUnavailable: 'Hochladen fehlgeschlagen, bitte später erneut versuchen',
      unexpectedServerError: 'Hochladen aufgrund eines Serverfehlers fehlgeschlagen',
      forbidden: 'Hochladen verboten',
      fileTooLarge: 'Datei ist zu groß',
    },
  },
  file: {
    retry: 'Wiederholen',
    start: 'Starten',
    remove: 'Entfernen',
  },
  units: {
    size: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
  },
};

const PARTIAL_I18N = {
  dropFiles: {
    one: 'PDF hier ablegen',
    many: 'PDFs hier ablegen',
  },
  addFiles: {
    one: 'PDF hochladen...',
    many: 'PDFs hochladen...',
  },
};

const i18nConfigs = [
  { name: 'default i18n', i18n: DEFAULT_I18N, expectedI18n: DEFAULT_I18N },
  { name: 'custom i18n', i18n: CUSTOM_I18N, expectedI18n: CUSTOM_I18N },
  { name: 'partial i18n', i18n: PARTIAL_I18N, expectedI18n: { ...DEFAULT_I18N, ...PARTIAL_I18N } },
];

describe('custom formatters', () => {
  let upload, clock, file;

  beforeEach(async () => {
    upload = fixtureSync('<vaadin-upload></vaadin-upload>');
    upload.target = 'https://foo.com/bar';
    await nextRender();
    file = createFile(100000, 'application/octet-stream');
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('should use custom formatSize for file size strings', async () => {
    upload.i18n = { formatSize: (bytes) => `${bytes} B!` };
    upload._createXhr = xhrCreator({ size: file.size, uploadTime: 200, stepTime: 50 });
    upload.uploadFiles(file);
    await clock.tickAsync(110);
    expect(file.totalStr).to.equal('100000 B!');
    expect(file.loadedStr).to.equal('50000 B!');
  });

  it('should use custom formatTime for elapsed time strings', async () => {
    upload.i18n = { formatTime: (seconds) => `${seconds} seconds` };
    upload._createXhr = xhrCreator({ size: file.size, connectTime: 1000, uploadTime: 4000, stepTime: 2000 });
    upload.uploadFiles(file);
    await clock.tickAsync(3000);
    expect(file.elapsedStr).to.equal('3 seconds');
  });
});

describe('default i18n', () => {
  it('should keep the default i18n key order', () => {
    expect(Object.keys(DEFAULT_I18N)).to.eql(['dropFiles', 'addFiles', 'error', 'uploading', 'file', 'units']);
  });
});

describe('upload i18n', () => {
  i18nConfigs.forEach(({ name, i18n, expectedI18n }) => {
    describe(name, () => {
      let upload, clock;

      beforeEach(async () => {
        upload = fixtureSync('<vaadin-upload></vaadin-upload>');
        if (i18n !== DEFAULT_I18N) {
          upload.i18n = i18n;
        }
        await nextRender();
        clock = sinon.useFakeTimers();
      });

      afterEach(() => {
        clock.restore();
      });

      async function setupFile(xhrOptions, delay) {
        upload.files = [];
        upload._activeUploads = 0;
        upload._uploadQueue = [];
        const file = createFile(100000, 'application/octet-stream');
        if (xhrOptions) {
          upload._createXhr = xhrCreator({
            size: file.size,
            ...xhrOptions,
          });
        }
        addFilesViaInput(upload, [file]);
        await clock.tickAsync(delay);
      }

      async function setupQueuedFile() {
        upload.noAuto = true;
        await setupFile(null, 1);
        upload.noAuto = false;
      }

      async function setupConnectingFile() {
        await setupFile({ connectTime: 100 }, 50);
      }

      async function setupUploadingFile() {
        await setupFile({ connectTime: 100, uploadTime: 200 }, 200);
      }

      async function setupProcessingFile() {
        await setupFile({ connectTime: 100, uploadTime: 200, serverTime: 200 }, 400);
      }

      async function setupStalledFile() {
        await setupFile({ uploadTime: 2500, stepTime: 2500 }, 2200);
      }

      async function setupUnexpectedServerErrorFile() {
        await setupFile({ serverValidation: () => ({ status: 500 }) }, 50);
      }

      async function setupForbiddenFile() {
        await setupFile({ serverValidation: () => ({ status: 403 }) }, 50);
      }

      async function setupFileTooLargeFile() {
        await setupFile({ serverValidation: () => ({ status: 413 }) }, 50);
      }

      async function setupServerUnavailableFile() {
        await setupFile({ serverValidation: () => ({ status: 0 }) }, 50);
      }

      function getFileElement() {
        return upload._fileList.querySelector('vaadin-upload-file');
      }

      function getFileStatus() {
        return getFileElement().shadowRoot.querySelector('[part="status"]').textContent;
      }

      function getFileError() {
        return getFileElement().shadowRoot.querySelector('[part="error"]').textContent;
      }

      it('should translate upload button and drop area', async () => {
        expect(upload.querySelector('[slot="add-button"]').textContent).to.equal(expectedI18n.addFiles.many);
        expect(upload.querySelector('[slot="drop-label"]').textContent).to.equal(expectedI18n.dropFiles.many);

        upload.maxFiles = 1;
        await clock.tickAsync(1);

        expect(upload.querySelector('[slot="add-button"]').textContent).to.equal(expectedI18n.addFiles.one);
        expect(upload.querySelector('[slot="drop-label"]').textContent).to.equal(expectedI18n.dropFiles.one);
      });

      it('should translate file button aria-labels', async () => {
        await setupQueuedFile();
        const startButton = getFileElement().shadowRoot.querySelector('[part="start-button"]');
        expect(startButton.getAttribute('aria-label')).to.equal(expectedI18n.file.start);

        const removeButton = getFileElement().shadowRoot.querySelector('[part="remove-button"]');
        expect(removeButton.getAttribute('aria-label')).to.equal(expectedI18n.file.remove);

        await setupForbiddenFile();
        const retryButton = getFileElement().shadowRoot.querySelector('[part="retry-button"]');
        expect(retryButton.getAttribute('aria-label')).to.equal(expectedI18n.file.retry);
      });

      it('should translate file status text', async () => {
        await setupQueuedFile();
        expect(getFileStatus()).to.equal(expectedI18n.uploading.status.held);

        await setupConnectingFile();
        expect(getFileStatus()).to.equal(expectedI18n.uploading.status.connecting);

        await setupUploadingFile();
        expect(getFileStatus()).to.contain(expectedI18n.uploading.remainingTime.prefix);

        await setupProcessingFile();
        expect(getFileStatus()).to.equal(expectedI18n.uploading.status.processing);

        await setupStalledFile();
        expect(getFileStatus()).to.equal(expectedI18n.uploading.status.stalled);

        await setupUnexpectedServerErrorFile();
        expect(getFileError()).to.equal(expectedI18n.uploading.error.unexpectedServerError);

        await setupForbiddenFile();
        expect(getFileError()).to.equal(expectedI18n.uploading.error.forbidden);

        await setupFileTooLargeFile();
        expect(getFileError()).to.equal(expectedI18n.uploading.error.fileTooLarge);

        await setupServerUnavailableFile();
        expect(getFileError()).to.equal(expectedI18n.uploading.error.serverUnavailable);
      });
    });
  });
});
