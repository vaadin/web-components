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
const PDF_ROLE_TO_ARIA_ROLE = {
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
const ROLES_WITHOUT_NAME = new Set(['caption', 'code', 'emphasis', 'generic', 'paragraph', 'strong']);

const HEADING_PATTERN = /^H(\d+)$/u;

/** Roles whose children must have specific roles, so content directly in them stays in the text layer. */
const ROLES_WITH_REQUIRED_CHILDREN = new Set(['list', 'row', 'rowgroup', 'table']);

/** The id that the text layer gives the element of marked content, e.g. `p12R_mc3`. */
const CONTENT_ID_PATTERN = /^p\d+R\d*_mc\d+$/u;

/**
 * Whether the node is content of the page, rather than a structure element.
 * @param {object} node
 * @return {boolean}
 */
function isContent(node) {
  return !('role' in node) && 'id' in node;
}

/**
 * Whether a structure element may own the element of the node, as another id could own any element of the viewer.
 * @param {object} node
 * @return {boolean}
 */
function canOwn({ type, id }) {
  return type === 'content' && CONTENT_ID_PATTERN.test(id);
}

/**
 * Returns the ARIA role of a structure element.
 * @param {object} node
 * @param {object[]} parents the ancestors of the node, nearest last
 * @return {string | null}
 */
function getRole(node, parents) {
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
function getChildren(node, role) {
  const hasRequiredChildren = ROLES_WITH_REQUIRED_CHILDREN.has(role);
  return (node.children || []).filter((child) => !(hasRequiredChildren && isContent(child)));
}

/**
 * Returns the ids of the annotations that are children of a structure element.
 * @param {object} node
 * @return {string[]}
 */
function getAnnotationIds(node) {
  return (node.children || []).filter((child) => child.type === 'annotation').map(({ id }) => id);
}

/**
 * Whether a figure gets an image with its alternative text, as a figure that owns no text has no content to read.
 * Not a figure with a link, which the alternative text names instead.
 * @param {object} node
 * @return {boolean}
 */
function hasImage(node) {
  return node.role === 'Figure' && !!node.alt && !getAnnotationIds(node).length;
}

/**
 * Returns the element of the structure layer for a node of the structure tree, with the elements of its children.
 * A single content child is owned by the element directly.
 * @param {object} node
 * @param {object[]} parents the ancestors of the node, nearest last
 * @return {import('./pdf-viewer-page-model.js').PdfViewerStructElement}
 */
function toElement(node, parents) {
  let role = null;
  let level;
  if ('role' in node) {
    const heading = node.role.match(HEADING_PATTERN);
    role = heading ? 'heading' : getRole(node, parents);
    level = heading?.[1];
  }
  const nodes = getChildren(node, role);
  const ownsChild = nodes.length === 1 && isContent(nodes[0]);
  return {
    node,
    role,
    level,
    nodes,
    owned: ownsChild ? [node, nodes[0]] : [node],
    children: ownsChild ? [] : nodes.map((child) => toElement(child, [...parents, node])),
  };
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
  const root = tree ? toElement(tree, []) : null;
  const ownedAnnotations = new Set();
  const alts = new Map();
  const contents = [];
  const linkElements = [];
  const contentIds = new Set();

  function visit({ node, nodes, owned, children }, linkChain) {
    if (node.alt !== undefined) {
      getAnnotationIds(node).forEach((id) => alts.set(id, node.alt));
    }
    let chain = linkChain;
    const ids = node.role === 'Link' ? nodes.filter((child) => child.type === 'annotation').map(({ id }) => id) : [];
    if (ids.length) {
      const isFigure = nodes.every((child) => child.type === 'annotation' || child.role === 'Figure');
      const element = { ids, isFigure, image: null };
      linkElements.push(element);
      chain = [...linkChain, element];
    }
    if (hasImage(node)) {
      chain.forEach((element) => {
        element.image ??= node;
      });
    }
    owned.forEach((ownedNode) => {
      if (ownedNode.type === 'annotation') {
        ownedAnnotations.add(ownedNode.id);
      } else if (canOwn(ownedNode)) {
        contentIds.add(ownedNode.id);
        contents.push({ node: ownedNode, linkChain: chain });
      }
    });
    children.forEach((child) => visit(child, chain));
  }

  if (root) {
    visit(root, []);
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

  return { root, links, linkIds: new Set(links.map(({ id }) => id)), linkContents, linkFigures, contentIds };
}

/**
 * Builds the structure of a tagged PDF page for assistive technology, as the plan of its links leaves it.
 *
 * @param {import('./pdf-viewer-page-model.js').PdfViewerLinkPlan} plan
 * @param {Map<string, string[]>} contentSpans the ids of the text elements of each marked content
 * @return {import('./pdf-viewer-page-model.js').PdfViewerStructNode | null}
 */
export function buildStructure({ root, linkIds, linkContents, linkFigures }, contentSpans) {
  function build({ node, role, level, owned, children }) {
    const { alt, lang, rowSpan, colSpan } = node;
    const structNode = { role, level };
    if (hasImage(node)) {
      if (linkFigures.has(node)) {
        // The link takes the place of the figure.
        structNode.role = null;
      } else {
        structNode.image = alt;
      }
    } else if (alt !== undefined && !getAnnotationIds(node).some((id) => linkIds.has(id))) {
      // A role that must not have a name gets a description. The link of an annotation gets the name instead.
      structNode[ROLES_WITHOUT_NAME.has(role || 'generic') ? 'description' : 'label'] = alt;
    }
    const owns = owned.flatMap((ownedNode) => {
      // Unlike in pdf.js, only the annotations that an element owns, as lists and tables skip their direct content.
      if (ownedNode.type === 'annotation') {
        return linkIds.has(ownedNode.id) ? [ownedNode.id] : [];
      }
      // The text elements, as Chrome ignores `aria-owns` of the marked content, which has `display: contents`.
      if (canOwn(ownedNode) && !linkContents.has(ownedNode)) {
        return contentSpans.get(ownedNode.id) ?? [ownedNode.id];
      }
      return [];
    });
    if (owns.length) {
      structNode.owns = owns.join(' ');
    }
    Object.assign(structNode, { lang, rowSpan, colSpan, children: children.map(build) });
    return structNode;
  }

  return root ? build(root) : null;
}

/** The number of text elements after which `TextLayer` of pdf.js renders no more text. */
const MAX_TEXT_DIVS_TO_RENDER = 100000;

/**
 * Indexes the text items of a page as `TextLayer` of pdf.js renders them: an element for each item with a string,
 * which is appended unless the string is empty, a line break after an item that ends a line, and an element for
 * each marked content, hidden for artifacts.
 *
 * @param {object[]} items the items of `PDFPageProxy.streamTextContent({ includeMarkedContent: true })`
 * @return {import('./pdf-viewer-page-model.js').PdfViewerTextIndex}
 */
export function indexText(items) {
  const texts = [];
  const markers = [];
  const openMarkers = [];
  let afterLineBreak = false;
  for (const item of items) {
    // As in `TextLayer`, which checks before each item.
    if (texts.length > MAX_TEXT_DIVS_TO_RENDER) {
      break;
    }
    if (item.str !== undefined) {
      texts.push({ str: item.str, afterLineBreak, markers: [...openMarkers] });
      if (item.str) {
        afterLineBreak = false;
      }
      if (item.hasEOL) {
        afterLineBreak = true;
      }
    } else if (item.type === 'beginMarkedContentProps' || item.type === 'beginMarkedContent') {
      const marker = { id: item.id, isArtifact: item.tag === 'Artifact' };
      markers.push(marker);
      openMarkers.push(marker);
    } else if (item.type === 'endMarkedContent') {
      openMarkers.pop();
    }
  }
  return { texts, markers };
}

/**
 * Returns the indexes of the text elements in each marked content that the structure owns, also in nested marked
 * content that it does not own. Leaves out artifacts and marked content that has no element.
 *
 * @param {import('./pdf-viewer-page-model.js').PdfViewerTextIndex} index
 * @param {Set<string>} contentIds the ids of the marked content that the structure owns
 * @return {Map<string, number[]>}
 */
export function getContentIndexes({ texts, markers }, contentIds) {
  // The text layer finds marked content by its id, so a second one with the same id has no text.
  const contents = new Map();
  markers.forEach((marker) => {
    if (contentIds.has(marker.id) && !contents.has(marker.id)) {
      contents.set(marker.id, marker);
    }
  });
  const contentIndexes = new Map([...contents.keys()].map((id) => [id, []]));
  texts.forEach(({ str, markers: openMarkers }, index) => {
    // An element without text is not in the text layer.
    if (!str) {
      return;
    }
    const marker = openMarkers.findLast(({ id, isArtifact }) => contentIds.has(id) || isArtifact);
    if (marker && contents.get(marker.id) === marker) {
      contentIndexes.get(marker.id).push(index);
    }
  });
  return contentIndexes;
}

/**
 * Returns the text of text elements, with a space between their lines, as the text layer has a line break between
 * them instead.
 *
 * @param {import('./pdf-viewer-page-model.js').PdfViewerTextIndex} index
 * @param {Array<number | undefined>} indexes
 * @return {string}
 */
export function getText({ texts }, indexes) {
  return indexes
    .map((index) => (index === undefined ? '' : `${texts[index].afterLineBreak ? ' ' : ''}${texts[index].str}`))
    .join('');
}
