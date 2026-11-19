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
import type { PdfViewerStructNode } from './pdf-viewer-page-model.js';

export type { PdfViewerStructTreeNode } from './pdf-viewer-page-model.js';

export declare class PdfViewerStructureLayer {
  constructor(structure: PdfViewerStructNode);

  readonly element: HTMLElement;
}
