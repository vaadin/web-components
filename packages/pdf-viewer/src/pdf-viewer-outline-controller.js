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
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { resolveDestination } from './pdf-viewer-links.js';
import { isAllowedLinkUrl } from './pdf-viewer-url.js';

/**
 * @typedef {Object} OutlineItem
 * @property {string} id
 * @property {string} title
 * @property {{ dest?: string | Array, action?: string }} destination the `dest` and `action` of the pdf.js outline item
 * @property {string | null} url the URL of the item, when it has one with an allowed protocol
 * @property {number | null} [page] the page that the destination goes to, once resolved
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
 * A controller that shows the outline (bookmarks) of the document as a tree
 * that follows the WAI-ARIA tree view pattern, and marks the item of the
 * current page.
 */
export class PdfViewerOutlineController {
  /** @type {HTMLElement & import('lit').ReactiveControllerHost} */
  #host;

  /** @type {(destination: { dest?: string | Array, action?: string }) => void} */
  #onActivate;

  /** @type {import('pdfjs-dist').PDFDocumentProxy | null} */
  #pdfDocument = null;

  /**
   * The outline items of the document, or null when it has none.
   * @type {OutlineItem[] | null}
   */
  #items = null;

  /** @type {Set<OutlineItem>} */
  #expandedItems = new Set();

  /**
   * The item that has, or last had, focus.
   * @type {OutlineItem | null}
   */
  #focusedItem = null;

  /**
   * The item to focus once the host has updated.
   * @type {OutlineItem | null}
   */
  #pendingFocusItem = null;

  /**
   * The item that was activated last.
   * @type {OutlineItem | null}
   */
  #activatedItem = null;

  /**
   * @param {HTMLElement & import('lit').ReactiveControllerHost} host
   * @param {{ onActivate: (destination: { dest?: string | Array, action?: string }) => void }} callbacks
   *   `onActivate`: called when the user activates an item that goes to a place in the document.
   */
  constructor(host, { onActivate }) {
    this.#host = host;
    this.#onActivate = onActivate;
  }

  /** Focuses the item that keyboard navigation moved to. */
  hostUpdated() {
    const item = this.#pendingFocusItem;
    this.#pendingFocusItem = null;
    if (item) {
      const element = this.#host.shadowRoot.querySelector(`[role="treeitem"][data-id="${item.id}"]`);
      element?.focus({ focusVisible: isKeyboardActive() });
    }
  }

  /** Whether the document has an outline. */
  get hasOutline() {
    return !!this.#items;
  }

