/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';

/**
 * Fired when the `value` property changes.
 */
export type GridFilterValueChangedEvent = CustomEvent<{ value: string }>;

export interface GridFilterCustomEventMap {
  'value-changed': GridFilterValueChangedEvent;
}

export interface GridFilterEventMap extends HTMLElementEventMap, GridFilterCustomEventMap {}

export declare function GridFilterElementMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ControllerMixinClass> & Constructor<GridFilterElementMixinClass> & T;

declare class GridFilterElementMixinClass {
  /**
   * JS Path of the property in the item used for filtering the data.
   */
  path: string | null | undefined;

  /**
   * Current filter value.
   */
  value: string | null | undefined;
}
