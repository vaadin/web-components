import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { loadDocument, nextRenderIdle } from './helpers.js';

describe('accessibility', () => {
  let viewer: PdfViewer;

  function getContent() {
    return viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
  }

  describe('host', () => {
    beforeEach(async () => {
      viewer = fixtureSync('<vaadin-pdf-viewer></vaadin-pdf-viewer>');
      await nextRender();
    });

    it('should set role to region', () => {
      expect(viewer.getAttribute('role')).to.equal('region');
    });

    it('should use the document title as accessible name', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      expect(viewer.getAttribute('aria-label')).to.equal('Multi-page fixture');
    });

    it('should use a fallback accessible name for a document without title', async () => {
      await loadDocument(viewer, 'standard-font.pdf');
      expect(viewer.getAttribute('aria-label')).to.equal('PDF document');
    });

    it('should update its own accessible name when loading another document', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      await loadDocument(viewer, 'links.pdf');
      expect(viewer.getAttribute('aria-label')).to.equal('Links fixture');
    });

    it('should keep an accessible name set by the application', async () => {
      viewer.setAttribute('aria-label', 'Invoice');
      await loadDocument(viewer, 'multi-page.pdf');
      expect(viewer.getAttribute('aria-label')).to.equal('Invoice');
    });

    it('should not set an accessible name when aria-labelledby is set', async () => {
      viewer.setAttribute('aria-labelledby', 'heading');
      await loadDocument(viewer, 'multi-page.pdf');
      expect(viewer.hasAttribute('aria-label')).to.be.false;
    });
  });

  describe('custom role', () => {
    it('should keep a role set by the application', async () => {
      viewer = fixtureSync('<vaadin-pdf-viewer role="main"></vaadin-pdf-viewer>');
      await nextRender();
      expect(viewer.getAttribute('role')).to.equal('main');
    });
  });

  describe('keyboard', () => {
    beforeEach(async () => {
      viewer = fixtureSync('<vaadin-pdf-viewer style="width: 400px; height: 400px"></vaadin-pdf-viewer>');
      await nextRender();
      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'multi-page.pdf');
      await idle;
    });

    it('should make the pages focusable after the toolbar controls', async () => {
      viewer.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="zoom-in"]')!.focus();
      await sendKeys({ press: 'Tab' });
      expect(viewer.shadowRoot!.activeElement).to.equal(getContent());
    });

    it('should scroll the pages with the arrow keys', async () => {
      getContent().focus();
      const scrolled = oneEvent(getContent(), 'scroll');
      await sendKeys({ press: 'ArrowDown' });
      await scrolled;
      expect(getContent().scrollTop).to.be.greaterThan(0);
    });

    it('should go to the last page with Ctrl+End', async () => {
      getContent().focus();
      await sendKeys({ press: 'Control+End' });
      await nextRenderIdle(viewer);
      expect(viewer.page).to.equal(6);
    });

    it('should go to the first page with Ctrl+Home', async () => {
      viewer.page = 4;
      await nextRenderIdle(viewer);
      getContent().focus();
      await sendKeys({ press: 'Control+Home' });
      await nextFrame();
      expect(viewer.page).to.equal(1);
    });

    it('should zoom in with Ctrl+=', async () => {
      viewer.zoom = 1;
      await nextRenderIdle(viewer);
      getContent().focus();
      const zoomChanged = oneEvent(viewer, 'zoom-changed');
      await sendKeys({ press: 'Control+Equal' });
      await zoomChanged;
      expect(viewer.zoom).to.equal(1.25);
    });

    it('should zoom out with Ctrl+-', async () => {
      viewer.zoom = 1;
      await nextRenderIdle(viewer);
      getContent().focus();
      const zoomChanged = oneEvent(viewer, 'zoom-changed');
      await sendKeys({ press: 'Control+Minus' });
      await zoomChanged;
      expect(viewer.zoom).to.equal(0.75);
    });

    it('should reset the zoom to page-width with Ctrl+0', async () => {
      viewer.zoom = 2;
      await nextRenderIdle(viewer);
      getContent().focus();
      const zoomChanged = oneEvent(viewer, 'zoom-changed');
      await sendKeys({ press: 'Control+Digit0' });
      await zoomChanged;
      expect(viewer.zoom).to.equal('page-width');
    });
  });
});
