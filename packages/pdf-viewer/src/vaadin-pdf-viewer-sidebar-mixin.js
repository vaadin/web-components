/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '@vaadin/button/src/vaadin-button.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import './vaadin-pdf-viewer-icon.js';
import { html } from 'lit';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { PdfViewerThumbnailsController } from './pdf-viewer-thumbnails-controller.js';

/**
 * A mixin that adds a sidebar with a thumbnail of each page, and a button
 * in the toolbar that shows and hides it. The sidebar shows next to the
 * pages, and over them in a narrow viewer.
 */
export const PdfViewerSidebarMixin = (superClass) =>
  class PdfViewerSidebarMixinClass extends ResizeMixin(superClass) {
    static get properties() {
      return {
        /**
         * Whether the sidebar with the page thumbnails is shown.
         *
         * In a viewer narrower than 30rem, the sidebar shows over the pages.
         * Set `--vaadin-pdf-viewer-sidebar-overlay` to `true` or `false` to change that.
         *
         * @attr {boolean} sidebar-opened
         */
        sidebarOpened: {
          type: Boolean,
          value: false,
          notify: true,
          reflectToAttribute: true,
        },

        /**
         * Whether the button that shows and hides the sidebar is hidden from
         * the toolbar. The `sidebarOpened` property works also while it is hidden.
         *
         * @attr {boolean} sidebar-button-hidden
         */
        sidebarButtonHidden: {
          type: Boolean,
          value: false,
        },

        /**
         * Whether the sidebar shows over the pages.
         * @protected
         */
        _sidebarOverlay: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          attribute: 'sidebar-overlay',
        },
      };
    }

    /** @type {PdfViewerThumbnailsController | null} */
    #thumbnails = null;

    /** Set when the sidebar covers the focused pages. */
    #focusThumbnails = false;

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.#thumbnails = new PdfViewerThumbnailsController(this.$.thumbnails, {
        onSelect: (pageNumber) => this.#onThumbnailSelect(pageNumber),
        isPageInUse: (pageNumber) => {
          const page = this.__pages[pageNumber - 1];
          return !!(page?.canvas || page?.renderTask);
        },
      });
      this.addController(this.#thumbnails);

      this.#updateOverlay();
    }

    /** @protected */
    willUpdate(props) {
      super.willUpdate(props);

      // Focus in the sidebar would be lost when it hides.
      if (props.has('sidebarOpened') && !this.sidebarOpened) {
        this.#moveFocusOutOfSidebar();
      }

      // Focus in the pages would be lost when the sidebar over them makes them inert.
      if ((props.has('sidebarOpened') || props.has('_sidebarOverlay')) && this.sidebarOpened && this._sidebarOverlay) {
        this.#focusThumbnails = this.$.content.matches(':focus-within');
      }
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('__effectiveI18n')) {
        this.#thumbnails.setLabel(this.__effectiveI18n.thumbnailLabel);
      }

      if ((props.has('pageCount') || props.has('sidebarOpened')) && this.sidebarOpened && this.pageCount) {
        this.#thumbnails.create(this._pdfDocument, this.#getAspectRatios());
        this.#thumbnails.show(this.page);
      } else if (props.has('page')) {
        this.#thumbnails.setPage(this.page);
      }

      if (this.#focusThumbnails) {
        this.#focusThumbnails = false;
        this.$.thumbnails.querySelector('[tabindex="0"]')?.focus({ focusVisible: isKeyboardActive() });
      }
    }

    /**
     * Override method from `ResizeMixin` to switch the sidebar between
     * showing next to the pages and over them.
     * @protected
     * @override
     */
    _onResize(contentRect) {
      super._onResize(contentRect);

      if (this.hasUpdated) {
        this.#updateOverlay();
      }
    }

    /**
     * Override method from `KeyboardMixin` to close the sidebar that shows
     * over the pages with Escape.
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onEscape(event) {
      super._onEscape(event);

      if (event.defaultPrevented || !this._sidebarOverlay || !this.sidebarOpened) {
        return;
      }
      // Other controls of the toolbar may close their own overlay with Escape.
      const path = event.composedPath();
      if (path.includes(this.$.sidebar) || path.includes(this.#getSidebarButton())) {
        // Keeps a surrounding dialog open.
        event.preventDefault();
        this.sidebarOpened = false;
      }
    }

    /**
     * Override method from `PdfViewerRenderMixin` to give the thumbnails the
     * size of their page, as the thumbnails can be created before the pages
     * have their own size.
     * @protected
     * @override
     */
    _pageSizesChanged() {
      super._pageSizesChanged();
      this.#thumbnails.setAspectRatios(this.#getAspectRatios());
    }

    /**
     * Override method from `PdfViewerRenderMixin` to render the thumbnails
     * again at the new ratio.
     * @protected
     * @override
     */
    _pixelRatioChanged() {
      super._pixelRatioChanged();
      this.#thumbnails.refresh();
    }

    /**
     * Override method from `PdfViewerDocumentMixin` to remove the thumbnails
     * of the previous document.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();
      this.#moveFocusOutOfSidebar();
      this.#thumbnails.clear();
    }

    /**
     * Returns the template of the button that shows and hides the sidebar,
     * in the `toolbar-sidebar` slot.
     * @protected
     */
    _renderSidebarButton() {
      return html`
        <vaadin-button
          slot="toolbar-sidebar"
          theme="tertiary icon"
          aria-expanded="${this.sidebarOpened ? 'true' : 'false'}"
          ?hidden="${this.sidebarButtonHidden}"
          .disabled="${!this.pageCount && !this.sidebarOpened}"
          @click="${this.#onSidebarButtonClick}"
        >
          <vaadin-pdf-viewer-icon icon="sidebar"></vaadin-pdf-viewer-icon>
          <vaadin-tooltip
            slot="tooltip"
            .ariaLinkMode="${'aria-labelledby'}"
            .text="${this.__effectiveI18n.sidebar}"
          ></vaadin-tooltip>
        </vaadin-button>
      `;
    }

    /**
     * Returns the template of the sidebar with the page thumbnails.
     * @protected
     */
    _renderSidebar() {
      // The list has tabindex="-1", so that Firefox does not make the scrollable list a tab stop.
      return html`
        <div
          id="backdrop"
          part="backdrop"
          ?hidden="${!(this._sidebarOverlay && this.sidebarOpened)}"
          @click="${this.#onBackdropClick}"
        ></div>
        <div id="sidebar" part="sidebar" ?hidden="${!this.sidebarOpened}">
          <div
            id="thumbnails"
            part="thumbnails"
            role="listbox"
            tabindex="-1"
            aria-label="${this.__effectiveI18n.thumbnails}"
          ></div>
        </div>
      `;
    }

    /**
     * Returns the width of each page divided by its height. Until the pages
     * load their own size, they have the size of the first page.
     * @private
     */
    #getAspectRatios() {
      return this.__pages.map((page) => page.unscaledWidth / page.unscaledHeight);
    }

    /**
     * Moves focus from the sidebar to the sidebar button, or to the pages
     * when the button is hidden, e.g. with the collapsed toolbar.
     * @private
     */
    #moveFocusOutOfSidebar() {
      const active = this.shadowRoot.activeElement;
      if (active && this.$.sidebar.contains(active)) {
        const button = this.#getSidebarButton();
        const target = button?.checkVisibility() ? button : this.$.content;
        // The pages are inert under the sidebar until this update renders.
        this.$.content.inert = false;
        target.focus({ focusVisible: isKeyboardActive() });
      }
    }

    /** @private */
    #getSidebarButton() {
      return this.querySelector(':scope > [slot="toolbar-sidebar"]');
    }

    /**
     * Reads from CSS whether the sidebar shows over the pages, as `vaadin-app-layout` does for its drawer.
     * @private
     */
    #updateOverlay() {
      // A hidden viewer has no width, and keeps its mode until it shows.
      if (this.clientWidth) {
        this._sidebarOverlay =
          getComputedStyle(this.$.content).getPropertyValue('--_sidebar-overlay').trim() === 'true';
      }
    }

    /** @private */
    #onBackdropClick() {
      this.sidebarOpened = false;
    }

    /** @private */
    #onThumbnailSelect(page) {
      this._scrollToPage(page);
      this.dispatchEvent(new CustomEvent('thumbnail-click', { detail: { page } }));
      if (this._sidebarOverlay) {
        this.sidebarOpened = false;
      }
    }

    /** @private */
    #onSidebarButtonClick() {
      this.sidebarOpened = !this.sidebarOpened;
    }
  };
