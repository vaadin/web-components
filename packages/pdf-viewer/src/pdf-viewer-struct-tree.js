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

/*
 * Adapted from StructTreeLayerBuilder in pdf_viewer.mjs of pdf.js 6.3.289
 * (Apache License 2.0, Copyright Mozilla Foundation), without MathML,
 * table header references and link ownership.
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
  Link: 'link',
  Annot: 'note',
  Form: 'form',
  L: 'list',
  LI: 'listitem',
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
 * Sets the ARIA attributes of a structure element.
 * @param {object} node a node of `PDFPageProxy.getStructTree()`
 * @param {HTMLElement} element
 */
function setAttributes(node, element) {
  const { alt, id, lang, rowSpan, colSpan } = node;
  if (alt !== undefined) {
    const role = element.getAttribute('role') || 'generic';
    element.setAttribute(ROLES_WITHOUT_NAME.has(role) ? 'aria-description' : 'aria-label', alt);
  }
  // Takes the elements of the text layer that hold the content into this element.
  if (id !== undefined) {
    element.setAttribute('aria-owns', id);
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
 * Returns the ARIA role of a structure element.
 * @param {object} node
 * @param {object[]} parents the ancestors of the node, nearest last
 * @return {string | null}
 */
function getRole(node, parents) {
  const { role } = node;
  let ariaRole = PDF_ROLE_TO_ARIA_ROLE[role] || null;
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

/** @private */
function walk(node, parents) {
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
  setAttributes(node, element);

  const children = node.children || [];
  if (
    children.length === 1 &&
    !('role' in children[0]) &&
    'id' in children[0] &&
    element.getAttribute('role') !== 'none'
  ) {
    // A single content child is owned by this element directly.
    setAttributes(children[0], element);
  } else {
    parents.push(node);
    children.forEach((child) => element.append(walk(child, parents)));
    parents.pop();
  }
  return element;
}

/**
 * Creates an element tree that exposes the structure of a tagged PDF page to
 * assistive technology, e.g. headings, lists, tables and figures with
 * alternative text. Its elements own the elements of the text layer with
 * `aria-owns`, so the text layer must be in the same DOM tree.
 *
 * @param {object | null} tree the result of `PDFPageProxy.getStructTree()`
 * @return {HTMLElement | null}
 */
export function createStructTreeElement(tree) {
  if (!tree) {
    return null;
  }
  const element = walk(tree, []);
  element.className = 'struct-tree';
  return element;
}
