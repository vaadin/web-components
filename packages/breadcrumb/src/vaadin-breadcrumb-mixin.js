/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-breadcrumb-item.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';

/**
 * A mixin providing common breadcrumb functionality.
 *
 * @polymerMixin
 * @mixes ResizeMixin
 */
export const BreadcrumbMixin = (superClass) =>
  class BreadcrumbMixinClass extends ResizeMixin(superClass) {
    static get properties() {
      return {
        /**
         * Accessible label for the breadcrumb navigation landmark.
         * Applied as `aria-label` on the host element.
         */
        label: {
          type: String,
        },

        /**
         * Data-driven items as an alternative to slotted children.
         * Each item is an object with `text` (required), `path` (optional),
         * and `disabled` (optional) properties.
         *
         * When set, generates `<vaadin-breadcrumb-item>` elements as light DOM children.
         * Setting to `null` or `undefined` removes the generated items.
         *
         * @type {Array<{text: string, path?: string, disabled?: boolean}> | undefined}
         */
        items: {
          type: Array,
        },
      };
    }

    constructor() {
      super();

      /** @private */
      this.__overflowItems = [];
    }

    /**
     * Override to observe parent element resize as well.
     * @protected
     * @override
     */
    get _observeParent() {
      return true;
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'navigation');
      }

      // Observe slot changes to update aria-current and overflow
      const slot = this.shadowRoot.querySelector('slot:not([name])');
      if (slot) {
        slot.addEventListener('slotchange', () => {
          this.__updateAriaCurrent();
          this.__detectOverflow();
        });
      }
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('label')) {
        if (this.label) {
          this.setAttribute('aria-label', this.label);
        } else {
          this.removeAttribute('aria-label');
        }
      }

      if (props.has('items')) {
        this.__renderItems();
      }
    }

    /**
     * Callback from ResizeMixin when the element or parent is resized.
     * @protected
     * @override
     */
    _onResize() {
      this.__detectOverflow();
    }

    /**
     * Priority-based overflow detection.
     *
     * Priority order (highest first): current page (last), parent (second-to-last),
     * root (first), then remaining ancestors from the end.
     *
     * Collapse sequence for items [0,1,2,3,4]:
     * 1. All visible:       0 1 2 3 4
     * 2. Hide middle:       0 ... 3 4    (hide 1,2)
     * 3. Hide parent too:   0 ... 4      (hide 1,2,3)
     * 4. Hide root too:     ... 4        (hide 0,1,2,3)
     *
     * The overflow "..." button is placed after the root item (using CSS order).
     *
     * @private
     */
    __detectOverflow() {
      const items = this.__getItems();
      if (items.length === 0) {
        return;
      }

      const overflowLi = this.shadowRoot.querySelector('[part="overflow"]');
      if (!overflowLi) {
        return;
      }

      const list = this.shadowRoot.querySelector('[part="list"]');
      if (!list) {
        return;
      }

      // Reset: show all items, hide overflow, clear CSS orders and flex
      items.forEach((item) => {
        item.removeAttribute('hidden');
        item.style.removeProperty('display');
        item.style.removeProperty('order');
        item.style.removeProperty('flex-shrink');
      });
      overflowLi.hidden = true;
      overflowLi.style.removeProperty('order');
      this.__overflowItems = [];

      // Measure the natural (unshrunk) total width of all items.
      const availableWidth = list.clientWidth;
      const gap = parseFloat(getComputedStyle(list).gap) || 0;

      // Temporarily prevent shrinking to get true natural widths
      items.forEach((item) => {
        item.style.flexShrink = '0';
        item.style.minWidth = 'auto';
      });
      const naturalWidth = this.__sumNaturalWidths(items, gap);
      items.forEach((item) => {
        item.style.removeProperty('flex-shrink');
        item.style.removeProperty('min-width');
      });

      // Check if overflow is needed
      if (naturalWidth <= availableWidth) {
        this.__updatePopoverItems();
        return;
      }

      // We need to collapse. Try each level progressively.
      const collapseLevels = this.__buildCollapseLevels(items);

      for (const hiddenIndices of collapseLevels) {
        // Apply this level: hide items at hiddenIndices, show overflow button
        items.forEach((item, index) => {
          if (hiddenIndices.includes(index)) {
            item.setAttribute('hidden', '');
            item.style.display = 'none';
          } else {
            item.removeAttribute('hidden');
            item.style.removeProperty('display');
          }
        });

        // Position the overflow button using CSS order.
        // It goes after the root item (index 0) when root is visible,
        // or at the very start when root is also hidden.
        const rootHidden = hiddenIndices.includes(0);

        if (rootHidden) {
          // All ancestors hidden: "... / current"
          overflowLi.style.order = '-1';
        } else {
          // Root visible: "root / ... / [parent /] current"
          items[0].style.order = '0';
          overflowLi.style.order = '1';
          let orderCounter = 2;
          for (let i = 1; i < items.length; i += 1) {
            if (!hiddenIndices.includes(i)) {
              items[i].style.order = String(orderCounter);
              orderCounter += 1;
            }
          }
        }

        overflowLi.hidden = false;
        this.__overflowItems = hiddenIndices.map((i) => items[i]);

        // Measure whether this collapse level fits using natural widths
        const visibleItems = items.filter((_, idx) => !hiddenIndices.includes(idx));
        visibleItems.forEach((item) => {
          item.style.flexShrink = '0';
          item.style.minWidth = 'auto';
        });
        overflowLi.style.flexShrink = '0';
        const visibleCount = visibleItems.length + 1; // +1 for overflow button
        const overflowWidth = overflowLi.getBoundingClientRect().width;
        const visibleWidths = visibleItems.reduce((sum, item) => sum + item.getBoundingClientRect().width, 0);
        const totalNeeded = visibleWidths + overflowWidth + gap * (visibleCount - 1);
        const fits = totalNeeded <= availableWidth;
        visibleItems.forEach((item) => {
          item.style.removeProperty('flex-shrink');
          item.style.removeProperty('min-width');
        });
        overflowLi.style.removeProperty('flex-shrink');

        if (fits) {
          break;
        }
      }

      this.__updatePopoverItems();
    }

    /**
     * Builds progressive collapse levels, hiding one item at a time.
     *
     * Priority order (highest = hidden last): current > parent > root > rest.
     * Among "rest" items (between root and parent), items closer to current
     * have higher priority — so we hide from root-side first.
     *
     * For items [0, 1, 2, 3, 4]:
     * Level 1: hide [1]          → root(0), ..., Widgets(2), parent(3), current(4)
     * Level 2: hide [1, 2]       → root(0), ..., parent(3), current(4)
     * Level 3: hide [1, 2, 3]    → root(0), ..., current(4)
     * Level 4: hide [0, 1, 2, 3] → ..., current(4)
     *
     * @private
     * @param {Array<Element>} items
     * @return {Array<Array<number>>}
     */
    __buildCollapseLevels(items) {
      const count = items.length;
      if (count <= 1) {
        return [];
      }

      if (count === 2) {
        // Only option: hide the first item (root)
        return [[0]];
      }

      const levels = [];
      const lastIndex = count - 1;

      // Progressively hide middle items one at a time, starting from index 1
      // (closest to root = lowest priority among middle items)
      const hidden = [];
      for (let i = 1; i <= lastIndex - 2; i += 1) {
        hidden.push(i);
        levels.push([...hidden]);
      }

      // Next: also hide the parent (second-to-last)
      if (lastIndex >= 2) {
        hidden.push(lastIndex - 1);
        levels.push([...hidden]);
      }

      // Finally: hide root too (everything except current)
      levels.push([...Array(lastIndex).keys()]);

      return levels;
    }

    /**
     * Updates the popover content with the currently hidden items.
     * @private
     */
    __updatePopoverItems() {
      const popover = this.shadowRoot.querySelector('vaadin-popover');
      if (!popover) {
        return;
      }

      const overflowBtn = this.shadowRoot.querySelector('#overflow-btn');

      if (this.__overflowItems.length === 0) {
        popover.opened = false;
        if (overflowBtn) {
          overflowBtn.setAttribute('aria-expanded', 'false');
        }
        return;
      }

      popover.renderer = (root) => {
        root.innerHTML = '';
        const list = document.createElement('div');
        list.setAttribute('role', 'list');

        this.__overflowItems.forEach((item) => {
          const div = document.createElement('div');
          div.setAttribute('role', 'listitem');
          div.setAttribute('part', 'overflow-item');
          div.style.padding = '0.25em 0.5em';

          if (item.path != null) {
            const link = document.createElement('a');
            link.href = item.path;
            link.textContent = item.textContent.trim();
            link.style.color = 'inherit';
            link.style.textDecoration = 'none';
            link.addEventListener('click', () => {
              popover.opened = false;
            });
            link.addEventListener('mouseenter', () => {
              link.style.textDecoration = 'underline';
            });
            link.addEventListener('mouseleave', () => {
              link.style.textDecoration = 'none';
            });
            div.appendChild(link);
          } else {
            const span = document.createElement('span');
            span.textContent = item.textContent.trim();
            div.appendChild(span);
          }

          list.appendChild(div);
        });

        root.appendChild(list);
      };
    }

    /**
     * Toggle the overflow popover.
     * @private
     */
    __toggleOverflowPopover() {
      const popover = this.shadowRoot.querySelector('vaadin-popover');
      if (popover) {
        popover.opened = !popover.opened;
        const overflowBtn = this.shadowRoot.querySelector('#overflow-btn');
        if (overflowBtn) {
          overflowBtn.setAttribute('aria-expanded', String(popover.opened));
        }
      }
    }

    /**
     * Generates breadcrumb-item elements from the items array.
     * Removes previously generated items and creates new ones.
     * @private
     */
    __renderItems() {
      // Remove previously generated items
      this.querySelectorAll('vaadin-breadcrumb-item[data-generated]').forEach((el) => el.remove());

      if (!this.items || !Array.isArray(this.items)) {
        return;
      }

      this.items.forEach((itemData) => {
        const el = document.createElement('vaadin-breadcrumb-item');
        el.setAttribute('data-generated', '');
        el.textContent = itemData.text || '';

        if (itemData.path != null) {
          el.path = itemData.path;
        }

        if (itemData.disabled) {
          el.disabled = true;
        }

        this.appendChild(el);
      });
    }

    /**
     * Sets `aria-current="page"` on the last breadcrumb item if it has no path.
     * @private
     */
    __updateAriaCurrent() {
      const items = this.__getItems();
      items.forEach((item, index) => {
        if (index === items.length - 1 && item.path == null) {
          item.setAttribute('aria-current', 'page');
        } else {
          item.removeAttribute('aria-current');
        }
      });
    }

    /**
     * Sum the natural widths of items plus gaps.
     * Uses getBoundingClientRect for accurate sub-pixel measurement.
     * @private
     * @param {Array<Element>} items
     * @param {number} gap
     * @return {number}
     */
    __sumNaturalWidths(items, gap) {
      const total = items.reduce((sum, item) => sum + item.getBoundingClientRect().width, 0);
      return total + gap * Math.max(0, items.length - 1);
    }

    /**
     * Returns all slotted breadcrumb items.
     * @private
     * @return {Array<Element>}
     */
    __getItems() {
      const slot = this.shadowRoot.querySelector('slot:not([name])');
      if (!slot) {
        return [];
      }
      return slot.assignedElements().filter((el) => el.tagName.toLowerCase() === 'vaadin-breadcrumb-item');
    }
  };
