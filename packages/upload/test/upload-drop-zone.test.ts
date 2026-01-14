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

    it('should call addFiles on manager when files are dropped', async () => {
      dropZone.manager = uploadManager;
      const addFilesSpy = sinon.spy(uploadManager, 'addFiles');

      const files = createFiles(2, 100, 'text/plain');
      dropZone.dispatchEvent(createDropEvent(files));
      await nextFrame();

      expect(addFilesSpy.calledOnce).to.be.true;
      expect(addFilesSpy.firstCall.args[0]).to.have.lengthOf(2);
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
      const manager = new UploadManager({
        target: '/api/upload',
        maxFiles: 1,
        noAuto: true,
      });
      dropZone.manager = manager;

      // Add one file to reach maxFiles
      const initialFiles = createFiles(1, 100, 'text/plain');
      manager.addFiles(initialFiles);
      await nextFrame();

      expect(manager.maxFilesReached).to.be.true;

      // Spy on addFiles after reaching max
      const addFilesSpy = sinon.spy(manager, 'addFiles');

      // Try to drop more files
      const moreFiles = createFiles(1, 100, 'text/plain');
      dropZone.dispatchEvent(createDropEvent(moreFiles));
      await nextFrame();

      // Drop zone should not even attempt to call addFiles when disabled
      expect(addFilesSpy.called).to.be.false;
    });

    it('should be disabled when manager maxFilesReached', async () => {
      const manager = new UploadManager({
        target: '/api/upload',
        maxFiles: 1,
        noAuto: true,
      });
      dropZone.manager = manager;
      await nextFrame();

      expect(dropZone.hasAttribute('disabled')).to.be.false;

      // Add one file to reach maxFiles
      const files = createFiles(1, 100, 'text/plain');
      manager.addFiles(files);
      await nextFrame();

      expect(dropZone.hasAttribute('disabled')).to.be.true;
    });

    it('should not show dragover state when disabled', async () => {
      const manager = new UploadManager({
        target: '/api/upload',
        maxFiles: 1,
        noAuto: true,
      });
      dropZone.manager = manager;

      // Add one file to reach maxFiles
      const files = createFiles(1, 100, 'text/plain');
      manager.addFiles(files);
      await nextFrame();

      // Try to trigger dragover on disabled drop zone
      dropZone.dispatchEvent(createDragEvent('dragover'));
      await nextFrame();

      // Should not set dragover attribute when disabled
      expect(dropZone.hasAttribute('dragover')).to.be.false;
    });

    it('should re-enable when files are removed from manager', async () => {
      const manager = new UploadManager({
        target: '/api/upload',
        maxFiles: 1,
        noAuto: true,
      });
      dropZone.manager = manager;

      const files = createFiles(1, 100, 'text/plain');
      manager.addFiles(files);
      await nextFrame();
      expect(dropZone.hasAttribute('disabled')).to.be.true;

      manager.removeFile(manager.files[0]);
      await nextFrame();
      expect(dropZone.hasAttribute('disabled')).to.be.false;
    });

    it('should remove listener when manager is set to null', async () => {
      const manager = new UploadManager({
        target: '/api/upload',
        maxFiles: 1,
        noAuto: true,
      });
      dropZone.manager = manager;

      // Set manager to null
      dropZone.manager = null;

      // Add files - should not affect drop zone
      manager.addFiles(createFiles(1, 100, 'text/plain'));
      await nextFrame();
      expect(dropZone.hasAttribute('disabled')).to.be.false;
    });

    it('should remove listener when disconnected from DOM', async () => {
      const manager = new UploadManager({
        target: '/api/upload',
        maxFiles: 2,
        noAuto: true,
      });

      // Spy on manager to verify event fires
      const spy = sinon.spy();
      manager.addEventListener('max-files-reached-changed', spy);

      dropZone.manager = manager;
      await nextFrame();
      expect(dropZone.hasAttribute('disabled')).to.be.false;

      // Verify drop zone is in DOM
      expect(dropZone.isConnected).to.be.true;

      // Remove drop zone from DOM
      dropZone.remove();

      // Verify drop zone is disconnected
      expect(dropZone.isConnected).to.be.false;

      // Reset spy call count after setup
      spy.resetHistory();

      // Add files to reach max
      manager.addFiles(createFiles(2, 100, 'text/plain'));

      // Verify event was dispatched
      expect(spy.called).to.be.true;
      expect((spy.getCall(0).args[0] as CustomEvent).detail.value).to.be.true;

      // Verify maxFilesReached is true on manager
      expect(manager.maxFilesReached).to.be.true;

      // Drop zone should remain not disabled since listener was removed on disconnect
      expect(dropZone.hasAttribute('disabled')).to.be.false;
    });

    it('should re-attach listener when reconnected to DOM', async () => {
      const manager = new UploadManager({
        target: '/api/upload',
        maxFiles: 2,
        noAuto: true,
      });
      dropZone.manager = manager;
      await nextFrame();

      // Remove and re-add drop zone
      const parent = dropZone.parentElement!;
      dropZone.remove();
      parent.appendChild(dropZone);
      await nextFrame();

      // Add files to reach max - should disable drop zone since it's reconnected
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      await nextFrame();
      expect(dropZone.hasAttribute('disabled')).to.be.true;
    });

    it('should sync disabled state when reconnected after max files reached', async () => {
      const manager = new UploadManager({
        target: '/api/upload',
        maxFiles: 2,
        noAuto: true,
      });
      dropZone.manager = manager;
      await nextFrame();
      expect(dropZone.hasAttribute('disabled')).to.be.false;

      // Remove drop zone from DOM
      const parent = dropZone.parentElement!;
      dropZone.remove();

      // Add files to reach max WHILE drop zone is disconnected
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      expect(manager.maxFilesReached).to.be.true;

      // Drop zone should still not be disabled (listener was removed)
      expect(dropZone.hasAttribute('disabled')).to.be.false;

      // Reconnect drop zone
      parent.appendChild(dropZone);
      await nextFrame();

      // Drop zone should now be disabled (synced with manager state on reconnect)
      expect(dropZone.hasAttribute('disabled')).to.be.true;
    });
  });
});
