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
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { PdfViewerDestination } from './pdf-viewer-links.js';
import type { PdfViewerPage } from './pdf-viewer-page.js';

export type PdfViewerZoom = 'page-fit' | 'page-width' | number;

export declare function PdfViewerMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerMixinClass> & Constructor<ResizeMixinClass> & T;

export declare class PdfViewerMixinClass {
  /**
   * The URL of the PDF document to show.
   */
  src: string | null | undefined;

  /**
   * The current page, starting from 1. The viewer updates it while the
   * user scrolls, to the page that takes up most of the visible area.
   * Setting it scrolls to the start of that page.
   */
  page: number;

  /**
   * The zoom level of the pages:
   * - `page-width` (default) fits the width of the first page to the viewer.
   * - `page-fit` fits the whole first page into the viewer.
   * - A number scales the pages relative to their actual size, e.g. `1` for 100%.
   */
  zoom: PdfViewerZoom;

  /**
   * The number of pages in the loaded document, or 0 when no document
   * is loaded.
   */
  readonly pageCount: number;

  /**
   * The name of the document file. When set, the viewer uses it as the
   * name of the document, e.g. as its accessible name. Otherwise the
   * viewer uses the title of the document when the document asks for
   * it, then the last part of the path of `src`, then the title of the
   * document.
   *
   * @attr {string} file-name
   */
  fileName: string | null | undefined;
  /**
   * The reason why the document could not be loaded, or undefined.
   */
  protected _errorReason: 'invalid' | 'network' | 'password' | undefined;

  /**
   * Whether the document is loading.
   */
  protected _loading: boolean;

  /**
   * The zoom level the pages are shown at, as a factor of their actual
   * size, or 0 while no pages are laid out.
   */
  protected _zoomFactor: number;

  /**
   * The loaded document, or null.
   */
  protected readonly _pdfDocument: PDFDocumentProxy | null;

  /**
   * Goes to the given page and announces it, for page changes caused by
   * the user through the viewer's own controls.
   */
  protected _goToPage(page: number): void;

  /**
   * Goes to the destination of an internal link or an outline item, and
   * announces the page. Does nothing when the destination cannot be resolved.
   */
  protected _goToDestination(destination: PdfViewerDestination): Promise<void>;

  /**
   * Zooms in or out to the next zoom level, and announces the new zoom.
   */
  protected _stepZoom(direction: -1 | 1): void;

  /**
   * Returns the view of a page of the loaded document.
   */
  protected _getPageView(pageNumber: number): PdfViewerPage | undefined;

  /**
   * Returns the text content of a page of the loaded document, loading it
   * once per page. It includes the marked content of tagged pages.
   */
  protected _getTextContent(pageNumber: number): Promise<Awaited<ReturnType<PDFPageProxy['getTextContent']>>>;

  /**
   * Finds the visible pages again and renders the ones that are not
   * rendered at the current scale and device pixel ratio.
   */
  protected _requestRender(): void;

  /**
   * Scrolls the pages so that the given client rectangle is in the middle
   * of the view, unless it is well inside the view already.
   *
   * `topInset`: the height at the top of the view that is covered, e.g. by the find bar.
   * `smooth`: whether to scroll smoothly. Only short distances are scrolled smoothly.
   */
  protected _scrollRectIntoView(rect: DOMRect, options?: { topInset?: number; smooth?: boolean }): void;

  /**
   * Returns the name of the loaded document to show to the user: the
   * `fileName`, then the title of the document when the document asks for
   * it, then the last part of the path of `src`, then the title of the
   * document. Returns an empty string when the document has none.
   * Unlike `_getFileName()`, it can put the title before the path, as a
   * shown name may have characters that file names cannot have.
   */
  protected _getDocumentName(): string;

  /**
   * Returns the name to save the document under: the `fileName` as is, else
   * the last part of the path of `src`, else the title of the document, else
   * `document`, with `.pdf` added when missing. Unlike the document name,
   * the title only comes after the path, as it can have characters that
   * file names cannot have.
   */
  protected _getFileName(): string;

  /**
   * Returns the accessible name of the viewer while a document is loaded,
   * or an empty string to use the localized fallback name.
   */
  protected _getAccessibleName(): string;

  /**
   * Sets the accessible name of the viewer from `_getAccessibleName()` while a
   * document is loaded, and removes it otherwise. Keeps an accessible name
   * that the application has set.
   */
  protected _updateAccessibleName(): void;

  /**
   * Called when a page has been rendered, including its text layer.
   */
  protected _pageRendered(page: PdfViewerPage): void;

  /**
   * Called when the document is unloaded, e.g. before another one loads.
   */
  protected _documentUnloaded(): void;
}
