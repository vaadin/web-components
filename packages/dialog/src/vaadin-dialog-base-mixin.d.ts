/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function DialogBaseMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DialogBaseMixinClass> & T;

export declare class DialogBaseMixinClass {
  /**
   * True if the overlay is currently displayed.
   */
  opened: boolean;

  /**
   * Set to true to disable closing dialog on outside click
   * @attr {boolean} no-close-on-outside-click
   */
  noCloseOnOutsideClick: boolean;

  /**
   * Set to true to disable closing dialog on Escape press
   * @attr {boolean} no-close-on-esc
   */
  noCloseOnEsc: boolean;

  /**
   * Set to true to remove backdrop and allow click events on background elements.
   */
  modeless: boolean;

  /**
   * The `role` attribute value to be set on the overlay. Defaults to "dialog".
   *
   * @attr {string} overlay-role
   */
  overlayRole: string;

  /**
   * Set the distance of the overlay from the top of its container.
   * If a unitless number is provided, pixels are assumed.
   *
   * Note that the overlay top edge may not be the same as the viewport
   * top edge (e.g. the Lumo theme defines some spacing to prevent the
   * overlay from stretching all the way to the top of the viewport).
   */
  top: string;

  /**
   * Set the distance of the overlay from the left of its container.
   * If a unitless number is provided, pixels are assumed.
   *
   * Note that the overlay left edge may not be the same as the viewport
   * left edge (e.g. the Lumo theme defines some spacing to prevent the
   * overlay from stretching all the way to the left of the viewport).
   */
  left: string;

  /**
   * Set the width of the overlay.
   * If a unitless number is provided, pixels are assumed.
   */
  width: string;

  /**
   * Set the height of the overlay.
   * If a unitless number is provided, pixels are assumed.
   */
  height: string;

  /**
   * Set to true to prevent the dialog from moving outside the viewport bounds.
   * When enabled, all four edges of the dialog will remain visible, for example
   * when dragging the dialog or when the viewport is resized. Note that the
   * dialog will also adjust any programmatically configured size and position
   * so that it stays within the viewport.
   * @attr {boolean} keep-in-viewport
   */
  keepInViewport: boolean;
}
