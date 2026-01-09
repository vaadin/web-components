import { expect } from '@vaadin/chai-plugins';
import sinon from 'sinon';
import type { UploadFile } from '../src/vaadin-upload-manager.js';
import { UploadManager } from '../src/vaadin-upload-manager.js';
import { createFile, createFiles, xhrCreator } from './helpers.js';

describe('UploadManager', () => {
  let manager: UploadManager;

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

    it('should set initial file properties when added', () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];
      expect(file.held).to.be.true;
      expect(file.loaded).to.equal(0);
      expect(file.formDataName).to.equal('file');
    });

    it('should use custom formDataName for added files', () => {
      manager.formDataName = 'attachment';
      manager.addFiles([createFile(100, 'text/plain')]);
      expect(manager.files[0].formDataName).to.equal('attachment');
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
      manager.files = createFiles(2, 100, 'text/plain') as UploadFile[];
      expect(spy.calledOnce).to.be.true;
    });

    it('should dispatch files-changed event when file is removed', () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      const spy = sinon.spy();
      manager.addEventListener('files-changed', spy);
      manager.removeFile(manager.files[0]);
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.value).to.have.lengthOf(0);
    });

    it('should include oldValue in files-changed event', () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      const oldFilesLength = manager.files.length;

      let eventDetail: { value: UploadFile[]; oldValue: UploadFile[] } | undefined;
      manager.addEventListener('files-changed', (e) => {
        eventDetail = e.detail;
      });
      manager.addFiles([createFile(100, 'text/plain')]);

      // oldValue should have the previous length (1 file)
      expect(eventDetail!.oldValue).to.have.lengthOf(oldFilesLength);
      // value should have the new length (2 files)
      expect(eventDetail!.value).to.have.lengthOf(2);
      // oldValue and value should be different references
      expect(eventDetail!.value).to.not.equal(eventDetail!.oldValue);
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
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 50, stepTime: 10 });
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

    it('should dispatch upload-progress event', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });

      const progressSpy = sinon.spy();
      manager.addEventListener('upload-progress', progressSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(progressSpy.called).to.be.true;
      expect(progressSpy.firstCall.args[0].detail.file).to.exist;
      expect(progressSpy.firstCall.args[0].detail.xhr).to.exist;
    });

    it('should track progress properties on file during upload', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];

      const startSpy = sinon.spy();
      const progressSpy = sinon.spy();
      const successSpy = sinon.spy();

      manager.addEventListener('upload-start', startSpy);
      manager.addEventListener('upload-progress', progressSpy);
      manager.addEventListener('upload-success', successSpy);

      manager.uploadFiles();

      // Start event assertions
      expect(startSpy.calledOnce).to.be.true;

      // Progress event assertions
      expect(progressSpy.called).to.be.true;

      // Success event assertions - after completion
      expect(successSpy.calledOnce).to.be.true;
      expect(file.indeterminate).to.be.false;
      expect(file.uploading).to.be.false;
    });

    it('should dispatch upload-response event before upload-success', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });

      const events: string[] = [];
      manager.addEventListener('upload-response', (e) => {
        events.push('response');
        expect(e.detail.file).to.exist;
        expect(e.detail.xhr).to.exist;
      });
      manager.addEventListener('upload-success', () => {
        events.push('success');
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(events).to.deep.equal(['response', 'success']);
    });

    it('should dispatch upload-success event on completion', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });

      const successSpy = sinon.spy();
      manager.addEventListener('upload-success', successSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(successSpy.calledOnce).to.be.true;
      expect(successSpy.firstCall.args[0].detail.file).to.exist;
      expect(successSpy.firstCall.args[0].detail.file.complete).to.be.true;
    });

    it('should set file.complete to true on success', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });

      const successSpy = sinon.spy();
      manager.addEventListener('upload-success', successSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(successSpy.calledOnce).to.be.true;
      expect(manager.files[0].complete).to.be.true;
    });

    it('should set file.error to unexpectedServerError on 500 status', () => {
      (manager as any)._createXhr = xhrCreator({
        sync: true,
        serverValidation: () => ({ status: 500 }),
      });

      const errorSpy = sinon.spy();
      manager.addEventListener('upload-error', errorSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(errorSpy.calledOnce).to.be.true;
      expect(errorSpy.firstCall.args[0].detail.file.error).to.equal('unexpectedServerError');
      expect(errorSpy.firstCall.args[0].detail.file.complete).to.be.false;
    });

    it('should set file.error to forbidden on 403 status', () => {
      (manager as any)._createXhr = xhrCreator({
        sync: true,
        serverValidation: () => ({ status: 403 }),
      });

      const errorSpy = sinon.spy();
      manager.addEventListener('upload-error', errorSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(errorSpy.calledOnce).to.be.true;
      expect(errorSpy.firstCall.args[0].detail.file.error).to.equal('forbidden');
    });

    it('should set file.total during progress', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });

      const progressSpy = sinon.spy();
      manager.addEventListener('upload-progress', progressSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(progressSpy.called).to.be.true;
      expect(progressSpy.firstCall.args[0].detail.file.total).to.be.a('number');
      expect(progressSpy.firstCall.args[0].detail.file.total).to.be.greaterThan(0);
    });

    it('should set file.elapsed and file.remaining during progress', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });

      const progressSpy = sinon.spy();
      manager.addEventListener('upload-progress', progressSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      // Sync mode fires multiple progress events - check a later one for elapsed/remaining
      expect(progressSpy.callCount).to.be.greaterThan(0);
      const lastCall = progressSpy.lastCall.args[0].detail.file;
      expect(lastCall.elapsed).to.be.a('number');
      expect(lastCall.remaining).to.be.a('number');
      expect(lastCall.speed).to.be.a('number');
    });

    it('should dispatch files-changed event when upload starts', () => {
      const filesChangedSpy = sinon.spy();
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.addEventListener('files-changed', filesChangedSpy);
      manager.uploadFiles();
      // Should fire at least once for queue state update and once for upload start
      expect(filesChangedSpy.called).to.be.true;
    });

    it('should dispatch files-changed event when upload completes', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });
      manager.addFiles([createFile(100, 'text/plain')]);

      const filesChangedSpy = sinon.spy();
      manager.addEventListener('files-changed', filesChangedSpy);

      const successSpy = sinon.spy();
      manager.addEventListener('upload-success', successSpy);

      manager.uploadFiles();

      expect(successSpy.calledOnce).to.be.true;
      expect(filesChangedSpy.called).to.be.true;
    });

    it('should clear file.status after upload completes', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });
      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];

      const successSpy = sinon.spy();
      manager.addEventListener('upload-success', successSpy);

      manager.uploadFiles();

      expect(successSpy.calledOnce).to.be.true;
      expect(file.status).to.equal('');
    });

    it('should initialize file.stalled to false when queuing', () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();
      expect(manager.files[0].stalled).to.be.false;
    });
  });

  describe('stalled detection', () => {
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should set file.stalled to true after 2 seconds without progress', async () => {
      // Create a mock XHR that doesn't send progress updates
      (manager as any)._createXhr = () => {
        const xhr = {
          readyState: 0,
          status: 0,
          upload: {
            onprogress: null as ((e: { loaded: number; total: number }) => void) | null,
            onloadstart: null as (() => void) | null,
          },
          onreadystatechange: null as (() => void) | null,
          onabort: null as (() => void) | null,
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          requestHeaders: {} as Record<string, string>,
          open() {
            this.readyState = 1;
          },
          setRequestHeader(name: string, value: string) {
            this.requestHeaders[name] = value;
          },
          send() {
            // Trigger loadstart
            if (this.upload.onloadstart) {
              this.upload.onloadstart();
            }
            // Send one progress event to start the stalled timer
            if (this.upload.onprogress) {
              this.upload.onprogress({ loaded: 10, total: 100 });
            }
            // Don't send any more progress events
          },
          abort() {
            if (this.onabort) {
              this.onabort();
            }
          },
        };
        return xhr;
      };

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];

      manager.uploadFiles();

      // Initially not stalled
      expect(file.stalled).to.be.false;

      // Advance time by 2 seconds
      await clock.tickAsync(2100);

      // Now should be stalled
      expect(file.stalled).to.be.true;
    });
  });

  describe('concurrent uploads', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: false,
        maxConcurrentUploads: 2,
      });
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 100, stepTime: 20 });
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

    it('should start next queued upload when one completes', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });

      const successSpy = sinon.spy();
      manager.addEventListener('upload-success', successSpy);

      const files = createFiles(3, 100, 'text/plain');
      manager.addFiles(files);

      // With sync mode and noAuto: false, all uploads complete synchronously when added
      expect(successSpy.callCount).to.equal(3);
      expect(manager.files.filter((f) => f.complete).length).to.equal(3);
    });

    it('should start next queued upload when one is aborted', () => {
      // Use non-sync upload so files don't complete immediately
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 500, stepTime: 50 });

      const files = createFiles(3, 100, 'text/plain');
      manager.addFiles(files);

      // Initially: 2 active, 1 queued
      const initialActive = manager.files.filter((f) => f.uploading && !f.held).length;
      const initialQueued = manager.files.filter((f) => f.held).length;
      expect(initialActive).to.equal(2);
      expect(initialQueued).to.equal(1);

      // Abort one of the active uploads
      const fileToAbort = manager.files.find((f) => f.uploading && !f.held);
      manager.abortUpload(fileToAbort!);

      // The previously queued file should now be active (uploads start synchronously)
      const activeNow = manager.files.filter((f) => f.uploading && !f.held).length;
      expect(activeNow).to.equal(2);
    });

    it('should not re-queue a file that is already uploading', () => {
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 500, stepTime: 50 });

      const files = createFiles(1, 100, 'text/plain');
      manager.addFiles(files);
      const file = manager.files[0];

      // File is now uploading
      expect(file.uploading).to.be.true;

      const startSpy = sinon.spy();
      manager.addEventListener('upload-start', startSpy);

      // Try to upload the same file again
      manager.uploadFiles(file);

      // Should not start a new upload
      expect(startSpy.called).to.be.false;
    });

    it('should remove file from queue when removed before upload starts', () => {
      // Use long upload time so files stay queued
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 500, stepTime: 50 });

      const files = createFiles(4, 100, 'text/plain');
      manager.addFiles(files);

      // 2 active, 2 queued
      const queuedFiles = manager.files.filter((f) => f.held);
      expect(queuedFiles.length).to.equal(2);

      // Remove a queued file
      const queuedFile = queuedFiles[0];
      manager.removeFile(queuedFile);

      // Should only have 3 files now
      expect(manager.files).to.have.lengthOf(3);

      // Only 1 should be queued
      expect(manager.files.filter((f) => f.held).length).to.equal(1);
    });
  });

  describe('abort and retry', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 200, stepTime: 50 });
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

    it('should actually abort the XHR request when aborting', () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();
      const file = manager.files[0];
      const abortSpy = sinon.spy(file.xhr!, 'abort');

      manager.abortUpload(file);

      expect(abortSpy.calledOnce).to.be.true;
    });

    it('should set file.abort flag when aborting', () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();
      const file = manager.files[0];
      expect(file.abort).to.not.be.true;

      manager.abortUpload(file);

      expect(file.abort).to.be.true;
    });

    it('should retry upload via retryUpload', () => {
      const retrySpy = sinon.spy();
      manager.addEventListener('upload-retry', retrySpy);

      const errorSpy = sinon.spy();
      manager.addEventListener('upload-error', errorSpy);

      (manager as any)._createXhr = xhrCreator({
        sync: true,
        serverValidation: () => ({ status: 500, statusText: 'Server Error' }),
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(errorSpy.calledOnce).to.be.true;

      const successSpy = sinon.spy();
      manager.addEventListener('upload-success', successSpy);
      (manager as any)._createXhr = xhrCreator({ sync: true });
      manager.retryUpload(manager.files[0]);

      expect(retrySpy.calledOnce).to.be.true;
      expect(successSpy.calledOnce).to.be.true;
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
      let requestBody: File | FormData | undefined;
      manager.addEventListener('upload-request', (e) => {
        requestBody = e.detail.requestBody;
      });
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 10 });
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(requestBody).to.be.instanceOf(Blob);
    });

    it('should use multipart format when configured', () => {
      manager.uploadFormat = 'multipart';
      let requestBody: File | FormData | undefined;
      manager.addEventListener('upload-request', (e) => {
        requestBody = e.detail.requestBody;
      });
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 10 });
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(requestBody).to.be.instanceOf(FormData);
    });

    it('should include formData in event for multipart uploads', () => {
      manager.uploadFormat = 'multipart';
      let formData: FormData | undefined;
      manager.addEventListener('upload-request', (e) => {
        formData = e.detail.formData;
      });
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 10 });
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
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 50 });
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
      (manager as any)._createXhr = xhrCreator({
        sync: true,
        serverValidation: () => ({ status: 500 }),
      });

      manager.addEventListener('upload-retry', (e) => {
        e.preventDefault();
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      const startSpy = sinon.spy();
      manager.addEventListener('upload-start', startSpy);
      manager.retryUpload(manager.files[0]);
      expect(startSpy.called).to.be.false;
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

    it('should not dispatch upload-success when upload-response is prevented', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });

      const responseSpy = sinon.spy();
      manager.addEventListener('upload-response', (e) => {
        responseSpy();
        e.preventDefault();
      });

      const successSpy = sinon.spy();
      manager.addEventListener('upload-success', successSpy);
      manager.addEventListener('upload-error', successSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      // Verify upload-response was called (so we know upload completed)
      expect(responseSpy.called).to.be.true;
      // But upload-success should NOT be called since upload-response was prevented
      expect(successSpy.called).to.be.false;
    });
  });

  describe('XHR configuration', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 10 });
    });

    it('should set custom headers on XHR', () => {
      manager.headers = { Authorization: 'Bearer token123', 'X-Custom': 'value' };

      let capturedXhr: any;
      manager.addEventListener('upload-request', (e) => {
        capturedXhr = e.detail.xhr;
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(capturedXhr.getRequestHeader('Authorization')).to.equal('Bearer token123');
      expect(capturedXhr.getRequestHeader('X-Custom')).to.equal('value');
    });

    it('should set Content-Type header for raw uploads', () => {
      let capturedXhr: any;
      manager.addEventListener('upload-request', (e) => {
        capturedXhr = e.detail.xhr;
      });

      const file = createFile(100, 'application/pdf');
      manager.addFiles([file]);
      manager.uploadFiles();

      expect(capturedXhr.getRequestHeader('Content-Type')).to.equal('application/pdf');
    });

    it('should set X-Filename header for raw uploads', () => {
      let capturedXhr: any;
      manager.addEventListener('upload-request', (e) => {
        capturedXhr = e.detail.xhr;
      });

      const file = createFile(100, 'text/plain');
      file.name = 'test file.txt';
      manager.addFiles([file]);
      manager.uploadFiles();

      expect(capturedXhr.getRequestHeader('X-Filename')).to.equal('test%20file.txt');
    });

    it('should set timeout on XHR', () => {
      manager.timeout = 5000;

      let capturedXhr: any;
      manager.addEventListener('upload-request', (e) => {
        capturedXhr = e.detail.xhr;
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(capturedXhr.timeout).to.equal(5000);
    });

    it('should set withCredentials on XHR', () => {
      manager.withCredentials = true;

      let capturedXhr: any;
      manager.addEventListener('upload-request', (e) => {
        capturedXhr = e.detail.xhr;
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(capturedXhr.withCredentials).to.be.true;
    });
  });

  describe('files-changed event oldValue', () => {
    beforeEach(() => {
      manager = new UploadManager({ noAuto: true });
    });

    it('should provide different references for value and oldValue in files-changed during progress', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });
      manager.addFiles([createFile(100, 'text/plain')]);

      const filesChangedSpy = sinon.spy();
      manager.addEventListener('files-changed', filesChangedSpy);

      manager.uploadFiles();

      expect(filesChangedSpy.called).to.be.true;
      expect(filesChangedSpy.firstCall.args[0].detail.value).to.not.equal(
        filesChangedSpy.firstCall.args[0].detail.oldValue,
      );
    });
  });

  describe('retrying queued files', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: false,
        maxConcurrentUploads: 1,
      });
    });

    it('should allow retrying a queued file that failed before starting', () => {
      // Use slow upload so first file blocks the queue
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 500, stepTime: 50 });

      const files = createFiles(2, 100, 'text/plain');
      manager.addFiles(files);

      // Second file is queued (held=true, uploading=true)
      const queuedFile = manager.files.find((f) => f.held);
      expect(queuedFile).to.exist;
      expect(queuedFile!.uploading).to.be.true;

      // Simulate the queued file having an error state somehow
      queuedFile!.error = 'previousError';

      // The bug: retryUpload dispatches upload-retry event, but __queueFileUpload
      // early-returns because file.uploading is already true, so the error isn't cleared
      manager.retryUpload(queuedFile!);

      // After retry, the error should be cleared (reset to false in __queueFileUpload)
      // BUG: error is NOT cleared because __queueFileUpload early-returns
      expect(queuedFile!.error).to.be.false;
    });
  });

  describe('stalled timeout cleanup', () => {
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should not set stalled=true after file is aborted', async () => {
      let progressCallback: ((e: { loaded: number; total: number }) => void) | null = null;
      let abortCallback: (() => void) | null = null;

      (manager as any)._createXhr = () => {
        const requestHeaders: Record<string, string> = {};
        const xhr = {
          readyState: 0,
          status: 0,
          upload: {
            onprogress: null as any,
            onloadstart: null as any,
          },
          onreadystatechange: null as any,
          onabort: null as any,
          requestHeaders,
          open() {
            this.readyState = 1;
          },
          setRequestHeader(name: string, value: string) {
            this.requestHeaders[name] = value;
          },
          send() {
            progressCallback = this.upload.onprogress;
            abortCallback = this.onabort;
            if (this.upload.onloadstart) {
              this.upload.onloadstart();
            }
            // Send progress to start stalled timer
            if (progressCallback) {
              progressCallback({ loaded: 10, total: 100 });
            }
          },
          abort() {
            if (abortCallback) {
              abortCallback();
            }
          },
        };
        return xhr;
      };

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];
      manager.uploadFiles();

      // Abort immediately
      manager.abortUpload(file);

      // Advance past the stalled timeout
      await clock.tickAsync(2500);

      // Stalled should not be set after abort
      expect(file.stalled).to.not.be.true;
    });
  });

  describe('upload-before prevention cleanup', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 50 });
    });

    it('should put file on hold when upload-before is prevented', () => {
      manager.addEventListener('upload-before', (e) => {
        e.preventDefault();
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      // File should be held (not actively uploading) since upload-before was prevented
      expect(manager.files[0].held).to.be.true;
    });

    it('should reset file state when upload-before is prevented', () => {
      manager.addEventListener('upload-before', (e) => {
        e.preventDefault();
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];
      manager.uploadFiles();

      expect(file.uploading).to.be.false;
    });
  });

  describe('speed calculation', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
    });

    it('should calculate speed based on loaded bytes, not total', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });
      manager.addFiles([createFile(1000, 'text/plain')]);
      const file = manager.files[0];

      const progressSpy = sinon.spy();
      manager.addEventListener('upload-progress', progressSpy);

      manager.uploadFiles();

      // Check that speed was calculated during progress
      expect(progressSpy.called).to.be.true;
      // Speed should be a finite number (not Infinity or NaN)
      expect(Number.isFinite(file.speed)).to.be.true;
    });
  });

  describe('queue duplicate prevention', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: false,
        maxConcurrentUploads: 1,
      });
    });

    it('should not start upload twice for same file', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });

      const startSpy = sinon.spy();
      manager.addEventListener('upload-start', startSpy);

      // Add a file
      const files = createFiles(1, 100, 'text/plain');
      manager.addFiles(files);

      // First upload-start was fired
      expect(startSpy.callCount).to.equal(1);

      // Try to upload the same file again
      manager.uploadFiles(manager.files[0]);

      // Should not fire upload-start again for same file
      expect(startSpy.callCount).to.equal(1);
    });
  });

  describe('zero-byte file handling', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
    });

    it('should handle zero-byte files without NaN progress', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true, size: 0 });

      // Create a zero-byte file
      const file = new File([], 'empty.txt', { type: 'text/plain' }) as UploadFile;
      manager.addFiles([file]);

      const progressSpy = sinon.spy();
      manager.addEventListener('upload-progress', progressSpy);

      const successSpy = sinon.spy();
      manager.addEventListener('upload-success', successSpy);

      manager.uploadFiles();

      expect(successSpy.calledOnce).to.be.true;
      expect(file.progress).to.not.be.NaN;
      expect(file.progress).to.equal(100);
    });
  });

  describe('upload-request prevention', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
        maxConcurrentUploads: 2,
      });
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 50 });
    });

    it('should allow new uploads after upload-request is prevented', () => {
      manager.addEventListener('upload-request', (e) => {
        e.preventDefault();
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      // File should be held (not actively uploading) since request was prevented
      expect(manager.files[0].held).to.be.true;
    });

    it('should allow subsequent uploads after upload-request is prevented', () => {
      let preventCount = 0;
      manager.addEventListener('upload-request', (e) => {
        preventCount += 1;
        if (preventCount === 1) {
          e.preventDefault(); // Prevent first upload only
        }
      });

      const startSpy = sinon.spy();
      manager.addEventListener('upload-start', startSpy);

      // Add 3 files with maxConcurrentUploads=2
      const files = createFiles(3, 100, 'text/plain');
      manager.addFiles(files);
      manager.uploadFiles();

      // First file was prevented, but 2nd and 3rd should still be able to upload
      expect(startSpy.callCount).to.equal(2);
    });
  });

  describe('XHR timeout handling', () => {
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
        timeout: 1000, // 1 second timeout
      });
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should distinguish between timeout and network error', async () => {
      let timeoutFired = false;

      (manager as any)._createXhr = () => {
        const xhr = {
          readyState: 0,
          status: 0,
          timeout: 0,
          upload: {
            onprogress: null as any,
            onloadstart: null as any,
          },
          onreadystatechange: null as any,
          ontimeout: null as any,
          onabort: null as any,
          open() {
            this.readyState = 1;
          },
          setRequestHeader() {},
          send() {
            if (this.upload.onloadstart) {
              this.upload.onloadstart();
            }
            // Simulate timeout after the configured timeout period
            setTimeout(() => {
              timeoutFired = true;
              if (this.ontimeout) {
                this.ontimeout();
              }
              // Also trigger readystate=4 with status=0 (how browsers behave)
              this.readyState = 4;
              if (this.onreadystatechange) {
                this.onreadystatechange();
              }
            }, 1000);
          },
          abort() {},
        };
        return xhr;
      };

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];
      manager.uploadFiles();

      // Wait for timeout
      await clock.tickAsync(1100);

      expect(timeoutFired).to.be.true;
      expect(file.error).to.equal('timeout');
    });
  });

  describe('maxFileSize=0 edge case', () => {
    it('should allow zero-byte files when maxFileSize=0', () => {
      manager = new UploadManager({
        noAuto: true,
        maxFileSize: 0,
      });

      const rejectSpy = sinon.spy();
      manager.addEventListener('file-reject', rejectSpy);

      // Create a zero-byte file
      const emptyFile = new File([], 'empty.txt', { type: 'text/plain' });
      manager.addFiles([emptyFile]);

      // Zero-byte file should be accepted (0 > 0 is false)
      expect(rejectSpy.called).to.be.false;
      expect(manager.files).to.have.lengthOf(1);
    });

    it('should reject all non-zero files when maxFileSize=0', () => {
      manager = new UploadManager({
        noAuto: true,
        maxFileSize: 0,
      });

      const rejectSpy = sinon.spy();
      manager.addEventListener('file-reject', rejectSpy);

      // Create a 1-byte file using the File constructor
      const file = new File(['x'], 'test.txt', { type: 'text/plain' });
      manager.addFiles([file]);

      expect(rejectSpy.calledOnce).to.be.true;
      expect(rejectSpy.firstCall.args[0].detail.error).to.equal('fileIsTooBig');
    });
  });

  describe('rapid add/remove', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: false,
        maxConcurrentUploads: 1,
      });
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 500, stepTime: 50 });
    });

    it('should handle rapid add then remove of same file', () => {
      const file = createFile(100, 'text/plain') as UploadFile;

      manager.addFiles([file]);
      // Immediately remove before any async operations
      manager.removeFile(manager.files[0]);

      // Files array should be empty
      expect(manager.files).to.have.lengthOf(0);
    });

    it('should not start uploads for removed files', () => {
      const startSpy = sinon.spy();
      manager.addEventListener('upload-start', startSpy);

      // Add multiple files - some will be queued
      const files = createFiles(3, 100, 'text/plain');
      manager.addFiles(files);

      // First file started uploading
      const initialStartCount = startSpy.callCount;
      expect(initialStartCount).to.equal(1); // maxConcurrentUploads: 1

      // Remove all files rapidly
      while (manager.files.length > 0) {
        manager.removeFile(manager.files[0]);
      }

      // No additional uploads should have started for removed files
      expect(startSpy.callCount).to.equal(initialStartCount);
      expect(manager.files).to.have.lengthOf(0);
    });
  });

  describe('XHR handler cleanup', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
    });

    it('should null out XHR handlers after upload completes', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];

      // Capture xhr before upload completes (it gets nulled after)
      let capturedXhr: any;
      manager.addEventListener('upload-success', () => {
        capturedXhr = file.xhr;
      });

      manager.uploadFiles();

      expect(capturedXhr.upload.onprogress).to.be.null;
      expect(capturedXhr.onreadystatechange).to.be.null;
      expect(capturedXhr.onabort).to.be.null;
    });

    it('should null out XHR handlers after upload error', () => {
      (manager as any)._createXhr = xhrCreator({
        sync: true,
        serverValidation: () => ({ status: 500 }),
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];

      // Capture xhr before upload completes (it gets nulled after)
      let capturedXhr: any;
      manager.addEventListener('upload-error', () => {
        capturedXhr = file.xhr;
      });

      manager.uploadFiles();

      expect(capturedXhr.upload.onprogress).to.be.null;
      expect(capturedXhr.onreadystatechange).to.be.null;
    });
  });

  describe('xhr.send() exception handling', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
        maxConcurrentUploads: 2,
      });
    });

    it('should handle xhr.send() throwing an exception', () => {
      (manager as any)._createXhr = () => {
        return {
          readyState: 0,
          status: 0,
          upload: {
            onprogress: null,
            onloadstart: null,
          },
          onreadystatechange: null,
          onabort: null,
          open() {
            this.readyState = 1;
          },
          setRequestHeader() {},
          send() {
            throw new Error('Network error');
          },
          abort() {},
        };
      };

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];

      // This should not throw - the error should be caught
      expect(() => manager.uploadFiles()).to.not.throw();

      // File should be marked as error
      expect(file.error).to.be.a('string');
    });
  });

  describe('abort during upload-before event', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
    });

    it('should handle abort called during upload-before event', () => {
      let uploadBeforeFired = false;

      manager.addEventListener('upload-before', () => {
        uploadBeforeFired = true;
        // Abort during upload-before - XHR exists but not sent
        manager.abortUpload(manager.files[0]);
      });

      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 50 });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(uploadBeforeFired).to.be.true;
      // File should be removed
      expect(manager.files).to.have.lengthOf(0);
    });
  });

  describe('method validation', () => {
    it('should reject invalid HTTP methods', () => {
      // The JSDoc says "Only POST and PUT are allowed"
      expect(() => {
        new UploadManager({
          target: '/api/upload',
          method: 'DELETE' as any,
        });
      }).to.throw();
    });
  });

  describe('files setter re-entrancy', () => {
    it('should not cause stack overflow when files-changed handler modifies files', () => {
      manager = new UploadManager({ noAuto: true });

      let callCount = 0;
      manager.addEventListener('files-changed', () => {
        callCount += 1;
        if (callCount < 10) {
          // Modifying files in the handler should be safe
          manager.files = [...manager.files];
        }
      });

      // This should not cause infinite recursion
      manager.addFiles([createFile(100, 'text/plain')]);

      // Should have been called a limited number of times, not infinitely
      expect(callCount).to.be.lessThan(100);
    });
  });

  describe('oldValue in files-changed', () => {
    it('should provide the actual previous value in oldValue', () => {
      manager = new UploadManager({ noAuto: true });

      let capturedOldValue: any[] = [];
      let capturedNewValue: any[] = [];

      manager.addEventListener('files-changed', (e: any) => {
        capturedOldValue = e.detail.oldValue;
        capturedNewValue = e.detail.value;
      });

      // Add first file
      manager.addFiles([createFile(100, 'text/plain')]);
      const firstFile = manager.files[0];

      // Add second file
      manager.addFiles([createFile(100, 'text/plain')]);

      // oldValue should be [firstFile], not a copy of current [secondFile, firstFile]
      expect(capturedOldValue).to.have.lengthOf(1);
      expect(capturedOldValue[0]).to.equal(firstFile);
      expect(capturedNewValue).to.have.lengthOf(2);
    });
  });

  describe('negative number validation', () => {
    it('should reject negative maxFiles', () => {
      expect(() => {
        manager = new UploadManager({
          noAuto: true,
          maxFiles: -5,
        });
      }).to.throw('Invalid maxFiles "-5". Value must be non-negative.');
    });

    it('should reject negative maxConcurrentUploads', () => {
      expect(() => {
        manager = new UploadManager({
          target: '/api/upload',
          noAuto: true,
          maxConcurrentUploads: -1,
        });
      }).to.throw('Invalid maxConcurrentUploads "-1". Value must be positive.');
    });
  });

  describe('file removal during upload-before', () => {
    it('should handle file removal in upload-before handler', () => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 50 });

      manager.addEventListener('upload-before', () => {
        // Remove the file during upload-before (not abort, just remove)
        manager.removeFile(manager.files[0]);
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      // File should be removed
      expect(manager.files.length).to.equal(0);
    });
  });

  describe('division by zero in _setStatus', () => {
    it('should handle elapsed=0 without Infinity', () => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });

      // Create XHR that immediately fires progress with loaded > 0
      (manager as any)._createXhr = () => {
        const xhr = {
          readyState: 0,
          status: 200,
          upload: {
            onprogress: null as any,
            onloadstart: null as any,
          },
          onreadystatechange: null as any,
          ontimeout: null as any,
          onabort: null as any,
          open() {
            this.readyState = 1;
          },
          setRequestHeader() {},
          send() {
            // Immediately fire progress (elapsed will be ~0)
            if (this.upload.onprogress) {
              this.upload.onprogress({ loaded: 50, total: 100 });
            }
            // Complete immediately (synchronous)
            this.readyState = 4;
            if (this.onreadystatechange) {
              this.onreadystatechange();
            }
          },
          abort() {},
        };
        return xhr;
      };

      const successSpy = sinon.spy();
      manager.addEventListener('upload-success', successSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];
      manager.uploadFiles();

      expect(successSpy.calledOnce).to.be.true;
      // Speed should not be Infinity
      expect(Number.isFinite(file.speed)).to.be.true;
    });

    it('should handle loaded=0 without Infinity remaining time', () => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });

      (manager as any)._createXhr = () => {
        const xhr = {
          readyState: 0,
          status: 200,
          upload: {
            onprogress: null as any,
            onloadstart: null as any,
          },
          onreadystatechange: null as any,
          ontimeout: null as any,
          onabort: null as any,
          open() {
            this.readyState = 1;
          },
          setRequestHeader() {},
          send() {
            // Fire progress with loaded=0 (synchronous)
            if (this.upload.onprogress) {
              this.upload.onprogress({ loaded: 0, total: 100 });
            }
          },
          abort() {},
        };
        return xhr;
      };

      const progressSpy = sinon.spy();
      manager.addEventListener('upload-progress', progressSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];
      manager.uploadFiles();

      expect(progressSpy.called).to.be.true;
      // remaining should not be Infinity
      expect(Number.isFinite(file.remaining)).to.be.true;
    });
  });

  describe('XHR cleanup on abort', () => {
    it('should clean up XHR handlers after abort', () => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
      // Use non-sync upload so file doesn't complete immediately
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 500, stepTime: 50 });

      const abortSpy = sinon.spy();
      manager.addEventListener('upload-abort', abortSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];
      manager.uploadFiles();

      // XHR is created synchronously when uploadFiles() is called
      const xhr = file.xhr!;
      manager.abortUpload(file);

      // Handlers should be cleaned up immediately after abort
      expect(xhr.upload.onprogress).to.be.null;
      expect(xhr.onreadystatechange).to.be.null;
      expect(xhr.onabort).to.be.null;
    });
  });

  describe('file.xhr reference cleanup', () => {
    it('should clear file.xhr reference after upload completes', () => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
      (manager as any)._createXhr = xhrCreator({ sync: true });

      const successSpy = sinon.spy();
      manager.addEventListener('upload-success', successSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];
      manager.uploadFiles();

      expect(successSpy.calledOnce).to.be.true;
      // file.xhr is cleared after the event dispatch completes
      expect(file.xhr).to.be.null;
    });
  });

  describe('uploadFiles with external files', () => {
    it('should reject files not in manager.files', () => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 50 });

      const externalFile = createFile(100, 'text/plain') as UploadFile;

      // Trying to upload a file that wasn't added should fail or be ignored
      const startSpy = sinon.spy();
      manager.addEventListener('upload-start', startSpy);

      manager.uploadFiles([externalFile]);

      // Should not have started upload for external file
      expect(startSpy.called).to.be.false;
      expect(manager.files.length).to.equal(0);
    });
  });
});
