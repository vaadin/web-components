/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const FormSectionMixin = (superClass) =>
  class extends superClass {
    static get properties() {
      return {
        title: {
          type: String,
          observer: '_titleChanged',
        },
      };
    }

    /** @private */
    _titleChanged(title) {
      this.$.title.innerText = title;
    }
  };
