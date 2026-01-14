import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload-file-list.js';
import type { UploadFileList } from '../src/vaadin-upload-file-list.js';
import { UploadManager } from '../src/vaadin-upload-manager.js';
import type { UploadFile } from '../src/vaadin-upload-mixin.js';
import { createFile, createFiles } from './helpers.js';

describe('vaadin-upload-file-list', () => {
  let fileList: UploadFileList;

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

  describe('i18n formatting', () => {
    it('should format file size', async () => {
      const file = createFile(2000, 'text/plain') as UploadFile;
      file.total = 2000;
      fileList.items = [file];
      await nextFrame();

      // 2000 bytes = 2 kB (base 1000, no decimal places for kB)
      expect(file.totalStr).to.equal('2 kB');
    });

    it('should format loaded size', async () => {
      const file = createFile(2000, 'text/plain') as UploadFile;
      file.total = 2000;
      file.loaded = 1000;
      fileList.items = [file];
      await nextFrame();

      expect(file.loadedStr).to.equal('1 kB');
    });

    it('should set status to "Queued" when held', async () => {
      const file = createFile(100, 'text/plain') as UploadFile;
      file.held = true;
      fileList.items = [file];
      await nextFrame();

      expect(file.status).to.equal('Queued');
    });

    it('should set status to "Stalled" when stalled', async () => {
      const file = createFile(100, 'text/plain') as UploadFile;
      file.stalled = true;
      fileList.items = [file];
      await nextFrame();

      expect(file.status).to.equal('Stalled');
    });

    it('should set status to "Connecting..." when indeterminate and uploading', async () => {
      const file = createFile(100, 'text/plain') as UploadFile;
      file.uploading = true;
      file.indeterminate = true;
      file.progress = 0;
      fileList.items = [file];
      await nextFrame();

      expect(file.status).to.equal('Connecting...');
    });

    it('should set status to "Processing File..." when progress is 100 and indeterminate', async () => {
      const file = createFile(100, 'text/plain') as UploadFile;
      file.uploading = true;
      file.indeterminate = true;
      file.progress = 100;
      fileList.items = [file];
      await nextFrame();

      expect(file.status).to.equal('Processing File...');
    });

    it('should translate error codes using i18n', async () => {
      const file = createFile(100, 'text/plain') as UploadFile;
      file.errorKey = 'serverUnavailable';
      fileList.items = [file];
      await nextFrame();

      expect(file.error).to.equal('Upload failed, please try again later');
    });

    it('should support custom i18n formatSize function', async () => {
      fileList.i18n = {
        ...fileList.i18n,
        formatSize: (bytes: number) => `${bytes} bytes`,
      };

      const file = createFile(1536, 'text/plain') as UploadFile;
      file.total = 1536;
      fileList.items = [file];
      await nextFrame();

      expect(file.totalStr).to.equal('1536 bytes');
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

      parent.removeChild(fileList);
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

      parent.removeChild(fileList);
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
