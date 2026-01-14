/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-upload-file.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { uploadFileListStyles } from './styles/vaadin-upload-file-list-base-styles.js';
import { UploadFileListMixin } from './vaadin-upload-file-list-mixin.js';

/**
 * `<vaadin-upload-file-list>` is a Web Component that displays a list of uploaded files.
 * It can be linked to an UploadManager to automatically sync files and forward events.
 *
 * ```javascript
 * const fileList = document.querySelector('vaadin-upload-file-list');
 * fileList.manager = uploadManager;
 *
 * // The file list automatically:
 * // - Syncs files from the manager
 * // - Forwards retry/abort/start/remove events back to the manager
 * ```
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes UploadFileListMixin
 */
class UploadFileList extends UploadFileListMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-upload-file-list';
  }

  static get styles() {
    return uploadFileListStyles;
  }

  /** @protected */
  render() {
    return html`
      <ul part="list">
        <slot></slot>
      </ul>
    `;
  }
}

defineCustomElement(UploadFileList);

export { UploadFileList };
