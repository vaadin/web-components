import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import type { Button } from '@vaadin/button';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';
import type { Tooltip } from '@vaadin/tooltip';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { createPdf, fixtureUrl, getPdfDocumentPrototype, getPdfPagePrototype, loadDocument } from './helpers.js';

/** The page size in points of the fixtures that Chromium prints as A4, see `generate-fixtures.js`. */
const A4_PAGE_SIZE = { width: 595.92, height: 842.88 };

/**
 * Holds the pages of all documents from the given page number on until
 * released. Returns the function that releases them.
 */
async function holdPages(fromPage: number): Promise<() => void> {
  const prototype = await getPdfDocumentPrototype();
  const { getPage } = prototype;
  let release!: () => void;
  const released = new Promise<void>((resolve) => {
    release = resolve;
  });
  prototype.getPage = async function (this: PDFDocumentProxy, pageNumber: number) {
    if (pageNumber >= fromPage) {
      await released;
    }
    return getPage.call(this, pageNumber);
  };
  return () => {
    prototype.getPage = getPage;
    release();
  };
}

/** Waits until the condition is met, and throws when it is not met in time. */
async function waitUntil(condition: () => boolean): Promise<void> {
  for (let i = 0; i < 100 && !condition(); i++) {
    await nextFrame();
  }
  if (!condition()) {
    throw new Error('The condition was not met in time');
  }
}

