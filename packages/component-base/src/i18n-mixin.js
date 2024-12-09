function deepMerge(target, ...sources) {
  const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);
  const merge = (target, source) => {
    if (isObject(source) && isObject(target)) {
      Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, { [key]: {} });
          }

          merge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
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
     * Returns the previously set I18N properties, or the default ones if none
     * were set.
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
     * Sets the I18N properties.
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
