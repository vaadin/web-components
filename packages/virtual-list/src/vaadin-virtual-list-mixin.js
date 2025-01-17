/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isChrome, isSafari } from '@vaadin/component-base/src/browser-utils.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { OverflowController } from '@vaadin/component-base/src/overflow-controller.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { Virtualizer } from '@vaadin/component-base/src/virtualizer.js';

/**
 * @polymerMixin
 * @mixes ControllerMixin
 */
export const VirtualListMixin = (superClass) =>
  class VirtualListMixinClass extends ControllerMixin(superClass) {
    static get properties() {
      return {
        /**
         * An array containing items determining how many instances to render.
         * @type {Array<!VirtualListItem> | undefined}
         */
        items: { type: Array, sync: true },

        /**
         * Custom function for rendering the content of every item.
         * Receives three arguments:
         *
         * - `root` The render target element representing one item at a time.
         * - `virtualList` The reference to the `<vaadin-virtual-list>` element.
         * - `model` The object with the properties related with the rendered
         *   item, contains:
         *   - `model.index` The index of the rendered item.
         *   - `model.item` The item.
         * @type {VirtualListRenderer | undefined}
         */
        renderer: { type: Function, sync: true },

        /**
         * A function that generates accessible names for virtual list items.
         * The function gets the item as an argument and the
         * return value should be a string representing that item. The
         * result gets applied to the corresponding virtual list child element
         * as an `aria-label` attribute.
         */
        itemAccessibleNameGenerator: {
          type: Function,
          sync: true,
        },

        /** @private */
        __virtualizer: Object,
      };
    }

    static get observers() {
      return ['__itemsOrRendererChanged(items, renderer, __virtualizer, itemAccessibleNameGenerator)'];
    }

    /**
     * Gets the index of the first visible item in the viewport.
     *
     * @return {number}
     */
    get firstVisibleIndex() {
      return this.__virtualizer.firstVisibleIndex;
    }

    /**
     * Gets the index of the last visible item in the viewport.
     *
     * @return {number}
     */
    get lastVisibleIndex() {
      return this.__virtualizer.lastVisibleIndex;
    }

    constructor() {
      super();
      this.__onDocumentDragStart = this.__onDocumentDragStart.bind(this);
    }

    /** @protected */
    ready() {
      super.ready();

      this.__virtualizer = new Virtualizer({
        createElements: this.__createElements,
        updateElement: this.__updateElement.bind(this),
        elementsContainer: this,
        scrollTarget: this,
        scrollContainer: this.shadowRoot.querySelector('#items'),
        reorderElements: true,
      });
      this.__overflowController = new OverflowController(this);
      this.addController(this.__overflowController);

      processTemplates(this);
      this.__updateAria();
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();
      document.addEventListener('dragstart', this.__onDocumentDragStart, { capture: true });
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener('dragstart', this.__onDocumentDragStart, { capture: true });
    }

    /**
     * Scroll to a specific index in the virtual list.
     *
     * @param {number} index Index to scroll to
     */
    scrollToIndex(index) {
      this.__virtualizer.scrollToIndex(index);
    }

    /** @private */
    __createElements(count) {
      return [...Array(count)].map(() => document.createElement('div'));
    }

    /** @private */
    __updateAria() {
      this.role = 'list';
    }

    /** @private */
    __updateElement(el, index) {
      const item = this.items[index];
      el.ariaSetSize = String(this.items.length);
      el.ariaPosInSet = String(index + 1);
      el.ariaLabel = this.itemAccessibleNameGenerator ? this.itemAccessibleNameGenerator(item) : null;
      this.__updateElementRole(el);

      if (el.__renderer !== this.renderer) {
        el.__renderer = this.renderer;
        this.__clearRenderTargetContent(el);
      }

      if (this.renderer) {
        this.renderer(el, this, { item, index });
      }
    }

    /** @private */
    __updateElementRole(el) {
      el.role = 'listitem';
    }

    /**
     * Clears the content of a render target.
     * @private
     */
    __clearRenderTargetContent(element) {
      element.innerHTML = '';
      // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
      // When clearing the rendered content, this part needs to be manually disposed of.
      // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
      delete element._$litPart$;
    }

    /** @private */
    __itemsOrRendererChanged(items, renderer, virtualizer) {
      // If the renderer is removed but there are elements created by
      // a previous renderer, we need to request an update from the virtualizer
      // to get the already existing elements properly cleared.
      const hasRenderedItems = this.childElementCount > 0;

      if ((renderer || hasRenderedItems) && virtualizer) {
        virtualizer.size = (items || []).length;
        virtualizer.update();
      }
    }

    /**
     * Webkit-based browsers have issues with generating drag images
     * for elements that have children with massive heights. Chromium
     * browsers crash, while Safari experiences significant performance
     * issues. To mitigate these issues, we hide the items container
     * when drag starts to remove it from the drag image.
     *
     * Virtual lists with fewer rows also have issues on Chromium and Safari
     * where the drag image is not properly clipped and may include
     * content outside the virtual list. Temporary inline styles are applied
     * to mitigate this issue.
     *
     * Related issues:
     * - https://github.com/vaadin/web-components/issues/7985
     * - https://issues.chromium.org/issues/383356871
     * - https://github.com/vaadin/web-components/issues/8386
     *
     * @private
     */
    __onDocumentDragStart(e) {
      if (e.target.contains(this)) {
        // Record the original inline styles to restore them later
        const elements = [e.target, this.$.items];
        const originalInlineStyles = elements.map((element) => element.style.cssText);

        // With a large number of rows, hide the items
        if (this.scrollHeight > 20000) {
          this.$.items.style.display = 'none';
        }

        // Workaround content outside the virtual list ending up in the drag image on Chromium
        if (isChrome) {
          e.target.style.willChange = 'transform';
        }

        // Workaround text content outside the virtual list ending up in the drag image on Safari
        if (isSafari) {
          this.$.items.style.maxHeight = '100%';
        }

        requestAnimationFrame(() => {
          elements.forEach((element, index) => {
            element.style.cssText = originalInlineStyles[index];
          });
        });
      }
    }

    /**
     * Requests an update for the content of the rows.
     * While performing the update, it invokes the renderer passed in the `renderer` property for each visible row.
     *
     * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
     */
    requestContentUpdate() {
      if (this.__virtualizer) {
        this.__virtualizer.update();
      }
    }
  };
