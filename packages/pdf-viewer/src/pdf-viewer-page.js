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

    /** The size of user space units, see `PageViewport.userUnit`. */
    this.userUnit = 1;

    this.element = document.createElement('div');
    this.element.setAttribute('part', 'page');
    this.element.setAttribute('role', 'group');

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
    this.linkLayerElement = null;

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
    const { width, height, userUnit } = pdfPage.getViewport({ scale: 1 });
    this.userUnit = userUnit;
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
    this.element.style.setProperty('--total-scale-factor', String(this.scale * this.userUnit));
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

  /**
   * Renders the text layer: transparent text on top of the canvas, which makes
   * the text selectable and readable by assistive technology. When the layer
   * exists, it is only resized to the current scale.
   *
   * @param {typeof import('pdfjs-dist')} pdfjs
   * @return {Promise<void>}
   */
  async renderTextLayer(pdfjs) {
    const viewport = this.pdfPage.getViewport({ scale: this.scale });

    if (this.textLayer) {
      this.textLayer.update({ viewport });
      return;
    }

    const container = document.createElement('div');
    container.className = 'text-layer';
    // While selecting, the end-of-content element covers the page, so that
    // dragging over empty space does not lose the selection.
    container.addEventListener('pointerdown', () => {
      container.classList.add('selecting');
      window.addEventListener('pointerup', () => container.classList.remove('selecting'), { once: true });
    });
    this.element.append(container);

    const textLayer = new pdfjs.TextLayer({
      textContentSource: this.pdfPage.streamTextContent({ includeMarkedContent: true }),
      container,
      viewport,
    });
    this.textLayer = textLayer;
    this.textLayerElement = container;
    await textLayer.render();

    if (this.textLayer === textLayer) {
      // Extends the selection to the end of the page while selecting, see the styles.
      const endOfContent = document.createElement('div');
      endOfContent.className = 'end-of-content';
      container.append(endOfContent);
    }
  }

  /**
   * Adds the links of the page to a layer over the page, positioned relative
   * to the page size so that they need no update when the scale changes.
   * Returns the links with their annotations.
   *
   * @param {Array<{ rect: number[] }>} annotations the link annotations of the page
   * @param {(annotation: object) => HTMLAnchorElement | null} createLink
   * @return {Array<{ link: HTMLAnchorElement, annotation: object }>}
   */
  renderLinks(annotations, createLink) {
    const links = [];
    const viewport = this.pdfPage.getViewport({ scale: 1 });
    const layer = document.createElement('div');
    layer.className = 'link-layer';

    annotations.forEach((annotation) => {
      const link = createLink(annotation);
      if (!link) {
        return;
      }
      const [x1, y1] = viewport.convertToViewportPoint(annotation.rect[0], annotation.rect[1]);
      const [x2, y2] = viewport.convertToViewportPoint(annotation.rect[2], annotation.rect[3]);
      const left = Math.min(x1, x2);
      const top = Math.min(y1, y2);
      link.style.left = `${(left / viewport.width) * 100}%`;
      link.style.top = `${(top / viewport.height) * 100}%`;
      link.style.width = `${(Math.abs(x2 - x1) / viewport.width) * 100}%`;
      link.style.height = `${(Math.abs(y2 - y1) / viewport.height) * 100}%`;
      layer.append(link);
      links.push({ link, annotation });
    });

    this.element.append(layer);
    this.linkLayerElement = layer;
    return links;
  }

  /**
   * Returns the elements of the text layer that are inside the given element,
   * e.g. the text of a link.
   *
   * @param {Element} element
   * @return {HTMLElement[]}
   */
  getTextElementsInside(element) {
    if (!this.textLayer) {
      return [];
    }
    const rect = element.getBoundingClientRect();
    return this.textLayer.textDivs.filter((span) => {
      const spanRect = span.getBoundingClientRect();
      const x = spanRect.left + spanRect.width / 2;
      const y = spanRect.top + spanRect.height / 2;
      return span.textContent.trim() && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    });
  }

  /** Cancels a pending render. */
  cancel() {
    if (this.renderTask) {
      this.renderTask.cancel();
      this.renderTask = null;
    }
  }

  /** Cancels a pending render and frees the canvas memory and the text and link layers. */
  release() {
    this.cancel();
    this.textLayer?.cancel();
    this.textLayer = null;
    this.textLayerElement?.remove();
    this.textLayerElement = null;
    this.linkLayerElement?.remove();
    this.linkLayerElement = null;
    this.element.querySelector(':scope > .find-layer')?.remove();
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
