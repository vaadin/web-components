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

/**
 * The ARIA roles of the standard structure types of tagged PDFs. `Link` has none, as the links of the page
 * are the links.
 */
const ARIA_ROLES = new Map(
  Object.entries({
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
    Annot: 'note',
    Form: 'form',
    L: 'list',
    LI: 'listitem',
    TOC: 'list',
    TOCI: 'listitem',
    Table: 'table',
    TR: 'row',
    TD: 'cell',
    THead: 'rowgroup',
    TBody: 'rowgroup',
    TFoot: 'rowgroup',
    Caption: 'caption',
    Figure: 'figure',
  }),
);

/** Roles that must not have a name, so alternative text becomes a description. */
const ROLES_WITHOUT_NAME = new Set(['caption', 'code', 'emphasis', 'generic', 'none', 'paragraph', 'strong']);

/** Roles whose children must have specific roles. */
const ROLES_WITH_REQUIRED_CHILDREN = new Set(['list', 'row', 'rowgroup', 'table']);

const HEADING_PATTERN = /^H(\d+)$/u;

/**
 * Returns the ARIA role of a structure element.
 * @param {object} node
 * @param {object} [parent]
 * @param {object} [grandParent]
 * @return {string | undefined}
 */
function getRole({ role, scope }, parent, grandParent) {
  if (HEADING_PATTERN.test(role)) {
    return 'heading';
  }
  if (role === 'TH') {
    const inBodyRow = parent?.role === 'TR' && grandParent?.role === 'TBody';
    return scope === 'Row' || (inBodyRow && scope !== 'Column') ? 'rowheader' : 'columnheader';
  }
  if (role === 'Caption' && parent?.role !== 'Table' && parent?.role !== 'Figure') {
    return undefined;
  }
  return ARIA_ROLES.get(role);
}

/**
 * Returns the marked content in a structure element, in reading order.
 * @param {object} node
 * @return {object[]}
 */
function getContents(node) {
  return (node.children ?? []).flatMap((child) => (child.type === 'content' ? [child] : getContents(child)));
}

/**
 * Returns the text elements in marked content of the text layer. The structure owns them instead of the
 * marked content, which has `display: contents`, as Chrome ignores `aria-owns` of such elements.
 * @param {HTMLElement} content
 * @param {Set<HTMLElement>} contents all the marked content of the structure, which has its own owner when nested
 * @return {HTMLElement[]}
 */
function getTextElements(content, contents) {
  return [...content.children].flatMap((child) => {
    if (child.classList.contains('markedContent')) {
      // Artifacts, such as page numbers, stay hidden.
      const isArtifact = child.getAttribute('aria-hidden') === 'true';
      return isArtifact || contents.has(child) ? [] : getTextElements(child, contents);
    }
    return child.localName === 'br' ? [] : [child];
  });
}

/**
 * Returns the `aria-owns` value that makes assistive technology read the elements in place of their owner.
 * @param {HTMLElement[]} elements
 * @return {string}
 */
function getOwnedIds(elements) {
  return elements.map((element) => element.id).join(' ');
}

/**
 * The structure of a tagged PDF page for assistive technology: a tree of elements with ARIA roles that own
 * the text elements and the links of the page. Adapted from `StructTreeLayerBuilder` of pdf.js. Unlike it, the
 * structure is created once the text layer and the links exist, so it only refers to elements of the page.
 */
export class PdfViewerStructureLayer {
  /**
   * The links that the structure owns, with the alternative text and the text that it gives them.
   * @type {Map<HTMLElement, { alt?: string, text?: string }>}
   */
  linkNames = new Map();

  /**
   * The links of the page, by the annotation id.
   * @type {Map<string, HTMLElement>}
   */
  #links;

  /**
   * The text elements of the marked content that has no owner yet, by the id of the marked content.
   * @type {Map<string, HTMLElement[]>}
   */
  #textElements = new Map();

