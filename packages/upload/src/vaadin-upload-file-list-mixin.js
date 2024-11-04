/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, render } from 'lit';

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

    static get observers() {
      return ['__updateItems(items, i18n, disabled)'];
    }

    /** @private */
    __updateItems(items, i18n) {
      if (items && i18n) {
        this.requestContentUpdate();
      }
    }

    /**
     * Requests an update for the `vaadin-upload-file` elements.
     *
     * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
     */
    requestContentUpdate() {
      const { items, i18n, disabled } = this;

      render(
        html`
          ${items.map(
            (file) => html`
              <li>
                <vaadin-upload-file
                  .disabled="${disabled}"
                  .file="${file}"
                  .complete="${file.complete}"
                  .errorMessage="${file.error}"
                  .fileName="${file.name}"
                  .held="${file.held}"
                  .indeterminate="${file.indeterminate}"
                  .progress="${file.progress}"
                  .status="${file.status}"
                  .uploading="${file.uploading}"
                  .i18n="${i18n}"
                ></vaadin-upload-file>
              </li>
            `,
          )}
        `,
        this,
      );
    }
  };
