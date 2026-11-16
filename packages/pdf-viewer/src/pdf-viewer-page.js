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
import { PdfViewerLinkLayer } from './pdf-viewer-link-layer.js';
import { PdfViewerStructureLayer } from './pdf-viewer-structure-layer.js';
import { PdfViewerTextLayer } from './pdf-viewer-text-layer.js';

/**
 * The maximum number of pixels of a page canvas. Larger canvases use too much
 * memory, especially on iOS, so pages are rendered at a lower resolution instead.
 */
export const MAX_CANVAS_PIXELS = 2 ** 24;

/** The layers of a page in DOM order, as in pdf.js, so that screen readers read the structure in the canvas first. */
const LAYER_ORDER = ['canvas', 'text', 'links'];

/**
 * Manages the DOM of a single page of the document: a placeholder sized to
 * the page, and the canvas, the text layer, the structure and the link layer
 * the page is rendered to once it is needed.
 */
export class PdfViewerPage {
  /** Aborted on release, to drop the layers that still load. */
  #abortController = new AbortController();

  /**
   * The elements of the layers in the page, at their index in `LAYER_ORDER`.
   * @type {Array<HTMLElement | null>}
   */
  #layerElements = LAYER_ORDER.map(() => null);

  /**
   * The structure tree of the page, or null without one, kept between renders as in pdf.js.
   * @type {Promise<object | null> | null}
   */
  #structTree = null;

  /** @type {PdfViewerStructureLayer | null} */
  #structureLayer = null;

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
    // As in pdf.js, each page is a region with a name.
    this.element.setAttribute('role', 'region');

    /** @type {number} */
    this.scale = 0;

    /** @type {HTMLCanvasElement | null} */
    this.canvas = null;

    /** @type {import('pdfjs-dist').RenderTask | null} */
    this.renderTask = null;

    /** Set when rendering failed, to not try again at the same scale. */
    this.renderFailed = false;

    /** @type {PdfViewerTextLayer | null} */
    this.textLayer = null;

    /**
     * Set once the links of the page are rendered, also when the page has none.
     * @type {PdfViewerLinkLayer | null}
     */
    this.linkLayer = null;

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
    canvas.setAttribute('role', 'presentation');
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

