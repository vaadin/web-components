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
 * Shows the outline (bookmarks) of the document in the sidebar, as a tree
 * that follows the WAI-ARIA tree view pattern.
 */
export declare function PdfViewerOutlineMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerOutlineMixinClass> & T;

export declare class PdfViewerOutlineMixinClass {}
