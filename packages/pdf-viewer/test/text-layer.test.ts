import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextResize, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PDFPageProxy } from 'pdfjs-dist';
import { isSafari } from '@vaadin/component-base/src/browser-utils.js';
import { getSelectionRanges } from '../src/pdf-viewer-text-selection-controller.js';
import { loadPdfjs } from '../src/pdfjs-loader.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import {
  createPdf,
  type Fixture,
  fixtureUrl,
  getPdfPagePrototype,
  loadAndRender,
  nextRenderIdle,
  type PdfPage,
} from './helpers.js';

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

  describe('rendered pages', () => {
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
    });

    it('should resize the text layer when the pages resize', async () => {
      await resizeViewer();
      const page = pages[0].getBoundingClientRect();
      const layer = getTextLayer(1)!.getBoundingClientRect();
      expect(layer.width).to.be.closeTo(page.width, 1);
      expect(layer.height).to.be.closeTo(page.height, 1);
    });

    it('should size the text layer with the page before the page renders again', async () => {
      viewer.zoom = 2;
      await nextUpdate(viewer);
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

  it('should not give marked content a box', async () => {
    // Safari paints the selection over the whole box of an element with selected text.
    await load('tagged.pdf');
    const markedContent = getTextLayer(1)!.querySelectorAll('.markedContent');
    expect(markedContent).to.not.be.empty;
    markedContent.forEach((element) => {
      expect(element.getClientRects()).to.have.lengthOf(0);
    });
  });

  it('should keep the canvas of a page whose text fails to load, and load the text again later', async () => {
    const pdfPagePrototype = await getPdfPagePrototype();
    const streamTextContent = pdfPagePrototype.streamTextContent;
    let failed = false;
    sinon.stub(pdfPagePrototype, 'streamTextContent').callsFake(function (this: PDFPageProxy, ...args) {
      if (this.pageNumber === 1 && !failed) {
        failed = true;
        return new ReadableStream({
          start(controller) {
            controller.error(new Error('Broken text'));
          },
        });
      }
      return streamTextContent.apply(this, args);
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

  it('should render the text layer when streams are not async iterable', async () => {
    // Safari 26 and earlier cannot iterate a ReadableStream with `for await`.
    const descriptor = Object.getOwnPropertyDescriptor(ReadableStream.prototype, Symbol.asyncIterator);
    delete (ReadableStream.prototype as Partial<ReadableStream>)[Symbol.asyncIterator];
    try {
      await load('multi-page.pdf');
    } finally {
      if (descriptor) {
        Object.defineProperty(ReadableStream.prototype, Symbol.asyncIterator, descriptor);
      }
    }
    expect(getTextLayer(1)!.textContent).to.include('marker1');
  });

  it('should place the text of a rotated page over the same text on the canvas', async () => {
    await load('rotated.pdf');
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

  [
    { rotate: 90, corner: 'top right' },
    { rotate: 180, corner: 'bottom right' },
    { rotate: 270, corner: 'bottom left' },
  ].forEach(({ rotate, corner }) => {
    it(`should cover a page rotated by ${rotate} degrees and place its text in the ${corner} corner`, async () => {
      // The text is at the top left of the unrotated page.
      await loadPdf([{ content: 'BT /F1 20 Tf 72 720 Td (Corner) Tj ET', rotate }]);
      const page = pages[0].getBoundingClientRect();
      const layer = getTextLayer(1)!.getBoundingClientRect();
      expect(layer.left).to.be.closeTo(page.left, 1);
      expect(layer.top).to.be.closeTo(page.top, 1);
      expect(layer.width).to.be.closeTo(page.width, 1);
      expect(layer.height).to.be.closeTo(page.height, 1);
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

  describe('selection', () => {
    let lines: HTMLElement[];

    function getSelectedText() {
      return getSelectionRanges(viewer.shadowRoot!).join('');
    }

    function nextSelectionChange() {
      return new Promise((resolve) => {
        document.addEventListener('selectionchange', resolve, { once: true });
      });
    }

    /** Selects the start of the first line, and drags into the empty space to the right of the second line. */
    async function dragOverEmptySpace() {
      const [first, second] = lines.map((line) => line.getBoundingClientRect());
      const page = pages[0].getBoundingClientRect();
      const y = Math.round(second.top + second.height / 2);
      await sendMouse({
        type: 'move',
        position: [Math.round(first.left + 2), Math.round(first.top + first.height / 2)],
      });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [Math.round(second.left + 20), y] });
      await sendMouse({ type: 'move', position: [Math.round(page.right - 10), y] });
      await nextFrame();
    }

    beforeEach(async () => {
      viewer.style.height = '900px';
      await load('multi-page.pdf');
      lines = [...getTextLayer(1)!.querySelectorAll('span')].filter((span) =>
        /^(The quick brown fox|liquor jugs)/u.test(span.textContent!),
      );
    });

    afterEach(async () => {
      await resetMouse();
      document.getSelection()!.removeAllRanges();
    });

    it('should not select the text after the pointer when dragging over empty space', async () => {
      await dragOverEmptySpace();
      expect(getSelectedText()).to.include('The quick brown fox');
      expect(getSelectedText()).to.not.include('judge my vow');
      await sendMouse({ type: 'up' });
    });

    // Firefox and Chromium 148 and later keep the selection in place without moving the element.
    (isSafari ? it : it.skip)('should move the end of the content after the text under the pointer', async () => {
      await dragOverEmptySpace();
      const end = getTextLayer(1)!.querySelector('.end-of-content')!;
      expect(end.previousElementSibling).to.equal(lines[1]);
      await sendMouse({ type: 'up' });
    });

    it('should put the end of the content back after the text when the pointer is released', async () => {
      await dragOverEmptySpace();
      await sendMouse({ type: 'up' });
      const textLayer = getTextLayer(1)!;
      const end = textLayer.lastElementChild as HTMLElement;
      expect(end.classList.contains('end-of-content')).to.be.true;
      expect(end.style.cssText).to.equal('');
      expect(textLayer.classList.contains('selecting')).to.be.false;
    });

    it('should mark the text layer as selecting while its text is selected', async () => {
      const text = lines[0].firstChild!;
      let change = nextSelectionChange();
      document.getSelection()!.setBaseAndExtent(text, 0, text, 9);
      await change;
      expect(getTextLayer(1)!.classList.contains('selecting')).to.be.true;
      change = nextSelectionChange();
      document.getSelection()!.removeAllRanges();
      await change;
      expect(getTextLayer(1)!.classList.contains('selecting')).to.be.false;
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
    await load('rotated.pdf');
    expect(stub).to.be.not.called;
  });

  ['styles/vaadin-pdf-viewer-text-layer-base-styles.js', 'pdf-viewer-text-selection-controller.js'].forEach((path) => {
    it(`should use the pdf.js version that ${path} is ported from`, async () => {
      const source = await (await fetch(new URL(`../src/${path}`, import.meta.url))).text();
      const { version } = await loadPdfjs();
      expect(source.match(/pdf\.js (\d+\.\d+\.\d+)/u)![1]).to.equal(version);
    });
  });
});
