/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { type ConfirmDialogEventMap, ConfirmDialogMixin } from './vaadin-confirm-dialog-mixin.js';

export * from './vaadin-confirm-dialog-mixin.js';

/**
 * `<vaadin-confirm-dialog>` is a Web Component for showing alerts and asking for user confirmation.
 *
 * ```
 * <vaadin-confirm-dialog cancel-button-visible>
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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
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
 * @fires {CustomEvent} closed - Fired when the confirm dialog is closed.
 */
declare class ConfirmDialog extends ConfirmDialogMixin(ElementMixin(ThemePropertyMixin(ControllerMixin(HTMLElement)))) {
  addEventListener<K extends keyof ConfirmDialogEventMap>(
    type: K,
    listener: (this: ConfirmDialog, ev: ConfirmDialogEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof ConfirmDialogEventMap>(
    type: K,
    listener: (this: ConfirmDialog, ev: ConfirmDialogEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-confirm-dialog': ConfirmDialog;
  }
}

export { ConfirmDialog };
