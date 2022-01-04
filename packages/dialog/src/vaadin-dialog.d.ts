/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { DialogDraggableMixin } from './vaadin-dialog-draggable-mixin.js';
import { DialogResizableMixin } from './vaadin-dialog-resizable-mixin.js';

/**
 * An element used internally by `<vaadin-dialog>`. Not intended to be used separately.
 */
export class DialogOverlay extends OverlayElement {}

export type DialogRenderer = (root: HTMLElement, dialog?: Dialog) => void;

export type DialogResizableDirection = 'n' | 'e' | 's' | 'w' | 'nw' | 'ne' | 'se' | 'sw';

export type DialogResizeDimensions = {
  width: string;
  height: string;
  contentWidth: string;
  contentHeight: string;
};

export type DialogOverlayBounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type DialogOverlayBoundsParam =
  | DialogOverlayBounds
  | {
      top?: string | number;
      left?: string | number;
      width?: string | number;
      height?: string | number;
    };

/**
 * Fired when the `opened` property changes.
 */
export type DialogOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the dialog resize is finished.
 */
export type DialogResizeEvent = CustomEvent<DialogResizeDimensions>;

export interface DialogCustomEventMap {
  'opened-changed': DialogOpenedChangedEvent;

  resize: DialogResizeEvent;
}

export type DialogEventMap = HTMLElementEventMap & DialogCustomEventMap;

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
 * `<vaadin-dialog>` uses `<vaadin-dialog-overlay>` internal
 * themable component as the actual visible dialog overlay.
 *
 * See [`<vaadin-overlay>`](#/elements/vaadin-overlay) documentation.
 * for `<vaadin-dialog-overlay>` parts.
 *
 * Note: the `theme` attribute value set on `<vaadin-dialog>` is
 * propagated to the internal `<vaadin-dialog-overlay>` component.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} resize - Fired when the dialog resize is finished.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 */
declare class Dialog extends ThemePropertyMixin(ElementMixin(DialogDraggableMixin(DialogResizableMixin(HTMLElement)))) {
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
   * Set the `aria-label` attribute for assistive technologies like
   * screen readers. An empty string value for this property (the
   * default) means that the `aria-label` attribute is not present.
   */
  ariaLabel: string;

  /**
   * Custom function for rendering the content of the dialog.
   * Receives two arguments:
   *
   * - `root` The root container DOM element. Append your content to it.
   * - `dialog` The reference to the `<vaadin-dialog>` element.
   */
  renderer: DialogRenderer | null | undefined;

  /**
   * Set to true to remove backdrop and allow click events on background elements.
   */
  modeless: boolean;

  /**
   * Requests an update for the content of the dialog.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;

  addEventListener<K extends keyof DialogEventMap>(
    type: K,
    listener: (this: Dialog, ev: DialogEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof DialogEventMap>(
    type: K,
    listener: (this: Dialog, ev: DialogEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dialog': Dialog;
    'vaadin-dialog-overlay': DialogOverlay;
  }
}

export { Dialog };
