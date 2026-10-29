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
import { createPageText, findInText, getMatchParts, normalizeText } from './pdf-viewer-find.js';

/** The number of pages whose text is loaded at a time when searching. */
const SEARCH_BATCH = 10;

/**
 * A mixin that finds text in the document and highlights the matches on
 * the rendered pages.
 */
export const PdfViewerFindMixin = (superClass) =>
  class PdfViewerFindMixinClass extends superClass {
    /** @type {Array<{ pageIndex: number, start: number, end: number }>} */
    #matches = [];

    /** The index of the current match, or -1. */
    #currentIndex = -1;

    /**
     * The text of each page for searching, by page index. Holds the promise
     * while the text loads.
     * @type {Map<number, Promise<{ pageText: import('./pdf-viewer-find.js').PageText, normalized: { text: string, offsets: number[] } }>>}
     */
    #pageTexts = new Map();

    /** Incremented on every search, to drop results of an outdated search. */
    #searchId = 0;

    /** Set to scroll to the current match once it is highlighted. */
    #scrollToMatchPending = false;

    /** Incremented on every `find()` and `highlight()` call, so that only the last call of a task runs. */
    #callId = 0;

    /**
     * The text layer of each page whose layers have finished rendering. A
     * page with another text layer, or none, is not ready for highlights.
     * @type {WeakMap<import('./pdf-viewer-page.js').PdfViewerPage, object>}
     */
    #renderedTextLayers = new WeakMap();

    /** @protected */
    updated(props) {
      super.updated(props);

      // Drop the scroll to a match when the user goes to another page before the match is shown.
      if (props.has('page') && this.#scrollToMatchPending && this.page !== this.#getCurrentMatch().pageIndex + 1) {
        this.#scrollToMatchPending = false;
      }
    }

    /**
     * Searches the document for the given text and scrolls to the first
     * match. The matches are highlighted on the pages. Fires `find-result`
     * with the number of matches. While the document loads, it runs once
     * loaded. Does nothing without a document, or when the viewer is not
     * attached. Of several `find()` and `highlight()` calls in a row, only
     * the last one runs.
     *
     * @param {string} text
     */
    find(text) {
      this.#runWhenReady(() => this.#search(String(text ?? '')));
    }

    /**
     * Highlights the given text on the given page and scrolls to it, for
     * a passage that the application has located. The next `highlight()` or
     * `find()` clears it. While the document loads, it runs once loaded.
     * Does nothing without a document, or when the viewer is not attached.
     * Of several `find()` and `highlight()` calls in a row, only the last
     * one runs.
     *
     * @param {number} page the page number, starting from 1
     * @param {string} text
     */
    highlight(page, text) {
      this.#runWhenReady(() => this.#highlight(page, text));
    }

    /**
     * Override method from `PdfViewerRenderMixin` to highlight the matches
     * on a page once it is rendered.
     * @protected
     * @override
     */
    _pageRendered(page) {
      super._pageRendered(page);
      this.#renderedTextLayers.set(page, page.textLayer);
      this.#highlightPage(page);
    }

    /**
     * Override method from `PdfViewerDocumentMixin` to forget the text and
     * the matches of the previous document.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();
      this.#pageTexts.clear();
      this.#resetSearch();
    }

    /**
     * Runs a `find()` or `highlight()` call once the document is ready,
     * unless another call came meanwhile.
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
    #highlight(page, text) {
      if (Number.isInteger(page) && page >= 1 && page <= this.pageCount) {
        this.#search(String(text ?? ''), page);
      } else {
        issueWarning(
          `The page ${page} is out of range for <vaadin-pdf-viewer>, the document has ${this.pageCount} pages.`,
        );
        this.#resetSearch();
        this.#highlightPages();
      }
    }

    /**
     * Drops the results and stops a running search.
     * @private
     */
    #resetSearch() {
      this.#searchId += 1;
      this.#matches = [];
      this.#currentIndex = -1;
      this.#scrollToMatchPending = false;
    }

    /**
     * Searches the document, or one page of it, for the text, and shows the
     * first match. A search of the whole document fires `find-result`.
     * @param {string} query
     * @param {number} [pageNumber] the page to search, or 0 for all pages
     * @private
     */
    #search(query, pageNumber = 0) {
      this.#searchPages(query, pageNumber).catch((error) => {
        issueWarning(`Failed to find text in the PDF document: ${error.message}`);
      });
    }

    /** @private */
    async #searchPages(query, pageNumber) {
      this.#resetSearch();
      const searchId = this.#searchId;
      const pageIndexes = pageNumber ? [pageNumber - 1] : Array.from({ length: this.pageCount }, (_, index) => index);
      const matches = [];

      if (query.trim() && this._pdfDocument) {
        for (let start = 0; start < pageIndexes.length; start += SEARCH_BATCH) {
          const batch = pageIndexes.slice(start, start + SEARCH_BATCH);
          const texts = await Promise.all(batch.map((pageIndex) => this.#getPageText(pageIndex)));
          if (searchId !== this.#searchId) {
            return;
          }
          texts.forEach(({ normalized }, i) => {
            findInText(normalized, query).forEach((match) => matches.push({ pageIndex: batch[i], ...match }));
          });
        }
      }

      this.#matches = matches;
      this.#currentIndex = matches.length ? 0 : -1;
      this.#scrollToMatchPending = matches.length > 0;
      // Also clears the highlights of a previous search on other pages.
      this.#highlightPages();

      // Go to the page of the match, which scrolls to the match once the page has rendered.
      const match = this.#getCurrentMatch();
      if (match && !this.#isPageReady(this.__pages[match.pageIndex])) {
        this._scrollToPage(match.pageIndex + 1);
      }

      if (!pageNumber) {
        this.dispatchEvent(new CustomEvent('find-result', { detail: { query, matchCount: matches.length } }));
      }
    }

    /**
     * Returns the text of a page for searching, loading it when needed.
     * @private
     */
    #getPageText(pageIndex) {
      if (!this.#pageTexts.has(pageIndex)) {
        const pdfDocument = this._pdfDocument;
        const promise = pdfDocument
          .getPage(pageIndex + 1)
          .then((pdfPage) => pdfPage.getTextContent({ includeMarkedContent: true }))
          .then(({ items }) => {
            // The marked content items have no text and are skipped by `createPageText()`.
            const pageText = createPageText(items);
            return { pageText, normalized: normalizeText(pageText.text) };
          })
          .catch((error) => {
            // Loading the text fails when the document is unloaded meanwhile.
            if (this._pdfDocument === pdfDocument) {
              issueWarning(`Failed to load the text of page ${pageIndex + 1} of the PDF document: ${error.message}`);
              // Load the text again for the next search.
              this.#pageTexts.delete(pageIndex);
            }
            const pageText = createPageText([]);
            return { pageText, normalized: normalizeText('') };
          });
        this.#pageTexts.set(pageIndex, promise);
      }
      return this.#pageTexts.get(pageIndex);
    }

    /** @private */
    #getCurrentMatch() {
      return this.#matches[this.#currentIndex];
    }

    /**
     * Whether the layers of the page have finished rendering, so that its
     * text layer can show highlights.
     * @private
     */
    #isPageReady(page) {
      return Boolean(page?.textLayer) && this.#renderedTextLayers.get(page) === page.textLayer;
    }

    /**
     * Updates the highlights of all pages that are ready for them.
     * @private
     */
    #highlightPages() {
      this.__pages.forEach((page) => {
        if (this.#isPageReady(page)) {
          this.#highlightPage(page);
        }
      });
    }

    /**
     * Draws the highlights of the matches on a page over its text layer, and
     * scrolls to the current match when that is pending.
     * @private
     */
    #highlightPage(page) {
      page.clearFindLayer();

      const pageIndex = page.pageNumber - 1;
      const matches = this.#matches.filter((match) => match.pageIndex === pageIndex);
      if (!matches.length) {
        return;
      }

      const searchId = this.#searchId;
      this.#getPageText(pageIndex)
        .then(({ pageText }) => {
          // The page renders again or is released meanwhile, `_pageRendered()` draws the highlights then.
          if (searchId !== this.#searchId || !this.#isPageReady(page)) {
            return;
          }

          const currentMatch = this.#getCurrentMatch();
          // The highlights need the text layer elements that the text was taken from.
          if (page.textLayer.textDivs.length === pageText.items.length) {
            page.renderFindLayer(
              matches.flatMap((match) =>
                getMatchParts(pageText, match).map((part) => ({ ...part, current: match === currentMatch })),
              ),
            );
          }

          if (this.#scrollToMatchPending && currentMatch.pageIndex === pageIndex) {
            this.#scrollToMatchPending = false;
            const currentElement = page.findLayerElement?.querySelector('.find-match.current');
            if (currentElement) {
              this._scrollRectIntoView(currentElement.getBoundingClientRect());
            } else {
              // Without highlights, go at least to the page of the match.
              this._scrollToPage(pageIndex + 1);
            }
          }
        })
        .catch((error) => {
          issueWarning(
            `Failed to highlight the matches on page ${page.pageNumber} of the PDF document: ${error.message}`,
          );
        });
    }
  };
