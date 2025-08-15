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
   * True if the dialog is visible and available for interaction.
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
   * The `role` attribute value to be set on the dialog. Defaults to "dialog".
   *
   * @attr {string} overlay-role
   * @deprecated Use standard `role` attribute on the dialog instead
   */
  overlayRole: string;

  /**
   * Set the distance of the dialog from the top of the viewport.
   * If a unitless number is provided, pixels are assumed.
   *
   * Note that the dialog uses an internal container that has some
   * additional spacing, which can be overridden by the theme.
   */
  top: string;

  /**
   * Set the distance of the dialog from the left of the viewport.
   * If a unitless number is provided, pixels are assumed.
   *
   * Note that the dialog uses an internal container that has some
   * additional spacing, which can be overridden by the theme.
   */
  left: string;
}
