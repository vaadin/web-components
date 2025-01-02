/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function PositionMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<PositionMixinClass> & T;

export declare class PositionMixinClass {
  /**
   * The element next to which this overlay should be aligned.
   * The position of the overlay relative to the positionTarget can be adjusted
   * with properties `horizontalAlign`, `verticalAlign`, `noHorizontalOverlap`
   * and `noVerticalOverlap`.
   */
  positionTarget: HTMLElement;

  /**
   * When `positionTarget` is set, this property defines whether to align the overlay's
   * left or right side to the target element by default.
   * Possible values are `start` and `end`.
   * RTL is taken into account when interpreting the value.
   * The overlay is automatically flipped to the opposite side when it doesn't fit into
   * the default side defined by this property.
   *
   * @attr {start|end} horizontal-align
   */
  horizontalAlign: 'end' | 'start';

  /**
   * When `positionTarget` is set, this property defines whether to align the overlay's
   * top or bottom side to the target element by default.
   * Possible values are `top` and `bottom`.
   * The overlay is automatically flipped to the opposite side when it doesn't fit into
   * the default side defined by this property.
   *
   * @attr {top|bottom} vertical-align
   */
  verticalAlign: 'bottom' | 'top';

  /**
   * When `positionTarget` is set, this property defines whether the overlay should overlap
   * the target element in the x-axis, or be positioned right next to it.
   *
   * @attr {boolean} no-horizontal-overlap
   */
  noHorizontalOverlap: boolean;

  /**
   * When `positionTarget` is set, this property defines whether the overlay should overlap
   * the target element in the y-axis, or be positioned right above/below it.
   *
   * @attr {boolean} no-vertical-overlap
   */
  noVerticalOverlap: boolean;

  /**
   * If the overlay content has no intrinsic height, this property can be used to set
   * the minimum vertical space (in pixels) required by the overlay. Setting a value to
   * the property effectively disables the content measurement in favor of using this
   * fixed value for determining the open direction.
   *
   * @attr {number} required-vertical-space
   */
  requiredVerticalSpace: number;
}
