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
import type { PdfViewerStructTreeNode } from './pdf-viewer-structure-layer.js';

export interface PdfViewerPlannedLink {
  id: string;
  annotations: PdfViewerLinkAnnotation[];
  alt?: string;
  contentIds: string[];
  ownedByStructure: boolean;
}

export interface PdfViewerLinkPlan {
  links: PdfViewerPlannedLink[];
  linkIds: Set<string>;
  linkContents: Set<PdfViewerStructTreeNode>;
  linkFigures: Set<PdfViewerStructTreeNode>;
  contentIds: Set<string>;
}

export declare const PDF_ROLE_TO_ARIA_ROLE: Record<string, string>;

export declare const ROLES_WITHOUT_NAME: Set<string>;

export declare const HEADING_PATTERN: RegExp;

export declare function isContent(node: PdfViewerStructTreeNode): boolean;

export declare function canOwn(node: PdfViewerStructTreeNode): boolean;

export declare function getRole(node: PdfViewerStructTreeNode, parents: PdfViewerStructTreeNode[]): string | null;

export declare function getChildren(node: PdfViewerStructTreeNode, role: string | null): PdfViewerStructTreeNode[];

export declare function getAnnotationIds(node: PdfViewerStructTreeNode): string[];

export declare function planLinks(
  tree: PdfViewerStructTreeNode | null,
  annotations: PdfViewerLinkAnnotation[],
  isRendered: (annotation: PdfViewerLinkAnnotation) => boolean,
): PdfViewerLinkPlan;
