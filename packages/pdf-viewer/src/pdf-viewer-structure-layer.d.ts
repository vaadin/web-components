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

export interface PdfViewerStructTreeNode {
  role?: string;
  type?: string;
  id?: string;
  alt?: string;
  lang?: string;
  rowSpan?: number;
  colSpan?: number;
  scope?: 'Both' | 'Column' | 'Row';
  children?: PdfViewerStructTreeNode[];
}

export declare class PdfViewerStructureLayer {
  constructor(tree: PdfViewerStructTreeNode);

  readonly element: HTMLElement;

  updateTextLayer(textLayerElement: HTMLElement): void;

  addLinks(links: HTMLElement[]): Set<string>;

  getLinkAlt(annotationId: string): string | undefined;
}
