import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

/**
 * Fired when the `opened` property changes.
 */
export type ConfirmDialogOpenedChanged = CustomEvent<{ value: boolean }>;

export interface ConfirmDialogElementEventMap {
  'opened-changed': ConfirmDialogOpenedChanged;

  confirm: Event;

  cancel: Event;

  reject: Event;
}

export type ConfirmDialogEventMap = HTMLElementEventMap & ConfirmDialogElementEventMap;

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
 * The following Shadow DOM parts are available for styling the dialog parts:
 *
 * Part name  | Description
 * -----------|---------------------------------------------------------|
 * `header`   | Header of the confirmation dialog
 * `message`  | Container for the message of the dialog
 * `footer`   | Container for the buttons
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * ### Custom content
 *
 * The following parts are available for replacement:
 *
 * Slot name         | Description
 * ------------------|---------------------------------------------------------|
 * `header`          | Header of the confirmation dialog
 * `message`         | Container for the message of the dialog
 * `cancel-button`   | Container for the Cancel button
 * `reject-button`   | Container for the Reject button
 * `confirm-button`  | Container for the Confirm button
 *
 * @fires {Event} confirm - Fired when Confirm button was pressed.
 * @fires {Event} cancel - Fired when Cancel button or Escape key was pressed.
 * @fires {Event} reject - Fired when Reject button was pressed.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 */
declare class ConfirmDialogElement extends ElementMixin(ThemableMixin(HTMLElement)) {
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
   * @attr {string} confirm-text
   */
  confirmText: string;

  /**
   * Theme for a confirm-button.
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
   * @attr {string} reject-text
   */
  rejectText: string;

  /**
   * Theme for a reject-button.
   * @attr {string} reject-theme
   */
  rejectTheme: string;

  /**
   * Whether to show cancel button or not.
   */
  cancel: boolean;

  /**
   * Text displayed on cancel-button.
   * @attr {string} cancel-text
   */
  cancelText: string;

  /**
   * Theme for a cancel-button.
   * @attr {string} cancel-theme
   */
  cancelTheme: string;

  addEventListener<K extends keyof ConfirmDialogEventMap>(
    type: K,
    listener: (this: ConfirmDialogElement, ev: ConfirmDialogEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof ConfirmDialogEventMap>(
    type: K,
    listener: (this: ConfirmDialogElement, ev: ConfirmDialogEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-confirm-dialog': ConfirmDialogElement;
  }
}

export { ConfirmDialogElement };
