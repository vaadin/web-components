/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';

export interface UploadFileI18n {
  file: {
    retry: string;
    start: string;
    remove: string;
  };
}

export declare function UploadFileMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<FocusMixinClass> & Constructor<UploadFileMixinClass> & T;

export declare class UploadFileMixinClass {
  /**
   * If true, the user cannot interact with this element.
   */
  disabled: boolean;

  /**
   * True if uploading is completed, false otherwise.
   */
  complete: boolean;

  /**
   * Error message returned by the server, if any.
   */
  errorMessage: string;

  /**
   * The object representing a file.
   */
  file: File;

  /**
   * Name of the uploading file.
   */
  fileName: string;

  /**
   * True if uploading is not started, false otherwise.
   */
  held: boolean;

  /**
   * True if remaining time is unknown, false otherwise.
   */
  indeterminate: boolean;

  /**
   * The object used to localize this component.
   */
  i18n: UploadFileI18n;

  /**
   * Number representing the uploading progress.
   */
  progress: number;

  /**
   * Uploading status.
   */
  status: string;

  /**
   * True if uploading is in progress, false otherwise.
   */
  uploading: boolean;
}
