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
import type * as pdfjs from 'pdfjs-dist';
import type { PDFPageProxy, RenderTask, TextLayer } from 'pdfjs-dist';

/**
 * The maximum number of pixels of a page canvas. Larger canvases use too much
 * memory, especially on iOS, so pages are rendered at a lower resolution instead.
 */
export declare const MAX_CANVAS_PIXELS: number;

/**
 * A part of the text of a text layer element, see `PdfViewerPage.getTextInside()`.
 */
export interface TextPart {
  element: HTMLElement;
  start: number;
  end: number;
}

/**
 * Manages the DOM of a single page of the document: a placeholder sized to
 * the page, and the canvas the page is rendered to once it is needed.
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
  structTreeElement: HTMLElement | null;
  hasNoStructTree: boolean;
  renderedScale: number;
  renderedOutputScale: number;

  /** The width of the page in CSS pixels at the current scale. */
  readonly width: number;

  /** The height of the page in CSS pixels at the current scale. */
  readonly height: number;

  /** The number of canvas pixels this page uses. */
  readonly canvasPixels: number;

  isRendered(outputScale: number): boolean;

  setPdfPage(pdfPage: PDFPageProxy): void;

  setScale(scale: number): void;

  render(devicePixelRatio: number): Promise<void>;

  renderTextLayer(pdfjsModule: typeof pdfjs): Promise<void>;

  renderStructTree(): Promise<void>;

  renderLinks(
    annotations: Array<{ rect: number[] }>,
    createLink: (annotation: object) => HTMLAnchorElement | null,
  ): Array<{ link: HTMLAnchorElement; annotation: object }>;

  getTextInside(element: Element): TextPart[];

  placeLinks(links: Array<{ link: HTMLElement; parts: TextPart[] }>): void;

  cancel(): void;

  release(): void;
}
