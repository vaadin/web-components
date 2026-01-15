/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { UploadFile, UploadManager } from './vaadin-upload-manager.js';

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
   * The array of files being processed, or already uploaded.
   */
  items: UploadFile[];

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
   */
  i18n: UploadFileListI18n;

  /**
   * Requests an update for the `vaadin-upload-file` elements.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;
}
