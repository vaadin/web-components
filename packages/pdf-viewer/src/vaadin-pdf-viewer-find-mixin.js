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
import { html, nothing } from 'lit';
import { live } from 'lit/directives/live.js';
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { getDeepActiveElement, isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { createPageText, findInText, getMatchParts, normalizeText } from './pdf-viewer-find.js';
import { renderButtonTooltip, stopPropagation } from './vaadin-pdf-viewer-button.js';

/** The number of pages whose text is loaded at a time when searching. */
const SEARCH_BATCH = 10;

/** The space between the find bar and a match that would be under it otherwise, in pixels. */
const FIND_SPACE_GAP = 8;

/** The delay of announcing the result while typing, so that not every keystroke is announced. */
const ANNOUNCE_DELAY = 500;

/**
 * Adds finding text to the PDF viewer: a button in the toolbar, a find bar
 * over the pages, and highlights of the matches on the pages.
 *
 * @polymerMixin
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
     * The text of each page for searching, by page index. Holds the promise
     * while the text loads.
     * @type {Map<number, Promise<{ pageText: import('./pdf-viewer-find.js').PageText, normalized: { text: string, offsets: number[] } }>>}
     */
    #pageTexts = new Map();

    /** The text of the pages that have loaded, by page index. */
    #loadedPageTexts = new Map();

    /** Incremented on every search, to drop results of an outdated search. */
    #searchId = 0;

    /**
     * Set when to scroll to the current match once it is highlighted, and whether to scroll smoothly.
     * @type {{ smooth: boolean } | null}
     */
    #scrollToMatchPending = null;

    /** @type {HTMLElement | null} */
    #returnFocus = null;

    /** @type {Debouncer | null} */
    #announceDebouncer = null;

    #lastAnnouncement = '';

    /** The space above the pages for a match that the find bar would cover otherwise. */
    #findSpace = 0;

    /**
     * The index of the match to start from in the next search: the current
     * match when the find bar was closed, to continue from it when reopened,
     * or the first match for `find()`. Otherwise -1, to start from the first
     * match on or after the current page.
     */
    #startMatchIndex = -1;

    /**
     * A `find()` or `highlight()` call that waits for the document to load.
     * @type {(() => void) | null}
     */
    #pendingCall = null;

    /** The `src` of the last update. A different `src` starts loading in the next update. */
    #updatedSrc;

    /**
     * Override method from `LitElement` to add the keyboard shortcuts of
     * browser find: Ctrl+F or Cmd+F opens the find bar, and while it is open,
     * Ctrl+G or Cmd+G and F3 go to the next match, with Shift to the previous one.
     * @protected
     * @override
     */
    firstUpdated() {
      super.firstUpdated();

      this.addEventListener('keydown', (event) => this.#onKeyDown(event));
    }

    /**
     * Override method from `LitElement` to run a `find()` or `highlight()`
     * call once the document has loaded, and to search a newly loaded
     * document for the entered text.
     * @protected
     * @override
     */
    updated(props) {
      super.updated(props);

      if (props.has('src')) {
        this.#updatedSrc = this.src;
      }

      if (this.#pendingCall && !this._loading) {
        const call = this.#pendingCall;
        this.#pendingCall = null;
        call();
      } else if (props.has('pageCount') && this.pageCount > 0 && this.#opened && this.#query) {
        this.#search();
      }
    }

    /**
     * Opens the find bar with the given text, searches the document for it
     * and scrolls to the first match. Fires `find-result` with the number of
     * matches. While the document loads, it runs once loaded. Does nothing
     * without a document, or when the viewer is not attached.
     *
     * @param {string} text
     */
    find(text) {
      if (this.isConnected) {
        this.#runAfterLoad(() => this.#find(text));
      }
    }

    /**
     * Highlights the given text on the given page and scrolls to it, for
     * a passage that the application has located. The next `highlight()` or
     * `find()` clears it. While the document loads, it runs once loaded.
     * Does nothing without a document, or when the viewer is not attached.
     *
     * @param {number} page the page number, starting from 1
     * @param {string} text the text to highlight
     */
    highlight(page, text) {
      if (this.isConnected) {
        this.#runAfterLoad(() => this.#highlight(page, text));
      }
    }

    /**
     * Override method from `PdfViewerMixin` to keep the find bar next to the
     * scrollbar of the pages.
     * @protected
     * @override
     */
    _onResize() {
      super._onResize();

      if (this.#opened) {
        this.#updateScrollbarWidth();
      }
    }

    /**
     * Override method from `PdfViewerMixin` to highlight the matches on a
     * page once it is rendered.
     * @protected
     * @override
     */
    _pageRendered(page) {
      super._pageRendered(page);
      this.#highlightPage(page);
    }

    /**
     * Override method from `PdfViewerMixin` to forget the text and the
     * matches of the previous document.
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
     * Returns the template of the find bar, which shows the controls of
     * `_renderFindControls()` in its slots.
     * @protected
     */
    _renderFindBar() {
      return html`
        <div part="find-bar" role="search" aria-label="${this.__effectiveI18n.find}" ?hidden="${!this.#opened}">
          <slot name="find"></slot>
          <div class="find-actions"><slot name="find-actions"></slot></div>
        </div>
      `;
    }

    /**
     * Returns the template of the find button and the controls of the find
     * bar, which are rendered into the light DOM.
     * @protected
     */
    _renderFindControls() {
      const i18n = this.__effectiveI18n;
      return html`${this.#renderFindButton(i18n)}${this.#renderFindBarControls(i18n)}`;
    }

    /**
     * Renders the button that opens and closes the find bar, unless it is hidden.
     * @private
     */
    #renderFindButton(i18n) {
      if (this.findButtonHidden) {
        return nothing;
      }
      return html`
        <vaadin-pdf-viewer-button
          slot="find-button"
          icon="find"
          theme="tertiary icon"
          aria-label="${i18n.find}"
          aria-pressed="${this.#opened ? 'true' : 'false'}"
          .disabled="${!this.pageCount}"
          @click="${this.#onFindButtonClick}"
        >
          ${renderButtonTooltip(i18n.find)}
        </vaadin-pdf-viewer-button>
      `;
    }

    /** @private */
    #renderFindBarControls(i18n) {
      if (!this.#opened) {
        return nothing;
      }
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
          slot="find"
          accessible-name="${i18n.find}"
          placeholder="${i18n.find}"
          .value="${live(this.#query)}"
          @input="${this.#onFindInput}"
          @change="${stopPropagation}"
          @keydown="${this.#onFindFieldKeyDown}"
        >
          <span slot="suffix" dir="auto" aria-hidden="true" style="white-space: nowrap">${result}</span>
        </vaadin-text-field>
        <vaadin-pdf-viewer-button
          slot="find-actions"
          icon="previous-match"
          theme="tertiary icon"
          aria-label="${i18n.previousMatch}"
          .disabled="${count === 0}"
          @click="${this.#onPreviousMatchClick}"
          @keydown="${this.#onFindBarKeyDown}"
        >
          ${renderButtonTooltip(i18n.previousMatch)}
        </vaadin-pdf-viewer-button>
        <vaadin-pdf-viewer-button
          slot="find-actions"
          icon="next-match"
          theme="tertiary icon"
          aria-label="${i18n.nextMatch}"
          .disabled="${count === 0}"
          @click="${this.#onNextMatchClick}"
          @keydown="${this.#onFindBarKeyDown}"
        >
          ${renderButtonTooltip(i18n.nextMatch)}
        </vaadin-pdf-viewer-button>
        <vaadin-pdf-viewer-button
          slot="find-actions"
          icon="close"
          theme="tertiary icon"
          aria-label="${i18n.closeFind}"
          @click="${this.#onCloseClick}"
          @keydown="${this.#onFindBarKeyDown}"
        >
          ${renderButtonTooltip(i18n.closeFind)}
        </vaadin-pdf-viewer-button>
      `;
    }

    /**
     * Runs a method call now, or once the document has loaded while it loads.
     * @private
     */
    #runAfterLoad(callback) {
      if (this._loading || this.src !== this.#updatedSrc) {
        this.#pendingCall = callback;
      } else {
        callback();
      }
    }

    /** @private */
    #find(text) {
      if (!this._pdfDocument || !this.isConnected) {
        return;
      }
      this.#query = String(text ?? '');
      this.#startMatchIndex = 0;
      if (!this.#opened) {
        this.#showFindBar();
      }
      this.#search();
    }

    /** @private */
    #highlight(page, text) {
      if (!this._pdfDocument) {
        return;
      }
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
      let active = this.getRootNode().activeElement;
      // Focus inside the shadow root shows as the host in the root's active element.
      if (active === this) {
        active = this.shadowRoot.activeElement;
      }
      this.#returnFocus = active && (this.contains(active) || this.shadowRoot.contains(active)) ? active : null;
      this.#opened = true;
      // Announce the results again, also when they did not change since the find bar was closed.
      this.#lastAnnouncement = '';
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
        // Show the results of the query entered before closing the find bar.
        if (this.#query.trim()) {
          this.#search();
        }
      }
      this.updateComplete.then(() => {
        const field = this.querySelector(':scope > vaadin-text-field[slot="find"]');
        if (field) {
          field.focus({ focusVisible: isKeyboardActive() });
          field.inputElement.select();
        }
      });
    }

    /**
     * Closes the find bar, removes the highlights, and returns focus to where
     * it was before opening the find bar.
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
      // browsing continues from it, like with the find of browsers. After moving
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
      const match = this.#matches[this.#currentIndex];
      const page = match && this._getPageView(match.pageIndex + 1);
      const pageText = match && this.#loadedPageTexts.get(match.pageIndex);
      if (!page || !page.textLayer || !pageText) {
        return null;
      }
      const parts = getMatchParts(pageText, match);
      const { textDivs } = page.textLayer;
      // The text must be the one of the text layer elements.
      if (!parts.length || textDivs.length !== pageText.items.length) {
        return null;
      }
      const first = parts[0];
      const last = parts[parts.length - 1];
      const startNode = textDivs[first.itemIndex].firstChild;
      const endNode = textDivs[last.itemIndex].firstChild;
      const isValid = startNode && endNode && first.start <= startNode.length && last.end <= endNode.length;
      return isValid ? [startNode, first.start, endNode, last.end] : null;
    }

    /**
     * Goes to the next or the previous match, and announces it.
     * @param {1 | -1} direction
     * @private
     */
    #findNext(direction) {
      const count = this.#matches.length;
      if (!count) {
        if (this.#query.trim() && !this.#searching) {
          this.#announce(this.__effectiveI18n.findNoMatches);
        }
        return;
      }
      const previous = this.#matches[this.#currentIndex];
      this.#currentIndex = (this.#currentIndex + direction + count) % count;
      this.requestUpdate();
      this.#announceCurrentMatch();
      this.#showCurrentMatch(previous);
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
      this.#scrollToMatchPending = null;
      this.#announceDebouncer?.cancel();
      this.requestUpdate();
    }

    /**
     * Announces a find result. Results while typing are announced after a
     * delay, and only when they differ from the previous announcement.
     * @private
     */
    #announce(text, { delayed = false } = {}) {
      this.#announceDebouncer?.cancel();
      if (!delayed) {
        this.#lastAnnouncement = text;
        announce(text);
        return;
      }
      this.#announceDebouncer = Debouncer.debounce(this.#announceDebouncer, timeOut.after(ANNOUNCE_DELAY), () => {
        if (text !== this.#lastAnnouncement) {
          this.#lastAnnouncement = text;
          announce(text);
        }
      });
    }

    /** @private */
    #announceCurrentMatch({ delayed = false } = {}) {
      const match = this.#matches[this.#currentIndex];
      this.#announce(
        this.__effectiveI18n.findResultAnnouncement
          .replace('{current}', this.#currentIndex + 1)
          .replace('{total}', this.#matches.length)
          .replace('{page}', match.pageIndex + 1),
        { delayed },
      );
    }

    /**
     * Searches the document, or one page of it, for the text, and shows
     * the first match. A search of the whole document is the one of the find
     * bar, which announces its result and fires `find-result`.
     * @param {string} [query]
     * @param {number} [pageNumber] the page to search, or 0 for all pages
     * @private
     */
    #search(query = this.#query, pageNumber = 0) {
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
      // Start from the match of `#startMatchIndex`, or from the first match on
      // or after the current page.
      const startIndex = this.#startMatchIndex;
      this.#startMatchIndex = -1;
      const index =
        startIndex >= 0 && startIndex < matches.length
          ? startIndex
          : matches.findIndex((match) => match.pageIndex >= this.page - 1);
      this.#currentIndex = matches.length ? Math.max(index, 0) : -1;
      // The update that `#resetSearch()` requested may have run while the pages were searched.
      this.requestUpdate();
      // Also clears the highlights of a previous search on other pages.
      this.#highlightPages();

      const isFind = !pageNumber;
      if (isFind) {
        this.dispatchEvent(new CustomEvent('find-result', { detail: { query, matchCount: matches.length } }));
      }
      if (matches.length) {
        if (isFind) {
          this.#announceCurrentMatch({ delayed: true });
        }
        this.#showCurrentMatch(null);
      } else if (isFind && query.trim()) {
        this.#announce(this.__effectiveI18n.findNoMatches, { delayed: true });
      }
    }

    /**
     * Returns the text of a page for searching, loading it when needed.
     * @private
     */
    #getPageText(pageIndex) {
      if (!this.#pageTexts.has(pageIndex)) {
        const pdfDocument = this._pdfDocument;
        const promise = this._getTextContent(pageIndex + 1)
          .then(({ items }) => {
            // The marked content items have no text and are skipped by `createPageText()`.
            const pageText = createPageText(items);
            // Text of a document that was unloaded meanwhile must not mix with the text of the current one.
            if (this._pdfDocument === pdfDocument) {
              this.#loadedPageTexts.set(pageIndex, pageText);
            }
            return { pageText, normalized: normalizeText(pageText.text) };
          })
          .catch((error) => {
            // Loading the text fails when the document is unloaded meanwhile.
            if (this._pdfDocument === pdfDocument) {
              issueWarning(`Failed to load the text of page ${pageIndex + 1} of the PDF document: ${error.message}`);
            }
            const pageText = createPageText([]);
            return { pageText, normalized: normalizeText('') };
          });
        this.#pageTexts.set(pageIndex, promise);
      }
      return this.#pageTexts.get(pageIndex);
    }

    /**
     * Scrolls to the current match: smoothly when its page is rendered, or
     * after going to the page when it is not.
     * @param {{ pageIndex: number } | null} previousMatch the previously current match, to update its highlight
     * @private
     */
    #showCurrentMatch(previousMatch) {
      const match = this.#matches[this.#currentIndex];
      const page = this._getPageView(match.pageIndex + 1);
      const isRendered = Boolean(page && page.textLayer);
      this.#scrollToMatchPending = { smooth: isRendered };
      this.#highlightPages(previousMatch ? [previousMatch, match] : [match]);
      if (!isRendered) {
        this.page = match.pageIndex + 1;
      }
    }

    /**
     * Scrolls the pages so that the match is not covered by the find bar.
     * @private
     */
    #scrollToMatch(element, { smooth }) {
      const { content } = this.$;
      const findBar = this.shadowRoot.querySelector('[part="find-bar"]');
      const contentTop = content.getBoundingClientRect().top;
      const topInset = this.#opened ? Math.max(findBar.getBoundingClientRect().bottom - contentTop, 0) : 0;

      // A match at the top of the first page cannot be scrolled out from under
      // the find bar. Add space above the pages for it, until the find bar closes.
      const matchTop = element.getBoundingClientRect().top - contentTop + content.scrollTop - this.#findSpace;
      const space = Math.ceil(topInset + FIND_SPACE_GAP - matchTop);
      if (topInset && space > this.#findSpace) {
        this.#setFindSpace(space);
      }

      this._scrollRectIntoView(element.getBoundingClientRect(), { topInset, smooth });
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

    /**
     * Updates the highlights of the rendered pages that have the given
     * matches, or of all rendered pages.
     * @param {Array<{ pageIndex: number }>} [matches]
     * @private
     */
    #highlightPages(matches) {
      const pageIndexes = matches
        ? new Set(matches.map((match) => match.pageIndex))
        : Array.from({ length: this.pageCount }, (_, index) => index);
      pageIndexes.forEach((pageIndex) => {
        const page = this._getPageView(pageIndex + 1);
        if (page && page.textLayer) {
          this.#highlightPage(page);
        }
      });
    }

    /**
     * Draws the highlights of the matches on a page over its text layer.
     * @private
     */
    #highlightPage(page) {
      page.clearFindLayer();

      const pageIndex = page.pageNumber - 1;
      const matches = this.#matches.filter((match) => match.pageIndex === pageIndex);
      if (!matches.length || !page.textLayer) {
        return;
      }

      const searchId = this.#searchId;
      this.#getPageText(pageIndex)
        .then(({ pageText }) => {
          // The highlights need the text layer elements that the text was taken from.
          const textDivs = page.textLayer ? page.textLayer.textDivs : [];
          if (searchId !== this.#searchId) {
            return;
          }
          if (textDivs.length !== pageText.items.length) {
            // Without highlights, go at least to the page of the current match.
            this.#goToPendingMatchPage(pageIndex);
            return;
          }

          const currentMatch = this.#matches[this.#currentIndex];
          page.renderFindLayer(
            matches.flatMap((match) =>
              getMatchParts(pageText, match).map((part) => ({ ...part, current: match === currentMatch })),
            ),
          );

          const scrollToMatch = this.#scrollToMatchPending;
          if (scrollToMatch && currentMatch && currentMatch.pageIndex === pageIndex) {
            this.#scrollToMatchPending = null;
            const currentElement = page.findLayerElement && page.findLayerElement.querySelector('.find-match.current');
            if (currentElement) {
              this.#scrollToMatch(currentElement, scrollToMatch);
            } else {
              this.page = pageIndex + 1;
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
     * Goes to the page of the current match when scrolling to it is pending
     * but the match cannot be highlighted on the page.
     * @private
     */
    #goToPendingMatchPage(pageIndex) {
      const currentMatch = this.#matches[this.#currentIndex];
      if (this.#scrollToMatchPending && currentMatch && currentMatch.pageIndex === pageIndex) {
        this.#scrollToMatchPending = null;
        this.page = pageIndex + 1;
      }
    }

    /** @private */
    #onKeyDown(event) {
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
      this.#search();
    }

    /** @private */
    #onFindFieldKeyDown(event) {
      if (event.key === 'Enter') {
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
