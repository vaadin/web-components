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
import { PdfViewerDocumentMixin } from './vaadin-pdf-viewer-document-mixin.js';
import { PdfViewerRenderMixin } from './vaadin-pdf-viewer-render-mixin.js';
import { PdfViewerScrollMixin } from './vaadin-pdf-viewer-scroll-mixin.js';

/**
 * A mixin providing common PDF viewer functionality.
 */
export const PdfViewerMixin = (superClass) =>
  class PdfViewerMixinClass extends PdfViewerScrollMixin(PdfViewerRenderMixin(PdfViewerDocumentMixin(superClass))) {};
