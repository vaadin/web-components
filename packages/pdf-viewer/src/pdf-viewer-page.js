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

/**
 * The maximum number of pixels of a page canvas. Larger canvases use too much
 * memory, especially on iOS, so pages are rendered at a lower resolution instead.
 */
export const MAX_CANVAS_PIXELS = 2 ** 24;

/**
 * Manages the DOM of a single page of the document: a placeholder sized to
 * the page, and the canvas the page is rendered to once it is needed.
 */
export class PdfViewerPage {
  /**
   * @param {number} pageNumber
   * @param {{ width: number, height: number }} size the estimated size of the page
   *   in PDF units, used until the page itself has loaded
   */
  constructor(pageNumber, size) {
    this.pageNumber = pageNumber;

    /** @type {import('pdfjs-dist').PDFPageProxy | null} */
    this.pdfPage = null;

    /** The size of the page in PDF units, at scale 1. */
    this.unscaledWidth = size.width;
    this.unscaledHeight = size.height;

    this.element = document.createElement('div');
    this.element.setAttribute('part', 'page');

    /** @type {number} */
    this.scale = 0;

    /** @type {HTMLCanvasElement | null} */
    this.canvas = null;

    /** @type {import('pdfjs-dist').RenderTask | null} */
    this.renderTask = null;

    /** Set when rendering failed, to not try again at the same scale. */
    this.renderFailed = false;

    /** The scale and output scale of the current canvas, to know when it is outdated. */
    this.renderedScale = 0;
    this.renderedOutputScale = 0;
  }

  /** The width of the page in CSS pixels at the current scale. */
  get width() {
    return this.unscaledWidth * this.scale;
  }

  /** The height of the page in CSS pixels at the current scale. */
  get height() {
    return this.unscaledHeight * this.scale;
  }

  /** The number of canvas pixels this page uses. */
  get canvasPixels() {
    return this.canvas ? this.canvas.width * this.canvas.height : 0;
  }

  /** Whether the canvas shows the page at the current scale and output scale. */
  isRendered(outputScale) {
    return !!this.canvas && this.renderedScale === this.scale && this.renderedOutputScale === outputScale;
  }

  /**
   * Sets the loaded page. Returns whether the page size differs from the estimate.
   *
   * @param {import('pdfjs-dist').PDFPageProxy} pdfPage
   * @return {boolean}
   */
  setPdfPage(pdfPage) {
    this.pdfPage = pdfPage;
    const { width, height } = pdfPage.getViewport({ scale: 1 });
    if (width === this.unscaledWidth && height === this.unscaledHeight) {
      return false;
    }
    this.unscaledWidth = width;
    this.unscaledHeight = height;
    // The canvas has the wrong aspect ratio now, render it again.
    this.cancel();
    this.renderedScale = 0;
    return true;
  }

  /**
   * Resizes the page placeholder. An existing canvas is stretched to the new
   * size until the page is rendered again.
   *
   * @param {number} scale
   */
  setScale(scale) {
    this.scale = scale;
    this.renderFailed = false;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
  }

  /**
   * Renders the page at the current scale. The new canvas replaces the old one
   * only when rendering has finished, to avoid showing an empty page meanwhile.
   * Requires the page to be set with `setPdfPage()`.
   *
   * @param {number} devicePixelRatio
   * @return {Promise<void>}
   */
  async render(devicePixelRatio) {
    this.cancel();

    const scale = this.scale;
    const viewport = this.pdfPage.getViewport({ scale });
    const outputScale = Math.min(devicePixelRatio, Math.sqrt(MAX_CANVAS_PIXELS / (viewport.width * viewport.height)));

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);

    const renderTask = this.pdfPage.render({
      canvas,
      viewport,
      transform: outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0],
    });
    this.renderTask = renderTask;

    try {
      await renderTask.promise;
    } catch (error) {
      if (this.renderTask === renderTask) {
        this.renderTask = null;
      }
      throw error;
    }

    // The page was released or rendered again meanwhile, drop this result.
    if (this.renderTask !== renderTask) {
      canvas.width = 0;
      canvas.height = 0;
      return;
    }
    this.renderTask = null;

    if (this.canvas) {
      this.#freeCanvas(this.canvas);
    }
    this.element.append(canvas);
    this.canvas = canvas;
    this.renderedScale = scale;
    this.renderedOutputScale = devicePixelRatio;
  }

  /** Cancels a pending render. */
  cancel() {
    if (this.renderTask) {
      this.renderTask.cancel();
      this.renderTask = null;
    }
  }

  /** Cancels a pending render and frees the canvas memory. */
  release() {
    this.cancel();
    if (this.canvas) {
      this.#freeCanvas(this.canvas);
      this.canvas = null;
    }
    this.renderedScale = 0;
    this.renderedOutputScale = 0;
  }

  /** @private */
  #freeCanvas(canvas) {
    // Shrinking the canvas frees its memory right away in Safari.
    canvas.width = 0;
    canvas.height = 0;
    canvas.remove();
  }
}
