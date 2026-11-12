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
import { ANNOTATION_ID_PREFIX } from './pdf-viewer-text-accessibility.js';

/** The ARIA roles of the standard structure types of tagged PDFs. */
const PDF_ROLE_TO_ARIA_ROLE = {
  Part: 'group',
  Art: 'article',
  Sect: 'group',
  Div: 'group',
  BlockQuote: 'blockquote',
  Aside: 'note',
  NonStruct: 'none',
  P: 'paragraph',
  H: 'heading',
  FENote: 'note',
  Sub: 'group',
  Em: 'emphasis',
  Strong: 'strong',
  Note: 'note',
  Code: 'code',
  Link: 'link',
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
const ROLES_WITHOUT_NAME = new Set(['caption', 'code', 'emphasis', 'generic', 'none', 'paragraph', 'strong']);

const HEADING_PATTERN = /^H(\d+)$/u;

/** Roles whose children must have specific roles, so content directly in them stays in the text layer. */
const ROLES_WITH_REQUIRED_CHILDREN = new Set(['list', 'row', 'rowgroup', 'table']);

/** The id that the text layer gives the element of marked content, e.g. `p12R_mc3`. */
const CONTENT_ID_PATTERN = /^p\d+R\d*_mc\d+$/u;

/** The id of the element of an annotation, e.g. `pdfjs_internal_id_7R`. */
const ANNOTATION_ID_PATTERN = new RegExp(`^${ANNOTATION_ID_PREFIX}\\d+R\\d*$`, 'u');

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
  if (type === 'annotation') {
    return ANNOTATION_ID_PATTERN.test(id);
  }
  return type === 'content' && CONTENT_ID_PATTERN.test(id);
}

/**
 * Returns the text elements in the marked content, also in nested marked content that the structure does not own.
 * @param {HTMLElement} content
 * @param {Set<string>} contentIds the ids of the marked content that the structure owns
 * @return {HTMLElement[]}
 */
