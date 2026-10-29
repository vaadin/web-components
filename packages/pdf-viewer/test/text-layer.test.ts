import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextResize } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PDFPageProxy } from 'pdfjs-dist';
import { acquireWorker, loadPdfjs, releaseWorker } from '../src/pdfjs-loader.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { createPdf, type Fixture, fixtureUrl, loadAndRender, nextRenderIdle, type PdfPage } from './helpers.js';

/**
 * Returns the prototype of the pages of every pdf.js document, including the
 * documents of the viewer, through a page of a document loaded for that.
 */
async function getPdfPagePrototype(): Promise<PDFPageProxy> {
  const pdfjs = await loadPdfjs();
  const handle = acquireWorker(pdfjs);
  const task = pdfjs.getDocument({ url: fixtureUrl('multi-page.pdf'), worker: handle.worker! });
  try {
    const pdfPage = await (await task.promise).getPage(1);
    return Object.getPrototypeOf(pdfPage);
  } finally {
    await task.destroy();
    releaseWorker(handle);
  }
}

describe('text layer', () => {
  let viewer: PdfViewer;
  let content: HTMLElement;
  // A live collection, which follows the pages of the loaded document
  let pages: HTMLCollectionOf<HTMLElement>;
  let url: string | undefined;

  function getTextLayer(pageNumber: number) {
    return pages[pageNumber - 1].querySelector<HTMLElement>('.text-layer');
  }

  /** Makes the viewer wider, which renders the pages again at a larger scale. */
  async function resizeViewer() {
    const idle = nextRenderIdle(viewer);
    viewer.style.width = '900px';
    await nextResize(viewer);
    await idle;
  }

  async function load(name: Fixture) {
    await loadAndRender(viewer, fixtureUrl(name));
  }

  async function loadPdf(pdfPages: PdfPage[], options?: { lang?: string }) {
    url = createPdf(pdfPages, options);
    await loadAndRender(viewer, url);
  }

  beforeEach(async () => {
    url = undefined;
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 500px"></vaadin-pdf-viewer>');
    await nextRender();
    content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
    pages = viewer.shadowRoot!.querySelector('#pages')!.children as HTMLCollectionOf<HTMLElement>;
  });

  afterEach(() => {
    sinon.restore();
    if (url) {
      URL.revokeObjectURL(url);
    }
  });

  describe('text layer', () => {
    beforeEach(async () => {
      await load('multi-page.pdf');
    });

    it('should contain the text of the rendered pages', () => {
      expect(getTextLayer(1)!.textContent).to.include('Unique word on this page: marker1.');
    });

    it('should not have a text layer for pages that are not rendered', () => {
      expect(getTextLayer(6)).to.be.null;
    });

    it('should place the text over the same text on the canvas', () => {
      const page = pages[0].getBoundingClientRect();
      const heading = [...getTextLayer(1)!.querySelectorAll('span')].find((span) => span.textContent === 'Page 1')!;
      const rect = heading.getBoundingClientRect();
      // The heading is printed with a 20mm margin, which is about 57pt of the 596pt wide page
      expect((rect.left - page.left) / page.width).to.be.closeTo(56.7 / 595.92, 0.01);
      expect(rect.width).to.be.greaterThan(0);
    });

    it('should allow selecting the text', () => {
      const span = [...getTextLayer(1)!.querySelectorAll('span')].find((element) =>
        element.textContent!.startsWith('The quick brown fox'),
      )!;
      expect(getComputedStyle(span).userSelect).to.not.equal('none');
      const range = document.createRange();
      range.selectNodeContents(getTextLayer(1)!);
      expect(range.toString()).to.include('The quick brown fox');
    });

    it('should resize the text layer when the pages resize', async () => {
      await resizeViewer();
      const page = pages[0].getBoundingClientRect();
      const layer = getTextLayer(1)!.getBoundingClientRect();
      expect(layer.width).to.be.closeTo(page.width, 1);
      expect(layer.height).to.be.closeTo(page.height, 1);
    });

    it('should keep the text layer when the pages resize', async () => {
      const layer = getTextLayer(1);
      await resizeViewer();
      expect(getTextLayer(1)).to.equal(layer);
    });
  });

  it('should keep the canvas of a page whose text fails to load, and load the text again later', async () => {
    const pdfPagePrototype = await getPdfPagePrototype();
    const getTextContent = pdfPagePrototype.getTextContent;
    let failed = false;
    sinon.stub(pdfPagePrototype, 'getTextContent').callsFake(function (this: PDFPageProxy, ...args) {
      if (this.pageNumber === 1 && !failed) {
        failed = true;
        return Promise.reject(new Error('Broken text'));
      }
      return getTextContent.apply(this, args);
    });
    const warn = sinon.stub(console, 'warn');
    await load('multi-page.pdf');
    expect(getTextLayer(1)).to.be.null;
    expect(pages[0].querySelector('canvas')).to.be.ok;
    const warnings = warn.args.map(([message]) => message);
    expect(warnings).to.include('Failed to render the text of page 1 of the PDF document: Broken text');
    expect(warnings.some((message) => message.startsWith('Failed to render page'))).to.be.false;
    await resizeViewer();
    expect(getTextLayer(1)).to.be.ok;
  });

  describe('rotated page', () => {
    beforeEach(async () => {
      await load('rotated.pdf');
    });

    it('should place the text over the same text on the canvas', () => {
      const page = pages[0].getBoundingClientRect();
      const span = [...getTextLayer(1)!.querySelectorAll('span')].find(
        (element) => element.textContent === 'Rotated page',
      )!;
      const rect = span.getBoundingClientRect();
      // The text starts at 72pt from the left of the portrait page, which is the top of the rotated page.
      // Its baseline is 720pt from the bottom, which is 720pt from the left of the rotated page.
      expect((rect.top - page.top) / page.height).to.be.closeTo(72 / 595, 0.01);
      expect((rect.right - page.left) / page.width).to.be.closeTo(745 / 842, 0.02);
      expect(rect.height).to.be.greaterThan(rect.width);
    });

    it('should cover the page with the text layer', () => {
      const page = pages[0].getBoundingClientRect();
      const layer = getTextLayer(1)!.getBoundingClientRect();
      expect(layer.left).to.be.closeTo(page.left, 1);
      expect(layer.top).to.be.closeTo(page.top, 1);
      expect(layer.width).to.be.closeTo(page.width, 1);
      expect(layer.height).to.be.closeTo(page.height, 1);
    });
  });

  [
    { rotate: 90, corner: 'top right' },
    { rotate: 180, corner: 'bottom right' },
    { rotate: 270, corner: 'bottom left' },
  ].forEach(({ rotate, corner }) => {
    it(`should place the text of a page rotated by ${rotate} degrees in the ${corner} corner`, async () => {
      // The text is at the top left of the unrotated page.
      await loadPdf([{ content: 'BT /F1 20 Tf 72 720 Td (Corner) Tj ET', rotate }]);
      const page = pages[0].getBoundingClientRect();
      const text = [...getTextLayer(1)!.querySelectorAll('span')].find((span) => span.textContent === 'Corner')!;
      const rect = text.getBoundingClientRect();
      const [vertical, horizontal] = corner.split(' ');
      expect(rect.top + rect.height / 2 < page.top + page.height / 2).to.equal(vertical === 'top');
      expect(rect.left + rect.width / 2 < page.left + page.width / 2).to.equal(horizontal === 'left');
    });
  });

  describe('language', () => {
    let pagesContainer: HTMLElement;

    beforeEach(async () => {
      pagesContainer = viewer.shadowRoot!.querySelector<HTMLElement>('#pages')!;
      await loadPdf([{ content: 'BT /F1 20 Tf 50 700 Td (Hej) Tj ET' }], { lang: 'sv' });
    });

    it('should set the language of the document on the pages', () => {
      expect(pagesContainer.getAttribute('lang')).to.equal('sv');
    });

    it('should remove the language for a document without one', async () => {
      await load('multi-page.pdf');
      expect(pagesContainer.hasAttribute('lang')).to.be.false;
    });
  });

  describe('released pages', () => {
    beforeEach(() => {
      viewer.style.height = '300px';
    });

    it('should remove the text layer when a page is released', async () => {
      await load('multi-page.pdf');
      const idle = nextRenderIdle(viewer);
      content.scrollTop = content.scrollHeight;
      await idle;
      expect(getTextLayer(1)).to.be.null;
    });
  });

  it('should not warn for cancelled renders when the document changes', async () => {
    const stub = sinon.stub(console, 'warn');
    viewer.src = fixtureUrl('multi-page.pdf');
    await nextFrame();
    await load('links.pdf');
    expect(stub).to.be.not.called;
  });

  it('should use the pdf.js version that the text layer styles are ported from', async () => {
    const path = '../src/styles/vaadin-pdf-viewer-page-base-styles.js';
    const source = await (await fetch(new URL(path, import.meta.url))).text();
    const { version } = await loadPdfjs();
    expect(source.match(/pdf\.js (\d+\.\d+\.\d+)/u)![1]).to.equal(version);
  });
});
