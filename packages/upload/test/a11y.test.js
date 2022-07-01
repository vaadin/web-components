import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-upload.js';
import { createFile } from './common.js';

const FAKE_FILE = createFile(100000, 'application/uknown');

describe('a11y', () => {
  describe('<vaadin-upload-file>', () => {
    let uploadFileElement, i18n, button, name;

    beforeEach(() => {
      uploadFileElement = fixtureSync(`<vaadin-upload-file></vaadin-upload-file>`);
      i18n = {
        file: {
          start: 'Start',
          retry: 'Retry',
          remove: 'Remove',
        },
      };
      uploadFileElement.i18n = i18n;
      uploadFileElement.file = FAKE_FILE;

      name = uploadFileElement.shadowRoot.querySelector('[part=name]');
    });

    describe('start button', () => {
      beforeEach(() => {
        button = uploadFileElement.shadowRoot.querySelector('[part=start-button]');
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

      it('should have aria-describedby attribute', () => {
        expect(button.getAttribute('aria-describedby')).to.equal(name.id);
      });

      it('should have aria-label attribute', () => {
        expect(button.getAttribute('aria-label')).to.equal(i18n.file.remove);
      });
    });
  });

  describe('upload announcements', () => {
    let clock, upload, announceRegion;

    before(() => {
      announceRegion = document.querySelector('[aria-live]');
    });

    beforeEach(() => {
      upload = fixtureSync(`<vaadin-upload></vaadin-upload>`);
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should announce upload start', () => {
      upload.dispatchEvent(new CustomEvent('upload-start', { detail: { file: { name: 'file.js' } } }));
      clock.tick(200);
      expect(announceRegion.textContent).to.equal('file.js: 0%');
      expect(announceRegion.getAttribute('role')).to.equal('alert');
    });

    it('should announce upload success', () => {
      upload.dispatchEvent(new CustomEvent('upload-success', { detail: { file: { name: 'file.js' } } }));
      clock.tick(200);
      expect(announceRegion.textContent).to.equal('file.js: 100%');
      expect(announceRegion.getAttribute('role')).to.equal('alert');
    });

    it('should announce file reject', () => {
      upload.dispatchEvent(
        new CustomEvent('file-reject', { detail: { file: { name: 'file.js', error: 'rejected' } } }),
      );
      clock.tick(200);
      expect(announceRegion.textContent).to.equal('file.js: rejected');
      expect(announceRegion.getAttribute('role')).to.equal('alert');
    });

    it('should announce upload error', () => {
      upload.dispatchEvent(new CustomEvent('upload-error', { detail: { file: { name: 'file.js', error: 'error' } } }));
      clock.tick(200);
      expect(announceRegion.textContent).to.equal('file.js: error');
      expect(announceRegion.getAttribute('role')).to.equal('alert');
    });
  });
});
