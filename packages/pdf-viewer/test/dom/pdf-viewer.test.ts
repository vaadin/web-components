import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
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
    // Leaves out the tooltips of the buttons and the items of the select.
    const options = { ignoreChildren: ['vaadin-pdf-viewer-button', 'vaadin-select'] };

    it('default', async () => {
      await expect(viewer).dom.to.equalSnapshot(options);
    });

    it('document', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await oneEvent(viewer, 'document-load');
      await nextUpdate(viewer);
      await expect(viewer).dom.to.equalSnapshot(options);
    });

    it('header', async () => {
      viewer.headerVisible = true;
      viewer.src = fixtureUrl('multi-page.pdf');
      await oneEvent(viewer, 'document-load');
      await nextUpdate(viewer);
      await expect(viewer).dom.to.equalSnapshot();
    });

    it('toolbar collapsed', async () => {
      viewer.headerVisible = true;
      viewer.toolbarCollapsed = true;
      viewer.src = fixtureUrl('multi-page.pdf');
      await oneEvent(viewer, 'document-load');
      await nextUpdate(viewer);
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
      // Sizes depend on the browser and the device pixel ratio
      await expect(viewer).shadowDom.to.equalSnapshot({ ignoreAttributes: ['style', 'width', 'height'] });
    });

    it('header', async () => {
      viewer.headerVisible = true;
      viewer.headerTitle = 'Annual report';
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextRenderIdle(viewer);
      await expect(viewer).shadowDom.to.equalSnapshot({ ignoreAttributes: ['style', 'width', 'height'] });
    });

    it('toolbar collapsed', async () => {
      viewer.headerVisible = true;
      viewer.toolbarCollapsed = true;
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextRenderIdle(viewer);
      await expect(viewer).shadowDom.to.equalSnapshot({ ignoreAttributes: ['style', 'width', 'height'] });
    });
  });
});
