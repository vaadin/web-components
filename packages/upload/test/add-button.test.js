import { expect } from '@vaadin/chai-plugins';
import { enterKeyDown, fixtureSync, nextFrame, nextRender, spaceKeyDown } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload-add-button.js';
import { UploadManager } from '../src/vaadin-upload-manager.js';
import { createFile, createFiles } from './helpers.js';

describe('vaadin-upload-add-button', () => {
  let addButton;

  beforeEach(async () => {
    addButton = fixtureSync(`<vaadin-upload-add-button>Add Files</vaadin-upload-add-button>`);
    await nextRender();
  });

  describe('basic', () => {
    it('should render slotted content', () => {
      expect(addButton.textContent).to.equal('Add Files');
    });

    it('should have role="button"', () => {
      expect(addButton.getAttribute('role')).to.equal('button');
    });

    it('should have tabindex="0"', () => {
      expect(addButton.getAttribute('tabindex')).to.equal('0');
    });

    it('should have disabled property defaulting to false', () => {
      expect(addButton.disabled).to.be.false;
    });

    it('should reflect disabled to attribute', async () => {
      addButton.disabled = true;
      await nextFrame();
      expect(addButton.hasAttribute('disabled')).to.be.true;
    });

    it('should have accept property defaulting to empty string', () => {
      expect(addButton.accept).to.equal('');
    });

    it('should have maxFiles property defaulting to Infinity', () => {
      expect(addButton.maxFiles).to.equal(Infinity);
    });

    it('should have target property defaulting to null', () => {
      expect(addButton.target).to.be.null;
    });
  });

  describe('file picker', () => {
    let fileInput;

    beforeEach(() => {
      fileInput = addButton.__fileInput;
    });

    it('should have a hidden file input in shadow DOM', () => {
      expect(fileInput).to.exist;
      expect(fileInput.style.display).to.equal('none');
    });

    it('should set multiple attribute based on maxFiles', () => {
      addButton.maxFiles = 1;
      addButton.openFilePicker();
      expect(fileInput.multiple).to.be.false;

      addButton.maxFiles = Infinity;
      addButton.openFilePicker();
      expect(fileInput.multiple).to.be.true;
    });

    it('should set accept attribute on file input', () => {
      addButton.accept = 'image/*,.pdf';
      addButton.openFilePicker();
      expect(fileInput.accept).to.equal('image/*,.pdf');
    });

    it('should set capture attribute on file input', () => {
      addButton.capture = 'environment';
      addButton.openFilePicker();
      expect(fileInput.capture).to.equal('environment');
    });

    it('should not open file picker when disabled', () => {
      const clickSpy = sinon.spy(addButton.__fileInput, 'click');
      addButton.disabled = true;
      addButton.openFilePicker();
      expect(clickSpy.called).to.be.false;
      clickSpy.restore();
    });

    it('should call openFilePicker on click', () => {
      let openCalled = false;
      const original = addButton.openFilePicker;
      addButton.openFilePicker = () => {
        openCalled = true;
      };
      addButton.click();
      expect(openCalled).to.be.true;
      addButton.openFilePicker = original;
    });

    it('should call openFilePicker on Enter key', () => {
      let openCalled = false;
      const original = addButton.openFilePicker;
      addButton.openFilePicker = () => {
        openCalled = true;
      };
      enterKeyDown(addButton);
      expect(openCalled).to.be.true;
      addButton.openFilePicker = original;
    });

    it('should call openFilePicker on Space key', () => {
      let openCalled = false;
      const original = addButton.openFilePicker;
      addButton.openFilePicker = () => {
        openCalled = true;
      };
      spaceKeyDown(addButton);
      expect(openCalled).to.be.true;
      addButton.openFilePicker = original;
    });

    it('should not open file picker on other keys', () => {
      let openCalled = false;
      const original = addButton.openFilePicker;
      addButton.openFilePicker = () => {
        openCalled = true;
      };
      addButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      expect(openCalled).to.be.false;
      addButton.openFilePicker = original;
    });

    it('should not open file picker when disabled and clicking', () => {
      let openCalled = false;
      const original = addButton.openFilePicker;
      addButton.openFilePicker = () => {
        openCalled = true;
      };
      addButton.disabled = true;
      addButton.click();
      expect(openCalled).to.be.false;
      addButton.openFilePicker = original;
    });
  });

  describe('files-selected event', () => {
    it('should dispatch files-selected event when files are selected', () => {
      const fileInput = addButton.shadowRoot.querySelector('input[type="file"]');
      const files = createFiles(2, 100, 'text/plain');

      // Mock the file input's files property
      Object.setPrototypeOf(fileInput, HTMLElement.prototype);
      fileInput.files = files;

      const eventSpy = sinon.spy();
      addButton.addEventListener('files-selected', eventSpy);

      fileInput.dispatchEvent(new Event('change'));

      expect(eventSpy.calledOnce).to.be.true;
      expect(eventSpy.firstCall.args[0].detail.files).to.have.lengthOf(2);
    });

    it('should bubble and be composed', () => {
      const fileInput = addButton.shadowRoot.querySelector('input[type="file"]');
      const files = createFiles(1, 100, 'text/plain');

      Object.setPrototypeOf(fileInput, HTMLElement.prototype);
      fileInput.files = files;

      const eventSpy = sinon.spy();
      addButton.addEventListener('files-selected', eventSpy);

      fileInput.dispatchEvent(new Event('change'));

      const event = eventSpy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });
  });

  describe('target integration', () => {
    let manager;

    beforeEach(() => {
      manager = new UploadManager({
        target: '/api/upload',
        maxFiles: 3,
        noAuto: true,
      });
    });

    afterEach(() => {
      manager.destroy();
    });

    it('should call addFiles on target when files are selected', () => {
      addButton.target = manager;
      const addFilesSpy = sinon.spy(manager, 'addFiles');

      const fileInput = addButton.shadowRoot.querySelector('input[type="file"]');
      const files = createFiles(2, 100, 'text/plain');

      Object.setPrototypeOf(fileInput, HTMLElement.prototype);
      fileInput.files = files;
      fileInput.dispatchEvent(new Event('change'));

      expect(addFilesSpy.calledOnce).to.be.true;
      expect(addFilesSpy.firstCall.args[0]).to.equal(files);
    });

    it('should sync initial maxFilesReached state from target', async () => {
      // Add files to reach max
      manager.maxFiles = 1;
      manager.addFiles([createFile(100, 'text/plain')]);

      expect(manager.maxFilesReached).to.be.true;

      // Set target - button should sync disabled state
      addButton.target = manager;
      await nextFrame();
      expect(addButton.disabled).to.be.true;
    });

    it('should disable when max files reached on target', async () => {
      manager.maxFiles = 2;
      addButton.target = manager;
      expect(addButton.disabled).to.be.false;

      // Add files to reach max
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      await nextFrame();

      expect(addButton.disabled).to.be.true;
    });

    it('should re-enable when files are removed from target', async () => {
      manager.maxFiles = 1;
      addButton.target = manager;

      const file = createFile(100, 'text/plain');
      manager.addFiles([file]);
      await nextFrame();
      expect(addButton.disabled).to.be.true;

      manager.removeFile(manager.files[0]);
      await nextFrame();
      expect(addButton.disabled).to.be.false;
    });

    it('should remove listener when target changes', async () => {
      manager.maxFiles = 2;
      addButton.target = manager;

      const manager2 = new UploadManager({
        target: '/api/upload',
        maxFiles: 1,
        noAuto: true,
      });

      // Change target
      addButton.target = manager2;

      // Add files to first manager - should not affect button
      manager.addFiles(createFiles(2, 100, 'text/plain'));
      await nextFrame();
      expect(addButton.disabled).to.be.false;

      // Add file to second manager - should disable button
      manager2.addFiles([createFile(100, 'text/plain')]);
      await nextFrame();
      expect(addButton.disabled).to.be.true;

      manager2.destroy();
    });

    it('should remove listener when target is set to null', async () => {
      manager.maxFiles = 1;
      addButton.target = manager;

      // Set target to null
      addButton.target = null;

      // Add files - should not affect button
      manager.addFiles([createFile(100, 'text/plain')]);
      await nextFrame();
      expect(addButton.disabled).to.be.false;
    });
  });
});