    const oldCanvas = this.canvas;
    this.#addLayer('canvas', canvas);
    if (oldCanvas) {
      this.#freeCanvas(oldCanvas);
    }
    this.canvas = canvas;
    this.renderedScale = scale;
    this.renderedPixelRatio = pixelRatio;
    this.#connectLayers();
  }

  /**
   * Sets the accessible name of the page.
   *
   * @param {string} label
   */
  setLabel(label) {
    this.element.setAttribute('aria-label', label);
  }

  /**
   * Returns the offset in CSS pixels from the top left corner of the page to
   * a position in PDF units from the bottom left corner of the unrotated page,
   * as in link destinations. With the opposite corner of a rectangle, the
   * offset goes to the top left corner of the rectangle on the rotated page.
   * A missing coordinate, or one outside the page, gives an offset of 0 on
   * the axis that it is on after the rotation of the page. Needs the page
   * of the document, see `setPdfPage()`.
   *
   * @param {number | undefined} x
   * @param {number | undefined} y
   * @param {number | undefined} [x2] the opposite corner of a rectangle
   * @param {number | undefined} [y2]
   * @return {{ left: number, top: number }}
   */
  getOffset(x, y, x2 = x, y2 = y) {
    const viewport = this.pdfPage.getViewport({ scale: this.scale });
    const [left1, top1] = viewport.convertToViewportPoint(x ?? 0, y ?? 0);
    const [left2, top2] = viewport.convertToViewportPoint(x2 ?? 0, y2 ?? 0);
    let left = Math.min(left1, left2);
    let top = Math.min(top1, top2);
    const rotated = viewport.rotation % 180 !== 0;
    if ((rotated ? y : x) === undefined) {
      left = 0;
    }
    if ((rotated ? x : y) === undefined) {
      top = 0;
    }
    return {
      left: left >= 0 && left <= this.width ? left : 0,
      top: top >= 0 && top <= this.height ? top : 0,
    };
  }

  /**
   * Renders the text layer: transparent text on top of the canvas, which makes
   * the text selectable and readable by assistive technology. When the layer
   * exists, it is only resized to the current scale.
   *
   * @return {Promise<void>}
   */
  async renderTextLayer() {
    const viewport = this.pdfPage.getViewport({ scale: this.scale });
    if (this.textLayer) {
      this.textLayer.update(viewport);
      return;
    }
    if (!this.canvas) {
      return;
    }

    const { signal } = this.#abortController;
    const textLayer = new PdfViewerTextLayer();
    this.textLayer = textLayer;
    this.#addLayer('text', textLayer.element);
    try {
      await textLayer.render(this.pdfPage, viewport, signal);
    } catch (error) {
      // Without its text, the layer is removed, so that the page tries again when it renders again.
      if (!signal.aborted) {
        this.#removeLayer('text');
        this.textLayer = null;
      }
      throw error;
    }

    if (!signal.aborted) {
      this.#connectLayers();
      // As in pdf.js, the structure renders after the text layer, whose elements it owns.
      await this.#renderStructureLayer(signal);
    }
  }

  /**
   * Renders the structure of a tagged PDF page for assistive technology.
   *
   * @param {AbortSignal} signal
   * @private
   */
  async #renderStructureLayer(signal) {
    // A page with a broken structure is shown as untagged.
    this.#structTree ??= this.pdfPage.getStructTree().catch(() => null);
    const tree = await this.#structTree;
    // The page may have been released meanwhile.
    if (signal.aborted) {
      return;
    }
    this.#structureLayer = tree && this.#createStructureLayer(tree);
    this.#connectLayers();
  }

  /** @private */
  #createStructureLayer(tree) {
    try {
      const structureLayer = new PdfViewerStructureLayer(tree);
      structureLayer.updateTextLayer(this.textLayer.element);
      return structureLayer;
    } catch {
      // As in pdf.js, a structure that fails to render does not break the other layers.
      return null;
    }
  }

  /**
   * Renders the links of the page in reading order, positioned relative to the
   * page size so that they need no update when the scale changes. Links on
   * hidden layers of the document are left out, and a page without links gets
   * no layer. Returns the links with their annotations, or none when they are
   * rendered already or the page was released meanwhile.
   *
   * @param {(annotation: object) => void} followLink called when an internal link is clicked
   * @param {{ isVisible: (group: object) => boolean }} [optionalContentConfig] the visible layers
   * @return {Promise<Array<{ link: HTMLAnchorElement, annotation: object }>>}
   */
  async renderLinkLayer(followLink, optionalContentConfig) {
    if (!this.canvas || this.linkLayer) {
      return [];
    }

    const { signal } = this.#abortController;
    const linkLayer = new PdfViewerLinkLayer();
    const links = await linkLayer.render(this.pdfPage, followLink, optionalContentConfig);
    // The page may have been released meanwhile.
    if (signal.aborted || this.linkLayer) {
      return [];
    }

    this.linkLayer = linkLayer;
    if (links.length) {
      this.#addLayer('links', linkLayer.element);
    }
    this.#connectLayers();
    return links;
  }

  cancel() {
    if (this.renderTask) {
      this.renderTask.cancel();
      this.renderTask = null;
    }
  }

  /** Cancels a pending render and frees the canvas memory, the layers and the structure. */
  release() {
    this.#abortController.abort();
    this.#abortController = new AbortController();
    this.cancel();
    this.textLayer?.cancel();
    if (this.canvas) {
      this.#freeCanvas(this.canvas);
    }
    LAYER_ORDER.forEach((name) => this.#removeLayer(name));
    this.canvas = null;
    this.textLayer = null;
    this.#structureLayer = null;
    this.linkLayer = null;
  }

  /**
   * Connects the layers that have rendered, as they render in any order.
   * @private
   */
  #connectLayers() {
    const structureElement = this.#structureLayer?.element;
    // In the canvas as in pdf.js, since VoiceOver in Safari skips the elements, which have no size, outside of it.
    if (structureElement && this.canvas && structureElement.parentNode !== this.canvas) {
      this.canvas.append(structureElement);
    }
    if (this.linkLayer && this.textLayer?.rendered) {
      this.linkLayer.addToText(this.textLayer);
    }
  }

  /**
   * @param {string} name
   * @param {HTMLElement} element
   * @private
   */
  #addLayer(name, element) {
    const index = LAYER_ORDER.indexOf(name);
    const oldElement = this.#layerElements[index];
    this.#layerElements[index] = element;
    if (oldElement) {
      oldElement.replaceWith(element);
      return;
    }
    const previous = this.#layerElements.slice(0, index).findLast(Boolean);
    if (previous) {
      previous.after(element);
    } else {
      this.element.prepend(element);
    }
  }

  /** @private */
  #removeLayer(name) {
    const index = LAYER_ORDER.indexOf(name);
    this.#layerElements[index]?.remove();
    this.#layerElements[index] = null;
  }

  /** @private */
  #freeCanvas(canvas) {
    // Shrinking the canvas frees its memory right away in Safari.
    canvas.width = 0;
    canvas.height = 0;
    canvas.remove();
  }
}
