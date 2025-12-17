/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { type UploadFile, type UploadFormat, UploadMixin } from './vaadin-upload-mixin.js';

export { UploadFile, UploadFormat, UploadI18n, UploadMethod } from './vaadin-upload-mixin.js';

type UploadEvent<T> = CustomEvent<T> & { target: Upload };

/**
 * Fired when a file cannot be added to the queue due to a constrain:
 * file-size, file-type or maxFiles
 */
export type UploadFileRejectEvent = UploadEvent<{ file: UploadFile; error: string }>;

/**
 * Fired when the `files` property changes.
 */
export type UploadFilesChangedEvent = UploadEvent<{ value: UploadFile[] }>;

/**
 * Fired when the `max-files-reached` property changes.
 */
export type UploadMaxFilesReachedChangedEvent = UploadEvent<{ value: boolean }>;

/**
 * Fired before the XHR is opened. Could be used for changing the request
 * URL. If the default is prevented, then XHR would not be opened.
 */
export type UploadBeforeEvent = UploadEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired when the XHR is sent.
 */
export type UploadStartEvent = UploadEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired as many times as the progress is updated.
 */
export type UploadProgressEvent = UploadEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired in case the upload process succeeded.
 */
export type UploadSuccessEvent = UploadEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired in case the upload process failed.
 */
export type UploadErrorEvent = UploadEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired when we have the actual server response, and before the component
 * analyses it. It's useful for developers to make the upload fail depending
 * on the server response. If the event is defaultPrevented the vaadin-upload
 * will return allowing the user to do something on his own like retry the
 * upload, etc. since he has full access to the `xhr` and `file` objects.
 * Otherwise, if the event is not prevented default `vaadin-upload` continues
 * with the normal workflow checking the `xhr.status` and `file.error`
 * which also might be modified by the user to force a customized response,
 */
export type UploadResponseEvent = UploadEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired when retry upload is requested. If the default is prevented, then
 * retry would not be performed.
 */
export type UploadRetryEvent = UploadEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired when upload abort is requested. If the default is prevented, then the
 * file upload would not be aborted.
 */
export type UploadAbortEvent = UploadEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired when the XHR has been opened but not sent yet. Useful for appending
 * data keys to the FormData object, for changing some parameters like
 * headers, etc. If the event is defaultPrevented, `vaadin-upload` will not
 * send the request allowing the user to do something on his own.
 */
export type UploadRequestEvent = UploadEvent<{
  xhr: XMLHttpRequest;
  file: UploadFile;
  uploadFormat: UploadFormat;
  requestBody: FormData | File;
  formData?: FormData;
}>;

export interface UploadCustomEventMap {
  'file-reject': UploadFileRejectEvent;

  'files-changed': UploadFilesChangedEvent;

  'max-files-reached-changed': UploadMaxFilesReachedChangedEvent;

  'upload-before': UploadBeforeEvent;

  'upload-start': UploadStartEvent;

  'upload-progress': UploadProgressEvent;

  'upload-response': UploadResponseEvent;

  'upload-success': UploadSuccessEvent;

  'upload-error': UploadErrorEvent;

  'upload-retry': UploadRetryEvent;

  'upload-abort': UploadAbortEvent;

  'upload-request': UploadRequestEvent;
}

export interface UploadEventMap extends HTMLElementEventMap, UploadCustomEventMap {}

/**
 * `<vaadin-upload>` is a Web Component for uploading multiple files with drag and drop support.
 *
 * Example:
 *
 * ```html
 * <vaadin-upload></vaadin-upload>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name          | Description
 * -------------------|-------------------------------------
 * `primary-buttons`  | Upload container
 * `drop-label`       | Element wrapping drop label and icon
 *
 * The following state attributes are available for styling:
 *
 * Attribute            | Description
 * ---------------------|---------------------------------
 * `disabled`           | Set when the element is disabled
 * `nodrop`             | Set when drag and drop is disabled (e.g., on touch devices)
 * `dragover`           | Set when the file is being dragged over the element
 * `dragover-valid`     | Set when the dragged file is valid with `maxFiles` and `accept` criteria
 * `max-files-reached`  | Set when maximum number of files that the user is allowed to add has been reached
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                          |
 * :--------------------------------------------|
 * `--vaadin-upload-background`                 |
 * `--vaadin-upload-border-color`               |
 * `--vaadin-upload-border-radius`              |
 * `--vaadin-upload-border-width`               |
 * `--vaadin-upload-gap`                        |
 * `--vaadin-upload-padding`                    |
 * `--vaadin-upload-drop-label-color`           |
 * `--vaadin-upload-drop-label-font-size`       |
 * `--vaadin-upload-drop-label-font-weight`     |
 * `--vaadin-upload-drop-label-gap`             |
 * `--vaadin-upload-drop-label-line-height`     |
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
 *
 * @fires {CustomEvent} file-reject - Fired when a file cannot be added to the queue due to a constrain.
 * @fires {CustomEvent} files-changed - Fired when the `files` property changes.
 * @fires {CustomEvent} max-files-reached-changed - Fired when the `maxFilesReached` property changes.
 * @fires {CustomEvent} upload-before - Fired before the XHR is opened.
 * @fires {CustomEvent} upload-start - Fired when the XHR is sent.
 * @fires {CustomEvent} upload-progress - Fired as many times as the progress is updated.
 * @fires {CustomEvent} upload-success - Fired in case the upload process succeeded.
 * @fires {CustomEvent} upload-error - Fired in case the upload process failed.
 * @fires {CustomEvent} upload-request - Fired when the XHR has been opened but not sent yet.
 * @fires {CustomEvent} upload-response - Fired when on the server response before analyzing it.
 * @fires {CustomEvent} upload-retry - Fired when retry upload is requested.
 * @fires {CustomEvent} upload-abort - Fired when upload abort is requested.
 */
declare class Upload extends UploadMixin(ThemableMixin(ElementMixin(HTMLElement))) {
  addEventListener<K extends keyof UploadEventMap>(
    type: K,
    listener: (this: Upload, ev: UploadEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof UploadEventMap>(
    type: K,
    listener: (this: Upload, ev: UploadEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-upload': Upload;
  }
}

export { Upload };
