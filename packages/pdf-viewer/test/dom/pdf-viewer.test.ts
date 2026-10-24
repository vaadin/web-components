import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '../enable-feature-flag.js';
import '../../vaadin-pdf-viewer.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import type { PdfViewer } from '../../vaadin-pdf-viewer.js';
import { fixtureUrl, nextRenderIdle } from '../helpers.js';

describe('vaadin-pdf-viewer', () => {
  let viewer: PdfViewer;

  /** Waits for the outline, which shows the buttons that switch the view of the sidebar. */
  async function waitForOutline() {
    for (let i = 0; i < 50 && !viewer.querySelector('[slot="sidebar-header"]'); i++) {
      await nextFrame();
    }
  }

  beforeEach(async () => {
    resetUniqueId();
    viewer = fixtureSync('<vaadin-pdf-viewer></vaadin-pdf-viewer>');
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(viewer).dom.to.equalSnapshot();
    });

    it('document', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await oneEvent(viewer, 'document-load');
      await expect(viewer).dom.to.equalSnapshot();
    });

    it('loading', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      // The first update starts loading, the second one reflects the state.
      await nextUpdate(viewer);
      await nextUpdate(viewer);
      await expect(viewer).dom.to.equalSnapshot();
    });

    it('error', async () => {
      viewer.src = fixtureUrl('invalid.pdf');
      await oneEvent(viewer, 'document-error');
      await nextFrame();
      await expect(viewer).dom.to.equalSnapshot();
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

    it('find bar', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await oneEvent(viewer, 'document-load');
      await nextUpdate(viewer);
      viewer.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="find"]')!.click();
      await nextRender();
      await expect(viewer).dom.to.equalSnapshot();
    });

    it('sidebar', async () => {
      viewer.sidebarOpened = true;
      viewer.src = fixtureUrl('outline.pdf');
      await oneEvent(viewer, 'document-load');
      await waitForOutline();
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

    it('error', async () => {
      viewer.src = fixtureUrl('invalid.pdf');
      await oneEvent(viewer, 'document-error');
      await nextFrame();
      await expect(viewer).shadowDom.to.equalSnapshot();
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

    it('find bar', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextRenderIdle(viewer);
      viewer.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="find"]')!.click();
      await nextRender();
      await expect(viewer).shadowDom.to.equalSnapshot({ ignoreAttributes: ['style', 'width', 'height'] });
    });

    it('password error', async () => {
      viewer.src = fixtureUrl('encrypted.pdf');
      await oneEvent(viewer, 'document-error');
      await nextFrame();
      await expect(viewer).shadowDom.to.equalSnapshot();
    });
  });

  describe('sidebar', () => {
    it('thumbnails', async () => {
      viewer.sidebarOpened = true;
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextRenderIdle(viewer);
      const sidebar = viewer.shadowRoot!.querySelector('[part="sidebar"]')!;
      // The thumbnails near the visible part of the list render one at a time.
      await expect(sidebar).dom.to.equalSnapshot({ ignoreTags: ['canvas'], ignoreAttributes: ['style'] });
    });

    it('outline', async () => {
      viewer.sidebarOpened = true;
      viewer.src = fixtureUrl('outline.pdf');
      await nextRenderIdle(viewer);
      await waitForOutline();
      viewer.querySelector<HTMLElement>('[slot="sidebar-header"][icon="outline"]')!.click();
      await nextRender();
      viewer.shadowRoot!.querySelector<HTMLElement>('[part~="outline-toggle"]')!.click();
      await nextRender();
      // The item of the current page is marked once the pages of the items are known.
      for (let i = 0; i < 50 && !viewer.shadowRoot!.querySelector('[part~="outline-item"][aria-current]'); i++) {
        await nextFrame();
      }
      await expect(viewer.shadowRoot!.querySelector('[part="outline"]')).dom.to.equalSnapshot();
    });
  });

  describe('page', () => {
    it('tagged', async () => {
      viewer.src = fixtureUrl('tagged.pdf');
      await nextRenderIdle(viewer);
      const page = viewer.shadowRoot!.querySelector('[part="page"]')!;
      // Sizes and positions depend on the browser and the device pixel ratio
      await expect(page).dom.to.equalSnapshot({ ignoreAttributes: ['style', 'width', 'height'] });
    });
  });
});
