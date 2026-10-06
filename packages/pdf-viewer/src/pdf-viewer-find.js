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
 * The text of a page for searching, built from the text items of pdf.js
 * `getTextContent()`. The text items are in the same order as the elements
 * of the text layer, so a match in the text maps to text layer elements.
 *
 * @typedef {Object} PageText
 * @property {string} text the text of all items, with a line break after items that end a line
 * @property {number[]} itemStarts the offset in `text` where each text item starts
 * @property {string[]} items the text of each text item
 */

/**
 * @param {Array<{ str?: string, hasEOL?: boolean }>} contentItems the items of `getTextContent()`
 * @return {PageText}
 */
export function createPageText(contentItems) {
  let text = '';
  const itemStarts = [];
  const items = [];
  contentItems.forEach((item) => {
    // Marked content items have no text, and no element in the text layer
    if (item.str === undefined) {
      return;
    }
    itemStarts.push(text.length);
    items.push(item.str);
    text += item.str;
    if (item.hasEOL) {
      text += '\n';
    }
  });
  return { text, itemStarts, items };
}

/**
 * Normalizes text for searching: ignores case, diacritics and differences in
 * white space, and splits ligatures (e.g. "ﬁ" into "fi"). Returns the
 * normalized text, and for each of its characters the offset of the original
 * character it comes from.
 *
 * @param {string} text
 * @return {{ text: string, offsets: number[] }}
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
    const folded = char.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
    for (const foldedChar of folded) {
      normalized += foldedChar;
      offsets.push(index);
    }
  }
  return { text: normalized, offsets };
}

/**
 * Finds all occurrences of the query in the text of a page, ignoring case,
 * diacritics and white space differences.
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

/**
 * Returns the parts of the text items that a match covers, as the index of
 * the item and the start and end offsets within the item.
 *
 * @param {PageText} pageText
 * @param {{ start: number, end: number }} match
 * @return {Array<{ itemIndex: number, start: number, end: number }>}
 */
export function getMatchParts(pageText, { start, end }) {
  const parts = [];
  pageText.itemStarts.forEach((itemStart, itemIndex) => {
    const itemEnd = itemStart + pageText.items[itemIndex].length;
    if (itemEnd > start && itemStart < end) {
      parts.push({
        itemIndex,
        start: Math.max(start, itemStart) - itemStart,
        end: Math.min(end, itemEnd) - itemStart,
      });
    }
  });
  return parts;
}
