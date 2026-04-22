/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, render } from 'lit';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

const DEFAULT_I18N = {
  moreItems: '',
};

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
 * @mixes I18nMixin
 * @mixes ResizeMixin
 */
export const BreadcrumbMixin = (superClass) =>
  class BreadcrumbMixinClass extends I18nMixin(DEFAULT_I18N, ResizeMixin(superClass)) {
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

        /**
         * Internal reactive state controlling the overflow overlay's `opened`
         * state. Bound to `<vaadin-breadcrumb-overlay>.opened` in the render
         * template; toggled by clicking the overflow button and updated when
         * the overlay closes itself (Escape, outside click).
         *
         * @protected
         */
        _overlayOpened: {
          type: Boolean,
          state: true,
        },

        /**
         * Bound function used as the overflow overlay's `renderer`. The
         * function is rebuilt eagerly so each invocation has access to the
         * current host instance via the closure, mirroring the avatar-group
         * pattern.
         *
         * @protected
         */
        _overlayRenderer: {
          type: Object,
          state: true,
        },

        /**
         * Reference to the shadow `[part="overflow-button"]` captured in
         * `firstUpdated()`. Used as the overlay's `positionTarget` and as the
         * element receiving aria-state updates (`aria-expanded`, `aria-label`).
         *
         * @protected
         */
        _overflowButton: {
          type: Object,
          state: true,
        },
      };
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties,
     * or just the individual properties you want to change.
     *
     * The object has the following JSON structure and default values:
     * ```js
     * {
     *   // The accessible label for the overflow button that reveals
     *   // collapsed items. Empty by default; applications should provide a
     *   // localized string when the breadcrumb may overflow.
     *   moreItems: ''
     * }
     * ```
     *
     * @type {!{ moreItems?: string }}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      // Set default role if the application has not provided one.
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'navigation');
      }

      // Capture the overflow button so the overlay can position against it
      // and so we can sync aria-state on it as `_overlayOpened` changes.
      this._overflowButton = this.shadowRoot.querySelector('[part="overflow-button"]');
      if (this._overflowButton) {
        this._overflowButton.addEventListener('click', (event) => this._onOverflowButtonClick(event));
        // Apply the initial aria-state for the button. Subsequent changes are
        // handled in `updated()` via the `__effectiveI18n` and
        // `_overlayOpened` change observers.
        const label =
          this.__effectiveI18n && this.__effectiveI18n.moreItems != null ? this.__effectiveI18n.moreItems : '';
        this._overflowButton.setAttribute('aria-label', label);
        this._overflowButton.setAttribute('aria-expanded', String(Boolean(this._overlayOpened)));
      }

      // Bind the renderer once. The function reads `this.children` at render
      // time, so it always sees the current set of hidden items.
      this._overlayRenderer = (root, owner) => this.__renderOverlay(root, owner);

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

      if (changedProperties.has('_overlayOpened') && this._overflowButton) {
        this._overflowButton.setAttribute('aria-expanded', String(this._overlayOpened));
      }

      if (changedProperties.has('__effectiveI18n') && this._overflowButton) {
        const label =
          this.__effectiveI18n && this.__effectiveI18n.moreItems != null ? this.__effectiveI18n.moreItems : '';
        this._overflowButton.setAttribute('aria-label', label);
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
     * Click handler installed on the shadow `[part="overflow-button"]`.
     * Toggles `_overlayOpened` so that `<vaadin-breadcrumb-overlay>` opens
     * and closes in response to user clicks on the overflow button. The
     * handler is a no-op when there are no hidden items, since the overflow
     * button is not visible in that state.
     *
     * @param {Event} _event
     * @protected
     */
    _onOverflowButtonClick(_event) {
      if (!this.hasAttribute('has-overflow')) {
        return;
      }
      this._overlayOpened = !this._overlayOpened;
    }

    /**
     * Listener for the overlay's `opened-changed` event so that when the
     * overlay closes itself (Escape, outside click), the host's
     * `_overlayOpened` state stays in sync. Without this, the next click on
     * the overflow button would think the overlay was still open and
     * attempt to close it.
     *
     * @param {CustomEvent} event
     * @protected
     */
    _onOverlayOpenedChanged(event) {
      this._overlayOpened = event.detail.value;
    }

    /**
     * Listener for the overlay's `vaadin-overlay-close` event. When the
     * close was triggered by a click whose path includes the breadcrumb
     * host (i.e. the user clicked the overflow button), prevent the
     * overlay's own close handling — the host's click handler manages the
     * `_overlayOpened` toggle and would otherwise immediately reopen.
     *
     * Mirrors `<vaadin-avatar-group>._onVaadinOverlayClose`.
     *
     * @param {CustomEvent} event
     * @protected
     */
    _onVaadinOverlayClose(event) {
      if (event.detail.sourceEvent && event.detail.sourceEvent.composedPath().includes(this)) {
        event.preventDefault();
      }
    }

    /**
     * Renderer bound to `<vaadin-breadcrumb-overlay>.renderer`. Writes one
     * navigable `<a>` link per currently hidden `<vaadin-breadcrumb-item>`
     * into the overlay's renderer root, in original DOM order. Each link's
     * `href` matches the source item's `path` and the link text matches the
     * item's text content.
     *
     * @param {HTMLElement} root
     * @param {HTMLElement} _owner
     * @private
     */
    __renderOverlay(root, _owner) {
      const hiddenItems = Array.from(this.children).filter(
        (child) => child.localName === 'vaadin-breadcrumb-item' && child.hasAttribute('data-overflow-hidden'),
      );
      render(
        html`${hiddenItems.map(
          (item) => html`<a href="${item.getAttribute('path') || ''}">${(item.textContent || '').trim()}</a>`,
        )}`,
        root,
      );
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
