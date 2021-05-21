/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { createArrayDataProvider } from './arrayDataProvider.js';

/**
 * @polymerMixin
 */
export const ArrayDataProviderMixin = (superClass) =>
  class ArrayDataProviderMixin extends superClass {
    static get properties() {
      return {
        /**
         * An array containing the items which will be passed to renderer functions.
         *
         * @type {Array<!GridItem> | undefined}
         */
        items: Array
      };
    }

    static get observers() {
      return ['__itemsChanged(items)'];
    }

    /** @private */
    __itemsChanged(items) {
      if (Array.isArray(items)) {
        this.dataProvider = createArrayDataProvider(items, {});
      } else if (items === null) {
        this.dataProvider = null;
      }
    }
  };
