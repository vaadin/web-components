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

export declare function getSelectionRanges(root: ShadowRoot): Range[];

export declare class PdfViewerTextSelectionController implements ReactiveController {
  constructor(host: HTMLElement, getPages: () => PdfViewerPage[]);

  host: HTMLElement;

  getPages: () => PdfViewerPage[];

  hostConnected(): void;

  hostDisconnected(): void;
}
