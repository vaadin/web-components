import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { DirMixin } from '@vaadin/vaadin-element-mixin/vaadin-dir-mixin.js';

import { OverlayEventMap, OverlayRenderer } from './interfaces';

/**
 * `<vaadin-overlay>` is a Web Component for creating overlays. The content of the overlay
 * can be populated in two ways: imperatively by using renderer callback function and
 * declaratively by using Polymer's Templates.
 *
 * ### Rendering
 *
 * By default, the overlay uses the content provided by using the renderer callback function.
 *
 * The renderer function provides `root`, `owner`, `model` arguments when applicable.
 * Generate DOM content by using `model` object properties if needed, append it to the `root`
 * element and control the state of the host element by accessing `owner`. Before generating new
 * content, users are able to check if there is already content in `root` for reusing it.
 *
 * ```html
 * <vaadin-overlay id="overlay"></vaadin-overlay>
 * ```
 * ```js
 * const overlay = document.querySelector('#overlay');
 * overlay.renderer = function(root) {
 *  root.textContent = "Overlay content";
 * };
 * ```
 *
 * Renderer is called on the opening of the overlay and each time the related model is updated.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * **NOTE:** when the renderer property is defined, the `<template>` content is not used.
 *
 * ### Templating
 *
 * Alternatively, the content can be provided with Polymer Template.
 * Overlay finds the first child template and uses that in case renderer callback function
 * is not provided. You can also set a custom template using the `template` property.
 *
 * After the content from the template is stamped, the `content` property
 * points to the content container.
 *
 * The overlay provides `forwardHostProp` when calling
 * `Polymer.Templatize.templatize` for the template, so that the bindings
 * from the parent scope propagate to the content.  You can also pass
 * custom `instanceProps` object using the `instanceProps` property.
 *
 * ```html
 * <vaadin-overlay>
 *   <template>Overlay content</template>
 * </vaadin-overlay>
 * ```
 *
 * **NOTE:** when using `instanceProps`: because of the Polymer limitation,
 * every template can only be templatized once, so it is important
 * to set `instanceProps` before the `template` is assigned to the overlay.
 *
 * ### Styling
 *
 * To style the overlay content, use styles in the parent scope:
 *
 * - If the overlay is used in a component, then the component styles
 *   apply the overlay content.
 * - If the overlay is used in the global DOM scope, then global styles
 *   apply to the overlay content.
 *
 * See examples for styling the overlay content in the live demos.
 *
 * The following Shadow DOM parts are available for styling the overlay component itself:
 *
 * Part name  | Description
 * -----------|---------------------------------------------------------|
 * `backdrop` | Backdrop of the overlay
 * `overlay`  | Container for position/sizing/alignment of the content
 * `content`  | Content of the overlay
 *
 * The following state attributes are available for styling:
 *
 * Attribute | Description | Part
 * ---|---|---
 * `opening` | Applied just after the overlay is attached to the DOM. You can apply a CSS @keyframe animation for this state. | `:host`
 * `closing` | Applied just before the overlay is detached from the DOM. You can apply a CSS @keyframe animation for this state. | `:host`
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property | Description | Default value
 * ---|---|---
 * `--vaadin-overlay-viewport-bottom` | Bottom offset of the visible viewport area | `0` or detected offset
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 */
declare class OverlayElement extends ThemableMixin(DirMixin(HTMLElement)) {
  /**
   * returns true if this is the last one in the opened overlays stack
   */
  readonly _last: boolean;

  /**
   * When true, the overlay is visible and attached to body.
   */
  opened: boolean | null | undefined;

  /**
   * Owner element passed with renderer function
   */
  owner: HTMLElement | null;

  /**
   * Custom function for rendering the content of the overlay.
   * Receives three arguments:
   *
   * - `root` The root container DOM element. Append your content to it.
   * - `owner` The host element of the renderer function.
   * - `model` The object with the properties related with rendering.
   */
  renderer: OverlayRenderer | null | undefined;

  /**
   * The template of the overlay content.
   */
  template: HTMLTemplateElement | null | undefined;

  /**
   * Optional argument for `Polymer.Templatize.templatize`.
   */
  instanceProps: object | null | undefined;

  /**
   * References the content container after the template is stamped.
   */
  content: HTMLElement | undefined;

  /**
   * When true the overlay has backdrop on top of content when opened.
   */
  withBackdrop: boolean;

  /**
   * Object with properties that is passed to `renderer` function
   */
  model: object | null | undefined;

  /**
   * When true the overlay won't disable the main content, showing
   * it doesn’t change the functionality of the user interface.
   */
  modeless: boolean;

  /**
   * When set to true, the overlay is hidden. This also closes the overlay
   * immediately in case there is a closing animation in progress.
   */
  hidden: boolean;

  /**
   * When true move focus to the first focusable element in the overlay,
   * or to the overlay if there are no focusable elements.
   */
  focusTrap: boolean;

  /**
   * Set to true to enable restoring of focus when overlay is closed.
   */
  restoreFocusOnClose: boolean;

  _setTemplateFromNodes(nodes: Element[]): void;

  close(sourceEvent?: Event | null): void;

  _ensureTemplatized(): void;

  _shouldAnimate(): boolean;

  _enqueueAnimation(type: string, callback: Function | null): void;

  _flushAnimation(type: string): void;

  _animatedOpening(): void;

  _attachOverlay(): void;

  _animatedClosing(): void;

  _detachOverlay(): void;

  _addGlobalListeners(): void;

  _enterModalState(): void;

  _removeGlobalListeners(): void;

  _exitModalState(): void;

  _removeOldContent(): void;

  _stampOverlayTemplate(template: HTMLTemplateElement, instanceProps: object | null): void;

  /**
   * Requests an update for the content of the overlay.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;

  /**
   * Manually invoke existing renderer.
   *
   * @deprecated Since Vaadin 21, `render()` is deprecated. Please use `requestContentUpdate()` instead.
   */
  render(): void;

  _isFocused(element: Element | null): boolean;

  _focusedIndex(elements: Array<Element | null> | null): number;

  _cycleTab(increment: number, index: number | undefined): void;

  _getFocusableElements(): HTMLElement[];

  _getActiveElement(): Element;

  _deepContains(node: Node): boolean;

  /**
   * Brings the overlay as visually the frontmost one
   */
  bringToFront(): void;

  addEventListener<K extends keyof OverlayEventMap>(
    type: K,
    listener: (this: OverlayElement, ev: OverlayEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof OverlayEventMap>(
    type: K,
    listener: (this: OverlayElement, ev: OverlayEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-overlay': OverlayElement;
  }
}

export { OverlayElement };
