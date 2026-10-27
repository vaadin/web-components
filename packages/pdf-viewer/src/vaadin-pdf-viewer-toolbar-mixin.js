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
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import './vaadin-pdf-viewer-button.js';
import { html } from 'lit';

/**
 * A mixin that adds the toolbar with the page navigation. The controls of
 * the toolbar are Vaadin components, rendered into the light DOM so that
 * themes can style them like any other instance of these components.
 */
export const PdfViewerToolbarMixin = (superClass) =>
  class PdfViewerToolbarMixinClass extends superClass {
    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.addEventListener('focusin', (event) => this.#onFocusIn(event));
    }

    /**
     * Returns the template of the toolbar, which shows the controls of
     * `_renderToolbarControls()` in its slots.
     * @protected
     */
    _renderToolbar() {
      return html`
        <div class="header">
          <div part="toolbar">
            <div part="toolbar-group" class="navigation">
              <slot name="toolbar-page"></slot>
              <slot name="page-field"></slot>
            </div>
            <div part="toolbar-group" class="actions"><slot name="toolbar-actions"></slot></div>
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
      const { page, pageCount } = this;
      const hasDocument = pageCount > 0;
      const i18n = this.__effectiveI18n;

      return html`
        <vaadin-pdf-viewer-button
          slot="toolbar-page"
          icon="previous-page"
          theme="tertiary icon"
          .disabled="${!hasDocument || page <= 1}"
          @click="${this.#onPreviousPageClick}"
        >
          <vaadin-tooltip slot="tooltip" .text="${i18n.previousPage}"></vaadin-tooltip>
        </vaadin-pdf-viewer-button>
        <vaadin-pdf-viewer-button
          slot="toolbar-page"
          icon="next-page"
          theme="tertiary icon"
          .disabled="${!hasDocument || page >= pageCount}"
          @click="${this.#onNextPageClick}"
        >
          <vaadin-tooltip slot="tooltip" .text="${i18n.nextPage}"></vaadin-tooltip>
        </vaadin-pdf-viewer-button>
        <vaadin-integer-field
          slot="page-field"
          theme="align-right"
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
      `;
    }

    /**
     * Scrolls the toolbar so that a focused control in it is visible with its
     * focus ring. Not all browsers scroll a control into view that is partly
     * visible already, which can leave its focus ring cut off.
     * @private
     */
    #onFocusIn(event) {
      const path = event.composedPath();
      const target = path[0];
      const control = [...this.children].find((child) => path.includes(child));
      const header = this.shadowRoot.querySelector('.header');
      if (!control || !control.assignedSlot || !header.contains(control.assignedSlot)) {
        return;
      }
      const style = getComputedStyle(header);
      const headerTop = header.getBoundingClientRect().top + header.clientTop;
      const top = headerTop + Number.parseFloat(style.scrollPaddingBlockStart);
      const bottom = headerTop + header.clientHeight - Number.parseFloat(style.scrollPaddingBlockEnd);
      const rect = target.getBoundingClientRect();
      if (rect.top < top) {
        header.scrollTop -= top - rect.top;
      } else if (rect.bottom > bottom) {
        header.scrollTop += rect.bottom - bottom;
      }
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
  };
