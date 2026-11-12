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
 * @license pdf.js 6.4.299
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
  // No role for Link, as the page adds its link to the text before it.
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

/**
 * Roles whose children must have specific roles, e.g. rows in a table. Content
 * directly in such an element is not owned by it, and stays in the text layer.
 */
const ROLES_WITH_REQUIRED_CHILDREN = new Set(['list', 'row', 'rowgroup', 'table']);

/**
 * The id that the text layer gives the element of marked content: the
 * reference of the page, then the marked content id, e.g. `p12R_mc3`.
 */
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
 * Whether a structure element may own the element with the id of the node.
 * Only content: the page adds links to the text, and objects have no element.
 * An id of another form comes from the document and could own any element of
 * the viewer.
 * @param {object} node
 * @return {boolean}
 */
function canOwn({ type, id }) {
  return type === 'content' && CONTENT_ID_PATTERN.test(id);
}

/**
 * Returns the text elements in the marked content of the text layer, also
 * those in nested marked content, unless the structure owns that separately.
 * Artifacts, such as page numbers, stay hidden, and line breaks have no text.
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
 * Exposes the structure of a tagged PDF page to assistive technology, e.g.
 * headings, lists, tables and figures with alternative text, adapted from
 * `StructTreeLayerBuilder` of pdf.js. Its elements own the elements of the
 * text layer with `aria-owns`, so these must be in the same DOM tree. As in
 * pdf.js, the page puts the tree in its canvas. There is no MathML, no
 * references to table headers, no table summaries and no positions of
 * figures.
 */
export class PdfViewerStructureLayer {
  /**
   * @param {object} tree the result of `PDFPageProxy.getStructTree()`
   */
  constructor(tree) {
    this.element = this.#walk(tree, []);
    this.element.className = 'struct-tree';
  }

  /**
   * Makes the structure own the elements in the marked content of the text
   * layer, rather than the marked content itself. Chrome leaves out the
   * elements that `aria-owns` refers to when they have `display: contents`,
   * as marked content has. Needs the rendered text layer, as the
   * `updateTextLayer()` of pdf.js does.
   *
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
      const role = element.getAttribute('role') || 'generic';
      if (role !== 'none') {
        element.setAttribute(ROLES_WITHOUT_NAME.has(role) ? 'aria-description' : 'aria-label', alt);
      }
    }
    if (canOwn(node)) {
      element.setAttribute('aria-owns', node.id);
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
    if (node.role === 'Figure' && node.alt) {
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

    return element;
  }
}
