/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { DialogBaseMixin } from './vaadin-dialog-base-mixin.js';
import { DialogDraggableMixin } from './vaadin-dialog-draggable-mixin.js';
import { DialogRendererMixin } from './vaadin-dialog-renderer-mixin.js';
import { DialogResizableMixin } from './vaadin-dialog-resizable-mixin.js';
import { DialogSizeMixin } from './vaadin-dialog-size-mixin.js';

export { DialogOverlay, DialogOverlayBounds } from './vaadin-dialog-overlay.js';

export type DialogRenderer = (root: HTMLElement, dialog: Dialog) => void;

export type DialogResizableDirection = 'e' | 'n' | 'ne' | 'nw' | 's' | 'se' | 'sw' | 'w';

export type DialogResizeDimensions = {
  width: string;
  height: string;
  top: string;
  left: string;
};

export type DialogPosition = {
  top: string;
  left: string;
};

/**
 * Fired when the `opened` property changes.
 */
export type DialogOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the dialog resize is finished.
 */
export type DialogResizeEvent = CustomEvent<DialogResizeDimensions>;

/**
 * Fired when the dialog drag is finished.
 */
export type DialogDraggedEvent = CustomEvent<DialogPosition>;

/**
 * Fired when the dialog is closed.
 */
export type DialogClosedEvent = CustomEvent;

export interface DialogCustomEventMap {
  'opened-changed': DialogOpenedChangedEvent;

  closed: DialogClosedEvent;

  resize: DialogResizeEvent;

  dragged: DialogDraggedEvent;
}

export type DialogEventMap = DialogCustomEventMap & HTMLElementEventMap;

/**
 * `<vaadin-dialog>` is a Web Component for creating customized modal dialogs.
 *
 * ### Rendering
 *
 * The content of the dialog can be populated by using the renderer callback function.
 *
 * The renderer function provides `root`, `dialog` arguments.
 * Generate DOM content, append it to the `root` element and control the state
 * of the host element by accessing `dialog`. Before generating new content,
 * users are able to check if there is already content in `root` for reusing it.
 *
 * ```html
 * <vaadin-dialog id="dialog"></vaadin-dialog>
 * ```
 * ```js
 * const dialog = document.querySelector('#dialog');
 * dialog.renderer = function(root, dialog) {
 *   root.textContent = "Sample dialog";
 * };
 * ```
 *
 * Renderer is called on the opening of the dialog.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name        | Description
 * -----------------|-------------------------------------------
 * `backdrop`       | Backdrop of the overlay
 * `overlay`        | The overlay container
 * `content`        | The overlay content
 * `header`         | Element wrapping title and header content
 * `header-content` | Element wrapping the header content slot
 * `title`          | Element wrapping the title slot
 * `footer`         | Element wrapping the footer slot
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|--------------------------------------------
 * `has-title`      | Set when the element has a title
 * `has-header`     | Set when the element has header renderer
 * `has-footer`     | Set when the element has footer renderer
 * `overflow`       | Set to `top`, `bottom`, none or both
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                      |
 * :----------------------------------------|
 * |`--vaadin-dialog-background`            |
 * |`--vaadin-dialog-border-color`          |
 * |`--vaadin-dialog-border-radius`         |
 * |`--vaadin-dialog-border-width`          |
 * |`--vaadin-dialog-max-width`             |
 * |`--vaadin-dialog-min-width`             |
 * |`--vaadin-dialog-padding`               |
 * |`--vaadin-dialog-shadow`                |
 * |`--vaadin-dialog-title-color`           |
 * |`--vaadin-dialog-title-font-size`       |
 * |`--vaadin-dialog-title-font-weight`     |
 * |`--vaadin-dialog-title-line-height`     |
 * |`--vaadin-overlay-backdrop-background`  |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} resize - Fired when the dialog resize is finished.
 * @fires {CustomEvent} dragged - Fired when the dialog drag is finished.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} closed - Fired when the dialog is closed.
 */
declare class Dialog extends DialogSizeMixin(
  DialogDraggableMixin(
    DialogResizableMixin(DialogRendererMixin(DialogBaseMixin(ThemePropertyMixin(ElementMixin(HTMLElement))))),
  ),
) {
  addEventListener<K extends keyof DialogEventMap>(
    type: K,
    listener: (this: Dialog, ev: DialogEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof DialogEventMap>(
    type: K,
    listener: (this: Dialog, ev: DialogEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dialog': Dialog;
  }
}

export { Dialog };