  /**
   * @param {object} tree the result of `PDFPageProxy.getStructTree()`
   * @param {HTMLElement} textLayerElement the rendered text layer of the page
   * @param {HTMLElement[]} links the links of the page
   */
  constructor(tree, textLayerElement, links) {
    this.#links = new Map(links.map((link) => [link.id, link]));

    // The marked content of the text layer that the tree refers to, whose text elements get ids to own them by.
    const contentIds = new Set(getContents(tree).map(({ id }) => id));
    const contents = new Set(
      [...textLayerElement.querySelectorAll('.markedContent[id]')].filter(({ id }) => contentIds.has(id)),
    );
    contents.forEach((content) => {
      const elements = getTextElements(content, contents);
      elements.forEach((element, index) => {
        element.id ||= `${content.id}_${index}`;
      });
      this.#textElements.set(content.id, elements);
    });

    /**
     * The root element of the structure.
     * @type {HTMLElement}
     */
    this.element = this.#createElement(tree);
    this.element.className = 'struct-tree';
  }

  /**
   * Creates the element of a structure element, with the elements of its children.
   * @param {object} node a structure element of the tree
   * @param {object} [parent]
   * @param {object} [grandParent]
   * @return {HTMLElement}
   * @private
   */
  #createElement(node, parent, grandParent) {
    const element = document.createElement('span');
    const role = getRole(node, parent, grandParent);
    const attributes = {
      role,
      'aria-level': node.role.match(HEADING_PATTERN)?.[1],
      'aria-rowspan': node.rowSpan,
      'aria-colspan': node.colSpan,
      lang: node.lang,
    };
    Object.entries(attributes).forEach(([name, value]) => {
      if (value !== undefined) {
        element.setAttribute(name, value);
      }
    });

    // A list or a table has only items or rows, so it leaves out content and links directly in it.
    const children = (node.children ?? []).filter(
      (child) => 'role' in child || !ROLES_WITH_REQUIRED_CHILDREN.has(role),
    );
    const links = children.map((child) => this.#getLink(child)).filter(Boolean);

    // The only link of a `Link` structure element reads the text of the structure element.
    const text = node.role === 'Link' && links.length === 1 ? this.#giveText(links[0], node) : undefined;
    // As in pdf.js, the alternative text names the links of the structure element. Without links, it names
    // the structure element.
    links.forEach((link) => this.linkNames.set(link, { alt: node.alt, text }));
    if (node.alt && !links.length) {
      if (node.role === 'Figure') {
        // An image with the alternative text, as a figure that owns no text has no content to read.
        const image = element.appendChild(document.createElement('span'));
        image.setAttribute('role', 'img');
        image.setAttribute('aria-label', node.alt);
      } else if (role !== 'none') {
        element.setAttribute(ROLES_WITHOUT_NAME.has(role ?? 'generic') ? 'aria-description' : 'aria-label', node.alt);
      }
    }

    children.forEach((child) => {
      if ('role' in child) {
        element.append(this.#createElement(child, node, parent));
        return;
      }
      const link = this.#getLink(child);
      const owned = link ? [link] : this.#takeText(child);
      if (owned.length) {
        // An element that reads the link or the text at its place among the children.
        const owner = element.appendChild(document.createElement('span'));
        owner.setAttribute('aria-owns', getOwnedIds(owned));
      }
    });
    return element;
  }

  /**
   * Returns the link of an annotation of the tree, when the page has one.
   * @param {object} node
   * @return {HTMLElement | undefined}
   * @private
   */
  #getLink({ type, id }) {
    return type === 'annotation' ? this.#links.get(id) : undefined;
  }

  /**
   * Returns the text elements of marked content of the tree, only once, as an element has one owner.
   * @param {object} node
   * @return {HTMLElement[]}
   * @private
   */
  #takeText({ type, id }) {
    if (type !== 'content') {
      return [];
    }
    const elements = this.#textElements.get(id) ?? [];
    this.#textElements.delete(id);
    return elements;
  }

  /**
   * Makes a link own all the text of its `Link` structure element, and returns the text. Unlike in pdf.js, the
   * link owns the text itself, as Chrome ignores `aria-owns` of an element that a link owns.
   * @param {HTMLElement} link
   * @param {object} node the `Link` structure element
   * @return {string}
   * @private
   */
  #giveText(link, node) {
    const elements = getContents(node).flatMap((content) => this.#takeText(content));
    if (elements.length) {
      link.setAttribute('aria-owns', getOwnedIds(elements));
    }
    // A space between the lines, as the text layer has a line break between them instead.
    return elements
      .map((element) => `${element.previousElementSibling?.localName === 'br' ? ' ' : ''}${element.textContent}`)
      .join('');
  }
}
