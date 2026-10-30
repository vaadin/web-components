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
 * A mixin that exposes the structure of the rendered pages of tagged PDF
 * documents to assistive technology, e.g. headings, lists and tables.
 */
export const PdfViewerStructureMixin = (superClass) =>
  class PdfViewerStructureMixinClass extends superClass {
    /**
     * Override method from `PdfViewerRenderMixin` to render the structure
     * of the page, which owns the elements of its text layer.
     * @protected
     * @override
     */
    async _renderPageLayers(page) {
      await super._renderPageLayers(page);

      await page.renderStructureLayer();
    }
  };
