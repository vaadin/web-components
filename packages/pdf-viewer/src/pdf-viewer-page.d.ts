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
import type { PDFPageProxy, RenderTask, TextLayer } from 'pdfjs-dist';

/**
 * The maximum number of pixels of a page canvas. Larger canvases use too much
 * memory, especially on iOS, so pages are rendered at a lower resolution instead.
 */
export declare const MAX_CANVAS_PIXELS: number;

/**
 * Manages the DOM of a single page of the document: a placeholder sized to
 * the page, and the canvas and the text and link layers the page is rendered
 * to once it is needed.
 */
export declare class PdfViewerPage {
  constructor(pageNumber: number, size: { width: number; height: number });

  pageNumber: number;
  pdfPage: PDFPageProxy | null;
  unscaledWidth: number;
  unscaledHeight: number;
  userUnit: number;
  element: HTMLElement;
  scale: number;
  canvas: HTMLCanvasElement | null;
  renderTask: RenderTask | null;
  renderFailed: boolean;
  textLayer: TextLayer | null;
  textLayerElement: HTMLElement | null;
  linkLayerElement: HTMLElement | null;
  renderedScale: number;
  renderedPixelRatio: number;

  /** The width of the page in CSS pixels at the current scale. */
  readonly width: number;

  /** The height of the page in CSS pixels at the current scale. */
  readonly height: number;

  /** The number of canvas pixels this page uses. */
  readonly canvasPixels: number;

  isRendered(pixelRatio: number): boolean;

  setPdfPage(pdfPage: PDFPageProxy): boolean;

  setScale(scale: number): void;

  render(pixelRatio: number): Promise<void>;

  renderTextLayer(textContent: Promise<Awaited<ReturnType<PDFPageProxy['getTextContent']>>>): Promise<void>;

  cancel(): void;

  release(): void;
}
