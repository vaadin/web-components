/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { defineCustomElement } from '@vaadin/component-base/src/define.js';

const registered = {};

/**
 * @polymerMixin
 */
export const ElementRegistryMixin = (superClass) =>
  class ElementRegistryMixinClass extends superClass {
    static registerStyles(_is) {
      // To be overridden by the theme
    }

    static register() {
      const { is } = this;
      if (!registered[is]) {
        registered[is] = true;

        this.registerStyles(is);

        defineCustomElement(this);
      }
    }
  };
