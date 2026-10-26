import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { fixtureUrl, loadDocument } from './helpers.js';

describe('vaadin-pdf-viewer', () => {
  let viewer: PdfViewer;

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer></vaadin-pdf-viewer>');
    await nextRender();
  });

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      tagName = viewer.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });

  describe('loading', () => {
    it('should have no pages by default', () => {
      expect(viewer.pageCount).to.equal(0);
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

    it('should fire page-count-changed event when the document has loaded', async () => {
      const spy = sinon.spy();
      viewer.addEventListener('page-count-changed', spy);
      await loadDocument(viewer, 'multi-page.pdf');
      await nextUpdate(viewer);
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0].detail.value).to.equal(6);
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
    });

    it('should only load the last document when src changes during loading', async () => {
      const spy = sinon.spy();
      viewer.addEventListener('document-load', spy);
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextFrame();
      await loadDocument(viewer, 'standard-font.pdf');
      expect(spy).to.be.calledOnce;
      expect(viewer.pageCount).to.equal(1);
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
      expect(element.pageCount).to.equal(4);
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
      // Give a reload enough time to complete
      await loadDocument(fixtureSync<PdfViewer>('<vaadin-pdf-viewer></vaadin-pdf-viewer>'), 'links.pdf');
      expect(spy).to.be.not.called;
    });

    it('should not load the document when detached during loading', async () => {
      const spy = sinon.spy();
      viewer.addEventListener('document-load', spy);
      const parent = viewer.parentElement!;
      viewer.src = fixtureUrl('multi-page.pdf');
      // Detach right after the update that starts loading
      await nextUpdate(viewer);
      viewer.remove();
      // Give an outdated load enough time to complete
      await loadDocument(fixtureSync<PdfViewer>('<vaadin-pdf-viewer></vaadin-pdf-viewer>'), 'multi-page.pdf');
      expect(spy).to.be.not.called;
      expect(viewer.hasAttribute('loading')).to.be.false;
      parent.appendChild(viewer);
    });

    it('should load a document set while detached once attached', async () => {
      const parent = viewer.parentElement!;
      viewer.remove();
      await nextFrame();
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextFrame();
      expect(viewer.pageCount).to.equal(0);
      const loaded = oneEvent(viewer, 'document-load');
      parent.appendChild(viewer);
      await loaded;
      expect(viewer.pageCount).to.equal(6);
    });

    it('should reset the page count when detached', async () => {
      viewer.remove();
      await nextFrame();
      expect(viewer.pageCount).to.equal(0);
    });

    it('should keep the page count when moved in the DOM in the same task', async () => {
      const spy = sinon.spy();
      viewer.addEventListener('page-count-changed', spy);
      const parent = viewer.parentElement!;
      viewer.remove();
      parent.appendChild(viewer);
      await nextFrame();
      expect(spy).to.be.not.called;
      expect(viewer.pageCount).to.equal(4);
    });

    it('should reload the document when attached again after detach', async () => {
      const parent = viewer.parentElement!;
      viewer.remove();
      await nextFrame();
      const loaded = oneEvent(viewer, 'document-load');
      parent.appendChild(viewer);
      await loaded;
      expect(viewer.pageCount).to.equal(4);
    });
  });

  describe('errors', () => {
    let event: CustomEvent;

    async function loadAndWaitForError(url: string) {
      const error = oneEvent(viewer, 'document-error');
      viewer.src = url;
      event = (await error) as CustomEvent;
    }

    describe('missing file', () => {
      beforeEach(async () => {
        await loadAndWaitForError(new URL('./fixtures/missing.pdf', import.meta.url).href);
      });

      it('should fire document-error event with network reason', () => {
        expect(event.detail.reason).to.equal('network');
      });
    });

    describe('invalid file', () => {
      beforeEach(async () => {
        await loadAndWaitForError(fixtureUrl('invalid.pdf'));
      });

      it('should fire document-error event with invalid reason', () => {
        expect(event.detail.reason).to.equal('invalid');
      });

      it('should set has-error attribute', () => {
        expect(viewer.hasAttribute('has-error')).to.be.true;
      });

      it('should clear the error when a later document loads', async () => {
        await loadDocument(viewer, 'links.pdf');
        expect(viewer.hasAttribute('has-error')).to.be.false;
      });
    });

    describe('encrypted file', () => {
      beforeEach(async () => {
        await loadAndWaitForError(fixtureUrl('encrypted.pdf'));
      });

      it('should fire document-error event with password reason', () => {
        expect(event.detail.reason).to.equal('password');
      });
    });
  });

  describe('scripting', () => {
    let alertStub: sinon.SinonStub;

    beforeEach(() => {
      alertStub = sinon.stub(window, 'alert');
      performance.clearResourceTimings();
    });

    afterEach(() => {
      alertStub.restore();
    });

    it('should not run the JavaScript actions of the document', async () => {
      await loadDocument(viewer, 'javascript.pdf');
      expect(alertStub).to.be.not.called;
    });

    it('should not load the scripting sandbox of pdf.js', async () => {
      await loadDocument(viewer, 'javascript.pdf');
      const requests = performance.getEntriesByType('resource').map((entry) => entry.name);
      expect(requests.some((name) => name.endsWith('/javascript.pdf'))).to.be.true;
      expect(requests.some((name) => name.includes('pdf.sandbox'))).to.be.false;
    });
  });
});
