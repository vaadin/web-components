/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Class to manage overlay position properties.
 */
export declare class OverlayPositionManager extends EventTarget {
  constructor(overlay: HTMLElement, host?: HTMLElement);

  /**
   * Set properties to change overlay opened state, target or position.
   */
  setState(props: {
    opened?: boolean;
    target?: HTMLElement;
    noHorizontalOverlap?: boolean;
    noVerticalOverlap?: boolean;
    horizontalAlign?: 'end' | 'start';
    verticalAlign?: 'bottom' | 'top';
    requiredVerticalSpace?: number;
  }): void;

  /**
   * Update the overlay position to align next to the target,
   * or close the overlay if the target is no longer visible.
   */
  updatePosition(): void;
}
