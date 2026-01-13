import { expect } from '@vaadin/chai-plugins';
import { enterKeyDown, fixtureSync, nextFrame, nextRender, spaceKeyDown } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import type { UploadButton } from '../src/vaadin-upload-button.js';
import '../src/vaadin-upload-button.js';
import { UploadManager } from '../src/vaadin-upload-manager.js';
import { createFile, createFiles } from './helpers.js';

describe('vaadin-upload-button', () => {
  let button: UploadButton;

  beforeEach(async () => {
    button = fixtureSync(`<vaadin-upload-button>Add Files</vaadin-upload-button>`);
    await nextRender();
  });

  describe('basic', () => {
    it('should render slotted content', () => {
      expect(button.textContent).to.equal('Add Files');
    });

    it('should have role="button"', () => {
      expect(button.getAttribute('role')).to.equal('button');
    });

    it('should have tabindex="0"', () => {
      expect(button.getAttribute('tabindex')).to.equal('0');
    });

    it('should have disabled property defaulting to false', () => {
      expect(button.disabled).to.be.false;
    });

    it('should reflect disabled to attribute', async () => {
      button.disabled = true;
      await nextFrame();
      expect(button.hasAttribute('disabled')).to.be.true;
    });

    it('should have manager property defaulting to null', () => {
      expect(button.manager).to.be.null;
    });
  });

  describe('file picker', () => {
    let fileInput: HTMLInputElement;

    beforeEach(() => {
      fileInput = (button as any).__fileInput;
    });

    it('should have a hidden file input in shadow DOM', () => {
      expect(fileInput).to.exist;
      expect(fileInput.style.display).to.equal('none');
    });

    it('should set multiple attribute based on manager maxFiles', () => {
      const manager = new UploadManager({ target: '/api/upload', maxFiles: 1, noAuto: true });
      button.manager = manager;
      button.openFilePicker();
      expect(fileInput.multiple).to.be.false;

      manager.maxFiles = Infinity;
      button.openFilePicker();
      expect(fileInput.multiple).to.be.true;
    });

    it('should default to multiple when no manager', () => {
      button.openFilePicker();
      expect(fileInput.multiple).to.be.true;
    });

    it('should set accept attribute from manager', () => {
      const manager = new UploadManager({ target: '/api/upload', accept: 'image/*,.pdf', noAuto: true });
      button.manager = manager;
      button.openFilePicker();
      expect(fileInput.accept).to.equal('image/*,.pdf');
    });

    it('should set capture attribute on file input', () => {
      button.capture = 'environment';
      button.openFilePicker();
      expect(fileInput.capture).to.equal('environment');
    });

    it('should not open file picker when disabled', () => {
      const clickSpy = sinon.spy((button as any).__fileInput, 'click');
      button.disabled = true;
      button.openFilePicker();
      expect(clickSpy.called).to.be.false;
      clickSpy.restore();
    });

    it('should call openFilePicker on click', () => {
      let openCalled = false;
      const original = button.openFilePicker;
      button.openFilePicker = () => {
        openCalled = true;
      };
      button.click();
      expect(openCalled).to.be.true;
      button.openFilePicker = original;
    });

    it('should call openFilePicker on Enter key', () => {
      let openCalled = false;
      const original = button.openFilePicker;
      button.openFilePicker = () => {
        openCalled = true;
      };
      enterKeyDown(button);
      expect(openCalled).to.be.true;
      button.openFilePicker = original;
    });

    it('should call openFilePicker on Space key', () => {
      let openCalled = false;
      const original = button.openFilePicker;
      button.openFilePicker = () => {
        openCalled = true;
      };
      spaceKeyDown(button);
      expect(openCalled).to.be.true;
      button.openFilePicker = original;
    });

    it('should not open file picker on other keys', () => {
      let openCalled = false;
      const original = button.openFilePicker;
      button.openFilePicker = () => {
        openCalled = true;
      };
      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      expect(openCalled).to.be.false;
      button.openFilePicker = original;
    });

    it('should not open file picker when disabled and clicking', () => {
      let openCalled = false;
      const original = button.openFilePicker;
      button.openFilePicker = () => {
        openCalled = true;
      };
      button.disabled = true;
      button.click();
      expect(openCalled).to.be.false;
      button.openFilePicker = original;
    });
  });

  describe('files-selected event', () => {
    it('should dispatch files-selected event when files are selected', () => {
      const fileInput = button.shadowRoot!.querySelector('input[type="file"]') as HTMLInputElement;
      const files = createFiles(2, 100, 'text/plain');

      // Mock the file input's files property
      Object.setPrototypeOf(fileInput, HTMLElement.prototype);
      (fileInput as any).files = files;

      const eventSpy = sinon.spy();
      button.addEventListener('files-selected', eventSpy);

      fileInput.dispatchEvent(new Event('change'));

      expect(eventSpy.calledOnce).to.be.true;
      expect(eventSpy.firstCall.args[0].detail.files).to.have.lengthOf(2);
    });

    it('should bubble and be composed', () => {
      const fileInput = button.shadowRoot!.querySelector('input[type="file"]') as HTMLInputElement;
      const files = createFiles(1, 100, 'text/plain');

      Object.setPrototypeOf(fileInput, HTMLElement.prototype);
      (fileInput as any).files = files;

      const eventSpy = sinon.spy();
      button.addEventListener('files-selected', eventSpy);

      fileInput.dispatchEvent(new Event('change'));

      const event = eventSpy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });
  });

  describe('manager integration', () => {
    let uploadManager: UploadManager;

    beforeEach(() => {
      uploadManager = new UploadManager({
        target: '/api/upload',
        maxFiles: 3,
        noAuto: true,
      });
    });

    it('should call addFiles on manager when files are selected', () => {
      button.manager = uploadManager;
      const addFilesSpy = sinon.spy(uploadManager, 'addFiles');

      const fileInput = button.shadowRoot!.querySelector('input[type="file"]') as HTMLInputElement;
      const files = createFiles(2, 100, 'text/plain');

      Object.setPrototypeOf(fileInput, HTMLElement.prototype);
      (fileInput as any).files = files;
      fileInput.dispatchEvent(new Event('change'));

      expect(addFilesSpy.calledOnce).to.be.true;
      expect(addFilesSpy.firstCall.args[0]).to.equal(files);
    });

    it('should sync initial maxFilesReached state from manager', async () => {
      // Add files to reach max
      uploadManager.maxFiles = 1;
      uploadManager.addFiles([createFile(100, 'text/plain')]);

      expect(uploadManager.maxFilesReached).to.be.true;

      // Set manager - button should sync disabled state
      button.manager = uploadManager;
      await nextFrame();
      expect(button.disabled).to.be.true;
    });

    it('should disable when max files reached on manager', async () => {
      uploadManager.maxFiles = 2;
      button.manager = uploadManager;
      expect(button.disabled).to.be.false;

      // Add files to reach max
      uploadManager.addFiles(createFiles(2, 100, 'text/plain'));
      await nextFrame();

      expect(button.disabled).to.be.true;
    });

    it('should re-enable when files are removed from manager', async () => {
      uploadManager.maxFiles = 1;
      button.manager = uploadManager;

      const file = createFile(100, 'text/plain');
      uploadManager.addFiles([file]);
      await nextFrame();
      expect(button.disabled).to.be.true;

      uploadManager.removeFile(uploadManager.files[0]);
      await nextFrame();
      expect(button.disabled).to.be.false;
    });

    it('should remove listener when manager changes', async () => {
      uploadManager.maxFiles = 2;
      button.manager = uploadManager;

      const uploadManager2 = new UploadManager({
        target: '/api/upload',
        maxFiles: 1,
        noAuto: true,
      });

      // Change manager
      button.manager = uploadManager2;

      // Add files to first manager - should not affect button
      uploadManager.addFiles(createFiles(2, 100, 'text/plain'));
      await nextFrame();
      expect(button.disabled).to.be.false;

      // Add file to second manager - should disable button
      uploadManager2.addFiles([createFile(100, 'text/plain')]);
      await nextFrame();
      expect(button.disabled).to.be.true;
    });

    it('should remove listener when manager is set to null', async () => {
      uploadManager.maxFiles = 1;
      button.manager = uploadManager;

      // Set manager to null
      button.manager = null;

      // Add files - should not affect button
      uploadManager.addFiles([createFile(100, 'text/plain')]);
      await nextFrame();
      expect(button.disabled).to.be.false;
    });
  });
});
