import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
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

    it('should remove its own accessible name when the next document fails to load', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      viewer.src = new URL('./fixtures/invalid.pdf', import.meta.url).href;
      await oneEvent(viewer, 'document-error');
      expect(viewer.hasAttribute('aria-label')).to.be.false;
    });

    it('should remove its own accessible name when src is cleared', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      viewer.src = '';
      await nextFrame();
      expect(viewer.hasAttribute('aria-label')).to.be.false;
    });

    it('should mark the page area as busy while loading', async () => {
      viewer.src = new URL('./fixtures/multi-page.pdf', import.meta.url).href;
      await nextUpdate(viewer);
      await nextUpdate(viewer);
      expect(getContent().getAttribute('aria-busy')).to.equal('true');
      await oneEvent(viewer, 'document-load');
      await nextFrame();
      expect(getContent().getAttribute('aria-busy')).to.equal('false');
    });

    it('should not make the empty page area focusable', () => {
      expect(getContent().getAttribute('tabindex')).to.equal('-1');
    });

    it('should label each page', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      const pages = viewer.shadowRoot!.querySelectorAll('[part~="page"]');
      expect(pages[2].getAttribute('role')).to.equal('group');
      expect(pages[2].getAttribute('aria-label')).to.equal('Page 3');
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
      viewer.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="print"]')!.focus();
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

    it('should scroll by a page with PageDown', async () => {
      getContent().focus();
      const scrolled = oneEvent(getContent(), 'scroll');
      await sendKeys({ press: 'PageDown' });
      await scrolled;
      expect(getContent().scrollTop).to.be.closeTo(getContent().clientHeight * 0.9, 2);
    });

    it('should scroll to the end with End', async () => {
      getContent().focus();
      const scrolled = oneEvent(getContent(), 'scroll');
      await sendKeys({ press: 'End' });
      await scrolled;
      const content = getContent();
      expect(content.scrollTop).to.be.closeTo(content.scrollHeight - content.clientHeight, 2);
    });

    it('should not scroll with Shift+ArrowDown, which extends a text selection', async () => {
      getContent().focus();
      await sendKeys({ press: 'Shift+ArrowDown' });
      await nextFrame();
      expect(getContent().scrollTop).to.equal(0);
    });

    it('should not zoom with Ctrl+= in the page field', async () => {
      const spy = sinon.spy();
      viewer.addEventListener('zoom-changed', spy);
      viewer.querySelector<HTMLElement>('vaadin-integer-field')!.focus();
      await sendKeys({ press: 'Control+Equal' });
      await nextFrame();
      expect(spy).to.be.not.called;
    });

    it('should go to the last page with Ctrl+End', async () => {
      getContent().focus();
      const idle = nextRenderIdle(viewer);
      await sendKeys({ press: 'Control+End' });
      await idle;
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
