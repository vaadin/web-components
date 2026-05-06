/**
 * @license
 * Copyright (c) 2023 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
// @ts-check -- gradual ts-check pilot, see proto/ts-check

/**
 * A mixin that forwards CSS class names to the internal overlay element
 * by setting the `overlayClass` property or `overlay-class` attribute.
 *
 * @polymerMixin
 * @template {new (...args: any[]) => HTMLElement} T
 * @param {T} superclass
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

    /**
     * @param {...any} args
     */
    constructor(...args) {
      super(...args);
      /** @type {string | undefined} */
      this.overlayClass = undefined;
      /** @type {HTMLElement | undefined} */
      this._overlayElement = undefined;
      /** @type {Set<string> | undefined} */
      this.__initialClasses = undefined;
      /** @type {string[] | undefined} */
      this.__previousClasses = undefined;
    }

    /**
     * @param {string | undefined} overlayClass
     * @param {HTMLElement | undefined} overlayElement
     * @private
     */
    __updateOverlayClassNames(overlayClass, overlayElement) {
      if (!overlayElement) {
        return;
      }

      // Overlay is set but overlayClass is not set
      if (overlayClass === undefined) {
        return;
      }

      const { classList } = overlayElement;

      if (!this.__initialClasses) {
        this.__initialClasses = new Set(classList);
      }
      const initialClasses = this.__initialClasses;

      if (Array.isArray(this.__previousClasses)) {
        // Remove old classes that no longer apply
        const classesToRemove = this.__previousClasses.filter((name) => !initialClasses.has(name));
        if (classesToRemove.length > 0) {
          classList.remove(...classesToRemove);
        }
      }

      // Add new classes based on the overlayClass
      const classesToAdd = typeof overlayClass === 'string' ? overlayClass.split(' ').filter(Boolean) : [];
      if (classesToAdd.length > 0) {
        classList.add(...classesToAdd);
      }

      this.__previousClasses = classesToAdd;
    }
  };
