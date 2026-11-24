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
import { ANNOTATION_ID_PREFIX, compareAnnotationPositions } from './pdf-viewer-text-accessibility.js';
import { loadPdfjs } from './pdfjs-loader.js';

/**
 * Limits the clickable area of a link to the quadrilaterals or the rectangles of its annotations, such as the words of
 * a link that wraps, as pdf.js does.
 *
 * @param {HTMLAnchorElement} link
 * @param {number[]} rect the rectangle of the link
 * @param {Array<{ rect: number[], quadPoints?: ArrayLike<number> | null }>} annotations
 */
function addLinkAreas(link, [left, bottom, right, top], annotations) {
  const width = right - left;
  const height = top - bottom;
  const areas = annotations
    .flatMap(({ rect, quadPoints }) => {
      if (!quadPoints?.length) {
        return [[rect[0], rect[3], rect[2], rect[1]]];
      }
      const quads = [];
      // pdf.js orders the corners of each quadrilateral as top left, top right, bottom left, bottom right.
      for (let i = 0; i < quadPoints.length; i += 8) {
        quads.push([quadPoints[i], quadPoints[i + 1], quadPoints[i + 2], quadPoints[i + 5]]);
      }
      return quads;
    })
    .map(([areaLeft, areaTop, areaRight, areaBottom]) => [
      (areaLeft - left) / width,
      (top - areaTop) / height,
      (areaRight - areaLeft) / width,
      (areaTop - areaBottom) / height,
    ]);
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
   * @param {string[][]} [linkGroups] the ids of the annotations that render as one link, see `getLinkGroups()`
   * @return {Promise<Array<{ link: HTMLAnchorElement, annotation: object }>>}
   */
  async render(pdfPage, followLink, optionalContentConfig, linkGroups = []) {
    const [{ setLayerDimensions }, annotations] = await Promise.all([
      loadPdfjs(),
      pdfPage.getAnnotations({ intent: 'display' }),
    ]);

    const viewport = pdfPage.getViewport({ scale: 1, rotation: 0 });
    setLayerDimensions(this.element, pdfPage.getViewport({ scale: 1 }));

    const groupIndexes = new Map(linkGroups.flatMap((ids, index) => ids.map((id) => [id, index])));
    const groupLinks = new Map();
    const links = [];
    // A copy, as pdf.js returns the same annotations to each call.
    [...annotations].sort(compareAnnotationPositions).forEach((annotation) => {
      if (
        annotation.subtype !== 'Link' ||
        (annotation.oc && optionalContentConfig?.isVisible(annotation.oc) === false)
      ) {
        return;
      }
      const id = `${ANNOTATION_ID_PREFIX}${annotation.id}`;
      const groupIndex = groupIndexes.get(id);
      // Another annotation of a link, such as its next line, adds its area to the link.
      if (groupLinks.has(groupIndex)) {
        groupLinks.get(groupIndex).annotations.push(annotation);
        return;
      }
      const link = createLink(annotation, followLink);
      if (!link) {
        return;
      }
      link.id = id;
      const entry = { link, annotations: [annotation] };
      if (groupIndex !== undefined) {
        groupLinks.set(groupIndex, entry);
      }
      links.push(entry);
    });

    this.links = links.map(({ link }) => link);
    return links.map(({ link, annotations: [annotation, ...others] }) => {
      const rect = [...others.map((other) => other.rect), annotation.rect].reduce((union, [x1, y1, x2, y2]) => [
        Math.min(union[0], x1),
        Math.min(union[1], y1),
        Math.max(union[2], x2),
        Math.max(union[3], y2),
      ]);
      const [x1, y1] = viewport.convertToViewportPoint(rect[0], rect[1]);
      const [x2, y2] = viewport.convertToViewportPoint(rect[2], rect[3]);
      link.style.left = `${(Math.min(x1, x2) / viewport.width) * 100}%`;
      link.style.top = `${(Math.min(y1, y2) / viewport.height) * 100}%`;
      link.style.width = `${(Math.abs(x2 - x1) / viewport.width) * 100}%`;
      link.style.height = `${(Math.abs(y2 - y1) / viewport.height) * 100}%`;
      addLinkAreas(link, rect, [annotation, ...others]);
      this.element.append(link);
      if (!others.length) {
        return { link, annotation };
      }
      // The text that all annotations cover names the link.
      const overlaidText = [annotation, ...others].map((part) => part.overlaidText ?? '').join(' ');
      return { link, annotation: { ...annotation, rect, overlaidText } };
    });
  }
}
