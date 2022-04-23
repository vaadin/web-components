import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-upload.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { createFile, createFiles, xhrCreator } from './common.js';

describe('upload', () => {
  let upload, file;

  beforeEach(() => {
    upload = fixtureSync(`<vaadin-upload></vaadin-upload>`);
    upload.target = 'http://foo.com/bar';
    file = createFile(100000, 'application/unknown');
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

      it('should apply the capture attribute to the input', function () {
        var input = upload.$.fileInput;
        var captureType = 'camera';
        upload.capture = captureType;
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
          this.data.push({ name: name, value: value, filename: filename });
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
              status: status,
              statusText: 'Error'
            };
          }
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
        it('should fail with forbidden error for status code ' + status, async () => {
          await expectResponseErrorForStatus(upload.i18n.uploading.error.forbidden, status);
        });
      });

      [500, 501, 502, 503, 504].forEach((status) => {
        it('should fail with unexpected error for status code ' + status, async () => {
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
        serverTime: 500
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
        stepTime: 2500
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
      await nextRender(upload);
      expect(file.uploaded).not.to.be.ok;
      expect(file.held).to.be.true;
      expect(file.status).to.be.equal(upload.i18n.uploading.status.held);
    });

    it('should start uploading non-completed files after call to uploadFiles', (done) => {
      let counter = 0;
      files = createFiles(3, 512, 'application/json');
      upload.files = files;
      upload.files[1].complete = true;

      for (let i = 0; i < upload.files.length; i++) {
        expect(upload.files[i].uploading).not.to.be.ok;
      }
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

      for (let i = 0; i < upload.files.length; i++) {
        expect(upload.files[i].uploading).not.to.be.ok;
      }
      upload.addEventListener('upload-start', (e) => {
        expect(e.detail.xhr).to.be.ok;
        expect(e.detail.file).to.be.ok;
        expect(e.detail.file.name).to.equal(tempFileName);
        expect(e.detail.file.uploading).to.be.ok;

        for (let i = 0; i < upload.files.length - 1; i++) {
          expect(upload.files[i].uploading).not.to.be.ok;
        }
        done();
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
      afterNextRender(upload, () => {
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
            cancelable: true
          })
        );
      });
    });
  });

  describe('Abort Files', () => {
    let files, clock;

    beforeEach(() => {
      upload._createXhr = xhrCreator({ size: file.size, uploadTime: 200, stepTime: 50 });
      files = createFiles(2, 512, 'application/json');
      clock = sinon.useFakeTimers({
        shouldClearNativeTimers: true
      });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should fire `file-remove` and remove from files', async () => {
      upload.addEventListener('upload-progress', (e) => {
        if (e.detail.file === files[0] && e.detail.file.progress === 50) {
          upload._abortFileUpload(e.detail.file);
        }
      });

      const spy = sinon.spy();
      upload.addEventListener('file-remove', spy);

      upload._addFiles(files);
      await clock.tickAsync(150);

      expect(spy.calledOnce).to.be.true;
      expect(upload.files.length).to.be.equal(1);
    });

    it('should remove all files', (done) => {
      const removeFirst = () => {
        if (upload.files.length === 0) {
          done();
        } else {
          clock.tickAsync(1).then(() => {
            upload._abortFileUpload(upload.files[0]);
          });
        }
      };

      upload.noAuto = true;
      upload._addFiles(files);
      upload.addEventListener('file-remove', removeFirst);
      removeFirst();
    });
  });

  describe('maxFiles change', () => {
    it('should show `Add Files` labels in plural when maxFiles is not 1', () => {
      upload.maxFiles = 3;
      expect(upload.$.dropLabel.textContent.indexOf(upload.i18n.dropFiles.many) >= 0).to.be.true;
      expect(upload.$.addButton.textContent.indexOf(upload.i18n.addFiles.many) >= 0).to.be.true;
    });

    it('should show `Add File` labels in singular when maxFiles is 1', () => {
      upload.maxFiles = 1;
      expect(upload.$.dropLabel.textContent.indexOf(upload.i18n.dropFiles.one) >= 0).to.be.true;
      expect(upload.$.addButton.textContent.indexOf(upload.i18n.addFiles.one) >= 0).to.be.true;
    });
  });
});
