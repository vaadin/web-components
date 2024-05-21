/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { PopoverPositionMixin } from './vaadin-popover-position-mixin.js';
import { PopoverTargetMixin } from './vaadin-popover-target-mixin.js';

export type { PopoverPosition } from './vaadin-popover-position-mixin.js';

export type PopoverRenderer = (root: HTMLElement, popover: Popover) => void;

export type PopoverTrigger = 'click' | 'hover-or-click' | 'hover-or-focus' | 'manual';

/**
 * Fired when the `opened` property changes.
 */
export type PopoverOpenedChangedEvent = CustomEvent<{ value: boolean }>;

export interface PopoverCustomEventMap {
  'opened-changed': PopoverOpenedChangedEvent;
}

export type PopoverEventMap = HTMLElementEventMap & PopoverCustomEventMap;

/**
 * `<vaadin-popover>` is a Web Component for creating overlays
 * that are positioned next to specified DOM element (target).
 *
 * Unlike `<vaadin-tooltip>`, the popover supports rich content
 * that can be provided by using `renderer` function.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 */
declare class Popover extends PopoverPositionMixin(
  PopoverTargetMixin(OverlayClassMixin(ThemePropertyMixin(ElementMixin(HTMLElement)))),
) {
  /**
   * True if the popover overlay is opened, false otherwise.
   */
  opened: boolean;

  /**
   * Custom function for rendering the content of the overlay.
   * Receives two arguments:
   *
   * - `root` The root container DOM element. Append your content to it.
   * - `popover` The reference to the `vaadin-popover` element (overlay host).
   */
  renderer: PopoverRenderer | null | undefined;

  /**
   * When true, the popover prevents interacting with background elements
   * by setting `pointer-events` style on the document body to `none`.
   * This also enables trapping focus inside the overlay.
   */
  modal: boolean;

  /**
   * Set to true to disable closing popover overlay on outside click.
   *
   * @attr {boolean} no-close-on-outside-click
   */
  noCloseOnOutsideClick: boolean;

  /**
   * Set to true to disable closing popover overlay on Escape press.
   * When the popover is modal, pressing Escape anywhere in the
   * document closes the overlay. Otherwise, only Escape press
   * from the popover itself or its target closes the overlay.
   *
   * @attr {boolean} no-close-on-esc
   */
  noCloseOnEsc: boolean;

  /**
   * Used to configure the way how the popover overlay is opened or closed, based on
   * the user interactions with the target element.
   *
   * Supported values:
   * - `click` (default) - opens on target click, closes on outside click and Escape
   * - `hover-or-click` - also opens on target mouseenter, closes on target mouseleave
   * - `hover-or-focus` - opens on mouseenter and focus, closes on mouseleave and blur
   * - `manual` - only can be opened by setting `opened` property on the host
   *
   * Note: moving mouse or focus inside the popover overlay content does not close it.
   */
  trigger: PopoverTrigger;

  /**
   * When true, the overlay has a backdrop (modality curtain) on top of the
   * underlying page content, covering the whole viewport.
   *
   * @attr {boolean} with-backdrop
   */
  withBackdrop: boolean;

  /**
   * Requests an update for the content of the popover.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;

  addEventListener<K extends keyof PopoverEventMap>(
    type: K,
    listener: (this: Popover, ev: PopoverEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof PopoverEventMap>(
    type: K,
    listener: (this: Popover, ev: PopoverEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-popover': Popover;
  }
}

export { Popover };
