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

/**
 * A page that the queue can render. `PdfViewerPage` implements it.
 * @typedef {Object} PdfViewerRenderQueuePage
 * @property {number} pageNumber The number of the page, starting from 1.
 * @property {number} canvasPixels The number of canvas pixels the page uses.
 * @property {boolean} renderFailed Whether the last render failed.
 * @property {(pixelRatio: number) => boolean} isRendered Whether the page is
 *   rendered at its current scale and the given device pixel ratio.
 * @property {() => void} cancel Cancels a pending render.
 */

/**
 * @typedef {Object} PdfViewerRenderQueueOptions
 * @property {(page: PdfViewerRenderQueuePage, pixelRatio: number) => Promise<void>} renderPage
 *   Renders a page at the given device pixel ratio. The returned promise never rejects.
 * @property {(page: PdfViewerRenderQueuePage) => void} releasePage Frees the canvas of a page.
 * @property {() => void} onIdle Called when no page is left to render.
 * @property {number} renderAhead The number of pages before and after the
 *   visible ones that are rendered in advance.
 * @property {number} keepRendered The number of pages before and after the
 *   visible ones that keep their canvas.
 * @property {number} maxPagePixels The maximum number of canvas pixels of one page.
 * @property {number} maxTotalPixels The number of canvas pixels that all pages
 *   may use together before pages outside the view are released, or not
 *   rendered ahead.
 */

/**
 * Decides which pages of the document to render and in which order, renders
 * them one at a time, and frees the canvases of pages far from the view.
 */
export class PdfViewerRenderQueue {
  /** @type {PdfViewerRenderQueueOptions} */
  #options;

  /** @type {PdfViewerRenderQueuePage[]} */
  #pages = [];

  /** The pages to render, in order of priority. */
  #queue = [];

  /** The number of visible pages at the start of the queue. */
  #visibleLength = 0;

  /** @type {PdfViewerRenderQueuePage | null} */
  #renderingPage = null;

  #pixelRatio = 1;

  /**
   * @param {PdfViewerRenderQueueOptions} options
   */
  constructor(options) {
    this.#options = options;
  }

  /**
   * Sets the pages of the document, e.g. when another document loads, and
   * forgets the page being rendered.
   * @param {PdfViewerRenderQueuePage[]} pages
   */
  setPages(pages) {
    this.#pages = pages;
    this.#queue = [];
    this.#visibleLength = 0;
    this.#renderingPage = null;
  }

  /**
   * Sets the device pixel ratio to render at. Pages rendered at another
   * ratio render again when they are next in the queue.
   * @param {number} pixelRatio
   */
  setPixelRatio(pixelRatio) {
    this.#pixelRatio = pixelRatio;
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
    for (let distance = 1; distance <= this.#options.renderAhead; distance++) {
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

    const pixelRatio = this.#pixelRatio;
    const { maxPagePixels, maxTotalPixels } = this.#options;
    const index = this.#queue.findIndex((item) => !item.isRendered(pixelRatio) && !item.renderFailed);
    const page = this.#queue[index];
    // Render pages ahead of the view only while memory allows it.
    const isAhead = index >= this.#visibleLength;
    if (!page || (isAhead && this.#getTotalCanvasPixels() > maxTotalPixels - maxPagePixels)) {
      this.#options.onIdle();
      return;
    }

    this.#renderingPage = page;
    this.#options
      .renderPage(page, pixelRatio)
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
    const { keepRendered, maxTotalPixels } = this.#options;
    const distance = (index) => (index < first ? first - index : Math.max(0, index - last));
    const rendered = this.#pages.filter((page) => page.canvasPixels > 0);
    rendered.sort((a, b) => distance(b.pageNumber - 1) - distance(a.pageNumber - 1));

    let totalPixels = this.#getTotalCanvasPixels();
    rendered.forEach((page) => {
      const pageDistance = distance(page.pageNumber - 1);
      if (pageDistance > keepRendered || (pageDistance > 0 && totalPixels > maxTotalPixels)) {
        totalPixels -= page.canvasPixels;
        this.#options.releasePage(page);
      }
    });
  }

  /** @private */
  #getTotalCanvasPixels() {
    return this.#pages.reduce((total, page) => total + page.canvasPixels, 0);
  }
}
