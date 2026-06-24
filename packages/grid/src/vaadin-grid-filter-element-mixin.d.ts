/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

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
): Constructor<GridFilterElementMixinClass> & T;

declare class GridFilterElementMixinClass {
  /**
   * Accessible name (aria-label) for the filter. When set, it is forwarded to
   * the slotted text field's `accessibleName` (the focusable input), overriding
   * the label derived from the grid's `i18n.filterColumn`.
   *
   * @attr {string} accessible-name
   */
  accessibleName: string | null | undefined;

  /**
   * JS Path of the property in the item used for filtering the data.
   */
  path: string | null | undefined;

  /**
   * Current filter value.
   */
  value: string | null | undefined;
}
