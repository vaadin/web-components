import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload.js';
import { addFilesViaInput, createFile, createFiles, removeFile, xhrCreator } from './helpers.js';

describe('upload', () => {
  let upload, file;

  beforeEach(async () => {
    upload = fixtureSync(`<vaadin-upload></vaadin-upload>`);
    upload.target = 'https://foo.com/bar';
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
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
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
        upload.uploadFiles(file);
      });

      it('should fire the upload-progress event multiple times', async () => {
        const spy = sinon.spy();
        upload.addEventListener('upload-progress', spy);
        upload.uploadFiles(file);

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
        upload.uploadFiles(file);

        await clock.tickAsync(400);
        const e = spy.firstCall.args[0];
        expect(e.detail.xhr).to.be.ok;
        expect(e.detail.file).to.be.ok;
        expect(e.detail.file.uploading).not.to.be.ok;
        expect(e.detail.xhr.status).to.be.equal(200);
      });

      it('should keep the file xhr after the upload has succeeded', async () => {
        upload.uploadFiles(file);
        await clock.tickAsync(400);
        expect(file.complete).to.be.true;
        expect(file.xhr).to.be.ok;
      });

      it('should fire the upload-error event on connection error', async () => {
        const progressSpy = sinon.spy();
        upload.addEventListener('upload-progress', progressSpy);
        const errorSpy = sinon.spy();
        upload.addEventListener('upload-error', errorSpy);

        upload.uploadFiles(file);

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
        upload.uploadFiles(file);
      });

      it('should not override configurable request url if already set', (done) => {
        const modifiedUrl = 'http://example.com/modified/url';
        upload.addEventListener('upload-before', (e) => {
          e.preventDefault();
          expect(e.detail.file.uploadTarget).to.equal(modifiedUrl);
          done();
        });
        file.uploadTarget = modifiedUrl;
        upload.uploadFiles(file);
      });

      it('should use an empty upload target when target is null', (done) => {
        upload.target = null;
        upload.addEventListener('upload-before', (e) => {
          e.preventDefault();
          expect(e.detail.file.uploadTarget).to.equal('');
          done();
        });
        upload.uploadFiles(file);
      });

      it('should fire the upload-before with configurable form data name in multipart mode', (done) => {
        upload.uploadFormat = 'multipart';

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

        upload.uploadFiles(file);

        window.FormData = OriginalFormData;
      });

      it('should use formDataName property as a default form data name in multipart mode', (done) => {
        upload.uploadFormat = 'multipart';

        upload.addEventListener('upload-before', (e) => {
          expect(e.detail.file.formDataName).to.equal('attachment');
          done();
        });

        upload.formDataName = 'attachment';
        upload.uploadFiles(file);
      });

      it('should not open xhr if `upload-before` event is cancelled', () => {
        upload.addEventListener('upload-before', (e) => {
          e.preventDefault();
        });
        upload.uploadFiles(file);
        expect(file.xhr.readyState).to.equal(0);
      });

      it('should keep the file queued when `upload-before` event is cancelled', () => {
        upload.addEventListener('upload-before', (e) => {
          e.preventDefault();
        });
        upload.uploadFiles(file);
        expect(file.held).to.be.true;
        expect(file.uploading).to.be.true;
        expect(file.status).to.equal('Queued');
      });

      it('should continue the upload when the file is removed in an `upload-before` listener', async () => {
        upload.files = [file];
        upload.addEventListener('upload-before', () => {
          upload.files = [];
        });
        const startSpy = sinon.spy();
        upload.addEventListener('upload-start', startSpy);
        const successSpy = sinon.spy();
        upload.addEventListener('upload-success', successSpy);

        upload.uploadFiles(file);
        await clock.tickAsync(400);
        expect(startSpy).to.be.calledOnce;
        expect(successSpy).to.be.calledOnce;
      });

      it('should fire upload-request event in multipart mode', (done) => {
        upload.uploadFormat = 'multipart';

        upload.addEventListener('upload-request', (e) => {
          expect(e.detail.file).to.be.ok;
          expect(e.detail.xhr).to.be.ok;
          expect(e.detail.xhr.readyState).to.equal(1);
          expect(e.detail.formData).to.be.ok;
          done();
        });
        upload.uploadFiles(file);
      });

      it('should not send xhr if `upload-request` listener prevents default', (done) => {
        upload.addEventListener('upload-request', (e) => {
          e.preventDefault();

          clock.tickAsync(100).then(() => {
            expect(e.detail.xhr.readyState).to.be.equal(1);
            done();
          });
        });

        upload.uploadFiles(file);
      });

      it('should keep the file connecting when `upload-request` listener prevents default', () => {
        upload.addEventListener('upload-request', (e) => {
          e.preventDefault();
        });
        upload.uploadFiles(file);
        expect(file.held).to.be.false;
        expect(file.uploading).to.be.true;
        expect(file.status).to.equal('Connecting...');
      });

      it('should update the file status before upload-request and upload-start events', () => {
        upload.files = [file];
        let statusAtRequest, statusAtStart;
        upload.addEventListener('upload-request', (e) => {
          statusAtRequest = e.detail.file.status;
        });
        upload.addEventListener('upload-start', (e) => {
          statusAtStart = e.detail.file.status;
        });
        upload.uploadFiles(file);
        expect(statusAtRequest).to.equal('Connecting...');
        expect(statusAtStart).to.equal('Connecting...');
      });

      it('should clear the status when an error is set while the file is uploading', async () => {
        upload.addEventListener(
          'upload-progress',
          (e) => {
            e.detail.file.error = 'Custom Error';
          },
          { once: true },
        );
        upload.uploadFiles(file);
        // First progress event sets the error, the second one reacts to it
        await clock.tickAsync(60);
        expect(file.status).to.be.undefined;
        expect(file.indeterminate).to.be.undefined;
      });

      it('should complete the upload when the request is sent manually after preventing default', async () => {
        let xhr;
        upload.addEventListener('upload-request', (e) => {
          e.preventDefault();
          xhr = e.detail.xhr;
        });
        const successSpy = sinon.spy();
        upload.addEventListener('upload-success', successSpy);
        upload.uploadFiles(file);

        xhr.send();
        await clock.tickAsync(400);
        expect(successSpy).to.be.calledOnce;
        expect(file.complete).to.be.true;
      });

      it('should fail if a `upload-response` listener sets an error', async () => {
        const error = 'Custom Error';
        upload.addEventListener('upload-response', (e) => {
          e.detail.file.error = error;
        });

        const errorSpy = sinon.spy();
        upload.addEventListener('upload-error', errorSpy);

        upload.uploadFiles(file);
        await clock.tickAsync(250);

        const e = errorSpy.firstCall.args[0];
        expect(e.detail.file.uploading).not.to.be.ok;
        expect(e.detail.file.error).to.be.equal(error);
        expect(e.detail.xhr.status).to.be.equal(200);
      });

      it('should not mark the file complete when a `upload-response` listener sets an error', async () => {
        upload.addEventListener('upload-response', (e) => {
          e.detail.file.error = 'Custom Error';
        });

        upload.uploadFiles(file);
        await clock.tickAsync(250);

        expect(file.complete).to.be.false;
      });

      it('should not fire upload-success when a `upload-response` listener sets an error', async () => {
        upload.addEventListener('upload-response', (e) => {
          e.detail.file.error = 'Custom Error';
        });

        const successSpy = sinon.spy();
        upload.addEventListener('upload-success', successSpy);

        upload.uploadFiles(file);
        await clock.tickAsync(250);

        expect(successSpy).to.not.be.called;
      });

      it('should do nothing if a `upload-response` listener prevents default', async () => {
        upload.addEventListener('upload-response', (e) => {
          e.preventDefault();
        });

        upload.uploadFiles(file);
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
        upload.dispatchEvent(new CustomEvent('file-retry', { detail: { file } }));
      });

      // Uploads the file against a server that rejects the first request and
      // accepts the following ones, and waits for the upload to fail
      async function uploadWithServerError() {
        let fail = true;
        upload._createXhr = xhrCreator({
          size: file.size,
          uploadTime: 200,
          stepTime: 50,
          serverValidation: () => {
            const error = fail ? { status: 500, statusText: 'Error' } : undefined;
            fail = false;
            return error;
          },
        });

        const errorSpy = sinon.spy();
        upload.addEventListener('upload-error', errorSpy);
        upload.uploadFiles(file);
        await clock.tickAsync(400);
        expect(errorSpy).to.be.calledOnce;
        expect(file.error).to.be.ok;
        return errorSpy;
      }

      it('should fire the `upload-success` event when retrying after a failed upload', async () => {
        const errorSpy = await uploadWithServerError();

        const successSpy = sinon.spy();
        upload.addEventListener('upload-success', successSpy);
        upload.dispatchEvent(new CustomEvent('file-retry', { detail: { file } }));
        await clock.tickAsync(400);

        expect(successSpy).to.be.calledOnce;
        expect(errorSpy).to.be.calledOnce;
        expect(file.error).to.not.be.ok;
        expect(file.complete).to.be.true;
      });

      it('should fire the `upload-success` event when uploadFiles restarts a failed upload', async () => {
        const errorSpy = await uploadWithServerError();

        const successSpy = sinon.spy();
        upload.addEventListener('upload-success', successSpy);
        upload.uploadFiles(file);
        expect(file.error).to.not.be.ok;
        await clock.tickAsync(400);

        expect(successSpy).to.be.calledOnce;
        expect(errorSpy).to.be.calledOnce;
        expect(file.complete).to.be.true;
      });

      it('should reference the previous request in the `upload-retry` event detail', async () => {
        await uploadWithServerError();
        expect(file.xhr).to.be.ok;

        const retrySpy = sinon.spy((e) => e.preventDefault());
        upload.addEventListener('upload-retry', retrySpy);
        upload.dispatchEvent(new CustomEvent('file-retry', { detail: { file } }));
        expect(retrySpy.firstCall.args[0].detail.xhr).to.equal(file.xhr);
      });

      it('should use the up-to-date headers when retrying an upload from the file-retry event', async () => {
        await uploadWithServerError();

        const requestSpy = sinon.spy();
        upload.addEventListener('upload-request', requestSpy);
        upload.headers = { 'X-Foo': 'Bar' };
        upload.dispatchEvent(new CustomEvent('file-retry', { detail: { file } }));
        await clock.tickAsync(400);

        expect(requestSpy.firstCall.args[0].detail.xhr.getRequestHeader('X-Foo')).to.equal('Bar');
      });

      it('should keep the progress of the previous attempt when the file is queued again', async () => {
        await uploadWithServerError();
        expect(file.progress).to.equal(100);
        expect(file.loaded).to.equal(100000);

        upload.addEventListener('upload-before', (e) => e.preventDefault());
        upload.dispatchEvent(new CustomEvent('file-retry', { detail: { file } }));
        expect(file.progress).to.equal(100);
        expect(file.loaded).to.equal(100000);
      });

      it('should ignore file-retry while the file is uploading', async () => {
        const startSpy = sinon.spy();
        upload.addEventListener('upload-start', startSpy);
        const retrySpy = sinon.spy();
        upload.addEventListener('upload-retry', retrySpy);

        upload.uploadFiles(file);
        await clock.tickAsync(60);
        expect(file.uploading).to.be.true;

        upload.dispatchEvent(new CustomEvent('file-retry', { detail: { file } }));
        await clock.tickAsync(400);
        expect(retrySpy).to.be.calledOnce;
        expect(startSpy).to.be.calledOnce;
        expect(file.complete).to.be.true;
      });

      it('should not add files passed to uploadFiles to the files list', (done) => {
        upload.addEventListener('upload-start', () => {
          expect(upload.files).to.have.lengthOf(0);
          done();
        });
        upload.uploadFiles(file);
      });

      it('should not count files passed to uploadFiles towards maxFiles', async () => {
        upload.maxFiles = 1;
        upload.uploadFiles(file);
        await clock.tickAsync(400);
        expect(file.complete).to.be.true;
        expect(upload.maxFilesReached).to.be.false;

        addFilesViaInput(upload, [createFile(100, 'image/jpeg')]);
        expect(upload.files).to.have.lengthOf(1);
      });

      it('should fire files-changed only when files are added or removed', async () => {
        const spy = sinon.spy();
        upload.addEventListener('files-changed', spy);

        addFilesViaInput(upload, [file]);
        await clock.tickAsync(400);
        expect(upload.files[0].complete).to.be.true;
        expect(spy).to.be.calledOnce;

        removeFile(upload);
        await clock.tickAsync(10);
        expect(upload.files).to.have.lengthOf(0);
        expect(spy).to.be.calledTwice;
      });

      it('should propagate with-credentials to the xhr', (done) => {
        upload.withCredentials = true;
        upload.addEventListener('upload-start', (e) => {
          e.preventDefault();
          expect(e.detail.xhr.withCredentials).to.be.true;
          done();
        });
        upload.uploadFiles(file);
      });

      it('should propagate timeout to the xhr', (done) => {
        upload.timeout = 5000;
        upload.addEventListener('upload-request', (e) => {
          expect(e.detail.xhr.timeout).to.equal(5000);
          done();
        });
        upload.uploadFiles(file);
      });

      it('should set request headers from the headers object', (done) => {
        upload.headers = { 'X-Foo': 'Bar' };
        upload.addEventListener('upload-request', (e) => {
          expect(e.detail.xhr.getRequestHeader('X-Foo')).to.equal('Bar');
          done();
        });
        upload.uploadFiles(file);
      });

      it('should parse headers set as a JSON string', (done) => {
        upload.headers = '{"X-Foo": "Bar"}';
        upload.addEventListener('upload-request', (e) => {
          expect(e.detail.xhr.getRequestHeader('X-Foo')).to.equal('Bar');
          done();
        });
        upload.uploadFiles(file);
      });

      it('should parse headers set as a JSON string back to an object', () => {
        upload.headers = '{"X-Foo": "Bar"}';
        upload.uploadFiles(file);
        expect(upload.headers).to.be.an('object');
        expect(upload.headers['X-Foo']).to.equal('Bar');
      });

      it('should reset headers set as an invalid JSON string', () => {
        upload.headers = 'invalid json';
        // Configuring the request currently throws after headers are reset
        expect(() => upload.uploadFiles(file)).to.throw(TypeError);
        expect(upload.headers).to.be.undefined;
      });

      it('should fire a cancelable upload-request event', () => {
        const spy = sinon.spy();
        upload.addEventListener('upload-request', spy);
        upload.uploadFiles(file);
        expect(spy).to.be.calledOnce;
        expect(spy.firstCall.args[0].cancelable).to.be.true;
      });

      it('should fire a cancelable upload-response event', async () => {
        const spy = sinon.spy();
        upload.addEventListener('upload-response', spy);
        upload.uploadFiles(file);
        await clock.tickAsync(400);
        expect(spy).to.be.calledOnce;
        expect(spy.firstCall.args[0].cancelable).to.be.true;
      });

      it('should not complete file if a `upload-response` listener prevents default', async () => {
        upload.addEventListener('upload-response', (e) => e.preventDefault());
        const successSpy = sinon.spy();
        upload.addEventListener('upload-success', successSpy);

        upload.uploadFiles(file);
        await clock.tickAsync(400);

        expect(successSpy).to.not.be.called;
        expect(file.complete).to.not.be.ok;
      });

      it('should fire a cancelable upload-retry event with file and xhr in detail', async () => {
        upload.uploadFiles(file);
        await clock.tickAsync(50);
        const xhr = file.xhr;

        const spy = sinon.spy();
        upload.addEventListener('upload-retry', spy);
        upload.dispatchEvent(new CustomEvent('file-retry', { detail: { file } }));

        expect(spy).to.be.calledOnce;
        const e = spy.firstCall.args[0];
        expect(e.cancelable).to.be.true;
        expect(e.detail.file).to.equal(file);
        expect(e.detail.xhr).to.equal(xhr);
      });

      it('should fire a cancelable upload-abort event with file and xhr in detail', async () => {
        upload.uploadFiles(file);
        await clock.tickAsync(50);
        const xhr = file.xhr;

        const spy = sinon.spy();
        upload.addEventListener('upload-abort', spy);
        upload.dispatchEvent(new CustomEvent('file-abort', { detail: { file } }));

        expect(spy).to.be.calledOnce;
        const e = spy.firstCall.args[0];
        expect(e.cancelable).to.be.true;
        expect(e.detail.file).to.equal(file);
        expect(e.detail.xhr).to.equal(xhr);
      });

      it('should abort the xhr when aborting a file', async () => {
        upload.uploadFiles(file);
        await clock.tickAsync(50);

        const abortSpy = sinon.spy(file.xhr, 'abort');
        upload.dispatchEvent(new CustomEvent('file-abort', { detail: { file } }));
        expect(abortSpy).to.be.calledOnce;
      });

      it('should not complete or fire upload-success for an aborted file', async () => {
        const successSpy = sinon.spy();
        upload.addEventListener('upload-success', successSpy);

        upload.uploadFiles(file);
        await clock.tickAsync(50);
        upload.dispatchEvent(new CustomEvent('file-abort', { detail: { file } }));
        await clock.tickAsync(400);

        expect(successSpy).to.not.be.called;
        expect(file.complete).to.not.be.ok;
      });

      it('should reset file status after successful upload', async () => {
        upload.uploadFiles(file);
        await clock.tickAsync(400);
        expect(file.complete).to.be.true;
        expect(file.status).to.equal('');
      });

      it('should set loadedStr to totalStr when upload progress reaches 100%', async () => {
        upload.uploadFiles(file);
        await clock.tickAsync(210);
        expect(file.loadedStr).to.equal('100 kB');
        expect(file.loadedStr).to.equal(file.totalStr);
      });

      it('should clear error and completion flags when retrying a failed upload', async () => {
        upload._createXhr = xhrCreator({ size: file.size, serverValidation: () => ({ status: 500 }) });
        upload.uploadFiles(file);
        await clock.tickAsync(100);
        expect(file.error).to.be.ok;

        upload.dispatchEvent(new CustomEvent('file-retry', { detail: { file } }));
        expect(file.error).to.be.false;
        expect(file.complete).to.be.false;
        expect(file.abort).to.be.false;
      });

      it('should render the file list when a file is queued', () => {
        const renderSpy = sinon.spy(upload._fileList, 'requestContentUpdate');
        upload.addEventListener('upload-request', (e) => e.preventDefault());
        upload.uploadFiles(file);
        expect(renderSpy).to.be.called;
      });

      it('should not render the file list synchronously when a file is added', () => {
        upload.noAuto = true;
        const renderSpy = sinon.spy(upload._fileList, 'requestContentUpdate');
        addFilesViaInput(upload, [file]);
        // The file list is only updated through the files property observer
        expect(renderSpy).to.not.be.called;
      });

      it('should not render the file list synchronously when files are assigned', () => {
        const renderSpy = sinon.spy(upload._fileList, 'requestContentUpdate');
        upload.files = [file];
        // The file list is only updated through the files property observer
        expect(renderSpy).to.not.be.called;
      });

      it('should render the file list when a previously assigned file is queued', () => {
        upload.files = [file];
        const renderSpy = sinon.spy(upload._fileList, 'requestContentUpdate');
        upload.addEventListener('upload-request', (e) => e.preventDefault());
        upload.uploadFiles(file);
        expect(renderSpy).to.be.called;
      });

      it('should render the file list when the upload starts', () => {
        const renderSpy = sinon.spy(upload._fileList, 'requestContentUpdate');
        upload.addEventListener('upload-start', () => {
          renderSpy.resetHistory();
        });
        upload.uploadFiles(file);
        // Rendered once right after the upload-start event
        expect(renderSpy).to.be.calledOnce;
      });
    });

    describe('Response Status', () => {
      let clock;

      beforeEach(() => {
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
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

        upload.uploadFiles(file);
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

      it('should fail with file too large error for status code 413', async () => {
        await expectResponseErrorForStatus(upload.i18n.uploading.error.fileTooLarge, 413);
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

      clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should be indeterminate when connecting', async () => {
      upload.uploadFiles(file);
      await clock.tickAsync(200);
      expect(file.indeterminate).to.be.ok;
      expect(file.status).to.be.equal(upload.i18n.uploading.status.connecting);
    });

    it('should not be indeterminate when progressing', async () => {
      const spy = sinon.spy();
      upload.addEventListener('upload-progress', spy);
      upload.uploadFiles(file);
      await clock.tickAsync(600);
      const e = spy.firstCall.args[0];
      expect(e.detail.file.status).to.contain(upload.i18n.uploading.remainingTime.prefix);
      expect(e.detail.file.indeterminate).not.to.be.ok;
    });

    it('should be indeterminate when server is processing the file', async () => {
      upload.uploadFiles(file);
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

      clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should be stalled when progress is not updated for more than 2 sec.', async () => {
      upload.uploadFiles(file);
      await clock.tickAsync(2200);
      expect(file.status).to.be.equal(upload.i18n.uploading.status.stalled);
    });

    it('should not be stalled when progress updates within 2 sec.', async () => {
      upload._createXhr = xhrCreator({ size: file.size, uploadTime: 6000, stepTime: 1500 });
      upload.uploadFiles(file);
      await clock.tickAsync(2500);
      expect(file.status).to.not.equal(upload.i18n.uploading.status.stalled);
    });

    it('should not become stalled after upload fails between progress updates', async () => {
      // Progress updates 3 seconds apart so that no progress event occurs
      // between the failure and the pending 2 second stalled timeout
      upload._createXhr = xhrCreator({ size: file.size, uploadTime: 6000, stepTime: 3000 });
      upload.uploadFiles(file);
      await clock.tickAsync(100);
      file.xhr.err();
      await clock.tickAsync(2400);
      expect(file.status).to.not.equal(upload.i18n.uploading.status.stalled);
    });

    it('should clear status and progress state on progress update after upload failed', async () => {
      upload._createXhr = xhrCreator({ size: file.size, uploadTime: 200, stepTime: 50 });
      upload.uploadFiles(file);
      await clock.tickAsync(100);
      file.xhr.err();
      // Next progress event arrives after the upload has already failed
      await clock.tickAsync(50);
      expect(file.status).to.be.undefined;
      expect(file.indeterminate).to.be.undefined;
    });
  });

  describe('Progress time and size', () => {
    let clock;

    beforeEach(() => {
      // Upload progressing 50% every 3000 seconds, first progress event
      // after 725 seconds, so that elapsed and remaining time reach the
      // hours unit: at the second progress event 3725 s (01:02:05) have
      // elapsed and 50% of the file remains
      upload._createXhr = xhrCreator({
        size: file.size,
        connectTime: 725000,
        uploadTime: 6000000,
        stepTime: 3000000,
      });

      clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should show unknown remaining time before the first progress', async () => {
      upload.uploadFiles(file);
      await clock.tickAsync(725000);
      expect(file.status).to.contain('unknown remaining time');
    });

    it('should update elapsed and remaining time on progress', async () => {
      upload.uploadFiles(file);
      await clock.tickAsync(3725000);
      expect(file.elapsed).to.equal(3725);
      expect(file.elapsedStr).to.equal('01:02:05');
      expect(file.remaining).to.equal(3725);
      expect(file.remainingStr).to.equal('01:02:05');
      expect(file.loadedStr).to.equal('50 kB');
      expect(file.status).to.contain('remaining time: ');
    });

    it('should have infinite remaining time before any bytes are transferred', async () => {
      upload.uploadFiles(file);
      await clock.tickAsync(725000);
      expect(file.remaining).to.equal(Infinity);
      expect(file.status).to.equal('100 kB: 0% (unknown remaining time)');
    });

    it('should compute upload speed from the total file size', async () => {
      upload._createXhr = xhrCreator({
        size: file.size,
        connectTime: 10,
        uploadTime: 200,
        stepTime: 50,
      });
      upload.uploadFiles(file);
      // First progress event: elapsed 0.01s, loaded 0
      await clock.tickAsync(10);
      expect(file.speed).to.equal(9765);
      // Second progress event: elapsed 0.06s, loaded 25000
      await clock.tickAsync(50);
      expect(file.speed).to.equal(1627);
      expect(file.remaining).to.equal(1);
    });
  });

  describe('Invalid configuration', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should upload using a lowercase method', async () => {
      const lowercaseUpload = fixtureSync(`<vaadin-upload method="put" target="/api/endpoint"></vaadin-upload>`);
      lowercaseUpload._createXhr = xhrCreator({ size: file.size, uploadTime: 10, stepTime: 5 });

      // Capture the method that the component passes to the request
      let requestMethod;
      lowercaseUpload.addEventListener('upload-before', (e) => {
        const originalOpen = e.detail.xhr.open;
        e.detail.xhr.open = function (method, ...args) {
          requestMethod = method;
          return originalOpen.call(this, method, ...args);
        };
      });

      const startSpy = sinon.spy();
      lowercaseUpload.addEventListener('upload-start', startSpy);
      lowercaseUpload.uploadFiles(file);
      await clock.tickAsync(50);

      expect(startSpy).to.be.calledOnce;
      expect(requestMethod).to.equal('put');
      expect(startSpy.firstCall.args[0].detail.xhr.url).to.equal('/api/endpoint');
    });

    it('should upload using an unsupported method', async () => {
      upload.method = 'DELETE';
      await nextUpdate(upload);
      upload._createXhr = xhrCreator({ size: file.size, uploadTime: 10, stepTime: 5 });

      const startSpy = sinon.spy();
      upload.addEventListener('upload-start', startSpy);
      upload.uploadFiles(file);

      expect(startSpy).to.be.calledOnce;
      expect(startSpy.firstCall.args[0].detail.xhr.method).to.equal('DELETE');
      expect(startSpy.firstCall.args[0].detail.xhr.url).to.equal('https://foo.com/bar');
      await clock.tickAsync(50);
    });

    it('should treat negative maxFiles as no limit', async () => {
      upload.maxFiles = -1;
      await nextUpdate(upload);
      upload._createXhr = xhrCreator({ size: 100, uploadTime: 10, stepTime: 5 });

      addFilesViaInput(upload, createFiles(2, 100, 'application/x-octet-stream'));
      expect(upload.files).to.have.lengthOf(2);
      expect(upload.maxFilesReached).to.be.false;
      await clock.tickAsync(50);
    });

    it('should pause uploads when maxConcurrentUploads is non-positive', async () => {
      upload.maxConcurrentUploads = 0;
      await nextUpdate(upload);
      upload._createXhr = xhrCreator({ size: file.size, uploadTime: 10, stepTime: 5 });

      const startSpy = sinon.spy();
      upload.addEventListener('upload-start', startSpy);
      upload.uploadFiles(file);
      await clock.tickAsync(50);

      expect(startSpy).to.not.be.called;
    });
  });

  describe('Manual Upload', () => {
    let files;

    beforeEach(() => {
      upload.noAuto = true;
      upload._createXhr = xhrCreator({ size: file.size, uploadTime: 200, stepTime: 50 });
    });

    it('should be in held status', async () => {
      addFilesViaInput(upload, [file]);
      await nextRender();
      expect(file.uploaded).not.to.be.ok;
      expect(file.held).to.be.true;
      expect(file.status).to.be.equal(upload.i18n.uploading.status.held);
    });

    it('should initialize loaded to zero when a file is added', async () => {
      addFilesViaInput(upload, [file]);
      await nextRender();
      expect(file.loaded).to.equal(0);
    });

    it('should set held status when using a custom file list', async () => {
      // The default file list re-computes file.status on its own, so use
      // a custom file list element to cover the status set by the mixin
      const customUpload = fixtureSync(`<vaadin-upload><div slot="file-list"></div></vaadin-upload>`);
      customUpload.noAuto = true;
      await nextRender();
      addFilesViaInput(customUpload, [file]);
      expect(file.status).to.equal('Queued');
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

    it('should start a file upload from the file-start event', async () => {
      addFilesViaInput(upload, [file]);

      await nextRender();

      expect(file.uploaded).not.to.be.ok;
      expect(file.held).to.be.true;
      expect(file.status).to.be.equal(upload.i18n.uploading.status.held);

      const startSpy = sinon.spy();
      upload.addEventListener('upload-start', startSpy);

      upload.dispatchEvent(
        new CustomEvent('file-start', {
          detail: { file },
          cancelable: true,
        }),
      );

      await nextRender();
      expect(startSpy.calledOnce).to.be.true;
      const e = startSpy.firstCall.args[0];

      expect(e.detail.xhr).to.be.ok;
      expect(e.detail.file).to.be.ok;
      expect(e.detail.file.uploading).to.be.ok;
    });

    it('should upload a complete file again on file-start', async () => {
      addFilesViaInput(upload, [file]);
      await nextRender();

      upload.uploadFiles();
      await oneEvent(upload, 'upload-success');
      expect(file.complete).to.be.true;

      const startSpy = sinon.spy();
      upload.addEventListener('upload-start', startSpy);
      upload.dispatchEvent(new CustomEvent('file-start', { detail: { file } }));
      await oneEvent(upload, 'upload-success');
      expect(startSpy).to.be.calledOnce;
      expect(file.complete).to.be.true;
    });

    it('should use the up-to-date target when starting an upload from the file-start event', async () => {
      addFilesViaInput(upload, [file]);
      await nextRender();

      upload.addEventListener('upload-before', (e) => e.preventDefault());
      upload.target = 'https://foo.com/baz';
      upload.dispatchEvent(new CustomEvent('file-start', { detail: { file } }));

      expect(file.uploadTarget).to.equal('https://foo.com/baz');
    });

    it('should clear the error when starting an upload from the file-start event', async () => {
      upload._createXhr = xhrCreator({ size: file.size, serverValidation: () => ({ status: 500 }) });
      addFilesViaInput(upload, [file]);
      await nextRender();

      upload.dispatchEvent(new CustomEvent('file-start', { detail: { file } }));
      await oneEvent(upload, 'upload-error');
      expect(file.error).to.equal('Upload failed due to server error');

      upload.addEventListener('upload-before', (e) => e.preventDefault());
      upload.dispatchEvent(new CustomEvent('file-start', { detail: { file } }));
      expect(file.error).to.be.false;
    });

    it('should use the current formDataName when uploading files added earlier', async () => {
      upload.uploadFormat = 'multipart';
      addFilesViaInput(upload, [file]);
      await nextRender();

      upload.formDataName = 'attachment';

      const requestSpy = sinon.spy((e) => e.preventDefault());
      upload.addEventListener('upload-request', requestSpy);
      upload.uploadFiles();

      const { formData, file: requestFile } = requestSpy.firstCall.args[0].detail;
      expect([...formData.keys()]).to.eql(['attachment']);
      expect(requestFile.formDataName).to.equal('attachment');
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

      addFilesViaInput(upload, files);
      await clock.tickAsync(150);

      expect(spy.calledOnce).to.be.true;
      expect(upload.files.length).to.be.equal(1);
    });

    it('should remove all files', async () => {
      upload.noAuto = true;
      addFilesViaInput(upload, files);
      await clock.tickAsync(1);

      removeFile(upload, 1);
      await clock.tickAsync(1);
      expect(upload.files.length).to.equal(1);

      removeFile(upload, 0);
      await clock.tickAsync(1);
      expect(upload.files.length).to.equal(0);
    });

    it('should fire a bubbling composed file-remove event with file in detail', async () => {
      upload.noAuto = true;
      addFilesViaInput(upload, files);
      await clock.tickAsync(1);

      const spy = sinon.spy();
      upload.addEventListener('file-remove', spy);

      const removed = upload.files[0];
      removeFile(upload, 0);
      await clock.tickAsync(1);

      expect(spy).to.be.calledOnce;
      const e = spy.firstCall.args[0];
      expect(e.detail.file).to.equal(removed);
      expect(e.bubbles).to.be.true;
      expect(e.composed).to.be.true;
    });
  });

  describe('Upload format', () => {
    let clock;

    beforeEach(() => {
      upload._createXhr = xhrCreator({ size: file.size, uploadTime: 200, stepTime: 50 });
      clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
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
      upload.uploadFiles(file);
    });

    it('should send file directly for raw format', (done) => {
      upload.uploadFormat = 'raw';
      upload.addEventListener('upload-request', (e) => {
        expect(e.detail.requestBody).to.equal(file);
        expect(e.detail.requestBody).to.be.instanceOf(Blob);
        expect(e.detail.formData).to.be.undefined;
        done();
      });
      upload.uploadFiles(file);
    });

    it('should set Content-Type header to file MIME type in raw format', (done) => {
      const pdfFile = createFile(1000, 'application/pdf');
      upload.uploadFormat = 'raw';
      upload.addEventListener('upload-request', (e) => {
        const contentType = e.detail.xhr.getRequestHeader('Content-Type');
        expect(contentType).to.equal('application/pdf');
        done();
      });
      upload.uploadFiles(pdfFile);
    });

    it('should set X-Filename header in raw format', (done) => {
      const testFile = createFile(1000, 'application/pdf');
      upload.uploadFormat = 'raw';
      upload.addEventListener('upload-request', (e) => {
        const filename = e.detail.xhr.getRequestHeader('X-Filename');
        expect(filename).to.equal(encodeURIComponent(testFile.name));
        done();
      });
      upload.uploadFiles(testFile);
    });

    it('should encode special characters in X-Filename header in raw format', (done) => {
      const testFile = createFile(1000, 'application/pdf');
      testFile.name = 'religion åk4.pdf';
      upload.uploadFormat = 'raw';
      upload.addEventListener('upload-request', (e) => {
        const filename = e.detail.xhr.getRequestHeader('X-Filename');
        expect(filename).to.equal('religion%20%C3%A5k4.pdf');
        done();
      });
      upload.uploadFiles(testFile);
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
      upload.uploadFiles(unknownFile);
    });

    it('should not set Content-Type header in multipart format', (done) => {
      upload.uploadFormat = 'multipart';
      upload.addEventListener('upload-request', (e) => {
        const contentType = e.detail.xhr.getRequestHeader('Content-Type');
        expect(contentType).to.be.undefined;
        done();
      });
      upload.uploadFiles(file);
    });

    it('should not set X-Filename header in multipart format', (done) => {
      upload.uploadFormat = 'multipart';
      upload.addEventListener('upload-request', (e) => {
        const filename = e.detail.xhr.getRequestHeader('X-Filename');
        expect(filename).to.be.undefined;
        done();
      });
      upload.uploadFiles(file);
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
      upload.uploadFiles(file);
    });

    it('should successfully complete upload in raw format', async () => {
      upload.uploadFormat = 'raw';
      const successSpy = sinon.spy();
      upload.addEventListener('upload-success', successSpy);

      upload.uploadFiles(file);
      await clock.tickAsync(400);

      expect(successSpy.calledOnce).to.be.true;
      const e = successSpy.firstCall.args[0];
      expect(e.detail.file.complete).to.be.true;
      expect(e.detail.xhr.status).to.equal(200);
    });

    it('should include uploadFormat and requestBody in upload-request event in raw format', (done) => {
      upload.uploadFormat = 'raw';
      upload.addEventListener('upload-request', (e) => {
        expect(e.detail.uploadFormat).to.equal('raw');
        expect(e.detail.requestBody).to.equal(file);
        expect(e.detail.formData).to.be.undefined;
        done();
      });
      upload.uploadFiles(file);
    });
  });

  describe('Custom file list', () => {
    let clock;

    beforeEach(async () => {
      // A custom file list does not compute file status strings on its own,
      // so these tests cover the statuses maintained by the upload mixin for
      // files added to the list
      upload = fixtureSync(`<vaadin-upload><div slot="file-list"></div></vaadin-upload>`);
      upload.target = 'https://foo.com/bar';
      await nextRender();
      upload._createXhr = xhrCreator({
        size: file.size,
        connectTime: 500,
        uploadTime: 200,
        stepTime: 100,
        serverTime: 500,
      });
      clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should set connecting status on the file when upload starts', async () => {
      addFilesViaInput(upload, [file]);
      await clock.tickAsync(200);
      expect(file.status).to.equal('Connecting...');
    });

    it('should set remaining time status on the file on progress', async () => {
      addFilesViaInput(upload, [file]);
      await clock.tickAsync(650);
      expect(file.status).to.contain('remaining time: ');
    });

    it('should clear the file status after successful upload', async () => {
      addFilesViaInput(upload, [file]);
      await clock.tickAsync(2000);
      expect(file.complete).to.be.true;
      expect(file.status).to.equal('');
    });

    it('should set translated error message on the file on failure', async () => {
      upload.i18n = { uploading: { error: { forbidden: 'Hochladen verboten' } } };
      upload._createXhr = xhrCreator({ size: file.size, serverValidation: () => ({ status: 403 }) });
      addFilesViaInput(upload, [file]);
      await clock.tickAsync(100);
      expect(file.error).to.equal('Hochladen verboten');
    });
  });

  describe('theme', () => {
    it('should propagate theme to file list', async () => {
      upload.setAttribute('theme', 'thumbnails');
      await nextUpdate(upload);
      expect(upload._fileList.getAttribute('theme')).to.equal('thumbnails');
    });

    it('should update file list theme when theme changes', async () => {
      upload.setAttribute('theme', 'thumbnails');
      await nextUpdate(upload);
      expect(upload._fileList.getAttribute('theme')).to.equal('thumbnails');

      upload.setAttribute('theme', 'other');
      await nextUpdate(upload);
      expect(upload._fileList.getAttribute('theme')).to.equal('other');
    });

    it('should remove file list theme when theme is removed', async () => {
      upload.setAttribute('theme', 'thumbnails');
      await nextUpdate(upload);
      expect(upload._fileList.getAttribute('theme')).to.equal('thumbnails');

      upload.removeAttribute('theme');
      await nextUpdate(upload);
      expect(upload._fileList.getAttribute('theme')).to.be.null;
    });
  });
});
