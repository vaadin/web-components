/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
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

        /** @private */
        __virtualizer: Object,
      };
    }

    static get observers() {
      return ['__itemsOrRendererChanged(items, renderer, __virtualizer)'];
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
      this.__onDragStart = this.__onDragStart.bind(this);
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
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();
      // Chromium based browsers cannot properly generate drag images for elements
      // that have children with massive heights. This workaround prevents crashes
      // and performance issues by excluding the items from the drag image.
      // https://github.com/vaadin/web-components/issues/7985
      document.addEventListener('dragstart', this.__onDragStart, { capture: true });
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener('dragstart', this.__onDragStart, { capture: true });
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
    __updateElement(el, index) {
      if (el.__renderer !== this.renderer) {
        el.__renderer = this.renderer;
        this.__clearRenderTargetContent(el);
      }

      if (this.renderer) {
        this.renderer(el, this, { item: this.items[index], index });
      }
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

    /** @private */
    __onDragStart(e) {
      // The dragged element can be the element itself or a parent of the element
      if (!e.target.contains(this)) {
        return;
      }
      // The threshold value 20000 provides a buffer to both
      //   - avoid the crash and the performance issues
      //   - unnecessarily avoid excluding items from the drag image
      if (this.$.items.offsetHeight > 20000) {
        const initialItemsMaxHeight = this.$.items.style.maxHeight;
        const initialVirtualListOverflow = this.style.overflow;
        // Momentarily hides the items until the browser starts generating the
        // drag image.
        this.$.items.style.maxHeight = '0';
        this.style.overflow = 'hidden';
        requestAnimationFrame(() => {
          this.$.items.style.maxHeight = initialItemsMaxHeight;
          this.style.overflow = initialVirtualListOverflow;
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
