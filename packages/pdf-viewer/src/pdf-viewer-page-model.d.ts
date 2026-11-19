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
import type { PdfViewerLinkAnnotation } from './pdf-viewer-links.js';

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

/** An element of the structure layer for a node of the structure tree. */
export interface PdfViewerStructElement {
  node: PdfViewerStructTreeNode;
  role: string | null;
  level?: string;
  nodes: PdfViewerStructTreeNode[];
  owned: PdfViewerStructTreeNode[];
  children: PdfViewerStructElement[];
}

export interface PdfViewerPlannedLink {
  id: string;
  annotations: PdfViewerLinkAnnotation[];
  alt?: string;
  contentIds: string[];
  ownedByStructure: boolean;
}

export interface PdfViewerStructNode {
  role?: string | null;
  level?: string;
  label?: string;
  description?: string;
  owns?: string;
  lang?: string;
  rowSpan?: number;
  colSpan?: number;
  image?: string;
  children: PdfViewerStructNode[];
}

export interface PdfViewerLinkPlan {
  root: PdfViewerStructElement | null;
  links: PdfViewerPlannedLink[];
  linkIds: Set<string>;
  linkContents: Set<PdfViewerStructTreeNode>;
  linkFigures: Set<PdfViewerStructTreeNode>;
  contentIds: Set<string>;
}

export interface PdfViewerTextMarker {
  id?: string | null;
  isArtifact: boolean;
}

export interface PdfViewerTextIndex {
  texts: Array<{ str: string; afterLineBreak: boolean; markers: PdfViewerTextMarker[] }>;
  markers: PdfViewerTextMarker[];
}

export declare function planLinks(
  tree: PdfViewerStructTreeNode | null,
  annotations: PdfViewerLinkAnnotation[],
  isRendered: (annotation: PdfViewerLinkAnnotation) => boolean,
): PdfViewerLinkPlan;

export declare function buildStructure(
  plan: PdfViewerLinkPlan,
  contentSpans: Map<string, string[]>,
): PdfViewerStructNode | null;

export declare function indexText(items: object[]): PdfViewerTextIndex;

export declare function getContentIndexes(index: PdfViewerTextIndex, contentIds: Set<string>): Map<string, number[]>;

export declare function getText(index: PdfViewerTextIndex, indexes: Array<number | undefined>): string;
