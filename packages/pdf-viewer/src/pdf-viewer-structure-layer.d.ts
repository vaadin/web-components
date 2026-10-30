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

/**
 * A node of the structure of a tagged PDF page, see `PDFPageProxy.getStructTree()`:
 * a structure element with a role, or content with the id of its element.
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

/**
 * Exposes the structure of a tagged PDF page to assistive technology, e.g.
 * headings, lists, tables and figures with alternative text, adapted from
 * `StructTreeLayerBuilder` of pdf.js. Its elements own the elements of the
 * text layer and the links with `aria-owns`, so these must be in the same
 * DOM tree. Unlike in pdf.js, the tree is not in the canvas, which is hidden
 * from assistive technology and replaced on each render. There is no MathML,
 * no references to table headers, no table summaries and no positions of
 * figures.
 */
export declare class PdfViewerStructureLayer {
  constructor(tree: PdfViewerStructTreeNode, pageNumber: number);

  /** The ids of the annotations that elements of the structure own. */
  readonly annotationIds: Set<string>;

  readonly element: HTMLElement;

  /**
   * Makes the structure own the elements in the marked content of the text
   * layer, rather than the marked content itself. Chrome leaves out the
   * elements that `aria-owns` refers to when they have `display: contents`,
   * as marked content has. Needs the rendered text layer, as the
   * `updateTextLayer()` of pdf.js does.
   */
  updateTextLayer(textLayerElement: HTMLElement): void;

  /**
   * Returns the ARIA attributes of the link element of an annotation. As in
   * pdf.js, a link of a `Link` structure element owns the content of that
   * element, which then loses its role, as the link takes its place.
   */
  getAriaAttributes(annotationId: string): Map<string, string> | undefined;
}
