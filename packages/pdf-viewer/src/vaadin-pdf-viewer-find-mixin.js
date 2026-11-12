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
import { createPageText, findInText, getMatchParts, normalizeText, readTextItems } from './pdf-viewer-find.js';

/** The number of pages whose text is loaded at a time when searching. */
const SEARCH_BATCH = 10;

/**
 * Returns where the view starts on one axis so that a match is in its middle,
 * or the current start when the match is in the view, `margin` away from its edges.
 * @param {number} start the start of the match
 * @param {number} size the size of the match
 * @param {number} viewStart
 * @param {number} viewSize
 * @param {number} [margin]
 * @return {number}
 */
function getViewStart(start, size, viewStart, viewSize, margin = 0) {
  if (start >= viewStart + margin && start + size <= viewStart + viewSize - margin) {
    return viewStart;
  }
  return start + (size - viewSize) / 2;
}

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
     * The pages that could not show their highlights, as they had no size,
     * e.g. in a hidden viewer.
     * @type {Set<import('./pdf-viewer-page.js').PdfViewerPage>}
     */
    #pagesWithoutSize = new Set();

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
     * match. The matches are highlighted on the pages until the next search,
     * or until the document unloads, e.g. on a new `src` or a detach. Fires
     * `find-result` with the number of matches. While the document loads, it
     * runs once loaded. Does nothing without a document, or when the viewer
     * is not attached. Of several `find()` and `highlight()` calls in a row,
     * only the last one runs.
     *
     * @param {string} text
     */
    find(text) {
      this.#runWhenReady(() => this.#search(String(text ?? '')));
    }

    /**
     * Highlights every occurrence of the given text on the given page and
     * scrolls to the first one, for a passage that the application has
     * located. The next `highlight()` or `find()` clears it. A page that is
     * not a page number of the document logs a warning and also clears it.
     * While the document loads, it runs once loaded. Does nothing without a
     * document, or when the viewer is not attached. Of several `find()` and
     * `highlight()` calls in a row, only the last one runs.
     *
     * @param {number} page the page number, starting from 1
     * @param {string} text
     */
    highlight(page, text) {
      this.#runWhenReady(() => this.#highlight(page, text));
    }

    /**
     * Override method from `PdfViewerRenderMixin` to highlight the matches
     * on a page once its text layer has rendered.
     * @protected
     * @override
     */
    async _renderPageLayers(page) {
      await super._renderPageLayers(page);

      // The text layer may still render for another render of the page, which highlights the page then.
      if (this.#isPageReady(page)) {
        this.#highlightPage(page);
      }
    }

    /**
     * Override method from `PdfViewerScrollMixin` to highlight the matches on
     * the pages that had no size, once they have one.
     * @protected
     * @override
     */
    _refreshLayout() {
      super._refreshLayout();

      const pages = [...this.#pagesWithoutSize];
      this.#pagesWithoutSize.clear();
      pages.filter((page) => this.#isPageReady(page)).forEach((page) => this.#highlightPage(page));
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
      this.#pagesWithoutSize.clear();
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
          .then((pdfPage) => readTextItems(pdfPage))
          .then((items) => {
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
     * Whether the text layer of the page has finished rendering, so that it
     * can show highlights. The text layer of a page is set before it renders,
     * its end of content element only once it has rendered.
     * @private
     */
    #isPageReady(page) {
      return Boolean(page?.textLayer && page.endOfContentElement);
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
     * Draws the highlights of the matches on a page under its text layer, and
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
          // The page renders again or is released meanwhile, `_renderPageLayers()` draws the highlights then.
          if (searchId !== this.#searchId || !this.#isPageReady(page)) {
            return;
          }

          const currentMatch = this.#getCurrentMatch();
          // The highlights need the text layer elements that the text was taken from.
          if (page.textLayer.textDivs.length === pageText.items.length) {
            const hasSize = page.renderFindLayer(
              matches.flatMap((match) =>
                getMatchParts(pageText, match).map((part) => ({ ...part, current: match === currentMatch })),
              ),
            );
            if (!hasSize) {
              // `_refreshLayout()` draws the highlights, and scrolls to the current match, once the page has a size.
              this.#pagesWithoutSize.add(page);
              return;
            }
          }

          if (this.#scrollToMatchPending && currentMatch.pageIndex === pageIndex) {
            this.#scrollToMatchPending = false;
            const currentElement = page.findLayerElement?.querySelector('.find-match.current');
            if (currentElement) {
              this.#scrollToMatch(page, currentElement);
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

    /**
     * Scrolls the match to the middle of the view on each axis where it is not
     * well inside the view, and makes its page the current page.
     * @private
     */
    #scrollToMatch(page, element) {
      const { content } = this.$;
      const view = content.getBoundingClientRect();
      const box = page.element.getBoundingClientRect();
      const match = element.getBoundingClientRect();
      // The view in CSS pixels from the top left corner of the page, without the scrollbar on the left in RTL.
      const viewTop = content.scrollTop - page.element.offsetTop;
      const viewLeft = view.left + content.clientLeft - box.left;
      const { clientHeight, clientWidth } = content;
      // Also scroll a match close to the top or bottom edge, where it is easy to miss.
      const margin = Math.min(64, clientHeight / 4);
      const top = getViewStart(match.top - box.top, match.height, viewTop, clientHeight, margin);
      const left = getViewStart(match.left - box.left, match.width, viewLeft, clientWidth);
      if (top !== viewTop || left !== viewLeft) {
        this._scrollToPage(page.pageNumber, { top, left });
      }
    }
  };
