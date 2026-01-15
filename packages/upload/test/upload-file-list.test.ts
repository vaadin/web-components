import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload-file-list.js';
import type { UploadFileList } from '../src/vaadin-upload-file-list.js';
import type { UploadFile } from '../src/vaadin-upload-manager.js';
import { UploadManager } from '../src/vaadin-upload-manager.js';
import { createFile, createFiles } from './helpers.js';

describe('vaadin-upload-file-list', () => {
  // Use 'any' for internal APIs not exposed in public types
  let fileList: UploadFileList & { items: UploadFile[]; requestContentUpdate(): void };

  function getUploadFile() {
    return fileList.querySelector('vaadin-upload-file')!;
  }

  function getStatusText() {
    return getUploadFile().shadowRoot!.querySelector('[part="status"]')!.textContent;
  }

  function getErrorText() {
    return getUploadFile().shadowRoot!.querySelector('[part="error"]')!.textContent;
  }

  function getRetryButtonLabel() {
    return getUploadFile().shadowRoot!.querySelector('[part="retry-button"]')!.getAttribute('aria-label');
  }

  function getStartButtonLabel() {
    return getUploadFile().shadowRoot!.querySelector('[part="start-button"]')!.getAttribute('aria-label');
  }

  function getRemoveButtonLabel() {
    return getUploadFile().shadowRoot!.querySelector('[part="remove-button"]')!.getAttribute('aria-label');
  }

  beforeEach(async () => {
    fileList = fixtureSync(`<vaadin-upload-file-list></vaadin-upload-file-list>`);
    await nextRender();
  });

  describe('basic', () => {
    it('should have items property defaulting to empty array when no target', () => {
      // When target is null (default), items is set to empty array
      expect(fileList.items).to.be.an('array').that.is.empty;
    });

    it('should have i18n property with defaults', () => {
      expect(fileList.i18n).to.exist;
      expect(fileList.i18n.file?.retry).to.equal('Retry');
      expect(fileList.i18n.file?.start).to.equal('Start');
      expect(fileList.i18n.file?.remove).to.equal('Remove');
    });

    it('should have disabled property defaulting to false', () => {
      expect(fileList.disabled).to.be.false;
    });

    it('should reflect disabled to attribute', async () => {
      fileList.disabled = true;
      await nextFrame();
      expect(fileList.hasAttribute('disabled')).to.be.true;
    });

    it('should have manager property defaulting to null', () => {
      expect(fileList.manager).to.be.null;
    });
  });

  describe('rendering items', () => {
    it('should render upload-file elements for each item', async () => {
      const file1 = createFile(100, 'text/plain');
      const file2 = createFile(200, 'image/png');
      fileList.items = [file1 as UploadFile, file2 as UploadFile];
      await nextFrame();

      const uploadFiles = fileList.querySelectorAll('vaadin-upload-file');
      expect(uploadFiles.length).to.equal(2);
    });

    it('should update when items change', async () => {
      fileList.items = [createFile(100, 'text/plain') as UploadFile];
      await nextFrame();
      expect(fileList.querySelectorAll('vaadin-upload-file').length).to.equal(1);

      fileList.items = [
        createFile(100, 'text/plain') as UploadFile,
        createFile(200, 'image/png') as UploadFile,
        createFile(300, 'application/pdf') as UploadFile,
      ];
      await nextFrame();
      expect(fileList.querySelectorAll('vaadin-upload-file').length).to.equal(3);
    });

    it('should clear when items is empty', async () => {
      fileList.items = [createFile(100, 'text/plain') as UploadFile];
      await nextFrame();
      expect(fileList.querySelectorAll('vaadin-upload-file').length).to.equal(1);

      fileList.items = [];
      await nextFrame();
      expect(fileList.querySelectorAll('vaadin-upload-file').length).to.equal(0);
    });
  });

  describe('i18n rendering', () => {
    it('should render "Queued" status when file is held', async () => {
      const file = createFile(100, 'text/plain') as UploadFile;
      file.held = true;
      fileList.items = [file];
      await nextFrame();

      expect(getStatusText()).to.equal('Queued');
    });

    it('should render "Stalled" status when file is stalled', async () => {
      const file = createFile(100, 'text/plain') as UploadFile;
      file.stalled = true;
      fileList.items = [file];
      await nextFrame();

      expect(getStatusText()).to.equal('Stalled');
    });

    it('should render "Connecting..." status when indeterminate and uploading', async () => {
      const file = createFile(100, 'text/plain') as UploadFile;
      file.uploading = true;
      file.indeterminate = true;
      file.progress = 0;
      fileList.items = [file];
      await nextFrame();

      expect(getStatusText()).to.equal('Connecting...');
    });

    it('should render "Processing File..." status when progress is 100 and indeterminate', async () => {
      const file = createFile(100, 'text/plain') as UploadFile;
      file.uploading = true;
      file.indeterminate = true;
      file.progress = 100;
      fileList.items = [file];
      await nextFrame();

      expect(getStatusText()).to.equal('Processing File...');
    });

    it('should render translated error message for error codes', async () => {
      const file = createFile(100, 'text/plain') as UploadFile;
      file.errorKey = 'serverUnavailable';
      fileList.items = [file];
      await nextFrame();

      expect(getErrorText()).to.equal('Upload failed, please try again later');
    });

    it('should render progress status with formatted file size', async () => {
      const file = createFile(2000000, 'text/plain') as UploadFile;
      file.total = 2000000;
      file.loaded = 500000;
      file.progress = 25;
      file.uploading = true;
      file.remaining = 30;
      fileList.items = [file];
      await nextFrame();

      // Status should include formatted size (2 MB) and progress
      expect(getStatusText()).to.equal('2 MB: 25% (remaining time: 00:00:30)');
    });

    it('should render "unknown remaining time" when loaded is 0', async () => {
      const file = createFile(2000000, 'text/plain') as UploadFile;
      file.total = 2000000;
      file.loaded = 0;
      file.progress = 0;
      file.uploading = true;
      fileList.items = [file];
      await nextFrame();

      expect(getStatusText()).to.include('unknown remaining time');
    });

    it('should render i18n button labels', async () => {
      const file = createFile(100, 'text/plain') as UploadFile;
      fileList.items = [file];
      await nextFrame();

      expect(getRetryButtonLabel()).to.equal('Retry');
      expect(getStartButtonLabel()).to.equal('Start');
      expect(getRemoveButtonLabel()).to.equal('Remove');
    });

    it('should render custom i18n button labels', async () => {
      fileList.i18n = {
        ...fileList.i18n,
        file: {
          retry: 'Try again',
          start: 'Begin',
          remove: 'Delete',
        },
      };
      const file = createFile(100, 'text/plain') as UploadFile;
      fileList.items = [file];
      await nextFrame();

      expect(getRetryButtonLabel()).to.equal('Try again');
      expect(getStartButtonLabel()).to.equal('Begin');
      expect(getRemoveButtonLabel()).to.equal('Delete');
    });

    it('should render custom i18n status messages', async () => {
      fileList.i18n = {
        ...fileList.i18n,
        uploading: {
          ...fileList.i18n.uploading,
          status: {
            connecting: 'Verbinding maken...',
            stalled: 'Vastgelopen',
            processing: 'Bestand verwerken...',
            held: 'In wachtrij',
          },
        },
      };
      const file = createFile(100, 'text/plain') as UploadFile;
      file.held = true;
      fileList.items = [file];
      await nextFrame();

      expect(getStatusText()).to.equal('In wachtrij');
    });

    it('should render custom i18n error messages', async () => {
      fileList.i18n = {
        ...fileList.i18n,
        uploading: {
          ...fileList.i18n.uploading,
          error: {
            serverUnavailable: 'Server niet beschikbaar',
            unexpectedServerError: 'Onverwachte serverfout',
            forbidden: 'Uploaden verboden',
          },
        },
      };
      const file = createFile(100, 'text/plain') as UploadFile;
      file.errorKey = 'serverUnavailable';
      fileList.items = [file];
      await nextFrame();

      expect(getErrorText()).to.equal('Server niet beschikbaar');
    });

    it('should render file size with custom formatSize function', async () => {
      fileList.i18n = {
        ...fileList.i18n,
        formatSize: (bytes: number) => `${bytes} octets`,
      };
      const file = createFile(1536, 'text/plain') as UploadFile;
      file.total = 1536;
      file.loaded = 500;
      file.progress = 33;
      file.uploading = true;
      file.remaining = 10;
      fileList.items = [file];
      await nextFrame();

      // Status should use the custom formatSize
      expect(getStatusText()).to.include('1536 octets');
    });
  });

  describe('manager integration', () => {
    let manager: UploadManager;

    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
    });

    it('should sync files from manager when manager is set', async () => {
      const files = createFiles(2, 100, 'text/plain');
      manager.addFiles(files);

      fileList.manager = manager;
      await nextFrame();

      expect(fileList.items).to.have.lengthOf(2);
    });

    it('should update when manager files change', async () => {
      fileList.manager = manager;
      await nextFrame();
      expect(fileList.items).to.have.lengthOf(0);

      manager.addFiles(createFiles(2, 100, 'text/plain'));
      await nextFrame();
      expect(fileList.items).to.have.lengthOf(2);
    });

    it('should clear error when errorKey is reset on retry', async () => {
      const file = createFile(100, 'text/plain');
      manager.addFiles([file]);
      fileList.manager = manager;
      await nextFrame();

      // Simulate error state
      const uploadFile = manager.files[0];
      uploadFile.errorKey = 'forbidden';
      fileList.items = [...fileList.items];
      await nextFrame();

      expect(getErrorText()).to.equal('Upload forbidden');

      // Simulate retry: errorKey is cleared
      (uploadFile as any).errorKey = false;
      fileList.items = [...fileList.items];
      await nextFrame();

      expect(getErrorText()).to.equal('');
    });

    it('should clear items when manager is removed', async () => {
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      fileList.manager = manager;
      await nextFrame();
      expect(fileList.items).to.have.lengthOf(2);

      fileList.manager = null;
      await nextFrame();
      expect(fileList.items).to.have.lengthOf(0);
    });

    it('should forward file-retry event to manager', async () => {
      const file = createFile(100, 'text/plain');
      manager.addFiles([file]);
      fileList.manager = manager;
      await nextFrame();

      const retrySpy = sinon.spy(manager, 'retryUpload');
      const event = new CustomEvent('file-retry', {
        detail: { file: manager.files[0] },
        bubbles: true,
      });
      fileList.dispatchEvent(event);

      expect(retrySpy.calledOnce).to.be.true;
      expect(retrySpy.firstCall.args[0]).to.equal(manager.files[0]);
    });

    it('should forward file-abort event to manager', async () => {
      const file = createFile(100, 'text/plain');
      manager.addFiles([file]);
      fileList.manager = manager;
      await nextFrame();

      // Capture file reference before aborting (abort removes it from the list)
      const targetFile = manager.files[0];
      const abortSpy = sinon.spy(manager, 'abortUpload');
      const event = new CustomEvent('file-abort', {
        detail: { file: targetFile },
        bubbles: true,
      });
      fileList.dispatchEvent(event);

      expect(abortSpy.calledOnce).to.be.true;
      expect(abortSpy.firstCall.args[0]).to.equal(targetFile);
    });

    it('should forward file-start event to manager', async () => {
      const file = createFile(100, 'text/plain');
      manager.addFiles([file]);
      fileList.manager = manager;
      await nextFrame();

      const uploadSpy = sinon.spy(manager, 'uploadFiles');
      const event = new CustomEvent('file-start', {
        detail: { file: manager.files[0] },
        bubbles: true,
      });
      fileList.dispatchEvent(event);

      expect(uploadSpy.calledOnce).to.be.true;
      expect(uploadSpy.firstCall.args[0]).to.equal(manager.files[0]);
    });

    it('should forward file-remove event to manager', async () => {
      const file = createFile(100, 'text/plain');
      manager.addFiles([file]);
      fileList.manager = manager;
      await nextFrame();

      const removeSpy = sinon.spy(manager, 'removeFile');
      const targetFile = manager.files[0];
      const event = new CustomEvent('file-remove', {
        detail: { file: targetFile },
        bubbles: true,
      });
      fileList.dispatchEvent(event);

      expect(removeSpy.calledOnce).to.be.true;
      expect(removeSpy.firstCall.args[0]).to.equal(targetFile);
    });

    it('should stop propagation when forwarding events', async () => {
      const file = createFile(100, 'text/plain');
      manager.addFiles([file]);
      fileList.manager = manager;
      await nextFrame();

      const parentSpy = sinon.spy();
      const parent = document.createElement('div');
      parent.appendChild(fileList);
      parent.addEventListener('file-retry', parentSpy);

      const event = new CustomEvent('file-retry', {
        detail: { file: manager.files[0] },
        bubbles: true,
      });
      fileList.dispatchEvent(event);

      expect(parentSpy.called).to.be.false;

      fileList.remove();
    });

    it('should not stop propagation when no manager is set', async () => {
      const file = createFile(100, 'text/plain') as UploadFile;
      fileList.items = [file];
      await nextFrame();

      const parentSpy = sinon.spy();
      const parent = document.createElement('div');
      parent.appendChild(fileList);
      parent.addEventListener('file-retry', parentSpy);

      const event = new CustomEvent('file-retry', {
        detail: { file },
        bubbles: true,
      });
      fileList.dispatchEvent(event);

      expect(parentSpy.calledOnce).to.be.true;

      fileList.remove();
    });

    it('should remove listener from old manager when manager changes', async () => {
      manager.addFiles(createFiles(1, 100, 'text/plain'));
      fileList.manager = manager;
      await nextFrame();
      expect(fileList.items).to.have.lengthOf(1);

      const manager2 = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
      manager2.addFiles(createFiles(3, 100, 'text/plain'));

      fileList.manager = manager2;
      await nextFrame();
      expect(fileList.items).to.have.lengthOf(3);

      // Changes to old manager should not affect file list
      manager.addFiles(createFiles(5, 100, 'text/plain'));
      await nextFrame();
      expect(fileList.items).to.have.lengthOf(3);
    });

    it('should remove listener when disconnected from DOM', async () => {
      // Spy on manager to verify event fires
      const spy = sinon.spy();
      manager.addEventListener('files-changed', spy);

      fileList.manager = manager;
      await nextFrame();

      // Verify file list is in DOM
      expect(fileList.isConnected).to.be.true;

      // Remove file list from DOM
      fileList.remove();

      // Verify file list is disconnected
      expect(fileList.isConnected).to.be.false;

      // Reset spy call count after setup
      spy.resetHistory();

      // Add files to manager
      manager.addFiles(createFiles(2, 100, 'text/plain'));

      // Verify event was dispatched
      expect(spy.called).to.be.true;

      // File list should not have updated since listener was removed on disconnect
      expect(fileList.items).to.have.lengthOf(0);
    });

    it('should re-attach listener when reconnected to DOM', async () => {
      fileList.manager = manager;
      await nextFrame();

      // Remove and re-add file list
      const parent = fileList.parentElement!;
      fileList.remove();
      parent.appendChild(fileList);
      await nextFrame();

      // Add files - should update file list since it's reconnected
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      await nextFrame();
      expect(fileList.items).to.have.lengthOf(2);
    });

    it('should sync files when reconnected after files were added while disconnected', async () => {
      fileList.manager = manager;
      await nextFrame();
      expect(fileList.items).to.have.lengthOf(0);

      // Remove file list from DOM
      const parent = fileList.parentElement!;
      fileList.remove();

      // Add files WHILE file list is disconnected
      manager.addFiles(createFiles(3, 100, 'text/plain'));
      expect(manager.files).to.have.lengthOf(3);

      // File list should not have updated
      expect(fileList.items).to.have.lengthOf(0);

      // Reconnect file list
      parent.appendChild(fileList);
      await nextFrame();

      // File list should now be synced with manager files
      expect(fileList.items).to.have.lengthOf(3);
    });
  });

  describe('requestContentUpdate', () => {
    it('should be a function', () => {
      expect(typeof fileList.requestContentUpdate).to.equal('function');
    });

    it('should update rendered content', async () => {
      fileList.items = [createFile(100, 'text/plain') as UploadFile];
      await nextFrame();

      const uploadFile = fileList.querySelector('vaadin-upload-file');
      expect(uploadFile).to.exist;
    });
  });
});
