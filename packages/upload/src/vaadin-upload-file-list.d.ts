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
 * It automatically syncs files from the manager and forwards file events back to it.
 *
 * ```html
 * <vaadin-upload-file-list></vaadin-upload-file-list>
 * ```
 *
 * The file list must be linked to an UploadManager by setting the `manager` property:
 *
 * ```javascript
 * import { UploadManager } from '@vaadin/upload/vaadin-upload-manager.js';
 *
 * const manager = new UploadManager({ target: '/api/upload' });
 * const fileList = document.querySelector('vaadin-upload-file-list');
 * fileList.manager = manager;
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `list`    | The `<ul>` element wrapping the file items
 *
 * The following state attributes are available for styling:
 *
 * Attribute  | Description
 * -----------|-------------
 * `disabled` | Set when the element is disabled
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                          |
 * :--------------------------------------------|
 * `--vaadin-upload-file-list-divider-color`    |
 * `--vaadin-upload-file-list-divider-width`    |
 * `--vaadin-upload-file-border-radius`         |
 * `--vaadin-upload-file-button-background`     |
 * `--vaadin-upload-file-button-border-color`   |
 * `--vaadin-upload-file-button-border-radius`  |
 * `--vaadin-upload-file-button-border-width`   |
 * `--vaadin-upload-file-button-text-color`     |
 * `--vaadin-upload-file-button-padding`        |
 * `--vaadin-upload-file-done-color`            |
 * `--vaadin-upload-file-error-color`           |
 * `--vaadin-upload-file-error-font-size`       |
 * `--vaadin-upload-file-error-font-weight`     |
 * `--vaadin-upload-file-error-line-height`     |
 * `--vaadin-upload-file-gap`                   |
 * `--vaadin-upload-file-name-color`            |
 * `--vaadin-upload-file-name-font-size`        |
 * `--vaadin-upload-file-name-font-weight`      |
 * `--vaadin-upload-file-name-line-height`      |
 * `--vaadin-upload-file-padding`               |
 * `--vaadin-upload-file-status-color`          |
 * `--vaadin-upload-file-status-font-size`      |
 * `--vaadin-upload-file-status-font-weight`    |
 * `--vaadin-upload-file-status-line-height`    |
 * `--vaadin-upload-file-warning-color`         |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class UploadFileList extends UploadFileListMixin(ThemableMixin(HTMLElement)) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-upload-file-list': UploadFileList;
  }
}

export { UploadFileList };
