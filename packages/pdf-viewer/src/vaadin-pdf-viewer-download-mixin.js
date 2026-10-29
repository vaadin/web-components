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
import { html } from 'lit';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { downloadDocument } from './pdf-viewer-download.js';

/**
 * A mixin that adds downloading the document, with a button in the toolbar.
 * An application can replace the button with its own component in the
 * `download-button` slot.
 */
export const PdfViewerDownloadMixin = (superClass) =>
  class PdfViewerDownloadMixinClass extends superClass {
    static get properties() {
      return {
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

    /** Set when `download()` waits for the document to load. */
    #downloadPending = false;

    /**
     * Aborted when the viewer is detached, to stop the downloads in progress
     * and release their data.
     * @type {AbortController | null}
     */
    #downloadsController = null;

    /** @type {SlotController} */
    #buttonController;

    /**
     * The tooltip that the viewer added to the default button.
     * @type {HTMLElement | null}
     */
    #buttonTooltip = null;

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.#buttonController = new SlotController(this, 'download-button', 'vaadin-pdf-viewer-button', {
        initializer: (button) => this.#initButton(button),
      });
      this.addController(this.#buttonController);

      this.addEventListener('click', (event) => this.#onClick(event));
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.#downloadsController?.abort();
      this.#downloadsController = null;
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      const button = this.#buttonController?.node;
      if (button) {
        button.disabled = !this.pageCount;
      }
      if (this.#buttonTooltip) {
        this.#buttonTooltip.text = this.__effectiveI18n.download;
      }

      if (this.#downloadPending && !this._documentPending) {
        this.#downloadPending = false;
        this.#download();
      }
    }

    /**
     * Downloads the document. The file has the original bytes of the
     * document, so the viewer does not request it again, and signatures stay
     * intact. The file name is `fileName` when set, else the name from the
     * response or `src`, see `fileName`.
     * While the document loads, it is downloaded once loaded. Does nothing
     * without a document, or when the viewer is not attached.
     */
    download() {
      if (!this.isConnected) {
        return;
      }

      if (this._documentPending) {
        this.#downloadPending = true;
      } else {
        this.#download();
      }
    }

    /**
     * Override method from `PdfViewerToolbarMixin` to add the slot of the
     * download button after the application controls.
     * @protected
     * @override
     */
    _renderToolbarActionSlots() {
      return html`
        ${super._renderToolbarActionSlots()}
        <slot name="download-button" ?hidden="${this.downloadButtonHidden}"></slot>
      `;
    }

    /**
     * Sets the icon and the tooltip on the default button. A custom button
     * keeps its own content.
     * @param {HTMLElement} button
     * @private
     */
    #initButton(button) {
      // The Flow counterpart creates its own default button, so that it can return it.
      if (button._isDefault) {
        this.#buttonController.defaultNode = button;
      }

      this.#buttonTooltip = null;
      if (button === this.#buttonController.defaultNode) {
        if (!button.hasAttribute('icon')) {
          button.setAttribute('icon', 'download');
        }
        if (!button.hasAttribute('theme')) {
          button.setAttribute('theme', 'tertiary icon');
        }
        if (!button.querySelector(':scope > [slot="tooltip"]')) {
          this.#buttonTooltip = document.createElement('vaadin-tooltip');
          this.#buttonTooltip.slot = 'tooltip';
          button.append(this.#buttonTooltip);
        }
      }
      this.requestUpdate();
    }

    /**
     * Downloads the loaded document under the file name it has now, also
     * when another document loads or `fileName` changes while its bytes
     * are read.
     * @private
     */
    #download() {
      const pdfDocument = this._pdfDocument;
      if (!pdfDocument || !this.isConnected) {
        return;
      }

      this.#downloadsController ??= new AbortController();
      downloadDocument(pdfDocument, this._getFileName(), this.#downloadsController.signal).catch((error) => {
        // Reading the bytes fails when the document is unloaded meanwhile.
        if (this._pdfDocument === pdfDocument) {
          issueWarning(`Failed to download the PDF document: ${error.message}`);
        }
      });
    }

    /** @private */
    #onClick(event) {
      const button = this.#buttonController.node;
      if (button && event.composedPath().includes(button)) {
        this.download();
      }
    }
  };
