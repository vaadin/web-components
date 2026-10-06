import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { fixtureUrl, loadDocument, nextRenderIdle } from './helpers.js';

describe('vaadin-pdf-viewer', () => {
  let viewer: PdfViewer;

  function getPages() {
    return [...viewer.shadowRoot!.querySelectorAll('[part~="page"]')];
  }

  function getErrorMessage() {
    return viewer.shadowRoot!.querySelector<HTMLElement>('[part="error-message"]')!;
  }

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer></vaadin-pdf-viewer>');
    await nextRender();
  });

  describe('custom element definition', () => {
    it('should be defined with the expected tag name', () => {
      expect(customElements.get('vaadin-pdf-viewer')).to.be.ok;
      expect(viewer.localName).to.equal('vaadin-pdf-viewer');
    });

    it('should have a valid version number', () => {
      expect((viewer.constructor as any).version).to.match(/^(\d+\.)?(\d+\.)?(\*|\d+)(-(alpha|beta|rc)\d+)?$/u);
    });
  });

  describe('loading', () => {
    it('should have no pages by default', () => {
      expect(viewer.pageCount).to.equal(0);
      expect(getPages()).to.be.empty;
    });

    it('should fire document-load event with the page count and title', async () => {
      const spy = sinon.spy();
      viewer.addEventListener('document-load', spy);
      await loadDocument(viewer, 'multi-page.pdf');
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0].detail).to.deep.equal({ pageCount: 6, title: 'Multi-page fixture' });
    });

    it('should set the page count when the document has loaded', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      expect(viewer.pageCount).to.equal(6);
    });

    it('should render the first page', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextRenderIdle(viewer);
      const pages = getPages();
      expect(pages).to.have.lengthOf(1);
      expect(pages[0].querySelector('canvas')).to.be.ok;
    });

    it('should toggle loading attribute while the document loads', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextFrame();
      expect(viewer.hasAttribute('loading')).to.be.true;
      await oneEvent(viewer, 'document-load');
      expect(viewer.hasAttribute('loading')).to.be.false;
    });

    it('should clear the document when src is removed', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      viewer.src = null;
      await nextFrame();
      expect(viewer.pageCount).to.equal(0);
      expect(getPages()).to.be.empty;
    });

    it('should only show the last document when src changes during loading', async () => {
      const spy = sinon.spy();
      viewer.addEventListener('document-load', spy);
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextFrame();
      viewer.src = fixtureUrl('links.pdf');
      await nextRenderIdle(viewer);
      expect(spy).to.be.calledOnce;
      expect(viewer.pageCount).to.equal(2);
      expect(getPages()).to.have.lengthOf(1);
    });
  });

  describe('src set before attach', () => {
    let element: PdfViewer;

    afterEach(() => {
      element.remove();
    });

    it('should load the document once attached', async () => {
      element = document.createElement('vaadin-pdf-viewer');
      element.src = fixtureUrl('links.pdf');
      const loaded = oneEvent(element, 'document-load');
      document.body.appendChild(element);
      await loaded;
      expect(element.pageCount).to.equal(2);
    });
  });

  describe('attach and detach', () => {
    beforeEach(async () => {
      await loadDocument(viewer, 'links.pdf');
    });

    it('should not reload the document when moved in the DOM', async () => {
      const spy = sinon.spy();
      viewer.addEventListener('document-load', spy);
      const parent = viewer.parentElement!;
      parent.appendChild(viewer);
      await nextFrame();
      expect(spy).to.be.not.called;
      expect(viewer.pageCount).to.equal(2);
    });

    it('should reload the document when attached again after detach', async () => {
      const parent = viewer.parentElement!;
      viewer.remove();
      await nextFrame();
      const loaded = oneEvent(viewer, 'document-load');
      parent.appendChild(viewer);
      await loaded;
      expect(viewer.pageCount).to.equal(2);
    });
  });

  describe('errors', () => {
    async function loadAndWaitForError(url: string) {
      const error = oneEvent(viewer, 'document-error');
      viewer.src = url;
      return (await error) as CustomEvent;
    }

    it('should fire document-error event with network reason for a missing file', async () => {
      const event = await loadAndWaitForError(new URL('./fixtures/missing.pdf', import.meta.url).href);
      expect(event.detail.reason).to.equal('network');
    });

    it('should fire document-error event with invalid reason for a file that is not a PDF', async () => {
      const event = await loadAndWaitForError(fixtureUrl('invalid.pdf'));
      expect(event.detail.reason).to.equal('invalid');
    });

    it('should fire document-error event with password reason for an encrypted file', async () => {
      const event = await loadAndWaitForError(fixtureUrl('encrypted.pdf'));
      expect(event.detail.reason).to.equal('password');
    });

    it('should toggle has-error attribute', async () => {
      await loadAndWaitForError(fixtureUrl('invalid.pdf'));
      expect(viewer.hasAttribute('has-error')).to.be.true;
      await loadDocument(viewer, 'links.pdf');
      expect(viewer.hasAttribute('has-error')).to.be.false;
    });

    it('should show the load error message', async () => {
      await loadAndWaitForError(fixtureUrl('invalid.pdf'));
      await nextFrame();
      expect(getErrorMessage().hidden).to.be.false;
      expect(getErrorMessage().textContent!.trim()).to.equal('The document could not be loaded.');
    });

    it('should show the password error message', async () => {
      await loadAndWaitForError(fixtureUrl('encrypted.pdf'));
      await nextFrame();
      expect(getErrorMessage().textContent!.trim()).to.equal('Password-protected documents are not supported.');
    });

    it('should use custom i18n for the error message', async () => {
      viewer.i18n = { loadError: 'Kunde inte ladda dokumentet.' };
      await loadAndWaitForError(fixtureUrl('invalid.pdf'));
      await nextFrame();
      expect(getErrorMessage().textContent!.trim()).to.equal('Kunde inte ladda dokumentet.');
    });
  });
});
