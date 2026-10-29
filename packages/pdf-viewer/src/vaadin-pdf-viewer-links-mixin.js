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
import { getLinkLabel, getTextInside, resolveDestination } from './pdf-viewer-links.js';

/**
 * A mixin that adds the links of the rendered pages, and goes to the
 * destinations of internal links.
 */
export const PdfViewerLinksMixin = (superClass) =>
  class PdfViewerLinksMixinClass extends superClass {
    /**
     * What the accessible name of each link is made of, to update it when the localization changes.
     * @type {WeakMap<HTMLElement, { text: string, url?: string, action?: string, targetPage: number | null }>}
     */
    #linkLabels = new WeakMap();

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('__effectiveI18n')) {
        this.#updateLinkLabels();
      }
    }

    /**
     * Override method from `PdfViewerRenderMixin` to add the links of the
     * page, after the text layer that their names are read from.
     * @protected
     * @override
     */
    async _renderPageLayers(page) {
      await super._renderPageLayers(page);

      const links = await page.renderLinkLayer((annotation) => this.#followLink(annotation));
      await this.#nameLinks(page, links);
    }

    /**
     * Gives the links of a page their accessible name: the text they cover,
     * or the URL or the page they go to.
     * @private
     */
    async #nameLinks(page, links) {
      const textDivs = page.textLayer ? page.textLayer.textDivs : [];

      await Promise.all(
        links.map(async ({ link, annotation }) => {
          const text = getTextInside(textDivs, link)
            .map(({ element, start, end }) => element.textContent.slice(start, end).trim())
            .join(' ');
          let targetPage = null;
          if (!text && !annotation.url) {
            const target = await this.#resolveDestination(annotation);
            targetPage = target ? target.page : null;
          }
          this.#linkLabels.set(link, { text, url: annotation.url, action: annotation.action, targetPage });
          this.#updateLinkLabel(link);
        }),
      );
    }

    /** @private */
    #updateLinkLabel(link) {
      link.setAttribute('aria-label', getLinkLabel(this.#linkLabels.get(link), this.__effectiveI18n));
    }

    /**
     * Updates the accessible names of the links of the rendered pages, e.g.
     * when the localization changes.
     * @private
     */
    #updateLinkLabels() {
      this.$.pages.querySelectorAll('a.link').forEach((link) => {
        if (this.#linkLabels.has(link)) {
          this.#updateLinkLabel(link);
        }
      });
    }

    /**
     * Returns the page and the position on the page that an internal link
     * points to, or null when it cannot be resolved.
     * @return {Promise<{ page: number, left?: number, top?: number } | null>}
     * @private
     */
    #resolveDestination(destination) {
      return resolveDestination(this._pdfDocument, destination, { page: this.page, pageCount: this.__pages.length });
    }

    /**
     * Goes to the destination of an internal link, and moves focus to the
     * pages, as the page with the link may not stay rendered.
     * @private
     */
    async #followLink(annotation) {
      const pdfDocument = this._pdfDocument;
      const target = await this.#resolveDestination(annotation);
      if (this._pdfDocument !== pdfDocument || !target) {
        return;
      }
      const page = this.__pages[target.page - 1];
      const hasPosition = target.left !== undefined || target.top !== undefined;
      if (hasPosition) {
        // The position depends on the size and the rotation of the page.
        await this._loadPdfPage(page);
        if (this._pdfDocument !== pdfDocument) {
          return;
        }
      }
      this._scrollToPage(target.page, hasPosition ? page.getOffset(target.left, target.top) : undefined);
      this.$.content.focus({ preventScroll: true, focusVisible: isKeyboardActive() });
    }
  };