  /**
   * Loads the outline of the document, and resolves the pages of its items in the background.
   * @param {import('pdfjs-dist').PDFDocumentProxy} pdfDocument
   * @param {number} pageCount
   */
  load(pdfDocument, pageCount) {
    this.#pdfDocument = pdfDocument;
    this.#load(pdfDocument, pageCount).catch((error) => {
      if (this.#pdfDocument === pdfDocument) {
        issueWarning(`Failed to load the outline of the PDF document: ${error.message}`);
      }
    });
  }

  /** Removes the outline, e.g. when the document is unloaded. */
  clear() {
    this.#pdfDocument = null;
    this.#items = null;
    this.#expandedItems = new Set();
    this.#focusedItem = null;
    this.#pendingFocusItem = null;
    this.#activatedItem = null;
    this.#host.requestUpdate();
  }

  /**
   * Returns the template of the outline tree.
   * @param {number} page the current page
   * @param {{ hidden: boolean, label: string }} options
   * @return {import('lit').TemplateResult}
   */
  render(page, { hidden, label }) {
    const items = this.#items;
    const current = items && this.#getCurrentItem(page);
    // The tab stop follows the current page, like the thumbnails, while focus is outside the outline.
    const hasFocus = !!this.#host.shadowRoot.activeElement?.closest('[part="outline"]');
    const focused = (hasFocus && this.#focusedItem) || current || this.#focusedItem || items?.[0];
    return html`
      <div
        part="outline"
        role="tree"
        aria-label="${label}"
        ?hidden="${hidden || !items}"
        @click="${this.#onClick}"
        @keydown="${this.#onKeyDown}"
      >
        ${items ? this.#renderItems(items, 1, current, focused) : nothing}
      </div>
    `;
  }

  /** @private */
  #renderItems(items, level, current, focused) {
    return items.map((item, index) => {
      const hasChildren = item.items.length > 0;
      const expanded = hasChildren && this.#expandedItems.has(item);
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
          ${
            expanded
              ? html`<div role="group">${this.#renderItems(item.items, level + 1, current, focused)}</div>`
              : nothing
          }
        </div>
      `;
    });
  }

  /** @private */
  async #load(pdfDocument, pageCount) {
    let pdfOutline = null;
    try {
      pdfOutline = await pdfDocument.getOutline();
    } catch {
      // A document with a broken outline is shown without one.
    }
    if (this.#pdfDocument !== pdfDocument) {
      return;
    }
    this.#items = pdfOutline && pdfOutline.length ? createOutlineItems(pdfOutline) : null;
    this.#host.requestUpdate();
    if (!this.#items) {
      return;
    }
    // Resolve the pages of the items in the background, to mark the item of the current page.
    // Named actions like NextPage depend on the current page, so they are not marked.
    await Promise.all(
      this.#getAllItems(this.#items).map(async (item) => {
        if (!item.url && !item.destination.action) {
          const target = await resolveDestination(pdfDocument, item.destination, { page: 1, pageCount });
          item.page = target ? target.page : null;
        }
      }),
    );
    if (this.#pdfDocument === pdfDocument) {
      this.#host.requestUpdate();
    }
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
  #activate(item) {
    this.#activatedItem = item;
    // Mark the item, also when the page does not change.
    this.#host.requestUpdate();
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else if (this.#hasTarget(item)) {
      this.#onActivate(item.destination);
    }
  }

  /**
   * Returns the items that are visible, in order, i.e. the items whose
   * parents are all expanded.
   * @private
   */
  #getVisibleItems(items = this.#items || [], result = []) {
    items.forEach((item) => {
      result.push(item);
      if (this.#expandedItems.has(item)) {
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
  #getCurrentItem(page) {
    const visibleItems = this.#getVisibleItems();
    // The item the user chose, while its page is current, e.g. one of several sections of a page.
    const activated = this.#activatedItem;
    if (activated && activated.page === page && visibleItems.includes(activated)) {
      return activated;
    }
    let current = null;
    visibleItems.forEach((item) => {
      if (item.page && item.page <= page && (!current || item.page > current.page)) {
        current = item;
      }
    });
    return current;
  }

  /** @private */
  #findItem(id, items = this.#items || []) {
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
    const element = event.composedPath().find((node) => node.getAttribute && node.getAttribute('role') === 'treeitem');
    return element ? this.#findItem(element.dataset.id) : null;
  }

  /** @private */
  #setExpanded(item, expanded) {
    if (expanded) {
      this.#expandedItems.add(item);
    } else {
      this.#expandedItems.delete(item);
    }
    this.#host.requestUpdate();
  }

  /** @private */
  #focusItem(item) {
    this.#focusedItem = item;
    this.#pendingFocusItem = item;
    this.#host.requestUpdate();
  }

  /**
   * Expands or collapses an item when clicking its toggle, and activates it otherwise.
   * An arrow function, as Lit calls event listeners with the host as `this`.
   * @private
   */
  #onClick = (event) => {
    const item = this.#getItemFromEvent(event);
    if (!item) {
      return;
    }
    this.#focusedItem = item;
    const isToggle = event.composedPath().some((node) => node.part && node.part.contains('outline-toggle'));
    if (isToggle) {
      this.#setExpanded(item, !this.#expandedItems.has(item));
    } else {
      this.#activate(item);
    }
  };

  /**
   * Handles the keyboard interaction of the WAI-ARIA tree view pattern.
   * An arrow function, as Lit calls event listeners with the host as `this`.
   * @private
   */
  #onKeyDown = (event) => {
    const item = this.#getItemFromEvent(event);
    if (!item) {
      return;
    }
    const visibleItems = this.#getVisibleItems();
    // Right and left are swapped in right-to-left languages.
    const isRtl = getComputedStyle(this.#host).direction === 'rtl';
    const key = isRtl ? { ArrowRight: 'ArrowLeft', ArrowLeft: 'ArrowRight' }[event.key] || event.key : event.key;
    const index = visibleItems.indexOf(item);
    const expanded = this.#expandedItems.has(item);
    const hasChildren = item.items.length > 0;

    let focusTarget;
    switch (key) {
      case 'ArrowDown':
        focusTarget = visibleItems[Math.min(index + 1, visibleItems.length - 1)];
        break;
      case 'ArrowUp':
        focusTarget = visibleItems[Math.max(index - 1, 0)];
        break;
      case 'Home':
        focusTarget = visibleItems[0];
        break;
      case 'End':
        focusTarget = visibleItems[visibleItems.length - 1];
        break;
      case 'ArrowRight':
        if (hasChildren && !expanded) {
          this.#setExpanded(item, true);
        } else if (hasChildren) {
          focusTarget = item.items[0];
        }
        break;
      case 'ArrowLeft':
        if (expanded) {
          this.#setExpanded(item, false);
        } else if (item.parent) {
          focusTarget = item.parent;
        }
        break;
      case 'Enter':
        this.#activate(item);
        break;
      default:
        return;
    }
    if (focusTarget) {
      this.#focusItem(focusTarget);
    }
    event.preventDefault();
  };
}
