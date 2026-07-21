/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
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
   * Set to true to disable moving focus into the dialog on open,
   * and trapping focus inside it. By default, a modal dialog moves
   * focus in and traps it, while a modeless dialog only moves focus
   * in without trapping it.
   * @attr {boolean} no-focus-trap
   */
  noFocusTrap: boolean;

  /**
   * Set to true to disable moving focus into the dialog when it is
   * opened in modeless mode. In modal mode, the focus trap still
   * moves focus into the dialog, so `noFocusTrap` also needs to be
   * set to disable auto focus.
   * @attr {boolean} no-auto-focus
   */
  noAutoFocus: boolean;

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
