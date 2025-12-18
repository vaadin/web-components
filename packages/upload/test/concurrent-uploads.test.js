import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload.js';
import { createFiles, xhrCreator } from './helpers.js';

function assertFileUploading(file) {
  expect(file.uploading).to.be.true;
  expect(file.held).to.be.false;
}

function assertFileNotStarted(file) {
  expect(file.uploading).to.not.be.true;
  expect(file.held).to.be.true;
  expect(file.status).to.equal('Queued');
}

function assertFileQueued(file) {
  expect(file.uploading).to.be.true;
  expect(file.held).to.be.true;
  expect(file.status).to.equal('Queued');
}

function assertFileSucceeded(file) {
  expect(file.error).to.be.not.ok;
  expect(file.complete).to.be.true;
  expect(file.uploading).to.be.false;
}

function assertFileFailed(file) {
  expect(file.error).to.be.ok;
  expect(file.uploading).to.be.false;
}

describe('concurrent uploads', () => {
  let upload;

  beforeEach(async () => {
    upload = fixtureSync(`<vaadin-upload></vaadin-upload>`);
    upload.target = 'https://foo.com/bar';
    await nextRender();
  });

  describe('maxConcurrentUploads property', () => {
    it('should have default value of 3', () => {
      expect(upload.maxConcurrentUploads).to.equal(3);
    });

    it('should accept custom value', () => {
      upload.maxConcurrentUploads = 5;
      expect(upload.maxConcurrentUploads).to.equal(5);
    });

    it('should accept Infinity for unlimited uploads', () => {
      upload.maxConcurrentUploads = Infinity;
      expect(upload.maxConcurrentUploads).to.equal(Infinity);
    });
  });

  describe('upload queue management', () => {
    let clock;

    beforeEach(() => {
      upload._createXhr = xhrCreator({ size: 100, uploadTime: 200, stepTime: 50 });
      clock = sinon.useFakeTimers({
        shouldClearNativeTimers: true,
      });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should show queued status for files in queue', async () => {
      const files = createFiles(5, 100, 'application/json');
      upload.maxConcurrentUploads = 2;

      upload.uploadFiles(files);
      await clock.tickAsync(10);

      // First 2 files should be uploading
      files.slice(0, 2).forEach((file) => {
        expect(file.status).to.not.equal('Queued');
      });

      // Remaining files should be queued
      files.slice(2, -1).forEach((file) => {
        expect(file.status).to.equal('Queued');
      });
    });

    it('should process queue as uploads complete', async () => {
      const files = createFiles(5, 100, 'application/json');
      upload.maxConcurrentUploads = 2;

      upload.uploadFiles(files);
      await clock.tickAsync(10);

      files.slice(0, 2).forEach(assertFileUploading);
      files.slice(2, -1).forEach(assertFileQueued);
      // Wait for first uploads to complete
      await clock.tickAsync(250);

      files.slice(2, 4).forEach(assertFileUploading);
      files.slice(4, -1).forEach(assertFileQueued);
    });

    it('should handle all uploads completing', async () => {
      const files = createFiles(5, 100, 'application/json');
      upload.maxConcurrentUploads = 2;

      upload.uploadFiles(files);

      // Wait for all uploads to complete
      await clock.tickAsync(1000);

      files.forEach(assertFileSucceeded);
    });

    it('should work with manual upload mode', async () => {
      const files = createFiles(5, 100, 'application/json');
      upload.noAuto = true;
      upload.maxConcurrentUploads = 2;

      upload._addFiles(files);
      await clock.tickAsync(10);

      files.forEach(assertFileNotStarted);

      // Start uploads manually
      upload.uploadFiles(files);
      await clock.tickAsync(10);

      files.slice(0, 2).forEach(assertFileUploading);
      files.slice(2, -1).forEach(assertFileQueued);
    });
  });

  describe('upload queue with abort', () => {
    beforeEach(() => {
      upload._createXhr = sinon.spy(xhrCreator({ size: 100, uploadTime: 200, stepTime: 50 }));
    });

    it('should remove file from queue when aborted', () => {
      const files = createFiles(2, 100, 'application/json');
      upload.maxConcurrentUploads = 1;

      upload.uploadFiles(files);
      expect(upload._createXhr).to.be.calledOnce;

      upload._createXhr.resetHistory();

      // Abort a queued file
      upload._abortFileUpload(files[1]);
      expect(upload._createXhr).to.be.not.called;
    });

    it('should process queue after aborting an uploading file', () => {
      const files = createFiles(2, 100, 'application/json');
      upload.maxConcurrentUploads = 1;

      upload.uploadFiles(files);
      expect(upload._createXhr).to.be.calledOnce;

      upload._createXhr.resetHistory();

      files[0].xhr.abort();
      expect(upload._createXhr).to.be.calledOnce;
    });
  });

  describe('upload queue with errors', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers({
        shouldClearNativeTimers: true,
      });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should process queue when upload fails', async () => {
      upload._createXhr = xhrCreator({
        size: 100,
        uploadTime: 100,
        stepTime: 25,
        serverTime: 10,
        serverValidation: () => ({ status: 500, statusText: 'Error' }),
      });

      const files = createFiles(5, 100, 'application/json');
      upload.maxConcurrentUploads = 2;

      upload.uploadFiles(files);
      await clock.tickAsync(10);

      files.slice(0, 2).forEach(assertFileUploading);
      files.slice(2, -1).forEach(assertFileQueued);

      // Wait for first 2 uploads to fail (uploadTime + stepTime + serverTime = 100 + 25 + 10 = 135ms)
      await clock.tickAsync(150);

      // After first 2 fail, next 2 should start from queue
      files.slice(2, -1).forEach(assertFileUploading);
    });

    it('should handle response event cancellation', async () => {
      upload._createXhr = xhrCreator({ size: 100, uploadTime: 200, stepTime: 50 });

      const files = createFiles(5, 100, 'application/json');
      upload.maxConcurrentUploads = 2;

      upload.addEventListener('upload-response', (e) => {
        e.preventDefault();
      });

      upload.uploadFiles(files);
      await clock.tickAsync(10);

      files.slice(0, 2).forEach(assertFileUploading);
      files.slice(2, -1).forEach(assertFileQueued);

      // Wait for uploads to reach completion state
      await clock.tickAsync(250);

      // When response is prevented, files stay in uploading state
      // but queue should still be processed once xhr completes
      files.slice(2, 4).forEach(assertFileUploading);
      files.slice(4, -1).forEach(assertFileQueued);
    });
  });

  describe('unlimited concurrent uploads', () => {
    beforeEach(() => {
      upload._createXhr = xhrCreator({ size: 100, uploadTime: 200, stepTime: 50 });
    });

    it('should allow unlimited uploads when maxConcurrentUploads is Infinity', () => {
      const files = createFiles(20, 100, 'application/json');
      upload.maxConcurrentUploads = Infinity;
      upload.uploadFiles(files);
      files.forEach(assertFileUploading);
    });
  });

  describe('dynamic maxConcurrentUploads change', () => {
    let clock;

    beforeEach(() => {
      upload._createXhr = xhrCreator({ size: 100, uploadTime: 200, stepTime: 50 });
      clock = sinon.useFakeTimers({
        shouldClearNativeTimers: true,
      });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should respect new limit when increased during uploads', async () => {
      const files = createFiles(10, 100, 'application/json');
      upload.maxConcurrentUploads = 1;

      upload.uploadFiles(files);
      await clock.tickAsync(10);

      files.slice(0, 1).forEach(assertFileUploading);
      files.slice(1, -1).forEach(assertFileQueued);

      // Increase limit
      upload.maxConcurrentUploads = 10;
      await clock.tickAsync(300);

      files.slice(1, -1).forEach(assertFileUploading);
    });
  });

  describe('retry with queue', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers({
        shouldClearNativeTimers: true,
      });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should handle retry of failed file with queue', async () => {
      upload._createXhr = xhrCreator({
        size: 100,
        serverValidation: () => ({ status: 500, statusText: 'Error' }),
      });

      const files = createFiles(3, 100, 'application/json');
      upload.maxConcurrentUploads = 2;

      upload.uploadFiles(files);
      await clock.tickAsync(10);

      files.slice(0, 2).forEach(assertFileUploading);

      // Wait for uploads to fail
      await clock.tickAsync(100);

      files.slice(0, 2).forEach(assertFileFailed);

      // Replace XHR creator with successful one
      upload._createXhr = xhrCreator({ size: 100, uploadTime: 200, stepTime: 50 });

      // Retry first file
      upload._retryFileUpload(files[0]);
      await clock.tickAsync(10);

      assertFileUploading(files[0]);
      assertFileFailed(files[1]);
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      upload._createXhr = sinon.spy(xhrCreator({ size: 100, uploadTime: 200, stepTime: 50 }));
    });

    it('should handle single file with limit of 1', () => {
      const files = createFiles(1, 100, 'application/json');
      upload.maxConcurrentUploads = 1;

      upload.uploadFiles(files);
      expect(upload._createXhr).to.be.calledOnce;
    });

    it('should handle zero files', () => {
      upload.maxConcurrentUploads = 5;
      expect(upload._createXhr).to.be.not.called;
    });

    it('should not start upload if already uploading', () => {
      const files = createFiles(1, 100, 'application/json');
      upload.maxConcurrentUploads = 1;

      upload.uploadFiles(files[0]);
      expect(upload._createXhr).to.be.calledOnce;

      upload._createXhr.resetHistory();

      // Try to upload same file again
      upload.uploadFiles(files[0]);
      expect(upload._createXhr).to.be.not.called;
    });
  });
});
