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
import { html, render } from 'lit';
import { live } from 'lit/directives/live.js';
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';

/** The zoom levels of the zoom select and of the zoom in / out buttons. */
const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];

/** Tolerance for comparing zoom factors, which come from computed scales. */
const ZOOM_EPSILON = 0.001;

function formatZoom(zoom) {
  return `${Math.round(zoom * 100)}%`;
}

/**
 * Renders the toolbar of the PDF viewer. Its controls are Vaadin components,
 * rendered into the light DOM so that themes can style them like any other
 * instance of these components.
 *
 * @polymerMixin
 */
export const PdfViewerToolbarMixin = (superClass) =>
  class PdfViewerToolbarMixinClass extends superClass {
    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.addEventListener('mouseenter', (event) => this.#showTooltip(event), true);
      this.addEventListener('focusin', (event) => this.#showTooltip(event));
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (
        props.has('page') ||
        props.has('pageCount') ||
        props.has('zoom') ||
        props.has('_zoomFactor') ||
        props.has('__effectiveI18n')
      ) {
        this.#renderToolbar();
      }
    }

    /** @private */
    #renderToolbar() {
      const i18n = this.__effectiveI18n;
      const { page, pageCount } = this;
      const hasDocument = pageCount > 0;
      const zoomFactor = this._zoomFactor;

      render(
        html`
          <vaadin-pdf-viewer-button
            slot="toolbar-navigation"
            icon="previous-page"
            theme="tertiary icon"
            aria-label="${i18n.previousPage}"
            .disabled="${!hasDocument || page <= 1}"
            @click="${this.#onPreviousPageClick}"
          ></vaadin-pdf-viewer-button>
          <vaadin-integer-field
            slot="toolbar-navigation"
            theme="align-center"
            accessible-name="${i18n.page}"
            min="1"
            max="${pageCount || 1}"
            .value="${live(hasDocument ? String(page) : '')}"
            .disabled="${!hasDocument}"
            @change="${this.#onPageFieldChange}"
          >
            <span slot="suffix" aria-hidden="true">${hasDocument ? `/ ${pageCount}` : ''}</span>
          </vaadin-integer-field>
          <vaadin-pdf-viewer-button
            slot="toolbar-navigation"
            icon="next-page"
            theme="tertiary icon"
            aria-label="${i18n.nextPage}"
            .disabled="${!hasDocument || page >= pageCount}"
            @click="${this.#onNextPageClick}"
          ></vaadin-pdf-viewer-button>
          <vaadin-pdf-viewer-button
            slot="toolbar-zoom"
            icon="zoom-out"
            theme="tertiary icon"
            aria-label="${i18n.zoomOut}"
            .disabled="${!hasDocument || !this.#getZoomOutLevel(zoomFactor)}"
            @click="${this.#onZoomOutClick}"
          ></vaadin-pdf-viewer-button>
          <vaadin-select
            slot="toolbar-zoom"
            accessible-name="${i18n.zoom}"
            .items="${this.#getZoomItems(i18n)}"
            .value="${live(String(this.zoom))}"
            .disabled="${!hasDocument}"
            @change="${this.#onZoomSelectChange}"
          ></vaadin-select>
          <vaadin-pdf-viewer-button
            slot="toolbar-zoom"
            icon="zoom-in"
            theme="tertiary icon"
            aria-label="${i18n.zoomIn}"
            .disabled="${!hasDocument || !this.#getZoomInLevel(zoomFactor)}"
            @click="${this.#onZoomInClick}"
          ></vaadin-pdf-viewer-button>
          <vaadin-tooltip slot="tooltip" .ariaLinkMode="${'none'}"></vaadin-tooltip>
        `,
        this,
        { host: this },
      );

      // A button that gets disabled while focused (e.g. "next page" on the
      // last page) loses keyboard focus. Move it to the next control instead.
      const focusedButton = this.querySelector(':scope > vaadin-pdf-viewer-button[disabled]:focus');
      if (focusedButton) {
        const next = this.querySelector(
          `:scope > [slot="${focusedButton.slot}"]:not([disabled], vaadin-pdf-viewer-button)`,
        );
        next?.focus({ focusVisible: isKeyboardActive() });
      }
    }

    /** @private */
    #getZoomItems(i18n) {
      const items = [
        { label: i18n.pageWidth, value: 'page-width' },
        { label: i18n.pageFit, value: 'page-fit' },
        ...ZOOM_LEVELS.map((level) => ({ label: formatZoom(level), value: String(level) })),
      ];
      // Show a zoom set by the application that is not one of the levels.
      const zoom = String(this.zoom);
      if (!items.some((item) => item.value === zoom) && Number(zoom) > 0) {
        items.push({ label: formatZoom(Number(zoom)), value: zoom });
      }
      return items;
    }

    /** @private */
    #getZoomInLevel(zoomFactor) {
      return zoomFactor > 0 ? ZOOM_LEVELS.find((level) => level > zoomFactor + ZOOM_EPSILON) : undefined;
    }

    /** @private */
    #getZoomOutLevel(zoomFactor) {
      return zoomFactor > 0 ? ZOOM_LEVELS.findLast((level) => level < zoomFactor - ZOOM_EPSILON) : undefined;
    }

    /** @private */
    #goToPage(page) {
      this.page = page;
      const i18n = this.__effectiveI18n;
      announce(i18n.pageAnnouncement.replace('{page}', page).replace('{pageCount}', this.pageCount));
    }

    /** @private */
    #onPreviousPageClick() {
      this.#goToPage(Math.min(this.page, this.pageCount) - 1);
    }

    /** @private */
    #onNextPageClick() {
      this.#goToPage(Math.max(this.page, 0) + 1);
    }

    /** @private */
    #onPageFieldChange(event) {
      const page = Number(event.target.value);
      if (Number.isInteger(page) && page >= 1 && page <= this.pageCount) {
        this.#goToPage(page);
      } else {
        // Show the current page again
        event.target.value = String(this.page);
        event.target._requestValidation();
      }
    }

    /** @private */
    #setZoom(zoom) {
      this.zoom = zoom;
      announce(formatZoom(zoom));
    }

    /** @private */
    #onZoomInClick() {
      this.#setZoom(this.#getZoomInLevel(this._zoomFactor));
    }

    /** @private */
    #onZoomOutClick() {
      this.#setZoom(this.#getZoomOutLevel(this._zoomFactor));
    }

    /** @private */
    #onZoomSelectChange(event) {
      const { value } = event.target;
      this.zoom = value === 'page-width' || value === 'page-fit' ? value : Number(value);
    }

    /**
     * Shows the label of a toolbar button as a tooltip when hovering it, or
     * when focusing it with the keyboard.
     * @private
     */
    #showTooltip({ type, target }) {
      if (target.localName !== 'vaadin-pdf-viewer-button' || target.parentNode !== this) {
        return;
      }
      if (type === 'focusin' && !isKeyboardActive()) {
        return;
      }
      const tooltip = this.querySelector(':scope > vaadin-tooltip');
      tooltip.target = target;
      tooltip.text = target.getAttribute('aria-label');
      tooltip._stateController.open({
        focus: type === 'focusin',
        hover: type === 'mouseenter',
      });
    }
  };
