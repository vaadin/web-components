import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { createPdfUrl, fixtureUrl, loadDocument, nextRenderIdle, scrollSettled } from './helpers.js';

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

    it('should use the document title as accessible name when the document asks for it', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      expect(viewer.getAttribute('aria-label')).to.equal('Multi-page fixture');
    });

    it('should use the file name of src as accessible name for a document without title', async () => {
      await loadDocument(viewer, 'standard-font.pdf');
      expect(viewer.getAttribute('aria-label')).to.equal('standard-font.pdf');
    });

    it('should use fileName as accessible name', async () => {
      viewer.fileName = 'report.pdf';
      await loadDocument(viewer, 'multi-page.pdf');
      expect(viewer.getAttribute('aria-label')).to.equal('report.pdf');
    });

    it('should update its own accessible name when fileName changes', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      viewer.fileName = 'report.pdf';
      await nextUpdate(viewer);
      expect(viewer.getAttribute('aria-label')).to.equal('report.pdf');
    });

    it('should use a fallback accessible name for a document without name', async () => {
      const loaded = oneEvent(viewer, 'document-load');
      viewer.src = createPdfUrl(1);
      await loaded;
      expect(viewer.getAttribute('aria-label')).to.equal('PDF document');
    });

    it('should use a custom fallback accessible name', async () => {
      viewer.i18n = { document: 'PDF-Dokument' };
      const loaded = oneEvent(viewer, 'document-load');
      viewer.src = createPdfUrl(1);
      await loaded;
      expect(viewer.getAttribute('aria-label')).to.equal('PDF-Dokument');
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
      viewer.src = fixtureUrl('invalid.pdf');
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
      viewer.src = fixtureUrl('multi-page.pdf');
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

    it('should make the page area focusable once a document has loaded', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      await nextUpdate(viewer);
      expect(getContent().getAttribute('tabindex')).to.equal('0');
    });

    it('should label each page', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      const pages = viewer.shadowRoot!.querySelectorAll('[part~="page"]');
      expect(pages[2].getAttribute('role')).to.equal('group');
      expect(pages[2].getAttribute('aria-label')).to.equal('Page 3');
    });

    it('should update the page labels when i18n changes', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      viewer.i18n = { pageLabel: 'Seite {page}' };
      await nextUpdate(viewer);
      const pages = viewer.shadowRoot!.querySelectorAll('[part~="page"]');
      expect(pages[2].getAttribute('aria-label')).to.equal('Seite 3');
    });

    it('should use headerTitle as accessible name while the header is hidden', async () => {
      viewer.fileName = 'report.pdf';
      viewer.headerTitle = 'Annual report';
      await loadDocument(viewer, 'multi-page.pdf');
      expect(viewer.getAttribute('aria-label')).to.equal('Annual report');
    });

    it('should update its own accessible name when headerTitle changes', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      viewer.headerTitle = 'Annual report';
      await nextUpdate(viewer);
      expect(viewer.getAttribute('aria-label')).to.equal('Annual report');
      viewer.headerTitle = '';
      await nextUpdate(viewer);
      expect(viewer.getAttribute('aria-label')).to.equal('Multi-page fixture');
    });

    it('should keep an accessible name set by the application when headerTitle changes', async () => {
      viewer.setAttribute('aria-label', 'Invoice');
      await loadDocument(viewer, 'multi-page.pdf');
      viewer.headerTitle = 'Annual report';
      await nextUpdate(viewer);
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
      // The language sets the format of the announced zoom.
      viewer = fixtureSync('<vaadin-pdf-viewer lang="en" style="width: 400px; height: 400px"></vaadin-pdf-viewer>');
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

    it('should scroll by a page with PageDown', async () => {
      getContent().focus();
      await sendKeys({ press: 'PageDown' });
      await scrollSettled(getContent());
      // Browsers scroll by about a page; the viewer does the same in Safari
      expect(getContent().scrollTop).to.be.greaterThan(getContent().clientHeight * 0.5);
    });

    it('should scroll to the end with End', async () => {
      getContent().focus();
      await sendKeys({ press: 'End' });
      await scrollSettled(getContent());
      const content = getContent();
      expect(content.scrollTop).to.be.closeTo(content.scrollHeight - content.clientHeight, 2);
    });

    it('should leave Shift+ArrowDown, which extends a text selection, to the browser', async () => {
      const spy = sinon.spy();
      document.addEventListener('keydown', spy);
      getContent().focus();
      await sendKeys({ press: 'Shift+ArrowDown' });
      document.removeEventListener('keydown', spy);
      // WebKit scrolls the pages itself when there is no selection to extend
      const event = spy.args.map(([e]) => e).find((e) => e.key === 'ArrowDown');
      expect(event.defaultPrevented).to.be.false;
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

    it('should zoom with Ctrl+= from a toolbar button', async () => {
      viewer.zoom = 1;
      await nextRenderIdle(viewer);
      viewer.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="next-page"]')!.focus();
      const zoomChanged = oneEvent(viewer, 'zoom-changed');
      await sendKeys({ press: 'Control+Equal' });
      await zoomChanged;
      expect(viewer.zoom).to.equal(1.25);
    });

    it('should not zoom with Ctrl+= in the page field', async () => {
      const spy = sinon.spy();
      viewer.addEventListener('zoom-changed', spy);
      viewer.querySelector<HTMLElement>('vaadin-integer-field')!.focus();
      await sendKeys({ press: 'Control+Equal' });
      await nextFrame();
      expect(spy).to.be.not.called;
    });

    it('should not zoom with Ctrl+= in a text area of the application', async () => {
      const textArea = document.createElement('textarea');
      textArea.slot = 'toolbar-actions';
      viewer.appendChild(textArea);
      const spy = sinon.spy();
      viewer.addEventListener('zoom-changed', spy);
      textArea.focus();
      await sendKeys({ press: 'Control+Equal' });
      await nextFrame();
      expect(spy).to.be.not.called;
    });

    describe('announcements', () => {
      let clock: sinon.SinonFakeTimers;

      function getAnnouncement() {
        return [...document.body.children].find((element) => element.hasAttribute('aria-live'))!.textContent;
      }

      beforeEach(async () => {
        viewer.zoom = 1;
        await nextRenderIdle(viewer);
        getContent().focus();
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
      });

      afterEach(() => {
        clock.restore();
      });

      it('should announce the zoom when zooming with the keyboard', async () => {
        await sendKeys({ press: 'Control+Equal' });
        await clock.tickAsync(200);
        expect(getAnnouncement()).to.equal('125%');
      });

      it('should announce page width when resetting the zoom with the keyboard', async () => {
        await sendKeys({ press: 'Control+Digit0' });
        await clock.tickAsync(200);
        expect(getAnnouncement()).to.equal('Page width');
      });

      it('should announce the page when going to the last page with the keyboard', async () => {
        await sendKeys({ press: 'Control+End' });
        await clock.tickAsync(200);
        expect(getAnnouncement()).to.equal('Page 6 of 6');
      });

      it('should announce the page when going to the first page with the keyboard', async () => {
        await sendKeys({ press: 'Control+End' });
        await clock.tickAsync(200);
        await sendKeys({ press: 'Control+Home' });
        await clock.tickAsync(200);
        expect(getAnnouncement()).to.equal('Page 1 of 6');
      });

      it('should not announce the page when scrolling', async () => {
        const region = [...document.body.children].find((element) => element.hasAttribute('aria-live'))!;
        region.textContent = '';
        const scrolled = oneEvent(getContent(), 'scroll');
        getContent().scrollTop = getContent().scrollHeight;
        await scrolled;
        await clock.tickAsync(200);
        expect(viewer.page).to.equal(6);
        expect(getAnnouncement()).to.equal('');
      });
    });
  });
});
