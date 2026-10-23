import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import { acquireWorker, loadPdfjs, releaseWorker } from '../src/pdfjs-loader.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { createPdfUrl, fixtureUrl, loadDocument } from './helpers.js';

describe('download', () => {
  let viewer: PdfViewer;
  let clickStub: sinon.SinonStub;
  let createObjectUrlSpy: sinon.SinonSpy;

  function getButton() {
    return viewer.querySelector<HTMLElement & { disabled: boolean }>('vaadin-pdf-viewer-button[icon="download"]');
  }

  /**
   * Returns a promise for the next download, with the link that starts it
   * and the data that it saves.
   */
  function nextDownload() {
    return new Promise<{ link: HTMLAnchorElement; blob: Blob }>((resolve) => {
      clickStub.callsFake(function (this: HTMLAnchorElement) {
        resolve({ link: this, blob: createObjectUrlSpy.lastCall.args[0] });
      });
    });
  }

  /**
   * Returns the prototype of the documents of pdf.js, which pdf.js does not export,
   * for stubbing the methods that the viewer calls.
   */
  async function getPdfDocumentPrototype(): Promise<any> {
    const pdfjs = await loadPdfjs();
    const handle = acquireWorker(pdfjs);
    const task = pdfjs.getDocument({ url: fixtureUrl('multi-page.pdf'), worker: handle.worker! });
    try {
      return Object.getPrototypeOf(await task.promise);
    } finally {
      await task.destroy();
      releaseWorker(handle);
    }
  }

  async function getOriginal(): Promise<Uint8Array> {
    const response = await fetch(fixtureUrl('multi-page.pdf'));
    return new Uint8Array(await response.arrayBuffer());
  }

  beforeEach(async () => {
    clickStub = sinon.stub(HTMLAnchorElement.prototype, 'click');
    createObjectUrlSpy = sinon.spy(URL, 'createObjectURL');
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 400px"></vaadin-pdf-viewer>');
    await nextRender();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('button', () => {
    it('should disable the button without document', () => {
      expect(getButton()!.disabled).to.be.true;
    });

    it('should disable the button while the document loads', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextUpdate(viewer);
      expect(getButton()!.disabled).to.be.true;
    });

    it('should enable the button when the document has loaded', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      await nextUpdate(viewer);
      expect(getButton()!.disabled).to.be.false;
    });

    it('should use i18n for the accessible name', async () => {
      expect(getButton()!.getAttribute('aria-label')).to.equal('Download');
      viewer.i18n = { download: 'Lataa' };
      await nextUpdate(viewer);
      expect(getButton()!.getAttribute('aria-label')).to.equal('Lataa');
    });

    it('should toggle the button on downloadButtonHidden change', async () => {
      viewer.downloadButtonHidden = true;
      await nextUpdate(viewer);
      expect(getButton()).to.be.null;
      viewer.downloadButtonHidden = false;
      await nextUpdate(viewer);
      expect(getButton()).to.be.ok;
    });

    it('should hide the button with the attribute', async () => {
      viewer.setAttribute('download-button-hidden', '');
      await nextUpdate(viewer);
      expect(viewer.downloadButtonHidden).to.be.true;
      expect(getButton()).to.be.null;
    });
  });

  describe('with document', () => {
    beforeEach(async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      await nextUpdate(viewer);
    });

    it('should download the original file on button click', async () => {
      const download = nextDownload();
      getButton()!.click();
      const { blob } = await download;
      expect(blob.type).to.equal('application/pdf');
      expect(new Uint8Array(await blob.arrayBuffer())).to.deep.equal(await getOriginal());
    });

    it('should download the original file with download()', async () => {
      const download = nextDownload();
      viewer.download();
      const { link, blob } = await download;
      expect(link.href).to.equal(createObjectUrlSpy.lastCall.returnValue);
      expect(new Uint8Array(await blob.arrayBuffer())).to.deep.equal(await getOriginal());
    });

    it('should download with download() while the button is hidden', async () => {
      viewer.downloadButtonHidden = true;
      await nextUpdate(viewer);
      const download = nextDownload();
      viewer.download();
      const { link } = await download;
      expect(link.download).to.equal('multi-page.pdf');
    });

    it('should not request the document again', async () => {
      performance.clearResourceTimings();
      const url = fixtureUrl('links.pdf');
      await loadDocument(viewer, 'links.pdf');
      expect(performance.getEntriesByName(url)).to.have.lengthOf(1);
      const download = nextDownload();
      viewer.download();
      await download;
      expect(performance.getEntriesByName(url)).to.have.lengthOf(1);
    });

    it('should use the file name of the URL, also when the document asks to show its title', async () => {
      const download = nextDownload();
      viewer.download();
      const { link } = await download;
      // The document title is the accessible name, see the accessibility tests.
      expect(viewer.getAttribute('aria-label')).to.equal('Multi-page fixture');
      expect(link.download).to.equal('multi-page.pdf');
    });

    it('should use the title for a blob URL', async () => {
      const blob = await fetch(fixtureUrl('multi-page.pdf')).then((response) => response.blob());
      const url = URL.createObjectURL(blob);
      try {
        const loaded = oneEvent(viewer, 'document-load');
        viewer.src = url;
        await loaded;
        const download = nextDownload();
        viewer.download();
        const { link } = await download;
        expect(link.download).to.equal('Multi-page fixture.pdf');
      } finally {
        URL.revokeObjectURL(url);
      }
    });

    it('should use a fallback name for a document without name', async () => {
      const loaded = oneEvent(viewer, 'document-load');
      viewer.src = createPdfUrl(1);
      await loaded;
      const download = nextDownload();
      viewer.download();
      const { link } = await download;
      expect(link.download).to.equal('document.pdf');
    });

    it('should decode the file name and ignore the query string', async () => {
      const loaded = oneEvent(viewer, 'document-load');
      viewer.src = `${fixtureUrl('multi-page.pdf').replace('multi-page.pdf', 'multi%2Dpage.pdf')}?version=2`;
      await loaded;
      const download = nextDownload();
      viewer.download();
      const { link } = await download;
      expect(link.download).to.equal('multi-page.pdf');
    });

    it('should use the file name set with fileName', async () => {
      viewer.fileName = 'report.pdf';
      const download = nextDownload();
      viewer.download();
      const { link } = await download;
      expect(link.download).to.equal('report.pdf');
    });

    it('should warn when the file cannot be read', async () => {
      const warnStub = sinon.stub(console, 'warn');
      sinon.stub(await getPdfDocumentPrototype(), 'getData').rejects(new Error('Read failed'));
      viewer.download();
      await nextFrame();
      expect(warnStub).to.be.calledOnceWith('Failed to download the PDF document: Read failed');
      expect(clickStub).to.be.not.called;
    });

    it('should do nothing when not attached', async () => {
      viewer.remove();
      viewer.download();
      await nextFrame();
      expect(clickStub).to.be.not.called;
    });

    it('should release the data when detached', async () => {
      const revokeSpy = sinon.spy(URL, 'revokeObjectURL');
      const download = nextDownload();
      viewer.download();
      const { link } = await download;
      expect(revokeSpy).to.be.not.called;
      viewer.remove();
      expect(revokeSpy).to.be.calledOnceWith(link.href);
    });

    describe('release timer', () => {
      let clock: sinon.SinonFakeTimers;

      beforeEach(() => {
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
      });

      afterEach(() => {
        clock.restore();
      });

      it('should release the data after a minute', async () => {
        const revokeSpy = sinon.spy(URL, 'revokeObjectURL');
        const download = nextDownload();
        viewer.download();
        const { link } = await download;
        await clock.tickAsync(59000);
        expect(revokeSpy).to.be.not.called;
        await clock.tickAsync(1000);
        expect(revokeSpy).to.be.calledOnceWith(link.href);
        viewer.remove();
        expect(revokeSpy).to.be.calledOnce;
      });
    });

    describe('while reading the file', () => {
      let release: () => void;

      beforeEach(async () => {
        // Delay the bytes of the documents until released, then return those of the
        // loaded document, also when it is unloaded meanwhile.
        const data = await getOriginal();
        const released = new Promise<void>((resolve) => {
          release = resolve;
        });
        sinon.stub(await getPdfDocumentPrototype(), 'getData').callsFake(async () => {
          await released;
          return data;
        });
      });

      it('should download the file with its own name when another document loads', async () => {
        const download = nextDownload();
        getButton()!.click();
        await loadDocument(viewer, 'links.pdf');
        release();
        const { link, blob } = await download;
        expect(link.download).to.equal('multi-page.pdf');
        expect(new Uint8Array(await blob.arrayBuffer())).to.deep.equal(await getOriginal());
      });

      it('should download the file with the name from when the download started', async () => {
        const download = nextDownload();
        getButton()!.click();
        viewer.fileName = 'other.pdf';
        release();
        const { link } = await download;
        expect(link.download).to.equal('multi-page.pdf');
      });

      it('should not download the file when detached meanwhile', async () => {
        getButton()!.click();
        viewer.remove();
        release();
        await nextFrame();
        expect(clickStub).to.be.not.called;
      });
    });
  });

  describe('before load', () => {
    it('should download the document once loaded when called in the same task as setting src', async () => {
      const download = nextDownload();
      viewer.src = fixtureUrl('multi-page.pdf');
      viewer.download();
      const { link, blob } = await download;
      expect(viewer.pageCount).to.equal(6);
      expect(link.download).to.equal('multi-page.pdf');
      expect(new Uint8Array(await blob.arrayBuffer())).to.deep.equal(await getOriginal());
    });

    it('should download the document once loaded when called while it loads', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      // The update that starts loading
      await nextUpdate(viewer);
      const download = nextDownload();
      viewer.download();
      const { link } = await download;
      expect(link.download).to.equal('multi-page.pdf');
    });

    it('should download the new document when src changes while loading', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextUpdate(viewer);
      const download = nextDownload();
      viewer.download();
      viewer.src = fixtureUrl('links.pdf');
      const { link } = await download;
      expect(link.download).to.equal('links.pdf');
      expect(clickStub).to.be.calledOnce;
    });

    it('should do nothing without src', async () => {
      viewer.download();
      await nextFrame();
      await loadDocument(viewer, 'multi-page.pdf');
      await nextFrame();
      expect(clickStub).to.be.not.called;
    });

    it('should do nothing when the document could not be loaded', async () => {
      viewer.src = fixtureUrl('invalid.pdf');
      viewer.download();
      await oneEvent(viewer, 'document-error');
      await nextFrame();
      await loadDocument(viewer, 'multi-page.pdf');
      await nextFrame();
      expect(clickStub).to.be.not.called;
    });

    it('should do nothing when src is cleared while loading', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextUpdate(viewer);
      viewer.download();
      viewer.src = '';
      await nextFrame();
      await loadDocument(viewer, 'multi-page.pdf');
      await nextFrame();
      expect(clickStub).to.be.not.called;
    });

    it('should do nothing when detached as the document loads', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      viewer.download();
      viewer.addEventListener('document-load', () => viewer.remove(), { once: true });
      await oneEvent(viewer, 'document-load');
      await nextFrame();
      expect(clickStub).to.be.not.called;
    });

    it('should do nothing when detached while loading', async () => {
      const parent = viewer.parentElement!;
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextUpdate(viewer);
      viewer.download();
      viewer.remove();
      await nextFrame();
      const loaded = oneEvent(viewer, 'document-load');
      parent.appendChild(viewer);
      await loaded;
      await nextFrame();
      expect(clickStub).to.be.not.called;
    });
  });
});
