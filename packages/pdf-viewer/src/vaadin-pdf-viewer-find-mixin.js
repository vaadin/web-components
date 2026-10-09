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
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { getDeepActiveElement, isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { createPageText, findInText, getMatchParts, normalizeText } from './pdf-viewer-find.js';

/** The number of pages whose text is loaded at a time when searching. */
const SEARCH_BATCH = 10;

/** The delay of announcing the result while typing, so that not every keystroke is announced. */
const ANNOUNCE_DELAY = 500;

/**
 * Finds text in the document and highlights the matches. The find bar itself
 * is rendered by the toolbar.
 *
 * @polymerMixin
 */
export const PdfViewerFindMixin = (superClass) =>
  class PdfViewerFindMixinClass extends superClass {
    static get properties() {
      return {
        /** @private */
        __findOpened: {
          type: Boolean,
          value: false,
          attribute: false,
        },

        /** @private */
        __findQuery: {
          type: String,
          value: '',
          attribute: false,
        },

        /** @private */
        __findMatchCount: {
          type: Number,
          value: 0,
          attribute: false,
        },

        /** @private */
        __findSearching: {
          type: Boolean,
          value: false,
          attribute: false,
        },

        /** @private */
        __findCurrentIndex: {
          type: Number,
          value: -1,
          attribute: false,
        },
      };
    }

    /**
     * The text of each page for searching, by page index. Holds the promise
     * while the text loads.
     * @type {Map<number, Promise<{ pageText: import('./pdf-viewer-find.js').PageText, normalized: { text: string, offsets: number[] } }>>}
     */
    #pageTexts = new Map();

    /** @type {Array<{ pageIndex: number, start: number, end: number }>} */
    #matches = [];

    /** The text of the pages that have loaded, by page index. */
    #loadedPageTexts = new Map();

    /** Incremented on every search, to drop results of an outdated search. */
    #searchId = 0;

    /** Whether to scroll to the current match once its page is rendered. */
    #scrollToMatchPending = false;

    /** @type {HTMLElement | null} */
    #returnFocus = null;

    /** @type {Debouncer | null} */
    #announceDebouncer = null;

    #lastAnnouncement = '';

    /** The current match when the find bar was closed, to continue from it when reopened. */
    #closedMatchIndex = -1;

    /**
     * Override method from `LitElement` to open the find bar with Ctrl+F or Cmd+F.
     * @protected
     * @override
     */
    firstUpdated() {
      super.firstUpdated();

      this.addEventListener('keydown', (event) => {
        const isShortcut = (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey;
        // The key code is for keyboard layouts without Latin letters.
        const isLatinLetter = /^[a-z]$/iu.test(event.key);
        const isF = event.key.toLowerCase() === 'f' || (!isLatinLetter && event.code === 'KeyF');
        if (isShortcut && isF && this.pageCount > 0) {
          event.preventDefault();
          this._openFind(); // NOSONAR
        }
      });
    }

    /**
     * Override method from `LitElement` to search a newly loaded document for the entered text.
     * @protected
     * @override
     */
    updated(props) {
      super.updated(props);

      // Search a newly loaded document for the query that is still entered.
      if (props.has('pageCount') && this.pageCount > 0 && this.__findOpened && this.__findQuery) {
        this.#search(); // NOSONAR
      }
    }

    /**
     * Opens the find bar and focuses the find field.
     * @protected
     */
    async _openFind() {
      if (!this.__findOpened) {
        let active = this.getRootNode().activeElement;
        // Focus inside the shadow root shows as the host in the root's active element.
        if (active === this) {
          active = this.shadowRoot.activeElement;
        }
        this.#returnFocus = active && (this.contains(active) || this.shadowRoot.contains(active)) ? active : null;
        // Show and announce the results of the query entered before closing the find bar.
        this.#lastAnnouncement = '';
        if (this.__findQuery.trim()) {
          this.#search(); // NOSONAR
        }
      }
      this.__findOpened = true;
      await this.updateComplete;
      const field = this._getFindField();
      if (field) {
        field.focus({ focusVisible: isKeyboardActive() });
        field.inputElement.select();
      }
    }

    /**
     * Closes the find bar, removes the highlights, and returns focus to where
     * it was before opening the find bar.
     * @protected
     */
    _closeFind() {
      if (!this.__findOpened) {
        return;
      }
      this.__findOpened = false;
      this.#closedMatchIndex = this.__findCurrentIndex;
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
      const match = this.#matches[this.__findCurrentIndex];
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
     * Returns the find field, rendered by the toolbar.
     * @return {HTMLElement | null}
     * @protected
     */
    _getFindField() {
      return null;
    }

    /**
     * Sets the text to find, and searches the document for it.
     * @param {string} query
     * @protected
     */
    _setFindQuery(query) {
      this.__findQuery = query;
      this.#closedMatchIndex = -1;
      this.#search(); // NOSONAR
    }

    /**
     * Goes to the next or the previous match.
     * @param {1 | -1} direction
     * @protected
     */
    _findNext(direction) {
      const count = this.#matches.length;
      if (!count) {
        if (this.__findQuery.trim() && !this.__findSearching) {
          this.#announce(this.__effectiveI18n.findNoMatches);
        }
        return;
      }
      const previous = this.#matches[this.__findCurrentIndex];
      this.__findCurrentIndex = (this.__findCurrentIndex + direction + count) % count;
      this.#showCurrentMatch(previous);
    }

    /**
     * Override method from `PdfViewerMixin` to highlight the matches on a
     * page once it is rendered.
     * @protected
     * @override
     */
    _pageRendered(page) {
      super._pageRendered(page);
      this.#highlightPage(page); // NOSONAR
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
    }

    /**
     * Drops the results and stops a running search.
     * @private
     */
    #resetSearch() {
      this.#searchId += 1;
      this.#matches = [];
      this.__findMatchCount = 0;
      this.__findCurrentIndex = -1;
      this.__findSearching = false;
      this.#scrollToMatchPending = false;
      this.#announceDebouncer?.cancel();
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
    async #search() {
      this.#resetSearch();
      const searchId = this.#searchId;
      const query = this.__findQuery;
      const pageCount = this.pageCount;
      const matches = [];

      if (query.trim() && this._pdfDocument) {
        this.__findSearching = true;
        for (let start = 0; start < pageCount; start += SEARCH_BATCH) {
          const pageIndexes = Array.from({ length: Math.min(SEARCH_BATCH, pageCount - start) }, (_, i) => start + i);

          const texts = await Promise.all(pageIndexes.map((pageIndex) => this.#getPageText(pageIndex)));
          if (searchId !== this.#searchId) {
            return;
          }
          texts.forEach(({ normalized }, i) => {
            findInText(normalized, query).forEach((match) => matches.push({ pageIndex: pageIndexes[i], ...match }));
          });
        }
      }

      this.#matches = matches;
      this.__findSearching = false;
      this.__findMatchCount = matches.length;
      // Continue from the match before closing the find bar, or start from the
      // first match on or after the current page.
      const closedIndex = this.#closedMatchIndex;
      this.#closedMatchIndex = -1;
      const index =
        closedIndex >= 0 && closedIndex < matches.length
          ? closedIndex
          : matches.findIndex((match) => match.pageIndex >= this.page - 1);
      this.__findCurrentIndex = matches.length ? Math.max(index, 0) : -1;
      // Also clears the highlights of a previous search on other pages.
      this.#highlightPages();

      if (matches.length) {
        this.#showCurrentMatch(null, { delayed: true });
      } else if (query.trim()) {
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
        const promise = pdfDocument
          .getPage(pageIndex + 1)
          // The same text items as the text layer, which also gets marked content.
          // The marked content items have no text and are skipped by `createPageText()`.
          .then((pdfPage) => pdfPage.getTextContent())
          .then(({ items }) => {
            const pageText = createPageText(items);
            // Text of a document that was unloaded meanwhile must not mix with the text of the current one.
            if (this._pdfDocument === pdfDocument) {
              this.#loadedPageTexts.set(pageIndex, pageText);
            }
            return { pageText, normalized: normalizeText(pageText.text) };
          })
          .catch(() => {
            const pageText = createPageText([]);
            return { pageText, normalized: normalizeText('') };
          });
        this.#pageTexts.set(pageIndex, promise);
      }
      return this.#pageTexts.get(pageIndex);
    }

    /**
     * Scrolls to the current match and announces it.
     * @param {{ pageIndex: number } | null} previousMatch the previously current match, to update its highlight
     * @private
     */
    #showCurrentMatch(previousMatch, { delayed = false } = {}) {
      const match = this.#matches[this.__findCurrentIndex];
      const i18n = this.__effectiveI18n;
      this.#announce(
        i18n.findResultAnnouncement
          .replace('{current}', this.__findCurrentIndex + 1)
          .replace('{total}', this.#matches.length)
          .replace('{page}', match.pageIndex + 1),
        { delayed },
      );

      this.#highlightPages(previousMatch ? [previousMatch, match] : [match]);
      const currentElement = this.#getCurrentMatchElement();
      if (currentElement) {
        this.#scrollToMatchPending = false;
        this._scrollRectIntoView(currentElement.getBoundingClientRect());
      } else {
        // Scroll to the page, and to the match once the page is rendered.
        this.#scrollToMatchPending = true;
        this.page = match.pageIndex + 1;
      }
    }

    /** @private */
    #getCurrentMatchElement() {
      const match = this.#matches[this.__findCurrentIndex];
      const page = match && this._getPageView(match.pageIndex + 1);
      return page ? page.element.querySelector('.find-match.current') : null;
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
          this.#highlightPage(page); // NOSONAR
        }
      });
    }

    /**
     * Draws the highlights of the matches on a page over its text layer.
     * @private
     */
    async #highlightPage(page) {
      page.element.querySelector(':scope > .find-layer')?.remove();

      const pageIndex = page.pageNumber - 1;
      const matches = this.#matches.filter((match) => match.pageIndex === pageIndex);
      if (!matches.length || !page.textLayer) {
        return;
      }

      const searchId = this.#searchId;
      const { pageText } = await this.#getPageText(pageIndex);
      // The highlights need the text layer elements that the text was taken from.
      const textDivs = page.textLayer ? page.textLayer.textDivs : [];
      if (searchId !== this.#searchId || textDivs.length !== pageText.items.length) {
        return;
      }

      page.element.querySelector(':scope > .find-layer')?.remove();
      const layer = document.createElement('div');
      layer.className = 'find-layer';
      // Positioned in % of the page, so that they stay in place when zooming.
      const pageRect = page.element.getBoundingClientRect();
      const currentMatch = this.#matches[this.__findCurrentIndex];

      matches.forEach((match) => {
        getMatchParts(pageText, match).forEach(({ itemIndex, start, end }) => {
          const textNode = textDivs[itemIndex].firstChild;
          if (!textNode || end > textNode.length) {
            return;
          }
          const range = document.createRange();
          range.setStart(textNode, start);
          range.setEnd(textNode, end);
          [...range.getClientRects()].forEach((rect) => {
            const highlight = document.createElement('div');
            highlight.className = match === currentMatch ? 'find-match current' : 'find-match';
            highlight.style.left = `${((rect.left - pageRect.left) / pageRect.width) * 100}%`;
            highlight.style.top = `${((rect.top - pageRect.top) / pageRect.height) * 100}%`;
            highlight.style.width = `${(rect.width / pageRect.width) * 100}%`;
            highlight.style.height = `${(rect.height / pageRect.height) * 100}%`;
            layer.append(highlight);
          });
        });
      });

      // Below the text layer, so that the text stays selectable.
      page.textLayerElement.before(layer);

      if (this.#scrollToMatchPending && currentMatch && currentMatch.pageIndex === pageIndex) {
        this.#scrollToMatchPending = false;
        const currentElement = this.#getCurrentMatchElement();
        if (currentElement) {
          this._scrollRectIntoView(currentElement.getBoundingClientRect());
        }
      }
    }
  };
