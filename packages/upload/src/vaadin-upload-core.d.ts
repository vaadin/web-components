/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { UploadFile, UploadFormat, UploadI18n, UploadMethod } from './vaadin-upload-mixin.js';

export { UploadFile, UploadFormat, UploadI18n, UploadMethod };

/**
 * Default i18n strings for upload.
 */
export const DEFAULT_UPLOAD_I18N: UploadI18n;

export interface UploadCoreEventMap {
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
}

/**
 * Core upload logic shared between UploadOrchestrator and UploadMixin.
 * This class handles all upload operations including file validation,
 * XHR management, queue processing, and progress tracking.
 */
export class UploadCore extends EventTarget {
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
   * Get files from a drop event. Handles directories recursively.
   * @protected
   */
  protected _getFilesFromDropEvent(dropEvent: DragEvent): Promise<File[]>;

  /**
   * Create XHR instance. Override to customize.
   * @protected
   */
  protected _createXhr(): XMLHttpRequest;

  /**
   * Called when files array changes.
   * @protected
   */
  protected _onFilesChanged(files: UploadFile[], oldFiles: UploadFile[]): void;

  /**
   * Called when i18n changes.
   * @protected
   */
  protected _onI18nChanged(): void;

  /**
   * Called when maxFilesReached changes.
   * @protected
   */
  protected _onMaxFilesReachedChanged(reached: boolean): void;

  /**
   * Called when file list needs to be re-rendered.
   * @protected
   */
  protected _renderFileList(): void;

  /**
   * Called when a file is rejected.
   * @protected
   */
  protected _onFileRejected(file: File, error: string): void;

  /**
   * Called when upload starts.
   * @protected
   */
  protected _onUploadStarted(file: UploadFile): void;

  /**
   * Called when upload succeeds.
   * @protected
   */
  protected _onUploadSucceeded(file: UploadFile): void;

  /**
   * Called when upload fails.
   * @protected
   */
  protected _onUploadFailed(file: UploadFile): void;

  /**
   * Called after a file is removed to update focus.
   * @protected
   */
  protected _onFileRemoved(fileIndex: number): void;

  addEventListener<K extends keyof UploadCoreEventMap>(
    type: K,
    listener: (this: UploadCore, ev: UploadCoreEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof UploadCoreEventMap>(
    type: K,
    listener: (this: UploadCore, ev: UploadCoreEventMap[K]) => void,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}
