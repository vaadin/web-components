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
 * A mixin that exposes the structure of the rendered pages of tagged PDF
 * documents to assistive technology, e.g. headings, lists and tables.
 */
export declare function PdfViewerStructureMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerStructureMixinClass> & T;

export declare class PdfViewerStructureMixinClass {}
