/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
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
 * The following shadow DOM parts are available for styling:
 *
 * Part name        | Description
 * -----------------|-------------------------------------------
 * `backdrop`       | Backdrop of the overlay
 * `overlay`        | The overlay container
 * `content`        | The overlay content
 * `arrow`          | Optional arrow pointing to the target when using `theme="arrow"`
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|----------------------------------------
 * `position`       | Reflects the `position` property value.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                      |
 * :----------------------------------------|
 * |`--vaadin-overlay-backdrop-background`  |
 * |`--vaadin-popover-arrow-border-radius`  |
 * |`--vaadin-popover-arrow-size`           |
 * |`--vaadin-popover-background`           |
 * |`--vaadin-popover-border-color`         |
 * |`--vaadin-popover-border-radius`        |
 * |`--vaadin-popover-border-width`         |
 * |`--vaadin-popover-offset-bottom`        |
 * |`--vaadin-popover-offset-end`           |
 * |`--vaadin-popover-offset-start`         |
 * |`--vaadin-popover-offset-top`           |
 * |`--vaadin-popover-padding`              |
 * |`--vaadin-popover-shadow`               |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} closed - Fired when the popover is closed.
 */
declare class Popover extends PopoverPositionMixin(PopoverTargetMixin(ThemePropertyMixin(ElementMixin(HTMLElement)))) {
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
   * String used to label the popover to screen reader users.
   *
   * @attr {string} accessible-name
   * @deprecated Use `aria-label` attribute on the popover instead
   */
  accessibleName: string | null | undefined;

  /**
   * Id of the element used as label of the popover to screen reader users.
   *
   * @attr {string} accessible-name-ref
   * @deprecated Use `aria-labelledby` attribute on the popover instead
   */
  accessibleNameRef: string | null | undefined;

  /**
   * When true, the popover content automatically receives focus after
   * it is opened. Modal popovers use this behavior by default.
   */
  autofocus: boolean;

  /**
   * Set the height of the popover.
   * If a unitless number is provided, pixels are assumed.
   */
  height: string | null;

  /**
   * Set the width of the popover.
   * If a unitless number is provided, pixels are assumed.
   */
  width: string | null;

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
   * True if the popover is visible and available for interaction.
   */
  opened: boolean;

  /**
   * The `role` attribute value to be set on the popover.
   *
   * @attr {string} overlay-role
   * @deprecated Use standard `role` attribute on the popover instead
   */
  overlayRole: string;

  /**
   * Custom function for rendering the content of the popover.
   * Receives two arguments:
   *
   * - `root` The root container DOM element. Append your content to it.
   * - `popover` The reference to the `vaadin-popover` element.
   *
   * @deprecated Add content elements as children of the popover using default slot
   */
  renderer: PopoverRenderer | null | undefined;

  /**
   * When true, the popover prevents interacting with background elements
   * by setting `pointer-events` style on the document body to `none`.
   * This also enables trapping focus inside the popover.
   */
  modal: boolean;

  /**
   * Set to true to disable closing popover on outside click.
   *
   * @attr {boolean} no-close-on-outside-click
   */
  noCloseOnOutsideClick: boolean;

  /**
   * Set to true to disable closing popover on Escape press.
   *
   * @attr {boolean} no-close-on-esc
   */
  noCloseOnEsc: boolean;

  /**
   * Popover trigger mode, used to configure how the popover is opened or closed.
   * Could be set to multiple by providing an array, e.g. `trigger = ['hover', 'focus']`.
   *
   * Supported values:
   * - `click` (default) - opens and closes on target click.
   * - `hover` - opens on target mouseenter, closes on target mouseleave. Moving mouse
   * to the popover content keeps the popover opened.
   * - `focus` - opens on target focus, closes on target blur. Moving focus to the
   * popover content keeps the popover opened.
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
   * When true, the popover has a backdrop (modality curtain) on top of the
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
   *
   * @deprecated Add content elements as children of the popover using default slot
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
