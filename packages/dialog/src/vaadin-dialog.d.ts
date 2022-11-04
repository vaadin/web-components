/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { DialogDraggableMixin } from './vaadin-dialog-draggable-mixin.js';
import { DialogResizableMixin } from './vaadin-dialog-resizable-mixin.js';

/**
 * An element used internally by `<vaadin-dialog>`. Not intended to be used separately.
 */
export class DialogOverlay extends Overlay {}

export type DialogRenderer = (root: HTMLElement, dialog: Dialog) => void;

export type DialogResizableDirection = 'e' | 'n' | 'ne' | 'nw' | 's' | 'se' | 'sw' | 'w';

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
      top?: number | string;
      left?: number | string;
      width?: number | string;
      height?: number | string;
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
 * `<vaadin-dialog>` uses `<vaadin-dialog-overlay>` internal
 * themable component as the actual visible dialog overlay.
 *
 * See [`<vaadin-overlay>`](#/elements/vaadin-overlay) documentation.
 * for `<vaadin-dialog-overlay>` parts.
 *
 * In addition to `<vaadin-overlay>` parts, the following parts are available for styling:
 *
 * Part name        | Description
 * -----------------|-------------------------------------------
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
 * Note: the `theme` attribute value set on `<vaadin-dialog>` is
 * propagated to the internal `<vaadin-dialog-overlay>` component.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
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
   * String used for rendering a dialog title.
   *
   * If both `headerTitle` and `headerRenderer` are defined, the title
   * and the elements created by the renderer will be placed next to
   * each other, with the title coming first.
   *
   * When `headerTitle` is set, the attribute `has-title` is added to the overlay element.
   * @attr {string} header-title
   */
  headerTitle: string | null | undefined;

  /**
   * Custom function for rendering the dialog header.
   * Receives two arguments:
   *
   * - `root` The root container DOM element. Append your content to it.
   * - `dialog` The reference to the `<vaadin-dialog>` element.
   *
   * If both `headerTitle` and `headerRenderer` are defined, the title
   * and the elements created by the renderer will be placed next to
   * each other, with the title coming first.
   *
   * When `headerRenderer` is set, the attribute `has-header` is added to the overlay element.
   */
  headerRenderer: DialogRenderer | null | undefined;

  /**
   * Custom function for rendering the dialog footer.
   * Receives two arguments:
   *
   * - `root` The root container DOM element. Append your content to it.
   * - `dialog` The reference to the `<vaadin-dialog>` element.
   *
   * When `footerRenderer` is set, the attribute `has-footer` is added to the overlay element.
   */
  footerRenderer: DialogRenderer | null | undefined;

  /**
   * Set to true to remove backdrop and allow click events on background elements.
   */
  modeless: boolean;

  /**
   * While performing the update, it invokes the renderer passed in the `renderer` property,
   * as well as `headerRender` and `footerRenderer` properties, if these are defined.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;

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
    'vaadin-dialog-overlay': DialogOverlay;
  }
}

export { Dialog };
