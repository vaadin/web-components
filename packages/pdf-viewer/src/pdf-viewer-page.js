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
const MAX_CANVAS_PIXELS = 2 ** 24;

/**
 * Manages the DOM of a single page of the document: a placeholder sized to
 * the page, and the canvas the page is rendered to once it is needed.
 */
export class PdfViewerPage {
  /**
   * @param {import('pdfjs-dist').PDFPageProxy} pdfPage
   */
  constructor(pdfPage) {
    this.pdfPage = pdfPage;
    this.pageNumber = pdfPage.pageNumber;

    /** The size of the page in PDF units, at scale 1. */
    const { width, height } = pdfPage.getViewport({ scale: 1 });
    this.unscaledWidth = width;
    this.unscaledHeight = height;

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

  /** Whether the canvas shows the page at the current scale and output scale. */
  isRendered(outputScale) {
    return !!this.canvas && this.renderedScale === this.scale && this.renderedOutputScale === outputScale;
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
    } finally {
      if (this.renderTask === renderTask) {
        this.renderTask = null;
      }
    }

    if (this.canvas) {
      this.canvas.replaceWith(canvas);
    } else {
      this.element.append(canvas);
    }
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
      // Shrinking the canvas frees its memory right away in Safari.
      this.canvas.width = 0;
      this.canvas.height = 0;
      this.canvas.remove();
      this.canvas = null;
    }
    this.renderedScale = 0;
    this.renderedOutputScale = 0;
  }
}
