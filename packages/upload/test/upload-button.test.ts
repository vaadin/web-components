import { expect } from '@vaadin/chai-plugins';
import { enterKeyDown, fixtureSync, nextFrame, nextRender, spaceKeyDown } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload-button.js';
import type { UploadButton } from '../src/vaadin-upload-button.js';
import { UploadManager } from '../src/vaadin-upload-manager.js';
import { createFile, createFiles } from './helpers.js';

function getFileInput(button: UploadButton): HTMLInputElement {
  return button.shadowRoot!.querySelector('input[type="file"]')!;
}

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
      fileInput = getFileInput(button);
    });

    it('should have a hidden file input in shadow DOM', () => {
      expect(fileInput).to.exist;
      expect(getComputedStyle(fileInput).display).to.equal('none');
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
      expect(fileInput.getAttribute('accept')).to.equal('image/*,.pdf');
    });

    it('should clear accept attribute when manager has no accept', () => {
      // First set a manager with accept
      const manager = new UploadManager({ target: '/api/upload', accept: 'image/*', noAuto: true });
      button.manager = manager;
      button.openFilePicker();
      expect(fileInput.getAttribute('accept')).to.equal('image/*');

      // Change to manager without accept
      const manager2 = new UploadManager({ target: '/api/upload', noAuto: true });
      button.manager = manager2;
      button.openFilePicker();
      expect(fileInput.hasAttribute('accept')).to.be.false;
    });

    it('should set capture attribute on file input', () => {
      button.capture = 'environment';
      button.openFilePicker();
      expect(fileInput.getAttribute('capture')).to.equal('environment');
    });

    it('should clear capture attribute when set to empty string', () => {
      button.capture = 'environment';
      button.openFilePicker();
      expect(fileInput.getAttribute('capture')).to.equal('environment');

      button.capture = '';
      button.openFilePicker();
      expect(fileInput.hasAttribute('capture')).to.be.false;
    });

    it('should clear capture attribute when set to undefined', () => {
      button.capture = 'environment';
      button.openFilePicker();
      expect(fileInput.getAttribute('capture')).to.equal('environment');

      button.capture = undefined;
      button.openFilePicker();
      // When capture is undefined, the capture attribute should be removed
      expect(fileInput.hasAttribute('capture')).to.be.false;
    });

    it('should reset file input value before opening', () => {
      const input = getFileInput(button);
      // Set a value on the file input
      Object.defineProperty(input, 'value', { writable: true, value: 'some-file.txt' });
      expect(input.value).to.equal('some-file.txt');

      button.openFilePicker();
      expect(input.value).to.equal('');
    });

    it('should click file input when opening picker', () => {
      const input = getFileInput(button);
      const spy = sinon.spy();
      input.addEventListener('click', spy);
      button.openFilePicker();
      expect(spy.calledOnce).to.be.true;
    });

    it('should not open file picker when disabled', () => {
      const input = getFileInput(button);
      const spy = sinon.spy();
      input.addEventListener('click', spy);
      button.disabled = true;
      button.openFilePicker();
      expect(spy.called).to.be.false;
    });

    it('should click file input when clicking the button', () => {
      const input = getFileInput(button);
      const spy = sinon.spy();
      input.addEventListener('click', spy);
      button.click();
      expect(spy.called).to.be.true;
    });

    it('should click the file input on Enter key', () => {
      const input = getFileInput(button);
      const spy = sinon.spy();
      input.addEventListener('click', spy);
      enterKeyDown(button);
      expect(spy.called).to.be.true;
    });

    it('should click the file input on Space key', () => {
      const input = getFileInput(button);
      const spy = sinon.spy();
      input.addEventListener('click', spy);
      spaceKeyDown(button);
      expect(spy.called).to.be.true;
    });

    it('should not open file picker on other keys', () => {
      const input = getFileInput(button);
      const spy = sinon.spy();
      input.addEventListener('click', spy);
      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      expect(spy.called).to.be.false;
    });

    it('should not open file picker when disabled and clicking', () => {
      const input = getFileInput(button);
      const spy = sinon.spy();
      input.addEventListener('click', spy);
      button.disabled = true;
      button.click();
      expect(spy.called).to.be.false;
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

      const fileInput = getFileInput(button);
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

      // Set manager - button should sync maxFilesReached state
      button.manager = uploadManager;
      await nextFrame();
      expect(button.maxFilesReached).to.be.true;
    });

    it('should set maxFilesReached when max files reached on manager', async () => {
      uploadManager.maxFiles = 2;
      button.manager = uploadManager;
      expect(button.maxFilesReached).to.be.false;

      // Add files to reach max
      uploadManager.addFiles(createFiles(2, 100, 'text/plain'));
      await nextFrame();

      expect(button.maxFilesReached).to.be.true;
    });

    it('should clear maxFilesReached when files are removed from manager', async () => {
      uploadManager.maxFiles = 1;
      button.manager = uploadManager;

      const file = createFile(100, 'text/plain');
      uploadManager.addFiles([file]);
      await nextFrame();
      expect(button.maxFilesReached).to.be.true;

      uploadManager.removeFile(uploadManager.files[0]);
      await nextFrame();
      expect(button.maxFilesReached).to.be.false;
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
      expect(button.maxFilesReached).to.be.false;

      // Add file to second manager - should set maxFilesReached on button
      uploadManager2.addFiles([createFile(100, 'text/plain')]);
      await nextFrame();
      expect(button.maxFilesReached).to.be.true;
    });

    it('should remove listener when manager is set to null', async () => {
      uploadManager.maxFiles = 1;
      button.manager = uploadManager;

      // Set manager to null
      button.manager = null;

      // Add files - should not affect button
      uploadManager.addFiles([createFile(100, 'text/plain')]);
      await nextFrame();
      expect(button.maxFilesReached).to.be.false;
    });

    it('should remove listener when disconnected from DOM', async () => {
      uploadManager.maxFiles = 2;

      // Spy on manager to verify event fires
      const spy = sinon.spy();
      uploadManager.addEventListener('max-files-reached-changed', spy);

      button.manager = uploadManager;
      await nextFrame(); // Wait for property observer to run
      expect(button.maxFilesReached).to.be.false;

      // Verify button is in DOM
      expect(button.isConnected).to.be.true;

      // Remove button from DOM
      button.remove();

      // Verify button is disconnected
      expect(button.isConnected).to.be.false;

      // Reset spy call count after setup
      spy.resetHistory();

      // Add files to reach max
      uploadManager.addFiles(createFiles(2, 100, 'text/plain'));

      // Verify event was dispatched
      expect(spy.called).to.be.true;
      expect((spy.getCall(0).args[0] as CustomEvent).detail.value).to.be.true;

      // Verify maxFilesReached is true on manager
      expect(uploadManager.maxFilesReached).to.be.true;

      // Button should remain not maxFilesReached since listener was removed on disconnect
      expect(button.maxFilesReached).to.be.false;
    });

    it('should re-attach listener when reconnected to DOM', async () => {
      uploadManager.maxFiles = 2;
      button.manager = uploadManager;
      await nextFrame();

      // Remove and re-add button
      const parent = button.parentElement!;
      button.remove();
      parent.appendChild(button);
      await nextFrame();

      // Add files to reach max - should set maxFilesReached on button since it's reconnected
      uploadManager.addFiles(createFiles(2, 100, 'text/plain'));
      await nextFrame();
      expect(button.maxFilesReached).to.be.true;
    });

    describe('disabled state when maxFilesReached', () => {
      it('should return disabled=true when maxFilesReached is true', async () => {
        uploadManager.maxFiles = 1;
        button.manager = uploadManager;
        expect(button.disabled).to.be.false;

        uploadManager.addFiles([createFile(100, 'text/plain')]);
        await nextFrame();
        expect(button.maxFilesReached).to.be.true;
        expect(button.disabled).to.be.true;
      });

      it('should have disabled attribute when maxFilesReached is true', async () => {
        uploadManager.maxFiles = 1;
        button.manager = uploadManager;
        expect(button.hasAttribute('disabled')).to.be.false;

        uploadManager.addFiles([createFile(100, 'text/plain')]);
        await nextFrame();
        expect(button.hasAttribute('disabled')).to.be.true;
      });

      it('should return disabled=false when maxFilesReached becomes false', async () => {
        uploadManager.maxFiles = 1;
        button.manager = uploadManager;

        uploadManager.addFiles([createFile(100, 'text/plain')]);
        await nextFrame();
        expect(button.disabled).to.be.true;

        uploadManager.removeFile(uploadManager.files[0]);
        await nextFrame();
        expect(button.maxFilesReached).to.be.false;
        expect(button.disabled).to.be.false;
      });

      it('should preserve explicit disabled=true when maxFilesReached becomes false', async () => {
        uploadManager.maxFiles = 1;
        button.manager = uploadManager;
        button.disabled = true;
        await nextFrame();

        uploadManager.addFiles([createFile(100, 'text/plain')]);
        await nextFrame();
        expect(button.disabled).to.be.true;

        // Remove file - maxFilesReached becomes false, but disabled should stay true
        uploadManager.removeFile(uploadManager.files[0]);
        await nextFrame();
        expect(button.maxFilesReached).to.be.false;
        expect(button.disabled).to.be.true;
      });

      it('should allow setting disabled=false while maxFilesReached is true', async () => {
        uploadManager.maxFiles = 1;
        button.manager = uploadManager;
        button.disabled = true;
        await nextFrame();

        uploadManager.addFiles([createFile(100, 'text/plain')]);
        await nextFrame();
        expect(button.disabled).to.be.true;

        // Setting disabled=false should still return true due to maxFilesReached
        button.disabled = false;
        await nextFrame();
        expect(button.disabled).to.be.true;

        // But once maxFilesReached becomes false, disabled should be false
        uploadManager.removeFile(uploadManager.files[0]);
        await nextFrame();
        expect(button.disabled).to.be.false;
      });

      it('should have aria-disabled attribute when maxFilesReached is true', async () => {
        uploadManager.maxFiles = 1;
        button.manager = uploadManager;

        uploadManager.addFiles([createFile(100, 'text/plain')]);
        await nextFrame();
        expect(button.getAttribute('aria-disabled')).to.equal('true');
      });

      it('should not open file picker when disabled due to maxFilesReached', async () => {
        uploadManager.maxFiles = 1;
        button.manager = uploadManager;

        uploadManager.addFiles([createFile(100, 'text/plain')]);
        await nextFrame();

        const input = getFileInput(button);
        const spy = sinon.spy();
        input.addEventListener('click', spy);
        button.click();
        expect(spy.called).to.be.false;
      });

      it('should not be focusable when disabled due to maxFilesReached', async () => {
        uploadManager.maxFiles = 1;
        button.manager = uploadManager;
        expect(button.getAttribute('tabindex')).to.equal('0');

        uploadManager.addFiles([createFile(100, 'text/plain')]);
        await nextFrame();
        expect(button.getAttribute('tabindex')).to.equal('-1');
      });

      it('should restore tabindex when maxFilesReached becomes false', async () => {
        uploadManager.maxFiles = 1;
        button.manager = uploadManager;

        uploadManager.addFiles([createFile(100, 'text/plain')]);
        await nextFrame();
        expect(button.getAttribute('tabindex')).to.equal('-1');

        uploadManager.removeFile(uploadManager.files[0]);
        await nextFrame();
        expect(button.getAttribute('tabindex')).to.equal('0');
      });
    });

    it('should sync maxFilesReached state when reconnected after max files reached', async () => {
      uploadManager.maxFiles = 2;
      button.manager = uploadManager;
      await nextFrame();
      expect(button.maxFilesReached).to.be.false;

      // Remove button from DOM
      const parent = button.parentElement!;
      button.remove();

      // Add files to reach max WHILE button is disconnected
      uploadManager.addFiles(createFiles(2, 100, 'text/plain'));
      expect(uploadManager.maxFilesReached).to.be.true;

      // Button should still not have maxFilesReached (listener was removed)
      expect(button.maxFilesReached).to.be.false;

      // Reconnect button
      parent.appendChild(button);
      await nextFrame();

      // Button should now have maxFilesReached (synced with manager state on reconnect)
      expect(button.maxFilesReached).to.be.true;
    });

    it('should not sync maxFilesReached state when manager changed while disconnected', async () => {
      uploadManager.maxFiles = 2;

      await nextFrame();
      expect(button.maxFilesReached).to.be.false;

      // Remove button from DOM
      button.remove();

      button.manager = uploadManager;

      // Add files to reach max WHILE button is disconnected
      uploadManager.addFiles(createFiles(2, 100, 'text/plain'));
      expect(uploadManager.maxFilesReached).to.be.true;

      await nextFrame();
      // Button should still not have maxFilesReached (listener was removed)
      expect(button.maxFilesReached).to.be.false;
    });
  });
});
