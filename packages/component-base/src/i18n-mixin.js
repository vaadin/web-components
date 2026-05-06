/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
// @ts-check -- gradual ts-check pilot, see proto/ts-check

/**
 * @param {Record<string, any>} target
 * @param {...Record<string, any>} sources
 * @returns {Record<string, any>}
 */
function deepMerge(target, ...sources) {
  /** @param {unknown} item */
  const isArray = (item) => Array.isArray(item);
  /** @param {unknown} item */
  const isObject = (item) => item && typeof item === 'object' && !isArray(item);
  /**
   * @param {Record<string, any>} target
   * @param {Record<string, any>} source
   */
  const merge = (target, source) => {
    if (isObject(source) && isObject(target)) {
      Object.keys(source).forEach((key) => {
        const sourceValue = source[key];
        if (isObject(sourceValue)) {
          if (!target[key]) {
            target[key] = {};
          }
          merge(target[key], sourceValue);
        } else if (isArray(sourceValue)) {
          target[key] = [...sourceValue];
        } else if (sourceValue !== undefined && sourceValue !== null) {
          target[key] = sourceValue;
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
 * @template {Record<string, any>} I18n
 * @template {new (...args: any[]) => HTMLElement} T
 * @param {I18n} defaultI18n
 * @param {T} superClass
 */
export const I18nMixin = (defaultI18n, superClass) =>
  class I18nMixinClass extends superClass {
    static get properties() {
      return {
        // Even though the property is overridden by a custom getter/setter, it needs to be declared here to initialize
        // __effectiveI18n properly if the i18n property is set before upgrading the element.
        i18n: {
          type: Object,
        },

        /** @private */
        __effectiveI18n: {
          type: Object,
          sync: true,
        },
      };
    }

    /**
     * @param {...any} args
     */
    constructor(...args) {
      super(...args);

      /** @type {Record<string, any> | undefined} */
      this.__customI18n = undefined;
      /** @type {Record<string, any> | undefined} */
      this.__effectiveI18n = undefined;

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
     * @returns {Record<string, any> | undefined}
     */
    get i18n() {
      return this.__customI18n;
    }

    /**
     * @param {Record<string, any> | undefined} value
     */
    set i18n(value) {
      if (value === this.__customI18n) {
        return;
      }
      this.__customI18n = value;
      this.__effectiveI18n = deepMerge({}, defaultI18n, this.__customI18n || {});
    }
  };
