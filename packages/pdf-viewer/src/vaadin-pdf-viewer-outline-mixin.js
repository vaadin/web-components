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
import { html, nothing } from 'lit';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { isAllowedLinkUrl } from './pdf-viewer-url.js';

/**
 * @typedef {Object} OutlineItem
 * @property {string} id
 * @property {string} title
 * @property {object} destination the `dest` and `action` of the pdf.js outline item
 * @property {OutlineItem[]} items
 * @property {OutlineItem | null} parent
 */

/**
 * Converts the outline of pdf.js into items with ids and parents.
 * @return {OutlineItem[]}
 */
function createOutlineItems(pdfItems, parent = null, prefix = '') {
  return pdfItems.map((pdfItem, index) => {
    const item = {
      id: `${prefix}${index}`,
      title: pdfItem.title,
      destination: { dest: pdfItem.dest, action: pdfItem.action },
      url: pdfItem.url && isAllowedLinkUrl(pdfItem.url) ? pdfItem.url : null,
      items: [],
      parent,
    };
    item.items = createOutlineItems(pdfItem.items || [], item, `${item.id}.`);
    return item;
  });
}

/**
 * Shows the outline (bookmarks) of the document in the sidebar, as a tree
 * that follows the WAI-ARIA tree view pattern.
 *
 * @polymerMixin
 */
