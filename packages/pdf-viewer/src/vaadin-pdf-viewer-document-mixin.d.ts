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
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

export declare function PdfViewerDocumentMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerDocumentMixinClass> & T;

export declare class PdfViewerDocumentMixinClass {
  /**
   * The URL of the PDF document to show.
   */
  src: string | null | undefined;

  /**
   * The name of the file that `download()` saves, used as given, which
   * the header also shows. When not set, the name is the PDF file name
   * from the `Content-Disposition` header of the response, else the PDF
   * file name at the end of the path of `src`, else `document.pdf`.
   *
   * @attr {string} file-name
   */
  fileName: string | null | undefined;

  /**
   * The number of pages in the loaded document, or 0 when no document
   * is loaded.
   */
  readonly pageCount: number;

  /**
   * The loaded document, or null.
   */
  protected readonly _pdfDocument: PDFDocumentProxy | null;

  /**
   * Returns a promise for the document of `src`. It resolves once the
   * document has loaded, also when `src` changes meanwhile, and right away
   * when no document is loading. It resolves with null without a document,
   * or when the viewer is not attached.
   */
  protected _whenDocumentReady(): Promise<PDFDocumentProxy | null>;

  /**
   * Returns the name of the document: `fileName`, else the PDF file name
   * from the `Content-Disposition` header, else the PDF file name at the
   * end of the path of `src`, else an empty string.
   */
  protected _getDocumentName(): string;

  /**
   * Returns the name to save the document under: `fileName` as given,
   * else the name of the document, else `document`, with `.pdf` added
   * when missing.
   */
  protected _getFileName(): string;

  /**
   * Called when a document has loaded, before `document-load` is fired.
   */
  protected _documentLoaded(details: { firstPage: PDFPageProxy }): void;

  /**
   * Called when the document is unloaded, e.g. before another one loads.
   */
  protected _documentUnloaded(): void;
}
