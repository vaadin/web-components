import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload-drop-zone.js';
import type { UploadDropZone } from '../src/vaadin-upload-drop-zone.js';
import { UploadManager } from '../src/vaadin-upload-manager.js';
import { createFiles } from './helpers.js';

function createDragEvent(type: string, files: File[] = []): DragEvent {
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
  });
});
