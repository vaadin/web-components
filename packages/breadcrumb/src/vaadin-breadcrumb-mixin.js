/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { html, nothing } from 'lit';

/**
 * A mixin providing common breadcrumb functionality.
 *
 * @polymerMixin
 */
export const BreadcrumbMixin = dedupeMixin(
  (superClass) =>
    class BreadcrumbMixinClass extends superClass {
      static get properties() {
        return {
          /**
           * Internal count of slotted items, used to trigger re-renders.
           * @type {number}
           * @protected
           */
          _itemCount: {
            type: Number,
            state: true,
          },
        };
      }

      constructor() {
        super();
        /** @type {Array<Element>} @protected */
        this._items = [];
        /** @type {number} @protected */
        this._itemCount = 0;
        /** @type {Element|null} @private */
        this.__separatorNode = null;
        /** @private */
        this.__observingItems = false;
      }

      /** @protected */
      firstUpdated(props) {
        super.firstUpdated(props);
        // Set up a MutationObserver to watch for child additions/removals
        this.__childObserver = new MutationObserver(() => {
          this.__updateItems();
        });
        this.__childObserver.observe(this, { childList: true });
        // Initial sync
        this.__updateItems();
      }

      /** @protected */
      render() {
        return html`
          <nav part="nav">
            <ol part="list">
              ${this.__renderItems()}
            </ol>
          </nav>
          <div style="display: none !important;">
            <slot name="separator" @slotchange="${this.__onSeparatorSlotChange}"></slot>
          </div>
        `;
      }

      /**
       * Render the list items with separators between them.
       * @private
       */
      __renderItems() {
        const count = this._itemCount;
        const result = [];
        for (let i = 0; i < count; i++) {
          const isLast = i === count - 1;
          result.push(html`
            <li>
              <slot name="item-${i}"></slot>${!isLast
                ? html`<span part="separator" aria-hidden="true">${this.__getSeparatorContent()}</span>`
                : nothing}
            </li>
          `);
        }
        return result;
      }

      /**
       * Get the separator content (cloned from slot or default chevron).
       * @return {string|Node}
       * @private
       */
      __getSeparatorContent() {
        if (this.__separatorNode) {
          const clone = this.__separatorNode.cloneNode(true);
          return clone.textContent;
        }
        // Default: right single angle quotation mark (›)
        return '\u203A';
      }

      /**
       * Scan light DOM children for breadcrumb items and assign named slots.
       * @private
       */
      __updateItems() {
        const items = [...this.children].filter((child) => child.localName === 'vaadin-breadcrumb-item');

        this._items = items;

        // Assign named slots to each item
        items.forEach((item, index) => {
          item.setAttribute('slot', `item-${index}`);
        });

        this._itemCount = items.length;
      }

      /**
       * Handle slotchange on the separator slot.
       * @param {Event} event
       * @private
       */
      __onSeparatorSlotChange(event) {
        const slot = event.target;
        const nodes = slot.assignedNodes({ flatten: true }).filter((node) => node.nodeType === Node.ELEMENT_NODE);
        this.__separatorNode = nodes.length > 0 ? nodes[0] : null;
        // Re-render separators
        this.requestUpdate();
      }
    },
);
