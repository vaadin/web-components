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
 * A mixin that renders the text layer of the rendered pages, which makes the
 * text selectable and readable by assistive technology.
 */
export const PdfViewerTextLayerMixin = (superClass) =>
  class PdfViewerTextLayerMixinClass extends superClass {
    /**
     * The text content of the pages, loaded once per page, so that rendering
     * a page again does not ask the worker for its text again.
     * @type {Map<number, Promise<object>>}
     */
    #textContent = new Map();

    /**
     * Override method from `PdfViewerDocumentMixin` to set the language of
     * the document on the pages.
     * @protected
     * @override
     */
    _documentLoaded(details) {
      super._documentLoaded(details);

      if (details.language) {
        this.$.pages.lang = details.language;
      }
    }

    /**
     * Override method from `PdfViewerDocumentMixin` to drop the text content.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();

      this.#textContent.clear();
      this.$.pages.removeAttribute('lang');
    }

    /**
     * Override method from `PdfViewerRenderMixin` to render the text layer.
     * @private
     * @override
     */
    async __renderPageLayers(page) {
      await super.__renderPageLayers(page);

      // The page may have been released meanwhile, e.g. when the document was unloaded.
      if (page.canvas) {
        await page.renderTextLayer(this.#getTextContent(page.pageNumber));
      }
    }

    /**
     * Returns the text content of a page of the loaded document, loading it
     * once per page. It includes the marked content of tagged pages.
     * @param {number} pageNumber
     * @return {Promise<object>}
     * @private
     */
    #getTextContent(pageNumber) {
      if (!this.#textContent.has(pageNumber)) {
        this.#textContent.set(
          pageNumber,
          this._pdfDocument
            .getPage(pageNumber)
            .then((pdfPage) => pdfPage.getTextContent({ includeMarkedContent: true })),
        );
      }
      return this.#textContent.get(pageNumber);
    }
  };
