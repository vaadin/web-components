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
 * DOM tree. As in pdf.js, the page puts the tree in its canvas. There is no
 * MathML, no references to table headers, no table summaries and no
 * positions of figures.
 */
export declare class PdfViewerStructureLayer {
  constructor(tree: PdfViewerStructTreeNode, pageNumber: number);

  /** The ids of the annotations that elements of the structure own. */
  readonly annotationIds: ReadonlySet<string>;

  readonly element: HTMLElement;

  /**
   * Makes the structure own the elements in the marked content of the text
   * layer, rather than the marked content itself. Chrome leaves out the
   * elements that `aria-owns` refers to when they have `display: contents`,
   * as marked content has. Needs the rendered text layer, as the
   * `updateTextLayer()` of pdf.js does. Also keeps the text of the links, see
   * `getLinkText()`.
   */
  updateTextLayer(textLayerElement: HTMLElement): void;

  /**
   * Returns the ARIA attributes of the link element of an annotation. As in
   * pdf.js, a link of a `Link` structure element owns the content of that
   * element, which then loses its role, as the link takes its place.
   */
  getAriaAttributes(annotationId: string): Map<string, string> | undefined;

  /**
   * Returns the alternative text that the structure gives the link of an
   * annotation. Unlike `getAriaAttributes()`, it does not hand the content
   * of the `Link` structure element over to the link.
   */
  getLinkAlt(annotationId: string): string | undefined;

  /**
   * Returns the text that the `Link` structure element of an annotation
   * owns, which the link of the annotation owns in its place. Needs the text
   * layer, see `updateTextLayer()`.
   */
  getLinkText(annotationId: string): string | undefined;

  /**
   * Removes an annotation that has no element, e.g. a link on a hidden layer
   * or with a URL that the viewer does not open. A `Link` structure element
   * of the annotation loses its role, so that its text is read as text.
   */
  removeAnnotation(annotationId: string): void;
}
