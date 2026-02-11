/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
export type UploadMethod = 'POST' | 'PUT';

export type UploadFormat = 'raw' | 'multipart';

export type FileRejectError = 'tooManyFiles' | 'fileIsTooBig' | 'incorrectFileType';

export type UploadErrorKey =
  | 'timeout'
  | 'serverUnavailable'
  | 'unexpectedServerError'
  | 'forbidden'
  | 'sendFailed'
  | 'fileTooLarge';

export interface UploadFile extends File {
  uploadTarget: string;
  elapsed: number;
  remaining: number;
  progress: number;
  speed: number;
  total: number;
  loaded: number;
  status: string;
  errorKey: UploadErrorKey;
  abort?: boolean;
  complete?: boolean;
  held?: boolean;
  uploading?: boolean;
  indeterminate?: boolean;
  stalled?: boolean;
  formDataName?: string;
  xhr?: XMLHttpRequest;
}

export interface UploadManagerOptions {
  /**
   * The server URL. The default value is an empty string, which means that
   * _window.location_ will be used.
   * @default ''
   */
  target?: string;

  /**
   * HTTP Method used to send the files. Only POST and PUT are allowed.
   * @default 'POST'
   */
  method?: UploadMethod;

  /**
   * Key-Value map to send to the server. If you set this property as an
   * attribute, use a valid JSON string, for example:
   * ```html
   * <vaadin-upload headers='{"X-Foo": "Bar"}'></vaadin-upload>
   * ```
   * @default {}
   */
  headers?: Record<string, string>;

  /**
   * Max time in milliseconds for the entire upload process, if exceeded the
   * request will be aborted. Zero means that there is no timeout.
   * @default 0
   */
  timeout?: number;

  /**
   * Limit of files to upload, by default it is unlimited. If the value is
   * set to one, native file browser will prevent selecting multiple files.
   * @default Infinity
   */
  maxFiles?: number;

  /**
   * Specifies the maximum file size in bytes allowed to upload.
   * Notice that it is a client-side constraint, which will be checked before
   * sending the request. Obviously you need to do the same validation in
   * the server-side and be sure that they are aligned.
   * @default Infinity
   */
  maxFileSize?: number;

  /**
   * Specifies the types of files that the server accepts.
   * Syntax: a comma-separated list of MIME type patterns (wildcards are
   * allowed) or file extensions.
   * Notice that MIME types are widely supported, while file extensions
   * are only implemented in certain browsers, so avoid using it.
   * Example: accept="video/*,image/tiff" or accept=".pdf,audio/mp3"
   * @default ''
   */
  accept?: string;

  /**
   * Prevents upload(s) from immediately uploading upon adding file(s).
   * When set, you must manually trigger uploads using the `uploadFiles` method.
   * @default false
   */
  noAuto?: boolean;

  /**
   * Set the withCredentials flag on the request.
   * @default false
   */
  withCredentials?: boolean;

  /**
   * Specifies the upload format to use when sending files to the server.
   * - 'raw': Send file as raw binary data with the file's MIME type as Content-Type (default)
   * - 'multipart': Send file using multipart/form-data encoding
   * @default 'raw'
   */
  uploadFormat?: UploadFormat;

  /**
   * Specifies the maximum number of files that can be uploaded simultaneously.
   * This helps prevent browser performance degradation and XHR limitations when
   * uploading large numbers of files. Files exceeding this limit will be queued
   * and uploaded as active uploads complete.
   * @default 3
   */
  maxConcurrentUploads?: number;

  /**
   * Specifies the 'name' property at Content-Disposition for multipart uploads.
   * This property is ignored when uploadFormat is 'raw'.
   * @default 'file'
   */
  formDataName?: string;
}

export interface UploadManagerEventMap {
  'file-reject': CustomEvent<{ file: File; error: FileRejectError }>;
  'file-remove': CustomEvent<{ file: UploadFile; fileIndex: number }>;
  'upload-before': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'upload-request': CustomEvent<{
    file: UploadFile;
    xhr: XMLHttpRequest;
    uploadFormat: UploadFormat;
    requestBody: UploadFile | FormData;
    formData?: FormData;
  }>;
  'upload-start': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'upload-progress': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'upload-response': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'upload-success': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'upload-error': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'upload-retry': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'upload-abort': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'files-changed': CustomEvent<{ value: UploadFile[] }>;
  'max-files-reached-changed': CustomEvent<{ value: boolean }>;
}

/**
 * A pure JavaScript class that manages file upload state and XHR requests.
 * It has no knowledge of UI components - components should listen to events
 * and call methods to interact with the manager.
 *
 * @example
 * ```javascript
 * import { UploadManager } from '@vaadin/upload';
 *
 * const manager = new UploadManager({
 *   target: '/api/upload',
 *   maxFiles: 5
 * });
 *
 * // Listen to state changes
 * manager.addEventListener('files-changed', (e) => {
 *   myFileList.items = e.detail.value;
 * });
 *
 * manager.addEventListener('upload-success', (e) => {
 *   console.log('File uploaded:', e.detail.file.name);
 * });
 *
 * // Add files (e.g., from a file input or drop event)
 * fileInput.addEventListener('change', (e) => {
 *   manager.addFiles(e.target.files);
 * });
 * ```
 */
