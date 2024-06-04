/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/*
 * Fired when the `opened` property changes.
 */
export type ConfirmDialogOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the confirm dialog is closed.
 */
export type ConfirmDialogClosedEvent = CustomEvent;

export interface ConfirmDialogCustomEventMap {
  'opened-changed': ConfirmDialogOpenedChangedEvent;

  closed: ConfirmDialogClosedEvent;

  confirm: Event;

  cancel: Event;

  reject: Event;
}

export type ConfirmDialogEventMap = ConfirmDialogCustomEventMap & HTMLElementEventMap;

export declare function ConfirmDialogMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ConfirmDialogMixinClass> & T;

export declare class ConfirmDialogMixinClass {
  /**
   * Sets the `aria-describedby` attribute of the overlay element.
   *
   * By default, all elements inside the message area are linked
   * through the `aria-describedby` attribute. However, there are
   * cases where this can confuse screen reader users (e.g. the dialog
   * may present a password confirmation form). For these cases,
   * it's better to associate only the elements that will help describe
   * the confirmation dialog through this API.
   * @attr {string} accessible-description-ref
   */
  accessibleDescriptionRef: string | null | undefined;

  /**
   * True if the overlay is currently displayed.
   */
  opened: boolean;

  /**
   * Set the confirmation dialog title.
   */
  header: string;

  /**
   * Set the message or confirmation question.
   */
  message: string | null | undefined;

  /**
   * Text displayed on confirm-button.
   * This only affects the default button, custom slotted buttons will not be altered.
   * @attr {string} confirm-text
   */
  confirmText: string;

  /**
   * Theme for a confirm-button.
   * This only affects the default button, custom slotted buttons will not be altered.
   * @attr {string} confirm-theme
   */
  confirmTheme: string;

  /**
   * Set to true to disable closing dialog on Escape press
   * @attr {boolean} no-close-on-esc
   */
  noCloseOnEsc: boolean;

  /**
   * Whether to show reject button or not.
   * @attr {boolean} reject-button-visible
   */
  rejectButtonVisible: boolean;

  /**
   * Text displayed on reject-button.
   * This only affects the default button, custom slotted buttons will not be altered.
   * @attr {string} reject-text
   */
  rejectText: string;

  /**
   * Theme for a reject-button.
   * This only affects the default button, custom slotted buttons will not be altered.
   * @attr {string} reject-theme
   */
  rejectTheme: string;

  /**
   * Whether to show cancel button or not.
   * @attr {boolean} cancel-button-visible
   */
  cancelButtonVisible: boolean;

  /**
   * Text displayed on cancel-button.
   * This only affects the default button, custom slotted buttons will not be altered.
   * @attr {string} cancel-text
   */
  cancelText: string;

  /**
   * Theme for a cancel-button.
   * This only affects the default button, custom slotted buttons will not be altered.
   * @attr {string} cancel-theme
   */
  cancelTheme: string;

  /**
   * A space-delimited list of CSS class names
   * to set on the underlying overlay element.
   *
   * @attr {string} overlay-class
   */
  overlayClass: string;
}
