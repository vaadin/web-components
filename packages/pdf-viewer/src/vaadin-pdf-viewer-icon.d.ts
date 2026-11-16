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

/**
 * An element used internally by `<vaadin-pdf-viewer>`. Not intended to be used separately.
 */
declare class PdfViewerIcon extends HTMLElement {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-pdf-viewer-icon': PdfViewerIcon;
  }
}

export { PdfViewerIcon };
