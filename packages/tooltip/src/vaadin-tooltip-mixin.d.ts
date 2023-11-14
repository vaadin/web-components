/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { OverlayClassMixinClass } from '@vaadin/component-base/src/overlay-class-mixin.js';

export type TooltipPosition =
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'end-bottom'
  | 'end-top'
  | 'end'
  | 'start-bottom'
  | 'start-top'
  | 'start'
  | 'top-end'
  | 'top-start'
  | 'top';

/**
 * A mixin providing common tooltip functionality.
 */
export declare function TooltipMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<OverlayClassMixinClass> & Constructor<TooltipMixinClass> & T;

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
   * The id of the element used as a tooltip trigger.
   * The element should be in the DOM by the time when
   * the attribute is set, otherwise a warning is shown.
   */
  for: string | undefined;

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
   * Position of the tooltip with respect to its target.
   * Supported values: `top-start`, `top`, `top-end`,
   * `bottom-start`, `bottom`, `bottom-end`, `start-top`,
   * `start`, `start-bottom`, `end-top`, `end`, `end-bottom`.
   */
  position: TooltipPosition;

  /**
   * Function used to detect whether to show the tooltip based on a condition,
   * called every time the tooltip is about to be shown on hover and focus.
   * The function takes two parameters: `target` and `context`, which contain
   * values of the corresponding tooltip properties at the time of calling.
   * The tooltip is only shown when the function invocation returns `true`.
   */
  shouldShow: (target: HTMLElement, context?: Record<string, unknown>) => boolean;

  /**
   * Reference to the element used as a tooltip trigger.
   * The target must be placed in the same shadow scope.
   * Defaults to an element referenced with `for`.
   */
  target: HTMLElement | undefined;

  /**
   * String used as a tooltip content.
   */
  text: string | null | undefined;
}
