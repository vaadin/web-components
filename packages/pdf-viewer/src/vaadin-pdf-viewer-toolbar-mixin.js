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
import { live } from 'lit/directives/live.js';
import { styleMap } from 'lit/directives/style-map.js';
import { formatZoom, getZoomInLevel, getZoomOutLevel, isValidZoom, ZOOM_LEVELS } from './pdf-viewer-zoom.js';

/**
 * A mixin that adds the toolbar with the page navigation and the zoom. The
 * controls of the toolbar are Vaadin components, rendered into the light DOM
 * so that themes can style them like any other instance of these components.
 */
export const PdfViewerToolbarMixin = (superClass) =>
  class PdfViewerToolbarMixinClass extends superClass {
    /**
     * Returns the template of the toolbar, which shows the controls of
     * `_renderToolbarControls()` in its slots.
     * @protected
     */
    _renderToolbar() {
      return html`
        <div part="toolbar">
          <div part="toolbar-group" class="navigation"><slot name="toolbar-navigation"></slot></div>
          <div part="toolbar-group" class="viewing"><slot name="toolbar-zoom"></slot></div>
          <div part="toolbar-group" class="actions"><slot name="toolbar-actions"></slot></div>
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
          .items="${this.#getZoomItems(i18n)}"
          .value="${live(this.#getZoomValue())}"
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
     * Returns the value of the zoom select. An invalid zoom gives `page-width`,
     * as the pages are then shown at page width.
     * @return {string}
     * @private
     */
    #getZoomValue() {
      const { zoom } = this;
      return isValidZoom(zoom) ? String(zoom) : 'page-width';
    }

    /**
     * Returns the items of the zoom select: the fit zooms, the zoom levels,
     * and a zoom set by the application that is not one of the levels.
     * @private
     */
    #getZoomItems(i18n) {
      const items = [
        { label: i18n.pageWidth, value: 'page-width' },
        { label: i18n.pageFit, value: 'page-fit' },
        ...ZOOM_LEVELS.map((level) => ({ label: formatZoom(level), value: String(level) })),
      ];
      const value = this.#getZoomValue();
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
