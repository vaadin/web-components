/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { UploadFile } from './vaadin-upload-mixin.js';

export interface UploadFileListBoxI18n {
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

/**
 * `<vaadin-upload-file-list-box>` is a Web Component that displays a list of
 * uploaded files. It can be linked to an UploadManager to automatically
 * sync files and forward events.
 *
 * ```javascript
 * const listBox = document.querySelector('vaadin-upload-file-list-box');
 * listBox.target = manager;
 *
 * // The list box automatically:
 * // - Syncs files from the manager
 * // - Forwards retry/abort/start events back to the manager
 * ```
 */
declare class UploadFileListBox extends ThemableMixin(HTMLElement) {
  /**
   * Reference to an UploadManager to link this file list to.
   */
  target: {
    files: UploadFile[];
    retryUpload?(file: UploadFile): void;
    abortUpload?(file: UploadFile): void;
    uploadFiles?(files?: UploadFile | UploadFile[]): void;
    removeFile?(file: UploadFile): void;
  } | null;

  /**
   * The i18n object for localization.
   */
  i18n: UploadFileListBoxI18n;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-upload-file-list-box': UploadFileListBox;
  }
}

export { UploadFileListBox };
