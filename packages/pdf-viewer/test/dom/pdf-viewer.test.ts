import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
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

    it('header title', async () => {
      viewer.headerTitle = 'Annual report';
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextRenderIdle(viewer);
      await expect(viewer).shadowDom.to.equalSnapshot({ ignoreAttributes: ['style', 'width', 'height'] });
    });

    it('header hidden', async () => {
      viewer.headerHidden = true;
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextRenderIdle(viewer);
      await expect(viewer).shadowDom.to.equalSnapshot({ ignoreAttributes: ['style', 'width', 'height'] });
    });

    it('toolbar collapsed', async () => {
      viewer.toolbarCollapsed = true;
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextRenderIdle(viewer);
      await expect(viewer).shadowDom.to.equalSnapshot({ ignoreAttributes: ['style', 'width', 'height'] });
    });
  });

  describe('page', () => {
    // Sizes and positions depend on the browser and the device pixel ratio
    const ignoreAttributes = ['style', 'width', 'height'];

    it('tagged', async () => {
      viewer.src = fixtureUrl('tagged.pdf');
      await nextRenderIdle(viewer);
      const page = viewer.shadowRoot!.querySelector('[part="page"]')!;
      await expect(page).dom.to.equalSnapshot({ ignoreAttributes });
    });

    it('find matches', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextRenderIdle(viewer);
      const result = oneEvent(viewer, 'find-result');
      viewer.find('quick');
      await result;
      await nextFrame();
      const page = viewer.shadowRoot!.querySelector('[part="page"]')!;
      await expect(page).dom.to.equalSnapshot({ ignoreAttributes });
    });
  });
});
