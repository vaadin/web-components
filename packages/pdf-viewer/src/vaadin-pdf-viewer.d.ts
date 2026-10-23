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
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';

/**
 * `<vaadin-pdf-viewer>` is a web component for viewing PDF documents.
 *
 * ```html
 * <vaadin-pdf-viewer></vaadin-pdf-viewer>
 * ```
 */
declare class PdfViewer extends ElementMixin(HTMLElement) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-pdf-viewer': PdfViewer;
  }
}

export { PdfViewer };
