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
 * A mixin that handles the keyboard shortcuts of the viewer.
 */
export declare function PdfViewerKeyboardMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerKeyboardMixinClass> & T;

export declare class PdfViewerKeyboardMixinClass {}
