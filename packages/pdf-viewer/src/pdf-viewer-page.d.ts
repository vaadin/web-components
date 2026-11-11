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
import type { PDFDocumentProxy, PDFPageProxy, RenderTask, TextLayer } from 'pdfjs-dist';
import type { PdfViewerLinkAnnotation } from './pdf-viewer-links.js';

export declare const MAX_CANVAS_PIXELS: number;

export declare class PdfViewerPage {
  constructor(pageNumber: number, size: { width: number; height: number });

  pageNumber: number;
  pdfPage: PDFPageProxy | null;
  unscaledWidth: number;
  unscaledHeight: number;
  element: HTMLElement;
  scale: number;
  canvas: HTMLCanvasElement | null;
  renderTask: RenderTask | null;
  renderFailed: boolean;
  textLayer: TextLayer | null;
  textLayerElement: HTMLElement | null;
  endOfContentElement: HTMLElement | null;
  linkLayerElement: HTMLElement | null;
  renderedScale: number;
  renderedPixelRatio: number;

  readonly width: number;

  readonly height: number;

  readonly canvasPixels: number;

  isRendered(pixelRatio: number): boolean;

  setPdfPage(pdfPage: PDFPageProxy): boolean;

  setScale(scale: number): void;

  render(pixelRatio: number): Promise<void>;

  setLabel(label: string): void;

  getOffset(
    x: number | undefined,
    y: number | undefined,
    x2?: number | undefined,
    y2?: number | undefined,
  ): { left: number; top: number };

  renderTextLayer(): Promise<void>;

  renderLinkLayer(
    followLink: (annotation: PdfViewerLinkAnnotation) => void,
    optionalContentConfig?: Awaited<ReturnType<PDFDocumentProxy['getOptionalContentConfig']>>,
  ): Promise<Array<{ link: HTMLAnchorElement; annotation: PdfViewerLinkAnnotation }>>;

  cancel(): void;

  release(): void;
}
