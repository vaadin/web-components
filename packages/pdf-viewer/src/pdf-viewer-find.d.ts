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

export interface PageText {
  text: string;
  itemStarts: number[];
  items: string[];
}

export interface NormalizedText {
  text: string;
  offsets: number[];
}

export interface TextMatch {
  start: number;
  end: number;
}

export declare function createPageText(contentItems: Array<{ str?: string; hasEOL?: boolean }>): PageText;

export declare function normalizeText(text: string): NormalizedText;

export declare function findInText(normalizedPage: NormalizedText, query: string): TextMatch[];

export declare function getMatchParts(
  pageText: PageText,
  match: TextMatch,
): Array<{ itemIndex: number; start: number; end: number }>;
