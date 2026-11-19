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
 * Returns the text elements in the marked content, also in nested marked content that the structure does not own.
 * @param {HTMLElement} content
 * @param {Set<string>} contentIds the ids of the marked content that the structure owns
 * @return {HTMLElement[]}
 */
function getContentElements(content, contentIds) {
  return [...content.children].flatMap((child) => {
    if (child.localName === 'br' || child.getAttribute('aria-hidden') === 'true') {
      return [];
    }
    if (!child.classList.contains('markedContent')) {
      return [child];
    }
    return contentIds.has(child.id) ? [] : getContentElements(child, contentIds);
  });
}

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
   * Returns the ids of the text elements of each marked content that the structure owns, and gives the elements ids.
   * Leaves out marked content that has no element. Artifacts, such as page numbers, stay hidden.
   * @param {Set<string>} contentIds the ids of the marked content that the structure owns
   * @return {Map<string, string[]>}
   */
  getContentSpans(contentIds) {
    const contentSpans = new Map();
    contentIds.forEach((id) => {
      const content = this.element.querySelector(`#${id}`);
      if (content) {
        const ids = getContentElements(content, contentIds).map((element, index) => {
          element.id ||= `${id}_${index}`;
          return element.id;
        });
        contentSpans.set(id, ids);
      }
    });
    return contentSpans;
  }

  /**
   * Adds each link to the `aria-owns` of the text before it, once, for assistive technology.
   * @param {HTMLElement[]} links the links of the page, with ids
   * @param {Set<string>} [linkTextIds] the ids of the text that other links own, as a link in a link is invalid
   */
  bindLinks(links, linkTextIds = new Set()) {
    if (this.#linksBound) {
      return;
    }
    this.#linksBound = true;
    const textDivs = this.textDivs.filter((div) => !linkTextIds.has(div.id));
    addLinksToText(textDivs, links);
  }

  /** @param {import('pdfjs-dist').PageViewport} viewport */
  update(viewport) {
    this.#textLayer?.update({ viewport });
  }

  cancel() {
    this.#textLayer?.cancel();
  }
}
