/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { UploadFileListI18n, UploadFileListMixin } from './vaadin-upload-file-list-mixin.js';

export { UploadFileListI18n };

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
 */
declare class UploadFileList extends UploadFileListMixin(ThemableMixin(HTMLElement)) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-upload-file-list': UploadFileList;
  }
}

export { UploadFileList };
