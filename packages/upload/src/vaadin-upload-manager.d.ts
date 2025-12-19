/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { UploadFile, UploadFormat, UploadMethod } from './vaadin-upload-mixin.js';

export { UploadFile, UploadFormat, UploadMethod };

export interface UploadManagerOptions {
  /**
   * Server URL for uploads.
   * @default ''
   */
  target?: string;

  /**
   * HTTP method (POST or PUT).
   * @default 'POST'
   */
  method?: UploadMethod;

  /**
   * Custom HTTP headers.
   * @default {}
   */
  headers?: Record<string, string>;

  /**
   * Upload timeout in milliseconds (0 = no timeout).
   * @default 0
   */
  timeout?: number;

  /**
   * Maximum number of files allowed.
   * @default Infinity
   */
  maxFiles?: number;

  /**
   * Maximum file size in bytes.
   * @default Infinity
   */
  maxFileSize?: number;

  /**
   * Accepted file types (MIME types or extensions).
   * @default ''
   */
  accept?: string;

  /**
   * Prevent automatic upload on file addition.
   * @default false
   */
  noAuto?: boolean;

  /**
   * Include credentials in XHR.
   * @default false
   */
  withCredentials?: boolean;

  /**
   * Upload format: 'raw' or 'multipart'.
   * @default 'raw'
   */
  uploadFormat?: UploadFormat;

  /**
   * Maximum concurrent uploads.
   * @default 3
   */
  maxConcurrentUploads?: number;

  /**
   * Form field name for multipart uploads.
   * @default 'file'
   */
  formDataName?: string;
}

export interface UploadManagerEventMap {
  'file-reject': CustomEvent<{ file: File; error: string }>;
  'file-remove': CustomEvent<{ file: UploadFile }>;
  'upload-before': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'upload-request': CustomEvent<{
    file: UploadFile;
    xhr: XMLHttpRequest;
    uploadFormat: UploadFormat;
    requestBody: File | FormData;
    formData?: FormData;
  }>;
  'upload-start': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'upload-progress': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'upload-response': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'upload-success': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'upload-error': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'upload-retry': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'upload-abort': CustomEvent<{ file: UploadFile; xhr: XMLHttpRequest }>;
  'files-changed': CustomEvent<{ value: UploadFile[]; oldValue: UploadFile[] }>;
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
 *
 * // Clean up when done
 * manager.destroy();
 * ```
 */
export class UploadManager extends EventTarget {
  /**
   * Create an UploadManager instance.
   */
  constructor(options?: UploadManagerOptions);

  /**
   * Server URL for uploads.
   */
  target: string;

  /**
   * HTTP method (POST or PUT).
   */
  method: UploadMethod;

  /**
   * Custom HTTP headers.
   */
  headers: Record<string, string>;

  /**
   * Upload timeout in milliseconds (0 = no timeout).
   */
  timeout: number;

  /**
   * Maximum number of files allowed.
   */
  maxFiles: number;

  /**
   * Maximum file size in bytes.
   */
  maxFileSize: number;

  /**
   * Accepted file types (MIME types or extensions).
   */
  accept: string;

  /**
   * Prevent automatic upload on file addition.
   */
  noAuto: boolean;

  /**
   * Include credentials in XHR.
   */
  withCredentials: boolean;

  /**
   * Upload format: 'raw' or 'multipart'.
   */
  uploadFormat: UploadFormat;

  /**
   * Maximum concurrent uploads.
   */
  maxConcurrentUploads: number;

  /**
   * Form field name for multipart uploads.
   */
  formDataName: string;

  /**
   * The array of files being processed or already uploaded.
   */
  files: UploadFile[];

  /**
   * Whether the maximum number of files has been reached.
   */
  readonly maxFilesReached: boolean;

  /**
   * Clean up resources and abort active uploads.
   * Call this when the manager is no longer needed.
   */
  destroy(): void;

  /**
   * Add files to the upload list.
   */
  addFiles(files: FileList | File[]): void;

  /**
   * Triggers the upload of any files that are not completed.
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
