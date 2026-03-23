/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { UploadManager } from './vaadin-upload-manager.js';

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
    sizeBase?: number;
  };
  formatSize?(bytes: number): string;
  formatTime?(seconds: number, split: number[]): string;
}

/**
 * A mixin providing file list functionality.
 */
export declare function UploadFileListMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<UploadFileListMixinClass> & Constructor<I18nMixinClass<UploadFileListI18n>> & T;

export declare class UploadFileListMixinClass {
  /**
   * If true, the user cannot interact with this element.
   */
  disabled: boolean;

  /**
   * Reference to an UploadManager to link this file list to.
   * When set, the file list automatically:
   * - Syncs files from the manager
   * - Forwards retry/abort/start/remove events back to the manager
   */
  manager: UploadManager | null;

  /**
   * The object used to localize this component.
   * To change the default localization, replace this with an object
   * that provides all properties, or just the individual properties
   * you want to change.
   *
   * The object has the following JSON structure and default values:
   * ```js
   * {
   *   file: {
   *     retry: 'Retry',
   *     start: 'Start',
   *     remove: 'Remove'
   *   },
   *   error: {
   *     tooManyFiles: 'Too Many Files.',
   *     fileIsTooBig: 'File is Too Big.',
   *     incorrectFileType: 'Incorrect File Type.'
   *   },
   *   uploading: {
   *     status: {
   *       connecting: 'Connecting...',
   *       stalled: 'Stalled',
   *       processing: 'Processing File...',
   *       held: 'Queued'
   *     },
   *     remainingTime: {
   *       prefix: 'remaining time: ',
   *       unknown: 'unknown remaining time'
   *     },
   *     error: {
   *       serverUnavailable: 'Upload failed, please try again later',
   *       unexpectedServerError: 'Upload failed due to server error',
   *       forbidden: 'Upload forbidden',
   *       fileTooLarge: 'File is too large'
   *     }
   *   },
   *   units: {
   *     size: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
   *   }
   * }
   * ```
   */
  i18n: UploadFileListI18n;
}
