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

import { createStructTreeElement } from './pdf-viewer-struct-tree.js';

/**
 * The maximum number of pixels of a page canvas. Larger canvases use too much
 * memory, especially on iOS, so pages are rendered at a lower resolution instead.
 */
export const MAX_CANVAS_PIXELS = 2 ** 24;

/** Finds the words of the text of a page, e.g. the text of a link. */
const wordSegmenter = new Intl.Segmenter(undefined, { granularity: 'word' });

/**
 * Creates an element with text for assistive technology only. The text is
 * generated content, see the styles, so that it is not selected, copied or
 * found with the text of the page.
 * @param {string} text
 * @return {HTMLElement}
 */
function createAssistiveText(text) {
  const element = document.createElement('span');
  element.className = 'link-text';
  element.dataset.text = text;
  return element;
}

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

    /** @type {HTMLElement | null} */
    this.structTreeElement = null;

    /** Set when the page has no structure, i.e. it is not tagged. */
    this.hasNoStructTree = false;

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
   * Sets the loaded page, and its own size instead of the estimate.
   *
   * @param {import('pdfjs-dist').PDFPageProxy} pdfPage
   */
  setPdfPage(pdfPage) {
    this.pdfPage = pdfPage;
    const { width, height, userUnit } = pdfPage.getViewport({ scale: 1 });
    this.userUnit = userUnit;
    this.#updateTextScale();
    if (width === this.unscaledWidth && height === this.unscaledHeight) {
      return;
    }
    this.unscaledWidth = width;
    this.unscaledHeight = height;
    // The canvas has the wrong aspect ratio now, render it again.
    this.cancel();
    this.renderedScale = 0;
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
      const controller = new AbortController();
      const stop = () => {
        container.classList.remove('selecting');
        controller.abort();
      };
      window.addEventListener('pointerup', stop, { signal: controller.signal });
      window.addEventListener('pointercancel', stop, { signal: controller.signal });
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
   * Adds the structure of a tagged PDF page, which exposes headings, lists,
   * tables and figures to assistive technology. Does nothing for untagged
   * pages, or when the structure was already added.
   *
   * @return {Promise<void>}
   */
  async renderStructTree() {
    if (this.structTreeElement || this.hasNoStructTree || !this.textLayerElement) {
      return;
    }
    const textLayerElement = this.textLayerElement;
    let tree = null;
    try {
      tree = await this.pdfPage.getStructTree();
    } catch {
      // The structure is optional. A page with a broken one is shown as untagged.
    }
    // Remembered, so that rendering the page again does not ask the worker again.
    this.hasNoStructTree = !tree;
    const element = createStructTreeElement(tree);
    // The text layer may have been released meanwhile.
    if (element && this.textLayerElement === textLayerElement && !this.structTreeElement) {
      this.structTreeElement = element;
      textLayerElement.before(element);
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
   * Returns the text of the text layer that is inside the given element, e.g.
   * the text of a link, as the text layer elements with the offsets of their
   * words whose center is inside the element. Whole words are used, as the
   * text layer only places each element exactly, not each of its characters.
   *
   * @param {Element} element
   * @return {Array<{ element: HTMLElement, start: number, end: number }>}
   */
  getTextInside(element) {
    if (!this.textLayer) {
      return [];
    }
    const rect = element.getBoundingClientRect();
    const isInside = (wordRect) => {
      const x = wordRect.left + wordRect.width / 2;
      const y = wordRect.top + wordRect.height / 2;
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    };
    const parts = [];
    const range = document.createRange();
    this.textLayer.textDivs.forEach((span) => {
      const textNode = span.firstChild;
      const spanRect = span.getBoundingClientRect();
      const overlaps =
        spanRect.left <= rect.right &&
        spanRect.right >= rect.left &&
        spanRect.top <= rect.bottom &&
        spanRect.bottom >= rect.top;
      if (!textNode || !overlaps) {
        return;
      }
      // The words inside a link are next to each other, as a link is a rectangle.
      let start = -1;
      let end = -1;
      // Words as the browser finds them, also in languages without spaces, without punctuation.
      for (const word of wordSegmenter.segment(textNode.data)) {
        if (!word.isWordLike) {
          continue;
        }
        range.setStart(textNode, word.index);
        range.setEnd(textNode, word.index + word.segment.length);
        if (isInside(range.getBoundingClientRect())) {
          start = start < 0 ? word.index : start;
          end = word.index + word.segment.length;
        }
      }
      if (start >= 0) {
        parts.push({ element: span, start, end });
      }
    });
    return parts;
  }

  /**
   * Moves links into the text layer, next to the text they cover, so that
   * assistive technology reads each link once, in reading order. The text
   * layer elements with links stay for selecting and finding text, but are
   * hidden from assistive technology. Their text outside the links is added
   * next to the links, for assistive technology only. A link that covers the
   * text of several elements is placed with the first one.
   *
   * @param {Array<{ link: HTMLElement, parts: Array<{ element: HTMLElement, start: number, end: number }> }>} links
   *   the links with the text they cover, see `getTextInside()`
   */
  placeLinks(links) {
    const partsByElement = new Map();
    links.forEach(({ link, parts }) => {
      parts.forEach((part) => {
        if (!partsByElement.has(part.element)) {
          partsByElement.set(part.element, []);
        }
        partsByElement.get(part.element).push({ ...part, link });
      });
    });

    const placedLinks = new Set();
    this.textLayer.textDivs.forEach((element) => {
      const parts = partsByElement.get(element);
      if (!parts) {
        return;
      }
      parts.sort((a, b) => a.start - b.start);
      const text = element.firstChild.data;
      const nodes = [];
      let offset = 0;
      parts.forEach(({ start, end, link }) => {
        nodes.push(text.slice(offset, start));
        if (!placedLinks.has(link)) {
          placedLinks.add(link);
          nodes.push(link);
        }
        offset = Math.max(offset, end);
      });
      nodes.push(text.slice(offset));

      element.setAttribute('aria-hidden', 'true');
      element.after(
        ...nodes
          .filter((node) => typeof node !== 'string' || node.trim())
          .map((node) => (typeof node === 'string' ? createAssistiveText(node) : node)),
      );
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
    this.structTreeElement?.remove();
    this.structTreeElement = null;
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
