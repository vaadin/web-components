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
import { html, nothing } from 'lit';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { PdfViewerOutlineController } from './pdf-viewer-outline-controller.js';
import { PdfViewerThumbnailsController } from './pdf-viewer-thumbnails-controller.js';
import { renderButtonTooltip } from './vaadin-pdf-viewer-button.js';

/**
 * Adds a sidebar to the PDF viewer, with thumbnails of the pages and the
 * outline of the document, and a button in the toolbar that shows and hides it.
 * In a narrow viewer, the sidebar is shown over the pages.
 *
 * @polymerMixin
 */
export const PdfViewerSidebarMixin = (superClass) =>
  class PdfViewerSidebarMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Whether the sidebar with the page thumbnails and the outline of
         * the document is shown.
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

    /**
     * The view of the sidebar.
     * @type {'thumbnails' | 'outline'}
     */
    #view = 'thumbnails';

    /** The view of the last update, to know when the thumbnails are shown again. */
    #updatedView = 'thumbnails';

    /** @type {PdfViewerThumbnailsController | null} */
    #thumbnails = null;

    #outline = new PdfViewerOutlineController(this, {
      onActivate: (destination) => this.#goToDestination(destination),
    });

    /**
     * Override method from `LitElement` to add the controllers of the
     * thumbnails and the outline, and the Escape key of the sidebar.
     * @protected
     * @override
     */
    firstUpdated() {
      super.firstUpdated();

      this.#thumbnails = new PdfViewerThumbnailsController(this.$.thumbnails, {
        onSelect: (pageNumber) => this.#goToPage(pageNumber),
      });
      this.addController(this.#thumbnails);
      this.addController(this.#outline);
      this.#getSidebar().addEventListener('keydown', (event) => this.#onSidebarKeyDown(event));
    }

    /**
     * Override method from `LitElement` to move focus out of the sidebar before it hides.
     * @protected
     * @override
     */
    willUpdate(props) {
      super.willUpdate(props);

      // Focus inside the sidebar would be lost when it hides, so move it to the toggle button.
      if (props.has('sidebarOpened') && !this.sidebarOpened && props.get('sidebarOpened')) {
        this.#moveFocusOutOfSidebar();
      }
    }

    /**
     * Override method from `LitElement` to load the outline of a newly
     * loaded document, to create the thumbnails, and to mark the thumbnail
     * of the current page.
     * @protected
     * @override
     */
    updated(props) {
      super.updated(props);

      if (props.has('__effectiveI18n')) {
        this.#thumbnails.setLabel(this.__effectiveI18n.pageLabel);
      }

      if (props.has('pageCount') && this.pageCount > 0) {
        this.#outline.load(this._pdfDocument, this.pageCount);
      }

      const isShowingThumbnails = this.#view !== this.#updatedView && this.#view === 'thumbnails';
      this.#updatedView = this.#view;
      if (
        (props.has('pageCount') || props.has('sidebarOpened') || isShowingThumbnails) &&
        this.sidebarOpened &&
        this.pageCount
      ) {
        this.#createThumbnails();
        this.#thumbnails.setPage(this.page, true);
      } else if (props.has('page')) {
        this.#thumbnails.setPage(this.page, this.sidebarOpened);
      }
    }

    /**
     * Override method from `PdfViewerMixin` to remove the thumbnails and the
     * outline of the previous document.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();
      this.#moveFocusOutOfSidebar();
      this.#thumbnails.clear();
      this.#outline.clear();
      this.#view = 'thumbnails';
    }

    /**
     * Returns the template of the sidebar, which shows the controls of
     * `_renderSidebarControls()` in its header.
     * @protected
     */
    _renderSidebar() {
      const i18n = this.__effectiveI18n;
      return html`
        <div part="sidebar" ?hidden="${!this.sidebarOpened}">
          <div
            part="sidebar-header"
            role="group"
            aria-label="${i18n.sidebarView}"
            ?hidden="${!this.#outline.hasOutline}"
          >
            <slot name="sidebar-header"></slot>
          </div>
          <div
            id="thumbnails"
            part="thumbnails"
            role="listbox"
            aria-label="${i18n.thumbnails}"
            ?hidden="${this.#view !== 'thumbnails'}"
          ></div>
          ${this.#outline.render(this.page, { hidden: this.#view !== 'outline', label: i18n.outline })}
        </div>
      `;
    }

    /**
     * Returns the template of the sidebar button of the toolbar and the
     * buttons that switch the view of the sidebar, which are rendered into
     * the light DOM.
     * @protected
     */
    _renderSidebarControls() {
      const i18n = this.__effectiveI18n;
      return html`
        <vaadin-pdf-viewer-button
          slot="toolbar-navigation"
          icon="sidebar"
          theme="tertiary icon"
          aria-label="${i18n.sidebar}"
          aria-expanded="${this.sidebarOpened ? 'true' : 'false'}"
          .disabled="${!this.pageCount}"
          @click="${this.#onToggleClick}"
        >
          ${renderButtonTooltip(i18n.sidebar)}
        </vaadin-pdf-viewer-button>
        ${this.#renderViewButtons(i18n)}
      `;
    }

    /**
     * Renders the buttons that switch the sidebar between the thumbnails and
     * the outline, when the document has an outline.
     * @private
     */
    #renderViewButtons(i18n) {
      if (!this.#outline.hasOutline) {
        return nothing;
      }
      const view = this.#view;
      return html`
        <vaadin-pdf-viewer-button
          slot="sidebar-header"
          icon="thumbnails"
          theme="tertiary icon"
          aria-label="${i18n.thumbnailsView}"
          aria-pressed="${view === 'thumbnails' ? 'true' : 'false'}"
          @click="${this.#onThumbnailsViewClick}"
        >
          ${renderButtonTooltip(i18n.thumbnailsView)}
        </vaadin-pdf-viewer-button>
        <vaadin-pdf-viewer-button
          slot="sidebar-header"
          icon="outline"
          theme="tertiary icon"
          aria-label="${i18n.outline}"
          aria-pressed="${view === 'outline' ? 'true' : 'false'}"
          @click="${this.#onOutlineViewClick}"
        >
          ${renderButtonTooltip(i18n.outline)}
        </vaadin-pdf-viewer-button>
      `;
    }

    /** @private */
    #getSidebar() {
      return this.shadowRoot.querySelector('[part="sidebar"]');
    }

    /** @private */
    #createThumbnails() {
      const firstPage = this._getPageView(1);
      // No pages while a document is unloaded or loading
      if (firstPage) {
        this.#thumbnails.create(this._pdfDocument, this.pageCount, firstPage.unscaledWidth / firstPage.unscaledHeight);
      }
    }

    /**
     * Whether the sidebar is shown over the pages, as it is in a narrow
     * viewer. The sidebar and the pages are measured, so that the check
     * does not depend on the styles that place the sidebar.
     * @private
     */
    #isOverlay() {
      const sidebar = this.#getSidebar().getBoundingClientRect();
      const content = this.$.content.getBoundingClientRect();
      return Math.min(sidebar.right, content.right) - Math.max(sidebar.left, content.left) > 1;
    }

    /**
     * Closes the sidebar when it covers the pages, so that the page the user
     * went to is visible. Focus moves to the toggle button.
     * @private
     */
    #closeOverlay() {
      if (this.sidebarOpened && this.#isOverlay()) {
        this.#moveFocusOutOfSidebar();
        this.sidebarOpened = false;
      }
    }

    /**
     * Moves focus from the sidebar to the sidebar toggle button, or to the
     * pages when the button cannot take it, when focus is in the sidebar.
     * @private
     */
    #moveFocusOutOfSidebar() {
      const sidebar = this.#getSidebar();
      const active = this.shadowRoot.activeElement;
      const hasFocus =
        (active && sidebar.contains(active)) || !!this.querySelector(':scope > [slot="sidebar-header"]:focus-within');
      if (hasFocus) {
        const toggle = this.querySelector(':scope > [slot="toolbar-navigation"]');
        const target = toggle && !toggle.disabled && toggle.checkVisibility() ? toggle : this.$.content;
        target.focus({ focusVisible: isKeyboardActive() });
      }
    }

    /** @private */
    #goToPage(pageNumber) {
      this._goToPage(pageNumber);
      this.#closeOverlay();
    }

    /** @private */
    #goToDestination(destination) {
      this._goToDestination(destination).catch((error) => {
        issueWarning(`Failed to go to an outline item of the PDF document: ${error.message}`);
      });
      this.#closeOverlay();
    }

    /**
     * Closes the sidebar with Escape when it covers the pages, unless
     * something else handled the key already. Prevents the default, so that
     * a dialog that contains the viewer stays open.
     * @private
     */
    #onSidebarKeyDown(event) {
      if (event.key === 'Escape' && !event.defaultPrevented && this.sidebarOpened && this.#isOverlay()) {
        event.preventDefault();
        this.#moveFocusOutOfSidebar();
        this.sidebarOpened = false;
      }
    }

    /** @private */
    #onToggleClick() {
      this.sidebarOpened = !this.sidebarOpened;
    }

    /** @private */
    #onThumbnailsViewClick() {
      this.#view = 'thumbnails';
      this.requestUpdate();
    }

    /** @private */
    #onOutlineViewClick() {
      this.#view = 'outline';
      this.requestUpdate();
    }
  };
