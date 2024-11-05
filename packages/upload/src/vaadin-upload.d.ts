/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { type UploadFile, UploadMixin } from './vaadin-upload-mixin.js';

export { UploadFile, UploadI18n, UploadMethod } from './vaadin-upload-mixin.js';

/**
 * Fired when a file cannot be added to the queue due to a constrain:
 * file-size, file-type or maxFiles
 */
export type UploadFileRejectEvent = CustomEvent<{ file: UploadFile; error: string }>;

/**
 * Fired when the `files` property changes.
 */
export type UploadFilesChangedEvent = CustomEvent<{ value: UploadFile[] }>;

/**
 * Fired when the `max-files-reached` property changes.
 */
export type UploadMaxFilesReachedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired before the XHR is opened. Could be used for changing the request
 * URL. If the default is prevented, then XHR would not be opened.
 */
export type UploadBeforeEvent = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired when the XHR is sent.
 */
export type UploadStartEvent = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired as many times as the progress is updated.
 */
export type UploadProgressEvent = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired in case the upload process succeeded.
 */
export type UploadSuccessEvent = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired in case the upload process failed.
 */
export type UploadErrorEvent = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

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
export type UploadResponseEvent = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired when retry upload is requested. If the default is prevented, then
 * retry would not be performed.
 */
export type UploadRetryEvent = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired when upload abort is requested. If the default is prevented, then the
 * file upload would not be aborted.
 */
export type UploadAbortEvent = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired when the XHR has been opened but not sent yet. Useful for appending
 * data keys to the FormData object, for changing some parameters like
 * headers, etc. If the event is defaultPrevented, `vaadin-upload` will not
 * send the request allowing the user to do something on his own.
 */
export type UploadRequestEvent = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile; formData: FormData }>;

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
 * ```
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
 * Attribute | Description | Part name
 * ---|---|---
 * `disabled` | Set when the element is disabled | `:host`
 * `nodrop` | Set when drag and drop is disabled (e. g., on touch devices) | `:host`
 * `dragover` | A file is being dragged over the element | `:host`
 * `dragover-valid` | A dragged file is valid with `maxFiles` and `accept` criteria | `:host`
 * `max-files-reached` | The maximum number of files that the user is allowed to add to the upload has been reached | `:host`
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
declare class Upload extends UploadMixin(ThemableMixin(ElementMixin(ControllerMixin(HTMLElement)))) {
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
