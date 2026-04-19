/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/icon/vaadin-icon.js';
import { html, render } from 'lit';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A mixin providing common breadcrumb functionality.
 *
 * @polymerMixin
 */
export const BreadcrumbMixin = (superClass) =>
  class BreadcrumbMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Programmatic item data. When set, renders `<vaadin-breadcrumb-item>`
         * elements into light DOM. Each object has `text` (label), optional
         * `path` (navigation target), and optional `prefix` (icon name string).
         *
         * @type {Array<{text: string, path?: string, prefix?: string}>}
         */
        items: {
          type: Array,
          value: () => [],
        },

        label: {
          type: String,
          value: 'Breadcrumb',
          attribute: false,
        },

        /**
         * Callback for navigation interception. When set, item link clicks
         * are intercepted: the callback receives `{ path, originalEvent }`
         * and default navigation is prevented unless the callback returns `false`.
         * Clicks with modifier keys, on external links, or with `target="_blank"`
         * bypass interception.
         *
         * @type {function({path: string, originalEvent: Event}): boolean | undefined}
         */
        onNavigate: {
          attribute: false,
        },
      };
    }

    constructor() {
      super();
      this.addEventListener('click', this.__onClick);
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      // By default, if the user hasn't provided a custom role,
      // the role attribute is set to "navigation".
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'navigation');
      }

      this.setAttribute('aria-label', this.label);

      this._itemsController = new SlotController(this, '', 'vaadin-breadcrumb-item', {
        observe: true,
        multiple: true,
      });
      this._itemsController.initAddedNode = () => {
        this.__updateCurrentItem();
        this.__scheduleOverflow();
      };
      this._itemsController.teardownNode = () => {
        this.__updateCurrentItem();
        this.__scheduleOverflow();
      };
      this.addController(this._itemsController);

      this._container = this.shadowRoot.querySelector('[part="container"]');
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      // Flush the debouncer to avoid memory leaks
      if (this.__overflowDebouncer) {
        this.__overflowDebouncer.flush();
      }
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('label')) {
        this.setAttribute('aria-label', this.label);
      }

      if (props.has('items')) {
        this.__renderItems(this.items);
      }

      if (props.has('__effectiveI18n')) {
        this.__updateOverflowButtonLabel();
      }
    }

    /**
     * Implement callback from `ResizeMixin` to schedule overflow detection.
     *
     * @protected
     * @override
     */
    _onResize() {
      this.__scheduleOverflow();
    }

    /** @private */
    __onClick(e) {
      if (!this.onNavigate) {
        return;
      }

      const hasModifier = e.metaKey || e.shiftKey;
      if (hasModifier) {
        // Allow default action for clicks with modifiers
        return;
      }

      const composedPath = e.composedPath();
      const item = composedPath.find((el) => el.localName && el.localName.includes('breadcrumb-item'));
      const anchor = composedPath.find((el) => el instanceof HTMLAnchorElement);
      if (!item || !anchor || !item.shadowRoot.contains(anchor)) {
        // Not a click on a breadcrumb-item anchor
        return;
      }

      const isRelative = anchor.href && anchor.href.startsWith(location.origin);
      if (!isRelative) {
        // Allow default action for external links
        return;
      }

      if (anchor.target === '_blank') {
        // Allow default action for links with target="_blank"
        return;
      }

      // Call the onNavigate callback
      const result = this.onNavigate({
        path: item.path,
        originalEvent: e,
      });

      if (result !== false) {
        // Cancel the default action if the callback didn't return false
        e.preventDefault();
      }
    }

    /**
     * Renders `<vaadin-breadcrumb-item>` elements into light DOM
     * based on the `items` array property.
     * @param {Array<{text: string, path?: string, prefix?: string}>} items
     * @private
     */
    __renderItems(items = []) {
      render(
        html`${items.map(
          (item) => html`
            <vaadin-breadcrumb-item .path="${item.path || null}">
              ${item.prefix ? html`<vaadin-icon icon="${item.prefix}" slot="prefix"></vaadin-icon>` : ''} ${item.text}
            </vaadin-breadcrumb-item>
          `,
        )}`,
        this,
        { renderBefore: null },
      );
    }

    /**
     * Updates the `current` property on breadcrumb items:
     * removes `current` from all items and sets it on the last one.
     * @private
     */
    __updateCurrentItem() {
      const items = this._itemsController.nodes;
      if (!items || items.length === 0) {
        return;
      }
      items.forEach((item) => {
        item.current = false;
      });
      items[items.length - 1].current = true;
    }

    /**
     * Schedules overflow detection with microTask debouncing.
     * @private
     */
    __scheduleOverflow() {
      this.__overflowDebouncer = Debouncer.debounce(this.__overflowDebouncer, microTask, () => {
        this.__detectOverflow();
      });
    }

    /**
     * Creates and returns the overflow button element.
     * @return {HTMLButtonElement}
     * @private
     */
    __createOverflowButton() {
      const btn = document.createElement('button');
      btn.setAttribute('data-overflow', '');
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('tabindex', '0');
      btn.textContent = '\u2026';
      this.__updateOverflowButtonLabel(btn);
      return btn;
    }

    /**
     * Updates the aria-label on the overflow button from i18n.
     * @param {HTMLButtonElement} [btn]
     * @private
     */
    __updateOverflowButtonLabel(btn) {
      const button = btn || this.__overflowButton;
      if (!button) {
        return;
      }
      const label = this.__effectiveI18n && this.__effectiveI18n.moreItems;
      if (label) {
        button.setAttribute('aria-label', label);
      } else {
        button.removeAttribute('aria-label');
      }
    }

    /**
     * Returns all breadcrumb-item children (excluding the overflow button).
     * @return {HTMLElement[]}
     * @private
     */
    __getBreadcrumbItems() {
      return Array.from(this.querySelectorAll('vaadin-breadcrumb-item'));
    }

    /**
     * Restores all items to visible state.
     * @param {HTMLElement[]} items
     * @private
     */
    __restoreItems(items) {
      items.forEach((item) => {
        item.style.visibility = '';
        item.style.position = '';
      });
    }

    /**
     * Hides an item by making it invisible and absolutely positioned.
     * @param {HTMLElement} item
     * @private
     */
    __collapseItem(item) {
      item.style.visibility = 'hidden';
      item.style.position = 'absolute';
    }

    /**
     * Removes the overflow button from light DOM if present.
     * @private
     */
    __removeOverflowButton() {
      if (this.__overflowButton && this.__overflowButton.parentNode === this) {
        this.removeChild(this.__overflowButton);
      }
    }

    /**
     * Inserts the overflow button at the correct DOM position:
     * after the last visible item that precedes the collapsed range.
     * @param {HTMLElement[]} items
     * @param {HTMLElement[]} collapsedItems
     * @private
     */
    __insertOverflowButton(items, collapsedItems) {
      if (!this.__overflowButton) {
        this.__overflowButton = this.__createOverflowButton();
      }

      // Remove first if already inserted
      this.__removeOverflowButton();

      // Find the last visible item before the first collapsed item
      const firstCollapsedIndex = items.indexOf(collapsedItems[0]);
      let insertAfter = null;
      for (let i = firstCollapsedIndex - 1; i >= 0; i--) {
        if (!collapsedItems.includes(items[i])) {
          insertAfter = items[i];
          break;
        }
      }

      if (insertAfter) {
        // Insert after the last visible item before collapsed range
        insertAfter.after(this.__overflowButton);
      } else {
        // All items before the collapsed range are also collapsed,
        // insert at the beginning
        this.insertBefore(this.__overflowButton, this.firstChild);
      }
    }

    /**
     * Main overflow detection algorithm.
     * @private
     */
    __detectOverflow() {
      const container = this._container;
      if (!container) {
        return;
      }

      const items = this.__getBreadcrumbItems();
      if (items.length === 0) {
        this.__removeOverflowButton();
        return;
      }

      // Step 1: Restore all items and remove overflow button
      this.__restoreItems(items);
      this.__removeOverflowButton();

      // Remove truncate attribute from all items
      items.forEach((item) => item.removeAttribute('truncate'));

      // Step 2: Check if there's overflow
      if (container.scrollWidth <= container.offsetWidth) {
        // No overflow - all items fit
        return;
      }

      // Step 3: Lock container width during measurement
      container.style.minWidth = `${container.offsetWidth}px`;

      // Ensure the overflow button exists
      if (!this.__overflowButton) {
        this.__overflowButton = this.__createOverflowButton();
      }

      const collapsedItems = [];
      const lastIndex = items.length - 1;

      // Step 5: Collapse items starting from index 1 toward the current page
      // (skip root at index 0 and last item which is current page)
      for (let i = 1; i < lastIndex; i++) {
        this.__collapseItem(items[i]);
        collapsedItems.push(items[i]);

        // Insert the overflow button at the correct position
        this.__insertOverflowButton(items, collapsedItems);

        // Step 6: Re-check fit after each collapse
        if (container.scrollWidth <= container.offsetWidth) {
          break;
        }
      }

      // Step 7: If all intermediates collapsed and still overflows, collapse root
      if (container.scrollWidth > container.offsetWidth && lastIndex > 0) {
        this.__collapseItem(items[0]);
        collapsedItems.push(items[0]);
        this.__insertOverflowButton(items, collapsedItems);
      }

      // Step 8: If only current page remains and still overflows, set truncate
      if (container.scrollWidth > container.offsetWidth && items.length > 0) {
        items[lastIndex].setAttribute('truncate', '');
      }

      // If no items were collapsed, we don't need the overflow button
      if (collapsedItems.length === 0) {
        this.__removeOverflowButton();
      }

      // Step 10: Unlock container width
      container.style.minWidth = '';
    }
  };