export class UploadManager extends EventTarget {
  /**
   * Create an UploadManager instance.
   */
  constructor(options?: UploadManagerOptions);

  /**
   * The server URL. The default value is an empty string, which means that
   * _window.location_ will be used.
   */
  target: string;

  /**
   * HTTP Method used to send the files. Only POST and PUT are allowed.
   */
  method: UploadMethod;

  /**
   * Key-Value map to send to the server. If you set this property as an
   * attribute, use a valid JSON string, for example:
   * ```html
   * <vaadin-upload headers='{"X-Foo": "Bar"}'></vaadin-upload>
   * ```
   */
  headers: Record<string, string>;

  /**
   * Max time in milliseconds for the entire upload process, if exceeded the
   * request will be aborted. Zero means that there is no timeout.
   */
  timeout: number;

  /**
   * Limit of files to upload, by default it is unlimited. If the value is
   * set to one, native file browser will prevent selecting multiple files.
   */
  maxFiles: number;

  /**
   * Specifies the maximum file size in bytes allowed to upload.
   * Notice that it is a client-side constraint, which will be checked before
   * sending the request. Obviously you need to do the same validation in
   * the server-side and be sure that they are aligned.
   */
  maxFileSize: number;

  /**
   * Specifies the types of files that the server accepts.
   * Syntax: a comma-separated list of MIME type patterns (wildcards are
   * allowed) or file extensions.
   * Notice that MIME types are widely supported, while file extensions
   * are only implemented in certain browsers, so avoid using it.
   * Example: accept="video/*,image/tiff" or accept=".pdf,audio/mp3"
   */
  accept: string;

  /**
   * Prevents upload(s) from immediately uploading upon adding file(s).
   * When set, you must manually trigger uploads using the `uploadFiles` method.
   */
  noAuto: boolean;

  /**
   * Set the withCredentials flag on the request.
   */
  withCredentials: boolean;

  /**
   * Specifies the upload format to use when sending files to the server.
   * - 'raw': Send file as raw binary data with the file's MIME type as Content-Type (default)
   * - 'multipart': Send file using multipart/form-data encoding
   */
  uploadFormat: UploadFormat;

  /**
   * Specifies the maximum number of files that can be uploaded simultaneously.
   * This helps prevent browser performance degradation and XHR limitations when
   * uploading large numbers of files. Files exceeding this limit will be queued
   * and uploaded as active uploads complete.
   */
  maxConcurrentUploads: number;

  /**
   * Specifies the 'name' property at Content-Disposition for multipart uploads.
   * This property is ignored when uploadFormat is 'raw'.
   */
  formDataName: string;

  /**
   * The array of files being processed, or already uploaded.
   *
   * Each element is a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)
   * object with a number of extra properties to track the upload process:
   * - `uploadTarget`: The target URL used to upload this file.
   * - `elapsed`: Elapsed time since the upload started.
   * - `remaining`: Number of seconds remaining for the upload to finish.
   * - `progress`: Percentage of the file already uploaded.
   * - `speed`: Upload speed in kB/s.
   * - `size`: File size in bytes.
   * - `total`: The total size of the data being transmitted or processed
   * - `loaded`: Bytes transferred so far.
   * - `status`: Status of the upload process.
   * - `errorKey`: Error key in case the upload failed.
   * - `abort`: True if the file was canceled by the user.
   * - `complete`: True when the file was transferred to the server.
   * - `uploading`: True while transferring data to the server.
   */
  files: UploadFile[];

  /**
   * Specifies if the maximum number of files have been uploaded.
   */
  readonly maxFilesReached: boolean;

  /**
   * Add files to the upload list.
   */
  addFiles(files: FileList | File[]): void;

  /**
   * Triggers the upload of any files that are not completed.
   *
   * @param files Files being uploaded. Defaults to all outstanding files.
   */
  uploadFiles(files?: UploadFile | UploadFile[]): void;

  /**
   * Retry a failed upload.
   */
  retryUpload(file: UploadFile): void;

  /**
   * Abort an upload.
   */
  abortUpload(file: UploadFile): void;

  /**
   * Remove a file from the list.
   */
  removeFile(file: UploadFile): void;

  addEventListener<K extends keyof UploadManagerEventMap>(
    type: K,
    listener: (this: UploadManager, ev: UploadManagerEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof UploadManagerEventMap>(
    type: K,
    listener: (this: UploadManager, ev: UploadManagerEventMap[K]) => void,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}
