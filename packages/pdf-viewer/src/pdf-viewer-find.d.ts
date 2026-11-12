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
 */
export type PdfViewerPageText = {
  /** The text of all items, with a line break after items that end a line. */
  text: string;
};

/**
 * Text normalized for searching, see `normalizeText()`.
 */
export type PdfViewerNormalizedText = {
  text: string;
  /** For each character of `text`, the start offset of the original character it comes from. */
  starts: number[];
  /** For each character of `text`, the end offset of the original character it comes from. */
  ends: number[];
};

/**
 * A match as offsets in the original text.
 */
export type PdfViewerTextMatch = {
  start: number;
  end: number;
};

/**
 * Builds the text of a page for searching from the items of `getTextContent()`.
 */
export declare function createPageText(contentItems: Array<{ str?: string; hasEOL?: boolean }>): PdfViewerPageText;

/**
 * Normalizes text for searching: ignores case, the diacritics of Latin, Greek
 * and Cyrillic letters, spacing accents and differences in white space, and
 * splits ligatures.
 */
export declare function normalizeText(text: string): PdfViewerNormalizedText;

/**
 * Finds all occurrences of the query in the text of a page, as `normalizeText()` normalizes both.
 */
export declare function findInText(normalizedPage: PdfViewerNormalizedText, query: string): PdfViewerTextMatch[];
