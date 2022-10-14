/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export type OverlayRenderer = (root: HTMLElement, owner: HTMLElement, model?: object) => void;

/**
 * Fired when the `opened` property changes.
 */
export type OverlayOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired after the overlay is opened.
 */
export type OverlayOpenEvent = CustomEvent;

/**
 * Fired before the overlay will be closed.
 * If canceled the closing of the overlay is canceled as well.
 */
export type OverlayCloseEvent = CustomEvent;

/**
 * Fired when the overlay will be closed.
 */
export type OverlayClosingEvent = CustomEvent;

/**
 * Fired before the overlay will be closed on outside click.
 * If canceled the closing of the overlay is canceled as well.
 */
export type OverlayOutsideClickEvent = CustomEvent<{ sourceEvent: MouseEvent }>;

/**
 * Fired before the overlay will be closed on ESC button press.
 * If canceled the closing of the overlay is canceled as well.
 */
export type OverlayEscapePressEvent = CustomEvent<{ sourceEvent: KeyboardEvent }>;

export interface OverlayCustomEventMap {
  'opened-changed': OverlayOpenedChangedEvent;
  'vaadin-overlay-open': OverlayOpenEvent;
  'vaadin-overlay-close': OverlayCloseEvent;
  'vaadin-overlay-closing': OverlayClosingEvent;
  'vaadin-overlay-outside-click': OverlayOutsideClickEvent;
  'vaadin-overlay-escape-press': OverlayEscapePressEvent;
}

export type OverlayEventMap = HTMLElementEventMap & OverlayCustomEventMap;

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
 * from the parent scope propagate to the content.
 *
 * ```html
 * <vaadin-overlay>
 *   <template>Overlay content</template>
 * </vaadin-overlay>
 * ```
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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} vaadin-overlay-open - Fired after the overlay is opened.
 * @fires {CustomEvent} vaadin-overlay-close - Fired before the overlay will be closed. If canceled the closing of the overlay is canceled as well.
 * @fires {CustomEvent} vaadin-overlay-closing - Fired when the overlay will be closed.
 * @fires {CustomEvent} vaadin-overlay-outside-click - Fired before the overlay will be closed on outside click. If canceled the closing of the overlay is canceled as well.
 * @fires {CustomEvent} vaadin-overlay-escape-press - Fired before the overlay will be closed on ESC button press. If canceled the closing of the overlay is canceled as well.
 */
declare class Overlay extends ThemableMixin(DirMixin(ControllerMixin(HTMLElement))) {
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

  /**
   * Set to specify the element which should be focused on overlay close,
   * if `restoreFocusOnClose` is set to true.
   */
  restoreFocusNode?: HTMLElement;

  close(sourceEvent?: Event | null): void;

  /**
   * Requests an update for the content of the overlay.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;

  /**
   * Brings the overlay as visually the frontmost one
   */
  bringToFront(): void;

  addEventListener<K extends keyof OverlayEventMap>(
    type: K,
    listener: (this: Overlay, ev: OverlayEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof OverlayEventMap>(
    type: K,
    listener: (this: Overlay, ev: OverlayEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-overlay': Overlay;
  }
}

export { Overlay };
