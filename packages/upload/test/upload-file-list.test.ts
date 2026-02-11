import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.modularUpload = true;

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

  function getRetryButton() {
    return getUploadFile().shadowRoot!.querySelector('[part="retry-button"]') as HTMLButtonElement;
  }

  function getStartButton() {
    return getUploadFile().shadowRoot!.querySelector('[part="start-button"]') as HTMLButtonElement;
  }

  function getRemoveButton() {
    return getUploadFile().shadowRoot!.querySelector('[part="remove-button"]') as HTMLButtonElement;
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
      manager.files = [...manager.files];
      await nextFrame();

      expect(getStatusText()).to.equal('Queued');
    });

    it('should render "Stalled" status when file is stalled', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      manager.files[0].held = false;
      manager.files[0].stalled = true;
      manager.files = [...manager.files];
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
      manager.files = [...manager.files];
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
      manager.files = [...manager.files];
      await nextFrame();

      expect(getStatusText()).to.equal('Processing File...');
    });

    it('should render translated error message for error codes', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      manager.files[0].errorKey = 'serverUnavailable';
      manager.files = [...manager.files];
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
      manager.files = [...manager.files];
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
      manager.files = [...manager.files];
      await nextFrame();

      expect(getStatusText()).to.include('unknown remaining time');
    });

    it('should render i18n button labels', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      expect(getRetryButton().getAttribute('aria-label')).to.equal('Retry');
      expect(getStartButton().getAttribute('aria-label')).to.equal('Start');
      expect(getRemoveButton().getAttribute('aria-label')).to.equal('Remove');
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

      expect(getRetryButton().getAttribute('aria-label')).to.equal('Yritä uudelleen');
      expect(getStartButton().getAttribute('aria-label')).to.equal('Aloita');
      expect(getRemoveButton().getAttribute('aria-label')).to.equal('Poista');
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

      expect(getRetryButton().getAttribute('aria-label')).to.equal('Yritä uudelleen');
      expect(getStartButton().getAttribute('aria-label')).to.equal('Start'); // Default
      expect(getRemoveButton().getAttribute('aria-label')).to.equal('Remove'); // Default
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
      manager.files = [...manager.files];
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
      manager.files = [...manager.files];
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
      manager.files = [...manager.files];
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
      manager.files = [...manager.files];
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
      manager.files = [...manager.files];
      await nextFrame();

      expect(getErrorText()).to.equal('Upload forbidden');

      // Simulate retry: errorKey is cleared
      (manager.files[0] as any).errorKey = false;
      manager.files = [...manager.files];
      await nextFrame();

      expect(getErrorText()).to.equal('');
    });
  });

  describe('button actions', () => {
    it('should clear error and restart upload when retry button is clicked', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      // Set error state to make retry button visible
      manager.files[0].errorKey = 'serverUnavailable';
      manager.files = [...manager.files];
      await nextFrame();

      expect(manager.files[0].errorKey).to.equal('serverUnavailable');

      getRetryButton().click();

      // After retry, errorKey should be cleared (set to false) and file should be uploading
      expect(manager.files[0].errorKey).to.be.false;
      expect(manager.files[0].uploading).to.be.true;
    });

    it('should start upload when start button is clicked', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      // File should be held (queued) by default with noAuto, making start button visible
      expect(manager.files[0].held).to.be.true;
      expect(manager.files[0].uploading).to.not.be.ok;

      getStartButton().click();

      // After clicking start, file should no longer be held and should be uploading
      expect(manager.files[0].held).to.be.false;
      expect(manager.files[0].uploading).to.be.true;
    });

    it('should remove file from manager when remove button is clicked', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      expect(manager.files).to.have.lengthOf(1);

      getRemoveButton().click();

      // File should be removed from manager
      expect(manager.files).to.have.lengthOf(0);
    });

    it('should not bubble file events to parent when manager handles them', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      // Create parent wrapper and move fileList into it
      const parent = document.createElement('div');
      fileList.parentElement!.appendChild(parent);
      parent.appendChild(fileList);
      await nextFrame();

      const parentSpy = sinon.spy();
      parent.addEventListener('file-abort', parentSpy);

      // Click remove button - event should be handled by manager and not bubble
      getRemoveButton().click();

      expect(parentSpy.called).to.be.false;

      parent.removeEventListener('file-abort', parentSpy);
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

  describe('disabled state when manager is disabled', () => {
    it('should propagate manager disabled state to upload-file elements', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      const uploadFile = getUploadFile();
      expect(uploadFile.disabled).to.be.false;

      manager.disabled = true;
      await nextFrame();
      expect(uploadFile.disabled).to.be.true;
    });

    it('should re-enable upload-file elements when manager is re-enabled', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      manager.disabled = true;
      await nextFrame();

      const uploadFile = getUploadFile();
      expect(uploadFile.disabled).to.be.true;

      manager.disabled = false;
      await nextFrame();
      expect(uploadFile.disabled).to.be.false;
    });

    it('should sync initial disabled state from manager', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.disabled = true;

      fileList.manager = manager;
      await nextFrame();

      const uploadFile = getUploadFile();
      expect(uploadFile.disabled).to.be.true;
    });

    it('should keep files disabled when manager is re-enabled but explicitly disabled', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      fileList.disabled = true;
      manager.disabled = true;
      await nextFrame();

      const uploadFile = getUploadFile();
      expect(uploadFile.disabled).to.be.true;

      // Re-enable manager - files should still be disabled due to explicit disabled
      manager.disabled = false;
      await nextFrame();
      expect(uploadFile.disabled).to.be.true;

      // Re-enable file list - files should now be enabled
      fileList.disabled = false;
      await nextFrame();
      expect(uploadFile.disabled).to.be.false;
    });

    it('should reset managerDisabled when manager is set to null', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      manager.disabled = true;
      await nextFrame();

      const uploadFile = getUploadFile();
      expect(uploadFile.disabled).to.be.true;

      fileList.manager = null;
      await nextFrame();
      // File list clears items when manager is null, so check managerDisabled was reset
      // by setting a new manager with files
      const manager2 = new UploadManager({ target: '/api/upload', noAuto: true });
      manager2.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager2;
      await nextFrame();

      expect(getUploadFile().disabled).to.be.false;
    });

    it('should remove listener when disconnected from DOM', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      const uploadFile = getUploadFile();
      expect(uploadFile.disabled).to.be.false;

      // Remove file list from DOM
      fileList.remove();

      // Disable manager - should not affect file list since listener was removed
      manager.disabled = true;
      expect(uploadFile.disabled).to.be.false;
    });

    it('should re-attach listener when reconnected to DOM', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      // Remove and re-add file list
      const parent = fileList.parentElement!;
      fileList.remove();
      parent.appendChild(fileList);
      await nextFrame();

      // Disable manager - should sync since listener is re-attached
      manager.disabled = true;
      await nextFrame();
      expect(getUploadFile().disabled).to.be.true;
    });

    it('should sync disabled state when reconnected after manager disabled', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      // Remove file list from DOM
      const parent = fileList.parentElement!;
      fileList.remove();

      // Disable manager WHILE file list is disconnected
      manager.disabled = true;

      // Reconnect file list
      parent.appendChild(fileList);
      await nextFrame();

      // File should now be disabled (synced with manager state on reconnect)
      expect(getUploadFile().disabled).to.be.true;
    });
  });

  describe('theme propagation', () => {
    it('should propagate theme to upload-file elements', async () => {
      fileList.setAttribute('theme', 'thumbnails');
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      const uploadFile = getUploadFile();
      expect(uploadFile.getAttribute('theme')).to.equal('thumbnails');
    });

    it('should propagate theme to multiple upload-file elements', async () => {
      fileList.setAttribute('theme', 'thumbnails');
      manager.addFiles(createFiles(3, 100, 'text/plain'));
      fileList.manager = manager;
      await nextFrame();

      const uploadFiles = getUploadFiles();
      uploadFiles.forEach((file) => {
        expect(file.getAttribute('theme')).to.equal('thumbnails');
      });
    });

    it('should update upload-file elements when theme changes', async () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      const uploadFile = getUploadFile();
      expect(uploadFile.getAttribute('theme')).to.be.null;

      fileList.setAttribute('theme', 'thumbnails');
      await nextFrame();

      expect(uploadFile.getAttribute('theme')).to.equal('thumbnails');
    });

    it('should remove theme from upload-file elements when theme is removed', async () => {
      fileList.setAttribute('theme', 'thumbnails');
      manager.addFiles([createFile(100, 'text/plain')]);
      fileList.manager = manager;
      await nextFrame();

      const uploadFile = getUploadFile();
      expect(uploadFile.getAttribute('theme')).to.equal('thumbnails');

      fileList.removeAttribute('theme');
      await nextFrame();

      expect(uploadFile.getAttribute('theme')).to.be.null;
    });
  });
});
