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
import { PdfViewerTextSelectionController } from './pdf-viewer-text-selection-controller.js';

/**
 * A mixin that renders the text layer of the rendered pages, which makes the
 * text selectable and readable by assistive technology.
 */
export const PdfViewerTextLayerMixin = (superClass) =>
  class PdfViewerTextLayerMixinClass extends superClass {
    constructor() {
      super();

      this.addController(new PdfViewerTextSelectionController(this, () => this.__pages));
    }

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
     * Override method from `PdfViewerDocumentMixin` to remove the language.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();

      this.$.pages.removeAttribute('lang');
    }

    /**
     * Override method from `PdfViewerRenderMixin` to render the text layer.
     * @protected
     * @override
     */
    async _renderPageLayers(page) {
      await super._renderPageLayers(page);

      try {
        await page.renderTextLayer();
      } catch (error) {
        // The page keeps its canvas without text, and tries again when it renders again.
        if (error.name !== 'AbortException' && page.canvas) {
          issueWarning(`Failed to render the text of page ${page.pageNumber} of the PDF document: ${error.message}`);
        }
      }
    }
  };
