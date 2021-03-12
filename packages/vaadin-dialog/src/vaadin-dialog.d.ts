import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

import { DialogDraggableMixin } from './vaadin-dialog-draggable-mixin.js';

import { DialogResizableMixin } from './vaadin-dialog-resizable-mixin.js';

import { DialogEventMap, DialogRenderer } from './interfaces';

/**
 * `<vaadin-dialog>` is a Web Component for creating customized modal dialogs. The content of the
 * dialog can be populated in two ways: imperatively by using renderer callback function and
 * declaratively by using Polymer's Templates.
 *
 * ### Rendering
 *
 * By default, the dialog uses the content provided by using the renderer callback function.
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
 * ### Polymer Templates
 *
 * Alternatively, the content can be provided with Polymer's Template.
 * Dialog finds the first child template and uses that in case renderer callback function
 * is not provided. You can also set a custom template using the `template` property.
 *
 * ```html
 * <vaadin-dialog opened>
 *   <template>
 *     Sample dialog
 *   </template>
 * </vaadin-dialog>
 * ```
 *
 * ### Styling
 *
 * See [`<vaadin-overlay>` documentation](https://github.com/vaadin/vaadin-overlay/blob/master/src/vaadin-overlay.html)
 * for `<vaadin-dialog-overlay>` parts.
 *
 * Note: the `theme` attribute value set on `<vaadin-dialog>` is
 * propagated to the internal `<vaadin-dialog-overlay>` component.
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * @fires {CustomEvent} resize - Fired when the dialog resize is finished.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 */
declare class DialogElement extends ThemePropertyMixin(
  ElementMixin(DialogDraggableMixin(DialogResizableMixin(HTMLElement)))
) {
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
   * screen readers. An `undefined` value for this property (the
   * default) means that the `aria-label` attribute is not present at
   * all.
   */
  ariaLabel: string | null | undefined;

  _contentTemplate: HTMLTemplateElement | null | undefined;

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

  _setTemplateFromNodes(nodes: Node[]): void;

  /**
   * Manually invoke existing renderer.
   */
  render(): void;

  addEventListener<K extends keyof DialogEventMap>(
    type: K,
    listener: (this: DialogElement, ev: DialogEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof DialogEventMap>(
    type: K,
    listener: (this: DialogElement, ev: DialogEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dialog': DialogElement;
  }
}

export { DialogElement };
