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

/** The number of pages whose text is loaded at a time when searching. */
const SEARCH_BATCH = 10;

/**
 * A mixin that finds text in the document.
 */
export const PdfViewerFindMixin = (superClass) =>
  class PdfViewerFindMixinClass extends superClass {
    /**
     * The normalized text of each page for searching, by page index. Holds
     * the promise while the text loads.
     * @type {Map<number, Promise<import('./pdf-viewer-find.js').PdfViewerNormalizedText>>}
     */
    #pageTexts = new Map();

    /** Incremented on every search and document unload, to drop results of an outdated search. */
    #searchId = 0;

    /** Incremented on every `find()` call, so that only the last call runs once the document is ready. */
    #callId = 0;

    /**
     * Searches the document for the given text and fires `find-result` with
     * the number of matches. While the document loads, it runs once loaded.
     * Does nothing without a document, or when the viewer is not attached.
     * Of several `find()` calls in a row, only the last one runs.
     *
     * @param {string} text
     */
    find(text) {
      this.#runWhenReady(() => this.#searchPages(String(text ?? '')));
    }

    /**
     * Override method from `PdfViewerDocumentMixin` to forget the text of
     * the previous document and stop a running search.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();
      this.#pageTexts.clear();
      this.#resetSearch();
    }

    /**
     * Runs a `find()` call once the document is ready, unless another call
     * came meanwhile.
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

    /**
     * Stops a running search.
     * @private
     */
    #resetSearch() {
      this.#searchId += 1;
    }

    /**
     * Searches the document for the text and fires `find-result`.
     * @param {string} query
     * @private
     */
    async #searchPages(query) {
      this.#resetSearch();
      const searchId = this.#searchId;
      const pageIndexes = Array.from({ length: this.pageCount }, (_, index) => index);
      let matchCount = 0;

      // A query of white space or diacritics only finds nothing, without loading the text.
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
     * Returns the normalized text of a page for searching, loading it when needed.
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
