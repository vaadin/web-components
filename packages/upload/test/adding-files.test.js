import { expect } from '@vaadin/chai-plugins';
import { change, fixtureSync, nextFrame, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload.js';
import {
  createFile,
  createFiles,
  createFileSystemDirectoryEntry,
  createFileSystemFileEntry,
  createUnreadableFileSystemDirectoryEntry,
  createUnreadableFileSystemFileEntry,
  touchDevice,
  xhrCreator,
} from './helpers.js';

describe('adding files', () => {
  let upload, files;
  const testFileSize = 512;

  beforeEach(async () => {
    upload = fixtureSync(`<vaadin-upload></vaadin-upload>`);
    upload.target = 'https://foo.com/bar';
    upload._createXhr = xhrCreator({ size: testFileSize, uploadTime: 200, stepTime: 50 });
    await nextRender();
    files = createFiles(2, testFileSize, 'application/x-octet-stream');
  });

  describe('files property', () => {
    it('should push files to `files` Array property', () => {
      expect(upload).to.have.property('files').that.is.an('array').that.is.empty;

      files.forEach(upload._addFile.bind(upload));
      expect(upload.files[0]).to.equal(files[1]);
      expect(upload.files[1]).to.equal(files[0]);
    });

    it('should notify files property changes', async () => {
      const spy = sinon.spy();
      upload.addEventListener('files-changed', spy);
      upload.files = files;
      await nextUpdate(upload);
      expect(spy.calledOnce).to.be.true;
    });

    it('should add files on input change', () => {
      const input = upload.$.fileInput;

      // We can't simply assign `files` property of input[type="file"].
      // Tweaking __proto__ to make it assignable below.
      Object.setPrototypeOf(input, HTMLElement.prototype);
      input.files = files;

      change(input);

      expect(upload.files[0]).to.equal(files[1]);
      expect(upload.files[1]).to.equal(files[0]);
    });
  });

  (touchDevice ? describe.skip : describe)('Dropping file', () => {
    // Using dispatchEvent instead of fire in this case because
    // we have to pass the info in the dataTransfer property
    function createDndEvent(type, entries = []) {
      const e = new Event(type);
      const items = entries.map((entry) => ({
        webkitGetAsEntry() {
          return entry;
        },
      }));
      const files = entries.filter((entry) => !!entry).map((entry) => entry._file);
      e.dataTransfer = { items, files };
      return e;
    }

    it('should set dragover attribute on dragover', async () => {
      expect(upload._dragover).not.to.be.ok;
      expect(upload.hasAttribute('dragover')).to.be.false;
      upload.dispatchEvent(createDndEvent('dragover'));
      await nextUpdate(upload);
      expect(upload._dragover).to.be.ok;
      expect(upload.hasAttribute('dragover')).to.be.true;
    });

    it('should remove dragover attribute on dragleave', async () => {
      upload.dispatchEvent(createDndEvent('dragover'));
      await nextUpdate(upload);
      expect(upload._dragover).to.be.ok;
      expect(upload.hasAttribute('dragover')).to.be.true;
      upload.dispatchEvent(createDndEvent('dragleave'));
      await nextUpdate(upload);
      expect(upload._dragover).not.to.be.ok;
      expect(upload.hasAttribute('dragover')).to.be.false;
    });

    it('should have dragover-valid attribute when drop is allowed', async () => {
      upload.dispatchEvent(createDndEvent('dragover'));
      await nextUpdate(upload);

      expect(upload.hasAttribute('dragover')).to.be.true;
      expect(upload.hasAttribute('dragover-valid')).to.be.true;
    });

    it('should not have dragover-valid attribute when max files added', async () => {
      upload.maxFiles = 1;
      upload._addFile(createFile(100, 'image/jpeg'));
      await nextUpdate(upload);

      upload.dispatchEvent(createDndEvent('dragover'));
      await nextUpdate(upload);

      expect(upload.hasAttribute('dragover')).to.be.true;
      expect(upload.hasAttribute('dragover-valid')).to.be.false;
    });

    it('should not have dragover-valid attribute when disabled', async () => {
      upload.disabled = true;
      upload._addFile(createFile(100, 'image/jpeg'));
      await nextUpdate(upload);

      upload.dispatchEvent(createDndEvent('dragover'));
      await nextUpdate(upload);

      expect(upload.hasAttribute('dragover')).to.be.true;
      expect(upload.hasAttribute('dragover-valid')).to.be.false;
    });

    it('should set drop effect to copy when drop is allowed', () => {
      const event = createDndEvent('dragover');
      upload.dispatchEvent(event);

      expect(event.dataTransfer.dropEffect).to.equal('copy');
    });

    it('should set drop effect to none when max files reached', () => {
      upload.maxFiles = 1;
      upload._addFile(createFile(100, 'image/jpeg'));

      const event = createDndEvent('dragover');
      upload.dispatchEvent(event);

      expect(event.dataTransfer.dropEffect).to.equal('none');
    });

    it('should set drop effect to none when disabled', () => {
      upload.disabled = true;

      const event = createDndEvent('dragover');
      upload.dispatchEvent(event);

      expect(event.dataTransfer.dropEffect).to.equal('none');
    });

    it('should add files on drop', async () => {
      const entry1 = createFileSystemFileEntry(100, 'image/jpeg');
      const entry2 = createFileSystemFileEntry(200, 'text/plain');
      const dropEvent = createDndEvent('drop', [entry1, entry2]);
      upload.dispatchEvent(dropEvent);
      await nextUpdate(upload);
      await nextFrame();

      expect(upload.files.length).to.equal(2);
      expect(upload.files).to.include(entry1._file);
      expect(upload.files).to.include(entry2._file);
    });

    it('should add files from directories on drop', async () => {
      // Drop combination of files and nested directories:
      // - fileEntry
      // - directoryEntry
      //   - directoryFileEntry
      //   - subDirectoryEntry
      //     - subDirectoryFileEntry1
      //     - subDirectoryFileEntry2
      const subDirectoryFileEntry1 = createFileSystemFileEntry(100, 'image/jpeg');
      const subDirectoryFileEntry2 = createFileSystemFileEntry(200, 'text/plain');
      const subDirectoryEntry = createFileSystemDirectoryEntry([subDirectoryFileEntry1, subDirectoryFileEntry2]);

      const directoryFileEntry = createFileSystemFileEntry(300, 'text/xml');
      const directoryEntry = createFileSystemDirectoryEntry([directoryFileEntry, subDirectoryEntry]);
      const fileEntry = createFileSystemFileEntry(400, 'image/png');

      const dropEvent = createDndEvent('drop', [fileEntry, directoryEntry]);
      upload.dispatchEvent(dropEvent);
      await nextUpdate(upload);
      await nextFrame();

      expect(upload.files.length).to.equal(4);
      expect(upload.files).to.include(fileEntry._file);
      expect(upload.files).to.include(directoryFileEntry._file);
      expect(upload.files).to.include(subDirectoryFileEntry1._file);
      expect(upload.files).to.include(subDirectoryFileEntry2._file);
    });

    it('should handle non-file entries on drop', async () => {
      const fileEntry = createFileSystemFileEntry(100, 'text/plain');
      const dropEvent = createDndEvent('drop', [fileEntry, null]);
      upload.dispatchEvent(dropEvent);
      await nextUpdate(upload);
      await nextFrame();

      expect(upload.files.length).to.equal(1);
      expect(upload.files).to.include(fileEntry._file);
    });

    it('should read files from dataTransfer.files if there are no directories', async () => {
      const fileEntry = createFileSystemFileEntry(100, 'text/plain');
      const file1 = createFile(100, 'image/jpeg');
      const file2 = createFile(200, 'text/plain');
      const dropEvent = new Event('drop');
      dropEvent.dataTransfer = {
        items: [
          {
            webkitGetAsEntry() {
              return fileEntry;
            },
          },
        ],
        files: [file1, file2],
      };
      upload.dispatchEvent(dropEvent);
      await nextUpdate(upload);
      await nextFrame();

      expect(upload.files.length).to.equal(2);
      expect(upload.files).to.include(file1);
      expect(upload.files).to.include(file2);
    });

    it('should read files from dataTransfer.items if there are directories', async () => {
      const fileEntry = createFileSystemFileEntry(100, 'text/plain');
      const directoryEntry = createFileSystemDirectoryEntry([fileEntry]);
      const file1 = createFile(100, 'image/jpeg');
      const file2 = createFile(200, 'text/plain');
      const dropEvent = new Event('drop');
      dropEvent.dataTransfer = {
        items: [
          {
            webkitGetAsEntry() {
              return directoryEntry;
            },
          },
        ],
        files: [file1, file2],
      };
      upload.dispatchEvent(dropEvent);
      await nextUpdate(upload);
      await nextFrame();

      expect(upload.files.length).to.equal(1);
      expect(upload.files).to.include(fileEntry._file);
    });

    it('should handle errors when reading from files or directories on drop', async () => {
      const fileEntry = createFileSystemFileEntry(100, 'text/plain');
      const unreadableFileEntry = createUnreadableFileSystemFileEntry();
      const unreadableDirectoryEntry = createUnreadableFileSystemDirectoryEntry();
      const dropEvent = createDndEvent('drop', [fileEntry, unreadableFileEntry, unreadableDirectoryEntry]);
      upload.dispatchEvent(dropEvent);
      await nextUpdate(upload);
      await nextFrame();

      expect(upload.files.length).to.equal(1);
      expect(upload.files).to.include(fileEntry._file);
    });

    it('should not add files on drop when disabled', async () => {
      upload.disabled = true;
      const entry1 = createFileSystemFileEntry(100, 'image/jpeg');
      const entry2 = createFileSystemFileEntry(200, 'text/plain');
      const dropEvent = createDndEvent('drop', [entry1, entry2]);
      upload.dispatchEvent(dropEvent);
      await nextUpdate(upload);
      await nextFrame();

      expect(upload.files.length).to.equal(0);
    });

    describe('nodrop flag', () => {
      let fileAddSpy, dropEvent;

      beforeEach(() => {
        fileAddSpy = sinon.spy();
        upload.addEventListener('files-changed', fileAddSpy);
        dropEvent = createDndEvent('drop', [createFileSystemFileEntry(testFileSize, 'application/x-octet-stream')]);
      });

      it('should fire `files-changed` event when dropping files and drop is enabled', async () => {
        upload.nodrop = false;
        upload.dispatchEvent(dropEvent);
        await nextUpdate(upload);
        await nextFrame();
        expect(fileAddSpy.called).to.be.true;
      });

      it('should not fire `files-changed` event when dropping files and drop is disabled', async () => {
        upload.nodrop = true;
        upload.dispatchEvent(dropEvent);
        await nextUpdate(upload);
        await nextFrame();
        expect(fileAddSpy.called).to.be.false;
      });

      it('should not set dragover property on dragover', async () => {
        upload.nodrop = true;
        await nextUpdate(upload);
        expect(upload._dragover).not.to.be.ok;
        expect(upload.hasAttribute('dragover')).to.be.false;
        upload.dispatchEvent(createDndEvent('dragover'));
        await nextUpdate(upload);
        expect(upload._dragover).not.to.be.ok;
        expect(upload.hasAttribute('dragover')).to.be.false;
      });

      it('should not set dragoverValid property on dragover', async () => {
        upload.nodrop = true;
        await nextUpdate(upload);
        expect(upload._dragoverValid).not.to.be.ok;
        expect(upload.hasAttribute('dragover')).to.be.false;
        upload.dispatchEvent(createDndEvent('dragover'));
        await nextUpdate(upload);
        expect(upload._dragoverValid).not.to.be.ok;
        expect(upload.hasAttribute('dragover')).to.be.false;
      });

      it('should hide `drop files here` label and icon when drop is disabled', async () => {
        upload.nodrop = true;
        await nextUpdate(upload);
        expect(window.getComputedStyle(upload.$.dropLabelContainer).display).to.equal('none');
      });
    });
  });

  describe('start upload', () => {
    it('should automatically start upload', () => {
      upload.maxConcurrentUploads = 1;
      const uploadStartSpy = sinon.spy();
      upload.addEventListener('upload-start', uploadStartSpy);

      files.forEach(upload._addFile.bind(upload));
      // With queue behavior, only the first file starts uploading immediately
      expect(uploadStartSpy.calledOnce).to.be.true;

      // Files are prepended, so the first file added is at index 1
      expect(upload.files[1].held).to.be.false;
      expect(upload.files[1].uploading).to.be.true;

      // Second file (at index 0) should be queued
      expect(upload.files[0].held).to.be.true;
      expect(upload.files[0].uploading).to.be.true;
    });

    it('should not automatically start upload when noAuto flag is set', () => {
      const uploadStartSpy = sinon.spy();
      upload.noAuto = true;
      upload.addEventListener('upload-start', uploadStartSpy);

      files.forEach(upload._addFile.bind(upload));
      expect(uploadStartSpy.called).to.be.false;
      expect(upload.files[0].held).to.be.true;
      expect(upload.files[0].uploading).to.not.be.true;
    });
  });

  describe('validate files', () => {
    let file;

    beforeEach(() => {
      file = createFile(testFileSize, 'application/x-octet-stream');
    });

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

    it('should allow files with extensions containing multiple dots', () => {
      upload.accept = 'image/*,.bar.baz,video/*';
      file.name = 'foo.bar.baz';
      upload._addFiles([file]);
      expect(upload.files).to.have.lengthOf(1);
    });

    it('should reject files that have partial extension match', () => {
      upload.accept = 'image/*,.bar.baz,video/*';
      file.name = 'foo.baz';
      upload._addFiles([file]);
      expect(upload.files).to.have.lengthOf(0);
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
