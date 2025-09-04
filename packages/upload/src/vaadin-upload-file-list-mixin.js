/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Virtualizer } from '@vaadin/component-base/src/virtualizer.js';

/**
 * @polymerMixin
 */
export const UploadFileListMixin = (superClass) =>
  class UploadFileListMixin extends superClass {
    static get properties() {
      return {
        /**
         * The array of files being processed, or already uploaded.
         */
        items: {
          type: Array,
        },

        /**
         * The object used to localize upload files.
         */
        i18n: {
          type: Object,
        },

        /**
         * If true, the user cannot interact with this element.
         */
        disabled: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },
      };
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.__virtualizer = new Virtualizer({
        createElements: this.__createElements.bind(this),
        updateElement: this.__updateElement.bind(this),
        elementsContainer: this,
        scrollTarget: this,
        scrollContainer: this.$.list,
        reorderElements: true,
      });
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('items') || props.has('i18n') || props.has('disabled')) {
        this.toggleAttribute('has-items', this.items && this.items.length);
        this.requestContentUpdate();
      }
    }

    /** @private */
    __createElements(count) {
      return [...Array(count)].map(() => {
        const item = document.createElement('li');
        const file = document.createElement('vaadin-upload-file');
        item.appendChild(file);
        return item;
      });
    }

    /** @private */
    __updateElement(el, index) {
      const file = el.firstElementChild;
      const item = this.items[index];

      file.disabled = this.disabled;
      file.i18n = this.i18n;
      file.file = item;
      file.complete = item.complete;
      file.errorMessage = item.error;
      file.fileName = item.name;
      file.held = item.held;
      file.indeterminate = item.indeterminate;
      file.progress = item.progress;
      file.status = item.status;
      file.uploading = item.uploading;
    }

    /**
     * Updates the virtualizer's size and items.
     */
    requestContentUpdate() {
      if (!this.__virtualizer) {
        return;
      }

      if (this.items) {
        this.__virtualizer.size = this.items.length;
      }

      console.warn('update', this.items);
      this.__virtualizer.update();
    }
  };
