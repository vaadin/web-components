/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-breadcrumb-item.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { breadcrumbStyles } from './styles/vaadin-breadcrumb-base-styles.js';

/**
 * `<vaadin-breadcrumb>` is a Web Component for displaying breadcrumb navigation trails.
 *
 * Items are shown in priority order based on available width:
 * current page (always), parent, root, then remaining ancestors.
 * Hidden items are accessible via an overflow popover.
 *
 * ```html
 * <vaadin-breadcrumb>
 *   <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
 * </vaadin-breadcrumb>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name    | Description
 * -------------|-------------
 * `list`       | The ordered list element
 * `overflow`   | The overflow/ellipsis button
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `has-overflow`  | Set when some items are hidden due to overflow.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                           | Description
 * :---------------------------------------------|:-------------
 * `--vaadin-breadcrumb-separator-symbol`         | Separator character/icon
 * `--vaadin-breadcrumb-separator-color`          | Separator color
 * `--vaadin-breadcrumb-separator-size`           | Separator font size
 * `--vaadin-breadcrumb-separator-gap`            | Space around separator
 * `--vaadin-breadcrumb-separator-font-family`    | Separator font family
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-breadcrumb
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes ResizeMixin
 */
class Breadcrumb extends ResizeMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-breadcrumb';
  }

  static get styles() {
    return breadcrumbStyles;
  }

  static get properties() {
    return {
      /**
       * Data-driven items as an alternative to slotted children.
       * Each item should have a `text` property and optionally `href` and `disabled`.
       *
       * @type {Array<{text: string, href?: string, disabled?: boolean}>}
       */
      items: {
        type: Array,
        attribute: false,
      },

      /**
       * The accessible label for the navigation landmark.
       *
       * @attr {string} label
       */
      label: {
        type: String,
        value: 'Breadcrumb',
      },
    };
  }

  constructor() {
    super();

    this.__boundOnSlotChange = this.__onSlotChange.bind(this);
    this.__overflowItems = [];
    this.__popoverOpened = false;
    this.__itemsResizeObserver = new ResizeObserver(() => {
      this.__updateOverflow();
    });
  }

  /** @protected */
  render() {
    return html`
      <nav aria-label="${this.label}">
        <ol part="list">
          <li style="display:contents">
            <button
              part="overflow"
              aria-haspopup="true"
              aria-expanded="${this.__popoverOpened ? 'true' : 'false'}"
              aria-label="Show hidden items"
              @click="${this.__onOverflowClick}"
              @keydown="${this.__onOverflowKeydown}"
            >
              &hellip;
            </button>
          </li>
          <slot @slotchange="${this.__boundOnSlotChange}"></slot>
        </ol>
      </nav>
      ${this.__popoverOpened
        ? html`
            <div
              id="overflow-popover"
              part="overflow-popover"
              role="menu"
              style="
                position: fixed;
                z-index: 10000;
                background: var(--vaadin-breadcrumb-popover-background, var(--vaadin-background-color, #fff));
                border: 1px solid var(--vaadin-breadcrumb-popover-border-color, var(--vaadin-border-color-secondary, #e0e0e0));
                border-radius: var(--vaadin-breadcrumb-popover-border-radius, var(--vaadin-radius-m, 8px));
                box-shadow: var(--vaadin-breadcrumb-popover-shadow, 0 2px 8px rgba(0,0,0,0.15));
                padding: var(--vaadin-breadcrumb-popover-padding, var(--vaadin-padding-xs, 4px));
                min-width: 120px;
              "
              @keydown="${this.__onPopoverKeydown}"
            >
              ${this.__overflowItems.map(
                (item) => html`
                  <a
                    part="overflow-item"
                    role="menuitem"
                    href="${item.href || ''}"
                    tabindex="-1"
                    style="
                      display: block;
                      padding: var(--vaadin-breadcrumb-popover-item-padding, 6px 12px);
                      text-decoration: none;
                      color: var(--vaadin-breadcrumb-link-color, var(--vaadin-text-color-link, inherit));
                      border-radius: var(--vaadin-radius-s, 4px);
                      white-space: nowrap;
                      cursor: pointer;
                    "
                    @mouseenter="${this.__onPopoverItemMouseenter}"
                  >
                    ${item.text}
                  </a>
                `,
              )}
            </div>
          `
        : ''}
    `;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'navigation');
    }
  }

  /** @protected */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('items')) {
      this.__renderItems();
    }

    if (this.__popoverOpened) {
      this.__positionPopover();
    }
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    // Close popover on outside click
    this.__boundClosePopover = (e) => {
      if (this.__popoverOpened && !this.contains(e.target) && !this.shadowRoot.contains(e.target)) {
        this.__closePopover();
      }
    };
    document.addEventListener('click', this.__boundClosePopover, true);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.__boundClosePopover, true);
    this.__itemsResizeObserver.disconnect();
  }

  /**
   * @protected
   * @override
   */
  _onResize() {
    this.__updateOverflow();
  }

  /** @private */
  get __slottedItems() {
    const slot = this.shadowRoot && this.shadowRoot.querySelector('slot:not([name])');
    if (!slot) {
      return [];
    }
    return [...slot.assignedElements()].filter((el) => el.localName === 'vaadin-breadcrumb-item');
  }

  /** @private */
  __onSlotChange() {
    // Observe size changes on items
    this.__itemsResizeObserver.disconnect();
    this.__slottedItems.forEach((item) => {
      this.__itemsResizeObserver.observe(item);
    });

    // Mark the last item
    this.__markLastItem();

    // Defer overflow calculation to ensure items have rendered their shadow DOMs.
    // Run twice: once quickly, and once after external theme stylesheets load.
    requestAnimationFrame(() => {
      this.__updateOverflow();
    });
    setTimeout(() => {
      this.__updateOverflow();
    }, 200);
  }

  /** @private */
  __renderItems() {
    if (!this.items || !Array.isArray(this.items)) {
      return;
    }

    // Remove previously generated items
    this.querySelectorAll('vaadin-breadcrumb-item[data-generated]').forEach((el) => el.remove());

    // Generate new items
    this.items.forEach((itemData) => {
      const el = document.createElement('vaadin-breadcrumb-item');
      el.textContent = itemData.text;
      if (itemData.href != null) {
        el.href = itemData.href;
      }
      if (itemData.disabled) {
        el.disabled = true;
      }
      el.setAttribute('data-generated', '');
      this.appendChild(el);
    });
  }

  /**
   * Priority-based overflow algorithm.
   *
   * Visibility priority (highest to lowest):
   * 1. Current item (last) — always visible
   * 2. Root (first)
   * 3. Parent (second-to-last)
   * 4. Grandparent (third-to-last)
   * 5. Remaining ancestors, closest-to-current outward
   *
   * @private
   */
  __updateOverflow() {
    if (this.__updatingOverflow) {
      return;
    }
    this.__updatingOverflow = true;

    const items = this.__slottedItems;
    if (items.length === 0) {
      this.removeAttribute('has-overflow');
      this.__updatingOverflow = false;
      return;
    }

    // Remove overflow state and show all items synchronously via attributes
    this.removeAttribute('has-overflow');
    items.forEach((item) => {
      item.removeAttribute('overflow-hidden');
    });

    // Get the container width
    const availableWidth = this.offsetWidth;
    if (availableWidth === 0) {
      this.__updatingOverflow = false;
      return;
    }

    // Get the list element
    const listEl = this.shadowRoot.querySelector('[part="list"]');
    if (!listEl) {
      this.__updatingOverflow = false;
      return;
    }

    // The list has overflow:hidden and nowrap, so scrollWidth gives us the natural total
    const totalWidth = listEl.scrollWidth;

    if (totalWidth <= availableWidth) {
      // Everything fits — no overflow needed
      this.__overflowItems = [];
      this.__updatingOverflow = false;
      return;
    }

    // Need to measure individual items at their natural width.
    // Temporarily make the list very wide so items don't compress.
    const origWidth = listEl.style.width;
    const origOverflow = listEl.style.overflow;
    listEl.style.width = '10000px';
    listEl.style.overflow = 'visible';

    const itemWidths = new Map();
    items.forEach((item) => {
      itemWidths.set(item, item.offsetWidth);
    });

    // Restore
    listEl.style.width = origWidth;
    listEl.style.overflow = origOverflow;

    // Measure the overflow button width
    this.setAttribute('has-overflow', '');
    const overflowBtn = this.shadowRoot.querySelector('[part="overflow"]');
    const overflowWidth = overflowBtn ? overflowBtn.offsetWidth : 30;

    // Build priority order
    const priorityOrder = this.__getPriorityOrder(items);

    // The current item (last) is always visible — never collapse it.
    const currentItem = items[items.length - 1];

    // Greedily add items in priority order.
    // Current item is always first in priority and always added.
    const visibleSet = new Set();
    let usedWidth = overflowWidth; // Reserve space for overflow button

    for (const item of priorityOrder) {
      const itemWidth = itemWidths.get(item);
      if (item === currentItem) {
        // Current item is always visible regardless of width
        visibleSet.add(item);
        usedWidth += itemWidth;
      } else if (usedWidth + itemWidth <= availableWidth) {
        visibleSet.add(item);
        usedWidth += itemWidth;
      }
    }

    // If all items fit (shouldn't happen but safeguard), show all
    if (visibleSet.size === items.length) {
      this.removeAttribute('has-overflow');
      items.forEach((item) => {
        item.removeAttribute('overflow-hidden');
      });
      this.__overflowItems = [];
      this.__updatingOverflow = false;
      return;
    }

    // Apply visibility via direct attribute manipulation for synchronous effect.
    // Also manage CSS order so the ellipsis appears in the correct position:
    // - When root is visible: root appears before ellipsis (order: -1)
    // - Ellipsis always appears after the first visible item, never before it
    const rootIsVisible = visibleSet.has(items[0]);

    items.forEach((item) => {
      if (visibleSet.has(item)) {
        item.removeAttribute('overflow-hidden');
      } else {
        item.setAttribute('overflow-hidden', '');
      }
      // Reset order
      item.style.order = '';
    });

    if (rootIsVisible && items.length > 1) {
      // Place root before the overflow button using CSS order
      items[0].style.order = '-1';
    }

    // Build overflow items list in DOM order (hierarchical)
    this.__overflowItems = items
      .filter((item) => item.hasAttribute('overflow-hidden'))
      .map((item) => ({
        text: item.textContent.trim(),
        href: item.href,
      }));

    this.__updatingOverflow = false;
    this.requestUpdate();
  }

  /** @private */
  __markLastItem() {
    const items = this.__slottedItems;
    items.forEach((item, index) => {
      if (index === items.length - 1) {
        item.setAttribute('last', '');
      } else {
        item.removeAttribute('last');
      }
    });
  }

  /**
   * Get items in priority order for overflow calculation.
   * @private
   */
  __getPriorityOrder(items) {
    if (items.length === 0) {
      return [];
    }
    if (items.length === 1) {
      return [items[0]];
    }

    const priority = [];
    const last = items.length - 1;

    // 1. Current (last item) — highest priority
    priority.push(items[last]);

    // 2. Root (first item)
    if (last >= 1) {
      priority.push(items[0]);
    }

    // 3. Parent (second-to-last)
    if (last >= 2) {
      priority.push(items[last - 1]);
    }

    // 4. Remaining: from closest-to-current outward
    // (third-to-last, fourth-to-last, etc.)
    for (let i = last - 2; i >= 1; i--) {
      priority.push(items[i]);
    }

    return priority;
  }

  /** @private */
  __onOverflowClick() {
    if (this.__popoverOpened) {
      this.__closePopover();
    } else {
      this.__openPopover();
    }
  }

  /** @private */
  __onOverflowKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.__onOverflowClick();
    }
  }

  /** @private */
  __openPopover() {
    this.__popoverOpened = true;
    this.requestUpdate();

    // After render, position and focus first item
    requestAnimationFrame(() => {
      this.__positionPopover();
      const firstItem = this.shadowRoot.querySelector('[part="overflow-popover"] a');
      if (firstItem) {
        firstItem.focus();
      }
    });
  }

  /** @private */
  __closePopover() {
    this.__popoverOpened = false;
    this.requestUpdate();

    // Return focus to overflow button
    const overflowBtn = this.shadowRoot.querySelector('[part="overflow"]');
    if (overflowBtn) {
      overflowBtn.focus();
    }
  }

  /** @private */
  __positionPopover() {
    const popover = this.shadowRoot.querySelector('#overflow-popover');
    const overflowBtn = this.shadowRoot.querySelector('[part="overflow"]');
    if (!popover || !overflowBtn) {
      return;
    }

    const btnRect = overflowBtn.getBoundingClientRect();
    popover.style.top = `${btnRect.bottom + 4}px`;
    popover.style.left = `${btnRect.left}px`;
  }

  /** @private */
  __onPopoverKeydown(event) {
    const popover = this.shadowRoot.querySelector('#overflow-popover');
    if (!popover) {
      return;
    }

    const items = [...popover.querySelectorAll('a')];

    // Find focused item in shadow DOM
    const focused = this.shadowRoot.activeElement;
    const focusedIndex = items.indexOf(focused);

    if (event.key === 'Escape') {
      event.preventDefault();
      this.__closePopover();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = focusedIndex < items.length - 1 ? focusedIndex + 1 : 0;
      if (items[next]) {
        items[next].focus();
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = focusedIndex > 0 ? focusedIndex - 1 : items.length - 1;
      if (items[prev]) {
        items[prev].focus();
      }
    }
  }

  /** @private */
  __onPopoverItemMouseenter(event) {
    event.target.focus();
  }
}

defineCustomElement(Breadcrumb);

export { Breadcrumb };
