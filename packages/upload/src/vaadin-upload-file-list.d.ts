/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { UploadFile } from './vaadin-upload-mixin.js';

export interface UploadFileListI18n {
  file?: {
    retry?: string;
    start?: string;
    remove?: string;
  };
  error?: {
    tooManyFiles?: string;
    fileIsTooBig?: string;
    incorrectFileType?: string;
  };
  uploading?: {
    status?: {
      connecting?: string;
      stalled?: string;
      processing?: string;
      held?: string;
    };
    remainingTime?: {
      prefix?: string;
      unknown?: string;
    };
    error?: {
      serverUnavailable?: string;
      unexpectedServerError?: string;
      forbidden?: string;
    };
  };
  units?: {
    size?: string[];
  };
}

export interface UploadFileListTarget {
  files: UploadFile[];
  retryUpload?(file: UploadFile): void;
  abortUpload?(file: UploadFile): void;
  uploadFiles?(files?: UploadFile | UploadFile[]): void;
  removeFile?(file: UploadFile): void;
}

/**
 * `<vaadin-upload-file-list>` is a Web Component that displays a list of uploaded files.
 * It can be linked to an UploadManager to automatically sync files and forward events.
 *
 * ```javascript
 * const fileList = document.querySelector('vaadin-upload-file-list');
 * fileList.target = manager;
 *
 * // The file list automatically:
 * // - Syncs files from the manager
 * // - Forwards retry/abort/start/remove events back to the manager
 * ```
 */
declare class UploadFileList extends ThemableMixin(HTMLElement) {
  /**
   * The array of files being processed, or already uploaded.
   */
  items: UploadFile[];

  /**
   * The object used to localize upload files.
   */
  i18n: UploadFileListI18n;

  /**
   * If true, the user cannot interact with this element.
   */
  disabled: boolean;

  /**
   * Reference to an UploadManager (or compatible target) to link this file list to.
   * When set, the file list automatically:
   * - Syncs files from the target
   * - Forwards retry/abort/start/remove events back to the target
   */
  target: UploadFileListTarget | null;

  /**
   * Requests an update for the `vaadin-upload-file` elements.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-upload-file-list': UploadFileList;
  }
}

export { UploadFileList };
