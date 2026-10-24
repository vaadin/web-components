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
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';

/** The width of the thumbnail images in CSS pixels. */
const THUMBNAIL_WIDTH = 96;

/**
 * @typedef {Object} PdfViewerThumbnail
 * @property {number} pageNumber
 * @property {HTMLElement} element
 * @property {HTMLCanvasElement | null} canvas
 * @property {import('pdfjs-dist').RenderTask | null} renderTask
 * @property {boolean} failed Whether rendering failed, so that it is not tried again until released.
 */

/**
 * A controller that fills a list with a thumbnail for each page of the
 * document, following the listbox pattern. Thumbnails are rendered one at a
 * time, only while they are near the visible part of the list.
 */
export class PdfViewerThumbnailsController {
  /** @type {HTMLElement} */
  #list;

  /** @type {(pageNumber: number) => void} */
  #onSelect;

  /** @type {import('pdfjs-dist').PDFDocumentProxy | null} */
  #pdfDocument = null;

  /** @type {PdfViewerThumbnail[]} */
  #thumbnails = [];

  /** The thumbnails near the visible part of the list, to render. */
  #visibleThumbnails = new Set();

  #isRendering = false;

  /** @type {IntersectionObserver | null} */
  #observer = null;

  /** The accessible name of a thumbnail, with `{page}` for the page number. */
  #label = '';

  /**
   * @param {HTMLElement} list the element to show the thumbnails in
   * @param {{ onSelect: (pageNumber: number) => void }} callbacks
   *   `onSelect`: called when the user chooses a thumbnail with a click, Enter or Space.
   */
  constructor(list, { onSelect }) {
    this.#list = list;
    this.#onSelect = onSelect;
    list.addEventListener('click', (event) => this.#onClick(event));
    list.addEventListener('keydown', (event) => this.#onKeyDown(event));
  }

  /** Observes the thumbnails again after the host was moved in the DOM. */
  hostConnected() {
    if (this.#thumbnails.length) {
      this.#observe();
    }
  }

  /** Stops observing and rendering the thumbnails. */
  hostDisconnected() {
    this.#observer?.disconnect();
    this.#observer = null;
    // Stop rendering. The observer adds the visible thumbnails again when attached.
    this.#visibleThumbnails.clear();
  }

  /**
   * Creates a thumbnail for each page of the document, unless the list has them already.
   * @param {import('pdfjs-dist').PDFDocumentProxy} pdfDocument
   * @param {number} pageCount
   * @param {number} aspectRatio the width of the first page divided by its height, for the thumbnails that are not rendered
   */
  create(pdfDocument, pageCount, aspectRatio) {
    if (this.#thumbnails.length) {
      return;
    }
    this.#pdfDocument = pdfDocument;
    this.#thumbnails = Array.from({ length: pageCount }, (_, index) => {
      const element = document.createElement('div');
      element.setAttribute('role', 'option');
      element.setAttribute('part', 'thumbnail');
      element.setAttribute('tabindex', '-1');
      element.dataset.page = index + 1;

      const image = document.createElement('div');
      image.className = 'thumbnail-image';
      image.style.aspectRatio = String(aspectRatio);
      const label = document.createElement('span');
      label.className = 'thumbnail-label';
      label.setAttribute('aria-hidden', 'true');
      label.textContent = index + 1;
      element.append(image, label);

      return { pageNumber: index + 1, element, canvas: null, renderTask: null, failed: false };
    });
    this.#list.replaceChildren(...this.#thumbnails.map((thumbnail) => thumbnail.element));
    this.#updateLabels();
    this.#observe();
  }

