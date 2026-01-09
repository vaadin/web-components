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
      const oldFiles = manager.files;

      let eventDetail: { value: UploadFile[]; oldValue: UploadFile[] } | undefined;
      manager.addEventListener('files-changed', (e) => {
        eventDetail = e.detail;
      });
      manager.addFiles([createFile(100, 'text/plain')]);

      expect(eventDetail!.oldValue).to.equal(oldFiles);
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
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 50, stepTime: 10 });
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
      const handler = (e: CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>) => {
        manager.removeEventListener('upload-progress', handler);
        expect(e.detail.file).to.exist;
        expect(e.detail.xhr).to.exist;
        done();
      };
      manager.addEventListener('upload-progress', handler);
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();
    });

    it('should track progress properties on file during upload', (done) => {
      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];

      manager.addEventListener('upload-start', () => {
        // When upload starts, loaded and progress should be initialized
        expect(file.loaded).to.equal(0);
        expect(file.progress).to.equal(0);
        expect(file.indeterminate).to.be.true;
      });

      manager.addEventListener('upload-progress', () => {
        // During upload, loaded and progress should be updated
        expect(file.loaded).to.be.a('number');
        expect(file.progress).to.be.a('number');
        expect(file.progress).to.be.at.least(0);
        expect(file.progress).to.be.at.most(100);
      });

      manager.addEventListener('upload-success', () => {
        // After completion, indeterminate should be false
        expect(file.indeterminate).to.be.false;
        expect(file.uploading).to.be.false;
        done();
      });

      manager.uploadFiles();
    });

    it('should dispatch upload-response event before upload-success', (done) => {
      const events: string[] = [];
      manager.addEventListener('upload-response', (e) => {
        events.push('response');
        expect(e.detail.file).to.exist;
        expect(e.detail.xhr).to.exist;
      });
      manager.addEventListener('upload-success', () => {
        events.push('success');
        expect(events).to.deep.equal(['response', 'success']);
        done();
      });
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

    it('should set file.error to unexpectedServerError on 500 status', (done) => {
      (manager as any).__createXhr = xhrCreator({
        size: 100,
        uploadTime: 10,
        stepTime: 5,
        serverValidation: () => ({ status: 500 }),
      });

      manager.addEventListener('upload-error', (e) => {
        expect(e.detail.file.error).to.equal('unexpectedServerError');
        expect(e.detail.file.complete).to.be.false;
        done();
      });
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();
    });

    it('should set file.error to forbidden on 403 status', (done) => {
      (manager as any).__createXhr = xhrCreator({
        size: 100,
        uploadTime: 10,
        stepTime: 5,
        serverValidation: () => ({ status: 403 }),
      });

      manager.addEventListener('upload-error', (e) => {
        expect(e.detail.file.error).to.equal('forbidden');
        done();
      });
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();
    });

    it('should set file.total during progress', (done) => {
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 30, stepTime: 10 });
      manager.addFiles([createFile(100, 'text/plain')]);

      let called = false;
      manager.addEventListener('upload-progress', (e) => {
        if (!called) {
          called = true;
          expect(e.detail.file.total).to.be.a('number');
          expect(e.detail.file.total).to.be.greaterThan(0);
          done();
        }
      });
      manager.uploadFiles();
    });

    it('should set file.elapsed and file.remaining during progress', (done) => {
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 30, stepTime: 10 });
      manager.addFiles([createFile(100, 'text/plain')]);

      let progressCount = 0;
      let called = false;
      manager.addEventListener('upload-progress', (e) => {
        progressCount += 1;
        // On second progress event, elapsed and remaining should be set
        if (!called && progressCount >= 2 && e.detail.file.progress! > 0 && e.detail.file.progress! < 100) {
          called = true;
          expect(e.detail.file.elapsed).to.be.a('number');
          expect(e.detail.file.remaining).to.be.a('number');
          expect(e.detail.file.speed).to.be.a('number');
          done();
        }
      });
      manager.uploadFiles();
    });

    it('should dispatch files-changed event when upload starts', () => {
      const filesChangedSpy = sinon.spy();
      manager.addFiles([createFile(100, 'text/plain')]);
      manager.addEventListener('files-changed', filesChangedSpy);
      manager.uploadFiles();
      // Should fire at least once for queue state update and once for upload start
      expect(filesChangedSpy.called).to.be.true;
    });

    it('should dispatch files-changed event when upload completes', (done) => {
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 20, stepTime: 10 });
      manager.addFiles([createFile(100, 'text/plain')]);

      const filesChangedSpy = sinon.spy();
      manager.addEventListener('files-changed', filesChangedSpy);
      manager.uploadFiles();

      manager.addEventListener('upload-success', () => {
        expect(filesChangedSpy.called).to.be.true;
        done();
      });
    });

    it('should clear file.status after upload completes', (done) => {
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 20, stepTime: 10 });
      manager.addFiles([createFile(100, 'text/plain')]);
      const file = manager.files[0];

      manager.addEventListener('upload-success', () => {
        expect(file.status).to.equal('');
        done();
      });
      manager.uploadFiles();
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
      (manager as any).__createXhr = () => {
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
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 100, stepTime: 20 });
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

    it('should start next queued upload when one completes', (done) => {
      // Use fast upload time
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 20, stepTime: 5 });

      const files = createFiles(3, 100, 'text/plain');
      manager.addFiles(files);

      // Initially: 2 active, 1 queued
      const initialActive = manager.files.filter((f) => f.uploading && !f.held).length;
      expect(initialActive).to.equal(2);

      let completedCount = 0;
      manager.addEventListener('upload-success', () => {
        completedCount += 1;
        if (completedCount === 3) {
          // All files should be complete
          expect(manager.files.filter((f) => f.complete).length).to.equal(3);
          done();
        }
      });
    });

    it('should start next queued upload when one is aborted', (done) => {
      // Use long upload time so files don't complete immediately
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 500, stepTime: 50 });

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

      // Use fast xhr for next file
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 20, stepTime: 5 });

      // The previously queued file should now be active
      setTimeout(() => {
        const activeNow = manager.files.filter((f) => f.uploading && !f.held).length;
        expect(activeNow).to.equal(2);
        done();
      }, 50);
    });

    it('should not re-queue a file that is already uploading', () => {
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 500, stepTime: 50 });

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
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 500, stepTime: 50 });

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
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 200, stepTime: 50 });
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

    it('should retry upload via retryUpload', (done) => {
      const retrySpy = sinon.spy();
      manager.addEventListener('upload-retry', retrySpy);

      (manager as any).__createXhr = xhrCreator({
        size: 100,
        uploadTime: 10,
        stepTime: 5,
        serverValidation: () => ({ status: 500, statusText: 'Server Error' }),
      });

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      // Wait for upload to fail
      manager.addEventListener('upload-error', () => {
        const successSpy = sinon.spy();
        manager.addEventListener('upload-success', successSpy);
        (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 10, stepTime: 5 });
        manager.retryUpload(manager.files[0]);

        // Wait for retry to succeed
        setTimeout(() => {
          expect(retrySpy.calledOnce).to.be.true;
          expect(successSpy.calledOnce).to.be.true;
          done();
        }, 50);
      });
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
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 10 });
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
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 10 });
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
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 10 });
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
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 50 });
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
      (manager as any).__createXhr = xhrCreator({
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

    it('should not dispatch upload-success when upload-response is prevented', (done) => {
      manager.addEventListener('upload-response', (e) => {
        e.preventDefault();
      });

      const successSpy = sinon.spy();
      manager.addEventListener('upload-success', successSpy);
      manager.addEventListener('upload-error', successSpy);

      manager.addFiles([createFile(100, 'text/plain')]);
      manager.uploadFiles();

      // Wait for upload to complete
      setTimeout(() => {
        expect(successSpy.called).to.be.false;
        done();
      }, 100);
    });
  });

  describe('XHR configuration', () => {
    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
      (manager as any).__createXhr = xhrCreator({ size: 100, uploadTime: 10 });
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
});
