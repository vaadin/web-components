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
import '@vaadin/integer-field/src/vaadin-integer-field.js';
import '@vaadin/select/src/vaadin-select.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import './vaadin-pdf-viewer-icon.js';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { slotContent } from '@vaadin/component-base/src/directives/slot-content.js';
import { formatZoom, getZoomInLevel, getZoomOutLevel, ZOOM_LEVELS } from './pdf-viewer-zoom-utils.js';

/**
 * A mixin that adds the header and the toolbar with the page navigation, the
 * zoom and the download button. The controls of the toolbar are Vaadin
 * components, rendered into the light DOM so that themes can style them like
 * any other instance of these components.
 */
export const PdfViewerToolbarMixin = (superClass) =>
  class PdfViewerToolbarMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Whether the header above the toolbar is hidden. The header shows
         * `headerTitle`, or else the name of the document, and collapses and
         * expands the toolbar when clicked.
         *
         * @attr {boolean} header-hidden
         */
        headerHidden: {
          type: Boolean,
          value: false,
        },

        /**
         * The title shown in the header, see `headerHidden`. When not set,
         * the header shows `fileName`, else the PDF file name from the
         * `Content-Disposition` header of the response, else the PDF file name
         * at the end of the path of `src`, else the `document` text of `i18n`.
         *
         * @attr {string} header-title
         */
        headerTitle: {
          type: String,
        },

        /**
         * Whether the toolbar is collapsed. The header collapses and expands
         * it, so the toolbar collapses only while the header is shown, see
         * `headerHidden`.
         *
         * @attr {boolean} toolbar-collapsed
         */
        toolbarCollapsed: {
          type: Boolean,
          value: false,
          notify: true,
        },

        /**
         * Whether the button that downloads the document is hidden from the
         * toolbar. The `download()` method works also while it is hidden.
         *
         * @attr {boolean} download-button-hidden
         */
        downloadButtonHidden: {
          type: Boolean,
          value: false,
        },
      };
    }

    #zoomItems = [];

    /** @protected */
    willUpdate(props) {
      super.willUpdate(props);

      if (props.has('zoom') || props.has('__effectiveI18n')) {
        this.#zoomItems = this.#getZoomItems();
      }
    }

    /**
     * Returns the template of the header and the toolbar.
     * @protected
     */
    _renderToolbar() {
      const title = this.headerTitle || this._getDocumentName() || this.__effectiveI18n.document;
      // The toolbar collapses only while the header, which expands it, is shown.
      const collapsed = this.toolbarCollapsed && !this.headerHidden;
      return html`
        <button
          part="header"
          aria-controls="toolbar"
          aria-expanded="${collapsed ? 'false' : 'true'}"
          ?hidden="${this.headerHidden}"
          @click="${this.#onHeaderClick}"
        >
          <span id="title" part="title" dir="auto" title="${title}">${title}</span>
          <span part="header-toggle"></span>
        </button>
        <div id="toolbar" part="toolbar" ?hidden="${collapsed}">
          <div part="toolbar-group">
            <slot name="toolbar-navigation" ${slotContent(this._renderNavigationControls())}></slot>
          </div>
          <div part="toolbar-group">
            <slot name="toolbar-zoom" ${slotContent(this._renderZoomControls())}></slot>
          </div>
          <div part="toolbar-group">
            <slot name="toolbar-actions"></slot>
            <slot name="toolbar-download" ${slotContent(this._renderDownloadButton())}></slot>
          </div>
        </div>
      `;
    }

    /**
     * Returns the template of the navigation controls in the `toolbar-navigation` slot.
     * @protected
     */
    _renderNavigationControls() {
      const { page, pageCount } = this;
      const hasDocument = pageCount > 0;
      const i18n = this.__effectiveI18n;

      return html`
        <vaadin-button
          slot="toolbar-navigation"
          theme="tertiary icon"
          .disabled="${!hasDocument || page <= 1}"
          @click="${this.#onPreviousPageClick}"
        >
          <vaadin-pdf-viewer-icon icon="previous-page" aria-hidden="true"></vaadin-pdf-viewer-icon>
          <vaadin-tooltip
            slot="tooltip"
            .ariaLinkMode="${'aria-labelledby'}"
            .text="${i18n.previousPage}"
          ></vaadin-tooltip>
        </vaadin-button>
        <vaadin-button
          slot="toolbar-navigation"
          theme="tertiary icon"
          .disabled="${!hasDocument || page >= pageCount}"
          @click="${this.#onNextPageClick}"
        >
          <vaadin-pdf-viewer-icon icon="next-page" aria-hidden="true"></vaadin-pdf-viewer-icon>
          <vaadin-tooltip slot="tooltip" .ariaLinkMode="${'aria-labelledby'}" .text="${i18n.nextPage}"></vaadin-tooltip>
        </vaadin-button>
        <vaadin-integer-field
          slot="toolbar-navigation"
          theme="align-right"
          style="${styleMap({ '--_page-digits': String(pageCount).length })}"
          min="1"
          max="${pageCount || 1}"
          .value="${this.#getPageFieldValue()}"
          .accessibleName="${i18n.page}"
          .errorMessage="${i18n.pageError.replace('{pageCount}', pageCount)}"
          .disabled="${!hasDocument}"
          @change="${this.#onPageFieldChange}"
          @input="${this.#onPageFieldInput}"
          @keydown="${this.#onPageFieldKeyDown}"
        >
          <span slot="suffix">${hasDocument ? `/ ${pageCount}` : ''}</span>
        </vaadin-integer-field>
      `;
    }

    /**
     * Returns the template of the zoom controls in the `toolbar-zoom` slot.
     * @protected
     */
    _renderZoomControls() {
      const zoomFactor = this._zoomFactor;
      const hasDocument = this.pageCount > 0;
      const i18n = this.__effectiveI18n;

      return html`
        <vaadin-button
          slot="toolbar-zoom"
          theme="tertiary icon"
          .disabled="${!hasDocument || !getZoomOutLevel(zoomFactor)}"
          @click="${this.#onZoomOutClick}"
        >
          <vaadin-pdf-viewer-icon icon="zoom-out" aria-hidden="true"></vaadin-pdf-viewer-icon>
          <vaadin-tooltip slot="tooltip" .ariaLinkMode="${'aria-labelledby'}" .text="${i18n.zoomOut}"></vaadin-tooltip>
        </vaadin-button>
        <vaadin-select
          slot="toolbar-zoom"
          theme="align-center"
          .items="${this.#zoomItems}"
          .value="${String(this.zoom)}"
          .accessibleName="${i18n.zoom}"
          .disabled="${!hasDocument}"
          @change="${this.#onZoomSelectChange}"
        ></vaadin-select>
        <vaadin-button
          slot="toolbar-zoom"
          theme="tertiary icon"
          .disabled="${!hasDocument || !getZoomInLevel(zoomFactor)}"
          @click="${this.#onZoomInClick}"
        >
          <vaadin-pdf-viewer-icon icon="zoom-in" aria-hidden="true"></vaadin-pdf-viewer-icon>
          <vaadin-tooltip slot="tooltip" .ariaLinkMode="${'aria-labelledby'}" .text="${i18n.zoomIn}"></vaadin-tooltip>
        </vaadin-button>
      `;
    }

    /**
     * Returns the template of the download button in the `toolbar-download` slot.
     * @protected
     */
    _renderDownloadButton() {
      return html`
        <vaadin-button
          slot="toolbar-download"
          theme="tertiary icon"
          ?hidden="${this.downloadButtonHidden}"
          .disabled="${!this.pageCount}"
          @click="${this.#onDownloadClick}"
        >
          <vaadin-pdf-viewer-icon icon="download" aria-hidden="true"></vaadin-pdf-viewer-icon>
          <vaadin-tooltip
            slot="tooltip"
            .ariaLinkMode="${'aria-labelledby'}"
            .text="${this.__effectiveI18n.download}"
          ></vaadin-tooltip>
        </vaadin-button>
      `;
    }

    /** @private */
    #onHeaderClick() {
      this.toolbarCollapsed = !this.toolbarCollapsed;
    }

    /** @private */
    #onPreviousPageClick() {
      this._scrollToPage(this.page - 1);
    }

    /** @private */
    #onDownloadClick() {
      this.download();
    }

    /** @private */
    #onNextPageClick() {
      this._scrollToPage(this.page + 1);
    }

    /** @private */
    #getPageFieldValue() {
      return this.pageCount ? String(this.page) : '';
    }

    /**
     * Goes to the entered page. The field validates the entry against `min`
     * and `max` and keeps a page that does not exist with its error message.
     * An empty field shows the current page again.
     * @private
     */
    #onPageFieldChange(event) {
      // The change is internal to the viewer. Applications listen to `page-changed`.
      event.stopPropagation();
      const field = event.target;
      if (field.value === '') {
        field.value = this.#getPageFieldValue();
      } else if (!field.invalid) {
        this._scrollToPage(Number(field.value));
      }
    }

    /** @private */
    #onPageFieldInput(event) {
      event.stopPropagation();
    }

    /** @private */
    #onPageFieldKeyDown(event) {
      // Don't submit a form that contains the viewer.
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    }

    /** @private */
    #getZoomItems() {
      const i18n = this.__effectiveI18n;
      const items = [
        { label: i18n.pageWidth, value: 'page-width' },
        { label: i18n.pageFit, value: 'page-fit' },
        ...ZOOM_LEVELS.map((level) => ({ label: formatZoom(level), value: String(level) })),
      ];
      const value = String(this.zoom);
      if (!items.some((item) => item.value === value)) {
        items.push({ label: formatZoom(Number(value)), value });
      }
      return items;
    }

    /** @private */
    #onZoomInClick() {
      this._stepZoom(1);
    }

    /** @private */
    #onZoomOutClick() {
      this._stepZoom(-1);
    }

    /** @private */
    #onZoomSelectChange(event) {
      // The change is internal to the viewer. Applications listen to `zoom-changed`.
      event.stopPropagation();
      const { value } = event.target;
      this.zoom = value === 'page-width' || value === 'page-fit' ? value : Number(value);
    }
  };
