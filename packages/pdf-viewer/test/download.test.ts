import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';
import type { Tooltip } from '@vaadin/tooltip';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import {
  createPdfUrl,
  type Fixture,
  fixtureUrl,
  getPdfDocumentPrototype,
  loadDocument,
  loadFixtureFrom,
} from './helpers.js';

describe('download', () => {
  let viewer: PdfViewer;
  let clickStub: sinon.SinonStub;
  let createObjectUrlSpy: sinon.SinonSpy;

  function getButton() {
    return viewer.querySelector<HTMLElement & { disabled: boolean }>('vaadin-pdf-viewer-button[icon="download"]');
  }

  function nextDownload() {
    return new Promise<{ link: HTMLAnchorElement; blob: Blob }>((resolve) => {
      function fakeClick(this: HTMLAnchorElement) {
        resolve({ link: this, blob: createObjectUrlSpy.lastCall.args[0] });
      }
      clickStub.callsFake(fakeClick);
    });
  }

  async function getOriginal(name: Fixture = 'multi-page.pdf'): Promise<Uint8Array> {
    const response = await fetch(fixtureUrl(name));
    return new Uint8Array(await response.arrayBuffer());
  }

  beforeEach(async () => {
    // The warnings are issued once per page, so that each test sees its own.
    clearWarnings();
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

    it('should use i18n for the tooltip', async () => {
      const getTooltipText = () => getButton()!.querySelector<Tooltip>('vaadin-tooltip')!.text;
      expect(getTooltipText()).to.equal('Download');
      viewer.i18n = { download: 'Lataa' };
      await nextUpdate(viewer);
      expect(getTooltipText()).to.equal('Lataa');
    });

    it('should toggle the button on downloadButtonHidden change', async () => {
      viewer.downloadButtonHidden = true;
      await nextUpdate(viewer);
      expect(getButton()!.checkVisibility()).to.be.false;
      viewer.downloadButtonHidden = false;
      await nextUpdate(viewer);
      expect(getButton()!.checkVisibility()).to.be.true;
    });

    it('should hide the button with the attribute', async () => {
      viewer.setAttribute('download-button-hidden', '');
      await nextUpdate(viewer);
      expect(viewer.downloadButtonHidden).to.be.true;
      expect(getButton()!.checkVisibility()).to.be.false;
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

    it('should use the file name of the URL', async () => {
      const download = nextDownload();
      viewer.download();
      const { link } = await download;
      expect(link.download).to.equal('multi-page.pdf');
    });

    it('should use a fallback name for a blob URL instead of the title of the document', async () => {
      const blob = await fetch(fixtureUrl('multi-page.pdf')).then((response) => response.blob());
      const url = URL.createObjectURL(blob);
      try {
        const loaded = oneEvent(viewer, 'document-load');
        viewer.src = url;
        await loaded;
        const download = nextDownload();
        viewer.download();
        const { link } = await download;
        expect(link.download).to.equal('document.pdf');
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

    it('should use the file name from the Content-Disposition header', async () => {
      await loadFixtureFrom(viewer, new URL('/files/multi-page.pdf', location.href).href, {
        'Content-Disposition': 'inline; filename="report.pdf"',
      });
      const download = nextDownload();
      viewer.download();
      const { link } = await download;
      expect(link.download).to.equal('report.pdf');
    });

    it('should use a fallback name for a URL without a PDF file name', async () => {
      await loadFixtureFrom(viewer, new URL('/files/123', location.href).href);
      const download = nextDownload();
      viewer.download();
      const { link } = await download;
      expect(link.download).to.equal('document.pdf');
    });

    it('should use the file name set with fileName', async () => {
      viewer.fileName = 'report.pdf';
      const download = nextDownload();
      viewer.download();
      const { link } = await download;
      expect(link.download).to.equal('report.pdf');
    });

    it('should use the file name set with fileName instead of the one from the Content-Disposition header', async () => {
      await loadFixtureFrom(viewer, new URL('/files/multi-page.pdf', location.href).href, {
        'Content-Disposition': 'inline; filename="report.pdf"',
      });
      viewer.fileName = 'summary.pdf';
      const download = nextDownload();
      viewer.download();
      const { link } = await download;
      expect(link.download).to.equal('summary.pdf');
    });

    it('should use the file name set with fileName as given', async () => {
      viewer.fileName = 'report';
      const download = nextDownload();
      viewer.download();
      const { link } = await download;
      expect(link.download).to.equal('report');
    });

    it('should warn when the file cannot be read', async () => {
      const warnStub = sinon.stub(console, 'warn');
      sinon.stub(await getPdfDocumentPrototype(), 'getData').rejects(new Error('Read failed'));
      viewer.download();
      await nextFrame();
      expect(warnStub).to.be.calledOnceWith('Failed to download the PDF document: Read failed');
      expect(clickStub).to.be.not.called;
    });

    it('should not warn when the file cannot be read after the document is unloaded', async () => {
      const warnStub = sinon.stub(console, 'warn');
      let reject!: (error: Error) => void;
      const getDataStub = sinon.stub(await getPdfDocumentPrototype(), 'getData').callsFake(
        () =>
          new Promise((_, rejectData) => {
            reject = rejectData;
          }),
      );
      viewer.download();
      await nextFrame();
      expect(getDataStub).to.be.calledOnce;
      await loadDocument(viewer, 'links.pdf');
      reject(new Error('Worker was destroyed'));
      await nextFrame();
      expect(warnStub).to.be.not.called;
      expect(clickStub).to.be.not.called;
    });

    it('should do nothing when not attached', async () => {
      const getDataSpy = sinon.spy(await getPdfDocumentPrototype(), 'getData');
      viewer.remove();
      viewer.download();
      await nextFrame();
      expect(getDataSpy).to.be.not.called;
    });

    it('should download when detached right after download()', async () => {
      const download = nextDownload();
      viewer.download();
      viewer.remove();
      const { link } = await download;
      expect(link.download).to.equal('multi-page.pdf');
    });

    it('should download the new document when src is set right after download()', async () => {
      const download = nextDownload();
      viewer.download();
      viewer.src = fixtureUrl('links.pdf');
      const { link, blob } = await download;
      expect(link.download).to.equal('links.pdf');
      expect(new Uint8Array(await blob.arrayBuffer())).to.deep.equal(await getOriginal('links.pdf'));
      expect(clickStub).to.be.calledOnce;
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

      it('should keep the data for a minute when detached right after download()', async () => {
        const revokeSpy = sinon.spy(URL, 'revokeObjectURL');
        const download = nextDownload();
        viewer.download();
        viewer.remove();
        const { link } = await download;
        await clock.tickAsync(59000);
        expect(revokeSpy).to.be.not.called;
        await clock.tickAsync(1000);
        expect(revokeSpy).to.be.calledOnceWith(link.href);
      });
    });

    describe('while reading the file', () => {
      let release: () => void;
      // Resolves when the viewer starts reading the bytes.
      let reading: Promise<void>;

      beforeEach(async () => {
        // Hold the bytes until `release()`, then return them also when the document is unloaded meanwhile.
        const data = await getOriginal();
        const released = new Promise<void>((resolve) => {
          release = resolve;
        });
        let readingStarted: () => void;
        reading = new Promise<void>((resolve) => {
          readingStarted = resolve;
        });
        sinon.stub(await getPdfDocumentPrototype(), 'getData').callsFake(async () => {
          readingStarted();
          await released;
          return data;
        });
      });

      it('should download the file with its own name when another document loads', async () => {
        const download = nextDownload();
        getButton()!.click();
        await reading;
        await loadDocument(viewer, 'links.pdf');
        release();
        const { link, blob } = await download;
        expect(link.download).to.equal('multi-page.pdf');
        expect(new Uint8Array(await blob.arrayBuffer())).to.deep.equal(await getOriginal());
      });

      it('should download the file with the name from when the download started', async () => {
        const download = nextDownload();
        getButton()!.click();
        await reading;
        viewer.fileName = 'other.pdf';
        release();
        const { link } = await download;
        expect(link.download).to.equal('multi-page.pdf');
      });

      it('should download the file when detached meanwhile', async () => {
        const download = nextDownload();
        getButton()!.click();
        await reading;
        viewer.remove();
        release();
        const { link } = await download;
        expect(link.download).to.equal('multi-page.pdf');
      });
    });
  });

  describe('before load', () => {
    // Called when a download reads the bytes, before the link is clicked.
    let getDataSpy: sinon.SinonSpy;

    beforeEach(async () => {
      getDataSpy = sinon.spy(await getPdfDocumentPrototype(), 'getData');
    });

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
      expect(getDataSpy).to.be.not.called;
    });

    it('should do nothing when the document could not be loaded', async () => {
      viewer.src = fixtureUrl('invalid.pdf');
      viewer.download();
      await oneEvent(viewer, 'document-error');
      await nextFrame();
      await loadDocument(viewer, 'multi-page.pdf');
      await nextFrame();
      expect(getDataSpy).to.be.not.called;
    });

    it('should do nothing when src is cleared while loading', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextUpdate(viewer);
      viewer.download();
      viewer.src = '';
      await nextFrame();
      await loadDocument(viewer, 'multi-page.pdf');
      await nextFrame();
      expect(getDataSpy).to.be.not.called;
    });

    it('should do nothing when detached as the document loads', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      viewer.download();
      viewer.addEventListener('document-load', () => viewer.remove(), { once: true });
      await oneEvent(viewer, 'document-load');
      await nextFrame();
      expect(getDataSpy).to.be.not.called;
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
      expect(getDataSpy).to.be.not.called;
    });
  });
});
