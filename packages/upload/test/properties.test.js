import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-upload.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { createFile } from './helpers.js';

describe('properties', () => {
  let upload;

  describe('defaults', () => {
    beforeEach(async () => {
      upload = fixtureSync(`<vaadin-upload></vaadin-upload>`);
      await nextRender();
    });

    it('should have disabled set to false by default', () => {
      expect(upload.disabled).to.be.false;
    });

    it('should have nodrop set based on touch device support by default', () => {
      expect(upload.nodrop).to.equal(isTouch);
    });

    it('should have target set to empty string by default', () => {
      expect(upload.target).to.equal('');
    });

    it('should have timeout set to 0 by default', () => {
      expect(upload.timeout).to.equal(0);
    });

    it('should have maxFiles set to Infinity by default', () => {
      expect(upload.maxFiles).to.equal(Infinity);
    });

    it('should have maxFilesReached set to false by default', () => {
      expect(upload.maxFilesReached).to.be.false;
    });

    it('should have maxFilesReached set to false before the element is attached', () => {
      const element = document.createElement('vaadin-upload');
      expect(element.maxFilesReached).to.be.false;
    });

    it('should have accept set to empty string by default', () => {
      expect(upload.accept).to.equal('');
    });

    it('should have maxFileSize set to Infinity by default', () => {
      expect(upload.maxFileSize).to.equal(Infinity);
    });

    it('should have noAuto set to false by default', () => {
      expect(upload.noAuto).to.be.false;
    });

    it('should have withCredentials set to false by default', () => {
      expect(upload.withCredentials).to.be.false;
    });

    it('should have uploadFormat set to raw by default', () => {
      expect(upload.uploadFormat).to.equal('raw');
    });

    it('should not be in dragover state by default', () => {
      expect(upload.hasAttribute('dragover')).to.be.false;
      expect(upload.hasAttribute('dragover-valid')).to.be.false;
    });

    it('should not have max-files-reached attribute by default', () => {
      expect(upload.hasAttribute('max-files-reached')).to.be.false;
    });
  });

  describe('attributes', () => {
    beforeEach(async () => {
      upload = fixtureSync(`
        <vaadin-upload
          disabled
          nodrop
          no-auto
          with-credentials
          timeout="500"
          max-files="5"
          max-file-size="1000"
          max-concurrent-uploads="2"
          headers='{"X-Foo": "Bar"}'
        ></vaadin-upload>
      `);
      await nextRender();
    });

    it('should set disabled property from attribute', () => {
      expect(upload.disabled).to.be.true;
    });

    it('should set nodrop property from attribute', () => {
      expect(upload.nodrop).to.be.true;
    });

    it('should set noAuto property from attribute', () => {
      expect(upload.noAuto).to.be.true;
    });

    it('should set withCredentials property from attribute', () => {
      expect(upload.withCredentials).to.be.true;
    });

    it('should set timeout property from attribute', () => {
      expect(upload.timeout).to.equal(500);
    });

    it('should set maxFiles property from attribute', () => {
      expect(upload.maxFiles).to.equal(5);
    });

    it('should set maxFileSize property from attribute', () => {
      expect(upload.maxFileSize).to.equal(1000);
    });

    it('should set maxConcurrentUploads property from attribute', () => {
      expect(upload.maxConcurrentUploads).to.equal(2);
    });

    it('should parse headers property from JSON string attribute', () => {
      expect(upload.headers).to.deep.equal({ 'X-Foo': 'Bar' });
    });
  });

  describe('reflection', () => {
    beforeEach(async () => {
      upload = fixtureSync(`<vaadin-upload></vaadin-upload>`);
      await nextRender();
    });

    it('should toggle disabled attribute on disabled property change', async () => {
      upload.disabled = true;
      await nextUpdate(upload);
      expect(upload.hasAttribute('disabled')).to.be.true;

      upload.disabled = false;
      await nextUpdate(upload);
      expect(upload.hasAttribute('disabled')).to.be.false;
    });

    it('should toggle nodrop attribute on nodrop property change', async () => {
      upload.nodrop = true;
      await nextUpdate(upload);
      expect(upload.hasAttribute('nodrop')).to.be.true;

      upload.nodrop = false;
      await nextUpdate(upload);
      expect(upload.hasAttribute('nodrop')).to.be.false;
    });

    it('should toggle max-files-reached attribute when files reach maxFiles', async () => {
      upload.maxFiles = 1;
      upload.files = [createFile(100, 'image/jpeg')];
      await nextUpdate(upload);
      expect(upload.hasAttribute('max-files-reached')).to.be.true;

      upload.files = [];
      await nextUpdate(upload);
      expect(upload.hasAttribute('max-files-reached')).to.be.false;
    });

    it('should notify maxFilesReached property changes', async () => {
      const spy = sinon.spy();
      upload.addEventListener('max-files-reached-changed', spy);
      upload.maxFiles = 1;
      upload.files = [createFile(100, 'image/jpeg')];
      await nextUpdate(upload);
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0].detail.value).to.be.true;
    });
  });
});
