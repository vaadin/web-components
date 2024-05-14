/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PopoverPositionMixin } from './vaadin-popover-position-mixin.js';
import { PopoverTargetMixin } from './vaadin-popover-target-mixin.js';

export type PopoverRenderer = (root: HTMLElement, popover: Popover) => void;

/**
 * `<vaadin-popover>` is a Web Component for creating overlays
 * that are positioned next to specified DOM element (target).
 *
 * Unlike `<vaadin-tooltip>`, the popover supports rich content.
 */
declare class Popover extends PopoverPositionMixin(PopoverTargetMixin(ElementMixin(HTMLElement))) {
  /**
   * Custom function for rendering the content of the overlay.
   * Receives two arguments:
   *
   * - `root` The root container DOM element. Append your content to it.
   * - `popover` The reference to the `vaadin-popover` element (overlay host).
   */
  renderer: PopoverRenderer | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-popover': Popover;
  }
}

export { Popover };
