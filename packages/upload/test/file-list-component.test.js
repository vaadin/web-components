import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload-file-list.js';
import { UploadManager } from '../src/vaadin-upload-manager.js';
import { createFile, createFiles, xhrCreator } from './helpers.js';

describe('vaadin-upload-file-list', () => {
  let fileList;

  beforeEach(async () => {
    fileList = fixtureSync(`<vaadin-upload-file-list></vaadin-upload-file-list>`);
    await nextRender();
  });

  describe('basic', () => {
    it('should have target property defaulting to null', () => {
      expect(fileList.target).to.be.null;
    });

    it('should have default i18n object', () => {
      expect(fileList.i18n).to.be.an('object');
      expect(fileList.i18n.file).to.be.an('object');
      expect(fileList.i18n.file.retry).to.equal('Retry');
      expect(fileList.i18n.file.start).to.equal('Start');
      expect(fileList.i18n.file.remove).to.equal('Remove');
    });
  });

  describe('target integration', () => {
    let manager;

    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
    });

    it('should sync files from manager when target is set', async () => {
      const files = createFiles(2, 100, 'text/plain');
      manager.addFiles(files);
      await nextFrame();

      fileList.target = manager;
      await nextFrame();

      expect(fileList.items).to.have.lengthOf(2);
    });

    it('should sync files when manager files change', async () => {
      fileList.target = manager;
      await nextFrame();

      expect(fileList.items).to.have.lengthOf(0);

      manager.addFiles(createFiles(3, 100, 'text/plain'));
      await nextFrame();

      expect(fileList.items).to.have.lengthOf(3);
    });

    it('should clear files when target is set to null', async () => {
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      fileList.target = manager;
      await nextFrame();

      expect(fileList.items).to.have.lengthOf(2);

      fileList.target = null;
      await nextFrame();

      expect(fileList.items).to.have.lengthOf(0);
    });

    it('should remove listener when target changes', async () => {
      fileList.target = manager;
      await nextFrame();

      const manager2 = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });

      fileList.target = manager2;
      await nextFrame();

      // Add files to first manager - should not affect list
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      await nextFrame();

      expect(fileList.items).to.have.lengthOf(0);

      // Add files to second manager - should update list
      manager2.addFiles([createFile(100, 'text/plain')]);
      await nextFrame();

      expect(fileList.items).to.have.lengthOf(1);
    });

    it('should sync i18n to file list', async () => {
      fileList.target = manager;
      fileList.i18n = {
        ...fileList.i18n,
        file: {
          retry: 'Try Again',
          start: 'Begin',
          remove: 'Delete',
        },
      };
      manager.addFiles([createFile(100, 'text/plain')]);
      await nextFrame();

      expect(fileList.i18n.file.retry).to.equal('Try Again');
    });
  });

  describe('event forwarding', () => {
    let manager;

    beforeEach(async () => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
      manager._createXhr = xhrCreator({ size: 100, uploadTime: 200, stepTime: 50 });
      fileList.target = manager;
      await nextFrame();
    });

    it('should forward file-retry event to manager', async () => {
      const file = createFile(100, 'text/plain');
      manager.addFiles([file]);
      await nextFrame();

      const retrySpy = sinon.spy(manager, 'retryUpload');

      fileList.dispatchEvent(
        new CustomEvent('file-retry', {
          detail: { file: manager.files[0] },
          bubbles: true,
        }),
      );

      expect(retrySpy.calledOnce).to.be.true;
      expect(retrySpy.firstCall.args[0]).to.equal(manager.files[0]);
    });

    it('should forward file-abort event to manager', async () => {
      const file = createFile(100, 'text/plain');
      manager.addFiles([file]);
      await nextFrame();

      const fileToAbort = manager.files[0];
      const abortSpy = sinon.spy(manager, 'abortUpload');

      fileList.dispatchEvent(
        new CustomEvent('file-abort', {
          detail: { file: fileToAbort },
          bubbles: true,
        }),
      );

      expect(abortSpy.calledOnce).to.be.true;
      expect(abortSpy.firstCall.args[0]).to.equal(fileToAbort);
    });

    it('should forward file-start event to manager', async () => {
      const file = createFile(100, 'text/plain');
      manager.addFiles([file]);
      await nextFrame();

      const uploadSpy = sinon.spy(manager, 'uploadFiles');

      fileList.dispatchEvent(
        new CustomEvent('file-start', {
          detail: { file: manager.files[0] },
          bubbles: true,
        }),
      );

      expect(uploadSpy.calledOnce).to.be.true;
      expect(uploadSpy.firstCall.args[0]).to.equal(manager.files[0]);
    });

    it('should forward file-remove event to manager', async () => {
      const file = createFile(100, 'text/plain');
      manager.addFiles([file]);
      await nextFrame();

      const fileToRemove = manager.files[0];
      const removeSpy = sinon.spy(manager, 'removeFile');

      fileList.dispatchEvent(
        new CustomEvent('file-remove', {
          detail: { file: fileToRemove },
          bubbles: true,
        }),
      );

      expect(removeSpy.calledOnce).to.be.true;
      expect(removeSpy.firstCall.args[0]).to.equal(fileToRemove);
    });

    it('should stop propagation of forwarded events', async () => {
      const file = createFile(100, 'text/plain');
      manager.addFiles([file]);
      await nextFrame();

      const parentSpy = sinon.spy();
      document.addEventListener('file-retry', parentSpy);

      fileList.dispatchEvent(
        new CustomEvent('file-retry', {
          detail: { file: manager.files[0] },
          bubbles: true,
        }),
      );

      expect(parentSpy.called).to.be.false;

      document.removeEventListener('file-retry', parentSpy);
    });

    it('should not forward events when target is null', async () => {
      const file = createFile(100, 'text/plain');
      manager.addFiles([file]);
      await nextFrame();

      fileList.target = null;

      // This should not throw
      fileList.dispatchEvent(
        new CustomEvent('file-retry', {
          detail: { file: manager.files[0] },
          bubbles: true,
        }),
      );
    });
  });

  describe('with any compatible target', () => {
    it('should work with custom target that has required methods', async () => {
      const addEventListenerSpy = sinon.spy();
      const customTarget = {
        files: [],
        addEventListener: addEventListenerSpy,
        removeEventListener: sinon.spy(),
        retryUpload: sinon.spy(),
        abortUpload: sinon.spy(),
        uploadFiles: sinon.spy(),
        removeFile: sinon.spy(),
      };

      fileList.target = customTarget;
      await nextFrame();

      expect(addEventListenerSpy.called).to.be.true;
      expect(addEventListenerSpy.firstCall.args[0]).to.equal('files-changed');

      const fakeFile = { name: 'test.txt' };
      fileList.dispatchEvent(
        new CustomEvent('file-retry', {
          detail: { file: fakeFile },
          bubbles: true,
        }),
      );

      expect(customTarget.retryUpload.calledOnce).to.be.true;
      expect(customTarget.retryUpload.firstCall.args[0]).to.equal(fakeFile);
    });
  });
});
