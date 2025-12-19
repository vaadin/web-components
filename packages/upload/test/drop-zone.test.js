import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload-drop-zone.js';
import { UploadManager } from '../src/vaadin-upload-manager.js';
import {
  createFile,
  createFileSystemDirectoryEntry,
  createFileSystemFileEntry,
  createUnreadableFileSystemDirectoryEntry,
  createUnreadableFileSystemFileEntry,
  touchDevice,
} from './helpers.js';

describe('vaadin-upload-drop-zone', () => {
  let dropZone;

  beforeEach(async () => {
    dropZone = fixtureSync(`
      <vaadin-upload-drop-zone>
        <div class="content">Drop files here</div>
      </vaadin-upload-drop-zone>
    `);
    await nextRender();
  });

  function createDndEvent(type, entries = []) {
    const e = new Event(type, { bubbles: true });
    const items = entries.map((entry) => ({
      webkitGetAsEntry() {
        return entry;
      },
    }));
    const files = entries.filter((entry) => !!entry && entry._file).map((entry) => entry._file);
    e.dataTransfer = { items, files, dropEffect: 'none' };
    return e;
  }

  describe('basic', () => {
    it('should render slotted content', () => {
      const content = dropZone.querySelector('.content');
      expect(content).to.exist;
      expect(content.textContent).to.equal('Drop files here');
    });

    it('should have target property defaulting to null', () => {
      expect(dropZone.target).to.be.null;
    });
  });

  (touchDevice ? describe.skip : describe)('drag and drop', () => {
    it('should set dragover attribute on dragover', async () => {
      expect(dropZone.hasAttribute('dragover')).to.be.false;

      dropZone.dispatchEvent(createDndEvent('dragover'));
      await nextFrame();

      expect(dropZone.hasAttribute('dragover')).to.be.true;
    });

    it('should remove dragover attribute on dragleave', async () => {
      dropZone.dispatchEvent(createDndEvent('dragover'));
      await nextFrame();
      expect(dropZone.hasAttribute('dragover')).to.be.true;

      dropZone.dispatchEvent(createDndEvent('dragleave'));
      await nextFrame();
      expect(dropZone.hasAttribute('dragover')).to.be.false;
    });

    it('should remove dragover attribute on drop', async () => {
      dropZone.dispatchEvent(createDndEvent('dragover'));
      await nextFrame();
      expect(dropZone.hasAttribute('dragover')).to.be.true;

      const entry = createFileSystemFileEntry(100, 'text/plain');
      dropZone.dispatchEvent(createDndEvent('drop', [entry]));
      await nextFrame();
      expect(dropZone.hasAttribute('dragover')).to.be.false;
    });

    it('should set drop effect to copy on dragover', () => {
      const event = createDndEvent('dragover');
      dropZone.dispatchEvent(event);
      expect(event.dataTransfer.dropEffect).to.equal('copy');
    });

    it('should prevent default on dragover', () => {
      const event = createDndEvent('dragover');
      const preventDefaultSpy = sinon.spy(event, 'preventDefault');
      dropZone.dispatchEvent(event);
      expect(preventDefaultSpy.calledOnce).to.be.true;
    });

    it('should prevent default on dragleave', () => {
      const event = createDndEvent('dragleave');
      const preventDefaultSpy = sinon.spy(event, 'preventDefault');
      dropZone.dispatchEvent(event);
      expect(preventDefaultSpy.calledOnce).to.be.true;
    });

    it('should prevent default on drop', async () => {
      const entry = createFileSystemFileEntry(100, 'text/plain');
      const event = createDndEvent('drop', [entry]);
      const preventDefaultSpy = sinon.spy(event, 'preventDefault');
      dropZone.dispatchEvent(event);
      await nextFrame();
      expect(preventDefaultSpy.calledOnce).to.be.true;
    });
  });

  (touchDevice ? describe.skip : describe)('files-dropped event', () => {
    it('should dispatch files-dropped event when files are dropped', async () => {
      const entry1 = createFileSystemFileEntry(100, 'image/jpeg');
      const entry2 = createFileSystemFileEntry(200, 'text/plain');

      const eventSpy = sinon.spy();
      dropZone.addEventListener('files-dropped', eventSpy);

      dropZone.dispatchEvent(createDndEvent('drop', [entry1, entry2]));
      await nextFrame();

      expect(eventSpy.calledOnce).to.be.true;
      expect(eventSpy.firstCall.args[0].detail.files).to.have.lengthOf(2);
      expect(eventSpy.firstCall.args[0].detail.files).to.include(entry1._file);
      expect(eventSpy.firstCall.args[0].detail.files).to.include(entry2._file);
    });

    it('should bubble and be composed', async () => {
      const entry = createFileSystemFileEntry(100, 'text/plain');

      const eventSpy = sinon.spy();
      dropZone.addEventListener('files-dropped', eventSpy);

      dropZone.dispatchEvent(createDndEvent('drop', [entry]));
      await nextFrame();

      const event = eventSpy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it('should handle directories on drop', async () => {
      const subFileEntry1 = createFileSystemFileEntry(100, 'image/jpeg');
      const subFileEntry2 = createFileSystemFileEntry(200, 'text/plain');
      const directoryEntry = createFileSystemDirectoryEntry([subFileEntry1, subFileEntry2]);
      const fileEntry = createFileSystemFileEntry(300, 'image/png');

      const eventSpy = sinon.spy();
      dropZone.addEventListener('files-dropped', eventSpy);

      dropZone.dispatchEvent(createDndEvent('drop', [fileEntry, directoryEntry]));
      await nextFrame();

      expect(eventSpy.calledOnce).to.be.true;
      expect(eventSpy.firstCall.args[0].detail.files).to.have.lengthOf(3);
    });

    it('should handle nested directories on drop', async () => {
      const nestedFileEntry = createFileSystemFileEntry(100, 'text/plain');
      const nestedDirectoryEntry = createFileSystemDirectoryEntry([nestedFileEntry]);
      const directoryEntry = createFileSystemDirectoryEntry([nestedDirectoryEntry]);

      const eventSpy = sinon.spy();
      dropZone.addEventListener('files-dropped', eventSpy);

      dropZone.dispatchEvent(createDndEvent('drop', [directoryEntry]));
      await nextFrame();

      expect(eventSpy.calledOnce).to.be.true;
      expect(eventSpy.firstCall.args[0].detail.files).to.have.lengthOf(1);
      expect(eventSpy.firstCall.args[0].detail.files).to.include(nestedFileEntry._file);
    });

    it('should handle non-file entries on drop', async () => {
      const fileEntry = createFileSystemFileEntry(100, 'text/plain');

      const eventSpy = sinon.spy();
      dropZone.addEventListener('files-dropped', eventSpy);

      dropZone.dispatchEvent(createDndEvent('drop', [fileEntry, null]));
      await nextFrame();

      expect(eventSpy.calledOnce).to.be.true;
      expect(eventSpy.firstCall.args[0].detail.files).to.have.lengthOf(1);
    });

    it('should read files from dataTransfer.files if there are no directories', async () => {
      const file1 = createFile(100, 'image/jpeg');
      const file2 = createFile(200, 'text/plain');
      const fileEntry = createFileSystemFileEntry(100, 'text/plain');

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

      const eventSpy = sinon.spy();
      dropZone.addEventListener('files-dropped', eventSpy);

      dropZone.dispatchEvent(dropEvent);
      await nextFrame();

      expect(eventSpy.firstCall.args[0].detail.files).to.have.lengthOf(2);
      expect(eventSpy.firstCall.args[0].detail.files).to.include(file1);
      expect(eventSpy.firstCall.args[0].detail.files).to.include(file2);
    });

    it('should handle errors when reading from files on drop', async () => {
      const fileEntry = createFileSystemFileEntry(100, 'text/plain');
      const unreadableFileEntry = createUnreadableFileSystemFileEntry();

      const eventSpy = sinon.spy();
      dropZone.addEventListener('files-dropped', eventSpy);

      dropZone.dispatchEvent(createDndEvent('drop', [fileEntry, unreadableFileEntry]));
      await nextFrame();

      expect(eventSpy.firstCall.args[0].detail.files).to.have.lengthOf(1);
    });

    it('should handle errors when reading from directories on drop', async () => {
      const fileEntry = createFileSystemFileEntry(100, 'text/plain');
      const unreadableDirectoryEntry = createUnreadableFileSystemDirectoryEntry();

      const eventSpy = sinon.spy();
      dropZone.addEventListener('files-dropped', eventSpy);

      dropZone.dispatchEvent(createDndEvent('drop', [fileEntry, unreadableDirectoryEntry]));
      await nextFrame();

      expect(eventSpy.firstCall.args[0].detail.files).to.have.lengthOf(1);
    });
  });

  (touchDevice ? describe.skip : describe)('target integration', () => {
    let manager;

    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
    });

    afterEach(() => {
      manager.destroy();
    });

    it('should call addFiles on target when files are dropped', async () => {
      dropZone.target = manager;
      const addFilesSpy = sinon.spy(manager, 'addFiles');

      const entry1 = createFileSystemFileEntry(100, 'image/jpeg');
      const entry2 = createFileSystemFileEntry(200, 'text/plain');
      dropZone.dispatchEvent(createDndEvent('drop', [entry1, entry2]));
      await nextFrame();

      expect(addFilesSpy.calledOnce).to.be.true;
      expect(addFilesSpy.firstCall.args[0]).to.have.lengthOf(2);
    });

    it('should not call addFiles when target is null', async () => {
      const entry = createFileSystemFileEntry(100, 'image/jpeg');
      dropZone.dispatchEvent(createDndEvent('drop', [entry]));
      await nextFrame();

      // Should not throw - just dispatch event without calling addFiles
    });

    it('should work with any object that has addFiles method', async () => {
      const customTarget = {
        addFiles: sinon.spy(),
      };
      dropZone.target = customTarget;

      const entry = createFileSystemFileEntry(100, 'image/jpeg');
      dropZone.dispatchEvent(createDndEvent('drop', [entry]));
      await nextFrame();

      expect(customTarget.addFiles.calledOnce).to.be.true;
    });
  });
});
