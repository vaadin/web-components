import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-upload.js';
import { createFile } from './common.js';

const FAKE_FILE = createFile(100000, 'application/uknown');

describe('a11y', () => {
  describe('<vaadin-upload>', () => {
    let uploadElement, fileList;

    beforeEach(async () => {
      uploadElement = fixtureSync(`<vaadin-upload></vaadin-upload>`);
      uploadElement.files = [FAKE_FILE];

      await nextRender();

      fileList = uploadElement.shadowRoot.querySelector('[part=file-list]');
    });

    describe('file list', () => {
      it('should be a <ul> element', () => {
        expect(fileList).to.be.an.instanceOf(HTMLUListElement);
      });
    });
  });

  describe('<vaadin-upload-file>', () => {
    let uploadFileElement, i18n, button, name;

    beforeEach(() => {
      uploadFileElement = fixtureSync(`<vaadin-upload-file></vaadin-upload-file>`);
      i18n = {
        file: {
          start: 'Start',
          retry: 'Retry',
          remove: 'Remove'
        }
      };
      uploadFileElement.i18n = i18n;
      uploadFileElement.file = FAKE_FILE;

      name = uploadFileElement.shadowRoot.querySelector('[part=name]');
    });

    describe('start button', () => {
      beforeEach(() => {
        button = uploadFileElement.shadowRoot.querySelector('[part=start-button]');
      });

      it('should be a <button> element', () => {
        expect(button).to.be.an.instanceOf(HTMLButtonElement);
      });

      it('should have aria-describedby attribute', () => {
        expect(button.getAttribute('aria-describedby')).to.equal(name.id);
      });

      it('should have aria-label attribute', () => {
        expect(button.getAttribute('aria-label')).to.equal(i18n.file.start);
      });
    });

    describe('retry button', () => {
      beforeEach(() => {
        button = uploadFileElement.shadowRoot.querySelector('[part=retry-button]');
      });

      it('should be a <button> element', () => {
        expect(button).to.be.an.instanceOf(HTMLButtonElement);
      });

      it('should have aria-describedby attribute', () => {
        expect(button.getAttribute('aria-describedby')).to.equal(name.id);
      });

      it('should have aria-label attribute', () => {
        expect(button.getAttribute('aria-label')).to.equal(i18n.file.retry);
      });
    });

    describe('remove button', () => {
      beforeEach(() => {
        button = uploadFileElement.shadowRoot.querySelector('[part=remove-button]');
      });

      it('should be a <button> element', () => {
        expect(button).to.be.an.instanceOf(HTMLButtonElement);
      });

      it('should have aria-describedby attribute', () => {
        expect(button.getAttribute('aria-describedby')).to.equal(name.id);
      });

      it('should have aria-label attribute', () => {
        expect(button.getAttribute('aria-label')).to.equal(i18n.file.remove);
      });
    });
  });
});
