/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * An element used internally by `<vaadin-slider>`. Not intended to be used separately.
 */
declare class SliderBubble extends HTMLElement {
  /**
   * The thumb element next to which the overlay should be aligned.
   */
  positionTarget: HTMLElement;

  /**
   * Whether the overlay is opened.
   */
  opened: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-slider-bubble': SliderBubble;
  }
}

export { SliderBubble };
