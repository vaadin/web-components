import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload-drop-zone.js';
import type { UploadDropZone } from '../src/vaadin-upload-drop-zone.js';
import { UploadManager } from '../src/vaadin-upload-manager.js';
import { createFiles } from './helpers.js';

function createDragEvent(type: string, files: File[] = [], relatedTarget?: EventTarget | null): DragEvent {
  const dataTransfer = {
    files,
    items: files.map((file) => ({
      kind: 'file',
      type: file.type,
      getAsFile: () => file,
      webkitGetAsEntry: () => ({
        isFile: true,
        isDirectory: false,
        file: (callback: (file: File) => void) => callback(file),
      }),
    })),
    dropEffect: 'none',
  };

  const event = new Event(type, { bubbles: true, cancelable: true }) as DragEvent;
  Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });
  if (relatedTarget !== undefined) {
    Object.defineProperty(event, 'relatedTarget', { value: relatedTarget });
  }
  return event;
}

function createDropEvent(files: File[]): DragEvent {
  const dataTransfer = {
    files,
    items: files.map((file) => ({
      kind: 'file',
      type: file.type,
      getAsFile: () => file,
      webkitGetAsEntry: () => ({
        isFile: true,
        isDirectory: false,
        file: (callback: (file: File) => void) => callback(file),
      }),
    })),
    dropEffect: 'none',
  };

  const event = new Event('drop', { bubbles: true, cancelable: true }) as DragEvent;
  Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });
  return event;
}

