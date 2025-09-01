/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export type ContextMenuPosition =
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
 * A mixin providing context menu position functionality.
 */
export declare function ContextMenuPositionMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ContextMenuPositionMixinClass> & T;

export declare class ContextMenuPositionMixinClass {
  /**
   * Position of the overlay with respect to the target.
   * Supported values: null, `top-start`, `top`, `top-end`,
   * `bottom-start`, `bottom`, `bottom-end`, `start-top`,
   * `start`, `start-bottom`, `end-top`, `end`, `end-bottom`.
   */
  position: ContextMenuPosition;
}
