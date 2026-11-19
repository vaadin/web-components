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
 * @license pdf.js 6.5.438
 *
 * Copyright 2021 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ANNOTATION_ID_PREFIX, compareAnnotationPositions } from './pdf-viewer-text-accessibility.js';

/** The ARIA roles of the standard structure types of tagged PDFs. */
export const PDF_ROLE_TO_ARIA_ROLE = {
  Part: 'group',
  Art: 'article',
  Sect: 'group',
  Div: 'group',
  BlockQuote: 'blockquote',
  Aside: 'note',
  // No role for NonStruct, as VoiceOver in Safari reads no text under the none role in the canvas.
  P: 'paragraph',
  H: 'heading',
  FENote: 'note',
  Sub: 'group',
  Em: 'emphasis',
  Strong: 'strong',
  Note: 'note',
  Code: 'code',
  // No role for Link, as its link owns its text.
  Annot: 'note',
  Form: 'form',
  L: 'list',
  LI: 'listitem',
  TOC: 'list',
  TOCI: 'listitem',
  Table: 'table',
  TR: 'row',
  TH: 'columnheader',
  TD: 'cell',
  THead: 'rowgroup',
  TBody: 'rowgroup',
  TFoot: 'rowgroup',
  Caption: 'caption',
  Figure: 'figure',
};

/** Roles that must not have a name, so alternative text becomes a description. */
export const ROLES_WITHOUT_NAME = new Set(['caption', 'code', 'emphasis', 'generic', 'paragraph', 'strong']);

export const HEADING_PATTERN = /^H(\d+)$/u;

/** Roles whose children must have specific roles, so content directly in them stays in the text layer. */
const ROLES_WITH_REQUIRED_CHILDREN = new Set(['list', 'row', 'rowgroup', 'table']);

/** The id that the text layer gives the element of marked content, e.g. `p12R_mc3`. */
const CONTENT_ID_PATTERN = /^p\d+R\d*_mc\d+$/u;

/**
 * Whether the node is content of the page, rather than a structure element.
 * @param {object} node
 * @return {boolean}
 */
export function isContent(node) {
  return !('role' in node) && 'id' in node;
}

/**
 * Whether a structure element may own the element of the node, as another id could own any element of the viewer.
 * @param {object} node
 * @return {boolean}
 */
export function canOwn({ type, id }) {
  return type === 'content' && CONTENT_ID_PATTERN.test(id);
}

/**
 * Returns the ARIA role of a structure element.
 * @param {object} node
 * @param {object[]} parents the ancestors of the node, nearest last
 * @return {string | null}
 */
export function getRole(node, parents) {
  const { role } = node;
  // Not an inherited property, e.g. for a role named `constructor`.
  let ariaRole = Object.hasOwn(PDF_ROLE_TO_ARIA_ROLE, role) ? PDF_ROLE_TO_ARIA_ROLE[role] : null;
  if (role === 'TH') {
    const parent = parents.at(-1);
    const grandParent = parents.at(-2);
    if (node.scope === 'Row' || (parent?.role === 'TR' && grandParent?.role === 'TBody' && node.scope !== 'Column')) {
      ariaRole = 'rowheader';
    }
  } else if (role === 'Caption') {
    const parentRole = parents.at(-1)?.role;
    if (parentRole !== 'Table' && parentRole !== 'Figure') {
      ariaRole = null;
    }
  }
  return ariaRole;
}

/**
 * Returns the children of a structure element that get an element, as content directly in an element whose children
 * must have specific roles stays in the text layer.
 * @param {object} node
 * @param {string | null} role the ARIA role of the element
 * @return {object[]}
 */
export function getChildren(node, role) {
  const hasRequiredChildren = ROLES_WITH_REQUIRED_CHILDREN.has(role);
  return (node.children || []).filter((child) => !(hasRequiredChildren && isContent(child)));
}

/**
 * Returns the ids of the annotations that are children of a structure element.
 * @param {object} node
 * @return {string[]}
 */
