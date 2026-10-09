import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '../enable-feature-flag.js';
import '../../vaadin-pdf-viewer.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import type { PdfViewer } from '../../vaadin-pdf-viewer.js';
import { fixtureUrl, nextRenderIdle } from '../helpers.js';

describe('vaadin-pdf-viewer', () => {
  let viewer: PdfViewer;

  beforeEach(async () => {
    resetUniqueId();
    viewer = fixtureSync('<vaadin-pdf-viewer></vaadin-pdf-viewer>');
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(viewer).dom.to.equalSnapshot();
    });

    it('error', async () => {
      viewer.src = fixtureUrl('invalid.pdf');
      await oneEvent(viewer, 'document-error');
      await nextFrame();
      await expect(viewer).dom.to.equalSnapshot();
    });
  });

  describe('find bar', () => {
    beforeEach(async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await oneEvent(viewer, 'document-load');
      viewer.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="find"]')!.click();
      await nextRender();
    });

    it('host', async () => {
      await expect(viewer).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(viewer).shadowDom.to.equalSnapshot();
    });

    it('document', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextRenderIdle(viewer);
      await expect(viewer).shadowDom.to.equalSnapshot({ ignoreAttributes: ['style', 'width', 'height'] });
    });

    it('error', async () => {
      viewer.src = fixtureUrl('invalid.pdf');
      await oneEvent(viewer, 'document-error');
      await nextFrame();
      await expect(viewer).shadowDom.to.equalSnapshot();
    });
  });
});