  /**
   * Marks the thumbnail of the current page, and makes it the one that
   * receives focus in the list.
   * @param {number} page
   * @param {boolean} scrollIntoView whether to scroll the list to the thumbnail
   */
  setPage(page, scrollIntoView) {
    const focused = this.#getFocusedThumbnail();
    this.#thumbnails.forEach(({ element, pageNumber }) => {
      const isCurrent = pageNumber === page;
      // Only the current page is marked, so that screen readers don't say "not selected" for every page.
      if (isCurrent) {
        element.setAttribute('aria-selected', 'true');
      } else {
        element.removeAttribute('aria-selected');
      }
      element.part.toggle('current', isCurrent);
      // Keep the focused thumbnail as the tab stop while the user is in the list.
      if (!focused) {
        element.setAttribute('tabindex', isCurrent ? '0' : '-1');
      }
    });

    const current = this.#thumbnails[page - 1];
    if (scrollIntoView && current) {
      this.#scrollIntoView(current.element);
    }
  }

  /**
   * Sets the accessible name of the thumbnails.
   * @param {string} label the name, with `{page}` for the page number
   */
  setLabel(label) {
    this.#label = label;
    this.#updateLabels();
  }

  /** Removes the thumbnails, e.g. when the document is unloaded. */
  clear() {
    this.#observer?.disconnect();
    this.#observer = null;
    this.#thumbnails.forEach((thumbnail) => this.#release(thumbnail));
    this.#thumbnails = [];
    this.#visibleThumbnails.clear();
    this.#pdfDocument = null;
    this.#list.replaceChildren();
  }

  /** @private */
  #updateLabels() {
    this.#thumbnails.forEach(({ element, pageNumber }) => {
      element.setAttribute('aria-label', this.#label.replace('{page}', pageNumber));
    });
  }

  /** @private */
  #observe() {
    this.#observer?.disconnect();
    this.#observer = new IntersectionObserver((entries) => this.#onIntersection(entries), {
      root: this.#list,
      rootMargin: '200px 0px',
    });
    this.#thumbnails.forEach(({ element }) => this.#observer.observe(element));
  }

  /** @private */
  #onIntersection(entries) {
    // Hiding the list, e.g. when switching to the outline, is not leaving the view.
    if (!this.#list.checkVisibility()) {
      return;
    }
    entries.forEach(({ target, isIntersecting }) => {
      const thumbnail = this.#thumbnails[Number(target.dataset.page) - 1];
      if (!thumbnail) {
        return;
      }
      if (isIntersecting) {
        this.#visibleThumbnails.add(thumbnail);
      } else {
        this.#visibleThumbnails.delete(thumbnail);
        this.#release(thumbnail);
      }
    });
    this.#renderNext();
  }

  /**
   * Renders the visible thumbnails one at a time.
   * @private
   */
  #renderNext() {
    const pdfDocument = this.#pdfDocument;
    if (this.#isRendering || !pdfDocument) {
      return;
    }
    const thumbnail = [...this.#visibleThumbnails]
      .sort((a, b) => a.pageNumber - b.pageNumber)
      .find((item) => !item.canvas && !item.failed);
    if (!thumbnail) {
      return;
    }

    this.#isRendering = true;
    this.#render(thumbnail, pdfDocument)
      .catch((error) => {
        thumbnail.renderTask = null;
        // A released thumbnail cancels its rendering. A failed one stays empty.
        if (error && error.name === 'RenderingCancelledException') {
          return;
        }
        thumbnail.failed = true;
        if (this.#pdfDocument === pdfDocument) {
          issueWarning(
            `Failed to render the thumbnail of page ${thumbnail.pageNumber} of the PDF document: ${error.message}`,
          );
        }
      })
      .finally(() => {
        this.#isRendering = false;
        // Also after an outdated thumbnail, as visible thumbnails may have been added meanwhile.
        this.#renderNext();
      });
  }

  /** @private */
  async #render(thumbnail, pdfDocument) {
    const pdfPage = await pdfDocument.getPage(thumbnail.pageNumber);
    const unscaled = pdfPage.getViewport({ scale: 1 });
    const outputScale = window.devicePixelRatio || 1;
    const viewport = pdfPage.getViewport({ scale: (THUMBNAIL_WIDTH / unscaled.width) * outputScale });
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    // Released or replaced by another document meanwhile
    if (this.#pdfDocument !== pdfDocument || !this.#visibleThumbnails.has(thumbnail)) {
      return;
    }
    thumbnail.renderTask = pdfPage.render({ canvas, viewport });
    await thumbnail.renderTask.promise;
    thumbnail.renderTask = null;
    if (this.#pdfDocument === pdfDocument && this.#visibleThumbnails.has(thumbnail)) {
      const image = thumbnail.element.querySelector('.thumbnail-image');
      image.style.aspectRatio = `${unscaled.width} / ${unscaled.height}`;
      image.replaceChildren(canvas);
      thumbnail.canvas = canvas;
    }
  }

  /** @private */
  #release(thumbnail) {
    thumbnail.failed = false;
    thumbnail.renderTask?.cancel();
    thumbnail.renderTask = null;
    if (thumbnail.canvas) {
      thumbnail.canvas.width = 0;
      thumbnail.canvas.height = 0;
      thumbnail.canvas.remove();
      thumbnail.canvas = null;
    }
  }

  /** @private */
  #scrollIntoView(element) {
    const list = this.#list;
    const listRect = list.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    if (rect.top < listRect.top) {
      list.scrollTop += rect.top - listRect.top;
    } else if (rect.bottom > listRect.bottom) {
      list.scrollTop += rect.bottom - listRect.bottom;
    }
  }

  /**
   * Makes the given thumbnail the only one in the tab order.
   * @private
   */
  #setTabStop(element) {
    this.#thumbnails.forEach((thumbnail) => {
      thumbnail.element.setAttribute('tabindex', thumbnail.element === element ? '0' : '-1');
    });
  }

  /** @private */
  #getFocusedThumbnail() {
    const active = this.#list.getRootNode().activeElement;
    return active && active.parentNode === this.#list ? active : null;
  }

  /** @private */
  #onClick(event) {
    const element = event.target.closest('[part~="thumbnail"]');
    if (element) {
      this.#setTabStop(element);
      this.#onSelect(Number(element.dataset.page));
    }
  }

  /**
   * Moves focus between the thumbnails with the arrow keys, Home and End,
   * and chooses the focused thumbnail with Enter or Space.
   * @private
   */
  #onKeyDown(event) {
    const focused = this.#getFocusedThumbnail();
    if (!focused) {
      return;
    }
    const index = Number(focused.dataset.page) - 1;
    const last = this.#thumbnails.length - 1;
    const targets = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: last };

    if (event.key in targets) {
      const target = this.#thumbnails[Math.min(Math.max(targets[event.key], 0), last)].element;
      this.#setTabStop(target);
      target.focus({ focusVisible: isKeyboardActive() });
      this.#scrollIntoView(target);
    } else if (event.key === 'Enter' || event.key === ' ') {
      this.#onSelect(index + 1);
    } else {
      return;
    }
    event.preventDefault();
  }
}
