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
import type { ReactiveController } from 'lit';
import type { PdfViewerPage } from './pdf-viewer-page.js';

/**
 * Returns the ranges of the selection with their boundaries inside the given shadow root.
 */
export declare function getSelectionRanges(root: ShadowRoot): Range[];

/**
 * Keeps the selection of text from jumping over empty space, adapted from
 * `TextLayerBuilder` of pdf.js.
 */
export declare class PdfViewerTextSelectionController implements ReactiveController {
  constructor(host: HTMLElement, getPages: () => PdfViewerPage[]);

  host: HTMLElement;

  getPages: () => PdfViewerPage[];

  hostConnected(): void;

  hostDisconnected(): void;
}
