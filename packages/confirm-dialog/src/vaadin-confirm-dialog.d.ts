/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { SlotMixin } from '@vaadin/component-base/src/slot-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

/**
 * Fired when the `opened` property changes.
 */
export type ConfirmDialogOpenedChangedEvent = CustomEvent<{ value: boolean }>;

export interface ConfirmDialogCustomEventMap {
  'opened-changed': ConfirmDialogOpenedChangedEvent;

  confirm: Event;

  cancel: Event;

  reject: Event;
}

export type ConfirmDialogEventMap = HTMLElementEventMap & ConfirmDialogCustomEventMap;

/**
 * `<vaadin-confirm-dialog>` is a Web Component for showing alerts and asking for user confirmation.
 *
 * ```
 * <vaadin-confirm-dialog cancel>
 *   There are unsaved changes. Do you really want to leave?
 * </vaadin-confirm-dialog>
 * ```
 *
 * ### Styling
 *
 * The `<vaadin-confirm-dialog>` is not themable. Apply styles to `<vaadin-confirm-dialog-overlay>`
 * component and use its shadow parts for styling.
 * See [`<vaadin-overlay>`](#/elements/vaadin-overlay) for the overlay styling documentation.
 *
 * In addition to `<vaadin-overlay>` parts, the following parts are available for theming:
 *
 * Part name        | Description
 * -----------------|-------------------------------------------
 * `header`         | The header element wrapper
 * `message`        | The message element wrapper
 * `footer`         | The footer element that wraps the buttons
 * `cancel-button`  | The "Cancel" button wrapper
 * `confirm-button` | The "Confirm" button wrapper
 * `reject-button`  | The "Reject" button wrapper
 *
 * Use `confirmTheme`, `cancelTheme` and `rejectTheme` properties to customize buttons theme.
 * Also, the `theme` attribute value set on `<vaadin-confirm-dialog>` is propagated to the
 * `<vaadin-confirm-dialog-overlay>` component.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * ### Custom content
 *
 * The following slots are available for providing custom content:
 *
 * Slot name         | Description
 * ------------------|---------------------------
 * `header`          | Slot for header element
 * `cancel-button`   | Slot for "Cancel" button
 * `confirm-button`  | Slot for "Confirm" button
 * `reject-button`   | Slot for "Reject" button
 *
 * @fires {Event} confirm - Fired when Confirm button was pressed.
 * @fires {Event} cancel - Fired when Cancel button or Escape key was pressed.
 * @fires {Event} reject - Fired when Reject button was pressed.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 */
declare class ConfirmDialog extends SlotMixin(ElementMixin(ThemePropertyMixin(HTMLElement))) {
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
   * Whether to show cancel button or not.
   */
  reject: boolean;

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
   */
  cancel: boolean;

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

  addEventListener<K extends keyof ConfirmDialogEventMap>(
    type: K,
    listener: (this: ConfirmDialog, ev: ConfirmDialogEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof ConfirmDialogEventMap>(
    type: K,
    listener: (this: ConfirmDialog, ev: ConfirmDialogEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-confirm-dialog': ConfirmDialog;
  }
}

export { ConfirmDialog };
