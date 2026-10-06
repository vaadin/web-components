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
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { createPageText, findInText, getMatchParts, normalizeText } from './pdf-viewer-find.js';

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
        },

        /** @private */
        __findQuery: {
          type: String,
          value: '',
        },

        /** @private */
        __findMatchCount: {
          type: Number,
          value: 0,
        },

        /** @private */
        __findCurrentIndex: {
          type: Number,
          value: -1,
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

    /** Incremented on every search, to drop results of an outdated search. */
    #searchId = 0;

    /** Whether to scroll to the current match once its page is rendered. */
    #scrollToMatchPending = false;

    /** @type {HTMLElement | null} */
    #returnFocus = null;

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.addEventListener('keydown', (event) => {
        const isShortcut = (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey;
        if (isShortcut && event.key.toLowerCase() === 'f' && this.pageCount > 0) {
          event.preventDefault();
          this._openFind();
        }
      });
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      // Search a newly loaded document for the query that is still entered.
      if (props.has('pageCount') && this.pageCount > 0 && this.__findOpened && this.__findQuery) {
        this.#search();
      }
    }

    /**
     * Opens the find bar and focuses the find field.
     * @protected
     */
    async _openFind() {
      if (!this.__findOpened) {
        const active = this.getRootNode().activeElement;
        this.#returnFocus = active && this.contains(active) ? active : null;
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
      this.#searchId += 1;
      this.#matches = [];
      this.__findMatchCount = 0;
      this.__findCurrentIndex = -1;
      this.#highlightRenderedPages();

      const returnFocus = this.#returnFocus;
      this.#returnFocus = null;
      if (returnFocus && returnFocus.isConnected) {
        returnFocus.focus({ focusVisible: isKeyboardActive() });
      }
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
      this.#search();
    }

    /**
     * Goes to the next or the previous match.
     * @param {1 | -1} direction
     * @protected
     */
    _findNext(direction) {
      const count = this.#matches.length;
      if (!count) {
        return;
      }
      this.__findCurrentIndex = (this.__findCurrentIndex + direction + count) % count;
      this.#showCurrentMatch();
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
      this.#searchId += 1;
      this.#matches = [];
      this.__findMatchCount = 0;
      this.__findCurrentIndex = -1;
    }

    /** @private */
    async #search() {
      this.#searchId += 1;
      const searchId = this.#searchId;
      const query = this.__findQuery;
      const pageCount = this.pageCount;
      const matches = [];

      if (query.trim() && this._pdfDocument) {
        for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
          const { normalized } = await this.#getPageText(pageIndex);
          if (searchId !== this.#searchId) {
            return;
          }
          findInText(normalized, query).forEach((match) => matches.push({ pageIndex, ...match }));
        }
      }

      this.#matches = matches;
      this.__findMatchCount = matches.length;
      // Start from the first match on or after the current page.
      const index = matches.findIndex((match) => match.pageIndex >= this.page - 1);
      this.__findCurrentIndex = matches.length ? Math.max(index, 0) : -1;
      this.#highlightRenderedPages();

      if (matches.length) {
        this.#showCurrentMatch();
      } else if (query.trim()) {
        announce(this.__effectiveI18n.findNoMatches);
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
          // Same options as the text layer, so that the text items match its elements.
          .then((pdfPage) => pdfPage.getTextContent())
          .then(({ items }) => {
            const pageText = createPageText(items);
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
     * @private
     */
    #showCurrentMatch() {
      const match = this.#matches[this.__findCurrentIndex];
      const i18n = this.__effectiveI18n;
      announce(
        i18n.findResult.replace('{current}', this.__findCurrentIndex + 1).replace('{total}', this.#matches.length),
      );

      this.#highlightRenderedPages();
      const currentElement = this.#getCurrentMatchElement();
      if (currentElement) {
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

    /** @private */
    #highlightRenderedPages() {
      for (let pageNumber = 1; pageNumber <= this.pageCount; pageNumber++) {
        const page = this._getPageView(pageNumber);
        if (page && page.textLayer) {
          this.#highlightPage(page);
        }
      }
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
            highlight.style.left = `${rect.left - pageRect.left}px`;
            highlight.style.top = `${rect.top - pageRect.top}px`;
            highlight.style.width = `${rect.width}px`;
            highlight.style.height = `${rect.height}px`;
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
