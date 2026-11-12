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
 * The text of a page for searching, built from the text items of `getTextContent()`.
 *
 * @typedef {Object} PdfViewerPageText
 * @property {string} text the text of all items, with a line break after items that end a line
 */

/**
 * @param {Array<{ str?: string, hasEOL?: boolean }>} contentItems the items of `getTextContent()`
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

/**
 * The combining diacritical marks of Latin, Greek and Cyrillic letters, which
 * searching ignores. Marks of other scripts are kept, as they make another
 * letter, e.g. the voiced marks of Japanese kana and the vowel signs of
 * Indic scripts.
 */
const DIACRITICS = /[\u0300-\u036f]|[\u1ab0-\u1aff]|[\u1dc0-\u1dff]|[\u20d0-\u20ff]|[\ufe20-\ufe2f]/gu;

/**
 * Normalizes text for searching: ignores case, the diacritics of Latin, Greek
 * and Cyrillic letters and differences in white space, and splits ligatures
 * (e.g. "ﬁ" into "fi").
 *
 * @param {string} text
 * @return {{ text: string, offsets: number[] }} the normalized text, and for each of its
 *   characters the offset of the original character it comes from
 */
export function normalizeText(text) {
  let normalized = '';
  const offsets = [];
  let isPreviousSpace = false;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (/\s/u.test(char)) {
      if (!isPreviousSpace) {
        normalized += ' ';
        offsets.push(index);
      }
      isPreviousSpace = true;
      continue;
    }
    isPreviousSpace = false;
    const folded = char.normalize('NFKD').replace(DIACRITICS, '').toLowerCase();
    for (const foldedChar of folded) {
      normalized += foldedChar;
      offsets.push(index);
    }
  }
  return { text: normalized, offsets };
}

/**
 * Finds all occurrences of the query in the text of a page, as `normalizeText()` normalizes both.
 *
 * @param {{ text: string, offsets: number[] }} normalizedPage the result of `normalizeText()` for the page
 * @param {string} query
 * @return {Array<{ start: number, end: number }>} the matches as offsets in the original text
 */
export function findInText(normalizedPage, query) {
  const needle = normalizeText(query.trim()).text;
  const matches = [];
  if (!needle) {
    return matches;
  }
  const { text, offsets } = normalizedPage;
  let index = text.indexOf(needle);
  while (index !== -1) {
    const lastIndex = index + needle.length - 1;
    matches.push({ start: offsets[index], end: offsets[lastIndex] + 1 });
    index = text.indexOf(needle, index + needle.length);
  }
  return matches;
}
