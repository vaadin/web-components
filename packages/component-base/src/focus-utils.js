/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Returns true if the element is hidden with `visibility: hidden` or `display: none`, false otherwise.
 *
 * @param {!HTMLElement} element
 * @return {boolean}
 */
function isElementHidden(element) {
  // Check inline style first to save a re-flow. If looks good, check also
  // computed style.
  let style = element.style;
  if (style.visibility === 'hidden' || style.display === 'none') {
    return true;
  }
  style = window.getComputedStyle(element);
  return style.visibility === 'hidden' || style.display === 'none';
}

/**
 * Returns true if the element is focusable, otherwise false.
 *
 * @param {!HTMLElement} element
 * @return {boolean}
 */
function isElementFocusable(element) {
  // From http://stackoverflow.com/a/1600194/4228703:
  // There isn't a definite list, it's up to the browser. The only
  // standard we have is DOM Level 2 HTML
  // https://www.w3.org/TR/DOM-Level-2-HTML/html.html, according to which the
  // only elements that have a focus() method are HTMLInputElement,
  // HTMLSelectElement, HTMLTextAreaElement and HTMLAnchorElement. This
  // notably omits HTMLButtonElement and HTMLAreaElement. Referring to these
  // tests with tabbables in different browsers
  // http://allyjs.io/data-tables/focusable.html

  // Elements that cannot be focused if they have [disabled] attribute.
  if (element.matches('input, select, textarea, button, object')) {
    return element.matches(':not([disabled])');
  }
  // Elements that can be focused even if they have [disabled] attribute.
  return element.matches('a[href], area[href], iframe, [tabindex], [contentEditable]');
}

/**
 * Returns the normalized element tabindex. If not focusable, returns -1.
 * It checks for the attribute "tabindex" instead of the element property
 * `tabIndex` since browsers assign different values to it.
 * e.g. in Firefox `<div contenteditable>` has `tabIndex = -1`
 *
 * @param {!HTMLElement} element
 * @return {!number}
 */
function normalizeTabIndex(element) {
  if (!isElementFocusable(element)) {
    return -1;
  }

  const tabIndex = element.getAttribute('tabindex') || 0;
  return Number(tabIndex);
}

/**
 * Returns if element `a` has lower tab order compared to element `b`
 * (both elements are assumed to be focusable and tabbable).
 * Elements with tabindex = 0 have lower tab order compared to elements
 * with tabindex > 0.
 * If both have same tabindex, it returns false.
 *
 * @param {HTMLElement} a
 * @param {HTMLElement} b
 * @return {boolean}
 */
function hasLowerTabOrder(a, b) {
  // Normalize tabIndexes
  // e.g. in Firefox `<div contenteditable>` has `tabIndex = -1`
  const ati = Math.max(a.tabIndex, 0);
  const bti = Math.max(b.tabIndex, 0);
  return ati === 0 || bti === 0 ? bti > ati : ati > bti;
}

/**
 * Merge sort iterator, merges the two arrays into one, sorted by tabindex.
 *
 * @param {HTMLElement[]} left
 * @param {HTMLElement[]} right
 * @return {HTMLElement[]}
 */
function mergeSortByTabIndex(left, right) {
  const result = [];
  while (left.length > 0 && right.length > 0) {
    if (hasLowerTabOrder(left[0], right[0])) {
      result.push(right.shift());
    } else {
      result.push(left.shift());
    }
  }

  return result.concat(left, right);
}

/**
 * Sorts an array of elements by tabindex. Returns a new array.
 *
 * @param {HTMLElement[]} elements
 * @return {HTMLElement[]}
 */
function sortElementsByTabIndex(elements) {
  // Implement a merge sort as Array.prototype.sort does a non-stable sort
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  const len = elements.length;
  if (len < 2) {
    return elements;
  }
  const pivot = Math.ceil(len / 2);
  const left = sortElementsByTabIndex(elements.slice(0, pivot));
  const right = sortElementsByTabIndex(elements.slice(pivot));

  return mergeSortByTabIndex(left, right);
}

/**
 * Searches for nodes that are tabbable and adds them to the `result` array.
 * Returns if the `result` array needs to be sorted by tabindex.
 *
 * @param {Node} node The starting point for the search; added to `result` if tabbable.
 * @param {HTMLElement[]} result
 * @return {boolean}
 * @private
 */
function collectFocusableNodes(node, result) {
  // If the node is not an element or hidden, no need to traverse children.
  if (node.nodeType !== Node.ELEMENT_NODE || isElementHidden(node)) {
    return false;
  }
  const element = /** @type {!HTMLElement} */ (node);
  const tabIndex = normalizeTabIndex(element);
  let needsSort = tabIndex > 0;
  if (tabIndex >= 0) {
    result.push(element);
  }

  // In ShadowDOM v1, tab order is affected by the order of distribution.
  // E.g. getTabbableNodes(#root) in ShadowDOM v1 should return [#A, #B];
  // in ShadowDOM v0 tab order is not affected by the distribution order,
  // in fact getTabbableNodes(#root) returns [#B, #A].
  //  <div id="root">
  //   <!-- shadow -->
  //     <slot name="a">
  //     <slot name="b">
  //   <!-- /shadow -->
  //   <input id="A" slot="a">
  //   <input id="B" slot="b" tabindex="1">
  //  </div>
  let children;
  if (element.localName === 'slot') {
    children = element.assignedNodes({ flatten: true });
  } else {
    // Use shadow root if possible, will check for distributed nodes.
    children = (element.shadowRoot || element).children;
  }
  if (children) {
    for (let i = 0; i < children.length; i++) {
      // Ensure method is always invoked to collect tabbable children.
      needsSort = collectFocusableNodes(children[i], result) || needsSort;
    }
  }
  return needsSort;
}

/**
 * Returns a tab-ordered array of focusable elements for a root element.
 * The resulting array will include the root element if it is focusable.
 *
 * The method traverses nodes in shadow DOM trees too if any.
 *
 * @param {HTMLElement} element
 * @return {HTMLElement[]}
 */
export function getFocusableElements(element) {
  let focusableElements = [];
  const needsSortByTabIndex = collectFocusableNodes(element, focusableElements);
  // If there is at least one element with tabindex > 0, we need to sort
  // the final array by tabindex.≈
  if (needsSortByTabIndex) {
    return sortElementsByTabIndex(focusableElements);
  }
  return focusableElements;
}

/**
 * Returns true if the element is focused, false otherwise.
 *
 * @param {HTMLElement} element
 * @return {boolean}
 */
export function isElementFocused(element) {
  return element.getRootNode().activeElement === element;
}
