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
/** The named actions of internal links that the viewer supports. */
const SUPPORTED_LINK_ACTIONS = ['FirstPage', 'LastPage', 'NextPage', 'PrevPage'];

/**
 * The `i18n` keys of the names of named actions that go to a page relative to
 * the current page, which is not known when the link gets its name.
 */
const RELATIVE_ACTION_NAMES = { NextPage: 'nextPage', PrevPage: 'previousPage' };

/** The protocols of external links that the viewer opens. Links with other URLs are left out. */
const ALLOWED_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:'];

/**
 * The indexes of the left and top coordinates in the explicit destinations
 * that have them, by destination type, e.g. `[page, { name: 'XYZ' }, left, top, zoom]`.
 */
const DESTINATION_POSITION_INDEXES = {
  XYZ: { left: 2, top: 3 },
  FitH: { top: 2 },
  FitBH: { top: 2 },
  FitV: { left: 2 },
  FitBV: { left: 2 },
  FitR: { left: 2, top: 5 },
};

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
    // The href makes the link focusable and a link for assistive technology. Opening it in a new
    // tab opens the application page, as the destination is only known to the viewer.
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
 * position is in PDF units from the bottom left corner of the unrotated page.
 *
 * @param {import('pdfjs-dist').PDFDocumentProxy} pdfDocument
 * @param {{ dest?: string | Array, action?: string }} destination
 * @param {{ page: number, pageCount: number }} position the current page and the number of pages
 * @return {Promise<{ page: number, left?: number, top?: number } | null>}
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
    const indexes = DESTINATION_POSITION_INDEXES[name] ?? {};
    const [left, top] = [indexes.left, indexes.top].map((index) =>
      typeof explicitDest[index] === 'number' ? explicitDest[index] : undefined,
    );
    return { page: pageIndex + 1, left, top };
  } catch {
    // A broken destination does nothing, like in other PDF viewers.
    return null;
  }
}

/**
 * Returns the accessible name of a link: its text, or the URL or the page it
 * goes to when it has none. Links to the next or previous page are named so,
 * as that page depends on the current page. Names of external links tell that
 * they open in a new tab.
 *
 * @param {{ text: string, url?: string, action?: string, targetPage: number | null }} link
 * @param {{ link: string, goToPage: string, externalLink: string, nextPage: string, previousPage: string }} i18n
 * @return {string}
 */
export function getLinkLabel({ text, url, action, targetPage }, i18n) {
  let label = text || url;
  if (!label && RELATIVE_ACTION_NAMES[action]) {
    label = i18n[RELATIVE_ACTION_NAMES[action]];
  } else if (!label) {
    label = targetPage ? i18n.goToPage.replace('{page}', targetPage) : i18n.link;
  }
  return url ? i18n.externalLink.replace('{text}', label) : label;
}
