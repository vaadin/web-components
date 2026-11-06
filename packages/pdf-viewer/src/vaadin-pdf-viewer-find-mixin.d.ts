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
 * Finds text in the document and highlights the matches. The find bar itself
 * is rendered by the toolbar.
 */
export declare function PdfViewerFindMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerFindMixinClass> & T;

export declare class PdfViewerFindMixinClass {}
