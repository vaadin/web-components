/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { setProperty } from './vaadin-crud-helpers.js';

/**
 * @polymerMixin
 */
export const IncludedMixin = (superClass) =>
  class IncludedMixin extends superClass {
    static get properties() {
      return {
        /**
         * A list of item fields that should not be mapped to form fields.
         *
         * When [`include`](#/elements/vaadin-crud-form#property-include) is defined, this property is ignored.
         *
         * Default is to exclude any private property.
         *
         * @type {string | RegExp}
         */
        exclude: {
          value: '^_',
          observer: '__onExcludeChange',
        },

        /**
         * A list of item properties that should be mapped to form fields.
         *
         * When it is defined [`exclude`](#/elements/vaadin-crud-form#property-exclude) is ignored.
         *
         * @type {string | !Array<string> | undefined}
         */
        include: {
          observer: '__onIncludeChange',
        },
      };
    }

    /** @private */
    __onExcludeChange(exclude) {
      if (typeof exclude === 'string') {
        this.exclude = exclude ? RegExp(exclude.replace(/, */gu, '|'), 'iu') : undefined;
      }
    }

    /** @private */
    __onIncludeChange(include) {
      if (typeof include === 'string') {
        this.include = include ? include.split(/, */u) : undefined;
      } else if (!this._fields && Array.isArray(include)) {
        const item = {};
        this.include.forEach((path) => {
          setProperty(path, null, item);
        });
        this._configure(item);
      }
    }
  };
