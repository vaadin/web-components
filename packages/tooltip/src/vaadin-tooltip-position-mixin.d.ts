/**
 * @license
 * Copyright (c) 2022 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export type TooltipPosition =
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'end-bottom'
  | 'end-top'
  | 'end'
  | 'start-bottom'
  | 'start-top'
  | 'start'
  | 'top-end'
  | 'top-start'
  | 'top';

/**
 * A mixin providing tooltip position functionality.
 */
export declare function TooltipPositionMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<TooltipPositionMixinClass> & T;

export declare class TooltipPositionMixinClass {
  /**
   * Position of the overlay with respect to the target.
   * Supported values: `top-start`, `top`, `top-end`,
   * `bottom-start`, `bottom`, `bottom-end`, `start-top`,
   * `start`, `start-bottom`, `end-top`, `end`, `end-bottom`.
   */
  position: TooltipPosition;
}
