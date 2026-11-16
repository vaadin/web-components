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
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { createPageText, findInText, normalizeText } from './pdf-viewer-find.js';

/** Pages whose text loads at a time, so that rendering does not wait behind the text of all pages. */
const SEARCH_BATCH = 10;

/**
 * A mixin that finds text in the document.
 */
export const PdfViewerFindMixin = (superClass) =>
  class PdfViewerFindMixinClass extends superClass {
    /** @type {Map<number, Promise<import('./pdf-viewer-find.js').PdfViewerNormalizedText>>} */
    #pageTexts = new Map();

    #searchId = 0;

    /** Drops a `find()` call that waits for the document when another call comes. */
    #callId = 0;

    /**
     * Searches the document for the given text and fires `find-result` with
     * the number of matches.
     *
     * The search waits while the document loads. It fires no `find-result`
     * without a document, when the viewer is not attached, when another
     * `find()` call follows, or when `src` changes during the search.
     *
     * @param {string} text
     */
    find(text) {
      this.#runWhenReady(() => this.#searchPages(String(text ?? '')));
    }

    /**
     * Override method from `PdfViewerDocumentMixin` to forget the text and stop a running search.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();
      this.#pageTexts.clear();
      this.#resetSearch();
    }

    /**
     * @param {() => void} callback
     * @private
     */
    #runWhenReady(callback) {
      this.#callId += 1;
      const callId = this.#callId;
      this._whenDocumentReady().then((pdfDocument) => {
        if (pdfDocument && callId === this.#callId) {
          callback();
        }
      });
    }

    /** @private */
    #resetSearch() {
      this.#searchId += 1;
    }

    /**
     * @param {string} query
     * @private
     */
    async #searchPages(query) {
      this.#resetSearch();
      const searchId = this.#searchId;
      const pageIndexes = Array.from({ length: this.pageCount }, (_, index) => index);
      let matchCount = 0;

      // Skips loading the text for a query that normalizes to nothing, such as only accents.
      if (normalizeText(query).text.trim()) {
        for (let start = 0; start < pageIndexes.length; start += SEARCH_BATCH) {
          const batch = pageIndexes.slice(start, start + SEARCH_BATCH);
          const texts = await Promise.all(batch.map((pageIndex) => this.#getPageText(pageIndex)));
          if (searchId !== this.#searchId) {
            return;
          }
          matchCount += texts.reduce((count, text) => count + findInText(text, query).length, 0);
        }
      }

      this.dispatchEvent(new CustomEvent('find-result', { detail: { query, matchCount } }));
    }

    /**
     * @param {number} pageIndex
     * @return {Promise<import('./pdf-viewer-find.js').PdfViewerNormalizedText>}
     * @private
     */
    #getPageText(pageIndex) {
      if (!this.#pageTexts.has(pageIndex)) {
        const pdfDocument = this._pdfDocument;
        const promise = pdfDocument
          .getPage(pageIndex + 1)
          .then((pdfPage) => pdfPage.getTextContent())
          .then(({ items }) => normalizeText(createPageText(items).text))
          .catch((error) => {
            // No warning when the document is unloaded meanwhile.
            if (this._pdfDocument === pdfDocument) {
              issueWarning(`Failed to load the text of page ${pageIndex + 1} of the PDF document: ${error.message}`);
              // Load the text again for the next search.
              this.#pageTexts.delete(pageIndex);
            }
            return normalizeText('');
          });
        this.#pageTexts.set(pageIndex, promise);
      }
      return this.#pageTexts.get(pageIndex);
    }
  };