describe('print', () => {
  let viewer: PdfViewer;
  let button: Button;
  let loader: HTMLElement;
  let observer: MutationObserver;
  /** Called with the print frame instead of opening the print dialog. */
  let printStub: sinon.SinonStub;
  let release: (() => void) | undefined;

  function getFrame() {
    return document.body.querySelector<HTMLIFrameElement>(':scope > iframe');
  }

  function getImages() {
    const frame = getFrame();
    return frame ? [...frame.contentDocument!.images] : [];
  }

  /** Returns the width and height in points of the `@page` rule of a printed page. */
  function getPageSize(image: HTMLImageElement) {
    const frameWindow = getFrame()!.contentWindow as typeof window;
    const [styleSheet] = frameWindow.document.adoptedStyleSheets;
    const rule = [...styleSheet.cssRules].find(
      (rule) => rule instanceof frameWindow.CSSPageRule && rule.selectorText === image.style.getPropertyValue('page'),
    ) as CSSPageRule;
    return rule.style.getPropertyValue('size').split(' ').map(parseFloat);
  }

  /** Resolves with the print frame when its print dialog would open. */
  function nextPrint() {
    return new Promise<HTMLIFrameElement>((resolve) => {
      printStub.callsFake(resolve);
    });
  }

  beforeEach(async () => {
    // Each test sees its own warnings.
    clearWarnings();
    printStub = sinon.stub();
    // Replace the print dialog of each print frame as soon as the frame is added.
    observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLIFrameElement) {
            sinon.stub(node.contentWindow!, 'print').callsFake(() => printStub(node));
          }
        });
      });
    });
    observer.observe(document.body, { childList: true });
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 400px"></vaadin-pdf-viewer>');
    await nextRender();
    button = viewer.querySelector<Button>('[slot="toolbar-print"]')!;
    loader = viewer.shadowRoot!.querySelector<HTMLElement>('[part="loader"]')!;
  });

  afterEach(() => {
    release?.();
    release = undefined;
    observer.disconnect();
    sinon.restore();
  });

  describe('button', () => {
    it('should use i18n for the tooltip', async () => {
      const getTooltipText = () => button.querySelector<Tooltip>('vaadin-tooltip')!.text;
      expect(getTooltipText()).to.equal('Print');
      viewer.i18n = { print: 'Tulosta' };
      await nextUpdate(viewer);
      expect(getTooltipText()).to.equal('Tulosta');
    });

    it('should toggle the button on printButtonHidden change', async () => {
      viewer.printButtonHidden = true;
      await nextUpdate(viewer);
      expect(button.checkVisibility()).to.be.false;
      viewer.printButtonHidden = false;
      await nextUpdate(viewer);
      expect(button.checkVisibility()).to.be.true;
    });

    it('should hide the button with the attribute', async () => {
      viewer.setAttribute('print-button-hidden', '');
      await nextUpdate(viewer);
      expect(viewer.printButtonHidden).to.be.true;
      expect(button.checkVisibility()).to.be.false;
    });
  });

  describe('with document', () => {
    beforeEach(async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      await nextUpdate(viewer);
    });

    it('should print on button click', async () => {
      const print = nextPrint();
      button.click();
      expect(await print).to.equal(getFrame());
      expect(printStub).to.be.calledOnce;
    });

    it('should print with print() while the button is hidden', async () => {
      viewer.printButtonHidden = true;
      await nextUpdate(viewer);
      await viewer.print();
      expect(printStub).to.be.calledOnce;
    });

    it('should not request the document again', async () => {
      const url = fixtureUrl('links.pdf');
      performance.clearResourceTimings();
      await loadDocument(viewer, 'links.pdf');
      expect(performance.getEntriesByName(url)).to.have.lengthOf(1);
      await viewer.print();
      expect(printStub).to.be.calledOnce;
      expect(performance.getEntriesByName(url)).to.have.lengthOf(1);
    });

    it('should show the loader and disable the print button while preparing to print', async () => {
      release = await holdPages(1);
      const printed = viewer.print();
      await waitUntil(() => viewer.hasAttribute('printing'));
      expect(loader.checkVisibility()).to.be.true;
      expect(button.disabled).to.be.true;
      release();
      await printed;
      expect(viewer.hasAttribute('printing')).to.be.false;
      expect(loader.checkVisibility()).to.be.false;
      expect(button.disabled).to.be.false;
    });

    it('should not print again while preparing to print', async () => {
      const printed = viewer.print();
      await viewer.print();
      expect(printStub).to.be.not.called;
      await printed;
      expect(printStub).to.be.calledOnce;
    });

    it('should keep focus on the print button after printing', async () => {
      button.focus();
      await viewer.print();
      expect(document.activeElement).to.equal(button);
    });

    it('should remove the print frame after printing', async () => {
      await viewer.print();
      getFrame()!.contentWindow!.dispatchEvent(new Event('afterprint'));
      expect(getFrame()).to.be.null;
    });

    it('should remove the frame of a previous print when printing again', async () => {
      await viewer.print();
      const firstFrame = getFrame()!;
      const printed = viewer.print();
      await waitUntil(() => viewer.hasAttribute('printing'));
      expect(firstFrame.isConnected).to.be.false;
      await printed;
      expect(printStub).to.be.calledTwice;
      expect(printStub.secondCall.args[0]).to.equal(getFrame());
    });

    it('should remove the frame of the last print when detached', async () => {
      await viewer.print();
      viewer.remove();
      await nextFrame();
      expect(getFrame()).to.be.null;
    });

    it('should remove the frame of the last print when another document loads', async () => {
      await viewer.print();
      await loadDocument(viewer, 'links.pdf');
      expect(getFrame()).to.be.null;
    });

    it('should cancel printing and release the prepared pages when detached', async () => {
      release = await holdPages(3);
      const revokeSpy = sinon.spy(URL, 'revokeObjectURL');
      const printed = viewer.print();
      await waitUntil(() => getImages().length >= 2);
      const urls = getImages().map((image) => image.src);
      viewer.remove();
      await nextFrame();
      expect(getFrame()).to.be.null;
      expect(revokeSpy).to.be.calledTwice;
      expect(revokeSpy.args.flat()).to.have.members(urls);
      await printed;
      await nextUpdate(viewer);
      expect(viewer.hasAttribute('printing')).to.be.false;
      expect(printStub).to.be.not.called;
    });

    it('should keep printing when moved in the DOM', async () => {
      release = await holdPages(2);
      const printed = viewer.print();
      await waitUntil(() => getImages().length >= 1);
      viewer.parentElement!.appendChild(viewer);
      await nextFrame();
      release();
      await printed;
      expect(printStub).to.be.calledOnce;
    });

    it('should not print when detached right after print()', async () => {
      const printed = viewer.print();
      viewer.remove();
      await printed;
      expect(printStub).to.be.not.called;
      expect(getFrame()).to.be.null;
    });

    it('should cancel printing when another document loads', async () => {
      release = await holdPages(3);
      const printed = viewer.print();
      await waitUntil(() => getImages().length >= 2);
      viewer.src = fixtureUrl('links.pdf');
      await oneEvent(viewer, 'document-load');
      expect(getFrame()).to.be.null;
      await printed;
      await nextUpdate(viewer);
      expect(viewer.hasAttribute('printing')).to.be.false;
      expect(printStub).to.be.not.called;
    });

    it('should not warn when printing stops while a page renders', async () => {
      const warnStub = sinon.stub(console, 'warn');
      const prototype = await getPdfPagePrototype();
      const render = prototype.render;
      function fakeRender(this: PDFPageProxy, ...args: Parameters<PDFPageProxy['render']>) {
        const task = render.apply(this, args);
        if (args[0].intent === 'print') {
          // Once the frame holds the render task, which detaching stops.
          queueMicrotask(() => viewer.remove());
        }
        return task;
      }
      sinon.stub(prototype, 'render').callsFake(fakeRender);
      await viewer.print();
      expect(warnStub).to.be.not.called;
      expect(printStub).to.be.not.called;
      expect(getFrame()).to.be.null;
    });

    it('should warn and stop when a page cannot be rendered to an image', async () => {
      const warnStub = sinon.stub(console, 'warn');
      sinon.stub(HTMLCanvasElement.prototype, 'toBlob').callsFake((callback) => callback(null));
      await viewer.print();
      expect(warnStub).to.be.calledOnceWith('Failed to print the PDF document: Failed to render page 1');
      expect(printStub).to.be.not.called;
      expect(getFrame()).to.be.null;
      await nextUpdate(viewer);
      expect(viewer.hasAttribute('printing')).to.be.false;
    });

    it('should warn and stop when the image of a page cannot be loaded', async () => {
      const warnStub = sinon.stub(console, 'warn');
      const createObjectURL = URL.createObjectURL;
      // An image URL that does not load, as when a Content Security Policy blocks it.
      sinon
        .stub(URL, 'createObjectURL')
        .callsFake((object: Blob | MediaSource) =>
          object instanceof Blob && object.type === 'image/png' ? 'blob:invalid' : createObjectURL(object),
        );
      await viewer.print();
      expect(warnStub).to.be.calledOnceWith(
        'Failed to print the PDF document: Failed to load the image of page 1. If the page has a Content Security Policy, check that its img-src directive allows blob: URLs.',
      );
      expect(printStub).to.be.not.called;
      expect(getFrame()).to.be.null;
    });
  });

  describe('before load', () => {
    it('should resolve without printing without a document', async () => {
      await viewer.print();
      expect(printStub).to.be.not.called;
      expect(getFrame()).to.be.null;
    });

    it('should print the document once loaded when called in the same task as setting src', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await viewer.print();
      expect(printStub).to.be.calledOnce;
      expect(getImages()).to.have.lengthOf(6);
    });

    it('should resolve without printing when detached while loading', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextUpdate(viewer);
      const printed = viewer.print();
      viewer.remove();
      await printed;
      expect(printStub).to.be.not.called;
      expect(getFrame()).to.be.null;
    });
  });

  describe('rendering', () => {
    it('should print every page at the size of the page', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      await viewer.print();
      expect(printStub).to.be.calledOnceWith(getFrame());
      const images = getImages();
      expect(images).to.have.lengthOf(6);
      expect(parseFloat(images[0].style.width)).to.be.closeTo(A4_PAGE_SIZE.width, 0.01);
      expect(parseFloat(images[0].style.height)).to.be.closeTo(A4_PAGE_SIZE.height, 0.01);
      expect(parseFloat(images[5].style.width)).to.be.closeTo(A4_PAGE_SIZE.height, 0.01);
      const [width, height] = getPageSize(images[0]);
      expect(width).to.be.closeTo(A4_PAGE_SIZE.width, 0.01);
      expect(height).to.be.closeTo(A4_PAGE_SIZE.height, 0.01);
      const [landscapeWidth, landscapeHeight] = getPageSize(images[5]);
      expect(landscapeWidth).to.be.closeTo(A4_PAGE_SIZE.height, 0.01);
      expect(landscapeHeight).to.be.closeTo(A4_PAGE_SIZE.width, 0.01);
      const names = new Set(images.map((image) => image.style.getPropertyValue('page')));
      expect(names.size).to.equal(2);
    });

    it('should print the pages at 300 DPI', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      await viewer.print();
      const [image] = getImages();
      expect(image.naturalWidth).to.be.closeTo(A4_PAGE_SIZE.width * (300 / 72), 1);
      expect(image.naturalHeight).to.be.closeTo(A4_PAGE_SIZE.height * (300 / 72), 1);
    });

    it('should print a large page at a lower resolution', async () => {
      viewer.src = createPdf([{ content: 'BT /F1 48 Tf 72 700 Td (Large) Tj ET', mediaBox: [0, 0, 5000, 5000] }]);
      await oneEvent(viewer, 'document-load');
      await viewer.print();
      const [image] = getImages();
      expect(image.style.width).to.equal('5000pt');
      expect(image.naturalWidth * image.naturalHeight).to.be.at.most(2 ** 24);
      expect(image.naturalWidth).to.be.closeTo(4096, 1);
    });

    it('should print the annotations that are printed, not the ones that are viewed', async () => {
      // Red squares, the first one is printed but not viewed, the second one viewed but not printed.
      viewer.src = createPdf([
        {
          content: 'BT /F1 12 Tf 72 72 Td (Annotations) Tj ET',
          annotations: [
            '<< /Type /Annot /Subtype /Square /Rect [100 600 300 800] /C [1 0 0] /IC [1 0 0] /F 36 >>',
            '<< /Type /Annot /Subtype /Square /Rect [300 100 500 300] /C [1 0 0] /IC [1 0 0] /F 0 >>',
          ],
        },
      ]);
      await oneEvent(viewer, 'document-load');
      await viewer.print();
      const [image] = getImages();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0);
      const scale = 300 / 72;
      const getPixel = (x: number, y: number) => [
        ...context.getImageData(Math.round(x * scale), Math.round((842 - y) * scale), 1, 1).data,
      ];
      expect(getPixel(200, 700)).to.deep.equal([255, 0, 0, 255]);
      expect(getPixel(400, 200)).to.deep.equal([255, 255, 255, 255]);
    });
  });
});
