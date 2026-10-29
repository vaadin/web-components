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
import { loadPdfjs } from './pdfjs-loader.js';

/**
 * The maximum number of pixels of a page canvas. Larger canvases use too much
 * memory, especially on iOS, so pages are rendered at a lower resolution instead.
 */
export const MAX_CANVAS_PIXELS = 2 ** 24;

/**
 * Manages the DOM of a single page of the document: a placeholder sized to
 * the page, and the canvas and the text and find layers the page is rendered
 * to once it is needed.
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

    /** @type {import('pdfjs-dist').TextLayer | null} */
    this.textLayer = null;

    /** @type {HTMLElement | null} */
    this.textLayerElement = null;

    /** @type {HTMLElement | null} */
    this.endOfContentElement = null;

    /** @type {HTMLElement | null} */
    this.findLayerElement = null;

    /** The scale and device pixel ratio of the current canvas, to know when it is outdated. */
    this.renderedScale = 0;
    this.renderedPixelRatio = 0;
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

  /** Whether the canvas shows the page at the current scale and the given device pixel ratio. */
  isRendered(pixelRatio) {
    return !!this.canvas && this.renderedScale === this.scale && this.renderedPixelRatio === pixelRatio;
  }

  /**
   * Sets the loaded page, and its own size instead of the estimate.
   *
   * @param {import('pdfjs-dist').PDFPageProxy} pdfPage
   * @return {boolean} whether the size differs from the estimate
   */
  setPdfPage(pdfPage) {
    this.pdfPage = pdfPage;
    const { width, height } = pdfPage.getViewport({ scale: 1 });
    this.#updateTextScale();
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
    this.#updateTextScale();
  }

  /**
   * Sizes the text layer with the page, also before the page renders again
   * at the new scale. The text layer of pdf.js reads this property.
   * @private
   */
  #updateTextScale() {
    this.element.style.setProperty('--total-scale-factor', String(this.scale * (this.pdfPage?.userUnit ?? 1)));
  }

  /**
   * Renders the page at the current scale. The new canvas replaces the old one
   * only when rendering has finished, to avoid showing an empty page meanwhile.
   * Requires the page to be set with `setPdfPage()`.
   *
   * @param {number} pixelRatio the device pixel ratio
   * @return {Promise<void>}
   */
  async render(pixelRatio) {
    this.cancel();

    const scale = this.scale;
    const viewport = this.pdfPage.getViewport({ scale });
    const outputScale = Math.min(pixelRatio, Math.sqrt(MAX_CANVAS_PIXELS / (viewport.width * viewport.height)));

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
      this.#freeCanvas(canvas);
      if (this.renderTask === renderTask) {
        this.renderTask = null;
      }
      throw error;
    }

    // The page was released or rendered again meanwhile, drop this result.
    if (this.renderTask !== renderTask) {
      this.#freeCanvas(canvas);
      return;
    }
    this.renderTask = null;

    if (this.canvas) {
      this.#freeCanvas(this.canvas);
    }
    this.element.append(canvas);
    this.canvas = canvas;
    this.renderedScale = scale;
    this.renderedPixelRatio = pixelRatio;
  }

  /**
   * Renders the text layer: transparent text on top of the canvas, which makes
   * the text selectable and readable by assistive technology. When the layer
   * exists, it is only resized to the current scale.
   *
   * @return {Promise<void>}
   */
  async renderTextLayer() {
    if (this.textLayer) {
      this.textLayer.update({ viewport: this.pdfPage.getViewport({ scale: this.scale }) });
      return;
    }

    const canvas = this.canvas;
    const { TextLayer } = await loadPdfjs();
    // The page may have been released or rendered again meanwhile.
    if (!canvas || this.canvas !== canvas || this.textLayer) {
      return;
    }

    const container = document.createElement('div');
    container.className = 'text-layer';
    this.element.append(container);

    // As in the viewer of pdf.js, the text layer reads the stream itself. `getTextContent()`
    // iterates the stream with `for await`, which Safari 26 and earlier do not support.
    const textLayer = new TextLayer({
      textContentSource: this.pdfPage.streamTextContent({ includeMarkedContent: true }),
      container,
      viewport: this.pdfPage.getViewport({ scale: this.scale }),
    });
    this.textLayer = textLayer;
    this.textLayerElement = container;
    try {
      await textLayer.render();
    } catch (error) {
      // Without its text, the layer is removed, so that the page tries again when it renders again.
      if (this.textLayer === textLayer) {
        container.remove();
        this.textLayer = null;
        this.textLayerElement = null;
      }
      throw error;
    }

    if (this.textLayer === textLayer) {
      // Extends the selection to the end of the page while selecting, see the styles.
      const endOfContent = document.createElement('div');
      endOfContent.className = 'end-of-content';
      container.append(endOfContent);
      this.endOfContentElement = endOfContent;
    }
  }

  /**
   * Highlights parts of the text of the text layer, e.g. the matches of a
   * search, replacing the previous highlights. Does nothing without a text
   * layer, or while the page has no size, e.g. inside a hidden ancestor.
   *
   * @param {Array<{ itemIndex: number, start: number, end: number, current: boolean }>} parts
   *   the text item, by its index in the text layer, and the offsets of the text to highlight in it
   */
  renderFindLayer(parts) {
    this.clearFindLayer();
    // Positioned in % of the page, so that they stay in place when zooming.
    const pageRect = this.element.getBoundingClientRect();
    if (!this.textLayer || !parts.length || !pageRect.width || !pageRect.height) {
      return;
    }

    const { textDivs } = this.textLayer;
    const layer = document.createElement('div');
    layer.className = 'find-layer';
    parts.forEach(({ itemIndex, start, end, current }) => {
      const textNode = textDivs[itemIndex].firstChild;
      if (!textNode || end > textNode.length) {
        return;
      }
      const range = document.createRange();
      range.setStart(textNode, start);
      range.setEnd(textNode, end);
      [...range.getClientRects()].forEach((rect) => {
        const highlight = document.createElement('div');
        highlight.className = current ? 'find-match current' : 'find-match';
        highlight.style.left = `${((rect.left - pageRect.left) / pageRect.width) * 100}%`;
        highlight.style.top = `${((rect.top - pageRect.top) / pageRect.height) * 100}%`;
        highlight.style.width = `${(rect.width / pageRect.width) * 100}%`;
        highlight.style.height = `${(rect.height / pageRect.height) * 100}%`;
        layer.append(highlight);
      });
    });

    // Below the text layer, so that the text stays selectable.
    this.textLayerElement.before(layer);
    this.findLayerElement = layer;
  }

  /** Removes the highlights of `renderFindLayer()`. */
  clearFindLayer() {
    this.findLayerElement?.remove();
    this.findLayerElement = null;
  }

  /** Cancels a pending render. */
  cancel() {
    if (this.renderTask) {
      this.renderTask.cancel();
      this.renderTask = null;
    }
  }

  /** Cancels a pending render and frees the canvas memory and the text and find layers. */
  release() {
    this.cancel();
    this.clearFindLayer();
    this.textLayer?.cancel();
    this.textLayer = null;
    this.textLayerElement?.remove();
    this.textLayerElement = null;
    this.endOfContentElement = null;
    if (this.canvas) {
      this.#freeCanvas(this.canvas);
      this.canvas = null;
    }
  }

  /** @private */
  #freeCanvas(canvas) {
    // Shrinking the canvas frees its memory right away in Safari.
    canvas.width = 0;
    canvas.height = 0;
    canvas.remove();
  }
}
