/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
