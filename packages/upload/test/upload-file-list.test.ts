import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload-file-list.js';
import type { UploadFileList } from '../src/vaadin-upload-file-list.js';
import { UploadManager } from '../src/vaadin-upload-manager.js';
import { createFile, createFiles } from './helpers.js';

describe('vaadin-upload-file-list', () => {
  let fileList: UploadFileList;
  let manager: UploadManager;

  function getUploadFile() {
    return fileList.querySelector('vaadin-upload-file')!;
  }

  function getUploadFiles() {
    return fileList.querySelectorAll('vaadin-upload-file');
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
    manager = new UploadManager({
      target: '/api/upload',
      noAuto: true,
    });
    await nextRender();
  });

  describe('basic', () => {
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

    it('should propagate disabled state to upload-file elements', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      const uploadFile = getUploadFile();
      expect(uploadFile.disabled).to.be.false;

      fileList.disabled = true;
      await nextFrame();
      expect(uploadFile.disabled).to.be.true;
    });

    it('should have manager property defaulting to null', () => {
      expect(fileList.manager).to.be.null;
    });

    it('should render empty when no manager is set', () => {
      expect(getUploadFiles().length).to.equal(0);
    });
  });

  describe('rendering', () => {
    it('should render upload-file elements for each file in manager', async () => {
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      fileList.manager = manager;
      await nextFrame();

      expect(getUploadFiles().length).to.equal(2);
    });

    it('should update when manager files change', async () => {
      fileList.manager = manager;
      await nextFrame();
      expect(getUploadFiles().length).to.equal(0);

      manager.addFiles(createFiles(2, 100, 'text/plain'));
      await nextFrame();
      expect(getUploadFiles().length).to.equal(2);

      manager.addFiles(createFiles(1, 100, 'text/plain'));
      await nextFrame();
      expect(getUploadFiles().length).to.equal(3);
    });

    it('should clear when manager is removed', async () => {
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      fileList.manager = manager;
      await nextFrame();
      expect(getUploadFiles().length).to.equal(2);

      fileList.manager = null;
      await nextFrame();
      expect(getUploadFiles().length).to.equal(0);
    });
  });

  describe('i18n', () => {
    it('should render "Queued" status when file is held', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      manager.files[0].held = true;
      manager.dispatchEvent(new CustomEvent('files-changed'));
      await nextFrame();

      expect(getStatusText()).to.equal('Queued');
    });

    it('should render "Stalled" status when file is stalled', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      manager.files[0].held = false;
      manager.files[0].stalled = true;
      manager.dispatchEvent(new CustomEvent('files-changed'));
      await nextFrame();

      expect(getStatusText()).to.equal('Stalled');
    });

    it('should render "Connecting..." status when indeterminate and uploading', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      const file = manager.files[0];
      file.held = false;
      file.uploading = true;
      file.indeterminate = true;
      file.progress = 0;
      manager.dispatchEvent(new CustomEvent('files-changed'));
      await nextFrame();

      expect(getStatusText()).to.equal('Connecting...');
    });

    it('should render "Processing File..." status when progress is 100 and indeterminate', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      const file = manager.files[0];
      file.held = false;
      file.uploading = true;
      file.indeterminate = true;
      file.progress = 100;
      manager.dispatchEvent(new CustomEvent('files-changed'));
      await nextFrame();

      expect(getStatusText()).to.equal('Processing File...');
    });

    it('should render translated error message for error codes', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      manager.files[0].errorKey = 'serverUnavailable';
      manager.dispatchEvent(new CustomEvent('files-changed'));
      await nextFrame();

      expect(getErrorText()).to.equal('Upload failed, please try again later');
    });

    it('should render progress status with formatted file size', async () => {
      manager.addFiles([createFile(2000000, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      const file = manager.files[0];
      file.held = false;
      file.total = 2000000;
      file.loaded = 500000;
      file.progress = 25;
      file.uploading = true;
      file.remaining = 30;
      manager.dispatchEvent(new CustomEvent('files-changed'));
      await nextFrame();

      // Status should include formatted size (2 MB) and progress
      expect(getStatusText()).to.equal('2 MB: 25% (remaining time: 00:00:30)');
    });

    it('should render "unknown remaining time" when loaded is 0', async () => {
      manager.addFiles([createFile(2000000, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      const file = manager.files[0];
      file.held = false;
      file.total = 2000000;
      file.loaded = 0;
      file.progress = 0;
      file.uploading = true;
      manager.dispatchEvent(new CustomEvent('files-changed'));
      await nextFrame();

      expect(getStatusText()).to.include('unknown remaining time');
    });

    it('should render i18n button labels', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      expect(getRetryButtonLabel()).to.equal('Retry');
      expect(getStartButtonLabel()).to.equal('Start');
      expect(getRemoveButtonLabel()).to.equal('Remove');
    });

    it('should render custom i18n button labels', async () => {
      fileList.i18n = {
        ...fileList.i18n,
        file: {
          retry: 'Yritä uudelleen',
          start: 'Aloita',
          remove: 'Poista',
        },
      };
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      expect(getRetryButtonLabel()).to.equal('Yritä uudelleen');
      expect(getStartButtonLabel()).to.equal('Aloita');
      expect(getRemoveButtonLabel()).to.equal('Poista');
    });

    it('should support partial i18n updates', async () => {
      // Set only the retry label - other labels should remain default
      fileList.i18n = {
        file: {
          retry: 'Yritä uudelleen',
        },
      };
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      expect(getRetryButtonLabel()).to.equal('Yritä uudelleen');
      expect(getStartButtonLabel()).to.equal('Start'); // Default
      expect(getRemoveButtonLabel()).to.equal('Remove'); // Default
    });

    it('should render custom i18n status messages', async () => {
      fileList.i18n = {
        uploading: {
          status: {
            held: 'Jonossa',
          },
        },
      };
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      manager.files[0].held = true;
      manager.dispatchEvent(new CustomEvent('files-changed'));
      await nextFrame();

      expect(getStatusText()).to.equal('Jonossa');
    });

    it('should render custom i18n error messages', async () => {
      fileList.i18n = {
        uploading: {
          error: {
            serverUnavailable: 'Palvelin ei ole käytettävissä',
          },
        },
      };
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      manager.files[0].errorKey = 'serverUnavailable';
      manager.dispatchEvent(new CustomEvent('files-changed'));
      await nextFrame();

      expect(getErrorText()).to.equal('Palvelin ei ole käytettävissä');
    });

    it('should render file size with custom formatSize function', async () => {
      fileList.i18n = {
        formatSize: (bytes: number) => `${bytes} tavua`,
      };
      manager.addFiles([createFile(1536, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      const file = manager.files[0];
      file.held = false;
      file.total = 1536;
      file.loaded = 500;
      file.progress = 33;
      file.uploading = true;
      file.remaining = 10;
      manager.dispatchEvent(new CustomEvent('files-changed'));
      await nextFrame();

      // Status should use the custom formatSize
      expect(getStatusText()).to.include('1536 tavua');
    });

    it('should format elapsedStr when elapsed time is available', async () => {
      manager.addFiles([createFile(1536, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      const file = manager.files[0];
      file.total = 1536;
      file.elapsed = 65; // 1 minute 5 seconds
      manager.dispatchEvent(new CustomEvent('files-changed'));
      await nextFrame();

      // elapsedStr should be formatted as HH:MM:SS
      expect((file as any).elapsedStr).to.equal('00:01:05');
    });

    it('should clear error when errorKey is reset on retry', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      // Simulate error state
      manager.files[0].errorKey = 'forbidden';
      manager.dispatchEvent(new CustomEvent('files-changed'));
      await nextFrame();

      expect(getErrorText()).to.equal('Upload forbidden');

      // Simulate retry: errorKey is cleared
      (manager.files[0] as any).errorKey = false;
      manager.dispatchEvent(new CustomEvent('files-changed'));
      await nextFrame();

      expect(getErrorText()).to.equal('');
    });
  });

  describe('event forwarding', () => {
    it('should forward file-retry event to manager', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
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
      manager.addFiles([createFile(100, 'text/plain')]);
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
      manager.addFiles([createFile(100, 'text/plain')]);
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
      manager.addFiles([createFile(100, 'text/plain')]);
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
      const parent = document.createElement('div');
      parent.appendChild(fileList);

      // Test all event types that should stop propagation
      // Each iteration uses a fresh manager since some events (like remove) modify the file list
      const eventTypes = ['file-retry', 'file-abort', 'file-start', 'file-remove'];
      for (const eventType of eventTypes) {
        // Use fresh manager for each test to avoid side effects
        const testManager = new UploadManager({
          target: '/api/upload',
          noAuto: true,
        });
        testManager.addFiles([createFile(100, 'text/plain')]);
        fileList.manager = testManager;
        await nextFrame();

        const parentSpy = sinon.spy();
        parent.addEventListener(eventType, parentSpy);

        const event = new CustomEvent(eventType, {
          detail: { file: testManager.files[0] },
          bubbles: true,
        });
        fileList.dispatchEvent(event);

        expect(parentSpy.called, `${eventType} should not bubble when manager is set`).to.be.false;

        parent.removeEventListener(eventType, parentSpy);

        // Clean up for next iteration
        fileList.manager = null;
        await nextFrame();
      }

      fileList.remove();
    });
  });

  describe('manager lifecycle', () => {
    it('should sync files from manager when manager is set', async () => {
      manager.addFiles(createFiles(2, 100, 'text/plain'));

      fileList.manager = manager;
      await nextFrame();

      expect(getUploadFiles().length).to.equal(2);
    });

    it('should remove listener from old manager when manager changes', async () => {
      fileList.manager = manager;
      await nextFrame();

      const manager2 = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });

      fileList.manager = manager2;
      await nextFrame();

      // Add files to old manager - should not affect file list
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      await nextFrame();
      expect(getUploadFiles().length).to.equal(0);

      // Add files to new manager - should trigger sync
      manager2.addFiles(createFiles(3, 100, 'text/plain'));
      await nextFrame();
      expect(getUploadFiles().length).to.equal(3);
    });

    it('should remove listener when disconnected from DOM', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();
      expect(getUploadFiles().length).to.equal(1);

      // Remove file list from DOM
      fileList.remove();

      // Add files to manager - file list should not update since listener was removed
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      expect(getUploadFiles().length).to.equal(1); // Still shows old count
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
      expect(getUploadFiles().length).to.equal(2);
    });

    it('should sync files when reconnected after files were added while disconnected', async () => {
      fileList.manager = manager;
      await nextFrame();
      expect(getUploadFiles().length).to.equal(0);

      // Remove file list from DOM
      const parent = fileList.parentElement!;
      fileList.remove();

      // Add files WHILE file list is disconnected
      manager.addFiles(createFiles(3, 100, 'text/plain'));

      // Reconnect file list
      parent.appendChild(fileList);
      await nextFrame();

      // File list should now be synced with manager files
      expect(getUploadFiles().length).to.equal(3);
    });
  });
});
