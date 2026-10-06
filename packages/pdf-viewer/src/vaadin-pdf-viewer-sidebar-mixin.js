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

/** The width of the thumbnail images in CSS pixels. */
const THUMBNAIL_WIDTH = 96;

/**
 * Shows a sidebar with thumbnails of the pages. Thumbnails are rendered only
 * while they are near the visible part of the sidebar.
 *
 * @polymerMixin
 */
export const PdfViewerSidebarMixin = (superClass) =>
  class PdfViewerSidebarMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Whether the sidebar with the page thumbnails is shown.
         *
         * @attr {boolean} sidebar-opened
         */
        sidebarOpened: {
          type: Boolean,
          value: false,
          notify: true,
          reflectToAttribute: true,
        },
      };
    }

    /** @type {Array<{ pageNumber: number, element: HTMLElement, canvas: HTMLCanvasElement | null, renderTask: object | null }>} */
    #thumbnails = [];

    /** The thumbnails near the visible part of the sidebar, to render. */
    #visibleThumbnails = new Set();

    #isRenderingThumbnail = false;

    /** @type {IntersectionObserver | null} */
    #observer = null;

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      const list = this.$.thumbnails;
      list.addEventListener('click', (event) => this.#onThumbnailClick(event));
      list.addEventListener('keydown', (event) => this.#onThumbnailKeyDown(event));
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      this.#observer?.disconnect();
      this.#observer = null;
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();
      // Observe the thumbnails again after being moved in the DOM.
      if (this.#thumbnails.length) {
        this.#observeThumbnails();
      }
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if ((props.has('pageCount') || props.has('sidebarOpened')) && this.sidebarOpened && this.pageCount) {
        if (!this.#thumbnails.length) {
          this.#createThumbnails();
        }
        this.#updateCurrentThumbnail(true);
      }

      if (props.has('page') && this.#thumbnails.length) {
        this.#updateCurrentThumbnail(this.sidebarOpened);
      }

      if (props.has('__effectiveI18n')) {
        this.#updateThumbnailLabels();
      }
    }

    /**
     * Override method from `PdfViewerMixin` to remove the thumbnails of the
     * previous document.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();
      this.#observer?.disconnect();
      this.#observer = null;
      this.#thumbnails.forEach((thumbnail) => this.#releaseThumbnail(thumbnail));
      this.#thumbnails = [];
      this.#visibleThumbnails.clear();
      this.$.thumbnails.replaceChildren();
    }

    /** @private */
    #createThumbnails() {
      const firstPage = this._getPageView(1);
      const ratio = firstPage.unscaledHeight / firstPage.unscaledWidth;
      this.#thumbnails = Array.from({ length: this.pageCount }, (_, index) => {
        const element = document.createElement('div');
        element.setAttribute('role', 'option');
        element.setAttribute('part', 'thumbnail');
        element.setAttribute('tabindex', '-1');
        element.dataset.page = index + 1;

        const image = document.createElement('div');
        image.className = 'thumbnail-image';
        image.style.aspectRatio = String(1 / ratio);
        const label = document.createElement('span');
        label.className = 'thumbnail-label';
        label.setAttribute('aria-hidden', 'true');
        label.textContent = index + 1;
        element.append(image, label);

        return { pageNumber: index + 1, element, canvas: null, renderTask: null };
      });
      this.$.thumbnails.replaceChildren(...this.#thumbnails.map((thumbnail) => thumbnail.element));
      this.#updateThumbnailLabels();
      this.#observeThumbnails();
    }

    /** @private */
    #updateThumbnailLabels() {
      const label = this.__effectiveI18n.pageLabel;
      this.#thumbnails.forEach(({ element, pageNumber }) => {
        element.setAttribute('aria-label', label.replace('{page}', pageNumber));
      });
    }

    /** @private */
    #observeThumbnails() {
      this.#observer?.disconnect();
      this.#observer = new IntersectionObserver((entries) => this.#onThumbnailIntersection(entries), {
        root: this.$.thumbnails,
        rootMargin: '200px 0px',
      });
      this.#thumbnails.forEach(({ element }) => this.#observer.observe(element));
    }

    /** @private */
    #onThumbnailIntersection(entries) {
      entries.forEach(({ target, isIntersecting }) => {
        const thumbnail = this.#thumbnails[Number(target.dataset.page) - 1];
        if (!thumbnail) {
          return;
        }
        if (isIntersecting) {
          this.#visibleThumbnails.add(thumbnail);
        } else {
          this.#visibleThumbnails.delete(thumbnail);
          this.#releaseThumbnail(thumbnail);
        }
      });
      this.#renderNextThumbnail();
    }

    /**
     * Renders the visible thumbnails one at a time.
     * @private
     */
    async #renderNextThumbnail() {
      if (this.#isRenderingThumbnail) {
        return;
      }
      const thumbnail = [...this.#visibleThumbnails]
        .sort((a, b) => a.pageNumber - b.pageNumber)
        .find((item) => !item.canvas);
      const pdfDocument = this._pdfDocument;
      if (!thumbnail || !pdfDocument) {
        return;
      }

      this.#isRenderingThumbnail = true;
      try {
        const pdfPage = await pdfDocument.getPage(thumbnail.pageNumber);
        const unscaled = pdfPage.getViewport({ scale: 1 });
        const outputScale = window.devicePixelRatio || 1;
        const viewport = pdfPage.getViewport({ scale: (THUMBNAIL_WIDTH / unscaled.width) * outputScale });
        const canvas = document.createElement('canvas');
        canvas.setAttribute('aria-hidden', 'true');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        // Released or replaced by another document meanwhile
        if (this._pdfDocument !== pdfDocument || !this.#visibleThumbnails.has(thumbnail)) {
          return;
        }
        thumbnail.renderTask = pdfPage.render({ canvas, viewport });
        await thumbnail.renderTask.promise;
        thumbnail.renderTask = null;
        if (this._pdfDocument === pdfDocument && this.#visibleThumbnails.has(thumbnail)) {
          const image = thumbnail.element.querySelector('.thumbnail-image');
          image.style.aspectRatio = `${unscaled.width} / ${unscaled.height}`;
          image.replaceChildren(canvas);
          thumbnail.canvas = canvas;
        }
      } catch {
        // A cancelled or failed thumbnail stays empty.
        thumbnail.renderTask = null;
      } finally {
        this.#isRenderingThumbnail = false;
      }
      this.#renderNextThumbnail();
    }

    /** @private */
    #releaseThumbnail(thumbnail) {
      thumbnail.renderTask?.cancel();
      thumbnail.renderTask = null;
      if (thumbnail.canvas) {
        thumbnail.canvas.width = 0;
        thumbnail.canvas.height = 0;
        thumbnail.canvas.remove();
        thumbnail.canvas = null;
      }
    }

    /**
     * Marks the thumbnail of the current page, and makes it the one that
     * receives focus in the list.
     * @private
     */
    #updateCurrentThumbnail(scrollIntoView) {
      const focused = this.#getFocusedThumbnail();
      this.#thumbnails.forEach(({ element, pageNumber }) => {
        const isCurrent = pageNumber === this.page;
        element.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        element.part.toggle('current', isCurrent);
        // Keep the focused thumbnail as the tab stop while the user is in the list.
        if (!focused) {
          element.setAttribute('tabindex', isCurrent ? '0' : '-1');
        }
      });

      const current = this.#thumbnails[this.page - 1];
      if (scrollIntoView && current) {
        this.#scrollThumbnailIntoView(current.element);
      }
    }

    /** @private */
    #scrollThumbnailIntoView(element) {
      const list = this.$.thumbnails;
      const listRect = list.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      if (rect.top < listRect.top) {
        list.scrollTop += rect.top - listRect.top;
      } else if (rect.bottom > listRect.bottom) {
        list.scrollTop += rect.bottom - listRect.bottom;
      }
    }

    /** @private */
    #getFocusedThumbnail() {
      const active = this.shadowRoot.activeElement;
      return active && active.parentNode === this.$.thumbnails ? active : null;
    }

    /** @private */
    #onThumbnailClick(event) {
      const element = event.target.closest('[part~="thumbnail"]');
      if (element) {
        this._goToPage(Number(element.dataset.page));
      }
    }

    /**
     * Moves focus between the thumbnails with the arrow keys, and goes to the
     * page of the focused thumbnail with Enter or Space.
     * @private
     */
    #onThumbnailKeyDown(event) {
      const focused = this.#getFocusedThumbnail();
      if (!focused) {
        return;
      }
      const index = Number(focused.dataset.page) - 1;
      const last = this.#thumbnails.length - 1;
      const targets = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: last };

      if (event.key in targets) {
        const target = this.#thumbnails[Math.min(Math.max(targets[event.key], 0), last)].element;
        focused.setAttribute('tabindex', '-1');
        target.setAttribute('tabindex', '0');
        target.focus({ focusVisible: isKeyboardActive() });
        this.#scrollThumbnailIntoView(target);
      } else if (event.key === 'Enter' || event.key === ' ') {
        this._goToPage(index + 1);
      } else {
        return;
      }
      event.preventDefault();
    }
  };
