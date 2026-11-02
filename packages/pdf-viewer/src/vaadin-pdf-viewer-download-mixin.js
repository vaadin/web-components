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
 * A mixin that adds downloading the document. The toolbar has a button that
 * calls `download()`.
 */
export const PdfViewerDownloadMixin = (superClass) =>
  class PdfViewerDownloadMixinClass extends superClass {
    /**
     * Downloads the document. The file has the original bytes of the
     * document, so the viewer does not request it again, and signatures stay
     * intact. The file name is `fileName` when set, else the name from the
     * response or `src`, see `fileName`.
     * While the document loads, it is downloaded once loaded. Does nothing
     * without a document, or when the viewer is not attached.
     */
    download() {
      this._whenDocumentReady().then((pdfDocument) => {
        if (pdfDocument) {
          this.#download(pdfDocument);
        }
      });
    }

    /**
     * Downloads the document under the file name it has now, also when
     * another document loads, `fileName` changes or the viewer is detached
     * while its bytes are read.
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
     * Returns the name to save the document under: `fileName` as given,
     * else the name of the document, else `document`, with `.pdf` added
     * when missing.
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
