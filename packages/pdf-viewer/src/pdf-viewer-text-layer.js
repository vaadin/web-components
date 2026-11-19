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
import { getContentIndexes, getText, indexText } from './pdf-viewer-page-model.js';
import { addLinksToText } from './pdf-viewer-text-accessibility.js';
import { loadPdfjs } from './pdfjs-loader.js';

/**
 * Returns a stream of the same text content, which adds the text items to the array as the text layer reads them.
 * @param {ReadableStream} stream
 * @param {object[]} items
 * @return {ReadableStream}
 */
function recordItems(stream, items) {
  // With a reader, as Safari 26 and earlier cannot read a stream with `for await`.
  const reader = stream.getReader();
  let cancelled = false;
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await reader.read();
      if (cancelled) {
        return;
      }
      if (done) {
        controller.close();
        return;
      }
      value.items.forEach((item) => items.push(item));
      controller.enqueue(value);
    },
    cancel(reason) {
      cancelled = true;
      return reader.cancel(reason);
    },
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

  /** @type {import('./pdf-viewer-page-model.js').PdfViewerTextIndex} */
  #index = { texts: [], markers: [] };

  /**
   * The index of each text element with an id, see `getContentSpans()`.
   * @type {Map<string, number>}
   */
  #textIndexes = new Map();

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

    // As in the viewer of pdf.js, the text layer reads the stream itself. Its items index the text.
    const items = [];
    this.#textLayer = new TextLayer({
      textContentSource: recordItems(pdfPage.streamTextContent({ includeMarkedContent: true }), items),
      container: this.element,
      viewport,
    });
    await this.#textLayer.render();
    this.#index = indexText(items);

    const endOfContent = document.createElement('div');
    endOfContent.className = 'end-of-content';
    this.element.append(endOfContent);
    this.endOfContent = endOfContent;
  }

  /**
   * Returns the ids of the text elements of each marked content that the structure owns, and gives the elements ids,
   * as Chrome ignores `aria-owns` of the marked content, which has `display: contents`. Leaves out marked content
   * that has no element. Artifacts, such as page numbers, stay hidden.
   * @param {Set<string>} contentIds the ids of the marked content that the structure owns
   * @return {Map<string, string[]>}
   */
  getContentSpans(contentIds) {
    const contentSpans = new Map();
    getContentIndexes(this.#index, contentIds).forEach((indexes, id) => {
      const ids = indexes.map((index, position) => {
        const element = this.textDivs[index];
        element.id ||= `${id}_${position}`;
        this.#textIndexes.set(element.id, index);
        return element.id;
      });
      contentSpans.set(id, ids);
    });
    return contentSpans;
  }

  /**
   * Returns the text of the text elements with the ids, with a space between their lines.
   * @param {string[]} ids
   * @return {string}
   */
  getText(ids) {
    return getText(
      this.#index,
      ids.map((id) => this.#textIndexes.get(id)),
    );
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
