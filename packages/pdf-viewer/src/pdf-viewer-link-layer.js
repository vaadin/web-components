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
import { createLink } from './pdf-viewer-links.js';
import { addLinksToText, ANNOTATION_ID_PREFIX, compareAnnotationPositions } from './pdf-viewer-text-accessibility.js';
import { loadPdfjs } from './pdfjs-loader.js';

/**
 * Limits the clickable area of a link to its quadrilaterals, such as the words of a link that wraps, as pdf.js does.
 *
 * @param {HTMLAnchorElement} link
 * @param {{ rect: number[], quadPoints?: ArrayLike<number> | null }} annotation
 */
function addLinkAreas(link, { rect: [left, bottom, right, top], quadPoints }) {
  if (!quadPoints?.length) {
    return;
  }
  const width = right - left;
  const height = top - bottom;
  const areas = [];
  // pdf.js orders the corners of each quadrilateral as top left, top right, bottom left, bottom right.
  for (let i = 0; i < quadPoints.length; i += 8) {
    const [areaLeft, areaTop, areaRight] = [quadPoints[i], quadPoints[i + 1], quadPoints[i + 2]];
    const areaBottom = quadPoints[i + 5];
    areas.push([
      (areaLeft - left) / width,
      (top - areaTop) / height,
      (areaRight - areaLeft) / width,
      (areaTop - areaBottom) / height,
    ]);
  }
  const wholeLink = [0, 0, 1, 1];
  if (areas.length === 1 && areas[0].every((value, index) => Math.abs(value - wholeLink[index]) < 0.001)) {
    return;
  }
  areas.forEach(([areaLeft, areaTop, areaWidth, areaHeight]) => {
    const area = document.createElement('span');
    area.className = 'link-area';
    area.style.left = `${areaLeft * 100}%`;
    area.style.top = `${areaTop * 100}%`;
    area.style.width = `${areaWidth * 100}%`;
    area.style.height = `${areaHeight * 100}%`;
    link.append(area);
  });
}

/**
 * The links of a page, positioned relative to the page size so that they
 * need no update when the scale changes.
 */
export class PdfViewerLinkLayer {
  #addedToText = false;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'link-layer';

    /** @type {HTMLAnchorElement[]} */
    this.links = [];
  }

  /**
   * @param {import('pdfjs-dist').PDFPageProxy} pdfPage
   * @param {(annotation: object) => void} followLink called when an internal link is clicked
   * @param {{ isVisible: (group: object) => boolean }} [optionalContentConfig] the visible layers
   * @return {Promise<Array<{ link: HTMLAnchorElement, annotation: object }>>}
   */
  async render(pdfPage, followLink, optionalContentConfig) {
    const [{ setLayerDimensions }, annotations] = await Promise.all([
      loadPdfjs(),
      pdfPage.getAnnotations({ intent: 'display' }),
    ]);

    const links = [];
    const viewport = pdfPage.getViewport({ scale: 1, rotation: 0 });
    setLayerDimensions(this.element, pdfPage.getViewport({ scale: 1 }));

    // A copy, as pdf.js returns the same annotations to each call.
    [...annotations].sort(compareAnnotationPositions).forEach((annotation) => {
      if (annotation.oc && optionalContentConfig?.isVisible(annotation.oc) === false) {
        return;
      }
      const link = annotation.subtype === 'Link' && createLink(annotation, followLink);
      if (!link) {
        return;
      }
      link.id = `${ANNOTATION_ID_PREFIX}${annotation.id}`;
      const [x1, y1] = viewport.convertToViewportPoint(annotation.rect[0], annotation.rect[1]);
      const [x2, y2] = viewport.convertToViewportPoint(annotation.rect[2], annotation.rect[3]);
      link.style.left = `${(Math.min(x1, x2) / viewport.width) * 100}%`;
      link.style.top = `${(Math.min(y1, y2) / viewport.height) * 100}%`;
      link.style.width = `${(Math.abs(x2 - x1) / viewport.width) * 100}%`;
      link.style.height = `${(Math.abs(y2 - y1) / viewport.height) * 100}%`;
      addLinkAreas(link, annotation);
      this.element.append(link);
      links.push({ link, annotation });
    });

    this.links = links.map(({ link }) => link);
    return links;
  }

  /**
   * @param {import('./pdf-viewer-text-layer.js').PdfViewerTextLayer} textLayer a rendered text layer
   */
  addToText(textLayer) {
    if (this.#addedToText || !this.links.length) {
      return;
    }
    this.#addedToText = true;
    addLinksToText(textLayer.textDivs, this.links);
  }
}
