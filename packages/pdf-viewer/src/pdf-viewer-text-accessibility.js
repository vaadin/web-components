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
 * Copyright 2022 Mozilla Foundation
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
 * The prefix of the ids of annotation elements, as in pdf.js. The structure
 * tree of a tagged PDF refers to its link annotations by these ids.
 */
export const ANNOTATION_ID_PREFIX = 'pdfjs_internal_id_';

/**
 * Compares the positions of two annotations in PDF units, to order links as
 * the annotation layer of pdf.js does: by line from the top, then from the left.
 *
 * @param {{ rect: number[] }} a
 * @param {{ rect: number[] }} b
 * @return {number}
 */
export function compareAnnotationPositions({ rect: [a0, a1, a2, a3] }, { rect: [b0, b1, b2, b3] }) {
  // An annotation without size goes last. In PDF units, the origin is the bottom left corner.
  if (a0 === a2 && a1 === a3) {
    return 1;
  }
  if (b0 === b2 && b1 === b3) {
    return -1;
  }
  const mid1 = (a1 + a3) / 2;
  const mid2 = (b1 + b3) / 2;
  if (mid1 >= b3 && mid2 <= a1) {
    return -1;
  }
  if (mid2 >= a3 && mid1 <= b1) {
    return 1;
  }
  return (a0 + a2) / 2 - (b0 + b2) / 2;
}

/**
 * Compares the positions of two rendered elements, by line from the top, then
 * from the left, as `TextAccessibilityManager` of pdf.js does.
 *
 * @param {DOMRect} rect1
 * @param {DOMRect} rect2
 * @return {number}
 */
function compareRects(rect1, rect2) {
  if (rect1.width === 0 && rect1.height === 0) {
    return 1;
  }
  if (rect2.width === 0 && rect2.height === 0) {
    return -1;
  }
  const mid1 = rect1.y + rect1.height / 2;
  const mid2 = rect2.y + rect2.height / 2;
  if (mid1 <= rect2.y && mid2 >= rect1.bottom) {
    return -1;
  }
  if (mid2 <= rect1.y && mid1 >= rect2.bottom) {
    return 1;
  }
  return rect1.x + rect1.width / 2 - (rect2.x + rect2.width / 2);
}

/**
 * Returns the index of the first item for which the condition is true, or
 * the number of items when there is none. The condition must be false for
 * all items before that one, and true for all items after it.
 *
 * @param {Array} items
 * @param {(item: unknown) => boolean} condition
 * @return {number}
 */
function binarySearchFirstItem(items, condition) {
  let start = 0;
  let end = items.length;
  while (start < end) {
    const middle = (start + end) >> 1;
    if (condition(items[middle])) {
      end = middle;
    } else {
      start = middle + 1;
    }
  }
  return start;
}

/**
 * Adds each link to the `aria-owns` of the nearest text element before it,
 * adapted from `TextAccessibilityManager` of pdf.js. Assistive technology then
 * reads the links in the flow of the text, rather than after all the text of
 * the page. Needs the rendered text and links, as it compares their positions.
 *
 * @param {HTMLElement[]} textDivs the text elements of the text layer
 * @param {HTMLElement[]} links the links of the page, with ids
 */
export function addLinksToText(textDivs, links) {
  if (!textDivs.length) {
    return;
  }
  const rects = new Map([...textDivs, ...links].map((element) => [element, element.getBoundingClientRect()]));
  const sortedDivs = [...textDivs].sort((a, b) => compareRects(rects.get(a), rects.get(b)));
  links.forEach((link) => {
    const index = binarySearchFirstItem(sortedDivs, (div) => compareRects(rects.get(link), rects.get(div)) < 0);
    const div = sortedDivs[Math.max(0, index - 1)];
    const owns = div.getAttribute('aria-owns');
    div.setAttribute('aria-owns', owns ? `${owns} ${link.id}` : link.id);
  });
}
