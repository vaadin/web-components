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
import { MAX_ZOOM, MIN_ZOOM } from './pdf-viewer-zoom.js';

/**
 * @typedef {{ x: number, y: number }} PdfViewerPoint
 */

/**
 * @typedef {Object} PdfViewerPinchCallbacks
 * @property {() => number} getZoomFactor
 *   Returns the zoom factor of the pages, or 0 while they cannot be zoomed, e.g. before they are laid out.
 * @property {(point: PdfViewerPoint) => object} captureAnchor
 *   Returns where the point of the pages at the given client point is.
 * @property {(zoom: number, anchor: object) => void} onZoom
 *   Called when a pinch ends with a new zoom, with the anchor of `captureAnchor()` and its `target`, the client
 *   point to show it at.
 */

/**
 * @typedef {Object} PdfViewerPinch
 * @property {number[]} ids The identifiers of the two touches.
 * @property {number} distance The distance between the touches at the start.
 * @property {PdfViewerPoint} origin The point between the touches at the start.
 * @property {number} zoomFactor The zoom factor at the start.
 * @property {object} anchor The point of the pages at the origin.
 * @property {number} zoom The current zoom.
 * @property {PdfViewerPoint} point The current point between the touches.
 */

/**
 * A controller that zooms the pages with two fingers. While pinching, it
 * previews the zoom by scaling the pages, which is fast. When one of the
 * fingers is lifted, it passes the new zoom to the host, which renders the
 * pages at it and then calls `cancel()` to remove the preview.
 */
export class PdfViewerPinchController {
  /** @type {HTMLElement} */
  #content;

  /** @type {HTMLElement} */
  #pages;

  /** @type {PdfViewerPinchCallbacks} */
  #callbacks;

  /** @type {PdfViewerPinch | null} */
  #pinch = null;

  /**
   * @param {HTMLElement} content the scrollable element that holds the pages
   * @param {HTMLElement} pages the element to scale while pinching
   * @param {PdfViewerPinchCallbacks} callbacks
   */
  constructor(content, pages, callbacks) {
    this.#content = content;
    this.#pages = pages;
    this.#callbacks = callbacks;
    // Touch events, as pointer events end when the browser starts to scroll, e.g. when one
    // finger moves before the second one touches the pages.
    content.addEventListener('touchstart', (event) => this.#onTouchStart(event), { passive: true });
    content.addEventListener('touchmove', (event) => this.#onTouchMove(event), { passive: false });
    content.addEventListener('touchend', (event) => this.#onTouchEnd(event));
    content.addEventListener('touchcancel', () => this.cancel());
  }

  /** Stops a pinch in progress, as its touches end unnoticed while the host is detached. */
  hostDisconnected() {
    this.cancel();
  }

  /** Stops a pinch without changing the zoom, e.g. when the system takes over the touches. */
  cancel() {
    this.#pinch = null;
    this.#pages.style.transform = '';
  }

  /**
   * Returns the first two touches on the pages.
   * @param {TouchEvent} event
   * @private
   */
  #getPinchTouches(event) {
    return [...event.touches].filter((touch) => this.#content.contains(touch.target)).slice(0, 2);
  }

  /**
   * Starts a pinch when a second finger touches the pages.
   * @param {TouchEvent} event
   * @private
   */
  #onTouchStart(event) {
    const touches = this.#getPinchTouches(event);
    const ids = [...event.touches].map((touch) => touch.identifier);
    // A pinch whose end was missed
    if (this.#pinch && !this.#pinch.ids.every((id) => ids.includes(id))) {
      this.cancel();
    }
    const zoomFactor = this.#callbacks.getZoomFactor();
    if (this.#pinch || touches.length < 2 || zoomFactor <= 0) {
      return;
    }
    const [a, b] = touches;
    const origin = { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
    this.#pinch = {
      ids: [a.identifier, b.identifier],
      distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1,
      origin,
      zoomFactor,
      // Taken at the start, as the browser may still scroll the pages while pinching.
      anchor: this.#callbacks.captureAnchor(origin),
      zoom: zoomFactor,
      point: origin,
    };
    const pagesRect = this.#pages.getBoundingClientRect();
    this.#pages.style.transformOrigin = `${origin.x - pagesRect.left}px ${origin.y - pagesRect.top}px`;
  }

  /**
   * Shows the zoom of a pinch by scaling the pages, and moves them with the fingers.
   * @param {TouchEvent} event
   * @private
   */
  #onTouchMove(event) {
    const pinch = this.#pinch;
    if (!pinch) {
      return;
    }
    const [a, b] = pinch.ids.map((id) => [...event.touches].find((touch) => touch.identifier === id));
    if (!a || !b) {
      return;
    }
    // Keep the browser from scrolling the pages while pinching, when it still can.
    if (event.cancelable) {
      event.preventDefault();
    }
    const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    // A zoom outside the zoom levels, set by the application, does not jump into them.
    const min = Math.min(MIN_ZOOM, pinch.zoomFactor);
    const max = Math.max(MAX_ZOOM, pinch.zoomFactor);
    pinch.zoom = Math.min(Math.max((pinch.zoomFactor * distance) / pinch.distance, min), max);
    pinch.point = { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
    const dx = pinch.point.x - pinch.origin.x;
    const dy = pinch.point.y - pinch.origin.y;
    this.#pages.style.transform = `translate(${dx}px, ${dy}px) scale(${pinch.zoom / pinch.zoomFactor})`;
  }

  /**
   * Applies the zoom of a pinch when one of its fingers is lifted, so that
   * the point of the pages between the fingers stays between them.
   * @param {TouchEvent} event
   * @private
   */
  #onTouchEnd(event) {
    const pinch = this.#pinch;
    const remaining = [...event.touches].map((touch) => touch.identifier);
    if (!pinch || pinch.ids.every((id) => remaining.includes(id))) {
      return;
    }
    this.#pinch = null;
    // Two decimals are enough for a zoom level, e.g. 1.35 for 135%.
    const zoom = Math.round(pinch.zoom * 100) / 100;
    if (Math.abs(zoom - pinch.zoomFactor) < 0.01) {
      // Only moved: scroll by as much as the preview showed.
      this.#pages.style.transform = '';
      this.#content.scrollTop -= pinch.point.y - pinch.origin.y;
      this.#content.scrollLeft -= pinch.point.x - pinch.origin.x;
      return;
    }
    this.#callbacks.onZoom(zoom, { ...pinch.anchor, target: pinch.point });
  }
}
