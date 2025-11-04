/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
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
      setOverlayStateAttribute(this, 'has-header', !!headerRenderer);
      setOverlayStateAttribute(this, 'has-footer', !!footerRenderer);

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
