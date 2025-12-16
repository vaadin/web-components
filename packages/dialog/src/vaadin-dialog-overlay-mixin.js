/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { setOverlayStateAttribute } from '@vaadin/overlay/src/vaadin-overlay-utils.js';

/**
 * @polymerMixin
 * @mixes OverlayMixin
 */
export const DialogOverlayMixin = (superClass) =>
  class DialogOverlayMixin extends OverlayMixin(superClass) {
    static get properties() {
      return {
        /**
         * String used for rendering a dialog title.
         */
        headerTitle: {
          type: String,
        },

        /**
         * Custom function for rendering the dialog header.
         */
        headerRenderer: {
          type: Object,
        },

        /**
         * Custom function for rendering the dialog footer.
         */
        footerRenderer: {
          type: Object,
        },
      };
    }

    static get observers() {
      return [
        '_headerFooterRendererChange(headerRenderer, footerRenderer, opened)',
        '_headerTitleChanged(headerTitle, opened)',
      ];
    }

    /**
     * Override method from OverlayFocusMixin to use owner as content root
     * @protected
     * @override
     */
    get _contentRoot() {
      return this.owner;
    }

    /**
     * Override method from OverlayMixin to use slotted div as a renderer root.
     * @protected
     * @override
     */
    get _rendererRoot() {
      if (!this.__savedRoot) {
        const root = document.createElement('vaadin-dialog-content');
        root.style.display = 'contents';
        this.owner.appendChild(root);
        this.__savedRoot = root;
      }

      return this.__savedRoot;
    }

    /** @protected */
    ready() {
      super.ready();

      // Update overflow attribute on resize
      this.__resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          this.__updateOverflow();
        });
      });
      this.__resizeObserver.observe(this.$.resizerContainer);

      // Update overflow attribute on scroll
      this.$.content.addEventListener('scroll', () => {
        this.__updateOverflow();
      });

      // Update overflow attribute on content change
      this.shadowRoot.addEventListener('slotchange', () => {
        this.__updateOverflow();
      });

      // Observe header-content and footer slots for dynamic content
      this.__observeHeaderSlot();
      this.__observeFooterSlot();
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      // Clean up slot observers
      if (this.__headerSlotObserver) {
        this.__headerSlotObserver.disconnect();
      }
      if (this.__footerSlotObserver) {
        this.__footerSlotObserver.disconnect();
      }
    }

    /**
     * Observes the header-content slot for changes and updates the has-header attribute.
     * @private
     */
    __observeHeaderSlot() {
      const slot = this.shadowRoot.querySelector('slot[name="header-content"]');
      if (slot) {
        this.__headerSlotObserver = new SlotObserver(slot, () => {
          this.__updateHasHeader();
        });
      }
    }

    /**
     * Observes the footer slot for changes and updates the has-footer attribute.
     * @private
     */
    __observeFooterSlot() {
      const slot = this.shadowRoot.querySelector('slot[name="footer"]');
      if (slot) {
        this.__footerSlotObserver = new SlotObserver(slot, () => {
          this.__updateHasFooter();
        });
      }
    }

    /**
     * Checks if a node has meaningful content.
     * @private
     * @param {Node} node - The node to check
     * @return {boolean} True if the node has content
     */
    __hasNodeContent(node) {
      // Ignore renderer-created containers
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'VAADIN-DIALOG-CONTENT') {
        return false;
      }
      // Check element nodes
      if (node.nodeType === Node.ELEMENT_NODE) {
        return node.hasChildNodes() || node.textContent.trim().length > 0;
      }
      // Check text nodes
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return false;
    }

    /**
     * Checks if a slot element (nested slot forwarding) has meaningful content.
     * @private
     * @param {HTMLSlotElement} slotElement - The slot element to check
     * @return {boolean} True if the slot has content
     */
    __isSlotElementWithContent(slotElement) {
      const slotContent = slotElement.assignedNodes({ flatten: true });
      if (slotContent.length === 0) {
        return false;
      }
      // Check if the slot has meaningful content (excluding renderer containers)
      return slotContent.some((slotNode) => this.__hasNodeContent(slotNode));
    }

    /**
     * Checks if a slot has meaningful content, excluding empty elements and renderer containers.
     * Handles nested slot forwarding by recursively checking slot elements.
     * @private
     * @param {string} slotName - The name of the slot to check
     * @return {boolean} True if the slot has content
     */
    __hasSlottedContent(slotName) {
      const slot = this.shadowRoot.querySelector(`slot[name="${slotName}"]`);
      if (!slot) {
        return false;
      }

      const nodes = slot.assignedNodes({ flatten: true });
      return nodes.some((node) => {
        // Ignore vaadin-dialog-content elements as they are created by renderers
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'VAADIN-DIALOG-CONTENT') {
          return false;
        }
        // Handle nested slot forwarding
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SLOT') {
          return this.__isSlotElementWithContent(node);
        }
        // Check for regular element and text nodes with content
        return this.__hasNodeContent(node);
      });
    }

    /**
     * Updates the has-header attribute based on headerRenderer and slotted content.
     * @private
     */
    __updateHasHeader() {
      const hasSlottedHeader = this.__hasSlottedContent('header-content');
      const hasHeader = !!this.headerRenderer || hasSlottedHeader;
      setOverlayStateAttribute(this, 'has-header', hasHeader);
    }

    /**
     * Updates the has-footer attribute based on footerRenderer and slotted content.
     * @private
     */
    __updateHasFooter() {
      const hasSlottedFooter = this.__hasSlottedContent('footer');
      const hasFooter = !!this.footerRenderer || hasSlottedFooter;
      setOverlayStateAttribute(this, 'has-footer', hasFooter);
    }

    /** @private */
    __createContainer(slot) {
      const container = document.createElement('vaadin-dialog-content');
      container.setAttribute('slot', slot);
      return container;
    }

    /** @private */
    __clearContainer(container) {
      container.innerHTML = '';
      // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
      // When clearing the rendered content, this part needs to be manually disposed of.
      // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
      delete container._$litPart$;
    }

    /** @private */
    __initContainer(container, slot) {
      if (container) {
        // Reset existing container in case if a new renderer is set.
        this.__clearContainer(container);
      } else {
        // Create the container and append it to the dialog element.
        container = this.__createContainer(slot);
        this.owner.appendChild(container);
      }
      return container;
    }

    /** @private */
    _headerFooterRendererChange(headerRenderer, footerRenderer, opened) {
      const headerRendererChanged = this.__oldHeaderRenderer !== headerRenderer;
      this.__oldHeaderRenderer = headerRenderer;

      const footerRendererChanged = this.__oldFooterRenderer !== footerRenderer;
      this.__oldFooterRenderer = footerRenderer;

      const openedChanged = this._oldOpenedFooterHeader !== opened;
      this._oldOpenedFooterHeader = opened;

      // Set attributes here to update styles before detecting content overflow
      // Check both renderers and slotted content
      this.__updateHasHeader();
      this.__updateHasFooter();

      if (headerRendererChanged) {
        if (headerRenderer) {
          this.headerContainer = this.__initContainer(this.headerContainer, 'header-content');
        } else if (this.headerContainer) {
          this.headerContainer.remove();
          this.headerContainer = null;
          this.__updateOverflow();
        }
      }

      if (footerRendererChanged) {
        if (footerRenderer) {
          this.footerContainer = this.__initContainer(this.footerContainer, 'footer');
        } else if (this.footerContainer) {
          this.footerContainer.remove();
          this.footerContainer = null;
          this.__updateOverflow();
        }
      }

      if (
        (headerRenderer && (headerRendererChanged || openedChanged)) ||
        (footerRenderer && (footerRendererChanged || openedChanged))
      ) {
        if (opened) {
          this.requestContentUpdate();
        }
      }
    }

    /** @private */
    _headerTitleChanged(headerTitle, opened) {
      setOverlayStateAttribute(this, 'has-title', !!headerTitle);

      if (opened && (headerTitle || this._oldHeaderTitle)) {
        this.requestContentUpdate();
      }
      this._oldHeaderTitle = headerTitle;
    }

    /** @private */
    _headerTitleRenderer() {
      if (this.headerTitle) {
        if (!this.headerTitleElement) {
          this.headerTitleElement = document.createElement('h2');
          this.headerTitleElement.setAttribute('slot', 'title');
          this.headerTitleElement.classList.add('draggable');
        }
        this.owner.appendChild(this.headerTitleElement);
        this.headerTitleElement.textContent = this.headerTitle;
      } else if (this.headerTitleElement) {
        this.headerTitleElement.remove();
        this.headerTitleElement = null;
      }
    }

    /**
     * @override
     */
    requestContentUpdate() {
      super.requestContentUpdate();

      if (this.headerContainer && this.headerRenderer) {
        this.headerRenderer.call(this.owner, this.headerContainer, this.owner);
      }

      if (this.footerContainer && this.footerRenderer) {
        this.footerRenderer.call(this.owner, this.footerContainer, this.owner);
      }

      this._headerTitleRenderer();

      this.__updateOverflow();
    }

    /**
     * Retrieves the coordinates of the overlay.
     * @return {!DialogOverlayBounds}
     */
    getBounds() {
      const overlayBounds = this.$.overlay.getBoundingClientRect();
      const containerBounds = this.getBoundingClientRect();
      const top = overlayBounds.top - containerBounds.top;
      const left = overlayBounds.left - containerBounds.left;
      const width = overlayBounds.width;
      const height = overlayBounds.height;
      return { top, left, width, height };
    }

    /** @private */
    __updateOverflow() {
      let overflow = '';

      const content = this.$.content;

      if (content.scrollTop > 0) {
        overflow += ' top';
      }

      if (content.scrollTop < content.scrollHeight - content.clientHeight) {
        overflow += ' bottom';
      }

      const value = overflow.trim();
      if (value.length > 0 && this.getAttribute('overflow') !== value) {
        setOverlayStateAttribute(this, 'overflow', value);
      } else if (value.length === 0 && this.hasAttribute('overflow')) {
        setOverlayStateAttribute(this, 'overflow', null);
      }
    }
  };
