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

/**
 * The details of a loaded document.
 */
export interface PdfViewerDocumentDetails {
  /** The title from the metadata of the document, or an empty string. */
  title: string;
  /** The language from the metadata of the document, or an empty string. */
  language: string;
  /** The first page of the document. */
  firstPage: PDFPageProxy;
}

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
   * Returns a promise that resolves with the document of `src` once no document
   * is loading, or with null when detached.
   */
  protected _whenDocumentReady(): Promise<PDFDocumentProxy | null>;

  /**
   * Returns `fileName`, else the PDF file name from the `Content-Disposition` header or `src`, else an empty string.
   */
  protected _getDocumentName(): string;

  /**
   * Called when a document has loaded, before `document-load` is fired.
   */
  protected _documentLoaded(details: PdfViewerDocumentDetails): void;

  /**
   * Called when the document is unloaded.
   */
  protected _documentUnloaded(): void;
}
