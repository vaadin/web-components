import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-upload-file-list.js';

// Enable the feature flag so the theme propagates to upload-file children
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.modularUpload = true;

/**
 * Wait for the file list to render its children and for the children
 * to complete their Lit update cycle and receive external theme styles.
 */
async function waitForRendered() {
  await nextFrame();
  await nextFrame();
}

/**
 * Freeze the loader animation on all upload-file elements inside the given element
 * so that visual diff screenshots are deterministic.
 */
function freezeLoaderAnimation(container) {
  container.querySelectorAll('vaadin-upload-file').forEach((file) => {
    const style = document.createElement('style');
    style.textContent = '[part="loader"] { animation: none !important; opacity: 1 !important; }';
    file.shadowRoot.appendChild(style);
  });
}

describe('upload-file-list-thumbnails', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
    div.style.width = '500px';
  });

  describe('states', () => {
    beforeEach(async () => {
      element = fixtureSync('<vaadin-upload-file-list theme="thumbnails"></vaadin-upload-file-list>', div);
      element.items = [
        { name: 'image.png', progress: 100, complete: true },
        { name: 'document.pdf', progress: 100, complete: true },
      ];
      await waitForRendered();
    });

    it('complete', async () => {
      await visualDiff(div, 'complete');
    });

    it('complete-thumbnail', async () => {
      // Simulate a thumbnail on the first file
      const file = element.querySelector('vaadin-upload-file');
      file.__thumbnail =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect fill="%234dabf7" width="48" height="48"/></svg>';
      await waitForRendered();
      await visualDiff(div, 'complete-thumbnail');
    });

    it('uploading', async () => {
      element.items = [
        { name: 'image.png', uploading: true, progress: 50 },
        { name: 'document.pdf', progress: 100, complete: true },
      ];
      await waitForRendered();
      freezeLoaderAnimation(element);
      await visualDiff(div, 'uploading');
    });

    it('error', async () => {
      element.items = [
        { name: 'image.png', error: 'Could not upload file' },
        { name: 'document.pdf', progress: 100, complete: true },
      ];
      await waitForRendered();
      await visualDiff(div, 'error');
    });
  });

  describe('overflow', () => {
    it('wrapping', async () => {
      element = fixtureSync('<vaadin-upload-file-list theme="thumbnails"></vaadin-upload-file-list>', div);
      element.items = [
        { name: 'image.png', progress: 100, complete: true },
        { name: 'document.pdf', progress: 100, complete: true },
        { name: 'photo.jpg', progress: 100, complete: true },
        { name: 'notes.txt', progress: 100, complete: true },
        { name: 'video.mp4', progress: 100, complete: true },
      ];
      await waitForRendered();
      await visualDiff(div, 'wrapping');
    });
  });
});
