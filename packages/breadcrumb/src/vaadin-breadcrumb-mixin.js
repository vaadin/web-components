/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, render } from 'lit';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller that observes the breadcrumb's default light-DOM slot and:
 *
 * 1. Routes the first `<vaadin-breadcrumb-item>` child into the named `root`
 *    slot in shadow DOM. Any previous root holder has its `slot` attribute
 *    cleared. Non-item children (e.g. plain `<span>` elements) are ignored.
 * 2. Toggles the `current` state attribute on the last
 *    `<vaadin-breadcrumb-item>` child whenever the trail changes (children
 *    added/removed) or whenever an item's `path` attribute is added/removed.
 *    The last item is marked `current` if and only if it has no `path`
 *    attribute, per Key Design Decisions §3 (the current page is the last
 *    item without `path`). All other items have `current` cleared.
 *
 * To detect `path` attribute mutations after the trail is rendered, the
 * controller installs a per-item `MutationObserver` filtered to `path` in
 * `initNode`/`initCustomNode`, and tears it down in `teardownNode`.
 *
 * @private
 */
class RootItemController extends SlotController {
  constructor(host) {
    super(host, '', null, { multiple: true, observe: true });
    /** @private */
    this.__pathObservers = new WeakMap();
  }

  /**
   * @protected
   * @override
   */
  hostConnected() {
    super.hostConnected();

    // The base SlotController only observes the default slot. The first item
    // is moved into the named `root` slot, so removing it does not trigger a
    // `slotchange` on the default slot. Listen for slot changes on the
    // `root` slot too, so we can reassign `slot="root"` to the new first item
    // when the previous holder is removed from light DOM.
    if (!this.__rootSlotListenerAttached) {
      const rootSlot = this.host.shadowRoot.querySelector('slot[name="root"]');
      if (rootSlot) {
        rootSlot.addEventListener('slotchange', () => {
          this.__updateRootSlotAssignment();
          this.__updateCurrentItem();
          this.__updateOverflow();
        });
        this.__rootSlotListenerAttached = true;
      }
    }
  }

  /**
   * @protected
   * @override
   */
  initNode(node) {
    this.__observePath(node);
    this.__updateRootSlotAssignment();
    this.__updateCurrentItem();
    this.__updateOverflow();
  }

  /**
   * @protected
   * @override
   */
  initCustomNode(node) {
    this.__observePath(node);
    this.__updateRootSlotAssignment();
    this.__updateCurrentItem();
    this.__updateOverflow();
  }

  /**
   * @protected
   * @override
   */
  teardownNode(node) {
    this.__unobservePath(node);
    this.__updateRootSlotAssignment();
    this.__updateCurrentItem();
    this.__updateOverflow();
  }

  /** @private */
  __updateOverflow() {
    if (typeof this.host.__updateOverflow === 'function') {
      this.host.__updateOverflow();
    }
  }

  /** @private */
  __observePath(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE || node.localName !== 'vaadin-breadcrumb-item') {
      return;
    }
    if (this.__pathObservers.has(node)) {
      return;
    }
    const observer = new MutationObserver(() => {
      this.__updateCurrentItem();
    });
    observer.observe(node, { attributes: true, attributeFilter: ['path'] });
    this.__pathObservers.set(node, observer);
  }

  /** @private */
  __unobservePath(node) {
    if (!node || !this.__pathObservers.has(node)) {
      return;
    }
    this.__pathObservers.get(node).disconnect();
    this.__pathObservers.delete(node);
  }

  /** @private */
  __updateRootSlotAssignment() {
    const items = this.__getItems();
    const firstItem = items[0];

    items.forEach((item) => {
      if (item === firstItem) {
        if (item.getAttribute('slot') !== 'root') {
          item.setAttribute('slot', 'root');
        }
      } else if (item.getAttribute('slot') === 'root') {
        item.removeAttribute('slot');
      }
    });
  }

  /** @private */
  __updateCurrentItem() {
    const items = this.__getItems();
    const lastItem = items[items.length - 1];
    const currentItem = lastItem && !lastItem.hasAttribute('path') ? lastItem : null;

    items.forEach((item) => {
      if (item === currentItem) {
        if (!item.hasAttribute('current')) {
          item.toggleAttribute('current', true);
        }
      } else if (item.hasAttribute('current')) {
        item.toggleAttribute('current', false);
      }
    });
  }

  /** @private */
  __getItems() {
    return Array.from(this.host.children).filter((child) => child.localName === 'vaadin-breadcrumb-item');
  }
}

/**
 * A mixin providing common `<vaadin-breadcrumb>` functionality.
 *
 * @polymerMixin
 * @mixes ResizeMixin
 */
