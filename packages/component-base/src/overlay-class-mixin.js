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
         * Note, if the CSS class name was set with this property, clearing it will
         * remove it from the overlay, even if the same class name was also added
         * manually, e.g. by using `classList.add()` in the `renderer` function.
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

    /** @private */
    __updateOverlayClassNames(overlayClass, overlayElement) {
      if (!overlayElement) {
        return;
      }

      // Overlay is set but overlayClass is not set
      if (overlayClass === undefined) {
        return;
      }

      if (!this.__initialClasses) {
        this.__initialClasses = [...overlayElement.classList];
      }

      if (this._previousClasses !== undefined) {
        // Remove old classes that no longer apply
        this._previousClasses.forEach((name) => {
          if (!this.__initialClasses.includes(name)) {
            overlayElement.classList.remove(name);
          }
        });
      }

      // Add new classes based on the overlayClass
      const classInfo = typeof overlayClass === 'string' ? overlayClass.split(' ') : [];
      classInfo.forEach((name) => {
        overlayElement.classList.add(name);
      });

      this._previousClasses = classInfo;
    }
  };
