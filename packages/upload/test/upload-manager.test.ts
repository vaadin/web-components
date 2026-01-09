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

    it('should include current files in files-changed event', () => {
      manager.addFiles([createFile(100, 'text/plain')]);

      let eventDetail: { value: UploadFile[] } | undefined;
      manager.addEventListener('files-changed', (e) => {
        eventDetail = e.detail;
      });
      manager.addFiles([createFile(100, 'text/plain')]);

      // value should have the new length (2 files)
      expect(eventDetail!.value).to.have.lengthOf(2);
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

    it('should set file.loaded during progress', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });

      const progressSpy = sinon.spy();
      manager.addEventListener('upload-progress', progressSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(progressSpy.called).to.be.true;
      // loaded should be set to the number of bytes transferred
      expect(progressSpy.lastCall.args[0].detail.file.loaded).to.be.a('number');
    });

    it('should set file.indeterminate during upload', () => {
      (manager as any)._createXhr = xhrCreator({ sync: true });

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];

      const successSpy = sinon.spy();
      manager.addEventListener('upload-success', successSpy);

      manager.uploadFiles();

      expect(successSpy.calledOnce).to.be.true;
      // After completion, indeterminate should be false
      expect(file.indeterminate).to.be.false;
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

    it('should clamp progress to 0-100 range when loaded exceeds total', () => {
      // This can happen with compression where uploaded bytes exceed original file size
      let progressCallback: ((e: { loaded: number; total: number }) => void) | null = null;

      (manager as any)._createXhr = () => {
        const xhr = {
          readyState: 0,
          status: 0,
          upload: {
            onprogress: null as any,
            onloadstart: null as any,
          },
          onreadystatechange: null as any,
          onabort: null as any,
          open() {
            this.readyState = 1;
          },
          setRequestHeader() {},
          send() {
            progressCallback = xhr.upload.onprogress;
            if (xhr.upload.onloadstart) {
              xhr.upload.onloadstart();
            }
          },
          abort() {},
        };
        return xhr;
      };

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      // Simulate loaded > total (can happen with compression)
      progressCallback!({ loaded: 150, total: 100 });
      expect(manager.files[0].progress).to.equal(100);

      // Simulate negative loaded (edge case)
      progressCallback!({ loaded: -10, total: 100 });
      expect(manager.files[0].progress).to.equal(0);
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

    it('should reset file.stalled to false when progress resumes', async () => {
      let progressCallback: ((e: { loaded: number; total: number }) => void) | null = null;

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
          open() {
            this.readyState = 1;
          },
          setRequestHeader() {},
          send() {
            progressCallback = this.upload.onprogress;
            if (this.upload.onloadstart) {
              this.upload.onloadstart();
            }
            // Send initial progress
            if (this.upload.onprogress) {
              this.upload.onprogress({ loaded: 10, total: 100 });
            }
          },
          abort() {},
        };
        return xhr;
      };

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];

      manager.uploadFiles();

      // Initially not stalled
      expect(file.stalled).to.be.false;

      // Advance time to trigger stalled
      await clock.tickAsync(2100);
      expect(file.stalled).to.be.true;

      // Send more progress - should reset stalled
      progressCallback!({ loaded: 50, total: 100 });
      expect(file.stalled).to.be.false;
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

    it('should include file in FormData for multipart uploads', () => {
      manager.uploadFormat = 'multipart';
      let formData: FormData | undefined;
      manager.addEventListener('upload-request', (e) => {
        formData = e.detail.formData;
      });
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 10 });

      const file = createFile(100, 'text/plain');
      file.name = 'test.txt';
      manager.addFiles([file]);
      manager.uploadFiles();

      expect(formData).to.be.instanceOf(FormData);
      // FormData.get returns the file that was appended
      expect(formData!.get('file')).to.be.instanceOf(Blob);
    });

    it('should use custom formDataName in multipart uploads', () => {
      manager.uploadFormat = 'multipart';
      manager.formDataName = 'attachment';
      let formData: FormData | undefined;
      manager.addEventListener('upload-request', (e) => {
        formData = e.detail.formData;
      });
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 10 });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(formData).to.be.instanceOf(FormData);
      expect(formData!.get('attachment')).to.be.instanceOf(Blob);
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

    it('should dispatch files-changed event when file becomes stalled', async () => {
      let progressCallback: ((e: { loaded: number; total: number }) => void) | null = null;

      (manager as any)._createXhr = () => {
        const xhr = {
          readyState: 0,
          status: 0,
          upload: {
            onprogress: null as any,
            onloadstart: null as any,
          },
          onreadystatechange: null as any,
          onabort: null as any,
          open() {
            this.readyState = 1;
          },
          setRequestHeader() {},
          send() {
            progressCallback = this.upload.onprogress;
            if (this.upload.onloadstart) {
              this.upload.onloadstart();
            }
            // Send progress to start stalled timer (progress < 100)
            if (progressCallback) {
              progressCallback({ loaded: 10, total: 100 });
            }
          },
          abort() {},
        };
        return xhr;
      };

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];

      const filesChangedSpy = sinon.spy();
      manager.addEventListener('files-changed', filesChangedSpy);

      manager.uploadFiles();

      // Reset spy after upload starts
      filesChangedSpy.resetHistory();

      // Advance past the stalled timeout (2 seconds)
      await clock.tickAsync(2100);

      // files-changed should have been dispatched when stalled was set
      expect(filesChangedSpy.called).to.be.true;
      expect(file.stalled).to.be.true;
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

    it('should set file.uploading to false when upload-request is prevented', () => {
      manager.addEventListener('upload-request', (e) => {
        e.preventDefault();
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];
      manager.uploadFiles();

      expect(file.uploading).to.be.false;
      expect(file.indeterminate).to.be.false;
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

    it('should dispatch upload-error event on timeout', async () => {
      const errorSpy = sinon.spy();
      manager.addEventListener('upload-error', errorSpy);

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
            setTimeout(() => {
              if (this.ontimeout) {
                this.ontimeout();
              }
            }, 1000);
          },
          abort() {},
        };
        return xhr;
      };

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      await clock.tickAsync(1100);

      expect(errorSpy.calledOnce).to.be.true;
      expect(errorSpy.firstCall.args[0].detail.file.error).to.equal('timeout');
    });

    it('should set file.uploading to false on timeout', async () => {
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
            setTimeout(() => {
              if (this.ontimeout) {
                this.ontimeout();
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

      await clock.tickAsync(1100);

      expect(file.uploading).to.be.false;
      expect(file.indeterminate).to.be.false;
    });
  });

  describe('serverUnavailable error', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
    });

    it('should set file.error to serverUnavailable on status 0', () => {
      (manager as any)._createXhr = xhrCreator({
        sync: true,
        serverValidation: () => ({ status: 0 }),
      });

      const errorSpy = sinon.spy();
      manager.addEventListener('upload-error', errorSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(errorSpy.calledOnce).to.be.true;
      expect(errorSpy.firstCall.args[0].detail.file.error).to.equal('serverUnavailable');
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
      expect(capturedXhr.upload.onloadstart).to.be.null;
      expect(capturedXhr.onreadystatechange).to.be.null;
      expect(capturedXhr.onabort).to.be.null;
      expect(capturedXhr.ontimeout).to.be.null;
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

    it('should cleanup XHR handlers when xhr.send() throws', () => {
      const mockXhr = {
        readyState: 0,
        status: 0,
        upload: {
          onprogress: null as any,
          onloadstart: null as any,
        },
        onreadystatechange: null as any,
        onabort: null as any,
        ontimeout: null as any,
        open() {
          this.readyState = 1;
        },
        setRequestHeader() {},
        send() {
          throw new Error('Network error');
        },
        abort() {},
      };

      (manager as any)._createXhr = () => mockXhr;

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      // XHR handlers should be cleaned up to prevent memory leaks
      expect(mockXhr.upload.onprogress).to.be.null;
      expect(mockXhr.upload.onloadstart).to.be.null;
      expect(mockXhr.onreadystatechange).to.be.null;
      expect(mockXhr.onabort).to.be.null;
      expect(mockXhr.ontimeout).to.be.null;
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

    it('should not call xhr.open() when file is removed during upload-before event', () => {
      let openCalled = false;

      manager.addEventListener('upload-before', () => {
        // Remove file during upload-before - before open() is called
        manager.removeFile(manager.files[0]);
      });

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
          ontimeout: null,
          open() {
            openCalled = true;
            this.readyState = 1;
          },
          setRequestHeader() {},
          send() {},
          abort() {},
        };
      };

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      // xhr.open() should NOT have been called because file was removed
      expect(openCalled).to.be.false;
    });
  });

  describe('abort during upload-request event', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
    });

    it('should handle abort called during upload-request event', () => {
      let uploadRequestFired = false;

      manager.addEventListener('upload-request', () => {
        uploadRequestFired = true;
        // Abort during upload-request - XHR is open but not sent yet
        manager.abortUpload(manager.files[0]);
      });

      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 50 });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(uploadRequestFired).to.be.true;
      // File should be removed
      expect(manager.files).to.have.lengthOf(0);
    });

    it('should handle removeFile called during upload-request event', () => {
      let uploadRequestFired = false;

      manager.addEventListener('upload-request', () => {
        uploadRequestFired = true;
        // Remove file during upload-request
        manager.removeFile(manager.files[0]);
      });

      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 50 });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      expect(uploadRequestFired).to.be.true;
      // File should be removed
      expect(manager.files).to.have.lengthOf(0);
    });

    it('should not call xhr.send() when file is removed during upload-request event', () => {
      let sendCalled = false;

      manager.addEventListener('upload-request', () => {
        // Remove file during upload-request - before send() is called
        manager.removeFile(manager.files[0]);
      });

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
          ontimeout: null,
          open() {
            this.readyState = 1;
          },
          setRequestHeader() {},
          send() {
            sendCalled = true;
          },
          abort() {
            // Simulate real XHR: onabort only fires if request was actually sent
            // Since send() wasn't called, onabort should NOT be triggered
          },
        };
      };

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      // xhr.send() should NOT have been called because file was removed
      expect(sendCalled).to.be.false;
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

  describe('files setter validation', () => {
    it('should reject files exceeding maxFiles when set via setter', () => {
      manager = new UploadManager({ noAuto: true, maxFiles: 2 });

      const rejectSpy = sinon.spy();
      manager.addEventListener('file-reject', rejectSpy);

      // Try to set 3 files when maxFiles is 2
      manager.files = createFiles(3, 100, 'text/plain') as UploadFile[];

      expect(manager.files).to.have.lengthOf(2);
      expect(rejectSpy.calledOnce).to.be.true;
      expect(rejectSpy.firstCall.args[0].detail.error).to.equal('tooManyFiles');
    });

    it('should reject oversized files when set via setter', () => {
      manager = new UploadManager({ noAuto: true, maxFileSize: 50 });

      const rejectSpy = sinon.spy();
      manager.addEventListener('file-reject', rejectSpy);

      // Try to set a file larger than maxFileSize
      manager.files = [createFile(100, 'text/plain')] as UploadFile[];

      expect(manager.files).to.have.lengthOf(0);
      expect(rejectSpy.calledOnce).to.be.true;
      expect(rejectSpy.firstCall.args[0].detail.error).to.equal('fileIsTooBig');
    });

    it('should reject files with wrong type when set via setter', () => {
      manager = new UploadManager({ noAuto: true, accept: 'image/*' });

      const rejectSpy = sinon.spy();
      manager.addEventListener('file-reject', rejectSpy);

      // Try to set a text file when only images are accepted
      manager.files = [createFile(100, 'text/plain')] as UploadFile[];

      expect(manager.files).to.have.lengthOf(0);
      expect(rejectSpy.calledOnce).to.be.true;
      expect(rejectSpy.firstCall.args[0].detail.error).to.equal('incorrectFileType');
    });

    it('should allow existing files to remain when re-setting', () => {
      manager = new UploadManager({ noAuto: true, maxFiles: 2 });

      // Add 2 files normally
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      expect(manager.files).to.have.lengthOf(2);

      const existingFiles = manager.files;

      // Re-set with the same files - should not reject
      const rejectSpy = sinon.spy();
      manager.addEventListener('file-reject', rejectSpy);
      manager.files = existingFiles;

      expect(manager.files).to.have.lengthOf(2);
      expect(rejectSpy.called).to.be.false;
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

  describe('property setter validation', () => {
    beforeEach(() => {
      manager = new UploadManager({ noAuto: true });
    });

    it('should reject invalid method via setter', () => {
      expect(() => {
        (manager as any).method = 'DELETE';
      }).to.throw('Invalid method "DELETE". Only POST and PUT are allowed.');
    });

    it('should accept valid method via setter', () => {
      manager.method = 'PUT';
      expect(manager.method).to.equal('PUT');
      manager.method = 'POST';
      expect(manager.method).to.equal('POST');
    });

    it('should reject negative maxFiles via setter', () => {
      expect(() => {
        manager.maxFiles = -1;
      }).to.throw('Invalid maxFiles "-1". Value must be non-negative.');
    });

    it('should accept valid maxFiles via setter', () => {
      manager.maxFiles = 10;
      expect(manager.maxFiles).to.equal(10);
      manager.maxFiles = 0;
      expect(manager.maxFiles).to.equal(0);
    });

    it('should reject non-positive maxConcurrentUploads via setter', () => {
      expect(() => {
        manager.maxConcurrentUploads = 0;
      }).to.throw('Invalid maxConcurrentUploads "0". Value must be positive.');
      expect(() => {
        manager.maxConcurrentUploads = -1;
      }).to.throw('Invalid maxConcurrentUploads "-1". Value must be positive.');
    });

    it('should accept valid maxConcurrentUploads via setter', () => {
      manager.maxConcurrentUploads = 5;
      expect(manager.maxConcurrentUploads).to.equal(5);
    });

    it('should not allow external mutation of headers object', () => {
      const headers: Record<string, string> = { 'X-Token': 'secret' };
      manager.headers = headers;

      // Mutate the original object
      headers['X-Malicious'] = 'pwned';

      // Manager's headers should not be affected
      expect((manager.headers as Record<string, string>)['X-Malicious']).to.be.undefined;
      expect(manager.headers['X-Token']).to.equal('secret');
    });

    it('should not allow external mutation of files array', () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      expect(manager.files).to.have.lengthOf(1);

      // Get the files array and try to mutate it
      const files = manager.files;
      files.push(createFile(100, 'text/plain') as any);

      // Manager's internal files should not be affected
      expect(manager.files).to.have.lengthOf(1);
    });

    it('should update maxFilesReached when maxFiles is changed via setter', () => {
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.addFiles([createFile(100, 'text/plain')]);

      expect(manager.maxFilesReached).to.be.false;

      manager.maxFiles = 2;
      expect(manager.maxFilesReached).to.be.true;

      manager.maxFiles = 10;
      expect(manager.maxFilesReached).to.be.false;
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

  describe('removeFile should abort active uploads', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
    });

    it('should abort XHR when removing an actively uploading file', () => {
      let abortCalled = false;
      (manager as any)._createXhr = () => {
        const xhr = {
          readyState: 0,
          status: 0,
          upload: {
            onprogress: null as any,
            onloadstart: null as any,
          },
          onreadystatechange: null as any,
          onabort: null as any,
          open() {
            this.readyState = 1;
          },
          setRequestHeader() {},
          send() {
            if (this.upload.onloadstart) {
              this.upload.onloadstart();
            }
          },
          abort() {
            abortCalled = true;
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

      // File is actively uploading (not held)
      expect(file.uploading).to.be.true;
      expect(file.held).to.be.false;

      // Remove the file directly (not via abortUpload)
      manager.removeFile(file);

      // XHR should have been aborted
      expect(abortCalled).to.be.true;
    });
  });

  describe('file.held flag in queue', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
    });

    it('should set file.held to true when queuing for upload', () => {
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 500, stepTime: 50 });

      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];

      // Before uploadFiles, file.held should be true (set by _addFile)
      expect(file.held).to.be.true;

      // Queue the file
      manager.uploadFiles();

      // File.held should be set to true initially in _queueFileUpload, then false when upload actually starts
      // Since upload starts immediately (maxConcurrentUploads > 0), held becomes false
      expect(file.held).to.be.false;
    });

    it('should keep file.held true for queued files waiting to upload', () => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
        maxConcurrentUploads: 1,
      });
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 500, stepTime: 50 });

      const files = createFiles(3, 100, 'text/plain');
      manager.addFiles(files);
      manager.uploadFiles();

      // First file is actively uploading (held = false)
      expect(manager.files[0].held).to.be.false;
      expect(manager.files[0].uploading).to.be.true;

      // Second and third files are queued (held = true)
      expect(manager.files[1].held).to.be.true;
      expect(manager.files[1].uploading).to.be.true;
      expect(manager.files[2].held).to.be.true;
      expect(manager.files[2].uploading).to.be.true;
    });

    it('should set file.held to true in _queueFileUpload before processing queue', () => {
      // This test specifically checks that _queueFileUpload sets held = true
      // When maxConcurrentUploads is reached, the file stays in queue with held = true
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
        maxConcurrentUploads: 1,
      });

      // XHR that never completes
      (manager as any)._createXhr = () => {
        const xhr = {
          readyState: 0,
          status: 0,
          upload: {
            onprogress: null as any,
            onloadstart: null as any,
          },
          onreadystatechange: null as any,
          onabort: null as any,
          open() {
            this.readyState = 1;
          },
          setRequestHeader() {},
          send() {
            if (xhr.upload.onloadstart) {
              xhr.upload.onloadstart();
            }
          },
          abort() {},
        };
        return xhr;
      };

      // Add first file - it will start uploading
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      // Add second file - it will be queued
      const file2 = createFile(100, 'text/plain');
      manager.addFiles([file2]);
      const queuedFile = manager.files[0]; // newest file is first

      // The file should have held = true from _addFile
      expect(queuedFile.held).to.be.true;

      // Queue the file for upload
      manager.uploadFiles([queuedFile]);

      // Since maxConcurrentUploads is reached, file stays in queue with held = true
      // The held flag should still be true (set in _queueFileUpload)
      expect(queuedFile.held).to.be.true;
      expect(queuedFile.uploading).to.be.true;
    });
  });

  describe('files-changed notifications', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
    });

    it('should dispatch files-changed when file is queued via _queueFileUpload', () => {
      // This test verifies that _queueFileUpload dispatches files-changed
      // We need to reset the spy after addFiles to isolate the _queueFileUpload call
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
        maxConcurrentUploads: 1,
      });

      // XHR that never completes - ensures no other files-changed events fire
      (manager as any)._createXhr = () => {
        const xhr = {
          readyState: 0,
          status: 0,
          upload: {
            onprogress: null as any,
            onloadstart: null as any,
          },
          onreadystatechange: null as any,
          onabort: null as any,
          open() {
            this.readyState = 1;
          },
          setRequestHeader() {},
          send() {
            // Don't call onloadstart - that would trigger files-changed
          },
          abort() {},
        };
        return xhr;
      };

      manager.addFiles([createFile(100, 'text/plain')]);

      const filesChangedSpy = sinon.spy();
      manager.addEventListener('files-changed', filesChangedSpy);

      // This calls _queueFileUpload which should dispatch files-changed
      manager.uploadFiles();

      expect(filesChangedSpy.called).to.be.true;
    });

    it('should dispatch files-changed on upload progress', () => {
      // This test verifies that onprogress dispatches files-changed
      let progressCallback: ((e: { loaded: number; total: number }) => void) | null = null;

      (manager as any)._createXhr = () => {
        const xhr = {
          readyState: 0,
          status: 0,
          upload: {
            onprogress: null as any,
            onloadstart: null as any,
          },
          onreadystatechange: null as any,
          onabort: null as any,
          open() {
            this.readyState = 1;
          },
          setRequestHeader() {},
          send() {
            progressCallback = xhr.upload.onprogress;
            if (xhr.upload.onloadstart) {
              xhr.upload.onloadstart();
            }
          },
          abort() {},
        };
        return xhr;
      };

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      const filesChangedSpy = sinon.spy();
      manager.addEventListener('files-changed', filesChangedSpy);

      // Manually trigger progress - this should dispatch files-changed
      progressCallback!({ loaded: 50, total: 100 });

      expect(filesChangedSpy.called).to.be.true;
    });

    it('should dispatch files-changed on upload completion via onreadystatechange', () => {
      // This test verifies that onreadystatechange dispatches files-changed after completion
      let readystateCallback: (() => void) | null = null;

      (manager as any)._createXhr = () => {
        const xhr = {
          readyState: 0,
          status: 200,
          upload: {
            onprogress: null as any,
            onloadstart: null as any,
          },
          onreadystatechange: null as any,
          onabort: null as any,
          open() {
            this.readyState = 1;
          },
          setRequestHeader() {},
          send() {
            readystateCallback = xhr.onreadystatechange;
            if (xhr.upload.onloadstart) {
              xhr.upload.onloadstart();
            }
          },
          abort() {},
        };
        return xhr;
      };

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      const filesChangedSpy = sinon.spy();
      manager.addEventListener('files-changed', filesChangedSpy);

      // Complete the upload
      const xhr = manager.files[0].xhr as any;
      xhr.readyState = 4;
      readystateCallback!();

      expect(filesChangedSpy.called).to.be.true;
    });

    it('should dispatch files-changed on upload error via onreadystatechange', () => {
      let readystateCallback: (() => void) | null = null;

      (manager as any)._createXhr = () => {
        const xhr = {
          readyState: 0,
          status: 500,
          upload: {
            onprogress: null as any,
            onloadstart: null as any,
          },
          onreadystatechange: null as any,
          onabort: null as any,
          open() {
            this.readyState = 1;
          },
          setRequestHeader() {},
          send() {
            readystateCallback = xhr.onreadystatechange;
            if (xhr.upload.onloadstart) {
              xhr.upload.onloadstart();
            }
          },
          abort() {},
        };
        return xhr;
      };

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      const filesChangedSpy = sinon.spy();
      manager.addEventListener('files-changed', filesChangedSpy);

      // Complete with error
      const xhr = manager.files[0].xhr as any;
      xhr.readyState = 4;
      readystateCallback!();

      expect(filesChangedSpy.called).to.be.true;
    });

    it('should dispatch files-changed on timeout via ontimeout', async () => {
      const clock = sinon.useFakeTimers();

      try {
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
              if (xhr.upload.onloadstart) {
                xhr.upload.onloadstart();
              }
              // Simulate timeout after 1 second
              setTimeout(() => {
                if (xhr.ontimeout) {
                  xhr.ontimeout();
                }
              }, 1000);
            },
            abort() {},
          };
          return xhr;
        };

        manager.addFiles([createFile(100, 'text/plain')]);
        manager.uploadFiles();

        const filesChangedSpy = sinon.spy();
        manager.addEventListener('files-changed', filesChangedSpy);

        // Advance past the timeout
        await clock.tickAsync(1100);

        expect(filesChangedSpy.called).to.be.true;
      } finally {
        clock.restore();
      }
    });

    it('should not dispatch double upload-error when timeout followed by readystatechange', () => {
      const errorSpy = sinon.spy();
      manager.addEventListener('upload-error', errorSpy);

      let capturedXhr: any;
      let savedOnReadyStateChange: any;

      (manager as any)._createXhr = () => {
        capturedXhr = {
          readyState: 0,
          status: 0,
          timeout: 0,
          upload: {
            onprogress: null as any,
            onloadstart: null as any,
          },
          _onreadystatechange: null as any,
          get onreadystatechange() {
            return this._onreadystatechange;
          },
          set onreadystatechange(fn: any) {
            this._onreadystatechange = fn;
            // Save reference before cleanup nullifies it
            if (fn) {
              savedOnReadyStateChange = fn;
            }
          },
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
          },
          abort() {},
        };
        return capturedXhr;
      };

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      // Simulate timeout firing first
      capturedXhr.ontimeout();

      // Simulate readystatechange firing after (which can happen in some browsers)
      // Use saved reference since cleanup nullified the property
      capturedXhr.readyState = 4;
      capturedXhr.status = 0;
      savedOnReadyStateChange();

      // Should only have one upload-error event, not two
      expect(errorSpy.callCount).to.equal(1);
    });

    it('should dispatch files-changed when upload-before is prevented', () => {
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 50 });

      manager.addEventListener('upload-before', (e) => {
        e.preventDefault();
      });

      manager.addFiles([createFile(100, 'text/plain')]);

      const filesChangedSpy = sinon.spy();
      manager.addEventListener('files-changed', filesChangedSpy);

      manager.uploadFiles();

      expect(filesChangedSpy.called).to.be.true;
    });

    it('should dispatch files-changed when upload-request is prevented', () => {
      (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 50 });

      manager.addEventListener('upload-request', (e) => {
        e.preventDefault();
      });

      manager.addFiles([createFile(100, 'text/plain')]);

      const filesChangedSpy = sinon.spy();
      manager.addEventListener('files-changed', filesChangedSpy);

      manager.uploadFiles();

      expect(filesChangedSpy.called).to.be.true;
    });

    it('should dispatch files-changed when xhr.send throws', () => {
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

      const filesChangedSpy = sinon.spy();
      manager.addEventListener('files-changed', filesChangedSpy);

      manager.uploadFiles();

      expect(filesChangedSpy.called).to.be.true;
    });
  });

  describe('edge cases', () => {
    describe('maxConcurrentUploads changed mid-upload', () => {
      it('should respect new limit when decreased during uploads', async () => {
        const clock = sinon.useFakeTimers();

        try {
          manager = new UploadManager({
            target: '/api/upload',
            noAuto: true,
            maxConcurrentUploads: 3,
          });

          let activeUploads = 0;

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
                activeUploads++;
                if (xhr.upload.onloadstart) {
                  xhr.upload.onloadstart();
                }
                // Complete after 100ms
                setTimeout(() => {
                  activeUploads--;
                  xhr.readyState = 4;
                  if (xhr.onreadystatechange) {
                    xhr.onreadystatechange();
                  }
                }, 100);
              },
              abort() {},
            };
            return xhr;
          };

          // Add 5 files
          manager.addFiles(createFiles(5, 100, 'text/plain'));
          manager.uploadFiles();

          // Let first batch start (3 concurrent)
          await clock.tickAsync(10);
          expect(activeUploads).to.equal(3);

          // Decrease limit mid-upload
          manager.maxConcurrentUploads = 1;

          // Complete first batch
          await clock.tickAsync(100);

          // Next uploads should respect new limit
          await clock.tickAsync(10);
          // Should only start 1 more, not 3
          expect(activeUploads).to.be.at.most(1);

          // Complete remaining
          await clock.tickAsync(200);
        } finally {
          clock.restore();
        }
      });

      it('should use new limit when uploads complete after limit is increased', async () => {
        const clock = sinon.useFakeTimers();

        try {
          manager = new UploadManager({
            target: '/api/upload',
            noAuto: true,
            maxConcurrentUploads: 1,
          });

          let activeUploads = 0;
          let maxConcurrentSeen = 0;

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
                activeUploads++;
                maxConcurrentSeen = Math.max(maxConcurrentSeen, activeUploads);
                if (xhr.upload.onloadstart) {
                  xhr.upload.onloadstart();
                }
                setTimeout(() => {
                  activeUploads--;
                  xhr.readyState = 4;
                  if (xhr.onreadystatechange) {
                    xhr.onreadystatechange();
                  }
                }, 100);
              },
              abort() {},
            };
            return xhr;
          };

          manager.addFiles(createFiles(4, 100, 'text/plain'));
          manager.uploadFiles();

          await clock.tickAsync(10);
          expect(activeUploads).to.equal(1);

          // Increase limit before first upload completes
          manager.maxConcurrentUploads = 3;

          // When first upload completes, queue processing should use new limit
          await clock.tickAsync(100);

          // After first completes, should start up to 3 more (but only 3 files left)
          await clock.tickAsync(10);
          expect(maxConcurrentSeen).to.be.at.most(3);

          await clock.tickAsync(500);
        } finally {
          clock.restore();
        }
      });
    });

    describe('file removed while in queue', () => {
      it('should not upload file that was removed from queue before upload started', async () => {
        const clock = sinon.useFakeTimers();

        try {
          manager = new UploadManager({
            target: '/api/upload',
            noAuto: true,
            maxConcurrentUploads: 1,
          });

          const uploadedFiles: string[] = [];

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
                if (xhr.upload.onloadstart) {
                  xhr.upload.onloadstart();
                }
                setTimeout(() => {
                  xhr.readyState = 4;
                  if (xhr.onreadystatechange) {
                    xhr.onreadystatechange();
                  }
                }, 100);
              },
              abort() {},
            };
            return xhr;
          };

          manager.addEventListener('upload-start', (e) => {
            uploadedFiles.push((e as CustomEvent).detail.file.name);
          });

          // Add 3 files
          const files = createFiles(3, 100, 'text/plain');
          manager.addFiles(files);

          // Start uploads - only first should start due to maxConcurrentUploads=1
          manager.uploadFiles();
          await clock.tickAsync(10);

          // Remove second file while it's still in queue
          const secondFile = manager.files[1];
          manager.removeFile(secondFile);

          // Complete all uploads
          await clock.tickAsync(500);

          // Should only have uploaded 2 files (first and third)
          expect(uploadedFiles).to.have.lengthOf(2);
          expect(uploadedFiles).to.not.include(secondFile.name);
        } finally {
          clock.restore();
        }
      });
    });

    describe('upload-before prevention and retry', () => {
      it('should allow upload on retry after upload-before was prevented', () => {
        manager = new UploadManager({
          target: '/api/upload',
          noAuto: true,
        });

        let preventCount = 0;
        let uploadStarted = false;

        manager.addEventListener('upload-before', (e) => {
          preventCount++;
          if (preventCount === 1) {
            // Prevent first attempt
            e.preventDefault();
          }
          // Allow second attempt (retry)
        });

        manager.addEventListener('upload-start', () => {
          uploadStarted = true;
        });

        (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 10, sync: true });

        manager.addFiles([createFile(100, 'text/plain')]);
        const file = manager.files[0];

        // First attempt - should be prevented
        manager.uploadFiles();
        expect(preventCount).to.equal(1);
        expect(uploadStarted).to.be.false;
        expect(file.held).to.be.true;

        // Retry - should succeed
        manager.retryUpload(file);
        expect(preventCount).to.equal(2);
        expect(uploadStarted).to.be.true;
      });

      it('should maintain file state correctly after prevention', () => {
        manager = new UploadManager({
          target: '/api/upload',
          noAuto: true,
        });

        manager.addEventListener('upload-before', (e) => {
          e.preventDefault();
        });

        (manager as any)._createXhr = xhrCreator({ size: 100, uploadTime: 10 });

        manager.addFiles([createFile(100, 'text/plain')]);
        const file = manager.files[0];

        manager.uploadFiles();

        // File should be held after prevention
        expect(file.held).to.be.true;
        expect(file.uploading).to.be.false;
        expect(file.indeterminate).to.be.false;
        // File should still be in the list
        expect(manager.files).to.include(file);
      });
    });

    describe('timer throttling simulation', () => {
      it('should clear previous stalled timeout when new progress arrives', async () => {
        const clock = sinon.useFakeTimers();

        try {
          manager = new UploadManager({
            target: '/api/upload',
            noAuto: true,
          });

          let progressCallback: any;
          const xhr = {
            readyState: 0,
            status: 0,
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
              progressCallback = this.upload.onprogress;
              if (this.upload.onloadstart) {
                this.upload.onloadstart();
              }
            },
            abort() {},
          };

          (manager as any)._createXhr = () => xhr;

          manager.addFiles([createFile(100, 'text/plain')]);
          const file = manager.files[0];
          manager.uploadFiles();

          // Initial progress at t=0
          progressCallback({ loaded: 10, total: 100 });

          // Wait 1900ms (just before stalled timeout at 2000ms)
          await clock.tickAsync(1900);
          expect(file.stalled).to.be.false;

          // More progress at t=1900 - this should clear the previous stalled timeout
          progressCallback({ loaded: 50, total: 100 });

          // Wait another 1900ms (t=3800) - original timeout would have fired at t=2000
          // but new timeout won't fire until t=3900
          await clock.tickAsync(1900);
          expect(file.stalled).to.be.false;

          // Complete the upload before stalled fires
          xhr.readyState = 4;
          xhr.status = 200;
          xhr.onreadystatechange();

          expect(file.stalled).to.be.false;
        } finally {
          clock.restore();
        }
      });

      it('should correctly mark as stalled when no progress for extended time', async () => {
        const clock = sinon.useFakeTimers();

        try {
          manager = new UploadManager({
            target: '/api/upload',
            noAuto: true,
          });

          let progressCallback: any;

          (manager as any)._createXhr = () => ({
            readyState: 0,
            status: 0,
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
              progressCallback = this.upload.onprogress;
              if (this.upload.onloadstart) {
                this.upload.onloadstart();
              }
            },
            abort() {},
          });

          manager.addFiles([createFile(100, 'text/plain')]);
          const file = manager.files[0];
          manager.uploadFiles();

          // Initial progress
          progressCallback({ loaded: 10, total: 100 });
          expect(file.stalled).to.be.false;

          // Wait for stalled timeout (2000ms)
          await clock.tickAsync(2100);

          expect(file.stalled).to.be.true;
        } finally {
          clock.restore();
        }
      });
    });

    describe('rapid queue manipulation', () => {
      it('should handle adding files while uploads are completing', async () => {
        const clock = sinon.useFakeTimers();

        try {
          manager = new UploadManager({
            target: '/api/upload',
            noAuto: true,
            maxConcurrentUploads: 2,
          });

          const completedFiles: string[] = [];

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
                if (xhr.upload.onloadstart) {
                  xhr.upload.onloadstart();
                }
                setTimeout(() => {
                  xhr.readyState = 4;
                  if (xhr.onreadystatechange) {
                    xhr.onreadystatechange();
                  }
                }, 50);
              },
              abort() {},
            };
            return xhr;
          };

          manager.addEventListener('upload-success', (e) => {
            completedFiles.push((e as CustomEvent).detail.file.name);
          });

          // Add initial files
          manager.addFiles(createFiles(2, 100, 'text/plain'));
          manager.uploadFiles();

          // Add more files while first batch is uploading
          await clock.tickAsync(25);
          manager.addFiles(createFiles(2, 100, 'text/plain'));
          manager.uploadFiles();

          // Complete all
          await clock.tickAsync(200);

          expect(completedFiles).to.have.lengthOf(4);
          expect(manager.files.filter((f) => f.complete)).to.have.lengthOf(4);
        } finally {
          clock.restore();
        }
      });
    });
  });
});
