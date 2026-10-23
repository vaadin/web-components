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
import type { TemplateResult } from 'lit';

/**
 * Adds downloading the document to the PDF viewer, with a button in the
 * toolbar.
 */
export declare function PdfViewerPrintMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerPrintMixinClass> & T;

export declare class PdfViewerPrintMixinClass {
  /**
   * Whether the button that downloads the document is hidden from the
   * toolbar. The `download()` method works also while it is hidden.
   *
   * @attr {boolean} download-button-hidden
   */
  downloadButtonHidden: boolean;

  /**
   * Downloads the document. The file has the original bytes of the
   * document, so the viewer does not request it again, and signatures stay
   * intact. The file name is `fileName`, else the last part of the path of
   * `src`, else the title of the document, with `.pdf` added when missing.
   * While the document loads, it is downloaded once loaded. Does nothing
   * without a document, or when the viewer is not attached.
   */
  download(): void;

  /**
   * Returns the template of the download button, which is rendered into
   * the light DOM.
   */
  protected _renderPrintControls(): TemplateResult;
}
