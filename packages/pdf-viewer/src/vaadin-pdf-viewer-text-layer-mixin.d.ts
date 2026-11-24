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
 * A mixin that renders the text layer of the rendered pages, which makes the
 * text selectable and readable by assistive technology.
 */
export declare function PdfViewerTextLayerMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerTextLayerMixinClass> & T;

export declare class PdfViewerTextLayerMixinClass {}
