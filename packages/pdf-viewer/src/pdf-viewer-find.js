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
 * @typedef {Object} PdfViewerPageText
 * @property {string} text
 */

/**
 * @param {Array<{ str?: string, hasEOL?: boolean }>} contentItems
 * @return {PdfViewerPageText}
 */
export function createPageText(contentItems) {
  let text = '';
  contentItems.forEach((item) => {
    // Marked content items have no text
    if (item.str === undefined) {
      return;
    }
    text += item.str;
    if (item.hasEOL) {
      text += '\n';
    }
  });
  return { text };
}

/** Only Latin, Greek and Cyrillic marks, as the marks of other scripts, such as kana voicing, make another letter. */
const DIACRITICS = /[\u0300-\u036f]|[\u1ab0-\u1aff]|[\u1dc0-\u1dff]|[\u20d0-\u20ff]|[\ufe20-\ufe2f]/gu;

/**
 * @param {string} text
 * @return {{ text: string, starts: number[], ends: number[] }}
 */
export function normalizeText(text) {
  let normalized = '';
  const starts = [];
  const ends = [];
  let isPreviousSpace = false;
  let end = 0;
  // By code point, so that letters such as "𝐀" fold too.
  for (const char of text) {
    const start = end;
    end += char.length;
    let folded = ' ';
    if (!/\s/u.test(char)) {
      // A single "Σ" lowercases to "σ", so the final "ς" folds to it too.
      folded = char.normalize('NFKD').replace(DIACRITICS, '').toLowerCase().replace('ς', 'σ');
      // A spacing accent, as in "r´esum´e" of some PDF files, folds to a space.
      if (!folded.trim()) {
        continue;
      }
    } else if (isPreviousSpace) {
      continue;
    }
    isPreviousSpace = folded === ' ';
    normalized += folded;
    // One entry for each UTF-16 code unit, as `indexOf()` counts them.
    starts.push(...new Array(folded.length).fill(start));
    ends.push(...new Array(folded.length).fill(end));
  }
  return { text: normalized, starts, ends };
}

/**
 * @param {{ text: string, starts: number[], ends: number[] }} normalizedPage
 * @param {string} query
 * @return {Array<{ start: number, end: number }>} the matches as offsets in the original text
 */
export function findInText(normalizedPage, query) {
  const needle = normalizeText(query.trim()).text;
  const matches = [];
  if (!needle) {
    return matches;
  }
  const { text, starts, ends } = normalizedPage;
  let index = text.indexOf(needle);
  while (index !== -1) {
    matches.push({ start: starts[index], end: ends[index + needle.length - 1] });
    index = text.indexOf(needle, index + needle.length);
  }
  return matches;
}
