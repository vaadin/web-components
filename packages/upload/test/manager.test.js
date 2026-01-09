import { expect } from '@vaadin/chai-plugins';
import sinon from 'sinon';
import { UploadManager } from '../src/vaadin-upload-manager.js';
import { createFile, createFiles, xhrCreator } from './helpers.js';

describe('UploadManager', () => {
  let manager;

  describe('constructor', () => {
    it('should create manager with default options', () => {
      manager = new UploadManager();
      expect(manager.target).to.equal('');
      expect(manager.method).to.equal('POST');
      expect(manager.headers).to.deep.equal({});
      expect(manager.timeout).to.equal(0);
      expect(manager.maxFiles).to.equal(Infinity);
      expect(manager.maxFileSize).to.equal(Infinity);
      expect(manager.accept).to.equal('');
      expect(manager.noAuto).to.be.false;
      expect(manager.withCredentials).to.be.false;
      expect(manager.uploadFormat).to.equal('raw');
      expect(manager.maxConcurrentUploads).to.equal(3);
      expect(manager.formDataName).to.equal('file');
    });

    it('should create manager with custom options', () => {
      manager = new UploadManager({
        target: '/api/upload',
        method: 'PUT',
        headers: { 'X-Custom': 'value' },
        timeout: 5000,
        maxFiles: 10,
        maxFileSize: 1024 * 1024,
        accept: 'image/*',
        noAuto: true,
        withCredentials: true,
        uploadFormat: 'multipart',
        maxConcurrentUploads: 5,
        formDataName: 'document',
      });

      expect(manager.target).to.equal('/api/upload');
      expect(manager.method).to.equal('PUT');
      expect(manager.headers).to.deep.equal({ 'X-Custom': 'value' });
      expect(manager.timeout).to.equal(5000);
      expect(manager.maxFiles).to.equal(10);
      expect(manager.maxFileSize).to.equal(1024 * 1024);
      expect(manager.accept).to.equal('image/*');
      expect(manager.noAuto).to.be.true;
      expect(manager.withCredentials).to.be.true;
      expect(manager.uploadFormat).to.equal('multipart');
      expect(manager.maxConcurrentUploads).to.equal(5);
      expect(manager.formDataName).to.equal('document');
    });
  });

  describe('files', () => {
    beforeEach(() => {
      manager = new UploadManager({ noAuto: true });
    });

    it('should start with empty files array', () => {
      expect(manager.files).to.be.an('array').that.is.empty;
    });

    it('should add files via addFiles', () => {
      const files = createFiles(2, 100, 'text/plain');
      manager.addFiles(files);
      expect(manager.files).to.have.lengthOf(2);
    });

    it('should prepend new files to the array', () => {
      const file1 = createFile(100, 'text/plain');
      const file2 = createFile(100, 'text/plain');
      manager.addFiles([file1]);
      manager.addFiles([file2]);
      expect(manager.files[0]).to.equal(file2);
      expect(manager.files[1]).to.equal(file1);
    });

    it('should dispatch files-changed event when files are added', () => {
      const spy = sinon.spy();
      manager.addEventListener('files-changed', spy);
      manager.addFiles([createFile(100, 'text/plain')]);
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.value).to.have.lengthOf(1);
    });

    it('should dispatch files-changed event when files property is set', () => {
      const spy = sinon.spy();
      manager.addEventListener('files-changed', spy);
      manager.files = createFiles(2, 100, 'text/plain');
      expect(spy.calledOnce).to.be.true;
    });

    it('should remove file via removeFile', () => {
      const files = createFiles(2, 100, 'text/plain');
      manager.addFiles(files);
      manager.removeFile(manager.files[0]);
      expect(manager.files).to.have.lengthOf(1);
    });

    it('should dispatch file-remove event when file is removed', () => {
      const spy = sinon.spy();
      manager.addEventListener('file-remove', spy);
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.removeFile(manager.files[0]);
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.file).to.exist;
      expect(spy.firstCall.args[0].detail.fileIndex).to.equal(0);
    });
  });

  describe('maxFilesReached', () => {
    beforeEach(() => {
      manager = new UploadManager({ maxFiles: 2, noAuto: true });
    });

    it('should start with maxFilesReached as false', () => {
      expect(manager.maxFilesReached).to.be.false;
    });

    it('should set maxFilesReached when limit is reached', () => {
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      expect(manager.maxFilesReached).to.be.true;
    });

    it('should reset maxFilesReached when file is removed', () => {
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      expect(manager.maxFilesReached).to.be.true;
      manager.removeFile(manager.files[0]);
      expect(manager.maxFilesReached).to.be.false;
    });

    it('should dispatch max-files-reached-changed event', () => {
      const spy = sinon.spy();
      manager.addEventListener('max-files-reached-changed', spy);
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.value).to.be.true;
    });
  });

  describe('file validation', () => {
    beforeEach(() => {
      manager = new UploadManager({ noAuto: true });
    });

    it('should reject file when maxFiles is reached', () => {
      manager.maxFiles = 1;
      const spy = sinon.spy();
      manager.addEventListener('file-reject', spy);

      manager.addFiles(createFiles(2, 100, 'text/plain'));

      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.error).to.equal('tooManyFiles');
      expect(manager.files).to.have.lengthOf(1);
    });

    it('should reject file when size exceeds maxFileSize', () => {
      manager.maxFileSize = 50;
      const spy = sinon.spy();
      manager.addEventListener('file-reject', spy);

      manager.addFiles([createFile(100, 'text/plain')]);

      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.error).to.equal('fileIsTooBig');
      expect(manager.files).to.have.lengthOf(0);
    });

    it('should reject file with incorrect type', () => {
      manager.accept = 'image/*';
      const spy = sinon.spy();
      manager.addEventListener('file-reject', spy);

      manager.addFiles([createFile(100, 'text/plain')]);

      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.error).to.equal('incorrectFileType');
      expect(manager.files).to.have.lengthOf(0);
    });

    it('should accept file matching MIME type', () => {
      manager.accept = 'image/*';
      manager.addFiles([createFile(100, 'image/png')]);
      expect(manager.files).to.have.lengthOf(1);
    });

    it('should accept file matching extension', () => {
      manager.accept = '.txt,.pdf';
      const file = createFile(100, 'text/plain');
      file.name = 'document.txt';
      manager.addFiles([file]);
      expect(manager.files).to.have.lengthOf(1);
    });
  });

  describe('uploading', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
      manager._createXhr = xhrCreator({ size: 100, uploadTime: 50, stepTime: 10 });
    });

    it('should not auto-upload when noAuto is true', () => {
      const spy = sinon.spy();
      manager.addEventListener('upload-start', spy);
      manager.addFiles([createFile(100, 'text/plain')]);
      expect(spy.called).to.be.false;
    });

    it('should auto-upload when noAuto is false', () => {
      manager.noAuto = false;
      const spy = sinon.spy();
      manager.addEventListener('upload-start', spy);
      manager.addFiles([createFile(100, 'text/plain')]);
      expect(spy.calledOnce).to.be.true;
    });

    it('should upload file via uploadFiles', () => {
      const spy = sinon.spy();
      manager.addEventListener('upload-start', spy);
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();
      expect(spy.calledOnce).to.be.true;
    });

    it('should upload specific file via uploadFiles', () => {
      const spy = sinon.spy();
      manager.addEventListener('upload-start', spy);
      const files = createFiles(2, 100, 'text/plain');
      manager.addFiles(files);
      manager.uploadFiles(manager.files[0]);
      expect(spy.calledOnce).to.be.true;
    });

    it('should dispatch upload-before event', () => {
      const spy = sinon.spy();
      manager.addEventListener('upload-before', spy);
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.file).to.exist;
      expect(spy.firstCall.args[0].detail.xhr).to.exist;
    });

    it('should dispatch upload-request event', () => {
      const spy = sinon.spy();
      manager.addEventListener('upload-request', spy);
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();
      expect(spy.calledOnce).to.be.true;
    });

    it('should dispatch upload-progress event', (done) => {
      const handler = (e) => {
        manager.removeEventListener('upload-progress', handler);
        expect(e.detail.file).to.exist;
        expect(e.detail.xhr).to.exist;
        done();
      };
      manager.addEventListener('upload-progress', handler);
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();
    });

    it('should dispatch upload-success event on completion', (done) => {
      manager.addEventListener('upload-success', (e) => {
        expect(e.detail.file).to.exist;
        expect(e.detail.file.complete).to.be.true;
        done();
      });
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();
    });

    it('should set file.complete to true on success', (done) => {
      manager.addEventListener('upload-success', () => {
        expect(manager.files[0].complete).to.be.true;
        done();
      });
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();
    });
  });

  describe('concurrent uploads', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: false,
        maxConcurrentUploads: 2,
      });
      manager._createXhr = xhrCreator({ size: 100, uploadTime: 100, stepTime: 20 });
    });

    it('should respect maxConcurrentUploads', () => {
      const files = createFiles(4, 100, 'text/plain');
      manager.addFiles(files);

      // Count files that are uploading but not held (queued)
      const activeUploads = manager.files.filter((f) => f.uploading && !f.held).length;
      const queuedUploads = manager.files.filter((f) => f.uploading && f.held).length;

      expect(activeUploads).to.equal(2);
      expect(queuedUploads).to.equal(2);
    });
  });

  describe('abort and retry', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
      manager._createXhr = xhrCreator({ size: 100, uploadTime: 200, stepTime: 50 });
    });

    it('should abort upload via abortUpload', () => {
      const spy = sinon.spy();
      manager.addEventListener('upload-abort', spy);
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();
      manager.abortUpload(manager.files[0]);
      expect(spy.calledOnce).to.be.true;
    });

    it('should remove file when aborted', () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();
      manager.abortUpload(manager.files[0]);
      expect(manager.files).to.have.lengthOf(0);
    });

    it('should retry upload via retryUpload', () => {
      const spy = sinon.spy();
      manager.addEventListener('upload-retry', spy);

      manager._createXhr = xhrCreator({
        size: 100,
        uploadTime: 10,
        stepTime: 5,
        serverValidation: () => ({ status: 500, statusText: 'Server Error' }),
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      // Wait for upload to fail
      setTimeout(() => {
        manager._createXhr = xhrCreator({ size: 100, uploadTime: 10, stepTime: 5 });
        manager.retryUpload(manager.files[0]);
        expect(spy.calledOnce).to.be.true;
      }, 50);
    });
  });

  describe('upload format', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
    });

    it('should use raw format by default', () => {
      let requestBody;
      manager.addEventListener('upload-request', (e) => {
        requestBody = e.detail.requestBody;
      });
      manager._createXhr = xhrCreator({ size: 100, uploadTime: 10 });
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(requestBody).to.be.instanceOf(Blob);
    });

    it('should use multipart format when configured', () => {
      manager.uploadFormat = 'multipart';
      let requestBody;
      manager.addEventListener('upload-request', (e) => {
        requestBody = e.detail.requestBody;
      });
      manager._createXhr = xhrCreator({ size: 100, uploadTime: 10 });
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(requestBody).to.be.instanceOf(FormData);
    });

    it('should include formData in event for multipart uploads', () => {
      manager.uploadFormat = 'multipart';
      let formData;
      manager.addEventListener('upload-request', (e) => {
        formData = e.detail.formData;
      });
      manager._createXhr = xhrCreator({ size: 100, uploadTime: 10 });
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(formData).to.be.instanceOf(FormData);
    });
  });

  describe('preventing default', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
      manager._createXhr = xhrCreator({ size: 100, uploadTime: 50 });
    });

    it('should not upload when upload-before is prevented', () => {
      manager.addEventListener('upload-before', (e) => {
        e.preventDefault();
      });
      const startSpy = sinon.spy();
      manager.addEventListener('upload-start', startSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(startSpy.called).to.be.false;
    });

    it('should not send when upload-request is prevented', () => {
      manager.addEventListener('upload-request', (e) => {
        e.preventDefault();
      });
      const progressSpy = sinon.spy();
      manager.addEventListener('upload-progress', progressSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(progressSpy.called).to.be.false;
    });

    it('should not retry when upload-retry is prevented', () => {
      manager._createXhr = xhrCreator({
        size: 100,
        uploadTime: 10,
        serverValidation: () => ({ status: 500 }),
      });

      manager.addEventListener('upload-retry', (e) => {
        e.preventDefault();
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      setTimeout(() => {
        const startSpy = sinon.spy();
        manager.addEventListener('upload-start', startSpy);
        manager.retryUpload(manager.files[0]);
        expect(startSpy.called).to.be.false;
      }, 50);
    });

    it('should not abort when upload-abort is prevented', () => {
      manager.addEventListener('upload-abort', (e) => {
        e.preventDefault();
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();
      manager.abortUpload(manager.files[0]);

      // File should still be in the list
      expect(manager.files).to.have.lengthOf(1);
    });
  });
});
