/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';

export declare function OverlayFocusMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ControllerMixinClass> & Constructor<OverlayFocusMixinClass> & T;

export declare class OverlayFocusMixinClass {
  /**
   * When true, opening the overlay moves focus to the first focusable child,
   * or to the overlay part with tabindex if there are no focusable children.
   * @attr {boolean} focus-trap
   */
  focusTrap: boolean;

  /**
   * Set to true to enable restoring of focus when overlay is closed.
   * @attr {boolean} restore-focus-on-close
   */
  restoreFocusOnClose: boolean;

  /**
   * Set to specify the element which should be focused on overlay close,
   * if `restoreFocusOnClose` is set to true.
   */
  restoreFocusNode?: HTMLElement;

  /**
   * Release focus and restore focus after the overlay is closed.
   */
  protected _resetFocus(): void;

  /**
   * Store previously focused node when the overlay starts to open.
   */
  protected _storeFocus(): void;

  /**
   * Trap focus within the overlay after opening has completed.
   */
  protected _trapFocus(): void;
}
