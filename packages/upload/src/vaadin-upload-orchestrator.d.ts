/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { UploadFile, UploadFormat, UploadI18n, UploadMethod } from './vaadin-upload-mixin.js';

export { UploadFile, UploadFormat, UploadI18n, UploadMethod };

export interface UploadOrchestratorOptions {
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
   * Form data field name for multipart uploads.
   * @default 'file'
   */
  formDataName?: string;

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
   * Disable drag-and-drop.
   * @default false
   */
  nodrop?: boolean;

  /**
   * Pass-through to input's capture attribute.
   */
  capture?: string;

  /**
   * External file list element.
   */
  fileList?: HTMLElement | null;

  /**
   * External add button element.
   */
  addButton?: HTMLElement | null;

  /**
   * External drop zone element.
   */
  dropZone?: HTMLElement | null;

  /**
   * Localization object.
   */
  i18n?: UploadI18n;
}

export interface UploadOrchestratorEventMap {
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
 * A pure JavaScript class that orchestrates file uploads without requiring
 * a DOM element. It can manage external UI components like file lists,
 * add buttons, and drop zones.
 *
 * @example
 * ```javascript
 * import { UploadOrchestrator } from '@vaadin/upload';
 *
 * const orchestrator = new UploadOrchestrator({
 *   target: '/api/upload',
 *   maxFiles: 5,
 *   fileList: document.getElementById('file-list'),
 *   addButton: document.getElementById('add-button'),
 *   dropZone: document.getElementById('drop-zone')
 * });
 *
 * // Listen to events
 * orchestrator.addEventListener('upload-success', (e) => {
 *   console.log('File uploaded:', e.detail.file.name);
 * });
 *
 * // Clean up when done
 * orchestrator.destroy();
 * ```
 */
export class UploadOrchestrator extends EventTarget {
  /**
   * Create an UploadOrchestrator instance.
   */
  constructor(options?: UploadOrchestratorOptions);

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
   * Form data field name for multipart uploads.
   */
  formDataName: string;

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
   * Disable drag-and-drop.
   */
  nodrop: boolean;

  /**
   * Pass-through to input's capture attribute.
   */
  capture: string | undefined;

  /**
   * The array of files being processed or already uploaded.
   */
  files: UploadFile[];

  /**
   * Whether the maximum number of files has been reached.
   */
  readonly maxFilesReached: boolean;

  /**
   * The localization object.
   */
  i18n: UploadI18n;

  /**
   * The external file list element.
   */
  fileList: HTMLElement | null;

  /**
   * The external add button element.
   */
  addButton: HTMLElement | null;

  /**
   * The external drop zone element.
   */
  dropZone: HTMLElement | null;

  /**
   * Clean up resources and remove all event listeners.
   * Call this when the orchestrator is no longer needed.
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

  /**
   * Open the file picker dialog.
   */
  openFilePicker(): void;

  addEventListener<K extends keyof UploadOrchestratorEventMap>(
    type: K,
    listener: (this: UploadOrchestrator, ev: UploadOrchestratorEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof UploadOrchestratorEventMap>(
    type: K,
    listener: (this: UploadOrchestrator, ev: UploadOrchestratorEventMap[K]) => void,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}
