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
import { html, nothing } from 'lit';
import { live } from 'lit/directives/live.js';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { formatZoom, getZoomInLevel, getZoomOutLevel, isValidZoom, ZOOM_LEVELS } from './pdf-viewer-zoom.js';
import { renderButtonTooltip, stopPropagation } from './vaadin-pdf-viewer-button.js';

/**
 * Adds the header and the toolbar to the PDF viewer. The controls of the
 * toolbar are Vaadin components, rendered into the light DOM so that themes
 * can style them like any other instance of these components.
 *
 * @polymerMixin
 */
export const PdfViewerToolbarMixin = (superClass) =>
  class PdfViewerToolbarMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Whether the header is shown above the toolbar while a document is
         * loaded. The header shows `headerTitle`, or else the name of the
         * document, with the button that collapses and expands the toolbar.
         *
         * @attr {boolean} header-visible
         */
        headerVisible: {
          type: Boolean,
          value: false,
        },

        /**
         * The title shown in the header, see `headerVisible`. When set, it is
         * also the accessible name of the viewer, also while the header is
         * hidden. When not set, the header shows the name of the document,
         * see `fileName`.
         *
         * @attr {string} header-title
         */
        headerTitle: {
          type: String,
        },

        /**
         * Whether the toolbar is collapsed. The button that collapses and
         * expands it is in the header, so the toolbar collapses only while
         * the header is shown, see `headerVisible`.
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

    /** A page number entered by the user that does not exist, kept in the field until the page changes, or null. */
    #invalidPageEntry = null;

    /** The id of the error message of the page field. */
    #pageErrorId = `pdf-viewer-page-error-${generateUniqueId()}`;

    /** The toolbar control that had focus before the update, see `#keepFocus()`. */
    #focusedControl = null;

    /**
     * Override method from `LitElement` to keep focused controls in view.
     * @protected
     * @override
     */
    firstUpdated() {
      super.firstUpdated();

      this.addEventListener('focusin', (event) => this.#onFocusIn(event));
    }

    /**
     * Override method from `LitElement` to show the current page in the page
     * field again when it changes, and to remember the focused control.
     * @protected
     * @override
     */
    willUpdate(props) {
      super.willUpdate(props);

      if (props.has('page') || props.has('pageCount')) {
        this.#invalidPageEntry = null;
      }
      this.#focusedControl = this.querySelector(':scope > :focus-within');
    }

    /**
     * Override method from `LitElement` to rename the viewer when the header
     * title changes, and to keep focus in the viewer.
     * @protected
     * @override
     */
    updated(props) {
      super.updated(props);

      if (props.has('headerTitle')) {
        this._updateAccessibleName();
      }

      this.#keepFocus();
    }

    /**
     * Override method from `PdfViewerMixin` to use the header title as the
     * accessible name when set.
     * @return {string}
     * @protected
     * @override
     */
    _getAccessibleName() {
      return this.headerTitle || super._getAccessibleName();
    }

    /**
     * Returns the template of the header and the toolbar, which show the
     * controls of `_renderToolbarControls()` in their slots.
     * @protected
     */
    _renderToolbar() {
      const i18n = this.__effectiveI18n;
      const title = this.headerTitle || this._getDocumentName() || i18n.document;
      return html`
        <div class="top-area">
          <div part="header" ?hidden="${!this.#isHeaderShown()}">
            <span part="title" dir="auto" title="${title}">${title}</span>
            <slot name="toolbar-toggle"></slot>
          </div>
          <div part="toolbar" role="toolbar" aria-label="${i18n.toolbar}" ?hidden="${this.#isToolbarCollapsed()}">
            <div part="toolbar-group" class="navigation">
              <slot name="toolbar-page"></slot>
              <slot name="page-field"></slot>
              <slot name="page-error"></slot>
            </div>
            <div part="toolbar-group" class="viewing">
              <div part="${this.pageCount ? 'zoom-controls' : 'zoom-controls disabled'}">
                <slot name="toolbar-zoom"></slot>
              </div>
            </div>
            <div part="toolbar-group" class="actions">
              <slot name="toolbar-actions"></slot>
              <slot name="download-button"></slot>
            </div>
          </div>
        </div>
      `;
    }

    /**
     * Returns the template of the toolbar controls, which are rendered into
     * the light DOM.
     * @protected
     */
    _renderToolbarControls() {
      const i18n = this.__effectiveI18n;
      const { page, pageCount } = this;
      const hasDocument = pageCount > 0;
      const zoomFactor = this._zoomFactor;
      // The page field only shows a page that exists. A page out of range set by
      // the application would make the field invalid.
      const pageValue = hasDocument && page >= 1 && page <= pageCount ? String(page) : '';
      const invalidPageEntry = this.#invalidPageEntry;

      return html`
        ${this.#renderToolbarToggle(i18n)}
        <vaadin-pdf-viewer-button
          slot="toolbar-page"
          icon="previous-page"
          theme="tertiary icon"
          aria-label="${i18n.previousPage}"
          .disabled="${!hasDocument || page <= 1}"
          @click="${this.#onPreviousPageClick}"
        >
          ${renderButtonTooltip(i18n.previousPage)}
        </vaadin-pdf-viewer-button>
        <vaadin-pdf-viewer-button
          slot="toolbar-page"
          icon="next-page"
          theme="tertiary icon"
          aria-label="${i18n.nextPage}"
          .disabled="${!hasDocument || page >= pageCount}"
          @click="${this.#onNextPageClick}"
        >
          ${renderButtonTooltip(i18n.nextPage)}
        </vaadin-pdf-viewer-button>
        <vaadin-integer-field
          slot="page-field"
          theme="align-right"
          style="--_page-digits: ${Math.max(String(pageCount).length, 2)}"
          accessible-name="${hasDocument ? i18n.pageOf.replace('{pageCount}', pageCount) : i18n.page}"
          min="1"
          max="${pageCount || 1}"
          manual-validation
          .value="${live(invalidPageEntry ?? pageValue)}"
          .invalid="${invalidPageEntry !== null}"
          .accessibleDescriptionRef="${this.#pageErrorId}"
          .disabled="${!hasDocument}"
          @change="${this.#onPageFieldChange}"
          @input="${stopPropagation}"
          @keydown="${this.#onPageFieldKeyDown}"
        >
          <span slot="suffix" aria-hidden="true">${hasDocument ? `/ ${pageCount}` : ''}</span>
        </vaadin-integer-field>
        <span slot="page-error" id="${this.#pageErrorId}" aria-live="assertive"
          >${invalidPageEntry === null ? nothing : i18n.pageError.replace('{pageCount}', pageCount)}</span
        >
        <vaadin-pdf-viewer-button
          slot="toolbar-zoom"
          icon="zoom-out"
          theme="tertiary icon"
          aria-label="${i18n.zoomOut}"
          .disabled="${!hasDocument || !getZoomOutLevel(zoomFactor)}"
          @click="${this.#onZoomOutClick}"
        >
          ${renderButtonTooltip(i18n.zoomOut)}
        </vaadin-pdf-viewer-button>
        <vaadin-select
          slot="toolbar-zoom"
          theme="align-center"
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
          ${renderButtonTooltip(i18n.zoomIn)}
        </vaadin-pdf-viewer-button>
      `;
    }

    /**
     * Keeps focus in the viewer when the control that has it is hidden,
     * removed or disabled: a control of a collapsed toolbar moves focus to the
     * button that expands it, and that button, removed with the header, to
     * the pages.
     * @private
     */
    #keepFocus() {
      const focusedControl = this.#focusedControl;
      this.#focusedControl = null;
      if (!focusedControl) {
        return;
      }

      const options = { focusVisible: isKeyboardActive() };
      const toolbar = this.shadowRoot.querySelector('[part="toolbar"]');
      if (focusedControl.slot === 'toolbar-toggle' && !focusedControl.isConnected) {
        this.$.content.focus(options);
      } else if (this.#isToolbarCollapsed() && toolbar.contains(focusedControl.assignedSlot)) {
        this.querySelector(':scope > [slot="toolbar-toggle"]').focus(options);
      }

      // A button that gets disabled while focused with the keyboard (e.g. "next
      // page" on the last page) loses focus. Move it to the field or select of
      // the same group instead. Pointer users keep their focus where it is, so
      // that touch devices don't open the on-screen keyboard.
      const focusedButton = this.querySelector(':scope > vaadin-pdf-viewer-button[disabled]:focus');
      if (focusedButton && isKeyboardActive()) {
        const slot = focusedButton.slot === 'toolbar-page' ? 'page-field' : focusedButton.slot;
        const next = this.querySelector(`:scope > [slot="${slot}"]:not([disabled], vaadin-pdf-viewer-button)`);
        next?.focus({ focusVisible: true });
      }
    }

    /**
     * Scrolls the header and the toolbar so that a focused control in them is
     * visible with its focus ring. Not all browsers scroll a control into view
     * that is partly visible already, which can leave its focus ring cut off.
     * @private
     */
    #onFocusIn(event) {
      const target = event.composedPath()[0];
      const control = [...this.children].find((child) => child.contains(target));
      const area = this.shadowRoot.querySelector('.top-area');
      if (!control || !control.assignedSlot || !area.contains(control.assignedSlot)) {
        return;
      }
      const style = getComputedStyle(area);
      const areaTop = area.getBoundingClientRect().top + area.clientTop;
      const top = areaTop + Number.parseFloat(style.scrollPaddingBlockStart);
      const bottom = areaTop + area.clientHeight - Number.parseFloat(style.scrollPaddingBlockEnd);
      const rect = target.getBoundingClientRect();
      if (rect.top < top) {
        area.scrollTop -= top - rect.top;
      } else if (rect.bottom > bottom) {
        area.scrollTop += rect.bottom - bottom;
      }
    }

    /**
     * Renders the button in the header that collapses and expands the toolbar.
     * @private
     */
    #renderToolbarToggle(i18n) {
      if (!this.#isHeaderShown()) {
        return nothing;
      }
      const collapsed = this.#isToolbarCollapsed();
      return html`
        <vaadin-pdf-viewer-button
          slot="toolbar-toggle"
          icon="${collapsed ? 'expand-toolbar' : 'collapse-toolbar'}"
          theme="tertiary icon"
          aria-label="${i18n.toolbarToggle}"
          aria-expanded="${collapsed ? 'false' : 'true'}"
          @click="${this.#onToolbarToggleClick}"
        >
          ${renderButtonTooltip(i18n.toolbarToggle)}
        </vaadin-pdf-viewer-button>
      `;
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
    #onToolbarToggleClick() {
      this.toolbarCollapsed = !this.#isToolbarCollapsed();
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
      this.#invalidPageEntry = value === '' || isValid ? null : value;
      if (value !== '' && isValid) {
        this._goToPage(page);
      }
      this.requestUpdate();
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
     * Whether the toolbar is collapsed. It collapses only while the header,
     * with the button that expands it, is shown.
     * @private
     */
    #isToolbarCollapsed() {
      return !!this.toolbarCollapsed && this.#isHeaderShown();
    }

    /**
     * Whether the header, with the button that collapses the toolbar, is shown.
     * @private
     */
    #isHeaderShown() {
      return this.headerVisible && this.pageCount > 0;
    }
  };
