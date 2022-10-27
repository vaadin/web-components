import { expect } from '@esm-bundle/chai';
import { change, click, fixtureSync, makeSoloTouchEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-upload.js';
import { createFile, createFiles, touchDevice, xhrCreator } from './common.js';

describe('file list', () => {
  let upload, file, files;
  const testFileSize = 512;

  beforeEach(() => {
    upload = fixtureSync(`<vaadin-upload></vaadin-upload>`);
    upload.target = 'http://foo.com/bar';
    upload._createXhr = xhrCreator({ size: testFileSize, uploadTime: 200, stepTime: 50 });
    files = createFiles(2, testFileSize, 'application/x-octet-stream');
    file = createFile(testFileSize, 'application/x-octet-stream');
  });

  describe('files property', () => {
    it('should push files to `files` Array property', () => {
      expect(upload).to.have.property('files').that.is.an('array').that.is.empty;

      files.forEach(upload._addFile.bind(upload));
      expect(upload.files[0]).to.equal(files[1]);
      expect(upload.files[1]).to.equal(files[0]);
    });

    it('should notify files property changes', () => {
      const spy = sinon.spy();
      upload.addEventListener('files-changed', spy);
      upload.files = files;
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('with add button', () => {
    let input;
    let addButton;
    let inputClickSpy;

    beforeEach(() => {
      addButton = upload.querySelector('[slot="add-button"]');
      input = upload.$.fileInput;
      // While the synthetic "Add Files" button click event is not trusted and
      // it should generate a non-trusted click event on the hidden file input,
      // at the time of writing Chrome and Firefox still open the file dialog.
      // Use stub calling `preventDefault` to prevent dialog from opening.
      inputClickSpy = sinon.stub().callsFake((e) => e.preventDefault());
      input.addEventListener('click', inputClickSpy);
    });

    it('should open file dialog by click', () => {
      click(addButton);
      expect(inputClickSpy.calledOnce).to.be.true;
    });

    it('should open file dialog by touchend', () => {
      const event = makeSoloTouchEvent('touchend', null, addButton);
      expect(inputClickSpy.calledOnce).to.be.true;
      expect(event.defaultPrevented).to.be.true;
    });

    it('should reset input.value before dialog', () => {
      // We can't simply assign `files` property of input[type="file"].
      // Tweaking __proto__ to make it assignable below.
      Object.setPrototypeOf(input, HTMLElement.prototype);
      delete input.value;
      input.value = 'foo';

      click(addButton);
      expect(input.value).to.be.empty;
    });

    it('should add files from dialog', () => {
      // We can't simply assign `files` property of input[type="file"].
      // Tweaking __proto__ to make it assignable below.
      Object.setPrototypeOf(input, HTMLElement.prototype);
      input.files = files;

      change(input);

      expect(upload.files[0]).to.equal(files[1]);
      expect(upload.files[1]).to.equal(files[0]);
    });

    it('should disable add button when max files added', () => {
      // Enabled with default maxFiles value
      expect(addButton.disabled).to.be.false;

      upload.maxFiles = 1;
      expect(addButton.disabled).to.be.false;

      upload._addFile(createFile(100, 'image/jpeg'));
      expect(addButton.disabled).to.be.true;
    });

    it('should not open upload dialog when max files added', () => {
      upload.maxFiles = 0;
      click(addButton);
      expect(inputClickSpy.called).to.be.false;
    });

    it('should set max-files-reached style attribute when max files added', () => {
      upload.maxFiles = 0;

      expect(upload.hasAttribute('max-files-reached')).to.be.true;
    });

    it('should not set max-files-reached style attribute when less than max files added', () => {
      expect(upload.hasAttribute('max-files-reached')).to.be.false;
    });
  });

  (touchDevice ? describe.skip : describe)('Dropping file', () => {
    // Using dispatchEvent instead of fire in this cases because
    // we have to pass the info in the dataTransfer property
    function createDndEvent(type) {
      const e = new Event(type);
      e.dataTransfer = { files: createFiles(2, testFileSize, 'application/x-bin') };
      return e;
    }

    it('should set dragover property on dragover', () => {
      expect(upload._dragover).not.to.be.ok;
      expect(upload.hasAttribute('dragover')).to.be.false;
      upload.dispatchEvent(createDndEvent('dragover'));
      expect(upload._dragover).to.be.ok;
      expect(upload.hasAttribute('dragover')).to.be.true;
    });

    it('should remove dragover property on dragleave', () => {
      upload.dispatchEvent(createDndEvent('dragover'));
      expect(upload._dragover).to.be.ok;
      expect(upload.hasAttribute('dragover')).to.be.true;
      upload.dispatchEvent(createDndEvent('dragleave'));
      expect(upload._dragover).not.to.be.ok;
      expect(upload.hasAttribute('dragover')).to.be.false;
    });

    it('should not have dragover property when max files added', () => {
      upload.maxFiles = 1;
      upload._addFile(createFile(100, 'image/jpeg'));

      upload.dispatchEvent(createDndEvent('dragover'));
      expect(upload._dragover).to.be.true;
      expect(upload._dragoverValid).to.be.false;
    });

    describe('nodrop flag', () => {
      let fileAddSpy, dropEvent;

      beforeEach(() => {
        fileAddSpy = sinon.spy();
        upload.addEventListener('files-changed', fileAddSpy);
        dropEvent = createDndEvent('drop');
      });

      it('should fire `files-changed` event when dropping files and drop is enabled', () => {
        upload.nodrop = false;
        upload.dispatchEvent(dropEvent);
        expect(fileAddSpy.called).to.be.true;
      });

      it('should not fire `files-changed` event when dropping files and drop is disabled', () => {
        upload.nodrop = true;
        upload.dispatchEvent(dropEvent);
        expect(fileAddSpy.called).to.be.false;
      });

      it('should not set dragover property on dragover', () => {
        upload.nodrop = true;
        expect(upload._dragover).not.to.be.ok;
        expect(upload.hasAttribute('dragover')).to.be.false;
        upload.dispatchEvent(createDndEvent('dragover'));
        expect(upload._dragover).not.to.be.ok;
        expect(upload.hasAttribute('dragover')).to.be.false;
      });

      it('should not set dragoverValid property on dragover', () => {
        upload.nodrop = true;
        expect(upload._dragoverValid).not.to.be.ok;
        expect(upload.hasAttribute('dragover')).to.be.false;
        upload.dispatchEvent(createDndEvent('dragover'));
        expect(upload._dragoverValid).not.to.be.ok;
        expect(upload.hasAttribute('dragover')).to.be.false;
      });

      it('should hide `drop files here` label and icon when drop is disabled', () => {
        upload.nodrop = true;
        expect(window.getComputedStyle(upload.$.dropLabelContainer).display).to.equal('none');
      });
    });
  });

  describe('start upload', () => {
    it('should automatically start upload', () => {
      const uploadStartSpy = sinon.spy();
      upload.addEventListener('upload-start', uploadStartSpy);

      files.forEach(upload._addFile.bind(upload));
      expect(uploadStartSpy.calledTwice).to.be.true;
      expect(upload.files[0].held).to.be.false;
    });

    it('should not automatically start upload when noAuto flag is set', () => {
      const uploadStartSpy = sinon.spy();
      upload.noAuto = true;
      upload.addEventListener('upload-start', uploadStartSpy);

      files.forEach(upload._addFile.bind(upload));
      expect(uploadStartSpy.called).to.be.false;
      expect(upload.files[0].held).to.be.true;
    });
  });

  describe('validate files', () => {
    it('should reject files when maxFiles is reached', (done) => {
      upload.maxFiles = 1;
      upload.addEventListener('file-reject', (e) => {
        expect(e.detail.error).to.be.ok;
        done();
      });
      upload._addFiles([file, file]);
    });

    it('should reject files with excessive size', (done) => {
      upload.maxFileSize = testFileSize - 1;
      upload.addEventListener('file-reject', (e) => {
        expect(e.detail.error).to.be.ok;
        done();
      });
      upload._addFiles([file]);
    });

    it('should reject files with incorrect contentType', (done) => {
      upload.accept = 'image/*,video/*';
      upload.addEventListener('file-reject', (e) => {
        expect(upload.files.length).to.equal(0);
        expect(e.detail.error).to.equal('Incorrect File Type.');
        done();
      });
      upload._addFiles([file]);
    });

    it('should allow files with correct extension', () => {
      upload.accept = 'image/*,.foo,video/*';
      file.name = 'bar.FOO';
      upload._addFiles([file]);
      expect(upload.files.length).to.equal(1);
    });

    it('should allow files with correct mime type', () => {
      upload.accept = 'application/x-octet-stream';
      upload._addFiles([file]);
      expect(upload.files.length).to.equal(1);
    });

    it('should allow wildcards', () => {
      upload.accept = 'application/*';
      upload._addFiles([file]);
      expect(upload.files.length).to.equal(1);
    });

    it('should allow files matching other than the first wildcard', () => {
      upload.accept = 'text/*,application/*,image/*,video/*,audio/*';
      upload._addFiles([file]);
      expect(upload.files.length).to.equal(1);
    });

    it('should allow files when using regex operators in accept string', () => {
      file = createFile(testFileSize, 'image/svg+xml');
      upload.accept = 'image/svg+xml';
      upload._addFiles([file]);
      expect(upload.files.length).to.equal(1);
    });

    it('should reject files when accept contains regex single character wildcard and file type is not an exact match', () => {
      file = createFile(testFileSize, 'application/vndxms-excel');
      upload.accept = 'application/vnd.ms-excel';
      upload._addFiles([file]);
      expect(upload.files.length).to.equal(0);
    });
  });
});
