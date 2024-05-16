/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { PopoverPositionMixin } from './vaadin-popover-position-mixin.js';
import { PopoverTargetMixin } from './vaadin-popover-target-mixin.js';

export type { PopoverPosition } from './vaadin-popover-position-mixin.js';

export type PopoverRenderer = (root: HTMLElement, popover: Popover) => void;

/**
 * `<vaadin-popover>` is a Web Component for creating overlays
 * that are positioned next to specified DOM element (target).
 *
 * Unlike `<vaadin-tooltip>`, the popover supports rich content
 * that can be provided by using `renderer` function.
 */
declare class Popover extends PopoverPositionMixin(
  PopoverTargetMixin(OverlayClassMixin(ThemePropertyMixin(ElementMixin(HTMLElement)))),
) {
  /**
   * Custom function for rendering the content of the overlay.
   * Receives two arguments:
   *
   * - `root` The root container DOM element. Append your content to it.
   * - `popover` The reference to the `vaadin-popover` element (overlay host).
   */
  renderer: PopoverRenderer | null | undefined;

  /**
   * Set to true to disable closing popover overlay on outside click.
   * Closing on outside click only works when the popover is modal.
   *
   * @attr {boolean} no-close-on-outside-click
   */
  noCloseOnOutsideClick: boolean;

  /**
   * Set to true to disable closing popover overlay on Escape press.
   * When the popover is modal, pressing Escape anywhere in the
   * document closes the overlay. Otherwise, only Escape press
   * from the popover itself or its target closes the overlay.
   *
   * @attr {boolean} no-close-on-esc
   */
  noCloseOnEsc: boolean;

  /**
   * Requests an update for the content of the popover.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-popover': Popover;
  }
}

export { Popover };
