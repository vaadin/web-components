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
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';

/**
 * An element used internally by `<vaadin-pdf-viewer>`. Not intended to be used separately.
 */
declare class PdfViewerButton extends ButtonMixin(DirMixin(HTMLElement)) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-pdf-viewer-button': PdfViewerButton;
  }
}

export { PdfViewerButton };