export const BreadcrumbMixin = (superClass) =>
  class BreadcrumbMixinClass extends ResizeMixin(superClass) {
    static get properties() {
      return {
        /**
         * @typedef BreadcrumbItemData
         * @type {object}
         * @property {string} text - Text content of the breadcrumb item.
         * @property {string} [path] - URL the item links to. When omitted, the
         * item renders as a non-interactive `<span>` (used for the current page).
         */

        /**
         * Programmatic items array. When set, the breadcrumb generates
         * `<vaadin-breadcrumb-item>` elements in the light DOM, replacing any
         * pre-existing slotted children. Each entry has the shape
         * `{ text: string, path?: string }`. Entries with `path` produce a
         * linked item; entries without `path` produce a non-interactive item
         * (typically the current page).
         *
         * Setting `items` to `null` or `undefined` removes the generated items
         * and restores any author-supplied light-DOM children that were present
         * before `items` was first set.
         *
         * #### Example
         *
         * ```js
         * breadcrumb.items = [
         *   { text: 'Home', path: '/' },
         *   { text: 'Reports', path: '/reports' },
         *   { text: 'Quarterly' },
         * ];
         * ```
         *
         * @type {Array<!BreadcrumbItemData> | null | undefined}
         */
        items: {
          type: Array,
        },
      };
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      // Set default role if the application has not provided one.
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'navigation');
      }

      // Observe the default slot and route the first item into slot="root".
      this._rootController = new RootItemController(this);
      this.addController(this._rootController);
    }

    /** @protected */
    updated(changedProperties) {
      super.updated(changedProperties);

      if (changedProperties.has('items')) {
        this.__renderItems();
      }
    }

    /**
     * Implement callback from `ResizeMixin` to recompute overflow whenever the
     * host width changes. Delegates to a single helper so slot changes can use
     * the same code path.
     *
     * @protected
     * @override
     */
    _onResize() {
      this.__updateOverflow();
    }

    /**
     * Lazily resolve the shadow `[part="list"]` container used as the
     * measurement target. Cached on first lookup.
     *
     * @return {HTMLElement | null}
     * @private
     */
    get __listElement() {
      if (!this.__listElementCache && this.shadowRoot) {
        this.__listElementCache = this.shadowRoot.querySelector('[part="list"]');
      }
      return this.__listElementCache;
    }

    /**
     * Progressive overflow collapse, per Key Design Decisions §6.
     *
     * Algorithm:
     * 1. Reset: clear `has-overflow` and `data-overflow-hidden` from every item.
     * 2. If everything fits (`scrollWidth <= clientWidth` on `[part="list"]`),
     *    we are done.
     * 3. Otherwise, set `has-overflow` (which reveals the overflow listitem
     *    via CSS) and progressively hide the "middle" items — those between
     *    the first item (root) and the last item (current) — left-to-right
     *    until everything fits.
     * 4. If items still overflow, hide the root too as a last resort.
     *
     * The current item — defined here as the last `<vaadin-breadcrumb-item>`
     * child regardless of whether it has a `path` — never receives
     * `data-overflow-hidden`, matching the spec rule "the last item (current
     * page) never collapses".
     *
     * @private
     */
    __updateOverflow() {
      const list = this.__listElement;
      if (!list) {
        return;
      }

      const items = Array.from(this.children).filter((child) => child.localName === 'vaadin-breadcrumb-item');

      // Always start by clearing any previous collapse state so the
      // measurement reflects the natural width of the trail.
      items.forEach((item) => item.removeAttribute('data-overflow-hidden'));
      this.toggleAttribute('has-overflow', false);

      if (items.length < 2) {
        // Nothing to collapse: zero or one item never overflows.
        return;
      }

      // Force a layout read so the measurements below are up to date.
      if (list.scrollWidth <= list.clientWidth) {
        return;
      }

      // Items still overflow: reveal the overflow listitem and start
      // collapsing the "middle" items closest to the root first.
      this.toggleAttribute('has-overflow', true);

      const root = items[0];
      const current = items[items.length - 1];
      const middle = items.slice(1, -1);

      for (const item of middle) {
        item.setAttribute('data-overflow-hidden', '');
        if (list.scrollWidth <= list.clientWidth) {
          return;
        }
      }

      // Last resort: also collapse the root. The current item is never
      // collapsed by design.
      if (root !== current) {
        root.setAttribute('data-overflow-hidden', '');
      }
    }

    /**
     * Render `<vaadin-breadcrumb-item>` elements into the host's light DOM
     * from the `items` array. Original author-supplied children are saved on
     * the first transition from `null`/`undefined` to an array, and restored
     * when `items` is set back to `null`/`undefined`.
     *
     * @private
     */
    __renderItems() {
      if (this.items == null) {
        // Remove any generated items and restore the originals.
        render(html``, this);
        if (this.__originalChildren) {
          this.__originalChildren.forEach((child) => {
            this.appendChild(child);
          });
          this.__originalChildren = null;
        }
        return;
      }

      // First transition from no-items to items: detach and remember any
      // existing light-DOM children so they can be restored later.
      if (!this.__originalChildren) {
        this.__originalChildren = Array.from(this.children);
        this.__originalChildren.forEach((child) => {
          this.removeChild(child);
        });
      }

      render(
        html`${this.items.map((item) =>
          item.path != null
            ? html`<vaadin-breadcrumb-item path="${item.path}">${item.text}</vaadin-breadcrumb-item>`
            : html`<vaadin-breadcrumb-item>${item.text}</vaadin-breadcrumb-item>`,
        )}`,
        this,
      );
    }
  };
