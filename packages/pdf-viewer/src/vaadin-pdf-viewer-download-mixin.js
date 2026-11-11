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
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { downloadDocument } from './pdf-viewer-download.js';

/**
 * A mixin that adds downloading the document.
 */
export const PdfViewerDownloadMixin = (superClass) =>
  class PdfViewerDownloadMixinClass extends superClass {
    /**
     * Downloads the document with its original bytes, under the file name described in `fileName`.
     *
     * A document that is loading is downloaded once it has loaded. Does
     * nothing without a document, or when the viewer is not attached.
     */
    download() {
      this._whenDocumentReady().then((pdfDocument) => {
        if (pdfDocument) {
          this.#download(pdfDocument);
        }
      });
    }

    /**
     * Downloads the document under the file name it has at the time of the call.
     * @private
     */
    #download(pdfDocument) {
      downloadDocument(pdfDocument, this.#getDownloadFileName()).catch((error) => {
        // Reading the bytes fails when the document is unloaded meanwhile.
        if (this._pdfDocument === pdfDocument) {
          issueWarning(`Failed to download the PDF document: ${error.message}`);
        }
      });
    }

    /**
     * @return {string}
     * @private
     */
    #getDownloadFileName() {
      if (this.fileName) {
        return this.fileName;
      }
      const name = this._getDocumentName() || 'document';
      return /\.pdf$/iu.test(name) ? name : `${name}.pdf`;
    }
  };
