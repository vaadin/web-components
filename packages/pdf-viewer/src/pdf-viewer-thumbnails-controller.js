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
import { freeCanvas } from './pdf-viewer-page.js';

/**
 * @typedef {Object} PdfViewerThumbnail
 * @property {number} pageNumber
 * @property {HTMLElement} element
 * @property {HTMLCanvasElement | null} canvas
 * @property {number} pixelRatio the device pixel ratio the canvas was rendered at
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

  /** @type {MediaQueryList | null} */
  #pixelRatioQuery = null;

  /** The accessible name of a thumbnail, with `{page}` for the page number. */
  #label = '';

  /** The current page. */
  #page = 0;

  /** Set to scroll the list to the current thumbnail once the list shows. */
  #scrollPending = false;

  /**
   * @param {HTMLElement} list the element to show the thumbnails in
   * @param {Object} callbacks
   * @param {(pageNumber: number) => void} callbacks.onSelect called when the user chooses a thumbnail with a click, Enter or Space
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
      this.#watchPixelRatio();
    }
  }

  /** Stops observing and rendering the thumbnails. */
  hostDisconnected() {
    this.#observer?.disconnect();
    this.#observer = null;
    this.#unwatchPixelRatio();
    // The observer adds the visible thumbnails again when the host is attached.
    this.#visibleThumbnails.clear();
  }

  /**
   * Creates a thumbnail for each page of the document, unless the list has
   * them already. They render once `show()` is called.
   * @param {import('pdfjs-dist').PDFDocumentProxy} pdfDocument
   * @param {number[]} aspectRatios the width of each page divided by its height, for the thumbnails that are not rendered
   */
  create(pdfDocument, aspectRatios) {
    if (this.#thumbnails.length) {
      return;
    }
    this.#pdfDocument = pdfDocument;
    this.#thumbnails = aspectRatios.map((aspectRatio, index) => {
      const element = document.createElement('div');
      element.setAttribute('role', 'option');
      element.setAttribute('part', 'thumbnail');
      element.setAttribute('tabindex', '-1');
      element.dataset.page = String(index + 1);

      const image = document.createElement('div');
      image.className = 'thumbnail-image';
      image.style.aspectRatio = String(aspectRatio);
      const label = document.createElement('span');
      label.className = 'thumbnail-label';
      label.setAttribute('aria-hidden', 'true');
      label.textContent = String(index + 1);
      element.append(image, label);

      return { pageNumber: index + 1, element, canvas: null, pixelRatio: 0, renderTask: null, failed: false };
    });
    this.#list.replaceChildren(...this.#thumbnails.map((thumbnail) => thumbnail.element));
    this.#updateLabels();
    this.#watchPixelRatio();
  }

  /**
   * Renders the thumbnails near the visible part of the list, and scrolls
   * the list to the thumbnail of the current page. Call it when the list
   * shows: the thumbnails that left the view while it was hidden are
   * released then.
   * @param {number} page
   */
  show(page) {
    // A new observer reports every thumbnail once.
    this.#observe();
    this.setPage(page, true);
  }

  /**
   * Marks the thumbnail of the current page, and makes it the one that
   * receives focus in the list.
   * @param {number} page
   * @param {boolean} scrollIntoView whether to scroll the list to the thumbnail
   */
  setPage(page, scrollIntoView) {
    this.#page = page;
    const current = this.#thumbnails[page - 1];
    // Only the current page is marked, so that screen readers do not say "not selected" for every page.
    const previous = this.#list.querySelector('[aria-selected]');
    if (previous !== current?.element) {
      previous?.removeAttribute('aria-selected');
      previous?.part.remove('current');
      current?.element.setAttribute('aria-selected', 'true');
      current?.element.part.add('current');
    }

    // The focused thumbnail stays the tab stop while the user is in the list. A page out of range keeps the tab stop.
    const tabStop =
      this.#getFocusedThumbnail() || current?.element || this.#getTabStop() || this.#thumbnails[0]?.element;
    if (tabStop) {
      this.#setTabStop(tabStop);
    }

    if (scrollIntoView && current) {
      if (this.#list.checkVisibility()) {
        this.#scrollIntoView(current.element);
      } else {
        this.#scrollPending = true;
      }
    }
  }

  /**
   * Gives each thumbnail the aspect ratio of its page, e.g. once the pages
   * have loaded their own size.
   * @param {number[]} aspectRatios the width of each page divided by its height
   */
  setAspectRatios(aspectRatios) {
    this.#thumbnails.forEach(({ element }, index) => {
      element.querySelector('.thumbnail-image').style.aspectRatio = String(aspectRatios[index]);
    });
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
    this.#unwatchPixelRatio();
    this.#thumbnails.forEach((thumbnail) => this.#release(thumbnail));
    this.#thumbnails = [];
    this.#visibleThumbnails.clear();
    this.#pdfDocument = null;
    this.#scrollPending = false;
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
  #watchPixelRatio() {
    this.#unwatchPixelRatio();
    this.#pixelRatioQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    this.#pixelRatioQuery.addEventListener('change', this.#onPixelRatioChange);
  }

  /** @private */
  #unwatchPixelRatio() {
    this.#pixelRatioQuery?.removeEventListener('change', this.#onPixelRatioChange);
    this.#pixelRatioQuery = null;
  }

  /** @private */
  #onPixelRatioChange = () => {
    // The query only matches the previous ratio, so watch the new one.
    this.#watchPixelRatio();
    // Render the visible thumbnails again at the new ratio.
    this.#renderNext();
  };

  /** @private */
  #onIntersection(entries) {
    // Hiding the list with the sidebar is not leaving the view.
    if (!this.#list.checkVisibility()) {
      return;
    }
    if (this.#scrollPending) {
      this.#scrollPending = false;
      const current = this.#thumbnails[this.#page - 1];
      if (current) {
        this.#scrollIntoView(current.element);
      }
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
   * Renders the visible thumbnails one at a time, nearest to the middle of
   * the list first. Stops while the list is hidden.
   * @private
   */
  #renderNext() {
    const pdfDocument = this.#pdfDocument;
    if (this.#isRendering || !pdfDocument || !this.#list.checkVisibility()) {
      return;
    }
    const pixelRatio = window.devicePixelRatio || 1;
    const listRect = this.#list.getBoundingClientRect();
    const middle = listRect.top + listRect.height / 2;
    let thumbnail = null;
    let minDistance = Infinity;
    this.#visibleThumbnails.forEach((item) => {
      if (item.failed || (item.canvas && item.pixelRatio === pixelRatio)) {
        return;
      }
      const rect = item.element.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - middle);
      if (distance < minDistance) {
        minDistance = distance;
        thumbnail = item;
      }
    });
    if (!thumbnail) {
      return;
    }

    this.#isRendering = true;
    this.#render(thumbnail, pdfDocument)
      .catch((error) => {
        thumbnail.renderTask = null;
        // A released thumbnail cancels its rendering. A failed one stays empty.
        if (error?.name === 'RenderingCancelledException') {
          return;
        }
        thumbnail.failed = true;
        if (this.#pdfDocument === pdfDocument) {
          issueWarning(
            `Failed to render the thumbnail of page ${thumbnail.pageNumber} of the PDF document: ${error?.message}`,
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
    const image = thumbnail.element.querySelector('.thumbnail-image');
    // The styles set the width of the image, the canvas matches it.
    const width = image.offsetWidth;
    const pdfPage = await pdfDocument.getPage(thumbnail.pageNumber);
    const unscaled = pdfPage.getViewport({ scale: 1 });
    const pixelRatio = window.devicePixelRatio || 1;
    const viewport = pdfPage.getViewport({ scale: (width / unscaled.width) * pixelRatio });
    // Released or replaced by another document meanwhile
    if (this.#pdfDocument !== pdfDocument || !this.#visibleThumbnails.has(thumbnail)) {
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    thumbnail.renderTask = pdfPage.render({ canvas, viewport });
    try {
      await thumbnail.renderTask.promise;
    } catch (error) {
      freeCanvas(canvas);
      throw error;
    }
    thumbnail.renderTask = null;
    if (this.#pdfDocument === pdfDocument && this.#visibleThumbnails.has(thumbnail)) {
      if (thumbnail.canvas) {
        freeCanvas(thumbnail.canvas);
      }
      image.style.aspectRatio = `${unscaled.width} / ${unscaled.height}`;
      image.replaceChildren(canvas);
      thumbnail.canvas = canvas;
      thumbnail.pixelRatio = pixelRatio;
    } else {
      freeCanvas(canvas);
    }
  }

  /** @private */
  #release(thumbnail) {
    thumbnail.failed = false;
    thumbnail.renderTask?.cancel();
    thumbnail.renderTask = null;
    if (thumbnail.canvas) {
      freeCanvas(thumbnail.canvas);
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
    const previous = this.#getTabStop();
    if (previous !== element) {
      previous?.setAttribute('tabindex', '-1');
      element.setAttribute('tabindex', '0');
    }
  }

  /** @private */
  #getTabStop() {
    return this.#list.querySelector('[tabindex="0"]');
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
    // Key combinations are left to the browser and assistive technology.
    if (!focused || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
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
