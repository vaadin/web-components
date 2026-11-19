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
import {
  canOwn,
  getAnnotationIds,
  getChildren,
  getRole,
  HEADING_PATTERN,
  isContent,
  ROLES_WITHOUT_NAME,
} from './pdf-viewer-page-model.js';

/**
 * Gives a structure element its alternative text, as a description for a role that must not have a name.
 * @param {HTMLElement} element
 * @param {string} alt
 */
function setAlt(element, alt) {
  const role = element.getAttribute('role') || 'generic';
  element.setAttribute(ROLES_WITHOUT_NAME.has(role) ? 'aria-description' : 'aria-label', alt);
}

/**
 * Exposes the structure of a tagged PDF page to assistive technology, adapted from `StructTreeLayerBuilder` of pdf.js.
 */
export class PdfViewerStructureLayer {
  /** @type {import('./pdf-viewer-page-model.js').PdfViewerLinkPlan} */
  #plan;

  /** @type {Map<string, string[]>} */
  #contentSpans;

  /**
   * @param {object} tree the result of `PDFPageProxy.getStructTree()`
   * @param {import('./pdf-viewer-page-model.js').PdfViewerLinkPlan} plan the links of the page
   * @param {Map<string, string[]>} contentSpans the ids of the text elements of each marked content
   */
  constructor(tree, plan, contentSpans) {
    this.#plan = plan;
    this.#contentSpans = contentSpans;
    this.element = this.#walk(tree, []);
    this.element.className = 'struct-tree';
  }

  /**
   * Sets the ARIA attributes of a structure element.
   * @param {object} node a node of `PDFPageProxy.getStructTree()`
   * @param {HTMLElement} element
   * @private
   */
  #setAttributes(node, element) {
    const { alt, lang, rowSpan, colSpan } = node;
    // The alternative text of an element whose annotation renders as a link names the link instead.
    if (alt !== undefined && !getAnnotationIds(node).some((id) => this.#plan.linkIds.has(id))) {
      setAlt(element, alt);
    }
    if (node.type === 'annotation') {
      // Unlike in pdf.js, only the annotations that an element owns, as lists and tables skip their direct content.
      if (this.#plan.linkIds.has(node.id)) {
        element.setAttribute('aria-owns', node.id);
      }
    } else if (canOwn(node) && !this.#plan.linkContents.has(node)) {
      // The text elements, as Chrome ignores `aria-owns` of the marked content, which has `display: contents`.
      const ids = this.#contentSpans.get(node.id) ?? [node.id];
      if (ids.length) {
        element.setAttribute('aria-owns', ids.join(' '));
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
    if (node.role === 'Figure' && node.alt && !getAnnotationIds(node).length) {
      element.removeAttribute('aria-label');
      if (this.#plan.linkFigures.has(node)) {
        // The link takes the place of the figure.
        element.removeAttribute('role');
      } else {
        const image = document.createElement('span');
        image.setAttribute('role', 'img');
        image.setAttribute('aria-label', node.alt);
        element.append(image);
      }
    }

    const children = getChildren(node, element.getAttribute('role'));
    if (children.length === 1 && isContent(children[0])) {
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
