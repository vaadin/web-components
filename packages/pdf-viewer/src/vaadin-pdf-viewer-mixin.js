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
import { PdfViewerKeyboardMixin } from './vaadin-pdf-viewer-keyboard-mixin.js';
import { PdfViewerLinksMixin } from './vaadin-pdf-viewer-links-mixin.js';
import { PdfViewerRenderMixin } from './vaadin-pdf-viewer-render-mixin.js';
import { PdfViewerScrollMixin } from './vaadin-pdf-viewer-scroll-mixin.js';
import { PdfViewerTextLayerMixin } from './vaadin-pdf-viewer-text-layer-mixin.js';
import { PdfViewerToolbarMixin } from './vaadin-pdf-viewer-toolbar-mixin.js';
import { PdfViewerZoomMixin } from './vaadin-pdf-viewer-zoom-mixin.js';

/**
 * A mixin providing common PDF viewer functionality.
 */
export const PdfViewerMixin = (superClass) =>
  class PdfViewerMixinClass extends PdfViewerToolbarMixin(
    PdfViewerKeyboardMixin(
      PdfViewerLinksMixin(
        PdfViewerTextLayerMixin(
          PdfViewerZoomMixin(PdfViewerScrollMixin(PdfViewerRenderMixin(PdfViewerDocumentMixin(superClass)))),
        ),
      ),
    ),
  ) {};
