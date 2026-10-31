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
 * A mixin that adds the links of the rendered pages, and goes to the
 * destinations of internal links.
 */
export declare function PdfViewerLinksMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerLinksMixinClass> & T;

export declare class PdfViewerLinksMixinClass {}
