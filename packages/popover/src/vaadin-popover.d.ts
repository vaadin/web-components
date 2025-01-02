/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { PopoverPositionMixin } from './vaadin-popover-position-mixin.js';
import { PopoverTargetMixin } from './vaadin-popover-target-mixin.js';

export type { PopoverPosition } from './vaadin-popover-position-mixin.js';

export type PopoverRenderer = (root: HTMLElement, popover: Popover) => void;

export type PopoverTrigger = 'click' | 'focus' | 'hover';

/**
 * Fired when the `opened` property changes.
 */
export type PopoverOpenedChangedEvent = CustomEvent<{ value: boolean }>;

export interface PopoverCustomEventMap {
  'opened-changed': PopoverOpenedChangedEvent;

  closed: Event;
}

export type PopoverEventMap = HTMLElementEventMap & PopoverCustomEventMap;

/**
 * `<vaadin-popover>` is a Web Component for creating overlays
 * that are positioned next to specified DOM element (target).
 *
 * Unlike `<vaadin-tooltip>`, the popover supports rich content
 * that can be provided by using `renderer` function.
 *
 * ### Styling
 *
 * `<vaadin-popover>` uses `<vaadin-popover-overlay>` internal
 * themable component as the actual visible overlay.
 *
 * See [`<vaadin-overlay>`](#/elements/vaadin-overlay) documentation
 * for `<vaadin-popover-overlay>` parts.
 *
 * In addition to `<vaadin-overlay>` parts, the following parts are available for styling:
 *
 * Part name        | Description
 * -----------------|-------------------------------------------
 * `arrow`          | Optional arrow pointing to the target when using `theme="arrow"`
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|----------------------------------------
 * `position`       | Reflects the `position` property value.
 *
 * Note: the `theme` attribute value set on `<vaadin-popover>` is
 * propagated to the internal `<vaadin-popover-overlay>` component.
 *
 * ### Custom CSS Properties
 *
 * The following custom CSS properties are available on the `<vaadin-popover>` element:
 *
 * Custom CSS property              | Description
 * ---------------------------------|-------------
 * `--vaadin-popover-offset-top`    | Used as an offset when the popover is aligned vertically below the target
 * `--vaadin-popover-offset-bottom` | Used as an offset when the popover is aligned vertically above the target
 * `--vaadin-popover-offset-start`  | Used as an offset when the popover is aligned horizontally after the target
 * `--vaadin-popover-offset-end`    | Used as an offset when the popover is aligned horizontally before the target
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} closed - Fired when the popover is closed.
 */
declare class Popover extends PopoverPositionMixin(
  PopoverTargetMixin(OverlayClassMixin(ThemePropertyMixin(ElementMixin(HTMLElement)))),
) {
  /**
   * Sets the default focus delay to be used by all popover instances,
   * except for those that have focus delay configured using property.
   */
  static setDefaultFocusDelay(focusDelay: number): void;

  /**
   * Sets the default hide delay to be used by all popover instances,
   * except for those that have hide delay configured using property.
   */
  static setDefaultHideDelay(hideDelay: number): void;

  /**
   * Sets the default hover delay to be used by all popover instances,
   * except for those that have hover delay configured using property.
   */
  static setDefaultHoverDelay(hoverDelay: number): void;

  /**
   * String used to label the overlay to screen reader users.
   *
   * @attr {string} accessible-name
   */
  accessibleName: string | null | undefined;

  /**
   * Id of the element used as label of the overlay to screen reader users.
   *
   * @attr {string} accessible-name-ref
   */
  accessibleNameRef: string | null | undefined;

  /**
   * When true, the popover content automatically receives focus after
   * it is opened. Modal popovers use this behavior by default.
   */
  autofocus: boolean;

  /**
   * Height to be set on the overlay content.
   *
   * @attr {string} content-height
   */
  contentHeight: string;

  /**
   * Width to be set on the overlay content.
   *
   * @attr {string} content-width
   */
  contentWidth: string;

  /**
   * The delay in milliseconds before the popover is opened
   * on focus when the corresponding trigger is used.
   *
   * When not specified, the global default (500ms) is used.
   *
   * @attr {number} focus-delay
   */
  focusDelay: number;

  /**
   * The delay in milliseconds before the popover is closed
   * on losing hover, when the corresponding trigger is used.
   * On blur, the popover is closed immediately.
   *
   * When not specified, the global default (500ms) is used.
   *
   * @attr {number} hide-delay
   */
  hideDelay: number;

  /**
   * The delay in milliseconds before the popover is opened
   * on hover when the corresponding trigger is used.
   *
   * When not specified, the global default (500ms) is used.
   *
   * @attr {number} hover-delay
   */
  hoverDelay: number;

  /**
   * True if the popover overlay is opened, false otherwise.
   */
  opened: boolean;

  /**
   * The `role` attribute value to be set on the overlay.
   *
   * @attr {string} overlay-role
   */
  overlayRole: string;

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
   * Popover trigger mode, used to configure how the overlay is opened or closed.
   * Could be set to multiple by providing an array, e.g. `trigger = ['hover', 'focus']`.
   *
   * Supported values:
   * - `click` (default) - opens and closes on target click.
   * - `hover` - opens on target mouseenter, closes on target mouseleave. Moving mouse
   * to the popover overlay content keeps the overlay opened.
   * - `focus` - opens on target focus, closes on target blur. Moving focus to the
   * popover overlay content keeps the overlay opened.
   *
   * In addition to the behavior specified by `trigger`, the popover can be closed by:
   * - pressing Escape key (unless `noCloseOnEsc` property is true)
   * - outside click (unless `noCloseOnOutsideClick` property is true)
   *
   * When setting `trigger` property to `null`, `undefined` or empty array, the popover
   * can be only opened programmatically by changing `opened` property. Note, closing
   * on Escape press or outside click is still allowed unless explicitly disabled.
   */
  trigger: PopoverTrigger[] | null | undefined;

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
