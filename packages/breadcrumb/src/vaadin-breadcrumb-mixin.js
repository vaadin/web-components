/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';
import { matchPaths } from '@vaadin/component-base/src/url-utils.js';
import { location } from './location.js';

/**
 * A controller that manages the default slot for breadcrumb items.
 * @private
 */
class ItemsController extends SlotController {
  constructor(host) {
    super(host, '', null, { observe: true, multiple: true });
  }

  /** @protected @override */
  initAddedNode() {
    this.host.requestUpdate();
  }

  /** @protected @override */
  teardownNode() {
    this.host.requestUpdate();
  }
}

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
         * Callback function for router integration.
         *
         * When a breadcrumb item link is clicked, this function is called and the default click
         * action is cancelled. This delegates the responsibility of navigation to the function's logic.
         *
         * The click event action is not cancelled in the following cases:
         * - The click event has a modifier (e.g. `metaKey`, `shiftKey`)
         * - The click event is on an external link
         * - The click event is on an item with `[router-ignore]` attribute
         * - The function explicitly returns `false`
         *
         * The function receives an object with the properties of the clicked breadcrumb item:
         * - `path`: The path of the breadcrumb item.
         * - `current`: A boolean indicating whether the breadcrumb item is currently selected.
         * - `originalEvent`: The original DOM event that triggered the navigation.
         *
         * Also see the `location` property for updating the current breadcrumb item on route change.
         *
         * @type {function(Object): boolean | undefined}
         */
        onNavigate: {
          attribute: false,
        },

        /**
         * A change to this property triggers an update of the current item in the breadcrumb.
         * While it typically corresponds to the browser's URL, the specific value assigned to
         * the property is irrelevant. The component has its own internal logic for determining
         * which item is current.
         *
         * The main use case for this property is when the breadcrumb is used with a client-side
         * router. In this case, the component needs to be informed about route changes so it
         * can update the current item.
         *
         * @type {any}
         */
        location: {
          attribute: false,
        },

        /**
         * Programmatic item definition. When set to an array, generates
         * `<vaadin-breadcrumb-item>` elements in light DOM, replacing any
         * previously generated items. When set to `null` or `undefined`,
         * generated items are removed.
         *
         * @type {Array<{label: string, path?: string, disabled?: boolean}> | null | undefined}
         */
        items: {
          type: Array,
          attribute: false,
        },

        /**
         * The object used to localize this component.
         * To change the default localization, replace the entire `i18n` object with a
         * custom one, providing all expected properties.
         *
         * The object has the following JSON structure and default values:
         * ```
         * {
         *   overflow: 'Show more'
         * }
         * ```
         *
         * @type {{ overflow?: string }}
         */
        i18n: {
          type: Object,
          attribute: false,
        },

        /**
         * Whether the component is in mobile mode (container too narrow for
         * the minimum layout of first item + overflow button + last item).
         *
         * @type {boolean}
         * @private
         */
        __mobile: {
          type: Boolean,
          attribute: false,
        },
      };
    }

    constructor() {
      super();

      this._itemsController = new ItemsController(this);
      this.__boundUpdateCurrent = this.__updateCurrentItems.bind(this);

      this.addEventListener('click', this.__onClick);

      /** @type {Element | undefined} @private */
      this.__customSeparatorNode = undefined;

      /** @type {{ overflow?: string }} */
      this.i18n = { overflow: 'Show more' };

      /** @type {boolean} @private */
      this.__overlayOpened = false;

      /** @type {boolean} @private */
      this.__mobile = false;
    }

    /**
     * List of breadcrumb items managed by the slot controller.
     * @protected
     * @return {!Array<!HTMLElement>}
     */
    get _items() {
      return this._itemsController.nodes.filter(
        (node) => node.nodeType === Node.ELEMENT_NODE && node.localName === 'vaadin-breadcrumb-item',
      );
    }

    /** @protected */
    render() {
      if (this.__mobile) {
        const parent = this.__getParentItem();
        return html`
          <a part="back-link" id="back-link" href="${ifDefined(parent ? parent.path : undefined)}">
            <span part="back-arrow" aria-hidden="true"></span>
            ${parent ? parent.textContent.trim() : ''}
          </a>
          <div hidden>
            <slot id="items"></slot>
            <slot name="separator" id="separator-slot"></slot>
          </div>
        `;
      }

      return html`
        <div part="list" role="list" id="list">
          <slot id="items"></slot>
          <div id="overflow" role="listitem" hidden>
            <span class="separator" aria-hidden="true"></span>
            <button
              part="overflow-button"
              aria-haspopup="true"
              aria-expanded="${this.__overlayOpened ? 'true' : 'false'}"
              aria-label="${ifDefined(this.i18n && this.i18n.overflow ? this.i18n.overflow : undefined)}"
              tabindex="0"
              @click="${this.__onOverflowButtonClick}"
              @keydown="${this.__onOverflowButtonKeydown}"
            >
              &hellip;
            </button>
          </div>
        </div>
        <div hidden aria-hidden="true">
          <slot name="separator" id="separator-slot"></slot>
        </div>
        <vaadin-breadcrumb-overlay
          id="overlay"
          .positionTarget="${this.__overflowButton}"
          .opened="${this.__overlayOpened}"
          no-vertical-overlap
          @vaadin-overlay-escape-press="${this.__onOverlayEscapePress}"
          @vaadin-overlay-outside-press="${this.__onOverlayOutsidePress}"
          @vaadin-overlay-close="${this.__onOverlayClose}"
        ></vaadin-breadcrumb-overlay>
      `;
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      window.addEventListener('popstate', this.__boundUpdateCurrent);
      window.addEventListener('vaadin-navigated', this.__boundUpdateCurrent);
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      window.removeEventListener('popstate', this.__boundUpdateCurrent);
      window.removeEventListener('vaadin-navigated', this.__boundUpdateCurrent);

      if (this.__resizeObserver) {
        this.__resizeObserver.disconnect();
      }
    }

    /**
     * @return {HTMLButtonElement | undefined}
     * @private
     */
    get __overflowButton() {
      return this.shadowRoot && this.shadowRoot.querySelector('[part="overflow-button"]');
    }

    /**
     * @return {HTMLElement | undefined}
     * @private
     */
    get __overflowContainer() {
      return this.shadowRoot && this.shadowRoot.querySelector('#overflow');
    }

    /**
     * @return {HTMLElement | undefined}
     * @private
     */
    get __overlay() {
      return this.shadowRoot && this.shadowRoot.querySelector('#overlay');
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      // Set default role and aria-label if not provided
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'navigation');
      }
      if (!this.hasAttribute('aria-label')) {
        this.setAttribute('aria-label', 'Breadcrumb');
      }

      this.addController(this._itemsController);

      // Listen for slotchange on the items slot to handle reorders.
      // ItemsController handles additions and removals, but not moves.
      // When items are reordered, we sync the controller's nodes and re-render.
      const itemsSlot = this.shadowRoot.querySelector('#items');
      itemsSlot.addEventListener('slotchange', () => {
        const assigned = itemsSlot.assignedNodes({ flatten: true });
        this._itemsController.nodes = assigned.filter(
          (node) => node.nodeType === Node.ELEMENT_NODE && !node.hasAttribute('data-slot-ignore'),
        );
        this.requestUpdate();
      });

      // Observe the separator named slot for custom separator content
      const separatorSlot = this.shadowRoot.querySelector('#separator-slot');
      this.__separatorSlotObserver = new SlotObserver(separatorSlot, ({ currentNodes }) => {
        const separatorNode = currentNodes.filter((node) => node.nodeType === Node.ELEMENT_NODE)[0];
        this.__customSeparatorNode = separatorNode || undefined;
        this.__distributeSeparators();
        this.__updateOverflowSeparator();
      });

      // Set up a ResizeObserver on the host element for overflow detection.
      // We observe the host rather than the list so that resize events are
      // detected even in mobile mode (where the list element is not rendered).
      this.__resizeObserver = new ResizeObserver(() => {
        this.__detectOverflow();
      });
      this.__resizeObserver.observe(this);

      // Update the overflow button separator if there is already a custom separator
      this.__updateOverflowSeparator();
    }

    /**
     * @protected
     * @override
     */
    updated(props) {
      super.updated(props);

      if (props.has('items')) {
        this.__generateItems();
      }

      if (props.has('location')) {
        this.__updateCurrentItems();
      }

      // Re-evaluate current items and separators whenever the slot content changes
      this.__updateCurrentItems();
      this.__updateFirstAttribute();
      this.__distributeSeparators();
      this.__detectOverflow();
    }

    /**
     * Generates `<vaadin-breadcrumb-item>` elements from the `items` array.
     * Previously generated items are removed before new ones are created.
     * When `items` is null or undefined, all generated items are removed.
     *
     * @private
     */
    __generateItems() {
      // Remove previously generated items
      this.querySelectorAll('vaadin-breadcrumb-item[data-breadcrumb-generated]').forEach((item) => {
        this.removeChild(item);
      });

      if (!this.items) {
        return;
      }

      this.items.forEach((entry) => {
        const item = document.createElement('vaadin-breadcrumb-item');
        item.textContent = entry.label;
        item.setAttribute('data-breadcrumb-generated', '');

        if (entry.path != null) {
          item.path = entry.path;
        }

        if (entry.disabled) {
          item.disabled = true;
        }

        this.appendChild(item);
      });
    }

    /**
     * Evaluates which breadcrumb item should be marked as current.
     *
     * Algorithm:
     * 1. If any item has no `path`, that item is the current page.
     * 2. If all items have a `path`, match each item's `path` against the browser URL.
     *    The last matching item becomes current.
     * 3. If no item matches, no item is current.
     *
     * @private
     */
    __updateCurrentItems() {
      const items = this._items;
      if (items.length === 0) {
        return;
      }

      // Step 1: If any item has no path, that item is the current page
      const noPathItem = items.find((item) => item.path == null);
      if (noPathItem) {
        items.forEach((item) => {
          item._setCurrent(item === noPathItem);
        });
        return;
      }

      // Step 2: All items have a path, match against browser URL
      const browserPath = `${location.pathname}${location.search}`;
      let lastMatch = null;
      for (const item of items) {
        if (matchPaths(browserPath, item.path)) {
          lastMatch = item;
        }
      }

      // Step 3: Update current state — if no match, no item is current
      items.forEach((item) => {
        item._setCurrent(item === lastMatch);
      });
    }

    /**
     * Sets the `first` attribute on the first visible item so its separator
     * is hidden. Removes the attribute from all other items.
     *
     * @private
     */
    __updateFirstAttribute() {
      const items = this._items;
      items.forEach((item, index) => {
        if (index === 0) {
          item.setAttribute('first', '');
        } else {
          item.removeAttribute('first');
        }
      });
    }

    /**
     * Distributes custom separator clones to each breadcrumb item.
     * When a custom separator element is present in the separator slot,
     * clones it for each item and sets each item's `_customSeparator` property.
     * When no custom separator is present, clears the property so items
     * revert to their default chevron.
     *
     * @private
     */
    __distributeSeparators() {
      const items = this._items;
      if (this.__customSeparatorNode) {
        items.forEach((item) => {
          item._customSeparator = this.__customSeparatorNode.cloneNode(true);
        });
      } else {
        items.forEach((item) => {
          item._customSeparator = undefined;
        });
      }
    }

    /**
     * Updates the overflow button's separator to match the custom separator
     * (if any) or revert to the default chevron.
     *
     * @private
     */
    __updateOverflowSeparator() {
      const overflowContainer = this.__overflowContainer;
      if (!overflowContainer) {
        return;
      }
      const separatorSpan = overflowContainer.querySelector('.separator');
      if (!separatorSpan) {
        return;
      }

      // Clear existing content
      separatorSpan.textContent = '';

      if (this.__customSeparatorNode) {
        separatorSpan.appendChild(this.__customSeparatorNode.cloneNode(true));
      } else {
        separatorSpan.textContent = '\u203A';
      }
    }

    /**
     * Returns the parent item for the mobile back-link. The parent is the
     * last item with a `path` that is not the current page.
     *
     * Queries light DOM children directly rather than relying on the slot
     * controller, because in mobile mode the slot element may have changed.
     *
     * @return {HTMLElement | undefined}
     * @private
     */
    __getParentItem() {
      const items = Array.from(this.querySelectorAll('vaadin-breadcrumb-item'));
      let parent;
      for (const item of items) {
        if (item.path != null && !item.current) {
          parent = item;
        }
      }
      return parent;
    }

    /**
     * Detects whether breadcrumb items overflow the list container and
     * collapses intermediate items as needed. Keeps the first item and
     * as many trailing items as fit, hiding intermediate items with the
     * `overflow-hidden` attribute.
     *
     * When the container is too narrow to display even the first item,
     * overflow button, and last item, the component switches to mobile mode.
     *
     * @private
     */
    __detectOverflow() {
      // In mobile mode, check if we should exit by comparing host width
      // to the stored threshold. If the host is now wider, exit mobile mode.
      // The re-render will trigger another __detectOverflow via the ResizeObserver
      // that will re-evaluate overflow in normal mode.
      if (this.__mobile) {
        if (this.__mobileThreshold && this.clientWidth > this.__mobileThreshold) {
          this.__mobile = false;
          this.removeAttribute('mobile');
          // The re-render triggers the ResizeObserver which calls __detectOverflow again
        }
        return;
      }

      const list = this.shadowRoot && this.shadowRoot.querySelector('#list');
      const overflowContainer = this.__overflowContainer;
      if (!list || !overflowContainer) {
        return;
      }

      const items = this._items;
      if (items.length === 0) {
        overflowContainer.hidden = true;
        return;
      }

      // Step 1: Restore all items and hide the overflow button
      items.forEach((item) => {
        item.removeAttribute('overflow-hidden');
      });
      overflowContainer.hidden = true;

      // Step 2: Check if items overflow the container
      if (list.scrollWidth <= list.clientWidth) {
        // No overflow, nothing to do
        return;
      }

      // Step 3: Show the overflow button so its width is included in calculations
      overflowContainer.hidden = false;

      // Step 4: Hide items from second to second-to-last, then reveal trailing items
      // until the container no longer overflows.
      // Always keep the first item visible. Collapse from index 1 onward.
      if (items.length <= 1) {
        // Only one item, nothing to collapse
        overflowContainer.hidden = true;
        return;
      }

      // Hide all intermediate items (everything except the first)
      for (let i = 1; i < items.length; i++) {
        items[i].setAttribute('overflow-hidden', '');
      }

      // Reveal trailing items one by one (from the last toward the second)
      for (let i = items.length - 1; i >= 1; i--) {
        items[i].removeAttribute('overflow-hidden');

        if (list.scrollWidth > list.clientWidth) {
          // This item doesn't fit, hide it again
          items[i].setAttribute('overflow-hidden', '');
          break;
        }
      }

      // If no items are hidden, hide the overflow button
      const hiddenItems = items.filter((item) => item.hasAttribute('overflow-hidden'));
      if (hiddenItems.length === 0) {
        overflowContainer.hidden = true;
        return;
      }

      // Step 5: Check if even the minimum layout (first + overflow + last) overflows.
      // If only the first item and last item are visible but it still overflows,
      // switch to mobile mode.
      const visibleItems = items.filter((item) => !item.hasAttribute('overflow-hidden'));
      if (visibleItems.length <= 1 && list.scrollWidth > list.clientWidth) {
        // Store the current width as the threshold for exiting mobile mode
        this.__mobileThreshold = this.clientWidth;
        this.__mobile = true;
        this.setAttribute('mobile', '');
      }
    }

    /**
     * Handles click on the overflow button. Opens or closes the overlay.
     *
     * @param {Event} event
     * @private
     */
    __onOverflowButtonClick(event) {
      event.stopPropagation();
      if (this.__overlayOpened) {
        this.__closeOverlay();
      } else {
        this.__openOverlay();
      }
    }

    /**
     * Handles keydown on the overflow button.
     *
     * @param {KeyboardEvent} event
     * @private
     */
    __onOverflowButtonKeydown(event) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (!this.__overlayOpened) {
          this.__openOverlay();
          // Focus the first menu item after the overlay opens
          requestAnimationFrame(() => {
            this.__focusFirstOverlayItem();
          });
        }
      }
    }

    /**
     * Opens the overflow overlay and populates it with collapsed items.
     *
     * @private
     */
    __openOverlay() {
      const overlay = this.__overlay;
      if (!overlay) {
        return;
      }

      const items = this._items;
      const collapsedItems = items.filter((item) => item.hasAttribute('overflow-hidden'));

      if (collapsedItems.length === 0) {
        return;
      }

      // Build the overlay content
      this.__renderOverlayContent(collapsedItems);

      this.__overlayOpened = true;
      this.requestUpdate();
    }

    /**
     * Closes the overflow overlay.
     *
     * @private
     */
    __closeOverlay() {
      this.__overlayOpened = false;
      this.requestUpdate();

      // Clear overlay content after closing
      const overlay = this.__overlay;
      if (overlay) {
        // Remove menu items from the overlay
        const content = overlay.querySelector('[role="menu"]') || overlay;
        while (content.firstChild) {
          content.removeChild(content.firstChild);
        }
      }
    }

    /**
     * Renders the content of the overflow overlay with collapsed items.
     *
     * @param {HTMLElement[]} collapsedItems
     * @private
     */
    __renderOverlayContent(collapsedItems) {
      const overlay = this.__overlay;
      if (!overlay) {
        return;
      }

      // Clear existing content
      while (overlay.firstChild) {
        overlay.removeChild(overlay.firstChild);
      }

      collapsedItems.forEach((item) => {
        const label = item.textContent.trim();
        const path = item.path;
        const isDisabled = item.disabled;

        let menuEntry;
        if (isDisabled || path == null) {
          // Disabled items render as non-link elements
          menuEntry = document.createElement('span');
          menuEntry.setAttribute('role', 'menuitem');
          if (isDisabled) {
            menuEntry.setAttribute('aria-disabled', 'true');
          }
          menuEntry.setAttribute('tabindex', '-1');
          menuEntry.textContent = label;
        } else {
          // Normal items render as links
          menuEntry = document.createElement('a');
          menuEntry.setAttribute('role', 'menuitem');
          menuEntry.setAttribute('href', path);
          menuEntry.setAttribute('tabindex', '-1');
          menuEntry.textContent = label;
          menuEntry.addEventListener('click', () => {
            this.__closeOverlay();
            // Return focus to overflow button
            const btn = this.__overflowButton;
            if (btn) {
              btn.focus();
            }
          });
        }

        menuEntry.addEventListener('keydown', (e) => {
          this.__onOverlayItemKeydown(e);
        });

        overlay.appendChild(menuEntry);
      });
    }

    /**
     * Handles keydown events within the overlay menu items.
     *
     * @param {KeyboardEvent} event
     * @private
     */
    __onOverlayItemKeydown(event) {
      const overlay = this.__overlay;
      if (!overlay) {
        return;
      }

      const menuItems = Array.from(overlay.querySelectorAll('[role="menuitem"]'));
      const currentIndex = menuItems.indexOf(event.target);

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
          menuItems[nextIndex].focus();
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
          menuItems[prevIndex].focus();
          break;
        }
        case 'Escape':
          event.preventDefault();
          this.__closeOverlay();
          // Return focus to overflow button
          if (this.__overflowButton) {
            this.__overflowButton.focus();
          }
          break;
        case 'Home': {
          event.preventDefault();
          menuItems[0].focus();
          break;
        }
        case 'End': {
          event.preventDefault();
          menuItems[menuItems.length - 1].focus();
          break;
        }
        // Enter is handled natively for <a> elements, just close the overlay
        case 'Enter':
          this.__closeOverlay();
          if (this.__overflowButton) {
            this.__overflowButton.focus();
          }
          break;
        default:
          break;
      }
    }

    /**
     * Focuses the first item in the overlay.
     *
     * @private
     */
    __focusFirstOverlayItem() {
      const overlay = this.__overlay;
      if (!overlay) {
        return;
      }
      const firstItem = overlay.querySelector('[role="menuitem"]');
      if (firstItem) {
        firstItem.focus();
      }
    }

    /**
     * Handles the overlay escape press event.
     *
     * @param {Event} event
     * @private
     */
    __onOverlayEscapePress(event) {
      event.preventDefault();
      this.__closeOverlay();
      if (this.__overflowButton) {
        this.__overflowButton.focus();
      }
    }

    /**
     * Handles the overlay outside press event (click outside).
     *
     * @param {Event} event
     * @private
     */
    __onOverlayOutsidePress(event) {
      // Check if the click was on the overflow button; if so, let the button handle it
      const path = event.detail.sourceEvent.composedPath();
      if (path.includes(this.__overflowButton)) {
        event.preventDefault();
        return;
      }
      this.__closeOverlay();
    }

    /**
     * Handles the overlay close event. Ensures overlay state is synced.
     *
     * @param {Event} event
     * @private
     */
    __onOverlayClose(_event) {
      if (this.__overlayOpened) {
        this.__overlayOpened = false;
        this.requestUpdate();
      }
    }

    /**
     * Handles click events on the breadcrumb. When `onNavigate` is set,
     * intercepts link clicks, prevents default navigation, and calls the
     * callback with `{ path, current, originalEvent }`.
     *
     * Clicks with modifier keys, external links, and items with `[router-ignore]`
     * pass through without interception.
     *
     * @param {MouseEvent} e
     * @private
     */
    __onClick(e) {
      if (!this.onNavigate) {
        return;
      }

      const hasModifier = e.metaKey || e.shiftKey;
      if (hasModifier) {
        // Allow default action for clicks with modifiers (e.g. open in new tab)
        return;
      }

      const composedPath = e.composedPath();

      // Check for a click on the mobile back-link
      const backLink = this.shadowRoot && this.shadowRoot.querySelector('#back-link');
      if (backLink && composedPath.includes(backLink)) {
        const href = backLink.getAttribute('href');
        if (!href || !href.startsWith('/')) {
          // External link, pass through
          const isRelative = href && new URL(href, window.location.origin).origin === window.location.origin;
          if (!isRelative) {
            return;
          }
        }

        const result = this.onNavigate({
          path: href,
          current: false,
          originalEvent: e,
        });

        if (result !== false) {
          e.preventDefault();
        }
        return;
      }

      // Check for a click on an overflow menu link
      const overlay = this.__overlay;
      if (overlay && composedPath.includes(overlay)) {
        const anchor = composedPath.find((el) => el instanceof HTMLAnchorElement);
        if (!anchor) {
          return;
        }

        const href = anchor.getAttribute('href');
        const isRelative = anchor.href && anchor.href.startsWith(window.location.origin);
        if (!isRelative) {
          // External link, pass through
          return;
        }

        const result = this.onNavigate({
          path: href,
          current: false,
          originalEvent: e,
        });

        if (result !== false) {
          e.preventDefault();
        }
        return;
      }

      // Check for a click on a breadcrumb item's internal anchor
      const item = composedPath.find((el) => el.localName && el.localName === 'vaadin-breadcrumb-item');
      const anchor = composedPath.find((el) => el instanceof HTMLAnchorElement);
      if (!item || !anchor || !item.shadowRoot.contains(anchor)) {
        // Not a click on a breadcrumb-item anchor
        return;
      }

      const isRelative = anchor.href && anchor.href.startsWith(window.location.origin);
      if (!isRelative) {
        // Allow default action for external links
        return;
      }

      if (item.hasAttribute('router-ignore')) {
        // Allow default action when client-side routing is ignored
        return;
      }

      // Call the onNavigate callback
      const result = this.onNavigate({
        path: item.path,
        current: item.current,
        originalEvent: e,
      });

      if (result !== false) {
        // Cancel the default action if the callback didn't return false
        e.preventDefault();
      }
    }
  };
