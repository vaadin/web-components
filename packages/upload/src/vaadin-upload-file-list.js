/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-upload-file.js';
import { html as legacyHtml, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html, render } from 'lit';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-upload>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes FocusMixin
 * @private
 */
class UploadFileList extends ThemableMixin(PolymerElement) {
  static get is() {
    return 'vaadin-upload-file-list';
  }

  static get template() {
    return legacyHtml`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='list'] {
          padding: 0;
          margin: 0;
          list-style-type: none;
        }
      </style>
      <ul part="list">
        <slot></slot>
      </ul>
    `;
  }

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
    };
  }

  static get observers() {
    return ['__updateItems(items, i18n)'];
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
    const { items, i18n } = this;

    render(
      html`
        ${items.map(
          (file) => html`
            <li>
              <vaadin-upload-file
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
}

customElements.define(UploadFileList.is, UploadFileList);

export { UploadFileList };
