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
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { MAX_CANVAS_PIXELS } from './pdf-viewer-page.js';

/** The number of pages before and after the visible ones that are rendered in advance. */
const RENDER_AHEAD = 1;

/** The number of pages before and after the visible ones that keep their canvas. */
const KEEP_RENDERED = 1;

/**
 * The number of canvas pixels that all pages may use together before pages
 * outside the view are released, or not rendered ahead. Mobile Safari limits
 * the total canvas memory of a page.
 */
const MAX_TOTAL_CANVAS_PIXELS = 3 * MAX_CANVAS_PIXELS;

/**
 * @typedef {import('./pdf-viewer-page.js').PdfViewerPage} PdfViewerPage
 */

/**
 * @typedef {Object} PdfViewerRenderCallbacks
 * @property {(page: PdfViewerPage, outputScale: number) => Promise<void>} renderPage
 *   Renders a page at the given output scale. The returned promise never rejects.
 * @property {(page: PdfViewerPage) => void} releasePage Frees the canvas of a page.
 * @property {() => void} onIdle Called when no page is left to render.
 */

/**
 * Decides which pages of the document to render and in which order, renders
 * them one at a time, and frees the canvases of pages far from the view.
 */
export class PdfViewerRenderQueue {
  /** @type {PdfViewerRenderCallbacks} */
  #callbacks;

  /** @type {PdfViewerPage[]} */
  #pages = [];

  /** The pages to render, in order of priority. */
  #queue = [];

  /** The number of visible pages at the start of the queue. */
  #visibleLength = 0;

  /** @type {PdfViewerPage | null} */
  #renderingPage = null;

  /**
   * @param {PdfViewerRenderCallbacks} callbacks
   */
  constructor(callbacks) {
    this.#callbacks = callbacks;
  }

  /**
   * Sets the pages of the document, e.g. when another document loads, and
   * forgets the page being rendered.
   * @param {PdfViewerPage[]} pages
   */
  setPages(pages) {
    this.#pages = pages;
    this.#queue = [];
    this.#visibleLength = 0;
    this.#renderingPage = null;
  }

  /**
   * Renders the visible pages, the most visible first, then the pages next to
   * them, and frees the canvases of pages that are far from the view.
   * @param {Array<{ index: number, height: number }>} visible the indexes of the
   *   visible pages in document order, with their visible height
   */
  update(visible) {
    const pages = this.#pages;
    const first = visible[0].index;
    const last = visible[visible.length - 1].index;
    const byVisibility = [...visible].sort((a, b) => b.height - a.height).map(({ index }) => pages[index]);
    const ahead = [];
    for (let distance = 1; distance <= RENDER_AHEAD; distance++) {
      ahead.push(pages[last + distance], pages[first - distance]);
    }
    this.#queue = [...byVisibility, ...ahead.filter(Boolean)];
    this.#visibleLength = byVisibility.length;

    this.#releaseCanvases(first, last);
    this.renderNext();
  }

  /**
   * Stops rendering pages, e.g. when no page is visible. The page being rendered finishes.
   */
  clear() {
    this.#queue = [];
    this.#visibleLength = 0;
    this.renderNext();
  }

  /**
   * Cancels rendering the page being rendered, e.g. when its size changes.
   */
  cancel() {
    this.#renderingPage?.cancel();
  }

  /**
   * Renders the next page in the queue that is not rendered yet, one page at a time.
   */
  renderNext() {
    if (this.#renderingPage) {
      return;
    }

    const outputScale = window.devicePixelRatio || 1;
    const index = this.#queue.findIndex((item) => !item.isRendered(outputScale) && !item.renderFailed);
    const page = this.#queue[index];
    // Render pages ahead of the view only while memory allows it.
    const isAhead = index >= this.#visibleLength;
    if (!page || (isAhead && this.#getTotalCanvasPixels() > MAX_TOTAL_CANVAS_PIXELS - MAX_CANVAS_PIXELS)) {
      this.#callbacks.onIdle();
      return;
    }

    this.#renderingPage = page;
    this.#callbacks
      .renderPage(page, outputScale)
      .finally(() => {
        if (this.#renderingPage === page) {
          this.#renderingPage = null;
          this.renderNext();
        }
      })
      .catch((error) => issueWarning(`Failed to render the pages of the PDF document: ${error.message}`));
  }

  /**
   * Frees the canvases of pages that are far from the view, and of the
   * pages furthest away when the canvases use too much memory in total.
   * @private
   */
  #releaseCanvases(first, last) {
    const distance = (index) => (index < first ? first - index : Math.max(0, index - last));
    const rendered = this.#pages.filter((page) => page.canvas);
    rendered.sort((a, b) => distance(b.pageNumber - 1) - distance(a.pageNumber - 1));

    let totalPixels = this.#getTotalCanvasPixels();
    rendered.forEach((page) => {
      const pageDistance = distance(page.pageNumber - 1);
      if (pageDistance > KEEP_RENDERED || (pageDistance > 0 && totalPixels > MAX_TOTAL_CANVAS_PIXELS)) {
        totalPixels -= page.canvasPixels;
        this.#callbacks.releasePage(page);
      }
    });
  }

  /** @private */
  #getTotalCanvasPixels() {
    return this.#pages.reduce((total, page) => total + page.canvasPixels, 0);
  }
}
