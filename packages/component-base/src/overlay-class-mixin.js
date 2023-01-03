/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin that forwards CSS class names to the internal overlay element
 * by setting the `overlayClass` property or `overlay-class` attribute.
 *
 * @polymerMixin
 */
export const OverlayClassMixin = (superclass) =>
  class OverlayClassMixinClass extends superclass {
    static get properties() {
      return {
        /**
         * A space-delimited list of CSS class names to set on the overlay element.
         * This property does not affect other CSS class names set manually via JS.
         *
         * @attr {string} overlay-class
         */
        overlayClass: {
          type: String,
        },

        /**
         * An overlay element on which CSS class names are set.
         *
         * @protected
         */
        _overlayElement: {
          type: Object,
        },
      };
    }

    static get observers() {
      return ['__updateOverlayClassNames(overlayClass, _overlayElement)'];
    }

    /**
     * @param {HTMLElement} overlay
     * @param {string[]} classInfo
     * @private
     */
    __applyClassNames(overlay, classInfo) {
      classInfo.forEach((name) => {
        if (!this._customClasses.has(name)) {
          overlay.classList.add(name);
        }
      });
    }

    /**
     * @param {HTMLElement} overlay
     * @param {string[]} classInfo
     * @private
     */
    __clearClassNames(overlay, classInfo) {
      if (this._previousClasses) {
        this._previousClasses.forEach((name) => {
          if (!classInfo.includes(name)) {
            overlay.classList.remove(name);
            this._previousClasses.delete(name);
          }
        });
      }
    }

    /**
     * @param {HTMLElement} overlay
     * @param {string[]} classInfo
     * @private
     */
    __storeClassNames(overlay, classInfo) {
      this._previousClasses = new Set();

      this._customClasses = new Set(overlay.className.split(' ').filter((s) => s !== ''));

      classInfo.forEach((name) => {
        if (!this._customClasses.has(name)) {
          this._previousClasses.add(name);
        }
      });
    }

    /** @private */
    __updateOverlayClassNames(overlayClass, overlayElement) {
      if (overlayElement) {
        // Overlay is set but overlayClass is not set
        if (overlayClass === undefined && this.__oldOverlayClass === undefined) {
          return;
        }

        const classInfo = typeof overlayClass === 'string' ? overlayClass.split(' ') : [];

        if (this._previousClasses === undefined) {
          // Remember custom classes on the first run
          this.__storeClassNames(overlayElement, classInfo);
        } else {
          // Remove old classes that no longer apply
          this.__clearClassNames(overlayElement, classInfo);
        }

        // Add new classes based on the overlayClass
        this.__applyClassNames(overlayElement, classInfo);

        this.__oldOverlayClass = overlayClass;
      }
    }
  };
