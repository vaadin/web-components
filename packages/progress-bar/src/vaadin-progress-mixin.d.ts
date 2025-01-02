/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function ProgressMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<ProgressMixinClass> & T;

export declare class ProgressMixinClass {
  /**
   * Current progress value.
   */
  value: number | null | undefined;

  /**
   * Minimum bound of the progress bar.
   */
  min: number;

  /**
   * Maximum bound of the progress bar.
   */
  max: number;

  /**
   * Indeterminate state of the progress bar.
   * This property takes precedence over other state properties (min, max, value).
   */
  indeterminate: boolean;
}
