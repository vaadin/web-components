/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { UploadFileMixin } from './vaadin-upload-file-mixin.js';

export type { UploadFileI18n } from './vaadin-upload-file-mixin.js';

/**
 * Fired when the retry button is pressed.
 */
export type UploadFileRetryEvent = CustomEvent<{ file: File }>;

/**
 * Fired when the start button is pressed.
 */
export type UploadFileStartEvent = CustomEvent<{ file: File }>;

/**
 * Fired when the abort button is pressed.
 */
export type UploadFileAbortEvent = CustomEvent<{ file: File }>;

export interface UploadFileCustomEventMap {
  'file-retry': UploadFileRetryEvent;

  'file-start': UploadFileStartEvent;

  'file-abort': UploadFileAbortEvent;
}

export interface UploadFileEventMap extends HTMLElementEventMap, UploadFileCustomEventMap {}

/**
 * `<vaadin-upload-file>` element represents a file in the file list of `<vaadin-upload>`.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name        | Description
 * -----------------|-------------
 * `row`            | File container
 * `info`           | Container for file status icon, file name, status and error messages
 * `done-icon`      | File done status icon
 * `warning-icon`   | File warning status icon
 * `meta`           | Container for file name, status and error messages
 * `name`           | File name
 * `error`          | Error message, shown when error happens
 * `status`         | Status message
 * `commands`       | Container for file command buttons
 * `start-button`   | Start file upload button
 * `retry-button`   | Retry file upload button
 * `remove-button`  | Remove file button
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|-------------
 * `disabled`       | Set when the element is disabled
 * `focus-ring`     | Set when the element is focused using the keyboard.
 * `focused`        | Set when the element is focused.
 * `error`          | An error has happened during uploading.
 * `indeterminate`  | Uploading is in progress, but the progress value is unknown.
 * `uploading`      | Uploading is in progress.
 * `complete`       | Uploading has finished successfully.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class UploadFile extends UploadFileMixin(ThemableMixin(ControllerMixin(HTMLElement))) {
  addEventListener<K extends keyof UploadFileEventMap>(
    type: K,
    listener: (this: UploadFile, ev: UploadFileEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof UploadFileEventMap>(
    type: K,
    listener: (this: UploadFile, ev: UploadFileEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-upload-file': UploadFile;
  }
}

export { UploadFile };
