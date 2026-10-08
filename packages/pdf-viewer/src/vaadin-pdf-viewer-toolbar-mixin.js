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
import '@vaadin/progress-bar/src/vaadin-progress-bar.js';
import '@vaadin/select/src/vaadin-select.js';
import '@vaadin/text-field/src/vaadin-text-field.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import './vaadin-pdf-viewer-button.js';
import { html, nothing, render } from 'lit';
import { live } from 'lit/directives/live.js';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { formatZoom, getZoomInLevel, getZoomOutLevel, isValidZoom, ZOOM_LEVELS } from './pdf-viewer-zoom.js';

/**
 * Renders the toolbar of the PDF viewer. Its controls are Vaadin components,
 * rendered into the light DOM so that themes can style them like any other
 * instance of these components.
 *
 * @polymerMixin
 */
export const PdfViewerToolbarMixin = (superClass) =>
  class PdfViewerToolbarMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * A page number entered by the user that does not exist, which is kept
         * in the field until the page changes, or null.
         * @private
         */
        __invalidPageEntry: {
          type: String,
          value: null,
          attribute: false,
        },
      };
    }

    /** The id of the error message of the page field. */
    #pageErrorId = `pdf-viewer-page-error-${generateUniqueId()}`;

    /**
     * Override method from `LitElement` to render the toolbar when the state it shows changes.
     * @protected
     * @override
     */
    updated(props) {
      super.updated(props);

      if (
        props.has('sidebarOpened') ||
        props.has('__outline') ||
        props.has('__sidebarView') ||
        props.has('page') ||
        props.has('pageCount') ||
        props.has('zoom') ||
        props.has('_zoomFactor') ||
        props.has('__effectiveI18n') ||
        props.has('__findOpened') ||
        props.has('__findMatchCount') ||
        props.has('__findSearching') ||
        props.has('__findQuery') ||
        props.has('__printProgress') ||
        props.has('__findCurrentIndex') ||
        props.has('__invalidPageEntry')
      ) {
        // The field shows the current page again when it changes.
        if (props.has('page') || props.has('pageCount')) {
          this.__invalidPageEntry = null;
        }
        this.#renderToolbar();
      }
    }

    /** @private */
    #renderToolbar() {
      const i18n = this.__effectiveI18n;
      const { page, pageCount } = this;
      const hasDocument = pageCount > 0;
      const zoomFactor = this._zoomFactor;
      // The page field only shows a page that exists. A page out of range set by
      // the application would make the field invalid.
      const pageValue = hasDocument && page >= 1 && page <= pageCount ? String(page) : '';

      render(
        html`
          <vaadin-pdf-viewer-button
            slot="toolbar-navigation"
            icon="sidebar"
            theme="tertiary icon"
            aria-label="${i18n.sidebar}"
            aria-pressed="${this.sidebarOpened ? 'true' : 'false'}"
            .disabled="${!hasDocument}"
            @click="${this.#onSidebarToggleClick}"
          >
            ${this.#renderTooltip(i18n.sidebar)}
          </vaadin-pdf-viewer-button>
          <vaadin-pdf-viewer-button
            slot="toolbar-page"
            icon="previous-page"
            theme="tertiary icon"
            aria-label="${i18n.previousPage}"
            .disabled="${!hasDocument || page <= 1}"
            @click="${this.#onPreviousPageClick}"
          >
            ${this.#renderTooltip(i18n.previousPage)}
          </vaadin-pdf-viewer-button>
          <vaadin-integer-field
            slot="toolbar-page"
            theme="align-right"
            style="--_page-digits: ${String(pageCount || 1).length}"
            accessible-name="${hasDocument ? i18n.pageOf.replace('{pageCount}', pageCount) : i18n.page}"
            min="1"
            max="${pageCount || 1}"
            manual-validation
            .value="${live(this.__invalidPageEntry ?? pageValue)}"
            .invalid="${this.__invalidPageEntry !== null}"
            .accessibleDescriptionRef="${this.#pageErrorId}"
            .disabled="${!hasDocument}"
            @change="${this.#onPageFieldChange}"
            @input="${this.#stopEvent}"
            @keydown="${this.#onPageFieldKeyDown}"
          >
            <span slot="suffix" aria-hidden="true">${hasDocument ? `/ ${pageCount}` : ''}</span>
          </vaadin-integer-field>
          <vaadin-pdf-viewer-button
            slot="toolbar-page"
            icon="next-page"
            theme="tertiary icon"
            aria-label="${i18n.nextPage}"
            .disabled="${!hasDocument || page >= pageCount}"
            @click="${this.#onNextPageClick}"
          >
            ${this.#renderTooltip(i18n.nextPage)}
          </vaadin-pdf-viewer-button>
          <span slot="page-error" id="${this.#pageErrorId}" aria-live="assertive"
            >${this.__invalidPageEntry === null ? nothing : i18n.pageError.replace('{pageCount}', pageCount)}</span
          >
          <vaadin-pdf-viewer-button
            slot="toolbar-zoom"
            icon="zoom-out"
            theme="tertiary icon"
            aria-label="${i18n.zoomOut}"
            .disabled="${!hasDocument || !getZoomOutLevel(zoomFactor)}"
            @click="${this.#onZoomOutClick}"
          >
            ${this.#renderTooltip(i18n.zoomOut)}
          </vaadin-pdf-viewer-button>
          <vaadin-select
            slot="toolbar-zoom"
            accessible-name="${i18n.zoom}"
            .items="${this.#getZoomItems(i18n)}"
            .value="${live(this.#getZoomValue())}"
            .disabled="${!hasDocument}"
            @change="${this.#onZoomSelectChange}"
          ></vaadin-select>
          <vaadin-pdf-viewer-button
            slot="toolbar-zoom"
            icon="zoom-in"
            theme="tertiary icon"
            aria-label="${i18n.zoomIn}"
            .disabled="${!hasDocument || !getZoomInLevel(zoomFactor)}"
            @click="${this.#onZoomInClick}"
          >
            ${this.#renderTooltip(i18n.zoomIn)}
          </vaadin-pdf-viewer-button>
          <vaadin-pdf-viewer-button
            slot="toolbar-actions"
            icon="find"
            theme="tertiary icon"
            aria-label="${i18n.find}"
            aria-pressed="${this.__findOpened ? 'true' : 'false'}"
            .disabled="${!hasDocument}"
            @click="${this.#onFindToggleClick}"
          >
            ${this.#renderTooltip(i18n.find)}
          </vaadin-pdf-viewer-button>
          <vaadin-pdf-viewer-button
            slot="toolbar-actions"
            icon="download"
            theme="tertiary icon"
            aria-label="${i18n.download}"
            .disabled="${!hasDocument}"
            @click="${this.#onDownloadClick}"
          >
            ${this.#renderTooltip(i18n.download)}
          </vaadin-pdf-viewer-button>
          <vaadin-pdf-viewer-button
            slot="toolbar-actions"
            icon="print"
            theme="tertiary icon"
            aria-label="${i18n.print}"
            .disabled="${!hasDocument || this.__printProgress >= 0}"
            @click="${this.#onPrintClick}"
          >
            ${this.#renderTooltip(i18n.print)}
          </vaadin-pdf-viewer-button>
          ${this.#renderFindBar(i18n)} ${this.#renderSidebarHeader(i18n)} ${this.#renderPrintProgress(i18n)}
        `,
        this,
        { host: this },
      );

      // Printing disables the print button. Focus the cancel button instead.
      const focusedPrintButton = this.querySelector(':scope > vaadin-pdf-viewer-button[icon="print"][disabled]:focus');
      if (focusedPrintButton) {
        this.querySelector(':scope > vaadin-button[slot="print-progress"]')?.focus({
          focusVisible: isKeyboardActive(),
        });
      }

      // A button that gets disabled while focused with the keyboard (e.g. "next
      // page" on the last page) loses focus. Move it to the field or select of
      // the same group instead. Pointer users keep their focus where it is, so
      // that touch devices don't open the on-screen keyboard.
      const focusedButton = this.querySelector(':scope > vaadin-pdf-viewer-button[disabled]:focus');
      if (focusedButton && isKeyboardActive()) {
        const next = this.querySelector(
          `:scope > [slot="${focusedButton.slot}"]:not([disabled], vaadin-pdf-viewer-button)`,
        );
        next?.focus({ focusVisible: true });
      }
    }

    /**
     * Renders the tooltip of a toolbar button, which shows its label on hover
     * and keyboard focus. The label is the accessible name of the button already.
     * @private
     */
    #renderTooltip(text) {
      return html`<vaadin-tooltip slot="tooltip" .text="${text}" .ariaLinkMode="${'none'}"></vaadin-tooltip>`;
    }

    /** @private */
    #renderFindBar(i18n) {
      if (!this.__findOpened) {
        return nothing;
      }
      const count = this.__findMatchCount;
      let result = count
        ? i18n.findResult.replace('{current}', this.__findCurrentIndex + 1).replace('{total}', count)
        : i18n.findNoMatches;
      // Show no result until the search has gone through all pages.
      if (this.__findSearching || !this.__findQuery.trim()) {
        result = '';
      }
      return html`
        <vaadin-text-field
          slot="find"
          accessible-name="${i18n.find}"
          placeholder="${i18n.find}"
          .value="${live(this.__findQuery)}"
          @input="${this.#onFindInput}"
          @change="${this.#stopEvent}"
          @keydown="${this.#onFindKeyDown}"
        ></vaadin-text-field>
        <span slot="find-actions" dir="auto" aria-hidden="true" ?hidden="${!result}">${result}</span>
        <vaadin-pdf-viewer-button
          slot="find-actions"
          icon="previous-match"
          theme="tertiary icon"
          aria-label="${i18n.previousMatch}"
          .disabled="${count === 0}"
          @click="${this.#onPreviousMatchClick}"
          @keydown="${this.#onFindButtonKeyDown}"
        >
          ${this.#renderTooltip(i18n.previousMatch)}
        </vaadin-pdf-viewer-button>
        <vaadin-pdf-viewer-button
          slot="find-actions"
          icon="next-match"
          theme="tertiary icon"
          aria-label="${i18n.nextMatch}"
          .disabled="${count === 0}"
          @click="${this.#onNextMatchClick}"
          @keydown="${this.#onFindButtonKeyDown}"
        >
          ${this.#renderTooltip(i18n.nextMatch)}
        </vaadin-pdf-viewer-button>
        <vaadin-pdf-viewer-button
          slot="find-actions"
          icon="close"
          theme="tertiary icon"
          aria-label="${i18n.closeFind}"
          @click="${this.#onCloseFindClick}"
          @keydown="${this.#onFindButtonKeyDown}"
        >
          ${this.#renderTooltip(i18n.closeFind)}
        </vaadin-pdf-viewer-button>
      `;
    }

    /**
     * Renders the buttons that switch the sidebar between the thumbnails and
     * the outline, when the document has an outline.
     * @private
     */
    #renderSidebarHeader(i18n) {
      if (!this.__outline) {
        return nothing;
      }
      const view = this.__sidebarView;
      return html`
        <vaadin-pdf-viewer-button
          slot="sidebar-header"
          icon="thumbnails"
          theme="tertiary icon"
          aria-label="${i18n.thumbnailsView}"
          aria-pressed="${view === 'thumbnails' ? 'true' : 'false'}"
          @click="${this.#onThumbnailsViewClick}"
        >
          ${this.#renderTooltip(i18n.thumbnailsView)}
        </vaadin-pdf-viewer-button>
        <vaadin-pdf-viewer-button
          slot="sidebar-header"
          icon="outline"
          theme="tertiary icon"
          aria-label="${i18n.outline}"
          aria-pressed="${view === 'outline' ? 'true' : 'false'}"
          @click="${this.#onOutlineViewClick}"
        >
          ${this.#renderTooltip(i18n.outline)}
        </vaadin-pdf-viewer-button>
      `;
    }

    /** @private */
    #onThumbnailsViewClick() {
      this._setSidebarView('thumbnails');
    }

    /** @private */
    #onOutlineViewClick() {
      this._setSidebarView('outline');
    }

    /**
     * Override method from `PdfViewerFindMixin` to return the find field.
     * @protected
     * @override
     */
    _getFindField() {
      return this.querySelector(':scope > vaadin-text-field[slot="find"]');
    }

    /** @private */
    #renderPrintProgress(i18n) {
      if (this.__printProgress < 0) {
        return nothing;
      }
      return html`
        <vaadin-progress-bar
          slot="print-progress"
          aria-label="${i18n.printing}"
          .value="${this.__printProgress}"
        ></vaadin-progress-bar>
        <vaadin-button slot="print-progress" theme="small" @click="${this.#onCancelPrintClick}"
          >${i18n.cancelPrint}</vaadin-button
        >
      `;
    }

    /** @private */
    #onDownloadClick() {
      this._download();
    }

    /** @private */
    #onPrintClick() {
      this.print();
    }

    /** @private */
    #onCancelPrintClick() {
      this._cancelPrint();
    }

    /** @private */
    #onSidebarToggleClick() {
      this.sidebarOpened = !this.sidebarOpened;
    }

    /** @private */
    #onFindToggleClick() {
      if (this.__findOpened) {
        this._closeFind();
      } else {
        this._openFind();
      }
    }

    /** @private */
    #onFindInput(event) {
      // The input is internal to the viewer.
      event.stopPropagation();
      this._setFindQuery(event.target.value);
    }

    /** @private */
    #onFindKeyDown(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        this._findNext(event.shiftKey ? -1 : 1);
      } else if (event.key === 'Escape') {
        // Don't close a dialog that contains the viewer.
        event.stopPropagation();
        this._closeFind();
      }
    }

    /** @private */
    #onFindButtonKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        this._closeFind();
      }
    }

    /** @private */
    #stopEvent(event) {
      event.stopPropagation();
    }

    /** @private */
    #onPreviousMatchClick() {
      this._findNext(-1);
    }

    /** @private */
    #onNextMatchClick() {
      this._findNext(1);
    }

    /** @private */
    #onCloseFindClick() {
      this._closeFind();
    }

    /**
     * Returns the value of the zoom select, `page-width` for an invalid zoom,
     * as the pages are then shown at page width.
     * @private
     */
    #getZoomValue() {
      const zoom = this.zoom;
      return isValidZoom(zoom) ? String(zoom) : 'page-width';
    }

    /** @private */
    #getZoomItems(i18n) {
      const items = [
        { label: i18n.pageWidth, value: 'page-width' },
        { label: i18n.pageFit, value: 'page-fit' },
        ...ZOOM_LEVELS.map((level) => ({ label: formatZoom(level, this), value: String(level) })),
      ];
      // Show a zoom set by the application that is not one of the levels.
      const zoom = this.#getZoomValue();
      if (!items.some((item) => item.value === zoom)) {
        items.push({ label: formatZoom(Number(zoom), this), value: zoom });
      }
      return items;
    }

    /** @private */
    #onPreviousPageClick() {
      this._goToPage(Math.min(this.page, this.pageCount) - 1);
    }

    /** @private */
    #onNextPageClick() {
      this._goToPage(Math.max(this.page, 0) + 1);
    }

    /**
     * Goes to the entered page. A page that does not exist is kept in the
     * field, which is marked invalid, and an empty field shows the current
     * page again.
     * @private
     */
    #onPageFieldChange(event) {
      // The change is internal to the viewer. Applications listen to `page-changed`.
      event.stopPropagation();
      const { value } = event.target;
      const page = Number(value);
      const isValid = Number.isInteger(page) && page >= 1 && page <= this.pageCount;
      this.__invalidPageEntry = value === '' || isValid ? null : value;
      if (value !== '' && isValid) {
        this._goToPage(page);
      }
      this.#renderToolbar();
    }

    /** @private */
    #onPageFieldKeyDown(event) {
      // Don't submit a form that contains the viewer.
      if (event.key === 'Enter') {
        event.preventDefault();
      }
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
