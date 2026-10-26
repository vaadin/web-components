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
import type { PdfViewerDocumentMixinClass } from './vaadin-pdf-viewer-document-mixin.js';

/**
 * A mixin providing common PDF viewer functionality.
 */
export declare function PdfViewerMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerDocumentMixinClass> & T;
