/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

function deepMerge(target, ...sources) {
  const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);
  const merge = (target, source) => {
    if (isObject(source) && isObject(target)) {
      Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
          if (!target[key]) {
            target[key] = {};
          }

          merge(target[key], source[key]);
        } else if (source[key] !== undefined && source[key] !== null) {
          target[key] = source[key];
        }
      });
    }
  };

  sources.forEach((source) => {
    merge(target, source);
  });

  return target;
}

/**
 * A mixin that allows to set partial I18N properties.
 *
 * @polymerMixin
 */
export const I18nMixin = (superClass, defaultI18n) =>
  class I18nMixinClass extends superClass {
    static get properties() {
      return {
        /** @private */
        __effectiveI18n: {
          type: Object,
          sync: true,
        },
      };
    }

    constructor() {
      super();

      this.i18n = deepMerge({}, defaultI18n);
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
     *
     * Should be overridden by subclasses to provide a custom JSDoc with the
     * default I18N properties.
     *
     * @returns {Object}
     */
    get i18n() {
      return this.__customI18n;
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
     *
     * Should be overridden by subclasses to provide a custom JSDoc with the
     * default I18N properties.
     *
     * @param {Object} value
     */
    set i18n(value) {
      this.__customI18n = value;
      this.__effectiveI18n = deepMerge({}, defaultI18n, this.__customI18n);
    }
  };
