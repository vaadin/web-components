/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { html, nothing } from 'lit';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';

/**
 * A mixin providing common breadcrumb functionality.
 *
 * @polymerMixin
 * @mixes I18nMixin
 * @mixes ResizeMixin
 */
export const BreadcrumbMixin = dedupeMixin(
  (superClass) =>
    class BreadcrumbMixinClass extends ResizeMixin(
      I18nMixin({ navigationLabel: 'Breadcrumb', overflow: 'Show hidden ancestors' }, superClass),
    ) {
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
        /** @type {Array<number>} @private */
        this.__collapsedIndices = [];
        /** @type {boolean} @private */
        this.__overflowDropdownOpen = false;

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
          <nav part="nav" aria-label="${this.__effectiveI18n.navigationLabel}">
            <ol part="list">
              ${this.__renderOverflowButton()} ${this.__renderItems()}
            </ol>
          </nav>
          <div style="display: none !important;">
            <slot name="separator" @slotchange="${this.__onSeparatorSlotChange}"></slot>
          </div>
        `;
      }

      /**
       * Render the overflow button `<li>`.
       * @private
       */
      __renderOverflowButton() {
        return html`
          <li data-overflow>
            <button
              part="overflow-button"
              aria-label="${this.__effectiveI18n.overflow}"
              @click="${this.__onOverflowButtonClick}"
            >
              &hellip;
            </button>
            <span part="overflow-separator" aria-hidden="true" ?default-separator="${!this.__separatorNode}"
              >${this.__getSeparatorContent()}</span
            >
          </li>
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
          const isDefault = !this.__separatorNode;
          result.push(html`
            <li data-index="${i}">
              <slot name="item-${i}"></slot>${!isLast
                ? html`<span part="separator" aria-hidden="true" ?default-separator="${isDefault}"
                    >${this.__getSeparatorContent()}</span
                  >`
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

        // Re-run overflow after items change
        this.__scheduleOverflow();
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

      // --- Overflow logic ---

      /**
       * Implement callback from `ResizeMixin`.
       * @protected
       * @override
       */
      _onResize() {
        this.__scheduleOverflow();
      }

      /** @private */
      __scheduleOverflow() {
        // Use requestAnimationFrame to batch overflow detection
        if (this.__overflowScheduled) {
          return;
        }
        this.__overflowScheduled = true;
        requestAnimationFrame(() => {
          this.__overflowScheduled = false;
          if (this.isConnected) {
            this.__detectOverflow();
          }
        });
      }

      /** @private */
      __detectOverflow() {
        const ol = this.shadowRoot.querySelector('[part="list"]');
        if (!ol) {
          return;
        }

        const count = this._items.length;
        if (count === 0) {
          return;
        }

        // Get all item <li> elements (not the overflow <li>)
        const itemLis = ol.querySelectorAll('li[data-index]');

        // Step 1: Restore all items to visible
        itemLis.forEach((li) => {
          li.removeAttribute('collapsed');
          li.classList.remove('current-truncated');
        });

        // Remove title from current item
        const lastItem = this._items[count - 1];
        if (lastItem) {
          lastItem.removeAttribute('title');
        }

        this.__collapsedIndices = [];
        this.removeAttribute('overflow');

        // Close dropdown if open
        this.__closeOverflowDropdown();

        // Check if overflow is needed: compare scrollWidth to offsetWidth
        // We need to use the host element width as the constraint
        const hostWidth = this.offsetWidth;
        if (hostWidth === 0) {
          return;
        }

        if (ol.scrollWidth <= hostWidth) {
          // Everything fits, no overflow needed
          return;
        }

        // Step 2: Show overflow button and start collapsing
        this.setAttribute('overflow', '');

        // Intermediate items are indices 1..count-2 (between root=0 and current=count-1)
        // Collapse starting from the one closest to root (index 1, then 2, etc.)
        const lastIndex = count - 1;

        for (let i = 1; i < lastIndex; i++) {
          if (ol.scrollWidth <= hostWidth) {
            break;
          }
          itemLis[i].setAttribute('collapsed', '');
          this.__collapsedIndices.push(i);
        }

        // If still doesn't fit, collapse root too
        if (ol.scrollWidth > hostWidth && count > 1) {
          itemLis[0].setAttribute('collapsed', '');
          this.__collapsedIndices.push(0);
        }

        // If STILL doesn't fit (only current item + overflow button), truncate current
        if (ol.scrollWidth > hostWidth) {
          const lastLi = itemLis[lastIndex];
          if (lastLi) {
            lastLi.classList.add('current-truncated');
            // Set title for hover reveal
            if (lastItem) {
              lastItem.setAttribute('title', lastItem.textContent.trim());
            }
          }
        }
      }

      /** @private */
      __onOverflowButtonClick(e) {
        e.stopPropagation();
        if (this.__overflowDropdownOpen) {
          this.__closeOverflowDropdown();
        } else {
          this.__openOverflowDropdown();
        }
      }

      /** @private */
      __openOverflowDropdown() {
        if (this.__collapsedIndices.length === 0) {
          return;
        }

        this.__overflowDropdownOpen = true;

        // Create dropdown element
        const dropdown = document.createElement('ul');
        dropdown.setAttribute('part', 'overflow-dropdown');

        // Sort collapsed indices in hierarchy order (ascending)
        const sortedIndices = [...this.__collapsedIndices].sort((a, b) => a - b);

        sortedIndices.forEach((idx) => {
          const item = this._items[idx];
          if (!item) {
            return;
          }
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.textContent = item.textContent.trim();
          a.href = item.path || '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            this.__closeOverflowDropdown();
            this.__navigateFromOverflow(item, e);
          });
          li.appendChild(a);
          dropdown.appendChild(li);
        });

        // Position the dropdown below the overflow button
        const overflowButton = this.shadowRoot.querySelector('[part="overflow-button"]');
        const rect = overflowButton.getBoundingClientRect();
        const hostRect = this.getBoundingClientRect();

        dropdown.style.position = 'absolute';
        dropdown.style.top = `${rect.bottom - hostRect.top}px`;
        dropdown.style.left = `${rect.left - hostRect.left}px`;

        // Add backdrop click handler
        this.__dropdownBackdropHandler = (e) => {
          if (!dropdown.contains(e.target)) {
            this.__closeOverflowDropdown();
          }
        };
        setTimeout(() => {
          document.addEventListener('click', this.__dropdownBackdropHandler);
        }, 0);

        this.__overflowDropdown = dropdown;
        this.shadowRoot.appendChild(dropdown);
      }

      /** @private */
      __closeOverflowDropdown() {
        if (this.__overflowDropdown) {
          this.__overflowDropdown.remove();
          this.__overflowDropdown = null;
        }
        if (this.__dropdownBackdropHandler) {
          document.removeEventListener('click', this.__dropdownBackdropHandler);
          this.__dropdownBackdropHandler = null;
        }
        this.__overflowDropdownOpen = false;
      }

      /** @private */
      __navigateFromOverflow(item, originalEvent) {
        if (item.current) {
          return;
        }

        if (item.path == null) {
          return;
        }

        const detail = {
          path: item.path,
          current: item.current || false,
          originalEvent,
        };

        if (this.onNavigate) {
          const result = this.onNavigate(detail);
          if (result !== false) {
            originalEvent.preventDefault();
          }
        } else {
          this.dispatchEvent(
            new CustomEvent('navigate', {
              detail,
              bubbles: true,
              composed: true,
            }),
          );
        }
      }
    },
);
