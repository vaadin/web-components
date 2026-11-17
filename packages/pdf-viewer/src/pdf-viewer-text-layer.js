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
import { addLinksToText } from './pdf-viewer-text-accessibility.js';
import { loadPdfjs } from './pdfjs-loader.js';

/**
 * The text layer of a page: transparent text on top of the canvas, which
 * makes the text selectable and readable by assistive technology.
 */
export class PdfViewerTextLayer {
  /** @type {import('pdfjs-dist').TextLayer | null} */
  #textLayer = null;

  /** Set once the text owns the links of the page. */
  #linksBound = false;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'text-layer';

    /**
     * Extends the selection to the end of the page while selecting.
     * @type {HTMLElement | null}
     */
    this.endOfContent = null;
  }

  get rendered() {
    return !!this.endOfContent;
  }

  /** @return {HTMLElement[]} */
  get textDivs() {
    return this.#textLayer?.textDivs ?? [];
  }

  /**
   * @param {import('pdfjs-dist').PDFPageProxy} pdfPage
   * @param {import('pdfjs-dist').PageViewport} viewport
   * @param {AbortSignal} signal aborted when the page is released
   * @return {Promise<void>}
   */
  async render(pdfPage, viewport, signal) {
    const { TextLayer } = await loadPdfjs();
    if (signal.aborted) {
      return;
    }

    // As in the viewer of pdf.js, the text layer reads the stream itself.
    this.#textLayer = new TextLayer({
      textContentSource: pdfPage.streamTextContent({ includeMarkedContent: true }),
      container: this.element,
      viewport,
    });
    await this.#textLayer.render();

    const endOfContent = document.createElement('div');
    endOfContent.className = 'end-of-content';
    this.element.append(endOfContent);
    this.endOfContent = endOfContent;
  }

  /**
   * Adds each link to the `aria-owns` of the text before it, once, for assistive technology.
   * @param {HTMLElement[]} links the links of the page, with ids
   */
  bindLinks(links) {
    if (this.#linksBound) {
      return;
    }
    this.#linksBound = true;
    addLinksToText(this.textDivs, links);
  }

  /** @param {import('pdfjs-dist').PageViewport} viewport */
  update(viewport) {
    this.#textLayer?.update({ viewport });
  }

  cancel() {
    this.#textLayer?.cancel();
  }
}
