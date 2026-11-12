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

export type PdfViewerPageText = {
  text: string;
};

export type PdfViewerNormalizedText = {
  text: string;
  starts: number[];
  ends: number[];
};

export type PdfViewerTextMatch = {
  start: number;
  end: number;
};

export declare function createPageText(contentItems: Array<{ str?: string; hasEOL?: boolean }>): PdfViewerPageText;

export declare function normalizeText(text: string): PdfViewerNormalizedText;

export declare function findInText(normalizedPage: PdfViewerNormalizedText, query: string): PdfViewerTextMatch[];
