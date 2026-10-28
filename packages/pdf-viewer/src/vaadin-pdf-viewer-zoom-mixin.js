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
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { getFitScale } from './pdf-viewer-layout.js';
import { getZoomInLevel, getZoomOutLevel, isValidZoom, PDF_TO_CSS_UNITS } from './pdf-viewer-zoom.js';

/**
 * A mixin that scales the pages to the `zoom` level.
 */
export const PdfViewerZoomMixin = (superClass) =>
  class PdfViewerZoomMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * The zoom level of the pages:
         * - `page-width` (default) fits the width of the first page to the viewer.
         * - `page-fit` fits the whole first page into the viewer.
         * - A number scales the pages relative to their actual size, e.g. `1` for 100%.
         *
         * An invalid value logs a warning and is replaced with `page-width`.
         *
         * @type {string | number}
         */
        zoom: {
          value: 'page-width',
          notify: true,
          // Numbers set as attribute, e.g. zoom="1.5", become numbers.
          converter: {
            fromAttribute: (value) =>
              value !== null && value.trim() !== '' && !Number.isNaN(Number(value)) ? Number(value) : value,
          },
        },
      };
    }

    /**
     * The zoom level the pages are shown at, as a factor of their actual
     * size, or 0 while no pages are laid out.
     * @return {number}
     * @protected
     */
    get _zoomFactor() {
      return this._scale / PDF_TO_CSS_UNITS;
    }

    /** @protected */
    willUpdate(props) {
      super.willUpdate(props);

      const { zoom } = this;
      if (props.has('zoom') && !isValidZoom(zoom)) {
        // Only show strings and numbers, as converting other values to a string can throw.
        const value = typeof zoom === 'string' || typeof zoom === 'number' ? zoom : typeof zoom;
        issueWarning(`Invalid zoom value "${value}" for <vaadin-pdf-viewer>, using "page-width" instead.`);
        this.zoom = 'page-width';
      }
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('zoom')) {
        this._refreshLayout();
      }
    }

    /**
     * Zooms in or out to the next zoom level.
     * @param {1 | -1} direction
     * @protected
     */
    _stepZoom(direction) {
      const zoom = direction > 0 ? getZoomInLevel(this._zoomFactor) : getZoomOutLevel(this._zoomFactor);
      if (zoom) {
        this.zoom = zoom;
      }
    }

    /**
     * Sets the zoom back to `page-width`.
     * @protected
     */
    _resetZoom() {
      this.zoom = 'page-width';
    }

    /**
     * Override method from `PdfViewerScrollMixin` to return the scale for `zoom`.
     * @param {number} width
     * @param {number} height
     * @return {number}
     * @protected
     * @override
     */
    _getScaleForSize(width, height) {
      const { zoom } = this;
      if (zoom === 'page-width') {
        return super._getScaleForSize(width, height);
      }

      if (zoom === 'page-fit') {
        return Math.min(super._getScaleForSize(width, height), getFitScale(height, this.__pages[0].unscaledHeight));
      }

      return Number(zoom) * PDF_TO_CSS_UNITS;
    }
  };