function getContentElements(content, contentIds) {
  return [...content.children].flatMap((child) => {
    if (child.localName === 'br' || child.getAttribute('aria-hidden') === 'true') {
      return [];
    }
    if (!child.classList.contains('markedContent')) {
      return [child];
    }
    return contentIds.has(child.id) ? [] : getContentElements(child, contentIds);
  });
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
 * Exposes the structure of a tagged PDF page to assistive technology, adapted from `StructTreeLayerBuilder` of pdf.js.
 */
export class PdfViewerStructureLayer {
  /**
   * The element that owns each annotation, by the annotation id.
   * @type {Map<string, HTMLElement>}
   */
  #annotationOwners = new Map();

  /**
   * The `Link` structure element of each annotation, until the link of the annotation takes its place.
   * @type {Map<string, HTMLElement>}
   */
  #linkElements = new Map();

  /**
   * The alternative text that the structure gives each annotation, by the annotation id.
   * @type {Map<string, string>}
   */
  #linkAlts = new Map();

  /**
   * The text that the `Link` structure element of each annotation owns, by the annotation id.
   * @type {Map<string, string>}
   */
  #linkTexts = new Map();

  /**
   * @param {object} tree the result of `PDFPageProxy.getStructTree()`
   */
  constructor(tree) {
    this.element = this.#walk(tree, []);
    this.element.className = 'struct-tree';
  }

  /**
   * Gives the structure its rendered links, as in pdf.js, and returns the ids of the links that it owns.
   * @param {HTMLElement[]} links
   * @return {Set<string>}
   */
  addLinks(links) {
    const linksById = new Map(links.map((link) => [link.id, link]));
    this.#annotationOwners.forEach((owner, id) => {
      if (!linksById.has(id)) {
        owner.removeAttribute('aria-owns');
        this.#annotationOwners.delete(id);
      }
    });
    // The link takes the place of its `Link` structure element, whose text is read as text without a link.
    this.#linkElements.forEach((element, id) => {
      element.removeAttribute('role');
      const link = linksById.get(id);
      if (link) {
        // Unlike in pdf.js, the link owns the text itself, as Chrome ignores aria-owns of an element that a link owns.
        const owners = this.#getLinkContentOwners(element, id);
        const textIds = owners.flatMap((owner) => owner.getAttribute('aria-owns').split(' '));
        owners.forEach((owner) => owner.removeAttribute('aria-owns'));
        if (textIds.length) {
          link.setAttribute('aria-owns', textIds.join(' '));
        }
      }
    });
    this.#linkElements.clear();
    return new Set(this.#annotationOwners.keys());
  }

  /**
   * Returns the alternative text that the structure gives the link of an annotation.
   * @param {string} annotationId
   * @return {string | undefined}
   */
  getLinkAlt(annotationId) {
    return this.#linkAlts.get(annotationId);
  }

  /**
   * Returns the text that the `Link` structure element of an annotation owns.
   * @param {string} annotationId
   * @return {string | undefined}
   */
  getLinkText(annotationId) {
    return this.#linkTexts.get(annotationId);
  }

  /**
   * Makes the structure own the text elements in marked content, as Chrome ignores `aria-owns` of `display: contents`.
   * @param {HTMLElement} textLayerElement
   */
  updateTextLayer(textLayerElement) {
    const owners = [...this.element.querySelectorAll('[aria-owns]')];
    const contentIds = new Set(
      owners.map((owner) => owner.getAttribute('aria-owns')).filter((id) => CONTENT_ID_PATTERN.test(id)),
    );
    owners.forEach((owner) => {
      const id = owner.getAttribute('aria-owns');
      const content = contentIds.has(id) && textLayerElement.querySelector(`#${id}`);
      if (!content) {
        return;
      }
      const ids = getContentElements(content, contentIds).map((element, index) => {
        element.id ||= `${id}_${index}`;
        return element.id;
      });
      if (ids.length) {
        owner.setAttribute('aria-owns', ids.join(' '));
      } else {
        owner.removeAttribute('aria-owns');
      }
    });

    if (this.#linkElements.size) {
      this.#keepLinkTexts(textLayerElement);
    }
  }

  /**
   * Keeps the text that the `Link` structure element of each annotation
   * owns, with a space between its lines, as the text layer has a line break
   * between them instead.
   * @param {HTMLElement} textLayerElement
   * @private
   */
  #keepLinkTexts(textLayerElement) {
    const lineStarts = new Set();
    let afterLineBreak = false;
    textLayerElement.querySelectorAll('br, span:not(.markedContent)').forEach((element) => {
      if (afterLineBreak && element.localName !== 'br') {
        lineStarts.add(element);
      }
      afterLineBreak = element.localName === 'br';
    });
    this.#linkElements.forEach((element, annotationId) => {
      const text = this.#getLinkContentOwners(element, annotationId)
        .flatMap((owner) => owner.getAttribute('aria-owns').split(' '))
        .map((id) => textLayerElement.querySelector(`#${id}`))
        .map((element) => (element ? `${lineStarts.has(element) ? ' ' : ''}${element.textContent}` : ''))
        .join('');
      this.#linkTexts.set(annotationId, text);
    });
  }

  /**
   * Returns the elements that own the text of a `Link` structure element, in document order.
   * @param {HTMLElement} element the `Link` structure element
   * @param {string} annotationId the id of its annotation
   * @return {HTMLElement[]}
   * @private
   */
  #getLinkContentOwners(element, annotationId) {
    return [...element.querySelectorAll('[aria-owns]')].filter(
      (owner) => owner.getAttribute('aria-owns') !== annotationId,
    );
  }

  /**
   * Sets the ARIA attributes of a structure element.
   * @param {object} node a node of `PDFPageProxy.getStructTree()`
   * @param {HTMLElement} element
   * @private
   */
  #setAttributes(node, element) {
    const { alt, lang, rowSpan, colSpan } = node;
    if (alt !== undefined) {
      // The alternative text of annotations names their own elements instead.
      const annotations = (node.children || []).filter((child) => child.type === 'annotation');
      annotations.forEach(({ id }) => this.#linkAlts.set(id, alt));
      const role = element.getAttribute('role') || 'generic';
      if (!annotations.length && role !== 'none') {
        element.setAttribute(ROLES_WITHOUT_NAME.has(role) ? 'aria-description' : 'aria-label', alt);
      }
    }
    if (canOwn(node)) {
      element.setAttribute('aria-owns', node.id);
      // Unlike in pdf.js, only the annotations that an element owns, as lists and tables skip their direct content.
      if (node.type === 'annotation') {
        this.#annotationOwners.set(node.id, element);
      }
    }
    if (lang !== undefined) {
      element.setAttribute('lang', lang);
    }
    if (rowSpan !== undefined) {
      element.setAttribute('aria-rowspan', rowSpan);
    }
    if (colSpan !== undefined) {
      element.setAttribute('aria-colspan', colSpan);
    }
  }

  /**
   * Creates the element of a node of the structure tree, with the elements of its children.
   * @param {object} node
   * @param {object[]} parents the ancestors of the node, nearest last
   * @return {HTMLElement}
   * @private
   */
  #walk(node, parents) {
    const element = document.createElement('span');
    if ('role' in node) {
      const heading = node.role.match(HEADING_PATTERN);
      if (heading) {
        element.setAttribute('role', 'heading');
        element.setAttribute('aria-level', heading[1]);
      } else {
        const role = getRole(node, parents);
        if (role) {
          element.setAttribute('role', role);
        }
      }
    }
    this.#setAttributes(node, element);

    // An image with the alternative text, as a figure that owns no text has no content to read.
    // Not for a figure with a link, which the alternative text names instead.
    if (node.role === 'Figure' && node.alt && !node.children?.some((child) => child.type === 'annotation')) {
      element.removeAttribute('aria-label');
      const image = document.createElement('span');
      image.setAttribute('role', 'img');
      image.setAttribute('aria-label', node.alt);
      element.append(image);
    }

    const role = element.getAttribute('role');
    const hasRequiredChildren = ROLES_WITH_REQUIRED_CHILDREN.has(role);
    const children = (node.children || []).filter((child) => !(hasRequiredChildren && isContent(child)));
    if (children.length === 1 && isContent(children[0]) && role !== 'none') {
      // A single content child is owned by this element directly.
      this.#setAttributes(children[0], element);
    } else {
      parents.push(node);
      children.forEach((child) => element.append(this.#walk(child, parents)));
      parents.pop();
    }

    if (node.role === 'Link') {
      const annotations = children.filter((child) => child.type === 'annotation');
      if (annotations.length === 1) {
        // The structure element stays a link until the link of the annotation takes its place.
        this.#linkElements.set(annotations[0].id, element);
      }
    }
    return element;
  }
}
