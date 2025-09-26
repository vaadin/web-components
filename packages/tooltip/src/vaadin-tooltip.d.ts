/**
 * @license
 * Copyright (c) 2022 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { TooltipMixin } from './vaadin-tooltip-mixin.js';

export { TooltipPosition } from './vaadin-tooltip-mixin.js';

/**
 * Fired when the tooltip text content is changed.
 */
export type TooltipContentChangedEvent = CustomEvent<{ content: string }>;

export interface TooltipCustomEventMap {
  'content-changed': TooltipContentChangedEvent;
}

export interface TooltipEventMap extends HTMLElementEventMap, TooltipCustomEventMap {}

/**
 * `<vaadin-tooltip>` is a Web Component for creating tooltips.
 *
 * ```html
 * <button id="confirm">Confirm</button>
 * <vaadin-tooltip text="Click to save changes" for="confirm"></vaadin-tooltip>
 * ```
 *
 * ### Markdown Support
 *
 * The tooltip supports rendering Markdown content when the `contentType` property is set to `markdown`:
 *
 * ```html
 * <button id="info">Info</button>
 * <vaadin-tooltip
 *   text="**Important:** Click to view *detailed* information"
 *   content-type="markdown"
 *   for="info">
 * </vaadin-tooltip>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ----------- | ---------------
 * `overlay`   | The overlay element
 * `content`   | The overlay content element
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|----------------------------------------
 * `content-type`   | Reflects the `contentType` property value.
 * `position`       | Reflects the `position` property value.
 *
 * ### Custom CSS Properties
 *
 * The following custom CSS properties are available on the `<vaadin-tooltip>` element:
 *
 * Custom CSS property              | Description
 * ---------------------------------|-------------
 * `--vaadin-tooltip-offset-top`    | Used as an offset when the tooltip is aligned vertically below the target
 * `--vaadin-tooltip-offset-bottom` | Used as an offset when the tooltip is aligned vertically above the target
 * `--vaadin-tooltip-offset-start`  | Used as an offset when the tooltip is aligned horizontally after the target
 * `--vaadin-tooltip-offset-end`    | Used as an offset when the tooltip is aligned horizontally before the target
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} content-changed - Fired when the tooltip text content is changed.
 */
declare class Tooltip extends TooltipMixin(ThemePropertyMixin(ElementMixin(HTMLElement))) {
  /**
   * Sets the default focus delay to be used by all tooltip instances,
   * except for those that have focus delay configured using property.
   */
  static setDefaultFocusDelay(focusDelay: number): void;

  /**
   * Sets the default hide delay to be used by all tooltip instances,
   * except for those that have hide delay configured using property.
   */
  static setDefaultHideDelay(hideDelay: number): void;

  /**
   * Sets the default hover delay to be used by all tooltip instances,
   * except for those that have hover delay configured using property.
   */
  static setDefaultHoverDelay(hoverDelay: number): void;

  addEventListener<K extends keyof TooltipEventMap>(
    type: K,
    listener: (this: Tooltip, ev: TooltipEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof TooltipEventMap>(
    type: K,
    listener: (this: Tooltip, ev: TooltipEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-tooltip': Tooltip;
  }
}

export { Tooltip };
