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
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import './vaadin-pdf-viewer-button.js';
import { html } from 'lit';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { PdfViewerThumbnailsController } from './pdf-viewer-thumbnails-controller.js';

/**
 * A mixin that adds a sidebar next to the pages with a thumbnail of each
 * page, and a button in the toolbar that shows and hides it.
 */
export const PdfViewerSidebarMixin = (superClass) =>
  class PdfViewerSidebarMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Whether the sidebar with the page thumbnails is shown.
         *
         * @attr {boolean} sidebar-opened
         */
        sidebarOpened: {
          type: Boolean,
          value: false,
          notify: true,
          reflectToAttribute: true,
        },
      };
    }

    /** @type {PdfViewerThumbnailsController | null} */
    #thumbnails = null;

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.#thumbnails = new PdfViewerThumbnailsController(this.$.thumbnails, {
        onSelect: (pageNumber) => this._scrollToPage(pageNumber),
      });
      this.addController(this.#thumbnails);
    }

    /** @protected */
    willUpdate(props) {
      super.willUpdate(props);

      // Focus in the sidebar would be lost when it hides.
      if (props.has('sidebarOpened') && !this.sidebarOpened) {
        this.#moveFocusOutOfSidebar();
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
        <vaadin-pdf-viewer-button
          slot="toolbar-sidebar"
          icon="sidebar"
          theme="tertiary icon"
          aria-expanded="${this.sidebarOpened ? 'true' : 'false'}"
          .disabled="${!this.pageCount && !this.sidebarOpened}"
          @click="${this.#onSidebarButtonClick}"
        >
          <vaadin-tooltip
            slot="tooltip"
            .ariaLinkMode="${'aria-labelledby'}"
            .text="${this.__effectiveI18n.sidebar}"
          ></vaadin-tooltip>
        </vaadin-pdf-viewer-button>
      `;
    }

    /**
     * Returns the template of the sidebar next to the pages.
     * @protected
     */
    _renderSidebar() {
      // The list has tabindex="-1", so that Firefox does not make the scrollable list a tab stop.
      return html`
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
        const button = this.querySelector(':scope > [slot="toolbar-sidebar"]');
        const target = button?.checkVisibility() ? button : this.$.content;
        target.focus({ focusVisible: isKeyboardActive() });
      }
    }

    /** @private */
    #onSidebarButtonClick() {
      this.sidebarOpened = !this.sidebarOpened;
    }
  };
