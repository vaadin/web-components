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
import '@vaadin/integer-field/src/vaadin-integer-field.js';
import '@vaadin/select/src/vaadin-select.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import './vaadin-pdf-viewer-button.js';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { formatZoom, getZoomInLevel, getZoomOutLevel, ZOOM_LEVELS } from './pdf-viewer-zoom-utils.js';

/**
 * Returns the last part of the path of a URL, e.g. the file name of
 * `/files/report.pdf`, or null for URLs without one, e.g. blob URLs.
 * @param {string | null | undefined} src
 * @return {string | null}
 */
function getFileNameFromUrl(src) {
  if (!src) {
    return null;
  }
  try {
    const { protocol, pathname } = new URL(src, document.baseURI);
    if (!['http:', 'https:', 'file:'].includes(protocol)) {
      return null;
    }
    return decodeURIComponent(pathname.split('/').pop()) || null;
  } catch {
    return null;
  }
}

/**
 * A mixin that adds the header and the toolbar with the page navigation and
 * the zoom. The controls of the toolbar are Vaadin components, rendered into
 * the light DOM so that themes can style them like any other instance of
 * these components.
 */
export const PdfViewerToolbarMixin = (superClass) =>
  class PdfViewerToolbarMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Whether the header is shown above the toolbar. The header shows
         * `headerTitle`, or else the file name of `src`, and collapses and
         * expands the toolbar when clicked.
         *
         * @attr {boolean} header-visible
         */
        headerVisible: {
          type: Boolean,
          value: false,
        },

        /**
         * The title shown in the header, see `headerVisible`. When not set,
         * the header shows the file name of `src`.
         *
         * @attr {string} header-title
         */
        headerTitle: {
          type: String,
        },

        /**
         * Whether the toolbar is collapsed. The header collapses and expands
         * it, so the toolbar collapses only while the header is shown, see
         * `headerVisible`.
         *
         * @attr {boolean} toolbar-collapsed
         */
        toolbarCollapsed: {
          type: Boolean,
          value: false,
          notify: true,
        },
      };
    }

    /** The items of the zoom select, built again only when `zoom` or the texts change. */
    #zoomItems = [];

    /** @protected */
    willUpdate(props) {
      super.willUpdate(props);

      if (props.has('zoom') || props.has('__effectiveI18n')) {
        this.#zoomItems = this.#getZoomItems();
      }
    }

    /**
     * Returns the template of the header and the toolbar, which show the
     * controls of `_renderToolbarControls()` in their slots.
     * @protected
     */
    _renderToolbar() {
      const title = this.headerTitle || getFileNameFromUrl(this.src) || this.__effectiveI18n.document;
      // The toolbar collapses only while the header, which expands it, is shown.
      const collapsed = this.toolbarCollapsed && this.headerVisible;
      return html`
        <button
          part="header"
          aria-controls="toolbar"
          aria-expanded="${collapsed ? 'false' : 'true'}"
          ?hidden="${!this.headerVisible}"
          @click="${this.#onHeaderClick}"
        >
          <span part="title" dir="auto" title="${title}">${title}</span>
          <span part="header-toggle"></span>
        </button>
        <div id="toolbar" part="toolbar" ?hidden="${collapsed}">
          <div part="toolbar-group"><slot name="toolbar-navigation"></slot></div>
          <div part="toolbar-group"><slot name="toolbar-zoom"></slot></div>
          <div part="toolbar-group"><slot name="toolbar-actions"></slot></div>
        </div>
      `;
    }

    /**
     * Returns the template of the toolbar controls, which are rendered into
     * the light DOM.
     * @protected
     */
    _renderToolbarControls() {
      const { page, pageCount } = this;
      const zoomFactor = this._zoomFactor;
      const hasDocument = pageCount > 0;
      const i18n = this.__effectiveI18n;

      return html`
        <vaadin-pdf-viewer-button
          slot="toolbar-navigation"
          icon="previous-page"
          theme="tertiary icon"
          .disabled="${!hasDocument || page <= 1}"
          @click="${this.#onPreviousPageClick}"
        >
          <vaadin-tooltip slot="tooltip" .text="${i18n.previousPage}"></vaadin-tooltip>
        </vaadin-pdf-viewer-button>
        <vaadin-pdf-viewer-button
          slot="toolbar-navigation"
          icon="next-page"
          theme="tertiary icon"
          .disabled="${!hasDocument || page >= pageCount}"
          @click="${this.#onNextPageClick}"
        >
          <vaadin-tooltip slot="tooltip" .text="${i18n.nextPage}"></vaadin-tooltip>
        </vaadin-pdf-viewer-button>
        <vaadin-integer-field
          slot="toolbar-navigation"
          theme="align-right"
          style="${styleMap({ '--_page-digits': String(pageCount).length })}"
          min="1"
          max="${pageCount || 1}"
          .value="${this.#getPageFieldValue()}"
          .errorMessage="${i18n.pageError.replace('{pageCount}', pageCount)}"
          .disabled="${!hasDocument}"
          @change="${this.#onPageFieldChange}"
          @input="${this.#onPageFieldInput}"
          @keydown="${this.#onPageFieldKeyDown}"
        >
          <span slot="suffix">${hasDocument ? `/ ${pageCount}` : ''}</span>
        </vaadin-integer-field>
        <vaadin-pdf-viewer-button
          slot="toolbar-zoom"
          icon="zoom-out"
          theme="tertiary icon"
          .disabled="${!hasDocument || !getZoomOutLevel(zoomFactor)}"
          @click="${this.#onZoomOutClick}"
        >
          <vaadin-tooltip slot="tooltip" .text="${i18n.zoomOut}"></vaadin-tooltip>
        </vaadin-pdf-viewer-button>
        <vaadin-select
          slot="toolbar-zoom"
          theme="align-center"
          .items="${this.#zoomItems}"
          .value="${String(this.zoom)}"
          .disabled="${!hasDocument}"
          @change="${this.#onZoomSelectChange}"
        ></vaadin-select>
        <vaadin-pdf-viewer-button
          slot="toolbar-zoom"
          icon="zoom-in"
          theme="tertiary icon"
          .disabled="${!hasDocument || !getZoomInLevel(zoomFactor)}"
          @click="${this.#onZoomInClick}"
        >
          <vaadin-tooltip slot="tooltip" .text="${i18n.zoomIn}"></vaadin-tooltip>
        </vaadin-pdf-viewer-button>
      `;
    }

    /** @private */
    #onHeaderClick() {
      this.toolbarCollapsed = !this.toolbarCollapsed;
    }

    /** @private */
    #onPreviousPageClick() {
      this._scrollToPage(Math.min(this.page, this.pageCount + 1) - 1);
    }

    /** @private */
    #onNextPageClick() {
      this._scrollToPage(Math.max(this.page, 0) + 1);
    }

    /**
     * Returns the value of the page field. A page out of range set by the
     * application gives an empty field, as it would make the field invalid.
     * @return {string}
     * @private
     */
    #getPageFieldValue() {
      const { page, pageCount } = this;
      return Number.isInteger(page) && page >= 1 && page <= pageCount ? String(page) : '';
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

    /**
     * Returns the items of the zoom select: the fit zooms, the zoom levels,
     * and a zoom set by the application that is not one of the levels.
     * @private
     */
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
