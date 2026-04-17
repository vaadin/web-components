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
           * An array of item objects to render as breadcrumb items.
           * Each object can have: `text` (string), `path` (string), `current` (boolean).
           * When set, programmatic items are created in the light DOM.
           * Setting to `null` or `undefined` clears programmatic items.
           *
           * @type {Array<{text: string, path?: string, current?: boolean}> | null | undefined}
           */
          items: {
            type: Array,
          },

          /**
           * A callback function that is called when navigating to a breadcrumb item.
           * Receives an object with `{ path, current, originalEvent }`.
           * When set, the default link action is prevented unless the callback returns `false`.
           * When not set, a `navigate` CustomEvent is dispatched instead.
           *
           * @type {function(Object): boolean | undefined}
           */
          onNavigate: {
            attribute: false,
          },

          /**
           * A change to this property triggers a `breadcrumb-location-changed` window event.
           * The specific value is irrelevant; any change dispatches the event.
           * Useful for notifying the breadcrumb about route changes in client-side routing.
           *
           * @type {any}
           */
          location: {
            observer: '__locationChanged',
          },

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
        /** @type {Array<Element>} @private */
        this.__programmaticItems = [];

        this.addEventListener('click', (e) => this.__onClick(e));
      }

      /** @protected */
      updated(props) {
        super.updated(props);

        if (props.has('items')) {
          this.__updateProgrammaticItems();
        }
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
       * Create or remove programmatic breadcrumb-item elements based on the `items` property.
       * @private
       */
      __updateProgrammaticItems() {
        // Remove old programmatic items
        this.__programmaticItems.forEach((item) => item.remove());
        this.__programmaticItems = [];

        const items = this.items;
        if (!items || !items.length) {
          return;
        }

        // Create new items
        items.forEach((itemData) => {
          const el = document.createElement('vaadin-breadcrumb-item');
          el.textContent = itemData.text || '';
          if (itemData.path != null) {
            el.setAttribute('path', itemData.path);
          }
          if (itemData.current) {
            el.setAttribute('current', '');
          }
          this.__programmaticItems.push(el);
          this.appendChild(el);
        });
      }

      /** @private */
      __locationChanged() {
        window.dispatchEvent(new CustomEvent('breadcrumb-location-changed'));
      }

      /** @private */
      __onClick(e) {
        const hasModifier = e.metaKey || e.shiftKey || e.ctrlKey;
        if (hasModifier) {
          return;
        }

        const composedPath = e.composedPath();
        const item = composedPath.find((el) => el.localName && el.localName === 'vaadin-breadcrumb-item');
        const anchor = composedPath.find((el) => el instanceof HTMLAnchorElement);
        if (!item || !anchor || !item.shadowRoot.contains(anchor)) {
          return;
        }

        // Skip current items (no navigation needed)
        if (item.current) {
          return;
        }

        // Skip items without a path
        if (item.path == null) {
          return;
        }

        // Skip external links
        const isRelative = anchor.href && anchor.href.startsWith(location.origin);
        if (!isRelative) {
          return;
        }

        const detail = {
          path: item.path,
          current: item.current,
          originalEvent: e,
        };

        if (this.onNavigate) {
          const result = this.onNavigate(detail);
          if (result !== false) {
            e.preventDefault();
          }
        } else {
          this.dispatchEvent(
            new CustomEvent('navigate', {
              detail,
              bubbles: true,
              composed: true,
            }),
          );
          e.preventDefault();
        }
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