export function getAnnotationIds(node) {
  return (node.children || []).filter((child) => child.type === 'annotation').map(({ id }) => id);
}

/**
 * Plans the links of a page from its annotations and the structure of a tagged PDF, before either of them renders:
 * which annotations render as one link, which text and figure of the structure each link takes, and its alternative
 * text, as pdf.js does with `getAriaAttributes()`.
 *
 * @param {object | null} tree the result of `PDFPageProxy.getStructTree()`
 * @param {object[]} annotations the result of `PDFPageProxy.getAnnotations()`
 * @param {(annotation: object) => boolean} isRendered whether an annotation renders as a link
 * @return {import('./pdf-viewer-page-model.js').PdfViewerLinkPlan}
 */
export function planLinks(tree, annotations, isRendered) {
  const ownedAnnotations = new Set();
  const alts = new Map();
  const contents = [];
  const linkElements = [];
  const contentIds = new Set();

  function own(node, linkChain) {
    if (node.type === 'annotation') {
      ownedAnnotations.add(node.id);
    } else if (canOwn(node)) {
      contentIds.add(node.id);
      contents.push({ node, linkChain });
    }
  }

  // The same elements as the structure layer, see `PdfViewerStructureLayer`.
  function visit(node, parents, linkChain) {
    const role = 'role' in node ? getRole(node, parents) : null;
    if (node.alt !== undefined) {
      getAnnotationIds(node).forEach((id) => alts.set(id, node.alt));
    }
    own(node, linkChain);
    const children = getChildren(node, role);
    let chain = linkChain;
    if (node.role === 'Link') {
      const ids = children.filter((child) => child.type === 'annotation').map(({ id }) => id);
      if (ids.length) {
        const isFigure = children.every((child) => child.type === 'annotation' || child.role === 'Figure');
        const element = { ids, isFigure, image: null };
        linkElements.push(element);
        chain = [...linkChain, element];
      }
    }
    if (node.role === 'Figure' && node.alt && !getAnnotationIds(node).length) {
      chain.forEach((element) => {
        element.image ??= node;
      });
    }
    if (children.length === 1 && isContent(children[0])) {
      own(children[0], chain);
    } else {
      children.forEach((child) => visit(child, [...parents, node], chain));
    }
  }

  if (tree) {
    visit(tree, [], []);
  }

  const linkElementOf = new Map(linkElements.flatMap((element) => element.ids.map((id) => [id, element])));
  const linkOf = new Map();
  const linkFigures = new Set();
  const links = [];
  // A copy, as pdf.js returns the same annotations to each call.
  [...annotations]
    .sort(compareAnnotationPositions)
    .filter(isRendered)
    .forEach((annotation) => {
      const id = `${ANNOTATION_ID_PREFIX}${annotation.id}`;
      const element = linkElementOf.get(id);
      // Another annotation of a link, such as its next line, adds its area to the link.
      if (linkOf.has(element)) {
        linkOf.get(element).annotations.push(annotation);
        return;
      }
      // The image of a figure names a link that shows only figures, as its content names a link in pdf.js.
      const image = !alts.has(id) && element?.isFigure ? element.image : null;
      if (image) {
        linkFigures.add(image);
      }
      const link = {
        id,
        annotations: [annotation],
        alt: alts.has(id) ? alts.get(id) : image?.alt,
        contentIds: [],
        ownedByStructure: ownedAnnotations.has(id),
      };
      links.push(link);
      if (element) {
        linkOf.set(element, link);
      }
    });

  // Unlike in pdf.js, a link owns the text of its element, as Chrome ignores aria-owns of an element that a link owns.
  const linkContents = new Set();
  contents.forEach(({ node, linkChain }) => {
    const link = [...linkChain]
      .reverse()
      .map((element) => linkOf.get(element))
      .find(Boolean);
    if (link) {
      link.contentIds.push(node.id);
      linkContents.add(node);
    }
  });

  return { links, linkIds: new Set(links.map(({ id }) => id)), linkContents, linkFigures, contentIds };
}
