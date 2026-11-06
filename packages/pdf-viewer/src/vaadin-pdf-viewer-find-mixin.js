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
import '@vaadin/text-field/src/vaadin-text-field.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import './vaadin-pdf-viewer-button.js';
import { html, nothing } from 'lit';
import { live } from 'lit/directives/live.js';
import { getDeepActiveElement, isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { slotContent } from '@vaadin/component-base/src/directives/slot-content.js';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { createPageText, findInText, getMatchParts, normalizeText, readTextItems } from './pdf-viewer-find.js';

/** The number of pages whose text is loaded at a time when searching. */
const SEARCH_BATCH = 10;

/** The space between the find bar and a match that would be under it otherwise, in pixels. */
const FIND_SPACE_GAP = 8;

/**
 * A mixin that finds text in the document: a button in the toolbar, a find
 * bar over the pages, and highlights of the matches on the rendered pages.
 */
export const PdfViewerFindMixin = (superClass) =>
  class PdfViewerFindMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Whether the button that opens the find bar is hidden from the
         * toolbar. While it is hidden, Ctrl+F or Cmd+F opens the find of the
         * browser. The `find()` method works also while it is hidden.
         *
         * @attr {boolean} find-button-hidden
         */
        findButtonHidden: {
          type: Boolean,
          value: false,
        },
      };
    }

    /** Whether the find bar is shown. */
    #opened = false;

    /** The text entered in the find field. */
    #query = '';

    /** Whether a search goes through the pages. */
    #searching = false;

    /** @type {Array<{ pageIndex: number, start: number, end: number }>} */
    #matches = [];

    /** The index of the current match, or -1. */
    #currentIndex = -1;

    /**
     * The index of the match to start from in the next search: the current
     * match when the find bar was closed, to continue from it when reopened,
     * or the first match for `find()`. Otherwise -1, to start from the first
     * match on or after the current page, as the find of browsers does.
     */
    #startMatchIndex = -1;

    /**
     * The text of each page for searching, by page index. Holds the promise
     * while the text loads.
     * @type {Map<number, Promise<{ pageText: import('./pdf-viewer-find.js').PageText, normalized: { text: string, offsets: number[] } }>>}
     */
    #pageTexts = new Map();

    /**
     * The text of the pages that have loaded, by page index, to select the
     * current match when the find bar closes.
     * @type {Map<number, import('./pdf-viewer-find.js').PageText>}
     */
    #loadedPageTexts = new Map();

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

    /**
     * The element that had focus when the find bar opened, to focus it again
     * when the find bar closes.
     * @type {HTMLElement | null}
     */
    #returnFocus = null;

    /** The space above the pages for a match that the find bar would cover otherwise. */
    #findSpace = 0;

    /** @protected */
    updated(props) {
      super.updated(props);

      // Drop the scroll to a match when the user goes to another page before the match is shown.
      if (props.has('page') && this.#scrollToMatchPending && this.page !== this.#getCurrentMatch().pageIndex + 1) {
        this.#scrollToMatchPending = false;
      }
    }

    /**
     * Opens the find bar with the given text, searches the document for it
     * and scrolls to the first match. The matches are highlighted on the
     * pages until the find bar closes, the next search, or until the document
     * unloads, e.g. on a new `src` or a detach. Fires `find-result` with the
     * number of matches. Focus stays where it is. While the document loads,
     * it runs once loaded. Does nothing without a document, or when the
     * viewer is not attached. Of several `find()` and `highlight()` calls in
     * a row, only the last one runs.
     *
     * @param {string} text
     */
    find(text) {
      this.#runWhenReady(() => {
        this.#query = String(text ?? '');
        this.#startMatchIndex = 0;
        this.#showFindBar();
        this.#search(this.#query);
      });
    }

    /**
     * Highlights every occurrence of the given text on the given page and
     * scrolls to the first one, for a passage that the application has
     * located. The next `highlight()` or `find()` clears it. A page that is
     * not a page number of the document logs a warning and also clears it.
     * It does not open the find bar, and clears the text of an open find
     * bar. While the document loads, it runs once loaded. Does nothing
     * without a document, or when the viewer is not attached. Of several
     * `find()` and `highlight()` calls in a row, only the last one runs.
     *
     * @param {number} page the page number, starting from 1
     * @param {string} text
     */
    highlight(page, text) {
      this.#runWhenReady(() => this.#highlight(page, text));
    }

    /**
     * Returns the template of the button that opens and closes the find bar,
     * in the `toolbar-find` slot.
     * @protected
     */
    _renderFindButton() {
      return html`
        <vaadin-pdf-viewer-button
          slot="toolbar-find"
          icon="find"
          theme="tertiary icon"
          aria-pressed="${this.#opened ? 'true' : 'false'}"
          ?hidden="${this.findButtonHidden}"
          .disabled="${!this.pageCount}"
          @click="${this.#onFindButtonClick}"
        >
          <vaadin-tooltip slot="tooltip" .text="${this.__effectiveI18n.find}"></vaadin-tooltip>
        </vaadin-pdf-viewer-button>
      `;
    }

    /**
     * Returns the template of the find bar over the pages. Its controls are
     * rendered into the light DOM while it is open.
     * @protected
     */
    _renderFindBar() {
      const i18n = this.__effectiveI18n;
      return html`
        <div part="find-bar" role="search" aria-label="${i18n.find}" ?hidden="${!this.#opened}">
          <slot name="find-field" ${slotContent(this.#opened ? this.#renderFindField() : nothing)}></slot>
          <div class="find-buttons">
            <slot name="find-buttons" ${slotContent(this.#opened ? this.#renderFindBarButtons() : nothing)}></slot>
          </div>
        </div>
      `;
    }

    /** @private */
    #renderFindField() {
      const i18n = this.__effectiveI18n;
      const count = this.#matches.length;
      let result = count
        ? i18n.findResult.replace('{current}', this.#currentIndex + 1).replace('{total}', count)
        : i18n.findNoMatches;
      // Show no result until the search has gone through all pages.
      if (this.#searching || !this.#query.trim()) {
        result = '';
      }
      return html`
        <vaadin-text-field
          slot="find-field"
          accessible-name="${i18n.find}"
          placeholder="${i18n.find}"
          .value="${live(this.#query)}"
          @input="${this.#onFindInput}"
          @change="${this.#onFindChange}"
          @keydown="${this.#onFindFieldKeyDown}"
        >
          <span slot="suffix" dir="auto">${result}</span>
        </vaadin-text-field>
      `;
    }

    /** @private */
    #renderFindBarButtons() {
      const i18n = this.__effectiveI18n;
      const hasMatches = this.#matches.length > 0;
      return html`
        <vaadin-pdf-viewer-button
          slot="find-buttons"
          icon="previous-match"
          theme="tertiary icon"
          .disabled="${!hasMatches}"
          @click="${this.#onPreviousMatchClick}"
          @keydown="${this.#onFindBarKeyDown}"
        >
          <vaadin-tooltip slot="tooltip" .text="${i18n.previousMatch}"></vaadin-tooltip>
        </vaadin-pdf-viewer-button>
        <vaadin-pdf-viewer-button
          slot="find-buttons"
          icon="next-match"
          theme="tertiary icon"
          .disabled="${!hasMatches}"
          @click="${this.#onNextMatchClick}"
          @keydown="${this.#onFindBarKeyDown}"
        >
          <vaadin-tooltip slot="tooltip" .text="${i18n.nextMatch}"></vaadin-tooltip>
        </vaadin-pdf-viewer-button>
        <vaadin-pdf-viewer-button
          slot="find-buttons"
          icon="close"
          theme="tertiary icon"
          @click="${this.#onCloseClick}"
          @keydown="${this.#onFindBarKeyDown}"
        >
          <vaadin-tooltip slot="tooltip" .text="${i18n.closeFind}"></vaadin-tooltip>
        </vaadin-pdf-viewer-button>
      `;
    }

    /**
     * Override method from `KeyboardMixin` to add the keyboard shortcuts of
     * the find of browsers: Ctrl+F or Cmd+F opens the find bar, and while it
     * is open, Ctrl+G or Cmd+G and F3 go to the next match, with Shift to the
     * previous one.
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      const isShortcut = (event.ctrlKey || event.metaKey) && !event.altKey;
      // The key code is for keyboard layouts without Latin letters.
      const isLatinLetter = /^[a-z]$/iu.test(event.key);
      const isKey = (letter) =>
        event.key.toLowerCase() === letter || (!isLatinLetter && event.code === `Key${letter.toUpperCase()}`);
      if (isShortcut && !event.shiftKey && isKey('f') && this.pageCount > 0 && !this.findButtonHidden) {
        event.preventDefault();
        this.#openFind();
      } else if (this.#opened && ((isShortcut && isKey('g')) || event.key === 'F3')) {
        event.preventDefault();
        this.#findNext(event.shiftKey ? -1 : 1);
      }
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
     * Override method from `PdfViewerScrollMixin` to place the find bar next
     * to the scrollbar, and to highlight the matches on the pages that had no
     * size, once they have one.
     * @protected
     * @override
     */
    _refreshLayout() {
      super._refreshLayout();

      if (this.#opened) {
        this.#updateScrollbarWidth();
      }

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
      this.#loadedPageTexts.clear();
      this.#resetSearch();
      this.#setFindSpace(0);
    }

    /**
     * Override method from `PdfViewerDocumentMixin` to search a new document
     * for the text of the open find bar.
     * @protected
     * @override
     */
    _documentLoaded(details) {
      super._documentLoaded(details);

      // Once the document is ready, unless `find()` or `highlight()` has searched it meanwhile.
      const searchId = this.#searchId;
      this._whenDocumentReady().then((pdfDocument) => {
        if (pdfDocument && searchId === this.#searchId && this.#opened && this.#query.trim()) {
          this.#search(this.#query);
        }
      });
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
      // The find bar shows no text for the highlighted matches.
      this.#query = '';
      if (Number.isInteger(page) && page >= 1 && page <= this.pageCount) {
        this.#startMatchIndex = 0;
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
     * Shows the find bar. Focus stays where it is.
     * @private
     */
    #showFindBar() {
      if (this.#opened) {
        return;
      }
      let active = this.getRootNode().activeElement;
      // Focus inside the shadow root shows as the host in the active element of the root.
      if (active === this) {
        active = this.shadowRoot.activeElement;
      }
      this.#returnFocus = active && (this.contains(active) || this.shadowRoot.contains(active)) ? active : null;
      this.#opened = true;
      this.#updateScrollbarWidth();
      this.requestUpdate();
    }

    /**
     * Opens the find bar and focuses the find field.
     * @private
     */
    #openFind() {
      if (!this.#opened) {
        this.#showFindBar();
        // Show the results of the text entered before the find bar closed.
        if (this.#query.trim()) {
          this.#search(this.#query);
        }
      }
      this.updateComplete.then(() => {
        const field = this.querySelector(':scope > vaadin-text-field[slot="find-field"]');
        if (field) {
          field.focus({ focusVisible: isKeyboardActive() });
          field.inputElement.select();
        }
      });
    }

    /**
     * Closes the find bar, removes the highlights, and returns focus to where
     * it was before the find bar opened.
     * @private
     */
    #closeFind() {
      if (!this.#opened) {
        return;
      }
      this.#opened = false;
      this.#setFindSpace(0);
      this.#startMatchIndex = this.#currentIndex;
      const matchSelection = this.#getCurrentMatchRange();
      this.#resetSearch();
      this.#highlightPages();
      this.requestUpdate();

      // Return focus to where it was, or to the pages when that element cannot
      // take focus anymore, e.g. a link on a page that was released meanwhile,
      // or a button that was disabled when going to a match.
      const returnFocus = this.#returnFocus;
      this.#returnFocus = null;
      if (returnFocus && returnFocus.isConnected && !returnFocus.disabled && returnFocus.checkVisibility()) {
        returnFocus.focus({ focusVisible: isKeyboardActive() });
      }
      if (this.pageCount && (!returnFocus || getDeepActiveElement() !== returnFocus)) {
        this.$.content.focus({ focusVisible: isKeyboardActive() });
      }

      // Select the current match, so that reading with a screen reader or caret
      // browsing continues from it, as with the find of browsers. After moving
      // focus, as focusing a field clears the selection.
      if (matchSelection) {
        window.getSelection().setBaseAndExtent(...matchSelection);
      }
    }

    /**
     * Returns the start node and offset and the end node and offset of the
     * current match in the text layer, or null.
     * @private
     */
    #getCurrentMatchRange() {
      const match = this.#getCurrentMatch();
      const page = match && this.__pages[match.pageIndex];
      const pageText = match && this.#loadedPageTexts.get(match.pageIndex);
      if (!pageText || !this.#isPageReady(page)) {
        return null;
      }
      const parts = getMatchParts(pageText, match);
      const { textDivs } = page.textLayer;
      // The text must be the one of the text layer elements.
      if (!parts.length || textDivs.length !== pageText.items.length) {
        return null;
      }
      const first = parts[0];
      const last = parts.at(-1);
      const startNode = textDivs[first.itemIndex].firstChild;
      const endNode = textDivs[last.itemIndex].firstChild;
      const isValid = startNode && endNode && first.start <= startNode.length && last.end <= endNode.length;
      return isValid ? [startNode, first.start, endNode, last.end] : null;
    }

    /**
     * Goes to the next or the previous match.
     * @param {1 | -1} direction
     * @private
     */
    #findNext(direction) {
      const count = this.#matches.length;
      if (!count) {
        return;
      }
      this.#currentIndex = (this.#currentIndex + direction + count) % count;
      this.requestUpdate();
      this.#showCurrentMatch();
    }

    /**
     * Drops the results and stops a running search.
     * @private
     */
    #resetSearch() {
      this.#searchId += 1;
      this.#matches = [];
      this.#currentIndex = -1;
      this.#searching = false;
      this.#scrollToMatchPending = false;
      this.#pagesWithoutSize.clear();
      this.requestUpdate();
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
        this.#searching = true;
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
      this.#searching = false;
      // Start from the match of `#startMatchIndex`, or from the first match on or after the current page.
      const startIndex = this.#startMatchIndex;
      this.#startMatchIndex = -1;
      const index =
        startIndex >= 0 && startIndex < matches.length
          ? startIndex
          : matches.findIndex((match) => match.pageIndex >= this.page - 1);
      this.#currentIndex = matches.length ? Math.max(index, 0) : -1;
      // The update that `#resetSearch()` requested may have run while the pages were searched.
      this.requestUpdate();

      if (matches.length) {
        this.#showCurrentMatch();
      } else {
        // Clears the highlights of a previous search.
        this.#highlightPages();
      }

      if (!pageNumber) {
        this.dispatchEvent(new CustomEvent('find-result', { detail: { query, matchCount: matches.length } }));
      }
    }

    /**
     * Highlights the matches with the current one, and scrolls to the current
     * match, after going to its page when the page is not rendered.
     * @private
     */
    #showCurrentMatch() {
      this.#scrollToMatchPending = true;
      // Also clears the highlights of a previous search on other pages.
      this.#highlightPages();

      // Go to the page of the match, which scrolls to the match once the page has rendered.
      const match = this.#getCurrentMatch();
      if (!this.#isPageReady(this.__pages[match.pageIndex])) {
        this._scrollToPage(match.pageIndex + 1);
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
            if (this._pdfDocument === pdfDocument) {
              this.#loadedPageTexts.set(pageIndex, pageText);
            }
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
              this.#scrollToMatch(currentElement);
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
     * Scrolls the pages so that the match is not covered by the find bar.
     * @private
     */
    #scrollToMatch(element) {
      const { content } = this.$;
      const contentTop = content.getBoundingClientRect().top;
      const findBar = this.shadowRoot.querySelector('[part="find-bar"]');
      const topInset = this.#opened ? Math.max(findBar.getBoundingClientRect().bottom - contentTop, 0) : 0;

      // A match at the top of the first page cannot be scrolled out from under
      // the find bar. Add space above the pages for it, until the find bar closes.
      const matchTop = element.getBoundingClientRect().top - contentTop + content.scrollTop - this.#findSpace;
      const space = Math.ceil(topInset + FIND_SPACE_GAP - matchTop);
      if (topInset && space > this.#findSpace) {
        this.#setFindSpace(space);
      }

      this._scrollRectIntoView(element.getBoundingClientRect(), { topInset });
    }

    /** @private */
    #setFindSpace(space) {
      const { content } = this.$;
      const removed = this.#findSpace - space;
      const { scrollTop } = content;
      this.#findSpace = space;
      if (space) {
        content.style.setProperty('--_find-space', `${space}px`);
      } else {
        content.style.removeProperty('--_find-space');
      }
      // Keep the visible pages in place when the space is removed while scrolled down.
      if (removed > 0 && scrollTop >= removed) {
        content.scrollTop = scrollTop - removed;
      }
    }

    /**
     * Places the find bar next to the scrollbar of the pages, which has no
     * width with overlay scrollbars.
     * @private
     */
    #updateScrollbarWidth() {
      const { content } = this.$;
      const findBar = this.shadowRoot.querySelector('[part="find-bar"]');
      findBar.style.setProperty('--_scrollbar-width', `${content.offsetWidth - content.clientWidth}px`);
    }

    /** @private */
    #onFindButtonClick() {
      if (this.#opened) {
        this.#closeFind();
      } else {
        this.#openFind();
      }
    }

    /** @private */
    #onFindInput(event) {
      // The input is internal to the viewer.
      event.stopPropagation();
      this.#query = event.target.value;
      this.#startMatchIndex = -1;
      this.#search(this.#query);
    }

    /** @private */
    #onFindChange(event) {
      event.stopPropagation();
    }

    /** @private */
    #onFindFieldKeyDown(event) {
      if (event.key === 'Enter') {
        // Don't submit a form that contains the viewer.
        event.preventDefault();
        this.#findNext(event.shiftKey ? -1 : 1);
      } else {
        this.#onFindBarKeyDown(event);
      }
    }

    /**
     * Closes the find bar with Escape, unless something else handled it
     * already. Prevents the default, so that a dialog that contains the
     * viewer stays open.
     * @private
     */
    #onFindBarKeyDown(event) {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault();
        this.#closeFind();
      }
    }

    /** @private */
    #onPreviousMatchClick() {
      this.#findNext(-1);
    }

    /** @private */
    #onNextMatchClick() {
      this.#findNext(1);
    }

    /** @private */
    #onCloseClick() {
      this.#closeFind();
    }
  };
