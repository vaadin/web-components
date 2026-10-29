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
 * Copyright 2024 Mozilla Foundation
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
import { isFirefox } from '@vaadin/component-base/src/browser-utils.js';

/**
 * Whether the browser keeps a selection from jumping over empty space by
 * itself. pdf.js finds that Firefox and Chromium 148 and later do.
 */
const keepsSelectionInPlace = (() => {
  if (isFirefox) {
    return true;
  }
  const chromiumVersion = navigator.userAgentData
    ? navigator.userAgentData.brands.find(({ brand }) => brand === 'Chromium')?.version
    : /\bChrome\/(\d+)\b/u.exec(navigator.userAgent)?.[1];
  return !!chromiumVersion && parseInt(chromiumVersion, 10) >= 148;
})();

/** @return {Range[]} */
function getRanges(selection) {
  return Array.from({ length: selection?.rangeCount ?? 0 }, (_, index) => selection.getRangeAt(index));
}

/**
 * Returns the ranges of the selection with their boundaries inside the given
 * shadow root, as in Quill. Chrome has `getSelection()` on shadow roots, and
 * returns wrong ranges from `getComposedRanges()` of that selection. Safari
 * returns such ranges only from `getComposedRanges()`.
 *
 * @param {ShadowRoot} root
 * @return {Range[]}
 */
function getSelectionRanges(root) {
  if (typeof root.getSelection === 'function') {
    return getRanges(root.getSelection());
  }
  const selection = document.getSelection();
  if (selection?.rangeCount && typeof selection.getComposedRanges === 'function') {
    return selection.getComposedRanges(root).map(({ startContainer, startOffset, endContainer, endOffset }) => {
      const range = document.createRange();
      range.setStart(startContainer, startOffset);
      range.setEnd(endContainer, endOffset);
      return range;
    });
  }
  return getRanges(selection);
}

/**
 * Puts the end-of-content element back at the end of its text layer.
 * @param {HTMLElement} end
 * @param {HTMLElement} textLayer
 */
function reset(end, textLayer) {
  textLayer.append(end);
  end.style.width = '';
  end.style.height = '';
  textLayer.classList.remove('selecting');
}

/**
 * Keeps the selection of text from jumping over empty space, adapted from
 * `TextLayerBuilder` of pdf.js. While text in a text layer is selected, its
 * end-of-content element covers the page. Other browsers than Firefox and
 * Chromium 148 and later would then extend the selection to all the text
 * before that element. So it is moved next to the text where the selection
 * changes, which limits a jump to at most that text element.
 */
export class PdfViewerTextSelectionController {
  /** @type {AbortController | null} */
  #abortController = null;

  #isPointerDown = false;

  /** @type {Range | null} */
  #prevRange = null;

  /**
   * @param {HTMLElement} host
   * @param {() => Map<HTMLElement, HTMLElement>} getTextLayers returns the
   *   end-of-content element of each rendered text layer, by text layer
   */
  constructor(host, getTextLayers) {
    this.host = host;
    this.getTextLayers = getTextLayers;
  }

  hostConnected() {
    this.#abortController = new AbortController();
    const { signal } = this.#abortController;
    document.addEventListener(
      'pointerdown',
      () => {
        this.#isPointerDown = true;
      },
      { signal },
    );
    document.addEventListener(
      'pointerup',
      () => {
        this.#isPointerDown = false;
        this.getTextLayers().forEach(reset);
      },
      { signal },
    );
    window.addEventListener(
      'blur',
      () => {
        this.#isPointerDown = false;
        this.getTextLayers().forEach(reset);
      },
      { signal },
    );
    document.addEventListener(
      'keyup',
      () => {
        if (!this.#isPointerDown) {
          this.getTextLayers().forEach(reset);
        }
      },
      { signal },
    );
    document.addEventListener('selectionchange', () => this.#onSelectionChange(), { signal });
  }

  hostDisconnected() {
    this.#abortController?.abort();
    this.#abortController = null;
  }

  /** @private */
  #onSelectionChange() {
    const textLayers = this.getTextLayers();
    if (!textLayers.size) {
      return;
    }

    const ranges = getSelectionRanges(this.host.shadowRoot);
    const activeTextLayers = new Set();
    ranges.forEach((range) => {
      textLayers.forEach((_, textLayer) => {
        if (range.intersectsNode(textLayer)) {
          activeTextLayers.add(textLayer);
        }
      });
    });
    textLayers.forEach((end, textLayer) => {
      if (activeTextLayers.has(textLayer)) {
        textLayer.classList.add('selecting');
      } else {
        reset(end, textLayer);
      }
    });

    // Unlike in pdf.js, which handles the text layers of all viewers together,
    // only a selection in the text layers of this viewer moves their elements.
    if (!activeTextLayers.size) {
      this.#prevRange = null;
      return;
    }
    if (keepsSelectionInPlace) {
      return;
    }

    const [range] = ranges;
    const prevRange = this.#prevRange;
    // Whether the user moves the start of the selection, rather than its end
    const modifyStart =
      !!prevRange &&
      prevRange.startContainer.getRootNode() === range.startContainer.getRootNode() &&
      (range.compareBoundaryPoints(Range.END_TO_END, prevRange) === 0 ||
        range.compareBoundaryPoints(Range.START_TO_END, prevRange) === 0);
    let anchor = modifyStart ? range.startContainer : range.endContainer;
    if (anchor.nodeType === Node.TEXT_NODE) {
      anchor = anchor.parentNode;
    }
    if (!modifyStart && range.endOffset === 0) {
      // The selection ends before the node, so the element goes after the last node with content before it.
      do {
        while (anchor && !anchor.previousSibling) {
          anchor = anchor.parentNode;
        }
        anchor = anchor?.previousSibling;
      } while (anchor && !anchor.childNodes.length);
    }

    const textLayer = anchor?.parentElement?.closest('.text-layer');
    const end = textLayers.get(textLayer);
    if (end) {
      end.style.width = textLayer.style.width;
      end.style.height = textLayer.style.height;
      end.style.userSelect = 'text';
      anchor.parentElement.insertBefore(end, modifyStart ? anchor : anchor.nextSibling);
    }
    this.#prevRange = range.cloneRange();
  }
}
