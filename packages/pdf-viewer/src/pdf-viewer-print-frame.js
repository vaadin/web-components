/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { MAX_CANVAS_PIXELS } from './pdf-viewer-page.js';

/** The resolution that pages are printed at. PDF units are 1/72 inch. */
const PRINT_DPI = 150;

/** The styles of the print document. */
const PRINT_STYLES = `
  @page { margin: 0; }
  html, body { margin: 0; padding: 0; }
  img { display: block; break-after: page; }
  img:last-child { break-after: auto; }
`;

/**
 * An off-screen frame that holds the pages of a document as images, and
 * opens the print dialog of the browser for them. Each page prints on paper
 * of its own size. The pages render one at a time on a canvas of at most
 * `MAX_CANVAS_PIXELS` pixels, so that rendering needs the same memory for
 * any number of pages.
 */
export class PdfViewerPrintFrame {
  /** @type {HTMLIFrameElement} */
  #frame;

  /** @type {CSSStyleSheet} */
  #styleSheet;

  /** The names of the `@page` rules, by page size. */
  #pageNames = new Map();

  /** The object URLs of the page images. */
  #urls = [];

  /** @type {import('pdfjs-dist').RenderTask | null} */
  #renderTask = null;

  #removed = false;

  constructor() {
    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    // Not hidden with display or visibility, which would print an empty page in some browsers.
    frame.style.cssText = 'position: fixed; left: -10000px; top: 0; width: 1px; height: 1px; border: 0;';
    document.body.append(frame);
    // A constructed style sheet, as a Content Security Policy may block style elements.
    this.#styleSheet = new frame.contentWindow.CSSStyleSheet();
    this.#styleSheet.replaceSync(PRINT_STYLES);
    frame.contentDocument.adoptedStyleSheets = [this.#styleSheet];
    this.#frame = frame;
  }

  /** Whether the frame has been removed. */
  get removed() {
    return this.#removed;
  }

  /**
   * Renders the pages of the document as images into the frame, and waits
   * until the images are decoded. Calls `onProgress` with the part of the
   * pages that is done, from 0 to 1. Stops when the frame is removed.
   *
   * @param {import('pdfjs-dist').PDFDocumentProxy} pdfDocument
   * @param {(progress: number) => void} onProgress
   * @return {Promise<void>}
   */
  async renderPages(pdfDocument, onProgress) {
    const { numPages } = pdfDocument;
    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
      await this.#renderPage(pdfDocument, pageNumber);
      if (this.#removed) {
        return;
      }
      onProgress(pageNumber / numPages);
    }
    const images = [...this.#frame.contentDocument.images];
    await Promise.all(images.map((image) => image.decode().catch(() => {})));
  }

  /**
   * Opens the print dialog of the browser for the rendered pages. The frame
   * is removed once printing ends.
   */
  print() {
    const frameWindow = this.#frame.contentWindow;
    frameWindow.addEventListener('afterprint', () => this.remove(), { once: true });
    frameWindow.focus();
    frameWindow.print();
  }

  /**
   * Removes the frame and releases the images. Stops rendering the pages.
   */
  remove() {
    this.#removed = true;
    this.#renderTask?.cancel();
    this.#frame.remove();
    this.#urls.forEach((url) => URL.revokeObjectURL(url));
    this.#urls = [];
  }

  /**
   * Renders a page as an image into the frame, sized to the paper size of
   * the page.
   * @private
   */
  async #renderPage(pdfDocument, pageNumber) {
    const pdfPage = await pdfDocument.getPage(pageNumber);
    if (this.#removed) {
      return;
    }

    // PDF units are points, so this is the paper size of the page.
    const { width, height } = pdfPage.getViewport({ scale: 1 });
    // Large pages get a lower resolution, as browsers limit the canvas size.
    const scale = Math.min(PRINT_DPI / 72, Math.sqrt(MAX_CANVAS_PIXELS / (width * height)));
    const viewport = pdfPage.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    let blob;
    try {
      // The print intent also selects the optional content and the annotations that the document prints.
      this.#renderTask = pdfPage.render({ canvas, viewport, intent: 'print' });
      await this.#renderTask.promise;
      blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });
    } finally {
      this.#renderTask = null;
      canvas.width = 0;
      canvas.height = 0;
    }
    if (!blob) {
      throw new Error(`Failed to print page ${pageNumber}`);
    }
    if (this.#removed) {
      return;
    }

    const url = URL.createObjectURL(blob);
    this.#urls.push(url);
    const image = this.#frame.contentDocument.createElement('img');
    image.src = url;
    image.alt = '';
    image.style.width = `${width}pt`;
    image.style.height = `${height}pt`;
    image.style.page = this.#getPageName(width, height);
    this.#frame.contentDocument.body.append(image);
  }

  /**
   * Returns the name of the `@page` rule for a page size, and adds the rule
   * for a new size. A named page gives each printed page the size of its PDF page.
   * @private
   */
  #getPageName(width, height) {
    const size = `${width}pt ${height}pt`;
    let name = this.#pageNames.get(size);
    if (!name) {
      name = `size${this.#pageNames.size + 1}`;
      this.#pageNames.set(size, name);
      this.#styleSheet.insertRule(`@page ${name} { size: ${size}; margin: 0; }`);
    }
    return name;
  }
}
