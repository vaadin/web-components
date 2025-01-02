/**
 * @license
 * Copyright (c) 2022 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { OverlayClassMixinClass } from '@vaadin/component-base/src/overlay-class-mixin.js';
import type { PopoverPositionMixinClass } from '@vaadin/popover/src/vaadin-popover-position-mixin.js';
import type { PopoverTargetMixinClass } from '@vaadin/popover/src/vaadin-popover-target-mixin.js';

export type { PopoverPosition as TooltipPosition } from '@vaadin/popover/src/vaadin-popover-position-mixin.js';

/**
 * A mixin providing common tooltip functionality.
 */
export declare function TooltipMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<OverlayClassMixinClass> &
  Constructor<PopoverPositionMixinClass> &
  Constructor<PopoverTargetMixinClass> &
  Constructor<TooltipMixinClass> &
  T;

export declare class TooltipMixinClass {
  /**
   * Element used to link with the `aria-describedby`
   * attribute. Supports array of multiple elements.
   * When not set, defaults to `target`.
   */
  ariaTarget: HTMLElement | HTMLElement[] | undefined;

  /**
   * Object with properties passed to `generator` and
   * `shouldShow` functions for generating tooltip text
   * or detecting whether to show the tooltip or not.
   */
  context: Record<string, unknown>;

  /**
   * The delay in milliseconds before the tooltip
   * is opened on keyboard focus, when not in manual mode.
   * @attr {number} focus-delay
   */
  focusDelay: number;

  /**
   * Function used to generate the tooltip content.
   * When provided, it overrides the `text` property.
   * Use the `context` property to provide argument
   * that can be passed to the generator function.
   */
  generator: (context: Record<string, unknown>) => string;

  /**
   * The delay in milliseconds before the tooltip
   * is closed on losing hover, when not in manual mode.
   * On blur, the tooltip is closed immediately.
   * @attr {number} hide-delay
   */
  hideDelay: number;

  /**
   * The delay in milliseconds before the tooltip
   * is opened on hover, when not in manual mode.
   * @attr {number} hover-delay
   */
  hoverDelay: number;

  /**
   * When true, the tooltip is controlled programmatically
   * instead of reacting to focus and mouse events.
   */
  manual: boolean;

  /**
   * When true, the tooltip is opened programmatically.
   * Only works if `manual` is set to `true`.
   */
  opened: boolean;

  /**
   * Function used to detect whether to show the tooltip based on a condition,
   * called every time the tooltip is about to be shown on hover and focus.
   * The function takes two parameters: `target` and `context`, which contain
   * values of the corresponding tooltip properties at the time of calling.
   * The tooltip is only shown when the function invocation returns `true`.
   */
  shouldShow: (target: HTMLElement, context?: Record<string, unknown>) => boolean;

  /**
   * String used as a tooltip content.
   */
  text: string | null | undefined;
}
