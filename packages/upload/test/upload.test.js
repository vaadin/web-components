import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload.js';
import { createFile, createFiles, removeFile, xhrCreator } from './helpers.js';

describe('upload', () => {
  let upload, file;

  beforeEach(async () => {
    upload = fixtureSync(`<vaadin-upload></vaadin-upload>`);
    upload.target = 'http://foo.com/bar';
    file = createFile(100000, 'application/unknown');
    await nextRender();
  });

  describe('File upload', () => {
    beforeEach(() => {
      upload._createXhr = xhrCreator({ size: file.size, uploadTime: 200, stepTime: 50 });
    });

    describe('File input', () => {
      it('should have the multiple attribute', () => {
        expect(upload.$.fileInput.getAttribute('multiple')).not.to.be.null;
      });

      it('should remove multiple attribute when maxFiles = 1', () => {
        upload.maxFiles = 1;
        expect(upload.$.fileInput.getAttribute('multiple')).to.be.null;
      });

      it('should apply the capture attribute to the input', async () => {
        const input = upload.$.fileInput;
        const captureType = 'camera';
        upload.capture = captureType;
        await nextUpdate(upload);
        expect(input.getAttribute('capture')).to.equal(captureType);
      });
    });

    describe('Events', () => {
      let clock;

      beforeEach(() => {
        clock = sinon.useFakeTimers();
      });

      afterEach(() => {
        clock.restore();
      });

      it('should fire the upload-start event', (done) => {
        upload.addEventListener('upload-start', (e) => {
          expect(e.detail.xhr).to.be.ok;
          expect(e.detail.file).to.be.ok;
          expect(e.detail.file.uploading).to.be.ok;
          done();
        });
        upload._uploadFile(file);
      });

      it('should fire the upload-progress event multiple times', async () => {
        const spy = sinon.spy();
        upload.addEventListener('upload-progress', spy);
        upload._uploadFile(file);

        await clock.tickAsync(10);
        const e = spy.firstCall.args[0];
        const f = e.detail.file;
        expect(e.detail.xhr).to.be.ok;
        expect(f.totalStr).to.be.equal('100 kB');
        expect(f.progress).to.be.equal(0);
        expect(f.loaded).to.be.equal(0);
        expect(f.size).to.be.equal(100000);

        await clock.tickAsync(50);
        expect(f.progress).to.be.equal(25);
        expect(f.loaded).to.be.equal(25000);
        expect(f.size).to.be.equal(100000);

        await clock.tickAsync(50);
        expect(f.progress).to.be.equal(50);
        expect(f.loaded).to.be.equal(50000);
        expect(f.size).to.be.equal(100000);
        expect(f.uploading).to.be.ok;

        await clock.tickAsync(100);
        expect(f.progress).to.be.equal(100);
        expect(f.loaded).to.be.equal(100000);
        expect(f.size).to.be.equal(100000);
        expect(f.speed).to.be.gt(100);
        expect(f.uploading).to.be.ok;
      });

      it('should fire the upload-success', async () => {
        const spy = sinon.spy();
        upload.addEventListener('upload-success', spy);
        upload._uploadFile(file);

        await clock.tickAsync(400);
        const e = spy.firstCall.args[0];
        expect(e.detail.xhr).to.be.ok;
        expect(e.detail.file).to.be.ok;
        expect(e.detail.file.uploading).not.to.be.ok;
        expect(e.detail.xhr.status).to.be.equal(200);
      });

      it('should fire the upload-error event on connection error', async () => {
        const progressSpy = sinon.spy();
        upload.addEventListener('upload-progress', progressSpy);
        const errorSpy = sinon.spy();
        upload.addEventListener('upload-error', errorSpy);

        upload._uploadFile(file);

        await clock.tickAsync(100);
        const progressEvt = progressSpy.firstCall.args[0];
        progressEvt.detail.xhr.err();

        const errorEvt = errorSpy.firstCall.args[0];

        expect(errorEvt.detail.file.uploading).not.to.be.ok;
        expect(errorEvt.detail.file.error).to.be.equal('Upload failed, please try again later');
        expect(errorEvt.detail.xhr.status).not.to.be.equal(200);
      });

      it('should fire the upload-before with configurable request url', (done) => {
        upload.addEventListener('upload-before', (e) => {
          expect(e.detail.file).to.be.ok;
          expect(e.detail.xhr).to.be.ok;
          expect(e.detail.xhr.readyState).to.equal(0);
          expect(e.detail.file.uploadTarget).to.be.ok;

          const modifiedUrl = 'http://example.com/modified/url';
          e.detail.file.uploadTarget = modifiedUrl;

          // Monkey-patch xhr.open to check the url param passed into
          const originalOpen = e.detail.xhr.open;
          e.detail.xhr.open = function (method, url, ...args) {
            expect(url).to.equal(modifiedUrl);
            originalOpen.call(this, method, url, ...args);
            done();
          };
        });
        upload._uploadFile(file);
      });

      it('should not override configurable request url if already set', (done) => {
        const modifiedUrl = 'http://example.com/modified/url';
        upload.addEventListener('upload-before', (e) => {
          e.preventDefault();
          expect(e.detail.file.uploadTarget).to.equal(modifiedUrl);
          done();
        });
        file.uploadTarget = modifiedUrl;
        upload._uploadFile(file);
      });

      it('should fire the upload-before with configurable form data name', (done) => {
        function MockFormData() {
          this.data = [];
        }
        MockFormData.prototype.append = function (name, value, filename) {
          this.data.push({ name, value, filename });
        };
        const OriginalFormData = window.FormData;
        window.FormData = MockFormData;

        upload.addEventListener('upload-before', (e) => {
          expect(e.detail.file.formDataName).to.equal('file');
          e.detail.file.formDataName = 'my-attachment';

          // Monkey-patch xhr.send to check the form data name param
          e.detail.xhr.send = (formData) => {
            expect(formData.data[0].name).to.equal('my-attachment');
            expect(formData.data[0].value).to.eql(file);
            done();
          };
        });

        upload._uploadFile(file);

        window.FormData = OriginalFormData;
      });

      it('should use formDataName property as a default form data name', (done) => {
        upload.addEventListener('upload-before', (e) => {
          expect(e.detail.file.formDataName).to.equal('attachment');
          done();
        });

        upload.formDataName = 'attachment';
        upload._uploadFile(file);
      });

      it('should not open xhr if `upload-before` event is cancelled', () => {
        upload.addEventListener('upload-before', (e) => {
          e.preventDefault();
        });
        upload._uploadFile(file);
        expect(file.xhr.readyState).to.equal(0);
      });

      it('should fire upload-request event', (done) => {
        upload.addEventListener('upload-request', (e) => {
          expect(e.detail.file).to.be.ok;
          expect(e.detail.xhr).to.be.ok;
          expect(e.detail.xhr.readyState).to.equal(1);
          expect(e.detail.formData).to.be.ok;
          done();
        });
        upload._uploadFile(file);
      });

      it('should not send xhr if `upload-request` listener prevents default', (done) => {
        upload.addEventListener('upload-request', (e) => {
          e.preventDefault();

          clock.tickAsync(100).then(() => {
            expect(e.detail.xhr.readyState).to.be.equal(1);
            done();
          });
        });

        upload._uploadFile(file);
      });

      it('should fail if a `upload-response` listener sets an error', async () => {
        const error = 'Custom Error';
        upload.addEventListener('upload-response', (e) => {
          e.detail.file.error = error;
        });

        const errorSpy = sinon.spy();
        upload.addEventListener('upload-error', errorSpy);

        upload._uploadFile(file);
        await clock.tickAsync(250);

        const e = errorSpy.firstCall.args[0];
        expect(e.detail.file.uploading).not.to.be.ok;
        expect(e.detail.file.error).to.be.equal(error);
        expect(e.detail.xhr.status).to.be.equal(200);
      });

      it('should do nothing if a `upload-response` listener prevents default', async () => {
        upload.addEventListener('upload-response', (e) => {
          e.preventDefault();
        });

        upload._uploadFile(file);
        await clock.tickAsync(100);

        expect(file.uploading).to.be.ok;
        expect(file.error).not.to.be.ok;
      });

      it('should fire the `upload-retry` event on retrying', (done) => {
        upload.addEventListener('upload-retry', () => {
          clock.tickAsync(100).then(() => {
            expect(file.uploading).to.be.ok;
            done();
          });
        });
        upload._retryFileUpload(file);
      });

      it('should propagate with-credentials to the xhr', (done) => {
        upload.withCredentials = true;
        upload.addEventListener('upload-start', (e) => {
          e.preventDefault();
          expect(e.detail.xhr.withCredentials).to.be.true;
          done();
        });
        upload._uploadFile(file);
      });
    });

    describe('Response Status', () => {
      let clock;

      beforeEach(() => {
        clock = sinon.useFakeTimers();
      });

      afterEach(() => {
        clock.restore();
      });

      async function expectResponseErrorForStatus(error, status) {
        upload._createXhr = xhrCreator({
          serverValidation: () => {
            return {
              status,
              statusText: 'Error',
            };
          },
        });

        const spy = sinon.spy();
        upload.addEventListener('upload-error', spy);

        upload._uploadFile(file);
        await clock.tickAsync(50);

        const e = spy.firstCall.args[0];
        expect(e.detail.xhr.status).to.be.equal(status);
        expect(e.detail.file.error).to.be.equal(error);
      }

      [400, 401, 403, 404, 451].forEach((status) => {
        it(`should fail with forbidden error for status code ${status}`, async () => {
          await expectResponseErrorForStatus(upload.i18n.uploading.error.forbidden, status);
        });
      });

      [500, 501, 502, 503, 504].forEach((status) => {
        it(`should fail with unexpected error for status code ${status}`, async () => {
          await expectResponseErrorForStatus(upload.i18n.uploading.error.unexpectedServerError, status);
        });
      });
    });
  });

  describe('Upload Status', () => {
    let clock;

    beforeEach(() => {
      upload._createXhr = xhrCreator({
        size: file.size,
        connectTime: 500,
        uploadTime: 200,
        stepTime: 100,
        serverTime: 500,
      });

      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should be indeterminate when connecting', async () => {
      upload._uploadFile(file);
      await clock.tickAsync(200);
      expect(file.indeterminate).to.be.ok;
      expect(file.status).to.be.equal(upload.i18n.uploading.status.connecting);
    });

    it('should not be indeterminate when progressing', async () => {
      const spy = sinon.spy();
      upload.addEventListener('upload-progress', spy);
      upload._uploadFile(file);
      await clock.tickAsync(600);
      const e = spy.firstCall.args[0];
      expect(e.detail.file.status).to.contain(upload.i18n.uploading.remainingTime.prefix);
      expect(e.detail.file.indeterminate).not.to.be.ok;
    });

    it('should be indeterminate when server is processing the file', async () => {
      upload._uploadFile(file);
      await clock.tickAsync(800);
      expect(file.indeterminate).to.be.ok;
      expect(file.status).to.be.equal(upload.i18n.uploading.status.processing);
    });
  });

  describe('Upload is Stalled', () => {
    let clock;

    beforeEach(() => {
      upload._createXhr = xhrCreator({
        size: file.size,
        uploadTime: 2500,
        stepTime: 2500,
      });

      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should be stalled when progress is not updated for more than 2 sec.', async () => {
      upload._uploadFile(file);
      await clock.tickAsync(2200);
      expect(file.status).to.be.equal(upload.i18n.uploading.status.stalled);
    });
  });

  describe('Manual Upload', () => {
    let files;

    beforeEach(() => {
      upload.noAuto = true;
      upload._createXhr = xhrCreator({ size: file.size, uploadTime: 200, stepTime: 50 });
    });

    it('should be in held status', async () => {
      upload._addFile(file);
      await nextRender();
      expect(file.uploaded).not.to.be.ok;
      expect(file.held).to.be.true;
      expect(file.status).to.be.equal(upload.i18n.uploading.status.held);
    });

    it('should start uploading non-completed files after call to uploadFiles', (done) => {
      let counter = 0;
      files = createFiles(3, 512, 'application/json');
      upload.files = files;
      upload.files[1].complete = true;

      upload.files.forEach((file) => {
        expect(file.uploading).not.to.be.ok;
      });
      upload.addEventListener('upload-start', (e) => {
        expect(e.detail.xhr).to.be.ok;
        expect(e.detail.file).to.be.ok;
        expect(e.detail.file.uploading).to.be.ok;

        counter += 1;
        if (counter === upload.files.length - 1) {
          done();
        }
      });
      upload.uploadFiles();
    });

    it('should only start uploading files passed to uploadFiles call', (done) => {
      const tempFileName = 'file-test';
      files = createFiles(3, 512, 'application/json');
      upload.files = files;
      upload.files[2].name = tempFileName;

      upload.files.forEach((file) => {
        expect(file.uploading).not.to.be.ok;
      });
      let firstUploadStartFired = false;
      upload.addEventListener('upload-start', (e) => {
        if (!firstUploadStartFired) {
          firstUploadStartFired = true;
          expect(e.detail.xhr).to.be.ok;
          expect(e.detail.file).to.be.ok;
          expect(e.detail.file.name).to.equal(tempFileName);
          expect(e.detail.file.uploading).to.be.ok;

          for (let i = 0; i < upload.files.length - 1; i++) {
            expect(upload.files[i].uploading).not.to.be.ok;
          }
          done();
        }
        // With queue behavior, other files will start after the first completes - ignore those events
      });
      upload.uploadFiles([upload.files[2]]);
    });

    it('should start uploading a single file passed to uploadFiles call', (done) => {
      const tempFileName = 'file-test';
      files = createFiles(1, 512, 'application/json');
      upload.files = files;
      upload.files[0].name = tempFileName;

      upload.addEventListener('upload-start', (e) => {
        expect(e.detail.xhr).to.be.ok;
        expect(e.detail.file).to.be.ok;
        expect(e.detail.file.name).to.equal(tempFileName);
        expect(e.detail.file.uploading).to.be.ok;
        done();
      });
      upload.uploadFiles(upload.files[0]);
    });

    it('should start a file upload from the file-start event', (done) => {
      upload._addFile(file);

      expect(file.uploaded).not.to.be.ok;
      expect(file.held).to.be.true;
      expect(file.status).to.be.equal(upload.i18n.uploading.status.held);

      upload.addEventListener('upload-start', (e) => {
        expect(e.detail.xhr).to.be.ok;
        expect(e.detail.file).to.be.ok;
        expect(e.detail.file.uploading).to.be.ok;

        done();
      });

      upload.dispatchEvent(
        new CustomEvent('file-start', {
          detail: { file },
          cancelable: true,
        }),
      );
    });
  });

  describe('Abort Files', () => {
    let files, clock;

    beforeEach(() => {
      upload._createXhr = xhrCreator({ size: file.size, uploadTime: 200, stepTime: 50 });
      files = createFiles(2, 512, 'application/json');
      clock = sinon.useFakeTimers({
        shouldClearNativeTimers: true,
      });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should fire `file-remove` and remove from files', async () => {
      upload.addEventListener('upload-progress', (e) => {
        if (e.detail.file === files[0] && e.detail.file.progress === 50) {
          const idx = upload.files.indexOf(e.detail.file);
          removeFile(upload, idx);
        }
      });

      const spy = sinon.spy();
      upload.addEventListener('file-remove', spy);

      upload._addFiles(files);
      await clock.tickAsync(150);

      expect(spy.calledOnce).to.be.true;
      expect(upload.files.length).to.be.equal(1);
    });

    it('should remove all files', async () => {
      upload.noAuto = true;
      upload._addFiles(files);
      await clock.tickAsync(1);

      removeFile(upload, 1);
      await clock.tickAsync(1);
      expect(upload.files.length).to.equal(1);

      removeFile(upload, 0);
      await clock.tickAsync(1);
      expect(upload.files.length).to.equal(0);
    });
  });

  describe('Upload Queue', () => {
    let clock, files;

    beforeEach(() => {
      upload._createXhr = xhrCreator({ size: file.size, uploadTime: 200, stepTime: 50 });
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should upload multiple files one at a time', async () => {
      files = createFiles(3, 512, 'application/json');
      upload._addFiles(files);

      // Files are prepended, so files[0] is at index 2, files[1] at index 1, files[2] at index 0
      // First file added (files[0]) should start uploading
      await clock.tickAsync(10);
      expect(upload.files[2].uploading).to.be.true;
      expect(upload.files[2].held).to.be.false;
      expect(upload.files[1].held).to.be.true;
      expect(upload.files[0].held).to.be.true;

      // Wait for first file to complete (connectTime + uploadTime + serverTime = 10 + 200 + 10 = 220ms)
      await clock.tickAsync(220);
      expect(upload.files[2].complete).to.be.true;
      expect(upload.files[2].uploading).to.be.false;

      // Second file (files[1]) should now start uploading
      await clock.tickAsync(10);
      expect(upload.files[1].uploading).to.be.true;
      expect(upload.files[1].held).to.be.false;
      expect(upload.files[0].held).to.be.true;

      // Wait for second file to complete
      await clock.tickAsync(220);
      expect(upload.files[1].complete).to.be.true;
      expect(upload.files[1].uploading).to.be.false;

      // Third file (files[2]) should now start uploading
      await clock.tickAsync(10);
      expect(upload.files[0].uploading).to.be.true;
      expect(upload.files[0].held).to.be.false;

      // Wait for third file to complete
      await clock.tickAsync(220);
      expect(upload.files[0].complete).to.be.true;
      expect(upload.files[0].uploading).to.be.false;
    });

    it('should process next file in queue after one completes with error', async () => {
      upload._createXhr = xhrCreator({
        size: 512,
        uploadTime: 200,
        stepTime: 50,
        serverValidation: () => {
          return { status: 500, statusText: 'Server Error' };
        },
      });

      const errorSpy = sinon.spy();
      const startSpy = sinon.spy();
      upload.addEventListener('upload-error', errorSpy);
      upload.addEventListener('upload-start', startSpy);

      files = createFiles(2, 512, 'application/json');
      upload._addFiles(files);

      // First file should start
      await clock.tickAsync(10);
      expect(startSpy.callCount).to.equal(1);

      // Wait for first file to complete with error
      await clock.tickAsync(220);
      expect(errorSpy.callCount).to.equal(1);

      // Second file should now start
      await clock.tickAsync(10);
      expect(startSpy.callCount).to.equal(2);
      expect(upload.files.some((f) => f.uploading)).to.be.true;
    });

    it('should process next file in queue after one is aborted', async () => {
      files = createFiles(2, 512, 'application/json');
      upload._addFiles(files);

      // First file added (at index 1) should start uploading
      await clock.tickAsync(10);
      expect(upload.files[1].uploading).to.be.true;
      expect(upload.files[0].held).to.be.true;

      // Abort the first file (at index 1)
      upload._abortFileUpload(upload.files[1]);

      // Second file (now at index 0 after first is removed) should now start uploading
      await clock.tickAsync(10);
      expect(upload.files[0].uploading).to.be.true;
    });

    it('should only start one file when uploadFiles is called with multiple files', async () => {
      upload.noAuto = true;
      files = createFiles(3, 512, 'application/json');
      upload._addFiles(files);

      // No files should be uploading yet - all should be held
      await clock.tickAsync(10);
      expect(upload.files[0].held).to.be.true;
      expect(upload.files[1].held).to.be.true;
      expect(upload.files[2].held).to.be.true;

      // Call uploadFiles
      upload.uploadFiles();

      // Only first file (at index 2) should start uploading - wait for it to begin
      await clock.tickAsync(20);
      expect(upload.files.length).to.equal(3);
      // One file should be uploading (the oldest one added)
      const uploadingFile = upload.files.find((f) => f.uploading);
      expect(uploadingFile).to.be.ok;
      // The other two should still be held
      const heldFiles = upload.files.filter((f) => f.held);
      expect(heldFiles.length).to.equal(2);

      // Wait for first file to complete
      await clock.tickAsync(220);

      // Second file should start automatically
      await clock.tickAsync(10);
      expect(upload.files.some((f) => f.uploading)).to.be.true;
      const remainingHeldFiles = upload.files.filter((f) => f.held);
      expect(remainingHeldFiles.length).to.equal(1);
    });
  });

  describe('Upload format', () => {
    let clock;

    beforeEach(() => {
      upload._createXhr = xhrCreator({ size: file.size, uploadTime: 200, stepTime: 50 });
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should use FormData for multipart format', (done) => {
      upload.uploadFormat = 'multipart';
      upload.addEventListener('upload-request', (e) => {
        expect(e.detail.formData).to.be.instanceOf(FormData);
        done();
      });
      upload._uploadFile(file);
    });

    it('should send file directly for raw format', (done) => {
      upload.uploadFormat = 'raw';
      upload.addEventListener('upload-request', (e) => {
        expect(e.detail.requestBody).to.equal(file);
        expect(e.detail.requestBody).to.be.instanceOf(Blob);
        expect(e.detail.formData).to.be.undefined;
        done();
      });
      upload._uploadFile(file);
    });

    it('should set Content-Type header to file MIME type in raw format', (done) => {
      const pdfFile = createFile(1000, 'application/pdf');
      upload.uploadFormat = 'raw';
      upload.addEventListener('upload-request', (e) => {
        const contentType = e.detail.xhr.getRequestHeader('Content-Type');
        expect(contentType).to.equal('application/pdf');
        done();
      });
      upload._uploadFile(pdfFile);
    });

    it('should set X-Filename header in raw format', (done) => {
      const testFile = createFile(1000, 'application/pdf');
      upload.uploadFormat = 'raw';
      upload.addEventListener('upload-request', (e) => {
        const filename = e.detail.xhr.getRequestHeader('X-Filename');
        expect(filename).to.equal(testFile.name);
        done();
      });
      upload._uploadFile(testFile);
    });

    it('should set Content-Type to application/octet-stream when file has no type in raw format', (done) => {
      const unknownFile = createFile(1000, 'application/pdf');
      // Override type to be empty to test the fallback logic
      Object.defineProperty(unknownFile, 'type', {
        value: '',
        writable: false,
      });
      upload.uploadFormat = 'raw';
      upload.addEventListener('upload-request', (e) => {
        const contentType = e.detail.xhr.getRequestHeader('Content-Type');
        // Should use our fallback: 'application/octet-stream' (without 'x')
        expect(contentType).to.equal('application/octet-stream');
        done();
      });
      upload._uploadFile(unknownFile);
    });

    it('should not set Content-Type header in multipart format', (done) => {
      upload.uploadFormat = 'multipart';
      upload.addEventListener('upload-request', (e) => {
        const contentType = e.detail.xhr.getRequestHeader('Content-Type');
        expect(contentType).to.be.undefined;
        done();
      });
      upload._uploadFile(file);
    });

    it('should not set X-Filename header in multipart format', (done) => {
      upload.uploadFormat = 'multipart';
      upload.addEventListener('upload-request', (e) => {
        const filename = e.detail.xhr.getRequestHeader('X-Filename');
        expect(filename).to.be.undefined;
        done();
      });
      upload._uploadFile(file);
    });

    it('should ignore formDataName in raw format', (done) => {
      upload.uploadFormat = 'raw';
      upload.formDataName = 'my-custom-field';
      upload.addEventListener('upload-request', (e) => {
        expect(e.detail.requestBody).to.equal(file);
        expect(e.detail.requestBody).not.to.be.instanceOf(FormData);
        expect(e.detail.formData).to.be.undefined;
        done();
      });
      upload._uploadFile(file);
    });

    it('should successfully complete upload in raw format', async () => {
      upload.uploadFormat = 'raw';
      const successSpy = sinon.spy();
      upload.addEventListener('upload-success', successSpy);

      upload._uploadFile(file);
      await clock.tickAsync(400);

      expect(successSpy.calledOnce).to.be.true;
      const e = successSpy.firstCall.args[0];
      expect(e.detail.file.complete).to.be.true;
      expect(e.detail.xhr.status).to.equal(200);
    });

    it('should include uploadFormat and requestBody in upload-request event for raw', (done) => {
      upload.uploadFormat = 'raw';
      upload.addEventListener('upload-request', (e) => {
        expect(e.detail.uploadFormat).to.equal('raw');
        expect(e.detail.requestBody).to.equal(file);
        expect(e.detail.formData).to.be.undefined;
        done();
      });
      upload._uploadFile(file);
    });
  });
});
