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
 * A mixin that adds downloading the document, with a button in the toolbar.
 * An application can replace the button with its own component in the
 * `download-button` slot.
 */
export declare function PdfViewerDownloadMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerDownloadMixinClass> & T;

export declare class PdfViewerDownloadMixinClass {
  /**
   * Whether the button that downloads the document is hidden from the
   * toolbar. The `download()` method works also while it is hidden.
   */
  downloadButtonHidden: boolean;

  /**
   * Downloads the document. The file has the original bytes of the
   * document, so the viewer does not request it again, and signatures stay
   * intact. The file name is `fileName` when set, else the name from the
   * response or `src`, see `fileName`.
   * While the document loads, it is downloaded once loaded. Does nothing
   * without a document, or when the viewer is not attached.
   */
  download(): void;
}
