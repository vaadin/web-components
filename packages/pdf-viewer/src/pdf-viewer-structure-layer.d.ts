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
 * a structure element with a role, or content with the id of a text layer element.
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
 * Creates an element tree that exposes the structure of a tagged PDF page to
 * assistive technology, e.g. headings, lists, tables and figures with
 * alternative text. Its elements own the elements of the text layer with
 * `aria-owns`, so the text layer must be in the same DOM tree.
 */
export declare function createStructTreeElement(tree: PdfViewerStructTreeNode | null): HTMLElement | null;
