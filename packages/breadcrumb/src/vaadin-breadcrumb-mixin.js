/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html } from 'lit';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
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
      };
    }

    constructor() {
      super();

      this._itemsController = new ItemsController(this);
      this.__boundUpdateCurrent = this.__updateCurrentItems.bind(this);
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
      return html`
        <div part="list" role="list" id="list">
          <slot id="items"></slot>
        </div>
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
    }

    /**
     * @protected
     * @override
     */
    updated(props) {
      super.updated(props);

      if (props.has('location')) {
        this.__updateCurrentItems();
      }

      // Re-evaluate current items whenever the slot content changes
      this.__updateCurrentItems();
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
  };
