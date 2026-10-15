import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload.js';
import {
  addFilesViaInput,
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
    it('should prepend files to `files` Array property when adding via input', () => {
      expect(upload).to.have.property('files').that.is.an('array').that.is.empty;

      addFilesViaInput(upload, files);
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

    it('should not validate files assigned to the files property', async () => {
      upload.maxFileSize = testFileSize - 1;
      await nextUpdate(upload);

      const rejectSpy = sinon.spy();
      upload.addEventListener('file-reject', rejectSpy);
      upload.files = files;
      await nextUpdate(upload);

      expect(rejectSpy).to.not.be.called;
      expect(upload.files).to.have.lengthOf(2);
    });

    it('should allow files not matching the accept filter to be assigned', async () => {
      upload.accept = 'image/*';
      await nextUpdate(upload);

      const rejectSpy = sinon.spy();
      upload.addEventListener('file-reject', rejectSpy);
      // Represent previously uploaded files
      upload.files = files.map((file) => Object.assign(file, { complete: true }));
      await nextUpdate(upload);

      expect(rejectSpy).to.not.be.called;
      expect(upload.files).to.have.lengthOf(2);
    });

    it('should allow more files than maxFiles to be assigned', async () => {
      upload.maxFiles = 1;
      await nextUpdate(upload);

      const rejectSpy = sinon.spy();
      upload.addEventListener('file-reject', rejectSpy);
      upload.files = files;
      await nextUpdate(upload);

      expect(rejectSpy).to.not.be.called;
      expect(upload.files).to.have.lengthOf(2);
      expect(upload.maxFilesReached).to.be.true;
    });

    it('should update maxFilesReached when files are assigned', async () => {
      upload.maxFiles = 1;
      upload.files = [files[0]];
      await nextUpdate(upload);
      expect(upload.maxFilesReached).to.be.true;

      upload.files = [];
      await nextUpdate(upload);
      expect(upload.maxFilesReached).to.be.false;
    });

    it('should sync files cleared by assignment after adding files via input', async () => {
      upload.noAuto = true;
      upload.maxFiles = 1;
      addFilesViaInput(upload, [files[0]]);
      await nextUpdate(upload);
      expect(upload.maxFilesReached).to.be.true;

      upload.files = [];
      await nextUpdate(upload);
      expect(upload.maxFilesReached).to.be.false;
    });

    it('should add a file with the protected _addFile method', () => {
      upload.noAuto = true;
      upload._addFile(files[0]);
      expect(upload.files[0]).to.equal(files[0]);
    });

    it('should remove a file with the protected _removeFile method', async () => {
      upload.noAuto = true;
      addFilesViaInput(upload, [files[0]]);
      await nextUpdate(upload);

      upload._removeFile(files[0]);
      expect(upload.files).to.have.lengthOf(0);
    });

    it('should not throw when calling the protected _removeFile method without a file', async () => {
      upload.noAuto = true;
      addFilesViaInput(upload, [files[0]]);
      await nextUpdate(upload);

      // Calls the protected method directly, like UploadElement in flow-components
      // does: its removeFile(index) evaluates `_removeFile(files[index])`, which
      // passes undefined when there is no file with the given index
      expect(() => upload._removeFile()).to.not.throw();
      expect(upload.files).to.have.lengthOf(1);
    });

    describe('uploading assigned files', () => {
      let clock;

      beforeEach(() => {
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
      });

      afterEach(() => {
        clock.restore();
      });

      it('should upload files assigned to the files property', async () => {
        upload.maxFileSize = testFileSize - 1;
        upload.files = [files[0]];
        upload.uploadFiles();

        await clock.tickAsync(400);
        expect(files[0].complete).to.be.true;
      });
    });
  });

  (touchDevice ? describe.skip : describe)('Dropping file', () => {
    // Using dispatchEvent instead of fire in this case because
    // we have to pass the info in the dataTransfer property
    function createDndEvent(type, entries = []) {
      // Native drag and drop events are cancelable
      const e = new Event(type, { cancelable: true });
      const items = entries.map((entry) => ({
        webkitGetAsEntry() {
          return entry;
        },
      }));
      const files = entries.filter((entry) => !!entry).map((entry) => entry._file);
      e.dataTransfer = { items, files };
      return e;
    }

    it('should prevent default on dragover', () => {
      const event = createDndEvent('dragover');
      upload.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.true;
    });

    it('should prevent default on dragleave', () => {
      const event = createDndEvent('dragleave');
      upload.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.true;
    });

    it('should prevent default on drop', () => {
      const event = createDndEvent('drop', [createFileSystemFileEntry(100, 'image/jpeg')]);
      upload.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.true;
    });

    it('should reset dragover state on drop', async () => {
      upload.dispatchEvent(createDndEvent('dragover'));
      await nextUpdate(upload);
      expect(upload.hasAttribute('dragover')).to.be.true;

      upload.dispatchEvent(createDndEvent('drop'));
      await nextUpdate(upload);
      expect(upload._dragover).to.be.false;
      expect(upload.hasAttribute('dragover')).to.be.false;
    });

    it('should remove dragover-valid attribute on dragleave', async () => {
      upload.dispatchEvent(createDndEvent('dragover'));
      await nextUpdate(upload);
      expect(upload.hasAttribute('dragover-valid')).to.be.true;

      upload.dispatchEvent(createDndEvent('dragleave'));
      await nextUpdate(upload);
      expect(upload.hasAttribute('dragover-valid')).to.be.false;
    });

    it('should set dragover attribute on dragover', async () => {
      expect(upload._dragover).not.to.be.ok;
      expect(upload.hasAttribute('dragover')).to.be.false;
      upload.dispatchEvent(createDndEvent('dragover'));
      await nextUpdate(upload);
      expect(upload._dragover).to.be.ok;
      expect(upload.hasAttribute('dragover')).to.be.true;
    });

    it('should set dragover attribute values to true on dragover', async () => {
      upload.dispatchEvent(createDndEvent('dragover'));
      await nextUpdate(upload);
      expect(upload.getAttribute('dragover')).to.equal('true');
      expect(upload.getAttribute('dragover-valid')).to.equal('true');
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
      upload.files = [createFile(100, 'image/jpeg')];
      await nextUpdate(upload);

      upload.dispatchEvent(createDndEvent('dragover'));
      await nextUpdate(upload);

      expect(upload.hasAttribute('dragover')).to.be.true;
      expect(upload.hasAttribute('dragover-valid')).to.be.false;
    });

    it('should not have dragover-valid attribute when disabled', async () => {
      upload.disabled = true;
      upload.files = [createFile(100, 'image/jpeg')];
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
      upload.files = [createFile(100, 'image/jpeg')];

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

      addFilesViaInput(upload, files);
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

      addFilesViaInput(upload, files);
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
      addFilesViaInput(upload, [file, file]);
    });

    it('should not add files over the maxFiles limit', () => {
      upload.maxFiles = 1;
      addFilesViaInput(upload, [file, createFile(testFileSize, 'application/x-octet-stream')]);
      expect(upload.files.length).to.equal(1);
    });

    it('should reject files with excessive size', (done) => {
      upload.maxFileSize = testFileSize - 1;
      upload.addEventListener('file-reject', (e) => {
        expect(e.detail.error).to.be.ok;
        done();
      });
      addFilesViaInput(upload, [file]);
    });

    it('should not add files with excessive size', () => {
      upload.maxFileSize = testFileSize - 1;
      addFilesViaInput(upload, [file]);
      expect(upload.files.length).to.equal(0);
    });

    it('should reject files with incorrect contentType', (done) => {
      upload.accept = 'image/*,video/*';
      upload.addEventListener('file-reject', (e) => {
        expect(upload.files.length).to.equal(0);
        expect(e.detail.error).to.equal('Incorrect File Type.');
        done();
      });
      addFilesViaInput(upload, [file]);
    });

    it('should allow files with correct extension', () => {
      upload.accept = 'image/*,.foo,video/*';
      file.name = 'bar.FOO';
      addFilesViaInput(upload, [file]);
      expect(upload.files.length).to.equal(1);
    });

    it('should allow files with extensions containing multiple dots', () => {
      upload.accept = 'image/*,.bar.baz,video/*';
      file.name = 'foo.bar.baz';
      addFilesViaInput(upload, [file]);
      expect(upload.files).to.have.lengthOf(1);
    });

    it('should reject files that have partial extension match', () => {
      upload.accept = 'image/*,.bar.baz,video/*';
      file.name = 'foo.baz';
      addFilesViaInput(upload, [file]);
      expect(upload.files).to.have.lengthOf(0);
    });

    it('should allow files with correct mime type', () => {
      upload.accept = 'application/x-octet-stream';
      addFilesViaInput(upload, [file]);
      expect(upload.files.length).to.equal(1);
    });

    it('should allow wildcards', () => {
      upload.accept = 'application/*';
      addFilesViaInput(upload, [file]);
      expect(upload.files.length).to.equal(1);
    });

    it('should allow files matching other than the first wildcard', () => {
      upload.accept = 'text/*,application/*,image/*,video/*,audio/*';
      addFilesViaInput(upload, [file]);
      expect(upload.files.length).to.equal(1);
    });

    it('should allow files when using regex operators in accept string', () => {
      file = createFile(testFileSize, 'image/svg+xml');
      upload.accept = 'image/svg+xml';
      addFilesViaInput(upload, [file]);
      expect(upload.files.length).to.equal(1);
    });

    it('should reject files when accept contains regex single character wildcard and file type is not an exact match', () => {
      file = createFile(testFileSize, 'application/vndxms-excel');
      upload.accept = 'application/vnd.ms-excel';
      addFilesViaInput(upload, [file]);
      expect(upload.files.length).to.equal(0);
    });
  });
});
