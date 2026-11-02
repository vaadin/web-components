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
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { PdfViewerDocumentMixinClass } from './vaadin-pdf-viewer-document-mixin.js';
import type { PdfViewerKeyboardMixinClass } from './vaadin-pdf-viewer-keyboard-mixin.js';
import type { PdfViewerLinksMixinClass } from './vaadin-pdf-viewer-links-mixin.js';
import type { PdfViewerRenderMixinClass } from './vaadin-pdf-viewer-render-mixin.js';
import type { PdfViewerScrollMixinClass } from './vaadin-pdf-viewer-scroll-mixin.js';
import type { PdfViewerTextLayerMixinClass } from './vaadin-pdf-viewer-text-layer-mixin.js';
import type { PdfViewerToolbarMixinClass } from './vaadin-pdf-viewer-toolbar-mixin.js';
import type { PdfViewerZoomMixinClass } from './vaadin-pdf-viewer-zoom-mixin.js';

/**
 * A mixin providing common PDF viewer functionality.
 */
export declare function PdfViewerMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerToolbarMixinClass> &
  Constructor<PdfViewerKeyboardMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<PdfViewerLinksMixinClass> &
  Constructor<PdfViewerTextLayerMixinClass> &
  Constructor<PdfViewerZoomMixinClass> &
  Constructor<PdfViewerScrollMixinClass> &
  Constructor<PdfViewerRenderMixinClass> &
  Constructor<PdfViewerDocumentMixinClass> &
  T;