export const PdfViewerOutlineMixin = (superClass) =>
  class PdfViewerOutlineMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * The outline items of the document, or null when it has none.
         * @private
         */
        __outline: {
          type: Array,
          value: null,
          attribute: false,
        },

        /**
         * The view of the sidebar: `thumbnails` or `outline`.
         * @private
         */
        __sidebarView: {
          type: String,
          value: 'thumbnails',
          attribute: false,
        },

        /** @private */
        __expandedOutlineItems: {
          type: Object,
          value: () => new Set(),
          attribute: false,
        },

        /** @private */
        __focusedOutlineItem: {
          type: Object,
          attribute: false,
        },
      };
    }

    /** The item that was activated last. */
    #activatedItem = null;

    /**
     * Override method from `LitElement` to load the outline of a newly loaded document.
     * @protected
     * @override
     */
    updated(props) {
      super.updated(props);

      if (props.has('pageCount') && this.pageCount > 0) {
        this.#loadOutline();
      }
    }

    /**
     * Override method from `PdfViewerMixin` to remove the outline of the
     * previous document.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();
      this.__outline = null;
      this.#activatedItem = null;
      this.__sidebarView = 'thumbnails';
      this.__expandedOutlineItems = new Set();
      this.__focusedOutlineItem = undefined;
    }

    /**
     * Switches the sidebar between the thumbnails and the outline.
     * @param {'thumbnails' | 'outline'} view
     * @protected
     */
    _setSidebarView(view) {
      this.__sidebarView = view;
    }

    /**
     * Renders the outline tree, for the template of the viewer.
     * @protected
     */
    _renderOutline() {
      const outline = this.__outline;
      const current = outline && this.#getCurrentItem();
      // The tab stop follows the current page, like the thumbnails, while focus is outside the outline.
      const hasFocus = !!this.shadowRoot.activeElement?.closest('[part="outline"]');
      const focused = (hasFocus && this.__focusedOutlineItem) || current || this.__focusedOutlineItem || outline?.[0];
      return html`
        <div
          id="outline"
          part="outline"
          role="tree"
          aria-label="${this.__effectiveI18n.outline}"
          ?hidden="${!outline || this.__sidebarView !== 'outline'}"
          @click="${this.#onOutlineClick}"
          @keydown="${this.#onOutlineKeyDown}"
        >
          ${outline ? this.#renderOutlineItems(outline, 1, current, focused) : nothing}
        </div>
      `;
    }

    /** @private */
    #renderOutlineItems(items, level, current, focused) {
      return items.map((item, index) => {
        const hasChildren = item.items.length > 0;
        const expanded = hasChildren && this.__expandedOutlineItems.has(item);
        return html`
          <div
            role="treeitem"
            part="${item === current ? 'outline-item current' : 'outline-item'}"
            data-id="${item.id}"
            aria-label="${item.title}"
            aria-level="${level}"
            aria-setsize="${items.length}"
            aria-posinset="${index + 1}"
            aria-expanded="${hasChildren ? String(expanded) : nothing}"
            aria-disabled="${this.#hasTarget(item) ? nothing : 'true'}"
            aria-current="${item === current ? 'location' : nothing}"
            tabindex="${item === focused ? '0' : '-1'}"
          >
            <div part="outline-item-content" style="--_level: ${level - 1}">
              <span
                part="${expanded ? 'outline-toggle expanded' : 'outline-toggle'}"
                ?hidden="${!hasChildren}"
                ?expanded="${expanded}"
              ></span>
              <span part="outline-item-title">${item.title}</span>
            </div>
            ${expanded ? html`<div role="group">${this.#renderOutlineItems(item.items, level + 1, current, focused)}</div>` : nothing}
          </div>
        `;
      });
    }

    /**
     * Whether the item goes somewhere when activated.
     * @private
     */
    #hasTarget(item) {
      return !!(item.url || item.destination.dest || item.destination.action);
    }

    /**
     * Goes to the destination of an item, or opens its URL in a new tab.
     * @private
     */
    #activateItem(item) {
      this.#activatedItem = item;
      // Mark the item, also when the page does not change.
      this.requestUpdate();
      if (item.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      } else if (this.#hasTarget(item)) {
        this._goToDestination(item.destination);
        this._closeSidebarOverlay();
      }
    }

    /** @private */
    async #loadOutline() {
      const pdfDocument = this._pdfDocument;
      let pdfOutline = null;
      try {
        pdfOutline = await pdfDocument.getOutline();
      } catch {
        // A document with a broken outline is shown without one.
      }
      if (this._pdfDocument !== pdfDocument) {
        return;
      }
      const outline = pdfOutline && pdfOutline.length ? createOutlineItems(pdfOutline) : null;
      if (!outline) {
        this.__outline = null;
        this.__sidebarView = 'thumbnails';
        return;
      }
      this.__outline = outline;
      // Resolve the pages of the items in the background, to mark the item of the current page.
      // Named actions like NextPage depend on the current page, so they are not marked.
      await Promise.all(
        this.#getAllItems(outline).map(async (item) => {
          if (!item.url && !item.destination.action) {
            item.page = await this._getDestinationPage(item.destination);
          }
        }),
      );
      if (this._pdfDocument === pdfDocument) {
        this.requestUpdate();
      }
    }

    /**
     * Returns the items that are visible, in order, i.e. the items whose
     * parents are all expanded.
     * @private
     */
    #getVisibleItems(items = this.__outline || [], result = []) {
      items.forEach((item) => {
        result.push(item);
        if (this.__expandedOutlineItems.has(item)) {
          this.#getVisibleItems(item.items, result);
        }
      });
      return result;
    }

    /** @private */
    #getAllItems(items, result = []) {
      items.forEach((item) => {
        result.push(item);
        this.#getAllItems(item.items, result);
      });
      return result;
    }

    /**
     * Returns the visible item for the current page: of the items that start
     * on or before the current page, the first one on the nearest page.
     * @private
     */
    #getCurrentItem() {
      // The item the user chose, while its page is current, e.g. one of several sections of a page.
      const activated = this.#activatedItem;
      if (activated && activated.page === this.page && this.#getVisibleItems().includes(activated)) {
        return activated;
      }
      let current = null;
      this.#getVisibleItems().forEach((item) => {
        if (item.page && item.page <= this.page && (!current || item.page > current.page)) {
          current = item;
        }
      });
      return current;
    }

    /** @private */
    #findItem(id, items = this.__outline || []) {
      for (const item of items) {
        if (item.id === id) {
          return item;
        }
        const found = this.#findItem(id, item.items);
        if (found) {
          return found;
        }
      }
      return null;
    }

    /** @private */
    #getItemFromEvent(event) {
      const element = event
        .composedPath()
        .find((node) => node.getAttribute && node.getAttribute('role') === 'treeitem');
      return element ? this.#findItem(element.dataset.id) : null;
    }

    /** @private */
    #setExpanded(item, expanded) {
      const expandedItems = new Set(this.__expandedOutlineItems);
      if (expanded) {
        expandedItems.add(item);
      } else {
        expandedItems.delete(item);
      }
      this.__expandedOutlineItems = expandedItems;
    }

    /** @private */
    async #focusItem(item) {
      this.__focusedOutlineItem = item;
      await this.updateComplete;
      const element = this.shadowRoot.querySelector(`[role="treeitem"][data-id="${item.id}"]`);
      element?.focus({ focusVisible: isKeyboardActive() });
    }

    /** @private */
    #onOutlineClick(event) {
      const item = this.#getItemFromEvent(event);
      if (!item) {
        return;
      }
      this.__focusedOutlineItem = item;
      const isToggle = event.composedPath().some((node) => node.part && node.part.contains('outline-toggle'));
      if (isToggle) {
        this.#setExpanded(item, !this.__expandedOutlineItems.has(item));
      } else {
        this.#activateItem(item);
      }
    }

    /**
     * Handles the keyboard interaction of the WAI-ARIA tree view pattern.
     * @private
     */
    #onOutlineKeyDown(event) {
      const item = this.#getItemFromEvent(event);
      if (!item) {
        return;
      }
      const visibleItems = this.#getVisibleItems();
      // Right and left are swapped in right-to-left languages.
      const isRtl = getComputedStyle(this).direction === 'rtl';
      const key = isRtl ? { ArrowRight: 'ArrowLeft', ArrowLeft: 'ArrowRight' }[event.key] || event.key : event.key;
      const index = visibleItems.indexOf(item);
      const expanded = this.__expandedOutlineItems.has(item);
      const hasChildren = item.items.length > 0;

      switch (key) {
        case 'ArrowDown':
          this.#focusItem(visibleItems[Math.min(index + 1, visibleItems.length - 1)]);
          break;
        case 'ArrowUp':
          this.#focusItem(visibleItems[Math.max(index - 1, 0)]);
          break;
        case 'Home':
          this.#focusItem(visibleItems[0]);
          break;
        case 'End':
          this.#focusItem(visibleItems[visibleItems.length - 1]);
          break;
        case 'ArrowRight':
          if (hasChildren && !expanded) {
            this.#setExpanded(item, true);
          } else if (hasChildren) {
            this.#focusItem(item.items[0]);
          }
          break;
        case 'ArrowLeft':
          if (expanded) {
            this.#setExpanded(item, false);
          } else if (item.parent) {
            this.#focusItem(item.parent);
          }
          break;
        case 'Enter':
          this.#activateItem(item);
          break;
        default:
          return;
      }
      event.preventDefault();
    }
  };
