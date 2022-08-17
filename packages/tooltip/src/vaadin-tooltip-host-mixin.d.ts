/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';

/**
 * A mixin enabling a web component to act as a tooltip host.
 * Any components that extend this mixin are required to import
 * the `vaadin-tooltip` web component using the correct theme.
 */
export declare function TooltipHostMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ControllerMixinClass> & Constructor<TooltipHostMixinClass> & T;

export declare class TooltipHostMixinClass {
  /**
   * The delay in milliseconds before the tooltip
   * is closed, when not using manual mode.
   * This only applies to `mouseleave` listener.
   * On blur, the tooltip is closed immediately.
   * @attr {number} tooltip-cooldown
   */
  tooltipCooldown: number;

  /**
   * The delay in milliseconds before the tooltip
   * is opened, when not using manual mode.
   * This only applies to `mouseenter` listener.
   * On focus, the tooltip is opened immediately.
   * @attr {number} tooltip-delay
   */
  tooltipDelay: number;

  /**
   * When true, the tooltip is controlled manually
   * instead of reacting to focus and mouse events.
   * @attr {boolean} tooltip-manual
   */
  tooltipManual: boolean;

  /**
   * When true, the tooltip is opened programmatically.
   * Only works if `tooltipManual` is set to `true`.
   * @attr {boolean} tooltip-opened
   */
  tooltipOpened: boolean;

  /**
   * Position of the tooltip with respect to the element.
   * Supported values: `top`, `bottom`, `start`, `end`.
   * @attr {string} tooltip-position
   */
  tooltipPosition: 'bottom' | 'end' | 'start' | 'top';

  /**
   * String used as a content for the tooltip
   * shown on the element when it gets focus
   * or is hovered using the pointer device.
   * @attr {string} tooltip-text
   */
  tooltipText: string | undefined;
}
