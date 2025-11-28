import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload.js';
import { createFiles, xhrCreator } from './helpers.js';

describe('concurrent uploads', () => {
  let upload;

  beforeEach(async () => {
    upload = fixtureSync(`<vaadin-upload></vaadin-upload>`);
    upload.target = 'http://foo.com/bar';
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

    it('should track active uploads count', async () => {
      const files = createFiles(3, 100, 'application/json');
      upload.maxConcurrentUploads = 2;

      expect(upload._activeUploads).to.equal(0);

      upload._addFiles(files);
      await clock.tickAsync(10);

      expect(upload._activeUploads).to.equal(2);
    });

    it('should queue files when exceeding concurrent limit', async () => {
      const files = createFiles(5, 100, 'application/json');
      upload.maxConcurrentUploads = 2;

      upload._addFiles(files);
      await clock.tickAsync(10);

      expect(upload._activeUploads).to.equal(2);
      expect(upload._uploadQueue.length).to.equal(3);
    });

    it('should show queued status for files in queue', async () => {
      const files = createFiles(5, 100, 'application/json');
      upload.maxConcurrentUploads = 2;

      upload._addFiles(files);
      await clock.tickAsync(10);

      // First 2 files should be uploading
      expect(files[0].uploading).to.be.true;
      expect(files[1].uploading).to.be.true;

      // Remaining files should be queued
      expect(files[2].held).to.be.true;
      expect(files[2].status).to.equal(upload.i18n.uploading.status.held);
      expect(files[3].held).to.be.true;
      expect(files[4].held).to.be.true;
    });

    it('should process queue as uploads complete', async () => {
      const files = createFiles(5, 100, 'application/json');
      upload.maxConcurrentUploads = 2;

      upload._addFiles(files);
      await clock.tickAsync(10);

      expect(upload._activeUploads).to.equal(2);
      expect(upload._uploadQueue.length).to.equal(3);

      // Wait for first uploads to complete
      await clock.tickAsync(250);

      expect(upload._activeUploads).to.equal(2);
      expect(upload._uploadQueue.length).to.equal(1);

      // Wait for next batch to complete
      await clock.tickAsync(250);

      expect(upload._activeUploads).to.equal(1);
      expect(upload._uploadQueue.length).to.equal(0);
    });

    it('should handle all uploads completing', async () => {
      const files = createFiles(5, 100, 'application/json');
      upload.maxConcurrentUploads = 2;

      upload._addFiles(files);

      // Wait for all uploads to complete
      await clock.tickAsync(1000);

      expect(upload._activeUploads).to.equal(0);
      expect(upload._uploadQueue.length).to.equal(0);
      files.forEach((file) => {
        expect(file.complete).to.be.true;
      });
    });

    it('should work with manual upload mode', async () => {
      const files = createFiles(5, 100, 'application/json');
      upload.noAuto = true;
      upload.maxConcurrentUploads = 2;

      upload._addFiles(files);
      await clock.tickAsync(10);

      expect(upload._activeUploads).to.equal(0);
      expect(upload._uploadQueue.length).to.equal(0);

      // Start uploads manually
      upload.uploadFiles();
      await clock.tickAsync(10);

      expect(upload._activeUploads).to.equal(2);
      expect(upload._uploadQueue.length).to.equal(3);
    });
  });

  describe('upload queue with abort', () => {
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

    it('should remove file from queue when aborted', async () => {
      const files = createFiles(5, 100, 'application/json');
      upload.maxConcurrentUploads = 2;

      upload._addFiles(files);
      await clock.tickAsync(10);

      expect(upload._uploadQueue.length).to.equal(3);

      // Abort a queued file
      upload._abortFileUpload(files[3]);
      await clock.tickAsync(1);

      expect(upload._uploadQueue.length).to.equal(2);
      expect(upload._uploadQueue.includes(files[3])).to.be.false;
    });

    it('should process queue after file is aborted', async () => {
      const files = createFiles(4, 100, 'application/json');
      upload.maxConcurrentUploads = 2;

      upload._addFiles(files);
      await clock.tickAsync(10);

      const initialActive = upload._activeUploads;
      const initialQueued = upload._uploadQueue.length;

      expect(initialActive).to.equal(2);
      expect(initialQueued).to.equal(2);

      // Abort a queued file (not an active upload)
      upload._abortFileUpload(files[3]);
      await clock.tickAsync(1);

      // File should be removed from queue
      expect(upload._uploadQueue.length).to.equal(initialQueued - 1);
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

      upload._addFiles(files);
      await clock.tickAsync(10);

      expect(upload._activeUploads).to.equal(2);
      expect(upload._uploadQueue.length).to.equal(3);

      // Wait for first uploads to fail and queue to be processed
      await clock.tickAsync(200);

      // Should continue processing queue despite errors
      expect(upload._activeUploads).to.be.greaterThan(0);
      expect(upload._uploadQueue.length).to.be.lessThan(3);
    });

    it('should handle response event cancellation', async () => {
      upload._createXhr = xhrCreator({ size: 100, uploadTime: 200, stepTime: 50 });

      const files = createFiles(5, 100, 'application/json');
      upload.maxConcurrentUploads = 2;

      upload.addEventListener('upload-response', (e) => {
        e.preventDefault();
      });

      upload._addFiles(files);
      await clock.tickAsync(10);

      expect(upload._activeUploads).to.equal(2);

      // Wait for uploads to reach completion state
      await clock.tickAsync(250);

      // When response is prevented, files stay in uploading state
      // but queue should still be processed once xhr completes
      expect(upload._activeUploads).to.be.greaterThan(0);
    });
  });

  describe('unlimited concurrent uploads', () => {
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

    it('should allow unlimited uploads when maxConcurrentUploads is Infinity', async () => {
      const files = createFiles(20, 100, 'application/json');
      upload.maxConcurrentUploads = Infinity;

      upload._addFiles(files);
      await clock.tickAsync(10);

      expect(upload._activeUploads).to.equal(20);
      expect(upload._uploadQueue.length).to.equal(0);
    });

    it('should allow unlimited uploads when maxConcurrentUploads is very high', async () => {
      const files = createFiles(15, 100, 'application/json');
      upload.maxConcurrentUploads = 100;

      upload._addFiles(files);
      await clock.tickAsync(10);

      expect(upload._activeUploads).to.equal(15);
      expect(upload._uploadQueue.length).to.equal(0);
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
      upload.maxConcurrentUploads = 2;

      upload._addFiles(files);
      await clock.tickAsync(10);

      expect(upload._activeUploads).to.equal(2);
      expect(upload._uploadQueue.length).to.equal(8);

      // Increase limit
      upload.maxConcurrentUploads = 5;

      // Manually process queue with new limit
      upload._processQueue();
      await clock.tickAsync(10);

      expect(upload._activeUploads).to.equal(5);
      expect(upload._uploadQueue.length).to.equal(5);
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

      upload._addFiles(files);
      await clock.tickAsync(10);

      expect(upload._activeUploads).to.equal(2);

      // Wait for uploads to fail
      await clock.tickAsync(100);

      // Replace XHR creator with successful one
      upload._createXhr = xhrCreator({ size: 100, uploadTime: 200, stepTime: 50 });

      // Retry first file
      upload._retryFileUpload(files[0]);
      await clock.tickAsync(10);

      // Should respect concurrent limit
      expect(upload._activeUploads).to.be.lte(upload.maxConcurrentUploads);
    });
  });

  describe('edge cases', () => {
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

    it('should handle single file with limit of 1', async () => {
      const files = createFiles(1, 100, 'application/json');
      upload.maxConcurrentUploads = 1;

      upload._addFiles(files);
      await clock.tickAsync(10);

      expect(upload._activeUploads).to.equal(1);
      expect(upload._uploadQueue.length).to.equal(0);
    });

    it('should handle zero files', () => {
      upload.maxConcurrentUploads = 5;

      expect(upload._activeUploads).to.equal(0);
      expect(upload._uploadQueue.length).to.equal(0);
    });

    it('should not start upload if already uploading', async () => {
      const files = createFiles(1, 100, 'application/json');
      upload.maxConcurrentUploads = 1;

      upload._uploadFile(files[0]);
      await clock.tickAsync(10);

      const initialActiveCount = upload._activeUploads;

      // Try to upload same file again
      upload._uploadFile(files[0]);
      await clock.tickAsync(10);

      // Should not increase active count
      expect(upload._activeUploads).to.equal(initialActiveCount);
    });
  });
});
