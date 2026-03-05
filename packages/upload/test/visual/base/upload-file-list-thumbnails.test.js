import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-upload-file-list.js';
import { freezeLoaderAnimation, waitForRendered } from '../common.js';

// Enable the feature flag so the theme propagates to upload-file children
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.modularUpload = true;

describe('upload-file-list-thumbnails', () => {
  let div, element;

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.padding = '10px';
    div.style.width = '500px';
    element = fixtureSync('<vaadin-upload-file-list theme="thumbnails"></vaadin-upload-file-list>', div);
    await nextRender();
  });

  describe('states', () => {
    it('complete', async () => {
      element.items = [
        { name: 'image.png', progress: 100, complete: true },
        { name: 'document.pdf', progress: 100, complete: true },
      ];
      await waitForRendered();
      await visualDiff(div, 'complete');
    });

    it('complete-thumbnail', async () => {
      element.items = [
        { name: 'image.png', progress: 100, complete: true },
        { name: 'document.pdf', progress: 100, complete: true },
      ];
      await waitForRendered();
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
