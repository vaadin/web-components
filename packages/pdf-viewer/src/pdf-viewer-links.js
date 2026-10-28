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

/** The named actions of internal links that the viewer supports. */
const SUPPORTED_LINK_ACTIONS = ['FirstPage', 'LastPage', 'NextPage', 'PrevPage'];

/** The protocols of external links that the viewer opens. Links with other URLs are left out. */
const ALLOWED_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:'];

/**
 * The index of the top coordinate in the explicit destinations that have one,
 * by destination type, e.g. `[page, { name: 'XYZ' }, left, top, zoom]`.
 */
const DESTINATION_TOP_INDEX = { XYZ: 3, FitH: 2, FitBH: 2, FitR: 5 };

/** Finds the words of the text of a page, e.g. the text of a link. */
const wordSegmenter = new Intl.Segmenter(undefined, { granularity: 'word' });

/**
 * Whether a segment is a word. Firefox does not mark words that end with a
 * combining mark, e.g. "café" with a combining accent, as word-like.
 */
const isWord = ({ isWordLike, segment }) => isWordLike || /[\p{L}\p{N}]/u.test(segment);

/**
 * Returns whether the URL of a link is safe to open.
 * @param {string} url
 * @return {boolean}
 */
function isAllowedLinkUrl(url) {
  try {
    return ALLOWED_LINK_PROTOCOLS.includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

/**
 * Creates the link element for a link annotation, or returns null for
 * links that the viewer does not support or does not consider safe.
 * External links open in a new tab without access to the page.
 *
 * @param {{ url?: string, dest?: string | Array, action?: string }} annotation
 * @param {(annotation: object) => void} followLink called when an internal link is clicked
 * @return {HTMLAnchorElement | null}
 */
export function createLink(annotation, followLink) {
  const link = document.createElement('a');
  if (annotation.url) {
    if (!isAllowedLinkUrl(annotation.url)) {
      return null;
    }
    link.href = annotation.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  } else if (annotation.dest || SUPPORTED_LINK_ACTIONS.includes(annotation.action)) {
    link.href = '#';
    link.addEventListener('click', (event) => {
      event.preventDefault();
      followLink(annotation);
    });
  } else {
    return null;
  }
  link.className = 'link';
  return link;
}

/**
 * Adds the links of a page to a layer over the page, positioned relative
 * to the page size so that they need no update when the scale changes.
 * Like the text layer, the layer has the size of the page without its
 * rotation, and is rotated with the page. Returns the links with their
 * annotations, or no links when the page was released meanwhile.
 *
 * @param {import('./pdf-viewer-page.js').PdfViewerPage} page
 * @param {(annotation: object) => HTMLAnchorElement | null} create
 * @return {Promise<Array<{ link: HTMLAnchorElement, annotation: object }>>}
 */
export async function renderLinks(page, create) {
  const [{ setLayerDimensions }, annotations] = await Promise.all([
    loadPdfjs(),
    page.pdfPage.getAnnotations({ intent: 'display' }),
  ]);
  // The page may have been released meanwhile, e.g. when the document was unloaded.
  if (!page.canvas || page.linkLayerElement) {
    return [];
  }

  const links = [];
  const viewport = page.pdfPage.getViewport({ scale: 1, rotation: 0 });
  const layer = document.createElement('div');
  layer.className = 'link-layer';
  setLayerDimensions(layer, page.pdfPage.getViewport({ scale: 1 }));

  annotations.forEach((annotation) => {
    if (annotation.subtype !== 'Link') {
      return;
    }
    const link = create(annotation);
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

  page.element.append(layer);
  page.linkLayerElement = layer;
  return links;
}

/**
 * Returns the text of a text layer that is inside the given element, e.g.
 * the text of a link, as the text layer elements with the offsets of their
 * words whose center is inside the element. Whole words are used, as the
 * text layer only places each element exactly, not each of its characters.
 *
 * @param {HTMLElement[]} textDivs the text elements of the text layer
 * @param {Element} element
 * @return {Array<{ element: HTMLElement, start: number, end: number }>}
 */
export function getTextInside(textDivs, element) {
  const rect = element.getBoundingClientRect();
  const isInside = (wordRect) => {
    const x = wordRect.left + wordRect.width / 2;
    const y = wordRect.top + wordRect.height / 2;
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };
  const parts = [];
  const range = document.createRange();
  textDivs.forEach((span) => {
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
      if (!isWord(word)) {
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
 * Returns the page and the position on the page that an internal link or
 * an outline item points to, or null when it cannot be resolved. The
 * position is in PDF units from the bottom of the page.
 *
 * @param {import('pdfjs-dist').PDFDocumentProxy} pdfDocument
 * @param {{ dest?: string | Array, action?: string }} destination
 * @param {{ page: number, pageCount: number }} position the current page and the number of pages
 * @return {Promise<{ page: number, top?: number } | null>}
 */
export async function resolveDestination(pdfDocument, { dest, action }, { page, pageCount }) {
  if (action) {
    const pages = { FirstPage: 1, LastPage: pageCount, NextPage: page + 1, PrevPage: page - 1 };
    const target = pages[action];
    return target >= 1 && target <= pageCount ? { page: target } : null;
  }

  try {
    const explicitDest = typeof dest === 'string' ? await pdfDocument.getDestination(dest) : dest;
    if (!Array.isArray(explicitDest)) {
      return null;
    }
    const [ref, { name }] = explicitDest;
    const pageIndex = Number.isInteger(ref) ? ref : await pdfDocument.getPageIndex(ref);
    if (pageIndex < 0 || pageIndex >= pageCount) {
      return null;
    }
    // Only some types of destinations have a position on the page, at different indexes.
    const top = explicitDest[DESTINATION_TOP_INDEX[name]];
    return { page: pageIndex + 1, top: typeof top === 'number' ? top : undefined };
  } catch {
    // A broken destination does nothing, like in other PDF viewers.
    return null;
  }
}

/**
 * Returns the accessible name of a link: its text, or the URL or the page it
 * goes to when it has none. Names of external links tell that they open in a
 * new tab.
 *
 * @param {{ text: string, url?: string, targetPage: number | null }} link
 * @param {{ link: string, goToPage: string, externalLink: string }} i18n
 * @return {string}
 */
export function getLinkLabel({ text, url, targetPage }, i18n) {
  let label = text || url;
  if (!label) {
    label = targetPage ? i18n.goToPage.replace('{page}', targetPage) : i18n.link;
  }
  return url ? i18n.externalLink.replace('{text}', label) : label;
}
