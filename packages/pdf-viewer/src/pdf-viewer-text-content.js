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

/**
 * The text content of the pages of a document, loaded once per page. The text
 * layer of each rendered page, finding text and the structure of tagged pages
 * use the same text content, so the worker extracts the text of a page once.
 */
export class PdfViewerTextContent {
  /** @type {import('pdfjs-dist').PDFDocumentProxy} */
  #pdfDocument;

  /** @type {Map<number, Promise<object>>} */
  #pages = new Map();

  /**
   * @param {import('pdfjs-dist').PDFDocumentProxy} pdfDocument
   */
  constructor(pdfDocument) {
    this.#pdfDocument = pdfDocument;
  }

  /**
   * Returns the text content of a page, loading it on first use. It includes
   * the marked content that the structure of tagged pages refers to.
   *
   * @param {number} pageNumber
   * @return {Promise<object>}
   */
  get(pageNumber) {
    if (!this.#pages.has(pageNumber)) {
      this.#pages.set(
        pageNumber,
        this.#pdfDocument.getPage(pageNumber).then((pdfPage) => pdfPage.getTextContent({ includeMarkedContent: true })),
      );
    }
    return this.#pages.get(pageNumber);
  }
}
