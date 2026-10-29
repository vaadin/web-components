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
   * Returns the name of the document: the PDF file name from the
   * `Content-Disposition` header, else the PDF file name at the end of the
   * path of `src`, else an empty string.
   */
  protected _getDocumentName(): string;

  /**
   * Called when a document has loaded, before `document-load` is fired.
   */
  protected _documentLoaded(details: PdfViewerDocumentDetails): void;

  /**
   * Called when the document is unloaded, e.g. before another one loads.
   */
  protected _documentUnloaded(): void;
}
