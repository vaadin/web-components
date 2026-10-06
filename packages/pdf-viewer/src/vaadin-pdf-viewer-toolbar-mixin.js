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
import '@vaadin/text-field/src/vaadin-text-field.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import './vaadin-pdf-viewer-button.js';
import { html, nothing, render } from 'lit';
import { live } from 'lit/directives/live.js';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { formatZoom, getZoomInLevel, getZoomOutLevel, ZOOM_LEVELS } from './pdf-viewer-zoom.js';

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
        props.has('__effectiveI18n') ||
        props.has('__findOpened') ||
        props.has('__findMatchCount') ||
        props.has('__findCurrentIndex')
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
      // The page field only shows a page that exists. A page out of range set by
      // the application would make the field invalid.
      const pageValue = hasDocument && page >= 1 && page <= pageCount ? String(page) : '';

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
            accessible-name="${hasDocument ? i18n.pageOf.replace('{pageCount}', pageCount) : i18n.page}"
            min="1"
            max="${pageCount || 1}"
            .value="${live(pageValue)}"
            .disabled="${!hasDocument}"
            @change="${this.#onPageFieldChange}"
            @input="${this.#stopEvent}"
            @keydown="${this.#onPageFieldKeyDown}"
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
            .disabled="${!hasDocument || !getZoomOutLevel(zoomFactor)}"
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
            .disabled="${!hasDocument || !getZoomInLevel(zoomFactor)}"
            @click="${this.#onZoomInClick}"
          ></vaadin-pdf-viewer-button>
          <vaadin-pdf-viewer-button
            slot="toolbar-actions"
            icon="find"
            theme="tertiary icon"
            aria-label="${i18n.find}"
            aria-pressed="${this.__findOpened ? 'true' : 'false'}"
            .disabled="${!hasDocument}"
            @click="${this.#onFindToggleClick}"
          ></vaadin-pdf-viewer-button>
          ${this.#renderFindBar(i18n, hasDocument)}
          <vaadin-tooltip slot="toolbar-tooltip" .ariaLinkMode="${'none'}"></vaadin-tooltip>
        `,
        this,
        { host: this },
      );

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

    /** @private */
    #renderFindBar(i18n, hasDocument) {
      if (!this.__findOpened) {
        return nothing;
      }
      const count = this.__findMatchCount;
      const result = count
        ? i18n.findResult.replace('{current}', this.__findCurrentIndex + 1).replace('{total}', count)
        : i18n.findNoMatches;
      return html`
        <vaadin-text-field
          slot="find"
          accessible-name="${i18n.find}"
          placeholder="${i18n.find}"
          .value="${live(this.__findQuery)}"
          .disabled="${!hasDocument}"
          @input="${this.#onFindInput}"
          @change="${this.#stopEvent}"
          @keydown="${this.#onFindKeyDown}"
        ></vaadin-text-field>
        <span slot="find" aria-hidden="true" ?hidden="${!this.__findQuery.trim()}">${result}</span>
        <vaadin-pdf-viewer-button
          slot="find"
          icon="previous-match"
          theme="tertiary icon"
          aria-label="${i18n.previousMatch}"
          .disabled="${count === 0}"
          @click="${this.#onPreviousMatchClick}"
        ></vaadin-pdf-viewer-button>
        <vaadin-pdf-viewer-button
          slot="find"
          icon="next-match"
          theme="tertiary icon"
          aria-label="${i18n.nextMatch}"
          .disabled="${count === 0}"
          @click="${this.#onNextMatchClick}"
        ></vaadin-pdf-viewer-button>
        <vaadin-pdf-viewer-button
          slot="find"
          icon="close"
          theme="tertiary icon"
          aria-label="${i18n.closeFind}"
          @click="${this.#onCloseFindClick}"
        ></vaadin-pdf-viewer-button>
      `;
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

    /** @private */
    #getZoomItems(i18n) {
      const items = [
        { label: i18n.pageWidth, value: 'page-width' },
        { label: i18n.pageFit, value: 'page-fit' },
        ...ZOOM_LEVELS.map((level) => ({ label: formatZoom(level, this), value: String(level) })),
      ];
      // Show a zoom set by the application that is not one of the levels.
      const zoom = String(this.zoom);
      if (!items.some((item) => item.value === zoom) && Number(zoom) > 0) {
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

    /** @private */
    #onPageFieldChange(event) {
      // The change is internal to the viewer. Applications listen to `page-changed`.
      event.stopPropagation();
      const page = Number(event.target.value);
      if (Number.isInteger(page) && page >= 1 && page <= this.pageCount) {
        this._goToPage(page);
      } else {
        // Show the current page again
        event.target.value = this.page >= 1 && this.page <= this.pageCount ? String(this.page) : '';
        event.target._requestValidation();
      }
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
      const tooltip = this.querySelector(':scope > vaadin-tooltip[slot="toolbar-tooltip"]');
      tooltip.target = target;
      tooltip.text = target.getAttribute('aria-label');
      tooltip._stateController.open({
        focus: type === 'focusin',
        hover: type === 'mouseenter',
      });
    }
  };