describe('vaadin-upload-drop-zone', () => {
  let dropZone: UploadDropZone;

  beforeEach(async () => {
    dropZone = fixtureSync(`<vaadin-upload-drop-zone>Drop files here</vaadin-upload-drop-zone>`);
    await nextRender();
  });

  describe('basic', () => {
    it('should render slotted content', () => {
      expect(dropZone.textContent).to.equal('Drop files here');
    });

    it('should have manager property defaulting to null', () => {
      expect(dropZone.manager).to.be.null;
    });

    it('should not have dragover attribute by default', () => {
      expect(dropZone.hasAttribute('dragover')).to.be.false;
    });
  });

  describe('drag events', () => {
    it('should set dragover attribute on dragover', async () => {
      const event = createDragEvent('dragover');
      dropZone.dispatchEvent(event);
      await nextFrame();

      expect(dropZone.hasAttribute('dragover')).to.be.true;
    });

    it('should prevent default on dragover', () => {
      const event = createDragEvent('dragover');
      dropZone.dispatchEvent(event);

      expect(event.defaultPrevented).to.be.true;
    });

    it('should set dropEffect to copy on dragover', () => {
      const event = createDragEvent('dragover');
      dropZone.dispatchEvent(event);

      expect(event.dataTransfer!.dropEffect).to.equal('copy');
    });

    it('should remove dragover attribute on dragleave', async () => {
      // First trigger dragover
      dropZone.dispatchEvent(createDragEvent('dragover'));
      await nextFrame();
      expect(dropZone.hasAttribute('dragover')).to.be.true;

      // Then trigger dragleave
      dropZone.dispatchEvent(createDragEvent('dragleave'));
      await nextFrame();
      expect(dropZone.hasAttribute('dragover')).to.be.false;
    });

    it('should prevent default on dragleave', () => {
      const event = createDragEvent('dragleave');
      dropZone.dispatchEvent(event);

      expect(event.defaultPrevented).to.be.true;
    });

    it('should not remove dragover when dragleave fires for child element', async () => {
      // Add a child element to the drop zone
      const child = document.createElement('p');
      child.textContent = 'Child element';
      dropZone.appendChild(child);
      await nextFrame();

      // Trigger dragover on drop zone
      dropZone.dispatchEvent(createDragEvent('dragover'));
      await nextFrame();
      expect(dropZone.hasAttribute('dragover')).to.be.true;

      // Simulate dragleave when entering child element (relatedTarget is the child)
      const dragleaveEvent = createDragEvent('dragleave', [], child);
      dropZone.dispatchEvent(dragleaveEvent);
      await nextFrame();

      // Should still have dragover because we're still inside the drop zone
      expect(dropZone.hasAttribute('dragover')).to.be.true;
    });

    it('should only remove dragover when leaving the drop zone entirely', async () => {
      // Add a child element
      const child = document.createElement('p');
      child.textContent = 'Child element';
      dropZone.appendChild(child);
      await nextFrame();

      // Trigger dragover
      dropZone.dispatchEvent(createDragEvent('dragover'));
      await nextFrame();
      expect(dropZone.hasAttribute('dragover')).to.be.true;

      // Simulate dragleave when leaving the drop zone entirely (relatedTarget is outside)
      const outsideElement = document.body;
      const dragleaveEvent = createDragEvent('dragleave', [], outsideElement);
      dropZone.dispatchEvent(dragleaveEvent);
      await nextFrame();

      // Should remove dragover because we left the drop zone
      expect(dropZone.hasAttribute('dragover')).to.be.false;
    });

    it('should remove dragover attribute on drop', async () => {
      // First trigger dragover
      dropZone.dispatchEvent(createDragEvent('dragover'));
      await nextFrame();
      expect(dropZone.hasAttribute('dragover')).to.be.true;

      // Then trigger drop
      const files = createFiles(1, 100, 'text/plain');
      dropZone.dispatchEvent(createDragEvent('drop', files));
      await nextFrame();
      expect(dropZone.hasAttribute('dragover')).to.be.false;
    });

    it('should prevent default on drop', () => {
      const files = createFiles(1, 100, 'text/plain');
      const event = createDragEvent('drop', files);
      dropZone.dispatchEvent(event);

      expect(event.defaultPrevented).to.be.true;
    });
  });

  describe('manager integration', () => {
    let uploadManager: UploadManager;

    beforeEach(() => {
      uploadManager = new UploadManager({
        target: '/api/upload',
        noAuto: true,
      });
    });

    it('should add files to manager when files are dropped', async () => {
      dropZone.manager = uploadManager;
      expect(uploadManager.files).to.have.lengthOf(0);

      const files = createFiles(2, 100, 'text/plain');
      dropZone.dispatchEvent(createDropEvent(files));
      await nextFrame();

      expect(uploadManager.files).to.have.lengthOf(2);
    });

    it('should not call addFiles when manager is null', async () => {
      dropZone.manager = null;

      const files = createFiles(2, 100, 'text/plain');
      dropZone.dispatchEvent(createDropEvent(files));
      await nextFrame();

      // Should not throw
      expect(uploadManager.files).to.have.lengthOf(0);
    });

    it('should not call addFiles when manager has reached maxFiles', async () => {
      dropZone.manager = uploadManager;
      uploadManager.maxFiles = 1;

      // Add one file to reach maxFiles
      const initialFiles = createFiles(1, 100, 'text/plain');
      uploadManager.addFiles(initialFiles);
      await nextFrame();

      expect(uploadManager.maxFilesReached).to.be.true;

      // Spy on addFiles after reaching max
      const addFilesSpy = sinon.spy(uploadManager, 'addFiles');

      // Try to drop more files
      const moreFiles = createFiles(1, 100, 'text/plain');
      dropZone.dispatchEvent(createDropEvent(moreFiles));
      await nextFrame();

      // Drop zone should not even attempt to call addFiles when disabled
      expect(addFilesSpy.called).to.be.false;
    });

    it('should reflect maxFilesReached from manager', async () => {
      dropZone.manager = uploadManager;
      uploadManager.maxFiles = 1;

      await nextFrame();

      expect(dropZone.maxFilesReached).to.be.false;
      expect(dropZone.hasAttribute('max-files-reached')).to.be.false;

      // Add one file to reach maxFiles
      const files = createFiles(1, 100, 'text/plain');
      uploadManager.addFiles(files);
      await nextFrame();

      expect(dropZone.maxFilesReached).to.be.true;
      expect(dropZone.hasAttribute('max-files-reached')).to.be.true;
    });

    it('should not show dragover state when maxFilesReached', async () => {
      dropZone.manager = uploadManager;
      uploadManager.maxFiles = 1;

      // Add one file to reach maxFiles
      const files = createFiles(1, 100, 'text/plain');
      uploadManager.addFiles(files);
      await nextFrame();

      // Try to trigger dragover on maxFilesReached drop zone
      dropZone.dispatchEvent(createDragEvent('dragover'));
      await nextFrame();

      // Should not set dragover attribute when maxFilesReached
      expect(dropZone.hasAttribute('dragover')).to.be.false;
    });

    it('should re-enable when files are removed from manager', async () => {
      dropZone.manager = uploadManager;
      uploadManager.maxFiles = 1;

      const files = createFiles(1, 100, 'text/plain');
      uploadManager.addFiles(files);
      await nextFrame();
      expect(dropZone.maxFilesReached).to.be.true;

      uploadManager.removeFile(uploadManager.files[0]);
      await nextFrame();
      expect(dropZone.maxFilesReached).to.be.false;
    });

    it('should remove listener when manager is set to null', async () => {
      dropZone.manager = uploadManager;

      // Set manager to null
      dropZone.manager = null;

      // Add files - should not affect drop zone
      uploadManager.addFiles(createFiles(1, 100, 'text/plain'));
      await nextFrame();
      expect(dropZone.maxFilesReached).to.be.false;
    });

    it('should remove listener from old manager when manager is changed', async () => {
      const oldManager = new UploadManager({
        target: '/api/upload',
        maxFiles: 1,
        noAuto: true,
      });
      const newManager = new UploadManager({
        target: '/api/upload',
        maxFiles: 1,
        noAuto: true,
      });
      dropZone.manager = oldManager;
      await nextFrame();

      // Change to new manager
      dropZone.manager = newManager;
      await nextFrame();

      // Add files to old manager - should not affect drop zone
      oldManager.addFiles(createFiles(1, 100, 'text/plain'));
      await nextFrame();
      expect(dropZone.maxFilesReached).to.be.false;

      // Add files to new manager - should affect drop zone
      newManager.addFiles(createFiles(1, 100, 'text/plain'));
      await nextFrame();
      expect(dropZone.maxFilesReached).to.be.true;
    });

    it('should reset maxFilesReached when manager is set to null', async () => {
      dropZone.manager = uploadManager;
      uploadManager.maxFiles = 1;

      // Reach max files
      uploadManager.addFiles(createFiles(1, 100, 'text/plain'));
      await nextFrame();
      expect(dropZone.maxFilesReached).to.be.true;

      // Set manager to null - should reset maxFilesReached
      dropZone.manager = null;
      await nextFrame();
      expect(dropZone.maxFilesReached).to.be.false;
    });

    it('should remove listener when disconnected from DOM', async () => {
      dropZone.manager = uploadManager;
      uploadManager.maxFiles = 2;

      // Remove drop zone from DOM
      dropZone.remove();

      // Add files to reach max
      uploadManager.addFiles(createFiles(2, 100, 'text/plain'));

      // Verify maxFilesReached is true on manager
      expect(uploadManager.maxFilesReached).to.be.true;

      // Drop zone should remain not maxFilesReached since listener was removed on disconnect
      expect(dropZone.maxFilesReached).to.be.false;
    });

    it('should re-attach listener when reconnected to DOM', async () => {
      dropZone.manager = uploadManager;
      uploadManager.maxFiles = 2;
      await nextFrame();

      // Remove and re-add drop zone
      const parent = dropZone.parentElement!;
      dropZone.remove();
      parent.appendChild(dropZone);
      await nextFrame();

      // Add files to reach max - should set maxFilesReached on drop zone since it's reconnected
      uploadManager.addFiles(createFiles(2, 100, 'text/plain'));
      await nextFrame();
      expect(dropZone.maxFilesReached).to.be.true;
    });

    it('should sync maxFilesReached state when reconnected after max files reached', async () => {
      dropZone.manager = uploadManager;
      uploadManager.maxFiles = 2;
      await nextFrame();

      // Remove drop zone from DOM
      const parent = dropZone.parentElement!;
      dropZone.remove();

      // Add files to reach max WHILE drop zone is disconnected
      uploadManager.addFiles(createFiles(2, 100, 'text/plain'));
      expect(uploadManager.maxFilesReached).to.be.true;

      // Reconnect drop zone
      parent.appendChild(dropZone);
      await nextFrame();

      // Drop zone should now have maxFilesReached (synced with manager state on reconnect)
      expect(dropZone.maxFilesReached).to.be.true;
    });
  });
});
