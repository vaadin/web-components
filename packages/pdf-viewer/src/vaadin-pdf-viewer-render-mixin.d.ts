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

/**
 * A mixin that creates the page views of the document and renders them to canvas.
 */
export declare function PdfViewerRenderMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerRenderMixinClass> & T;

export declare class PdfViewerRenderMixinClass {}
